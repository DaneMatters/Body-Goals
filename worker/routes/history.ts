import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import type { HonoEnv } from "../types";
import { getDb } from "../db/client";
import { exercise, historicalSetEvent, workoutExerciseEvent, workoutSetEvent, workoutEvent } from "../db/schema";

const app = new Hono<HonoEnv>();

/**
 * Recent comparable performance for an exercise name, merging imported FitNotes
 * history with sets logged in the app itself. Raw sets, not just an estimated 1RM.
 */
app.get("/exercise", async (c) => {
  const name = c.req.query("name");
  const limit = Math.min(Number(c.req.query("limit") ?? 20), 100);
  if (!name?.trim()) return c.json({ error: "name query param is required" }, 400);

  const db = getDb(c.env.DB);

  const imported = await db
    .select({
      source: historicalSetEvent.source,
      localDate: historicalSetEvent.localDate,
      exerciseName: historicalSetEvent.exerciseName,
      equipmentVariation: historicalSetEvent.category,
      weight: historicalSetEvent.weight,
      weightUnit: historicalSetEvent.weightUnit,
      reps: historicalSetEvent.reps,
      comment: historicalSetEvent.comment,
    })
    .from(historicalSetEvent)
    .where(eq(historicalSetEvent.exerciseName, name.trim()))
    .orderBy(desc(historicalSetEvent.localDate))
    .limit(limit);

  const logged = await db
    .select({
      localDate: workoutEvent.localDate,
      exerciseName: exercise.name,
      equipmentVariation: workoutExerciseEvent.equipmentVariation,
      weight: workoutSetEvent.actualLoad,
      weightUnit: workoutSetEvent.actualLoadUnit,
      reps: workoutSetEvent.actualReps,
      completed: workoutSetEvent.completed,
    })
    .from(workoutSetEvent)
    .innerJoin(workoutExerciseEvent, eq(workoutExerciseEvent.id, workoutSetEvent.workoutExerciseEventId))
    .innerJoin(workoutEvent, eq(workoutEvent.id, workoutExerciseEvent.workoutEventId))
    .innerJoin(exercise, eq(exercise.id, workoutExerciseEvent.exerciseId))
    .where(eq(exercise.name, name.trim()))
    .orderBy(desc(workoutEvent.localDate))
    .limit(limit);

  const loggedCompleted = logged
    .filter((r) => r.completed)
    .map(({ completed: _completed, ...rest }) => ({ source: "app", ...rest }));

  const merged = [...imported.map((r) => ({ ...r, source: r.source ?? "fitnotes_export" })), ...loggedCompleted]
    .sort((a, b) => (a.localDate < b.localDate ? 1 : -1))
    .slice(0, limit);

  return c.json({ exerciseName: name.trim(), sets: merged });
});

export default app;

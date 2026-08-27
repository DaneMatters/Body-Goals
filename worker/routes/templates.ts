import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import type { HonoEnv } from "../types";
import { getDb } from "../db/client";
import { exercise, workoutTemplate, workoutTemplateExercise, workoutTemplateSchedule } from "../db/schema";

const app = new Hono<HonoEnv>();

app.get("/", async (c) => {
  const db = getDb(c.env.DB);
  const templates = await db.query.workoutTemplate.findMany({
    where: eq(workoutTemplate.active, true),
  });
  return c.json(templates);
});

app.get("/:id", async (c) => {
  const db = getDb(c.env.DB);
  const id = c.req.param("id");

  const template = await db.query.workoutTemplate.findFirst({ where: eq(workoutTemplate.id, id) });
  if (!template) return c.json({ error: "not found" }, 404);

  const exercises = await db
    .select({
      id: workoutTemplateExercise.id,
      orderIndex: workoutTemplateExercise.orderIndex,
      exerciseId: workoutTemplateExercise.exerciseId,
      exerciseName: exercise.name,
      equipmentVariation: workoutTemplateExercise.equipmentVariation,
      targetSets: workoutTemplateExercise.targetSets,
      targetRepsMin: workoutTemplateExercise.targetRepsMin,
      targetRepsMax: workoutTemplateExercise.targetRepsMax,
      targetLoad: workoutTemplateExercise.targetLoad,
      targetLoadUnit: workoutTemplateExercise.targetLoadUnit,
    })
    .from(workoutTemplateExercise)
    .innerJoin(exercise, eq(exercise.id, workoutTemplateExercise.exerciseId))
    .where(eq(workoutTemplateExercise.templateId, id))
    .orderBy(asc(workoutTemplateExercise.orderIndex));

  const schedule = await db
    .select()
    .from(workoutTemplateSchedule)
    .where(eq(workoutTemplateSchedule.templateId, id));

  return c.json({ template, exercises, schedule });
});

export default app;

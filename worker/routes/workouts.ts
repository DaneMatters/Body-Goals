import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import type { HonoEnv } from "../types";
import { getDb } from "../db/client";
import {
  workoutEvent,
  workoutExerciseEvent,
  workoutSetEvent,
  workoutTemplate,
  workoutTemplateExercise,
  workoutTemplateSchedule,
} from "../db/schema";
import { dayOfWeekFromDateString, isValidDateString } from "../lib/date";
import { loadWorkoutEvent } from "../lib/serialize";
import { findOrCreateExercise } from "../lib/exercises";

const app = new Hono<HonoEnv>();

/**
 * Resolve (or create) the workout for a given local date.
 * If a WorkoutEvent already exists for the date, it's returned as-is.
 * Otherwise, the active template scheduled for that date/weekday is snapshotted
 * into a brand new WorkoutEvent + exercises + sets so the day is pre-populated.
 * If no template is scheduled, an empty (template-less) event is created so the
 * user can still log an ad hoc session.
 */
app.post("/open", async (c) => {
  const body = await c.req.json<{ date?: string }>().catch(() => ({}) as { date?: string });
  const date = body.date;
  if (!date || !isValidDateString(date)) {
    return c.json({ error: "date must be a YYYY-MM-DD string" }, 400);
  }

  const db = getDb(c.env.DB);

  const existing = await db.query.workoutEvent.findFirst({
    where: eq(workoutEvent.localDate, date),
    orderBy: desc(workoutEvent.createdAt),
  });
  if (existing) {
    const loaded = await loadWorkoutEvent(db, existing.id);
    return c.json(loaded);
  }

  const dayOfWeek = dayOfWeekFromDateString(date);

  const bySpecificDate = await db.query.workoutTemplateSchedule.findFirst({
    where: and(eq(workoutTemplateSchedule.specificDate, date), eq(workoutTemplateSchedule.active, true)),
  });
  const schedule =
    bySpecificDate ??
    (await db.query.workoutTemplateSchedule.findFirst({
      where: and(eq(workoutTemplateSchedule.dayOfWeek, dayOfWeek), eq(workoutTemplateSchedule.active, true)),
    }));

  let templateId: string | null = null;
  let templateExercises: (typeof workoutTemplateExercise.$inferSelect)[] = [];
  let templateSnapshot: unknown = null;

  if (schedule) {
    const template = await db.query.workoutTemplate.findFirst({
      where: and(eq(workoutTemplate.id, schedule.templateId), eq(workoutTemplate.active, true)),
    });
    if (template) {
      templateId = template.id;
      templateExercises = await db
        .select()
        .from(workoutTemplateExercise)
        .where(eq(workoutTemplateExercise.templateId, template.id))
        .orderBy(workoutTemplateExercise.orderIndex);
      templateSnapshot = { template, exercises: templateExercises };
    }
  }

  const [createdEvent] = await db
    .insert(workoutEvent)
    .values({
      templateId,
      templateSnapshot,
      localDate: date,
      status: "in_progress",
    })
    .returning();

  for (const te of templateExercises) {
    const [exEvent] = await db
      .insert(workoutExerciseEvent)
      .values({
        workoutEventId: createdEvent.id,
        sourceTemplateExerciseId: te.id,
        exerciseId: te.exerciseId,
        orderIndex: te.orderIndex,
        equipmentVariation: te.equipmentVariation,
        status: "planned",
        targetSets: te.targetSets,
        targetRepsMin: te.targetRepsMin,
        targetRepsMax: te.targetRepsMax,
        targetLoad: te.targetLoad,
        targetLoadUnit: te.targetLoadUnit,
      })
      .returning();

    const setCount = te.targetSets ?? 1;
    const prefillReps = te.targetRepsMax ?? te.targetRepsMin ?? null;
    for (let setNumber = 1; setNumber <= setCount; setNumber++) {
      await db.insert(workoutSetEvent).values({
        workoutExerciseEventId: exEvent.id,
        setNumber,
        targetReps: prefillReps,
        targetLoad: te.targetLoad,
        targetLoadUnit: te.targetLoadUnit,
        actualReps: prefillReps,
        actualLoad: te.targetLoad,
        actualLoadUnit: te.targetLoadUnit,
        completed: false,
      });
    }
  }

  const loaded = await loadWorkoutEvent(db, createdEvent.id);
  return c.json(loaded, 201);
});

app.get("/:id", async (c) => {
  const db = getDb(c.env.DB);
  const loaded = await loadWorkoutEvent(db, c.req.param("id"));
  if (!loaded) return c.json({ error: "not found" }, 404);
  return c.json(loaded);
});

app.patch("/:id", async (c) => {
  const db = getDb(c.env.DB);
  const id = c.req.param("id");
  const body = await c.req.json<{
    status?: "in_progress" | "completed";
    startTimestamp?: number;
    endTimestamp?: number;
    notes?: string;
  }>();

  const existing = await db.query.workoutEvent.findFirst({ where: eq(workoutEvent.id, id) });
  if (!existing) return c.json({ error: "not found" }, 404);

  const [updated] = await db
    .update(workoutEvent)
    .set({
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.startTimestamp !== undefined ? { startTimestamp: new Date(body.startTimestamp) } : {}),
      ...(body.endTimestamp !== undefined ? { endTimestamp: new Date(body.endTimestamp) } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(workoutEvent.id, id))
    .returning();

  return c.json(updated);
});

/** Add an exercise to a workout event: unplanned addition, or a substitution for a planned one. */
app.post("/:id/exercises", async (c) => {
  const db = getDb(c.env.DB);
  const workoutEventId = c.req.param("id");
  const body = await c.req.json<{
    exerciseName: string;
    category?: string;
    equipmentVariation?: string;
    status?: "unplanned" | "substituted";
    substitutedForExerciseId?: string;
    targetSets?: number;
    targetRepsMin?: number;
    targetRepsMax?: number;
    targetLoad?: number;
    targetLoadUnit?: string;
    initialSetCount?: number;
  }>();

  const event = await db.query.workoutEvent.findFirst({ where: eq(workoutEvent.id, workoutEventId) });
  if (!event) return c.json({ error: "workout not found" }, 404);
  if (!body.exerciseName?.trim()) return c.json({ error: "exerciseName is required" }, 400);

  const exerciseId = await findOrCreateExercise(db, body.exerciseName, body.category);

  const siblings = await db
    .select({ orderIndex: workoutExerciseEvent.orderIndex })
    .from(workoutExerciseEvent)
    .where(eq(workoutExerciseEvent.workoutEventId, workoutEventId));
  const nextOrder = siblings.reduce((max, s) => Math.max(max, s.orderIndex), -1) + 1;

  const [exEvent] = await db
    .insert(workoutExerciseEvent)
    .values({
      workoutEventId,
      exerciseId,
      orderIndex: nextOrder,
      equipmentVariation: body.equipmentVariation ?? null,
      status: body.status ?? "unplanned",
      substitutedForExerciseId: body.substitutedForExerciseId ?? null,
      targetSets: body.targetSets ?? null,
      targetRepsMin: body.targetRepsMin ?? null,
      targetRepsMax: body.targetRepsMax ?? null,
      targetLoad: body.targetLoad ?? null,
      targetLoadUnit: body.targetLoadUnit ?? "lbs",
    })
    .returning();

  const initialSetCount = body.initialSetCount ?? body.targetSets ?? 1;
  const prefillReps = body.targetRepsMax ?? body.targetRepsMin ?? null;
  for (let setNumber = 1; setNumber <= initialSetCount; setNumber++) {
    await db.insert(workoutSetEvent).values({
      workoutExerciseEventId: exEvent.id,
      setNumber,
      targetReps: prefillReps,
      targetLoad: body.targetLoad ?? null,
      targetLoadUnit: body.targetLoadUnit ?? "lbs",
      actualReps: prefillReps,
      actualLoad: body.targetLoad ?? null,
      actualLoadUnit: body.targetLoadUnit ?? "lbs",
      completed: false,
    });
  }

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded, 201);
});

/** Update a planned/unplanned exercise's status (skip/substitute/etc), equipment, or notes. */
app.patch("/:id/exercises/:exerciseEventId", async (c) => {
  const db = getDb(c.env.DB);
  const { id: workoutEventId, exerciseEventId } = c.req.param();
  const body = await c.req.json<{
    status?: "planned" | "completed" | "skipped" | "substituted" | "unplanned";
    equipmentVariation?: string | null;
    substitutedForExerciseId?: string | null;
    /** Replace the exercise performed in this slot (e.g. dumbbell press instead of barbell bench). */
    newExerciseName?: string;
    newCategory?: string;
    notes?: string | null;
  }>();

  const existing = await db.query.workoutExerciseEvent.findFirst({
    where: and(eq(workoutExerciseEvent.id, exerciseEventId), eq(workoutExerciseEvent.workoutEventId, workoutEventId)),
  });
  if (!existing) return c.json({ error: "not found" }, 404);

  let newExerciseId: string | undefined;
  let substitutedForExerciseId = body.substitutedForExerciseId;
  if (body.newExerciseName?.trim()) {
    newExerciseId = await findOrCreateExercise(db, body.newExerciseName, body.newCategory);
    substitutedForExerciseId = substitutedForExerciseId ?? existing.exerciseId;
  }

  await db
    .update(workoutExerciseEvent)
    .set({
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(newExerciseId !== undefined ? { exerciseId: newExerciseId, status: "substituted" as const } : {}),
      ...(body.equipmentVariation !== undefined ? { equipmentVariation: body.equipmentVariation } : {}),
      ...(substitutedForExerciseId !== undefined ? { substitutedForExerciseId } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(workoutExerciseEvent.id, exerciseEventId));

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded);
});

/** Remove an exercise that was added by mistake. Only unplanned additions may be deleted outright. */
app.delete("/:id/exercises/:exerciseEventId", async (c) => {
  const db = getDb(c.env.DB);
  const { id: workoutEventId, exerciseEventId } = c.req.param();

  const existing = await db.query.workoutExerciseEvent.findFirst({
    where: and(eq(workoutExerciseEvent.id, exerciseEventId), eq(workoutExerciseEvent.workoutEventId, workoutEventId)),
  });
  if (!existing) return c.json({ error: "not found" }, 404);
  if (existing.status !== "unplanned") {
    return c.json({ error: "Only unplanned exercises can be deleted. Use status=skipped instead." }, 409);
  }

  await db.delete(workoutSetEvent).where(eq(workoutSetEvent.workoutExerciseEventId, exerciseEventId));
  await db.delete(workoutExerciseEvent).where(eq(workoutExerciseEvent.id, exerciseEventId));

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded);
});

/** Add a set to an exercise, optionally cloning the previous set's target/actual values. */
app.post("/:id/exercises/:exerciseEventId/sets", async (c) => {
  const db = getDb(c.env.DB);
  const { id: workoutEventId, exerciseEventId } = c.req.param();
  const body = await c.req.json<{ cloneFromLast?: boolean }>().catch(() => ({}) as { cloneFromLast?: boolean });
  const cloneFromLast = body.cloneFromLast ?? true;

  const exEvent = await db.query.workoutExerciseEvent.findFirst({
    where: and(eq(workoutExerciseEvent.id, exerciseEventId), eq(workoutExerciseEvent.workoutEventId, workoutEventId)),
  });
  if (!exEvent) return c.json({ error: "not found" }, 404);

  const existingSets = await db
    .select()
    .from(workoutSetEvent)
    .where(eq(workoutSetEvent.workoutExerciseEventId, exerciseEventId))
    .orderBy(desc(workoutSetEvent.setNumber));

  const nextSetNumber = (existingSets[0]?.setNumber ?? 0) + 1;
  const last = existingSets[0];

  await db.insert(workoutSetEvent).values({
    workoutExerciseEventId: exerciseEventId,
    setNumber: nextSetNumber,
    targetReps: cloneFromLast ? (last?.targetReps ?? null) : null,
    targetLoad: cloneFromLast ? (last?.targetLoad ?? null) : null,
    targetLoadUnit: cloneFromLast ? (last?.targetLoadUnit ?? "lbs") : "lbs",
    actualReps: cloneFromLast ? (last?.actualReps ?? null) : null,
    actualLoad: cloneFromLast ? (last?.actualLoad ?? null) : null,
    actualLoadUnit: cloneFromLast ? (last?.actualLoadUnit ?? "lbs") : "lbs",
    completed: false,
  });

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded, 201);
});

/** Update a single set in place. This never creates a new row — corrections replace the existing set. */
app.patch("/:id/exercises/:exerciseEventId/sets/:setId", async (c) => {
  const db = getDb(c.env.DB);
  const { id: workoutEventId, exerciseEventId, setId } = c.req.param();
  const body = await c.req.json<{
    actualReps?: number | null;
    actualLoad?: number | null;
    actualLoadUnit?: string;
    completed?: boolean;
    rir?: number | null;
    rpe?: number | null;
    notes?: string | null;
  }>();

  const existing = await db.query.workoutSetEvent.findFirst({
    where: and(eq(workoutSetEvent.id, setId), eq(workoutSetEvent.workoutExerciseEventId, exerciseEventId)),
  });
  if (!existing) return c.json({ error: "not found" }, 404);

  const completedAt =
    body.completed === true && !existing.completedAt
      ? new Date()
      : body.completed === false
        ? null
        : existing.completedAt;

  await db
    .update(workoutSetEvent)
    .set({
      ...(body.actualReps !== undefined ? { actualReps: body.actualReps } : {}),
      ...(body.actualLoad !== undefined ? { actualLoad: body.actualLoad } : {}),
      ...(body.actualLoadUnit !== undefined ? { actualLoadUnit: body.actualLoadUnit } : {}),
      ...(body.completed !== undefined ? { completed: body.completed, completedAt } : {}),
      ...(body.rir !== undefined ? { rir: body.rir } : {}),
      ...(body.rpe !== undefined ? { rpe: body.rpe } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(workoutSetEvent.id, setId));

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded);
});

/** Remove a set that was added in error. */
app.delete("/:id/exercises/:exerciseEventId/sets/:setId", async (c) => {
  const db = getDb(c.env.DB);
  const { id: workoutEventId, exerciseEventId, setId } = c.req.param();

  const existing = await db.query.workoutSetEvent.findFirst({
    where: and(eq(workoutSetEvent.id, setId), eq(workoutSetEvent.workoutExerciseEventId, exerciseEventId)),
  });
  if (!existing) return c.json({ error: "not found" }, 404);

  await db.delete(workoutSetEvent).where(eq(workoutSetEvent.id, setId));

  const loaded = await loadWorkoutEvent(db, workoutEventId);
  return c.json(loaded);
});

export default app;

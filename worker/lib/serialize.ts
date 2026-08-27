import { asc, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { exercise, workoutEvent, workoutExerciseEvent, workoutSetEvent } from "../db/schema";

export async function loadWorkoutEvent(db: Db, workoutEventId: string) {
  const event = await db.query.workoutEvent.findFirst({
    where: eq(workoutEvent.id, workoutEventId),
  });
  if (!event) return null;

  const exerciseEvents = await db
    .select({
      id: workoutExerciseEvent.id,
      workoutEventId: workoutExerciseEvent.workoutEventId,
      sourceTemplateExerciseId: workoutExerciseEvent.sourceTemplateExerciseId,
      exerciseId: workoutExerciseEvent.exerciseId,
      exerciseName: exercise.name,
      category: exercise.category,
      orderIndex: workoutExerciseEvent.orderIndex,
      equipmentVariation: workoutExerciseEvent.equipmentVariation,
      status: workoutExerciseEvent.status,
      substitutedForExerciseId: workoutExerciseEvent.substitutedForExerciseId,
      targetSets: workoutExerciseEvent.targetSets,
      targetRepsMin: workoutExerciseEvent.targetRepsMin,
      targetRepsMax: workoutExerciseEvent.targetRepsMax,
      targetLoad: workoutExerciseEvent.targetLoad,
      targetLoadUnit: workoutExerciseEvent.targetLoadUnit,
      notes: workoutExerciseEvent.notes,
    })
    .from(workoutExerciseEvent)
    .innerJoin(exercise, eq(exercise.id, workoutExerciseEvent.exerciseId))
    .where(eq(workoutExerciseEvent.workoutEventId, workoutEventId))
    .orderBy(asc(workoutExerciseEvent.orderIndex));

  const exercises = await Promise.all(
    exerciseEvents.map(async (ex) => {
      const sets = await db
        .select()
        .from(workoutSetEvent)
        .where(eq(workoutSetEvent.workoutExerciseEventId, ex.id))
        .orderBy(asc(workoutSetEvent.setNumber));
      return { ...ex, sets };
    }),
  );

  return { event, exercises };
}

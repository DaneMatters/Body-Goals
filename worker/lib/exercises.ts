import { eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { exercise } from "../db/schema";

/** Look up an exercise by exact name, creating it if it doesn't exist yet. */
export async function findOrCreateExercise(
  db: Db,
  name: string,
  category?: string | null,
): Promise<string> {
  const trimmed = name.trim();
  const existing = await db.query.exercise.findFirst({
    where: eq(exercise.name, trimmed),
  });
  if (existing) return existing.id;

  const [created] = await db
    .insert(exercise)
    .values({ name: trimmed, category: category ?? null })
    .onConflictDoNothing()
    .returning();

  if (created) return created.id;

  // Lost a race with a concurrent insert of the same name; re-read it.
  const raceWinner = await db.query.exercise.findFirst({
    where: eq(exercise.name, trimmed),
  });
  if (!raceWinner) throw new Error(`Failed to resolve exercise "${trimmed}"`);
  return raceWinner.id;
}

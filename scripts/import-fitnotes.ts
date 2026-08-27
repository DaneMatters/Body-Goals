/**
 * Generates a SQL file that idempotently imports the FitNotes workout export and
 * BodyTracker export into historical_set_event / bodyweight_event / exercise.
 * Idempotent via a per-row hash (row content + row index) enforced by a unique index,
 * so re-running this script and re-applying the output is always safe.
 *
 * Usage:
 *   npx tsx scripts/import-fitnotes.ts
 *   npx wrangler d1 execute body_goals_db --local  --file=./data/generated/import.sql
 *   npx wrangler d1 execute body_goals_db --remote --file=./data/generated/import.sql
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKOUT_CSV = path.join(ROOT, "data/raw/FitNotes_Export_2026_08_20_14_44_58.csv");
const BODYTRACKER_CSV = path.join(ROOT, "data/raw/FitNotes_BodyTracker_Export_2026_08_20_14_45_06.csv");
const OUT_FILE = path.join(ROOT, "data/generated/import.sql");

function rowHash(source: string, index: number, raw: Record<string, string>): string {
  return createHash("sha256").update(`${source}:${index}:${JSON.stringify(raw)}`).digest("hex");
}

function sqlStr(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === "") return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function parseTimeToSeconds(time: string): number | null {
  if (!time) return null;
  const parts = time.split(":").map(Number);
  if (parts.some((p) => Number.isNaN(p))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(time) || null;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function main() {
  const nowMs = Date.now();
  const statements: string[] = [];

  // --- FitNotes workout export -> historical_set_event (+ exercise catalog) ---
  const workoutRows: Record<string, string>[] = parse(readFileSync(WORKOUT_CSV, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  });

  const exerciseNames = new Map<string, string>(); // name -> category
  for (const row of workoutRows) {
    if (row.Exercise && !exerciseNames.has(row.Exercise)) {
      exerciseNames.set(row.Exercise, row.Category ?? "");
    }
  }

  for (const group of chunk([...exerciseNames.entries()], 200)) {
    const values = group
      .map(
        ([name, category]) =>
          `(${sqlStr(crypto.randomUUID())}, ${sqlStr(name)}, ${sqlStr(category || null)}, ${nowMs})`,
      )
      .join(",\n  ");
    statements.push(`INSERT OR IGNORE INTO exercise (id, name, category, created_at) VALUES\n  ${values};`);
  }

  const setRows = workoutRows.map((row, index) => {
    const hash = rowHash("fitnotes_export", index, row);
    const weight = row.Weight ? Number(row.Weight) : null;
    const reps = row.Reps ? Number(row.Reps) : null;
    const distance = row.Distance ? Number(row.Distance) : null;
    const timeSeconds = parseTimeToSeconds(row.Time);
    return `(${sqlStr(crypto.randomUUID())}, 'fitnotes_export', ${sqlStr(hash)}, ${sqlStr(row.Date)}, ${sqlStr(row.Exercise)}, ${sqlStr(row.Category || null)}, ${weight ?? "NULL"}, ${sqlStr(row["Weight Unit"] || null)}, ${reps ?? "NULL"}, ${distance ?? "NULL"}, ${sqlStr(row["Distance Unit"] || null)}, ${timeSeconds ?? "NULL"}, ${sqlStr(row.Comment || null)}, ${nowMs})`;
  });

  for (const group of chunk(setRows, 200)) {
    statements.push(
      `INSERT OR IGNORE INTO historical_set_event\n  (id, source, source_row_hash, local_date, exercise_name, category, weight, weight_unit, reps, distance, distance_unit, time_seconds, comment, created_at)\nVALUES\n  ${group.join(",\n  ")};`,
    );
  }

  // --- BodyTracker export -> bodyweight_event ---
  const bodyRows: Record<string, string>[] = parse(readFileSync(BODYTRACKER_CSV, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  });

  const bodyValues = bodyRows.map((row, index) => {
    const hash = rowHash("fitnotes_bodytracker", index, row);
    const value = Number(row.Value);
    return `(${sqlStr(crypto.randomUUID())}, 'fitnotes_bodytracker', ${sqlStr(hash)}, ${sqlStr(row.Date)}, ${sqlStr(row.Time || null)}, ${sqlStr(row.Measurement)}, ${value}, ${sqlStr(row.Unit)}, ${sqlStr(row.Comment || null)}, ${nowMs})`;
  });

  if (bodyValues.length) {
    statements.push(
      `INSERT OR IGNORE INTO bodyweight_event\n  (id, source, source_row_hash, local_date, local_time, measurement, value, unit, comment, created_at)\nVALUES\n  ${bodyValues.join(",\n  ")};`,
    );
  }

  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, statements.join("\n\n") + "\n");

  console.log(`Wrote ${OUT_FILE}`);
  console.log(`  ${exerciseNames.size} distinct exercises`);
  console.log(`  ${setRows.length} historical set rows`);
  console.log(`  ${bodyValues.length} bodyweight/measurement rows`);
}

main();

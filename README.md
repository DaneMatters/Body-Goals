# Body Goals

Phone-first workout logger, plus the foundation for a broader personal
training/nutrition/recovery database.

## Stack

- **Frontend**: React + TypeScript, built with Vite.
- **API**: [Hono](https://hono.dev), running as a Cloudflare Worker.
- **Database**: Cloudflare D1 (SQLite), schema managed with
  [Drizzle ORM](https://orm.drizzle.team).
- **Hosting**: Cloudflare Workers (static assets + API in one Worker), via
  [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/).

## How workout logging works

- A `workout_template` can be scheduled to a weekday or a specific date
  (`workout_template_schedule`).
- Opening a day (`POST /api/workouts/open`) resolves the template for that
  date and materializes it into a `workout_event` with its exercises and sets
  pre-filled from the template's targets — so the day's workout is already
  listed, no manual entry required. If a `workout_event` already exists for
  that date, it's returned as-is (idempotent — reopening a day never creates
  a duplicate).
- Every set is its own row (`workout_set_event`) with target vs. actual
  reps/load and a completion flag. Editing a set (`PATCH .../sets/:id`)
  updates that row in place — it never creates a duplicate.
- An exercise can be skipped, substituted for a different exercise, or added
  ad hoc (unplanned) without losing the original plan — see
  `workout_exercise_event.status`.
- Historical FitNotes data lives in `historical_set_event` /
  `bodyweight_event`, imported read-only (see below). `GET
  /api/history/exercise?name=...` merges that history with sets logged in
  the app for a given exercise name.

Full schema: `worker/db/schema.ts`. Original requirements this was built
against: `02_REQUIREMENTS/` in the handoff package (not committed here).

## Local development

```bash
npm install
npm run db:migrate:local   # apply schema to local D1
npm run db:seed:local      # seed the example Saturday template
npm run dev                # vite + worker dev server
```

Then open the printed local URL. `wrangler dev` (without the Vite plugin)
also works and is sometimes more reliable in constrained/sandboxed
environments:

```bash
npm run build
npx wrangler dev --local
```

## Historical data import

The import script reads FitNotes/BodyTracker export CSVs from `data/raw/`.
That directory is gitignored — it holds personal health data (bodyweight,
measurements) and isn't checked into version control. To re-run the import
(e.g. against a fresh clone, or once a remote D1 database exists), place the
FitNotes exports back at:

- `data/raw/FitNotes_Export_<timestamp>.csv` (workout/strength history)
- `data/raw/FitNotes_BodyTracker_Export_<timestamp>.csv` (bodyweight/measurements)

then update the filenames at the top of `scripts/import-fitnotes.ts` if they
differ, and run:

```bash
npm run import:fitnotes         # writes data/generated/import.sql
npm run db:seed:local -- # or:
npx wrangler d1 execute body_goals_db --local  --file=./data/generated/import.sql
npx wrangler d1 execute body_goals_db --remote --file=./data/generated/import.sql
```

The import is idempotent: each row's SQL uses `INSERT OR IGNORE` keyed on a
hash of (source, row index, row content), so re-running it never creates
duplicates.

The `odainriche - Export Data ...xlsx` file (additional body-tracking data)
does not yet have a dedicated importer — FitNotes is the authoritative
historical strength source per the product rules. If it's needed later, add
it to `data/raw/` and write an importer for it following the same
idempotent-hash pattern as `scripts/import-fitnotes.ts`.

## Deploying

This project has **not been deployed yet** — `wrangler.jsonc`'s
`database_id` is a placeholder. To deploy:

1. `npx wrangler d1 create body_goals_db` and put the returned ID into
   `wrangler.jsonc`.
2. `npm run db:migrate:remote`
3. `npm run db:seed:remote` (optional, adds the example template)
4. `npx wrangler d1 execute body_goals_db --remote --file=./data/generated/import.sql` (optional, imports history)
5. `npm run deploy`

## What's intentionally not built yet

- Post-workout review workflow (explicitly out of scope for this pass).
- Nutrition/water/recovery logging (schema designed for, not built —
  see `worker/db/schema.ts` future-tables note).
- Template management UI (templates are currently seeded via SQL —
  `drizzle/seed.sql`).

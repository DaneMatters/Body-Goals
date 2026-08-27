-- Seed: Saturday heavy-upper template, reconstructed from the known 2026-08-22 session
-- (04_REFERENCE/TRAINING_REFERENCE.md). Fixed IDs so re-running this file is a no-op.

INSERT OR IGNORE INTO exercise (id, name, category, created_at) VALUES
  ('seed-ex-incline-bench', 'Incline Bench Press', 'Chest', unixepoch('now') * 1000),
  ('seed-ex-barbell-row', 'Barbell Row', 'Back', unixepoch('now') * 1000),
  ('seed-ex-lat-pulldown', 'Lat Pulldown', 'Back', unixepoch('now') * 1000),
  ('seed-ex-seated-ohp', 'Seated Overhead Press', 'Shoulders', unixepoch('now') * 1000),
  ('seed-ex-decline-bench', 'Decline Bench Press', 'Chest', unixepoch('now') * 1000),
  ('seed-ex-db-lateral-raise', 'Dumbbell Lateral Raise', 'Shoulders', unixepoch('now') * 1000),
  ('seed-ex-fatgrip-curl', 'Fat-Grip Barbell Curl', 'Arms', unixepoch('now') * 1000),
  ('seed-ex-machine-row', 'Machine Row', 'Back', unixepoch('now') * 1000);

INSERT OR IGNORE INTO workout_template (id, name, description, active, created_at, updated_at) VALUES
  ('seed-tmpl-sat-heavy-upper', 'Saturday Heavy Upper', 'Upper/lower chest emphasis, avoids flat pressing.', 1, unixepoch('now') * 1000, unixepoch('now') * 1000);

INSERT OR IGNORE INTO workout_template_schedule (id, template_id, day_of_week, active, created_at) VALUES
  ('seed-sched-saturday', 'seed-tmpl-sat-heavy-upper', 6, 1, unixepoch('now') * 1000);

INSERT OR IGNORE INTO workout_template_exercise
  (id, template_id, order_index, exercise_id, target_sets, target_reps_min, target_reps_max, target_load, target_load_unit, created_at, updated_at)
VALUES
  ('seed-tmplex-1', 'seed-tmpl-sat-heavy-upper', 0, 'seed-ex-incline-bench',     4, 8,  8,  135, 'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-2', 'seed-tmpl-sat-heavy-upper', 1, 'seed-ex-barbell-row',       5, 5,  5,  135, 'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-3', 'seed-tmpl-sat-heavy-upper', 2, 'seed-ex-lat-pulldown',      4, 8,  8,  95,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-4', 'seed-tmpl-sat-heavy-upper', 3, 'seed-ex-seated-ohp',        4, 8,  8,  95,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-5', 'seed-tmpl-sat-heavy-upper', 4, 'seed-ex-decline-bench',     5, 5,  5,  95,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-6', 'seed-tmpl-sat-heavy-upper', 5, 'seed-ex-db-lateral-raise',  3, 12, 12, 15,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-7', 'seed-tmpl-sat-heavy-upper', 6, 'seed-ex-fatgrip-curl',      4, 12, 12, 50,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000),
  ('seed-tmplex-8', 'seed-tmpl-sat-heavy-upper', 7, 'seed-ex-machine-row',       3, 12, 12, 95,  'lbs', unixepoch('now') * 1000, unixepoch('now') * 1000);

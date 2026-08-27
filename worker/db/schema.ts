import { sqliteTable, text, integer, real, uniqueIndex, index } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

/** Normalized exercise catalog. Also used to join imported FitNotes rows by name. */
export const exercise = sqliteTable(
  "exercise",
  {
    id: id(),
    name: text("name").notNull(),
    category: text("category"),
    defaultEquipment: text("default_equipment"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("exercise_name_unique").on(t.name)],
);

/** A saved workout plan. The template itself is never mutated by history. */
export const workoutTemplate = sqliteTable("workout_template", {
  id: id(),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/**
 * When a template applies. dayOfWeek (0=Sun..6=Sat) for recurring assignment,
 * or specificDate for a one-off. Training time is intentionally not stored here
 * (per product rules, workout time is event-driven, not fixed to a template).
 */
export const workoutTemplateSchedule = sqliteTable(
  "workout_template_schedule",
  {
    id: id(),
    templateId: text("template_id")
      .notNull()
      .references(() => workoutTemplate.id),
    dayOfWeek: integer("day_of_week"),
    specificDate: text("specific_date"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [index("wts_template_idx").on(t.templateId)],
);

export const workoutTemplateExercise = sqliteTable(
  "workout_template_exercise",
  {
    id: id(),
    templateId: text("template_id")
      .notNull()
      .references(() => workoutTemplate.id),
    orderIndex: integer("order_index").notNull(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercise.id),
    equipmentVariation: text("equipment_variation"),
    targetSets: integer("target_sets"),
    targetRepsMin: integer("target_reps_min"),
    targetRepsMax: integer("target_reps_max"),
    targetLoad: real("target_load"),
    targetLoadUnit: text("target_load_unit").default("lbs"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("wte_template_idx").on(t.templateId)],
);

/** One actual training session. This is the record of what really happened. */
export const workoutEvent = sqliteTable(
  "workout_event",
  {
    id: id(),
    templateId: text("template_id").references(() => workoutTemplate.id),
    templateSnapshot: text("template_snapshot", { mode: "json" }),
    localDate: text("local_date").notNull(),
    startTimestamp: integer("start_timestamp", { mode: "timestamp_ms" }),
    endTimestamp: integer("end_timestamp", { mode: "timestamp_ms" }),
    timezoneOffsetMinutes: integer("timezone_offset_minutes"),
    status: text("status", { enum: ["in_progress", "completed"] })
      .notNull()
      .default("in_progress"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("we_local_date_idx").on(t.localDate)],
);

export const workoutExerciseEvent = sqliteTable(
  "workout_exercise_event",
  {
    id: id(),
    workoutEventId: text("workout_event_id")
      .notNull()
      .references(() => workoutEvent.id),
    sourceTemplateExerciseId: text("source_template_exercise_id"),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercise.id),
    orderIndex: integer("order_index").notNull(),
    equipmentVariation: text("equipment_variation"),
    status: text("status", {
      enum: ["planned", "completed", "skipped", "substituted", "unplanned"],
    })
      .notNull()
      .default("planned"),
    substitutedForExerciseId: text("substituted_for_exercise_id").references(() => exercise.id),
    targetSets: integer("target_sets"),
    targetRepsMin: integer("target_reps_min"),
    targetRepsMax: integer("target_reps_max"),
    targetLoad: real("target_load"),
    targetLoadUnit: text("target_load_unit").default("lbs"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("wee_workout_event_idx").on(t.workoutEventId)],
);

export const workoutSetEvent = sqliteTable(
  "workout_set_event",
  {
    id: id(),
    workoutExerciseEventId: text("workout_exercise_event_id")
      .notNull()
      .references(() => workoutExerciseEvent.id),
    setNumber: integer("set_number").notNull(),
    targetReps: integer("target_reps"),
    targetLoad: real("target_load"),
    targetLoadUnit: text("target_load_unit").default("lbs"),
    actualReps: integer("actual_reps"),
    actualLoad: real("actual_load"),
    actualLoadUnit: text("actual_load_unit").default("lbs"),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    rir: integer("rir"),
    rpe: real("rpe"),
    notes: text("notes"),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("wse_exercise_event_idx").on(t.workoutExerciseEventId)],
);

/** Read-only import of historical FitNotes strength data. Authoritative pre-app history. */
export const historicalSetEvent = sqliteTable(
  "historical_set_event",
  {
    id: id(),
    source: text("source").notNull(),
    sourceRowHash: text("source_row_hash").notNull(),
    localDate: text("local_date").notNull(),
    exerciseName: text("exercise_name").notNull(),
    exerciseId: text("exercise_id").references(() => exercise.id),
    category: text("category"),
    weight: real("weight"),
    weightUnit: text("weight_unit"),
    reps: integer("reps"),
    distance: real("distance"),
    distanceUnit: text("distance_unit"),
    timeSeconds: integer("time_seconds"),
    comment: text("comment"),
    importedAt: createdAt(),
  },
  (t) => [
    uniqueIndex("historical_set_source_row_unique").on(t.source, t.sourceRowHash),
    index("historical_set_exercise_idx").on(t.exerciseName),
    index("historical_set_date_idx").on(t.localDate),
  ],
);

/** Read-only import of historical BodyTracker data (bodyweight + measurements). */
export const bodyweightEvent = sqliteTable(
  "bodyweight_event",
  {
    id: id(),
    source: text("source").notNull(),
    sourceRowHash: text("source_row_hash"),
    localDate: text("local_date").notNull(),
    localTime: text("local_time"),
    timestamp: integer("timestamp", { mode: "timestamp_ms" }),
    measurement: text("measurement").notNull(),
    value: real("value").notNull(),
    unit: text("unit").notNull(),
    comment: text("comment"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("bodyweight_source_row_unique").on(t.source, t.sourceRowHash),
    index("bodyweight_measurement_idx").on(t.measurement),
    index("bodyweight_date_idx").on(t.localDate),
  ],
);

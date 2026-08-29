/**
 * Local-storage backend with the same interface as api.ts. Used by the
 * single-file build (LOCAL_BUILD=1) so the app runs with no server or
 * database — all data persists in the browser's localStorage.
 */
import type {
  ExerciseEvent,
  ExerciseStatus,
  HistorySet,
  SetEvent,
  WorkoutResponse,
  WorkoutStatus,
} from "./types";

const STORAGE_KEY = "bodygoals_v1";

interface Store {
  version: 1;
  workoutsByDate: Record<string, WorkoutResponse>;
}

interface TemplateExercise {
  name: string;
  category: string;
  sets: number;
  reps: number;
  load: number;
}

/** Saturday Heavy Upper — mirrors drizzle/seed.sql. */
const SATURDAY_TEMPLATE: TemplateExercise[] = [
  { name: "Incline Bench Press", category: "Chest", sets: 4, reps: 8, load: 135 },
  { name: "Barbell Row", category: "Back", sets: 5, reps: 5, load: 135 },
  { name: "Lat Pulldown", category: "Back", sets: 4, reps: 8, load: 95 },
  { name: "Seated Overhead Press", category: "Shoulders", sets: 4, reps: 8, load: 95 },
  { name: "Decline Bench Press", category: "Chest", sets: 5, reps: 5, load: 95 },
  { name: "Dumbbell Lateral Raise", category: "Shoulders", sets: 3, reps: 12, load: 15 },
  { name: "Fat-Grip Barbell Curl", category: "Arms", sets: 4, reps: 12, load: 50 },
  { name: "Machine Row", category: "Back", sets: 3, reps: 12, load: 95 },
];

const SATURDAY = 6;

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed && parsed.version === 1 && parsed.workoutsByDate) return parsed;
    }
  } catch {
    // corrupted or unavailable storage — start fresh
  }
  return { version: 1, workoutsByDate: {} };
}

function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full or blocked; the in-memory state still works for this visit
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function dayOfWeekFromDateString(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function makeSet(exerciseEventId: string, setNumber: number, reps: number | null, load: number | null): SetEvent {
  const ts = nowIso();
  return {
    id: uuid(),
    workoutExerciseEventId: exerciseEventId,
    setNumber,
    targetReps: reps,
    targetLoad: load,
    targetLoadUnit: "lbs",
    actualReps: reps,
    actualLoad: load,
    actualLoadUnit: "lbs",
    completed: false,
    rir: null,
    rpe: null,
    notes: null,
    completedAt: null,
    createdAt: ts,
    updatedAt: ts,
  };
}

function makeExerciseEvent(
  workoutEventId: string,
  orderIndex: number,
  name: string,
  category: string | null,
  status: ExerciseStatus,
  targetSets: number | null,
  targetReps: number | null,
  targetLoad: number | null,
): ExerciseEvent {
  const id = uuid();
  const setCount = targetSets ?? 1;
  const sets: SetEvent[] = [];
  for (let n = 1; n <= setCount; n++) sets.push(makeSet(id, n, targetReps, targetLoad));
  return {
    id,
    workoutEventId,
    sourceTemplateExerciseId: null,
    exerciseId: uuid(),
    exerciseName: name,
    category,
    orderIndex,
    equipmentVariation: null,
    status,
    substitutedForExerciseId: null,
    targetSets,
    targetRepsMin: targetReps,
    targetRepsMax: targetReps,
    targetLoad,
    targetLoadUnit: "lbs",
    notes: null,
    sets,
  };
}

function createWorkoutForDate(date: string): WorkoutResponse {
  const ts = nowIso();
  const eventId = uuid();
  const fromTemplate = dayOfWeekFromDateString(date) === SATURDAY;
  const exercises = fromTemplate
    ? SATURDAY_TEMPLATE.map((te, i) =>
        makeExerciseEvent(eventId, i, te.name, te.category, "planned", te.sets, te.reps, te.load),
      )
    : [];
  return {
    event: {
      id: eventId,
      templateId: fromTemplate ? "saturday-heavy-upper" : null,
      localDate: date,
      startTimestamp: null,
      endTimestamp: null,
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
      status: "in_progress",
      notes: null,
      createdAt: ts,
      updatedAt: ts,
    },
    exercises,
  };
}

function findWorkoutById(store: Store, workoutId: string): WorkoutResponse | null {
  for (const w of Object.values(store.workoutsByDate)) {
    if (w.event.id === workoutId) return w;
  }
  return null;
}

function requireWorkout(store: Store, workoutId: string): WorkoutResponse {
  const w = findWorkoutById(store, workoutId);
  if (!w) throw new Error("Workout not found");
  return w;
}

function requireExercise(workout: WorkoutResponse, exerciseEventId: string): ExerciseEvent {
  const ex = workout.exercises.find((e) => e.id === exerciseEventId);
  if (!ex) throw new Error("Exercise not found");
  return ex;
}

export async function openWorkout(date: string): Promise<WorkoutResponse> {
  const store = loadStore();
  if (!store.workoutsByDate[date]) {
    store.workoutsByDate[date] = createWorkoutForDate(date);
    saveStore(store);
  }
  return clone(store.workoutsByDate[date]);
}

export async function patchWorkout(
  workoutId: string,
  patch: Partial<{ status: WorkoutStatus; startTimestamp: number; endTimestamp: number; notes: string }>,
): Promise<WorkoutResponse["event"]> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  if (patch.status !== undefined) workout.event.status = patch.status;
  if (patch.startTimestamp !== undefined) workout.event.startTimestamp = new Date(patch.startTimestamp).toISOString();
  if (patch.endTimestamp !== undefined) workout.event.endTimestamp = new Date(patch.endTimestamp).toISOString();
  if (patch.notes !== undefined) workout.event.notes = patch.notes;
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout.event);
}

export async function addExercise(
  workoutId: string,
  payload: {
    exerciseName: string;
    category?: string;
    equipmentVariation?: string;
    targetSets?: number;
    targetRepsMin?: number;
    targetRepsMax?: number;
    targetLoad?: number;
  },
): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const nextOrder = workout.exercises.reduce((max, e) => Math.max(max, e.orderIndex), -1) + 1;
  const reps = payload.targetRepsMax ?? payload.targetRepsMin ?? null;
  const ex = makeExerciseEvent(
    workout.event.id,
    nextOrder,
    payload.exerciseName.trim(),
    payload.category ?? null,
    "unplanned",
    payload.targetSets ?? null,
    reps,
    payload.targetLoad ?? null,
  );
  if (payload.equipmentVariation) ex.equipmentVariation = payload.equipmentVariation;
  workout.exercises.push(ex);
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function patchExercise(
  workoutId: string,
  exerciseEventId: string,
  patch: Partial<{
    status: ExerciseStatus;
    equipmentVariation: string | null;
    newExerciseName: string;
    newCategory: string;
    notes: string | null;
  }>,
): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const ex = requireExercise(workout, exerciseEventId);
  if (patch.newExerciseName?.trim()) {
    ex.substitutedForExerciseId = ex.exerciseId;
    ex.exerciseId = uuid();
    ex.exerciseName = patch.newExerciseName.trim();
    if (patch.newCategory) ex.category = patch.newCategory;
    ex.status = "substituted";
  }
  if (patch.status !== undefined) ex.status = patch.status;
  if (patch.equipmentVariation !== undefined) ex.equipmentVariation = patch.equipmentVariation;
  if (patch.notes !== undefined) ex.notes = patch.notes;
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function removeExercise(workoutId: string, exerciseEventId: string): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const ex = requireExercise(workout, exerciseEventId);
  if (ex.status !== "unplanned") throw new Error("Only added exercises can be removed. Use Skip instead.");
  workout.exercises = workout.exercises.filter((e) => e.id !== exerciseEventId);
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function addSet(
  workoutId: string,
  exerciseEventId: string,
  cloneFromLast = true,
): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const ex = requireExercise(workout, exerciseEventId);
  const last = ex.sets[ex.sets.length - 1];
  const nextNumber = (last?.setNumber ?? 0) + 1;
  const set = makeSet(
    ex.id,
    nextNumber,
    cloneFromLast ? (last?.actualReps ?? null) : null,
    cloneFromLast ? (last?.actualLoad ?? null) : null,
  );
  if (cloneFromLast && last) {
    set.targetReps = last.targetReps;
    set.targetLoad = last.targetLoad;
  }
  ex.sets.push(set);
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function patchSet(
  workoutId: string,
  exerciseEventId: string,
  setId: string,
  patch: Partial<{
    actualReps: number | null;
    actualLoad: number | null;
    actualLoadUnit: string;
    completed: boolean;
    rir: number | null;
    rpe: number | null;
    notes: string | null;
  }>,
): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const ex = requireExercise(workout, exerciseEventId);
  const set = ex.sets.find((s) => s.id === setId);
  if (!set) throw new Error("Set not found");
  if (patch.actualReps !== undefined) set.actualReps = patch.actualReps;
  if (patch.actualLoad !== undefined) set.actualLoad = patch.actualLoad;
  if (patch.actualLoadUnit !== undefined) set.actualLoadUnit = patch.actualLoadUnit;
  if (patch.completed !== undefined) {
    set.completed = patch.completed;
    set.completedAt = patch.completed ? (set.completedAt ?? nowIso()) : null;
  }
  if (patch.rir !== undefined) set.rir = patch.rir;
  if (patch.rpe !== undefined) set.rpe = patch.rpe;
  if (patch.notes !== undefined) set.notes = patch.notes;
  set.updatedAt = nowIso();
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function removeSet(
  workoutId: string,
  exerciseEventId: string,
  setId: string,
): Promise<WorkoutResponse> {
  const store = loadStore();
  const workout = requireWorkout(store, workoutId);
  const ex = requireExercise(workout, exerciseEventId);
  ex.sets = ex.sets.filter((s) => s.id !== setId);
  workout.event.updatedAt = nowIso();
  saveStore(store);
  return clone(workout);
}

export async function getExerciseHistory(
  exerciseName: string,
  limit = 10,
): Promise<{ exerciseName: string; sets: HistorySet[] }> {
  const store = loadStore();
  const name = exerciseName.trim();
  const sets: HistorySet[] = [];
  for (const workout of Object.values(store.workoutsByDate)) {
    for (const ex of workout.exercises) {
      if (ex.exerciseName !== name) continue;
      for (const s of ex.sets) {
        if (!s.completed) continue;
        sets.push({
          source: "app",
          localDate: workout.event.localDate,
          exerciseName: ex.exerciseName,
          equipmentVariation: ex.equipmentVariation,
          weight: s.actualLoad,
          weightUnit: s.actualLoadUnit,
          reps: s.actualReps,
        });
      }
    }
  }
  sets.sort((a, b) => (a.localDate < b.localDate ? 1 : -1));
  return { exerciseName: name, sets: sets.slice(0, limit) };
}

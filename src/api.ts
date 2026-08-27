import type { ExerciseStatus, HistorySet, WorkoutResponse, WorkoutStatus } from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function openWorkout(date: string): Promise<WorkoutResponse> {
  return request("/api/workouts/open", { method: "POST", body: JSON.stringify({ date }) });
}

export function patchWorkout(
  workoutId: string,
  patch: Partial<{ status: WorkoutStatus; startTimestamp: number; endTimestamp: number; notes: string }>,
): Promise<WorkoutResponse["event"]> {
  return request(`/api/workouts/${workoutId}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export function addExercise(
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
  return request(`/api/workouts/${workoutId}/exercises`, { method: "POST", body: JSON.stringify(payload) });
}

export function patchExercise(
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
  return request(`/api/workouts/${workoutId}/exercises/${exerciseEventId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function removeExercise(workoutId: string, exerciseEventId: string): Promise<WorkoutResponse> {
  return request(`/api/workouts/${workoutId}/exercises/${exerciseEventId}`, { method: "DELETE" });
}

export function addSet(
  workoutId: string,
  exerciseEventId: string,
  cloneFromLast = true,
): Promise<WorkoutResponse> {
  return request(`/api/workouts/${workoutId}/exercises/${exerciseEventId}/sets`, {
    method: "POST",
    body: JSON.stringify({ cloneFromLast }),
  });
}

export function patchSet(
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
  return request(`/api/workouts/${workoutId}/exercises/${exerciseEventId}/sets/${setId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function removeSet(workoutId: string, exerciseEventId: string, setId: string): Promise<WorkoutResponse> {
  return request(`/api/workouts/${workoutId}/exercises/${exerciseEventId}/sets/${setId}`, { method: "DELETE" });
}

export function getExerciseHistory(exerciseName: string, limit = 10): Promise<{ exerciseName: string; sets: HistorySet[] }> {
  return request(`/api/history/exercise?name=${encodeURIComponent(exerciseName)}&limit=${limit}`);
}

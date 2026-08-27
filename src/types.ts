export type ExerciseStatus = "planned" | "completed" | "skipped" | "substituted" | "unplanned";
export type WorkoutStatus = "in_progress" | "completed";

export interface SetEvent {
  id: string;
  workoutExerciseEventId: string;
  setNumber: number;
  targetReps: number | null;
  targetLoad: number | null;
  targetLoadUnit: string | null;
  actualReps: number | null;
  actualLoad: number | null;
  actualLoadUnit: string | null;
  completed: boolean;
  rir: number | null;
  rpe: number | null;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseEvent {
  id: string;
  workoutEventId: string;
  sourceTemplateExerciseId: string | null;
  exerciseId: string;
  exerciseName: string;
  category: string | null;
  orderIndex: number;
  equipmentVariation: string | null;
  status: ExerciseStatus;
  substitutedForExerciseId: string | null;
  targetSets: number | null;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  targetLoad: number | null;
  targetLoadUnit: string | null;
  notes: string | null;
  sets: SetEvent[];
}

export interface WorkoutEvent {
  id: string;
  templateId: string | null;
  localDate: string;
  startTimestamp: string | null;
  endTimestamp: string | null;
  timezoneOffsetMinutes: number | null;
  status: WorkoutStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutResponse {
  event: WorkoutEvent;
  exercises: ExerciseEvent[];
}

export interface HistorySet {
  source: string;
  localDate: string;
  exerciseName: string;
  equipmentVariation: string | null;
  weight: number | null;
  weightUnit: string | null;
  reps: number | null;
  comment?: string | null;
}

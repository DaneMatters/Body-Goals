import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import type { WorkoutResponse } from "../types";
import { ExerciseCard } from "./ExerciseCard";
import { AddExercisePanel } from "./AddExercisePanel";
import { useDebouncedCallback } from "../hooks/useDebouncedEffect";

interface Props {
  date: string;
}

/** Immutably patch a single set within the workout tree, for instant local feedback. */
function patchSetLocal(
  workout: WorkoutResponse,
  exerciseEventId: string,
  setId: string,
  patch: Partial<WorkoutResponse["exercises"][number]["sets"][number]>,
): WorkoutResponse {
  return {
    ...workout,
    exercises: workout.exercises.map((ex) =>
      ex.id !== exerciseEventId
        ? ex
        : { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) },
    ),
  };
}

export function WorkoutScreen({ date }: Props) {
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounced = useDebouncedCallback((fn: () => void) => fn(), 450);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .openWorkout(date)
      .then((w) => {
        if (!cancelled) setWorkout(w);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const refresh = useCallback((w: WorkoutResponse) => setWorkout(w), []);
  const fail = useCallback((e: unknown) => setError(e instanceof Error ? e.message : String(e)), []);

  if (loading) return <div className="empty-state">Loading…</div>;
  if (error && !workout) return <div className="error-banner">{error}</div>;
  if (!workout) return null;

  const workoutId = workout.event.id;

  const changeSetReps = (exerciseEventId: string, setId: string, reps: number) => {
    setWorkout((w) => (w ? patchSetLocal(w, exerciseEventId, setId, { actualReps: reps }) : w));
    debounced(`${setId}:reps`, () =>
      api.patchSet(workoutId, exerciseEventId, setId, { actualReps: reps }).then(refresh).catch(fail),
    );
  };

  const changeSetLoad = (exerciseEventId: string, setId: string, load: number) => {
    setWorkout((w) => (w ? patchSetLocal(w, exerciseEventId, setId, { actualLoad: load }) : w));
    debounced(`${setId}:load`, () =>
      api.patchSet(workoutId, exerciseEventId, setId, { actualLoad: load }).then(refresh).catch(fail),
    );
  };

  const toggleSetComplete = (exerciseEventId: string, setId: string, completed: boolean) => {
    setWorkout((w) => (w ? patchSetLocal(w, exerciseEventId, setId, { completed }) : w));
    api.patchSet(workoutId, exerciseEventId, setId, { completed }).then(refresh).catch(fail);
  };

  const removeSet = (exerciseEventId: string, setId: string) => {
    api.removeSet(workoutId, exerciseEventId, setId).then(refresh).catch(fail);
  };

  const addSet = (exerciseEventId: string) => {
    api.addSet(workoutId, exerciseEventId).then(refresh).catch(fail);
  };

  const toggleSkip = (exerciseEventId: string, currentlySkipped: boolean) => {
    api
      .patchExercise(workoutId, exerciseEventId, { status: currentlySkipped ? "planned" : "skipped" })
      .then(refresh)
      .catch(fail);
  };

  const substitute = (exerciseEventId: string, newName: string) => {
    api.patchExercise(workoutId, exerciseEventId, { newExerciseName: newName }).then(refresh).catch(fail);
  };

  const removeExercise = (exerciseEventId: string) => {
    api.removeExercise(workoutId, exerciseEventId).then(refresh).catch(fail);
  };

  const addExercise = (name: string, targetSets?: number, targetRepsMax?: number, targetLoad?: number) => {
    api
      .addExercise(workoutId, { exerciseName: name, targetSets, targetRepsMax, targetLoad })
      .then(refresh)
      .catch(fail);
  };

  const startWorkout = () => {
    api.patchWorkout(workoutId, { startTimestamp: Date.now() }).then((event) => {
      setWorkout((w) => (w ? { ...w, event } : w));
    });
  };

  const finishWorkout = () => {
    api
      .patchWorkout(workoutId, { status: "completed", endTimestamp: Date.now() })
      .then((event) => setWorkout((w) => (w ? { ...w, event } : w)));
  };

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <div className="workout-header">
        <span className={`status-pill${workout.event.status === "completed" ? " completed" : ""}`}>
          {workout.event.status === "completed" ? "Completed" : "In progress"}
        </span>
        {workout.event.status === "in_progress" ? (
          workout.event.startTimestamp ? (
            <button type="button" className="btn small primary" onClick={finishWorkout}>
              Finish workout
            </button>
          ) : (
            <button type="button" className="btn small primary" onClick={startWorkout}>
              Start workout
            </button>
          )
        ) : null}
      </div>

      {workout.exercises.length === 0 ? (
        <div className="empty-state">No exercises yet. Add one below to get started.</div>
      ) : (
        workout.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onChangeSetReps={(setId, reps) => changeSetReps(ex.id, setId, reps)}
            onChangeSetLoad={(setId, load) => changeSetLoad(ex.id, setId, load)}
            onToggleSetComplete={(setId, completed) => toggleSetComplete(ex.id, setId, completed)}
            onRemoveSet={(setId) => removeSet(ex.id, setId)}
            onAddSet={() => addSet(ex.id)}
            onToggleSkip={() => toggleSkip(ex.id, ex.status === "skipped")}
            onSubstitute={(newName) => substitute(ex.id, newName)}
            onRemoveExercise={() => removeExercise(ex.id)}
          />
        ))
      )}

      <AddExercisePanel onAdd={addExercise} />
    </div>
  );
}

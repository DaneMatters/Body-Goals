import { useState } from "react";
import type { ExerciseEvent } from "../types";
import { SetRow } from "./SetRow";

interface Props {
  exercise: ExerciseEvent;
  onChangeSetReps: (setId: string, reps: number) => void;
  onChangeSetLoad: (setId: string, load: number) => void;
  onToggleSetComplete: (setId: string, completed: boolean) => void;
  onRemoveSet: (setId: string) => void;
  onAddSet: () => void;
  onToggleSkip: () => void;
  onSubstitute: (newName: string) => void;
  onRemoveExercise: () => void;
}

function targetSummary(ex: ExerciseEvent): string | null {
  const parts: string[] = [];
  if (ex.targetSets) parts.push(`${ex.targetSets} sets`);
  if (ex.targetRepsMin || ex.targetRepsMax) {
    parts.push(
      ex.targetRepsMin && ex.targetRepsMax && ex.targetRepsMin !== ex.targetRepsMax
        ? `${ex.targetRepsMin}-${ex.targetRepsMax} reps`
        : `${ex.targetRepsMax ?? ex.targetRepsMin} reps`,
    );
  }
  if (ex.targetLoad) parts.push(`@ ${ex.targetLoad}${ex.targetLoadUnit ?? "lbs"}`);
  return parts.length ? parts.join(" · ") : null;
}

const BADGE_LABEL: Record<ExerciseEvent["status"], string | null> = {
  planned: null,
  completed: null,
  skipped: "Skipped",
  substituted: "Substituted",
  unplanned: "Added",
};

export function ExerciseCard({
  exercise,
  onChangeSetReps,
  onChangeSetLoad,
  onToggleSetComplete,
  onRemoveSet,
  onAddSet,
  onToggleSkip,
  onSubstitute,
  onRemoveExercise,
}: Props) {
  const [showSubForm, setShowSubForm] = useState(false);
  const [subName, setSubName] = useState("");
  const badge = BADGE_LABEL[exercise.status];
  const target = targetSummary(exercise);
  const isSkipped = exercise.status === "skipped";

  return (
    <div className={`exercise-card${isSkipped ? " skipped" : ""}`}>
      <div className="exercise-title-row">
        <div>
          <p className="exercise-name">{exercise.exerciseName}</p>
          <p className="exercise-meta">
            {exercise.equipmentVariation ? `${exercise.equipmentVariation}` : null}
            {exercise.equipmentVariation && target ? " · " : null}
            {target}
          </p>
        </div>
        {badge && <span className={`exercise-badge ${exercise.status}`}>{badge}</span>}
      </div>

      {!isSkipped && (
        <div className="sets">
          {exercise.sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              onChangeReps={(reps) => onChangeSetReps(set.id, reps)}
              onChangeLoad={(load) => onChangeSetLoad(set.id, load)}
              onToggleComplete={() => onToggleSetComplete(set.id, !set.completed)}
              onRemove={() => onRemoveSet(set.id)}
              canRemove={exercise.sets.length > 1}
            />
          ))}
        </div>
      )}

      {!isSkipped && (
        <button type="button" className="btn small add-set-btn" onClick={onAddSet}>
          + Add set
        </button>
      )}

      {showSubForm ? (
        <div className="field-row" style={{ marginTop: "0.5rem" }}>
          <input
            placeholder="Replacement exercise name"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="btn small primary"
            onClick={() => {
              if (subName.trim()) {
                onSubstitute(subName.trim());
                setShowSubForm(false);
                setSubName("");
              }
            }}
          >
            OK
          </button>
        </div>
      ) : (
        <div className="exercise-actions">
          <button type="button" className="btn small ghost" onClick={onToggleSkip}>
            {isSkipped ? "Unskip" : "Skip"}
          </button>
          <button type="button" className="btn small ghost" onClick={() => setShowSubForm(true)}>
            Substitute
          </button>
          {exercise.status === "unplanned" && (
            <button type="button" className="btn small danger" onClick={onRemoveExercise}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

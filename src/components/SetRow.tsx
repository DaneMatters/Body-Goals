import { useState } from "react";
import type { SetEvent } from "../types";

interface Props {
  set: SetEvent;
  onChangeReps: (reps: number) => void;
  onChangeLoad: (load: number) => void;
  onToggleComplete: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const LOAD_STEP = 2.5;

export function SetRow({ set, onChangeReps, onChangeLoad, onToggleComplete, onRemove, canRemove }: Props) {
  const [editingReps, setEditingReps] = useState(false);
  const [editingLoad, setEditingLoad] = useState(false);

  const reps = set.actualReps ?? 0;
  const load = set.actualLoad ?? 0;

  return (
    <div className={`set-row${set.completed ? " completed" : ""}`}>
      <div className="set-number">{set.setNumber}</div>

      <div className="stepper" aria-label="Reps">
        <button type="button" onClick={() => onChangeReps(Math.max(0, reps - 1))} aria-label="Decrease reps">
          −
        </button>
        {editingReps ? (
          <input
            type="number"
            inputMode="numeric"
            autoFocus
            defaultValue={reps}
            onBlur={(e) => {
              setEditingReps(false);
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChangeReps(Math.max(0, v));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        ) : (
          <input
            type="text"
            readOnly
            value={`${reps}`}
            onFocus={() => setEditingReps(true)}
            onClick={() => setEditingReps(true)}
          />
        )}
        <button type="button" onClick={() => onChangeReps(reps + 1)} aria-label="Increase reps">
          +
        </button>
      </div>

      <div className="stepper" aria-label="Load">
        <button
          type="button"
          onClick={() => onChangeLoad(Math.max(0, load - LOAD_STEP))}
          aria-label="Decrease load"
        >
          −
        </button>
        {editingLoad ? (
          <input
            type="number"
            inputMode="decimal"
            step="any"
            autoFocus
            defaultValue={load}
            onBlur={(e) => {
              setEditingLoad(false);
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChangeLoad(Math.max(0, v));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        ) : (
          <input
            type="text"
            readOnly
            value={`${load}${set.actualLoadUnit ?? "lbs"}`}
            onFocus={() => setEditingLoad(true)}
            onClick={() => setEditingLoad(true)}
          />
        )}
        <button type="button" onClick={() => onChangeLoad(load + LOAD_STEP)} aria-label="Increase load">
          +
        </button>
      </div>

      <button
        type="button"
        className={`complete-toggle${set.completed ? " on" : ""}`}
        onClick={onToggleComplete}
        aria-label={set.completed ? "Mark set incomplete" : "Mark set complete"}
      >
        {set.completed ? "✓" : "○"}
      </button>

      {canRemove ? (
        <button type="button" className="set-remove" onClick={onRemove} aria-label="Remove set">
          ×
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

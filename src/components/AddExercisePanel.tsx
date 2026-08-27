import { useState } from "react";

interface Props {
  onAdd: (name: string, targetSets?: number, targetRepsMax?: number, targetLoad?: number) => void;
}

export function AddExercisePanel({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [load, setLoad] = useState("");

  if (!open) {
    return (
      <button type="button" className="btn" style={{ width: "100%" }} onClick={() => setOpen(true)}>
        + Add exercise
      </button>
    );
  }

  return (
    <div className="add-exercise-panel">
      <input placeholder="Exercise name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="field-row">
        <input placeholder="Sets" inputMode="numeric" value={sets} onChange={(e) => setSets(e.target.value)} />
        <input placeholder="Reps" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} />
        <input placeholder="Load (lbs)" inputMode="decimal" value={load} onChange={(e) => setLoad(e.target.value)} />
      </div>
      <div className="field-row">
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            if (!name.trim()) return;
            onAdd(
              name.trim(),
              sets ? Number(sets) : undefined,
              reps ? Number(reps) : undefined,
              load ? Number(load) : undefined,
            );
            setName("");
            setOpen(false);
          }}
        >
          Add
        </button>
        <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

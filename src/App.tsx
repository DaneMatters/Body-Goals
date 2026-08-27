import { useState } from "react";
import { WorkoutScreen } from "./components/WorkoutScreen";
import { addDays, formatDisplayDate, todayLocalDateString } from "./lib/date";

export default function App() {
  const [date, setDate] = useState(todayLocalDateString());
  const today = todayLocalDateString();

  return (
    <div className="app">
      <div className="day-nav">
        <button type="button" className="nav-btn" onClick={() => setDate((d) => addDays(d, -1))} aria-label="Previous day">
          ‹
        </button>
        <button type="button" className="day-label" style={{ background: "none", border: "none" }} onClick={() => setDate(today)}>
          {formatDisplayDate(date)}
          {date === today ? "" : " · tap for today"}
        </button>
        <button type="button" className="nav-btn" onClick={() => setDate((d) => addDays(d, 1))} aria-label="Next day">
          ›
        </button>
      </div>
      <WorkoutScreen date={date} key={date} />
    </div>
  );
}

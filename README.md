# Body Goals PWA Remake

A standalone installable PWA rebuilt around the requested workout flow.

## Home: Now/Next schedule
The Home tab is a live daily queue, not a summary. It shows the single next
undone thing on your day — workout, Insanity, or anything you add (meals,
water, etc.) via EDIT SCHEDULE — bold and up top with a due-now/overdue
countdown, and everything still coming up beneath it, sized larger the
closer its time gets. Tapping the primary action (start the workout, log
Insanity, or mark a scheduled item done) clears it and the next item takes
over the bold slot. Refreshes automatically every 30 seconds while you're
on the tab.

## Main workout features
- Mon–Fri workouts prebuilt and automatically selected by weekday, fully editable from the Workouts tab (EDIT PROGRAM): rename days, add/remove exercises, add/remove whole days, change sets and rep ranges
- 6:00–6:45 AM Body Shop Fitness schedule + 7:30 PM Insanity quick log
- Individual +/- controls for weight and reps on every set
- Copy Previous Set and Copy Last Workout
- Add/delete sets, warm-up toggle, optional RIR/RPE, skip/substitute/reorder exercises
- One-tap set completion + automatic rest timer
- Autosave and Resume Workout
- Workout timer and completion progress
- Real FitNotes history bundled for previous-performance comparisons, blended
  with your own in-app logged sessions so "last performance," suggestions,
  and PR flags stay current instead of freezing at the bundled data
- Load/rep PR flags on newly completed work sets
- Exercise notes and workout history
- No post-workout review form
- No fake current-app workout history seeded

## Deployment
Upload the contents of this folder as static assets to Cloudflare Pages/Workers Static Assets or any static host. `index.html` is the entry point.

## Local testing
Run `python -m http.server 8000` inside this folder and open http://localhost:8000.

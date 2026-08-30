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

## Patterns
A card on the Progress tab breaks your logged water and calories into six
time-of-day buckets (Early AM through Night), averaged across every day
you've logged anything, with a bar per bucket so a dip — say, an afternoon
you consistently undereat or underdrink — is visible at a glance instead of
buried in daily totals. Shows "Based on N days logged" so the sample size
is always honest; needs no setup beyond logging food and water normally.

## Favorite meals
For meals you eat close to the same way every time, the Food tab has a
one-tap "Favorites" grid grouped by Breakfast/Lunch/Dinner/Snack/Shake — tap a
tile and it logs instantly with that meal's saved calories/protein, no
retyping. Variants (a lighter version, an extra egg) are just their own
separate tiles rather than an adjustable modifier, so logging stays a
single tap either way. EDIT FAVORITES lets you add one (name it, pick from
a small preset emoji list, set its calories/protein) or delete one; manual
entry below the grid still works for anything that isn't a go-to.

## Water logging
Real amounts, not just a checkbox. Marking a "Water" schedule item done on
Home auto-logs 500 mL (one bottle) and time-stamps it. The Food tab also has
its own Water card for logging outside the schedule — quick +250 mL/+500
mL/+1 L buttons plus a custom amount — with a running total against the
3.5 L daily baseline shown there and as a metric tile on Home.

## 12-week Power Bodybuilding program
The default Mon–Fri split (Chest/Legs/Shoulders/Arms/Back) runs a 12-week
%1RM-based progression on the three main lifts — Incline Barbell Bench
Press, Barbell Back Squat, Barbell Deadlift. Sets stay fixed at 5; only
reps and load intensity change every 4-week phase: Weeks 1–4 are 5×4 @
70% 1RM, Weeks 5–8 are 5×3 @ 80%, Weeks 9–12 are 5×2 @ 90%, based on the
program start date recorded the first time this version loads. Enter each
lift's 1RM from the Workouts tab (EDIT PROGRAM) to get an actual target
weight and phase countdown; accessory exercises for every day keep fixed
sets/reps and are unaffected by phasing. No cardio progression is bundled
with this program — Insanity is logged separately as its own schedule item.
Starting 1RMs (145/155/190 lb for bench/squat/deadlift) are pre-seeded
from recent bundled FitNotes history rather than a fresh max-effort test —
adjust them in EDIT PROGRAM once real Week 1 sets show whether they're on.

## Main workout features
- Mon–Fri workouts prebuilt and automatically selected by weekday, fully editable from the Workouts tab (EDIT PROGRAM): rename days, add/remove exercises, add/remove whole days, change sets and rep ranges
- 11:00–11:45 AM Body Shop Fitness schedule + 7:30 PM Insanity quick log
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

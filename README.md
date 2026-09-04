# Body Goals PWA Remake

A standalone installable PWA rebuilt around the requested workout flow.

## Stays where you left it
The app remembers which tab you're on (Home/Workouts/Food/Progress/More)
and restores it on the next load — a refresh, a service worker update, or
reopening the installed app won't dump you back on Home. If you refresh
mid-workout, it also drops you straight back into that in-progress
session instead of the tab you'd otherwise land on.

## Home: Now/Next schedule
The Home tab is a live daily queue, not a summary. It shows the single next
undone thing on your day — workout, Insanity, or anything you add (meals,
water, etc.) via EDIT SCHEDULE — bold and up top with a due-now/overdue
countdown, and everything still coming up beneath it, sized larger the
closer its time gets. Tapping the primary action (start the workout, log
Insanity, or mark a scheduled item done) clears it and the next item takes
over the bold slot. Refreshes automatically every 30 seconds while you're
on the tab.

The whole day is anchored to whatever you mark done first (the earliest
item on your schedule — "Wake up" by default). Before that's marked, the
day shows at its normal scheduled times. The moment you mark it, the app
compares when you actually did it to when it was scheduled for, and shifts
every remaining item that day — food, water, the workout, Insanity, all of
it — by that same gap, so the spacing between things stays intact even if
the whole day starts late or early. A small "shifted +Xh Xm" badge next to
UP NOW shows when this is active. It resets to normal every new day, and
undoing that first item's completion (Progress → History → Undo) reverts
today back to the unshifted times too.

## Training charts and history
Three cards on the Progress tab, inspired by FitNotes' analysis view but
scoped down to what's actually useful day to day:
- **Training Volume** — a line chart of total lb×reps volume per day,
  combining your own logged workouts with the bundled historical data, with
  1m/3m/6m/1y/all range toggles.
- **Exercise Progress** — pick any exercise you've ever logged (from either
  source) and see its estimated 1RM (Epley formula) plotted over time, with
  the current estimate shown big above the chart.
- **History** — pick any date and see everything logged that day in one
  place: workouts, Insanity, bundled historical exercises, food, water, and
  bodyweight. This is how you look back at a specific past day (e.g. a
  session logged from old FitNotes data) without it being buried in a filter.
  A "Completed" section also lists every schedule item checked off that day
  with an Undo button, and water entries there have a delete button too —
  the fix for an accidental tap on Home.

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
3.5 L daily baseline shown there and as a metric tile on Home. Every
water entry, and every food entry in Today's Entries, has a delete (✕)
button on the Food tab and in History if one gets logged by mistake
(e.g. a duplicate). Tapping MARK DONE (or a schedule item's
mini checkmark) flashes it green to confirm the tap registered, and
marking something done is a real toggle — the History day view (see
below) lists everything checked off that day with an Undo button, so an
accidental tap is always fixable, not just hidden.

This stays in sync in both directions: logging water or food from the Food
tab (the quick-add buttons, custom amount, manual entry, or a Favorites tap)
automatically checks off the next not-yet-done Water or meal item on Home's
schedule too, timestamped to when you actually logged it — not whenever you
happen to next open Home. No more mismatch between when you actually ate or
drank and when the to-do list says you did.

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

## Insanity calendar
The "7:30 PM Insanity" line (Home and Workouts) shows the actual named
workout due that day — e.g. "Plyometric Cardio Circuit" — computed from
the real Insanity calendar and a recorded start date, not just a generic
"planned" placeholder. It also encodes this household's actual pattern:
Fit Test days are skipped, cascading the rest of that week's workouts
forward by one slot (Monday does Tuesday's workout, ..., Friday does
Saturday's), since Saturday itself is never trained. The LOG button is
blue/primary so it's easy to spot. Tapping it records that day's
specific workout name, visible later in Progress → History — an
accidental tap is fixable via the Undo button that replaces LOG once
logged (Workouts tab), or a delete (✕) button on any Insanity entry in
History or the Workouts tab's Workout History list.
The first two weeks (before this feature existed) were backfilled once
with the real dates/workouts already done, at 7:30 PM each, via a
one-time additive migration that never overwrites a real logged entry
if one already exists for that date.

The bundled calendar covers the full 63-day program — Month 1 (Weeks
1–4), Recovery Week, and all of Month 2 (Weeks 5–9) — transcribed
directly from the official day-by-day calendar, with the Fit-Test-skip/
cascade rule applying automatically to every Fit Test week throughout.

## Main workout features
- Mon–Fri workouts prebuilt and automatically selected by weekday, fully editable from the Workouts tab (EDIT PROGRAM): rename days, add/remove exercises, add/remove whole days, change sets and rep ranges
- Each training day has its own accent color (a small dot next to it in
  the Workouts tab list) that carries through into that day's session
  screen — the header, progress bar, and FINISH button all pick it up —
  so Chest, Legs, Shoulders, Arms, and Back each feel visually distinct
  instead of the whole app running on one color
- 7:30–8:15 AM Body Shop Fitness schedule + 7:30 PM Insanity quick log
- Individual +/- controls for weight and reps on every set
- Copy Previous Set and Copy Last Workout
- Add/delete sets, warm-up toggle, optional RIR/RPE, skip/substitute/reorder exercises.
  The warm-up/RIR-RPE/delete row per set is collapsed behind a small "⋯" by
  default so a normal set is just one compact line — tap it to expand.
  A collapsed set still shows a small WARM or RIR/RPE tag next to its number
  if either is set, so nothing's hidden silently
- One-tap set completion + automatic rest timer that floats fixed on screen
  (not just sticky within the top of the page) so it stays visible while
  you scroll down to whichever set you're actually working on
- Optional cool-down stretch video(s) per training day (Anabolic Aliens'
  static stretching series, one per day — Arms gets both a biceps and a
  triceps link since it trains both), shown as a button at the very end of
  the session after the last exercise. Tapping it plays the video right in
  an in-app modal (embedded YouTube player, autoplay) instead of jumping out
  to the YouTube app/tab — closing the modal drops you straight back into
  your session. Add, relabel, or remove any day's videos from EDIT PROGRAM
  ("+ Add Stretch Video")
- Autosave and Resume Workout
- Workout timer and completion progress
- Real FitNotes history bundled for previous-performance comparisons, blended
  with your own in-app logged sessions so "last performance," suggestions,
  and PR flags stay current instead of freezing at the bundled data. Loads
  as JSON in the background after the app first renders, so this ~450 KB
  dataset never delays getting to the Home screen
- Load/rep PR flags on newly completed work sets
- Exercise notes and workout history
- No post-workout review form
- No fake current-app workout history seeded

## Deployment
Upload the contents of this folder as static assets to Cloudflare Pages/Workers Static Assets or any static host. `index.html` is the entry point.

## Local testing
Run `python -m http.server 8000` inside this folder and open http://localhost:8000.

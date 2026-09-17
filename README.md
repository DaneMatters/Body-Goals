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
  source) and see its estimated 1RM (Epley formula) plotted over time.
  A lift is one entry in the picker even when the bundled data and the
  program call it different things: every exercise's `history` aliases are
  folded into one canonical name, so "Barbell Squat" and "Barbell Back
  Squat" are a single continuous line rather than two half-histories.
  Two separate stats sit above the chart, because they answer different
  questions: **est. 1RM** is your best estimate from the last eight weeks,
  so one light or deload session no longer reads as losing strength, and
  **all-time best** is your highest estimate ever, with the date it
  happened. Same 1m/3m/6m/1y/all range toggles as the volume chart, and
  the y-axis zooms to the data instead of always starting at zero, so a
  trend is actually visible rather than squashed into the top third.
  The picker itself is sorted by how much you actually use each lift —
  most logged sessions first, ties broken by total volume — instead of
  alphabetically, so the exercises you actually check sit at the top
  instead of requiring a scroll through 60+ options to find.
  Drag a finger anywhere across the chart to scrub it: a crosshair follows
  your finger, the nearest session highlights, and its date and weight read
  out above. Vertical scrolling still works normally while you do it.
  If your logged sets outrun the 1RM your program is using for that lift,
  the card says so and offers a one-tap update, since a stale 1RM means
  every %1RM-prescribed weight is running light.
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
sets/reps and are unaffected by phasing. The three main lifts each
pre-populate 2 warm-up sets (ramping to roughly 50%/70% of that day's
work weight) ahead of the working sets, and rest between their heavy
sets is 3 minutes, matching the source program. Standing Barbell
Military Press on Shoulders day runs 5×4. No cardio progression is bundled
with this program — Insanity is logged separately as its own schedule item.
Starting 1RMs (145/155/190 lb for bench/squat/deadlift) are pre-seeded
from recent bundled FitNotes history rather than a fresh max-effort test —
adjust them in EDIT PROGRAM once real Week 1 sets show whether they're on.

## Multiple programs
More than one full program can be saved at once, and only one is ever
"loaded" and active — the one the Workouts tab actually shows and starts
sessions from. The YOUR PROGRAM card header carries a compact dropdown
of every saved program — pick one to switch, with a confirmation since
it changes what you're training mid-plan — plus a small ⋮ menu next to
EDIT for the rest: + NEW PROGRAM, a pencil to rename any program, and a
delete button on the inactive ones (the active program can't be
deleted — switch away first, then delete it from the menu). Two
programs come bundled: Mike O'Hearn's 12-Week Power Bodybuilding (the original %1RM
default) and a second Upper/Lower Powerbuilding split — Upper A/Lower A
Tuesday through Monday-Thursday-Friday, incline bench and standing
overhead press as the main upper lifts, back squat/Zercher squat and a
straight 5×5 conventional deadlift on the lower days. + NEW creates a
blank program and drops you straight into EDIT mode to build it out
with the same Add Day/Add Exercise tools used everywhere else — there's
no separate "custom program" flow, building your own program from
scratch already looked like this.

Switching programs is a swap, not a merge: whichever program is active
owns "the program" everywhere in the app (EDIT PROGRAM, the Home
schedule's workout line, badges' Phase-Complete conditions) exactly like
before this feature existed. Editing the active program and switching
away saves those edits back into that program's own saved slot before
the new one loads, so nothing is lost either direction. A program's
first activation stamps today as its own start date — switching to a
program you've already run before picks its original start date back
up, so its week/month count keeps going rather than resetting.

Exercises that are genuinely the same lift across programs (incline
bench, back squat, deadlift, standing overhead press) use the same
canonical names the app already merges FitNotes and program history
under, so switching programs doesn't fragment the 1RM chart the way two
different names for the same lift used to.

A progress bar above YOUR PROGRAM shows week X of 12 (and a month
counter, for either program's phase/month-based lifts) for whichever
program is currently active.

## Levels and badges
A quiet level indicator sits under the date on Home — level number, title,
and a thin XP bar, small enough to not compete with UP NOW. Tapping it
jumps straight to a new Badges tab under Progress. XP comes from finishing
a workout (50, or 25 if finished early with sets still unchecked), logging
Insanity (30), marking any scheduled item done (5), or logging bodyweight
(5); each level costs a bit more XP than the last. Level titles: 1–5
Titan, 6–10 Gym Rat, 11–20 Conqueror, 21+ Juggernaut.

21 badges cover real strength milestones (a main lift crossing 225/315/405
lb estimated 1RM), lifetime volume (250k/500k/1M lb), a 10,000 lb single
session, PRs (first one, and one on all three main lifts in the same
week), streaks (schedule items marked done 7 or 30 days running, water or
protein targets hit 7 days running), program milestones (each 4-week
phase finished, 100 workouts logged), and a few tied to features already
in the app — reopening a finished workout and completing it, logging
something with + ADD EXERCISE that wasn't on the plan, and finishing 10
workouts with every set checked off. The Badges tab shows every badge,
locked ones outlined with their condition visible rather than hidden as a
mystery, unlocked ones filled in with the date earned. Unlocking one (or
several at once) shows as a plain toast, same style as "Workout saved."

Everything here counts from the day this feature shipped onward only —
none of it scans the 7 years of bundled FitNotes history or backfills
anything, so nothing unlocks in a pile the first time you open the app.

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

Forgetting to tap LOG no longer costs you the record. Any past scheduled
Insanity day with no entry is counted as outstanding, and the Workouts tab
shows a "N past Insanity days not logged — CATCH UP" prompt when there are
any. CATCH UP lists each one with the workout that was actually due that day,
every day ticked by default; untick anything you genuinely skipped and log
the rest in one tap, stamped 7:30 PM. Today is deliberately never included,
since the 7:30 PM session may not have happened yet — that stays the normal
LOG button. A one-time migration also caught up everything outstanding from
the program start through yesterday, additively, so no day that was already
logged had its entry or its name touched.

The bundled calendar covers the full 63-day program — Month 1 (Weeks
1–4), Recovery Week, and all of Month 2 (Weeks 5–9) — transcribed
directly from the official day-by-day calendar, with the Fit-Test-skip/
cascade rule applying automatically to every Fit Test week throughout.

## Tapped FINISH too early
Any finished workout can be reopened and completed — nothing is locked once
it's saved. The summary that pops up the moment you finish (and the same
summary reached later from Workout History, or Progress → History) has a
"+ REOPEN & ADD SETS" button that drops the workout straight back into the
live session screen with everything you already logged still checked off.
Finish the sets you missed and hit FINISH again. It files back as the same
workout — original date kept, time added onto the original duration — rather
than a second entry, so volume and 1RM charts stay honest. Reopening is
refused (with a reason) if a different workout is already in progress, so a
live session can never be clobbered.

FINISH also guards against the mistake in the first place: if any work sets
are still unchecked, it asks before saving and tells you how many.

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
- **+ ADD EXERCISE**, always visible at the bottom of every session's
  exercise list, for anything outside the planned day — an extra
  bodypart, a one-off movement you felt like doing, whatever. Opens a
  search box over the same usage-sorted exercise list from Progress →
  Exercise Progress, or "+ Custom Exercise" for something not logged
  before. Picking one drops a new card into the current session with 3
  empty sets (reps and starting weight seeded from that exercise's last
  performance when there is one), right alongside the planned exercises —
  same FINISH button, same saved workout, no separate entry to track
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

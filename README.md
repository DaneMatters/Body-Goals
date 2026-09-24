# Body Goals PWA Remake

A standalone installable PWA rebuilt around the requested workout flow.

## Stays where you left it
The app remembers which tab you're on (Home/Workouts/Food/Progress/More)
and restores it on the next load — a refresh, a service worker update, or
reopening the installed app won't dump you back on Home. If you refresh
mid-workout, it also drops you straight back into that in-progress
session instead of the tab you'd otherwise land on.

## Home: current PRs and trophies
Home used to be a live Now/Next schedule queue (a wake-up-anchored daily
to-do list with its own EDIT SCHEDULE mode). That's gone — in practice,
water and food get logged from the Food tab and workouts from the
Workouts tab, so the schedule queue was one more click without a real
use. Home is now a quick trophy case instead: a CURRENT PRs card shows
your best-ever estimated 1RM on each of the three main lifts (Incline
Barbell Bench Press, Barbell Back Squat, Barbell Deadlift) with the date
it was set, and a TROPHIES card shows your most recently earned badges
in full color (up to 6), with an "N of 28" pill that jumps straight to
Progress → Badges for the complete list. Log nothing yet and TROPHIES
shows a plain empty-state message instead of a blank card. The
CALORIES/PROTEIN/WATER snapshot for today still sits at the bottom,
unchanged.

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
  Food and water entries there have a delete button too — the fix for an
  accidental duplicate.

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
Real amounts, not just a checkbox. The Food tab logs water the same way
food favorites work: a blue "💧 Water Bottle" button sits right above
your food favorites (always 500 mL, one tap, no separate card or
custom-amount form to deal with), with a running total against the
3.5 L daily baseline shown as its own WATER tile next to TODAY and
PROTEIN, and as a metric tile on Home. Logged water shows up alongside
food in Today's Entries — sorted together by time — and every entry,
water or food, has a delete (✕) button there and in History if one gets
logged by mistake (e.g. a duplicate).

## Icon accents across the app
Every stat tile app-wide carries a small icon next to its label now,
matching the 💧 on the Water Bottle button: 🔥 Calories, 💪 Protein, 💧
Water (Home and Food), 🏋️ Est. 1RM / 🏆 All-Time Best (Progress →
Charts → Exercise Progress), and 📊 Volume / ✅ Sets (tapping into a
logged workout from Workout History). Purely cosmetic — no data or
behavior changes, just a consistent visual language across tiles that
already existed.

The same pass extends to the primary quick-action buttons: 🏋️ on every
start/resume-workout button (the Workouts tab's day-preview EXERCISES
card), 📋 on VIEW TODAY'S WORKOUT, ✅ on the Insanity catch-up modal's
LOG N DAY(S) confirm button, ⚡ on both LOG INSANITY buttons, 🔁 on
CATCH UP, 🍽️ on LOG CONSUMED FOOD, and ⚖️ on LOG WEIGHT. Same buttons,
same actions — just faster to spot at a glance.

## Workouts tab: one place to start today's workout
The Workouts tab used to open with a TODAY'S TRAINING card duplicating
what the EXERCISES card right below it already showed, sometimes with
two different-looking action buttons on screen at once. That card is
gone — THIS WEEK now leads the page, followed by tonight's Insanity
line (still its own LOG button and missed-day CATCH UP nudge) if
Insanity is enabled for the active program, then the day-preview
EXERCISES card. That card's action button now tracks today's real
status: 🏋️ START / LOG THIS WORKOUT normally, 🏋️ RESUME WORKOUT if a
session's in progress, and 📋 VIEW TODAY'S WORKOUT once today's session
is actually logged — but only while today itself is the day selected
in THIS WEEK. Preview a different day (say, catching up on Friday)
and it stays 🏋️ START / LOG THIS WORKOUT for that day, regardless of
whether today's own workout is already done.

## Food history
The Food tab isn't just today anymore — scroll past Today's Entries and a
FOOD HISTORY card lists every past day you've logged food or water,
newest first, the same collapsible-day pattern the Workouts tab uses for
workout history. Each day starts collapsed with a one-line summary
(total calories, protein, and water if any was logged), and tapping it
opens the full list of that day's food and water entries — each with its
own delete button, same as Today's Entries. Today itself stays in its own
card above, so nothing is shown twice.

## 12-week Power Bodybuilding program
The default Mon–Fri split (Chest/Legs/Shoulders/Arms/Back) runs a 12-week
%1RM-based progression on the three main lifts — Incline Barbell Bench
Press, Barbell Back Squat, Barbell Deadlift. Sets stay fixed at 5; only
reps and load intensity change every 4-week phase: Weeks 1–4 are 5×4 @
70% 1RM, Weeks 5–8 are 5×3 @ 80%, Weeks 9–12 are 5×2 @ 90%, based on the
program start date recorded the first time this version loads. Enter each
lift's 1RM from the Workouts tab (the program dropdown's Edit Current
Program option) to get an actual target weight and phase countdown;
accessory exercises for every day keep fixed
sets/reps and are unaffected by phasing. The three main lifts each
pre-populate 2 warm-up sets (ramping to roughly 50%/70% of that day's
work weight) ahead of the working sets, and rest between their heavy
sets is 3 minutes, matching the source program. Standing Barbell
Military Press on Shoulders day runs 5×4. No cardio progression is bundled
with this program — Insanity is tracked and logged entirely separately.
Starting 1RMs (145/155/190 lb for bench/squat/deadlift) are pre-seeded
from recent bundled FitNotes history rather than a fresh max-effort test —
adjust them via Edit Current Program once real Week 1 sets show whether
they're on.

## Multiple programs
More than one full program can be saved at once, and only one is ever
"loaded" and active — the one the Workouts tab actually shows and starts
sessions from. The active program's name, right inside THIS WEEK's
progress widget (see below), is itself one compact dropdown that
handles all of it: pick a saved program to switch to it, with a
confirmation since it changes what you're training mid-plan; pick
"✎ Edit Current Program" to jump into editing the active program's days
and exercises; or pick "⚙ Manage Programs…" for the rest — + NEW
PROGRAM, a pencil to rename any program, and a delete button on the
inactive ones (the active program can't be deleted — switch away first,
then delete it from there). No separate card, menu, or EDIT button
cluttering the page — one small dropdown covers switching, editing, and
managing, and an EDIT PROGRAM card only appears when you're actually
using it. Two programs come bundled: Mike O'Hearn's 12-Week Power Bodybuilding (the original %1RM
default) and a second Upper/Lower Powerbuilding split — Upper A/Lower A
Tuesday through Monday-Thursday-Friday, incline bench and standing
overhead press as the main upper lifts, back squat/Zercher squat and a
straight 5×5 conventional deadlift on the lower days. + NEW creates a
blank program and drops you straight into EDIT mode to build it out
with the same Add Day/Add Exercise tools used everywhere else — there's
no separate "custom program" flow, building your own program from
scratch already looked like this.

Switching programs is a swap, not a merge: whichever program is active
owns "the program" everywhere in the app (Edit Current Program, the Home
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

A progress widget leads that first card, above the day chips, carrying
the active program's name (small — that name is the switch/edit/manage
dropdown described above, not a big heading) plus week X of 12 (and a
month counter, for either program's phase/month-based lifts) and its
progress bar all together — so the top of the Workouts tab tells you at
a glance which program you're running and how far into it you are,
gives you a way to change it, and only then shows the day chips below,
with no section titles or extra labels in between.

## Preview any day from THIS WEEK
The day chips in THIS WEEK aren't just a logging streak anymore — tap
one and an EXERCISES card right below THIS WEEK shows that
day's planned exercises (sets × reps, phased %1RM where it applies) and
a START / LOG THIS WORKOUT button, so you can check what Friday looks
like, or catch up on a day you skipped, without leaving the Workouts
tab. It's titled TODAY'S EXERCISES when the selected day is today, or
e.g. FRIDAY'S EXERCISES otherwise. The tapped chip highlights solid to
show it's the one being previewed, while today's own chip keeps its
thin outline regardless of what's selected, so you can always tell
"today" and "what I'm looking at" apart even when they're different
days. Days with nothing scheduled (rest days, or days a program doesn't
use) show a simple "no workout scheduled" message instead. This card is
hidden while editing the program, since you're already looking at every
day's exercises there.

Each chip also carries a small emoji above the day name showing which
bodypart that day trains — 🏋️ chest, 🦵 legs, 🤾 shoulders, 💪 arms, 🚣
back, or ➖ for a rest day / a day with no exercises. It's detected the
same way the Chest Champion/Back Builder/etc. badges are: by matching
the day's actual exercise names against each bodypart's keywords and
picking whichever one shows up most, so it works for any program (not
just the bundled ones) and updates automatically if you edit a day's
exercises.

## Levels and badges
A quiet level indicator sits under the date on Home — level number, title,
and a thin XP bar. Tapping it jumps straight to a new Badges tab under
Progress, and Home's own TROPHIES card (see above) surfaces your most
recent earned badges without that extra tap. XP comes from finishing
a workout (50, or 25 if finished early with sets still unchecked), logging
Insanity (30), or logging bodyweight (5); each level costs a bit more XP
than the last. Level titles: 1–5 Titan, 6–10 Gym Rat, 11–20 Conqueror,
21+ Juggernaut.

28 badges cover real strength milestones (a main lift crossing 225/315/405
lb estimated 1RM), lifetime volume (250k/500k/1M lb), a 10,000 lb single
session, PRs (first one, and one on all three main lifts in the same
week), streaks (water or protein targets hit 7 days running), program
milestones (each 4-week phase finished, 100 workouts logged), your first
logged workout, 20 workouts that trained each bodypart
(chest/back/legs/shoulders/arms, detected from the exercises actually
logged that session — works across any program, not just one specific
split), bodyweight milestones off your own weigh-ins (5 lb and 10 lb
gained since you started logging, and crossing 200 or 220 lb), and a few
tied to features already in the app — reopening a finished workout and
completing it, logging something with + ADD EXERCISE that wasn't on the
plan, and finishing 10 workouts with every set checked off.

22 of the 28 use real commissioned trophy artwork (`badges/*.png`,
200×200) — full color once earned, desaturated and dimmed while locked,
matching the pack's own spec. The other 6 (Hat Trick, The Comeback,
Freelancer, and the three Phase Complete badges) have no matching art in
the pack and fall back to a code-drawn shield — a radial gradient colored
by category (copper for strength, blue for volume, gold for PRs, green
for consistency, purple for grit, silver for program) with a soft glow
and shimmer once earned, outlined and muted while locked, so the whole
grid still reads as one consistent set even where the art runs out.

Tap an earned badge and a popup shows exactly what earned it in place —
the exercise, weight × reps, and PR type for a lift badge; the workout
and its volume for a volume badge; the streak length; how many
bodypart-matching workouts; whatever's actually relevant to that badge —
with an optional VIEW FULL WORKOUT button if you want more context,
rather than always dropping you into History to go find it yourself.
Unlocking one (or several at once) shows as a plain toast, same style as
"Workout saved."

Six achievements from the source trophy pack (carbs, calories, meal
prep, recovery days, sleep, and a bodyweight goal target) aren't wired
up — each needs a tracking feature the app doesn't have yet (carb
logging, a meal-prep concept, sleep logging, a settable goal weight),
not just an image. Their artwork is still bundled in `badges/` for
whenever those features exist.

Everything here counts from the day this feature shipped onward only —
none of it scans the 7 years of bundled FitNotes history or backfills
anything, so nothing unlocks in a pile the first time you open the app.

## Insanity calendar
The "7:30 PM Insanity" line on the Workouts tab shows the actual named
workout due that day — e.g. "Plyometric Cardio Circuit" — computed from
the real Insanity calendar and a recorded start date, not just a generic
"planned" placeholder. The bundled calendar covers the complete 63-day
program exactly as published — Month 1 (Weeks 1–4), Recovery Week, and
all of Month 2 (Weeks 6–9), all 6 training days a week (Monday through
Saturday, Sunday is the only rest day) — including every Fit Test day.
Nothing in the calendar is skipped or substituted: each of the 54
workout days maps to its own real day, Fit Test included. The LOG
button is blue/primary so it's easy to spot. Tapping it records that
day's specific workout name, visible later in Progress → History — an
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

Insanity is now a per-program setting rather than a fixed always-on
feature: open Edit Current Program (the program-name dropdown inside
THIS WEEK's progress widget on the Workouts tab) and there's an
Insanity Cardio ON/OFF toggle at the top, above the day list. Turning
it OFF removes the Insanity line from the Workouts tab and silences the
missed-days CATCH UP nudge, for whichever
program is currently active — nothing already logged in Progress →
History is touched. Turning it back ON (for that program or after
switching to a different one) picks the calendar right back up from
INSANITY_START, so switching it off for a while and back on later just
means those in-between days show up as outstanding the next time CATCH
UP runs, same as any other missed day.

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
- Mon–Fri workouts prebuilt and automatically selected by weekday, fully editable from the Workouts tab (the program dropdown's Edit Current Program option): rename days, add/remove exercises, add/remove whole days, change sets and rep ranges
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
  your session. Add, relabel, or remove any day's videos from Edit
  Current Program ("+ Add Stretch Video")
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
- Load/rep PR flags on newly completed work sets — a PR triggers a
  full-screen celebration the instant you tap the set done (the
  exercise, weight×reps, and whether it's your heaviest or highest-rep
  set ever), auto-dismissing on its own after a couple seconds so it
  never blocks logging the next set. The set itself keeps a gold
  checkmark and a small "LOAD PR"/"REP PR" tag right on its row
  afterward, so it's still obvious later in the session, not just in
  the moment. The post-workout summary carries this through too — a PR
  set gets its own bold gold line instead of being appended as small
  text alongside every other set, and the "N PRs today" pill actually
  does something when tapped: jumps to and briefly highlights the first
  PR exercise in the list
- Exercise notes and workout history
- No post-workout review form
- No fake current-app workout history seeded

## Deployment
Upload the contents of this folder as static assets to Cloudflare Pages/Workers Static Assets or any static host. `index.html` is the entry point.

## Local testing
Run `python -m http.server 8000` inside this folder and open http://localhost:8000.

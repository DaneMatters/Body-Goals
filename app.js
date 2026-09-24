(() => {
const APP_KEY='bodyGoalsRemakeV2';
const PAGE_KEY='bodyGoalsLastPage';
const PAGE_ORDER=['home','workouts','food','progress','more'];
const nowDate=()=>new Date();
const isoDate=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const deep=x=>JSON.parse(JSON.stringify(x));
const PHASE_REPS=[4,3,2];
const PHASE_PCT=[0.70,0.80,0.90];
// Day/feature accent colors must never be a red — red is reserved for danger (.btn.danger, .mini-toggle.danger) and the rest-timer banner.
const DEFAULT_PROGRAM={
  1:{name:'Chest',time:'7:30 AM',color:'#4aa3ff',stretchVideos:[{label:'Chest',url:'https://youtu.be/aR-u_PRGZkY?si=VurvAhNY3MIZAzu2'}],exercises:[
    {name:'Incline Barbell Bench Press',history:['Incline Barbell Bench Press','Incline Dumbbell Bench Press'],phased:true,sets:5,reps:PHASE_REPS,pct:PHASE_PCT,oneRM:145,step:5,rest:180,warmupSets:2},
    {name:'Flat Dumbbell Bench Press',history:['Flat Dumbbell Bench Press'],sets:5,min:10,max:10,step:5,rest:90},
    {name:'Incline Dumbbell Fly',history:['Incline Dumbbell Fly'],sets:3,min:8,max:10,step:5,rest:75}
  ]},
  2:{name:'Legs',time:'7:30 AM',color:'#22c3a6',stretchVideos:[{label:'Legs',url:'https://www.youtube.com/watch?v=425X5y4yzvY'}],exercises:[
    {name:'Barbell Back Squat',history:['Barbell Squat'],phased:true,sets:5,reps:PHASE_REPS,pct:PHASE_PCT,oneRM:155,step:10,rest:180,warmupSets:2},
    {name:'Leg Press',history:['Leg Press'],sets:5,min:10,max:10,step:10,rest:90},
    {name:'Leg Extension',history:['Leg Extension'],sets:3,min:8,max:8,step:5,rest:75}
  ]},
  3:{name:'Shoulders',time:'7:30 AM',color:'#b98cff',stretchVideos:[{label:'Shoulders',url:'https://www.youtube.com/watch?v=qLsgIzQ8_eQ'}],exercises:[
    {name:'Standing Barbell Military Press',history:['Standing Military Press','Overhead Press'],sets:5,min:4,max:4,step:5,rest:90},
    {name:'Wide-Grip Upright Barbell Row',history:['Wide-Grip Upright Barbell Row'],sets:3,min:8,max:8,step:5,rest:75},
    {name:'Standing Dumbbell Upright Row',history:['Standing Dumbbell Upright Row'],sets:3,min:8,max:8,step:5,rest:75},
    {name:'Dumbbell Lateral Raise',history:['Lateral Dumbbell Raise','Seated Dumbbell Lateral Raise'],sets:4,min:12,max:12,step:5,rest:60},
    {name:'Seated Bent-Over Rear-Delt Raise',history:['Seated Bent Over Rear Delt Raise'],sets:4,min:12,max:12,step:5,rest:60}
  ]},
  4:{name:'Arms',time:'7:30 AM',color:'#ff8a3d',stretchVideos:[{label:'Biceps',url:'https://www.youtube.com/watch?v=Xm6rif0Crcg'},{label:'Triceps',url:'https://www.youtube.com/watch?v=03XyeYNxOSc'}],exercises:[
    {name:'Barbell Curl',history:['Barbell Curl'],sets:3,min:8,max:12,step:5,rest:75},
    {name:'Seated Dumbbell Curl',history:['Seated Dumbbell Curl'],sets:3,min:8,max:12,step:5,rest:75},
    {name:'Preacher Curl',history:['Barbell Preacher Curl'],sets:3,min:8,max:12,step:5,rest:75},
    {name:'Lying Triceps Extension',history:['Lying Triceps Extension'],sets:4,min:8,max:12,step:5,rest:75},
    {name:'Triceps Pushdown',history:['Rope Push Down'],sets:4,min:8,max:12,step:5,rest:75},
    {name:'Incline Dumbbell Triceps Extension',history:['Dumbbell Incline Tricep Extension'],sets:4,min:8,max:12,step:5,rest:75}
  ]},
  5:{name:'Back',time:'7:30 AM',color:'#ff5c8a',stretchVideos:[{label:'Back',url:'https://www.youtube.com/watch?v=DrkBSODtE5s'}],exercises:[
    {name:'Barbell Deadlift',history:['Barbell Deadlift','Deadlift'],phased:true,sets:5,reps:PHASE_REPS,pct:PHASE_PCT,oneRM:190,step:10,rest:180,warmupSets:2},
    {name:'One-Arm Dumbbell Row',history:['Dumbbell Row'],sets:5,min:10,max:10,step:5,rest:90},
    {name:'Wide-Grip Lat Pulldown',history:['Lat Pulldown'],sets:3,min:8,max:8,step:5,rest:75}
  ]}
};
const UPPER_LOWER_PB_PROGRAM={
  1:{name:'Upper A',time:'7:30 AM',color:'#4aa3ff',exercises:[
    {name:'Chest-Supported Dumbbell Row',history:['Chest-Supported Dumbbell Row'],sets:2,monthReps:[10,10,10],startWeight:30,step:5,rest:45,notes:'Activation set — light, strict, feel the mid-back working.'},
    {name:'Incline Barbell Bench Press',history:['Incline Barbell Bench Press','Incline Dumbbell Bench Press'],sets:4,monthReps:[6,5,4],startWeight:115,step:5,rest:180,warmupSets:3,notes:'Bench stays at 30°. Pull shoulder blades down and back. Stop with at least one clean rep left.'},
    {name:'Standing Barbell Military Press',history:['Standing Military Press','Overhead Press'],sets:3,monthReps:[8,10,12],startWeight:85,step:5,rest:120,warmupSets:2},
    {name:'Strict Pull-Up',history:['Pull Up','Chin Up'],sets:3,monthReps:[6,8,10],startWeight:0,step:5,rest:120,notes:'Dead hang start, no swinging. Use the assisted machine with the least assistance needed if bodyweight comes up short.'},
    {name:'Incline Dumbbell Fly',history:['Incline Dumbbell Fly'],sets:3,monthReps:[10,12,15],startWeight:20,step:5,rest:75},
    {name:'Barbell Curl',history:['Barbell Curl'],sets:2,monthReps:[10,12,15],startWeight:70,step:5,rest:0,notes:'Superset with Rope Triceps Pushdown — no rest until both are done.'},
    {name:'Rope Triceps Pushdown',history:['Rope Push Down'],sets:2,monthReps:[10,12,15],startWeight:40,step:5,rest:75}
  ]},
  2:{name:'Lower A',time:'7:30 AM',color:'#22c3a6',exercises:[
    {name:'Barbell Back Squat',history:['Barbell Squat'],sets:4,monthReps:[6,5,4],startWeight:185,step:5,rest:180,warmupSets:3,notes:'Hip crease passes the top of the knee. Bar over midfoot.'},
    {name:'Zercher Squat',history:['Zercher Squat'],sets:3,monthReps:[8,6,5],startWeight:95,step:5,rest:150,warmupSets:2,notes:'Bar sits in the elbow creases. Keep it tight against your torso — sleeves or a pad are fine.'},
    {name:'Zercher Static Hold',history:['Zercher Static Hold'],sets:2,monthReps:[20,20,20],startWeight:95,step:5,rest:90,notes:'Reps shown are seconds held, not repetitions. Use your Zercher squat weight, done right after your last squat set.'},
    {name:'Leg Press',history:['Leg Press'],sets:3,monthReps:[10,12,15],startWeight:270,step:10,rest:120,warmupSets:1},
    {name:'Seated Leg Curl',history:['Seated Leg Curl'],sets:2,monthReps:[10,12,15],startWeight:70,step:5,rest:75},
    {name:'Seated Calf Raise',history:['Seated Calf Raise'],sets:3,monthReps:[12,15,20],startWeight:70,step:5,rest:60}
  ]},
  4:{name:'Upper B',time:'7:30 AM',color:'#b98cff',exercises:[
    {name:'Standing Barbell Military Press',history:['Standing Military Press','Overhead Press'],sets:4,monthReps:[6,5,4],startWeight:105,step:5,rest:180,warmupSets:3,notes:'Strict — no knee bend or leg drive. Brace your stomach, squeeze your glutes.'},
    {name:'One-Arm Dumbbell Row',history:['Dumbbell Row'],sets:3,monthReps:[8,10,12],startWeight:70,step:5,rest:90,warmupSets:1},
    {name:'Paused Incline Barbell Bench Press',history:['Paused Incline Barbell Bench Press'],sets:3,monthReps:[8,10,12],startWeight:95,step:5,rest:150,warmupSets:2,notes:'Pause on your upper chest for a full second before pressing.'},
    {name:'Strict Chin-Up',history:['Chin Up','Pull Up'],sets:2,monthReps:[6,8,10],startWeight:0,step:5,rest:120,notes:'Underhand grip, dead hang, no swinging.'},
    {name:'Dumbbell Lateral Raise',history:['Lateral Dumbbell Raise','Seated Dumbbell Lateral Raise'],sets:2,monthReps:[12,15,20],startWeight:15,step:5,rest:0,notes:'Superset with Bent-Over Rear-Delt Raise.'},
    {name:'Bent-Over Rear-Delt Raise',history:['Seated Bent Over Rear Delt Raise'],sets:2,monthReps:[12,15,20],startWeight:10,step:5,rest:60},
    {name:'Seated Dumbbell Curl',history:['Seated Dumbbell Curl'],sets:2,monthReps:[10,12,15],startWeight:20,step:5,rest:0,notes:'Superset with the overhead triceps extension.'},
    {name:'One-Dumbbell Overhead Triceps Extension',history:['Dumbbell Overhead Triceps Extension'],sets:2,monthReps:[10,12,15],startWeight:40,step:5,rest:75}
  ]},
  5:{name:'Lower B',time:'7:30 AM',color:'#ff5c8a',exercises:[
    {name:'Barbell Deadlift',history:['Barbell Deadlift','Deadlift'],sets:5,monthReps:[5,5,5],startWeight:225,step:10,rest:240,warmupSets:3,notes:'Dead stop every rep, reset your brace, no bouncing. Add weight only after all 25 reps go clean — never a forced final set.'},
    {name:'Leg Extension',history:['Leg Extension'],sets:3,monthReps:[12,15,20],startWeight:100,step:5,rest:0,notes:'Superset with Lying Leg Curl.'},
    {name:'Lying Leg Curl',history:['Lying Leg Curl'],sets:3,monthReps:[10,12,15],startWeight:70,step:5,rest:75},
    {name:'Seated Calf Raise',history:['Seated Calf Raise'],sets:3,monthReps:[12,15,20],startWeight:70,step:5,rest:0,notes:'Superset with Cable Crunch — crunches only run 2 sets, so take your 3rd calf set alone.'},
    {name:'Cable Crunch',history:['Cable Crunch'],sets:2,monthReps:[12,15,20],startWeight:50,step:5,rest:60}
  ]}
};
const DAYN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SUBSTITUTE_POOL={
  Chest:['Flat Barbell Bench Press','Incline Dumbbell Bench Press','Flat Dumbbell Bench Press','Incline Dumbbell Fly','Cable Crossover','Dumbbell Pullover'],
  Legs:['Barbell Squat','Leg Press','Romanian Deadlift','Leg Extension','Walking Lunges','Leg Curl'],
  Shoulders:['Seated Dumbbell Press','Standing Barbell Military Press','Lateral Dumbbell Raise','Cable Lateral Raise','Face Pulls','Rear Delt Fly'],
  Arms:['Barbell Curl','Dumbbell Hammer Curl','Preacher Curl','Rope Push Down','Overhead Triceps Extension','Concentration Curl'],
  Back:['Barbell Row','Lat Pulldown','Seated Cable Row','One-Arm Dumbbell Row','Pull-Ups','T-Bar Row']
};
const WEEK_ORDER=[1,2,3,4,5,6,0];
const PROGRAM_VERSION=2;
const PROGRAM_TIME_VERSION=1;
const STRETCH_VIDEO_VERSION=2;
const PROGRAM_COLOR_VERSION=1;
const PROGRAM_V3_FIX_VERSION=1;
const INSANITY_BACKFILL_VERSION=2;
const INSANITY_CATCHUP_VERSION=1;
const GAMIFY_VERSION=1;
const PROGRAM_LIBRARY_VERSION=2;
const INSANITY_START='2026-08-17';
const INSANITY_WEEKS=[
  ['Fit Test','Plyometric Cardio Circuit','Cardio Power & Resistance','Cardio Recovery','Pure Cardio','Plyometric Cardio Circuit'],
  ['Cardio Power & Resistance','Pure Cardio','Plyometric Cardio Circuit','Cardio Recovery','Cardio Power & Resistance','Pure Cardio & Cardio Abs'],
  ['Fit Test','Plyometric Cardio Circuit','Pure Cardio & Cardio Abs','Cardio Recovery','Cardio Power & Resistance','Plyometric Cardio Circuit'],
  ['Pure Cardio & Cardio Abs','Cardio Power & Resistance','Plyometric Cardio Circuit','Cardio Recovery','Pure Cardio & Cardio Abs','Plyometric Cardio Circuit'],
  ['Core Cardio & Balance','Core Cardio & Balance','Core Cardio & Balance','Core Cardio & Balance','Core Cardio & Balance','Core Cardio & Balance'],
  ['Fit Test','Max Interval Plyo','Max Cardio Conditioning','Max Recovery','Max Interval Circuit','Max Interval Plyo'],
  ['Max Cardio Conditioning','Max Interval Circuit','Max Interval Plyo','Max Recovery','Max Cardio Conditioning & Cardio Abs','Core Cardio & Balance'],
  ['Fit Test','Max Interval Plyo','Max Cardio Conditioning & Cardio Abs','Max Recovery','Max Interval Circuit','Core Cardio & Balance'],
  ['Max Interval Plyo','Max Cardio Conditioning & Cardio Abs','Max Interval Circuit','Core Cardio & Balance','Max Interval Plyo','Max Cardio Conditioning & Cardio Abs']
];
function insanityDueFor(d){const dow=d.getDay();if(dow===0)return null;const start=new Date(INSANITY_START+'T00:00:00');const diffDays=Math.round((new Date(isoDate(d)+'T00:00:00')-start)/86400000);if(diffDays<0)return null;const weekIdx=Math.floor(diffDays/7);const week=INSANITY_WEEKS[weekIdx];if(!week)return null;return week[dow-1]||null}
function activeProgramInsanityEnabled(){const lib=state.programLibrary&&state.programLibrary[state.activeProgramId];return !lib||lib.insanity!==false}
function missedInsanity(){const out=[];const today=new Date(isoDate(nowDate())+'T00:00:00');const d=new Date(INSANITY_START+'T00:00:00');while(d<today){const name=insanityDueFor(d);const iso=isoDate(d);if(name&&!(state.insanity||[]).some(x=>x.date===iso))out.push({date:iso,name});d.setDate(d.getDate()+1)}return out}

const DAILY_TARGETS=[
  ['Calories','4,200–4,600'],
  ['Protein','170–200 g'],
  ['Carbs','450–635 g'],
  ['Fat','90–120 g'],
  ['Water','7 bottles = 3.5 L baseline (+ extra for heavy sweating)']
];
const DAILY_RULES=[
  'Meal calorie numbers are target ranges, not verified food calories',
  'Actual foods get logged using verified nutrition whenever available',
  "Don't go more than 3–3.5 hours without eating",
  "If you're behind by afternoon, start catching up then — not at 10 PM",
  "Night shake adjusts to whatever calories are still needed — it's the adjustable lever, not a fixed add-on",
  'Carbs are especially important around both workouts',
  'Muscle growth, strength and recovery are the priority'
];
const FAVORITE_CATEGORIES=['Breakfast','Lunch','Dinner','Snack','Shake'];
const FAVORITE_ICONS=['🍳','🥓','🧇','🥞','🍞','🥪','🍗','🥩','🍔','🌮','🍜','🍝','🍕','🥗','🍚','🍲','🥙','🍎','🥤','🥛','🍫'];
const BODYPART_RE={chestchamp:/bench|fly|chest|pec/i,backbuilder:/deadlift|row|pulldown|lat pull/i,legday:/squat|leg press|leg extension|leg curl|calf|lunge/i,shoulderforge:/overhead press|military press|lateral raise|rear.delt|shoulder/i,armarsenal:/curl|triceps|tricep|bicep/i};
const BODYPART_ICON={chestchamp:'icons/chestchamp.png',backbuilder:'icons/backbuilder.png',legday:'icons/legday.png',shoulderforge:'icons/shoulderforge.png',armarsenal:'icons/armarsenal.png',rest:'icons/rest.png'};
function dayBodypartIcon(dow){
  const p=state.program[dow];
  if(!p||!p.exercises||!p.exercises.length)return BODYPART_ICON.rest;
  const counts={};
  p.exercises.forEach(e=>{
    if(e.skipped)return;
    for(const id in BODYPART_RE)if(BODYPART_RE[id].test(e.name))counts[id]=(counts[id]||0)+1;
  });
  const top=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
  return top?BODYPART_ICON[top]:BODYPART_ICON.chestchamp;
}
const state=load();
if((state.programVersion||0)<PROGRAM_VERSION){state.program=deep(DEFAULT_PROGRAM);state.programVersion=PROGRAM_VERSION;state.settings.programStartDate=state.settings.programStartDate||isoDate(nowDate());save()}
if((state.stretchVideoVersion||0)<STRETCH_VIDEO_VERSION){Object.keys(state.program).forEach(day=>{const x=state.program[day];if(x.stretchVideo&&!(x.stretchVideos&&x.stretchVideos.length)){x.stretchVideos=[{label:x.name,url:x.stretchVideo}]}delete x.stretchVideo;const def=DEFAULT_PROGRAM[day];if(def&&def.stretchVideos&&!(x.stretchVideos&&x.stretchVideos.length))x.stretchVideos=deep(def.stretchVideos)});state.stretchVideoVersion=STRETCH_VIDEO_VERSION;save()}
if((state.programColorVersion||0)<PROGRAM_COLOR_VERSION){Object.keys(state.program).forEach(day=>{const x=state.program[day],def=DEFAULT_PROGRAM[day];if(!x.color)x.color=(def&&def.color)||'#4aa3ff'});state.programColorVersion=PROGRAM_COLOR_VERSION;save()}
if((state.programTimeVersion||0)<PROGRAM_TIME_VERSION){Object.keys(state.program).forEach(day=>{if(state.program[day].time==='11:00 AM')state.program[day].time='7:30 AM'});state.programTimeVersion=PROGRAM_TIME_VERSION;save()}
if((state.programV3FixVersion||0)<PROGRAM_V3_FIX_VERSION){
  Object.values(state.program).forEach(day=>(day.exercises||[]).forEach(ex=>{
    if((ex.name==='Incline Barbell Bench Press'||ex.name==='Barbell Back Squat'||ex.name==='Barbell Deadlift')&&ex.warmupSets==null)ex.warmupSets=2;
    if((ex.name==='Incline Barbell Bench Press'||ex.name==='Barbell Back Squat')&&ex.rest===150)ex.rest=180;
    if(ex.name==='Standing Barbell Military Press'&&ex.sets===3&&ex.min===8&&ex.max===8){ex.sets=5;ex.min=4;ex.max=4}
  }));
  state.programV3FixVersion=PROGRAM_V3_FIX_VERSION;save()
}
if((state.insanityBackfillVersion||0)<INSANITY_BACKFILL_VERSION){
  const backfill=[
    ['2026-08-17','19:30','Plyometric Cardio Circuit'],
    ['2026-08-21','19:30','Plyometric Cardio Circuit'],
    ['2026-08-24','19:30','Cardio Power & Resistance'],
    ['2026-08-25','19:30','Pure Cardio'],
    ['2026-08-26','19:30','Plyometric Cardio Circuit'],
    ['2026-08-27','19:30','Cardio Recovery'],
    ['2026-08-29','19:30','Cardio Power & Resistance']
  ];
  state.insanity=state.insanity||[];
  backfill.forEach(([date,time,name])=>{if(!state.insanity.some(x=>x.date===date))state.insanity.push({id:uid(),date,endTs:new Date(`${date}T${time}:00`).getTime(),name,duration:'completed'})});
  const wrongAug21=state.insanity.find(x=>x.date==='2026-08-21'&&x.name==='Pure Cardio & Cardio Abs');
  if(wrongAug21)wrongAug21.name='Plyometric Cardio Circuit';
  state.insanityBackfillVersion=INSANITY_BACKFILL_VERSION;save();
}
if((state.insanityCatchupVersion||0)<INSANITY_CATCHUP_VERSION){
  state.insanity=state.insanity||[];
  missedInsanity().forEach(({date,name})=>state.insanity.push({id:uid(),date,endTs:new Date(`${date}T19:30:00`).getTime(),name,duration:'completed'}));
  state.insanityCatchupVersion=INSANITY_CATCHUP_VERSION;save();
}
if((state.gamifyVersion||0)<GAMIFY_VERSION){
  state.xp=state.xp||0;state.badges=state.badges||[];state.gamifyStart=state.gamifyStart||isoDate(nowDate());
  state.gamifyVersion=GAMIFY_VERSION;save();
}
if((state.programLibraryVersion||0)<PROGRAM_LIBRARY_VERSION){
  state.programLibrary=state.programLibrary||{};
  if(!state.programLibrary.mikeOhearn)state.programLibrary.mikeOhearn={label:'Mike O\u2019Hearn 12-Week Power Bodybuilding',program:deep(state.program),startDate:state.settings.programStartDate||isoDate(nowDate())};
  if(!state.programLibrary.upperLowerPB)state.programLibrary.upperLowerPB={label:'Upper/Lower Powerbuilding',program:deep(UPPER_LOWER_PB_PROGRAM),startDate:null};
  state.activeProgramId=state.activeProgramId||'mikeOhearn';
  Object.values(state.programLibrary).forEach(p=>{if(p.insanity===undefined)p.insanity=true});
  state.programLibraryVersion=PROGRAM_LIBRARY_VERSION;save();
}
function levelInfo(xp){xp=xp||0;let level=1,total=0,need=100;while(xp>=total+need){total+=need;level++;need=100+(level-1)*25}return {level,into:xp-total,need,xp}}
function levelTitle(level){if(level<=5)return 'Titan';if(level<=10)return 'Gym Rat';if(level<=20)return 'Conqueror';return 'Juggernaut'}
function sinceStart(dateStr){return dateStr>=(state.gamifyStart||'0000-00-00')}
function myWorkoutsSince(){return (state.workouts||[]).filter(w=>sinceStart(w.date))}
function workoutVolume(w){return (w.exercises||[]).reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0),0),0)}
function mainLiftBestSince(){
  const names=['Incline Barbell Bench Press','Barbell Back Squat','Barbell Deadlift'];
  let best=0;
  myWorkoutsSince().forEach(w=>(w.exercises||[]).forEach(e=>{
    if(e.skipped||!names.includes(canonicalExercise(e.name)))return;
    e.sets.forEach(s=>{if(s.done&&!s.warmup&&s.weight&&s.reps)best=Math.max(best,epley1RM(s.weight,s.reps))});
  }));
  return best;
}
function hatTrickSince(){
  const names=['Incline Barbell Bench Press','Barbell Back Squat','Barbell Deadlift'],firstPr={};
  myWorkoutsSince().forEach(w=>(w.exercises||[]).forEach(e=>{
    if(e.skipped)return;const n=canonicalExercise(e.name);
    if(!names.includes(n)||!e.sets.some(x=>x.pr))return;
    if(!firstPr[n]||w.date<firstPr[n])firstPr[n]=w.date;
  }));
  const ds=Object.values(firstPr);
  if(ds.length<3)return false;
  const times=ds.map(d=>new Date(d+'T00:00:00').getTime());
  return (Math.max(...times)-Math.min(...times))<=6*86400000;
}
function dayStreak(hasDay){let n=0,d=new Date(isoDate(nowDate())+'T00:00:00');while(true){const iso=isoDate(d);if(iso<state.gamifyStart||!hasDay(iso))break;n++;d.setDate(d.getDate()-1)}return n}
function waterStreak(){return dayStreak(iso=>(state.water||[]).filter(w=>w.date===iso).reduce((a,b)=>a+(+b.amountMl||0),0)>=3500)}
function proteinStreak(){return dayStreak(iso=>(state.food||[]).filter(f=>f.date===iso).reduce((a,b)=>a+(+b.protein||0),0)>=170)}
function bodypartWorkoutCount(re){return myWorkoutsSince().filter(w=>(w.exercises||[]).some(e=>!e.skipped&&re.test(e.name))).length}
function myWeightsSince(){return (state.weights||[]).filter(x=>sinceStart(x.date)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}
function weightGainSince(){const list=myWeightsSince();return list.length<2?0:list[list.length-1].value-list[0].value}
function maxWeightSince(){const list=myWeightsSince();return list.length?Math.max(...list.map(x=>x.value)):0}
function weeksIntoProgram(){const start=state.settings.programStartDate;if(!start)return 0;return Math.floor((nowDate()-new Date(start+'T00:00:00'))/86400000/7)}
const BADGE_DEFS=[
  {id:'plates225',cat:'strength',name:'Two Plates',glyph:'225',img:'badges/07_heavy_hitter.png',hint:'A main lift (bench, squat, or deadlift) hits a 225 lb estimated 1RM',check:()=>mainLiftBestSince()>=225},
  {id:'plates315',cat:'strength',name:'Three Plates',glyph:'315',img:'badges/07_heavy_hitter.png',hint:'A main lift hits a 315 lb estimated 1RM',check:()=>mainLiftBestSince()>=315},
  {id:'plates405',cat:'strength',name:'Four Plates',glyph:'405',img:'badges/07_heavy_hitter.png',hint:'A main lift hits a 405 lb estimated 1RM',check:()=>mainLiftBestSince()>=405},
  {id:'session10k',cat:'volume',name:'10K Session',glyph:'10K',img:'badges/08_volume_king.png',hint:'A single workout hits 10,000 lb of volume',check:()=>myWorkoutsSince().some(w=>workoutVolume(w)>=10000)},
  {id:'vol250k',cat:'volume',name:'Quarter Million',glyph:'¼M',img:'badges/08_volume_king.png',hint:'250,000 lb lifted in total',check:()=>myWorkoutsSince().reduce((n,w)=>n+workoutVolume(w),0)>=250000},
  {id:'vol500k',cat:'volume',name:'Half Million',glyph:'½M',img:'badges/08_volume_king.png',hint:'500,000 lb lifted in total',check:()=>myWorkoutsSince().reduce((n,w)=>n+workoutVolume(w),0)>=500000},
  {id:'vol1m',cat:'volume',name:'Million Pound Club',glyph:'1M',img:'badges/08_volume_king.png',hint:'1,000,000 lb lifted in total',check:()=>myWorkoutsSince().reduce((n,w)=>n+workoutVolume(w),0)>=1000000},
  {id:'firstblood',cat:'pr',name:'First Blood',glyph:'PR',img:'badges/06_personal_best.png',hint:'Your first logged PR',check:()=>myWorkoutsSince().some(w=>(w.exercises||[]).some(e=>e.sets.some(s=>s.pr)))},
  {id:'hattrick',cat:'pr',name:'Hat Trick',glyph:'3×',hint:'A PR on bench, squat, and deadlift in the same week',check:hatTrickSince},
  {id:'comeback',cat:'grit',name:'The Comeback',glyph:'↺',hint:'Reopen a finished workout and complete it',check:()=>myWorkoutsSince().some(w=>w.reopened)},
  {id:'freelancer',cat:'grit',name:'Freelancer',glyph:'+1',hint:'Log an exercise outside the plan with + ADD EXERCISE',check:()=>myWorkoutsSince().some(w=>(w.exercises||[]).some(e=>e.added))},
  {id:'ironwill',cat:'grit',name:'Iron Will',glyph:'10',img:'badges/04_workout_warrior.png',hint:'Finish 10 workouts with every set checked off',check:()=>myWorkoutsSince().filter(w=>w.allSetsDone).length>=10},
  {id:'hydrated',cat:'consistency',name:'Hydrated',glyph:'H₂O',img:'badges/17_hydration_hero.png',hint:'Hit your 3.5 L water target 7 days in a row',check:()=>waterStreak()>=7},
  {id:'dialedin',cat:'consistency',name:'Dialed In',glyph:'P',img:'badges/14_protein_target.png',hint:'Hit your 170 g protein target 7 days in a row',check:()=>proteinStreak()>=7},
  {id:'phase1',cat:'program',name:'Phase 1 Complete',glyph:'I',hint:'Weeks 1–4 of the 12-week program finished',check:()=>weeksIntoProgram()>=4},
  {id:'phase2',cat:'program',name:'Phase 2 Complete',glyph:'II',hint:'Weeks 5–8 of the 12-week program finished',check:()=>weeksIntoProgram()>=8},
  {id:'phase3',cat:'program',name:'Phase 3 Complete',glyph:'III',hint:'The full 12-week program finished',check:()=>weeksIntoProgram()>=12},
  {id:'century',cat:'program',name:'Century',glyph:'100',img:'badges/05_iron_discipline.png',hint:'100 workouts logged',check:()=>myWorkoutsSince().length>=100},
  {id:'firststep',cat:'consistency',name:'First Step',glyph:'1',img:'badges/01_first_step.png',hint:'Your first logged workout',check:()=>myWorkoutsSince().length>=1},
  {id:'chestchamp',cat:'training',name:'Chest Champion',glyph:'CH',img:'badges/09_chest_champion.png',hint:'20 workouts that included chest work',check:()=>bodypartWorkoutCount(/bench|fly|chest|pec/i)>=20},
  {id:'backbuilder',cat:'training',name:'Back Builder',glyph:'BK',img:'badges/10_back_builder.png',hint:'20 workouts that included back work',check:()=>bodypartWorkoutCount(/deadlift|row|pulldown|lat pull/i)>=20},
  {id:'legday',cat:'training',name:'Leg Day Legend',glyph:'LG',img:'badges/11_leg_day_legend.png',hint:'20 workouts that included leg work',check:()=>bodypartWorkoutCount(/squat|leg press|leg extension|leg curl|calf|lunge/i)>=20},
  {id:'shoulderforge',cat:'training',name:'Shoulder Forge',glyph:'SH',img:'badges/12_shoulder_forge.png',hint:'20 workouts that included shoulder work',check:()=>bodypartWorkoutCount(/overhead press|military press|lateral raise|rear.delt|shoulder/i)>=20},
  {id:'armarsenal',cat:'training',name:'Arm Arsenal',glyph:'AR',img:'badges/13_arm_arsenal.png',hint:'20 workouts that included arm work',check:()=>bodypartWorkoutCount(/curl|triceps|tricep|bicep/i)>=20},
  {id:'fivepound',cat:'bodyweight',name:'Five-Pound Gain',glyph:'+5',img:'badges/21_five_pound_gain.png',hint:'Gained 5 lb since you started logging',check:()=>weightGainSince()>=5},
  {id:'tenpound',cat:'bodyweight',name:'Ten-Pound Gain',glyph:'+10',img:'badges/22_ten_pound_gain.png',hint:'Gained 10 lb since you started logging',check:()=>weightGainSince()>=10},
  {id:'twohundred',cat:'bodyweight',name:'200-Pound Milestone',glyph:'200',img:'badges/23_two_hundred_milestone.png',hint:'Logged a bodyweight of 200 lb or more',check:()=>maxWeightSince()>=200},
  {id:'masstitan',cat:'bodyweight',name:'Mass Titan',glyph:'220',img:'badges/25_mass_titan.png',hint:'Logged a bodyweight of 220 lb or more',check:()=>maxWeightSince()>=220},
];
function fmtSet(x){return `${x.weight}×${x.reps}`}
function badgeAchievementDetail(id){
  const names=['Incline Barbell Bench Press','Barbell Back Squat','Barbell Deadlift'];
  const mkLine=(hit)=>hit?`<div class="pr-line">${esc(hit.name)} — ${fmtSet(hit)}${hit.prType?` <span class="pr-line-tag">${esc(hit.prType)}</span>`:''}</div>`:'';
  if(id==='plates225'||id==='plates315'||id==='plates405'){
    const hit=mainLiftBestSetSince();
    return {lines:hit?[mkLine(hit),`<div class="muted" style="margin-top:6px">Estimated 1RM: ${Math.round(hit.y).toLocaleString()} lb, on ${hit.date}</div>`]:['<div class="muted">No matching set found.</div>'],workoutId:hit&&hit.workoutId};
  }
  if(id==='session10k'){
    const hit=bestVolumeWorkoutSince();
    return {lines:hit?[`<div class="pr-line">${esc(hit.name)} — ${Math.round(hit.v).toLocaleString()} lb total</div>`,`<div class="muted" style="margin-top:6px">${hit.date}</div>`]:[],workoutId:hit&&hit.workoutId};
  }
  if(id==='vol250k'||id==='vol500k'||id==='vol1m'){
    const c=cumulativeVolumeSince();
    return {lines:[`<div class="pr-line">${Math.round(c.total).toLocaleString()} lb lifted across ${c.count} workout${c.count===1?'':'s'}</div>`,`<div class="muted" style="margin-top:6px">Most recent: ${c.lastDate||'—'}</div>`],workoutId:null};
  }
  if(id==='firstblood'){
    const hit=firstPRSince();
    return {lines:hit?[mkLine(hit)]:['<div class="muted">No PR found.</div>'],workoutId:hit&&hit.workoutId};
  }
  if(id==='hattrick'){
    const det=hatTrickDetail();
    const lines=names.map(n=>det[n]?mkLine(det[n]):`<div class="muted">${esc(n)}: —</div>`);
    return {lines,workoutId:null};
  }
  if(id==='comeback'){
    const hit=reopenedWorkoutSince();
    return {lines:hit?[`<div class="pr-line">${esc(hit.name)} — reopened and finished</div>`,`<div class="muted" style="margin-top:6px">${hit.date}</div>`]:[],workoutId:hit&&hit.id};
  }
  if(id==='freelancer'){
    const hit=freelanceWorkoutSince();
    return {lines:hit?[`<div class="pr-line">${esc(hit.exName)} — added mid-workout on ${esc(hit.name)} day</div>`,`<div class="muted" style="margin-top:6px">${hit.date}</div>`]:[],workoutId:hit&&hit.workoutId};
  }
  if(id==='ironwill'){
    const list=allSetsDoneListSince();
    return {lines:[`<div class="pr-line">${list.length} workouts finished with every set checked off</div>`],workoutId:list.length?list[list.length-1].id:null};
  }
  if(id==='hydrated'){
    const n=waterStreak();
    return {lines:[`<div class="pr-line">3.5 L water target hit ${n} days in a row, ending today</div>`],workoutId:null};
  }
  if(id==='dialedin'){
    const n=proteinStreak();
    return {lines:[`<div class="pr-line">170 g protein target hit ${n} days in a row, ending today</div>`],workoutId:null};
  }
  if(id==='phase1'||id==='phase2'||id==='phase3'){
    const w=weeksIntoProgram();
    return {lines:[`<div class="pr-line">Week ${w} of your program, started ${esc(state.settings.programStartDate||'—')}</div>`],workoutId:null};
  }
  if(id==='century'){
    const hit=centuryWorkoutSince();
    return {lines:hit?[`<div class="pr-line">Workout #100: ${esc(hit.name)}</div>`,`<div class="muted" style="margin-top:6px">${hit.date}</div>`]:[],workoutId:hit&&hit.id};
  }
  if(id==='firststep'){
    const list=[...myWorkoutsSince()].sort((a,b)=>a.date.localeCompare(b.date));
    const hit=list[0];
    return {lines:hit?[`<div class="pr-line">${esc(hit.name)} — your first logged workout</div>`,`<div class="muted" style="margin-top:6px">${hit.date}</div>`]:[],workoutId:hit&&hit.id};
  }
  if(BODYPART_RE[id]){
    const re=BODYPART_RE[id],n=bodypartWorkoutCount(re);
    const recent=[...myWorkoutsSince()].reverse().find(w=>(w.exercises||[]).some(e=>!e.skipped&&re.test(e.name)));
    return {lines:[`<div class="pr-line">${n} workouts with this bodypart trained</div>`,recent?`<div class="muted" style="margin-top:6px">Most recent: ${esc(recent.name)}, ${recent.date}</div>`:''],workoutId:recent&&recent.id};
  }
  if(id==='fivepound'||id==='tenpound'){
    const g=weightGainSince(),list=myWeightsSince();
    return {lines:[`<div class="pr-line">+${Math.round(g*10)/10} lb since ${list[0]?list[0].date:'you started logging'}</div>`],workoutId:null};
  }
  if(id==='twohundred'||id==='masstitan'){
    const list=myWeightsSince(),hit=list.reduce((b,x)=>!b||x.value>b.value?x:b,null);
    return {lines:hit?[`<div class="pr-line">${hit.value} lb, logged ${hit.date}</div>`]:[],workoutId:null};
  }
  return {lines:[],workoutId:null};
}
function mainLiftBestSetSince(){
  const names=['Incline Barbell Bench Press','Barbell Back Squat','Barbell Deadlift'];
  let best=null;
  myWorkoutsSince().forEach(w=>(w.exercises||[]).forEach(e=>{
    if(e.skipped||!names.includes(canonicalExercise(e.name)))return;
    e.sets.forEach(s=>{if(s.done&&!s.warmup&&s.weight&&s.reps){const y=epley1RM(s.weight,s.reps);if(!best||y>best.y)best={date:w.date,workoutId:w.id,name:e.name,weight:s.weight,reps:s.reps,y,prType:s.pr||''}}});
  }));
  return best;
}
function bestVolumeWorkoutSince(){
  let best=null;
  myWorkoutsSince().forEach(w=>{const v=workoutVolume(w);if(!best||v>best.v)best={date:w.date,workoutId:w.id,name:w.name,v}});
  return best;
}
function cumulativeVolumeSince(){
  let total=0,count=0,lastDate=null;
  myWorkoutsSince().forEach(w=>{total+=workoutVolume(w);count++;if(!lastDate||w.date>lastDate)lastDate=w.date});
  return {total,count,lastDate};
}
function firstPRSince(){
  let best=null;
  [...myWorkoutsSince()].sort((a,b)=>a.date.localeCompare(b.date)).forEach(w=>{
    if(best)return;
    (w.exercises||[]).forEach(e=>{if(best)return;const s=(e.sets||[]).find(x=>x.pr);if(s)best={date:w.date,workoutId:w.id,name:e.name,weight:s.weight,reps:s.reps,prType:s.pr}});
  });
  return best;
}
function hatTrickDetail(){
  const names=['Incline Barbell Bench Press','Barbell Back Squat','Barbell Deadlift'],firstPr={};
  myWorkoutsSince().forEach(w=>(w.exercises||[]).forEach(e=>{
    if(e.skipped)return;const n=canonicalExercise(e.name);
    if(!names.includes(n))return;
    const s=(e.sets||[]).find(x=>x.pr);
    if(s&&(!firstPr[n]||w.date<firstPr[n].date))firstPr[n]={date:w.date,workoutId:w.id,name:e.name,weight:s.weight,reps:s.reps,prType:s.pr};
  }));
  return firstPr;
}
function reopenedWorkoutSince(){return myWorkoutsSince().find(w=>w.reopened)||null}
function freelanceWorkoutSince(){
  let found=null;
  myWorkoutsSince().forEach(w=>{if(found)return;const e=(w.exercises||[]).find(x=>x.added);if(e)found={date:w.date,workoutId:w.id,name:w.name,exName:e.name}});
  return found;
}
function allSetsDoneListSince(){return myWorkoutsSince().filter(w=>w.allSetsDone)}
function centuryWorkoutSince(){const list=[...myWorkoutsSince()].sort((a,b)=>a.date.localeCompare(b.date));return list.length>=100?list[99]:null}
function badgeDetailModal(id){
  const def=BADGE_DEFS.find(d=>d.id===id);if(!def)return;
  const got=(state.badges||[]).find(b=>b.id===id);if(!got)return;
  const det=badgeAchievementDetail(id);
  const overlay=document.createElement('div');overlay.className='modal';
  overlay.innerHTML=`<div class="modal-card" style="text-align:center"><div class="row between"><div class="modal-title" style="text-align:left">${esc(def.name)}</div><button class="btn small ghost" data-close>Close</button></div><div style="width:84px;margin:14px auto 6px">${badgeIcon(def,true)}</div><div class="muted" style="margin-bottom:14px">Earned ${esc(got.date)}</div><div style="text-align:left">${det.lines.join('')}</div>${det.workoutId?`<button class="btn ghost full" style="margin-top:16px" data-view-workout="${esc(det.workoutId)}">VIEW FULL WORKOUT</button>`:''}</div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-close]').onclick=()=>overlay.remove();
  const vw=overlay.querySelector('[data-view-workout]');
  if(vw)vw.onclick=()=>{overlay.remove();showHistory(vw.dataset.viewWorkout)};
}

function checkBadges(){
  const earned=new Set((state.badges||[]).map(b=>b.id)),unlocked=[];
  BADGE_DEFS.forEach(def=>{
    if(earned.has(def.id)||!def.check())return;
    state.badges=state.badges||[];
    state.badges.push({id:def.id,date:isoDate(nowDate())});
    unlocked.push(def.name);
  });
  if(unlocked.length){
    save();
    toast(unlocked.length===1?'Badge unlocked — '+unlocked[0]:unlocked.length+' badges unlocked — '+unlocked.join(', '));
  }
  return unlocked.length;
}
function revalidateBadges(ids){
  const removed=[];
  state.badges=(state.badges||[]).filter(b=>{
    if(!ids.includes(b.id))return true;
    const def=BADGE_DEFS.find(d=>d.id===b.id);
    if(def&&!def.check()){removed.push(def.name);return false}
    return true;
  });
  return removed;
}
function awardXP(amount){
  const before=levelInfo(state.xp).level;
  state.xp=(state.xp||0)+amount;
  const after=levelInfo(state.xp).level;
  save();
  setTimeout(()=>{
    if(after>before){
      toast(`LEVEL UP — ${after} · ${levelTitle(after)}`);
      setTimeout(checkBadges,1800);
    }else{
      checkBadges();
    }
  },1800);
}

function lastPage(){try{const p=localStorage.getItem(PAGE_KEY);return PAGE_ORDER.includes(p)?p:'home'}catch{return 'home'}}
function setPage(p){ui.page=p;try{localStorage.setItem(PAGE_KEY,p)}catch{}const t=document.getElementById('toast');if(t)t.classList.remove('show')}
let ui={page:lastPage(),historyFilter:'all',session:state.activeWorkout||null,restEnds:0,restTimer:null,modal:null,editingProgram:false,editingFavorites:false,historyDate:'',volumeRange:'3m',e1rmExercise:'',e1rmRange:'6m',expandedSets:new Set(),progressTab:'overview',workoutsDay:null,historyCalMonth:'',foodCalMonth:''};
let homeTimer=null;
function defaults(){return {workouts:[],food:[],weights:[],activeWorkout:null,settings:{weightStep:5,restDefault:90},insanity:[],program:deep(DEFAULT_PROGRAM),programVersion:0,stretchVideoVersion:0,water:[],favorites:[],xp:0,badges:[],gamifyStart:isoDate(nowDate())}}
function progDays(){return WEEK_ORDER.filter(d=>state.program[d])}
function saveActiveProgramToLibrary(){
  const lib=state.programLibrary&&state.programLibrary[state.activeProgramId];
  if(!lib)return;
  lib.program=deep(state.program);
  lib.startDate=state.settings.programStartDate;
}
function switchProgram(id){
  if(id===state.activeProgramId)return;
  const target=state.programLibrary[id];
  if(!target){toast('That program no longer exists.');return}
  if(state.activeWorkout){toast('Finish or cancel your in-progress workout first.');return}
  saveActiveProgramToLibrary();
  state.program=deep(target.program);
  if(!target.startDate)target.startDate=isoDate(nowDate());
  state.settings.programStartDate=target.startDate;
  state.activeProgramId=id;
  save();
  toast('Switched to '+target.label+'.');
  render();
}
function addNewProgramModal(){
  const label=(prompt('Name this program')||'').trim();
  if(!label)return;
  const id='p'+uid();
  saveActiveProgramToLibrary();
  state.programLibrary[id]={label,program:{},startDate:isoDate(nowDate()),insanity:true};
  state.program={};
  state.settings.programStartDate=state.programLibrary[id].startDate;
  state.activeProgramId=id;
  ui.editingProgram=true;
  save();
  toast(label+' created — add your days and exercises below.');
  render();
}
function renameProgramPrompt(id){
  const lib=state.programLibrary[id];if(!lib)return;
  const label=(prompt('Rename program',lib.label)||'').trim();
  if(!label)return;
  lib.label=label;save();render();
}
function deleteProgramPrompt(id){
  if(id===state.activeProgramId){toast('Switch to a different program before deleting this one.');return}
  const lib=state.programLibrary[id];if(!lib)return;
  if(!confirm(`Delete "${lib.label}"? Its exercise list is removed, but any workouts you already logged under it stay in your history.`))return;
  delete state.programLibrary[id];save();render();
}

function currentPhaseIdx(){const start=state.settings.programStartDate;if(!start)return 0;const days=Math.floor((nowDate()-new Date(start+'T00:00:00'))/86400000);const week=Math.floor(days/7);return Math.min(PHASE_REPS.length-1,Math.max(0,Math.floor(week/4)))}
function currentWeekNum(){const start=state.settings.programStartDate;if(!start)return 1;const days=Math.floor((nowDate()-new Date(start+'T00:00:00'))/86400000);return Math.max(1,Math.floor(days/7)+1)}
function parseTimeStr(s){const m=/^(\d{1,2}):(\d{2})\s*([AP]M)?$/i.exec(String(s||'').trim());if(!m)return null;let h=+m[1];const mm=+m[2];if(m[3]){const ap=m[3].toUpperCase();if(ap==='PM'&&h!==12)h+=12;if(ap==='AM'&&h===12)h=0}return h*60+mm}
function waterToday(){const iso=isoDate(nowDate());return (state.water||[]).filter(w=>w.date===iso).reduce((a,b)=>a+(+b.amountMl||0),0)}
function logWater(ml){const t=new Date();state.water=state.water||[];state.water.push({id:uid(),date:isoDate(t),time:t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),amountMl:ml});save()}
function load(){try{return Object.assign(defaults(),JSON.parse(localStorage.getItem(APP_KEY)||'{}'))}catch{return defaults()}}
function save(){localStorage.setItem(APP_KEY,JSON.stringify(state))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}
function histFor(ex){const aliases=ex.history||[ex.name];const names=aliases.includes(ex.name)?aliases:[...aliases,ex.name];const bundled=(window.FITNOTES_HISTORY||[]).filter(h=>aliases.includes(h.exercise));const logged=state.workouts.flatMap(w=>(w.exercises||[]).filter(e=>!e.skipped&&names.includes(e.name)).map(e=>({date:w.date,exercise:e.name,sets:e.sets.filter(s=>s.done&&!s.warmup)}))).filter(h=>h.sets.length);return [...bundled,...logged].sort((a,b)=>b.date.localeCompare(a.date))}
function latestHist(ex){return histFor(ex)[0]||null}
function formatSets(sets){return sets.filter(s=>s.weight!=null||s.reps!=null).map(s=>`${s.weight??'–'}×${s.reps??'–'}`).join(', ')}
function lastLine(ex){const h=latestHist(ex);if(!h)return 'No matching FitNotes history yet';const label=h.exercise===ex.name?'Last':'Comparable FitNotes • '+h.exercise;return `${label} ${h.date}: ${formatSets(h.sets)}`}
function suggestion(ex){if(ex.pct){if(!ex.oneRM)return `Enter your 1RM (Edit Program) to get a target weight for this ${Math.round(ex.pct*100)}% phase.`;const target=Math.round(ex.oneRM*ex.pct/5)*5;return `${Math.round(ex.pct*100)}% phase target: ${target} lb for ${ex.min===ex.max?ex.min:ex.min+'-'+ex.max} reps × ${ex.sets} sets.`}const h=latestHist(ex);if(!h)return 'Start conservative and leave about 3 RIR.';const valid=h.sets.filter(s=>s.weight&&s.reps);if(!valid.length)return 'Use the previous session as a technique baseline.';const work=valid.slice(-Math.min(ex.sets,valid.length));const minRep=Math.min(...work.map(s=>s.reps));const maxWt=Math.max(...work.map(s=>s.weight));if(minRep>=ex.max)return `Progression: consider ${maxWt+(ex.step||5)} lb if warm-ups feel good.`;return `Baseline: work around ${maxWt} lb and beat reps before adding load.`}
function startWorkout(day){
  if(state.activeWorkout){ui.session=state.activeWorkout;renderSession();return}
  const d=nowDate(), useDay=day!=null?day:d.getDay(), p=state.program[useDay]; if(!p){toast('No plan for that day yet.');return} if(!p.exercises.length){toast('Add exercises to this plan first (Edit Program).');return}
  const phaseIdx=currentPhaseIdx();
  const WARMUP_PCTS=[0.5,0.7,0.85];
  const exercises=p.exercises.map(e=>{const min=e.phased?e.reps[phaseIdx]:e.monthReps?e.monthReps[phaseIdx]:e.min,max=e.phased?e.reps[phaseIdx]:e.monthReps?e.monthReps[phaseIdx]:e.max,pct=e.phased?e.pct[phaseIdx]:null;const last=latestHist(e);const lastWork=last?last.sets.filter(s=>s.weight!=null||s.reps!=null):[];const pctWeight=pct&&e.oneRM?Math.round(e.oneRM*pct/5)*5:0;const seedWeight=pctWeight||(lastWork.length?lastWork[lastWork.length-1].weight||0:(e.startWeight||0));const step=e.step||5;const warmupSets=(e.warmupSets?WARMUP_PCTS.slice(0,e.warmupSets):[]).map(wp=>({id:uid(),weight:seedWeight?Math.round((seedWeight*wp)/step)*step:0,reps:min,warmup:true,effort:'',done:false}));const workSets=Array.from({length:e.sets},(_,i)=>({id:uid(),weight:seedWeight||0,reps:min,warmup:false,effort:'',done:false}));return {id:uid(),name:e.name,history:e.history,planned:{sets:e.sets,min,max},pct,oneRM:e.oneRM||0,step,rest:e.rest??90,notes:e.notes||'',skipped:false,sets:[...warmupSets,...workSets]}});
  state.activeWorkout={id:uid(),type:'strength',date:isoDate(d),name:p.name,color:p.color||'#4aa3ff',stretchVideos:p.stretchVideos||[],startTs:Date.now(),exercises};save();ui.session=state.activeWorkout;renderSession();
}
function render(){ if(ui.session){renderSession();return} const app=document.getElementById('app');app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="brand">BODY <span>GOALS</span></div><div class="tagline">DISCIPLINE. CONSISTENCY. RESULTS.</div></header><main id="main"></main>${nav()}</div>`; document.getElementById('main').innerHTML=pageHTML();bindCommon();if(ui.page==='home'){if(!homeTimer)homeTimer=setInterval(()=>{if(ui.page==='home'&&!ui.session)render();else{clearInterval(homeTimer);homeTimer=null}},30000)}else if(homeTimer){clearInterval(homeTimer);homeTimer=null}}
function nav(){return `<nav class="bottom-nav"><div class="bottom-nav-inner">${[['home','⌂','HOME'],['workouts','<img src="me-icon.jpg" class="nav-photo">','WORKOUTS'],['food','<img src="food-icon.jpg" class="nav-photo">','FOOD'],['progress','▥','PROGRESS'],['more','•••','MORE']].map(x=>`<button class="nav-btn ${ui.page===x[0]?'active':''}" data-page="${x[0]}"><span class="ico">${x[1]}</span>${x[2]}</button>`).join('')}</div></nav>`}
function pageHTML(){return ui.page==='workouts'?workoutsPage():ui.page==='food'?foodPage():ui.page==='progress'?progressPage():ui.page==='more'?morePage():homePage()}
function fmtNowHeader(d){const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];const months=['January','February','March','April','May','June','July','August','September','October','November','December'];const h=d.getHours(),m=d.getMinutes(),ap=h>=12?'PM':'AM',hh=((h+11)%12)+1;return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} · ${hh}:${String(m).padStart(2,'0')} ${ap}`}
function mainLiftCurrentPRs(){
  const lifts=[['Incline Barbell Bench Press','Bench'],['Barbell Back Squat','Squat'],['Barbell Deadlift','Deadlift']];
  return lifts.map(([name,short])=>{
    const series=exercise1RMSeries(name);
    const best=series.length?series.reduce((b,p)=>p.y>b.y?p:b,series[0]):null;
    return {name,short,best};
  });
}
function showLiftPRDetail(name,best){
  const map=exerciseAliasMap();
  const w=state.workouts.find(w=>w.date===best.date&&(w.exercises||[]).some(e=>!e.skipped&&canonicalExercise(e.name,map)===name));
  let setInfo=null;
  if(w){
    const ex=w.exercises.find(e=>!e.skipped&&canonicalExercise(e.name,map)===name);
    const sets=ex.sets.filter(s=>s.done&&!s.warmup&&s.weight&&s.reps);
    setInfo=sets.length?sets.reduce((b,s)=>epley1RM(s.weight,s.reps)>epley1RM(b.weight,b.reps)?s:b,sets[0]):null;
  }else{
    const h=(window.FITNOTES_HISTORY||[]).find(h=>h.date===best.date&&canonicalExercise(h.exercise,map)===name);
    if(h){
      const sets=(h.sets||[]).filter(s=>s.weight&&s.reps);
      setInfo=sets.length?sets.reduce((b,s)=>epley1RM(s.weight,s.reps)>epley1RM(b.weight,b.reps)?s:b,sets[0]):null;
    }
  }
  const overlay=document.createElement('div');overlay.className='modal';
  overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">${esc(name)}</div><button class="btn small ghost" data-close>Close</button></div><div class="metric-grid" style="margin-top:14px"><div class="metric"><div class="subtle">🏆 EST. 1RM</div><div class="val">${Math.round(best.y).toLocaleString()} lb</div></div><div class="metric"><div class="subtle">📅 DATE</div><div class="val" style="font-size:16px">${esc(best.date)}</div></div></div>${setInfo?`<div class="history-item" style="margin-top:14px"><b>${setInfo.weight} × ${setInfo.reps}</b><div class="muted">The set behind this estimate</div></div>`:''}${w?`<button class="btn ghost full" style="margin-top:14px" data-view-pr-workout="${w.id}">VIEW FULL WORKOUT</button>`:''}</div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-close]').onclick=()=>overlay.remove();
  const vw=overlay.querySelector('[data-view-pr-workout]');
  if(vw)vw.onclick=()=>{overlay.remove();showHistory(w.id)};
}
let badgeSvgSeq=0;
const BADGE_PALETTES={
  strength:{stops:['#ffd9b0','#ff9a4d','#d1560f','#7a2a0a'],stroke:'#c25e12',glow:'#ff9a4d'},
  volume:{stops:['#d6f3ff','#5fc2f0','#1c7fb8','#0d3d5e'],stroke:'#2b8fc4',glow:'#5fc2f0'},
  pr:{stops:['#fff3c4','#ffd76f','#c98f1e','#8a5e12'],stroke:'#c9a13a',glow:'#ffd76f'},
  consistency:{stops:['#d4ffce','#6fe07c','#218838','#0f4a1c'],stroke:'#3aa84f',glow:'#6fe07c'},
  grit:{stops:['#ecd6ff','#b06bf5','#7a1fd4','#3d0f6b'],stroke:'#9a4be8',glow:'#b06bf5'},
  program:{stops:['#f2f2f5','#c4c4cf','#84848f','#45454e'],stroke:'#a8a8b4','glow':'#c4c4cf'},
};
function badgeIcon(def,earned){
  if(def.img)return `<img src="${esc(def.img)}" class="badge-icon badge-icon-img ${earned?'':'locked'}" alt="" loading="lazy">`;
  return badgeIconSVG(def.glyph,earned,def.cat);
}
function badgeIconSVG(glyph,earned,cat){
  const uidS='bg'+(badgeSvgSeq++);
  const pal=BADGE_PALETTES[cat]||BADGE_PALETTES.pr;
  const shield='M32 3 L58 13 V32 C58 47 47 57 32 61 C17 57 6 47 6 32 V13 Z';
  const fill=earned?`url(#${uidS})`:'#1c1c1c';
  const stroke=earned?pal.stroke:'#333';
  const glow=earned?`<path d="${shield}" fill="${fill}" stroke="${stroke}" stroke-width="2" filter="url(#${uidS}g)"/>`:`<path d="${shield}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const shine=earned?`<path d="${shield}" fill="url(#${uidS}s)" opacity="0.5" style="mix-blend-mode:overlay"/>`:'';
  return `<svg viewBox="0 0 64 64" class="badge-icon" aria-hidden="true"><defs><radialGradient id="${uidS}" cx="38%" cy="30%" r="75%"><stop offset="0%" stop-color="${pal.stops[0]}"/><stop offset="35%" stop-color="${pal.stops[1]}"/><stop offset="75%" stop-color="${pal.stops[2]}"/><stop offset="100%" stop-color="${pal.stops[3]}"/></radialGradient><linearGradient id="${uidS}s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="45%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="${uidS}g" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="${pal.glow}" flood-opacity="0.6"/></filter></defs>${glow}${shine}<text x="32" y="37" text-anchor="middle" font-size="${glyph.length>3?14:18}" font-weight="900" fill="${earned?'#1a1206':'#666'}">${esc(glyph)}</text></svg>`;
}

function levelLineHTML(compact){const info=levelInfo(state.xp),title=levelTitle(info.level),pct=info.need?Math.round(info.into/info.need*100):0;return `<div class="level-line" ${compact?'data-goto-badges':''}><div class="row between"><span>LEVEL ${info.level} · ${esc(title)}</span><span class="subtle">${info.into}/${info.need} XP</span></div><div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div></div>`}
function homePage(){
  const d=nowDate();
  const todayFoods=state.food.filter(f=>f.date===isoDate(d));
  const c=todayFoods.reduce((a,b)=>a+(+b.calories||0),0),pr=todayFoods.reduce((a,b)=>a+(+b.protein||0),0);
  const prs=mainLiftCurrentPRs();
  const earned=[...(state.badges||[])].sort((a,b)=>b.date.localeCompare(a.date));
  const recentBadges=earned.slice(0,6).map(b=>BADGE_DEFS.find(def=>def.id===b.id)).filter(Boolean);
  return `<div class="page">
    <div class="muted" style="text-align:center;margin-bottom:14px;font-size:14px">${fmtNowHeader(d)}</div>
    ${levelLineHTML(true)}
    <div class="card"><div class="section-title">CURRENT PRs</div><div class="metric-grid">${prs.map(p=>`<div class="metric" ${p.best?`style="cursor:pointer" data-pr-lift="${esc(p.name)}"`:''}><div class="subtle">🏆 ${esc(p.short)}</div><div class="val">${p.best?Math.round(p.best.y).toLocaleString()+' lb':'—'}</div>${p.best?`<div class="subtle" style="margin-top:2px">${esc(p.best.date)}</div>`:''}</div>`).join('')}</div></div>
    <div class="card"><div class="row between"><div class="section-title">TROPHIES</div><button class="btn small ghost" data-goto-badges>${(state.badges||[]).length} of ${BADGE_DEFS.length}</button></div>${recentBadges.length?`<div class="badge-grid">${recentBadges.map(def=>`<div class="badge-tile earned" data-badge-id="${esc(def.id)}">${badgeIcon(def,true)}<div class="badge-name">${esc(def.name)}</div></div>`).join('')}</div>`:'<div class="history-empty">No trophies yet — log a workout, hit a PR, or build a streak to start earning them.</div>'}</div>
    <div class="metric-grid"><div class="metric"><div class="subtle">🔥 CALORIES LOGGED</div><div class="val">${Math.round(c)}</div></div><div class="metric"><div class="subtle">💪 PROTEIN LOGGED</div><div class="val">${Math.round(pr)} g</div></div><div class="metric"><div class="subtle">💧 WATER LOGGED</div><div class="val">${(waterToday()/1000).toFixed(1)} / 3.5 L</div></div></div>
  </div>`;
}
function weekHTML(){const d=nowDate();const day=d.getDay();const selDow=ui.workoutsDay==null?day:ui.workoutsDay;const monday=new Date(d);monday.setDate(d.getDate()-((day+6)%7));return `<div class="week">${Array.from({length:7},(_,i)=>{const x=new Date(monday);x.setDate(monday.getDate()+i);const logged=state.workouts.some(w=>w.date===isoDate(x))||state.insanity.some(w=>w.date===isoDate(x));return `<div class="day-chip ${isoDate(x)===isoDate(d)?'today':''} ${x.getDay()===selDow?'selected':''} ${logged?'logged':''}" style="cursor:pointer" data-daychip="${x.getDay()}"><div class="chip-icon"><img src="${dayBodypartIcon(x.getDay())}" alt=""></div><div class="dow">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div><div class="num">${x.getDate()}</div><div class="dot"></div></div>`}).join('')}</div>`}
function insanityCatchupHTML(){if(!activeProgramInsanityEnabled())return '';const m=missedInsanity();return m.length?`<div class="muted" style="margin-top:14px">${m.length} past Insanity day${m.length===1?'':'s'} not logged <button class="btn small primary" data-insanity-catchup>🔁 CATCH UP</button></div>`:''}
function insanityCatchupModal(){const missed=missedInsanity();if(!missed.length){toast('Nothing to catch up on.');return}const picked=new Set(missed.map(m=>m.date));const overlay=document.createElement('div');overlay.className='modal';const draw=()=>{overlay.innerHTML=`<div class="modal-card"><div class="row between"><div><div class="modal-title">Catch Up Insanity</div><div class="muted">Untick any day you actually missed.</div></div><button class="btn small ghost" data-close>Close</button></div>${missed.map(m=>`<div class="history-item"><div class="row between"><div><b>${esc(m.name)}</b><div class="muted">${m.date}</div></div><button class="mini-toggle ${picked.has(m.date)?'on':'danger'}" data-pick="${m.date}">${picked.has(m.date)?'DID IT':'SKIPPED'}</button></div></div>`).join('')}<button class="btn primary full" style="margin-top:14px" data-confirm ${picked.size?'':'disabled'}>${picked.size?`✅ LOG ${picked.size} DAY${picked.size===1?'':'S'}`:'NOTHING SELECTED'}</button></div>`;overlay.querySelector('[data-close]').onclick=()=>overlay.remove();overlay.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const d=b.dataset.pick;picked.has(d)?picked.delete(d):picked.add(d);draw()});const c=overlay.querySelector('[data-confirm]');if(picked.size)c.onclick=()=>{state.insanity=state.insanity||[];const add=missed.filter(m=>picked.has(m.date));add.forEach(m=>{if(!state.insanity.some(x=>x.date===m.date))state.insanity.push({id:uid(),date:m.date,endTs:new Date(`${m.date}T19:30:00`).getTime(),name:m.name,duration:'completed'})});save();overlay.remove();toast(`${add.length} Insanity day${add.length===1?'':'s'} logged.`);render()}};draw();document.body.appendChild(overlay)}

function workoutsPage(){const d=nowDate(),insanityToday=activeProgramInsanityEnabled()&&d.getDay()>=1&&d.getDay()<=6;const progress=programProgressHTML();return `<div class="page"><img src="me-gym.jpg" class="workout-banner"><div class="card">${progress}<div style="margin-top:14px">${weekHTML()}</div></div>${insanityToday?`<div class="card"><div class="row between"><div class="muted">7:30 PM Insanity: <b>${esc(insanityDueFor(d)||'planned')}</b></div>${state.insanity.some(x=>x.date===isoDate(d))?`<span class="badge">DONE</span> <button class="mini-toggle" data-insanity-undo="${isoDate(d)}">Undo</button>`:'<button class="btn small primary" data-log-insanity>⚡ LOG</button>'}</div>${insanityCatchupHTML()}</div>`:''}${ui.editingProgram?'':selectedDayCardHTML(d)}${ui.editingProgram?`<div class="card"><div class="row between"><div class="section-title">EDIT PROGRAM</div><button class="btn small primary" data-toggle-edit-program>DONE</button></div>${programEditHTML()}</div>`:''}${historySection()}</div>`}
function programProgressHTML(){
  const start=state.settings.programStartDate;
  const switcher=`<div style="margin-bottom:8px">${programSwitchSelectHTML()}</div>`;
  if(!start)return `<div class="level-line" style="margin-bottom:14px">${switcher}</div>`;
  const totalWeeks=12,week=Math.min(totalWeeks,currentWeekNum()),pct=Math.min(100,Math.round(week/totalWeeks*100));
  const anyPhased=Object.values(state.program).some(d=>(d.exercises||[]).some(e=>e.phased||e.monthReps));
  const phaseIdx=currentPhaseIdx();
  const phaseLabel=anyPhased?` · Month ${phaseIdx+1}/3`:'';
  return `<div class="level-line" style="margin-bottom:14px">${switcher}<div class="row between"><span>WEEK ${week} of ${totalWeeks}${phaseLabel}</span><span class="subtle">${pct}%</span></div><div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div></div>`;
}
function programSwitchSelectHTML(){
  const lib=state.programLibrary||{};
  return `<select style="width:auto;max-width:100%;background:transparent;border:0;padding:0;font-size:16px;font-weight:800;color:#fff" data-program-select>${Object.entries(lib).map(([id,p])=>`<option value="${esc(id)}" ${id===state.activeProgramId?'selected':''}>${esc(p.label)}</option>`).join('')}<option value="__edit__">✎ Edit Current Program</option><option value="__manage__">⚙ Manage Programs…</option></select>`;
}
function programsMenuModal(){
  const overlay=document.createElement('div');overlay.className='modal';
  const draw=()=>{
    const lib=state.programLibrary||{};
    const rows=Object.entries(lib).map(([id,p])=>{
      const active=id===state.activeProgramId;
      const weeks=p.startDate?Math.max(1,Math.floor((nowDate()-new Date(p.startDate+'T00:00:00'))/86400000/7)+1):0;
      return `<div class="history-item"><div class="row between gap"><div style="min-width:0"><b>${esc(p.label)}</b>${active?' <span class="badge pr">ACTIVE</span>':''}<div class="muted" style="margin-top:3px">${p.startDate?`Started ${p.startDate} · week ${weeks}`:'Not started yet'}</div></div><div class="row gap">${active?'':`<button class="btn small ghost" data-switch-program="${esc(id)}">LOAD</button>`}<button class="btn small ghost" data-rename-program="${esc(id)}">✎</button>${active?'':`<button class="btn small danger" data-delete-program="${esc(id)}">✕</button>`}</div></div></div>`;
    }).join('');
    overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">Programs</div><button class="btn small ghost" data-close>Close</button></div><button class="btn ghost full" style="margin:12px 0" data-add-program>+ NEW PROGRAM</button>${rows||'<div class="history-empty">No saved programs yet.</div>'}</div>`;
    overlay.querySelector('[data-close]').onclick=()=>overlay.remove();
    const addp=overlay.querySelector('[data-add-program]');if(addp)addp.onclick=()=>{overlay.remove();addNewProgramModal()};
    overlay.querySelectorAll('[data-switch-program]').forEach(b=>b.onclick=()=>{
      if(state.activeWorkout){toast('Finish or cancel your in-progress workout first.');return}
      const id=b.dataset.switchProgram,l=state.programLibrary[id];
      if(confirm(`Switch to "${l.label}"? Your current program's progress stays saved and you can switch back anytime.`)){overlay.remove();switchProgram(id)}
    });
    overlay.querySelectorAll('[data-rename-program]').forEach(b=>b.onclick=()=>{renameProgramPrompt(b.dataset.renameProgram);draw()});
    overlay.querySelectorAll('[data-delete-program]').forEach(b=>b.onclick=()=>{deleteProgramPrompt(b.dataset.deleteProgram);draw()});
  };
  draw();
  document.body.appendChild(overlay);
}
function exerciseRowsHTML(x,phaseIdx){return x.exercises.length?x.exercises.map(e=>{const min=e.phased?e.reps[phaseIdx]:e.monthReps?e.monthReps[phaseIdx]:e.min,max=e.phased?e.reps[phaseIdx]:e.monthReps?e.monthReps[phaseIdx]:e.max,pctLabel=e.phased?` @ ${Math.round(e.pct[phaseIdx]*100)}%`:'',tag=e.phased?' <span class="badge">PHASED</span>':e.monthReps?' <span class="badge">MONTH '+(phaseIdx+1)+'</span>':'';return `<div class="exercise-preview row between"><span>${esc(e.name)}${tag}</span><b>${e.sets} × ${min===max?min:`${min}-${max}`}${pctLabel}</b></div>`}).join(''):'<div class="exercise-preview muted">No exercises yet — pick Edit Current Program to add some.</div>'}
function selectedDayCardHTML(d){const todayDow=d.getDay();const selDow=ui.workoutsDay==null?todayDow:ui.workoutsDay;const isToday=selDow===todayDow;const title=isToday?"TODAY'S EXERCISES":`${DAYN[selDow].toUpperCase()}'S EXERCISES`;const x=state.program[selDow];if(!x)return `<div class="card"><div class="section-title">${title}</div><div class="muted" style="margin-bottom:10px">Tap a day above to preview its workout.</div><div class="history-empty">No workout scheduled for this day. Use Edit Current Program to add one.</div></div>`;const phaseIdx=currentPhaseIdx();const todayWorkout=state.workouts.find(w=>w.date===isoDate(d));const actionBtn=!x.exercises.length?'':state.activeWorkout?`<button class="btn small ghost full" style="margin-top:12px" data-start-day="${selDow}">🏋️ RESUME WORKOUT</button>`:(isToday&&todayWorkout)?`<button class="btn small ghost full" style="margin-top:12px" data-history-id="${todayWorkout.id}">📋 VIEW TODAY'S WORKOUT</button>`:`<button class="btn small ghost full" style="margin-top:12px" data-start-day="${selDow}">🏋️ START / LOG THIS WORKOUT</button>`;return `<div class="card"><div class="section-title">${title}</div><div class="muted" style="margin-bottom:10px">Tap a day above to preview its workout.</div><div class="eyebrow" style="margin-bottom:10px">${DAYN[selDow]} • ${esc(x.name)}</div>${exerciseRowsHTML(x,phaseIdx)}${actionBtn}</div>`}
function programEditHTML(){const days=progDays();const phaseIdx=currentPhaseIdx();const lib=state.programLibrary[state.activeProgramId];const insanityOn=lib.insanity!==false;return `<div class="row between" style="margin-bottom:14px;padding:14px;background:#151515;border:1px solid #292929;border-radius:16px"><div><b>Insanity Cardio</b><div class="muted" style="margin-top:3px">Mon–Sat 7:30 PM cardio track, all 9 weeks including both Fit Tests</div></div><button class="btn small ${insanityOn?'primary':'ghost'}" data-toggle-program-insanity>${insanityOn?'ON':'OFF'}</button></div>${days.map(day=>{const x=state.program[day];return `<div class="program-day" data-pday="${day}"><div class="row between gap"><input class="field" data-pname="${day}" value="${esc(x.name)}" placeholder="Day name"><button class="btn small danger" data-pdel-day="${day}">Delete</button></div><div class="muted" style="margin:8px 0 4px">${DAYN[day]}</div><div class="subtle" style="margin-top:6px">COOL-DOWN STRETCH VIDEOS</div>${(x.stretchVideos||[]).map((v,vi)=>`<div style="display:grid;grid-template-columns:90px 1fr 34px;gap:6px;margin-top:6px"><input class="field" data-pstretchlabel="${day}|${vi}" value="${esc(v.label||'')}" placeholder="Label"><input class="field" data-pstretchurl="${day}|${vi}" value="${esc(v.url||'')}" placeholder="Video URL"><button class="btn small danger" data-pstretchdel="${day}|${vi}">✕</button></div>`).join('')}<button class="btn small ghost full" style="margin-top:6px;margin-bottom:10px" data-pstretchadd="${day}">+ Add Stretch Video</button>${x.exercises.map((e,i)=>e.phased?`<div style="border-top:1px solid #242424;padding:10px 0"><input class="field" data-pexname="${day}|${i}" value="${esc(e.name)}" placeholder="Exercise name"><div style="display:grid;grid-template-columns:1fr 1fr 40px;gap:8px;margin-top:8px"><div class="set-head">SETS</div><div class="set-head">1RM (LB)</div><div class="set-head"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 40px;gap:8px;margin-top:2px"><input class="field" type="number" min="1" data-pexsets="${day}|${i}" value="${e.sets}"><input class="field" type="number" min="0" step="5" data-pex1rm="${day}|${i}" value="${e.oneRM||0}"><button class="btn small danger" data-pdel-ex="${day}|${i}">✕</button></div><div class="subtle" style="margin-top:6px">Phased lift — reps/% are auto-set by the 12-week program (currently ${PHASE_REPS[phaseIdx]} reps @ ${Math.round(PHASE_PCT[phaseIdx]*100)}% of 1RM)</div></div>`:`<div style="border-top:1px solid #242424;padding:10px 0"><input class="field" data-pexname="${day}|${i}" value="${esc(e.name)}" placeholder="Exercise name"><div style="display:grid;grid-template-columns:1fr 1fr 1fr 40px;gap:8px;margin-top:8px"><div class="set-head">SETS</div><div class="set-head">MIN REPS</div><div class="set-head">MAX REPS</div><div class="set-head"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr 40px;gap:8px;margin-top:2px"><input class="field" type="number" min="1" data-pexsets="${day}|${i}" value="${e.sets}"><input class="field" type="number" min="0" data-pexmin="${day}|${i}" value="${e.min}"><input class="field" type="number" min="0" data-pexmax="${day}|${i}" value="${e.max}"><button class="btn small danger" data-pdel-ex="${day}|${i}">✕</button></div></div>`).join('')||'<div class="muted" style="padding:8px 0">No exercises yet.</div>'}<button class="btn small ghost full" style="margin-top:10px" data-padd-ex="${day}">+ Add Exercise</button></div>`}).join('')}<button class="btn ghost full" style="margin-top:14px" data-padd-day>+ Add Day</button>`}
function addProgramExercise(day){state.program[day].exercises.push({name:'New Exercise',history:['New Exercise'],sets:3,min:10,max:10,step:5,rest:90});save();render()}
function addProgramDayModal(){const used=Object.keys(state.program).map(Number);const avail=WEEK_ORDER.filter(x=>!used.includes(x));if(!avail.length){toast('All 7 days already have a workout.');return}const overlay=document.createElement('div');overlay.className='modal';overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">Add Day</div><button class="btn small ghost" data-close>Close</button></div><div class="choice-list">${avail.map(x=>`<button class="btn ghost" data-day-choice="${x}">${DAYN[x]}</button>`).join('')}</div></div>`;document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=()=>overlay.remove();overlay.querySelectorAll('[data-day-choice]').forEach(b=>b.onclick=()=>{const day=+b.dataset.dayChoice;const name=prompt('Name this day (e.g. Push, Pull, Legs)')||'New Day';state.program[day]={name,time:'7:30 AM',exercises:[]};save();overlay.remove();render()})}
function calMonthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function shiftMonthKey(key,dir){const [y,m]=key.split('-').map(Number);return calMonthKey(new Date(y,m-1+dir,1))}
function shiftCalMonth(dir){ui.historyCalMonth=shiftMonthKey(ui.historyCalMonth||calMonthKey(nowDate()),dir)}
function shiftFoodCalMonth(dir){ui.foodCalMonth=shiftMonthKey(ui.foodCalMonth||calMonthKey(nowDate()),dir)}
function monthCalendarHTML(monthKey,loggedDates,navAttr){
  const badgesByDate={};
  (state.badges||[]).forEach(b=>{(badgesByDate[b.date]=badgesByDate[b.date]||[]).push(b)});
  const [y,m]=monthKey.split('-').map(Number);
  const first=new Date(y,m-1,1);
  const daysInMonth=new Date(y,m,0).getDate();
  const todayIso=isoDate(nowDate());
  const cells=[];
  for(let i=0;i<first.getDay();i++)cells.push('<div class="cal-day empty"></div>');
  for(let day=1;day<=daysInMonth;day++){
    const iso=isoDate(new Date(y,m-1,day));
    const hasLog=loggedDates.has(iso);
    const dayBadges=(badgesByDate[iso]||[]).map(b=>BADGE_DEFS.find(d=>d.id===b.id)).filter(Boolean);
    const trophy=dayBadges.length?`<img class="cal-trophy" src="${esc(dayBadges[0].img)}" alt="" title="${esc(dayBadges.map(d=>d.name).join(', '))}">`:'';
    const check=hasLog?'<svg class="cal-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,13 9,18 20,6"></polyline></svg>':'';
    cells.push(`<button class="cal-day ${iso===todayIso?'today':''} ${hasLog?'logged':''}" data-cal-day="${iso}"><span class="cal-num">${day}</span>${check}${trophy}</button>`);
  }
  const trailing=(7-(cells.length%7))%7;
  for(let i=0;i<trailing;i++)cells.push('<div class="cal-day empty"></div>');
  const monthLabel=first.toLocaleDateString('en-US',{month:'long',year:'numeric'}).toUpperCase();
  return `<div class="row between" style="margin-bottom:10px"><button class="btn small ghost" data-${navAttr}="-1">‹</button><div class="section-title">${esc(monthLabel)}</div><button class="btn small ghost" data-${navAttr}="1">›</button></div><div class="cal-weekdays">${['S','M','T','W','T','F','S'].map(d=>`<div>${d}</div>`).join('')}</div><div class="cal-grid">${cells.join('')}</div>`;
}
function historyCalendarHTML(){
  let all=[...state.workouts.map(w=>({...w,kind:'strength'})),...state.insanity.map(w=>({...w,kind:'insanity'}))];
  if(ui.historyFilter!=='all')all=all.filter(x=>x.kind===ui.historyFilter);
  const loggedDates=new Set(all.map(x=>x.date));
  const monthKey=ui.historyCalMonth||calMonthKey(nowDate());
  return monthCalendarHTML(monthKey,loggedDates,'cal-nav');
}
function foodHistoryCalendarHTML(){
  const loggedDates=new Set([...state.food.map(f=>f.date),...(state.water||[]).map(w=>w.date)]);
  const monthKey=ui.foodCalMonth||calMonthKey(nowDate());
  return monthCalendarHTML(monthKey,loggedDates,'food-cal-nav');
}
function showCalendarDay(dateStr){
  const dayBadges=(state.badges||[]).filter(b=>b.date===dateStr).map(b=>BADGE_DEFS.find(d=>d.id===b.id)).filter(Boolean);
  const overlay=document.createElement('div');overlay.className='modal';
  overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">${esc(dateStr)}</div><button class="btn small ghost" data-close>Close</button></div>${dayBadges.length?`<div class="row gap wrap" style="margin:12px 0">${dayBadges.map(def=>`<div style="text-align:center;width:56px"><img src="${esc(def.img)}" style="width:36px;height:36px;object-fit:contain"><div class="subtle" style="font-size:10px;margin-top:2px">${esc(def.name)}</div></div>`).join('')}</div>`:''}${historyDayHTML(dateStr)}</div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-close]').onclick=()=>overlay.remove();
  bindCommon();
}
function historySection(){return `<div class="tabs"><button class="tab ${ui.historyFilter==='all'?'active':''}" data-hf="all">All Workouts</button><button class="tab ${ui.historyFilter==='strength'?'active':''}" data-hf="strength">Strength</button><button class="tab ${ui.historyFilter==='insanity'?'active':''}" data-hf="insanity">Insanity</button><button class="tab ${ui.historyFilter==='other'?'active':''}" data-hf="other">Other</button></div><div class="card"><div class="row between"><div class="section-title">WORKOUT HISTORY</div><button class="btn small ghost" data-add-workout>+ Add Workout</button></div>${historyCalendarHTML()}</div>`}
function historyItem(w){if(w.kind==='insanity')return `<div class="history-item"><div class="row between"><div><div class="history-name">${esc(w.name||'Insanity')}</div><div class="muted">${w.date} • ${w.duration||'completed'}</div></div><span class="row gap"><span class="badge">CARDIO</span><button class="mini-toggle danger" data-insanity-del="${w.id}">✕</button></span></div></div>`;const sets=w.exercises?.reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).length,0)||0;const vol=w.exercises?.reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0),0),0)||0;return `<div class="history-item" data-history-id="${w.id}"><div class="row between"><div><div class="history-name">${esc(w.name)}</div><div class="muted">${w.date} • ${sets} work sets</div></div><div style="text-align:right"><span class="badge">${Math.round(vol).toLocaleString()} lb vol</span></div></div></div>`}
function favoritesViewHTML(){const favs=state.favorites||[];if(!favs.length)return '<div class="muted" style="margin:8px 0 4px">No favorites yet — tap EDIT FAVORITES to add your go-to meals.</div>';return FAVORITE_CATEGORIES.filter(cat=>favs.some(f=>f.category===cat)).map(cat=>`<div class="subtle" style="margin-top:10px">${cat.toUpperCase()}</div><div class="row gap wrap" style="margin-top:6px">${favs.filter(f=>f.category===cat).map(f=>`<button class="btn ghost" data-log-fav="${f.id}">${f.emoji} ${esc(f.name)}</button>`).join('')}</div>`).join('')}
function favoritesEditHTML(){const favs=state.favorites||[];return FAVORITE_CATEGORIES.map(cat=>`<div class="subtle" style="margin-top:10px">${cat.toUpperCase()}</div>${favs.filter(f=>f.category===cat).map(f=>`<div class="row between" style="padding:8px 0;border-top:1px solid #242424"><span>${f.emoji} ${esc(f.name)} <span class="subtle">(${f.calories} cal • ${f.protein}g)</span></span><button class="btn small danger" data-fav-del="${f.id}">✕</button></div>`).join('')}<button class="btn small ghost full" style="margin-top:6px" data-fav-add="${cat}">+ Add ${cat} Favorite</button>`).join('')}
function addFavoriteModal(category){const overlay=document.createElement('div');overlay.className='modal';overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">Pick an Icon</div><button class="btn small ghost" data-close>Close</button></div><div class="row gap wrap" style="margin-top:10px">${FAVORITE_ICONS.map(ic=>`<button class="btn ghost" data-icon-choice="${ic}" style="font-size:22px">${ic}</button>`).join('')}</div></div>`;document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=()=>overlay.remove();overlay.querySelectorAll('[data-icon-choice]').forEach(b=>b.onclick=()=>{const emoji=b.dataset.iconChoice;overlay.remove();const name=prompt('Name this favorite (e.g. Usual Breakfast)');if(!name)return;const calories=+prompt('Calories')||0;const protein=+prompt('Protein (g)')||0;state.favorites=state.favorites||[];state.favorites.push({id:uid(),category,emoji,name:name.trim(),calories,protein});save();render()})}
function foodHistorySection(){return `<div class="card"><div class="section-title">FOOD HISTORY</div>${foodHistoryCalendarHTML()}</div>`}

function foodPage(){const today=isoDate(nowDate()),items=state.food.filter(x=>x.date===today).sort((a,b)=>a.time.localeCompare(b.time));const c=items.reduce((a,b)=>a+(+b.calories||0),0),p=items.reduce((a,b)=>a+(+b.protein||0),0);const waterItems=(state.water||[]).filter(x=>x.date===today).sort((a,b)=>a.time.localeCompare(b.time)),wTotal=waterItems.reduce((a,b)=>a+(+b.amountMl||0),0);const entries=[...items.map(x=>({...x,kind:'food'})),...waterItems.map(x=>({...x,kind:'water'}))].sort((a,b)=>a.time.localeCompare(b.time));return `<div class="page"><div class="card"><div class="section-title">FOOD LOG</div><div class="metric-grid"><div class="metric"><div class="subtle">🔥 TODAY</div><div class="val">${Math.round(c)} kcal</div></div><div class="metric"><div class="subtle">💪 PROTEIN</div><div class="val">${Math.round(p)} g</div></div><div class="metric"><div class="subtle">💧 WATER</div><div class="val">${(wTotal/1000).toFixed(1)} / 3.5 L</div></div></div><div style="height:14px"></div><div class="row between"><div class="eyebrow">FAVORITES</div><button class="btn small ${ui.editingFavorites?'primary':'ghost'}" data-toggle-edit-favorites>${ui.editingFavorites?'DONE':'EDIT FAVORITES'}</button></div>${ui.editingFavorites?favoritesEditHTML():`<div class="row gap wrap" style="margin-top:6px"><button class="btn ghost" style="border-color:var(--blue);color:var(--blue)" data-add-water="500">💧 Water Bottle</button></div>${favoritesViewHTML()}`}<div style="height:14px"></div><input id="foodName" class="field" placeholder="Food / meal"/><div class="form-row" style="margin-top:10px"><input id="foodCal" type="number" class="field" placeholder="Calories"/><input id="foodPro" type="number" class="field" placeholder="Protein g"/></div><button class="btn primary full" style="margin-top:10px" data-add-food>🍽️ LOG CONSUMED FOOD</button></div><div class="card"><div class="section-title">TODAY'S ENTRIES</div><div class="log-list">${entries.length?entries.map(x=>x.kind==='water'?`<div class="log-row row between"><div><b>💧 ${x.amountMl} mL</b><div class="muted">${x.time}</div></div><button class="mini-toggle danger" data-water-del="${x.id}">✕</button></div>`:`<div class="log-row row between"><div><b>${esc(x.name)}</b><div class="muted">${x.time}</div></div><div class="row gap"><div style="text-align:right"><b>${x.calories||0} kcal</b><div class="muted">${x.protein||0} g protein</div></div><button class="mini-toggle danger" data-food-del="${x.id}">✕</button></div></div>`).join(''):'<div class="history-empty">Nothing logged yet today.</div>'}</div></div>${foodHistorySection()}</div>`}
function epley1RM(weight,reps){return weight*(1+reps/30)}
function svgLineChart(points,unit,opts){
  unit=unit||'lb';opts=opts||{};
  if(points.length<2)return '<div class="history-empty">Not enough data yet — log a few more sessions.</div>';
  const w=320,h=152,padL=40,padR=10,padT=12,padB=28;
  const plotW=w-padL-padR,plotH=h-padT-padB;
  const ys=points.map(p=>p.y);
  let minY,maxY;
  if(opts.zoom){const lo=Math.min(...ys),hi=Math.max(...ys),span=(hi-lo)||Math.max(1,hi*0.1);minY=Math.max(0,lo-span*0.18);maxY=hi+span*0.18}
  else{minY=Math.min(0,...ys);maxY=Math.max(...ys,1)}
  const range=(maxY-minY)||1;
  const stepX=points.length>1?plotW/(points.length-1):0;
  const X=i=>padL+i*stepX,Y=v=>padT+plotH-((v-minY)/range)*plotH;
  const path=points.map((p,i)=>X(i).toFixed(1)+','+Y(p.y).toFixed(1)).join(' ');
  const dots=points.length>30?'':points.map((p,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.5" fill="var(--red)"/>`).join('');
  const grid=[maxY,(maxY+minY)/2,minY].map(v=>`<line x1="${padL}" y1="${Y(v).toFixed(1)}" x2="${w-padR}" y2="${Y(v).toFixed(1)}" stroke="#2b2b2b" stroke-width="1"/><text x="${padL-6}" y="${(Y(v)+3.2).toFixed(1)}" text-anchor="end" font-size="9" fill="#6f6f6f">${Math.round(v).toLocaleString()}</text>`).join('');
  const cid='c'+Math.random().toString(36).slice(2,8);
  const last=points[points.length-1];
  const geom=JSON.stringify({w,padL,padT,plotH,stepX,minY,range,n:points.length});
  return `<div class="chart-wrap"><div class="chart-readout" data-chart-readout="${cid}"><b>${Math.round(last.y).toLocaleString()} ${esc(unit)}</b><span class="subtle"> · ${last.date}</span></div><svg viewBox="0 0 ${w} ${h}" class="chart-svg" data-chart-id="${cid}" data-unit="${esc(unit)}" data-points='${esc(JSON.stringify(points))}' data-geom='${geom}'>${grid}<polyline points="${path}" fill="none" stroke="var(--red)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}<line data-scrub-line x1="0" y1="${padT}" x2="0" y2="${padT+plotH}" stroke="#fff" stroke-width="1" opacity="0"/><circle data-scrub-dot r="4.5" fill="var(--red)" stroke="#fff" stroke-width="1.5" opacity="0"/><text x="${padL}" y="${h-9}" font-size="9" fill="#6f6f6f">${points[0].date}</text><text x="${w-padR}" y="${h-9}" text-anchor="end" font-size="9" fill="#6f6f6f">${last.date}</text><rect x="0" y="0" width="${w}" height="${h}" fill="transparent" data-scrub-hit/></svg><div class="subtle" style="font-size:11px;margin-top:2px">Drag across the chart to read any session.</div></div>`;
}
const VOLUME_RANGES=[['1m',30],['3m',90],['6m',180],['1y',365],['all',null]];
function dailyVolumeSeries(){
  const byDate={};
  state.workouts.forEach(w=>{const vol=(w.exercises||[]).reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0),0),0);if(vol)byDate[w.date]=(byDate[w.date]||0)+vol});
  (window.FITNOTES_HISTORY||[]).forEach(h=>{const vol=(h.sets||[]).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0),0);if(vol)byDate[h.date]=(byDate[h.date]||0)+vol});
  return Object.keys(byDate).sort().map(date=>({date,y:byDate[date]}));
}
function volumeChartHTML(){
  const days=VOLUME_RANGES.find(([k])=>k===ui.volumeRange)[1];
  let series=dailyVolumeSeries();
  if(days){const cutoff=isoDate(new Date(nowDate().getTime()-days*86400000));series=series.filter(p=>p.date>=cutoff)}
  return `<div class="row gap wrap" style="margin-bottom:12px">${VOLUME_RANGES.map(([k])=>`<button class="btn small ${ui.volumeRange===k?'primary':'ghost'}" data-volume-range="${k}">${k}</button>`).join('')}</div>${svgLineChart(series)}`;
}
function exerciseAliasMap(){
  const map=new Map();
  const add=e=>(e.history||[]).forEach(a=>{if(a&&a!==e.name&&!map.has(a))map.set(a,e.name)});
  Object.values(state.program||{}).forEach(d=>(d.exercises||[]).forEach(add));
  state.workouts.forEach(w=>(w.exercises||[]).forEach(add));
  return map;
}
function canonicalExercise(name,map){return (map||exerciseAliasMap()).get(name)||name}
function allKnownExerciseNames(){
  const map=exerciseAliasMap(),names=new Set();
  (window.FITNOTES_HISTORY||[]).forEach(h=>names.add(canonicalExercise(h.exercise,map)));
  state.workouts.forEach(w=>(w.exercises||[]).forEach(e=>names.add(canonicalExercise(e.name,map))));
  return [...names].sort();
}
function exerciseUsageStats(){
  const map=exerciseAliasMap(),stats={};
  const bump=(name,vol)=>{const s=stats[name]=stats[name]||{sessions:0,volume:0};s.sessions++;s.volume+=vol};
  (window.FITNOTES_HISTORY||[]).forEach(h=>{const n=canonicalExercise(h.exercise,map);const vol=(h.sets||[]).reduce((a,s)=>a+(s.weight&&s.reps?s.weight*s.reps:0),0);bump(n,vol)});
  state.workouts.forEach(w=>(w.exercises||[]).forEach(e=>{if(e.skipped)return;const n=canonicalExercise(e.name,map);const vol=e.sets.reduce((a,s)=>a+(s.done&&!s.warmup&&s.weight&&s.reps?s.weight*s.reps:0),0);bump(n,vol)}));
  return stats;
}
function exerciseNamesByUsage(){
  const stats=exerciseUsageStats();
  return allKnownExerciseNames().sort((a,b)=>{
    const sa=stats[a]||{sessions:0,volume:0},sb=stats[b]||{sessions:0,volume:0};
    return sb.sessions-sa.sessions||sb.volume-sa.volume||a.localeCompare(b);
  });
}
function exercise1RMSeries(name){
  const map=exerciseAliasMap(),byDate={};
  const add=(date,y)=>{if(!(date in byDate)||y>byDate[date])byDate[date]=y};
  (window.FITNOTES_HISTORY||[]).filter(h=>canonicalExercise(h.exercise,map)===name).forEach(h=>{const vals=(h.sets||[]).filter(s=>s.weight&&s.reps).map(s=>epley1RM(s.weight,s.reps));if(vals.length)add(h.date,Math.max(...vals))});
  state.workouts.forEach(w=>(w.exercises||[]).filter(e=>!e.skipped&&canonicalExercise(e.name,map)===name).forEach(e=>{const vals=e.sets.filter(s=>s.done&&!s.warmup&&s.weight&&s.reps).map(s=>epley1RM(s.weight,s.reps));if(vals.length)add(w.date,Math.max(...vals))}));
  return Object.keys(byDate).sort().map(date=>({date,y:byDate[date]}));
}
const E1RM_RECENT_DAYS=56;
function programExerciseFor(name){
  const map=exerciseAliasMap();
  for(const day of Object.keys(state.program||{})){
    const exs=state.program[day].exercises||[];
    for(let i=0;i<exs.length;i++)if(canonicalExercise(exs[i].name,map)===name)return {day,idx:i,ex:exs[i]};
  }
  return null;
}
function oneRMNudgeHTML(name,estimate){
  const hit=programExerciseFor(name);
  if(!hit||!hit.ex.oneRM||!estimate)return '';
  const cur=hit.ex.oneRM,suggested=Math.round(estimate/5)*5;
  if(suggested<=Math.round(cur*1.05))return '';
  return `<div class="nudge">Your program still works off <b>${cur} lb</b> as this lift's 1RM, so every prescribed weight is running light. Your recent sets estimate <b>${suggested} lb</b>.<button class="btn small primary full" style="margin-top:10px" data-setonerm="${esc(hit.day)}|${hit.idx}|${suggested}">UPDATE PROGRAM TO ${suggested} LB</button></div>`;
}
function e1rmChartHTML(){
  const options=exerciseNamesByUsage();
  const picker=`<select class="field" data-e1rm-exercise><option value="">Pick an exercise</option>${options.map(n=>`<option value="${esc(n)}" ${ui.e1rmExercise===n?'selected':''}>${esc(n)}</option>`).join('')}</select>`;
  if(!ui.e1rmExercise)return `${picker}<div class="muted" style="margin-top:10px">Pick an exercise to see its estimated 1RM trend.</div>`;
  const all=exercise1RMSeries(ui.e1rmExercise);
  if(!all.length)return `${picker}<div class="history-empty" style="margin-top:10px">No weighted sets logged for this exercise yet.</div>`;
  const recentCut=isoDate(new Date(nowDate().getTime()-E1RM_RECENT_DAYS*86400000));
  const recent=all.filter(p=>p.date>=recentCut);
  const headline=recent.length?Math.max(...recent.map(p=>p.y)):all[all.length-1].y;
  const headlineNote=recent.length?'best of last 8 weeks':'last logged '+all[all.length-1].date;
  const best=all.reduce((b,p)=>p.y>b.y?p:b,all[0]);
  const days=(VOLUME_RANGES.find(([k])=>k===ui.e1rmRange)||VOLUME_RANGES[4])[1];
  const series=days?all.filter(p=>p.date>=isoDate(new Date(nowDate().getTime()-days*86400000))):all;
  const toggles=`<div class="row gap wrap" style="margin:14px 0 10px">${VOLUME_RANGES.map(([k])=>`<button class="btn small ${ui.e1rmRange===k?'primary':'ghost'}" data-e1rm-range="${k}">${k}</button>`).join('')}</div>`;
  const chart=series.length<2?'<div class="history-empty">No sessions in this range — widen it above.</div>':svgLineChart(series,'lb',{zoom:true});
  return `${picker}<div class="metric-grid" style="margin-top:12px"><div class="metric"><div class="subtle">🏋️ EST. 1RM</div><div class="val">${Math.round(headline).toLocaleString()} lb</div><div class="subtle" style="font-size:11px">${esc(headlineNote)}</div></div><div class="metric"><div class="subtle">🏆 ALL-TIME BEST</div><div class="val">${Math.round(best.y).toLocaleString()} lb</div><div class="subtle" style="font-size:11px">${best.date}</div></div></div>${oneRMNudgeHTML(ui.e1rmExercise,headline)}${toggles}${chart}`;
}
function historyDayHTML(dateStr){
  const workouts=state.workouts.filter(w=>w.date===dateStr).map(w=>({...w,kind:'strength'}));
  const insanity=state.insanity.filter(x=>x.date===dateStr).map(x=>({...x,kind:'insanity'}));
  const bundled=(window.FITNOTES_HISTORY||[]).filter(h=>h.date===dateStr);
  const foods=state.food.filter(f=>f.date===dateStr);
  const waters=(state.water||[]).filter(w=>w.date===dateStr);
  const weightsLogged=state.weights.filter(w=>w.date===dateStr);
  if(!workouts.length&&!insanity.length&&!bundled.length&&!foods.length&&!waters.length&&!weightsLogged.length)return '<div class="history-empty" style="margin-top:12px">Nothing logged on this date.</div>';
  let html='<div style="margin-top:12px">';
  [...workouts,...insanity].forEach(w=>{html+=historyItem(w)});
  if(bundled.length){html+=`<div class="subtle" style="margin-top:12px">LOGGED EXERCISES</div>${bundled.map(h=>`<div class="history-item"><div class="history-name">${esc(h.exercise)}</div><div class="muted">${formatSets(h.sets)}</div></div>`).join('')}`}
  if(foods.length){html+=`<div class="subtle" style="margin-top:12px">FOOD</div>${foods.map(f=>`<div class="history-item row between"><span>${esc(f.name)}</span><span class="row gap"><span class="muted">${f.calories||0} kcal • ${f.protein||0} g</span><button class="mini-toggle danger" data-food-del="${f.id}">✕</button></span></div>`).join('')}`}
  if(waters.length){html+=`<div class="subtle" style="margin-top:12px">WATER</div>${waters.map(w=>`<div class="history-item row between"><b>${w.amountMl} mL</b><span class="row gap"><span class="muted">${w.time}</span><button class="mini-toggle danger" data-water-del="${w.id}">✕</button></span></div>`).join('')}`}
  if(weightsLogged.length){html+=`<div class="subtle" style="margin-top:12px">BODYWEIGHT</div>${weightsLogged.map(w=>`<div class="history-item row between"><span>${w.value} lb • ${esc(w.scale)}</span><button class="mini-toggle danger" data-weight-del="${w.id}">✕</button></div>`).join('')}`}
  html+='</div>';
  return html;
}
function progressPage(){const latest=[...state.weights].sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time))[0];const tab=ui.progressTab;const tabs=`<div class="tabs">${[['overview','Overview'],['charts','Charts'],['badges','Badges'],['history','History'],['patterns','Patterns']].map(([k,l])=>`<button class="tab ${tab===k?'active':''}" data-ptab="${k}">${l}</button>`).join('')}</div>`;const overview=`<div class="card"><div class="section-title">BODYWEIGHT</div><div class="muted">Keep home-scale readings separate and consistent.</div><div class="form-row" style="margin-top:14px"><input id="weightVal" type="number" step="0.1" class="field" placeholder="Weight (lb)"/><select id="weightScale" class="field"><option>Home scale</option><option>Gym scale</option><option>Doctor scale</option><option>Other scale</option></select></div><button class="btn primary full" style="margin-top:10px" data-add-weight>⚖️ LOG WEIGHT</button></div><div class="card"><div class="section-title">LATEST</div>${latest?`<div class="big">${latest.value} lb</div><div class="muted">${latest.date} ${latest.time} • ${esc(latest.scale)}</div>`:'<div class="history-empty">No app weight entries yet.</div>'}</div><div class="card"><div class="section-title">RECENT WEIGHTS</div>${[...state.weights].reverse().slice(0,20).map(x=>`<div class="history-item row between"><b>${x.value} lb</b><span class="row gap"><span class="muted">${x.date} • ${esc(x.scale)}</span><button class="mini-toggle danger" data-weight-del="${x.id}">✕</button></span></div>`).join('')||'<div class="history-empty">Start with your next same-scale weigh-in.</div>'}</div>`;const charts=`<div class="card"><div class="section-title">TRAINING VOLUME</div>${volumeChartHTML()}</div><div class="card"><div class="section-title">EXERCISE PROGRESS</div>${e1rmChartHTML()}</div>`;const badges=`<div class="card">${levelLineHTML(false)}</div><div class="card"><div class="section-title">BADGES</div><div class="muted" style="margin-bottom:14px">${(state.badges||[]).length} of ${BADGE_DEFS.length} unlocked · counting from today onward. Tap an earned one to see exactly what earned it.</div><div class="badge-grid">${BADGE_DEFS.map(def=>{const got=(state.badges||[]).find(b=>b.id===def.id);return `<div class="badge-tile ${got?'earned':'locked'}" ${got?`data-badge-id="${esc(def.id)}"`:''}>${badgeIcon(def,!!got)}<div class="badge-name">${esc(def.name)}</div><div class="badge-sub">${got?got.date:esc(def.hint)}</div></div>`}).join('')}</div></div>`;const history=`<div class="card"><div class="section-title">HISTORY</div><input type="date" class="field" data-history-date value="${esc(ui.historyDate)}">${ui.historyDate?historyDayHTML(ui.historyDate):'<div class="muted" style="margin-top:10px">Pick a date to see everything logged that day.</div>'}</div>`;const patterns=`<div class="card"><div class="section-title">PATTERNS</div>${patternsHTML()}</div>`;const body=tab==='charts'?charts:tab==='badges'?badges:tab==='history'?history:tab==='patterns'?patterns:overview;return `<div class="page">${tabs}${body}</div>`}
const DAY_PERIODS=[['Early AM','05:00','07:00'],['Morning','07:00','10:00'],['Midday','10:00','13:00'],['Afternoon','13:00','17:00'],['Evening','17:00','21:00'],['Night','21:00','24:00']];
function periodBar(label,avg,max,unit){const pct=max?Math.round(avg/max*100):0;return `<div style="margin-bottom:10px;opacity:${avg?1:.4}"><div class="row between"><span class="subtle">${label}</span><span class="subtle">${Math.round(avg)} ${unit}</span></div><div style="height:10px;background:#1c1c1c;border-radius:6px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${pct}%;background:var(--red)"></div></div></div>`}
function patternsHTML(){const allDays=new Set([...state.food.map(f=>f.date),...(state.water||[]).map(w=>w.date)]);if(!allDays.size)return `<div class="history-empty">No food or water logged yet.<br><span class="subtle">Patterns by time of day will show up here once you start logging.</span></div>`;const dayCount=allDays.size;const bucket=(entries,key)=>DAY_PERIODS.map(([label,startStr,endStr])=>{const start=parseTimeStr(startStr),end=parseTimeStr(endStr);const total=entries.filter(e=>{const m=parseTimeStr(e.time);return m!=null&&m>=start&&m<end}).reduce((a,b)=>a+(+b[key]||0),0);return {label,avg:total/dayCount}});const waterBuckets=bucket(state.water||[],'amountMl'),calBuckets=bucket(state.food,'calories');const maxWater=Math.max(1,...waterBuckets.map(b=>b.avg)),maxCal=Math.max(1,...calBuckets.map(b=>b.avg));return `<div class="muted" style="margin-bottom:14px">Based on ${dayCount} day${dayCount===1?'':'s'} logged</div><div style="font-size:15px;font-weight:900;margin-bottom:8px">WATER BY TIME OF DAY</div>${waterBuckets.map(b=>periodBar(b.label,b.avg,maxWater,'mL')).join('')}<div style="font-size:15px;font-weight:900;margin:18px 0 8px">CALORIES BY TIME OF DAY</div>${calBuckets.map(b=>periodBar(b.label,b.avg,maxCal,'cal')).join('')}`}
function morePage(){return `<div class="page"><div class="card"><div class="section-title">DATA & SETTINGS</div><div class="muted">All new workout, food and weight entries autosave on this device.</div><button class="btn ghost full" style="margin-top:16px" data-export>EXPORT MY APP DATA</button><label class="btn ghost full" style="display:block;text-align:center;margin-top:10px">IMPORT APP DATA<input id="importFile" type="file" accept="application/json" hidden></label></div><div class="card"><div class="section-title">HISTORICAL STRENGTH</div><div class="big">${(window.FITNOTES_HISTORY||[]).reduce((n,x)=>n+x.sets.length,0).toLocaleString()} sets</div><div class="muted">Real FitNotes history is bundled for last-performance comparisons and PR context.</div></div><div class="card"><div class="section-title">DAILY TARGETS</div>${DAILY_TARGETS.map(([k,v])=>`<div class="kv"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div><div class="card"><div class="section-title">DAILY RULES</div>${DAILY_RULES.map(r=>`<div class="kv" style="grid-template-columns:1fr"><span>${esc(r)}</span></div>`).join('')}</div></div>`}
function bindChartScrub(){document.querySelectorAll('svg[data-chart-id]').forEach(svg=>{
  const pts=JSON.parse(svg.dataset.points),g=JSON.parse(svg.dataset.geom),unit=svg.dataset.unit;
  const readout=document.querySelector(`[data-chart-readout="${svg.dataset.chartId}"]`);
  const line=svg.querySelector('[data-scrub-line]'),dot=svg.querySelector('[data-scrub-dot]');
  if(!line||!dot)return;
  const show=i=>{const p=pts[i];if(!p)return;
    const x=g.padL+i*g.stepX,y=g.padT+g.plotH-((p.y-g.minY)/g.range)*g.plotH;
    line.setAttribute('x1',x);line.setAttribute('x2',x);line.setAttribute('opacity','0.45');
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('opacity','1');
    if(readout)readout.innerHTML=`<b>${Math.round(p.y).toLocaleString()} ${esc(unit)}</b><span class="subtle"> · ${p.date}</span>`};
  const idxAt=ev=>{const r=svg.getBoundingClientRect();const vx=((ev.clientX-r.left)/r.width)*g.w;
    return Math.max(0,Math.min(g.n-1,Math.round((vx-g.padL)/(g.stepX||1))))};
  let active=false;
  svg.addEventListener('pointerdown',ev=>{active=true;try{svg.setPointerCapture(ev.pointerId)}catch{}show(idxAt(ev))});
  svg.addEventListener('pointermove',ev=>{if(!active)return;ev.preventDefault();show(idxAt(ev))});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>svg.addEventListener(t,()=>{active=false}));
})}

function bindCommon(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{setPage(b.dataset.page);render()});document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startWorkout());document.querySelectorAll('[data-start-day]').forEach(b=>b.onclick=()=>startWorkout(+b.dataset.startDay));document.querySelectorAll('[data-daychip]').forEach(b=>b.onclick=()=>{ui.workoutsDay=+b.dataset.daychip;render()});document.querySelectorAll('[data-hf]').forEach(b=>b.onclick=()=>{ui.historyFilter=b.dataset.hf;render()});document.querySelectorAll('[data-cal-nav]').forEach(b=>b.onclick=()=>{shiftCalMonth(+b.dataset.calNav);render()});document.querySelectorAll('[data-food-cal-nav]').forEach(b=>b.onclick=()=>{shiftFoodCalMonth(+b.dataset.foodCalNav);render()});document.querySelectorAll('[data-cal-day]').forEach(b=>b.onclick=()=>showCalendarDay(b.dataset.calDay));document.querySelectorAll('[data-ptab]').forEach(b=>b.onclick=()=>{ui.progressTab=b.dataset.ptab;render()});document.querySelectorAll('[data-badge-id]').forEach(t=>t.onclick=()=>badgeDetailModal(t.dataset.badgeId));document.querySelectorAll('[data-goto-badges]').forEach(lvl=>lvl.onclick=()=>{setPage('progress');ui.progressTab='badges';render()});document.querySelectorAll('[data-pr-lift]').forEach(el=>el.onclick=()=>{const name=el.dataset.prLift;const series=exercise1RMSeries(name);if(!series.length)return;const best=series.reduce((b,p)=>p.y>b.y?p:b,series[0]);showLiftPRDetail(name,best)});bindChartScrub();document.querySelectorAll('[data-e1rm-range]').forEach(b=>b.onclick=()=>{ui.e1rmRange=b.dataset.e1rmRange;render()});const s1rm=document.querySelector('[data-setonerm]');if(s1rm)s1rm.onclick=()=>{const [day,idx,v]=s1rm.dataset.setonerm.split('|');const ex=((state.program[day]||{}).exercises||[])[+idx];if(!ex)return;ex.oneRM=+v;save();toast('Program 1RM updated to '+v+' lb.');render()};const ins=document.querySelector('[data-log-insanity]');if(ins)ins.onclick=()=>{const date=isoDate(nowDate());if(state.insanity.some(x=>x.date===date)){toast('Insanity already logged today.');return}state.insanity.push({id:uid(),date,endTs:Date.now(),name:insanityDueFor(nowDate())||'Insanity Cardio',duration:'completed'});save();awardXP(30);toast('Insanity logged.');render()};const icu=document.querySelector('[data-insanity-catchup]');if(icu)icu.onclick=insanityCatchupModal;document.querySelectorAll('[data-history-id]').forEach(x=>x.onclick=()=>showHistory(x.dataset.historyId));const af=document.querySelector('[data-add-food]');if(af)af.onclick=()=>{const name=document.getElementById('foodName').value.trim();if(!name){toast('Enter what you consumed.');return}const t=new Date();state.food.push({id:uid(),date:isoDate(t),time:t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),name,calories:+document.getElementById('foodCal').value||0,protein:+document.getElementById('foodPro').value||0});save();render()};const aw=document.querySelector('[data-add-weight]');if(aw)aw.onclick=()=>{const v=+document.getElementById('weightVal').value;if(!v){toast('Enter a weight.');return}const t=new Date();state.weights.push({id:uid(),date:isoDate(t),time:t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),value:v,scale:document.getElementById('weightScale').value});save();awardXP(5);render()};const tef=document.querySelector('[data-toggle-edit-favorites]');if(tef)tef.onclick=()=>{ui.editingFavorites=!ui.editingFavorites;render()};document.querySelectorAll('[data-log-fav]').forEach(b=>b.onclick=()=>{const f=(state.favorites||[]).find(x=>x.id===b.dataset.logFav);if(!f)return;const t=new Date();state.food.push({id:uid(),date:isoDate(t),time:t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),name:f.name,calories:f.calories,protein:f.protein});save();toast(f.emoji+' '+f.name+' logged.');render()});document.querySelectorAll('[data-fav-del]').forEach(b=>b.onclick=()=>{state.favorites=(state.favorites||[]).filter(f=>f.id!==b.dataset.favDel);save();render()});document.querySelectorAll('[data-fav-add]').forEach(b=>b.onclick=()=>addFavoriteModal(b.dataset.favAdd));const ex=document.querySelector('[data-export]');if(ex)ex.onclick=exportData;const imp=document.getElementById('importFile');if(imp)imp.onchange=importData;const add=document.querySelector('[data-add-workout]');if(add)add.onclick=()=>toast('Use today’s planned workout or import existing data.');const tep=document.querySelector('[data-toggle-edit-program]');if(tep)tep.onclick=()=>{ui.editingProgram=!ui.editingProgram;render()};const psel=document.querySelector('[data-program-select]');if(psel)psel.onchange=()=>{const id=psel.value;if(id==='__edit__'){psel.value=state.activeProgramId;ui.editingProgram=true;render();return}if(id==='__manage__'){psel.value=state.activeProgramId;programsMenuModal();return}if(id===state.activeProgramId)return;if(state.activeWorkout){toast('Finish or cancel your in-progress workout first.');psel.value=state.activeProgramId;return}const lib=state.programLibrary[id];if(confirm(`Switch to "${lib.label}"? Your current program's progress stays saved and you can switch back anytime.`)){switchProgram(id)}else{psel.value=state.activeProgramId}};document.querySelectorAll('[data-pname]').forEach(i=>i.onchange=()=>{state.program[i.dataset.pname].name=i.value.trim()||'Day';save();render()});document.querySelectorAll('[data-pstretchlabel]').forEach(i=>i.onchange=()=>{const [day,vi]=i.dataset.pstretchlabel.split('|');state.program[day].stretchVideos[vi].label=i.value.trim();save();render()});document.querySelectorAll('[data-pstretchurl]').forEach(i=>i.onchange=()=>{const [day,vi]=i.dataset.pstretchurl.split('|');state.program[day].stretchVideos[vi].url=i.value.trim();save();render()});document.querySelectorAll('[data-pstretchdel]').forEach(b=>b.onclick=()=>{const [day,vi]=b.dataset.pstretchdel.split('|');state.program[day].stretchVideos.splice(+vi,1);save();render()});document.querySelectorAll('[data-pstretchadd]').forEach(b=>b.onclick=()=>{const day=b.dataset.pstretchadd;state.program[day].stretchVideos=state.program[day].stretchVideos||[];state.program[day].stretchVideos.push({label:'',url:''});save();render()});document.querySelectorAll('[data-pdel-day]').forEach(b=>b.onclick=()=>{if(confirm('Delete this entire day and its exercises?')){delete state.program[b.dataset.pdelDay];save();render()}});document.querySelectorAll('[data-pexname]').forEach(i=>i.onchange=()=>{const [day,idx]=i.dataset.pexname.split('|'),e=state.program[day].exercises[idx];e.name=i.value.trim()||'Exercise';e.history=[e.name];save();render()});document.querySelectorAll('[data-pexsets]').forEach(i=>i.onchange=()=>{const [day,idx]=i.dataset.pexsets.split('|');state.program[day].exercises[idx].sets=Math.max(1,+i.value||1);save();render()});document.querySelectorAll('[data-pexmin]').forEach(i=>i.onchange=()=>{const [day,idx]=i.dataset.pexmin.split('|'),ex=state.program[day].exercises[idx];ex.min=Math.max(0,+i.value||0);if(ex.max<ex.min)ex.max=ex.min;save();render()});document.querySelectorAll('[data-pexmax]').forEach(i=>i.onchange=()=>{const [day,idx]=i.dataset.pexmax.split('|'),ex=state.program[day].exercises[idx];ex.max=Math.max(0,+i.value||0);if(ex.max<ex.min)ex.min=ex.max;save();render()});document.querySelectorAll('[data-pex1rm]').forEach(i=>i.onchange=()=>{const [day,idx]=i.dataset.pex1rm.split('|');state.program[day].exercises[idx].oneRM=Math.max(0,+i.value||0);save();render()});document.querySelectorAll('[data-pdel-ex]').forEach(b=>b.onclick=()=>{const [day,idx]=b.dataset.pdelEx.split('|');state.program[day].exercises.splice(+idx,1);save();render()});document.querySelectorAll('[data-padd-ex]').forEach(b=>b.onclick=()=>addProgramExercise(+b.dataset.paddEx));const pad=document.querySelector('[data-padd-day]');if(pad)pad.onclick=addProgramDayModal;const tpi=document.querySelector('[data-toggle-program-insanity]');if(tpi)tpi.onclick=()=>{const lib=state.programLibrary[state.activeProgramId];lib.insanity=lib.insanity===false;save();toast(lib.insanity?'Insanity enabled for '+lib.label+'.':'Insanity disabled for '+lib.label+'.');render()};document.querySelectorAll('[data-water-del]').forEach(b=>b.onclick=()=>{state.water=(state.water||[]).filter(w=>w.id!==b.dataset.waterDel);save();render()});document.querySelectorAll('[data-weight-del]').forEach(b=>b.onclick=()=>{state.weights=(state.weights||[]).filter(w=>w.id!==b.dataset.weightDel);const removed=revalidateBadges(['fivepound','tenpound','twohundred','masstitan']);save();toast(removed.length?`Weight entry deleted. Removed: ${removed.join(', ')}.`:'Weight entry deleted.');render()});document.querySelectorAll('[data-food-del]').forEach(b=>b.onclick=()=>{state.food=(state.food||[]).filter(f=>f.id!==b.dataset.foodDel);save();render()});document.querySelectorAll('[data-insanity-del]').forEach(b=>b.onclick=()=>{state.insanity=(state.insanity||[]).filter(x=>x.id!==b.dataset.insanityDel);save();toast('Insanity entry removed.');render()});document.querySelectorAll('[data-insanity-undo]').forEach(b=>b.onclick=()=>{state.insanity=(state.insanity||[]).filter(x=>x.date!==b.dataset.insanityUndo);save();toast('Insanity entry removed.');render()});document.querySelectorAll('[data-add-water]').forEach(b=>b.onclick=()=>{logWater(+b.dataset.addWater);render()});document.querySelectorAll('[data-volume-range]').forEach(b=>b.onclick=()=>{ui.volumeRange=b.dataset.volumeRange;render()});const e1s=document.querySelector('[data-e1rm-exercise]');if(e1s)e1s.onchange=()=>{ui.e1rmExercise=e1s.value;render()};const hd=document.querySelector('[data-history-date]');if(hd)hd.onchange=()=>{ui.historyDate=hd.value;render()};}
function youtubeId(url){try{const u=new URL(url);if(u.hostname==='youtu.be')return u.pathname.slice(1);if(u.searchParams.get('v'))return u.searchParams.get('v');const m=u.pathname.match(/\/embed\/([^/?]+)/);if(m)return m[1]}catch{}return null}
function playStretchVideoModal(url,label){const id=youtubeId(url);const overlay=document.createElement('div');overlay.className='modal';overlay.innerHTML=`<div class="modal-card" style="padding:0;overflow:hidden"><div class="row between" style="padding:14px 14px 0"><div class="modal-title">${esc(label)} Stretch</div><button class="btn small ghost" data-close>Close</button></div>${id?`<div style="position:relative;padding-top:56.25%;margin-top:12px;background:#000" data-video-wrap><div class="subtle" data-video-loading style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">Loading video…</div><iframe onload="this.previousElementSibling.style.display='none'" src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`:`<div style="padding:20px"><a href="${esc(url)}" target="_blank" rel="noopener" class="btn primary full">Open on YouTube</a></div>`}</div>`;document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=()=>overlay.remove();const loading=overlay.querySelector('[data-video-loading]');if(loading)setTimeout(()=>{if(loading.style.display!=='none'){const wrap=overlay.querySelector('[data-video-wrap]');if(wrap)wrap.innerHTML=`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px"><div class="subtle" style="text-align:center">Video didn't load.</div><a href="${esc(url)}" target="_blank" rel="noopener" class="btn primary">Open on YouTube</a></div>`}},6000)}
function renderSession(){ui.session=state.activeWorkout;if(!ui.session){ui.session=null;render();return}const w=ui.session;const completed=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0),total=w.exercises.reduce((n,e)=>n+e.sets.length,0),pct=total?Math.round(completed/total*100):0;const stretchVideos=(w.stretchVideos&&w.stretchVideos.length)?w.stretchVideos:((Object.values(state.program).find(p=>p.name===w.name)||{}).stretchVideos||[]);const stretchCard=stretchVideos.length?`<section class="exercise-card" style="text-align:center"><div class="exercise-title">🧘 Cool-Down Stretch</div><div class="last-line" style="margin-bottom:14px">${esc(w.name)} stretch routine</div>${stretchVideos.map(v=>`<button class="btn primary full" style="margin-top:8px" data-play-stretch-url="${esc(v.url)}" data-play-stretch-label="${esc(v.label||'Stretch')}">▶ WATCH ${esc((v.label||'STRETCH').toUpperCase())} STRETCH</button>`).join('')}</section>`:'';const color=w.color||(Object.values(state.program).find(p=>p.name===w.name)||{}).color||'#4aa3ff';document.getElementById('app').innerHTML=`<div class="app-shell" style="--red:${esc(color)}"><header class="session-head"><div class="row between"><button class="btn small ghost" data-back>← Back</button><div style="text-align:center"><div class="session-title" style="color:${esc(color)}">${esc(w.name)}</div><div class="subtle"><span class="timer" id="workTimer">00:00</span> • ${completed}/${total} sets</div></div><button class="btn small danger" data-cancel>Cancel</button></div><div class="progressbar"><div style="width:${pct}%"></div></div></header><div id="restSlot"></div><main style="padding-bottom:100px">${w.exercises.map((e,i)=>exerciseHTML(e,i)).join('')}<button class="btn ghost full" style="margin:14px 15px;width:calc(100% - 30px)" data-add-exercise>+ ADD EXERCISE</button>${stretchCard}<div class="finish-bar"><div class="row between"><div><b>${completed}/${total} sets recorded</b><div class="subtle">Autosaved after every change</div></div><button class="btn primary" data-finish>FINISH</button></div></div></main></div>`;bindSession();tickWorkout();renderRest();}
function exerciseHTML(e,idx){const base={name:e.name,history:e.history,sets:e.planned.sets,min:e.planned.min,max:e.planned.max,step:e.step,rest:e.rest,pct:e.pct,oneRM:e.oneRM};return `<section class="exercise-card ${e.skipped?'skipped':''}" data-ex="${e.id}"><div class="row between gap"><div><div class="exercise-title">${esc(e.name)} ${e.skipped?'<span class="badge">SKIPPED</span>':''}</div><div class="last-line">${esc(lastLine(base))}</div></div><div class="row gap"><button class="btn small ghost" data-up="${idx}">↑</button><button class="btn small ghost" data-down="${idx}">↓</button></div></div><div class="suggestion">${esc(suggestion(base))}</div><div class="set-grid"><div class="set-head">SET</div><div class="set-head">WEIGHT</div><div class="set-head">REPS</div><div class="set-head">DONE</div><div class="set-head"></div>${e.sets.map((s,si)=>setHTML(e,s,si,ui.expandedSets.has(s.id))).join('')}</div><div class="exercise-actions"><button class="btn small ghost" data-copy-prev="${e.id}">Copy Previous Set</button><button class="btn small ghost" data-copy-last="${e.id}">Copy Last Workout</button><button class="btn small ghost" data-add-set="${e.id}">+ Add Set</button><button class="btn small ghost" data-sub="${e.id}">Substitute</button><button class="btn small ${e.skipped?'ghost':'danger'}" data-skip="${e.id}">${e.skipped?'Unskip':'Skip Exercise'}</button></div><textarea class="notes" data-note="${e.id}" placeholder="Exercise notes: setup, form, equipment...">${esc(e.notes||'')}</textarea></section>`}
function setHTML(e,s,si,expanded){const flag=s.pr?`<span class="pr-tag">${esc(s.pr)}</span>`:s.warmup?'<span class="subtle" style="font-size:10px;display:block">WARM</span>':s.effort?`<span class="subtle" style="font-size:10px;display:block">${esc(s.effort)}</span>`:'';return `<div class="setnum">${si+1}${flag}</div><div class="stepper"><button data-step="${e.id}|${s.id}|weight|-1">−</button><input inputmode="decimal" data-input="${e.id}|${s.id}|weight" value="${s.weight||0}"><button data-step="${e.id}|${s.id}|weight|1">+</button></div><div class="stepper"><button data-step="${e.id}|${s.id}|reps|-1">−</button><input inputmode="numeric" data-input="${e.id}|${s.id}|reps" value="${s.reps||0}"><button data-step="${e.id}|${s.id}|reps|1">+</button></div><button class="complete-set ${s.done?'done':''} ${s.pr?'pr':''}" data-done="${e.id}|${s.id}">${s.done?'✓':'○'}</button><button class="set-more ${expanded?'on':''}" data-toggle-set-opts="${e.id}|${s.id}">⋯</button>${expanded?`<div class="set-options"><button class="mini-toggle ${s.warmup?'on':''}" data-warm="${e.id}|${s.id}">${s.warmup?'WARM-UP':'WORK SET'}</button><select class="rir" data-effort="${e.id}|${s.id}"><option value="">RIR/RPE</option>${['RIR 4','RIR 3','RIR 2','RIR 1','RIR 0','RPE 7','RPE 8','RPE 9','RPE 10'].map(x=>`<option ${s.effort===x?'selected':''}>${x}</option>`).join('')}</select><button class="mini-toggle danger" data-del-set="${e.id}|${s.id}">Delete</button></div>`:''}`}
function findEx(id){return state.activeWorkout.exercises.find(e=>e.id===id)}function findSet(e,id){return e.sets.find(s=>s.id===id)}
function bindSession(){document.querySelector('[data-back]').onclick=()=>{stopRest();ui.session=null;render()};document.querySelector('[data-cancel]').onclick=()=>{if(confirm('Cancel this in-progress workout? The active log will be deleted.')){stopRest();state.activeWorkout=null;save();ui.session=null;render()}};document.querySelector('[data-finish]').onclick=finishWorkout;document.querySelector('[data-add-exercise]').onclick=addExerciseModal;document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const [eid,sid,f,dir]=b.dataset.step.split('|'),e=findEx(eid),s=findSet(e,sid);const step=f==='weight'?e.step:1;s[f]=Math.max(0,(+s[f]||0)+(+dir)*step);save();renderSession()});document.querySelectorAll('[data-input]').forEach(i=>i.onchange=()=>{const [eid,sid,f]=i.dataset.input.split('|'),e=findEx(eid),s=findSet(e,sid);s[f]=Math.max(0,+i.value||0);save();renderSession()});document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const [eid,sid]=b.dataset.done.split('|'),e=findEx(eid),s=findSet(e,sid);s.done=!s.done;let justPR=null;if(s.done){startRest(e.rest??90);if(!s.warmup){const pr=prFor(e,s);s.pr=pr;if(pr)justPR={name:e.name,weight:s.weight,reps:s.reps,type:pr}}}else if(!s.warmup){s.pr=''}save();renderSession();if(justPR)celebratePR(justPR);});document.querySelectorAll('[data-warm]').forEach(b=>b.onclick=()=>{const [eid,sid]=b.dataset.warm.split('|'),e=findEx(eid),s=findSet(e,sid);s.warmup=!s.warmup;save();renderSession()});document.querySelectorAll('[data-effort]').forEach(s=>s.onchange=()=>{const [eid,sid]=s.dataset.effort.split('|');findSet(findEx(eid),sid).effort=s.value;save()});document.querySelectorAll('[data-del-set]').forEach(b=>b.onclick=()=>{const [eid,sid]=b.dataset.delSet.split('|'),e=findEx(eid);if(e.sets.length<=1){toast('Keep at least one set.');return}e.sets=e.sets.filter(s=>s.id!==sid);save();renderSession()});document.querySelectorAll('[data-copy-prev]').forEach(b=>b.onclick=()=>{const e=findEx(b.dataset.copyPrev);let changed=false;for(let i=1;i<e.sets.length;i++){if(!e.sets[i].done){e.sets[i].weight=e.sets[i-1].weight;e.sets[i].reps=e.sets[i-1].reps;e.sets[i].effort='';changed=true;break}}if(!changed)toast('No open set to copy into.');save();renderSession()});document.querySelectorAll('[data-copy-last]').forEach(b=>b.onclick=()=>{const e=findEx(b.dataset.copyLast),base={name:e.name,history:e.history},h=latestHist(base);if(!h){toast('No matching historical session.');return}h.sets.slice(-e.sets.length).forEach((x,i)=>{if(e.sets[i]){e.sets[i].weight=x.weight||0;e.sets[i].reps=x.reps||e.planned.min}});save();renderSession();toast('Last FitNotes sets copied.')});document.querySelectorAll('[data-add-set]').forEach(b=>b.onclick=()=>{const e=findEx(b.dataset.addSet),p=e.sets[e.sets.length-1]||{};e.sets.push({id:uid(),weight:+p.weight||0,reps:+p.reps||e.planned.min,warmup:false,effort:'',done:false});save();renderSession()});document.querySelectorAll('[data-skip]').forEach(b=>b.onclick=()=>{const e=findEx(b.dataset.skip);e.skipped=!e.skipped;save();renderSession()});document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>substituteModal(b.dataset.sub));document.querySelectorAll('[data-note]').forEach(t=>t.oninput=()=>{findEx(t.dataset.note).notes=t.value;save()});document.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>moveEx(+b.dataset.up,-1));document.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>moveEx(+b.dataset.down,1));document.querySelectorAll('[data-play-stretch-url]').forEach(b=>b.onclick=()=>playStretchVideoModal(b.dataset.playStretchUrl,b.dataset.playStretchLabel));document.querySelectorAll('[data-toggle-set-opts]').forEach(b=>b.onclick=()=>{const sid=b.dataset.toggleSetOpts.split('|')[1];if(ui.expandedSets.has(sid))ui.expandedSets.delete(sid);else ui.expandedSets.add(sid);renderSession()});}
function moveEx(i,d){const a=state.activeWorkout.exercises,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();renderSession()}
function substituteModal(eid){const current=findEx(eid),dayName=(state.activeWorkout&&state.activeWorkout.name)||'';const pool=SUBSTITUTE_POOL[dayName]||Object.values(SUBSTITUTE_POOL).flat();const choices=[...new Set(pool)].filter(c=>c!==current.name);choices.push('Custom exercise');const overlay=document.createElement('div');overlay.className='modal';overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">Substitute Exercise</div><button class="btn small ghost" data-close>Close</button></div>${SUBSTITUTE_POOL[dayName]?`<div class="muted" style="margin:8px 0">${esc(dayName)}-day alternatives</div>`:''}<div class="choice-list">${choices.map(c=>`<button class="btn ghost" data-choice="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`;document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=()=>overlay.remove();overlay.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{let name=b.dataset.choice;if(name==='Custom exercise')name=prompt('Exercise name')||'';if(!name)return;const e=findEx(eid);e.name=name;e.history=[name];save();overlay.remove();renderSession()})}
function newExerciseEntry(name){
  const last=latestHist({name,history:[name]});
  const lastWork=last?last.sets.filter(s=>s.weight!=null||s.reps!=null):[];
  const seedWeight=lastWork.length?lastWork[lastWork.length-1].weight||0:0;
  const seedReps=lastWork.length?lastWork[lastWork.length-1].reps||8:8;
  return {id:uid(),name,history:[name],planned:{sets:3,min:seedReps,max:seedReps},pct:null,oneRM:0,step:5,rest:90,notes:'',skipped:false,added:true,
    sets:Array.from({length:3},()=>({id:uid(),weight:seedWeight,reps:seedReps,warmup:false,effort:'',done:false}))};
}
function addExerciseModal(){
  const options=exerciseNamesByUsage();
  const overlay=document.createElement('div');overlay.className='modal';
  const draw=q=>{
    const query=(q||'').trim().toLowerCase();
    const matches=query?options.filter(n=>n.toLowerCase().includes(query)):options;
    overlay.innerHTML=`<div class="modal-card"><div class="row between"><div class="modal-title">Add Exercise</div><button class="btn small ghost" data-close>Close</button></div><input class="field" style="margin:12px 0" placeholder="Search exercises…" data-add-ex-search value="${esc(q||'')}"><button class="btn primary full" data-add-ex-custom>+ Custom Exercise</button><div class="choice-list" style="margin-top:10px">${matches.slice(0,60).map(c=>`<button class="btn ghost" data-choice="${esc(c)}">${esc(c)}</button>`).join('')||'<div class="muted">No matches — add it as a custom exercise above.</div>'}</div></div>`;
    overlay.querySelector('[data-close]').onclick=()=>overlay.remove();
    const input=overlay.querySelector('[data-add-ex-search]');
    input.oninput=()=>draw(input.value);
    input.focus();input.selectionStart=input.selectionEnd=input.value.length;
    const pick=name=>{if(!name)return;state.activeWorkout.exercises.push(newExerciseEntry(name));save();overlay.remove();renderSession();const cards=document.querySelectorAll('.exercise-card');if(cards.length)cards[cards.length-1].scrollIntoView({behavior:'smooth',block:'start'})};
    overlay.querySelector('[data-add-ex-custom]').onclick=()=>pick((prompt('Exercise name')||'').trim());
    overlay.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>pick(b.dataset.choice));
  };
  draw('');
  document.body.appendChild(overlay);
}

function celebratePR(hit){
  const el=document.createElement('div');
  el.className='pr-flash';
  const label=hit.type==='LOAD PR'?'HEAVIEST EVER':'MOST REPS EVER';
  el.innerHTML=`<div class="pr-flash-card"><div class="pr-flash-title">NEW PR</div><div class="pr-flash-name">${esc(hit.name)}</div><div class="pr-flash-stat">${hit.weight}×${hit.reps}</div><div class="pr-flash-label">${label}</div></div>`;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),350)},2000);
}

function stopRest(){if(ui.restTimer){clearInterval(ui.restTimer);ui.restTimer=null}ui.restEnds=0}
function startRest(sec){ui.restEnds=Date.now()+sec*1000;if(ui.restTimer)clearInterval(ui.restTimer);ui.restTimer=setInterval(()=>{renderRest();if(Date.now()>=ui.restEnds){clearInterval(ui.restTimer);ui.restTimer=null;ui.restEnds=0;toast('Rest complete.')}} ,250)}
function renderRest(){const slot=document.getElementById('restSlot');if(!slot)return;const main=document.querySelector('main');if(!ui.restEnds||Date.now()>=ui.restEnds){slot.innerHTML='';if(main)main.style.paddingTop='';return}const rem=Math.max(0,Math.ceil((ui.restEnds-Date.now())/1000));slot.innerHTML=`<div class="rest-banner"><span>REST <b>${Math.floor(rem/60)}:${String(rem%60).padStart(2,'0')}</b></span><span><button class="btn small ghost" id="restMinus">−15</button> <button class="btn small ghost" id="restPlus">+15</button> <button class="btn small ghost" id="restSkip">Skip</button></span></div>`;if(main)main.style.paddingTop='58px';document.getElementById('restMinus').onclick=()=>{ui.restEnds-=15000;renderRest()};document.getElementById('restPlus').onclick=()=>{ui.restEnds+=15000;renderRest()};document.getElementById('restSkip').onclick=()=>{ui.restEnds=0;renderRest()}}
function tickWorkout(){const el=document.getElementById('workTimer');if(!el||!state.activeWorkout)return;const sec=Math.floor((Date.now()-state.activeWorkout.startTs)/1000);el.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;setTimeout(tickWorkout,1000)}
function prFor(e,s){const history=histFor({name:e.name,history:e.history});const all=history.flatMap(h=>h.sets).filter(x=>x.weight&&x.reps);if(!all.length)return '';const maxWeight=Math.max(...all.map(x=>x.weight));if(s.weight>maxWeight)return 'LOAD PR';const same=all.filter(x=>x.weight===s.weight);if(same.length&&s.reps>Math.max(...same.map(x=>x.reps)))return 'REP PR';return ''}
function finishWorkout(){const w=state.activeWorkout;const done=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0);if(!done){toast('Complete at least one set first.');return}const undone=w.exercises.reduce((n,e)=>e.skipped?n:n+e.sets.filter(s=>!s.done&&!s.warmup).length,0);if(undone&&!confirm(`${undone} work set${undone===1?'':'s'} still unchecked. Finish anyway?\n\nIf you finish early you can reopen this workout from Workout History and add the rest.`))return;stopRest();w.endTs=Date.now();w.durationSec=(w.priorSec||0)+Math.round((w.endTs-w.startTs)/1000);delete w.priorSec;w.allSetsDone=!undone;w.exercises.forEach(e=>e.sets.forEach(s=>{s.pr=s.done&&!s.warmup?prFor(e,s):''}));const saved=deep(w);state.workouts.push(saved);state.activeWorkout=null;save();awardXP(undone?25:50);ui.session=null;setPage('workouts');toast('Workout saved.');render();showHistory(saved.id)}
function reopenWorkout(id){if(state.activeWorkout){toast('Finish or cancel your in-progress workout first.');return}const i=state.workouts.findIndex(x=>x.id===id);if(i<0)return;const w=state.workouts[i];w.priorSec=w.durationSec||0;w.reopened=true;w.startTs=Date.now();delete w.endTs;delete w.durationSec;state.workouts.splice(i,1);state.activeWorkout=w;save();ui.session=w;renderSession();toast('Reopened \u2014 add your sets, then FINISH.')}
function showHistory(id){const w=state.workouts.find(x=>x.id===id);if(!w)return;const sets=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).length,0);const vol=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done&&!s.warmup).reduce((a,s)=>a+(+s.weight||0)*(+s.reps||0),0),0);const prCount=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.pr).length,0);const mins=w.durationSec?Math.round(w.durationSec/60):null;const overlay=document.createElement('div');overlay.className='modal';overlay.innerHTML=`<div class="modal-card"><div class="row between"><div><div class="modal-title">${esc(w.name)}</div><div class="muted">${w.date}</div></div><button class="btn small ghost" data-close>Close</button></div><div class="metric-grid" style="margin-top:14px"><div class="metric"><div class="subtle">📊 VOLUME</div><div class="val">${Math.round(vol).toLocaleString()} lb</div></div><div class="metric"><div class="subtle">✅ SETS</div><div class="val">${sets}${mins?` • ${mins} min`:''}</div></div></div>${prCount?`<button class="badge pr pr-jump" style="margin-top:12px" data-jump-pr>${prCount} PR${prCount===1?'':'s'} today 🎉 — tap to jump</button>`:''}<button class="btn ghost full" style="margin-top:14px" data-reopen>+ REOPEN &amp; ADD SETS</button>${w.exercises.map(e=>`<div class="history-item ${e.sets.some(s=>s.pr)?'has-pr':''}"><b>${esc(e.name)}</b><div style="margin-top:6px">${e.skipped?'<span class="muted">Skipped</span>':e.sets.filter(s=>s.done).map(s=>s.pr?`<div class="pr-line">${s.weight}×${s.reps}${s.warmup?' W':''} <span class="pr-line-tag">${esc(s.pr)}</span></div>`:`<span class="muted">${s.weight}×${s.reps}${s.warmup?' W':''}</span>`).join(e.sets.some(x=>x.pr)?'':' · ')||'<span class="muted">No completed sets</span>'}</div>${e.notes?`<div class="subtle" style="margin-top:5px">${esc(e.notes)}</div>`:''}</div>`).join('')}</div>`;document.body.appendChild(overlay);overlay.querySelector('[data-close]').onclick=()=>overlay.remove();const ro=overlay.querySelector('[data-reopen]');if(ro)ro.onclick=()=>{overlay.remove();reopenWorkout(w.id)};const jp=overlay.querySelector('[data-jump-pr]');if(jp)jp.onclick=()=>{const first=overlay.querySelector('.history-item.has-pr');if(!first)return;first.scrollIntoView({behavior:'smooth',block:'center'});first.classList.add('flash-pr');setTimeout(()=>first.classList.remove('flash-pr'),1000)}}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`body-goals-data-${isoDate(nowDate())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,defaults(),d);save();toast('Data imported.');render()}catch{toast('That file is not valid app data.')}};r.readAsText(f)}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(reg=>{reg.update();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update()})}).catch(()=>{}));let swRefreshed=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(swRefreshed)return;swRefreshed=true;location.reload()})}
(function initSwipe(){
  const app=document.getElementById('app');
  let startX=null,startY=null,blocked=false;
  app.addEventListener('touchstart',e=>{
    if(ui.session||e.touches.length!==1){startX=null;return}
    blocked=!!e.target.closest('.tabs, input, select, textarea, .modal, .chart-wrap');
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;
  },{passive:true});
  app.addEventListener('touchend',e=>{
    if(startX==null||ui.session||blocked){startX=null;return}
    const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
    startX=null;
    if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return;
    const idx=PAGE_ORDER.indexOf(ui.page);
    if(dx<0&&idx<PAGE_ORDER.length-1){setPage(PAGE_ORDER[idx+1]);render()}
    else if(dx>0&&idx>0){setPage(PAGE_ORDER[idx-1]);render()}
  },{passive:true});
})();
render();
fetch('fitnotes-history.json').then(r=>r.json()).then(data=>{window.FITNOTES_HISTORY=data;render()}).catch(()=>{});
})();
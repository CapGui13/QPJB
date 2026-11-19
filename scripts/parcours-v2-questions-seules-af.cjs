'use strict';
/* QPJB AF — QUESTIONS ONLY. Rubensohl is an advanced, teacher-taught
 * convention. An elapsed session number alone must not unlock it.
 * This is an isolated V2-F experimental wrapper, not public quiz code.
 * All 1,523 QCM are retained verbatim; no lesson, user score or mastery inferred.
 */
const F=require('./parcours-v2-pilot.cjs');
const P=require('../quizz-parcours.js');
const LOCKED_THEME='rubensohl';
const POLICY=Object.freeze({
  name:'QUESTIONS_ONLY_TEACHER_TAUGHT_RUBENSOHL',
  noLessons:true,
  noLessonGate:true,
  noAutomaticMasteryUnlock:true,
  advancedTheme:'rubensohl',
  teacherConfirmationRequired:true,
  defaultAdvancedThemeTaught:false,
  respectOriginalThemeIntro:true,
  originalCatalogUnmodified:true,
  publicRuntimeWired:false,
  anyStudentDataUsed:false
});
function visibleQuestions(catalog,taughtRubensohl=false){
  if(typeof taughtRubensohl!=='boolean')
    throw Error('AF : confirmation enseignante booléenne obligatoire');
  return taughtRubensohl?catalog:catalog.filter(q=>q.theme!==LOCKED_THEME);
}
// 1-based session before which teacher explicitly confirms teaching.
// null = no teacher confirmation during this test. A numeric scenario is
// a test fixture, NOT an automatically scheduled teaching requirement.
function run(catalog,annotations,options={}){
  if(catalog.length!==1523||annotations.size!==79)throw Error('AF : catalogue/annotations différents');
  const seed=options.seed??13,profile=options.profile??'balanced';
  const count=options.sessions??45;
  const taughtBefore=options.teacherConfirmedBeforeSession??null;
  if(!Number.isInteger(count)||count<1||count>100||
     taughtBefore!==null&&(!Number.isInteger(taughtBefore)||taughtBefore<1||taughtBefore>count))
    throw Error('AF : entrée de séance non valide');
  const state=F.newState(seed),sessions=[];
  let previousTaught=false,scheduledSlotsUsed=0;
  const events=[];
  for(let index=0;index<count;index++){
    const session=index+1;
    const taught=taughtBefore!==null&&session>=taughtBefore;
    const pool=visibleQuestions(catalog,taught);
    if(taught&&!previousTaught){
      // Recompute only the static independent-family review-support map:
      // any newly taught rubric can now take part in eligible reviews.
      state.reviewSupport=null;
      events.push({type:'TEACHER_CONFIRMED_TAUGHT',beforeSession:session});
    }
    previousTaught=taught;
    const deck=F.select(pool,state,annotations,10);
    if(deck.length!==10||deck.some(q=>!pool.includes(q)))
      throw Error('AF : séance incomplète ou question verrouillée : '+session);
    if(deck.some(q=>q.theme===LOCKED_THEME)&&
       (!taught||index<P.INTRO[LOCKED_THEME]))
      throw Error('AF : Rubensohl présenté sans enseignement ou avant introduction');
    if(new Set(deck.map(F.family)).size!==10)
      throw Error('AF : famille répétée dans la même séance');
    scheduledSlotsUsed+=state.lastSelection.filter(x=>x.source==='scheduled-recall').length;
    sessions.push(deck);
    F.recordSession(state,deck,F.simulatedAnswers(deck,index,seed,profile),annotations);
  }
  const themeCount=sessions.flat().filter(q=>q.theme===LOCKED_THEME).length;
  const due=state.reviewEvents.filter(x=>x.source==='scheduled').length;
  return {status:'SIMULATED_PATH_ONLY_NO_STUDENT_DATA',sessions,state,
    teacherConfirmationEvents:events,
    teacherConfirmedBeforeSession:taughtBefore,
    questionsPerSession:10,
    lessonsIncluded:0,originalCatalogSize:catalog.length,
    advancedThemeQuestions:themeCount,
    metrics:{...F.metrics(sessions),review:{
      scheduledSlotsUsed,scheduledDueRecalls:due,
      actualDueRecalls:state.reviewEvents.length
    }}};
}
function analyze(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)throw Error('AF : source altérée');
  const profiles=['balanced','fragile-mineures','facile'];
  const seeds=[13,29,47],rows=[];
  const round=x=>Math.round(x*100)/100;
  for(const profile of profiles)for(const seed of seeds){
    const options={profile,seed,sessions:45};
    const reference=F.simulateV2(catalog,annotations,options);
    const locked=run(catalog,annotations,options);
    const whenTaught=run(catalog,annotations,
      {...options,teacherConfirmedBeforeSession:40});
    const refEarly=reference.sessions.slice(0,P.INTRO[LOCKED_THEME])
      .map(deck=>deck.map(q=>q.id));
    const lockEarly=locked.sessions.slice(0,P.INTRO[LOCKED_THEME])
      .map(deck=>deck.map(q=>q.id));
    if(JSON.stringify(refEarly)!==JSON.stringify(lockEarly))
      throw Error('AF : sessions précoces ont changé avant disponibilité Rubensohl');
    const observed=record=>record.sessions.flat().filter(q=>q.theme===LOCKED_THEME)
      .map(q=>q.id);
    const first=(item)=>{
      const i=item.sessions.findIndex(deck=>deck.some(q=>q.theme===LOCKED_THEME));
      return i<0?null:i+1;
    };
    if(first(locked)!==null||first(whenTaught)!==null&&first(whenTaught)<40)
      throw Error('AF : convention avancée apparue sans confirmation enseignante');
    for(const item of [locked,whenTaught]){
      if(item.metrics.questionCount!==450||item.metrics.repeatedFamilySessions!==0||
         item.metrics.uniqueFamilies<430)
        throw Error('AF : perte inacceptable de séances/familles');
    }
    const compare=(item)=>({
      families:item.metrics.uniqueFamilies,
      scheduledRecalls:item.metrics.review.scheduledDueRecalls,
      distinctThemes:Object.keys(item.metrics.themes).length,
      rubensohlQuestions:item.advancedThemeQuestions,
      firstRubensohlSession:first(item),
      answers1Club:item.metrics.opening['1♣']||0,
      answers1Diamond:item.metrics.opening['1♦']||0,
      minorResponses:[item.metrics.responses['rep:1♣']||0,
        item.metrics.responses['rep:1♦']||0]
    });
    rows.push({profile,seed,
      reference:{families:reference.metrics.uniqueFamilies,
        scheduledRecalls:reference.metrics.revision.scheduledDueRecalls,
        rubensohlQuestions:observed(reference).length,
        firstRubensohlSession:first(reference),
        distinctThemes:Object.keys(reference.metrics.themes).length},
      defaultLocked:compare(locked),taughtAt40:compare(whenTaught),
      identicalUntilRubensohlEligible:true,
      deltaFamiliesLocked:locked.metrics.uniqueFamilies-reference.metrics.uniqueFamilies,
      deltaRecallsLocked:locked.metrics.review.scheduledDueRecalls-
        reference.metrics.revision.scheduledDueRecalls});
  }
  const range=(key)=>[Math.min(...rows.map(key)),Math.max(...rows.map(key))];
  const report={schema:'QPJB_AF_TEACHER_TAUGHT_RUBENSOHL_1',policy:POLICY,
    scenarios:rows.length,sessionsPerScenario:45,questionsPerSession:10,
    catalogQuestions:catalog.length,advancedSourceQuestions:catalog.filter(q=>q.theme===LOCKED_THEME).length,
    comparison:'baseline vs teacher-not-taught vs explicit confirmation before synthetic session 40',
    noConfirmationAllLocked:rows.every(x=>x.defaultLocked.firstRubensohlSession===null),
    confirmationNeverEarlierThan40:rows.every(x=>x.taughtAt40.firstRubensohlSession===null||
      x.taughtAt40.firstRubensohlSession>=40),
    allFirst34Identical:rows.every(x=>x.identicalUntilRubensohlEligible),
    defaultFamilyRange:range(x=>x.defaultLocked.families),
    defaultRecallRange:range(x=>x.defaultLocked.scheduledRecalls),
    familyDeltaRange:range(x=>x.deltaFamiliesLocked),
    recallDeltaRange:range(x=>x.deltaRecallsLocked),
    actualStudentsObserved:0,lessonsAdded:0,productionTouched:false,
    note:'Session 40 is a test-only teacher confirmation fixture, NOT a forced teaching schedule',
    rows};
  return report;
}
module.exports={POLICY,LOCKED_THEME,visibleQuestions,run,analyze};
if(require.main===module)process.stdout.write(JSON.stringify(analyze(),null,2)+'\n');

'use strict';
/* QPJB AF — QUESTIONS ONLY, progression automatique.
 * Rubensohl suit l'introduction de la feuille de route originale (35e séance).
 * Aucune confirmation de l'enseignante n'est demandée.
 * Surcouche expérimentale V2-F, sans leçon ni modification du site public.
 */
const F=require('./parcours-v2-pilot.cjs');
const P=require('../quizz-parcours.js');
const ADVANCED_THEME='rubensohl';
const POLICY=Object.freeze({
  name:'QUESTIONS_ONLY_AUTOMATIC_PROGRESS',
  noLessons:true,
  noLessonGate:true,
  teacherConfirmationRequired:false,
  automaticRubensohlIntroSession:P.INTRO[ADVANCED_THEME]+1,
  respectOriginalThemeIntro:true,
  originalCatalogUnmodified:true,
  publicRuntimeWired:false,
  anyStudentDataUsed:false
});
function requiresRubensohl(q){
  return q.theme===ADVANCED_THEME||/rubensohl/i.test([
    q.context||'',...(Array.isArray(q.auction)?q.auction:[]),
    q.explain||''
  ].join(' '));
}
function visibleQuestions(catalog){
  // Le moteur choisit parmi tous les QCM ; son ordre dépend de P.INTRO
  // et des autres prérequis existants, pas d'une approbation manuelle.
  return catalog;
}
function run(catalog,annotations,options={}){
  if(catalog.length!==1523||annotations.size!==79)
    throw Error('AF : catalogue/annotations différents');
  if(Object.prototype.hasOwnProperty.call(options,'teacherConfirmedBeforeSession'))
    throw Error('AF : déverrouillage manuel supprimé');
  const seed=options.seed??13,profile=options.profile??'balanced';
  const count=options.sessions??45;
  if(!Number.isInteger(count)||count<1||count>100)
    throw Error('AF : nombre de séances non valide');
  const state=F.newState(seed),sessions=[];
  let scheduledSlotsUsed=0;
  const pool=visibleQuestions(catalog);
  for(let index=0;index<count;index++){
    const deck=F.select(pool,state,annotations,10);
    if(deck.length!==10||deck.some(q=>!pool.includes(q)))
      throw Error('AF : séance incomplète : '+(index+1));
    if(index<P.INTRO[ADVANCED_THEME]&&deck.some(requiresRubensohl))
      throw Error('AF : Rubensohl présenté trop tôt : '+(index+1));
    if(new Set(deck.map(F.family)).size!==10)
      throw Error('AF : famille répétée dans la même séance');
    scheduledSlotsUsed+=state.lastSelection.filter(x=>x.source==='scheduled-recall').length;
    sessions.push(deck);
    F.recordSession(state,deck,F.simulatedAnswers(deck,index,seed,profile),annotations);
  }
  const themeCount=sessions.flat().filter(q=>q.theme===ADVANCED_THEME).length;
  const due=state.reviewEvents.filter(x=>x.source==='scheduled').length;
  return {status:'SIMULATED_PATH_ONLY_NO_STUDENT_DATA',sessions,state,
    questionsPerSession:10,
    automaticRubensohlIntroSession:P.INTRO[ADVANCED_THEME]+1,
    lessonsIncluded:0,originalCatalogSize:catalog.length,
    advancedThemeQuestions:themeCount,
    metrics:{...F.metrics(sessions),review:{
      scheduledSlotsUsed,scheduledDueRecalls:due,
      actualDueRecalls:state.reviewEvents.length
    }}};
}
function analyze(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)
    throw Error('AF : source altérée');
  const profiles=['balanced','fragile-mineures','facile'];
  const seeds=[13,29,47],rows=[];
  const first=item=>{
    const i=item.sessions.findIndex(deck=>deck.some(q=>q.theme===ADVANCED_THEME));
    return i<0?null:i+1;
  };
  for(const profile of profiles)for(const seed of seeds){
    const options={profile,seed,sessions:45};
    const reference=F.simulateV2(catalog,annotations,options);
    const automatic=run(catalog,annotations,options);
    const refIds=reference.sessions.map(deck=>deck.map(q=>q.id));
    const automaticIds=automatic.sessions.map(deck=>deck.map(q=>q.id));
    const identicalSelections=JSON.stringify(refIds)===JSON.stringify(automaticIds);
    if(!identicalSelections)throw Error('AF : tirages différents du V2-F de référence');
    if(first(automatic)!==35)throw Error('AF : Rubensohl pas en séance 35 dans le scénario');
    if(automatic.metrics.questionCount!==450||
       automatic.metrics.repeatedFamilySessions!==0||
       automatic.metrics.uniqueFamilies<430)
      throw Error('AF : perte inacceptable de séances/familles');
    if(automatic.metrics.review.scheduledDueRecalls!==
       reference.metrics.revision.scheduledDueRecalls)
      throw Error('AF : rappels différents de la référence');
    rows.push({profile,seed,firstRubensohlSession:first(automatic),
      rubensohlQuestions:automatic.advancedThemeQuestions,
      families:automatic.metrics.uniqueFamilies,
      targetedRecalls:automatic.metrics.review.scheduledDueRecalls,
      distinctThemes:Object.keys(automatic.metrics.themes).length,
      identicalSelections});
  }
  const range=key=>[Math.min(...rows.map(key)),Math.max(...rows.map(key))];
  return {schema:'QPJB_AF_AUTOMATIC_RUBENSOHL_2',policy:POLICY,
    scenarios:rows.length,sessionsPerScenario:45,questionsPerSession:10,
    catalogQuestions:catalog.length,
    advancedSourceQuestions:catalog.filter(q=>q.theme===ADVANCED_THEME).length,
    rubensohlMentionedUnderOtherThemes:catalog.filter(q=>
      q.theme!==ADVANCED_THEME&&requiresRubensohl(q)).map(q=>({id:q.id,theme:q.theme})),
    firstRubensohlSessionRange:range(x=>x.firstRubensohlSession),
    familyRange:range(x=>x.families),recallRange:range(x=>x.targetedRecalls),
    allSelectionsMatchReference:rows.every(x=>x.identicalSelections),
    actualStudentsObserved:0,lessonsAdded:0,productionTouched:false,
    note:'Rubensohl devient éligible à la séance 35, sans confirmation enseignante; le choix effectif dépend du moteur.',
    rows};
}
module.exports={POLICY,ADVANCED_THEME,requiresRubensohl,visibleQuestions,run,analyze};
if(require.main===module)process.stdout.write(JSON.stringify(analyze(),null,2)+'\n');

'use strict';
/* QPJB Y: first encounters with advanced rubrics, *read-only source audit*.
 * Related rubrics below are human-review cues, NOT prerequisite equivalences,
 * skill-proof, teaching quality scores, or restrictions to selection.
 */
const F=require('./parcours-v2-pilot.cjs');
const P=require('../quizz-parcours.js');
const W=require('./parcours-v2-progression-w.cjs');
const WATCH=Object.freeze({
  fortes:['ouv','sa'],
  forcing:['red','second'],
  multilandy:['intervenir','sa'],
  rubensohl:['sa','apres_inter'],
  michaels:['intervenir','reveil'],
  chelem:['apres_fit','sa']
});
const PROFILES=['balanced','fragile-mineures','facile'];
const SEEDS=[13,29,47];
const PREVIOUS_WINDOW=5;
function originalExcerpt(q){
  return {id:q.id,family:F.family(q),theme:q.theme,
    editorialDifficulty:q.difficulty,
    shape:q.shape.slice(),h:q.h,
    auction:Array.isArray(q.auction)?q.auction.slice():[],
    context:q.context,answer:q.answer,choices:q.choices.slice(),
    explain:q.explain,difficultyReason:q.difficultyReason||null,
    explicitReminderInPrompt:/\bRappel\s*:/i.test(q.context||'')};
}
function firstEncounter(sessions,catalog){
  if(!Array.isArray(sessions)||sessions.length===0||
    sessions.some(deck=>!Array.isArray(deck)||deck.length!==10))
    throw Error('Y : séances incomplètes');
  const orig=new Map(catalog.map(q=>[q.id,q]));
  if(orig.size!==catalog.length)throw Error('Y : IDs catalogue non uniques');
  const themeFirst=new Map(),observations=[];
  for(let si=0;si<sessions.length;si++)for(let pi=0;pi<10;pi++){
    const q=sessions[si][pi];
    if(orig.get(q.id)!==q)throw Error('Y : source recopiée : '+q.id);
    if(!themeFirst.has(q.theme))themeFirst.set(q.theme,{session:si+1,position:pi+1,q});
  }
  for(const [theme,cues] of Object.entries(WATCH)){
    const hit=themeFirst.get(theme);
    if(!hit){observations.push({theme,status:'NON_RENCONTREE',sourceCues:cues});continue}
    const start=hit.session-1;
    const historic=sessions.slice(0,start).flat();
    const recent=sessions.slice(Math.max(0,start-PREVIOUS_WINDOW),start).flat();
    const currentPrior=sessions[start].slice(0,hit.position-1);
    const priorByTheme=Object.fromEntries(cues.map(t=>[t,{
      earlierSessions:historic.filter(q=>q.theme===t).length,
      lastFiveSessions:recent.filter(q=>q.theme===t).length,
      earlierInSameSession:currentPrior.filter(q=>q.theme===t).length,
      lastFiveSourceIds:recent.filter(q=>q.theme===t).slice(-3).map(q=>q.id)
    }]));
    const relatedPreviously=cues.some(t=>priorByTheme[t].earlierSessions>0);
    const relatedRecently=cues.some(t=>priorByTheme[t].lastFiveSessions>0);
    const sameSessionDifficulty=sessions[start].map(q=>q.difficulty);
    const first=originalExcerpt(hit.q);
    observations.push({theme,status:'OBSERVEE',
      firstSession:hit.session,eligibleFrom:P.INTRO[theme]+1,
      delayFromEligibility:hit.session-(P.INTRO[theme]+1),
      firstPosition:hit.position,first,sourceCues:cues,priorByTheme,
      relatedRubricPreviouslyExposed:relatedPreviously,
      relatedRubricInPreviousFiveSessions:relatedRecently,
      sameSessionHighCount:sameSessionDifficulty.filter(x=>x>=4).length,
      sameSessionOriginalIds:sessions[start].map(q=>q.id),
      editorialSignal:hit.q.difficulty>=4?'FIRST_EXPOSURE_4_OR_5':'FIRST_EXPOSURE_1_TO_3',
      evidenceOnly:true,foundationalMasteryInferred:false,
      instructionQualityInferred:false});
  }
  return {schema:'QPJB_V2_Y_FIRST_TRANSITIONS_1',status:'SOURCE_ONLY_OBSERVATION',
    sourceQuestions:catalog.length,sessions:sessions.length,
    observations,sourceCuesAreNotPrerequisites:true,
    learnerDataUsed:false,sourceEdited:false,selectionChanged:false,
    masteryInferred:false,publicRuntimeWired:false};
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)throw Error('Y : périmètre inattendu');
  const rows=[];
  for(const profile of PROFILES)for(const seed of SEEDS){
    const s=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
    const report=firstEncounter(s.sessions,catalog);
    if(report.observations.some(x=>x.status!=='OBSERVEE'))
      throw Error('Y : rubrique avancée non rencontrée');
    const wa=W.trace(s.sessions,catalog,annotations);
    rows.push({profile,seed,independentFamilies:s.metrics.uniqueFamilies,
      targetedRecalls:s.metrics.revision.scheduledDueRecalls,
      themeCoverage:wa.themesSeen,
      observations:report.observations});
  }
  const range=xs=>[Math.min(...xs),Math.max(...xs)];
  const byTheme=Object.fromEntries(Object.keys(WATCH).map(theme=>{
    const xs=rows.map(r=>r.observations.find(x=>x.theme===theme));
    return [theme,{
      firstSessionRange:range(xs.map(x=>x.firstSession)),
      firstDifficultyRange:range(xs.map(x=>x.first.editorialDifficulty)),
      highFirstExposureScenarios:xs.filter(x=>x.first.editorialDifficulty>=4).length,
      explicitReminderInFirstQuestionScenarios:xs.filter(x=>x.first.explicitReminderInPrompt).length,
      anyRelatedRubricPreviouslyScenarios:xs.filter(x=>x.relatedRubricPreviouslyExposed).length,
      anyRelatedRubricRecentlyScenarios:xs.filter(x=>x.relatedRubricInPreviousFiveSessions).length,
      firstIds:[...new Set(xs.map(x=>x.first.id))].sort(),
      firstExamples:xs.slice(0,3).map(x=>({id:x.first.id,session:x.firstSession,
        editorialDifficulty:x.first.editorialDifficulty,
        context:x.first.context,answer:x.first.answer,
        explanation:x.first.explain,
        priorByTheme:x.priorByTheme}))
    }];
  }));
  const prioritySignals=rows.flatMap(r=>r.observations.filter(x=>
    x.first.editorialDifficulty>=4&&!x.first.explicitReminderInPrompt&&
    !x.relatedRubricInPreviousFiveSessions).map(x=>({
      profile:r.profile,seed:r.seed,theme:x.theme,
      id:x.first.id,session:x.firstSession,editorialDifficulty:x.first.editorialDifficulty,
      context:x.first.context,explain:x.first.explain,
      sourceCues:x.sourceCues,priorByTheme:x.priorByTheme
    })));
  return {schema:'QPJB_V2_Y_NINE_SCENARIOS_1',
    status:'EDITORIAL_TRIAGE_NOT_RECOMMENDATION',
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    catalogQuestions:catalog.length,watchThemes:Object.keys(WATCH),
    cueWindowSessions:PREVIOUS_WINDOW,byTheme,
    prioritySignals:prioritySignals.slice(0,36),
    prioritySignalsTotal:prioritySignals.length,
    referenceFamiliesRange:range(rows.map(r=>r.independentFamilies)),
    referenceRecallsRange:range(rows.map(r=>r.targetedRecalls)),
    allRubricsCovered:rows.every(r=>r.themeCoverage===22),
    rows,sourceCuesAreNotPrerequisites:true,
    masteryInferred:false,learnerDataUsed:false,
    sourceEdited:false,selectionChanged:false,publicRuntimeWired:false,
    decision:'Revue enseignant des contextes originaux seulement; aucune modification du moteur'};
}
module.exports={WATCH,PREVIOUS_WINDOW,originalExcerpt,firstEncounter,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');

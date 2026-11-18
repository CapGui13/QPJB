'use strict';
/* QPJB V2-P : 16 axes sémantiques observés en lecture seule.
 * Jamais d'injection d'exercices, de score de maîtrise ou de déblocage.
 */
const fs=require('node:fs'),path=require('node:path');
const Pilot=require('./parcours-v2-pilot.cjs');
const N=require('./parcours-v2-observatoire-n.cjs');
const source=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_P_AXES_SEMANTIQUES_20261118.json');
function load(){return JSON.parse(fs.readFileSync(source,'utf8'))}
function readOnlyAudit(sessions,pilotState,catalog,index,mapping=load()){
  if(mapping.proposedAxes!==16||mapping.publicRuntimeWired!==false||
     mapping.masteryInferenceEnabled!==false||
     mapping.unlockEngineEnabled!==false||mapping.gradingEnabled!==false)
    throw Error('La cartographie P doit rester strictement inactive');
  const base=N.analyzeSessions(sessions,index,pilotState);
  const byId=new Map(catalog.map(q=>[q.id,q]));
  const axes=mapping.axes.map(f=>{
    const known=new Set(f.sourceIds),observed=[],families=new Set(),when=new Set();
    for(let i=0;i<sessions.length;i++)for(const q of sessions[i]){
      if(!known.has(q.id))continue;
      observed.push(q.id);families.add(Pilot.family(q));when.add(i+1);
    }
    for(const id of known)if(!byId.has(id))throw Error('Source absente '+id);
    return {id:f.id,label:f.label,coverageStatus:f.coverageStatus,
      catalogIds:f.sourceIds.length,catalogFamilies:f.distinctSourceFamilies,
      presentations:observed.length,seenDifferentQcm:new Set(observed).size,
      seenDifferentFamilies:families.size,sessionsSeen:when.size,
      firstEncounterSession:when.size?Math.min(...when):null,
      mastered:false,
      reviewNeeded:f.editorialReviewRequired};
  });
  const map=new Map(axes.map(a=>[a.id,a]));
  const oldIntervention=base.byFoundation.find(x=>x.id==='fondation:intervention');
  const actualIntervention=map.get('fondation:intervention');
  if(!oldIntervention||!actualIntervention||
    oldIntervention.presentations!==actualIntervention.presentations)
    throw Error('La nouvelle vue P ne doit pas modifier l exposition historique');
  const additions=mapping.axes.filter(x=>x.kind==='AJOUT_CANDIDAT_APRES_AUDIT_O');
  if(additions.length!==1||additions[0].id!=='fondation:reponse_contre_adverse')
    throw Error('Nouvel axe non autorisé');
  return {schema:'QPJB_V2_P_SHADOW_EXPOSURE_20261118_1',
    status:'OBSERVATOIRE_CANDIDAT_NON_ACTIF',sessions:sessions.length,
    questions:sessions.length*10,original22ThemesSeen:base.all22ThemesSeen,
    originalUniqueFamilies:base.distinctOriginalFamilies,
    originalScheduledRecalls:base.scheduledRecalls,
    candidateAxesTotal:axes.length,
    candidateAxesSeen:axes.filter(a=>a.presentations>0).length,
    unexploredAxes:axes.filter(a=>a.presentations===0).map(a=>a.id),
    axes,masteryInferred:false,unlocksEnabled:false,
    note:'Une exposition constatée n est pas une compétence acquise'};
}
function batch(){
  const catalog=Pilot.loadCatalog(),annotations=Pilot.loadAnnotations();
  const index=N.loadIndex(catalog),mapping=load(),rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const run=Pilot.simulateV2(catalog,annotations,{sessions:45,profile,seed});
      const result=readOnlyAudit(run.sessions,run.state,catalog,index,mapping);
      const own=result.axes.find(x=>x.id==='fondation:intervention');
      const counter=result.axes.find(x=>x.id==='fondation:reponse_contre_adverse');
      rows.push({profile,seed,axesSeen:result.candidateAxesSeen,
        uncovered:result.unexploredAxes,
        ownInterventionQuestions:own.presentations,
        genuineCounterQuestions:counter.presentations,
        genuineCounterFamilies:counter.seenDifferentFamilies,
        all22Themes:result.original22ThemesSeen,
        uniqueFamilies:result.originalUniqueFamilies,
        targetedRecalls:result.originalScheduledRecalls});
    }
  const range=key=>[Math.min(...rows.map(x=>x[key])),Math.max(...rows.map(x=>x[key]))];
  return {schema:'QPJB_V2_P_9_SCENARIOS_20261118_1',
    status:'SIMULATION_LECTURE_SEULE_SANS_ELEVES',scenarios:rows.length,
    sessionsPerScenario:45,questionsPerScenario:450,
    originalCatalogQuestions:1523,candidateAxes:16,
    mappedQuestions:122,sourceAssociations:134,
    observedAxesRange:range('axesSeen'),
    ownInterventionRange:range('ownInterventionQuestions'),
    genuineAdversaryCounterRange:range('genuineCounterQuestions'),
    genuineAdversaryCounterFamilyRange:range('genuineCounterFamilies'),
    all22ThemesEachRun:rows.every(x=>x.all22Themes),
    originalUniqueFamiliesRange:range('uniqueFamilies'),
    originalRecallsRange:range('targetedRecalls'),
    masteryInferred:false,unlocksEnabled:false,rows};
}
module.exports={load,readOnlyAudit,batch};
if(require.main===module)process.stdout.write(JSON.stringify(batch(),null,2)+'\n');

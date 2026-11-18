'use strict';
/* QPJB O : comparateur d'exposition des deux situations "contre".
 * Produit des mesures descriptives sur des tirages V2-F inchangés.
 * Ni changement de questions, ni appréciation de maîtrise.
 */
const fs=require('node:fs'),path=require('node:path');
const P=require('./parcours-v2-pilot.cjs');
const SOURCE=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_O_CONTRE_ADVERSE_AUDIT_20261118.json');
function load(){return JSON.parse(fs.readFileSync(SOURCE,'utf8'))}
function analyze(exercises,annotations,options={}){
  const data=load();
  if(data.status!=='AUDIT_SEMANTIQUE_CANDIDAT_NON_ACTIF'||
    data.noMasteryInference!==true||data.unlocksEnabled!==false)
    throw Error('Cartographie O non approuvée pour audit de lecture seule');
  const current=new Set(data.proposedSplit[0].originalEvidenceIds);
  const better=new Set(data.sourceCandidates.map(e=>e.id));
  if(current.size!==13||better.size!==12)throw Error('Sources O inattendues');
  const catalog=new Map(exercises.map(x=>[x.id,x]));
  for(const row of data.sourceCandidates){
    const q=catalog.get(row.id);
    if(!q||q.answer!==row.answer||P.family(q)!==row.family)
      throw Error('Source O hors catalogue '+row.id);
  }
  const pilot=P.simulateV2(exercises,annotations,options);
  const sessions=pilot.sessions.map((deck,index)=>{
    const old=deck.filter(q=>current.has(q.id));
    const relevant=deck.filter(q=>better.has(q.id));
    return {session:index+1,oldInterventionIds:old.map(x=>x.id),
      realCounterResponseIds:relevant.map(x=>x.id)};
  });
  const oldQcm=new Set(sessions.flatMap(x=>x.oldInterventionIds));
  const newQcm=new Set(sessions.flatMap(x=>x.realCounterResponseIds));
  return {schema:'QPJB_V2_O_EXPOSITION_CONTRE_20261118_1',
    status:'SIMULATION_FICTIVE_NON_ACTIVE',
    sessions:sessions.length,questions:sessions.length*10,
    oldInterventionAppearances:sessions.reduce((n,x)=>n+x.oldInterventionIds.length,0),
    oldDistinctQcm:oldQcm.size,
    genuineAdversaryCounterAppearances:sessions.reduce((n,x)=>n+x.realCounterResponseIds.length,0),
    genuineAdversaryCounterDistinctQcm:newQcm.size,
    genuineAdversaryCounterSessions:sessions.filter(x=>x.realCounterResponseIds.length).length,
    sessionsWithCounterSource:sessions.filter(x=>x.oldInterventionIds.length||x.realCounterResponseIds.length).length,
    sessionDetails:sessions,
    pilotScheduledRecalls:pilot.metrics.revision.scheduledDueRecalls,
    catalogCount:exercises.length,
    masteryDeclared:false,
    note:'Les 13 sources anciennes concernent notre intervention sur une ouverture adverse. Les 12 nouvelles concernent des réponses après 1m/1M-(Contre) adverse.'};
}
function batch(){
  const exercises=P.loadCatalog(),annotations=P.loadAnnotations();
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const r=analyze(exercises,annotations,{sessions:45,seed,profile});
      rows.push({profile,seed,oldInterventionAppearances:r.oldInterventionAppearances,
        genuineAdversaryCounterAppearances:r.genuineAdversaryCounterAppearances,
        genuineAdversaryCounterDistinctQcm:r.genuineAdversaryCounterDistinctQcm,
        genuineAdversaryCounterSessions:r.genuineAdversaryCounterSessions,
        pilotScheduledRecalls:r.pilotScheduledRecalls});
    }
  const range=k=>[Math.min(...rows.map(x=>x[k])),Math.max(...rows.map(x=>x[k]))];
  return {schema:'QPJB_V2_O_9_SCENARIOS_20261118_1',
    status:'SIMULATION_FICTIVE_NON_ACTIVE',scenarios:9,sessionsPerScenario:45,
    originalInterventionAppearances:range('oldInterventionAppearances'),
    actualCounterAppearances:range('genuineAdversaryCounterAppearances'),
    actualCounterDistinctQuestions:range('genuineAdversaryCounterDistinctQcm'),
    actualCounterSessions:range('genuineAdversaryCounterSessions'),
    targetedRecallsUnchanged:range('pilotScheduledRecalls'),
    masteryDeclared:false,rows};
}
module.exports={load,analyze,batch};
if(require.main===module)process.stdout.write(JSON.stringify(batch(),null,2)+'\n');

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),reco=require('../parcours-recommandations.js');
const x={id:'REV-SAME',theme:'ouv',answer:'Passe',difficulty:1,
  caseFamily:'REV-FAMILY',auction:[],difficultyReason:''};
function finish(s,mode='parcours',result='correct',assisted=false,stamp=null){
  s.active={ids:[x.id],index:0,answers:{},createdAt:s.completed,
    ...(mode==='consolidation'?{mode,targets:[]}:{})};
  assert.equal(core.record(s,x,result,0,null,assisted,false),true);
  assert.equal(core.finish(s,[x]),true);
  if(stamp!==null)s.journal.at(-1).recordedAt=stamp;
}
test('P27 2 consolidations réellement distinctes, même session et question : 2 réponses',()=>{
  const s=core.empty();
  finish(s);
  finish(s,'consolidation','correct',false,'2026-11-22T09:00:00.000Z');
  finish(s,'consolidation','correct',true,'2026-11-22T10:00:00.000Z');
  assert.equal(s.completed,1);
  assert.equal(s.journal[1].session,s.journal[2].session);
  assert.equal(s.journal[1].answers[0].id,s.journal[2].answers[0].id);
  const before=JSON.stringify(s),r=reco.buildReport(s);
  assert.deepEqual(r.observations.consolidation,
    {autonomous:1,helped:1,wrong:0,skipped:0});
  assert.deepEqual(r.observations.parcours,
    {autonomous:1,helped:0,wrong:0,skipped:0});
  assert.equal(r.observations.detailedSessions,1);
  assert.equal(JSON.stringify(s),before);
});
test('P27 copie exacte d’une consolidation : pas de fausse preuve supplémentaire',()=>{
  const s=core.empty();
  finish(s);
  finish(s,'consolidation','correct',true,'2026-11-22T09:00:00.000Z');
  s.journal.push(structuredClone(s.journal.at(-1)));
  const r=reco.buildReport(s);
  assert.deepEqual(r.observations.consolidation,
    {autonomous:0,helped:1,wrong:0,skipped:0});
});
test('P27 2 journaux sans horodatage : rester conservateur',()=>{
  const s=core.empty();
  finish(s);
  finish(s,'consolidation','correct',false,null);
  finish(s,'consolidation','correct',true,null);
  s.journal[1].recordedAt=null;
  s.journal[2].recordedAt=null;
  const r=reco.buildReport(s);
  assert.equal(r.observations.consolidation.autonomous,1);
  assert.equal(r.observations.consolidation.helped,0);
});
test('P27 parcours normal répété : conserve le comptage de sessions distinctes',()=>{
  const s=core.empty();
  finish(s,'parcours','correct',false,'2026-11-22T09:00:00.000Z');
  finish(s,'parcours','correct',false,'2026-11-22T09:00:00.000Z');
  const r=reco.buildReport(s);
  assert.equal(s.completed,2);
  assert.equal(r.observations.parcours.autonomous,2);
  assert.equal(r.observations.detailedSessions,2);
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q=i=>({id:'UNCLASSIFIED-'+i,theme:'stayman',answer:'2♣',difficulty:1,
  caseFamily:'TECH-'+i,auction:[],difficultyReason:''});
function completed(n,result='correct'){
  const state=core.empty(),qs=Array.from({length:n},(_,i)=>q(i));
  state.active={ids:qs.map(x=>x.id),index:0,answers:{},createdAt:0};
  for(let i=0;i<qs.length;i++)
    assert.equal(core.record(state,qs[i],result,i,null,false,false),true);
  assert.equal(core.finish(state,qs),true);
  return state;
}
test('P14 séance achevée hors taxonomie : pas de tableau vide',()=>{
  const s=completed(10),before=JSON.stringify(s),r=rec.buildReport(s);
  assert.equal(r.completedSessions,1);
  assert.equal(r.observations.detailedSessions,1);
  assert.equal(r.observations.evaluatedMicros,0);
  assert.equal(r.observations.evaluatedAxes,0);
  assert.equal(r.observations.parcours.autonomous,10);
  assert.deepEqual(r.recommendations.map(x=>x.type),['not_evaluated']);
  assert.match(r.recommendations[0].title,/sans classification de notion/);
  assert.match(r.recommendations[0].explanation.observed,/dont 1 avec journal détaillé/);
  assert.match(r.recommendations[0].explanation.action,/Poursuivre le parcours/);
  assert.equal(JSON.stringify(s),before);
});
test('P14 erreurs non classifiées : ne pas inventer une compétence déficiente',()=>{
  const r=rec.buildReport(completed(3,'wrong'));
  assert.equal(r.observations.parcours.wrong,3);
  assert.deepEqual(r.recommendations.map(x=>x.type),['not_evaluated']);
  assert.ok(!r.recommendations.some(x=>x.type==='persistent_difficulty'));
  assert.match(r.recommendations[0].explanation.caveat,/aucune classification auditée/);
});
test('P14 sauvegarde ancienne sans journal garde son message historique',()=>{
  const s=core.empty();s.completed=65;
  const r=rec.buildReport(s);
  assert.equal(r.recommendations[0].title,'Historique sans évaluation de notion exploitable');
  assert.equal(r.observations.sessionsWithoutDetail,65);
  assert.match(r.recommendations[0].explanation.action,/Poursuivre/);
});
test('P14 reprise active après réponses non classifiées : une seule action',()=>{
  const s=completed(2);
  s.active={ids:['NEXT'],index:0,answers:{},createdAt:s.completed};
  const r=rec.buildReport(s,{maxRecommendations:3});
  assert.deepEqual(r.recommendations.map(x=>x.type),['resume']);
  assert.equal(r.currentSession.answered,0);
});

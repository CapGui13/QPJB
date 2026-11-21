'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),reco=require('../parcours-recommandations.js');
function active(s,mode='parcours'){
  s.active={ids:['A','B'],index:0,answers:{},createdAt:s.completed,
    ...(mode==='consolidation'?{mode:'consolidation'}:{})};
}
const kinds=s=>reco.buildReport(s,{maxRecommendations:10}).recommendations.map(x=>x.type);

test('P12 séance initiale active : reprise seule, aucun ordre de commencer à nouveau',()=>{
  const s=core.empty();active(s);
  assert.deepEqual(kinds(s),['resume']);
  const r=reco.buildReport(s);
  assert.equal(r.currentSession.total,2);
  assert.equal(r.currentSession.answered,0);
  assert.equal(r.revision,null);
});

test('P12 séance de consolidation interrompue : reprise seule, aucune nouvelle séance',()=>{
  const s=core.empty();active(s,'consolidation');
  const r=reco.buildReport(s,{exercises:[]});
  assert.deepEqual(r.recommendations.map(x=>x.type),['resume']);
  assert.equal(r.currentSession.mode,'consolidation');
  assert.equal(r.revision,null);
});

test('P12 absence de séance active : conseil neutre pour commencer préservé',()=>{
  const s=core.empty();
  assert.deepEqual(kinds(s),['not_evaluated']);
});

test('P12 sauvegarde 65 séances sans preuves avec reprise : pas de conseils contradictoires',()=>{
  const s=core.empty();s.completed=65;active(s);
  const before=JSON.stringify(s),r=reco.buildReport(s,{maxRecommendations:10});
  assert.deepEqual(r.recommendations.map(x=>x.type),['resume']);
  assert.equal(r.observations.sessionsWithoutDetail,65);
  assert.match(r.recommendations[0].explanation.caveat,/65 séance/);
  assert.equal(JSON.stringify(s),before);
});

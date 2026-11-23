'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',
  difficulty:1,caseFamily:'SEF-026-3',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function sessions(n,result){
  const s=core.empty();
  for(let i=0;i<n;i++){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,result,0,null,false,false),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}

test('P16 journal de trois erreurs, compteurs de succès : aucune maîtrise inventée',()=>{
  const s=sessions(3,'correct');
  for(const ev of s.journal)ev.answers[0].result='wrong';
  const before=JSON.stringify(s),r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.wrong,3);
  assert.ok(!r.recommendations.some(x=>x.type==='repeated_autonomous'));
  assert.ok(r.recommendations.some(x=>x.title==='Suivi contradictoire à vérifier'));
  assert.match(r.limitations.join(' '),/2 suivi\(s\) de notion divergent/);
  assert.match(r.recommendations[0].explanation.caveat,/ni à une maîtrise/);
  assert.equal(JSON.stringify(s),before);
});
test('P16 journal de succès, compteurs de difficulté : aucun faux diagnostic',()=>{
  const s=sessions(2,'wrong');
  for(const ev of s.journal)ev.answers[0].result='correct';
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.autonomous,2);
  assert.ok(!r.recommendations.some(x=>x.type==='persistent_difficulty'));
  assert.match(r.limitations.join(' '),/conseils concernés écartés/);
});
test('P16 suivi légitime, succès répétitifs : conserve la réussite prouvée',()=>{
  const s=sessions(3,'correct'),r=rec.buildReport(s,{maxRecommendations:10});
  assert.ok(r.recommendations.some(x=>x.type==='repeated_autonomous'));
  assert.ok(!r.limitations.join(' ').includes('divergent'));
});
test('P16 journal incomplet : jamais reconstruire ni invalider les compteurs',()=>{
  const s=sessions(3,'correct');
  s.journal.shift();
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.sessionsWithoutDetail,1);
  assert.ok(r.recommendations.some(x=>x.type==='repeated_autonomous'));
  assert.ok(!r.limitations.join(' ').includes('divergent'));
});

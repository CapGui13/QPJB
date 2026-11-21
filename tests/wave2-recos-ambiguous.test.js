'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'SEF-026-3',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function example(){
  const s=core.empty();
  for(let i=0;i<2;i++){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,'wrong',0,null,false,false),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
const count=r=>r.recommendations.filter(x=>x.type==='persistent_difficulty').length;

test('P15 doublon contradictoire axe : ne pas fusionner des preuves incertaines',()=>{
  const s=example(),copy=structuredClone(s.journal[0]);
  copy.answers[0].axis='force';
  s.journal.push(copy);
  s.axes.force=structuredClone(s.axes.fit);
  const before=JSON.stringify(s),r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.wrong,2);
  assert.equal(count(r),3);
  assert.ok(!r.recommendations.some(x=>x.evidence?.sameAnswersAs));
  assert.match(r.limitations.join(' '),/1 réponse\\(s\\) du journal avec versions contradictoires/);
  assert.equal(JSON.stringify(s),before);
});

test('P15 doublons parfaitement identiques : regroupement conservé',()=>{
  const s=example();
  s.journal.push(structuredClone(s.journal[0]));
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.wrong,2);
  assert.equal(count(r),1);
  assert.deepEqual(r.recommendations[0].evidence.sameAnswersAs,
    [{source:'axes',key:'fit',label:core.AXIS_LABELS.fit}]);
  assert.ok(!r.limitations.join(' ').includes('versions contradictoires'));
});

test('P15 doublon avec issue différente : ne pas fusionner ni compter deux réponses',()=>{
  const s=example(),copy=structuredClone(s.journal[0]);
  copy.answers[0].result='correct';
  s.journal.push(copy);
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.wrong,2);
  assert.equal(r.observations.parcours.autonomous,0);
  assert.equal(count(r),2);
  assert.ok(!r.recommendations.some(x=>x.evidence?.sameAnswersAs));
  assert.match(r.limitations.join(' '),/versions contradictoires/);
});

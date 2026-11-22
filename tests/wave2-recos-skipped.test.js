'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'AXIS-PROBE',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function profile(results){
  const s=core.empty();
  for(const result of results){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,result,0,null,false,false),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
test('P18 deux questions uniquement sautées : pas de difficulté déclarée',()=>{
  const s=profile(['skipped','skipped']),before=JSON.stringify(s);
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.observations.parcours.skipped,2);
  assert.equal(r.observations.parcours.wrong,0);
  assert.deepEqual(r.recommendations.map(x=>x.type),['not_evaluated']);
  const item=r.recommendations[0];
  assert.match(item.title,/questions sautées/);
  assert.equal(item.evidence.skippedOnly,true);
  assert.equal(item.evidence.sameAnswersAs[0].key,'fit');
  assert.match(item.explanation.caveat,/ni un échec/);
  assert.equal(JSON.stringify(s),before);
});
test('P18 deux erreurs effectivement constatées : difficulté V1 préservée',()=>{
  const r=rec.buildReport(profile(['wrong','wrong']),{maxRecommendations:10});
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.equal(r.recommendations[0].evidence.skippedOnly,undefined);
});
test('P18 un saut puis une erreur : conservatisme du score sans prétendre deux erreurs',()=>{
  const r=rec.buildReport(profile(['skipped','wrong']),{maxRecommendations:10});
  assert.equal(r.observations.parcours.skipped,1);
  assert.equal(r.observations.parcours.wrong,1);
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.ok(!r.recommendations[0].message.includes('deux erreurs'));
});
test('P18 ancienne sauvegarde sans journal : impossible de conclure que tout est sauté',()=>{
  const s=core.empty();s.completed=9;
  s.micros['majeur:1♠']={score:-2,attempts:2,independent:0,lastSession:8,lastScoredSession:8};
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.ok(!r.recommendations[0].evidence.skippedOnly);
  assert.equal(r.observations.sessionsWithoutDetail,9);
});

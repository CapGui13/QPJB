'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const fixtureReport=require('./progression-guidee-reco-fixtures.cjs').report;
const q=i=>({id:'POOL-'+i,theme:'ouv',answer:'Passe',difficulty:1,
  caseFamily:'FAM-'+i,auction:[],difficultyReason:''});
const pool=Array.from({length:7},(_,i)=>q(i));
function state(result){
  const s=core.empty();
  for(let i=0;i<2;i++){
    const x=q(i);
    s.active={ids:[x.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,x,result,0,null,false,false),true);
    assert.equal(core.finish(s,[x]),true);
  }
  return s;
}
test('P20 deux sauts seuls peuvent rendre la séance disponible sans prouver un échec',()=>{
  const s=state('skipped'),before=JSON.stringify(s);
  const r=fixtureReport(s,{maxRecommendations:3,exercises:pool});
  assert.equal(r.observations.parcours.wrong,0);
  assert.equal(r.observations.parcours.skipped,2);
  assert.equal(r.revision.available,true);
  const card=r.recommendations.find(x=>x.type==='revision_session');
  assert.ok(card);
  assert.equal(card.title,'Séance complémentaire disponible');
  assert.match(card.message,/questions sautées/);
  assert.ok(!card.message.includes('difficultés effectivement suivies'));
  assert.match(card.explanation.caveat,/sans erreur constatée/);
  assert.ok(r.recommendations.some(x=>x.evidence?.skippedOnly===true));
  assert.equal(JSON.stringify(s),before);
});
test('P20 erreurs réellement observées : disponibilité toujours gouvernée par V1',()=>{
  const s=state('wrong'),r=fixtureReport(s,{maxRecommendations:3,exercises:pool});
  assert.equal(r.observations.parcours.wrong,2);
  assert.equal(r.revision.available,true);
  assert.ok(r.recommendations.some(x=>x.type==='persistent_difficulty'));
  assert.ok(r.recommendations.some(x=>x.type==='revision_session'));
});
test('P20 reprise en cours : aucune séance complémentaire concurrente',()=>{
  const s=state('skipped');
  s.active={ids:['NEXT'],index:0,answers:{},createdAt:s.completed};
  const r=fixtureReport(s,{maxRecommendations:3,exercises:pool});
  assert.equal(r.revision,null);
  assert.equal(r.recommendations[0].type,'resume');
  assert.ok(!r.recommendations.some(x=>x.type==='revision_session'));
});

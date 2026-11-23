'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),reco=require('../parcours-recommandations.js');
const q=(id,answer='Passe')=>({id,theme:'ouv',answer,difficulty:1,
  caseFamily:id,auction:[],difficultyReason:''});
function one(s,x,result='wrong'){
  s.active={ids:[x.id],index:0,answers:{},createdAt:s.completed};
  assert.equal(core.record(s,x,result,0,null,false,false),true);
  assert.equal(core.finish(s,[x]),true);
}
const report=s=>reco.buildReport(s,{maxRecommendations:10});
test('P11 65 anciennes séances sans aucun détail : ne nie pas l’activité historique',()=>{
  const s=core.empty();s.completed=65;
  const r=report(s),item=r.recommendations.find(x=>x.type==='not_evaluated');
  assert.ok(item);
  assert.match(item.title,/Historique/);
  assert.match(item.explanation.observed,/65 séance/);
  assert.match(item.explanation.caveat,/65 séance/);
  assert.ok(!/Aucune notion encore évaluée/.test(item.title));
  assert.equal(r.observations.sessionsWithoutDetail,65);
});
test('P11 entrées anciennes sans micro ni axe : ni silence ni maîtrise inventée',()=>{
  const s=core.empty();s.completed=9;
  s.entries.OLD={result:'correct',assisted:false,lastSession:8,due:12,seen:15,streak:4,family:'OLD'};
  const r=report(s);
  assert.ok(r.recommendations.some(x=>x.type==='not_evaluated'));
  assert.ok(!r.recommendations.some(x=>x.type==='repeated_autonomous'));
});
test('P11 difficulté ancienne : date fondée sur lastSession V1, pas seuil inventé',()=>{
  const s=core.empty();
  one(s,q('WRONG1'));one(s,q('WRONG2'));
  for(let i=0;i<20;i++)one(s,q('LATER-'+i,'1♥'),'correct');
  const r=report(s),item=r.recommendations.find(x=>x.type==='persistent_difficulty');
  assert.ok(item);
  assert.match(item.explanation.observed,/séance 2 sur 22/);
  assert.equal(item.evidence.lastSession,1);
  assert.equal(r.completedSessions,22);
});
test('P11 historique partiel : chaque carte affichée conserve la limite',()=>{
  const s=core.empty();s.completed=65;
  s.micros['ouv:passe']={score:-3,attempts:4,independent:0,lastSession:42,lastScoredSession:42};
  const before=JSON.stringify(s),r=report(s);
  assert.ok(r.recommendations.length>0);
  for(const item of r.recommendations){
    assert.match(item.explanation.caveat,/65 séance/);
    assert.match(item.explanation.caveat,/sans journal détaillé/);
  }
  assert.equal(JSON.stringify(s),before);
});
test('P11 détail récent : le numéro de séance n’est pas artificiellement vieilli',()=>{
  const s=core.empty();one(s,q('A'));one(s,q('B'));
  const item=report(s).recommendations.find(x=>x.type==='persistent_difficulty');
  assert.ok(item);
  assert.match(item.explanation.observed,/séance 2 sur 2/);
  assert.ok(!item.explanation.caveat.includes('sans journal détaillé'));
});

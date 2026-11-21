'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const engine=require('../quizz-parcours.js'), rec=require('../parcours-recommandations.js');
const x=(id,answer='Passe',more={})=>({id,theme:'ouv',answer,difficulty:1,caseFamily:id,auction:[],difficultyReason:'',...more});
function one(s,q,result='wrong',opts={}){
  s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed,...(opts.mode==='consolidation'?{mode:'consolidation'}:{})};
  assert.equal(engine.record(s,q,result,0,null,!!opts.assisted,!!opts.hadFreeError),true);
  assert.equal(engine.finish(s,[q]),true);
}
const build=(s,o={})=>rec.buildReport(s,{maxRecommendations:10,...o});
const types=r=>r.recommendations.map(x=>x.type);
test('P2 assistance, erreur libre et saut ne prouvent pas une maîtrise',()=>{
  const s=engine.empty();
  one(s,x('H1'),'correct',{assisted:true});one(s,x('H2'),'correct',{hadFreeError:true});
  one(s,x('SK'),'skipped');one(s,x('W'),'wrong');
  const r=build(s);
  assert.deepEqual(r.observations.parcours,{autonomous:0,helped:2,wrong:1,skipped:1});
  assert.ok(!types(r).includes('repeated_autonomous'));
});
test('P2 micro/axe : deux cartes sur les mêmes deux échecs',()=>{
  const s=engine.empty();
  const q=x('SEF-026-3','2♠',{theme:'majeur',auction:['Partenaire : 1♠'],
    difficultyReason:'Soutien simple sur ouverture majeure'});
  assert.equal(engine.microKey(q),'majeur:1♠');assert.equal(engine.axisKey(q),'fit');
  one(s,q);one(s,q);
  const r=build(s);
  assert.equal(r.recommendations.filter(x=>x.type==='persistent_difficulty').length,2);
  assert.equal(r.observations.parcours.wrong,2);
});
test('P2 visibilité top 3 : une révision disponible peut être masquée',()=>{
  const s=engine.empty();
  for(const [i,a] of ['Passe','1♣','1♥'].entries())
    for(let j=0;j<2;j++)one(s,x('W-'+i+'-'+j,a));
  const pool=Array.from({length:7},(_,i)=>x('POOL-'+i));
  const full=build(s,{exercises:pool});
  assert.equal(full.revision.available,true);
  assert.ok(types(full).includes('revision_session'));
  const short=rec.buildReport(s,{exercises:pool,maxRecommendations:3});
  assert.deepEqual(types(short),['persistent_difficulty','persistent_difficulty','persistent_difficulty']);
});
test('P2 reprise active prioritaire, aucune nouvelle révision disponible',()=>{
  const s=engine.empty();one(s,x('W1'));one(s,x('W2'));
  s.active={ids:['A','B'],index:1,answers:{0:{result:'correct',choice:null,assisted:true,hadFreeError:false}},createdAt:s.completed};
  const before=JSON.stringify(s),r=build(s,{exercises:Array.from({length:7},(_,i)=>x('P'+i))});
  assert.equal(r.currentSession.answered,1);assert.equal(r.revision,null);
  assert.equal(r.recommendations[0].type,'resume');
  assert.equal(JSON.stringify(s),before);
});
test('P2 consolidation seule : preuves du parcours ordinaire inchangées',()=>{
  const s=engine.empty();
  for(let i=0;i<5;i++)one(s,x('CON-'+i),'correct',{mode:'consolidation',hadFreeError:i%2===0});
  const r=build(s);
  assert.equal(s.completed,0);
  assert.deepEqual(r.observations.consolidation,{autonomous:2,helped:3,wrong:0,skipped:0});
  assert.equal(r.observations.parcours.autonomous,0);
  assert.ok(!types(r).includes('repeated_autonomous'));
});
test('P2 ancien état 65 séances : aucune reconstruction de journal',()=>{
  const s=engine.empty();s.completed=65;
  s.micros['ouv:passe']={score:-3,attempts:9,independent:0,lastSession:48,lastScoredSession:48};
  s.entries.OLD={result:'wrong',assisted:false,lastSession:48,due:49,seen:9,streak:0,family:'OLD'};
  const r=build(JSON.stringify(s));
  assert.equal(r.observations.detailedSessions,0);assert.equal(r.observations.sessionsWithoutDetail,65);
  assert.ok(types(r).includes('persistent_difficulty'));
  assert.ok(!types(r).includes('repeated_autonomous'));
});
test('P2 journal dupliqué : ne compte pas deux fois',()=>{
  const s=engine.empty();one(s,x('DUP'));s.journal.push(structuredClone(s.journal[0]));
  const r=build(s);
  assert.equal(r.observations.detailedSessions,1);
  assert.equal(r.observations.parcours.wrong,1);
});
test('P2 pureté : aucun état ni catalogue modifié',()=>{
  const s=engine.empty();one(s,x('W1'));one(s,x('W2'));
  const pool=Array.from({length:8},(_,i)=>x('P'+i));
  const before=JSON.stringify(s),beforePool=JSON.stringify(pool);
  for(let i=0;i<3;i++)rec.buildReport(s,{exercises:pool,maxRecommendations:3});
  assert.equal(JSON.stringify(s),before);assert.equal(JSON.stringify(pool),beforePool);
});

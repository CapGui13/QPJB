'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const engine=require('../quizz-parcours.js'), rec=require('../parcours-recommandations.js');
const q=(id,more={})=>({id,theme:'majeur',answer:'2♠',auction:['Partenaire : 1♠'],
  difficulty:1,difficultyReason:'Soutien simple sur ouverture majeure',caseFamily:id,...more});
function one(state,exercise,result='wrong'){
  state.active={ids:[exercise.id],index:0,answers:{},createdAt:state.completed};
  assert.equal(engine.record(state,exercise,result,0,null,false,false),true);
  assert.equal(engine.finish(state,[exercise]),true);
}
const rep=(s,n=10)=>rec.buildReport(s,{maxRecommendations:n});
const failures=r=>r.recommendations.filter(x=>x.type==='persistent_difficulty');

test('P3 chevauchement intégral micro et axe : une carte, preuve de double classification',()=>{
  const s=engine.empty(),item=q('SEF-026-3');
  one(s,item);one(s,item);
  const before=JSON.stringify(s),r=rep(s);
  assert.equal(failures(r).length,1);
  assert.equal(failures(r)[0].evidence.source,'micros');
  assert.deepEqual(failures(r)[0].evidence.sameAnswersAs,
    [{source:'axes',key:'fit',label:engine.AXIS_LABELS.fit}]);
  assert.equal(JSON.stringify(s),before);
});

test('P3 historique sans journal : aucune fausse déduplication',()=>{
  const s=engine.empty();s.completed=65;
  for(const [obj,key] of [[s.micros,'majeur:1♠'],[s.axes,'fit']])
    obj[key]={score:-2,attempts:2,independent:0,lastSession:10,lastScoredSession:10};
  const r=rep(s);
  assert.equal(failures(r).length,2);
  assert.equal(r.observations.sessionsWithoutDetail,65);
});

test('P3 journal partiel ne peut pas attester le recouvrement historique',()=>{
  const s=engine.empty(),item=q('SEF-026-3');
  one(s,item);one(s,item);
  s.micros['majeur:1♠'].attempts=3;
  const r=rep(s);
  assert.equal(failures(r).length,2);
});

test('P8 scores et essais égaux : deux jeux de réponses restent deux faits',()=>{
  const s=engine.empty();
  // Deux échecs "fit" (aussi classés micro majeur:1♠), ET deux autres
  // échecs sur une ouverture "Passe" : les comptes sont identiques mais
  // seuls le micro majeur et l'axe fit décrivent les mêmes réponses.
  for(let i=0;i<2;i++)one(s,q('SEF-026-3'));
  for(let i=0;i<2;i++)one(s,{
    id:'OUV-'+i,theme:'ouv',answer:'Passe',difficulty:1,
    caseFamily:'OUV-'+i,auction:[],difficultyReason:''
  });
  const r=rep(s),items=failures(r);
  assert.equal(s.micros['majeur:1♠'].score,-2);
  assert.equal(s.micros['ouv:passe'].score,-2);
  assert.equal(s.axes.fit.score,-2);
  assert.equal(items.length,2);
  const opening=items.find(x=>x.evidence.key==='ouv:passe');
  const major=items.find(x=>x.evidence.key==='majeur:1♠');
  assert.ok(opening&&major);
  assert.equal(opening.evidence.sameAnswersAs,undefined);
  assert.deepEqual(major.evidence.sameAnswersAs,
    [{source:'axes',key:'fit',label:engine.AXIS_LABELS.fit}]);
});

test('P3 un seul emplacement : ne promet pas une action au détriment du diagnostic',()=>{
  const s=engine.empty();one(s,q('SEF-026-3'));one(s,q('SEF-026-3'));
  const r=rep(s,1);
  assert.equal(r.recommendations.length,1);
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
});

test('P3 sorties API restent limitées et triées, déterministes',()=>{
  const s=engine.empty();one(s,q('SEF-026-3'));one(s,q('SEF-026-3'));
  const r1=rep(s,10),r2=rep(s,10);
  assert.deepEqual(r1,r2);
  assert.ok(r1.recommendations.length<=10);
  assert.deepEqual(r1.recommendations.map(x=>x.priority),
    r1.recommendations.map(x=>x.priority).slice().sort((a,b)=>a-b));
  assert.equal(r1.schemaVersion,1);
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const fixtureReport=require('./progression-guidee-reco-fixtures.cjs').report;
const q=id=>({id,theme:'ouv',answer:'Passe',difficulty:1,
  caseFamily:id,auction:[],difficultyReason:''});
function one(s,x,result='wrong'){
  s.active={ids:[x.id],index:0,answers:{},createdAt:s.completed};
  assert.equal(core.record(s,x,result,0,null,false,false),true);
  assert.equal(core.finish(s,[x]),true);
}
function freezeDeep(x){
  if(!x||typeof x!=='object'||Object.isFrozen(x))return x;
  for(const child of Object.values(x))freezeDeep(child);
  return Object.freeze(x);
}

test('P6 options nulles et primitives : rapport de lecture sûr',()=>{
  const s=core.empty();
  for(const options of [null,3,'inattendu',[],false])
    assert.equal(fixtureReport(s,options).status,'ok');
  assert.equal(fixtureReport(s,null).recommendations[0].type,'not_evaluated');
});

test('P6 bornes maxRecommendations : 1-10 et même explication pour chaque carte',()=>{
  const s=core.empty();
  for(let i=0;i<6;i++)one(s,q('Q'+i));
  for(const max of [0,1,2,3,10,99,NaN,'3']){
    const r=fixtureReport(s,{maxRecommendations:max});
    const cap=Number.isInteger(max)?Math.min(10,Math.max(1,max)):6;
    assert.ok(r.recommendations.length<=cap);
    assert.ok(r.recommendations.every(x=>x.explanation&&x.explanation.action));
  }
});

test('P6 gel profond des objets : analyse et plan de révision sans mutation',()=>{
  const s=core.empty();one(s,q('A'));one(s,q('B'));
  const pool=Array.from({length:7},(_,i)=>q('POOL'+i));
  const immutable=freezeDeep(structuredClone(s)),catalogue=freezeDeep(structuredClone(pool));
  const result=fixtureReport(immutable,{exercises:catalogue,maxRecommendations:3});
  assert.equal(result.revision.available,true);
  assert.ok(result.recommendations.some(x=>x.type==='revision_session'));
});

test('P6 journal invalide écarté par la normalisation du moteur',()=>{
  const s=core.empty();s.completed=3;
  s.journal=[
    {mode:'parcours',session:1,answers:[{id:'A',result:'wrong',choice:null}]},
    {mode:'parcours',session:99,answers:[{id:'B',result:'wrong',choice:null}]},
    {mode:'parcours',session:2,answers:[{id:'C',result:'faux',choice:null}]}
  ];
  const r=fixtureReport(s);
  assert.equal(r.observations.parcours.wrong,1);
  assert.equal(r.observations.detailedSessions,1);
  assert.equal(r.observations.sessionsWithoutDetail,2);
});

test('P6 invalide ou version future : aucun conseil inventé, sortie compatible',()=>{
  for(const raw of [null,[],{},'{}','{',JSON.stringify({version:2})]){
    const r=fixtureReport(raw);
    assert.equal(r.schemaVersion,1);
    assert.equal(r.status,'unavailable');
    assert.deepEqual(r.recommendations,[]);
    assert.ok(r.limitations.length>=1);
  }
});

test('P6 surface publique stable : aucune méthode de sauvegarde ni mutation exposée',()=>{
  assert.deepEqual(Object.keys(rec).sort(),['OUTCOMES','VERSION','buildReport','outcome'].sort());
  const s=core.empty(),before=JSON.stringify(s);
  const out=fixtureReport(s);
  assert.ok(['ok','unavailable'].includes(out.status));
  assert.deepEqual(Object.keys(out).sort(),[
    'schemaVersion','status','completedSessions','currentSession','observations',
    'revision','recommendations','limitations'
  ].sort());
  assert.equal(JSON.stringify(s),before);
});

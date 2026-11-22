'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q=(id,answer='Passe')=>({id,theme:'ouv',answer,difficulty:1,
  caseFamily:id,auction:[],difficultyReason:''});
function one(s,x,result='wrong',opts={}){
  s.active={ids:[x.id],index:0,answers:{},createdAt:s.completed};
  assert.equal(core.record(s,x,result,0,null,!!opts.assisted,!!opts.hadFreeError),true);
  assert.equal(core.finish(s,[x]),true);
}
const report=(s,o={})=>rec.buildReport(s,{maxRecommendations:10,...o});
const only=(r,type)=>r.recommendations.find(x=>x.type===type);
const pool=Array.from({length:7},(_,i)=>q('POOL-'+i));

test('P5 chaque famille de conseil expose observation, réserve, action',()=>{
  const reports=[];
  reports.push(report(core.empty()));
  const active=core.empty();
  active.active={ids:['A','B'],index:0,answers:{},createdAt:0};
  reports.push(report(active));
  const wrong=core.empty();one(wrong,q('W1'));one(wrong,q('W2'));
  reports.push(report(wrong,{exercises:pool}));
  const mixed=core.empty();
  one(mixed,q('M1'),'correct');
  one(mixed,q('M2'),'correct',{assisted:true});
  one(mixed,q('M3'),'correct');
  reports.push(report(mixed));
  const good=core.empty();
  for(let i=0;i<4;i++)one(good,q('G'+i),'correct');
  reports.push(report(good));
  const available=new Set(reports.flatMap(r=>r.recommendations.map(x=>x.type)));
  assert.deepEqual(available,new Set(['not_evaluated','resume','persistent_difficulty',
    'revision_session','consolidate','repeated_autonomous']));
  for(const r of reports)for(const item of r.recommendations){
    assert.equal(typeof item.id,'string');
    assert.ok(item.explanation);
    for(const key of ['observed','caveat','action']){
      assert.equal(typeof item.explanation[key],'string');
      assert.ok(item.explanation[key].length>=16);
    }
  }
});

test('P5 difficulté cite chiffres V1 et refuse une promesse générale',()=>{
  const s=core.empty();one(s,q('W1'));one(s,q('W2'));
  const it=only(report(s),'persistent_difficulty');
  assert.match(it.explanation.observed,/2 tentative/);
  assert.match(it.explanation.observed,/score -2/);
  assert.match(it.explanation.caveat,/agrégat V1/);
});

test('P5 aide : jamais décrire une aide comme réussite autonome',()=>{
  const s=core.empty();one(s,q('A1'),'correct',{assisted:true});
  one(s,q('A2'),'correct',{hadFreeError:true});
  const r=report(s);
  assert.equal(r.observations.parcours.autonomous,0);
  assert.equal(only(r,'repeated_autonomous'),undefined);
  assert.ok(r.recommendations.every(x=>!x.explanation.observed.includes('maîtrise acquise')));
});

test('P5 historique à 65 séances : la réserve globale survit au texte des cartes',()=>{
  const s=core.empty();s.completed=65;
  s.micros['ouv:passe']={score:-3,attempts:8,independent:0,lastSession:40,lastScoredSession:40};
  const before=JSON.stringify(s),r=report(s);
  assert.ok(only(r,'persistent_difficulty'));
  assert.match(r.limitations.join(' '),/65 séance/);
  assert.match(only(r,'persistent_difficulty').explanation.caveat,/agrégat V1/);
  assert.equal(JSON.stringify(s),before);
});

test('P5 reprise : l’explication ne transforme pas réponses en preuves de séance',()=>{
  const s=core.empty();
  s.active={ids:['A','B'],index:1,answers:{0:{result:'correct',choice:null,
    assisted:false,hadFreeError:false}},createdAt:0};
  const it=only(report(s),'resume');
  assert.match(it.explanation.observed,/1 réponse/);
  assert.match(it.explanation.caveat,/interrompue/);
});

test('P5 plan de révision : nombre et origine définis par le moteur',()=>{
  const s=core.empty();one(s,q('E1'));one(s,q('E2'));
  const r=report(s,{exercises:pool});
  const it=only(r,'revision_session');
  assert.ok(it);
  assert.match(it.explanation.observed,new RegExp(String(r.revision.count)));
  assert.match(it.explanation.caveat,/catalogue fourni/);
});

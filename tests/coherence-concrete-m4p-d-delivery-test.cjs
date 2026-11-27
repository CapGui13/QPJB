'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const L=require('../quizz-coherence-m4p-d-lab.js'),G=require('./coherence-concrete-m4p-d-compare.cjs'),features=require('../quizz-coherence-m4-diversite.js').features;
const root=path.join(__dirname,'..'),meta=require('../quizz-prerequis.js').byId;
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises,byId=new Map(catalogue.map(x=>[x.id,x]));
const dir=path.join(root,'audits/coherence-concrete-20261126/m4/parallel/d/native');
function load(policy,profile,seed){
 const w=JSON.parse(fs.readFileSync(path.join(dir,policy+'-'+profile+'-'+seed+'.json'),'utf8')),p=JSON.parse(zlib.gunzipSync(Buffer.from(w.archive,'base64')));
 const arm=(rows,checkpoints,candidate)=>({profile,seed,horizon:180,checkpoints,changes:candidate?p.changes:[],sessions:rows.map((r,i)=>({session:i+1,rows:r.map((x,j)=>{
 const [id,role,reason,eligible,result,choice,assisted,hadFreeError]=x,q=byId.get(id),m=meta[id],f=features(q,m);
 return {id,concept:m.concept,stage:m.stage,requires:m.requires,theme:q.theme,level:q.difficulty,context:q.context,auction:q.auction,hand:q.hand,h:q.h,shape:q.shape,answer:q.answer,family:String(q.caseFamily||q.id),decision:f.decision,near:f.near,role,reason,position:j+1,eligible,response:{result,choice,assisted,hadFreeError}};
 })}))});
 return {profile,seed,horizon:180,provenance:p.provenance,before:arm(p.before,p.beforeCheckpoints,false),after:arm(p.after,p.afterCheckpoints,true)};
}
const sha='5129f278687dc9ab617bda108279d126b9959a98';
const matrix=policy=>L.PROFILES.flatMap(p=>L.SEEDS.map(s=>load(policy,p,s)));
const d=matrix('D'),k=matrix('K');
let x=G.decide(d,'A',sha);assert.equal(x.verdict,'REVIEW');assert.equal(x.gate.violations.length,0);assert.equal(x.alerts.length,0);console.log('PASS delivery gate D/A: review only');
x=G.decide(d,'AB',sha);assert.equal(x.verdict,'HOLD');console.log('PASS D/AB: no debt gain');
x=G.decide(k,'AB',sha);assert.equal(x.verdict,'HOLD');assert.equal(x.gate.violations.length,12);assert.equal(x.alerts.length,45);console.log('PASS K/AB: 12 historical + 45 extra');
x=G.decide(d,'B',sha);assert.equal(x.verdict,'HOLD');assert.ok(x.alerts.some(a=>a.metric==='B affected prefix'));console.log('PASS phase B prefix guard');
const row=d[0].before.sessions[0].rows[0];row.reason+=' falsified';assert.throws(()=>G.decide(d,'A',sha),/reference ordered/);row.reason=row.reason.replace(' falsified','');
assert.throws(()=>G.decide(d,'A','0'.repeat(40)));assert.throws(()=>G.decide(d.slice(1),'A',sha));
console.log('PASS forged baseline, different SHA and incomplete matrix rejected');
// Optional C structural snapshot. No editorial validation is inferred.
if(process.argv[2]){
 const c=path.resolve(process.argv[2],'audits/coherence-concrete-20261126/m4/parallel/c');
 const idx=JSON.parse(fs.readFileSync(path.join(c,'index.json'),'utf8')),registry={};
 assert.equal(idx.base,L.BASE);
 for(const f of fs.readdirSync(path.join(c,'themes')).filter(f=>f.endsWith('.json')))for(const [id,v] of Object.entries(JSON.parse(fs.readFileSync(path.join(c,'themes',f),'utf8')))){
  assert.ok(!registry[id]);registry[id]=v;
 }
 assert.equal(Object.keys(registry).length,1915);assert.equal(Object.keys(idx.byId).length,1915);
 for(const q of catalogue){const v=registry[q.id],m=meta[q.id];assert.ok(v,q.id);assert.equal(idx.byId[q.id],q.theme);assert.equal(v.theme,q.theme);assert.equal(v.concept,m.concept);assert.equal(v.family,String(q.caseFamily||q.id));assert.equal(v.answer,q.answer);assert.equal(v.level,q.difficulty);assert.equal(v.H,q.h);assert.deepEqual(v.shape,q.shape);assert.deepEqual(v.auction,q.auction);assert.equal(v.stage,m.stage);assert.equal(v.minSession,m.minSession);assert.ok(v.status&&v.proof&&v.signature);}
 const rel=JSON.parse(fs.readFileSync(path.join(c,'relations.json'),'utf8'));
 for(const [a,b,t,reason] of rel){assert.ok(registry[a]&&registry[b]&&a!==b&&t&&reason);}
 console.log('M4PD_C_STRUCTURAL '+JSON.stringify({ids:1915,relations:rel.length,statusCounts:Object.values(registry).reduce((a,v)=>(a[v.status]=(a[v.status]||0)+1,a),{}),editorialApproval:false}));
}

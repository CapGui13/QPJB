'use strict';
// Consume external snapshots without importing or modifying their selection policies.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const L=require('../quizz-coherence-m4p-d-lab.js'),G=require('./coherence-concrete-m4p-d-compare.cjs');
const root=path.join(__dirname,'..'),meta=require('../quizz-prerequis.js').byId;
const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises,byId=new Map(exercises.map(x=>[x.id,x]));
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
const provenance=sha=>({base:L.BASE,engine:L.ENGINE,catalogue:L.CATALOGUE,metadata:'8e920bb9c925c7474bb04701f0f2fecac5288b91',testedSha:sha,responseRule:'fnv1a-m4-v1',baseline:'native-uninstrumented'});
function replay(arm){
 let now=Date.UTC(2026,0,1);
 class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
 const mod={exports:{}};new Function('module','exports','require','Date',source)(mod,mod.exports,requireBase,FixedDate);
 const api=mod.exports,state=api.empty();let n=0;
 for(const s of arm.sessions){
  now=Date.UTC(2026,0,1)+s.session*86400000;
  const ids=s.rows.map(r=>r.id),selection=s.rows.map(r=>({id:r.id,kind:r.role,reason:r.reason}));
  state.active={ids,index:0,answers:{},createdAt:state.completed,selection};
  for(const row of s.rows)assert.equal(api.eligibility(byId.get(row.id),state,exercises).eligible,true,'native eligibility '+arm.profile+'/'+arm.seed+'/'+s.session+'/'+row.id);
  for(const [i,row] of s.rows.entries()){
   const a=row.response;assert.ok(api.record(state,byId.get(row.id),a.result,i,a.choice,a.assisted,a.hadFreeError));n++;
   if(i===0&&L.HORIZONS.includes(s.session)){const snap=JSON.stringify(state);assert.deepEqual(api.start(state,exercises).map(q=>q.id),ids);assert.equal(JSON.stringify(state),snap);}
  }
  assert.ok(api.finish(state,exercises));assert.equal(state.completed,s.session);
 }
 return n;
}
const [kind,dir,policy]=process.argv.slice(2);
let pairs=[],sha;
if(kind==='B'){
 const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')),index=new Map(m.artifacts.map(x=>[x.file,x]));
 assert.equal(m.artifacts.length,index.size);
 function read(name){
  const v=index.get(name);assert.ok(v,name);const gz=fs.readFileSync(path.join(dir,name)),raw=zlib.gunzipSync(gz);
  assert.equal(sha256(gz),v.compressedSha256);assert.equal(sha256(raw),v.sha256);assert.equal(raw.length,v.bytes);
  const x=JSON.parse(raw);assert.equal(x.run.sessions.length,v.sessions);assert.equal(x.run.sessions.reduce((a,s)=>a+s.rows.length,0),v.rows);return {x,sha:v.testedSha};
 }
 for(const profile of L.PROFILES)for(const seed of L.SEEDS){
  const prefix=profile+'-'+seed+'-',a=read(prefix+'native.json.gz'),b=read(prefix+policy+'.json.gz');
  if(sha===undefined)sha=b.sha;assert.equal(sha,b.sha);
  assert.ok(b.x.run.changes.every(x=>Number.isInteger(x.session)&&x.session>=21&&x.session<=180),'direct B outside window');
  pairs.push({profile,seed,horizon:180,provenance:provenance(sha),before:a.x.run,after:b.x.run});
 }
}else if(kind==='A'){
 // A's native artifact run 45983780337 and exact head are identified by its published index.
 sha='c1dde5fc9c2e026df34ceb14e1b471855fc6355b';
 function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);}
 for(const file of walk(dir).filter(x=>x.endsWith('.json'))){
  const p=JSON.parse(fs.readFileSync(file,'utf8'));if(!p.before?.sessions||!p.after?.sessions)continue;
  assert.ok(p.after.changes.every(x=>Number.isInteger(x.session)&&x.session>=1&&x.session<=20),'direct A outside window');
  pairs.push({...p,provenance:provenance(sha)});
 }
}else throw Error('A or B required');
const result=G.decide(pairs,kind,sha);
let replayed=0;
for(const p of pairs)replayed+=replay(p.after);
const output={kind,policy:policy||'T',sha,verdict:result.verdict,gate:result.gate,alerts:result.alerts,deltaByProfile:result.deltas.map(d=>({...d,latency:d.latency.length})),rowsReplayed:replayed,source:'external artifact snapshot; independent metrics and state replay, not rerun selection'};
console.log('M4PD_EXTERNAL '+JSON.stringify(output));

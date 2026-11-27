'use strict';
// Rehydrates durable compact traces from the frozen catalogue and replays the
// native state machine separately from the candidate's selection instrument.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const L=require('../quizz-coherence-m4p-d-lab.js'),features=require('../quizz-coherence-m4-diversite.js').features;
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const source=read('quizz-parcours.js'),html=read('quizz.html'),meta=require('../quizz-prerequis.js').byId;
assert.equal(blob(source),L.ENGINE);assert.equal(blob(html),L.CATALOGUE);assert.equal(blob(read('quizz-prerequis.js')),'8e920bb9c925c7474bb04701f0f2fecac5288b91');
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises,byId=new Map(exercises.map(q=>[q.id,q]));
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
function unpack(file){
 const wrapper=JSON.parse(fs.readFileSync(file,'utf8')),s=wrapper.summary;
 assert.equal(wrapper.encoding,'gzip+base64');assert.equal(wrapper.archive.length,s.archiveBytes);assert.equal(sha256(wrapper.archive),s.digest);
 const p=JSON.parse(zlib.gunzipSync(Buffer.from(wrapper.archive,'base64')).toString('utf8'));
 assert.deepEqual(p.provenance,s.provenance);assert.equal(p.provenance.metadata,'8e920bb9c925c7474bb04701f0f2fecac5288b91');
 for(const k of ['profile','seed','policy'])assert.equal(p[k],s[k]);
 assert.deepEqual(p.beforeCheckpoints,s.before);assert.deepEqual(p.afterCheckpoints,s.after);
 const arm=(rows,checkpoints,candidate)=>({profile:p.profile,seed:p.seed,horizon:p.horizon,policy:p.policy,candidate,checkpoints,changes:candidate?p.changes:[],sessions:rows.map((r,i)=>({session:i+1,rows:r.map((x,j)=>{
  assert.equal(x.length,8);const [id,role,reason,eligible,result,choice,assisted,hadFreeError]=x;
  const q=byId.get(id),m=meta[id];assert.ok(q&&m);
  const f=features(q,m);
  return {id,concept:m.concept,stage:m.stage,requires:m.requires,theme:q.theme,level:q.difficulty,context:q.context,auction:q.auction,hand:q.hand,h:q.h,shape:q.shape,answer:q.answer,family:String(q.caseFamily||q.id),decision:f.decision,near:f.near,role,reason,position:j+1,positionReason:'ordre historique logicalOrder (M2 hors périmètre)',eligible,response:{result,choice,assisted,hadFreeError}};
 })}))});
 return {profile:p.profile,seed:p.seed,horizon:p.horizon,provenance:p.provenance,before:arm(p.before,p.beforeCheckpoints,false),after:arm(p.after,p.afterCheckpoints,true)};
}
function replay(arm,nativeSelection){
 let now=Date.UTC(2026,0,1);
 class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
 const mod={exports:{}};
 new Function('module','exports','require','Date',source)(mod,mod.exports,requireBase,FixedDate);
 const api=mod.exports,state=api.empty();let count=0;
 for(const s of arm.sessions){
  now=Date.UTC(2026,0,1)+s.session*86400000;
  const ids=s.rows.map(r=>r.id),selection=s.rows.map(r=>({id:r.id,kind:r.role,reason:r.reason}));
  if(nativeSelection){
   assert.deepEqual(api.start(state,exercises).map(q=>q.id),ids,'native IDs S'+s.session);
   assert.deepEqual(state.active.selection,selection,'native reasons S'+s.session);
  }else{
   // Only reconstruct the active deck from the actual recorded candidate;
   // this independently checks eligibility and state, not the selection algorithm.
   state.active={ids,index:0,answers:{},createdAt:state.completed,selection};
  }
  for(const row of s.rows){const q=byId.get(row.id);assert.equal(api.eligibility(q,state,exercises).eligible,true,'native eligibility S'+s.session+' '+row.id)}
  for(const [i,row] of s.rows.entries()){
   const a=row.response;
   assert.ok(api.record(state,byId.get(row.id),a.result,i,a.choice,a.assisted,a.hadFreeError));
   if(i===0&&[1,5,20,65,153,180].includes(s.session)){
    const snapshot=JSON.stringify(state);assert.deepEqual(api.start(state,exercises).map(q=>q.id),ids);assert.equal(JSON.stringify(state),snapshot);
   }
   count++;
  }
  assert.ok(api.finish(state,exercises));assert.equal(state.completed,s.session);
 }
 return count;
}
const dir=process.argv[2]||path.join(root,'audits/coherence-concrete-20261126/m4/parallel/d/native'),profile=process.argv[3];
const files=fs.readdirSync(dir).filter(x=>/^[DK]-.+\.json$/.test(x)&&(!profile||x.includes('-'+profile+'-'))).sort();
assert.equal(files.length,profile?6:36);
let count=0;const baselines=new Map(),reports=[];
for(const f of files){
 const p=unpack(path.join(dir,f)),k=p.profile+'/'+p.seed;
 assert.equal(p.horizon,180);assert.equal(p.provenance.testedSha,'5129f278687dc9ab617bda108279d126b9959a98');
 const v=L.comparePair(p,{catalogue:exercises,metadata:meta,features});
 assert.equal(v.structure.length,0);
 const signature=JSON.stringify(p.before.sessions);
 if(baselines.has(k))assert.equal(signature,baselines.get(k),'D/K reference discrepancy');
 else {baselines.set(k,signature);count+=replay(p.before,true)}
 count+=replay(p.after,false);
 reports.push({file:f,profile:p.profile,seed:p.seed,changes:v.changes,extra:v.regressions.filter(x=>x.metric!=='latency-observation').length});
 console.log('M4PD_REHYDRATED '+f+' OK');
}
console.log('M4PD_ARCHIVE_VERIFIED '+JSON.stringify({files:files.length,nativeBaselines:baselines.size,rowsReplayed:count,reports}));

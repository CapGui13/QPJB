'use strict';
// Delivery gate for candidate raw traces produced by the independent native runner.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const L=require('../quizz-coherence-m4p-d-lab.js'),features=require('../quizz-coherence-m4-diversite.js').features;
const root=path.join(__dirname,'..'),archiveDir=path.join(root,'audits/coherence-concrete-20261126/m4/parallel/d/native');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('quizz.html'),meta=require('../quizz-prerequis.js').byId;
assert.equal(blob(read('quizz-parcours.js')),L.ENGINE);assert.equal(blob(html),L.CATALOGUE);
assert.equal(blob(read('quizz-prerequis.js')),'8e920bb9c925c7474bb04701f0f2fecac5288b91');
const catalogue=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const compact=arm=>arm.sessions.map(s=>s.rows.map(r=>[r.id,r.role,r.reason,r.eligible,r.response.result,r.response.choice,r.response.assisted,r.response.hadFreeError]));
function reference(profile,seed){
 const w=JSON.parse(fs.readFileSync(path.join(archiveDir,'D-'+profile+'-'+seed+'.json'),'utf8'));
 assert.equal(crypto.createHash('sha256').update(w.archive).digest('hex'),w.summary.digest);
 const v=JSON.parse(zlib.gunzipSync(Buffer.from(w.archive,'base64')));
 assert.equal(v.profile,profile);assert.equal(v.seed,seed);assert.equal(v.horizon,180);return v.before;
}
function decide(pairs,phase,sha){
 assert.ok(['A','B','AB'].includes(phase));assert.match(sha,/^[a-f0-9]{40}$/);assert.equal(pairs.length,18);
 const reviewed=[],alerts=[],deltas=[];
 for(const p of pairs){
  assert.equal(p.horizon,180);assert.equal(p.provenance.testedSha,sha);
  assert.equal(p.provenance.metadata,'8e920bb9c925c7474bb04701f0f2fecac5288b91');
  const before=compact(p.before),after=compact(p.after);
  assert.deepEqual(before,reference(p.profile,p.seed),'reference ordered IDs/reasons/responses divergent');
  for(const arm of [p.before,p.after])for(const s of arm.sessions)for(const row of s.rows){assert.equal(row.stage,meta[row.id]?.stage);assert.deepEqual(row.requires,meta[row.id]?.requires);}
  const v=L.comparePair(p,{catalogue,metadata:meta,features});reviewed.push(v);
  for(const a of v.regressions)if(a.metric!=='latency-observation')alerts.push({profile:p.profile,seed:p.seed,...a});
  for(const a of v.structure)alerts.push({profile:p.profile,seed:p.seed,...a});
  const altered=before.map((s,i)=>JSON.stringify(s)!==JSON.stringify(after[i])?i+1:null).filter(Boolean);
  if(phase==='B'&&altered.some(s=>s<=20))alerts.push({profile:p.profile,seed:p.seed,metric:'B affected prefix'});
  if(!altered.length&&v.changes)alerts.push({profile:p.profile,seed:p.seed,metric:'journal without observed change'});
  deltas.push({profile:p.profile,seed:p.seed,alteredSessions:altered,changes:v.changes,latency:v.regressions.filter(x=>x.metric==='latency-observation')});
 }
 const gate=L.compareCheckpoints(reviewed,{requireEarly:phase!=='B',requireDebt:phase!=='A'});
 const actualEarlyGain=reviewed.some(v=>['nearPairs','decisionPairs','nearRecent'].some(k=>v.after[1][k]<v.before[1][k]));
 if(phase!=='B'&&!actualEarlyGain)alerts.push({metric:'no improvement at S20'});
 if(!deltas.some(x=>x.alteredSessions.length))alerts.push({metric:'no observed change'});
 return {phase,sha,verdict:gate.verdict==='CANDIDAT_A_REVOIR'&&!alerts.length?'REVIEW':'HOLD',gate,alerts,deltas,reviewed};
}
module.exports={decide,reference};
if(require.main===module){
 const [dir,phase,sha]=process.argv.slice(2);
 try{
  const pairs=fs.readdirSync(dir).filter(x=>x.endsWith('.json')&&!x.endsWith('.review.json')).map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8')));
  const result=decide(pairs,phase,sha);console.log(JSON.stringify(result,null,2));process.exitCode=result.verdict==='REVIEW'?0:2;
 }catch(e){console.error('TECHNICAL FAILURE: '+e.message);process.exitCode=1;}
}

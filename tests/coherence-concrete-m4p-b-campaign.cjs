'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const native=require('./coherence-concrete-m4-campaign.cjs'),adapter=require('./coherence-concrete-m4p-b-adapter.cjs'),policy=require('../quizz-coherence-m4p-b-policy.js'),windowPolicy=require('../quizz-coherence-m4p-b-window.js'),rotation=require('../quizz-coherence-m4p-b-rotation.js'),saturated=require('../quizz-coherence-m4p-b-saturated.js');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
assert.equal(blob(source),'4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9');
assert.equal(blob(html),'7a952dc57b582a2a7b5be73f83306df83881f3a8');
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js')),meta=requireBase('./quizz-prerequis.js').byId;
assert.equal(exercises.length,1915);assert.equal(new Set(Object.values(meta).map(m=>m.concept)).size,99);
const archived=JSON.parse(fs.readFileSync(path.join(root,'audits/coherence-concrete-20261126/m4/reprise-k-native-checkpoints.json'),'utf8'));
const metrics={nearPairs:1,decisionPairs:1,nearRecent:1,coreDebt:1,themeDebt:1,hard:1,proof:-1,concepts:-1,families:-1,independent:-1};
const core=new Set(policy.CORE),all=[...new Set(Object.values(meta).map(m=>m.concept))].sort();
function detail(run){
 const records=new Map(all.map(c=>[c,{last:0,maxGap:0,debt:0,exposures:0,independent:0,explicit:0,reactivations:0,assisted:0,families:new Set(),proofFamilies:new Set(),proofSessions:new Set()}]));
 const res=[];
 for(const session of run.sessions){
  const s=session.session;
  for(const r of session.rows){
   const a=records.get(r.concept),aut=r.response.result==='correct'&&!r.response.assisted&&!r.response.hadFreeError;
   if(a.last&&a.last!==s){const gap=s-a.last;a.maxGap=Math.max(a.maxGap,gap);if(gap>=7)a.reactivations++;}
   a.last=s;a.exposures++;a.families.add(r.family);if(aut){a.independent++;a.proofFamilies.add(r.family);a.proofSessions.add(s);}
   if(r.response.assisted||r.response.hadFreeError)a.assisted++;
   if(r.reason==='rappel_erreur_aide')a.explicit++;
  }
  for(const a of records.values())if(a.last)a.debt+=Math.max(0,s-a.last-6);
  if(native.HORIZONS.includes(s)){
   const byConcept=Object.fromEntries([...records].map(([c,a])=>[c,{last:a.last,terminalGap:a.last?s-a.last:null,maxGap:a.maxGap,debt:a.debt,exposures:a.exposures,independent:a.independent,explicit:a.explicit,reactivations:a.reactivations,assisted:a.assisted,families:a.families.size,proofFamilies:a.proofFamilies.size,proofSessions:a.proofSessions.size,proof:a.proofFamilies.size>=2&&a.proofSessions.size>=2}]));
   res.push({session:s,byConcept});
  }
 }
 return res;
}
function compare(before,after,bd,ad){
 const violations=[];
 for(let i=0;i<native.HORIZONS.length;i++){
  const a=before.checkpoints[i],b=after.checkpoints[i],h=native.HORIZONS[i];
  for(const [k,sign] of Object.entries(metrics))if(sign*(b[k]-a[k])>0)violations.push({h,metric:k,before:a[k],after:b[k]});
  for(const k of ['violations','dupes','short','earlyViolations'])if(a[k]||b[k])violations.push({h,metric:k,before:a[k],after:b[k]});
  for(const c of all){
   const u=bd[i].byConcept[c],v=ad[i].byConcept[c];
   if(u.proof&&!v.proof)violations.push({h,metric:'proof_lost',concept:c});
   if(u.exposures&&!v.exposures)violations.push({h,metric:'concept_lost',concept:c});
  }
  if(h<=20){
   const rows=r=>r.sessions.slice(0,h).map(s=>s.rows.map(q=>q.id));
   assert.deepEqual(rows(before),rows(after),'B direct scope S1–20');
  }
 }
 return violations;
}
function runOne(profile,seed,out){
 const common={source,requireBase,exercises,meta,profile,seed,horizon:180,measure:()=>performance.now()};
 const before=native.run(common),reference=archived.rows.find(x=>x.profile===profile&&x.seed===seed);
 assert.ok(reference,'historical exact reference');
 for(let i=0;i<native.HORIZONS.length;i++){
  const clean=o=>Object.fromEntries(Object.entries(o).filter(([k])=>k!=='p95Ms'));
  assert.deepEqual(clean(before.checkpoints[i]),clean(reference.before[i]),'exact native baseline '+profile+'/'+seed+'/'+native.HORIZONS[i]);
 }
 const bd=detail(before);
 fs.writeFileSync(path.join(out,profile+'-'+seed+'-native.json'),JSON.stringify({run:before,detail:bd}));
 const summaries=[];
 for(const k of (process.env.POLICIES||'L,M').split(',')){
  const changes=[],req=n=>n==='./quizz-coherence-m4p-b-policy.js'?{...policy,record:r=>changes.push(r)}:n==='./quizz-coherence-m4p-b-window.js'?{...windowPolicy,record:r=>changes.push(r)}:n==='./quizz-coherence-m4p-b-rotation.js'?{...rotation,record:r=>changes.push(r)}:n==='./quizz-coherence-m4p-b-saturated.js'?{...saturated,record:r=>changes.push(r)}:requireBase(n);
  const after=native.run({...common,source:adapter.instrument(source,k),requireBase:req});
  after.policy=k;after.changes=changes;
  const ad=detail(after),violations=compare(before,after,bd,ad);
  assert.ok(after.checkpoints.every(x=>!x.violations&&!x.dupes&&!x.short&&!x.earlyViolations),'structural gate');
  assert.ok(changes.every(x=>x.session>=21),'no direct early change');
  const summary={profile,seed,policy:k,changes,before:before.checkpoints,after:after.checkpoints,violations,
   coreBefore:bd.map(x=>({session:x.session,concepts:Object.fromEntries(policy.CORE.map(c=>[c,x.byConcept[c]]))})),
   coreAfter:ad.map(x=>({session:x.session,concepts:Object.fromEntries(policy.CORE.map(c=>[c,x.byConcept[c]]))})),
   verdict:changes.length&&!violations.length&&after.checkpoints.at(-1).coreDebt<before.checkpoints.at(-1).coreDebt?'REVIEW':'HOLD'};
  fs.writeFileSync(path.join(out,profile+'-'+seed+'-'+k+'.json'),JSON.stringify({run:after,detail:ad,summary}));
  summaries.push(summary);
  console.log(JSON.stringify({profile,seed,policy:k,changes:changes.length,violations,before:summary.before,after:summary.after,verdict:summary.verdict}));
 }
 fs.writeFileSync(path.join(out,profile+'-'+seed+'-summary.json'),JSON.stringify(summaries));
}
const out=process.env.OUT||path.join(root,'audits/coherence-concrete-20261126/m4/parallel/b/native');
fs.mkdirSync(out,{recursive:true});
for(const p of native.PROFILES.filter(p=>!process.env.PROFILE||p===process.env.PROFILE))for(const seed of native.SEEDS.filter(s=>!process.env.SEED||s===Number(process.env.SEED)))runOne(p,seed,out);

'use strict';
// Reproductible, post-campaign registry from full immutable native traces.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),dir=path.join(root,'audits/coherence-concrete-20261126/m4/parallel/b'),data=path.join(dir,'native');
const m=JSON.parse(fs.readFileSync(path.join(data,'manifest.json'))),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const core=require('../quizz-coherence-m4p-b-policy.js').CORE,meta=require('../quizz-prerequis.js').byId;
const exercises=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const fam=q=>String(q.caseFamily||q.id),byId=new Map(exercises.map(q=>[q.id,q]));
const coreFamilies=Object.fromEntries(core.map(c=>[c,new Set(exercises.filter(q=>meta[q.id].concept===c).map(fam))]));
const familiesAll=new Set(exercises.map(fam)),conceptsAll=[...new Set(Object.values(meta).map(x=>x.concept))].sort();
assert.equal(familiesAll.size,1556);assert.equal(conceptsAll.length,99);
const profiles=['autonome','intermediaire','faible','cible','aide','passe'],seeds=[11,47,103],arms=['native','L','M','N','O','P'],horizons=[5,20,65,153,180],runs=new Map();
for(const e of m.artifacts){
 const gz=fs.readFileSync(path.join(data,e.file));assert.equal(hash(gz),e.compressedSha256);const raw=zlib.gunzipSync(gz);assert.equal(hash(raw),e.sha256);assert.equal(raw.length,e.bytes);
 const x=JSON.parse(raw),r=x.run,key=e.file.replace('.json.gz','');
 assert.equal(r.sessions.length,180);assert.equal(x.detail.length,5);
 for(const ss of r.sessions){
  assert.equal(ss.rows.length,10);assert.equal(new Set(ss.rows.map(q=>q.id)).size,10);assert.equal(new Set(ss.rows.map(q=>q.family)).size,10);
  assert.ok(ss.rows.every(q=>q.eligible&&byId.has(q.id)));
 }
 for(let i=0;i<5;i++){
  const cp=r.checkpoints[i],d=x.detail[i].byConcept;
  assert.equal(cp.coreDebt,core.reduce((sum,c)=>sum+d[c].debt,0));
  assert.equal(cp.proof,Object.values(d).filter(q=>q.proof).length);
  assert.equal(Object.keys(d).length,99);
 }
 runs.set(key,x);
}
assert.equal(runs.size,108);
const capacity=[],ledger=[],comparisons=[],totals={},metrics=['nearPairs','decisionPairs','nearRecent','coreDebt','themeDebt','families','concepts','proof','independent','hard','p95Ms'];
const compact=q=>({id:q.id,concept:meta[q.id].concept,stage:meta[q.id].stage,theme:q.theme,family:fam(q),difficulty:q.difficulty,answer:q.answer,context:q.context,auction:q.auction,hand:q.hand,h:q.h,shape:q.shape});
for(const p of profiles)for(const seed of seeds){
 const key=p+'-'+seed,native=runs.get(key+'-native'),seen=new Set(),last={},donors={repeated:0,redundantMaintenance:0,repeatedRedundantMaintenance:0};
 const sat=[];
 for(const ss of native.run.sessions){
  const cc={};for(const q of ss.rows)cc[q.concept]=(cc[q.concept]||0)+1;
  for(const q of ss.rows)if(ss.session>=66){
   const repeated=seen.has(q.family),red=['rappel_nouvelle_situation','rappel_question'].includes(q.reason)&&cc[q.concept]>1;
   donors.repeated+=Number(repeated);donors.redundantMaintenance+=Number(red);donors.repeatedRedundantMaintenance+=Number(red&&repeated);
  }
  for(const q of ss.rows){seen.add(q.family);last[q.concept]=ss.session;}
  if(horizons.includes(ss.session))sat.push({session:ss.session,globalSeen:seen.size,concepts:Object.fromEntries(core.map(c=>[c,{...native.detail.find(d=>d.session===ss.session).byConcept[c],catalogueFamilies:coreFamilies[c].size,remainingGloballyUnseen:[...coreFamilies[c]].filter(f=>!seen.has(f)).length}]))});
 }
 capacity.push({profile:p,seed,donors,saturation:sat});
 for(const arm of arms){
  const x=runs.get(key+'-'+arm);assert.ok(x,key+'-'+arm);
  const a=totals[arm]||(totals[arm]={horizons:Object.fromEntries(horizons.map(h=>[h,Object.fromEntries(metrics.filter(k=>k!=='p95Ms').map(k=>[k,0]))])),core:Object.fromEntries(core.map(c=>[c,0])),changes:0,noveltyCost:0,regressedTrajectories:0,violations:0,gateMetrics:{}});
  for(let i=0;i<horizons.length;i++)for(const k of metrics.filter(k=>k!=='p95Ms'))a.horizons[horizons[i]][k]+=x.run.checkpoints[i][k];
  for(const c of core)a.core[c]+=x.detail.at(-1).byConcept[c].debt;
  if(arm==='native')continue;
  const s=x.summary;
  assert.ok(x.run.sessions.slice(0,20).every((ss,i)=>JSON.stringify(ss)===JSON.stringify(native.run.sessions[i])));
  if(['L','M'].includes(arm))assert.deepEqual(x.run.sessions,native.run.sessions);
  a.changes+=s.changes.length;a.noveltyCost+=s.changes.reduce((n,q)=>n+(q.noveltyCost||0),0);a.regressedTrajectories+=Number(s.violations.length>0);a.violations+=s.violations.length;
  for(const v of s.violations)a.gateMetrics[v.metric]=(a.gateMetrics[v.metric]||0)+1;
  comparisons.push({profile:p,seed,arm,changes:s.changes.length,violations:s.violations,verdict:s.verdict,
   before:s.before,after:s.after,coreBefore:s.coreBefore,coreAfter:s.coreAfter,
   lostProofs:s.violations.filter(v=>v.metric==='proof_lost')});
  for(const q of s.changes){
   const inserted=x.run.sessions[q.session-1].rows.find(r=>r.id===q.after);
   assert.ok(inserted,'direct inserted question not found '+q.after);
   ledger.push({profile:p,seed,arm,...q,entrant:compact(byId.get(q.after)),sortant:compact(byId.get(q.before)),actualPosition:inserted.position});
  }
 }
}
const report={schema:'M4P-B-REPORT-1',baseline:'49298ada3f96e347833d8717c7e205518ea02fce',profiles,seeds,horizons,arms,
 totals,capacity,comparisons,ledgerCount:ledger.length,scope:'simulations; native gate unchanged; not M1 authorization, M6 validation or proof of human learning'};
fs.writeFileSync(path.join(dir,'comparatif-exhaustif.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(dir,'registre-substitutions.json'),JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({totals,ledgerCount:ledger.length,capacityTotals:capacity.reduce((s,x)=>{for(const k of Object.keys(x.donors))s[k]=(s[k]||0)+x.donors[k];return s;},{})}));

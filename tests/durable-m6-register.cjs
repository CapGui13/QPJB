'use strict';
const L=require('../quizz-durable-m6-lab.js');
const G=require('../quizz-durable-m6-guards.js');
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
function summarize(baselines,sensitivity,targeted,semantic,extension){
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const expected=new Set(Object.keys(L.PROFILES).flatMap(name=>L.SEEDS.map(seed=>name+'/'+seed)));
 const actual=new Set(),registry=[],profiles={},totals={trajectories:0,sessions:0,responses:0,ineligible:0,duplicates:0,short:0,resumes:0,exports:0,elapsedMs:0};
 const metrics=['concepts','themes','families','proof','independent','help','corrected','wrong','skipped','transferProof','retention7','retention30','unseenFamilyProbe','transferN','debt','coreDebt','pending','medianRecall','selectionP50','selectionP95','stateChars','exportChars'];
 const distribution=rows=>Object.fromEntries(metrics.map(k=>{
  const v=rows.map(r=>r[k]).filter(Number.isFinite).sort((a,b)=>a-b);
  return [k,v.length?{min:v[0],median:v[Math.floor(v.length/2)],max:v.at(-1),mean:Math.round(v.reduce((a,b)=>a+b,0)/v.length*10000)/10000,n:v.length}:null];
 }));
 for(const doc of baselines){
  ok(doc.base===BASE,'Wrong base');
  for(const r of doc.rows){
   const key=r.profile+'/'+r.seed;ok(expected.has(key)&&!actual.has(key),'Missing/unexpected/duplicate '+key);actual.add(key);
   ok(!r.error&&r.horizon===180&&r.model==='learning','Incomplete trajectory '+key);
   ok(r.events.length===180&&r.events.every((e,i)=>e.s===i+1&&e.day===L.sessionDay(r.parameters,i+1)&&e.ids.length===10&&new Set(e.ids).size===10&&e.answers.length===10&&e.answers.every((a,j)=>a[0]===e.ids[j])),'Event register '+key);
   ok(JSON.stringify(r.checkpoints.map(c=>c.session))===JSON.stringify(L.HORIZONS),'Missing checkpoint '+key);
   for(const c of r.checkpoints){
    ok(c.independent+c.help+c.corrected+c.wrong+c.skipped===10*c.session,'Answer accounting '+key+' S'+c.session);
    ok(c.proof<=c.concepts&&c.ineligible===0&&c.duplicates===0&&c.short===0,'Selection invariant '+key+' S'+c.session);
   }
   ok(r.violations.length===0,'Violation '+key);
   const end=r.checkpoints.at(-1);
   registry.push({unit:key,scope:'baseline',disposition:'executed',reason:'Exact base, injected clock and learning profile, all checkpoints and events archived',checkpoints:r.checkpoints,elapsedMs:r.elapsedMs});
   (profiles[r.profile]??=[]).push(r);
   totals.trajectories++;totals.sessions+=r.events.length;totals.responses+=r.events.reduce((n,e)=>n+e.answers.length,0);
   for(const k of ['ineligible','duplicates','short','resumes','exports'])totals[k]+=end[k];totals.elapsedMs+=r.elapsedMs;
  }
 }
 ok(actual.size===expected.size&&[...expected].every(k=>actual.has(k)),'Incomplete 18-case matrix');
 const byProfile=Object.fromEntries(Object.entries(profiles).map(([name,rs])=>[name,Object.fromEntries(L.HORIZONS.map(s=>[s,distribution(rs.map(r=>r.checkpoints.find(c=>c.session===s)))]))]));
 const ref=profiles.intermediaire.find(r=>r.seed===47).checkpoints.find(c=>c.session===65);
 ok(sensitivity.base===BASE,'Sensitivity base');
 const labels=new Set(['half-x0.5','half-x2','fixed-control','slow-learning','fast-learning']);
 const sensitivityRows=sensitivity.rows.map(r=>{
  ok(labels.delete(r.label)&&!r.error&&r.horizon===65&&r.profile==='intermediaire'&&r.seed===47&&r.violations.length===0,'Sensitivity '+r.label);
  const c=r.checkpoints.at(-1);
  registry.push({unit:r.label,scope:'sensitivity',disposition:'executed',reason:'One parameter or model changed on same engine, seed and horizon',checkpoints:r.checkpoints,elapsedMs:r.elapsedMs});
  return {label:r.label,model:r.model,parameters:r.parameters,checkpoint:c};
 });
 ok(!labels.size,'Missing sensitivity scenario');
 ok(targeted.unit.status==='PASS'&&targeted.identity.identicalEvents&&targeted.identity.sameSelection&&targeted.legacy.inventedJournal===0,'Targeted tests');
 ok(semantic.base===BASE&&semantic.tally.hypothesis+semantic.tally.unknown===5745&&semantic.tally.usable+semantic.tally.low===semantic.tally.hypothesis,'Frozen diagnostic census');
 const semanticKeys=new Set(['cible/47','faible/103','aide/11']);
 const semanticRows=semantic.rows.map(r=>{
  const key=r.profile+'/'+r.seed,c=r.checkpoints.at(-1);
  ok(semanticKeys.delete(key)&&r.horizon===65&&r.ruleSource===BASE&&r.violations.length===0,'Semantic scenario '+key);
  ok(c.semanticMatches>0&&c.semanticPersistentConcepts>0&&c.interruptedDays>0,'Persistent rule and interruption evidence '+key);
  registry.push({unit:key,scope:'semantic',disposition:'executed',reason:'Frozen diagnostic categories, explicit interrupted days and independent seed',checkpoints:r.checkpoints,elapsedMs:r.elapsedMs});
  return {profile:r.profile,seed:r.seed,checkpoint:c};
 });
 ok(!semanticKeys.size,'Missing semantic scenario');
 registry.push({unit:'model-and-contracts',scope:'unit',disposition:'executed',reason:'Pure model and independent interface fixtures',assertions:targeted.unit.assertions},
 {unit:'identity-intermediaire-47-S20',scope:'pair',disposition:'executed',reason:'Two exact-base replays with identical event sequences',comparison:targeted.identity.comparison},
 {unit:'legacy-export',scope:'save',disposition:'executed',reason:'Synthetic old-format export, no reconstructed journal',result:targeted.legacy},
 {unit:'asset-inventory',scope:'static',disposition:'executed',reason:'Actual production references, cache list, build allowlist and Git blob sizes; no browser execution'},
 {unit:'integrated-M1-M5',scope:'candidate',disposition:'not-examined',reason:'Independent branch; coordinator must integrate and replay all 18 pairs'},
 {unit:'native-browser-and-offline',scope:'environment',disposition:'HOLD',reason:'Complete native checkout and browser/build validation not available through connector V8 environment'},
 {unit:'native-process-cpu-rss',scope:'environment',disposition:'HOLD',reason:'V8 wall time and serialized size measured; process metrics require native checkout'});
 const extensionKeys=new Set(['intermediaire/47/65/ordinary','cible/47/65/semantic','intermediaire/47/180/ordinary']);
 ok(extension?.guards?.base===BASE&&extension.guards.guard.status==='PASS'&&extension.guards.unit.status==='PASS','Extension guard suite');
 registry.push({unit:'paired-guard-adversarial',scope:'unit',disposition:'executed',reason:'Strict pair validation and common unseen-family cohort; rerun historical unit suite',assertions:extension.guards.guard.assertions,historicalAssertions:extension.guards.unit.assertions});
 let additionalResponses=0;
 const identityPairs=extension.pairs.map(p=>{
  const a=p.before,b=p.after,kind=a.ruleSource?'semantic':'ordinary',key=a.profile+'/'+a.seed+'/'+a.horizon+'/'+kind;
  ok(p.base===BASE&&extensionKeys.delete(key)&&G.validatePair(a,b,{requireEvents:true}),'Extension pair '+key);
  ok(JSON.stringify(a.events)===JSON.stringify(b.events)&&!a.violations.length&&!b.violations.length&&p.crossResume.checked,'Identity and restore '+key);
  ok(p.comparison.length===a.checkpoints.length&&p.comparison.every((c,i)=>c.session===a.checkpoints[i].session&&!c.review.length&&Object.values(c.deltas).every(v=>v===0)&&c.crossSessionNewFamilyDelta===0&&c.commonTransfer.n>0&&c.commonTransfer.delta===0&&G.sameHistorical(c.commonTransfer,G.commonTransfer(a.checkpoints[i],b.checkpoints[i],a.seed,L.random))),'Paired checkpoints '+key);
  if(a.horizon===180){const historical=profiles.intermediaire.find(r=>r.seed===47);ok(p.historicalReplay?.identicalEvents&&p.historicalReplay.changes.length===0&&JSON.stringify(historical.events)===JSON.stringify(a.events)&&historical.checkpoints.every((c,i)=>p.historicalReplay.checkedMetrics.every(k=>c[k]===a.checkpoints[i][k])),'Historical replay');}
  const responses=[a,b].reduce((n,r)=>n+r.events.reduce((m,e)=>m+e.answers.length,0),0);additionalResponses+=responses;
  const row={key,responses,universeKey:a.universeKey,checkpoints:p.comparison.map(c=>({session:c.session,commonN:c.commonTransfer.n,delta:c.commonTransfer.delta,review:c.review})),historicalReplay:p.historicalReplay??null};
  registry.push({unit:'identity-'+key,scope:'pair',disposition:'executed',reason:'Frozen reference compared with itself; same unseen exercises; no candidate gain claimed',...row});return row;
 });
 ok(extensionKeys.size===0,'Incomplete extension pairs');
 const evidence=extension.evidence;
 ok(evidence?.base===BASE&&evidence.native.status==='PASS'&&evidence.native.exactBlobHashesVerified===true&&evidence.native.assertions>0&&evidence.v8.evidenceAssertions===evidence.native.assertions,'Evidence test record');
 ok(evidence.archives.length===identityPairs.length&&evidence.archives.every((a,i)=>a.valid&&a.inflatedRejected&&a.responses===identityPairs[i].responses),'Evidence archive record');
 registry.push({unit:'paired-event-accounting',scope:'unit',disposition:'executed',reason:'Reject missing provenance, clocks or falsified summary counters; exact-blob native Node test and archive revalidation in V8',assertions:evidence.native.assertions,archiveResponses:evidence.archives.reduce((n,a)=>n+a.responses,0)});
 return {schema:'QPJB_DURABLE_M6_REGISTER_V1',base:BASE,totals,byProfile,sensitivity:{reference:ref,variants:sensitivityRows},semantic:{tally:semantic.tally,categories:semantic.categories,rows:semanticRows},extension:{additionalResponses,guardAssertions:extension.guards.guard.assertions,identityPairs,evidenceAssertions:evidence.native.assertions},registry};
}
module.exports={summarize};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const dir=path.join(__dirname,'../audits/apprentissage-durable-20261126/m6'),read=p=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
 console.log(JSON.stringify(summarize(Object.keys(L.PROFILES).map(n=>read('baseline-'+n+'.json')),read('sensitivity.json'),read('targeted-results.json'),read('semantic-results.json'),{guards:read('guard-results.json'),evidence:read('evidence-integrity-results.json'),pairs:['identity-paired-s65.json','identity-semantic-s65.json','identity-paired-s180.json'].map(read)}),null,2));
}

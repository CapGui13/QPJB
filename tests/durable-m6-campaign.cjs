'use strict';
// Reusable in Node and in a V8 in-memory harness with exact GitHub sources.
const LAB=require('../quizz-durable-m6-lab.js');
const GUARDS=require('../quizz-durable-m6-guards.js');
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const paths=['quizz.html','quizz-prerequis.js','quizz-session-plan.js','quizz-parcours.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js'];
const assert=(v,m)=>{if(!v)throw Error(m)};
function compile(src,req,DateClass=Date){const module={exports:{}};new Function('module','require','Date',src)(module,req,DateClass);return module.exports}
function data(html){const m=[...html.matchAll(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/g)];assert(m.length===1,'Embedded catalogue');return JSON.parse(m[0][1]).exercises}
function engine(sources){
 let current=Date.UTC(2026,0,1);
 class Clock extends Date{constructor(...a){super(...(a.length?a:[current]))}static now(){return current}}
 const modules={},loading=new Set();
 const req=n=>{
  if(Object.hasOwn(modules,n))return modules[n];
  if(!/^\.\/[-\w]+\.js$/.test(n)||!Object.hasOwn(sources,n.slice(2)))throw Error('Missing module '+n);
  if(loading.has(n))throw Error('Circular dependency '+n);
  loading.add(n);try{return modules[n]=compile(sources[n.slice(2)],req,Clock)}finally{loading.delete(n)}
 };
 req('./quizz-prerequis.js');req('./quizz-session-plan.js');
 assert(modules['./quizz-session-plan.js'].pedagogyReady,'Production policies must be active');
 const source=sources['quizz-parcours.js'],anchor='return {eligibility,adaptiveDiagnostics,createForTests:';
 assert(source.split(anchor).length===2,'Exact instrumentation anchor; adapt explicitly if engine changes');
 const api=compile(source.replace(anchor,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:'),req,Clock);
 return {api,exercises:data(sources['quizz.html']),meta:modules['./quizz-prerequis.js'],clock:ms=>{current=Date.UTC(2026,0,1)+ms}};
}
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const opener=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1]||'';
function verifyEarly(deck,s){
 const pp=deck.flatMap((q,i)=>openingPass(q)?[i]:[]);
 if(s===1){assert(deck.every(q=>q.theme==='ouv'&&q.difficulty===1),'S1 fundamental');assert(pp.length===3&&pp.every((v,i)=>v<=[1,4,6][i]&&(!i||v-pp[i-1]>=2)&&deck[v].h<12),'S1 Passe');
 for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])assert(deck.filter(q=>bid(q)===a).length>=n,'S1 '+a);}
 if(s===2){assert(pp.length>=1&&pp.length<=2&&pp.every((v,i)=>v<=[3,6][i]&&(!i||v-pp[i-1]>=2)),'S2 Passe');
 assert(deck.slice(0,2).every(q=>q.theme==='ouv'&&!openingPass(q)),'S2 openings');
 const support=deck.flatMap((q,i)=>q.theme==='majeur'&&q.auction?.length===1&&/^1[♥♠]$/.test(opener(q))&&bid(q)==='2'+opener(q)[1]?[i]:[]);
 assert(support.length>=2&&support.every((i,j)=>deck[i].shape[bid(deck[i])==='2♠'?0:1]===3&&(!j||i-support[j-1]>1)),'S2 fit 5-3');
 const ties=deck.filter(q=>q.theme==='ouv'&&q.shape?.[2]===q.shape?.[3]);
 assert(ties.some(q=>q.shape[2]===3&&bid(q)==='1♣')&&ties.some(q=>q.shape[2]===4&&bid(q)==='1♦'),'S2 meilleure mineure');
 const prior=deck.slice(0,support[0]).filter(q=>q.theme==='mineur'&&q.auction?.length===1&&/^1[♣♦]$/.test(opener(q)));
 assert(prior.some(q=>bid(q)==='1SA')&&prior.some(q=>/^1[♥♠]$/.test(bid(q))),'S2 responses before fit');}
 if(s===3)assert(pp.length<=1,'S3 Passe');if(s>3)assert(pp.length<=2,'Later Passe');
}
function prepare(sources){const e=engine(sources);const c=LAB.catalog(e.exercises,e.meta);assert(c.ids.size===Object.keys(e.meta.byId).length,'Metadata coverage');return e}
function run(sources,name,seed,horizon=180,options={}){
 const e=prepare(sources);
 const probe=options.probe||e;
 const catalogueBefore=JSON.stringify(e.exercises),metaBefore=JSON.stringify(e.meta);
 const begin=Date.now();
 const result=LAB.run({...e,probeExercises:probe.exercises,probeMeta:probe.meta,name,seed,horizon,verifyEarly,measure:()=>Date.now(),overrides:options.overrides||{},model:options.model||'learning',ruleMap:options.ruleMap,collectProbeRows:!!options.collectProbeRows});
 assert(JSON.stringify(e.exercises)===catalogueBefore&&JSON.stringify(e.meta)===metaBefore,'Engine mutated catalogue or metadata');
 return {...result,universeKey:GUARDS.universeKey(probe.exercises,probe.meta),elapsedMs:Date.now()-begin};
}
const diagnosticPaths=['quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js','quizz-professeur.js'];
function referenceRules(sources,diagnosticSources){
 const mods={},req=n=>{if(!Object.hasOwn(mods,n))throw Error('Missing reference diagnostic module '+n);return mods[n]};
 for(const p of diagnosticPaths)mods['./'+p]=compile(diagnosticSources[p],req);
 const e=prepare(sources);
 return LAB.buildRuleMap(e.exercises,e.meta,mods['./quizz-professeur.js'].diagnose,BASE);
}
// AUDIT3000 is a deliberate editorial revision, not an exemption from the
// historical guard. Only the exact before/after objects in the immutable
// audited manifest are admissible. Future undeclared changes still fail.
const AUDIT_BASE='ccd8f20811b9531bbfccb8352ec60953dd7d07cb';
const AUDIT_REVISION='catalogue:ca71f3c2956260d51eee2908fe0ec9120c47cf3f;metadata:ecc1a1802665d9af4c6ca63ae7cd5e85b286afcc';
const AUDIT_CATALOGUE_BLOB='ca71f3c2956260d51eee2908fe0ec9120c47cf3f',AUDIT_METADATA_BLOB='ecc1a1802665d9af4c6ca63ae7cd5e85b286afcc';
function verifyAuditRevision(b,c,audit){
 assert(audit.catalogue.base===AUDIT_BASE&&audit.metadata.base===AUDIT_BASE,'Audit manifest provenance');
 const original=new Map(audit.exercises.map(q=>[q.id,q]));
 const live=new Map(c.exercises.map(q=>[q.id,q]));
 const qm=audit.catalogue.byId,mm=audit.metadata.byId;
 assert(original.size===3000&&audit.exercises.length===3000&&Object.keys(audit.meta.byId).length===3000,'Audit base coverage');
 assert(live.size===c.exercises.length,'Candidate ID uniqueness');
 for(const [id,q] of original){
  const next=live.get(id),m=audit.meta.byId[id],n=c.meta.byId[id];
  assert(next&&m&&n,'Lost audited ID or metadata '+id);
  if(Object.hasOwn(qm,id)){
   assert(GUARDS.sameHistorical(qm[id].before,q)&&!GUARDS.sameHistorical(qm[id].before,qm[id].after),'Invalid audit exercise record '+id);
   assert(GUARDS.sameHistorical(next,qm[id].after),'Unapproved audit exercise change '+id);
  }else assert(GUARDS.sameHistorical(next,q),'Changed unlisted exercise '+id);
  if(Object.hasOwn(mm,id)){
   assert(GUARDS.sameHistorical(mm[id].before,m)&&!GUARDS.sameHistorical(mm[id].before,mm[id].after),'Invalid audit metadata record '+id);
   assert(GUARDS.sameHistorical(n,mm[id].after),'Unapproved audit metadata change '+id);
  }else assert(GUARDS.sameHistorical(n,m),'Changed unlisted metadata '+id);
 }
 for(const id of [...Object.keys(qm),...Object.keys(mm)])assert(original.has(id),'Unknown audit manifest ID '+id);
 for(const q of b.exercises){
  assert(original.has(q.id)&&GUARDS.sameHistorical(original.get(q.id),q),'Changed historical exercise before audit '+q.id);
  assert(GUARDS.sameHistorical(audit.meta.byId[q.id],b.meta.byId[q.id]),'Changed historical metadata before audit '+q.id);
 }
 return {catalogue:Object.keys(qm).length,metadata:Object.keys(mm).length,base:AUDIT_BASE,revision:AUDIT_REVISION};
}
function pair(base,candidate,name,seed,horizon=180,options={}){
 const b=prepare(base),c=prepare(candidate),byId=new Map(c.exercises.map(q=>[q.id,q]));
 const audited=options.auditRevision?verifyAuditRevision(b,c,options.auditRevision):null;
 if(!audited)for(const q of b.exercises){const newer=byId.get(q.id);assert(newer,'Lost historical ID '+q.id);
 assert(GUARDS.sameHistorical(newer,q),'Changed historical exercise '+q.id);
 assert(GUARDS.sameHistorical(c.meta.byId[q.id],b.meta.byId[q.id]),'Changed historical metadata '+q.id);}
 const cross=crossResume(b,c);
 const before=run(base,name,seed,horizon,{...options,probe:b,collectProbeRows:true}),after=run(candidate,name,seed,horizon,{...options,probe:b,collectProbeRows:true});
 GUARDS.validatePair(before,after,{requireEvents:true});
 const comparison=LAB.compare(before,after).map((r,i)=>{
  const a=before.checkpoints[i],b=after.checkpoints[i];
  const common=before.model==='learning'?GUARDS.commonTransfer(a,b,seed,LAB.random):null;
  if(common?.n>=10&&common.delta<-.03)r.review.push('common-transfer-probe');
  if(a.crossSessionNewFamily-b.crossSessionNewFamily>Math.max(5,.15*a.crossSessionNewFamily))r.review.push('cross-session-transfer');
  return {...r,commonTransfer:common,crossSessionNewFamilyDelta:b.crossSessionNewFamily-a.crossSessionNewFamily};
 });
 return {before,after,crossResume:cross,comparison,...(audited?{auditedRevision:audited}:{})};
}
function crossResume(b,c){
 b.clock(0);c.clock(0);
 const s=b.api.empty(),deck=b.api.start(s,b.exercises);
 assert(b.api.record(s,deck[0],'correct',0,deck[0].answer,true,false),'Cross resume setup');
 const raw=JSON.stringify(s),expected=JSON.stringify(s.active);
 const saved=b.api.exportProgress(s,b.exercises,{});
 for(const restored of [c.api.load(raw),c.api.importProgress(JSON.stringify(saved))]){
  assert(JSON.stringify(restored.active)===expected,'Cross version active evidence');
  assert(JSON.stringify(c.api.start(restored,c.exercises).map(q=>q.id))===JSON.stringify(deck.map(q=>q.id)),'Cross version exact deck');
 }
 return {checked:true,answered:1,deckSize:deck.length};
}
function legacy(sources){
 const e=prepare(sources),s=e.api.empty();e.clock(0);const deck=e.api.start(s,e.exercises);
 for(let i=0;i<deck.length;i++)assert(e.api.record(s,deck[i],'correct',i,deck[i].answer,false,false),'Legacy setup');
 assert(e.api.finish(s,e.exercises),'Finish');const old=JSON.parse(JSON.stringify(e.api.exportProgress(s,e.exercises,{})));
 delete old.algorithmState.journal;delete old.algorithmState.micros;delete old.algorithmState.axes;
 const imported=e.api.importProgress(old);
 assert(imported.completed===1&&imported.journal.length===0,'No invented history');
 assert(Object.keys(imported.entries).length===deck.length,'Legacy entries preserved');
 assert(e.api.exportProgress(imported,e.exercises,{}).limitations.historicalSessionsWithoutDetailedAnswers===1,'Historical limitation');
 return {oldEntries:deck.length,restoredEntries:Object.keys(imported.entries).length,inventedJournal:imported.journal.length};
}
module.exports={BASE,AUDIT_BASE,AUDIT_REVISION,verifyAuditRevision,paths,diagnosticPaths,referenceRules,compile,data,engine,prepare,run,pair,crossResume,legacy,verifyEarly};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),zlib=require('node:zlib');
 const root=path.join(__dirname,'..'),args=process.argv.slice(2),cmd=args[0]||'baseline',name=args[1]||'intermediaire',seed=Number(args[2]||47),h=Number(args[3]||180);
 const gitSources=Object.fromEntries(paths.map(p=>[p,cp.execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024})]));
 const local=()=>Object.fromEntries([...new Set([...paths,...fs.readdirSync(root).filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js')])].map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
 // Only the pinned Git object may authorize an audit revision; never a
 // mutable candidate manifest. Other branches retain the strict old guard.
 const revisionDir='audits/audit3000-20261127/';
 const readGit=(ref,p)=>cp.execFileSync('git',['show',ref+':'+p],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
 const auditOptions=()=>{
  if(!fs.existsSync(path.join(root,revisionDir+'INTEGRATION-CATALOGUE.json')))return {};
  return {auditRevision:{
   exercises:data(readGit(AUDIT_BASE,'quizz.html')),
   meta:compile(readGit(AUDIT_BASE,'quizz-prerequis.js'),require),
   catalogue:JSON.parse(cp.execFileSync('git',['cat-file','blob',AUDIT_CATALOGUE_BLOB],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024})),
   metadata:JSON.parse(cp.execFileSync('git',['cat-file','blob',AUDIT_METADATA_BLOB],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024}))
  }};
 };
 const auditSources=()=>Object.fromEntries([...new Set([...paths,...readGitTree(AUDIT_BASE)])].map(p=>[p,readGit(AUDIT_BASE,p)]));
 function readGitTree(ref){return cp.execFileSync('git',['ls-tree','--name-only',ref],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js')}
 let result;
 if(cmd==='audit-pair')result=pair(auditSources(),local(),name,seed,h,auditOptions());
 else if(cmd==='audit-reference-pair')result=pair(gitSources,auditSources(),name,seed,h);
 else if(cmd==='baseline')result=run(gitSources,name,seed,h);
 else if(cmd==='pair')result=pair(gitSources,local(),name,seed,h,auditOptions());
 else if(cmd==='fixed')result=run(gitSources,name,seed,h,{model:'fixed'});
 else if(cmd==='sensitivity'||cmd==='sensitivity-pair'){
 const p=LAB.PROFILES[name],cases=[['reference',{}],['half-x0.5',{overrides:{half:p.half*.5}}],['half-x2',{overrides:{half:p.half*2}}],['fixed-control',{model:'fixed'}],['slow-learning',{overrides:{learn:p.learn*.5}}],['fast-learning',{overrides:{learn:p.learn*2}}]];
 result=cases.map(([label,opts])=>({label,result:cmd==='sensitivity-pair'?pair(gitSources,local(),name,seed,h,{...opts,...auditOptions()}):run(gitSources,name,seed,h,opts)}));
 }
 else if(cmd==='semantic'||cmd==='semantic-pair'){
 const diagnosticSources=Object.fromEntries(diagnosticPaths.map(p=>[p,cp.execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024})]));
 const ruleMap=referenceRules(gitSources,diagnosticSources);
 const opts={ruleMap,overrides:{pauseDays:5}};
 result={tally:ruleMap.tally,categories:ruleMap.categories,result:cmd==='semantic-pair'?pair(gitSources,local(),name,seed,h,opts):run(gitSources,name,seed,h,opts)};
 }
 else if(cmd==='legacy')result=legacy(gitSources);
 else if(cmd==='size'){
 const files=[...paths,'quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js','quizz-professeur.js','service-worker.js','parcours-recommandations.js',...['quizz-durable-m1-adaptation.js','quizz-durable-m1-guard.js','quizz-durable-m2-data.js','quizz-durable-m2-remediation.js','quizz-durable-m3-maitrise.js','quizz-durable-m4-transfert.js','quizz-durable-m5-lecons.js','quizz-durable-integration.js'].filter(p=>fs.existsSync(path.join(root,p)))];
 result=files.map(p=>{const b=fs.readFileSync(path.join(root,p));return {file:p,bytes:b.length,gzipBytes:zlib.gzipSync(b).length,sha256:crypto.createHash('sha256').update(b).digest('hex')}});
 }else throw Error('Command: baseline|pair|audit-pair|audit-reference-pair|fixed|sensitivity|sensitivity-pair|semantic|semantic-pair|legacy|size');
 console.log(JSON.stringify({result,environment:{node:process.version,memory:process.memoryUsage(),cpu:process.cpuUsage()}},null,2));
 const trajectories=Array.isArray(result)?result.flatMap(x=>x.result?.before?[x.result.before,x.result.after]:[x.result]):['pair','audit-pair','audit-reference-pair'].includes(cmd)?[result.before,result.after]:cmd==='semantic'?[result.result]:cmd==='semantic-pair'?[result.result.before,result.result.after]:[result];
 if(trajectories.some(x=>x?.violations?.length)||result.comparison?.some(x=>x.review.length)||result.result?.comparison?.some(x=>x.review.length)||(Array.isArray(result)&&result.some(x=>x.result?.comparison?.some(y=>y.review.length))))process.exitCode=2;
}

// Reprise6 D: #505 M6 campaign, T-only adaptation; response/comparator untouched.
'use strict';
// Common M6 fixed response model; genuine optional production-engine entrypoints.
// A green job means technical completion, not a pedagogical visa.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const T=require('../quizz-coherence-m6-traces.js'),C=require('./coherence-concrete-m6-campaign.cjs'),D=require('../quizz-coherence-m4p-d-lab.js'),legacy=require('./durable-m6-campaign.cjs');
const lessons=require('../quizz-coherence-m5-study.js'),m1v2=require('../quizz-coherence-m1-guarded.js'),m1v6=require('../quizz-coherence-m1-window.js'),m2=require('../quizz-coherence-m2-ordre.js'),m4=require('../quizz-coherence-coordinator-m4.js');
const [profile='autonome',seedArg='11',hArg='180',dest='coordination-output']=process.argv.slice(2),seed=Number(seedArg),horizon=Number(hArg);
assert(T.PROFILES.includes(profile)&&T.SEEDS.includes(seed)&&T.HORIZONS.includes(horizon));
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:24*1024*1024});
function sources(ref){return Object.fromEntries(git('ls-tree','--name-only',ref).trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js').map(p=>[p,git('show',ref+':'+p)]))}
const base=sources(T.BASE),current=sources(git('rev-parse','HEAD').trim());
// Coordination: test the actual checked-in engine, without a temporary patch.
const embedded=html=>html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(embedded(base['quizz.html']),embedded(current['quizz.html']));assert.equal(base['quizz-prerequis.js'],current['quizz-prerequis.js']);
fs.mkdirSync(dest,{recursive:true});
const same=(a,b)=>assert.deepEqual(a,b),copy=x=>JSON.parse(JSON.stringify(x));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const ids=deck=>deck.map(q=>q.id),sorted=rows=>rows.map(q=>q.id).sort();
function coreMetrics(sessions){
 const last=new Map(),debt={},proof=new Map(),out=[];
 for(const s of sessions){
  for(const r of s.rows){last.set(r.concept,s.session);if(r.result==='correct'&&!r.assisted&&!r.hadFreeError){const v=proof.get(r.concept)||{f:new Set(),s:new Set()};v.f.add(r.family);v.s.add(s.session);proof.set(r.concept,v)}}
  for(const c of D.CORE)if(last.has(c))debt[c]=(debt[c]||0)+Math.max(0,s.session-last.get(c)-6);
  if(T.HORIZONS.includes(s.session))out.push({session:s.session,debt:{...debt},total:Object.values(debt).reduce((a,b)=>a+b,0),terminal:Object.fromEntries(D.CORE.map(c=>[c,last.has(c)?s.session-last.get(c):null])),proof:[...proof].filter(([,v])=>v.f.size>=2&&v.s.size>=2).map(([c])=>c).sort()});
 }
 return out;
}
function strictCompare(a,b){
 const alerts=[];
 for(let i=0;i<a.core.length;i++){
  const x=a.core[i],y=b.core[i],h=x.session;
  for(const c of D.CORE){
   if((y.debt[c]||0)>(x.debt[c]||0))alerts.push({h,metric:'conceptDebt',concept:c,before:x.debt[c]||0,after:y.debt[c]||0});
   if(x.terminal[c]!==null&&(y.terminal[c]===null||y.terminal[c]>x.terminal[c]))alerts.push({h,metric:'terminalGap',concept:c,before:x.terminal[c],after:y.terminal[c]});
  }
  for(const c of x.proof)if(!y.proof.includes(c))alerts.push({h,metric:'proofConceptLost',concept:c});
  const p=a.checkpoints[i],q=b.checkpoints[i];
  for(const k of ['hard','nearFamily','nearId'])if(q[k]>p[k])alerts.push({h,metric:k,before:p[k],after:q[k]});
  for(const k of ['families','autonomous'])if(q[k]<p[k])alerts.push({h,metric:k,before:p[k],after:q[k]});
 }
 return alerts;
}
function run(label,src,options={}){
 const e=C.engine(src),{api,exercises,meta,effectiveMeta}=e;
 let state=api.empty();const sessions=[],events=[],m5Counts={before:0,after:0,unsafe:0,active:0},initialCatalogue=JSON.stringify(exercises),initialMeta=JSON.stringify(meta);
 const dict=new Map(exercises.map(q=>[q.id,q]));
 const settings={...options,observe:event=>events.push(event)};
 const study=(phase)=>api.studySuggestions(state,exercises,{...settings,coherenceM5:lessons,phase,questionActive:false,quizActive:false});
 for(let s=1;s<=horizon;s++){
  e.clock((s-1)*86400000);
  const old=JSON.stringify(state);
  const before=options.study?study('before'):null;
  if(options.study){
   same(JSON.stringify(state),old);assert(before?.status==='ok');assert.equal(api.studySuggestions(state,exercises,{...settings,coherenceM5:lessons,phase:'before',questionActive:false,quizActive:true}),null);
   assert.equal(api.studySuggestions(state,exercises,{...settings,coherenceM5:lessons,phase:'before'}),null);m5Counts.unsafe+=2;
  }
  const start=performance.now(),deck=api.start(state,exercises,settings),latencyMs=performance.now()-start;
  legacy.verifyEarly(deck,s);assert(deck.length===10&&new Set(ids(deck)).size===10&&new Set(deck.map(q=>q.caseFamily||q.id)).size===10);
  const elig=api.eligibilityBatch(deck,state,exercises);assert(elig.every(x=>x.eligible));
  const historical=state.active.orderReferenceIds||ids(deck);
  const orderPlan=options.coherenceM2?m2.order({session:s,history:{...state,active:null},deck:historical,selected:state.active.selection,exercises:historical.map(id=>dict.get(id)),metadataById:meta.byId,preserveThemeOrder:true}):null;
  const second=options.coherenceFullOrder&&orderPlan?m2.order({session:s,history:{...state,active:null},deck:orderPlan.ids,selected:state.active.selection,exercises:orderPlan.ids.map(id=>dict.get(id)),metadataById:meta.byId,preserveThemeOrder:false,transitionGroups:options.transitionGroups}):null;
  if(orderPlan){same(ids(deck),second?.ids||orderPlan.ids)}
  if(second?.before&&second?.after){
   for(const k of [...m2.HARD,...m2.SOFT])assert(second.after[k]<=second.before[k],'Second pass guard '+k);
   if(second.semanticBefore!==undefined)assert(second.semanticAfter<=second.semanticBefore);
  }
  if(options.study){
   const cs=new Set(deck.map(q=>meta.byId[q.id].concept));
   assert(before.before.every(x=>cs.has(x.concept)&&x.presentation==='rule-only'&&x.optional&&!x.assessment));
   assert.equal(study('before'),null);assert.equal(study('after'),null);m5Counts.active+=2;m5Counts.before+=before.before.length;
  }
  const p=options.coherenceM1?.plan({session:s,history:{...state,active:null},candidates:deck,metadataById:meta.byId});
  const objective=p?{source:'declared',principal:p.primary[0],secondary:p.primary.slice(1).concat(p.secondary),title:p.objective}:null;
  const trace=T.traceSession({deck,selection:state.active.selection,meta:effectiveMeta,rawMeta:meta,elig,pattern:q=>api.decisionPatternForM6(q),s,history:sessions,profile,seed,latencyMs,objective});
  for(const [i,q] of deck.entries()){
   const row=trace.rows[i],choice=row.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
   assert(api.record(state,q,row.result,i,choice,row.assisted,row.hadFreeError));row.choice=choice;
   if(i===0&&[1,2,3,5,20,21,65,66,153,180].includes(s)){
    for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){
     same(restored.active,state.active);same(ids(api.start(restored,exercises,settings)),ids(deck));
    }
   }
  }
  const replayed=!!state.active.orderSkillBase;
  assert(api.finish(state,exercises));
  trace.proofDigest=crypto.createHash('sha256').update(JSON.stringify(canonical({skills:state.skills,entries:state.entries,micros:state.micros,axes:state.axes}))).digest('hex');
  trace.replayed=replayed;
  if(second?.before&&second?.after)trace.secondOrder={ids:second.ids,before:second.before,after:second.after,semanticBefore:second.semanticBefore||0,semanticAfter:second.semanticAfter||0};
  if(options.study){
   const snap=JSON.stringify(state),after=study('after');same(JSON.stringify(state),snap);assert(after?.status==='ok');
   const wrong=new Set(trace.rows.filter(r=>r.result==='wrong'||r.result==='correct'&&(r.assisted||r.hadFreeError)).map(r=>r.concept));
   assert(after.after.every(x=>wrong.has(x.concept)&&x.presentation==='reminder-only'&&x.optional&&!x.assessment));m5Counts.after+=after.after.length;
   trace.study={before:before.before,after:after.after};
  }
  trace.order=orderPlan?{historical,actual:ids(deck),reasons:orderPlan.reasons,before:orderPlan.before,after:orderPlan.after}:null;
  sessions.push(trace);
 }
 same(JSON.stringify(exercises),initialCatalogue);same(JSON.stringify(meta),initialMeta);
 const checkpoints=T.HORIZONS.filter(n=>n<=horizon).map(n=>({session:n,...T.metrics(sessions.slice(0,n))}));
 assert(checkpoints.every(x=>!x.violations.length));
 return {label,profile,seed,policy:'fixed-385-395-v1',catalogueKey:'frozen-1915',sessions,checkpoints,core:coreMetrics(sessions),events,m5Counts,state:{skills:state.skills,entries:state.entries,micros:state.micros,axes:state.axes}};
}
const arms={},fullMode=true,atomicMode=true;
arms.native=run('native',base);
arms.off=run('off',current);
const fingerprint=a=>a.sessions.map(s=>s.rows.map(r=>[r.id,r.kind,r.selectionReason,r.result,r.assisted]));
same(fingerprint(arms.native),fingerprint(arms.off));same(canonical(arms.native.state),canonical(arms.off.state));
arms.M2=run('M2',current,{coherenceM2:m2,study:true});
if(fullMode){
 const P=require('../quizz-coherence-m3-prerequis.js');
 const transitionGroups=[{simple:P.TEXAS_ELEMENTARY,complex:P.TEXAS},{simple:P.STAYMAN_SIMPLE,complex:P.STAYMAN_FOURTH}];
 arms.Full=run('Full',current,{coherenceM2:m2,coherenceFullOrder:true,transitionGroups,study:true});
 same(arms.M2.sessions.map(s=>s.proofDigest),arms.Full.sessions.map(s=>s.proofDigest));
 same(arms.M2.sessions.map(s=>sorted(s.rows)),arms.Full.sessions.map(s=>sorted(s.rows)));
 for(let i=0;i<arms.Full.sessions.length;i++){
  const a=arms.M2.sessions[i].rows,b=arms.Full.sessions[i].rows;
  const evidence=rows=>rows.map(r=>[r.id,r.kind,r.selectionReason,r.result,r.assisted,r.hadFreeError,r.choice]).sort((x,y)=>x[0].localeCompare(y[0]));
  same(evidence(a),evidence(b));
 }
 if(atomicMode){
  const A=require('../quizz-coherence-reprise6-d-t.js');
  arms.T=run('T',current,{coherenceM2:m2,coherenceFullOrder:true,transitionGroups,coherenceAtomic:A,study:true});
 }
}else{
arms.V2=run('V2',current,{coherenceM1:m1v2});
arms.V6=run('V6',current,{coherenceM1:m1v6});
arms.V2M2=run('V2M2',current,{coherenceM1:m1v2,coherenceM2:m2,study:true});
arms.V6M2=run('V6M2',current,{coherenceM1:m1v6,coherenceM2:m2,study:true});
arms.V2M2M4=run('V2M2M4',current,{coherenceM1:m1v2,coherenceM2:m2,coherenceM4:m4,study:true});
arms.V6M2M4=run('V6M2M4',current,{coherenceM1:m1v6,coherenceM2:m2,coherenceM4:m4,study:true});
}
for(const [a,b] of (fullMode?[['native','M2'],['M2','Full']]:[['native','M2'],['V2','V2M2'],['V6','V6M2']])){
 same(arms[a].sessions.map(s=>sorted(s.rows)),arms[b].sessions.map(s=>sorted(s.rows)));
 same(canonical(arms[a].state),canonical(arms[b].state));
}
const comparisons={};
for(const [a,b] of (atomicMode?[['native','M2'],['M2','Full'],['Full','T']]:fullMode?[['native','M2'],['M2','Full']]:[['native','M2'],['native','V2'],['native','V6'],['native','V2M2'],['native','V6M2'],['V2M2','V2M2M4'],['V6M2','V6M2M4']])){
 const comp=T.compare(arms[a],arms[b]),strict=strictCompare(arms[a],arms[b]);
 comparisons[a+'-'+b]={checkpoints:comp.checkpoints.map(c=>({session:c.session,review:c.review})),strict,changedSets:comp.changes.filter(x=>!x.sameSet).length,changedOrders:comp.changes.filter(x=>!x.sameOrder).length};
}
function fullMetrics(a){
 const keys=[...m2.HARD,...m2.SOFT,'semantic'];
 const sums=Object.fromEntries(keys.map(k=>[k,[0,0]]));let changed=0,replayed=0,semanticFixed=0;
 for(const s of a.sessions){
  replayed+=+s.replayed;
  const p=s.secondOrder;if(!p)continue;
  changed+=+(p.ids.join('|')!==s.order.actual.join('|'));
  semanticFixed+=p.semanticBefore-p.semanticAfter;
  for(const k of keys){sums[k][0]+=k==='semantic'?p.semanticBefore:p.before[k];sums[k][1]+=k==='semantic'?p.semanticAfter:p.after[k]}
 }
 return {replayed,semanticFixed,sums};
}
function atomicMetrics(a){
 const F=require('../quizz-coherence-m4-diversite.js'),P=require('../quizz-coherence-m3-prerequis.js');
 const rows=a.sessions.flatMap(s=>s.rows),transitions={};
 for(const [name,simple,complex] of [['texas',P.TEXAS_ELEMENTARY,P.TEXAS],['stayman',P.STAYMAN_SIMPLE,P.STAYMAN_FOURTH]]){
  const first=rows.findIndex(r=>simple.includes(r.id)),second=rows.findIndex(r=>complex.includes(r.id));
  transitions[name]={simple:first<0?null:[rows[first].session,rows[first].position],complex:second<0?null:[rows[second].session,rows[second].position],inversion:second>=0&&(first<0||second<first)};
 }
 const near=n=>a.sessions.slice(0,n).reduce((sum,s)=>{
  const f=s.rows.map(r=>F.features(r,{concept:r.concept}));let count=0;
  for(let i=0;i<f.length;i++)for(let j=0;j<i;j++)if(f[i]&&f[j]&&f[i].near===f[j].near)count++;
  return sum+count;
 },0);
 return {transitions,near5:near(5),near20:near(20)};
}
const summary={profile,seed,horizon,fullMode,atomicMode,arms:Object.fromEntries(Object.entries(arms).map(([k,a])=>[k,{checkpoints:a.checkpoints,core:a.core,events:a.events,m5Counts:a.m5Counts,fullMetrics:fullMetrics(a)}])),comparisons};
fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify(summary));fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify(arms));
const compact={profile,seed,comparisons:Object.fromEntries(Object.entries(comparisons).map(([k,v])=>[k,{changedSets:v.changedSets,changedOrders:v.changedOrders,review:v.checkpoints.flatMap(x=>x.review.map(y=>[x.session,y])),strict:v.strict.length}])),arms:Object.fromEntries(Object.entries(arms).map(([k,a])=>[k,{events:a.events.length,m4:a.events.filter(e=>e.m4Choice).length,coreDebt:a.core.at(-1).total,proof:a.checkpoints.at(-1).proofConcepts,families:a.checkpoints.at(-1).families,study:a.m5Counts,fullMetrics:fullMetrics(a),atomicMetrics:atomicMetrics(a),direct:a.events.filter(e=>e.atomicChoice)}]))};
console.log('COORDINATION_SUMMARY '+JSON.stringify(compact));

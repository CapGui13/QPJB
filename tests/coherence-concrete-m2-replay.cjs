'use strict';
// M2 #421 — exact base replay, injected only at the return of logicalOrder.
// Node: node tests/coherence-concrete-m2-replay.cjs [profile|all] [seed|all] [horizon] [output-directory]
const BASE='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
const PROFILES=['autonome','modere','faible','cible','aide','passe'],SEEDS=[11,47,103],CHECKPOINTS=[5,20,65,153,180];
const check=(x,m)=>{if(!x)throw Error(m)};
const bid=q=>String(q.answer||'').replace(/[\uFE0E\uFE0F\s]/g,'');
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
function hash(x){let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296}
function outcome(q,s,seed,profile){
 const r=hash(q.id+'|'+s+'|'+seed),rate=profile==='autonome'?0:profile==='modere'?.33:profile==='faible'?.8:profile==='cible'?(q.theme==='sa'?.9:.12):profile==='passe'?(openingPass(q)?1:0):.15;
 return {result:r<rate?'wrong':'correct',help:profile==='aide'&&hash('help|'+q.id+'|'+s+'|'+seed)<.72};
}
function compile(src,req,Clock){const m={exports:{}};new Function('module','require','Date',src)(m,req,Clock);return m.exports}
function prepare(sources,mod,apply=false,referenceJournal=null){
 let time=Date.UTC(2026,0,1),calls=[];
 class Clock extends Date{constructor(...a){super(...(a.length?a:[time]))}static now(){return time}}
 const modules={},loading=new Set();
 const req=n=>{
  if(n==='./quizz-coherence-m2-ordre.js')return mod;
  if(Object.hasOwn(modules,n))return modules[n];
  check(/^\.[/][-\w]+\.js$/.test(n)&&Object.hasOwn(sources,n.slice(2)),'missing dependency '+n);
  check(!loading.has(n),'cycle '+n);loading.add(n);
  try{return modules[n]=compile(sources[n.slice(2)],req,Clock)}finally{loading.delete(n)}
 };
 const metadata=req('./quizz-prerequis.js').byId;
 const html=sources['quizz.html'],match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
 check(match,'catalogue');const qs=JSON.parse(match[1]).exercises,byId=new Map(qs.map(q=>[q.id,q]));
 check(qs.length===1915&&Object.keys(metadata).length===1915,'exact catalogue');
 const src=sources['quizz-parcours.js'],marker='  function logicalOrder(items,state,exerciseOf=x=>x.exercise){';
 check(src.split(marker).length===2,'exact injection anchor');
 const hook=String.raw`
  function logicalOrder(items,state,exerciseOf=x=>x.exercise){
   const historicalStarted=__measure();
   const historicalState=__referenceJournal?{...state,journal:__referenceJournal(state.journal||[])}:state;
   const historic=historicalLogicalOrder(items,historicalState,exerciseOf);
   const historicalMs=__measure()-historicalStarted;
   const id=x=>exerciseOf(x).id;
   const byId=new Map(historic.map(x=>[id(x),x]));
   const selected=historic.map(x=>({id:id(x),kind:x.kind,target:x.target,reason:x.reason}));
   const ctx={session:state.completed+1,history:state,exercises:historic.map(exerciseOf),
     metadataById:prerequis.byId,deck:historic.map(id),selected};
   const m2Started=__measure();
   const plan=__m2.order(ctx);
   const m2Ms=__measure()-m2Started;
   if(plan.ids.length!==historic.length||new Set(plan.ids).size!==historic.length||plan.ids.some(x=>!byId.has(x)))throw Error('M2 strict permutation');
   __trace.push({historical:historic.map(id),selected,plan,historicalMs,m2Ms});
   return __apply?plan.ids.map(x=>byId.get(x)):historic;
  }
  function historicalLogicalOrder(items,state,exerciseOf=x=>x.exercise){`;
 const exportMarker='return {eligibility,adaptiveDiagnostics,createForTests:';
 check(src.split(exportMarker).length===2,'exact export anchor');
 const instrumented=(apply?src.replace(marker,hook):src).replace(exportMarker,'return {decisionPattern,eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:');
 const m={exports:{}};new Function('module','require','Date','__m2','__trace','__apply','__measure','__referenceJournal',instrumented)(m,req,Clock,mod,calls,apply,()=>Date.now(),referenceJournal);
 return {api:m.exports,metadata,qs,byId,calls,clock:s=>{time=Date.UTC(2026,0,1)+s*86400000}};
}
function early(deck,s){
 const p=deck.flatMap((q,i)=>openingPass(q)?[i+1]:[]);
 if(s===1){
  check(p.length===3&&p.every((v,i)=>v<=[2,5,7][i]&&(!i||v-p[i-1]>=2)&&deck[v-1].h<12),'S1 Passe');
  check(deck.every(q=>q.theme==='ouv'&&q.difficulty===1),'S1 opening');
  for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])check(deck.filter(q=>bid(q)===a).length>=n,'S1 '+a);
 }
 if(s===2){
  check(p.length>=1&&p.length<=2&&p.every((v,i)=>v<=[4,7][i]&&(!i||v-p[i-1]>=2)),'S2 Passe');
  check(deck.slice(0,2).every(q=>q.theme==='ouv'&&!openingPass(q)),'S2 openings');
  const ties=deck.slice(0,2);check(ties.some(q=>q.shape[2]===3&&q.shape[3]===3&&bid(q)==='1♣')&&ties.some(q=>q.shape[2]===4&&q.shape[3]===4&&bid(q)==='1♦'),'S2 meilleure mineure');
  const fits=deck.flatMap((q,i)=>q.theme==='majeur'&&q.auction?.length===1&&/^2[♥♠]$/.test(bid(q))?[i]:[]);
  check(fits.length>=2&&fits.every((v,i)=>deck[v].shape[bid(deck[v])==='2♠'?0:1]===3&&(!i||v-fits[i-1]>1)),'S2 fit 5-3');
  const prior=deck.slice(0,fits[0]).filter(q=>q.theme==='mineur');
  check(prior.some(q=>/^1[♥♠]$/.test(bid(q)))&&prior.some(q=>bid(q)==='1SA'),'S2 natural responses before fit');
 }
 if(s===3)check(p.length<=1,'S3 Passe');if(s>3)check(p.length<=2,'Later Passe');
}
function detail(ids,byId,metadata,selection,reasons){
 const sm=new Map(selection.map(x=>[x.id,x])),rm=new Map(reasons.map(x=>[x.id,x]));
 return ids.map((id,i)=>{const q=byId.get(id),m=metadata[id],r=rm.get(id);return {id,position:i+1,context:q.context,auction:q.auction,hand:q.hand,h:q.h,shape:q.shape,answer:q.answer,concept:m.concept,stage:m.stage,difficulty:q.difficulty,family:q.caseFamily||id,selection:sm.get(id),role:r?.role||sm.get(id)?.kind||'historique',reason:r?.reason||'Ordre historique du moteur'}});
}
const add=(a,b)=>{for(const [k,v] of Object.entries(b||{}))a[k]=(a[k]||0)+v};
function run(sources,mod,profile,seed,horizon,apply){
 const e=prepare(sources,mod,apply),{api,qs,metadata,byId}=e,state=api.empty(),rows=[],checkpoints=[],stats={changed:0,violations:0,before:{},after:{},unavailable:0},first={},families=new Set(),last={},gaps={},difficulty={},times=[],lastTheme={},firstTheme={},themeGaps={},fundamentals=['ouv','majeur','mineur','sa','red','second','stayman'];
 let fundamentalDebt=0;
 const snapshot=JSON.stringify(qs),metaSnapshot=JSON.stringify(metadata);
 for(let s=1;s<=horizon;s++){
  e.clock(s);
  const started=Date.now(),deck=api.start(state,qs);const totalMs=Date.now()-started;
  check(deck.length===10&&new Set(deck.map(q=>q.id)).size===10,'ten IDs '+s);
  check(new Set(deck.map(q=>q.caseFamily||q.id)).size===10,'ten families '+s);
  check(api.eligibilityBatch(deck,state,qs).every(v=>v.eligible),'eligibility '+s);
  early(deck,s);
  const ids=deck.map(q=>q.id),selected=state.active.selection;
  let call;
  if(apply)call=e.calls.at(-1);
  else{
   const t=Date.now(),plan=mod.order({session:s,history:{...state,active:null},deck:ids,exercises:deck,metadataById:metadata,selected});
   call={historical:ids.slice(),selected,plan,historicalMs:null,m2Ms:Date.now()-t};
  }
  const plan=call.plan;
  times.push(totalMs);
  check(selected.every((x,i)=>x.id===ids[i]),'selection reason alignment');
  check(ids.join()=== (apply?plan.ids:call.historical).join(),'effective order');
  if(plan.before&&plan.after){
   for(const k of [...mod.HARD,...mod.SOFT])check(plan.after[k]<=plan.before[k],'metric regression '+k);
   check(!plan.changed||plan.scoreAfter<plan.scoreBefore,'strict gain');
  }else stats.unavailable++;
  if(plan.changed)stats.changed++;
  add(stats.before,plan.before);add(stats.after,plan.after);
  const before=detail(call.historical,byId,metadata,call.selected,plan.beforeReasons||[]),after=detail(plan.ids,byId,metadata,call.selected,plan.reasons);
  const roles=new Map(selected.map(x=>[x.id,x]));
  for(let i=0;i<deck.length;i++){
   const q=deck[i],m=metadata[q.id],o=outcome(q,s-1,seed,profile);
   first[m.concept]??=s;families.add(q.caseFamily||q.id);
   if(last[m.concept]&&last[m.concept]!==s)gaps[m.concept]=Math.max(gaps[m.concept]||0,s-last[m.concept]);
   last[m.concept]=s;
   firstTheme[q.theme]??=s;if(lastTheme[q.theme]&&lastTheme[q.theme]!==s)themeGaps[q.theme]=Math.max(themeGaps[q.theme]||0,s-lastTheme[q.theme]);lastTheme[q.theme]=s;
   difficulty[q.difficulty]=(difficulty[q.difficulty]||0)+1;
   check(api.record(state,q,o.result,i,null,o.help,false),'record '+s);
   if(s===1&&i===0){
    api.move(state,1);const snap=JSON.stringify(state.active),copy=api.load(JSON.parse(JSON.stringify(state)));
    check(api.start(copy,qs).map(x=>x.id).join()===ids.join()&&JSON.stringify(copy.active)===snap,'resume exact');
   }
  }
  check(api.finish(state,qs),'finish '+s);
  for(const t of fundamentals)if(lastTheme[t])fundamentalDebt+=Math.max(0,s-lastTheme[t]-6);
  rows.push({session:s,ids,selection:ids.map(id=>roles.get(id)),historical:call.historical,proposed:plan.ids,status:plan.status,metricsBefore:plan.before,metricsAfter:plan.after,contrastPairs:plan.contrastPairs||[],historicalMs:call.historicalMs,m2Ms:call.m2Ms,before,after});
  if(CHECKPOINTS.includes(s)||s===horizon)checkpoints.push({session:s,changed:stats.changed,before:{...stats.before},after:{...stats.after},families:families.size,first:{...first},maxGaps:{...gaps},difficulty:{...difficulty},firstTheme:{...firstTheme},themeGaps:{...themeGaps},fundamentalDebt,selectionP95:times.slice().sort((a,b)=>a-b)[Math.ceil(times.length*.95)-1]});
 }
 check(JSON.stringify(qs)===snapshot&&JSON.stringify(metadata)===metaSnapshot,'catalogue/meta mutated');
 return {profile,seed,horizon,apply,rows,checkpoints,stats,finalState:{skills:state.skills,micros:state.micros,axes:state.axes,entries:state.entries}};
}
function pair(sources,mod,profile,seed,horizon){
 const before=run(sources,mod,profile,seed,horizon,false),after=run(sources,mod,profile,seed,horizon,true);
 const comparison=before.rows.map((r,i)=>{
  const a=after.rows[i],sameSet=r.ids.slice().sort().join()===a.ids.slice().sort().join();
  return {session:r.session,sameSet,sameOrder:r.ids.join()===a.ids.join(),historicalIds:r.ids,candidateIds:a.ids};
 });
 const localRegressions=[];
 for(let i=0;i<horizon;i++){
  const b=before.rows[i],a=after.rows[i];
  for(const key of [...mod.HARD,...mod.SOFT]){
   const x=b.metricsBefore?.[key],y=a.metricsAfter?.[key];
   if(Number.isFinite(x)&&Number.isFinite(y)&&y>x)localRegressions.push({session:i+1,key,before:x,after:y,ids:a.ids,sameSet:comparison[i].sameSet,historicalCandidate:a.metricsBefore[key]});
  }
 }
 const actualComparison=before.checkpoints.map((b,i)=>{
  const a=after.checkpoints[i],delta=Object.fromEntries(Object.keys(b.before).map(k=>[k,(a.after[k]||0)-(b.before[k]||0)]));
  const review=[...mod.HARD,...mod.SOFT].filter(k=>delta[k]>0).map(k=>'order:'+k);
  if(a.families<b.families)review.push('families');
  if(a.fundamentalDebt>b.fundamentalDebt)review.push('fundamentalDebt');
  if(Object.keys(a.first).length<Object.keys(b.first).length)review.push('conceptCoverage');
  const changedSets=comparison.slice(0,b.session).filter(x=>!x.sameSet).length;
  if(changedSets)review.push('longitudinal-set-change');
  return {session:b.session,delta,changedSets,changedOrders:comparison.slice(0,b.session).filter(x=>!x.sameOrder).length,review};
 });
 return {base:BASE,profile,seed,horizon,before,after,comparison,actualComparison,localRegressions,changedSets:comparison.filter(r=>!r.sameSet).map(r=>r.session),changedOrders:comparison.filter(r=>!r.sameOrder).length};
}
function readable(r){
 const safe=x=>String(x??'').replace(/\|/g,'/').replace(/[\r\n]+/g,' ');
 const header='| Pos. | ID | Contexte / enchères | Main (P/C/K/T) | H | Bonne enchère | Concept / niveau | Rôle et justification |\n|---:|---|---|---|---:|---|---|---|';
 const table=qs=>[header,...qs.map(q=>'| '+[q.position,q.id,safe(q.context)+' / '+safe(q.auction.join(' ; ')),q.hand.map(c=>c.join(' ')).join(' / '),q.h,q.answer,q.concept+' / N'+q.difficulty,safe(q.role+' — '+q.reason)].join(' | ')+' |')].join('\n');
 const lines=['# Trajectoire réelle '+r.profile+' / graine '+r.seed,'Base '+r.base+'. Réponses synthétiques, aucune preuve humaine.','## S1–5'];
 for(let i=0;i<Math.min(5,r.horizon);i++){
  const b=r.before.rows[i],a=r.after.rows[i];
  lines.push('### Séance '+(i+1),'Avant : ordre historique réellement présenté.',table(b.before),'Après : ordre candidat réellement présenté.',table(a.after),'Même ensemble d’IDs : '+r.comparison[i].sameSet+'.');
 }
 lines.push('## Registre S1–'+r.horizon,'| Séance | IDs identiques | Ordre identique | Décision M2 locale |','|---:|---|---|---|');
 for(let i=0;i<r.horizon;i++){const c=r.comparison[i],a=r.after.rows[i];lines.push('| '+c.session+' | '+c.sameSet+' | '+c.sameOrder+' | '+a.status+' |');}
 return lines.join('\n')+'\n';
}
module.exports={BASE,PROFILES,SEEDS,prepare,run,pair,outcome,readable};
if(typeof require==='function'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.join(__dirname,'..'),mod=require('../quizz-coherence-m2-ordre.js');
 const read=p=>cp.execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const sources={'quizz.html':read('quizz.html')};
 const visit=p=>{if(Object.hasOwn(sources,p))return;sources[p]=read(p);for(const m of sources[p].matchAll(/require\(['"]\.\/([-\w]+\.js)['"]\)/g))visit(m[1]);};
 visit('quizz-parcours.js');
 const [profile='all',seed='all',h='180',dest='audits/coherence-concrete-20261126/m2/recette']=process.argv.slice(2),horizon=Number(h);
 check(PROFILES.includes(profile)||profile==='all','profile');check(seed==='all'||SEEDS.includes(Number(seed)),'seed');check(Number.isInteger(horizon)&&horizon>=1&&horizon<=180,'horizon');
 fs.mkdirSync(path.resolve(root,dest),{recursive:true});
 for(const p of profile==='all'?PROFILES:[profile])for(const n of seed==='all'?SEEDS:[Number(seed)]){
  const r=pair(sources,mod,p,n,horizon);
  fs.writeFileSync(path.resolve(root,dest,p+'-'+n+'-S'+horizon+'.json'),JSON.stringify(r));
  fs.writeFileSync(path.resolve(root,dest,p+'-'+n+'-S'+horizon+'.md'),readable(r));
  console.log(JSON.stringify({profile:p,seed:n,horizon,changedSets:r.changedSets,changedOrders:r.changedOrders,localRegressions:r.localRegressions,actualComparison:r.actualComparison,baseline:r.before.checkpoints,candidate:r.after.checkpoints}));
 }
}
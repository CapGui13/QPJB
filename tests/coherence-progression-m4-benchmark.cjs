'use strict';
// M4 : trois versions exactes, mêmes réponses par ID/séance/graine.
// Les tests exposent des fonctions privées en mémoire uniquement.
const BASE='2c6edd95c09a4e8073813f01bc976c31ed4649aa';
const PR376='897508d45cee29beacf8bedfa92ab73d58a8a140';
const PROFILES=['autonome','modere','faible','cible','aide','passe'];
const SEEDS=[11,47,103];
const check=(v,m)=>{if(!v)throw Error(m)};
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const family=q=>String(q.caseFamily||q.id);
function hash(x){let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296}
function outcome(q,s,seed,profile){
  const r=hash(q.id+'|'+s+'|'+seed);
  const rate=profile==='autonome'?0:profile==='modere'?.33:profile==='faible'?.8:
    profile==='cible'?(q.theme==='sa'?.9:.12):profile==='passe'?(openingPass(q)?1:0):.15;
  return {result:r<rate?'wrong':'correct',help:profile==='aide'&&hash('help|'+q.id+'|'+s+'|'+seed)<.72};
}
function load(source,req){const m={exports:{}};new Function('module','require',source)(m,req);return m.exports}
function make(source,meta,plan){
  const marker='return {eligibility,adaptiveDiagnostics,createForTests:';
  check(source.includes(marker),'instrumentation marker missing');
  return load(source.replace(marker,"return {logicalOrder,decisionPattern:typeof decisionPattern==='function'?decisionPattern:null,eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:"),n=>{
    if(n==='./quizz-prerequis.js')return meta;
    if(n==='./quizz-session-plan.js')return plan;
    throw Error('unexpected dependency '+n);
  });
}
function readCatalogue(html){const qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;check(qs.length===1879,'catalogue size');return qs}
function early(deck,s,legacy){
  const pp=deck.flatMap((q,i)=>openingPass(q)?[i+1]:[]);
  if(s===0){
    check(deck.every(q=>q.theme==='ouv'),'S1 openings only');
    check(pp.length===3&&pp.every((v,i)=>v<=[2,5,7][i]&&(!i||v-pp[i-1]>=2)),'S1 Passe');
    check(deck.filter(openingPass).every(q=>q.h<12&&q.difficulty===1),'S1 simple Passe');
    for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])check(deck.filter(q=>q.theme==='ouv'&&bid(q)===a).length>=n,'S1 '+a);
  }
  if(s===1){
    check(pp.length>=1&&pp.length<=2&&pp.every((v,i)=>v<=[4,7][i]&&(!i||v-pp[i-1]>=2)),'S2 Passe');
    check(deck.slice(0,2).every(q=>q.theme==='ouv'&&!openingPass(q)),'S2 opening');
    check(['1♣','1♦'].every(b=>deck.slice(0,2).some(q=>bid(q)===b)),'S2 two minor openings');
    check(deck.filter(q=>['mineur','majeur'].includes(q.theme)).length>=6,'S2 six responses');
    const fits=deck.flatMap((q,i)=>q.theme==='majeur'&&/^2[♥♠]$/.test(bid(q))?[i]:[]);
    check(fits.length>=2&&fits.every(i=>deck[i].shape[bid(deck[i])==='2♠'?0:1]===3),'S2 fit 5-3');
    const first=fits[0];
    const minors=deck.slice(0,first).filter(q=>q.theme==='mineur');
    check(minors.some(q=>/^1[♥♠]$/.test(bid(q)))&&minors.some(q=>bid(q)==='1SA'),'S2 introduire les deux décisions');
    if(legacy)check(first>Math.max(...deck.flatMap((q,i)=>q.theme==='mineur'?[i]:[])),'S2 historical order');
  }
  if(s===2)check(pp.length<=1,'S3 Passe');
}
function run(api,qs,meta,pattern,profile,seed,horizon,legacy=false){
  const state=api.empty(),byId=new Map(qs.map(q=>[q.id,q]));
  const out={exact:0,mirror:0,near:0,triples:0,abab:0,answerAbab:0,shape:0,force:0,
    kindTriples:0,conceptTriples:0,familyAdjacent:0,violations:0,legacyS2Incompatible:0,
    duplicateFamilies:0,reviewCount:0,dueWeakRecalled:0,dueWeakDelaySum:0};
  const trace=[],snapshots=[],lastConcept={},maxConceptGap={},lastTheme={},maxThemeGap={};
  const difficulty=[0,0,0,0,0],reasons={};const started=Date.now();
  for(let s=0;s<horizon;s++){
    const deck=api.start(state,qs),sel=state.active.selection;
    check(deck.length===10&&new Set(deck.map(q=>q.id)).size===10,'deck '+profile+'/'+seed+'/'+s);
    out.duplicateFamilies+=10-new Set(deck.map(family)).size;
    check(sel.every((x,i)=>x.id===deck[i].id),'motif/ID');
    const entries=sel.map(x=>[x.id,x.kind,x.reason].join('|')).sort();
    trace.push(entries);
    out.violations+=api.eligibilityBatch(deck,state,qs).filter(v=>!v.eligible).length;
    if(s<3)early(deck,s,legacy);
    if(s===1){
      const first=deck.findIndex(q=>q.theme==='majeur'&&/^2[♥♠]$/.test(bid(q)));
      out.legacyS2Incompatible=+(deck.slice(first+1).some(q=>q.theme==='mineur'));
    }
    const pat=deck.map(pattern),mixed=new Set(sel.map(x=>x.kind)).size>1;
    const concepts=deck.map(q=>meta.byId[q.id].concept);
    for(let i=0;i<deck.length;i++){
      const q=deck[i],a=deck[i-1],b=deck[i-2],c=deck[i-3];
      if(a){
        out.exact+=+(bid(q)===bid(a));out.mirror+=+(!!pat[i]&&pat[i]===pat[i-1]);
        out.shape+=+(Array.isArray(q.shape)&&Array.isArray(a.shape)&&q.shape.join()===a.shape.join());
        out.force+=+(Number.isInteger(q.h)&&q.h===a.h);out.familyAdjacent+=+(family(q)===family(a));
      }
      if(b){
        out.near+=+(!!pat[i]&&pat[i]===pat[i-2]);out.triples+=+(s>0&&q.theme===a.theme&&q.theme===b.theme);
        out.conceptTriples+=+(concepts[i]===concepts[i-1]&&concepts[i]===concepts[i-2]);
        out.kindTriples+=+(s>0&&mixed&&sel[i].kind===sel[i-1].kind&&sel[i].kind===sel[i-2].kind);
      }
      if(c){
        out.abab+=+(s>0&&q.theme===b.theme&&a.theme===c.theme&&q.theme!==a.theme);
        out.answerAbab+=+(bid(q)===bid(b)&&bid(a)===bid(c)&&bid(q)!==bid(a));
      }
      difficulty[q.difficulty-1]++;reasons[sel[i].reason]=(reasons[sel[i].reason]||0)+1;
      out.reviewCount+=+(sel[i].kind==='revision');
      const old=state.entries[q.id];
      if(old&&(old.result!=='correct'||old.assisted)&&old.due<=s){out.dueWeakRecalled++;out.dueWeakDelaySum+=s-old.lastSession}
      const {result,help}=outcome(q,s,seed,profile);
      check(api.record(state,q,result,i,null,help,false),'record');
    }
    for(const [values,last,gap] of [[new Set(concepts),lastConcept,maxConceptGap],[new Set(deck.map(q=>q.theme)),lastTheme,maxThemeGap]]){
      for(const x of values){if(Object.hasOwn(last,x))gap[x]=Math.max(gap[x]||0,s-last[x]);last[x]=s}
    }
    check(api.finish(state,qs),'finish');
    if([20,65,153].includes(s+1)||s+1===horizon){
      const ids=Object.keys(state.entries);
      snapshots.push({horizon:s+1,...out,ids:ids.length,
        families:new Set(Object.values(state.entries).map(x=>x.family)).size,
        concepts:new Set(ids.map(id=>meta.byId[id].concept)).size,topics:new Set(ids.map(id=>byId.get(id).theme)).size,
        difficulty:difficulty.slice(),reasons:{...reasons},maxConceptGap:{...maxConceptGap},maxThemeGap:{...maxThemeGap},ms:Date.now()-started});
    }
  }
  return {snapshots,trace};
}
function unit(api,qs,meta){
  const byId=new Map(qs.map(q=>[q.id,q])),pattern=api.decisionPattern;
  const black=qs.filter(q=>meta.byId[q.id].concept==='chelem.cles');
  const different=black.find(q=>bid(q)!==bid(black[0]));
  check(different&&pattern(black[0])!==pattern(different),'different Blackwood answers');
  check(pattern(byId.get('SEF-V45-013'))!==pattern(byId.get('SEF-V45-014')),'no artificial forcing suit mirror');
  const groups=new Map();
  for(const q of qs){const k=pattern(q);if(!k)continue;const a=groups.get(k)||[];a.push(q);groups.set(k,a)}
  const mirror=[...groups.values()].find(a=>a.length>=3&&new Set(a.map(family)).size>=2&&new Set(a.map(bid)).size>1);
  check(mirror,'real mirror fixture');
  const filler=qs.filter(q=>pattern(q)!==pattern(mirror[0])&&q.theme!==mirror[0].theme).slice(0,4);
  const items=[...mirror.slice(0,3),...filler].map((exercise,i)=>({exercise,kind:i%2?'revision':'nouveau',reason:'fixture-'+i}));
  const state={...api.empty(),completed:65};
  const snapshot=JSON.stringify(items);
  const a=api.logicalOrder(items,state),b=api.logicalOrder(items,state);
  check(a.every((v,i)=>v===b[i]),'deterministic order');
  check(a.length===items.length&&a.every(v=>items.includes(v))&&new Set(a).size===items.length,'permutation / motif');
  check(JSON.stringify(items)===snapshot,'no mutation');
  for(const n of [0,1,2,3])check(api.logicalOrder(items.slice(0,n),state).length===n,'small pool');
  const impossible=mirror.slice(0,3).map(exercise=>({exercise,target:'micro:fixture'}));
  check(api.logicalOrder(impossible,state).length===3,'impossible diversity not rejected');
  const st=api.empty(),deck=api.start(st,qs);api.record(st,deck[0],'correct',0,null,false,false);api.move(st,1);
  const before=JSON.stringify(st.active),resumed=api.load(JSON.parse(JSON.stringify(st)));
  check(api.start(resumed,qs).map(q=>q.id).join()===deck.map(q=>q.id).join(),'active order');
  check(JSON.stringify(resumed.active)===before,'active state');
  const twenty=qs.slice(0,20).map(exercise=>({exercise,kind:'nouveau',reason:'fixture'}));
  check(new Set(api.logicalOrder(twenty,state)).size===20,'API limit 20');
  const weak=api.empty();
  for(let s=0;s<3;s++){
    const d=api.start(weak,qs);
    for(let i=0;i<d.length;i++)check(api.record(weak,d[i],'wrong',i,null,false,false),'weak record');
    check(api.finish(weak,qs),'weak finish');
  }
  const plan=api.consolidationPlan(weak,qs);
  check(plan.available,'consolidation available after evidenced weakness');
  const focused=api.startConsolidation(weak,qs);
  check(focused.length>=4&&focused.length<=10&&new Set(focused.map(family)).size===focused.length,'consolidation families');
  check(weak.active.ids.join()===plan.items.map(x=>x.id).join()&&
    weak.active.targets.join()===plan.items.map(x=>x.target).join(),'consolidation targets/order');
  check(api.eligibilityBatch(focused,weak,qs).every(x=>x.eligible),'consolidation eligibility');
  for(let i=0;i<focused.length;i++)check(api.record(weak,focused[i],'correct',i,null,false,false),'focused record');
  check(api.finish(weak,qs)&&weak.completed===3,'consolidation not advancement');
  return {passed:true,mirrorExample:mirror.slice(0,3).map(q=>q.id),consolidationLength:focused.length};
}
function compare(runs){
  const result=runs[2].snapshots.map((c,i)=>{
    const a=runs[0].snapshots[i],b=runs[1].snapshots[i],n=c.horizon;
    const changed=(x,y)=>x.trace.slice(0,n).reduce((count,v,j)=>count+Number(v.join()!==y.trace[j].join()),0);
    const problems=[];
    if(c.violations||a.violations||b.violations)problems.push('eligibility');
    if(c.families<.95*a.families||c.families<.95*b.families)problems.push('families <95%');
    if(c.exact>b.exact||c.triples>b.triples)problems.push('exact/triples regression');
    if(c.duplicateFamilies>b.duplicateFamilies)problems.push('family duplicates');
    if(c.topics<b.topics||c.concepts<b.concepts)problems.push('coverage regression');
    if(c.mirror+c.near>b.mirror+b.near||c.abab>b.abab)problems.push('semantic variety regression');
    return {horizon:n,base:a,pr376:b,m4:c,changedSetsBase:changed(runs[0],runs[2]),changedSetsPR376:changed(runs[1],runs[2]),problems};
  });
  return result;
}
module.exports={BASE,PR376,PROFILES,SEEDS,load,make,readCatalogue,run,unit,compare};
if(require.main===module){
  const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
  const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
  const git=(ref,p)=>cp.execFileSync('git',['show',ref+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
  const html=read('quizz.html'),metaSource=read('quizz-prerequis.js'),planSource=read('quizz-session-plan.js');
  for(const ref of [BASE,PR376])for(const [p,v] of [['quizz.html',html],['quizz-prerequis.js',metaSource],['quizz-session-plan.js',planSource]])
    check(git(ref,p)===v,'non-order asset changed '+ref+' '+p);
  const qs=readCatalogue(html),meta=load(metaSource),plan=load(planSource);
  const engines=[git(BASE,'quizz-parcours.js'),git(PR376,'quizz-parcours.js'),read('quizz-parcours.js')].map(src=>make(src,meta,plan));
  console.log(JSON.stringify({unit:unit(engines[2],qs,meta)}));
  const args=process.argv.slice(2),profiles=args[0]?PROFILES.filter(p=>p===args[0]):PROFILES,
    seeds=args[1]?SEEDS.filter(s=>s===Number(args[1])):SEEDS,horizon=args[2]?Number(args[2]):153;
  check(profiles.length&&seeds.length&&[20,65,153].includes(horizon),'arguments: profile seed 20|65|153');
  let failed=false;
  for(const profile of profiles)for(const seed of seeds){
    const rows=compare(engines.map((engine,i)=>run(engine,qs,meta,engines[2].decisionPattern,profile,seed,horizon,i===0)));
    for(const row of rows){console.log(JSON.stringify({profile,seed,...row}));failed||=row.problems.length>0}
  }
  if(failed)process.exitCode=1;
}

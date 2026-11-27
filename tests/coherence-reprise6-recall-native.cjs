'use strict';
// Reprise6 D. Engine and catalogue are injected: same function runs under
// Node and a restricted JS isolate, no fake browser or mocked selector.
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'];
const SEEDS=[11,47,103],HORIZONS=[5,20,65,153,180];
const check=(x,m)=>{if(!x)throw Error(m)};
const copy=x=>JSON.parse(JSON.stringify(x));
const family=q=>String(q.caseFamily||q.id);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
const proof=s=>({skills:s.skills,micros:s.micros,axes:s.axes});
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296}
function response(profile,seed,s,q,m){
  const u=k=>hash([profile,seed,s,q.id,k].join('|'));
  const p={autonome:1,intermediaire:.67,faible:.22,cible:/^(red|second|intervenir|contre)\./.test(m.concept)?.22:.77,aide:.65,passe:m.concept==='ouv.passe'?.06:.85}[profile];
  const assisted=profile==='aide'&&u('help')<.7;
  const correct=assisted||u('correct')<p;
  return {result:correct?'correct':'wrong',choice:correct?q.answer:q.choices.find(c=>c!==q.answer),assisted,hadFreeError:false};
}
function early(deck,s){
  if(s>3)return [];
  const failures=[],pass=deck.map((q,i)=>q.theme==='ouv'&&q.answer==='Passe'?i+1:null).filter(Boolean);
  if(s===1){
    const deadlines=[2,5,7];
    if(deck.some(q=>q.theme!=='ouv'||q.difficulty!==1))failures.push('S1 ouvertures de base');
    if(pass.length!==3||pass.some((v,i)=>v>deadlines[i]||(i>0&&v-pass[i-1]<2))||deck.some(q=>q.theme==='ouv'&&q.answer==='Passe'&&q.h>=12))failures.push('S1 Passes');
    for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])if(deck.filter(q=>q.answer===a).length<n)failures.push('S1 '+a);
  }else{
    if((s===2&&(pass.length<1||pass.length>2))||(s===3&&pass.length>1))failures.push('Passe S'+s);
    if(pass.some((v,i)=>v>[4,7][i]||(i>0&&v-pass[i-1]<2)))failures.push('position Passe S'+s);
    const opener=q=>(q.auction?.[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠]))/)?.[1]||'';
    for(const q of deck){
      const o=opener(q);
      if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^[2-7][♣♦]$/.test(q.answer)&&q.answer[1]===o[1])failures.push('soutien mineur prématuré');
      if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&/^[2-7][♥♠]$/.test(q.answer)&&q.answer[1]===o[1]&&
        (q.answer[0]!=='2'||q.shape[o==='1♠'?0:1]!==3||q.auction.length!==1))failures.push('fit autre que 5–3 prématuré');
    }
    if(s===2){
      const openings=deck.filter(q=>q.theme==='ouv');
      if(!openings.some(q=>q.answer==='1♣'&&q.shape[2]===3&&q.shape[3]===3)||!openings.some(q=>q.answer==='1♦'&&q.shape[2]===4&&q.shape[3]===4))failures.push('S2 égalités mineures');
    }
  }
  return failures;
}

function run({api,exercises,meta,features,m6,policy,m2,m3,profile,seed,model='D',horizon=180,consolidate=true,clock=()=>{},capture=false,foundationRecall=false,digest=x=>String(hash(x))}){
 check(PROFILES.includes(profile)&&SEEDS.includes(seed)&&['D','M6'].includes(model),'matrix');
 check(exercises.length===1915&&new Set(Object.values(meta).map(m=>m.concept)).size===99,'catalogue');
 const opts={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
 const events=[],direct=[],sessions=[],checkpoints=[],last=new Map(),seen=new Set(),proofMap=new Map(),debt={},first={};
 const settings={...opts,...(policy?{coherenceAtomic:policy}:{}),observe:e=>events.push(e)};
 const stateBefore=JSON.stringify(exercises),metaBefore=JSON.stringify(meta);
 const core=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
 const byId=new Map(exercises.map(q=>[q.id,q]));let state=api.empty(),consolidations=0,resumes=0,near=0,nearRecent=0,hard=0,autonomous=0,wrong=0;
 const lastAnswered=new Map(),actualDebt={},recalls=[],guidedDigests=[];let extraAnswered=0;
 function guided(s){const o=copy(s);delete o.foundationRecalls;return o;}
 function snapshot(s){return JSON.stringify(canonical(guided(s)));}
 function actual(rows,s){for(const r of rows)if(['correct','wrong'].includes(r.result)&&core.includes(r.concept))lastAnswered.set(r.concept,s);}
 function answer(q,s){const a=model==='D'?response(profile,seed,s,q,meta[q.id]):m6.outcome(profile,seed,q,s);return {...a,choice:a.result==='correct'?q.answer:q.choices.find(c=>c!==q.answer)}}
 function play(deck,s,consolidation=false,isRecall=false){
  check(deck.length>=4&&deck.length<=10&&new Set(deck.map(q=>q.id)).size===deck.length&&new Set(deck.map(family)).size===deck.length,'deck structure');
  if(!consolidation){check(deck.length===10,'guided length');check(!early(deck,s).length,'early guards '+early(deck,s).join(';'));for(const q of deck)check(api.eligibility(q,state,exercises).eligible,'ineligible '+q.id);}
  else check(!state.active.orderReferenceIds&&!state.active.orderSkillBase,'consolidation order metadata');
  const before=copy(proof(state)),rows=[];
  for(const [i,q] of deck.entries()){
   const a=answer(q,consolidation?s+1000:s);
   check(api.record(state,q,a.result,i,a.choice,a.assisted,a.hadFreeError),'record '+q.id);
   rows.push({id:q.id,family:family(q),concept:meta[q.id].concept,difficulty:q.difficulty,answer:q.answer,h:q.h,shape:q.shape,auction:q.auction,reason:state.active.selection?.[i]?.reason||null,...a});
   if(i===2&&(consolidation||[1,2,3,5,20,65,153,180].includes(s))){
    api.move(state,3);const raw=copy(state.active),backup=api.exportProgress(state,exercises,{});
    const restored=api.importProgress(backup);check(same(restored.active,raw),'resume export exact');
    check(same(api.start(restored,exercises,settings).map(q=>q.id),deck.map(q=>q.id)),'resume deck');
    check(same(restored.active,raw),'resume unchanged');state=restored;resumes++;
   }
  }
  check(api.finish(state,exercises),'finish');
  const event=isRecall?state.foundationRecalls.at(-1):state.journal.at(-1);check(same(event.answers.map(a=>a.id),deck.map(q=>q.id)),'journal actual deck');
  if(isRecall)check(same(event.answers.map(a=>[a.result,a.choice,a.assisted,a.hadFreeError]),rows.map(a=>[a.result,a.choice,a.assisted,a.hadFreeError])),'separate journal responses');
  if(consolidation)check(same(proof(state),before),'consolidation invented mastery');
  return rows;
 }
 for(let s=1;s<=horizon;s++){
  clock((s-1)*86400000);
  const eventStart=events.length,prior=copy(state);
  const deck=api.start(state,exercises,settings);
  const candidates=events.slice(eventStart).filter(e=>e.atomicChoice);
  check(candidates.length<=1,'multiple substitutions');
  if(candidates.length){
   const e=candidates[0],a=e.atomicChoice,old=byId.get(a.oldId),q=byId.get(a.id),reference=api.start(prior,exercises,opts);
   check(a.mode==='T'&&s>=3&&s<=20,'out-of-scope substitution');
   check(reference.some(x=>x.id===old.id)&&deck.some(x=>x.id===q.id)&&!deck.some(x=>x.id===old.id),'event not reflected in deck');
   check(same(reference.filter(x=>x.id!==old.id).map(x=>x.id).sort(),deck.filter(x=>x.id!==q.id).map(x=>x.id).sort()),'more than one replacement');
   check(old.answer===q.answer&&family(old)===family(q)&&same(meta[old.id],meta[q.id])&&same(old.auction,q.auction)&&old.difficulty===q.difficulty,'lost contrast/stratum');
   direct.push({session:s,event:a,before:reference.map(x=>x.id),after:deck.map(x=>x.id),old:{id:old.id,hand:old.hand,h:old.h,shape:old.shape,auction:old.auction,answer:old.answer},next:{id:q.id,hand:q.hand,h:q.h,shape:q.shape,auction:q.auction,answer:q.answer}});
  }
  const rows=play(deck,s),nearKeys=deck.map(q=>features(q,meta[q.id])?.near);actual(rows,s);
  for(let i=0;i<rows.length;i++){
   const r=rows[i],key=nearKeys[i];if(key){for(let j=0;j<i;j++)near+=+(nearKeys[j]===key);nearRecent+=+(last.has('near:'+key)&&s-last.get('near:'+key)>0&&s-last.get('near:'+key)<=2);last.set('near:'+key,s);}
   last.set(r.concept,s);if(!Object.hasOwn(first,r.concept))first[r.concept]=s;seen.add(r.family);hard+=+(r.difficulty>=4);wrong+=+(r.result==='wrong');
   if(r.result==='correct'&&!r.assisted&&!r.hadFreeError){autonomous++;const v=proofMap.get(r.concept)||{f:new Set(),s:new Set()};v.f.add(r.family);v.s.add(s);proofMap.set(r.concept,v);}
  }
  for(const c of core)if(last.has(c))debt[c]=(debt[c]||0)+Math.max(0,s-last.get(c)-6);
  if(capture)sessions.push({session:s,rows});
  if(consolidate&&s%3===0){
   const beforePlan=copy(state),normal=api.consolidationPlan(state,exercises,10),plan=api.consolidationPlan(state,exercises,10,{foundationRecall});
   check(same(state,beforePlan),'planning mutated state');
   if(normal.available||normal.reason!=='no-evidenced-weakness')check(same(normal,plan),'native remediation changed');
   if(plan.available){
    const isRecall=plan.reason==='foundation-recall';
    const assessmentBefore=Object.fromEntries(Object.entries(state.entries).map(([id,r])=>[id,r.assessment]));
    const deck=api.startConsolidation(state,exercises,{foundationRecall});check(same(deck.map(q=>q.id),plan.items.map(x=>x.id)),'consolidation plan divergence');
    if(isRecall){check(foundationRecall&&s>=65&&!normal.available&&normal.reason==='no-evidenced-weakness','recall must be supplementary');check(deck.length>=4&&deck.length<=6&&new Set(deck.map(q=>meta[q.id].concept)).size===deck.length,'recall scope');for(const q of deck){check(core.includes(meta[q.id].concept)&&s-lastAnswered.get(meta[q.id].concept)>=10,'recall not due');check(api.eligibility(q,state,exercises).eligible,'recall eligibility');check(assessmentBefore[q.id]?.result==='correct'&&!assessmentBefore[q.id].assisted,'recall no prior assessment');}check(state.active.targets.every(x=>x==='foundation:recall'),'recall labels');}
    const before=events.length,rows=play(deck,s,true,isRecall);check(events.length===before,'T invoked during consolidation');
    check(state.completed===s,'consolidation advanced parcours');actual(rows,s);
    if(isRecall){
     check(same(guided(state),guided(beforePlan)),'isolated recall changed guided state');
     const saved=api.importProgress(api.exportProgress(state,exercises,{}));
     check(same(saved,state),'complete supplemental backup roundtrip');
     check(!api.consolidationPlan(saved,exercises,10,{foundationRecall:true}).available,'same-session recall repeated');
     extraAnswered+=rows.filter(r=>r.result!=='skipped').length;recalls.push({session:s,rows});
    }else{
     consolidations++;if(capture)sessions.at(-1).consolidation=rows;
    }
   }
  }
  guidedDigests.push(digest(snapshot(state)));
  for(const c of core)if(lastAnswered.has(c))actualDebt[c]=(actualDebt[c]||0)+Math.max(0,s-lastAnswered.get(c)-6);
  if(HORIZONS.includes(s)||s===horizon)checkpoints.push({session:s,near,nearRecent,hard,autonomous,wrong,families:seen.size,debt:{...debt},debtTotal:Object.values(debt).reduce((a,b)=>a+b,0),actualDebt:{...actualDebt},actualDebtTotal:Object.values(actualDebt).reduce((a,b)=>a+b,0),extraAnswered,proof:[...proofMap].filter(([,v])=>v.f.size>=2&&v.s.size>=2).map(([c])=>c).sort(),first:{...first},consolidations,resumes});
 }
 check(JSON.stringify(exercises)===stateBefore&&JSON.stringify(meta)===metaBefore,'catalogue or metadata mutation');
 return {model,profile,seed,horizon,consolidate,checkpoints,direct,consolidations,resumes,sessions,recalls,extraAnswered,guidedDigests};
}
module.exports={run,PROFILES,SEEDS,HORIZONS};

'use strict';
// M4-B #447: experiment N. Never activate without an explicit M1 arbitration.
// No change to eligibility, native priorities, error recalls, or final ordering.
const {CORE,evidence,stats}=require('./quizz-coherence-m4p-b-policy.js');
const core=new Set(CORE),fam=q=>String(q.caseFamily||q.id),concept=(ctx,q)=>ctx.metadataById[q.id]?.concept;
function recentLongRecall(ctx){
 const last=new Map(),byId=new Map(ctx.exercises.map(q=>[q.id,q]));
 for(const j of (ctx.history.journal||[]).filter(j=>j.mode==='parcours').slice().sort((a,b)=>a.session-b.session)){
  const cs=new Set(j.answers.map(a=>concept(ctx,byId.get(a.id))));
  for(const c of cs)if(core.has(c)&&last.has(c)&&j.session-last.get(c)>=18&&j.session>=ctx.session-3)return true;
  for(const c of cs)last.set(c,j.session);
 }
 return false;
}
function replace(ctx,deck,slots){
 const no={deck};
 if(ctx.objective?.allowRepeatBeyondBudget!==true||ctx.objective?.allowNoveltyDisplacement!==true||
    ctx.session<66||ctx.session>180||ctx.history?.active||deck.length!==10)return no;
 const ev=evidence(ctx);if(!ev.stable||recentLongRecall(ctx))return no;
 const counts=(d,key)=>{const a=new Map();for(const v of d){const k=key(v.exercise);a.set(k,(a.get(k)||0)+1);}return a;};
 const max=(d,key)=>Math.max(0,...counts(d,key).values());
 const repeats=d=>d.filter(v=>!ctx.novelFamily(v.exercise)).length;
 const passes=d=>d.filter(v=>ctx.openingPass(v.exercise)).length;
 const baselineRepeat=repeats(deck),baseThemes=counts(deck,q=>q.theme);
 const debt=g=>Array.from({length:7},(_,i)=>Math.max(0,g+i-6)).reduce((a,b)=>a+b,0);
 if(counts(deck,q=>q.id).size!==10||counts(deck,fam).size!==10)return no;
 let best=null;
 for(const {index,baseline:old,category} of slots){
  if(deck[index]?.exercise!==old||!['maintenance','discovery'].includes(category)||ctx.bad(old)||ctx.due(old)||ctx.weak(old))continue;
  const c=concept(ctx,old),p=stats(ev,c,ctx.session),rest=deck.filter((_,i)=>i!==index);
  if(!p||p.proofFamilies<3||p.proofSessions<3||ctx.session-p.lastSuccess>5||p.lastError>=p.lastSuccess)continue;
  const rc=new Set(rest.map(v=>concept(ctx,v.exercise))),rf=new Set(rest.map(v=>fam(v.exercise))),ri=new Set(rest.map(v=>v.exercise.id));
  const retained=rc.has(c);
  if(!retained&&(core.has(c)||p.gap>5))continue;
  const cost=retained?0:debt(p.gap)-debt(0);
  for(const q of ctx.pool){
   const t=concept(ctx,q),v=stats(ev,t,ctx.session);
   if(!core.has(t)||!v||v.gap<18||!v.lastSuccess||v.lastError>=v.lastSuccess||rc.has(t)||t===c||ri.has(q.id)||rf.has(fam(q))||
      q.difficulty>3||q.difficulty>old.difficulty||q.difficulty>ctx.localTarget(q)||ctx.metadataById[q.id].stage>1||
      ctx.classify(q)!=='maintenance'||ctx.bad(q)||ctx.weak(q))continue;
   const fg=ctx.session-(ev.families.get(fam(q))||0);
   if(ev.families.has(fam(q))&&fg<12)continue;
   if(q.theme!==old.theme&&!rest.some(x=>x.exercise.theme===old.theme)&&ctx.oldTheme(old)>4)continue;
   const proposed=deck.map((x,i)=>i===index?{...x,exercise:q,kind:'revision',reason:ctx.fresh(q)?'rappel_nouvelle_situation':'rappel_question'}:x);
   const repeatAfter=repeats(proposed);
   if(repeatAfter>baselineRepeat+1||passes(proposed)>Math.max(passes(deck),ctx.passCap)||
      max(proposed,ctx.bid)>max(deck,ctx.bid)||max(proposed,ctx.context)>max(deck,ctx.context)||
      (counts(proposed,x=>x.theme).get(q.theme)||0)>Math.max(4,baseThemes.get(q.theme)||0))continue;
   const gain=debt(v.gap)-debt(0)-cost;
   if(gain<70)continue;
   const noveltyCost=Number(ctx.novelFamily(old)&&!ctx.novelFamily(q));
   const score=gain-20*noveltyCost+12*Number(retained)+Math.min(fg,30);
   const entry={deck:proposed,q,old,index,category,target:{...v,concept:t,familyGap:fg},displaced:{...p,concept:c,retained},repeatBefore:baselineRepeat,repeatAfter,noveltyCost,forecastGain:gain,forecastCost:cost,score};
   if(!best||score>best.score||(score===best.score&&(q.id+'|'+old.id)<(best.q.id+'|'+best.old.id)))best=entry;
  }
 }
 return best||no;
}
module.exports={replace,recentLongRecall};

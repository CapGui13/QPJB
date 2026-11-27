'use strict';
// K #423: proof-aware replacement of one discretionary maintenance slot.
// Explicit repeat-budget exception is a coordinator fixture, never production.
function provenRecently(ctx,old){
 const c=ctx.metadataById[old.id]?.concept, byId=new Map(ctx.exercises.map(q=>[q.id,q]));
 const sessions=new Set(),families=new Set();let last=0;
 for(const ev of ctx.history?.journal||[]){
  if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session<ctx.session-12||ev.session>=ctx.session)continue;
  for(const a of ev.answers||[]){
   if(ctx.metadataById[a.id]?.concept!==c)continue;
   if(a.result!=='correct'||a.assisted!==false||a.hadFreeError!==false)return false;
   const q=byId.get(a.id);if(!q)return false;
   sessions.add(ev.session);families.add(String(q.caseFamily||q.id));last=Math.max(last,ev.session);
  }
 }
 return sessions.size>=2&&families.size>=2&&ctx.session-last<=6;
}
function replace(selected,slots,ctx,reservation){
 if(ctx.session<66||selected.length!==10||ctx.history?.active)return selected;
 const family=q=>String(q.caseFamily||q.id),meta=ctx.metadataById,core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 if(new Set(selected.map(v=>v.exercise.id)).size!==10||new Set(selected.map(v=>family(v.exercise))).size!==10)return selected;
 function maxCount(deck,key){const counts=new Map();for(const v of deck){const k=key(v.exercise);counts.set(k,(counts.get(k)||0)+1)}return Math.max(0,...counts.values())}
 const baseBid=maxCount(selected,ctx.bid),baseContext=maxCount(selected,ctx.context);
 const repeats=selected.filter(v=>!ctx.novelFamily(v.exercise)).length;
 const basePass=selected.filter(v=>ctx.openingPass(v.exercise)).length;
 let best=null;
 for(const {index,baseline:old} of slots){
  if(selected[index]?.exercise!==old||selected[index].reason!=='rappel_nouvelle_situation'&&selected[index].reason!=='rappel_question')continue;
  if(core.has(meta[old.id]?.concept)||!provenRecently(ctx,old))continue;
  const rest=selected.filter((_,i)=>i!==index);
  const candidates=ctx.pool.filter(q=>q.theme===old.theme&&q.difficulty===old.difficulty&&meta[q.id]?.stage<=meta[old.id]?.stage&&
   core.has(meta[q.id]?.concept)&&ctx.seen(q)&&ctx.classify(q)==='maintenance'&&!ctx.bad(q));
  const plans=reservation.plan({...ctx,category:'maintenance',candidates,selected:rest,objective:{allowReservedMaintenance:true,allowRepeatBeyondBudget:true,guardStableAutonomy:true,concepts:[...core]}});
  const byId=new Map(candidates.map(q=>[q.id,q]));
  for(let pi=0;pi<plans.length;pi++)for(let ri=0;ri<plans[pi].ids.length;ri++){
   const p=plans[pi],q=byId.get(p.ids[ri]);if(!q||q.id===old.id||rest.some(v=>v.exercise.id===q.id||family(v.exercise)===family(q)))continue;
   const deck=selected.map((v,i)=>i===index?{...v,exercise:q,kind:'revision',reason:ctx.fresh(q)?'rappel_nouvelle_situation':'rappel_question'}:v);
   if(deck.filter(v=>ctx.openingPass(v.exercise)).length>Math.max(basePass,ctx.passCap)||
      deck.filter(v=>!ctx.novelFamily(v.exercise)).length>Math.max(ctx.repeatBudget,repeats)+1||
      maxCount(deck,ctx.bid)>baseBid||maxCount(deck,ctx.context)>baseContext)continue;
   const gap=ctx.oldConcept(q);if(!best||gap>best.gap||(gap===best.gap&&(pi<best.pi||(pi===best.pi&&ri<best.ri))))best={index,old,q,deck,gap,pi,ri,reason:p.reasons[q.id]};
   break;
  }
 }
 if(!best)return selected;
 reservation.record({session:ctx.session,kind:'reservation',policy:'K',before:best.old.id,after:best.q.id,concept:meta[best.q.id].concept,displacedConcept:meta[best.old.id].concept,reason:best.reason+' ; rappel sortant déjà réussi sur deux familles et deux séances récentes',category:'maintenance',priority:false});
 return best.deck;
}
function instrument(source){
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [start,anchor,end])if(source.split(a).length!==2)throw Error('Ancre K modifiée');
 return source.replace(start,start+'\n    const __m4KSlots=[];').replace(anchor,`
      if(s>=65&&!explicitRecall&&!priority&&!forcedReason&&category==='maintenance'&&classify(q)==='maintenance'&&!bad(q)&&!due(q)&&!e.weakConcept[mOf(q).concept])__m4KSlots.push({index:selected.length,baseline:q});
      ${anchor}`).replace(end,`
      const __m4KFinal=(function(){const provenRecently=${provenRecently.toString()};return (${replace.toString()})(selected,__m4KSlots,{session:s+1,history:state,exercises,metadataById:prerequis.byId,pool,seen:q=>e.seen.has(mOf(q).concept),classify,bad,bid,context,novelFamily,openingPass,passCap,repeatBudget,oldConcept,fresh},__m4Reserve)})();
      return logicalOrder(__m4KFinal,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
module.exports={provenRecently,replace,instrument};

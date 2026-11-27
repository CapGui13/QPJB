'use strict';
const rank=require('../quizz-coherence-m4p-a-composition.js').rank;
function finish(selected,slots,common,pick){
 const family=q=>String(q.caseFamily||q.id);
 if(common.session<3||common.session>20||selected.length!==10||new Set(selected.map(v=>family(v.exercise))).size!==10)return selected;
 // The last matching native slot is considered first; earlier discovery and
 // priority placements stay intact. All alternatives passed native filters.
 for(const slot of (common.session<6?slots:slots.slice().reverse())){
  const i=slot.index,old=selected[i]?.exercise;
  if(old!==slot.baseline||selected[i].reason!=='nouveau_qcm')continue;
  const rest=selected.filter((_,j)=>i!==j),usedIds=new Set(rest.map(x=>x.exercise.id)),usedFam=new Set(rest.map(x=>family(x.exercise)));
  const rows=slot.rows.filter(r=>r.q===old||!usedIds.has(r.q.id)&&!usedFam.has(family(r.q)));
  const q=pick({...common,selected:rest,category:slot.category,priority:slot.priority,forcedReason:null},rows,old);
  if(q!==old&&rows.some(r=>r.q===q))return selected.map((x,j)=>j===i?{...x,exercise:q}:x);
 }
 return selected;
}
function instrument(source){
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [start,anchor,end])if(source.split(a).length!==2)throw Error('Ancre M4P-A composition modifiée');
 return source.replace(start,start+'\n    const __compositionSlots=[];').replace(anchor,`
      if(s>=2&&s<20&&!explicitRecall&&!priority&&!forcedReason&&category==='discovery'&&fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){
       const winner=ranked.find(r=>r.q===q);
       const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,v.difficulty,context(v),bid(v),microKey(v),axisKey(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);
       const rows=ranked.filter(r=>s<5?key(r.q)===key(q)&&r.v===winner.v:fresh(r.q)&&novelFamily(r.q)&&!due(r.q)&&!bad(r.q)&&classify(r.q)==='discovery'&&r.q.difficulty===q.difficulty&&!openingPass(r.q)&&winner.v-r.v<=48);
       if(rows.length>1)__compositionSlots.push({index:selected.length,baseline:q,rows,category,priority});
      }
      ${anchor}`).replace(end,`
      const __compositionDeck=(${finish.toString()})(selected,__compositionSlots,{session:s+1,history:state,exercises,metadataById:prerequis.byId},__m4Pick);
      return logicalOrder(__compositionDeck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
function pick(ctx,rows,old,maxSession=20,onChange=()=>{},policy='U'){
 if(ctx.session>Math.min(20,maxSession))return old;
 const scores=Object.fromEntries(rows.map(r=>[r.q.id,r.v]));
 const signals=rank({...ctx,candidates:rows.map(r=>r.q),baselineId:old.id,policy,scores});
 for(const signal of signals){
  const row=rows.find(r=>r.q.id===signal.id);if(!row||row.q===old)continue;
  onChange({session:ctx.session,before:old.id,after:row.q.id,baseScore:scores[old.id],newScore:row.v,category:ctx.category,priority:ctx.priority,...signal});
  return row.q;
 }
 return old;
}
module.exports={instrument,pick,finish};

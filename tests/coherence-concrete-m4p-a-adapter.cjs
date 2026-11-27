'use strict';
const rank=require('../quizz-coherence-m4p-a-rank.js').rank;
const family=q=>String(q.caseFamily||q.id);
function finish(selected,slots,common,pick){
 const family=q=>String(q.caseFamily||q.id);
 if(common.session<3||common.session>20||selected.length!==10||
 new Set(selected.map(v=>v.exercise.id)).size!==10||new Set(selected.map(v=>family(v.exercise))).size!==10)return selected;
 const options=[];
 for(const slot of slots){
  const i=slot.index,old=selected[i]?.exercise;
  if(old!==slot.baseline||!['nouveau_qcm','rappel_nouvelle_situation'].includes(selected[i].reason))continue;
  const rest=selected.filter((_,j)=>i!==j),usedIds=new Set(rest.map(v=>v.exercise.id)),usedFam=new Set(rest.map(v=>family(v.exercise)));
  const rows=slot.rows.filter(r=>r.q===old||!usedIds.has(r.q.id)&&!usedFam.has(family(r.q)));
  if(rows.length<2)continue;
  const ctx={...common,selected:rest,category:slot.category,priority:slot.priority,forcedReason:null,preview:true};
  const q=pick(ctx,rows,old);
  if(q!==old&&rows.some(r=>r.q===q))options.push({i,ctx,rows,old,q});
 }
 // One atomic substitution maximum; never change the other nine items or
 // the native final ordering algorithm. Deterministic native slot order.
 if(!options.length)return selected;
 const {i,ctx,rows,old}=options[0],q=pick({...ctx,preview:false},rows,old);
 if(q===old||!rows.some(r=>r.q===q))return selected;
 return selected.map((v,j)=>j===i?{...v,exercise:q}:v);
}
function instrument(source){
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [start,anchor,end])if(source.split(a).length!==2)throw Error('Ancre M4P-A modifiée');
 return source.replace(start,start+'\n    const __m4pASlots=[];').replace(anchor,`
      if(s>=2&&s<20&&!explicitRecall&&!forcedReason&&['discovery','maintenance'].includes(category)&&fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){
       const winner=ranked.find(r=>r.q===q);
       // Native scoring, learning axes, role, prerequisites and novelty unchanged.
       const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,v.difficulty,context(v),bid(v),microKey(v),axisKey(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);
       const rows=ranked.filter(r=>key(r.q)===key(q)&&r.v===winner.v);
       if(rows.length>1)__m4pASlots.push({index:selected.length,baseline:q,rows,category,priority});
      }
      ${anchor}`).replace(end,`
      const __m4pADeck=(${finish.toString()})(selected,__m4pASlots,{session:s+1,history:state,exercises,metadataById:prerequis.byId},__m4Pick);
      return logicalOrder(__m4pADeck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
function pick(ctx,rows,old,maxSession=20,onChange=()=>{},policy='L'){
 if(ctx.session>Math.min(20,maxSession))return old;
 const b=rows.find(r=>r.q===old);if(!b)return old;
 const signals=rank({...ctx,candidates:rows.map(r=>r.q),baselineId:old.id,policy});
 for(const signal of signals){
  const row=rows.find(r=>r.q.id===signal.id&&r.v===b.v);
  if(!row||row.q===old)continue;
  if(!ctx.preview)onChange({session:ctx.session,before:old.id,after:row.q.id,baseScore:b.v,newScore:row.v,category:ctx.category,priority:ctx.priority,...signal});
  return row.q;
 }
 return old;
}
module.exports={instrument,pick,finish};

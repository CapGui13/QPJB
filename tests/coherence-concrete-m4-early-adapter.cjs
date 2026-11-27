'use strict';
// Capture already filtered native alternatives and act once at the end of
// the deck; never alter concept counts, level, priority or the ordering function.
function finish(selected,slots,common,pick){
 if(!Array.isArray(selected)||selected.length!==10)return selected;
 const family=q=>String(q.caseFamily||q.id);
 if(new Set(selected.map(v=>v.exercise.id)).size!==10||new Set(selected.map(v=>family(v.exercise))).size!==10)return selected;
 for(const slot of slots){
  const i=slot.index,old=selected[i]?.exercise;
  if(old!==slot.baseline||selected[i].kind!=='nouveau'||selected[i].reason!=='nouveau_qcm')continue;
  const rest=selected.filter((_,j)=>i!==j),usedIds=new Set(rest.map(v=>v.exercise.id)),usedFam=new Set(rest.map(v=>family(v.exercise)));
  const rows=slot.rows.filter(r=>r.q===old||!usedIds.has(r.q.id)&&!usedFam.has(family(r.q)));
  if(rows.length<2)continue;
  const q=pick({...common,selected:rest,category:'discovery',priority:false,forcedReason:null},rows,old);
  if(q!==old&&rows.some(r=>r.q===q))return selected.map((v,j)=>j===i?{...v,exercise:q}:v);
 }
 return selected;
}
function instrument(source){
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [start,anchor,end])if(source.split(a).length!==2)throw Error('Ancre J modifiée');
 return source.replace(start,start+'\n    const __m4JSlots=[];').replace(anchor,`
      if(s>=2&&s<5&&!explicitRecall&&!priority&&!forcedReason&&category==='discovery'&&fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){
       const winner=ranked.find(r=>r.q===q);
       const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,v.difficulty,context(v),classify(v),fresh(v),novelFamily(v),!!due(v),!!bad(v)]);
       const rows=ranked.filter(r=>key(r.q)===key(q)&&r.v>=winner.v-24&&r.v<=winner.v);
       if(rows.length>1)__m4JSlots.push({index:selected.length,baseline:q,rows});
      }
      ${anchor}`).replace(end,`
      const __m4Final=(${finish.toString()})(selected,__m4JSlots,{session:s+1,history:state,exercises,metadataById:prerequis.byId},__m4Pick);
      return logicalOrder(__m4Final,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
module.exports={instrument,finish};

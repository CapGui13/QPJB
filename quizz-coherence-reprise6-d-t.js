/* Reprise 6 D — T seule. Extrait du choix atomique #505, sans autre politique.
 * La logique T est inchangée; aucune activation par ce fichier. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m4p-a-rank.js'));
 else root.QPJBReprise6D=factory(root.QPJB_M4P_A);
})(typeof window==='undefined'?globalThis:window,function(T){
'use strict';
const schema='QPJB_COORDINATOR_ATOMIC_V1';
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const family=q=>String(q.caseFamily||q.id);
const c=(ctx,q)=>ctx.metadataById[q.id]?.concept;
function choose(ctx){
 const mode='T';
 const {session:s,history:h,selected,slots}=ctx;
 if(!Number.isInteger(s)||s<3||s>65||h?.active||selected.length!==10)return null;
 const rows=(h.journal||[]).filter(r=>r.mode==='parcours'&&r.session<s&&r.answers?.length===10);
 const recent=rows.filter(r=>r.session>=s-2);
 const autonomous=recent.length===2&&new Set(recent.map(r=>r.session)).size===2&&recent.every(r=>r.answers.every(clean));
 const exposed=new Set(rows.flatMap(r=>r.answers.map(a=>a.id)));
 const proposals=[];
 for(const slot of slots){
  const old=selected[slot.index]?.exercise;
  if(!old||old!==slot.baseline||!['nouveau_qcm','rappel_nouvelle_situation'].includes(selected[slot.index].reason))continue;
  const rest=selected.filter((_,i)=>i!==slot.index),used=new Set(rest.map(v=>family(v.exercise)));
  const base=slot.rows.find(x=>x.q===old);if(!base)continue;
  const rows=slot.rows.filter(x=>x.q===old||!used.has(family(x.q))&&!rest.some(v=>v.exercise.id===x.q.id));
  const emit=(x,reason,gain)=>proposals.push({index:slot.index,id:x.q.id,oldId:old.id,concept:c(ctx,x.q),oldConcept:c(ctx,old),cost:base.v-x.v,reason,gain,mode});
  if(mode==='T'&&s<=20&&T){
   const ranked=T.rank({...ctx,category:slot.category,priority:slot.priority,baselineId:old.id,selected:rest,candidates:rows.filter(x=>x.key===base.key&&x.v===base.v).map(x=>x.q),policy:'T'});
   for(const v of ranked){const x=rows.find(x=>x.q.id===v.id&&x.key===base.key&&x.v===base.v);if(x)emit(x,v.reason,v.localGain+v.recentGain)}
   continue;
  }
 }
 return proposals.sort((a,b)=>b.gain-a.gain||a.cost-b.cost||a.index-b.index||a.id.localeCompare(b.id))[0]||null;
}

return Object.freeze({schema,mode:'T',choose});
});

/* #419 — complete-deck alternatives. Every candidate originated in a real
 * filtered slot. One substitution maximum, all other IDs left unchanged.
 * Candidate policies are distinct and never enabled by the site.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-curriculum.js'),require('./quizz-coherence-m3-prerequis.js'),require('./quizz-coherence-m4p-a-rank.js'));else root.QPJBCoordinatorAtomic=factory(root.QPJBCoherenceCurriculum,root.QPJB_COHERENCE_M3,root.QPJB_M4P_A);})(typeof window==='undefined'?globalThis:window,function(M1,M3,T){
'use strict';
const schema='QPJB_COORDINATOR_ATOMIC_V1';
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const family=q=>String(q.caseFamily||q.id);
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const c=(ctx,q)=>ctx.metadataById[q.id]?.concept;
const key=(ctx,q)=>{const m=ctx.metadataById[q.id];return JSON.stringify([m.stage,m.minSession,m.requires])};
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
function support(q){
 const o=String(q.auction?.[0]||'').match(/:\s*(1[♥♠])/);
 return !!o&&q.theme==='majeur'&&q.auction.length===1&&bid(q)==='2'+o[1][1]&&q.shape?.[o[1][1]==='♠'?0:1]===3;
}
function choose(ctx,mode){
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
  if(slot.category!=='discovery')continue;
  if(mode==='M3'){
   for(const [simple,complex,reason] of [[M3.TEXAS_ELEMENTARY,M3.TEXAS,'premier-texas-elementaire'],[M3.STAYMAN_SIMPLE,M3.STAYMAN_FOURTH,'premiere-reponse-stayman-simple']]){
    if(!complex.includes(old.id)||simple.some(id=>exposed.has(id)||rest.some(v=>v.exercise.id===id)))continue;
    for(const x of rows){
     if(!simple.includes(x.q.id)||x.q.theme!==old.theme||c(ctx,x.q)!==c(ctx,old)||x.q.difficulty!==old.difficulty||
        bid(x.q)!==bid(old)||key(ctx,x.q)!==key(ctx,old)||x.v!==base.v)continue;
     emit(x,reason,1);
    }
   }
   continue;
  }
  if(mode==='M1'&&s<=5&&autonomous){
   const p=M1.curriculum[s-1],chosen=rest.map(v=>v.exercise),m=ctx.metadataById[old.id],oc=c(ctx,old);
   if(p.primary.includes(oc)||!chosen.some(q=>c(ctx,q)===oc)||core.has(oc)||
      chosen.filter(q=>p.primary.includes(c(ctx,q))).length>=p.target||
      s===3&&chosen.some(support))continue;
   for(const x of rows){
    const q=x.q,n=ctx.metadataById[q.id];if(q===old||!p.primary.includes(c(ctx,q))||
      q.theme!==old.theme||q.difficulty!==old.difficulty||n.stage>m.stage||
      base.v-x.v<0||base.v-x.v>32||s===3&&!support(q))continue;
    emit(x,'objectif-principal-manquant-donneur-deja-represente',1);
   }
  }
 }
 return proposals.sort((a,b)=>b.gain-a.gain||a.cost-b.cost||a.index-b.index||a.id.localeCompare(b.id))[0]||null;
}
const make=mode=>Object.freeze({schema,mode,choose:ctx=>choose(ctx,mode)});
return Object.freeze({M1:make('M1'),M3:make('M3'),T:make('T')});
});

/* #423 — variante B : changer la décision dans une strate pédagogique, pas seulement la main. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./quizz-coherence-m4-diversite.js'):root.QPJBCoherenceM4);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4Contrast=api;
})(typeof window==='undefined'?null:window,function(base){
 'use strict';
 function rank(ctx={}){
  if(!ctx||!Array.isArray(ctx.candidates)||ctx.history?.active||ctx.forcedReason==='rappel_erreur_aide')return [];
  const preliminary=base.rank(ctx),byId=new Map(preliminary.map(r=>[r.id,r]));
  const meta=ctx.metadataById||{},selected=(ctx.selected||[]).map(v=>v?.exercise||v).filter(Boolean);
  const chosen=selected.map(q=>({concept:meta[q.id]?.concept,f:base.features(q,meta[q.id])})).filter(x=>x.f);
  const out=[],seen=new Set();
  for(const q of ctx.candidates){
   const f=base.features(q,meta[q?.id]),old=byId.get(q?.id);
   if(!f||!old||seen.has(q.id))continue;seen.add(q.id);
   const sameConcept=chosen.filter(x=>x.concept===meta[q.id].concept);
   const same=sameConcept.filter(x=>x.f.decision===f.decision);
   const near=same.some(x=>x.f.near===f.near);
   const weak=ctx.category==='weakness',forced=ctx.priority===true||ctx.forcedReason==='equilibre_ouvertures';
   // Ne pas substituer une autre règle à un rappel de lacune. Dans les slots
   // imposés (dont les trois Passes de S1), varier force et distribution seulement.
   let delta=old.delta,reason=old.reason;
   if(!weak&&!forced&&same.length){
     delta-=near?18:24;reason+=' ; décision déjà travaillée dans le deck';
   }else if(!weak&&!forced&&sameConcept.length&&!same.length){
     delta+=8;reason+=' ; autre décision du même concept';
   }
   out.push({id:q.id,delta:Math.max(-64,Math.min(16,delta)),reason});
  }
  return out;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_CONTRAST_V1',rank});
});

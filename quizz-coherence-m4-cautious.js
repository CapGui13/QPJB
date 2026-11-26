/* #423 — D : contraste de décision après preuves autonomes, sans déplacement de concept. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./quizz-coherence-m4-diversite.js'):root.QPJBCoherenceM4);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4Cautious=api;
})(typeof window==='undefined'?null:window,function(base){
 'use strict';
 const clean=a=>a?.result==='correct'&&!a.assisted&&!a.hadFreeError;
 const family=q=>String(q?.caseFamily||q?.id||'');
 const protectedConcept=new Set(['ouv.passe','ouv.mineure','majeur.soutien']);
 const stable=x=>JSON.stringify([x?.concept,x?.stage,[...(x?.requires||[])].sort()]);
 function rank(ctx={}){
  if(!Number.isInteger(ctx.session)||ctx.session<3||ctx.session>5||ctx.category!=='discovery'||ctx.priority||ctx.forcedReason||ctx.history?.active||!Array.isArray(ctx.candidates))return [];
  const meta=ctx.metadataById||{}, byId=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
  for(const q of ctx.candidates)if(q?.id)byId.set(q.id,q);
  const old=byId.get(ctx.baselineId),m=meta[old?.id],f=base.features(old,m);
  if(!f||protectedConcept.has(m.concept))return [];
  const journal=(ctx.history?.journal||[]).filter(e=>e.mode==='parcours'&&Number.isInteger(e.session)&&e.session>=ctx.session-2&&e.session<ctx.session);
  if(new Set(journal.map(e=>e.session)).size!==2)return [];
  const observed=journal.flatMap(e=>e.answers||[]);
  // Ne pas substituer en présence d'un signal de fragilité, d'aide, ou d'un historique incomplet.
  if(journal.some(e=>!Array.isArray(e.answers)||e.answers.length<10)||!observed.every(clean))return [];
  const prior=observed.map(a=>byId.get(a.id)).filter(Boolean);
  if(prior.length!==observed.length)return [];
  const sameDecision=prior.filter(q=>base.features(q,meta[q.id])?.decision===f.decision);
  if(new Set(sameDecision.map(family)).size<2)return [];
  const selected=(ctx.selected||[]).map(x=>x?.exercise||x).filter(Boolean);
  const seen=[...prior,...selected].map(q=>base.features(q,meta[q.id])).filter(Boolean);
  if(!seen.some(x=>x.near===f.near))return [];
  const oldFamilies=new Set([...prior,...selected].map(family));
  const result=[],ids=new Set();
  for(const q of ctx.candidates){
   if(!q?.id||ids.has(q.id))continue;ids.add(q.id);
   const v=base.features(q,meta[q.id]);
   const safe=!!v&&q.id!==old.id&&stable(meta[q.id])===stable(m)&&q.theme===old.theme&&q.difficulty===old.difficulty&&
     q.answer===old.answer&&JSON.stringify(q.auction)===JSON.stringify(old.auction)&&v.decision===f.decision&&
     v.near!==f.near&&!seen.some(x=>x.near===v.near)&&!oldFamilies.has(family(q));
   result.push({id:q.id,delta:safe?8:0,reason:safe?'même décision et enchère, contraste de main inédit après deux familles réussies sans aide':'conservation du choix natif'});
  }
  return result;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_D_V1',rank});
});

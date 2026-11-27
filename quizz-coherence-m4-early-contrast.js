/* #423 — J: explicit natural-answer contrast, not just a new hand. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./quizz-coherence-m4-diversite.js'):root.QPJBCoherenceM4);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4EarlyContrast=api;
})(typeof window==='undefined'?null:window,function(base){
 'use strict';
 const permitted=new Set(['mineur.base','majeur.base']);
 const family=q=>String(q?.caseFamily||q?.id||'');
 const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
 const metaKey=m=>JSON.stringify([m?.concept,m?.stage,m?.minSession,(m?.requires||[]).map(r=>[r.concept,r.minExposure]).sort((a,b)=>a[0].localeCompare(b[0])||a[1]-b[1])]);
 const natural=q=>q?.auction?.length===1&&/^Partenaire\s*:\s*1[♣♦♥♠]$/.test(q.auction[0])&&/^(?:Passe|1[♦♥♠]|1SA)$/.test(q.answer||'');
 function rank(ctx={}){
  if(!Number.isInteger(ctx.session)||ctx.session<3||ctx.session>5||ctx.category!=='discovery'||ctx.priority||ctx.forcedReason||ctx.history?.active||!Array.isArray(ctx.candidates))return [];
  const meta=ctx.metadataById||{},byId=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
  for(const q of ctx.candidates)if(q?.id)byId.set(q.id,q);
  const old=byId.get(ctx.baselineId),m=meta[old?.id],f=base.features(old,m);
  if(!f||!permitted.has(m.concept)||!natural(old)||old.difficulty>2)return [];
  const selected=(ctx.selected||[]).map(v=>v?.exercise||v).filter(Boolean);
  const selectedF=selected.map(q=>base.features(q,meta[q.id])).filter(Boolean);
  const events=(ctx.history?.journal||[]).filter(e=>e.mode==='parcours'&&Number.isInteger(e.session)&&e.session>=ctx.session-2&&e.session<ctx.session);
  if(new Set(events.map(e=>e.session)).size!==2||events.some(e=>!Array.isArray(e.answers)||e.answers.length!==10))return [];
  const relevant=events.flatMap(e=>e.answers).filter(a=>meta[a.id]?.concept===m.concept);
  if(relevant.some(a=>!clean(a))||new Set(relevant.map(a=>family(byId.get(a.id)))).size<2||relevant.some(a=>!byId.has(a.id)))return [];
  const past=relevant.map(a=>({q:byId.get(a.id),f:base.features(byId.get(a.id),meta[a.id])})).filter(x=>x.f);
  // A repeated decision, not an arbitrary swap. One autonomous success on
  // that decision and two distinct clean families locally are required.
  if(!past.some(x=>x.f.decision===f.decision)||!selectedF.some(x=>x.decision===f.decision))return [];
  const already=new Set([...past.map(x=>x.f.decision),...selectedF.map(x=>x.decision)]);
  const used=new Set([...selected.map(family),...past.map(x=>family(x.q))]);
  const out=[],ids=new Set();
  for(const q of ctx.candidates){
   if(!q?.id||ids.has(q.id))continue;ids.add(q.id);
   const v=base.features(q,meta[q.id]);
   const safe=!!v&&q.id!==old.id&&natural(q)&&q.theme===old.theme&&q.difficulty===old.difficulty&&
     metaKey(meta[q.id])===metaKey(m)&&JSON.stringify(q.auction)===JSON.stringify(old.auction)&&
     q.answer!==old.answer&&v.decision!==f.decision&&!already.has(v.decision)&&!used.has(family(q));
   out.push({id:q.id,delta:safe?25:0,reason:safe?'contraste naturel inédit dans le même contexte après décision déjà réussie ; autres questions conservées':'choix natif conservé'});
  }
  return out;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_EARLY_J_V1',rank});
});

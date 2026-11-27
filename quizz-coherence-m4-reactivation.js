/* #423 — variante C, garde profil et rappel fondamental explicite. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./quizz-coherence-m4-diversite.js'):root.QPJBCoherenceM4);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4Reactivation=api;
})(typeof window==='undefined'?null:window,function(base){
 'use strict';
 const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const independent=a=>a?.result==='correct'&&!a.assisted&&!a.hadFreeError;
 function rank(ctx={}){
  if(!ctx||!Number.isInteger(ctx.session)||ctx.session<2||!Array.isArray(ctx.candidates)||ctx.history?.active||ctx.forcedReason==='rappel_erreur_aide')return [];
  const meta=ctx.metadataById||{},byId=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
  for(const q of ctx.candidates)if(q?.id)byId.set(q.id,q);
  const selected=(ctx.selected||[]).map(v=>v?.exercise||v).filter(Boolean);
  const chosen=selected.map(q=>({concept:meta[q.id]?.concept,f:base.features(q,meta[q.id])})).filter(x=>x.f);
  const last=new Map(),recent=[];
  let observations=0,clean=0;
  for(const e of ctx.history?.journal||[]){
   if(e.mode!=='parcours'||!Number.isInteger(e.session)||e.session>=ctx.session)continue;
   for(const a of e.answers||[]){
    const q=byId.get(a.id),concept=q&&meta[q.id]?.concept;if(!concept)continue;
    last.set(concept,Math.max(last.get(concept)||0,e.session));
    if(ctx.session-e.session<=2){observations++;if(independent(a)){clean++;const f=base.features(q,meta[q.id]);if(f)recent.push(f)}}
   }
  }
  for(const [id,r] of Object.entries(ctx.history?.entries||{})){
   const c=meta[id]?.concept,s=r?.assessment?.lastSession;
   if(c&&Number.isInteger(s)&&s>=0&&s+1<ctx.session)last.set(c,Math.max(last.get(c)||0,s+1));
  }
  const passFragile=ctx.session<=5&&((ctx.history?.micros?.['ouv:passe']?.score||0)<0||
    (ctx.history?.journal||[]).some(e=>e.mode==='parcours'&&e.session<ctx.session&&ctx.session-e.session<=2&&(e.answers||[]).some(a=>meta[a.id]?.concept==='ouv.passe'&&!independent(a))));
  const fragile=!observations||clean*2<observations||passFragile;
  const baseline=byId.get(ctx.baselineId),baselineConcept=baseline&&meta[baseline.id]?.concept;
  const gap=c=>last.has(c)?ctx.session-last.get(c):0;
  const allowed=new Set(Array.isArray(ctx.objective?.concepts)?ctx.objective.concepts:[]);
  const alreadyDue=chosen.some(x=>CORE.has(x.concept)&&gap(x.concept)>=7);
  const out=[],ids=new Set();
  for(const q of ctx.candidates){
   const f=base.features(q,meta[q?.id]),c=q&&meta[q.id]?.concept;
   if(!f||ids.has(q.id))continue;ids.add(q.id);
   let delta=0;const why=[];
   if(!fragile&&ctx.category!=='weakness'&&(!baselineConcept||baselineConcept===c)){
    const same=chosen.filter(x=>x.f.decision===f.decision);
    if(same.some(x=>x.f.near===f.near)){delta-=28;why.push('même décision, force et distribution dans la séance')}
    else if(same.length&&!ctx.priority){delta-=12;why.push('décision déjà travaillée dans la séance')}
    if(!ctx.priority&&recent.some(r=>r.near===f.near)){delta-=8;why.push('variante proche réussie récemment')}
   }
   if(ctx.category==='maintenance'&&!ctx.priority&&!alreadyDue&&allowed.has(c)&&CORE.has(c)&&gap(c)>=7&&
       !chosen.some(x=>x.concept===c)&&(!baselineConcept||!CORE.has(baselineConcept)||gap(c)>=gap(baselineConcept)+3)){
      delta+=Math.min(16,8+gap(c)-7);why.push('rappel fondamental ancien autorisé, '+gap(c)+' séances depuis exposition');
   }
   out.push({id:q.id,delta:Math.max(-36,Math.min(16,delta)),reason:why.join(' ; ')||'conservation du classement historique'});
  }
  return out;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_REACTIVATION_V1',rank});
});

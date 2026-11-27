/* #419 coordination — experimental maintenance, never a new eligibility rule.
 * Only exchanges candidates already admitted by the native maintenance bucket.
 * No priority recall, discovery, difficulty increase or unique core donor displaced.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJBCoordinatorM4=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const schema='QPJB_COORDINATOR_M4_V1';
 const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
 const concept=(ctx,q)=>ctx.metadataById?.[q?.id]?.concept;
 const family=q=>String(q.caseFamily||q.id);
 function choose(ctx={}){
  const {session:s,history:h,ranked,flagsById:f}=ctx;
  if(!Number.isInteger(s)||s<66||s%2!==0||!h||h.active||ctx.priority||ctx.forcedReason||
     ctx.category!=='maintenance'||!Array.isArray(ranked)||ranked.length<2||!f)return null;
  const best=ranked[0],source=best?.q,c0=concept(ctx,source),sf=f[source?.id];
  const chosen=(ctx.selected||[]).map(x=>x.exercise||x);
  if(!source||!sf||sf.due||sf.bad||sf.firstConcept||sf.novelFamily||!Number.isFinite(best.v))return null;
  // A core donor is only exchangeable if already represented in this deck.
  if(CORE.includes(c0)&&!chosen.some(q=>concept(ctx,q)===c0))return null;
  if(!CORE.includes(c0)&&sf.age>3&&!chosen.some(q=>concept(ctx,q)===c0))return null;
  const rows=(h.journal||[]).filter(e=>e.mode==='parcours'&&e.session<s&&Array.isArray(e.answers));
  const stats=new Map();
  for(const row of rows)for(const a of row.answers){
   const c=concept(ctx,a);if(!CORE.includes(c))continue;
   if(!stats.has(c))stats.set(c,{last:0,families:new Set(),sessions:new Set(),recentWeak:false});
   const t=stats.get(c);t.last=Math.max(t.last,row.session);
   if(clean(a)&&a.family){t.families.add(a.family);t.sessions.add(row.session)}
   else if(row.session>=s-3)t.recentWeak=true;
  }
  const eligible=new Set((ctx.candidates||[]).map(q=>q.id)),present=new Set(chosen.map(q=>concept(ctx,q)));
  const alternatives=[];
  for(const x of ranked.slice(1)){
   const q=x.q,c=concept(ctx,q),v=f[q.id],t=stats.get(c);
   if(!eligible.has(q.id)||!CORE.includes(c)||present.has(c)||c===c0||
      !v||v.bad||v.firstConcept||v.novelFamily||!t||t.recentWeak||
      t.families.size<2||t.sessions.size<2||s-t.last<9||
      q.difficulty!==source.difficulty||v.stage>sf.stage||
      chosen.some(z=>family(z)===family(q))||!Number.isFinite(x.v)||best.v-x.v>90)continue;
   alternatives.push({id:q.id,oldId:source.id,concept:c,donorConcept:c0,age:s-t.last,cost:best.v-x.v,reason:'rappel-fondamental-sature-sans-eviction-decouverte'});
  }
  alternatives.sort((a,b)=>b.age-a.age||a.cost-b.cost||a.id.localeCompare(b.id));
  return alternatives[0]||null;
 }
 return Object.freeze({schema,CORE,choose});
});

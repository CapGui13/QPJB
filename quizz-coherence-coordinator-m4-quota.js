/* #419 — Q/R: explicit maintenance quota, before native novelty exclusion.
 * No global eligibility change. Only an existing non-priority maintenance
 * slot is considered; R may consume one extra family-repeat budget on even
 * human sessions, Q never does. Both are experimental, disabled by default.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJBCoordinatorQuota=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const schema='QPJB_COORDINATOR_M4_QUOTA_V1',CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
 const concept=(ctx,q)=>ctx.metadataById?.[q?.id]?.concept;
 const bid=q=>String(q?.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
 const family=q=>String(q.caseFamily||q.id);
 function policy(mode){
  function choose(ctx={}){
   const {session:s,history:h,ranked,extended,flagsById:f}=ctx;
   if(!Number.isInteger(s)||s<66||s%2!==0||!h||h.active||ctx.priority||ctx.forcedReason||
      ctx.category!=='maintenance'||!ranked?.length||!f)return null;
   const best=ranked[0],source=best.q,c0=concept(ctx,source),sf=f[source.id],chosen=(ctx.selected||[]).map(x=>x.exercise||x);
   if(!sf||sf.due||sf.bad||sf.weak||sf.firstConcept||!Number.isFinite(best.v))return null;
   const present=new Set(chosen.map(q=>concept(ctx,q)));
   if(CORE.has(c0)&&!present.has(c0))return null;
   const data=new Map();
   for(const row of h.journal||[]){
    if(row.mode!=='parcours'||!Number.isInteger(row.session)||row.session>=s||!Array.isArray(row.answers))continue;
    for(const a of row.answers){
     const c=concept(ctx,a);if(!c)continue;
     if(!data.has(c))data.set(c,{last:0,success:0,error:0,f:new Set(),sessions:new Set()});
     const v=data.get(c);v.last=Math.max(v.last,row.session);
     if(clean(a)&&a.family){v.success=Math.max(v.success,row.session);v.f.add(a.family);v.sessions.add(row.session)}
     else v.error=Math.max(v.error,row.session);
    }
   }
   const donor=data.get(c0);
   if(!donor||donor.f.size<2||donor.sessions.size<2||donor.error>=donor.success||
      (!present.has(c0)&&s-donor.last>4))return null;
   const rankedIds=new Set(ranked.map(x=>x.q.id));
   const candidates=mode==='R'?[...ranked,...(extended||[]).filter(x=>!rankedIds.has(x.q.id))]:ranked;
   const choices=[];
   for(const x of candidates){
    const q=x.q,c=concept(ctx,q),v=f[q.id],target=data.get(c);
    if(q.id===source.id||c===c0||!CORE.has(c)||present.has(c)||!v||v.bad||v.weak||v.firstConcept||
       !target||target.f.size<2||target.sessions.size<2||target.error>=target.success||
       q.difficulty>source.difficulty||q.difficulty>3||v.stage>sf.stage||
       chosen.some(z=>family(z)===family(q))||!Number.isFinite(x.v))continue;
    const age=s-target.last,deadline=target.f.size>=5&&target.sessions.size>=5?12:9;
    if(age<deadline+3||(!v.novelFamily&&v.familyAge<12))continue;
    if(q.theme!==source.theme&&!chosen.some(z=>z.theme===source.theme))continue;
    const extra=!rankedIds.has(q.id);
    if(extra&&(mode!=='R'||v.novelFamily||!sf.novelFamily||ctx.repeatedFamilies>ctx.repeatBudget||age<18))continue;
    if(!extra&&sf.novelFamily&&!v.novelFamily)continue;
    const oldCount=chosen.filter(z=>bid(z)===bid(source)).length,newCount=chosen.filter(z=>bid(z)===bid(q)).length;
    if(bid(q)!==bid(source)&&newCount>oldCount)continue;
    const cost=best.v-x.v;
    if(cost>(extra?500:120))continue;
    choices.push({id:q.id,oldId:source.id,concept:c,donorConcept:c0,age,deadline,cost,allowOneExtraRepeat:extra,mode,
      reason:'maintenance-quota-'+mode+'-dette-individuelle'});
   }
   choices.sort((a,b)=>(b.age-b.deadline)-(a.age-a.deadline)||Number(a.allowOneExtraRepeat)-Number(b.allowOneExtraRepeat)||a.cost-b.cost||a.id.localeCompare(b.id));
   return choices[0]||null;
  }
  return Object.freeze({schema,mode,choose});
 }
 return Object.freeze({Q:policy('Q'),R:policy('R')});
});

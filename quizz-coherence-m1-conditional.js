/* #420 — V3 experimental. V2 for discovery with proven autonomy;
 * otherwise a bounded, single optional focus substitution in a free slot.
 * Never changes eligibility, category, explicit recall, priority, order,
 * canonical answer or storage. A focus is not a mastery judgment.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-guarded.js'));else root.QPJBCoherenceM1Conditional=factory(root.QPJBCoherenceM1Guarded);})(typeof window==='undefined'?null:window,function(base){
'use strict';
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const late={
 44:['chelem.blackwood.declenchement','chelem.cles','chelem.controles'],
 54:['sa1.stayman.reponse','sa1.stayman','sa1.texas','contre.base'],
 55:['sa2.stayman','sa2.texas','sa2.seuil'],
 59:['red.bicolore','red.bicolore_cher','sa2.stayman.suite','sa2.texas.suite']
};
const question=x=>x?.exercise||x;
const meta=(ctx,q)=>ctx.metadataById instanceof Map?ctx.metadataById.get(q?.id):ctx.metadataById?.[q?.id];
const concept=(ctx,q)=>meta(ctx,q)?.concept;
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function observations(ctx){
 const out=new Map(),s=ctx.session;
 for(const row of ctx.history?.journal||[]){
  if(row?.mode!=='parcours'||!Number.isInteger(row.session)||row.session<1||row.session>=s||!Array.isArray(row.answers))continue;
  for(const a of row.answers){
   const c=concept(ctx,a);
   if(!c||!a.family||!['correct','wrong'].includes(a.result))continue;
   if(!out.has(c))out.set(c,{families:new Set(),weak:new Set(),last:0,correct:new Set()});
   const x=out.get(c);x.families.add(a.family);x.last=Math.max(x.last,row.session);
   if(clean(a))x.correct.add(a.family);
   else if(a.result==='wrong'||a.assisted===true||a.hadFreeError===true){if(row.session>=s-5)x.weak.add(a.family);}
  }
 }
 return out;
}
function target(ctx,obs){
 const row=base.curriculum[ctx.session-1];if(!row)return null;
 const eligible=new Set((ctx.candidates||[]).map(q=>concept(ctx,question(q))).filter(Boolean));
 const primary=row.primary.filter(c=>eligible.has(c));
 const linked=(late[ctx.session]||row.secondary).filter(c=>eligible.has(c)&&obs.get(c)?.families.size);
 // Secondary candidates are explicitly not counted as primary.
 return {primary,linked,kind:primary.length?'primary':linked.length?'linked':'historical'};
}
function plan(ctx={}){
 const p=base.plan(ctx);if(!p)return p;
 const t=target(ctx,observations(ctx));
 return {...p,conditionalTarget:t,referenceObjective:p.objective,
   fallback:t.kind==='primary'?p.fallback:t.kind==='linked'?'Objectif principal indisponible dans cette strate ; réactiver une notion liée déjà rencontrée, sans modifier les prérequis.':'Conserver la sélection historique : aucune cible liée observable.'};
}
function compose(ctx={},ranked=[]){
 const s=ctx.session,row=base.curriculum[s-1],best=ranked[0];
 if(!row||s<3||s>65||!Number.isInteger(s)||ctx.history?.active||ctx.priority||ctx.forcedReason||
    !['weakness','maintenance','transfer','discovery'].includes(ctx.category)||!best?.q||!Number.isFinite(best.v))return null;
 const selected=(ctx.selected||[]).map(question),obs=observations(ctx);
 const chosen=new Set(selected.map(q=>concept(ctx,q)));
 const c0=concept(ctx,best.q),m0=meta(ctx,best.q),f0=ctx.flagsById?.[best.q.id];
 if(!m0||!f0||f0.due||f0.bad||f0.firstConcept||f0.overdueCore||row.primary.includes(c0))return null;
 // Only one primary/linked focus in a session. Existing primary already satisfies it.
 if(row.primary.some(c=>chosen.has(c)))return null;
 // Need at least two observed guided sessions; absence of evidence = historical.
 const complete=(ctx.history?.journal||[]).filter(r=>r.mode==='parcours'&&r.session<s&&r.answers?.length===10);
 if(new Set(complete.map(r=>r.session)).size<2)return null;
 // Special early slot: support already encountered, recently fragile on
 // two distinct families; permit moving between foundational response
 // concepts only if the displaced one is neither old nor the first today.
 // Later slots stay in the same theme, preserve the difficulty and stage.
 const early=s<=5;
 const wanted=row.primary;
 const maxCost=early?60:45;
 const allowed=q=>{
  const c=concept(ctx,q),m=meta(ctx,q),f=ctx.flagsById?.[q.id],o=obs.get(c);
  if(!m||!f||!wanted.includes(c)||chosen.has(c)||!o?.families.size||f.due||f.bad||!f.novelFamily||
     q.difficulty!==best.q.difficulty||m.stage>m0.stage||m.stage>2||q.id===best.q.id)return false;
  if(core.has(c0)&&(!early||!chosen.has(c0)))return false;
  if(q.theme!==best.q.theme&&!early)return false;
  if(ctx.category==='weakness'||ctx.category==='transfer'){
    if(o.weak.size<2)return false;
  }else if(!late[s]||o.correct.size<2||!base.autonomy(ctx).enabled)return false;
  return true;
 };
 const next=ranked.find(x=>Number.isFinite(x.v)&&best.v-x.v<=maxCost&&allowed(x.q));
 return next?{id:next.q.id,oldId:best.q.id,concept:concept(ctx,next.q),cost:best.v-next.v,reason:'objectif-deja-rencontre-et-consolidation-compatible'}:null;
}
return Object.freeze({...base,policy:'conditional-composition-v3',plan,compose});
});

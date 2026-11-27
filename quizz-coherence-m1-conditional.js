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
 if(!row||s<3||s>65||!Number.isInteger(s)||ctx.changed||ctx.history?.active||ctx.priority||ctx.forcedReason||
    !['weakness','maintenance','transfer','discovery'].includes(ctx.category)||!best?.q||!Number.isFinite(best.v))return null;
 const early=s<=5,autonomous=base.autonomy(ctx).enabled;
 // Keep the accepted V2 when autonomous, except the four documented late objectives.
 if(autonomous&&!late[s])return null;
 const selected=(ctx.selected||[]).map(question),obs=observations(ctx);
 const candidateIds=new Set((ctx.candidates||[]).map(q=>question(q)?.id));
 if(!candidateIds.has(best.q.id))return null;
 const selectedIds=new Set(selected.map(q=>q.id));
 const chosen=new Set(selected.map(q=>concept(ctx,q)));
 const c0=concept(ctx,best.q),m0=meta(ctx,best.q),f0=ctx.flagsById?.[best.q.id];
 if(!m0||!f0||f0.due||f0.bad||f0.firstConcept||f0.overdueCore||!f0.novelFamily)return null;
 const complete=(ctx.history?.journal||[]).filter(r=>r.mode==='parcours'&&r.session<s&&r.answers?.length===10);
 if(new Set(complete.map(r=>r.session)).size<2)return null;
 const focus=selected.filter(q=>row.primary.includes(concept(ctx,q)));
 const supports=selected.filter(q=>concept(ctx,q)==='majeur.soutien').length;
 if(early&&(focus.length>=row.target||s===3&&supports>=2))return null;
 if(!early&&focus.length>=Math.min(row.target,2))return null;
 if(!early&&!late[s]&&!['weakness','transfer'].includes(ctx.category))return null;
 // Preserve first 2SA opening, and already useful focus unless a second
 // fit case can supplement natural responses without removing their only case.
 if(s===3&&c0==='ouv.sa2'&&!chosen.has(c0))return null;
 if(row.primary.includes(c0)&&!(s===3&&c0==='majeur.base'&&chosen.has(c0)&&supports<2))return null;
 const available=target({...ctx,candidates:ranked.map(x=>x.q)},obs);
 const wanted=s===3?['majeur.soutien']:available.kind==='primary'?available.primary:early?[]:available.linked;
 if(!wanted.length||!early&&focus.length&&available.kind==='linked')return null;
 const maxCost=early?80:65;
 const allowed=q=>{
  const c=concept(ctx,q),m=meta(ctx,q),f=ctx.flagsById?.[q.id],o=obs.get(c);
  if(!candidateIds.has(q.id)||selectedIds.has(q.id)||!m||!f||!wanted.includes(c)||f.due||f.bad||!f.novelFamily||
     q.difficulty!==best.q.difficulty||m.stage>m0.stage||q.id===best.q.id)return false;
  if(core.has(c0)&&!chosen.has(c0))return false;
  if(q.theme!==best.q.theme&&!early)return false;
  if(!early&&m.stage>1&&!autonomous&&(!o?.families.size||q.difficulty>3))return false;
  if(ctx.category==='weakness'||ctx.category==='transfer'){
    // Two distinct recently fragile families, not an isolated mistake.
    if(!o||o.weak.size<2||o.weak.size<(obs.get(c0)?.weak.size||0))return false;
    if(!early&&chosen.has(c)&&focus.length>0)return false;
  }else if(ctx.category==='maintenance'){
    if(!o||o.correct.size<2)return false;
  }else if(early){
    // One extra eligible practice case in a concept already present today.
    if(!chosen.has(c))return false;
  }else if(!autonomous)return false;
  return true;
 };
 const next=ranked.find(x=>Number.isFinite(x.v)&&best.v-x.v<=maxCost&&allowed(x.q));
 return next?{id:next.q.id,oldId:best.q.id,concept:concept(ctx,next.q),cost:best.v-next.v,reason:row.primary.includes(concept(ctx,next.q))?'objectif-principal-compatible':'reactivation-liee-conditionnelle'}:null;
}
return Object.freeze({...base,policy:'conditional-composition-v3',plan,compose});
});

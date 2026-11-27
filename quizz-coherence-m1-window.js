/* #420 V6 — curriculum in windows, not a calendar unlock.
 * V4 early policy retained; V5 weak-only override is HOLD after its debt trade-off.
 * A late objective is attempted once within its window, only after the
 * historical selector has admitted the candidate into the same free category.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-fit.js'));else root.QPJBCoherenceM1Window=factory(root.QPJBCoherenceM1Fit);})(typeof window==='undefined'?null:window,function(base){
'use strict';
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const windows=Object.freeze([
 {anchor:44,start:48,end:65,kind:'decouverte-ou-consolidation',concepts:['chelem.blackwood.suite','chelem.blackwood.dame_rois'],why:'Suites Blackwood après contrôles et clés; variantes admissibles à partir de S48, selon preuves.'},
 {anchor:54,start:54,end:59,kind:'reactivation',concepts:['sa1.stayman.contre','sa1.texas.contre'],why:'Réactiver la réaction à un contre seulement après conventions SA et contre déjà rencontrés.'},
 {anchor:55,start:55,end:60,kind:'reactivation',concepts:['sa2.stayman.reponse','sa2.texas.reponse'],why:'Réinvestir les réponses après recherche de majeure sur 2SA.'},
 {anchor:59,start:59,end:64,kind:'reactivation',concepts:['ouv.bicolore.exception','sa2.bicolore','sa.gambling'],why:'Revenir sur les exceptions irrégulières sans précipiter une convention.'}
].map(x=>Object.freeze({...x,concepts:Object.freeze(x.concepts)})));
const qOf=x=>x?.exercise||x;
const meta=(ctx,q)=>ctx.metadataById instanceof Map?ctx.metadataById.get(q?.id):ctx.metadataById?.[q?.id];
const concept=(ctx,q)=>meta(ctx,q)?.concept;
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function observations(ctx){
 const all=new Map();
 for(const row of ctx.history?.journal||[]){
  if(row?.mode!=='parcours'||!Number.isInteger(row.session)||row.session<1||row.session>=ctx.session||!Array.isArray(row.answers)||row.answers.length!==10)continue;
  for(const a of row.answers){
   const c=concept(ctx,a);
   if(!c||!a.family||!['correct','wrong'].includes(a.result)||typeof a.assisted!=='boolean'||typeof a.hadFreeError!=='boolean')continue;
   if(!all.has(c))all.set(c,{families:new Set(),good:new Set(),goodSessions:new Set(),weak:new Set(),last:0});
   const v=all.get(c);v.families.add(a.family);v.last=Math.max(v.last,row.session);
   if(clean(a)){v.good.add(a.family);v.goodSessions.add(row.session);}
   else if(row.session>=ctx.session-5)v.weak.add(a.family);
  }
 }
 return all;
}
function pending(ctx,obs){
 return windows.filter(w=>ctx.session>=w.start&&ctx.session<=w.end&&!w.concepts.some(c=>(obs.get(c)?.last||0)>=w.start));
}
function plan(ctx={}){
 const p=base.plan(ctx);if(!p)return p;
 const obs=observations(ctx),available=new Set((ctx.candidates||[]).map(x=>concept(ctx,qOf(x))));
 const active=pending(ctx,obs).map(w=>({...w,eligible:w.concepts.filter(c=>available.has(c))}));
 const delayed=ctx.session===44?{anchor:44,start:48,end:65,reason:'Fenêtre conditionnelle : aucune suite Blackwood admissible dans les 18 trajectoires de référence à S44; conserver contrôles et clés si le moteur les présente.'}:null;
 return {...p,windowObjectives:active,delayedObjective:delayed,windowPolicy:'Objectif principal historique inchangé ; objectif de fenêtre complémentaire seulement si le créneau libre et les preuves locales sont compatibles.'};
}
function compose(ctx={},ranked=[]){
 const first=base.compose(ctx,ranked);if(first)return first;
 const s=ctx.session,best=ranked[0];
 if(!Number.isInteger(s)||s<48||s>65||ctx.changed||ctx.history?.active||ctx.priority||ctx.forcedReason||
    !['discovery','maintenance','weakness'].includes(ctx.category)||!best?.q||!Number.isFinite(best.v))return null;
 const chosen=(ctx.selected||[]).map(qOf);
 if(chosen.length<5)return null;
 const obs=observations(ctx),open=pending(ctx,obs);
 if(!open.length)return null;
 const ids=new Set((ctx.candidates||[]).map(x=>qOf(x)?.id)),selectedIds=new Set(chosen.map(q=>q.id));
 const c0=concept(ctx,best.q),m0=meta(ctx,best.q),f0=ctx.flagsById?.[best.q.id],u=obs.get(c0);
 const current=base.curriculum[s-1],protect=new Set(current.primary);
 if(!ids.has(best.q.id)||!m0||!f0||f0.due||f0.bad||f0.firstConcept||!f0.novelFamily||core.has(c0)||protect.has(c0)||!u?.families.size)return null;
 const historicalAge=s-u.last;
 const sameTheme=chosen.some(q=>q.theme===best.q.theme);
 const sameConcept=chosen.some(q=>concept(ctx,q)===c0);
 const active=open.filter(w=>!w.concepts.some(c=>chosen.some(q=>concept(ctx,q)===c)));
 if(!active.length)return null;
 // Protect a genuinely new theme/concept, due ID, core and current lesson.
 // A recent noncore source can be exchanged only for a lesson already
 // pending in its window; an older source requires at least equal recency.
 const autonomous=base.autonomy(ctx).enabled;
 for(const w of active){
  const next=ranked.slice(1).find(x=>{
   const q=x.q,c=concept(ctx,q),m=meta(ctx,q),f=ctx.flagsById?.[q.id],o=obs.get(c);
   if(!ids.has(q.id)||selectedIds.has(q.id)||c===c0||!w.concepts.includes(c)||!m||!f||f.due||f.bad||!f.novelFamily||
      q.difficulty!==best.q.difficulty||m.stage>m0.stage||!Number.isFinite(x.v)||best.v-x.v>65)return false;
   if(!sameTheme&&q.theme!==best.q.theme&&!sameConcept)return false;
   if(!sameConcept&&o&&s-o.last<historicalAge)return false;
   if(!o){
    // A genuine first contact in a discovery slot only, all requirements
    // supported by explicit unassisted families on separate guided sessions.
    if(w.kind==='reactivation'||ctx.category!=='discovery'||!autonomous||!m.requires?.length)return false;
    return m.requires.every(req=>{const e=obs.get(req.concept);return e&&e.good.size>=Math.max(2,req.minExposure)&&e.goodSessions.size>=2;});
   }
   if(ctx.category==='weakness')return o.weak.size>=2&&o.weak.size/o.families.size>=u.weak.size/u.families.size;
   if(ctx.category==='maintenance')return o.good.size>=2&&o.goodSessions.size>=2;
   return autonomous&&o.good.size>=2&&o.goodSessions.size>=2;
  });
  if(next)return {id:next.q.id,oldId:best.q.id,concept:concept(ctx,next.q),cost:best.v-next.v,reason:'objectif-fenetre-'+w.anchor,anchor:w.anchor,window:[w.start,w.end]};
 }
 return null;
}
return Object.freeze({...base,policy:'window-composition-v6',compose,plan,windows});
});

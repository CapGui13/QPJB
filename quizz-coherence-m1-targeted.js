/* M1 V5: targeted lesson composition, not a new review/eligibility policy.
 * All alternatives come from the already filtered historical category.
 * Historical objectives remain the measurement reference. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-fit.js'));else root.QPJBCoherenceM1Targeted=factory(root.QPJBCoherenceM1Fit);})(typeof window==='undefined'?null:window,function(base){
'use strict';
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const late=new Set([44,54,55,59]);
const qOf=x=>x?.exercise||x;
const meta=(ctx,q)=>ctx.metadataById instanceof Map?ctx.metadataById.get(q?.id):ctx.metadataById?.[q?.id];
const concept=(ctx,q)=>meta(ctx,q)?.concept;
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function evidence(ctx){
 const all=new Map();let total=0,weak=0;const sessions=new Set();
 for(const row of ctx.history?.journal||[]){
  if(row?.mode!=='parcours'||!Number.isInteger(row.session)||row.session<1||row.session>=ctx.session||!Array.isArray(row.answers)||row.answers.length!==10)continue;
  sessions.add(row.session);
  for(const a of row.answers){
   const c=concept(ctx,a);
   if(!c||!a.family||!['correct','wrong'].includes(a.result)||typeof a.assisted!=='boolean'||typeof a.hadFreeError!=='boolean')continue;
   if(!all.has(c))all.set(c,{seen:new Set(),weak:new Set(),good:new Set(),last:0});
   const v=all.get(c);v.seen.add(a.family);v.last=Math.max(v.last,row.session);
   if(clean(a))v.good.add(a.family);
   if(row.session>=ctx.session-5&&!clean(a))v.weak.add(a.family);
   if(row.session>=ctx.session-5){total++;weak+=+!clean(a);}
  }
 }
 return {all,weakRate:total?weak/total:0,sessions:sessions.size};
}
function compose(ctx={},ranked=[]){
 const first=base.compose(ctx,ranked);if(first)return first;
 const s=ctx.session,best=ranked[0];
 if(!Number.isInteger(s)||s<3||s>65||ctx.changed||ctx.history?.active||ctx.priority||ctx.forcedReason||!best?.q||!Number.isFinite(best.v))return null;
 const chosen=(ctx.selected||[]).map(qOf),seen=new Set(chosen.map(q=>q.id)),ids=new Set((ctx.candidates||[]).map(q=>qOf(q)?.id));
 const c0=concept(ctx,best.q),m0=meta(ctx,best.q),f0=ctx.flagsById?.[best.q.id],obs=evidence(ctx);
 if(!ids.has(best.q.id)||!m0||!f0||f0.due||f0.bad||f0.firstConcept||f0.overdueCore||!f0.novelFamily||obs.sessions<2)return null;
 const count=c=>chosen.filter(q=>concept(ctx,q)===c).length;
 const safe=x=>{
  const q=x.q,m=meta(ctx,q),f=ctx.flagsById?.[q.id];
  return ids.has(q.id)&&!seen.has(q.id)&&concept(ctx,q)!==c0&&m&&f&&!f.due&&!f.bad&&f.novelFamily&&
    q.difficulty===best.q.difficulty&&m.stage<=m0.stage&&Number.isFinite(x.v);
 };
 let next,reason;
 if(s===3&&ctx.category==='weakness'&&obs.weakRate>=.5&&chosen.length>=7&&c0==='mineur.base'&&count(c0)>=2){
  // The actual engine already selected at least two mineur.base questions,
  // and a real 5-3 support. A local fit error on two observed families
  // justifies a contrast, not the removal of the only natural response.
  const supports=chosen.filter(q=>base.fitRole(q)==='support-5-3'),passed=chosen.some(q=>base.fitRole(q)==='passe-avec-fit');
  const v=obs.all.get('majeur.soutien'),u=obs.all.get(c0);
  if(supports.length===1&&v?.seen.size>=2&&v.weak.size>=1&&u?.seen.size&&v.weak.size/v.seen.size>=u.weak.size/u.seen.size){
   next=ranked.slice(1).find(x=>safe(x)&&concept(ctx,x.q)==='majeur.soutien'&&best.v-x.v<=80&&
    (!passed?base.fitRole(x.q)==='passe-avec-fit':v.weak.size>=2&&base.fitRole(x.q)==='support-5-3'&&x.q.auction[0]!==supports[0].auction[0]));
   reason=passed?'consolidation-fit-autre-majeure':'contraste-fit-et-force-insuffisante';
  }
 }else if(late.has(s)&&['maintenance','weakness'].includes(ctx.category)&&chosen.length>=5){
  const row=base.curriculum[s-1],primary=new Set(row.primary),linked=new Set(row.secondary);
  // A dated objective is optional; do not remove an overdue fundamental,
  // the first example, or a previously chosen primary/linked concept.
  if(core.has(c0)||primary.has(c0)||linked.has(c0)||chosen.some(q=>primary.has(concept(ctx,q)))||!obs.all.get(c0)?.seen.size)return null;
  const eligiblePrimary=ranked.some(x=>primary.has(concept(ctx,x.q)));
  const wanted=eligiblePrimary?primary:linked;
  if(!eligiblePrimary&&chosen.some(q=>linked.has(concept(ctx,q))))return null;
  const compatible=x=>{
   if(!safe(x)||!wanted.has(concept(ctx,x.q))||best.v-x.v>65)return false;
   const o=obs.all.get(concept(ctx,x.q)),m=meta(ctx,x.q);
   if(!o?.seen.size||count(concept(ctx,x.q)))return false;
   if(!base.autonomy(ctx).enabled&&m.stage>1&&x.q.difficulty>3)return false;
   if(ctx.category==='weakness')return o.weak.size>=2&&o.weak.size/o.seen.size>=(obs.all.get(c0)?.weak.size||0)/obs.all.get(c0).seen.size;
   return o.good.size>=2;
  };
  next=ranked.slice(1).find(compatible);
  reason=eligiblePrimary?'reactivation-objectif-dans-fenetre':'rappel-lie-si-objectif-indisponible';
 }
 return next?{id:next.q.id,oldId:best.q.id,concept:concept(ctx,next.q),cost:best.v-next.v,reason}:null;
}
function plan(ctx={}){
 const p=base.plan(ctx);if(!p)return p;
 const actual=ctx.session===44?{window:[48,65],kind:'decouverte-conditionnelle',note:'Le plancher canonique des suites est index 47 pour les variantes concernées; attendre les prérequis réels, reprendre contrôles et clés si utile.'}:late.has(ctx.session)?{window:p.window,kind:'reactivation-conditionnelle',note:'Une première exposition ne constitue pas une preuve; ne proposer la réactivation que dans un créneau compatible.'}:null;
 return {...p,conditionalWindow:actual,compositionPolicy:'Un seul changement de concept facultatif, jamais de créneau prioritaire ni de rappel dû.'};
}
return Object.freeze({...base,policy:'targeted-composition-v5',compose,plan});
});

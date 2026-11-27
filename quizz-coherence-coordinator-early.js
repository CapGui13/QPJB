/* #419 coordination pass 3 — last free slot, no global ranking or eligibility rewrite.
 * Separate arms: focus (M1), elementary transition (M3), contrast (M4).
 * Only filtered native candidates; no action on S1/S2, error, priority or due slot.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-curriculum.js'),require('./quizz-coherence-m3-prerequis.js'),require('./quizz-coherence-m4-diversite.js'));else root.QPJBCoordinatorEarly=factory(root.QPJBCoherenceCurriculum,root.QPJB_COHERENCE_M3,root.QPJBCoherenceM4);})(typeof window==='undefined'?globalThis:window,function(curriculum,m3,diversity){
'use strict';
const schema='QPJB_COORDINATOR_EARLY_V1';
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const bid=q=>String(q?.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>String(q.caseFamily||q.id);
const meta=(ctx,q)=>ctx.metadataById?.[q?.id];
const concept=(ctx,q)=>meta(ctx,q)?.concept;
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function support(q){const a=String(q?.auction?.[0]||'').match(/:\s*(1[♥♠])/);return !!a&&q.theme==='majeur'&&q.auction.length===1&&bid(q)==='2'+a[1][1]&&q.shape?.[a[1][1]==='♠'?0:1]===3}
function choose(ctx,mode){
 const {session:s,history:h,ranked,flagsById:f}=ctx,chosen=(ctx.selected||[]).map(x=>x.exercise||x);
 if(!Number.isInteger(s)||s<3||s>65||h?.active||ctx.priority||ctx.forcedReason||
    ctx.category!=='discovery'||chosen.length!==9||!ranked?.length||!f)return null;
 const best=ranked[0],source=best.q,c0=concept(ctx,source),sf=f[source.id],m0=meta(ctx,source);
 if(!sf||!m0||sf.due||sf.bad||!sf.novelFamily||!Number.isFinite(best.v))return null;
 const rows=(h.journal||[]).filter(r=>r.mode==='parcours'&&r.session<s&&r.answers?.length===10);
 if(!rows.length)return null;
 const ids=new Set(rows.flatMap(r=>r.answers.map(a=>a.id)));
 const chosenConcept=new Set(chosen.map(q=>concept(ctx,q)));
 const recent=rows.filter(r=>r.session>=s-2);
 const protectedConcept=core.has(c0)&&!chosenConcept.has(c0);
 const eligible=new Set(ctx.candidates.map(q=>q.id));
 const safe=x=>{
  const q=x.q,m=meta(ctx,q),v=f[q.id];
  return eligible.has(q.id)&&!chosen.some(z=>z.id===q.id||family(z)===family(q))&&m&&v&&
   !v.due&&!v.bad&&v.novelFamily&&q.difficulty===source.difficulty&&m.stage<=m0.stage&&
   Number.isFinite(x.v)&&best.v-x.v>=0&&best.v-x.v<=48&&
   (q.theme===source.theme||chosen.some(z=>z.theme===source.theme))&&
   (!support(source)||support(q));
 };
 const emit=(x,reason)=>({id:x.q.id,oldId:source.id,concept:concept(ctx,x.q),oldConcept:c0,cost:best.v-x.v,reason,mode});
 if(mode==='M1'){
  // S3–5 only: one missing objective, never the sole case of the donor
  // concept. Require a real support bid for S3, not merely a concept tag.
  const row=curriculum.curriculum[s-1];
  if(s>5||!row||!chosenConcept.has(c0)||protectedConcept||row.primary.includes(c0)||
     !recent.length||recent.some(r=>r.answers.some(a=>!clean(a))))return null;
  const n=chosen.filter(q=>row.primary.includes(concept(ctx,q))).length;
  if(n>=row.target||s===3&&chosen.some(support))return null;
  const x=ranked.slice(1).find(x=>safe(x)&&row.primary.includes(concept(ctx,x.q))&&(s!==3||support(x.q)));
  return x?emit(x,'objectif-manquant-dernier-creneau-donneur-conserve'):null;
 }
 if(mode==='M3'){
  for(const [complex,simple,reason] of [[m3.TEXAS,m3.TEXAS_ELEMENTARY,'texas-elementaire-avant-manche'],[m3.STAYMAN_FOURTH,m3.STAYMAN_SIMPLE,'stayman-simple-avant-suite']]){
   if(!complex.includes(source.id)||simple.some(id=>ids.has(id)||chosen.some(q=>q.id===id)))continue;
   const x=ranked.slice(1).find(x=>safe(x)&&simple.includes(x.q.id)&&concept(ctx,x.q)===c0&&bid(x.q)===bid(source));
   if(x)return emit(x,reason);
  }
  return null;
 }
 if(mode==='M4'&&s<=20){
  // Replace only a genuine near duplicate with a different example of the
  // same concept, same decision and same level. Keep all existing contrasts.
  const a=diversity.features(source,m0),features=chosen.map(q=>diversity.features(q,meta(ctx,q))).filter(Boolean);
  if(!a||!features.some(z=>z.near===a.near))return null;
  const x=ranked.slice(1).find(x=>{
   if(!safe(x)||concept(ctx,x.q)!==c0||bid(x.q)!==bid(source)||x.q.theme!==source.theme)return false;
   const b=diversity.features(x.q,meta(ctx,x.q));
   return b&&b.decision===a.decision&&!features.some(z=>z.near===b.near);
  });
  return x?emit(x,'meme-notion-et-decision-variante-non-miroir'):null;
 }
 return null;
}
function make(mode){return Object.freeze({schema,mode,choose:ctx=>choose(ctx,mode)})}
return Object.freeze({M1:make('M1'),M3:make('M3'),M4:make('M4')});
});

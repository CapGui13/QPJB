/* M3 advisory only: elementary Texas before its game-going counterpart.
 * No eligibility changes, no activation, no SEF changes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJBM3TransitionAdvice=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const ELEMENTARY=['SEF-037-1','SEF-038-1','SEF-N082-2','SEF-N085-1','SEF-V44-015','SEF-V44-016','SEF-V49-017','SEF-C-003','V2-M2-030'];
const STRONG=['SEF-039-2','SEF-039-1','SEF-040-2','SEF-N084-1','SEF-N087-2','V2-M2-018'];
function advise(ctx={}){
 const ranked=ctx.ranked||[],winner=ranked[0];
 if(!winner||ctx.forcedReason==='rappel_erreur_aide'||ctx.category==='weakness'||ctx.hasPriorExposure||!STRONG.includes(winner.q?.id))return null;
 if((ctx.selected||[]).some(x=>ELEMENTARY.includes((x.exercise||x.q||x).id)))return null;
 if(!Number.isFinite(winner.v))return null;
 // Equal score or within one local difficulty-score step (48), chosen
 // in advance. No cross-answer, cross-stage or cross-concept substitution.
 const limit=ctx.maxGap===0?0:48;
 const alternative=ranked.find(x=>ELEMENTARY.includes(x.q?.id)&&x.q.answer===winner.q.answer&&x.q.difficulty===winner.q.difficulty&&Number.isFinite(x.v)&&winner.v-x.v>=0&&winner.v-x.v<=limit);
 if(!alternative)return null;
 return {id:alternative.q.id,replaces:winner.q.id,gap:winner.v-alternative.v,reason:'Introduire le Texas par la recherche de partielle, sans retirer les variantes de manche du vivier éligible.',advisory:true};
}
return {advise,ELEMENTARY,STRONG};
});
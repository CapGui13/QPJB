/* Second candidate #420. An objective remains visible even when the
 * historical selection must be preserved. Not a new prerequisite or a
 * mastery threshold: only the optional override of a discovery slot.
 * No inferred evidence from legacy or incomplete journals. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-curriculum.js'));else root.QPJBCoherenceM1Guarded=factory(root.QPJBCoherenceCurriculum);})(typeof window==='undefined'?null:window,function(base){
'use strict';
const clean=a=>a&&a.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function autonomy(ctx={}){
 const s=ctx.session,j=ctx.history?.journal;
 if(!Number.isInteger(s)||s<3||!Array.isArray(j))return {enabled:false,reason:'preuve-autonome-recente-absente'};
 const rows=j.filter(r=>r?.mode==='parcours'&&Number.isInteger(r.session)&&r.session<s&&Array.isArray(r.answers)&&r.answers.length===10);
 const recent=rows.filter(r=>r.session===s-1||r.session===s-2);
 if(recent.length!==2||new Set(recent.map(r=>r.session)).size!==2)return {enabled:false,reason:'deux-seances-completes-requises'};
 if(!recent.every(r=>r.answers.every(clean)))return {enabled:false,reason:'consolidation-recente-prioritaire'};
 const all=rows.flatMap(r=>r.answers);
 if(all.filter(clean).length<0.9*all.length)return {enabled:false,reason:'consolidation-longitudinale-prioritaire'};
 return {enabled:true,reason:'autonomie-recente-complete-et-autonomie-historique-majoritaire'};
}
function plan(ctx){const p=base.plan(ctx);if(!p)return p;const gate=autonomy(ctx);return {...p,compositionGate:gate,fallback:gate.enabled?p.fallback:'Objectif indicatif ; conserver intégralement la sélection historique pour privilégier la consolidation : '+gate.reason};}
return Object.freeze({...base,policy:'guarded-autonomy-v2',autonomy,plan,rank:ctx=>autonomy(ctx).enabled?base.rank(ctx):[],prefer:ctx=>autonomy(ctx).enabled?base.prefer(ctx):(ctx?.candidates||[])});
});

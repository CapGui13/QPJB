'use strict';
// M4-B #447: experiment P, deliberately restricted to fully exhausted catalogue.
// No profile/seed or date gate: this guard depends only on native history and catalogue.
// It is a scoped candidate for M1/D review, not a general solution.
const {evidence}=require('./quizz-coherence-m4p-b-policy.js'),rotation=require('./quizz-coherence-m4p-b-rotation.js');
const fam=q=>String(q.caseFamily||q.id);
function saturated(ctx){
 if(ctx.objective?.allowExhaustedCatalogueRecall!==true||ctx.session<66||ctx.session>180||ctx.history?.active)return false;
 const ev=evidence(ctx);if(!ev.stable)return false;
 const all=new Set(ctx.exercises.map(fam)),concepts=new Set(ctx.exercises.map(q=>ctx.metadataById[q.id]?.concept));
 if(concepts.has(undefined)||all.size!==ev.families.size||[...all].some(f=>!ev.families.has(f)))return false;
 for(const c of concepts){
  const v=ev.map.get(c);
  if(!v||new Set(v.successes.map(a=>a.f)).size<2||new Set(v.successes.map(a=>a.s)).size<2)return false;
 }
 const recent=(ctx.history.journal||[]).filter(j=>j.mode==='parcours'&&j.session>=ctx.session-2);
 return recent.length===2&&recent.every(j=>j.answers.length===10&&j.answers.every(a=>a.result==='correct'&&a.assisted===false&&a.hadFreeError===false));
}
function replace(ctx,deck,slots){
 if(!saturated(ctx))return {deck};
 const p=rotation.replace({...ctx,objective:{allowPositiveRepeatRotation:true}},deck,slots);
 return p.q?{...p,saturatedFamilies:new Set(ctx.exercises.map(fam)).size,saturationGuard:'all catalogue families observed; all concepts >=2 autonomous families and sessions; previous 2 sessions fully independent'}:p;
}
module.exports={saturated,replace};

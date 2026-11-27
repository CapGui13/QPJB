/* V4 #420 — V3 conditional policy with semantic guard for S3.
 * A concept tag does not imply the correct answer is a support bid.
 * The reference curriculum and selection categories remain unchanged.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m1-conditional.js'));else root.QPJBCoherenceM1Fit=factory(root.QPJBCoherenceM1Conditional);})(typeof window==='undefined'?null:window,function(base){
'use strict';
const question=x=>x?.exercise||x;
const meta=(ctx,q)=>ctx.metadataById instanceof Map?ctx.metadataById.get(q?.id):ctx.metadataById?.[q?.id];
const normalized=v=>String(v||'').replace(/[\s\uFE0E\uFE0F]/g,'');
function fitRole(q){
 if(q?.theme!=='majeur'||!Array.isArray(q.auction)||q.auction.length!==1||!Array.isArray(q.shape))return null;
 const opener=String(q.auction[0]).match(/:\s*(1[♥♠])(?:\s|$)/)?.[1];
 if(!opener||q.shape[opener[1]==='♠'?0:1]!==3)return null;
 const bid=normalized(q.answer);
 return bid==='2'+opener[1]?'support-5-3':bid==='Passe'?'passe-avec-fit':null;
}
function compose(ctx={},ranked=[]){
 const best=ranked[0];if(!best?.q)return null;
 const c0=meta(ctx,best.q)?.concept;
 // A substitution must change the actual curricular concept, not merely
 // choose another hand in the same concept (diversity belongs to M4).
 let alternatives=ranked.slice(1).filter(x=>meta(ctx,x.q)?.concept!==c0);
 if(ctx.session===3){
  const selected=(ctx.selected||[]).map(question),roles=selected.map(fitRole);
  const supported=roles.includes('support-5-3'),passed=roles.includes('passe-avec-fit');
  if(fitRole(best.q)==='support-5-3')return null;
  alternatives=alternatives.filter(x=>{
   const role=fitRole(x.q);
   // Never exchange a potential actual support for another weak pass.
   // First actual support, then contrast (one is enough).
   return supported?(!passed&&role==='passe-avec-fit'):role==='support-5-3';
  });
 }
 return base.compose(ctx,[best,...alternatives]);
}
function plan(ctx={}){
 const p=base.plan(ctx);if(!p||ctx.session!==3)return p;
 const roles=(ctx.selected||[]).map(question).map(fitRole);
 return {...p,fitObjective:{supportSelected:roles.includes('support-5-3'),passWithFitSelected:roles.includes('passe-avec-fit'),rule:'Distinguer le fit de la décision de soutenir : soutien 5–3 réel, puis contraste Passe avec fit si éligible. Ne jamais compter un Passe comme un soutien effectué.'}};
}
return Object.freeze({...base,policy:'semantic-fit-v4',compose,plan,fitRole});
});

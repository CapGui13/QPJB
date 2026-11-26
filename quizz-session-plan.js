/* QPJB M3 — planification thématique, sans mutation ni calcul de maîtrise. */
(function(root,factory){
  const policies=typeof module==='object'&&module.exports?
    [require('./quizz-pedagogie-initiation.js'),require('./quizz-pedagogie-intermediaire.js'),require('./quizz-pedagogie-avancee.js')]:
    [root?.QPJBPedagogieInitiation,root?.QPJBPedagogieIntermediaire,root?.QPJBPedagogieAvancee];
  const api=factory(policies);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBSessionPlan=api;
})(typeof window==='undefined'?null:window,function(policies){
  'use strict';
  const FOUNDATIONS=Object.freeze(['ouv','majeur','mineur','sa','red','second','stayman']);
  // Indices zéro. Un intervalle de 10 correspond à 9 séances intermédiaires.
  // Une rubrique jamais exposée garde le délai historique de deux séances.
  function priorityThemes({roadmap,completed,lastTheme,eligibleThemes}){
    if(!Number.isInteger(completed)||completed<0)throw new TypeError('completed');
    const seen=lastTheme||{};
    const eligible=eligibleThemes?new Set(eligibleThemes):null;
    return roadmap.filter(([theme,intro])=>{
      if(completed<intro||(eligible&&!eligible.has(theme)))return false;
      if(!Object.hasOwn(seen,theme))return completed-intro>=2;
      if(!Number.isInteger(seen[theme])||seen[theme]<0||seen[theme]>=completed)return false;
      return completed-seen[theme]>=(FOUNDATIONS.includes(theme)?6:10);
    }).sort(([a,ia],[b,ib])=>
      (completed-(seen[b]??ib-1))-(completed-(seen[a]??ia-1)));
  }
  const pedagogyReady=policies.every((p,i)=>p?.schema==='QPJB_PEDAGOGIE_V1'&&p.phase===['initiation','intermediaire','avancee'][i]&&typeof p.rank==='function');
  function rankPedagogy(context){
    if(!pedagogyReady)throw Error('QPJB pedagogical modules unavailable');
    const s=context.session;
    if(!Number.isInteger(s)||s<1)return [];
    return policies[s<=20?0:s<=65?1:2].rank(context);
  }
  return Object.freeze({schema:'QPJB_SESSION_PLAN_V1',FOUNDATIONS,priorityThemes,pedagogyReady,rankPedagogy});
});

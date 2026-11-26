/* QPJB M3 — planification thématique, sans mutation ni calcul de maîtrise. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBSessionPlan=api;
})(typeof window==='undefined'?null:window,function(){
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
  return Object.freeze({schema:'QPJB_SESSION_PLAN_V1',FOUNDATIONS,priorityThemes});
});

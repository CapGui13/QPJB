/* M1 — protection de la consolidation en cas de difficulté persistante.
 * Pure, sans accès réseau, profil simulé ni modification d'historique.
 * Un bonus facultatif n'est pas appliqué tant que les preuves autonomes
 * récentes sont insuffisantes. Le moteur historique conserve son choix.
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBDurableAdaptationGuard=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const WINDOW=10, MIN_SESSIONS=3, MIN_ANSWERS=20, MIN_SUCCESS=.45;
function evaluate(history){
 const base={allow:false,reason:'historique autonome insuffisant',sessions:0,answers:0,correct:0,rate:null};
 if(!history||!Number.isInteger(history.completed)||history.completed<3||!Array.isArray(history.journal))return base;
 const bySession=new Map();
 for(const e of history.journal){
  if(!e||e.mode!=='parcours'||!Number.isInteger(e.session)||e.session<=history.completed-WINDOW||e.session<1||e.session>history.completed||!Array.isArray(e.answers))continue;
  if(bySession.has(e.session))return {...base,reason:'séance dupliquée ou ambiguë'};
  const seen=new Set(),answers=[];
  for(const a of e.answers){
   if(!a||typeof a.id!=='string'||seen.has(a.id))return {...base,reason:'réponse dupliquée ou ambiguë'};
   seen.add(a.id);
   if(a.assisted===false&&a.hadFreeError===false&&['correct','wrong'].includes(a.result))answers.push(a.result);
  }
  if(answers.length)bySession.set(e.session,answers);
 }
 const values=[...bySession.values()].flat(),correct=values.filter(x=>x==='correct').length,rate=values.length?correct/values.length:null;
 const evidence={sessions:bySession.size,answers:values.length,correct,rate};
 if(evidence.sessions<MIN_SESSIONS||evidence.answers<MIN_ANSWERS)return {...base,...evidence};
 return {...evidence,allow:rate>=MIN_SUCCESS,reason:rate>=MIN_SUCCESS?'preuves autonomes récentes suffisantes':'priorité à la consolidation historique'};
}
return Object.freeze({schema:'QPJB_DURABLE_ADAPTATION_GUARD_V1',evaluate,WINDOW,MIN_SESSIONS,MIN_ANSWERS,MIN_SUCCESS});
});

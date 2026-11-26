/* M1 — progression S1–20, bonus uniquement entre candidats éligibles. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.QPJBPedagogieInitiation=api;})(typeof window==='undefined'?null:window,function factory(){
 'use strict';
 const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const tie=q=>Array.isArray(q.shape)&&q.shape[2]===q.shape[3]&&[3,4].includes(q.shape[2])?String(q.shape[2]):null;
 function rank({session,candidates=[],metadataById={},history={},selected=[],category=null}={}){
  if(!Number.isInteger(session)||session<1||session>20||category==='weakness')return [];
  const chosen=selected.map(x=>x.exercise||x),concept=q=>metadataById[q.id]?.concept;
  const last={},seenFamilies=new Set();
  for(const entry of history.journal||[]){
   if(entry.mode!=='parcours'||!Number.isInteger(entry.session)||entry.session>=session)continue;
   for(const a of entry.answers||[]){const c=metadataById[a.id]?.concept;if(c)last[c]=Math.max(last[c]||0,entry.session);if(a.family)seenFamilies.add(a.family);}
  }
  const selectedConcepts=new Set(chosen.map(concept));
  return candidates.flatMap(q=>{
   const c=concept(q);if(!c)return [];
   let delta=0,reason='';
   if(session===2&&c==='ouv.mineure'){
    const t=tie(q),already=chosen.some(x=>concept(x)===c&&tie(x)===t&&x.answer===q.answer);
    if(t&&!already){delta=100;reason='meilleure_mineure_egalite';}
    else if(already){delta=-30;reason='contraste_meilleure_mineure';}
   }else if(session>=3&&core.has(c)&&last[c]&&!selectedConcepts.has(c)){
    const gap=session-last[c];if(gap>=4&&q.difficulty<=3){delta=Math.min(90,(gap-3)*22);reason='fondamental_a_reinvestir';}
    if(delta&&seenFamilies.has(q.caseFamily||q.id))delta=Math.round(delta/3);
   }
   return delta?[{id:q.id,delta,reason}]:[];
  });
 }
 return Object.freeze({schema:'QPJB_PEDAGOGIE_V1',phase:'initiation',rank});
});

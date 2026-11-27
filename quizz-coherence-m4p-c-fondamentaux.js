'use strict';
function compile(exercises,old,groups){
 const lookup=Object.fromEntries(exercises.map(x=>[x.id,x])),byId={};
 for(const [concept,group,decision,proof,ids] of groups)for(const id of ids.split(" ")){
  const x=lookup[id];if(!x||old[id]?.concept!==concept||byId[id])throw Error("invalid "+id);
  byId[id]={id,concept,family:x.caseFamily,group,decision,proof,status:decision==="HOLD"?"revue_IA_ciblee_HOLD":"revue_IA_ciblee_sans_visa_humain",before:old[id].features.decision,after:{annotation:group,disposition:decision},source:"quizz.html#"+id,hand:x.hand,H:x.h,shape:x.shape,answer:x.answer,auction:x.auction,context:x.context,canonical:x.explain,level:x.difficulty};
 }
 return byId;
}
function compare(byId,a,b){
 const x=byId[a],y=byId[b];if(!x||!y)return {status:"HOLD",type:"non_arbitre"};
 if(a===b)return {status:"structurel",type:"meme_id"};
 if(x.decision==="HOLD"||y.decision==="HOLD")return {status:"HOLD",type:"cas_limite"};
 if(x.group===y.group)return {status:"REVIEW_sans_visa",type:x.decision==="doublon_proche"?"doublon_proche_candidat":"meme_groupe_pas_equivalence",reason:x.proof};
 return {status:"HOLD",type:"groupes_distincts_non_arbitres"};
}
module.exports={compile,compare};

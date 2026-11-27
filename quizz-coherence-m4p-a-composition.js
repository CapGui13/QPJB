'use strict';
// M4-A #446: U/V are isolated proposals for complete-deck composition.
// No production activation; V requires coordinator/M1 approval.
const base=require('./quizz-coherence-m4-diversite.js');
const tRank=require('./quizz-coherence-m4p-a-rank.js').rank;
const family=q=>String(q.caseFamily||q.id);
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const protectedConcept=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const reqKey=m=>JSON.stringify([m.stage,m.minSession,m.requires]);
function rank(ctx={}){
 const {session,policy,category,metadataById:meta={},baselineId,candidates=[],exercises=[],history,selected=[],priority,forcedReason,scores={}}=ctx;
 if(!Number.isInteger(session)||session<3||session>20||history?.active||priority||forcedReason||category!=='discovery'||!['U','V','W','Y'].includes(policy))return [];
 // Before S6 reuse the previously tested same-family policy T, not broader substitution.
 if(session<6)return tRank({...ctx,policy:'T'}).filter(x=>scores[x.id]===scores[baselineId]);
 const old=candidates.find(q=>q.id===baselineId),m=meta[baselineId],f=base.features(old,m);
 if(!f||protectedConcept.has(m.concept)||old.difficulty>3||!Number.isFinite(scores[baselineId]))return [];
 const rest=selected.map(x=>x.exercise||x),features=rest.map(q=>base.features(q,meta[q.id]));
 // Keep two examples of the exact decision/force/distribution; do not reduce
 // a two-example teaching contrast to one, nor remove the first discovery.
 if(features.filter(x=>x?.near===f.near).length<2)return [];
 const journal=(history?.journal||[]).filter(e=>e.mode==='parcours'&&e.session>=session-2&&e.session<session);
 if(journal.length!==2||new Set(journal.map(e=>e.session)).size!==2||journal.some(e=>e.answers?.length!==10||!e.answers.every(clean)))return [];
 const lookup=new Map(exercises.map(q=>[q.id,q]));
 const past=journal.flatMap(e=>e.answers).map(a=>lookup.get(a.id));
 if(past.some(q=>!q))return [];
 const recent=new Set(past.map(q=>base.features(q,meta[q.id])?.near));
 const seen=new Set(rest.map(family)),ids=new Set(rest.map(q=>q.id));
 const out=[];
 for(const q of candidates){
  const n=meta[q.id],v=base.features(q,n),cost=scores[baselineId]-scores[q.id];
  if(!v||q.id===old.id||ids.has(q.id)||seen.has(family(q))||!Number.isFinite(cost)||cost<0||cost>48||
     q.difficulty!==old.difficulty||q.theme==='ouv'&&q.answer==='Passe'||protectedConcept.has(n.concept)||
     features.some(x=>x?.decision===v.decision)||recent.has(v.near))continue;
  if(policy==='U'&&(n.concept!==m.concept||q.theme!==old.theme||reqKey(n)!==reqKey(m)))continue;
  if(policy==='V'&&(n.concept===m.concept||n.stage>m.stage||rest.some(x=>meta[x.id]?.concept===n.concept)||rest.filter(x=>x.theme===q.theme).length>=4))continue;
  // W is a separate proposal: allocate the third redundant example to
  // a decision contrast inside a second concept already present in the deck.
  // Its stage is bounded by the example already selected for that concept.
  // A new concept or advanced stage is never introduced by W.
  if(policy==='W'||policy==='Y'){
   if(n.concept===m.concept||rest.filter(x=>x.theme===q.theme).length>=4)continue;
   const peers=rest.filter(x=>meta[x.id]?.concept===n.concept);
   if(peers.length!==1||n.stage>meta[peers[0].id].stage||
      JSON.stringify(q.auction)!==JSON.stringify(peers[0].auction)||q.answer===peers[0].answer)continue;
   // Y isolates the distribution criterion by matching H exactly. No tuning to simulation seeds.
   if(policy==='Y'&&q.h!==peers[0].h)continue;
  }
  out.push({id:q.id,delta:Math.max(1,48-cost),reason:policy==='Y'?'proposition M1 : contraste de décision à force H égale dans un objectif déjà présent':policy==='W'?'proposition M1 : troisième cas proche remplacé par contraste de décision dans un objectif déjà présent':policy==='U'?'troisième cas proche remplacé par une autre décision du même concept':'proposition M1 : troisième cas proche remplacé par un objectif éligible distinct',cost});
 }
 return out.sort((a,b)=>b.delta-a.delta||a.id.localeCompare(b.id));
}
module.exports=Object.freeze({schema:'QPJB_M4P_A_COMPOSITION_V1',rank});

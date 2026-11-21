'use strict';
/* Projection stable du stockage de test : exclut volontairement les horodatages. */
function projectStorage(raw){
 if(!raw||typeof raw!=='object')throw Error('Snapshot localStorage manquant');
 const parcours=raw.parcours?JSON.parse(raw.parcours):null;
 const records=raw.records?JSON.parse(raw.records):{};
 if(records===null||typeof records!=='object')throw Error('Historique invalide');
 const active=parcours?.active||null;
 const answers=Object.entries(active?.answers||{}).map(([index,item])=>({
  index:String(index),result:item?.result??null,
  choice:item?.choice??null,assisted:Boolean(item?.assisted)
 })).sort((a,b)=>Number(a.index)-Number(b.index));
 const attempts=Object.entries(records).filter(([,item])=>item&&item.seen).map(([id,item])=>({
  id,lastResult:item.lastResult??null,ok:Boolean(item.ok),
  assisted:Boolean(item.assisted),attempts:Number(item.attempts||0),
  correct:Number(item.correct||0),wrong:Number(item.wrong||0),
  skipped:Number(item.skipped||0),
  independentCorrect:Number(item.independentCorrect||0),
  assistedCorrect:Number(item.assistedCorrect||0)
 })).sort((a,b)=>a.id.localeCompare(b.id));
 return {activeIds:Array.isArray(active?.ids)?[...active.ids]:[],
  activeIndex:active?.index??null,
  activeMode:active?.mode??null,answers,attempts};
}
function assertProgressEvidence(projection){
 if(!projection||!Array.isArray(projection.activeIds)||!projection.activeIds.length)
  throw new Error('Aucune séance guidée sauvegardée : comparaison avant/après vide');
 if(!Array.isArray(projection.answers)||projection.answers.length!==1)
  throw new Error('Une réponse enregistrée attendue avant les captures du corrigé');
 if(!Array.isArray(projection.attempts)||projection.attempts.length<1)
  throw new Error('Historique de tentative absent du stockage');
 return true;
}
module.exports={projectStorage,assertProgressEvidence};

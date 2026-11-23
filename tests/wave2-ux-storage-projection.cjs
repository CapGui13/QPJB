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
  choice:item?.choice??null,assisted:Boolean(item?.assisted),
  hadFreeError:Boolean(item?.hadFreeError)
 })).sort((a,b)=>Number(a.index)-Number(b.index));
 const attempts=Object.entries(records).filter(([,item])=>item&&item.seen).map(([id,item])=>({
  id,lastResult:item.lastResult??null,ok:Boolean(item.ok),
  assisted:Boolean(item.assisted),attempts:Number(item.attempts||0),
  correct:Number(item.correct||0),wrong:Number(item.wrong||0),
  skipped:Number(item.skipped||0),
  independentCorrect:Number(item.independentCorrect||0),
  assistedCorrect:Number(item.assistedCorrect||0),
  history:Array.isArray(item.history)?item.history.map(h=>({
   result:h?.result??null,choice:h?.choice??null,mode:h?.mode??null,
   assisted:Boolean(h?.assisted),firstGuess:h?.firstGuess??null,
   hadFreeError:Boolean(h?.hadFreeError)
  })):[]
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
 const answer=projection.answers[0],index=Number(answer.index);
 if(!Number.isInteger(index)||index<0||index>=projection.activeIds.length||
    !['correct','wrong','skipped'].includes(answer.result))
  throw new Error('Réponse sauvegardée hors séance ou résultat invalide');
 const answeredId=projection.activeIds[index];
 const attempt=projection.attempts.find(r=>r.id===answeredId);
 if(typeof answeredId!=='string'||!answeredId||
    !attempt||attempt.lastResult!==answer.result)
  throw new Error('Historique sans tentative correspondant à la réponse sauvegardée');
 // En comparatif visuel, un état neuf doit garder la trace de l'action
 // effective, et pas seulement des compteurs de synthèse concordants.
 const latest=attempt.history?.at(-1);
 if(!latest||latest.result!==answer.result||
    latest.choice!==answer.choice||latest.assisted!==answer.assisted||
    latest.hadFreeError!==answer.hadFreeError)
  throw new Error('Historique détaillé incohérent avec la réponse sauvegardée');
 return true;
}
module.exports={projectStorage,assertProgressEvidence};

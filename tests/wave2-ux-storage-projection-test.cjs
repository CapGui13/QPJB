'use strict';
const assert=require('node:assert/strict');
const {projectStorage,assertProgressEvidence}=require('./wave2-ux-storage-projection.cjs');
const mk=(choice,at)=>({
 parcours:JSON.stringify({active:{ids:['EX-1','EX-2'],index:0,mode:'normal',
  startedAt:at,answers:{0:{result:'correct',choice,assisted:true,hadFreeError:false,at}}}}),
 records:JSON.stringify({'EX-1':{seen:true,lastResult:'correct',ok:false,assisted:true,
  attempts:1,correct:1,wrong:0,skipped:0,independentCorrect:0,assistedCorrect:1,
  history:[{result:'correct',choice,mode:'qcm',assisted:true,firstGuess:null,hadFreeError:false,at}]}})
});
const old=projectStorage(mk('1♣','2026-11-20T00:00:00Z'));
const newer=projectStorage(mk('1♣','2026-11-21T00:00:00Z'));
assert.deepEqual(old,newer,'Seuls les horodatages varient entre deux captures');
const altered=projectStorage(mk('1♦','2026-11-21T00:00:00Z'));
assert.notDeepEqual(old,altered,'Une modification de choix ne peut pas être masquée');
assert.equal(assertProgressEvidence(old),true,'Le résultat réel est non vide');
assert.throws(()=>assertProgressEvidence(projectStorage({parcours:null,records:null})),
 /Aucune séance guidée sauvegardée/,
 'Deux stockages vides ne doivent pas passer comme identiques');
const missingAnswer=projectStorage(mk('1♣','2026-11-21T00:00:00Z'));
missingAnswer.answers=[];
assert.throws(()=>assertProgressEvidence(missingAnswer),/Une réponse enregistrée attendue/);
const missingAttempt=projectStorage(mk('1♣','2026-11-21T00:00:00Z'));
missingAttempt.attempts=[];
assert.throws(()=>assertProgressEvidence(missingAttempt),/Historique de tentative absent/);
assert.equal(old.activeIndex,0);
assert.equal(old.activeIds.length,2);
assert.equal(old.attempts.length,1);
assert.equal(projectStorage({parcours:null,records:null}).attempts.length,0);
assert.throws(()=>projectStorage({parcours:'{invalid',records:'{}'}),'JSON de sauvegarde corrompu rejeté');
const freeError=mk('1♣','2026-11-21T00:00:00Z');
const freeState=JSON.parse(freeError.parcours);
freeState.active.answers[0].hadFreeError=true;
freeError.parcours=JSON.stringify(freeState);
assert.notDeepEqual(old,projectStorage(freeError),
 'Une première enchère libre erronée ne doit pas être masquée');
const guessError=mk('1♣','2026-11-21T00:00:00Z');
const guessState=JSON.parse(guessError.records);
guessState['EX-1'].history[0].firstGuess='1♦';
guessError.records=JSON.stringify(guessState);
assert.notDeepEqual(old,projectStorage(guessError),
 'Une première enchère historique différente ne doit pas être masquée');
const unrelated=mk('1♣','2026-11-21T00:00:00Z');
const unrelatedRecords=JSON.parse(unrelated.records);
unrelatedRecords['EX-X']=unrelatedRecords['EX-1'];delete unrelatedRecords['EX-1'];
unrelated.records=JSON.stringify(unrelatedRecords);
assert.throws(()=>assertProgressEvidence(projectStorage(unrelated)),
 /Historique sans tentative correspondant/,
 'Une tentative appartenant à une autre question ne prouve pas la sauvegarde');
const contrary=mk('1♣','2026-11-21T00:00:00Z');
const contraryRecords=JSON.parse(contrary.records);
contraryRecords['EX-1'].lastResult='wrong';
contrary.records=JSON.stringify(contraryRecords);
assert.throws(()=>assertProgressEvidence(projectStorage(contrary)),
 /Historique sans tentative correspondant/,
 'Le résultat du quiz et celui du parcours doivent correspondre');
// Les synthèses peuvent être identiques alors que la trace réelle a disparu.
const historyGone=mk('1♣','2026-11-21T00:00:00Z');
const recordsWithoutHistory=JSON.parse(historyGone.records);
recordsWithoutHistory['EX-1'].history=[];
historyGone.records=JSON.stringify(recordsWithoutHistory);
assert.throws(()=>assertProgressEvidence(projectStorage(historyGone)),
 /Historique détaillé incohérent/, 'La trace de la réponse ne peut pas être vide');
const historyChoiceChanged=mk('1♣','2026-11-21T00:00:00Z');
const recordsWrongChoice=JSON.parse(historyChoiceChanged.records);
recordsWrongChoice['EX-1'].history[0].choice='1♦';
historyChoiceChanged.records=JSON.stringify(recordsWrongChoice);
assert.throws(()=>assertProgressEvidence(projectStorage(historyChoiceChanged)),
 /Historique détaillé incohérent/, 'La dernière enchère doit correspondre');
const historyAssistanceChanged=mk('1♣','2026-11-21T00:00:00Z');
const recordsWrongAssistance=JSON.parse(historyAssistanceChanged.records);
recordsWrongAssistance['EX-1'].history[0].assisted=false;
historyAssistanceChanged.records=JSON.stringify(recordsWrongAssistance);
assert.throws(()=>assertProgressEvidence(projectStorage(historyAssistanceChanged)),
 /Historique détaillé incohérent/, 'La présence d’aide ne doit pas être perdue');
const historyFreeErrorChanged=mk('1♣','2026-11-21T00:00:00Z');
const recordsWrongFreeError=JSON.parse(historyFreeErrorChanged.records);
recordsWrongFreeError['EX-1'].history[0].hadFreeError=true;
historyFreeErrorChanged.records=JSON.stringify(recordsWrongFreeError);
assert.throws(()=>assertProgressEvidence(projectStorage(historyFreeErrorChanged)),
 /Historique détaillé incohérent/, 'La première erreur libre doit rester cohérente');
console.log('PASS M3 stockage projeté : dates neutralisées, cohérence des traces, 8 contre-épreuves');

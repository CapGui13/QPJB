'use strict';
const assert=require('node:assert/strict');
const {projectStorage,assertProgressEvidence}=require('./wave2-ux-storage-projection.cjs');
const mk=(choice,at)=>({
 parcours:JSON.stringify({active:{ids:['EX-1','EX-2'],index:0,mode:'normal',
  startedAt:at,answers:{0:{result:'correct',choice,assisted:true,at}}}}),
 records:JSON.stringify({'EX-1':{seen:true,lastResult:'correct',ok:false,assisted:true,
  attempts:1,correct:1,wrong:0,skipped:0,independentCorrect:0,assistedCorrect:1,
  history:[{result:'correct',at}]}})
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
console.log('PASS M3 stockage projeté : temps neutralisé, choix conservé, JSON corrompu rejeté');

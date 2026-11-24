'use strict';
// Vérification en lecture seule : aucune écriture dans quizz.html ni publication.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const patchPath = path.join(root, 'audits/references/v2/PARCOURS_V2_CORRECTIONS_4_QCM_HOLD_20261120.json');
const expectedBlob = 'dfd1f21dfc3c2256b066b36b777c437d2973e895';
const expectedMain = 'a0ffaed6e49ab7259de800773a4ee384be755339';
const expectedModified = ['SEF-V416-008','SEF-V416-009','SEF-L25-007'].sort();
const allowed = new Map([
  ['SEF-V416-008', ['answer','choices','context','explain']],
  ['SEF-V416-009', ['answer','choices','context','explain']],
  ['SEF-L25-007', ['explain']],
  ['SEF-L06-029', []]
]);
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function catalogue(html, marker, field) {
  const first=html.indexOf(marker);
  assert.ok(first>=0 && html.indexOf(marker,first+marker.length)===-1,'Bloc source absent/dupliqué');
  const last=html.indexOf('</script>',first+marker.length);
  assert.ok(last>first,'Bloc source incomplet');
  const payload=JSON.parse(html.slice(first+marker.length,last));
  return payload[field];
}
function review(items, patch) {
  assert.equal(patch.schema,'QPJB_V2_EDITORIAL_PATCH_PROPOSAL_1');
  assert.equal(patch.publicReferenceCommit,expectedMain);
  assert.equal(patch.sourceQuestionCount,1523);
  assert.equal(patch.sourceEdited,false);
  assert.equal(patch.approved,false);
  assert.equal(patch.releaseDecision,'HOLD');
  assert.equal(patch.pedagogicalApproval,'APPROVED_BY_USER');
  assert.equal(patch.approvedForPublication,false);
  assert.equal(patch.pedagogicallyApprovedQuestionCount,19);
  assert.equal(items.length,1523);
  const byId=new Map(items.map(q=>[q.id,q]));
  const ledger=JSON.parse(fs.readFileSync(path.join(root,
    'audits/references/v2/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json'),'utf8'));
  assert.equal(ledger.caseDecisions.length,19,'La validation de 19 QCM est requise');
  assert.equal(ledger.pedagogicalApproval.status,'APPROVED_BY_USER');
  assert.equal(ledger.approvedForPublication,false);
  assert.equal(ledger.releaseDecision,'HOLD');
  const validated=new Map(ledger.caseDecisions.map(c=>[c.id,c]));
  assert.equal(validated.size,19,'Une décision par QCM');
  for(const [id,c] of validated){
    assert.equal(c.approval,'APPROVED_BY_USER','Décision non approuvée : '+id);
    const source=byId.get(id);
    assert.ok(source,'QCM approuvé absent : '+id);
    if(c.sourceAnswerUnchanged===true){
      assert.equal(c.decision,'CONSERVER_REPONSE_ORIGINALE');
      assert.equal(c.approvedAnswer,source.answer,'Corrigé modifié : '+id);
    }
  }
  assert.equal([...validated.values()].filter(c=>c.sourceAnswerUnchanged===true).length,15,
    '15 corrigés approuvés inchangés attendus');
  for(const id of allowed.keys()){
    const d=validated.get(id);
    assert.ok(d,'Décision manquante pour '+id);
    assert.equal(d.approvedAnswer,id==='SEF-L06-029'?byId.get(id).answer:
      id==='SEF-L25-007'?byId.get(id).answer:patch.proposedPatches.find(e=>e.id===id).proposedChanges.answer);
  }
  assert.equal(validated.get('SEF-L06-029').approvedLearningCategory,
    'Ouvertures conventionnelles / barrages');
  assert.equal(byId.size,1523,'Doublon ID');
  assert.equal(patch.proposedPatches.length,4);
  const changes=new Map();
  for(const entry of patch.proposedPatches){
    assert.ok(allowed.has(entry.id),'ID hors périmètre : '+entry.id);
    assert.ok(!changes.has(entry.id),'Patch en double : '+entry.id);
    assert.equal(entry.editorialApproval,'APPROVED_BY_USER');
    const before=byId.get(entry.id);
    assert.ok(before,'ID original absent : '+entry.id);
    assert.equal(sha256(JSON.stringify(before)),entry.originalQuestionSHA256,
      'Exercice original modifié : '+entry.id);
    const fields=Object.keys(entry.proposedChanges).sort();
    assert.deepEqual(fields,allowed.get(entry.id).slice().sort(),
      'Champs ajoutés/retirés sans validation : '+entry.id);
    assert.deepEqual(fields,entry.affectedFields.slice().sort());
    changes.set(entry.id,entry.proposedChanges);
  }
  assert.deepEqual([...changes.keys()].sort(),[...allowed.keys()].sort());
  assert.equal(patch.proposedClassification.id,'SEF-L06-029');
  assert.equal(patch.proposedClassification.sourceThemeUnchanged,'sa');
  assert.equal(patch.proposedClassification.editorialApproval,'APPROVED_BY_USER');
  assert.equal(byId.get('SEF-L06-029').theme,'sa');
  const proposed=items.map(q=>changes.has(q.id)?{...q,...changes.get(q.id)}:q);
  assert.equal(proposed.length,1523);
  const modified=[];
  for(let i=0;i<items.length;i++){
    const a=items[i],b=proposed[i];
    assert.equal(a.id,b.id);
    assert.deepEqual(a.hand,b.hand,'Main modifiée : '+a.id);
    assert.equal(a.h,b.h,'Points H modifiés : '+a.id);
    assert.deepEqual(a.auction,b.auction,'Enchères modifiées : '+a.id);
    assert.equal(a.theme,b.theme,'Thème source modifié : '+a.id);
    assert.ok(b.choices.includes(b.answer),'Réponse absente des choix : '+a.id);
    assert.equal(new Set(b.choices).size,b.choices.length,'Choix en doublon : '+a.id);
    if(JSON.stringify(a)!==JSON.stringify(b)) modified.push(a.id);
  }
  assert.deepEqual(modified.sort(),expectedModified);
  assert.deepEqual(patch.hypotheticalModifiedIDs.slice().sort(),expectedModified);
  return {count:items.length,reviewed:patch.proposedPatches.length,
    modifiedIfApproved:modified,sourceEdited:false,releaseDecision:'HOLD'};
}
function main(){
  const args=process.argv.slice(2);
  let items;
  if(args.length===0){
    // Expérience historique HOLD : lire le commit immuable, pas la V1 actuelle.
    // Le SHA du blob original reste contrôlé ci-dessous.
    const bytes=require('node:child_process').execFileSync('git',['show',expectedMain+':quizz.html'],{cwd:root,maxBuffer:8*1024*1024});
    const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
    assert.equal(sha,expectedBlob,'Le blob historique diffère du commit public épinglé');
    items=catalogue(bytes.toString('utf8'),'<script id="training-data" type="application/json">','exercises');
  }else if(args.length===2 && args[0]==='--fixture-eleve'){
    const bytes=fs.readFileSync(args[1]);
    assert.equal(sha256(bytes),'c478dd2d24c13e2e706cbdc168b7a822258f9fe1c09c65cf44cb75516c29d879',
      'Fixture élève inconnue');
    items=catalogue(bytes.toString('utf8'),'<script id="ay-payload" type="application/json">','catalog');
  }else throw new Error('Usage: node scripts/v2-editorial-dry-run.cjs [--fixture-eleve FICHIER_HTML]');
  const patch=JSON.parse(fs.readFileSync(patchPath,'utf8'));
  console.log('QPJB V2 EDITORIAL READ-ONLY '+JSON.stringify(review(items,patch)));
}
if(require.main===module) main();
module.exports={review,catalogue};

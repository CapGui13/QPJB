'use strict';
/* QPJB phase O : vérifier le décalage sémantique dans la cartographie
   et l'intégrité de 12 exemples face à un Contre réellement adverse.
   Pas de réécriture des QCM, aucune activation pédagogique. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const file=p=>JSON.parse(fs.readFileSync(path.join(root,'Docs',p),'utf8'));
const K=file('PARCOURS_V2_PHASE_K_FONDATIONS_CARTOGRAPHIE_20261118.json');
const L=file('PARCOURS_V2_PHASE_L_EXTENSION_FONDATIONS_20261118.json');
const O=file('PARCOURS_V2_PHASE_O_CONTRE_ADVERSE_AUDIT_20261118.json');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const marker='<script id="training-data" type="application/json">';
const i=html.indexOf(marker),j=html.indexOf('</script>',i+marker.length);
assert.ok(i>=0&&j>i);
const orig=JSON.parse(html.slice(i+marker.length,j)).exercises;
assert.equal(orig.length,1523);
const byId=new Map(orig.map(q=>[q.id,q]));
assert.equal(byId.size,orig.length);
assert.equal(O.schema,'QPJB_V2_O_CONTRE_ADVERSE_SOURCES_20261118_1');
assert.equal(O.status,'AUDIT_SEMANTIQUE_CANDIDAT_NON_ACTIF');
assert.equal(O.noMasteryInference,true);
assert.equal(O.unlocksEnabled,false);
assert.equal(O.pedagogicalReviewRequired,true);
const f=K.foundations.find(x=>x.id==='fondation:intervention');
const more=L.groups.find(x=>x.foundationId===f.id);
assert.ok(f&&more);
const prior=[...f.evidence,...more.evidence];
assert.equal(prior.length,13);
assert.equal(O.existingEvidenceCount,13);
assert.deepEqual(new Set(O.existingThemes),new Set(['intervenir']));
assert.deepEqual(O.proposedSplit[0].originalEvidenceIds,
  prior.map(e=>e.id));
for(const e of prior){
  const q=byId.get(e.id);
  assert.ok(q&&q.theme==='intervenir','Les anciens QCM concernent les actions d intervention');
  assert.ok(!(q.auction||[]).some(a=>/^Adversaire\s*:\s*Contre\b/i.test(a)),
    'Contre adverse inattendu dans les anciennes preuves : '+e.id);
}
assert.equal(O.sourceCandidates.length,12);
assert.deepEqual(O.proposedSplit[1].candidateEvidenceIds,O.sourceCandidates.map(e=>e.id));
assert.equal(new Set(O.sourceCandidates.map(e=>e.id)).size,12);
assert.equal(new Set(O.sourceCandidates.map(e=>e.family)).size,12);
for(const e of O.sourceCandidates){
  const q=byId.get(e.id);
  assert.ok(q,'QCM original absent: '+e.id);
  assert.equal(q.theme,'apres_inter','Rubrique incorrecte: '+e.id);
  assert.equal(q.theme,e.theme);
  assert.equal(q.answer,e.answer);
  assert.equal(q.difficulty,e.difficulty);
  assert.equal(q.difficultyReason,e.editorialReason);
  assert.equal(String(q.caseFamily||q.id),e.family);
  assert.deepEqual(q.auction,e.auction);
  assert.ok(e.auction.some(a=>/^Adversaire\s*:\s*Contre\b/i.test(a)),
    'Pas de contre adverse dans '+e.id);
  assert.ok(e.auction.some(a=>/^Partenaire\s*:\s*1[♣♦♥♠]/.test(a)),
    'Pas ouverture partenaire suivie de contre '+e.id);
}
assert.ok(O.sourceCandidates.some(e=>e.answer==='Passe'));
assert.ok(O.sourceCandidates.some(e=>e.answer==='Surcontre'));
assert.ok(O.sourceCandidates.some(e=>e.answer==='2SA'));
assert.ok(O.sourceCandidates.some(e=>e.answer==='2♥'||e.answer==='2♠'));
console.log('QPJB V2 O PASS : 13 QCM intervention ≠ contre adverse, 12 QCM concordants et familles distinctes, aucune mutation');

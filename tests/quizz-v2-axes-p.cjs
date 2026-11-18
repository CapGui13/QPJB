'use strict';
/* QPJB V2-P : couche de lecture sémantique, sans moteur de déblocage.
 * Vérifie les 16 axes candidats et les 122 QCM originaux.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const doc=n=>JSON.parse(fs.readFileSync(path.join(root,'Docs',n),'utf8'));
const K=doc('PARCOURS_V2_PHASE_K_FONDATIONS_CARTOGRAPHIE_20261118.json');
const L=doc('PARCOURS_V2_PHASE_L_EXTENSION_FONDATIONS_20261118.json');
const O=doc('PARCOURS_V2_PHASE_O_CONTRE_ADVERSE_AUDIT_20261118.json');
const P=doc('PARCOURS_V2_PHASE_P_AXES_SEMANTIQUES_20261118.json');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Catalogue original non trouvé');
const catalog=JSON.parse(html.slice(start+tag.length,end));
const byId=new Map(catalog.exercises.map(x=>[x.id,x]));
assert.equal(catalog.exercises.length,1523);
assert.equal(byId.size,1523);
assert.equal(P.schema,'QPJB_V2_PHASE_P_AXES_SEMANTIQUES_20261118_1');
assert.equal(P.previousFoundations,15);
assert.equal(P.proposedAxes,16);
assert.equal(P.proposedAssociations,134);
assert.equal(P.uniqueCatalogQcm,122);
assert.equal(P.publicRuntimeWired,false);
assert.equal(P.masteryInferenceEnabled,false);
assert.equal(P.unlockEngineEnabled,false);
assert.equal(P.gradingEnabled,false);
assert.equal(P.axes.length,16);
const oldById=new Map(K.foundations.map(f=>[f.id,f]));
const extraById=new Map(L.groups.map(x=>[x.foundationId,x]));
const seen=new Set(),all=[],ids=new Set();
for(const axis of P.axes){
  assert.ok(axis.id&&axis.label);
  assert.ok(!seen.has(axis.id),'Axe doublé '+axis.id);
  seen.add(axis.id);
  assert.equal(axis.publicationAllowed,false);
  assert.equal(axis.automaticMasteryAllowed,false);
  assert.equal(axis.editorialReviewRequired,true);
  assert.equal(new Set(axis.sourceIds).size,axis.sourceIds.length,'Question doublée dans axe '+axis.id);
  let original;
  if(axis.id==='fondation:reponse_contre_adverse'){
    assert.equal(axis.kind,'AJOUT_CANDIDAT_APRES_AUDIT_O');
    assert.equal(axis.originalLabel,null);
    assert.equal(axis.coverageStatus,'A_ARBITRER');
    assert.deepEqual(axis.sourceIds,O.sourceCandidates.map(x=>x.id));
    original=O.sourceCandidates.map(x=>({id:x.id,caseFamily:x.family}));
    assert.equal(axis.distinctSourceFamilies,12);
  }else{
    const old=oldById.get(axis.id);
    assert.ok(old,'Axe inventé sans origine '+axis.id);
    const more=extraById.get(axis.id)?.evidence||[];
    original=[...old.evidence,...more];
    assert.deepEqual(axis.sourceIds,original.map(x=>x.id));
    assert.equal(axis.originalLabel,old.label);
    assert.equal(axis.coverageStatus,old.coverageStatus);
    if(axis.id==='fondation:intervention'){
      assert.equal(axis.label,'Choisir son intervention sur l’ouverture adverse');
      assert.equal(axis.kind,'RENOMMAGE_SEMANTIQUE_CANDIDAT');
      assert.equal(axis.sourceIds.length,13);
    }else{
      assert.equal(axis.label,old.label,'Libellé non autorisé '+axis.id);
      assert.equal(axis.kind,'REPRISE_A_L_IDENTIQUE');
    }
  }
  const fam=new Set();
  for(const item of original){
    const q=byId.get(item.id);
    assert.ok(q,'QCM non trouvé '+item.id);
    assert.equal(String(q.caseFamily||q.id),item.caseFamily);
    if(axis.id==='fondation:reponse_contre_adverse'){
      assert.equal(q.theme,'apres_inter');
      assert.ok((q.auction||[]).some(x=>x.startsWith('Adversaire : Contre')),
        'Le Contre doit venir de l adversaire: '+q.id);
    }
    if(axis.id==='fondation:intervention'){
      assert.equal(q.theme,'intervenir','Intervention de notre camp attendue: '+q.id);
      assert.ok(!(q.auction||[]).some(x=>x.startsWith('Adversaire : Contre')));
    }
    fam.add(String(q.caseFamily||q.id));
    all.push(q.id);ids.add(q.id);
  }
  assert.equal(axis.distinctSourceFamilies,fam.size);
}
assert.equal(oldById.size,15);
assert.equal(seen.size,16);
assert.equal(all.length,134);
assert.equal(ids.size,122);
assert.equal(P.axes.filter(x=>x.kind==='RENOMMAGE_SEMANTIQUE_CANDIDAT').length,1);
assert.equal(P.axes.filter(x=>x.kind==='AJOUT_CANDIDAT_APRES_AUDIT_O').length,1);
const oldIds=new Set([...K.foundations.flatMap(x=>x.evidence.map(e=>e.id)),
  ...L.groups.flatMap(x=>x.evidence.map(e=>e.id))]);
assert.equal(oldIds.size,110);
assert.equal([...ids].filter(id=>!oldIds.has(id)).length,12);
console.log('QPJB V2 P PASS : 16 axes candidats, 122 QCM, 134 rattachements, seul 1 renommage et 1 ajout, aucune activation');

'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const source=read('audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json');
const review=read('audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json');
assert.equal(review.readOnly,true);assert.equal(review.publicationAllowed,false);
assert.equal(review.certifiedCount,0);assert.equal(review.assignmentsCount,48);
assert.equal(review.rows.length,48);assert.equal(review.proposedGroups.length,12);
const src=new Map(source.rows.filter(x=>x.theme==='apres_fit').map(x=>[x.id,x]));
assert.equal(src.size,48);
const v={A:4,R:3,D:2,V:1},seen=new Set(),cats=new Map(review.proposedGroups.map(x=>[x.key,x]));
for(const r of review.rows){
 assert.ok(src.has(r.id),'Absent de la file des 541 '+r.id);
 assert.ok(!seen.has(r.id),'Doublon '+r.id);seen.add(r.id);
 const s=src.get(r.id);
 assert.equal(r.review,'PROPOSITION_A_VALIDER_PEDAGOGIQUEMENT');
 assert.equal(r.structural,'VERIFIE');
 assert.equal(r.candidateLabel,cats.get(r.candidateKey)?.label);
 const correspondence={sourceTheme:s.theme,sourceFamily:s.caseFamily,sourceAnswer:s.originalAnswer,sourceHand:s.hand,
  sourceH:s.h,sourceShape:s.shape,sourceAuction:s.auction,sourceContext:s.context,sourceChoices:s.choices,
  sourceExplanation:s.explain};
 for(const [k,x] of Object.entries(correspondence))assert.deepEqual(r[k],x,r.id+' / '+k);
 assert.equal(r.sourceHand.flat().length,13);
 assert.deepEqual(r.sourceHand.map(c=>c.length),r.sourceShape);
 assert.equal(r.sourceHand.flat().reduce((n,x)=>n+(v[x]||0),0),r.sourceH);
 assert.equal(new Set(r.sourceChoices).size,r.sourceChoices.length);
 assert.equal(r.sourceChoices.filter(x=>x===r.sourceAnswer).length,1);
 assert.ok(cats.get(r.candidateKey)?.ids.includes(r.id),'Catégorie différente pour '+r.id);
}
assert.deepEqual([...src.keys()].sort(),[...seen].sort());
assert.deepEqual(review.proposedGroups.map(x=>x.count),[4,4,4,7,4,4,6,4,3,4,3,1]);
assert.deepEqual(review.alerts,{
 SOUTIEN_SIMPLE_5H_SANS_COURTE_A_EXPERTISER:7,
 CONSIGNE_ESSAI_TROP_GENERIQUE:8,
 CAS_COMPETITIF_MICH_A_ISOLER:1
});
for(const [k,v] of Object.entries(review.alerts))
 assert.equal(review.rows.filter(x=>x.flags.includes(k)).length,v,'Décompte flag '+k);
console.log('QPJB V1 APRES FIT PASS : 48 cas, 12 categories candidates, 7 seuils de soutien à vérifier.');
console.log('0 compétence homologuée ; 0 correction, moteur ou progression modifiés.');

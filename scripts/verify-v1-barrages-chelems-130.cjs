'use strict';
// Audit V1 en lecture seule. Une structure cohérente ne valide pas le SEF ni les corrections.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const source=read('audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json');
const afterFit=read('audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json');
const files={
 barrage:'audits/QPJB_V1_BARRAGE_65_PRECLASSIFICATION_20261120.json',
 chelem:'audits/QPJB_V1_CHELEM_65_PRECLASSIFICATION_20261120.json'
};
const values={A:4,R:3,D:2,V:1};
const original=new Map(source.rows.map(x=>[x.id,x]));
assert.equal(source.count,541);
assert.equal(original.size,541);
const allIDs=new Set(afterFit.rows.map(x=>x.id));
assert.equal(afterFit.rows.length,48);assert.equal(allIDs.size,48);
for(const [theme,file] of Object.entries(files)){
  const data=read(file),existing=source.rows.filter(x=>x.theme===theme);
  const groups=new Map(data.groups.map(x=>[x.key,x]));
  assert.equal(existing.length,65,'65 originaux attendus '+theme);
  assert.equal(data.readOnly,true);
  assert.equal(data.publicationAllowed,false);
  assert.equal(data.validatedCount,0);
  assert.equal(data.sourceCount,65);
  assert.equal(data.rows.length,65);
  assert.equal(groups.size,theme==='barrage'?17:16);
  assert.equal(data.proposedSkills,groups.size);
  assert.equal(data.sourceFamilies,new Set(existing.map(x=>x.caseFamily)).size);
  const seen=new Set();
  for(const item of data.rows){
    assert.equal(item.theme,theme);
    assert.equal(item.classificationStatus,'PROPOSITION_NON_HOMOLOGUEE');
    assert.equal(item.structuralReview,'OK');
    assert.ok(!seen.has(item.id),'Doublon '+item.id);
    assert.ok(!allIDs.has(item.id),'Chevauchement avec autre thème '+item.id);
    seen.add(item.id);allIDs.add(item.id);
    const q=original.get(item.id);
    assert.ok(q,'Question absente du catalogue '+item.id);
    assert.equal(q.theme,theme);
    const grp=groups.get(item.candidateSkill);
    assert.ok(grp,'Compétence introuvable '+item.candidateSkill);
    assert.equal(grp.label,item.candidateLabel);
    assert.ok(grp.ids.includes(item.id),'ID absent du groupe '+item.id);
    assert.equal(grp.status,'A_VALIDER_SEF');
    assert.deepEqual(item.sourceV1,{
      id:q.id,theme:q.theme,caseFamily:q.caseFamily,h:q.h,shape:q.shape,
      hand:q.hand,auction:q.auction,context:q.context,choices:q.choices,
      answer:q.originalAnswer,explain:q.explain,difficulty:q.difficulty,difficultyReason:q.difficultyReason
    },'Snapshot différent '+item.id);
    const hand=q.hand,shape=hand.map(x=>x.length);
    assert.equal(hand.flat().length,13,'13 cartes '+item.id);
    assert.deepEqual(shape,q.shape,'Distribution '+item.id);
    assert.equal(hand.flat().reduce((n,c)=>n+(values[c]||0),0),q.h,'Points H '+item.id);
    assert.equal(new Set(q.choices).size,q.choices.length,'Choix doublés '+item.id);
    assert.equal(q.choices.filter(x=>x===q.originalAnswer).length,1,'Correction absente '+item.id);
  }
  assert.deepEqual([...seen].sort(),existing.map(x=>x.id).sort(),'Couverture partielle '+theme);
  let expectedTotal=0;
  const uniqueGroupID=new Set();
  for(const group of groups.values()){
    assert.equal(group.ids.length,group.count);
    for(const id of group.ids){expectedTotal++;assert.ok(!uniqueGroupID.has(id),'Double rattachement '+id);uniqueGroupID.add(id);}
  }
  assert.equal(expectedTotal,65);
  assert.deepEqual([...uniqueGroupID].sort(),[...seen].sort());
  const countFlag=k=>data.rows.filter(r=>r.flags.includes(k)).length;
  if(theme==='barrage'){
    assert.equal(data.sourceFamilies,52);
    assert.equal(countFlag('VARIANTE_MEME_FAMILLE_SOURCE'),26);
    assert.equal(countFlag('RELAIS_2SA_SEF_2024_EXPERTISE'),6);
    assert.equal(countFlag('THEME_TRANSVERSAL_GAMBLING_3SA'),6);
    assert.equal(countFlag('BARRAGE_QUATRIEME_POSITION'),1);
  }else{
    assert.equal(data.sourceFamilies,65);
    assert.equal(countFlag('VARIANTES_DE_CONTROLES_PROCHES'),16);
    assert.equal(countFlag('SENS_DE_5SA_DEPEND_SEQUENCE'),7);
    assert.equal(countFlag('QUESTION_DAME_PALIER_FORCE_CHELEM'),2);
  }
  console.log('QPJB V1 '+theme.toUpperCase()+' PASS: 65/65 identifiants, '+groups.size+' catégories proposées, 0 validée');
}
const unclassified=source.rows.filter(x=>!allIDs.has(x.id));
assert.equal(allIDs.size,178,'48 + 65 + 65 doivent être distincts');
assert.equal(unclassified.length,363,'541 - 48 - 130 doivent rester à classifier');
assert.equal(unclassified.every(x=>!['apres_fit','barrage','chelem'].includes(x.theme)),true);
const candidate79=read('audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json');
assert.equal(candidate79.rows.length,79);
assert.equal(903+candidate79.rows.length+allIDs.size+unclassified.length,1523);
console.log('COUVERTURE V1 PASS : 903 heuristiques + 79 propositions SA + 178 propositions suppl. + 363 sans proposition = 1523');
console.log('Aucun QCM, correction ou sauvegarde modifié ; aucune compétence homologuée automatiquement.');

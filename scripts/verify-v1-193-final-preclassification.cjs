'use strict';
// Audit de classification : lecture seule. N'homologue aucune règle SEF.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const source=read('audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json');
const proposal=read('audits/QPJB_V1_193_GROUPES_CANDIDATS_20261120.json');
assert.equal(source.count,541);assert.equal(source.rows.length,541);
assert.equal(proposal.count,193);assert.equal(proposal.status,'PROPOSITIONS_NON_HOMOLOGUEES');
const byId=new Map(source.rows.map(x=>[x.id,x]));assert.equal(byId.size,541);
const previous=[
 ['apres_fit','audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json',48],
 ['barrage','audits/QPJB_V1_BARRAGE_65_PRECLASSIFICATION_20261120.json',65],
 ['chelem','audits/QPJB_V1_CHELEM_65_PRECLASSIFICATION_20261120.json',65],
 ['reponse_inter','audits/QPJB_V1_REPONSE_INTER_67_PRECLASSIFICATION_20261120.json',67],
 ['forcing','audits/QPJB_V1_FORCING_54_PRECLASSIFICATION_20261120.json',54],
 ['rubensohl','audits/QPJB_V1_RUBENSOHL_49_PRECLASSIFICATION_20261120.json',49]
];
const allocated=new Set();
for(const [theme,file,n] of previous){
 const obj=read(file);assert.equal(obj.rows.length,n,'Dossier historique '+theme);
 for(const x of obj.rows){
  assert.ok(!allocated.has(x.id),'Dossier historique dupliqué '+x.id);
  allocated.add(x.id);assert.equal(byId.get(x.id)?.theme,theme);
 }
}
assert.equal(allocated.size,348);
const vals={A:4,R:3,D:2,V:1},expected={fortes:42,drury:40,michaels:40,roudi:38,multilandy:31,ouv:1,apres_inter:1};
let grand=0,skillTotal=0;
for(const [theme,num] of Object.entries(expected)){
 const path='audits/QPJB_V1_FINAL_'+theme.toUpperCase()+'_'+num+'_PRECLASSIFICATION_20261120.json';
 const reg=read(path),groups=proposal.themeGroups[theme];
 const originals=source.rows.filter(x=>x.theme===theme);
 assert.equal(originals.length,num);
 assert.equal(reg.readOnly,true);assert.equal(reg.publicationAllowed,false);assert.equal(reg.validatedCount,0);
 assert.equal(reg.sourceCount,num);assert.equal(reg.rows.length,num);
 assert.equal(reg.proposedSkillCount,groups.length);
 assert.equal(reg.sourceFamilies,new Set(originals.map(x=>x.caseFamily)).size);
 const assignments=new Map(),seen=new Set(),flags={};
 for(const g of groups){
  assert.equal(g.status,'A_VALIDER_SEF');
  for(const id of g.ids){
   assert.ok(!assignments.has(id),'ID dans deux groupes candidats '+id);
   assignments.set(id,g);
  }
 }
 assert.equal(assignments.size,num,'Tous les IDs du thème doivent être groupés '+theme);
 for(const row of reg.rows){
  assert.equal(row.theme,theme);
  assert.equal(row.classificationStatus,'PROPOSITION_NON_HOMOLOGUEE');
  assert.equal(row.structuralCheck,'OK');
  assert.ok(!allocated.has(row.id),'Chevauchement historique '+row.id);
  assert.ok(!seen.has(row.id),'Doublon '+row.id);
  allocated.add(row.id);seen.add(row.id);
  const q=byId.get(row.id);
  assert.ok(q&&q.theme===theme,'ID absent source '+row.id);
  const g=assignments.get(row.id);
  assert.ok(g,'Groupe non défini pour '+row.id);
  assert.equal(row.candidateSkill,g.key);
  assert.equal(row.candidateLabel,g.label);
  assert.equal(row.sourceFamily,q.caseFamily);
  assert.deepEqual(row.sourceV1,{
   id:q.id,theme:q.theme,caseFamily:q.caseFamily,hand:q.hand,h:q.h,shape:q.shape,
   auction:q.auction,context:q.context,choices:q.choices,answer:q.originalAnswer,
   explain:q.explain,difficulty:q.difficulty,difficultyReason:q.difficultyReason
  },'Snapshot V1 modifié '+row.id);
  const lengths=q.hand.map(cards=>cards.length);
  assert.equal(lengths.reduce((s,x)=>s+x,0),13,'Longueur main '+row.id);
  assert.deepEqual(lengths,q.shape,'Distribution '+row.id);
  assert.equal(q.hand.flat().reduce((n,c)=>n+(vals[c]||0),0),q.h,'Points H '+row.id);
  assert.equal(new Set(q.choices).size,q.choices.length,'Choix dupliqués '+row.id);
  assert.equal(q.choices.filter(c=>c===q.originalAnswer).length,1,'Corrigé non unique '+row.id);
  assert.ok(Array.isArray(row.flags)&&Array.isArray(row.notes));
  for(const flag of row.flags)flags[flag]=(flags[flag]||0)+1;
 }
 assert.deepEqual([...seen].sort(),originals.map(x=>x.id).sort(),'Couverture '+theme);
 assert.deepEqual(flags,reg.flagsCount,'Alertes '+theme);
 grand+=reg.rows.length;skillTotal+=groups.length;
 console.log('QPJB '+theme+': '+num+' exercices sources, '+groups.length+' groupes proposes, 0 homologue.');
}
assert.equal(grand,193);assert.equal(skillTotal,75);assert.equal(allocated.size,541);
assert.deepEqual([...allocated].sort(),[...byId.keys()].sort(),'La file des 541 doit être entièrement couverte');
const sa=read('audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json');
assert.equal(sa.rows.length,79);
assert.equal(903+sa.rows.length+allocated.size,1523);
assert.equal(new Set([...allocated,...sa.rows.map(x=>x.id)]).size,620,'Ne pas réutiliser un ID SA dans les 541');
console.log('QPJB V1 EXHAUSTIVITE PASS : 903 clés heuristiques + 79 + 541 candidats non homologués = 1 523 QCM.');
console.log('La revue est exhaustive structurellement, mais 0 des 620 candidats est homologué ou actif dans le moteur.');

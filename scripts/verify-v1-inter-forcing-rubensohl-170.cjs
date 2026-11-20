'use strict';
// Cartographie V1 — lecture seule : l'intégrité ne vaut pas homologation SEF.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const base=read('audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json');
const orig=new Map(base.rows.map(x=>[x.id,x]));
assert.equal(base.count,541);assert.equal(orig.size,541);
const known=[
 ['apres_fit',48,'audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json'],
 ['barrage',65,'audits/QPJB_V1_BARRAGE_65_PRECLASSIFICATION_20261120.json'],
 ['chelem',65,'audits/QPJB_V1_CHELEM_65_PRECLASSIFICATION_20261120.json']
];
const additions=[
 ['reponse_inter',67,20,'audits/QPJB_V1_REPONSE_INTER_67_PRECLASSIFICATION_20261120.json'],
 ['forcing',54,21,'audits/QPJB_V1_FORCING_54_PRECLASSIFICATION_20261120.json'],
 ['rubensohl',49,22,'audits/QPJB_V1_RUBENSOHL_49_PRECLASSIFICATION_20261120.json']
];
const selected=new Set(),values={A:4,R:3,D:2,V:1};
for(const [theme,n,file] of known){
 const data=read(file);
 assert.equal(data.rows.length,n,'Source historique '+theme);
 for(const x of data.rows){
  assert.ok(!selected.has(x.id),'Doublon avec dossier historique '+x.id);
  assert.equal(orig.get(x.id)?.theme,theme,'Dossier historique déplacé '+x.id);
  selected.add(x.id);
 }
}
for(const [theme,number,skills,file] of additions){
 const reg=read(file);
 const sources=base.rows.filter(x=>x.theme===theme);
 assert.equal(sources.length,number);
 assert.equal(reg.sourceCount,number);
 assert.equal(reg.rows.length,number);
 assert.equal(reg.proposedSkillCount,skills);
 assert.equal(reg.groups.length,skills);
 assert.equal(reg.sourceFamilies,new Set(sources.map(x=>x.caseFamily)).size);
 assert.equal(reg.approvedCount,0);
 assert.equal(reg.publicationAllowed,false);
 assert.equal(reg.readOnly,true);
 const local=new Set(),groupKeys=new Set(),groupIDs=new Map();
 for(const group of reg.groups){
  assert.ok(!groupKeys.has(group.key),'Catégorie répétée '+group.key);
  groupKeys.add(group.key);
  assert.equal(group.status,'A_VALIDER_SEF');
  assert.equal(group.ids.length,group.count);
  for(const id of group.ids){
   assert.ok(!groupIDs.has(id),'ID dans plusieurs groupes '+id);
   groupIDs.set(id,group);
  }
 }
 assert.equal(groupIDs.size,number);
 const gotFlags={};
 for(const row of reg.rows){
  assert.ok(!local.has(row.id)&&!selected.has(row.id),'ID déjà classé '+row.id);
  local.add(row.id);selected.add(row.id);
  assert.equal(row.theme,theme);
  assert.equal(row.reviewStatus,'PROPOSITION_NON_HOMOLOGUEE');
  assert.equal(row.structural,'VERIFIE');
  const q=orig.get(row.id);assert.ok(q,'ID original introuvable '+row.id);
  assert.equal(q.theme,theme);
  const g=groupIDs.get(row.id);assert.ok(g,'ID absent des groupes '+row.id);
  assert.equal(g.key,row.candidateSkill);
  assert.equal(g.label,row.candidateLabel);
  const expected=JSON.parse(JSON.stringify({
   id:q.id,theme:q.theme,caseFamily:q.caseFamily,
   hand:q.hand,h:q.h,shape:q.shape,auction:q.auction,context:q.context,
   choices:q.choices,answer:q.originalAnswer,explain:q.explain,
   difficulty:q.difficulty,difficultyReason:q.difficultyReason
  }));
  assert.deepEqual(row.sourceV1,expected,'Source QCM V1 modifiée '+row.id);
  const lens=q.hand.map(h=>h.length);
  assert.equal(lens.reduce((a,b)=>a+b,0),13,'Nombre de cartes '+row.id);
  assert.deepEqual(lens,q.shape,'Distribution '+row.id);
  assert.equal(q.hand.flat().reduce((n,c)=>n+(values[c]||0),0),q.h,'Points H '+row.id);
  assert.equal(new Set(q.choices).size,q.choices.length,'Choix dupliqués '+row.id);
  assert.equal(q.choices.filter(c=>c===q.originalAnswer).length,1,'Corrigé non unique '+row.id);
  assert.ok(Array.isArray(row.flags)&&Array.isArray(row.notes));
  for(const f of row.flags)gotFlags[f]=(gotFlags[f]||0)+1;
 }
 assert.deepEqual([...local].sort(),sources.map(x=>x.id).sort(),'Manque des QCM du thème '+theme);
 assert.deepEqual(gotFlags,reg.flagsCounts,'Alertes de revue incohérentes '+theme);
 console.log('QPJB '+theme.toUpperCase()+' PASS: '+number+' QCM source, '+skills+' categories candidates, 0 homologuee.');
}
assert.equal(selected.size,48+65+65+67+54+49);
const remaining=base.rows.filter(x=>!selected.has(x.id));
assert.equal(remaining.length,193);
const summary={};
for(const q of remaining)summary[q.theme]=(summary[q.theme]||0)+1;
assert.deepEqual(summary,{fortes:42,drury:40,michaels:40,roudi:38,multilandy:31,ouv:1,apres_inter:1});
const sa=read('audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json');
assert.equal(sa.rows.length,79);
assert.equal(903+79+selected.size+remaining.length,1523);
console.log('COUVERTURE PASS : 903 reperes V1 + 79 candidates + '+selected.size+' nouvelles propositions + 193 en attente = 1523 QCM.');
console.log('Aucun exercice/corrige/stockage/moteur modifie ; 0 competence nouvelle homologuee.');

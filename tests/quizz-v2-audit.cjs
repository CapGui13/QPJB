'use strict';
// V2 phase A — verifies the read-only competency inventory against live Quiz data.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Quiz catalogue available');
const catalog=JSON.parse(html.slice(start+tag.length,end));
const P=require('../quizz-parcours.js');
const A=require('../scripts/audit-parcours-v2.cjs');
const before=JSON.stringify(catalog.exercises);
const audit=A.inventory(catalog.exercises,catalog.themes,P);
assert.ok(A.assertBaseline(audit.summary));
assert.equal(JSON.stringify(catalog.exercises),before,'Inventory must not modify source questions');
assert.equal(audit.rows.length,1523);
assert.equal(audit.queue.length,620);
assert.equal(audit.summary.withoutMicroOrAxis,580);
assert.equal(audit.breakdown.reduce((n,x)=>n+x.total,0),1523);
assert.equal(audit.breakdown.reduce((n,x)=>n+x.withoutMicro,0),620);
assert.equal(audit.breakdown.reduce((n,x)=>n+x.withAxis,0),105);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,1523);
assert.ok(audit.queue.every(x=>x.reviewStatus==='A_CLASSER_MANUELLEMENT'&&!x.micro));
assert.equal(audit.rows.filter(x=>x.axis&&!x.micro).length,40);
assert.ok(audit.queue.every(x=>catalog.exercises.some(y=>y.id===x.id&&
  y.difficultyReason===x.difficultyReason&&
  y.answer===x.answer&&String(y.caseFamily||y.id)===x.family)));
const csv=A.asCSV(audit.queue);
const snapshot=fs.readFileSync(path.join(root,'Docs','PARCOURS_V2_REVUE_620_20261118.csv'),'utf8');
assert.equal(snapshot,csv,'The manual review queue must match current Quiz metadata');
const graph=JSON.parse(fs.readFileSync(
  path.join(root,'Docs','PARCOURS_V2_PRE-REQUIS_PROPOSITIONS_20261118.json'),'utf8'));
assert.equal(graph.status,'NON_ACTIVE_DANS_LE_MOTEUR','Candidate graph must not be labelled as active');
assert.equal(graph.nodes.length,P.ROADMAP.length);
const roadmap=new Map(P.ROADMAP),table=new Map(graph.nodes.map(x=>[x.theme,x]));
assert.equal(table.size,22,'Each theme appears once in the proposal');
assert.deepEqual(new Set(table.keys()),new Set(roadmap.keys()));
let edges=0;
for(const node of graph.nodes){
  assert.equal(node.auditStatus,'HYPOTHESE_A_VALIDER');
  assert.equal(node.currentIntroductionAfterSessions,roadmap.get(node.theme));
  for(const dep of node.familiarityPrerequisites){
    assert.ok(table.has(dep),'Unknown dependency '+dep);
    assert.ok(roadmap.get(dep)<roadmap.get(node.theme),'Prerequisite cannot follow dependent theme');
    edges++;
  }
}
const visited=new Set(),visiting=new Set();
function walk(theme){
  assert.ok(!visiting.has(theme),'Cycle detected at '+theme);
  if(visited.has(theme))return;
  visiting.add(theme);
  for(const dep of table.get(theme).familiarityPrerequisites)walk(dep);
  visiting.delete(theme);visited.add(theme);
}
for(const theme of table.keys())walk(theme);
assert.equal(edges,31);
const invalid=JSON.parse(before);
invalid.push({...invalid[0]});
assert.throws(()=>A.inventory(invalid,catalog.themes,P),/dupliqué/);
assert.throws(()=>A.assertBaseline({...audit.summary,withMicro:902}),/Dérive catalogue/);
console.log('PARCOURS V2 AUDIT PASS : 1523 QCM / 620 à classer / 580 sans axe ni micro / 22 rubriques / 31 liens proposés non actifs');

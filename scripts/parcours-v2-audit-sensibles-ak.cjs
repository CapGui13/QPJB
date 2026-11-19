'use strict';
// QPJB V2-AK — export en lecture seule des 19 alertes à revoir.
// Aucun corrigé n'est produit ou modifié. Sortie uniquement dans les journaux CI.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const preview=fs.readFileSync(path.join(root,'preview/parcours-v2-autonome.html'),'utf8');
const original=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
function embeddedJson(html,id){
  const script=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(([,attributes])=>new RegExp('\\bid="'+id+'"').test(attributes));
  assert.ok(script,'Bloc source introuvable : '+id);
  return JSON.parse(script[2]);
}
const flags=embeddedJson(preview,'review-flags');
const data=embeddedJson(original,'training-data').exercises;
assert.equal(data.length,1523,'Le catalogue original doit rester à 1 523 QCM');
assert.equal(flags.length,19,'Le nombre des cas signalés doit rester à 19');
const byId=new Map(data.map(q=>[q.id,q]));
assert.equal(byId.size,data.length,'IDs du catalogue distincts');
const seen=new Set();
const rows=[];
for(const item of flags){
  assert.ok(Array.isArray(item)&&item.length===2,'Flag mal formé');
  const [id,note]=item;
  assert.ok(typeof id==='string'&&!seen.has(id),'ID sensible dupliqué');
  assert.ok(typeof note==='string'&&note.length>15,'Note de revue manquante');
  seen.add(id);
  const q=byId.get(id);
  assert.ok(q,'Cas absent du catalogue : '+id);
  assert.ok(q.choices.includes(q.answer),'Réponse hors des choix : '+id);
  rows.push({id,note,theme:q.theme,caseFamily:q.caseFamily||q.id,
    difficulty:q.difficulty,h:q.h,hand:q.hand,context:q.context,
    auction:q.auction,choices:q.choices,answer:q.answer,explain:q.explain});
}
assert.equal(rows.length,19);
console.log('QPJB AK — 19 CAS SENSIBLES, EXTRACTION FIDÈLE, AUCUN CORRIGÉ CHANGÉ');
for(const q of rows)console.log('QPJB-AK-CASE '+JSON.stringify(q));
console.log('QPJB-AK-CHECK PASS count='+rows.length+' catalog='+data.length);

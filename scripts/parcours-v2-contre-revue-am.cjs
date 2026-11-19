'use strict';
// QPJB V2-AM : six Texas mineurs SEF 2024 + cas de comparaison Stayman/Texas.
// Audit documentaire en lecture seule ; pas de correction automatique.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const sourceTag='<script id="training-data" type="application/json">';
const begin=html.indexOf(sourceTag);
const end=html.indexOf('</script>',begin+sourceTag.length);
assert.ok(begin>=0&&end>begin,'Catalogue original introuvable');
const data=JSON.parse(html.slice(begin+sourceTag.length,end)).exercises;
assert.equal(data.length,1523);
const byId=new Map(data.map(q=>[q.id,q]));
assert.equal(byId.size,data.length,'IDs de QCM non uniques');
const texas=['SEF-V482-005','SEF-V482-006','SEF-V482-007',
  'SEF-V482-008','SEF-V482-009','SEF-V482-010'];
const contextual=['SEF-V416-008','SEF-V416-009','SEF-L18-007',
  'SEF-L25-004','SEF-L25-005','SEF-L25-006','SEF-L25-007','SEF-L25-008'];
const hv={A:4,R:3,D:2,V:1},suits=['♠','♥','♦','♣'];
function inspect(id){
  const q=byId.get(id);
  assert.ok(q,'ID source absent '+id);
  assert.ok(Array.isArray(q.hand)&&q.hand.length===4,'Main invalide '+id);
  const cardCount=q.hand.reduce((n,c)=>n+c.length,0);
  const points=q.hand.flat().reduce((n,c)=>n+(hv[c]||0),0);
  const shape=q.hand.map(cards=>cards.length);
  assert.equal(cardCount,13,'Nombre de cartes erroné '+id);
  assert.equal(points,q.h,'Points H incohérents '+id);
  assert.ok(q.choices.includes(q.answer),'Réponse non proposée '+id);
  for(const cards of q.hand){
    assert.equal(new Set(cards).size,cards.length,'Carte dupliquée dans une couleur '+id);
  }
  const short=shape.map((n,i)=>n<=1?suits[i]:null).filter(Boolean);
  return {id,theme:q.theme,answer:q.answer,h:q.h,shape,short,
    family:q.caseFamily||id,auction:q.auction,choices:q.choices,
    hand:q.hand,context:q.context,explain:q.explain};
}
const rows=texas.concat(contextual).map(inspect);
assert.equal(rows.length,14);
assert.equal(new Set(rows.map(q=>q.id)).size,rows.length);
console.log('QPJB-AM-CHECK catalog='+data.length+
  ' texas='+texas.length+' comparisons='+contextual.length+' sourcesIntact=true');
for(const q of rows)console.log('QPJB-AM-CASE '+JSON.stringify(q));
console.log('QPJB-AM-PASS : audit des 6 Texas mineurs et 8 comparaisons, zéro mutation');

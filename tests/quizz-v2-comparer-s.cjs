'use strict';
/* QPJB V2-S : seuls deux points du simulateur sont modifiés dans une copie.
 * Toute conclusion demeure synthétique et ne peut autoriser une publication.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const F=require('../scripts/parcours-v2-pilot.cjs');
const S=require('../scripts/parcours-v2-pilot-s.cjs');
const C=require('../scripts/parcours-v2-comparer-s.cjs');
const original=fs.readFileSync(path.join(__dirname,'../scripts/parcours-v2-pilot.cjs'),'utf8');
const altered=fs.readFileSync(path.join(__dirname,'../scripts/parcours-v2-pilot-s.cjs'),'utf8');
const oldTail="  slots.push('any','any','any','any','any');\n  return slots.slice(0,10);\n}";
const newTail=`  // TEST S NON ACTIF : quatre occasions compétitives ciblées, après
  // ouverture progressive officielle des rubriques. Aucune autre règle
  // du moteur V2-F n'est modifiée dans cette copie expérimentale.
  const sTarget=session===12||session===20?'pilot-s:our-intervention':
    session===16||session===24?'pilot-s:after-adversary-double':null;
  if(sTarget)slots.push(sTarget);
  slots.push('any','any','any','any','any');
  return slots.slice(0,10);
}`;
const oldMatches="function matches(q,slot){return slot==='any'||slot==='revision'||\n  (slot==='ouv'&&q.theme==='ouv')||roleOpening(q)===slot}";
const newMatches=`function matches(q,slot){
  if(slot==='pilot-s:our-intervention')
    return q.theme==='intervenir'&&
      (q.auction||[]).some(x=>/^Adversaire : 1[♣♦♥♠]/.test(x));
  if(slot==='pilot-s:after-adversary-double')
    return q.theme==='apres_inter'&&
      (q.auction||[]).some(x=>/^Partenaire : 1[♣♦♥♠]/.test(x))&&
      (q.auction||[]).some(x=>/^Adversaire : Contre/.test(x));
  return slot==='any'||slot==='revision'||
    (slot==='ouv'&&q.theme==='ouv')||roleOpening(q)===slot;
}`;
assert.ok(original.includes(oldTail)&&original.includes(oldMatches));
assert.ok(altered.includes(newTail)&&altered.includes(newMatches));
assert.equal(altered.replace(newTail,oldTail).replace(newMatches,oldMatches),original,
  'Un changement autre que les deux opérations expérimentales serait interdit');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations(),byId=new Map(catalog.map(q=>[q.id,q]));
assert.equal(catalog.length,1523);assert.equal(byId.size,1523);
for(const s of [0,1,2,3,4,10,11])
  assert.deepEqual(S.desiredSlots(s),F.desiredSlots(s));
assert.ok(S.desiredSlots(12).includes('pilot-s:our-intervention'));
assert.ok(S.desiredSlots(16).includes('pilot-s:after-adversary-double'));
assert.ok(S.desiredSlots(20).includes('pilot-s:our-intervention'));
assert.ok(S.desiredSlots(24).includes('pilot-s:after-adversary-double'));
for(const s of [13,15,17,19,21,23,25,26])
  assert.deepEqual(S.desiredSlots(s),F.desiredSlots(s));
for(const profile of ['balanced','fragile-mineures']){
  const r=C.inspect(catalog,annotations,{sessions:25,profile,seed:13});
  assert.equal(r.referenceCodeUnchanged,true);
  assert.equal(r.publicDeployment,false);
  assert.equal(r.baselineSessions.length,25);
  assert.equal(r.experimentalSessions.length,25);
  assert.equal(r.targetedSlots.length,4);
  assert.ok(r.targetedSlots.every(x=>x.present>0),
    'Aucune véritable question compétitive à un emplacement S déclaré');
  for(const deck of r.experimentalSessions){
    assert.equal(deck.length,10);
    assert.equal(new Set(deck.map(F.family)).size,10);
    assert.ok(deck.every(q=>byId.get(q.id)?.answer===q.answer));
    assert.ok(deck.every(q=>F.available(q,r.experimentalSessions.indexOf(deck),annotations)));
  }
  assert.equal(r.experiment.repeatedFamiliesInsideSessions,0);
}
console.log('QPJB V2 S PASS : deux différences contrôlées, quatre créneaux réels, QCM originaux, V2-F intact');

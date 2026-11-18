'use strict';
// Audit de rappel V2-G : aucune connexion aux élèves, aucune preuve de maîtrise.
const assert=require('node:assert/strict');
const Pilot=require('../scripts/parcours-v2-pilot.cjs');
const catalog=Pilot.loadCatalog(),annotations=Pilot.loadAnnotations();
const byId=new Map(catalog.map(q=>[q.id,q]));

function checkRun(profile,seed){
  const r=Pilot.simulateV2(catalog,annotations,{sessions:65,profile,seed});
  const v=r.metrics.revision;
  assert.equal(r.metrics.questionCount,650);
  assert.equal(r.metrics.repeatedFamilySessions,0);
  assert.ok(r.metrics.uniqueFamilies>=585,'Variété sous le seuil minimum');
  assert.ok(v.scheduledSlotsUsed>=20,'Pas assez de rappels planifiés');
  assert.ok(v.scheduledDueRecalls>0,'Aucun rappel effectivement exécuté');
  assert.ok(v.failedRecallOrigins>0,'Aucun rappel après erreur fictive');
  assert.ok(v.successfulRecallOrigins>0,'Aucun rappel après réussite fictive');
  assert.ok(v.actualDueRecalls>=v.scheduledDueRecalls);
  assert.ok(v.candidateOrContextQueueSize>=10);
  assert.ok(v.unsupportedSingleFamilyCategories>=6);
  assert.equal(v.scheduledDueRecalls,v.scheduledSlotsUsed,
    'Tout rappel planifié doit correspondre à un rappel réellement exécuté');
  const observed=new Set();
  for(const e of r.state.reviewEvents){
    assert.equal(typeof e.questionId,'string');
    assert.ok(byId.has(e.questionId),'Aucun exercice inventé');
    assert.ok(!e.concept.startsWith('rubrique:'),
      'Les rubriques généralistes ne sont pas des compétences révisables');
    assert.ok(e.previousResult==='correct'||e.previousResult==='wrong');
    assert.ok(e.result==='correct'||e.result==='wrong');
    assert.ok(e.source==='scheduled'||e.source==='incidental');
    assert.ok(e.delay>=(e.previousResult==='wrong'?2:5),
      'Rappel trop proche de la précédente évaluation');
    assert.ok((r.state.reviewSupport[e.concept]||0)>=2,
      'Une seule famille ne permet pas une révision indépendante');
    const key=e.session+'|'+e.concept;
    assert.ok(!observed.has(key),'Un seul bilan par notion et séance');
    observed.add(key);
  }
  return r;
}
const standard=checkRun('balanced',13);
const weak=checkRun('fragile-mineures',13);
const easy=checkRun('facile',13);

// Un cas unique ne doit pas se transformer en « acquis » ni en rappel ciblé.
const singleton='stayman:stayman_1sa_deux_majeures_transfert_manche';
assert.equal(standard.state.reviewSupport[singleton],1);
assert.equal(standard.state.reviewQueue[singleton],undefined);
assert.ok(!standard.state.reviewEvents.some(e=>e.concept===singleton));

// Délais exacts sur deux familles originales d'une même notion candidate.
const key='stayman:stayman_1sa_fit_inviter';
const q1=byId.get('SEF-V3-001-1'),q2=byId.get('SEF-V3-003-1');
assert.ok(q1&&q2);
assert.notEqual(Pilot.family(q1),Pilot.family(q2));
const state=Pilot.newState(13);
state.session=11; // disponibilité expérimentale de la famille, sans élève.
Pilot.select(catalog,state,annotations,10); // initialisation du support.
assert.equal(state.reviewSupport[key],2);
Pilot.recordSession(state,[q1],[true],annotations);
assert.equal(state.reviewQueue[key].due,16,'Réussite: rappel à +5 séances');
state.session=16;
const deck=Pilot.select(catalog,state,annotations,10);
assert.ok(deck.some(q=>q.id===q2.id),'Autre famille disponible');
assert.ok(state.lastSelection.some(x=>x.id===q2.id&&
  x.source==='scheduled-recall'),'Rappel explicitement sélectionné');
Pilot.recordSession(state,[q2],[true],annotations);
assert.equal(state.reviewEvents.at(-1).previousResult,'correct');
assert.equal(state.reviewEvents.at(-1).delay,5);
assert.equal(state.reviewEvents.at(-1).source,'scheduled');
assert.equal(state.reviewQueue[key].due,24,'Rappel positif suivant à +8');
state.session=24;
Pilot.select(catalog,state,annotations,10);
assert.ok(state.lastSelection.some(x=>x.id===q1.id&&
  x.source==='scheduled-recall'),
  'Réutilisation espacée autorisée si les deux familles sont épuisées');
Pilot.recordSession(state,[q1],[false],annotations);
assert.equal(state.reviewEvents.at(-1).delay,8);
assert.equal(state.reviewQueue[key].due,26,
  'Un échec sur rappel reprogramme un essai à +2');
assert.ok(!Object.hasOwn(state.reviewQueue[key],'mastered'));

const other=checkRun('balanced',29);
assert.equal(other.metrics.repeatedFamilySessions,0);
console.log('PARCOURS V2 REVISIONS PASS : rappels après erreurs et succès, familles indépendantes, délais 2/5/8, contrôle 65 séances.');

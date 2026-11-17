'use strict';
/* Validation pure Node du parcours : catalogue réel, aucun navigateur/IA requis. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const P=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Embedded Quiz SEF catalog');
const DATA=JSON.parse(match[1]);
const exercises=DATA.exercises;
assert.equal(exercises.length,1523,'Existing Quiz SEF count stays intact');
assert.equal(DATA.themes.length,22);
const state=P.empty();
const first=P.start(state,exercises);
assert.equal(first.length,10,'10 exercises in a guided session');
assert.ok(first.every(x=>x.theme==='ouv'),'First session introduces opening decisions');
assert.equal(new Set(first.map(x=>x.caseFamily||x.id)).size,10,'No related variants in session');
// Le premier écran doit apprendre à distinguer toutes les décisions,
// pas enchaîner trois Passe / trois 1SA en oubliant les mineures.
const openingDistribution=Object.fromEntries([...new Set(first.map(x=>x.answer))]
  .map(bid=>[bid,first.filter(x=>x.answer===bid).length]));
assert.ok((openingDistribution['1♣']||0)>=2,'At least two 1♣ openings in first session');
assert.ok((openingDistribution['1♦']||0)>=2,'At least two 1♦ openings in first session');
assert.ok(Object.keys(openingDistribution).length>=6,'At least six distinct opening bids');
assert.ok(Object.values(openingDistribution).every(n=>n<=2),
  'No three identical opening answers: '+JSON.stringify(openingDistribution));
assert.equal(P.finish(state),false,'Cannot complete unanswered session');
assert.equal(P.record(state,first[0],'skipped',0,null,false,false),true);
assert.equal(P.record(state,first[0],'skipped',0,null,false,false),false,'No duplicate recording');
assert.equal(P.load(JSON.stringify(state)).active.answers[0].result,'skipped');
for(let i=1;i<10;i++)assert.equal(P.record(state,first[i],'correct',i,first[i].answer,false,false),true);
assert.equal(P.finish(state),true);
assert.equal(state.completed,1);
const second=P.start(state,exercises);
const categories=second.map(x=>x.theme);
assert.equal(second.length,10);
assert.ok(categories.includes('mineur')&&categories.includes('majeur'),
  'Responses to major AND minor openings appear as early as session 2: '+categories.join(','));
assert.ok(categories.filter(x=>x==='ouv').length<=4,'No 40 successive opening questions');
assert.equal(new Set(second.map(x=>x.caseFamily||x.id)).size,second.length);
// Vérifier les contextes de réponses, pas seulement les bonnes enchères.
const firstOpener=x=>String(x.auction?.[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠]))/)?.[1]||'';
for(const [theme,expected] of [['mineur',['1♣','1♦']],['majeur',['1♥','1♠']]]){
  const contexts=second.filter(x=>x.theme===theme).map(firstOpener);
  assert.ok(expected.every(b=>contexts.includes(b)),
    'Both opening contexts in first response lesson '+theme+': '+contexts.join(','));
}
const nextOpenings=second.filter(x=>x.theme==='ouv').map(x=>x.answer);
assert.ok(nextOpenings.includes('1♣')&&nextOpenings.includes('1♦'),
 'Minor openings remain in the spiral on session two: '+nextOpenings.join(','));
assert.ok(nextOpenings.every(answer=>nextOpenings.filter(x=>x===answer).length<=2),
 'Avoid repeated opening answers on session two');
const backup=P.load(JSON.stringify(state));
assert.deepEqual(backup.active.ids,state.active.ids,'Active deck survives reload');
assert.equal(P.start(backup,exercises).map(x=>x.id).join('|'),second.map(x=>x.id).join('|'));
const previousIds=new Set(first.map(x=>x.id));
assert.ok(second.some(x=>!previousIds.has(x.id)),'Next session includes new situations');
// Les promotions exigent des succès indépendants sur trois séances.
const proof=P.empty();
proof.skills.ouv={level:1,clean:0,errors:0};
for(let round=0;round<3;round++){
  const q=P.start(proof,exercises);
  for(let j=0;j<q.length;j++)
    assert.ok(P.record(proof,q[j],'correct',j,q[j].answer,false,false));
  assert.equal(proof.skills.ouv.level,round===2?2:1,
    'A session cannot promote a skill with several easy successes');
  assert.equal(proof.skills.ouv.clean,round===2?0:round+1);
  assert.equal(P.finish(proof),true);
}
const persistedProof=P.load(JSON.stringify(proof));
assert.equal(persistedProof.skills.ouv.lastCleanSession,2,
  'Promotion evidence survives localStorage roundtrip');
assert.equal(persistedProof.skills.ouv.lastLevelChangeSession,2);

// Une erreur initiale corrigée en saisie libre ne fait pas réussir la compétence.
const helped=P.empty(),helpDeck=P.start(helped,exercises);
assert.ok(P.record(helped,helpDeck[0],'correct',0,helpDeck[0].answer,false,true));
assert.equal(helped.skills.ouv.clean,0);
assert.equal(helped.entries[helpDeck[0].id].streak,0);
assert.equal(helped.entries[helpDeck[0].id].due,1);

// Même avec quatre erreurs, pas de chute de plusieurs niveaux en une séance.
const struggling=P.empty();
struggling.skills.ouv={level:4,clean:0,errors:0};
const struggleDeck=P.start(struggling,exercises);
for(let j=0;j<4;j++)assert.ok(P.record(struggling,struggleDeck[j],'wrong',j,null,false,false));
assert.equal(struggling.skills.ouv.level,3,'At most one demotion per session');
assert.equal(P.load(JSON.stringify(struggling)).skills.ouv.lastLevelChangeSession,0);

// Reprise d'une ancienne sauvegarde V1 sans les champs de confirmation.
const legacy=P.load(JSON.stringify({version:1,completed:5,entries:{},
  skills:{ouv:{level:2,clean:2,errors:0}},active:null}));
assert.equal(legacy.skills.ouv.level,2);
assert.equal(legacy.skills.ouv.clean,2);
assert.equal(legacy.skills.ouv.lastCleanSession,null);

// Go through 60 sessions with deterministic synthetic learner behaviour.
const run=P.empty();
const introduced=new Map();
for(let session=0;session<65;session++){
  const deck=P.start(run,exercises);
  assert.equal(deck.length,10,'Session '+session+' must have 10 cards');
  assert.equal(new Set(deck.map(x=>x.id)).size,10);
  assert.equal(new Set(deck.map(x=>x.caseFamily||x.id)).size,10,'Family repeated in session '+session);
  for(const theme of ['mineur','majeur']){
    const contexts=deck.filter(x=>x.theme===theme).map(firstOpener);
    const counts=contexts.reduce((acc,b)=>(acc[b]=(acc[b]||0)+1,acc),{});
    assert.ok(Object.values(counts).every(v=>v<=2),
      'Too many identical contexts '+theme+' in session '+(session+1)+': '+JSON.stringify(counts));
  }
  const groupedOpenings=deck.filter(x=>x.theme==='ouv');
  if(groupedOpenings.length){
    const countByBid=groupedOpenings.reduce((acc,x)=>(acc[x.answer]=(acc[x.answer]||0)+1,acc),{});
    assert.ok(Object.values(countByBid).every(n=>n<=2),
      'Identical openings repeatedly selected in simulated session '+(session+1));
  }
  for(let i=0;i<deck.length;i++){
    const x=deck[i],result=(session+i)%4===0?'wrong':'correct',assist=(session+i)%5===0;
    assert.ok(P.INTRO[x.theme]<=session,'Theme appears before introduction: '+x.theme);
    introduced.set(x.theme,session);
    assert.ok(P.record(run,x,result,i,result==='correct'?x.answer:null,assist,false));
  }
  assert.equal(P.finish(run),true);
}
assert.ok(introduced.has('intervenir'),'Interventions eventually introduced');
assert.ok(introduced.has('apres_inter'),'Competitive responses eventually introduced');
assert.ok(introduced.has('chelem'),'Slam material eventually introduced');
assert.equal(run.completed,65);
const summary=P.summary(run,exercises);
assert.equal(summary.completed,65);
assert.ok(summary.seen>200,'Diverse pool used over repeated sessions');
console.log('PARCOURS ALGORITHMIQUE V1 PASS: 1523 QCM unchanged, 22 themes, early answers, local resume, mastery and 65 simulated sessions; '+summary.seen+' IDs seen');

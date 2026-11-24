'use strict';
/* Validation pure Node du parcours : catalogue réel, aucun navigateur/IA requis. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
// Historical behavior guards run against exact historical engine. Candidate acceptance: progression-guidee-recette.cjs.
const P=require('./progression-guidee-historical.cjs').engine();
require('./progression-guidee-historical.cjs').catalogue();
const html=require('./progression-guidee-historical.cjs').html();
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
for(const bid of ['1♣','1♦','1♥','1♠','1SA'])
  assert.ok((openingDistribution[bid]||0)>=1,'First lesson must cover '+bid);
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

// V1.3 : classification vérifiable, sans analyse sémantique fragile.
const tagged=exercises.filter(x=>P.microKey(x));
assert.equal(tagged.length,903,'Conservative taxonomy covers exactly 903 catalog QCM');
assert.equal(P.microKey(exercises.find(x=>x.id==='SEF-015-1')),'mineur:1♣');
assert.equal(P.microKey(exercises.find(x=>x.id==='SEF-026-3')),'majeur:1♥');
assert.equal(P.microKey(exercises.find(x=>x.id==='SEF-001-1')),'ouv:sa');
assert.equal(P.microKey(exercises.find(x=>x.id==='SEF-V3-027-2')),'intervenir:mineure');
assert.equal(P.microKey(exercises.find(x=>x.id==='SEF-V45-050')),null,
  'Unclear slam situations must not be given a guessed micro-skill');

// La même micro-compétence ne progresse qu'une fois par séance.
const microDemo=P.empty();
let microDeck=P.start(microDemo,exercises);
const firstMinor=microDeck.find(x=>P.microKey(x)==='ouv:mineure');
assert.ok(firstMinor);
const secondMinor=microDeck.find(x=>P.microKey(x)==='ouv:mineure'&&x.id!==firstMinor.id);
assert.ok(secondMinor);
assert.ok(P.record(microDemo,firstMinor,'correct',microDeck.indexOf(firstMinor),firstMinor.answer,false,false));
assert.equal(microDemo.micros['ouv:mineure'].score,1);
assert.ok(P.record(microDemo,secondMinor,'wrong',microDeck.indexOf(secondMinor),null,false,false));
assert.equal(microDemo.micros['ouv:mineure'].score,-1,'An error must override a previous success');
assert.equal(microDemo.micros['ouv:mineure'].attempts,2);
assert.equal(P.load(JSON.stringify(microDemo)).micros['ouv:mineure'].score,-1);

// Faiblesse sur une sous-compétence sans diminuer le niveau de la rubrique.
const custom=[{id:'FAKE-CLUB',theme:'mineur',difficulty:1,answer:'1♥',
    auction:['Partenaire : 1♣'],caseFamily:'A'},
  {id:'FAKE-DIAMOND',theme:'mineur',difficulty:1,answer:'1♥',
    auction:['Partenaire : 1♦'],caseFamily:'B'}];
for(const [weak,strong] of [['mineur:1♣','mineur:1♦'],['mineur:1♦','mineur:1♣']]){
  const learner=P.empty();learner.completed=3;
  learner.micros[weak]={score:-3,attempts:3,independent:0,lastSession:2,lastScoredSession:2,sessionBase:-2,sessionResult:'weak'};
  learner.micros[strong]={score:3,attempts:3,independent:3,lastSession:2,lastScoredSession:2,sessionBase:2,sessionResult:'clean'};
  assert.equal(P.microKey(custom.find(x=>P.microKey(x)===weak)),weak);
  assert.equal(P.select(custom,learner,1)[0].id,custom.find(x=>P.microKey(x)===weak).id,
    'Prefer fresh exercise in the weak micro-skill while preserving theme level');
  assert.equal(P.weaknesses(learner)[0].label,P.MICRO_LABELS[weak]);
}
const oldMicro=P.load(JSON.stringify({version:1,completed:3,entries:{},
  skills:{ouv:{level:2,clean:1,errors:0}},active:null}));
assert.equal(oldMicro.skills.ouv.level,2,'Legacy skills must remain unchanged');
assert.deepEqual(oldMicro.micros,{},'No artificial history fabricated for legacy users');

// Ne pas faire monter la confiance avec des réussites aidées ou corrigées.
const assistedMicro=P.empty(),microCard=P.start(assistedMicro,exercises)[0],key=P.microKey(microCard);
assert.ok(P.record(assistedMicro,microCard,'correct',0,microCard.answer,false,true));
assert.equal(assistedMicro.micros[key].score,-1);
assert.equal(assistedMicro.micros[key].independent,0);

// V1.4 : pistes transversales fondées sur 105 IDs + justifications audités.
const axes=exercises.filter(x=>P.axisKey(x));
assert.equal(axes.length,105);
assert.deepEqual(Object.fromEntries(Object.keys(P.AXIS_LABELS).map(key=>[
  key,axes.filter(x=>P.axisKey(x)===key).length
])),{fit:22,force:42,palier:41});
assert.equal(P.AXIS_AUDIT.reduce((n,row)=>n+row[3].length,0),105);
assert.equal(P.axisKey(exercises.find(x=>x.id==='SEF-V44-052')),null,
  'The second-colour case is explicitly excluded despite its generic editorial reason');
assert.equal(P.axisKey({...exercises.find(x=>x.id==='SEF-026-3'),
  difficultyReason:'A different unreviewed reason'}),null,
  'Editorial changes revoke the proof instead of silently relabeling a question');
assert.equal(P.axisKey({...exercises.find(x=>x.id==='SEF-026-3'),theme:'sa'}),null);
assert.equal(P.axisKey(exercises.find(x=>x.id==='SEF-001-1')),null,
  'The original opening taxonomy stays separate from transversal axes');

// Une seule preuve par séance, correction d'une réponse erronée incluse.
const fitDeck=axes.filter(x=>P.axisKey(x)==='fit').slice(0,2);
assert.equal(fitDeck.length,2);
const fitState=P.empty();
fitState.active={ids:fitDeck.map(x=>x.id),index:0,answers:{},createdAt:0};
assert.ok(P.record(fitState,fitDeck[0],'correct',0,fitDeck[0].answer,false,false));
assert.equal(fitState.axes.fit.score,1);
assert.ok(P.record(fitState,fitDeck[1],'wrong',1,null,false,false));
assert.equal(fitState.axes.fit.score,-1,'Same-session errors override previous successes');
assert.equal(fitState.axes.fit.attempts,2);
assert.equal(fitState.axes.fit.independent,1);
assert.ok(P.finish(fitState));
assert.equal(P.load(JSON.stringify(fitState)).axes.fit.score,-1);
assert.deepEqual(P.load(JSON.stringify({version:1,completed:2,entries:{},skills:{},micros:{},active:null})).axes,{},
  'V1.3 progress migrates without invented transversal history');

// Dans une rubrique identique, donner priorité à l'axe moins maîtrisé.
const forceCase=axes.find(x=>x.theme==='apres_fit'&&P.axisKey(x)==='force');
const palierCase=axes.find(x=>x.theme==='apres_fit'&&P.axisKey(x)==='palier');
assert.ok(forceCase&&palierCase);
for(const [weak,strong] of [['force','palier'],['palier','force']]){
  const learner=P.empty();learner.completed=12;
  learner.axes[weak]={score:-3,attempts:3,independent:0,lastSession:11,lastScoredSession:11,sessionBase:-2,sessionResult:'weak'};
  learner.axes[strong]={score:3,attempts:3,independent:3,lastSession:11,lastScoredSession:11,sessionBase:2,sessionResult:'clean'};
  const expected=weak==='force'?forceCase:palierCase;
  assert.equal(P.select([forceCase,palierCase],learner,1)[0].id,expected.id);
  assert.equal(P.axisWeaknesses(learner)[0].label,P.AXIS_LABELS[weak]);
}
const assistedAxes=P.empty(),helpAxis=axes.find(x=>P.axisKey(x)==='force');
assistedAxes.active={ids:[helpAxis.id],index:0,answers:{},createdAt:0};
assert.ok(P.record(assistedAxes,helpAxis,'correct',0,helpAxis.answer,false,true));
assert.equal(assistedAxes.axes.force.score,-1,'Corrected answer cannot imply mastery');

// V1.5 — tableau en lecture seule, résultats réellement observés.
const emptyDashboard=P.dashboard(P.empty(),exercises);
assert.equal(emptyDashboard.themes.length,22);
assert.equal(emptyDashboard.micros.length,25);
assert.equal(emptyDashboard.axes.length,3);
assert.equal(emptyDashboard.total,1523);
assert.equal(emptyDashboard.distinct,0);
assert.equal(emptyDashboard.independent,0);
assert.equal(emptyDashboard.themes.find(x=>x.id==='ouv').status,'available');
assert.equal(emptyDashboard.themes.find(x=>x.id==='mineur').status,'upcoming');
assert.ok(emptyDashboard.axes.every(x=>x.status==='unassessed'));
const display=P.empty();
const cards=exercises.filter(x=>x.theme==='ouv').filter((x,i,a)=>a.findIndex(y=>(y.caseFamily||y.id)===(x.caseFamily||x.id))===i).slice(0,4);
assert.equal(cards.length,4);
for(let session=0;session<3;session++){
  display.active={ids:[cards[session].id],answers:{},index:0,createdAt:display.completed};
  assert.ok(P.record(display,cards[session],'correct',0,cards[session].answer,false,false));
  assert.ok(P.finish(display));
  assert.equal(P.dashboard(display,exercises).themes.find(x=>x.id==='ouv').status,
    session===2?'confirmed':'discovering',
    'Only independent, distinct families in three completed sessions confirm an acquisition');
}
let view=P.dashboard(display,exercises);
assert.equal(view.independent,3);
assert.equal(view.confirmed,1);
display.active={ids:[cards[3].id],answers:{},index:0,createdAt:display.completed};
assert.ok(P.record(display,cards[3],'skipped',0,null,false,false));
view=P.dashboard(display,exercises);
assert.equal(view.themes.find(x=>x.id==='ouv').status,'consolidating');
assert.equal(view.themes.find(x=>x.id==='ouv').skipped,1);
assert.equal(view.independent,3);
assert.equal(view.distinct,4);
const displayBefore=JSON.stringify(display);
P.dashboard(display,exercises);
assert.equal(JSON.stringify(display),displayBefore,'Dashboard is read-only');
assert.deepEqual(P.dashboard(P.load(displayBefore),exercises),view,'Dashboard survives reload');
const repeatFamily=P.empty();repeatFamily.completed=4;
for(let i=0;i<3;i++)repeatFamily.entries[cards[i].id]={result:'correct',assisted:false,lastSession:2};
assert.notEqual(P.dashboard(repeatFamily,exercises).themes.find(x=>x.id==='ouv').status,'confirmed',
 'Three successes in one session are not sufficient');
// V1.10 : le dernier entraînement n'efface jamais une preuve évaluée.
const assessed=P.empty();
for(let session=0;session<3;session++){
  assessed.active={ids:[cards[session].id],answers:{},index:0,createdAt:assessed.completed};
  assert.ok(P.record(assessed,cards[session],'correct',0,cards[session].answer,false,false));
  assert.ok(P.finish(assessed));
}
assert.equal(P.dashboard(assessed,exercises).themes.find(t=>t.id==='ouv').status,'confirmed');
assessed.active={ids:[cards[3].id],answers:{},index:0,createdAt:assessed.completed};
assert.ok(P.record(assessed,cards[3],'wrong',0,null,false,false));
assert.ok(P.finish(assessed));
assert.equal(P.dashboard(assessed,exercises).themes.find(t=>t.id==='ouv').status,'consolidating');
// Reproduced V1.9 bug: this correction would erase the normal-session error
// and falsely restore "Acquis confirmés" without a fresh normal assessment.
assessed.active={ids:[cards[3].id],answers:{},index:0,createdAt:assessed.completed,
  mode:'consolidation'};
assert.ok(P.record(assessed,cards[3],'correct',0,cards[3].answer,false,false));
assert.ok(P.finish(assessed));
assert.equal(assessed.entries[cards[3].id].result,'correct','Latest practice remains visible');
assert.deepEqual(assessed.entries[cards[3].id].assessment,
  {result:'wrong',assisted:false,lastSession:3},'Earlier assessed error is preserved');
assert.equal(P.dashboard(assessed,exercises).themes.find(t=>t.id==='ouv').status,
  'consolidating','Focused practice cannot invent a confirmed acquisition');
assert.equal(P.dashboard(P.load(JSON.stringify(assessed)),exercises).themes.find(t=>t.id==='ouv').status,
  'consolidating','The assessed error persists through reload');
assert.equal(P.load(JSON.stringify(assessed)).entries[cards[3].id].assessment.result,'wrong');

// Opposite direction: a focused wrong answer must not revoke previous
// confirmed mastery, although it stays visible in the practice totals.
const previouslyConfirmed=P.empty();
for(let session=0;session<3;session++){
  previouslyConfirmed.active={ids:[cards[session].id],answers:{},index:0,
    createdAt:previouslyConfirmed.completed};
  assert.ok(P.record(previouslyConfirmed,cards[session],'correct',0,cards[session].answer,false,false));
  assert.ok(P.finish(previouslyConfirmed));
}
previouslyConfirmed.active={ids:[cards[2].id],answers:{},index:0,
  createdAt:3,mode:'consolidation'};
assert.ok(P.record(previouslyConfirmed,cards[2],'wrong',0,null,false,false));
assert.ok(P.finish(previouslyConfirmed));
assert.equal(previouslyConfirmed.entries[cards[2].id].result,'wrong');
assert.equal(previouslyConfirmed.entries[cards[2].id].assessment.result,'correct');
assert.equal(P.dashboard(previouslyConfirmed,exercises).themes.find(t=>t.id==='ouv').status,
  'confirmed','A focused practice alone cannot revoke assessed mastery');

// A new, first-ever focused answer does not count as an evaluation.
const practiceOnly=P.empty();practiceOnly.completed=4;
practiceOnly.active={ids:[cards[3].id],index:0,answers:{},
  createdAt:4,mode:'consolidation'};
assert.ok(P.record(practiceOnly,cards[3],'correct',0,cards[3].answer,false,false));
assert.equal(practiceOnly.entries[cards[3].id].assessment,null);
assert.equal(P.load(JSON.stringify(practiceOnly)).entries[cards[3].id].assessment,null);
assert.notEqual(P.dashboard(practiceOnly,exercises).themes.find(t=>t.id==='ouv').status,'confirmed');

// Backward compatibility: no inferred history or destructive reset for
// previous saves that lacked a separate assessment field.
const historic=P.load(JSON.stringify({version:1,completed:3,entries:
  Object.fromEntries(cards.slice(0,3).map((x,i)=>[x.id,
    {result:'correct',assisted:false,lastSession:i,due:i+3,
      seen:1,streak:1,family:x.caseFamily||x.id}]))}));
assert.equal(P.dashboard(historic,exercises).themes.find(t=>t.id==='ouv').status,'confirmed',
  'Previously visible historical badges remain unchanged');
historic.active={ids:[cards[2].id],index:0,answers:{},createdAt:3,mode:'consolidation'};
assert.ok(P.record(historic,cards[2],'wrong',0,null,false,false));
assert.ok(P.finish(historic));
assert.equal(historic.entries[cards[2].id].assessment.result,'correct',
  'Historical evaluation remains available after a new targeted attempt');
const invalid=JSON.parse(JSON.stringify(assessed));
invalid.entries[cards[3].id].assessment={result:'correct',assisted:false,lastSession:999999};
assert.equal(P.load(JSON.stringify(invalid)).entries[cards[3].id].assessment,null,
  'Invalid proof timestamps cannot be used to claim mastery');

const confidence=P.empty();confidence.completed=4;
confidence.axes.force={score:3,attempts:4,independent:3,lastSession:3,lastScoredSession:3};
assert.equal(P.dashboard(confidence,exercises).axes.find(x=>x.id==='force').status,'repeated');
confidence.micros['mineur:1♣']={score:-2,attempts:3,independent:1,lastSession:3,lastScoredSession:3};
assert.equal(P.dashboard(confidence,exercises).micros.find(x=>x.id==='mineur:1♣').status,'reinforce');
assert.equal(P.dashboard(confidence,exercises).axes.find(x=>x.id==='force').covered,42);

// V1.6 : séances ciblées proposées uniquement si l'historique prouve
// une faiblesse répétée; leur pratique n'accélère pas les introductions.
const emptyFocus=P.consolidationPlan(P.empty(),exercises);
assert.equal(emptyFocus.available,false,'No consolidation offered without observed weakness');
assert.equal(emptyFocus.items.length,0);
const focusLearner=P.empty();
focusLearner.completed=5;
focusLearner.micros['mineur:1♣']={score:-3,attempts:4,independent:0,
  lastSession:4,lastScoredSession:4,sessionBase:-2,sessionResult:'weak'};
const focusBefore=JSON.stringify(focusLearner);
const focusPlan=P.consolidationPlan(focusLearner,exercises);
assert.equal(focusPlan.available,true);
assert.equal(focusPlan.items.length,10);
assert.deepEqual(focusPlan.focus.map(x=>x.key),['mineur:1♣']);
const focusById=new Map(exercises.map(x=>[x.id,x]));
assert.ok(focusPlan.items.every(({id})=>P.microKey(focusById.get(id))==='mineur:1♣'));
assert.equal(new Set(focusPlan.items.map(x=>focusById.get(x.id).caseFamily||x.id)).size,10,
  'Consolidation uses ten distinct case families');
assert.equal(JSON.stringify(focusLearner),focusBefore,'Planning does not mutate progress');
const targetDeck=P.startConsolidation(focusLearner,exercises);
assert.equal(targetDeck.length,10);
const observedBefore=JSON.stringify({skills:focusLearner.skills,
  micros:focusLearner.micros,axes:focusLearner.axes});
assert.equal(focusLearner.active.mode,'consolidation');
const focusSaved=P.load(JSON.stringify(focusLearner));
assert.equal(focusSaved.active.mode,'consolidation','Consolidation survives page reload');
assert.deepEqual(P.start(focusSaved,exercises).map(x=>x.id),
  targetDeck.map(x=>x.id),'An interrupted consolidation is resumed');
assert.equal(P.consolidationPlan(focusSaved,exercises).reason,'session-active');
for(let i=0;i<targetDeck.length;i++)
  assert.ok(P.record(focusLearner,targetDeck[i],'wrong',i,null,false,false));
assert.ok(P.finish(focusLearner));
assert.equal(JSON.stringify({skills:focusLearner.skills,
  micros:focusLearner.micros,axes:focusLearner.axes}),observedBefore,
  'Targeted training must not contribute a proof of mastery or lower skill levels');
assert.equal(focusLearner.lastConsolidation.counts.wrong,10,
  'The focused failures must nevertheless appear in the observed report');
assert.equal(targetDeck.every(x=>focusLearner.entries[x.id]?.result==='wrong'),true,
  'The genuine practice outcomes remain available to future revision');
assert.equal(focusLearner.completed,5,'Focused session must not unlock next themes');
assert.equal(focusLearner.active,null);
assert.equal(focusLearner.lastConsolidatedAt,5,'One focused session per main-session milestone');
assert.equal(P.consolidationPlan(focusLearner,exercises).reason,'already-consolidated',
  'Consolidations cannot be chained indefinitely without a normal session');
assert.equal(P.load(JSON.stringify(focusLearner)).completed,5);
assert.equal(P.load(JSON.stringify(focusLearner)).lastConsolidatedAt,5,
  'The cooldown marker survives a reload');
// A regular session starting at the SAME completed index must still score
// independent evidence, even if a focused practice has already happened there.
const following=P.load(JSON.stringify(focusLearner));
const afterFocusCards=exercises.filter(x=>P.microKey(x)==='mineur:1♣');
const followingDeck=P.start(following,afterFocusCards);
assert.equal(followingDeck.length,10);
assert.equal(following.active.mode,undefined,'Normal route, not another consolidation');
assert.ok(P.record(following,followingDeck[0],'correct',0,
  followingDeck[0].answer,false,false));
assert.equal(following.micros['mineur:1♣'].score,-2,
  'The first clean normal-session answer is now counted');
assert.equal(following.micros['mineur:1♣'].lastScoredSession,5);
assert.equal(following.skills.mineur.clean,1,
  'Level progression starts from regular-session evidence');

const afterMilestone=P.load(JSON.stringify(focusLearner));
afterMilestone.completed++;
assert.notEqual(P.consolidationPlan(afterMilestone,exercises).reason,'already-consolidated',
  'A subsequent ordinary session reopens consolidation when still needed');
// V1.7 : adapter la longueur au nombre réel de familles, sans inventer de QCM.
const tooSmall=P.load(focusBefore);
const eight=exercises.filter(x=>P.microKey(x)==='mineur:1♣')
  .filter((x,i,arr)=>arr.findIndex(y=>(y.caseFamily||y.id)===(x.caseFamily||x.id))===i)
  .slice(0,8);
assert.equal(eight.length,8);
const shortPlan=P.consolidationPlan(tooSmall,eight);
assert.equal(shortPlan.available,true,'A short, genuinely distinct deck should be offered');
assert.equal(shortPlan.items.length,8,'Exactly eight original families, without invented filler');
const shortDeck=P.startConsolidation(tooSmall,eight);
assert.equal(shortDeck.length,8);
assert.equal(P.load(JSON.stringify(tooSmall)).active.ids.length,8,'Short deck survives reload');
for(let i=0;i<shortDeck.length;i++)
  assert.ok(P.record(tooSmall,shortDeck[i],'skipped',i,null,false,false));
assert.equal(P.finish(tooSmall),true);
assert.equal(tooSmall.completed,5,'Short consolidation does not unlock topics');
const three=P.load(focusBefore);
assert.equal(P.consolidationPlan(three,eight.slice(0,3)).available,false,
  'Three original cases are not enough for a credible focused lesson');
assert.equal(P.consolidationPlan(three,eight.slice(0,3)).reason,'pool-insufficient');

for(const [micro,completed,expected] of [
  ['ouv:passe',0,9],['intervenir:barrage',14,5],['reveil:barrage',20,0]
]){
  const learner=P.empty();learner.completed=completed;
  learner.micros[micro]={score:-3,attempts:4,independent:0,
    lastSession:Math.max(0,completed-1),lastScoredSession:Math.max(0,completed-1)};
  const plan=P.consolidationPlan(learner,exercises);
  assert.equal(plan.items.length,expected,'Catalog-backed lesson size for '+micro);
  assert.equal(plan.available,expected>=4,'No artificial enlargement for '+micro);
  if(expected)assert.equal(new Set(plan.items.map(x=>
    focusById.get(x.id).caseFamily||x.id)).size,expected);
}
// V1.8 — bilan factuel, ventilé par cible et sauvegardé (pas de maîtrise
// déduite de dix bonnes réponses). Les réponses corrigées ne sont pas autonomes.
const mixed=P.empty();mixed.completed=15;
mixed.micros['mineur:1♣']={score:-3,attempts:4,independent:0,lastSession:14};
mixed.axes.force={score:-2,attempts:3,independent:0,lastSession:14};
const mixedDeck=P.startConsolidation(mixed,exercises);
const mixedMasteryBefore=JSON.stringify({skills:mixed.skills,micros:mixed.micros,axes:mixed.axes});
assert.equal(mixedDeck.length,10);
assert.equal(mixed.active.targets.length,10);
assert.equal(new Set(mixed.active.targets).size,2,'Two independently audited focuses');
assert.ok(mixed.active.targets.every(x=>P.focusLabel(x)),
  'Focus labels must be from reviewed taxonomy');
const resumedMixed=P.load(JSON.stringify(mixed));
assert.deepEqual(resumedMixed.active.targets,mixed.active.targets);
const targetsBefore=mixed.active.targets.slice();
for(let i=0;i<mixedDeck.length;i++){
  const outcome=['correct','correct','wrong','skipped'][i%4];
  assert.ok(P.record(mixed,mixedDeck[i],outcome,i,
    outcome==='correct'?mixedDeck[i].answer:null,i%4===1,false));
}
assert.equal(P.finish(mixed),true);
assert.equal(JSON.stringify({skills:mixed.skills,micros:mixed.micros,axes:mixed.axes}),
 mixedMasteryBefore,'Even mixed good/bad focused results cannot distort mastery evidence');
assert.equal(mixed.completed,15);
assert.deepEqual(mixed.lastConsolidation.counts,
  {total:10,independent:3,helped:3,wrong:2,skipped:2});
assert.equal(mixed.lastConsolidation.atSession,15);
assert.deepEqual(new Set(mixed.lastConsolidation.parts.map(x=>x.target)),
  new Set(targetsBefore),'Reports group answers under their actual selected focus');
for(const part of mixed.lastConsolidation.parts){
  const expected=targetsBefore.filter(x=>x===part.target).length;
  assert.equal(part.counts.total,expected,'A QCM is counted under exactly one focus');
  assert.equal(part.counts.total,
    part.counts.independent+part.counts.helped+part.counts.wrong+part.counts.skipped);
}
assert.deepEqual(P.load(JSON.stringify(mixed)).lastConsolidation,
  mixed.lastConsolidation,'Summary survives reload');
const corrupt=JSON.parse(JSON.stringify(mixed));
corrupt.lastConsolidation.counts.independent=10;
assert.equal(P.load(JSON.stringify(corrupt)).lastConsolidation,undefined,
  'Never display contradictory or tampered report counts');
assert.equal(P.focusLabel('micro:unknown'),null,'Reject unreviewed focus identifiers');

const oldFocused=P.empty();oldFocused.completed=14;
const oldCards=exercises.filter(x=>P.microKey(x)==='intervenir:barrage').slice(0,5);
assert.equal(oldCards.length,5);
oldFocused.active={mode:'consolidation',createdAt:14,index:0,answers:{},
  ids:oldCards.map(x=>x.id)};
for(let i=0;i<5;i++)
 assert.ok(P.record(oldFocused,oldCards[i],'skipped',i,null,false,false));
assert.ok(P.finish(oldFocused));
assert.equal(oldFocused.lastConsolidation.counts.skipped,5);
assert.deepEqual(oldFocused.lastConsolidation.parts,[],
 'Legacy V1.7 sessions get a truthful total without invented group labels');
assert.deepEqual(P.load(JSON.stringify(oldFocused)).lastConsolidation,
 oldFocused.lastConsolidation,'Legacy focused total persists');

const continueNormal=P.start(focusLearner,exercises);
assert.equal(continueNormal.length,10,'Normal parcours remains available after consolidation');
assert.ok(!focusLearner.active.mode,'The normal session retains legacy active shape');
// Une preuve unique de difficulté ne doit jamais provoquer la proposition.
const isolated=P.empty();isolated.completed=5;
isolated.micros['mineur:1♣']={score:-1,attempts:1,independent:0,lastSession:4};
assert.equal(P.consolidationPlan(isolated,exercises).available,false);

// Une bonne réponse autonome doit être rappelée sur un autre cas de la
// même notion dès que possible ; les erreurs conservent le rappel direct.
const conceptCatalog=[{id:'OLD-CLUB',theme:'ouv',difficulty:1,
  answer:'1♣',caseFamily:'OLDER'}];
for(let i=0;i<24;i++)conceptCatalog.push({
  id:'NEW-'+i,theme:'ouv',difficulty:1,answer:i%2?'1♦':'1♣',
  caseFamily:'FAMILY-'+i
});
const conceptLearner=P.empty();conceptLearner.completed=5;
conceptLearner.entries['OLD-CLUB']={result:'correct',assisted:false,
  lastSession:0,due:3,seen:1,streak:1,family:'OLDER'};
const conceptDeck=P.select(conceptCatalog,conceptLearner,10);
assert.equal(conceptDeck.length,10);
assert.ok(conceptDeck.some(x=>x.kind==='revision'&&x.id!=='OLD-CLUB'),
  'Independent success should be reviewed on a fresh exercise of the same concept');
assert.ok(!conceptDeck.some(x=>x.id==='OLD-CLUB'),
  'Old solved question should not be replayed when fresh alternatives exist');
const weakLearner=P.load(JSON.stringify(conceptLearner));
weakLearner.entries['OLD-CLUB'].result='wrong';
weakLearner.entries['OLD-CLUB'].streak=0;
const weakDeck=P.select(conceptCatalog,weakLearner,10);
assert.ok(weakDeck.some(x=>x.id==='OLD-CLUB'&&x.kind==='revision'),
  'An error must retain the existing direct review');
const refreshed=P.load(JSON.stringify(conceptLearner));
refreshed.completed=6;
refreshed.entries['NEW-0']={result:'correct',assisted:false,
  lastSession:5,due:8,seen:1,streak:1,family:'FAMILY-0'};
assert.ok(!P.select(conceptCatalog,refreshed,10).some(x=>x.id==='OLD-CLUB'),
  'Independent successful reinforcement postpones the old question by concept');

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

// V1 : une micro-categorie large ne vaut pas une competence homologuee.
// Une question Stayman et une Texas apres 1SA ne sont pas interchangeables
// pour repousser les rappels, meme si microKey() vaut sa:1SA pour les deux.
const distinctSA=Array.from({length:80},(_,i)=>({
  id:'SCENARIO-SA-'+i,theme:'sa',difficulty:2+i%2,
  caseFamily:'SCENARIO-FAMILY-'+i,
  answer:['2♣','2♦','2♥','2♠','2SA','3♣','3♦','3SA'][i%8],
  auction:['Partenaire : 1SA']
}));
assert.equal(P.microKey(distinctSA[0]),'sa:1SA');
assert.equal(P.microKey(distinctSA[1]),'sa:1SA');
assert.notEqual(distinctSA[0].answer,distinctSA[1].answer,
  'Stayman and Texas have distinct expected bids');
const oldStayman=P.empty();oldStayman.completed=10;
oldStayman.entries[distinctSA[0].id]={
  result:'correct',assisted:false,lastSession:5,due:8,seen:1,streak:1
};
oldStayman.entries[distinctSA[1].id]={
  result:'correct',assisted:false,lastSession:9,due:12,seen:1,streak:1
};
const oldStaymanBefore=JSON.stringify(oldStayman);
const staymanRecall=P.select(distinctSA,oldStayman,10);
const saById=new Map(distinctSA.map(x=>[x.id,x]));
const reminded=staymanRecall.filter(x=>x.kind==='revision');
assert.equal(reminded.length,1,
  'Due Stayman cannot be suppressed by a recent success on Texas');
assert.equal(reminded[0].reason,'rappel_nouvelle_situation');
assert.equal(saById.get(reminded[0].id).answer,'2♣',
  'Alternate recall must keep the opening AND the expected bid');
assert.equal(JSON.stringify(oldStayman),oldStaymanBefore,
  'The planner remains read-only on saved progress');
assert.deepEqual(P.select(distinctSA,oldStayman,10),staymanRecall,
  'Same progress yields exactly the same deck');
const reinforced=JSON.parse(oldStaymanBefore);
delete reinforced.entries[distinctSA[1].id];
reinforced.entries[distinctSA[8].id]={
  result:'correct',assisted:false,lastSession:9,due:12,seen:1,streak:1
};
assert.equal(P.select(distinctSA,reinforced,10).filter(x=>x.kind==='revision').length,0,
  'A recent autonomous success on the same opening and bid still defers recall');
const failedRecall=P.empty();failedRecall.completed=10;
failedRecall.entries[distinctSA[0].id]={
  result:'wrong',assisted:false,lastSession:9,due:10,seen:1,streak:0
};
assert.ok(P.select(distinctSA,failedRecall,10).some(x=>
  x.id===distinctSA[0].id&&x.kind==='revision'),
  'The direct review of a previous mistake stays unchanged');

console.log('PARCOURS ALGORITHMIQUE V1 PASS: 1523 QCM unchanged, 22 themes, early answers, local resume, mastery and 65 simulated sessions; '+summary.seen+' IDs seen');

// LOT B : banc longitudinal déterministe sur le moteur et le catalogue réels.
require('./quizz-parcours-lot-b.cjs').run();

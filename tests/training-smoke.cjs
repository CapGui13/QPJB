'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const parent=read('index.html'),html=read('entrainement/index.html');
const alternateHtml=read('entrainement/qp-training-corrige.html');
const app=read('entrainement/training-app.js');
const worker=read('service-worker.js');
const core=read('entrainement/training-core.css');
const integrated=read('entrainement/training-integrated.css');
const tokens=read('qpjb-design-tokens.css');
let checks=0;
function check(v,label){assert.ok(v,label);checks++}
check(html.includes('training-data-bootstrap.js?v=20261103h')&&
 alternateHtml.includes('training-data-bootstrap.js?v=20261103h'),
 'both integrated training entry points use the current bootstrap');
for(const [name,css] of Object.entries({core,integrated,tokens})){
 let level=0,min=0;
 for(const c of css){if(c==='{')level++;else if(c==='}'){level--;min=Math.min(min,level)}}
 check(level===0&&min===0,name+' CSS blocks are balanced');
}
new Function(app);checks++;
const playTopicsSource=app.slice(app.indexOf('function pagePlayTopics('),app.indexOf('function miniAuction('));
check(playTopicsSource.includes('onclick="startRandomPlay()">Exercices aléatoires →') &&
  playTopicsSource.indexOf('onclick="startRandomPlay()"')<playTopicsSource.lastIndexOf('$'+'{sections}'),
  'Random card exercises button appears above the first topic');
check(!app.includes('Tous les exercices de carte →'),
  'Obsolete all-card-exercises bottom button is absent');
check(app.includes("function playBackTarget(){return randomMode?'playtopics':'list'}") &&
  app.includes("randomMode?(cat==='play'?'playtopics':'topics'):'list'"),
  'Random card exercises return to card topics, not bidding topics');
const randomPlaySource=app.slice(app.indexOf('function startRandomPlay()'),app.indexOf('function biddingBackTarget()'));
const randomPlayScenario=[
  "const D={play:[{id:'newA'},{id:'seenB'},{id:'quarantine',reviewStatus:'a_verifier'},{id:'newC'}]};",
  "const saved={seenB:{done:true}};",
  "let id='',cat='',status='',ptopic='',randomMode=false,sessionIds=[];",
  "const trainingTopicsScroll={playtopics:0};const trainingScrollY=()=>42;",
  "const trainingNavigate=fn=>fn();const sessionQuizStates={clear:()=>{}};",
  "let nextPage='';const trainingApplyPage=page=>{nextPage=page};",
  "const shuffleExercises=items=>items;",
  randomPlaySource,
  "startRandomPlay();",
  "return cat==='play'&&status==='all'&&ptopic==='all'&&randomMode&&id==='newA'&&nextPage==='quiz'&&trainingTopicsScroll.playtopics===42&&sessionIds.join(',')==='newA,newC,seenB'&&playBackTarget()==='playtopics';"
].join('\n');
check(new Function(randomPlayScenario)(),
  'Random card sessions skip quarantine, prioritize uncompleted exercises and preserve card navigation');

check(app.includes('deal-player-group')&&core.includes('.deal-player-group>.deal-marker.south'),
 'The real player seat circle is placed just above the bottom hand');
check(app.includes('function screenSeat(')&&app.includes('data-perspective=')&&app.includes('function playerSeatFromExercise('),
 'Card viewers distinguish physical table seats from screen positions');
check(app.includes('perspective:playerSeatFromExercise(x,seats)')&&
      app.includes('perspective:playerSeatFromExercise(x,d.seats)'),
 'Both multiple-choice and free-play viewers use player-centered orientation');
check(!/restartExercise|restartControl|Refaire cet exercice|restart-exercise/.test(app),
 'The redo-exercise control and callback are absent from all training screens');
check(!/restart-exercise/.test(core+integrated),
 'No obsolete redo-exercise styles remain');
new Function(worker);checks++;
check(core.includes('#root .symbol-suit.suit-black')&&core.includes('#root .symbol-suit.suit-red'),
 'Suit color rules are explicit and scoped to Training');
check(core.includes('-webkit-text-stroke:0!important')&&!core.includes('-webkit-text-stroke:.65px'),
 'Black suits are solid glyphs without a pale outline on dark feedback');
check(!core.includes('#b8becb')&&core.includes('-webkit-text-stroke:0!important'),
 'Clubs are pure black without the former slate override or white outline');
check(!app.includes('Afficher le visuel source')&&!app.includes('Masquer le visuel source')&&
 !app.includes('<details class="play-source">'),'The optional original diagram toggle is removed');
check(app.includes('sessionQuizStates')&&app.includes('rememberCurrentQuiz')&&app.includes('restoreQuizDetails'),
 'Previous/next remembers selected answers without restarting a visit');
check(integrated.includes('suit-club')&&integrated.includes('suit-diamond'),'Four bridge suit colors are available');
check(app.includes('FE0E')&&app.includes('FE0F'),
 'Suit normalization handles the iPhone emoji variation selectors');
check(worker.includes("CACHE = 'qpjb-v")&&worker.includes('cache.addAll(TRAINING_SHELL)'),
 'service worker installs only the small training shell before activation');
check(worker.includes('BACKGROUND_TRAINING = [...TRAINING_MODULES, ...TRAINING_FACSIMILES]')&&
 worker.includes("event.data?.type !== 'QPJB_PREFETCH_OFFLINE'"),
 'Both exercise modules and 23 images are cached progressively in the background');
check(worker.includes('length:23')&&worker.includes("'entrainement/assets/JC-'"),'all 23 original WebP diagrams are scheduled for offline caching');
check(worker.includes("url.pathname === BASE + 'entrainement/'"),'offline training document handles dynamic mode and revision parameters');
check(app.includes('function focusTrainingPage()')&&app.includes('root.focus({preventScroll:true})'),'single-page navigation restores focus for keyboard and VoiceOver');
check(html.includes('<main id="root" tabindex="-1">'),'training main is programmatically focusable');
for(const script of parent.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(script[1].trim()){new Function(script[1]);checks++}
}
check(!html.includes('training-style.css'),'obsolete stylesheet is not loaded');
check(html.indexOf('qpjb-design-tokens.css')<html.indexOf('training-core.css'),'shared tokens load before base');
check(html.indexOf('training-core.css')<html.indexOf('training-integrated.css'),'integrated CSS loads last');
check(html.indexOf('training-data-bootstrap.js')<html.indexOf('training-app.js'),'lazy data bootstrap loads before the application');
check(/<script defer src="\.\/training-data-bootstrap\.js/.test(html)&&/<script defer src="\.\/training-app\.js/.test(html),
 'Training bootstrap and app execute in source order; exercises load on demand');
check(app.includes("ensureTrainingData(initialMode==='play'?'play':'bidding')")&&
 app.includes("if(!trainingDataReady('play'))"),
 'The correct exercise module loads first and switching modes loads the other');
check(parent.includes('qpjbTrainingFadeNavigate')&&parent.includes('fadeSwap(()=>new Promise'),'QPJB owns page fades');
check(app.includes('qpjb-training-nav-request')&&app.includes('qpjb-training-nav-apply'),'iframe uses coordinated transitions');
check(parent.includes('trainingDepth')&&app.includes('qpjb-training-route-restore'),'browser history can restore pages');
check(app.includes('trainingListScroll')&&app.includes('trainingListScope'),'list scroll is retained');
check(integrated.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'QCM answers remain in two columns');
check(integrated.includes('font-size:clamp(18px,5.45vw,21px)'),'single-line hand remains readable');
check(integrated.includes('overscroll-behavior-x:contain') && integrated.includes('min-width:max-content!important'),
 'Large iOS text can scroll the four suits without shrinking card ranks');
check(!integrated.includes('/* QPJB QCM mobile : une carte compacte'),
 'Superseded mobile bidding preset is removed, not overlaid');
check(app.includes('function syncCardLead(')&&app.includes('if(!guided)syncCardLead(x)'),
 'Card answer changes update played lead without recreating the card viewer');
check(app.includes("const seat=after?playerSeatFromExercise(x,seats):resolveLeadSeat(x)"),
 'A revealed opening lead uses the actual player, including East');
check(app.includes('function cardChoicesCompact(')&&integrated.includes('.cq-stage.cq-compact .cq-options'),
 'Short card choices are responsive, while long choices retain the one-column layout');
check(core.includes('.legacy-defense-source .legacy-defense-heading')&&
      app.includes('aucune orientation supposée'),
 'Ambiguous historical diagrams remain unrotated and are visually identified');
check(app.includes('function resultLabel(')&&app.includes('Validé au premier choix')&&
      app.includes('À retravailler : premier choix non validé')&&
      app.includes('REVIEW_AFTER_DAYS=30'),
 'Progress statuses distinguish first-choice validity, failed answers and 30-day revisions');
check(app.includes('class="muted training-count"')&&core.includes('.training-count')&&
      core.includes('.play-free-panel'),
 'Reused training list and exercise styles do not rely on inline declarations');
check(app.includes('function updateBiddingAnswer('),'answer feedback is updated in place');
check(app.includes('function updateCardAnswer(')&&app.includes('function uncheckCardAnswer('),'card QCM updates and unchecks without rerender');
check(app.includes('cardAnswerArea(x,true)')&&app.includes('cardAnswerArea(x)'),'regular and guided card corrections use in-place containers');
check(!app.includes('recordAnswer(id,index,ok);render()'),'answer handler must not force a full page render');
const seatFunction=app.match(/function seatFromLabel\(label,fallback='south'\)\{[^}]+\}/)?.[0];
check(!!seatFunction,'seat parser must be present');
const seatFromLabel=new Function(seatFunction+'; return seatFromLabel;')();
check(seatFromLabel('Vous · Ouest')==='west','Ouest must not be mistaken for Est');
check(seatFromLabel('Vous · Est')==='east','Est seat recognized correctly');
check(seatFromLabel('Mort · Nord')==='north','dummy remains North');
check(seatFromLabel('Mort · Sud')==='south'&&seatFromLabel('Mort · Ouest')==='west',
 'Explicit dummy compass position wins over the default North convention');
check(app.includes('defense-adjacent')&&app.includes('const defenseSide='),'adjacent defense layout implemented');
check(integrated.includes('prefers-reduced-motion'),'reduced motion is supported');
const raw=read('entrainement/training-data.js').trim();
check(raw.startsWith('const D=')&&raw.endsWith(';'),'data is separate from app');
check(raw.length<1200000,'initial exercise data stays compact (no embedded WebP facsimiles)');
const data=JSON.parse(raw.slice(8,-1));
// Les enchères sont triées dans la vue seulement ; l'ordre source, la bonne
// réponse et les identifiants restent inchangés.
const bidStart=app.indexOf('function biddingChoiceEntries(');
const bidEnd=app.indexOf('\nfunction quizBSource(',bidStart);
check(bidStart>0&&bidEnd>bidStart,'price-ordering helper is available');
const bidEntries=new Function(app.slice(bidStart,bidEnd)+';return biddingChoiceEntries')();
check(JSON.stringify(bidEntries(['4SA','5SA','3SA','Passe']).map(x=>x.value))===
 JSON.stringify(['Passe','3SA','4SA','5SA']),
 'bidding replies order by increasing bid value');
check(JSON.stringify(bidEntries(['3SA','Passe','3♠','3♥']).map(x=>x.index))===
 JSON.stringify([1,3,2,0]),
 'source-guided answers keep their original choice indices after sorting');
check(JSON.stringify(bidEntries(['Main 1','Main 2','Main 3','Main 4']).map(x=>x.value))===
 JSON.stringify(['Main 1','Main 2','Main 3','Main 4'])&&
 JSON.stringify(bidEntries(['Oui','Non']).map(x=>x.value))===JSON.stringify(['Oui','Non']),
 'non-bidding QCM choices are never reordered');
check(JSON.stringify(bidEntries(['Contre','1♠','Passe','1SA']).map(x=>x.value))===
 JSON.stringify(['Passe','Contre','1♠','1SA']),
 'Pass and Double have an explicit stable position before bid values');

check(data.play.filter(x=>x.topic==='Entame'&&x.reviewStatus!=='a_verifier').length===24,
 'All 24 source opening-lead problems remain available and unmodified');
check(data.bidding.length>=560&&data.play.length>=100,'bridge exercises remain available');
check(data.bidding.every(ex=>ex.choices.includes(ex.correct)&&
  bidEntries(ex.choices).length===ex.choices.length&&
  bidEntries(ex.choices).every(entry=>ex.choices[entry.index]===entry.value)),
 'all 563 bidding exercises retain original answers, indexes and corrections');
const facsimiles=JSON.parse(read('tests/training-image-checksums.json'));
check(facsimiles.files.length===23,'23 original image facsimiles externalized');
for(const {id,sha} of facsimiles.files){
 const exercise=data.play.find(x=>x.id===id);
 check(exercise?.image==='./assets/'+id+'.webp',id+' links its original image');
 const bytes=fs.readFileSync(path.join(root,'entrainement/assets',id+'.webp'));
 const actual=crypto.createHash('sha1').update('blob '+bytes.length).update(Buffer.from([0])).update(bytes).digest('hex');
 check(actual===sha,id+' image bytes preserved');
}
check(data.play.filter(x=>x.image?.startsWith('data:image/svg+xml;base64,')).length===7,
 'seven structural SVG diagrams remain inline');
const bh17=['JC-BH-017-Q01','JC-BH-017-Q02','JC-BH-017-Q03','JC-BH-017-Q04'].map(id=>data.play.find(x=>x.id===id));
check(bh17.length===4&&bh17.every(x=>x&&x.type==='declarant'&&x.topic==='Plan de jeu'),'BH-017 is a declarer plan-of-play series');
check(bh17.every(x=>x.holdings?.[0]?.label==='Mort · Nord'&&x.holdings?.[1]?.label==='Vous · Sud'),'BH-017 has North dummy and South declarer');
check(bh17.every(x=>x.options.length===2&&Number.isInteger(x.answerIndex)),'BH-017 answer options preserved');
// Le trio de QCM de carte est accessible avec un barème documentaire non automatique.
const playAdaptations=[
 ['JC-BH-014-Q01',0],['JC-BH-028-Q04',2],['JC-BH-036-Q02',1]
];
for(const [id,answer] of playAdaptations){
 const x=data.play.find(z=>z.id===id);
 check(!!x&&x.reviewStatus==='transcrit_source'&&x.answerIndex===answer&&
  !x.quarantineReason&&x.pedagogicalArbitration?.decision==='adaptation_pedagogique',
  'adapted card exercise is accessible in ungraded source-guided mode: '+id);
 check(x.sourceOriginalPrompt?.length>20&&x.sourceOriginalOptions?.length>=3&&
  Number.isInteger(x.sourceOriginalAnswerIndex)&&x.sourceOriginalExplanation?.length>15&&
  x.quarantineHistoryBeforeArbitration?.length>30,
  'all original card questions, answers and quarantine reasons archived: '+id);
 check(x.options.length>=3&&new Set(x.options).size===x.options.length&&
  Object.keys(x.playPretryHints||{}).length===x.options.length-1&&
  x.playPretryHints[String(x.answerIndex)]===undefined,
  'distinct options and correct alternate-answer hints: '+id);
}
check(data.play.find(x=>x.id==='JC-BH-014-Q01').explanation.includes('Roi et As de Carreau'),
 'communication exercise targets feasible diamond unblocking rather than impossible full plan');
check(data.play.find(x=>x.id==='JC-BH-028-Q04').prompt.includes('fournit le 2♥')&&
 data.play.find(x=>x.id==='JC-BH-028-Q04').options[2]==='♥9',
 'third-hand equivalence is explicitly conditioned on dummy playing the deuce');
check(data.play.find(x=>x.id==='JC-BH-036-Q02').prompt.includes('reprise extérieure')&&
 data.play.find(x=>x.id==='JC-BH-036-Q02').options.every(o=>!o.includes('Jouer immédiatement le 7')),
 'suit combination has an external return and no ambiguous Ace-first distractor');

// JC-021 : contre-exemple et archive du corrige historique.
const jc021=data.play.find(x=>x.id==='JC-021');
check(!!jc021&&jc021.reviewStatus==='a_relire'&&jc021.sourceOriginalAnswerText?.includes('Est n’a plus de Pique à rejouer')&&
 jc021.answerText.includes('♠109876')&&jc021.answerText.includes('cinq levées')&&
 !jc021.answerText.includes('Il ne peut rien lui arriver')&&
 jc021.strategicAuditStatus==='contre_exemple_complet_documente_mais_plan_optimal_non_certifie',
 'JC-021 documents East five spades counterexample and archives original source');
check(jc021.pedagogicalAudit_20261103h?.counterexample?.hcp?.east===4&&
 jc021.pedagogicalAudit_20261103h?.counterexample?.hcp?.north===13,
 'JC-021 40 HCP witness and matching visible hands');

check(data.play.length===114&&data.play.filter(x=>x.reviewStatus!=='a_verifier').length===114,
 '114 card exercises preserved and accessible');
const bh42=data.play.find(x=>x.id==='JC-BH-042-Q01');
check(bh42?.prompt.includes('Est a ouvert de 1♠')&&bh42?.answerIndex===1,'BH-042 preserves original auction context and answer');
check(app.includes("D.play.filter(x=>x.reviewStatus!=='a_verifier'"),'play lists exclude quarantined exercises');
check(app.includes("if(!availableExercise(v))return;"),'direct navigation rejects quarantined exercise IDs');
check(app.includes("if(next==='quiz'&&!availableExercise(id))"),'old routes to quarantined exercises return to the list');
check(app.includes("x&&x.reviewStatus!=='a_verifier'?x:null"),'all exercise access checks review status');

const start=app.indexOf('let trainingNavSeq=0');
const end=app.indexOf('function playTopicId(',start);
const i=app.indexOf('function item('),j=app.indexOf('function current(',i);
check(start>=0&&end>start&&i>=0&&j>i,'navigation handlers are present');
const nav=app.slice(start,end)+'\n'+app.slice(i,j);
const harness=[
 "const sent=[],scrolls=[];let renders=0;",
 "const window={scrollY:0,scrollTo:(x,y)=>scrolls.push(y),parent:{postMessage:msg=>sent.push(msg)}};", 
  "const trainingScrollY=()=>window.scrollY,trainingScrollTo=y=>window.scrollTo(0,y);let randomMode=false;",
 "const location={origin:'https://test.invalid'},embeddedMode=true,integratedMode=true;",
 "const trainingDataReady=()=>true;const ensureTrainingData=()=>Promise.resolve();",
 "const requestAnimationFrame=callback=>callback();",
 "let view='topics',cat='',status='all',ptopic='all',sessionIds=[],chosen=null;",
 "let redoAttempt=null,redoAnswered=false,revealed=false,playSeen=false,id='';",
 "const document={querySelector:()=>null,getElementById:()=>null};const sessionQuizStates=new Map();const restoreQuizDetails=()=>{};const rememberCurrentQuiz=()=>{};const render=()=>{renders++};const filtered=()=>[{id:'EX1'},{id:'EX2'}];const quitTraining=()=>{};const D={bidding:[{id:'EX1'},{id:'EX2'}],play:[]};",
 nav,
 "function complete(){const p=trainingPendingNav;if(!p)throw Error('missing transition');trainingPendingNav=null;p.action();const q=trainingQueuedNav;trainingQueuedNav=null;if(q)trainingNavigate(q)}",
 "topic('2sa');const queued=view==='topics'&&sent.at(-1).type==='qpjb-training-nav-request';complete();",
 "const list=view==='list'&&cat==='2sa';window.scrollY=418;item('EX2');complete();",
 "const quiz=view==='quiz'&&id==='EX2'&&sessionIds.length===2;go('list');complete();",
 "const priorOk=view==='list'&&scrolls.at(-1)===418&&sent.filter(x=>x.type==='qpjb-training-route').length===3;",
 "topic('ouverture');topic('2sa');const secondClickQueued=!!trainingQueuedNav;complete();",
 "const secondClickInFlight=!!trainingPendingNav;complete();",
 "return queued&&list&&quiz&&priorOk&&secondClickQueued&&secondClickInFlight&&cat==='2sa'&&view==='list';"
].join('\n');
check(new Function(harness)(),'navigation and scroll preservation scenario');
// B10 ambiguity regressions : never mark an author-approved alternative as wrong.
const splitBidding=read('entrainement/training-data-bidding.js').trim();
check(splitBidding.startsWith('D.bidding=')&&splitBidding.endsWith(';'),'lazy bidding module is valid JS data');
const splitItems=JSON.parse(splitBidding.slice('D.bidding='.length,-1));
check(JSON.stringify(data.bidding)===JSON.stringify(splitItems),
 'source master and lazy bidding module stay in sync');
const excludedAlternatives=[
 {id:'EN-1m-009',answer:'1SA',excluded:'2♣',alternative:'1♦'},
 {id:'EN-1m-011',answer:'1♦',excluded:'1♠',alternative:'2♦'}
];
for(const {id,answer,excluded,alternative} of excludedAlternatives){
 const x=splitItems.find(e=>e.id===id);
 check(!!x,'documented B10 exercise exists: '+id);
 check(x.correct===answer&&x.choices.includes(answer),'correct bid is unchanged: '+id);
 check(!x.choices.includes(excluded)&&x.choices.includes(alternative),
   'second defensible bid not penalised: '+id);
 check(x.choices.length===4&&new Set(x.choices).size===4,'four unique proposals: '+id);
 check(Object.keys(x.pretryHints||{}).every(k=>x.choices.includes(k)&&k!==answer),
   'pretry hints only refer to current wrong choices: '+id);
 check(Object.keys(x.distractorNotes||{}).every(k=>x.choices.includes(k)&&k!==answer),
   'distractor explanations only refer to current wrong choices: '+id);
}
// 2 Nov 2026: trois inversions de chassé-croisé corrigées selon SEF.
// Les 35 fiches historiques "transcrit_source" sont encore en auto-évaluation ; ne pas modifier le stockage.
const sefCross=[
 {id:'EN-1sa-011',before:'3♠',after:'3♥',choices:['3SA','3♥','3♠','Passe']},
 {id:'EN-2sa-005',before:'3♥',after:'3♠',choices:['3SA','Passe','3♠','3♥']},
 {id:'EN-BH-115-06',before:'4♥',after:'4♠',choices:['4♦','4♥','4♠','4♣']}
];
for(const {id,before,after,choices} of sefCross){
 const x=splitItems.find(x=>x.id===id);
 check(!!x&&x.correct===after&&JSON.stringify(x.choices)===JSON.stringify(choices),
   'SEF chasse croise expected choices and new answer: '+id);
 check(x.sourceOriginalCorrect===before&&x.sourceOriginalExplanation?.length>0,
   'original documentary answer and explanation preserved: '+id);
 check(x.reviewStatus==='transcrit_source'&&x.pedagogicalArbitration?.decision==='correction_SEF',
   'source-guided self assessment and SEF arbitration documented: '+id);
 check(x.choices.length===4&&new Set(x.choices).size===4&&
   Object.keys(x.distractorNotes).length===3&&Object.keys(x.pretryHints).length===3&&
   Object.keys(x.distractorNotes).every(choice=>x.choices.includes(choice)&&choice!==after)&&
   Object.keys(x.pretryHints).every(choice=>x.choices.includes(choice)&&choice!==after),
   'exactly 3 distinct wrong options with aligned hints: '+id);
 check(!x.quarantineReason,'old convention caveat closed after SEF correction: '+id);
}
const cleared=['EN-1sa-008','EN-BH-048-03','EN-BH-115-05','EN-BH-092-05'];
for(const id of cleared){
 const x=splitItems.find(x=>x.id===id);
 check(!!x&&x.reviewStatus==='transcrit_source'&&
   x.pedagogicalReview_20261102?.decision==='reserve_levee'&&
   !!x.historicalQuarantineReason20261102&&!x.quarantineReason,
   'documentary SEF reservation resolved with history preserved: '+id);
}
check(splitItems.filter(x=>x.quarantineReason&&x.reviewStatus!=='a_verifier').length===0,
 'the three slam/competitive documentary caveats are no longer accessible');
check(read('entrainement/index.html').includes('training-data-bootstrap.js?v=20261103h')&&
 read('entrainement/qp-training-corrige.html').includes('training-data-bootstrap.js?v=20261103h'),
 'both entry points load the current pedagogical module');
check(read('service-worker.js').includes("const CACHE = 'qpjb-v52'"),
 'PWA cache revision invalidated for updated SEF exercises');
// Résolution SEF documentée de deux dernières réserves Texas / réponse naturelle à 2SA.
for(const {id,answer} of [{id:'EN-BH-019-04',answer:'2♥'},{id:'EN-BH-025-01',answer:'4♥'}]){
 const x=splitItems.find(x=>x.id===id);
 check(!!x&&x.correct===answer&&x.reviewStatus==='transcrit_source'&&
   x.pedagogicalReview_20261102?.decision==='reserve_levee'&&
   !!x.historicalQuarantineReason20261102&&!x.quarantineReason,
   'FFB source verifies historical bidding reserve: '+id);
}
const d25=splitItems.find(x=>x.id==='EN-BH-025-01');
check(d25.pretryHints['4♦'].includes('bicolore majeur 5–5')&&
 d25.distractorNotes['4♦'].includes('5–5')&&
 d25.sourceOriginalExplanation?.length>0,
 '4-diamond distractor must be conventionally explained and original source text retained');
check(splitItems.filter(x=>x.quarantineReason&&x.reviewStatus!=='a_verifier').length===0,
 'no unresolved historical source caveat is still accessible');
// 3 Nov : corriger explicitement B19-Q6 en 5SA quantitatif et restituer la fiche guidée.
const b19=splitItems.find(e=>e.id==='EN-2sa-006');
check(!!b19&&b19.hand.join('|')==='RD104|AD5|D7|DV84'&&b19.correct==='5SA',
 'B19-6 holds 16 H and the quantitative grand-slam invitation 5SA');
check(b19.reviewStatus==='transcrit_source'&&b19.sourceOriginalCorrect==='4SA'&&
 b19.sourceOriginalExplanation?.length>0&&
 b19.pedagogicalArbitration?.decision==='correction_SEF'&&
 b19.pedagogicalReview_20261103?.decision==='reserve_levee_apres_correction',
 'B19-6 corrected SEF answer explicitly distinct from original PDF with progress preserved');
check(b19.choices.length===4&&b19.choices.includes('5SA')&&
 Object.keys(b19.distractorNotes||{}).length===3&&
 Object.keys(b19.pretryHints||{}).length===3&&!b19.quarantineReason,
 'B19-6 original four choices remain unambiguous and SEF hints are synchronized');
const b90=splitItems.find(e=>e.id==='EN-BH-090-06');
check(!!b90&&b90.correct==='4SA'&&b90.choices.includes('4SA')&&
 b90.choices.includes('6♠')&&b90.sourceOriginalCorrect==='6♠'&&
 JSON.stringify(b90.sourceOriginalChoices)==='["6♥","6♠","6SA","6♦"]',
 'BH090-6 asks 4SA RKCB instead of a premature 6 spades, original PDF retained');
check(b90.reviewStatus==='transcrit_source'&&
 b90.pedagogicalArbitration?.decision==='correction_SEF'&&
 b90.pedagogicalReview_20261103?.decision==='reserve_levee_apres_correction'&&
 b90.sourceOriginalExplanation?.length>0&&b90.choices.length===4&&
 new Set(b90.choices).size===4&&!b90.quarantineReason,
 'BH090-6 source-guided mode remains non automatically graded with original history');
check(Object.keys(b90.pretryHints||{}).length===3&&
 Object.keys(b90.distractorNotes||{}).length===3&&
 Object.keys(b90.distractorNotes).every(choice=>b90.choices.includes(choice)&&choice!==b90.correct),
 'BH090-6 distractors match the new answer 4SA');
for(const id of ['EN-BH-075-04','EN-BH-102-01']){
 const x=splitItems.find(e=>e.id===id);
 check(!!x&&x.correct==='3♠'&&x.reviewStatus==='transcrit_source'&&
 x.pedagogicalReview_20261103?.decision==='reserve_levee'&&
 x.historicalReviewReason20261103?.length>0&&
 Object.keys(x.distractorNotes||{}).length===3&&
 !x.quarantineReason,
 'SEF direct major 3-spades support with four trumps and 12 HLD: '+id);
}
check(splitItems.filter(x=>x.reviewStatus==='a_verifier').length===0,
 'the three adapted SEF QCM are accessible in documentary guided mode');
// Les trois anciens corrigés demeurent archivés ; nouvelles réponses sans notation automatique.
const adapted=[
 ['EN-suite-repondant-003','6♠','5♥'],
 ['EN-BH-077-04','6♥','3♥'],
 ['EN-BH-078-05','4♠','4♠']
];
for(const [id,originalAnswer,answer] of adapted){
 const x=splitItems.find(ex=>ex.id===id);
 check(!!x&&x.correct===answer&&x.sourceOriginalCorrect===originalAnswer&&
  x.sourceOriginalChoices?.length===4&&x.sourceOriginalExplanation?.length>25,
  'original exercise answer, choices and explanation archived: '+id);
 check(x.reviewStatus==='transcrit_source'&&!x.quarantineReason&&
  x.quarantineHistoryBeforeArbitration?.length>30&&
  x.pedagogicalReviewBeforeAdaptation20261103?.decision==='quarantaine'&&
  x.pedagogicalArbitration?.sourceOriginalCorrect===originalAnswer,
  'source-led self-assessment with quarantine history retained: '+id);
 check(x.choices.length===4&&new Set(x.choices).size===4&&x.choices.includes(answer)&&
  Object.keys(x.distractorNotes||{}).length===3&&Object.keys(x.pretryHints||{}).length===3&&
  Object.keys(x.pretryHints).every(choice=>x.choices.includes(choice)&&choice!==answer),
  'four distinct choices with three relevant distractors: '+id);
}
const adaptedBarrage=splitItems.find(x=>x.id==='EN-BH-078-05');
check(adaptedBarrage.choices.includes('Passe')&&/non vulnérable/.test(adaptedBarrage.question),
 'barrage question supplies favorable vulnerability and Pass choice');
check(data.bidding.length===563&&data.bidding.filter(x=>x.reviewStatus!=='a_verifier').length===563,
 '563 preserved and accessible EN exercises');
check(splitItems.filter(x=>x.quarantineReason&&x.reviewStatus!=='a_verifier').length===0,
 'no newly accessible card retains a quarantine warning');
const lazyData=read('entrainement/training-data-bootstrap.js');
const baseMatch=lazyData.match(/const D=([^\n]+);\nconst trainingDataLoads=/);
check(!!baseMatch,'lazy bootstrap still declares its categories and counts');
const lazyBase=JSON.parse(baseMatch[1]);
check(lazyBase.counts.bidding===563&&lazyBase.counts.play===114,
 'bootstrap count reflects unavailable bidding and card exercises');
check(lazyBase.categories.find(c=>c.id==='2sa').count===13&&
 lazyBase.categories.find(c=>c.id==='suite-repondant').count===73&&
 lazyBase.categories.find(c=>c.id==='rep-barrage').count===12&&
 lazyBase.categories.find(c=>c.id==='rep1M').count===20&&
 lazyBase.categories.find(c=>c.id==='suite-ouvreur').count===16,
 'topic counters reflect the exact quarantined IDs');
const bh120=data.play.find(x=>x.id==='JC-BH-120-01');
check(!!bh120&&bh120.sourceOriginalAnswerText?.includes('Revenez au mort')&&
 bh120.answerText.includes('10 de Pique')&&bh120.answerText.includes('Dame se trouve en Ouest')&&
 bh120.pedagogicalAudit_20261103?.verdict?.includes('erreur de formulation certaine')&&
 bh120.reviewStatus!=='a_verifier',
 'BH-120 precision: preserve PDF source, use South ten as sole entry toward A-J');
const cc13=data.play.find(x=>x.id==='JC-013');
check(!!cc13&&cc13.sourceOriginalAnswerText?.includes('Il ne peut plus rien vous arriver')&&
 cc13.answerText.includes('Ouest est chicane Pique')&&
 cc13.answerText.includes('ne sont pas, à elles seules, des atouts maîtres')&&
 cc13.pedagogicalAudit_20261103?.verdict?.includes('affirmation universelle erronée')&&
 cc13.reviewStatus!=='a_verifier',
 'JC-013 counterexample: preserve source and correct non-guaranteed cross-ruff claim');

const defense12=data.play.find(x=>x.id==='JC-012');
check(!!defense12&&defense12.sourceOriginalAnswerText?.includes('As de Coeur est forcément en Ouest')&&
 defense12.answerText.includes('ne prouve pas que sa couleur est commandée par Roi-Dame-Valet')&&
 defense12.answerText.includes('9 H')&&defense12.answerText.includes('le 2♣')&&
 defense12.pedagogicalAudit_20261103b?.verdict?.includes('As de Coeur non localisable')&&
 defense12.reviewStatus!=='a_verifier',
 'JC-012: heart Ace placement is conditional; original answer archived');
const deal12=defense12.pedagogicalAudit_20261103b.counterexample;
const ranks12='ARDVT98765432',points12={A:4,R:3,D:2,V:1};
const suits12=['spades','hearts','diamonds','clubs'],seats12=['north','east','south','west'];
let total12=0,south12=0,valid12=true;
for(const seat of seats12){
 let cards=0,score=0;
 for(const suit of suits12){
  const holding=String(deal12[seat][suit]).replace(/10/g,'T');
  cards+=holding.length;
  for(const rank of holding){valid12=valid12&&ranks12.includes(rank);score+=points12[rank]||0;}
 }
 valid12=valid12&&cards===13;
 total12+=score;
 if(seat==='south')south12=score;
}
for(const suit of suits12){
 const all=seats12.map(seat=>String(deal12[seat][suit]).replace(/10/g,'T')).join('');
 valid12=valid12&&all.length===13&&new Set(all).size===13;
}
check(valid12&&total12===40&&south12===9&&deal12.south.hearts==='A'&&
 deal12.firstTrick.includes('E ♠D'),
 'JC-012: valid 52-card counterexample South has nine H including Heart Ace');

const slam007=data.play.find(x=>x.id==='JC-007');
const correctedHearts=data.bidding.find(x=>x.id==='EN-BH-077-04');
check(!!slam007&&!!correctedHearts&&correctedHearts.correct==='3♥'&&
 slam007.sourceOriginalAnswerText?.includes('Cela lui suffit pour sauter directement au petit chelem')&&
 slam007.answerText.includes('ne doit pas être retenue comme une règle d’enchères du SEF')&&
 slam007.answerText.includes('33 HLD ne suffit pas à imposer le petit chelem')&&
 slam007.answerText.includes('répétition à 3♥')&&
 slam007.answerText.includes('quatre As')&&
 slam007.questionText.includes('6♥')&&
 slam007.pedagogicalAudit_20261103c?.internalReference?.includes('EN-BH-077-04')&&
 slam007.reviewStatus!=='a_verifier',
 'JC-007 SEF: historical direct slam preserved, pedagogical guidance corrected');
console.log('QPJB Training smoke: '+checks+' checks passed.');

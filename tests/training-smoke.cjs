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
check(html.includes('training-data-bootstrap.js?v=20261109l08r8hl10')&&
 alternateHtml.includes('training-data-bootstrap.js?v=20261109l08r8hl10'),
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
// Seul le bootstrap est chargé à l'ouverture : le fichier maître sert aux audits
// et grandit naturellement avec les nouveaux exercices, sans ralentir l'accueil.
const lazyInit=read('entrainement/training-data-bootstrap.js');
check(lazyInit.length<8000&&!lazyInit.includes('data:image/'),
 'initial lazy-loaded metadata stays compact without embedded binary facsimiles');
check(raw.length<1500000&&!raw.includes('data:image/webp;base64,'),
 'complete source dataset remains bounded without embedded WebP facsimiles');
const data=JSON.parse(raw.slice(8,-1));

const lot02Bid=id=>data.bidding.find(x=>x.id===id);
const lot02Play=id=>data.play.find(x=>x.id===id);
check(lot02Bid('EN-BH-133-01').question.includes('sujet original indique 1♥')&&lot02Bid('EN-BH-133-01').correct==='1SA','Lot02 subject/correction divergence disclosed');
check(lot02Bid('EN-BH-136-06').question.includes('sans arrêt ♠')&&lot02Bid('EN-BH-136-06').correct==='1SA','Lot02 1NT without stopper scoped');
check(lot02Bid('EN-BH-140-06').question.includes('vulnérabilité favorable')&&lot02Bid('EN-BH-140-06').explanation.includes('Passe'),'Lot02 competitive bid conditions disclosed');
check(lot02Play('JC-BH-129-01').prompt.includes('Accord de cette question')&&lot02Play('JC-BH-129-01').answerText.includes('hypothèse'),'Lot02 signal agreement explicit');
const lot02Clubs=lot02Play('JC-BH-132-M02');
check(lot02Clubs.holdings[0].rows[0].ranks==='ARV109'&&lot02Clubs.holdings[1].rows[0].ranks==='42'&&
 lot02Clubs.prompt.includes('quelle ligne privilégier')&&
 lot02Clubs.answerText.includes('oblige Sud à fournir ♣2 ou ♣4')&&
 lot02Clubs.answerText.includes('43,2 %')&&lot02Clubs.answerText.includes('28,3 %')&&
 lot02Clubs.answerText.includes('♣D quatrième en Ouest')&&
 !lot02Clubs.answerText.includes('ne consomme aucune'),
 'Lot02 clubs: two small South cards support two finesses; exact probability comparison verified');

const lot02Combinations=(n,k)=>{
 if(k<0||k>n)return 0;
 let c=1;
 for(let i=1;i<=k;i++)c=c*(n+1-i)/i;
 return Math.round(c);
};
const lot02Total=lot02Combinations(26,13);
const lot02QueenWest=k=>lot02Combinations(5,k-1)*lot02Combinations(20,13-k);
const lot02Double=[1,2,3,4].reduce((s,k)=>s+lot02QueenWest(k),0)/lot02Total;
const lot02Probe=([1,2,3].reduce((s,k)=>s+lot02QueenWest(k),0)+lot02QueenWest(1))/lot02Total;
check(Math.abs(lot02Double-0.43198757763975154)<1e-10&&
 Math.abs(lot02Probe-0.2826086956521739)<1e-10&&
 Math.round(lot02Double*1000)/10===43.2&&Math.round(lot02Probe*1000)/10===28.3,
 'Lot02 full 13-card combinatorial count independently verifies two fixed club lines');

check(lot02Play('JC-BH-091-P2-2').answerText.includes('aucune reprise extérieure'),'Lot02 unnecessary entry to South removed');
check(lot02Play('JC-BH-037-M03').answerText.includes('Nord → Sud')&&lot02Play('JC-BH-037-M03').answerText.includes('♥V de Sud'),'Lot02 correct direction of heart finesse');
check(!lot02Play('JC-BH-104-P2-1').answerText.includes(' ; ')&&!lot02Play('JC-BH-104-P2-1').answerText.includes('garantie..'),'Lot02 punctuation cleaned');

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

check(data.play.filter(x=>x.topic==='Entame'&&x.reviewStatus!=='a_verifier').length===32,
 'All 24 original opening-lead problems and four new Lot 05 lead lessons remain available');
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
// Lot d'extension B/C : 17 enchères + 10 jeux de carte, réserves exclues.
const extensionBidIds=["EN-BH-134-05","EN-BH-135-02","EN-BH-084-01","EN-BH-084-02","EN-BH-084-03","EN-BH-084-04","EN-BH-084-05","EN-BH-084-06","EN-BH-111-02","EN-BH-111-03","EN-BH-111-05","EN-BH-032-P2-06","EN-BH-036-P2-05","EN-BH-036-P2-06","EN-BH-040-P2-01","EN-BH-040-P2-02","EN-BH-043-P2-02"];
const extensionPlayIds=["JC-BH-107-P2","JC-BH-108-P2","JC-BH-109-P2","JC-BH-110-P2","JC-BH-115-P2","JC-BH-116-P2","JC-BH-119-P2","JC-BH-122-P2","JC-BH-123-P2","JC-BH-125-P2"];
for(const key of extensionBidIds){const q=data.bidding.find(x=>x.id===key);
 check(!!q&&q.hand.length===4&&q.hand.join(' ').replace(/10/g,'T').replace(/\s/g,'').length===13,
 'extension bidding 13-card hand: '+key);
 check(q.auction.flatMap(row=>row.map((v,i)=>v==='?'?i:-1)).filter(i=>i>=0).length===1&&
  q.auction.some(row=>row[0]==='?')&&q.choices.includes(q.correct),
 'extension bidding South seat and single expected answer: '+key);
}
for(const key of extensionPlayIds){const q=data.play.find(x=>x.id===key);
 check(!!q&&q.sourceFormat==='two_known_hands_20261106'&&q.holdings.length===2&&
 q.holdings.every(h=>h.rows.length===4&&h.rows.map(r=>r.ranks).join(' ').replace(/10/g,'T').replace(/\s/g,'').length===13),
 'extension card: only two certified 13-card hands: '+key);
}
check(data.play.find(x=>x.id==='JC-BH-116-P2').holdings[1].label==='Vous · Est'&&
 app.includes('x.holdings.length===2')&&app.includes('buildCardSeats(x)'),
 'extension defense: explicit East seat remains East regardless of sourceFormat');
check(!data.bidding.some(x=>['EN-BH-129-04','EN-BH-032-P2-04','EN-BH-040-P2-06'].includes(x.id))&&
 !data.play.some(x=>x.id==='JC-BH-117-P2'),
 'extension blocked candidates remain excluded');
// Contre-expertise des corrections documentaires BH-070 et BH-014 (2026-11-06).
const bh70 = data.bidding.find(x=>x.id==='EN-BH-070-01');
check(!!bh70 && bh70.correct==='3SA' && !bh70.choices.includes('2♣') &&
 bh70.explanation.includes('2♣') && /meilleure/.test(bh70.question),
 'BH-070: do not mark admissible 2 clubs as wrong');
const jc14 = data.play.find(x=>x.id==='JC-BH-014-Q01');
check(!!jc14 && jc14.answerIndex===0 && jc14.options[0].includes('♥3') &&
 jc14.options[0].includes('♣D') && jc14.options[0].includes('♦R') &&
 jc14.explanation.includes('six levées'),
 'BH-014: complete six-trick source plan restored');
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
check(data.play.find(x=>x.id==='JC-BH-014-Q01').explanation.includes('six levées') &&
 data.play.find(x=>x.id==='JC-BH-014-Q01').options[0].includes('♥3'),
 'BH-014 retains its six-trick source plan');
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

check(data.play.length===188&&data.play.filter(x=>x.reviewStatus!=='a_verifier').length===188,
 '188 card exercises including 6 Lot 06 lessons, accessible');
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
check(read('entrainement/index.html').includes('training-data-bootstrap.js?v=20261109l08r8hl10')&&
 read('entrainement/qp-training-corrige.html').includes('training-data-bootstrap.js?v=20261109l08r8hl10'),
 'both entry points load the current pedagogical module');
check(read('service-worker.js').includes("const CACHE = 'qpjb-v67'"),
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
check(data.bidding.length===638&&data.bidding.filter(x=>x.reviewStatus!=='a_verifier').length===638,
 '638 bidding exercises including Lot 09 QCM, accessible');
check(splitItems.filter(x=>x.quarantineReason&&x.reviewStatus!=='a_verifier').length===0,
 'no newly accessible card retains a quarantine warning');
const lazyData=read('entrainement/training-data-bootstrap.js');
const baseMatch=lazyData.match(/const D=([^\n]+);\nconst trainingDataLoads=/);
check(!!baseMatch,'lazy bootstrap still declares its categories and counts');
const lazyBase=JSON.parse(baseMatch[1]);
check(lazyBase.counts.bidding===638&&lazyBase.counts.play===188,
 'bootstrap count reflects unavailable bidding and card exercises');
check(lazyBase.categories.find(c=>c.id==='2sa').count===14&&
 lazyBase.categories.find(c=>c.id==='suite-repondant').count===87&&
 lazyBase.categories.find(c=>c.id==='rep-barrage').count===14&&
 lazyBase.categories.find(c=>c.id==='rep1M').count===23&&
 lazyBase.categories.find(c=>c.id==='suite-ouvreur').count===16,
 'topic counters include Lot 08 candidates and preserve the earlier distribution');
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
// Lot 03 : seuls les 13 candidats à double expertise concordante sont importés.
const lot03ImportedBidIds=['EN-BH-029-03','EN-BH-095-06','EN-BH-108-06'];
const lot03ImportedCardIds=[
 'JC-BH-056-P2','JC-BH-057-P2','JC-BH-063-P2','JC-BH-065-P2',
 'JC-BH-066-P2','JC-BH-068-P2','JC-BH-074-P2','JC-BH-075-P2',
 'JC-BH-076-P2','JC-BH-078-P2'
];
check(lot03ImportedBidIds.every(id=>data.bidding.some(x=>x.id===id))&&
 lot03ImportedCardIds.every(id=>data.play.some(x=>x.id===id)),
 'All thirteen independently confirmed Lot 03 exercises exist in the app');
check(data.play.filter(x=>x.playEditorialStatus==='lot03_double_lecture_20261106').length===10&&
 lot03ImportedBidIds.every(id=>data.bidding.find(x=>x.id===id)?.reviewStatus==='relecture_pedagogique_necessaire'),
 'Lot 03 new exercises have explicit documentary review status');
const lot03Excluded=['EN-BH-029-04','EN-BH-029-06','JC-BH-085-P2'];
check(lot03Excluded.every(id=>![...data.bidding,...data.play].some(x=>x.id===id)),
 'Unresolved Lot 03 discrepancies must not be imported');
check(lazyBase.categories.find(c=>c.id==='2sa')?.count===14&&
 lazyBase.categories.find(c=>c.id==='reveil')?.count===6&&
 lazyBase.categories.find(c=>c.id==='suite-repondant')?.count===87,
 'Lot 03 categories retain exact expected counts');
check(data.play.find(x=>x.id==='JC-BH-074-P2')?.lead==='♠5 (Ouest)'&&
 data.play.find(x=>x.id==='JC-BH-074-P2')?.prompt.includes('♠9 d’Est'),
 'BH-074 lead appears alone on the diagram while the complete first trick is described');


const lot05BidIds=["EN-BH-136-03","EN-BH-139-05","EN-BH-126-06","EN-BH-129-05"];
const lot05PlayIds=["JC-BH-132-Q01","JC-BH-132-Q05","JC-BH-132-Q06","JC-BH-077-P2","JC-BH-086-P2","JC-BH-114-P2-01","JC-BH-114-P2-02","JC-BH-114-P2-03","JC-BH-114-P2-04","JC-BH-104-05"];
check(lot05BidIds.every(id=>{const x=data.bidding.find(q=>q.id===id);
 return x&&x.reviewStatus==='valide_edition_lot05_20261107'&&x.hand?.length===4&&
 x.choices?.length===4&&x.choices.includes(x.correct);}),
 'Lot 05 four edited bidding QCM: complete hands and four choices');
check(lot05PlayIds.every(id=>{const x=data.play.find(q=>q.id===id);
 return x&&x.playEditorialStatus==='lot05_editorial_final_20261107'&&
 x.prompt?.trim()&&x.answerText?.trim()&&x.holdings?.length>=1&&
 x.holdings.length<=2&&x.sourceAudit?.hidden_defender_hands_not_shown;}),
 'Lot 05 ten edited open card lessons: only source-proven hands');
const lot05Excluded=['EN-BH-136-02','EN-BH-136-04','EN-BH-139-03',
 'JC-BH-104-01','JC-BH-079-01','EN-BH-127-02','JC-BH-132-Q02',
 'JC-BH-090-P2','JC-BH-121-P2'];
check(lot05Excluded.every(id=>![...data.bidding,...data.play].some(x=>x.id===id)),
 'Lot 05 refused and unresolved exercises excluded');


const lot05CorrectAuctions={"EN-BH-136-03":[["","","1♣","1♠"],["?","","",""]],"EN-BH-139-05":[["","","1♦","passe"],["1♠","passe","1SA","passe"],["?","","",""]],"EN-BH-126-06":[["","","1♠","passe"],["2♠","passe","3♠","passe"],["?","","",""]],"EN-BH-129-05":[["","1♥","1♠","passe"],["?","","",""]]};
check(Object.entries(lot05CorrectAuctions).every(([id,rows])=>
 JSON.stringify(data.bidding.find(x=>x.id===id)?.auction)===JSON.stringify(rows)&&
 rows.flat().filter(x=>x==='?').length===1&&
 rows.flatMap(row=>row.map((value,seat)=>value==='?'?seat:-1)).filter(seat=>seat>=0)[0]===0),
 'Lot 05 auction chronology and the South seat to play are faithfully reconstructed');


for(const [qid,answer,level] of [['EN-BH-126-01','Passe',1],['EN-BH-127-04','3♥',2]]){
 const q=data.bidding.find(x=>x.id===qid);
 check(!!q&&q.correct===answer&&q.level===level&&
  q.hand.length===4&&q.hand.flatMap(s=>s.trim().split(/\s+/)).length===13&&
  q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(answer)&&
  Object.keys(q.distractorNotes||{}).length===3&&
  Object.keys(q.pretryHints||{}).length===3&&
  q.reviewStatus==='valide_contre_expertise_independante_lot10_20261109',
  'Lot10 validated independent QCM: '+qid);
}

const p1Bh055=data.bidding.find(x=>x.id==='EN-BH-055-06');
check(!!p1Bh055&&p1Bh055.correct==='5♦'&&
 JSON.stringify(p1Bh055.choices)===JSON.stringify(['5♣','5♦','5♥','5♠'])&&
 p1Bh055.question.includes('Si vous envisagez')&&
 p1Bh055.question.includes('non vulnérable')&&
 p1Bh055.explanation.includes('Passe reste')&&
 p1Bh055.explanation.includes('au moins dix atouts')&&
 p1Bh055.explanation.includes('ne garantit'),
 'P1 BH055: sacrifice explicitly conditional, vulnerability specified and no guaranteed tricks');
check(JSON.stringify(Object.keys(p1Bh055.distractorNotes||{}).sort())===
 JSON.stringify(p1Bh055.choices.filter(c=>c!==p1Bh055.correct).sort()),
 'P1 BH055: distractor notes fit all three actual wrong choices');
const p1Bh061=data.bidding.find(x=>x.id==='EN-BH-061-05');
check(!!p1Bh061&&p1Bh061.correct==='1♠'&&
 JSON.stringify(p1Bh061.auction)===JSON.stringify([['','','','1♣'],['?','','','']])&&
 p1Bh061.question.includes('Nord–Sud vulnérables')&&
 p1Bh061.explanation.includes('1♥ chez Est')&&
 p1Bh061.explanation.includes('SUJET')&&
 p1Bh061.distractorNotes['1SA'].includes('selon les accords'),
 'P1 BH061: source 1 club retained, correction 1 heart disclosed, alternative 1NT qualified');
check(JSON.stringify(Object.keys(p1Bh061.distractorNotes||{}).sort())===
 JSON.stringify(p1Bh061.choices.filter(c=>c!==p1Bh061.correct).sort())&&
 JSON.stringify(Object.keys(p1Bh061.pretryHints||{}).sort())===
 JSON.stringify(p1Bh061.choices.filter(c=>c!==p1Bh061.correct).sort()),
 'P1 BH061: explanatory notes and hints correspond to choices');

for(const [qid,expected,sourceAnswer] of [
  ['EN-1sa-011','3♥','3♠'],
  ['EN-BH-115-06','4♠','4♥']
]){
  const q=lot02Bid(qid);
  check(q&&q.correct===expected&&q.choices.includes(sourceAnswer),
    qid+' conserve sa réponse SEF et la variante du fascicule parmi les choix');
  check(q.question?.includes('chassé-croisé')&&q.sourceContext?.includes('chassé-croisé'),
    qid+' annonce le système avant la question, même hors parcours de thème');
  check(q.explanation?.includes('corrigé')&&q.distractorNotes?.[sourceAnswer]?.includes('chassé-croisé'),
    qid+' explique pourquoi le traitement naturel du fascicule reste recevable');
}
check(app.includes("x.sourceContext?")&&app.includes("x.question||'Quelle est votre enchère ?'"),
  'le rendu de la question contient le contexte pré-réponse et un énoncé éditorial');


const p1Bh049=data.bidding.find(x=>x.id==='EN-BH-049-04');
check(p1Bh049&&p1Bh049.correct==='3♦'&&
 JSON.stringify(p1Bh049.hand)===JSON.stringify(['6','8 5','D V 9 8 6 3 2','R 7 5'])&&
 JSON.stringify(p1Bh049.auction)===JSON.stringify([['','','Passe','Passe'],['?','','','']]),
 'P1 BH-049 retains original hand, sequence and answer');
check(p1Bh049.question?.includes('non vulnérable')&&
 p1Bh049.sourceContext?.includes('Non Vul.')&&
 p1Bh049.explanation?.includes('6 H')&&
 p1Bh049.explanation?.includes('Passe reste'),
 'P1 BH-049 explicitly announces vulnerability, points and acceptable alternatives');
const p1Bh049Wrong=p1Bh049.choices.filter(c=>c!==p1Bh049.correct).sort();
check(JSON.stringify(Object.keys(p1Bh049.distractorNotes||{}).sort())===JSON.stringify(p1Bh049Wrong)&&
 JSON.stringify(Object.keys(p1Bh049.pretryHints||{}).sort())===JSON.stringify(p1Bh049Wrong)&&
 p1Bh049.pretryHints['1♦'].includes('6 points H')&&
 !p1Bh049.pretryHints['1♦'].includes('Trois points H'),
 'P1 BH-049 has exactly three applicable notes and correct six-H count');
check(app.includes('x.sourceContext?')&&app.includes("x.question||'Quelle est votre enchère ?'"),
 'P1 BH-049 context and question are rendered before the choice buttons');


const bh086ExpectedAnswers={"EN-BH-086-01":"2SA","EN-BH-086-02":"1♠","EN-BH-086-03":"1♠","EN-BH-086-04":"1♥","EN-BH-086-05":"1♣","EN-BH-086-06":"1♦"};
for(const [qid,answer] of Object.entries(bh086ExpectedAnswers)){
 const q=data.bidding.find(x=>x.id===qid);
 check(!!q && q.correct===answer && q.choices.length===4,
   'BH086 revised metadata retains original answer and four choices: '+qid);
 const wrong=q.choices.filter(choice=>choice!==q.correct).sort();
 check(JSON.stringify(Object.keys(q.distractorNotes||{}).sort())===JSON.stringify(wrong) &&
   wrong.every(choice=>typeof q.distractorNotes[choice]==='string' && q.distractorNotes[choice].length>40),
   'BH086 legacy explanatory notes cover exactly the visible wrong choices: '+qid);
 check(JSON.stringify(Object.keys(q.pretryHints||{}).sort())===JSON.stringify(wrong),
   'BH086 existing pretry hints remain aligned with the choices: '+qid);
}


const remainingLegacyMisalignments=data.bidding.filter(q=>
 Array.isArray(q.choices) && q.distractorNotes &&
 JSON.stringify(Object.keys(q.distractorNotes).sort())!==
 JSON.stringify(q.choices.filter(c=>c!==q.correct).sort())
);
check(remainingLegacyMisalignments.length===0,
 'All legacy bidding distractor notes correspond to the current wrong choices');
const currentPretryMisalignments=data.bidding.filter(q=>
 Array.isArray(q.choices) && q.pretryHints && Object.keys(q.pretryHints).length>0 &&
 JSON.stringify(Object.keys(q.pretryHints).sort())!==
 JSON.stringify(q.choices.filter(c=>c!==q.correct).sort())
);
check(currentPretryMisalignments.length===0,
 'All currently displayed pretry hints correspond to the current wrong choices');


const bh090=data.bidding.find(x=>x.id==='EN-BH-090-03');
check(!!bh090&&bh090.reviewStatus==='transcrit_source'&&bh090.correct==='3♥'&&
 JSON.stringify(bh090.choices)===JSON.stringify(['3♦','3♥','3♠','3♣']),
 'BH090-03: source answer retained, source-guided self-assessment preserved');
check(bh090.question.includes('novembre 2023')&&bh090.sourceContext.includes('AVANT')&&
 bh090.sourceContext.includes('2SA')&&bh090.sourceContext.includes('3♥')&&
 bh090.explanation.includes('2SA')&&bh090.explanation.includes('auto-évaluation'),
 'BH090-03: historic and current conventions distinguished before choices and in correction');
check(app.includes("function sourceExplanation(x){return pedagogicText(x.explanation||'',x)}")&&
 !app.includes("const clean=x.id==='EN-BH-090-03'"),
 'BH090-03: correction no longer hides the convention warning');


const bm003=data.bidding.find(x=>x.id==='EN-1m-003');
check(!!bm003 && bm003.reviewStatus==='transcrit_source'&&bm003.correct==='1SA'&&
 JSON.stringify(bm003.hand)===JSON.stringify(['D 8 3','R 10 5','V 4','R 8 6 3 2'])&&
 JSON.stringify(bm003.choices)===JSON.stringify(['2SA','1♠','Passe','1SA']),
 'BM003: editorial decision retains the correction hand and published answer/options');
check(bm003.sourceContext.includes('31 octobre 2026')&&bm003.sourceContext.includes('♥A85')&&
 bm003.sourceContext.includes('♥R105')&&bm003.question.includes('corrigé')&&
 bm003.explanation.includes('les deux versions'),
 'BM003: source/correction discrepancy is visible pre-choice and explained after response');

console.log('QPJB Training smoke: '+checks+' checks passed.');

'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const parent=read('index.html'),html=read('entrainement/index.html');
const app=read('entrainement/training-app.js');
const worker=read('service-worker.js');
const core=read('entrainement/training-core.css');
const integrated=read('entrainement/training-integrated.css');
const tokens=read('qpjb-design-tokens.css');
let checks=0;
function check(v,label){assert.ok(v,label);checks++}
for(const [name,css] of Object.entries({core,integrated,tokens})){
 let level=0,min=0;
 for(const c of css){if(c==='{')level++;else if(c==='}'){level--;min=Math.min(min,level)}}
 check(level===0&&min===0,name+' CSS blocks are balanced');
}
new Function(app);checks++;
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
check(app.includes('sessionQuizStates')&&app.includes('rememberCurrentQuiz')&&app.includes('restoreQuizDetails'),
 'Previous/next remembers selected answers without restarting a visit');
check(integrated.includes('suit-club')&&integrated.includes('suit-diamond'),'Four bridge suit colors are available');
check(app.includes('FE0E')&&app.includes('FE0F'),
 'Suit normalization handles the iPhone emoji variation selectors');
check(worker.includes("CACHE = 'qpjb-v")&&worker.includes('cache.addAll(PRECACHE)'), 'service worker precaches training before activation');
check(worker.includes('length:23')&&worker.includes("'entrainement/assets/JC-'"),'all 23 external WebP diagrams are part of offline shell');
check(worker.includes("url.pathname === BASE + 'entrainement/'"),'offline training document handles dynamic mode and revision parameters');
check(app.includes('function focusTrainingPage()')&&app.includes('root.focus({preventScroll:true})'),'single-page navigation restores focus for keyboard and VoiceOver');
check(html.includes('<main id="root" tabindex="-1">'),'training main is programmatically focusable');
for(const script of parent.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(script[1].trim()){new Function(script[1]);checks++}
}
check(!html.includes('training-style.css'),'obsolete stylesheet is not loaded');
check(html.indexOf('qpjb-design-tokens.css')<html.indexOf('training-core.css'),'shared tokens load before base');
check(html.indexOf('training-core.css')<html.indexOf('training-integrated.css'),'integrated CSS loads last');
check(html.indexOf('training-data.js')<html.indexOf('training-app.js'),'training data loads before logic');
check(/<script defer src="\.\/training-data\.js/.test(html)&&/<script defer src="\.\/training-app\.js/.test(html),
 'Training scripts download in parallel but execute in source order');
check(parent.includes('qpjbTrainingFadeNavigate')&&parent.includes('fadeSwap(()=>new Promise'),'QPJB owns page fades');
check(app.includes('qpjb-training-nav-request')&&app.includes('qpjb-training-nav-apply'),'iframe uses coordinated transitions');
check(parent.includes('trainingDepth')&&app.includes('qpjb-training-route-restore'),'browser history can restore pages');
check(app.includes('trainingListScroll')&&app.includes('trainingListScope'),'list scroll is retained');
check(integrated.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'QCM answers remain in two columns');
check(integrated.includes('font-size:clamp(18px,5.45vw,21px)'),'single-line hand remains readable');
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
      app.includes('À revoir : premier choix non validé'),
 'Progress statuses distinguish first-choice validity and revision');
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
const quarantined=['JC-BH-014-Q01','JC-BH-028-Q04','JC-BH-036-Q02'].map(id=>data.play.find(x=>x.id===id));
check(quarantined.every(x=>x&&x.reviewStatus==='a_verifier'&&x.quarantineReason),'ambiguous card QCMs are kept in quarantine');
check(quarantined.every(x=>Array.isArray(x.options)&&Number.isInteger(x.answerIndex)&&x.explanation),'quarantined QCMs retain their source answers and explanations');
check(data.play.length===114&&data.play.filter(x=>x.reviewStatus!=='a_verifier').length===111,'114 card exercises preserved and 111 available');
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
 "const requestAnimationFrame=callback=>callback();",
 "let view='topics',cat='',status='all',ptopic='all',sessionIds=[],chosen=null;",
 "let redoAttempt=null,redoAnswered=false,revealed=false,playSeen=false,id='';",
 "const document={querySelector:()=>null};const render=()=>{renders++};const filtered=()=>[{id:'EX1'},{id:'EX2'}];const quitTraining=()=>{};const D={bidding:[{id:'EX1'},{id:'EX2'}],play:[]};",
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
console.log('QPJB Training smoke: '+checks+' checks passed.');

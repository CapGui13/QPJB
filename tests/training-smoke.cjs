'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const parent=read('index.html'),html=read('entrainement/index.html');
const app=read('entrainement/training-app.js');
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
for(const script of parent.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(script[1].trim()){new Function(script[1]);checks++}
}
check(!html.includes('training-style.css'),'obsolete stylesheet is not loaded');
check(html.indexOf('qpjb-design-tokens.css')<html.indexOf('training-core.css'),'shared tokens load before base');
check(html.indexOf('training-core.css')<html.indexOf('training-integrated.css'),'integrated CSS loads last');
check(html.indexOf('training-data.js')<html.indexOf('training-app.js'),'training data loads before logic');
check(parent.includes('qpjbTrainingFadeNavigate')&&parent.includes('fadeSwap(()=>new Promise'),'QPJB owns page fades');
check(app.includes('qpjb-training-nav-request')&&app.includes('qpjb-training-nav-apply'),'iframe uses coordinated transitions');
check(parent.includes('trainingDepth')&&app.includes('qpjb-training-route-restore'),'browser history can restore pages');
check(app.includes('trainingListScroll')&&app.includes('trainingListScope'),'list scroll is retained');
check(integrated.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'QCM answers remain in two columns');
check(integrated.includes('font-size:clamp(18px,5.45vw,21px)'),'single-line hand remains readable');
check(app.includes('function updateBiddingAnswer('),'answer feedback is updated in place');
check(integrated.includes('prefers-reduced-motion'),'reduced motion is supported');
const raw=read('entrainement/training-data.js').trim();
check(raw.startsWith('const D=')&&raw.endsWith(';'),'data is separate from app');
const data=JSON.parse(raw.slice(8,-1));
check(data.bidding.length>=560&&data.play.length>=100,'bridge exercises remain available');
const start=app.indexOf('let trainingNavSeq=0');
const end=app.indexOf('function playTopicId(',start);
const i=app.indexOf('function item('),j=app.indexOf('function current(',i);
check(start>=0&&end>start&&i>=0&&j>i,'navigation handlers are present');
const nav=app.slice(start,end)+'\n'+app.slice(i,j);
const harness=[
 "const sent=[],scrolls=[];let renders=0;",
 "const window={scrollY:0,scrollTo:(x,y)=>scrolls.push(y),parent:{postMessage:msg=>sent.push(msg)}};",
 "const location={origin:'https://test.invalid'},embeddedMode=true,integratedMode=true;",
 "const requestAnimationFrame=callback=>callback();",
 "let view='topics',cat='',status='all',ptopic='all',sessionIds=[],chosen=null;",
 "let redoAttempt=null,redoAnswered=false,revealed=false,playSeen=false,id='';",
 "const render=()=>{renders++};const filtered=()=>[{id:'EX1'},{id:'EX2'}];const quitTraining=()=>{};",
 nav,
 "function complete(){const p=trainingPendingNav;if(!p)throw Error('missing transition');trainingPendingNav=null;p.action()}",
 "topic('2sa');const queued=view==='topics'&&sent.at(-1).type==='qpjb-training-nav-request';complete();",
 "const list=view==='list'&&cat==='2sa';window.scrollY=418;item('EX2');complete();",
 "const quiz=view==='quiz'&&id==='EX2'&&sessionIds.length===2;go('list');complete();",
 "return queued&&list&&quiz&&view==='list'&&scrolls.at(-1)===418&&sent.filter(x=>x.type==='qpjb-training-route').length===3;"
].join('\n');
check(new Function(harness)(),'navigation and scroll preservation scenario');
console.log('QPJB Training smoke: '+checks+' checks passed.');

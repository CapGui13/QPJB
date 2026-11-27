'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const engine=process.env.PW_BROWSER||'chromium';assert(['chromium','webkit'].includes(engine));
const C=require('../quizz-coherence-reprise6-b-context.js'),S=require('../quizz-coherence-reprise6-b-source-teaching.js');
const BASE='c0401726b6083f29039b2857e8b21cdd708531b2';
const html=cp.execFileSync('git',['show',BASE+':quizz.html'],{encoding:'utf8',maxBuffer:32*1024*1024});
const actual=fs.readFileSync('quizz.html','utf8');
const A=require('../quizz-coherence-coordinator-a-contrast.js');
assert.equal(cp.execFileSync('git',['show','d402bb887877d1cdd3267e743b954f31501f1a84:quizz.html'],{encoding:'utf8',maxBuffer:32*1024*1024}),A.instrumentHTML(C.instrumentHTML(S.instrumentHTML(html))),'original A+B identity');
assert.equal(actual,cp.execFileSync('git',['show','0ac1007b1b231af513f42b9175ed4c0ade63e213:quizz.html'],{encoding:'utf8',maxBuffer:32*1024*1024}),'reviewed C4 HTML identity');
const embedded=h=>h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(embedded(actual),embedded(html));assert.equal(JSON.parse(embedded(actual)).exercises.length,1915);
function harness(s){
 const marker="makeOptions();$('progress-reset')";
 assert.equal(s.split(marker).length,2);
 return s.replace(marker,`window.__reprise6BRender=(id,result=null,type='parcours')=>{
 const q=DATA.exercises.find(q=>q.id===id);if(!q)throw Error(id);
 sessionType=type==='consolidation'?'parcours':type;parcoursState.active=type==='consolidation'?{mode:'consolidation'}:null;deck=[q];position=0;sessionResults={};sessionChoices={};sessionStages={};
 answered=!!result;selection=result?q.answer:null;if(result)sessionResults[0]={result,choice:q.answer,assisted:false};
 enterSession();render();
 };\n`+marker);
}
(async()=>{
 const names=['quizz-reprise6-b-before.html','quizz-reprise6-b-after.html'];
 fs.writeFileSync(names[0],harness(html));fs.writeFileSync(names[1],harness(actual));
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{
  const pages=await Promise.all(names.map(async n=>{const p=await browser.newPage();await p.goto('http://127.0.0.1:8765/'+n);await p.waitForFunction(()=>typeof window.__reprise6BRender==='function');return p}));
  for(const id of C.IDS){
   for(const p of pages)await p.evaluate(id=>window.__reprise6BRender(id),id);
   assert.equal(await pages[0].locator('.context-note').count(),0);
   assert(await pages[1].locator('.context-note').isVisible());
   assert.match(await pages[1].locator('.context-note').innerText(),/deux majeures quatrièmes/);
   assert.match(await pages[1].locator('.context-note').innerText(),/laissant l’ouvreur déclarant/);
   assert.equal(await pages[1].locator('#answer-feedback').count(),0);
  }
  for(const id of ['SEF-039-1','SEF-038-1','SEF-037-1']){
   for(const p of pages)await p.evaluate(id=>window.__reprise6BRender(id),id);
   assert.equal(await pages[1].locator('#answer-feedback').count(),0);
   for(const p of pages)await p.evaluate(id=>window.__reprise6BRender(id,'correct'),id);
   const a=await pages[0].locator('#feedback-explanation-heading + p').innerText(),b=await pages[1].locator('#feedback-explanation-heading + p').innerText();
   if(id==='SEF-037-1')assert.equal(a,b);else {assert.notEqual(a,b);assert(b.includes(S.CONTRAST));}
   for(const p of pages)await p.evaluate(id=>window.__reprise6BRender(id,'wrong','libre'),id);
   assert.equal(await pages[0].locator('#feedback-explanation-heading + p').innerText(),await pages[1].locator('#feedback-explanation-heading + p').innerText());
   for(const p of pages)await p.evaluate(id=>window.__reprise6BRender(id,'correct','consolidation'),id);
   assert.equal(await pages[0].locator('#feedback-explanation-heading + p').innerText(),await pages[1].locator('#feedback-explanation-heading + p').innerText());
  }
  console.log('B_BROWSER_PASS — actual frozen quiz renderer, injected deck only; 2 contexts, 3 source examples, no pre-answer leak or free-mode change');
 }finally{await browser.close();for(const n of names)fs.rmSync(n,{force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

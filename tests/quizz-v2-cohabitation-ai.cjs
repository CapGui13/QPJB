'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const P=require('../quizz-parcours.js');
const AI=require('../scripts/parcours-v2-build-cohabitation-ai.cjs');
const ROOT=path.resolve(__dirname,'..');
const original=fs.readFileSync(path.join(ROOT,'preview/parcours-v2-autonome.html'),'utf8');
const candidate=AI.build(original);
const sourceScripts=[...original.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const htmlScripts=[...candidate.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
assert.equal(sourceScripts.length,7);
assert.equal(htmlScripts.length,7);
for(let i=0;i<6;i++)assert.equal(htmlScripts[i][2],sourceScripts[i][2],
  'All catalog data, audited engine and metadata remain byte-for-byte intact');
const sourced=(id,content)=>[...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .find(x=>x[1].includes('id="'+id+'"'))?.[2];
for(const id of ['catalog-data','sa-data','stayman-data','review-flags'])
 assert.equal(sourced(id,candidate),sourced(id,original));
assert.equal(JSON.parse(sourced('catalog-data',candidate)).length,1523);
assert.equal(JSON.parse(sourced('review-flags',candidate)).length,19);
assert.equal(JSON.parse(sourced('sa-data',candidate)).assignments.length,14);
assert.equal(JSON.parse(sourced('stayman-data',candidate)).assignments.length,65);
assert.ok(candidate.includes('Retour au parcours classique'));
assert.ok(candidate.includes('href="../../quizz.html"'));
assert.ok(candidate.includes('id="ai-legacy-status"'));
assert.ok(candidate.includes('const aiLegacyKey='+"'"+AI.V1_KEY+"'"));
assert.ok(candidate.includes("'"+AI.V2_KEY+"'"));
assert.ok(!candidate.includes("'"+AI.AG_KEY+"'"));
assert.ok(!candidate.includes('teacherConfirmedBeforeSession'));
assert.ok(!candidate.includes('data-action="review-open">Revoir les cas sensibles'));
assert.ok(!candidate.includes('data-action="review-open">Examiner les cas SEF sensibles'));
assert.ok(!candidate.includes('leçon suivie')&&!candidate.includes('leçon obligatoire'));
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(candidate.slice(candidate.indexOf('<script>(function previewApp(){'))));
assert.equal(typeof AI.create,'function');

const legacy=P.empty();legacy.completed=7;
const legacyValue=JSON.stringify(legacy);
const freeValue=JSON.stringify({'SEF-001-1':{seen:true,ok:true,lastResult:'correct'}});
const storage=new Map([[AI.V1_KEY,legacyValue],[AI.V1_TRAINING_KEY,freeValue]]);
const writes=[];
function browser(){
 const nodes=Object.fromEntries(htmlScripts.filter(s=>s[1].includes('application/json'))
   .map(s=>[s[1].match(/\bid="([^"]+)"/)[1],{textContent:s[2]}]));
 const app={innerHTML:''},legacyNode={textContent:''};
 const nav=()=>({textContent:'',setAttribute(){}});
 let listener=null;
 const document={
   getElementById(id){return id==='app'?app:id==='ai-legacy-status'?legacyNode:nodes[id]||nav()},
   addEventListener(type,callback){if(type==='click')listener=callback}
 };
 const localStorage={
   setItem(k,v){writes.push({operation:'set',key:k});storage.set(k,String(v));},
   getItem:k=>storage.get(k)??null,
   removeItem(k){writes.push({operation:'remove',key:k});storage.delete(k);}
 };
 const window={localStorage};
 const box=vm.createContext({window,document,console});
 for(const [,attrs,body] of htmlScripts.filter(s=>!s[1].includes('application/json')))
   vm.runInContext(body,box,{timeout:60000});
 assert.equal(typeof listener,'function');
 return {app,legacyNode,click(action,choice,index){
   listener({target:{closest:()=>({dataset:{action,choice,index},disabled:false})}});
 }};
}
let page=browser();
assert.ok(page.legacyNode.textContent.includes('7 séance(s) terminée(s)'));
assert.ok(page.app.innerHTML.includes('Sauvegarde locale active'));
assert.ok(page.app.innerHTML.includes('1 523 QCM du catalogue'));
page.click('start');
assert.ok(page.app.innerHTML.includes('Question 1 sur 10'));
page.click('answer','0');
assert.ok(page.app.innerHTML.includes('Réponse du catalogue :'));
assert.ok(storage.has(AI.V2_KEY));
page=browser();
assert.ok(page.app.innerHTML.includes('Question 1 sur 10'));
assert.ok(page.app.innerHTML.includes('Réponse du catalogue :'));
page.click('next');
assert.ok(page.app.innerHTML.includes('Question 2 sur 10'));
page=browser();
assert.ok(page.app.innerHTML.includes('Question 2 sur 10'));
for(let i=1;i<10;i++){page.click('answer','0');page.click('next');}
assert.ok(page.app.innerHTML.includes('Bilan de la séance 1'));
page=browser();
assert.ok(page.app.innerHTML.includes('Bilan de la séance 1'));
page.click('start');
assert.ok(page.app.innerHTML.includes('Séance fictive 2'));
assert.equal(storage.get(AI.V1_KEY),legacyValue);
assert.equal(storage.get(AI.V1_TRAINING_KEY),freeValue);
page.click('reset');
assert.ok(!storage.has(AI.V2_KEY));
assert.equal(storage.get(AI.V1_KEY),legacyValue);
assert.equal(storage.get(AI.V1_TRAINING_KEY),freeValue);
assert.ok(writes.every(w=>w.key===AI.V2_KEY||w.key===AI.V2_KEY+'-probe'),
 'V1 or quiz progression must never be written or deleted: '+JSON.stringify(writes));
assert.equal(P.load(storage.get(AI.V1_KEY)).completed,7);
assert.equal(JSON.parse(storage.get(AI.V1_TRAINING_KEY))['SEF-001-1'].seen,true);
console.log('QPJB AI PASS : 1,523 original QCM intact, V1/free progress never modified, V2 cohabitation and resume/reset isolated');

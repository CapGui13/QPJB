'use strict';
// AJ: opt-in navigation to a TRACKED V2 candidate; no change to default V1 UI.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const AI=require('../scripts/parcours-v2-build-cohabitation-ai.cjs');
const root=path.resolve(__dirname,'..');
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const quizz=read('quizz.html'),index=read('index.html');
const original=read('preview/parcours-v2-autonome.html');
const committed=read('preview/v2-ai/parcours-v2-cohabitation.html');
const rebuilt=AI.build(original);
assert.equal(committed,rebuilt,'V2 branch HTML must match audited generator exactly');
assert.ok(committed.length>1000000);
assert.equal((committed.match(/<script\b/g)||[]).length,7);
const tag=id=>{const token='<script type="application/json" id="'+id+'">';const i=committed.indexOf(token);
 assert.ok(i>=0,'missing '+id);return JSON.parse(committed.slice(i+token.length,committed.indexOf('</script>',i+token.length)))};
assert.equal(tag('catalog-data').length,1523);
assert.equal(tag('sa-data').assignments.length,14);
assert.equal(tag('stayman-data').assignments.length,65);
assert.equal(tag('review-flags').length,19);
assert.ok(committed.includes('href="../../quizz.html"'),'Back link resolves from preview/v2-ai/');
assert.ok(committed.includes("'"+AI.V2_KEY+"'"));
assert.ok(committed.includes("aiReadLegacy()"));
assert.ok(!committed.includes('teacherConfirmedBeforeSession'));
assert.ok(!committed.includes('<a href="http'));
assert.ok(!committed.includes('découverte guidée'));

const mainTag='<script id="training-data" type="application/json">';
const at=quizz.indexOf(mainTag);assert.ok(at>0);
const mainCatalog=JSON.parse(quizz.slice(at+mainTag.length,
  quizz.indexOf('</script>',at+mainTag.length))).exercises;
assert.equal(mainCatalog.length,1523);
const data=tag('catalog-data');
const byId=new Map(mainCatalog.map(x=>[x.id,x]));
assert.equal(byId.size,1523);
for(const x of data){
 const original=byId.get(x.id);assert.ok(original,'Unknown original QCM '+x.id);
 for(const name of ['theme','answer','choices','context','auction','hand','h','difficulty','explain'])
   assert.deepEqual(x[name],original[name],x.id+' altered '+name);
 assert.equal(x.caseFamily,original.caseFamily||original.id);
}

const wrap='<div id="parcours-v2-preview-wrap" hidden style="display:none;';
assert.ok(quizz.includes(wrap),'Opt-in candidate link must be hidden at markup');
assert.equal(quizz.split('id="parcours-v2-preview-link"').length,2);
assert.ok(quizz.includes('href="./preview/v2-ai/parcours-v2-cohabitation.html"'));
assert.ok(quizz.includes('target="_blank" rel="noopener noreferrer"'));
assert.ok(quizz.includes("new URLSearchParams(location.search).get('v2preview')==='1'"));
assert.ok(quizz.includes('ajV2PreviewWrap.hidden=false'));
assert.ok(!quizz.includes("ajV2PreviewWrap.hidden=false;\nmakeOptions"));
assert.ok(index.includes("new URLSearchParams(location.search).get('v2preview')==='1'?'&v2preview=1':''"));
assert.ok(index.includes("frame.src='./quizz.html?embedded=1&rev=20261101-ux-clavier'"));
assert.ok(quizz.includes("const parcoursKey='qpjb-sef-parcours-01'"));
assert.ok(quizz.includes("const saveKey='qpjb-sef-entrainement-01'"));
const htmlScript=quizz.slice(quizz.lastIndexOf('<script>')+8,quizz.lastIndexOf('</script>'));
assert.doesNotThrow(()=>new Function(htmlScript));
const homepageScripts=[...index.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .filter(x=>!x[1].includes('src=')&&!x[1].includes('application/json'));
for(const s of homepageScripts)if(s[2].trim())assert.doesNotThrow(()=>new Function(s[2]));
console.log('QPJB AJ PASS : opt-in branch-only switch hidden by default, 1,523 QCM preserved, V1 keys untouched, tracked V2 candidate matches generator');

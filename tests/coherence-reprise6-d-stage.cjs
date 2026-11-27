'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const patch=require('../quizz-coherence-reprise6-d-patch.js');
const root=path.resolve(__dirname,'..'),source=path.resolve(process.argv[2]||'_public_site'),target=path.resolve(process.argv[3]||'_reprise6_d_private');
assert(source!==target&&!target.startsWith(source+path.sep)&&!source.startsWith(target+path.sep),'separate temporary site');
assert(!fs.existsSync(target),'never overwrite a built site');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const embedded=html=>html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
fs.cpSync(source,target,{recursive:true,errorOnExist:true});
const enginePath=path.join(target,'quizz-parcours.js'),htmlPath=path.join(target,'quizz.html');
const original=fs.readFileSync(enginePath,'utf8'),html=fs.readFileSync(htmlPath,'utf8');
const patched=patch.patchHtml(html);
assert.equal(embedded(html),embedded(patched));assert.equal(JSON.parse(embedded(html)).exercises.length,1915);
const bundle=patch.browserBundle({features:read('quizz-coherence-m4-diversite.js'),rank:read('quizz-coherence-m4p-a-rank.js'),t:read('quizz-coherence-reprise6-d-t.js')});
new Function(bundle+patch.patchEngine(original)); // parse only
fs.writeFileSync(enginePath,bundle+patch.patchEngine(original));fs.writeFileSync(htmlPath,patched);
console.log('PRIVATE STAGE: only engine and HTML differ; no production modification/publication');

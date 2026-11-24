'use strict';
// Immutable exact reference of #293. Snapshots are Git blob copies, not edited code.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'audits/progression-guidee/M3/reference');
const base='96c0f7962c14e74429fa12871d687efa0e8a94bd',engineBlob='2b6775a9eb6167f9356534f42c9dbba6a10446f3',quizBlob='2b89070d82ae45fc7aa9fe921ed43984e05eded0';
function blob(bytes){return crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')}
function exact(file,sha){const bytes=fs.readFileSync(path.join(dir,file));assert.equal(blob(bytes),sha,'Historical blob '+file);return bytes.toString('utf8')}
function source(){return exact('quizz-parcours.js',engineBlob)}
function html(){return exact('quizz.html',quizBlob)}
function payload(text){const m=[...text.matchAll(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/g)];assert.equal(m.length,1,'Exact single catalogue');return m[0][1]}
function catalogue(){const raw=payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));assert.equal(raw,payload(html()),'Embedded catalogue byte-for-byte unchanged');const data=JSON.parse(raw);assert.equal(data.exercises.length,1523);assert.equal(new Set(data.exercises.map(q=>q.id)).size,1523);assert.equal(data.themes.length,22);return data}
function engine(){source();return require(path.join(dir,'quizz-parcours.js'))}
module.exports={base,engineBlob,quizBlob,blob,source,html,payload,catalogue,engine,dir};

'use strict';
const assert=require('node:assert/strict');
const {EventEmitter}=require('node:events');
const {watchLocalAssets}=require('./wave2-ux-asset-watch.cjs');
function request(url,type='script',reason=null){
 return {url:()=>url,resourceType:()=>type,failure:()=>reason?{errorText:reason}:null};
}
function response(req,status){return {request:()=>req,status:()=>status,url:()=>req.url()}}
const page=new EventEmitter();
const watcher=watchLocalAssets(page,'http://127.0.0.1:9023/QPJB/');
const send=(url,type,status)=>page.emit('response',response(request(url,type),status));
send('http://127.0.0.1:9023/QPJB/quizz-parcours.js','script',200);
send('http://127.0.0.1:9023/QPJB/quizz.css','stylesheet',304);
send('http://127.0.0.1:9023/QPJB/photo.png','image',404);
send('https://fonts.googleapis.com/css?family=x','stylesheet',500);
send('http://other-host.invalid/QPJB/a.js','script',404);
watcher.assertClean('requêtes saines et hors périmètre');
send('http://127.0.0.1:9023/QPJB/missing.js','script',404);
assert.throws(()=>watcher.assertClean('script absent'),/script HTTP 404/);
send('http://127.0.0.1:9023/QPJB/missing.css','stylesheet',500);
assert.equal(watcher.failures.length,2);
page.emit('requestfailed',request('http://127.0.0.1:9023/QPJB/blocked.js','script','net::ERR_CONNECTION_RESET'));
assert.equal(watcher.failures.length,3);
assert.match(watcher.failures[2],/ERR_CONNECTION_RESET/);
assert.doesNotThrow(()=>watchLocalAssets(new EventEmitter(),'http://127.0.0.1:9023/').assertClean());
console.log('PASS M3 asset-watch: scripts/styles 200 et 304 admis, 404/500 et réseau rejetés, ressources externes ignorées');

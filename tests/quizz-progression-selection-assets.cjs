'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('quizz.html');
const prereq='<script src="./quizz-prerequis.js?v=2"></script>';
const plan='<script src="./quizz-session-plan.js?v=2"></script>';
const engine='<script src="./quizz-parcours.js?v=17"></script>';
const pedagogy=["<script src=\"./quizz-pedagogie-initiation.js?v=1\"></script>","<script src=\"./quizz-pedagogie-intermediaire.js?v=1\"></script>","<script src=\"./quizz-pedagogie-avancee.js?v=1\"></script>"].join('');
assert.ok(html.includes(prereq+pedagogy+plan+engine),'Prerequisites and pedagogical policies loaded before the engine');
for(const module of ["quizz-pedagogie-initiation.js","quizz-pedagogie-intermediaire.js","quizz-pedagogie-avancee.js"])assert.ok(read('scripts/build_public_site.py').includes('"'+module+'"'));
const data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.exercises.length,1879);
assert.equal(data.themes.length,22);
assert.ok(read('scripts/build_public_site.py').includes('"quizz-parcours.js","quizz-prerequis.js"'));
const cached=new Set(),listeners={},requests=[];
let fail=true;
const self={addEventListener:(name,fn)=>listeners[name]=fn};
const caches={open:async()=>({
 match:async key=>cached.has(key)?{ok:true}:undefined,
 put:async key=>cached.add(key)
})};
const fetch=async url=>{
 requests.push(url);
 return {ok:!(fail&&url.includes('quizz-prerequis.js'))};
};
vm.runInNewContext(read('service-worker.js'),{self,caches,fetch});
async function warm(){
 const tasks=[],messages=[];
 listeners.message({data:{type:'QPJB_PREFETCH_OFFLINE'},ports:[{postMessage:m=>messages.push(m)}],waitUntil:p=>tasks.push(p)});
 await Promise.all(tasks);
 assert.equal(messages.length,1);
 return messages[0].ok;
}
(async()=>{
 assert.equal(await warm(),false,'Missing prerequisites must not report offline ready');
 fail=false;
 assert.equal(await warm(),true);
 for(const url of ['/QPJB/quizz.html','/QPJB/qpjb-bridge-ui.css?v=20261113e','/QPJB/quizz-prerequis.js?v=2','/QPJB/quizz-pedagogie-initiation.js?v=1','/QPJB/quizz-pedagogie-intermediaire.js?v=1','/QPJB/quizz-pedagogie-avancee.js?v=1','/QPJB/quizz-session-plan.js?v=2','/QPJB/quizz-parcours.js?v=17','/QPJB/parcours-recommandations.js?v=1'])
  assert.ok(cached.has(url),'Offline resource '+url);
 const before=requests.length;
 assert.equal(await warm(),true);
 assert.equal(requests.length,before,'Already warmed: no redundant fetch');
 console.log('M2: HTML, public builder, offline warm success/failure/retry : OK');
})().catch(e=>{console.error(e);process.exitCode=1});

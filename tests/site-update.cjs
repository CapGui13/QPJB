'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const code = fs.readFileSync(path.join(__dirname,'..','site-update.js'),'utf8');

const storage=new Map(),events={};
let clock=100000,sha='a'.repeat(40),reloads=0,swUpdates=0;
let checks=0,online=true,hidden=false,inQuiz=false,interval=null,apiUnavailable=false;
const tick=()=>new Promise(resolve=>setImmediate(()=>setImmediate(resolve)));
const context={
  location:{protocol:'https:',reload(){reloads++}},
  window:{addEventListener(name,fn){events[name]=fn}},
  document:{
    get hidden(){return hidden},
    get body(){return {classList:{contains(name){
      assert.equal(name,'qpjb-training-in-quiz');return inQuiz;
    }}}},
    addEventListener(name,fn){events[name]=fn}
  },
  navigator:{
    get onLine(){return online},
    serviceWorker:{async getRegistration(scope){
      assert.equal(scope,'/QPJB/');return {async update(){swUpdates++}};
    }}
  },
  sessionStorage:{
    getItem(k){return storage.get(k)||null},
    setItem(k,v){storage.set(k,v)}
  },
  Date:{now(){return clock}},
  AbortController,setTimeout,clearTimeout,
  setInterval(fn,ms){assert.equal(ms,180000);interval=fn;return 1},
  async fetch(url,opts){
    assert.equal(url,'https://api.github.com/repos/CapGui13/QPJB/actions/runs?per_page=8');
    assert.equal(opts.cache,'no-store');
    assert.equal(opts.headers.Accept,'application/vnd.github+json');
    checks++;
    return {ok:!apiUnavailable,async json(){return {workflow_runs:[
      {name:'QPJB Training smoke',conclusion:'failure',head_sha:'f'.repeat(40)},
      {name:'pages build and deployment',conclusion:'success',head_sha:sha}
    ]}}};
  }
};
(async()=>{
  vm.runInNewContext(code,context,{filename:'site-update.js'});
  await tick();
  assert.equal(reloads,0,'Initial page records a baseline');
  assert.equal(checks,1,'Only one request per check');
  sha='b'.repeat(40); clock+=180000;interval();await tick();
  assert.equal(reloads,1,'A successful Pages deployment triggers a reload');
  assert.equal(swUpdates,1,'The service worker is updated before reload');
  assert.equal(storage.get('qpjb-auto-refresh'),'1','Reload restores the current route');
  clock+=180000;interval();await tick();
  assert.equal(reloads,1,'The same deployment cannot cause a reload loop');
  inQuiz=true;sha='c'.repeat(40);clock+=180000;interval();await tick();
  assert.equal(reloads,1,'A newly published version does not interrupt a quiz');
  inQuiz=false;events['qpjb-training-safe-update']();await tick();
  assert.equal(reloads,2,'Leaving the exercise applies the pending update');
  online=false;sha='d'.repeat(40);clock+=180000;interval();await tick();
  assert.equal(reloads,2,'Offline mode does not reload');
  online=true;hidden=true;events.visibilitychange();await tick();
  assert.equal(reloads,2,'Hidden tabs do not reload');
  hidden=false;events.visibilitychange();await tick();
  assert.equal(reloads,3,'Returning to the tab detects a new deployment');
  apiUnavailable=true;sha='e'.repeat(40);clock+=180000;interval();await tick();
  assert.equal(reloads,3,'Unavailable API does not interrupt the session');
  console.log(JSON.stringify({result:'PASS',checks,reloads,swUpdates}));
})().catch(err=>{console.error(err);process.exitCode=1});

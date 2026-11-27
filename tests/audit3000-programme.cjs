'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const base='ccd8f20811b9531bbfccb8352ec60953dd7d07cb',dir='audits/audit3000-20261127/';
const read=p=>fs.readFileSync(p,'utf8'), old=p=>cp.execFileSync('git',['show',base+':'+p],{maxBuffer:20*1024*1024}).toString();
const parseMeta=s=>JSON.parse(s.slice(s.indexOf('return {')+7,s.lastIndexOf('};});')+1));
const pm=JSON.parse(read(dir+'INTEGRATION-PREREQUIS.json')).byId,bm=parseMeta(old('quizz-prerequis.js')),am=parseMeta(read('quizz-prerequis.js'));
for(const id of Object.keys(bm.byId)){if(pm[id])assert.deepEqual(pm[id].before,bm.byId[id]);assert.deepEqual(am.byId[id],pm[id]?.after||bm.byId[id]);}
assert.equal(Object.keys(am.byId).length,3000);
const engine=read('quizz-parcours.js'),prior=old('quizz-parcours.js'),p=/const PROGRAMME65\s*=\s*.*?;\s*(?=function select)/s;
// Original pedagogical integration still has exactly the old engine outside
// PROGRAMME65. User subsequently authorized the explicitly reviewed guided
// history migration; pin its exact Git blob instead of disabling the guard.
const pedagogical=cp.execFileSync('git',['show','9b33b9a7d822fa3163df051471909115824d2a04:quizz-parcours.js'],{maxBuffer:20*1024*1024}).toString();
assert.equal(pedagogical.replace(p,''),prior.replace(p,''),'Original audit must not change engine logic');
const authorizedEngine=cp.execFileSync('git',['cat-file','blob','e30cc1c48e1fa77b695c9b7694dc96fecfe89e07'],{maxBuffer:20*1024*1024}).toString();
assert.equal(engine.replace(p,''),authorizedEngine.replace(p,''),'Only explicitly reviewed technical revision permitted');
const plan=JSON.parse(read('audits/programme-65-20261127/programme-normalise.json'));
const embedded=JSON.parse(engine.match(/const PROGRAMME65\s*=\s*(.*?);\s*(?=function select)/s)[1]);
assert.deepEqual(embedded,plan.sessions.map(r=>({o:r.objective,g:r.groups.map(g=>[g.role,g.ids,g.phase||'']),r:r.reference})));
assert.equal(plan.sessions.length,65);
const ids=new Set(Object.keys(am.byId));
for(const s of plan.sessions)for(const g of s.groups){assert.equal(new Set(g.ids).size,g.ids.length);assert(g.ids.every(id=>ids.has(id)));}
console.log('AUDIT3000 metadata and program: PASS');

const html=read('quizz.html'),worker=read('service-worker.js');
assert(html.includes('<meta name="qpjb-catalogue-revision" content="audit3000-guided-v1">'));
assert(html.includes("window.QPJBParcours?.audit3000Revision!=='audit3000-guided-v1'"));
assert(html.indexOf("window.QPJBParcours?.audit3000Revision!=='audit3000-guided-v1'")<html.indexOf("QPJBParcours.load(localStorage.getItem(parcoursKey))"));
assert(html.includes('./quizz-prerequis.js?v=5')&&worker.includes("BASE + 'quizz-prerequis.js?v=5'"));
assert(html.includes('./quizz-parcours.js?v=26')&&worker.includes("BASE + 'quizz-parcours.js?v=26'"));
assert(worker.includes("const CACHE = 'qpjb-v113';"));
console.log('AUDIT3000 compatible page/cache/engine references: PASS');

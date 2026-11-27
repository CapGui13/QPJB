'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const base='ccd8f20811b9531bbfccb8352ec60953dd7d07cb',dir='audits/audit3000-20261127/';
const read=p=>fs.readFileSync(p,'utf8'), old=p=>cp.execFileSync('git',['show',base+':'+p],{maxBuffer:20*1024*1024}).toString();
const parseMeta=s=>JSON.parse(s.slice(s.indexOf('return {')+7,s.lastIndexOf('};});')+1));
const pm=JSON.parse(read(dir+'INTEGRATION-PREREQUIS.json')).byId,bm=parseMeta(old('quizz-prerequis.js')),am=parseMeta(read('quizz-prerequis.js'));
for(const id of Object.keys(bm.byId)){if(pm[id])assert.deepEqual(pm[id].before,bm.byId[id]);assert.deepEqual(am.byId[id],pm[id]?.after||bm.byId[id]);}
assert.equal(Object.keys(am.byId).length,3000);
const engine=read('quizz-parcours.js'),prior=old('quizz-parcours.js'),p=/const PROGRAMME65\s*=\s*.*?;\s*(?=function select)/s;
assert.equal(engine.replace(p,''),prior.replace(p,''));
const plan=JSON.parse(read('audits/programme-65-20261127/programme-normalise.json'));
const embedded=JSON.parse(engine.match(/const PROGRAMME65\s*=\s*(.*?);\s*(?=function select)/s)[1]);
assert.deepEqual(embedded,plan.sessions.map(r=>({o:r.objective,g:r.groups.map(g=>[g.role,g.ids,g.phase||'']),r:r.reference})));
assert.equal(plan.sessions.length,65);
const ids=new Set(Object.keys(am.byId));
for(const s of plan.sessions)for(const g of s.groups){assert.equal(new Set(g.ids).size,g.ids.length);assert(g.ids.every(id=>ids.has(id)));}
console.log('AUDIT3000 metadata and program: PASS');

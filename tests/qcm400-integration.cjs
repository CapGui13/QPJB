'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const base='842865df722180492dc26c53a1a44d8666322a82',git=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:24*1024*1024}),read=p=>fs.readFileSync(p,'utf8');
const data=s=>JSON.parse(s.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta=s=>JSON.parse(s.slice(s.indexOf('return {')+7,s.lastIndexOf('};});')+1)).byId;
const old=data(git('quizz.html')),next=data(read('quizz.html')),a=meta(git('quizz-prerequis.js')),b=meta(read('quizz-prerequis.js'));
assert.equal(old.length,1915);assert.equal(next.length,2315);assert.deepEqual(next.slice(0,1915),old);assert.equal(Object.keys(b).length,2315);
for(const [id,m] of Object.entries(a))assert.deepEqual(b[id],m,id);
const strip=s=>s.replace(/  const PROGRAMME65=[\s\S]*?;\n  function select/,'  const PROGRAMME65=[];\n  function select');
assert.equal(strip(read('quizz-parcours.js')),strip(git('quizz-parcours.js')),'Engine logic must be unchanged');
const plan=JSON.parse(read('audits/programme-65-20261127/programme-normalise.json')),ids=new Set(plan.sessions.flatMap(r=>r.groups.flatMap(g=>g.ids)));
const embedded=JSON.parse(read('quizz-parcours.js').match(/  const PROGRAMME65=([\s\S]*?);\n  function select/)[1]);
assert.deepEqual(embedded,plan.sessions.map(r=>({o:r.objective,g:r.groups.map(g=>[g.role,g.ids,g.phase||'']),r:r.reference})));
assert.equal(new Set(next.map(q=>q.id)).size,2315);
for(const q of next.slice(1915)){assert(ids.has(q.id),q.id);assert(b[q.id],q.id);assert.equal(q.hand.flat().length,13);assert.deepEqual(q.shape,q.hand.map(s=>s.length));assert.equal(q.h,q.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0));assert.equal(new Set(q.choices).size,4);assert(q.choices.includes(q.answer));}
console.log('QCM400_INTEGRITY_PASS 2315 QCM, 400 assigned, historical records and engine logic unchanged');

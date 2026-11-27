'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const base='08fd5679d9f6b526dbcb5e5edc1cec8da201c0ad',git=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:24*1024*1024}),read=p=>fs.readFileSync(p,'utf8');
const data=s=>JSON.parse(s.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta=s=>JSON.parse(s.slice(s.indexOf('return {')+7,s.lastIndexOf('};});')+1)).byId;
const old=data(git('quizz.html')),next=data(read('quizz.html')),a=meta(git('quizz-prerequis.js')),b=meta(read('quizz-prerequis.js'));
assert.equal(old.length,2315);assert.equal(next.length,3000);assert.deepEqual(next.slice(0,2315),old);assert.equal(Object.keys(b).length,3000);
for(const [id,m] of Object.entries(a))assert.deepEqual(b[id],m,id);
const strip=s=>s.replace(/  const PROGRAMME65=[\s\S]*?;\n  function select/,'  const PROGRAMME65=[];\n  function select');
assert.equal(strip(read('quizz-parcours.js')),strip(git('quizz-parcours.js')),'Engine logic must be unchanged');
const plan=JSON.parse(read('audits/programme-65-20261127/programme-normalise.json')),ids=new Set(plan.sessions.flatMap(r=>r.groups.flatMap(g=>g.ids)));
const embedded=JSON.parse(read('quizz-parcours.js').match(/  const PROGRAMME65=([\s\S]*?);\n  function select/)[1]);
assert.deepEqual(embedded,plan.sessions.map(r=>({o:r.objective,g:r.groups.map(g=>[g.role,g.ids,g.phase||'']),r:r.reference})));
assert.equal(new Set(next.map(q=>q.id)).size,3000);
for(const q of next.slice(2315)){assert(ids.has(q.id),q.id);assert(b[q.id],q.id);assert.equal(q.hand.flat().length,13);assert.deepEqual(q.shape,q.hand.map(s=>s.length));assert.equal(q.h,q.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0));assert.equal(new Set(q.choices).size,4);assert(q.choices.includes(q.answer));}
const integration=JSON.parse(read('audits/qcm685-20261127/INTEGRATION.json'));
assert.equal(integration.assignments.length,891);
for(const row of integration.assignments){const g=plan.sessions[row.session-1].groups.find(g=>g.decision===row.decision&&g.role===row.role&&(g.phase||null)===(row.phase||null));assert(g&&g.ids.includes(row.id),row.id);assert(b[row.id].minSession<row.session,row.id+' early');assert.deepEqual(b[row.id],a[row.analogue],row.id+' metadata');}
for(const lot of ['A','B','C','D']){
 const root='audits/qcm685-20261127/'+lot+'/';const source=JSON.parse(read(root+'exercises.json'));const list=Array.isArray(source)?source:source.exercises;assert.equal(list.length,lot==='D'?175:170);for(const q of list)assert.deepEqual(next.find(x=>x.id===q.id),q);
}
console.log('QCM685_INTEGRITY_PASS 3000 QCM, 685 assigned, historical records and engine logic unchanged');

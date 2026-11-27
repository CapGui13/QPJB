'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),root=path.join(__dirname,'..'),dir=path.join(root,'audits/coherence-concrete-20261126/m4/');const {compile,compare}=require('../quizz-coherence-m4p-c-fondamentaux.js');
function test(exercises,old,groups,byId){
 let n=0;const ok=(b)=>{n++;if(!b)throw Error("assert "+n)};
 const concepts=new Set(groups.map(x=>x[0]));ok(Object.keys(byId).length===120);
 for(const q of exercises.filter(q=>concepts.has(old[q.id].concept))){const x=byId[q.id];ok(!!x);ok(x.answer===q.answer);ok(JSON.stringify(x.hand)===JSON.stringify(q.hand));ok(x.canonical===q.explain);ok(x.family===q.caseFamily);}
 ok(JSON.stringify(compile(exercises,old,groups))===JSON.stringify(byId));
 ok(compare(byId,"SEF-004-1","SEF-005-2").type==="doublon_proche_candidat");
 ok(compare(byId,"SEF-L33-005","SEF-006-1").status==="HOLD");
 ok(compare(byId,"SEF-PN26-M1-001","SEF-PN26-M1-004").type==="groupes_distincts_non_arbitres");
 ok(compare(byId,"SEF-037-1","SEF-N084-1").status==="HOLD");return n;
}
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),q=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises,old=Object.fromEntries(read(path.join(dir,'register.json')).map(x=>[x.id,x])),d=read(path.join(dir,'parallel/c/fondamentaux.json')),r=compile(q,old,d.groups);assert.deepEqual(r,d.byId);console.log(test(q,old,d.groups,r));

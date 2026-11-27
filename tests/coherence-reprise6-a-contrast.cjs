'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const A=require('../quizz-coherence-coordinator-a-contrast.js'),P=require('../quizz-prerequis.js');
const base='287bbf94538908605ab5a28661ed94524ece066b',git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:24*1024*1024});
const html=fs.readFileSync('quizz.html','utf8'),previous=git('show',base+':quizz.html'),embedded=h=>h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(html,A.instrumentHTML(previous));assert.equal(embedded(html),embedded(previous));assert.equal(fs.readFileSync('quizz-parcours.js','utf8'),git('show',base+':quizz-parcours.js'));
const all=JSON.parse(embedded(html)).exercises,byId=new Map(all.map(q=>[q.id,q]));assert.equal(all.length,1915);
const fixture=JSON.parse(fs.readFileSync('audits/coherence-concrete-20261126/coordination/early-contrast-decks.json','utf8'));
assert.equal(fixture.rows.length,90);const results=[],counts={3:0,5:0};
for(const r of fixture.rows){
 const deck=r.ids.map(id=>byId.get(id));assert(deck.every(Boolean));const before=JSON.stringify(deck),x=A.earlyContrast(r.s,deck,all,P.byId);
 assert.equal(JSON.stringify(deck),before);if(!x)continue;
 assert([3,5].includes(r.s));assert(!r.ids.includes(x.id));assert.equal(x.example,byId.get(x.id));counts[r.s]++;
 results.push({profile:r.profile,seed:r.seed,session:r.s,id:x.id});
}
assert.deepEqual(counts,{3:12,5:2});
assert.equal(A.earlyContrast(3,[],all,P.byId),null);
console.log('A_CONTRAST '+JSON.stringify({decks:90,counts,results}));

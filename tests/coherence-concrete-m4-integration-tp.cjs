'use strict';
// Coordinator only. T and P remain independent, selected by session, with
// the exact delivered hooks and no production changes. Y is not activated.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const A=require('./coherence-concrete-m4p-a-adapter.cjs'),B=require('./coherence-concrete-m4p-b-adapter.cjs');
const policy=require('../quizz-coherence-m4p-b-policy.js'),saturated=require('../quizz-coherence-m4p-b-saturated.js');
const original=fs.readFileSync(path.join(__dirname,'coherence-concrete-m4-campaign.cjs'),'utf8');
const start='  function select(exercises,state,n=10){',end='  // V1.7 : séance complémentaire';
function extract(s,name){
 const i=s.indexOf(start),j=s.indexOf(end);
 assert.ok(i>=0&&j>i&&s.indexOf(start,i+1)<0&&s.indexOf(end,j+1)<0,'select anchors');
 return s.slice(i,j).replace(start,'  function '+name+'(exercises,state,n=10){');
}
function instrument(s){
 const i=s.indexOf(start),j=s.indexOf(end);
 assert.ok(i>=0&&j>i);
 return s.slice(0,i)+extract(A.instrument(s),'selectEarlyM4')+extract(B.instrument(s,'P'),'selectLateM4')+
 '  function select(exercises,state,n=10){return state.completed<20?selectEarlyM4(exercises,state,n):selectLateM4(exercises,state,n);}\n'+s.slice(j);
}
function runCandidate(opts){
 const changesB=[],record=r=>changesB.push(r);
 const req=id=>id==='./coherence-concrete-m4-adapter.cjs'?{instrument,pick:(ctx,rows,q,max,onChange)=>A.pick(ctx,rows,q,20,onChange,'T')}:require(id);
 const mod={exports:{}};
 new Function('module','exports','require',original)(mod,mod.exports,req);
 const requireBase=id=>id==='./quizz-coherence-m4p-b-policy.js'?{...policy,record}:id==='./quizz-coherence-m4p-b-saturated.js'?{...saturated,record}:opts.requireBase(id);
 const after=mod.exports.run({...opts,requireBase,candidate:true,policy:'TP',maxSession:180});
 assert.ok(after.changes.every(r=>r.session>=3&&r.session<=20));
 assert.ok(changesB.every(r=>r.session>=21&&r.policy==='P'));
 const changesA=after.changes.map(r=>({...r,policy:'T'}));
 after.changes=[...changesA,...changesB];
 assert.equal(after.changes.length,new Set(after.changes.map(r=>r.session)).size,'one substitution per session');
 return after;
}
module.exports={runCandidate,instrument};
if(require.main===module){
 const source=fs.readFileSync(path.join(__dirname,'../quizz-parcours.js'),'utf8');
 new Function('module','exports','require','Date','__m4Pick','__m4Reserve',instrument(source));
 console.log('M4 integrated T+P source syntax PASS');
}

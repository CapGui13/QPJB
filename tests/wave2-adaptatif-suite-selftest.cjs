#!/usr/bin/env node
'use strict';
// Contrat de lancement testé sans exécuter le catalogue ou les benchmarks.
const assert=require('node:assert/strict');
const {plan,main}=require('./wave2-adaptatif-suite.cjs');
const quick=plan('--quick'), full=plan('--full');
assert.equal(quick.length,4);
assert.equal(full.length,9);
assert.deepEqual(full.slice(0,4),quick);
assert.equal(new Set(full.map(s=>s.id)).size,9);
assert.deepEqual(full.slice(5).map(s=>s.args[1]),
  ['foundation','recall','overdue','score-cache']);
let listing='';
assert.equal(main(['--list'],{log:s=>{listing=s;}}),0);
assert.deepEqual(Object.keys(JSON.parse(listing)),['quick','full']);
let calls=0; const errors=[];
const code=main(['--quick'],{
  runner:()=>({status:++calls===2?7:0,signal:null}),
  log:()=>{}, error:s=>errors.push(s)
});
assert.equal(code,7);
assert.equal(calls,2);
assert(errors.some(s=>s.includes('ECHEC')));
let successes=0;
assert.equal(main(['--quick'],{
  runner:()=>{successes++;return {status:0,signal:null};},
  log:()=>{},error:s=>{throw Error(s);}
}),0);
assert.equal(successes,4);
assert.equal(main(['--unknown'],{log:()=>{},error:()=>{}}),2);
assert.equal(main(['--quick','--full'],{log:()=>{},error:()=>{}}),2);
console.log('PASS: 4 validations rapides, 9 commandes completes, erreur propagee, arguments controles');

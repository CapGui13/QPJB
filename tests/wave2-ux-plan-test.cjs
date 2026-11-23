'use strict';
const assert=require('node:assert/strict');
const {runScenarioPlan}=require('./wave2-ux-plan.cjs');
(async()=>{
 const visited=[],logs=[],errors=[];
 const report=await runScenarioPlan([
  {name:'avant',run:async()=>{visited.push('avant')}},
  {name:'échec attendu',run:async()=>{visited.push('échec');throw new Error('échec volontaire')}},
  {name:'après',run:async()=>{visited.push('après')}}
 ],{log:s=>logs.push(s),error:s=>errors.push(s)});
 assert.deepEqual(visited,['avant','échec','après'],'La troisième épreuve doit toujours être exécutée');
 assert.equal(report.passed,2);
 assert.equal(report.failed,1);
 assert.deepEqual(report.results.map(x=>x.status),['passed','failed','passed']);
 assert.equal(logs.length,2);
 assert.equal(errors.length,1);
 assert.match(report.results[1].error,/échec volontaire/);
 assert.ok(report.results.every(x=>Number.isFinite(x.durationMs)));
 console.log('PASS orchestration UX : 3 scénarios, 1 échec isolé, 2 réussites, aucune omission');
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});

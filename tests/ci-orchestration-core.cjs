'use strict';
const assert=require('node:assert/strict');
const {LEVELS,JOBS,aggregate,verifyRun,verdictName,validatePlan}=require('../scripts/ci-orchestration-core.cjs');
const head='a'.repeat(40),base='b'.repeat(40);
const expected={id:123,attempt:2,repoId:99,head};
const run={id:123,run_attempt:2,path:'.github/workflows/training-smoke.yml',repository:{id:99},head_repository:{id:99},head_branch:'main',event:'push',status:'completed',conclusion:'success',head_sha:head};
let count=0;
for(const level of LEVELS){
 const plan={schema:'QPJB_CI_PLAN_V1',baseSha:base,headSha:head,level,publish:level!=='DOC_ONLY',changes:[],reasons:[]};
 assert.equal(validatePlan(plan,base,head),level);count++;
 for(const bad of [{schema:'bad'},{headSha:base},{baseSha:head},{publish:!plan.publish},{level:'fast'},{changes:null}]){
   assert.throws(()=>validatePlan({...plan,...bad},base,head));count++;
 }
 const job=(name,conclusion='success')=>({name,conclusion,status:'completed',run_id:123,run_attempt:2});
 const jobs=[job('QPJB plan V1'),job(verdictName(level,head,base)),...Object.values(JOBS).flat().map(n=>job(n,JOBS[level].includes(n)?'success':'skipped'))];
 assert.deepEqual(verifyRun(run,jobs,expected),{level,head,base});count++;
 for(const bad of [{event:'pull_request'},{event:'repository_dispatch'},{head_branch:'feature'},{head_sha:base},{run_attempt:1},{conclusion:'cancelled'},{repository:{id:1}},{head_repository:{id:1}},{path:'.github/workflows/fake.yml'}]){
   assert.throws(()=>verifyRun({...run,...bad},jobs,expected));count++;
 }
 for(const name of ['QPJB plan V1',verdictName(level,head,base),...JOBS[level]]){
   for(const conclusion of ['failure','cancelled','skipped','neutral','timed_out','action_required',null]){
     const changed=jobs.map(j=>j.name===name?{...j,conclusion}:j);
     assert.throws(()=>verifyRun(run,changed,expected));count++;
   }
   assert.throws(()=>verifyRun(run,jobs.filter(j=>j.name!==name),expected));count++;
   assert.throws(()=>verifyRun(run,[...jobs,jobs.find(j=>j.name===name)],expected));count++;
 }
 assert.throws(()=>verifyRun(run,jobs.map(j=>({...j,run_attempt:1})),expected));count++;
 const statuses={plan:'success',...Object.fromEntries(Object.values(JOBS).flat().map(n=>[n,JOBS[level].includes(n)?'success':'skipped']))};
 aggregate(level,statuses);count++;
 for(const n of JOBS[level]){assert.throws(()=>aggregate(level,{...statuses,[n]:'skipped'}));count++;}
}
assert.throws(()=>verdictName('QUICK',head,'none'));count++;
console.log('M3 policy PASS: '+count+' positive/negative assertions');

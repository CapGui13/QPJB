'use strict';
// Shared, side-effect-free policy. GitHub API results must come from authenticated
// calls to the repository, never from an artifact or a pull-request input.
const assert = require('node:assert/strict');
const SHA = /^[0-9a-f]{40}$/;
const LEVELS = ['DOC_ONLY','QUICK','UI','FULL'];
const JOBS = {
  DOC_ONLY: [],
  QUICK: ['QPJB quick'],
  UI: ['QPJB quick','QPJB UI chromium','QPJB UI webkit'],
  FULL: ['Audit des données et du code','Simulations longues du parcours V1',
    'Validation chromium','Validation webkit']
};
function validSha(s) { return typeof s === 'string' && SHA.test(s); }
function requireLevel(level) { assert(LEVELS.includes(level),'Unknown CI level'); }
function validatePlan(p, base, head) {
  assert(p && p.schema === 'QPJB_CI_PLAN_V1','Unknown classifier schema');
  assert(validSha(base) && validSha(head) && p.baseSha === base && p.headSha === head,'Classifier SHA mismatch');
  requireLevel(p.level);
  assert.equal(p.publish,p.level !== 'DOC_ONLY','Inconsistent publish flag');
  assert(Array.isArray(p.changes) && Array.isArray(p.reasons) && p.reasons.every(x=>typeof x==='string'),'Invalid classifier details');
  for(const c of p.changes) {
    assert(c && typeof c.status==='string' && typeof c.path==='string' && c.path.length>0,'Invalid change');
    assert(c.oldPath===undefined || (typeof c.oldPath==='string' && c.oldPath.length>0),'Invalid oldPath');
  }
  return p.level;
}
function requiredJobs(level) { requireLevel(level); return JOBS[level].slice(); }
function aggregate(level, results) {
  const needed=requiredJobs(level);
  assert.equal(results.plan,'success','Plan did not succeed');
  for(const name of needed) assert.equal(results[name],'success','Mandatory job did not succeed: '+name);
  for(const name of Object.values(JOBS).flat()) {
    if(!needed.includes(name)) assert.equal(results[name],'skipped','Unexpected job result: '+name);
  }
}
function verdictName(level,head,base) {
  requireLevel(level); assert(validSha(head),'Invalid head');
  assert(validSha(base) || (base==='none' && level==='FULL'),'Invalid base');
  return ['QPJB verdict V1',level,head,base].join(' ');
}
function parseVerdict(name) {
  const m=/^QPJB verdict V1 (DOC_ONLY|QUICK|UI|FULL) ([0-9a-f]{40}) ([0-9a-f]{40}|none)$/.exec(name);
  assert(m,'Malformed verdict');
  const [,level,head,base]=m;
  assert.equal(name,verdictName(level,head,base));
  return {level,head,base};
}
function exactJob(jobs,name) {
  const matches=jobs.filter(j=>j.name===name);
  assert.equal(matches.length,1,'Missing/duplicate job: '+name);
  const job=matches[0];
  assert.equal(job.status,'completed','Job not completed: '+name);
  return job;
}
function verifyRun(run,jobs,expected) {
  assert(run && run.id===expected.id && run.run_attempt===expected.attempt,'Wrong run/attempt');
  assert(run.path==='.github/workflows/training-smoke.yml','Wrong workflow');
  assert(run.repository?.id===expected.repoId && run.head_repository?.id===expected.repoId,'Wrong repository');
  assert.equal(run.head_branch,'main','Not main');
  assert(['push','workflow_dispatch'].includes(run.event),'Untrusted trigger');
  assert.equal(run.status,'completed'); assert.equal(run.conclusion,'success');
  assert(validSha(expected.head) && run.head_sha===expected.head,'Wrong head SHA');
  assert(Array.isArray(jobs),'Missing jobs');
  for(const j of jobs) assert(j.run_id===run.id && j.run_attempt===run.run_attempt,'Foreign job/attempt');
  const matches=jobs.filter(j=>j.name.startsWith('QPJB verdict'));
  assert.equal(matches.length,1,'Missing/duplicate verdict');
  const v=parseVerdict(matches[0].name);
  assert.equal(v.head,expected.head,'Verdict for wrong SHA');
  assert.equal(exactJob(jobs,matches[0].name).conclusion,'success','Verdict unsuccessful');
  const statuses={plan:exactJob(jobs,'QPJB plan V1').conclusion};
  for(const name of Object.values(JOBS).flat()) {
    const found=jobs.filter(j=>j.name===name);
    // A skipped matrix job can have its unevaluated matrix name. No missing
    // mandatory job is accepted; non-required jobs are irrelevant to proof.
    if(requiredJobs(v.level).includes(name)) statuses[name]=exactJob(jobs,name).conclusion;
    else {
      assert(found.length<=1,'Duplicate job: '+name);
      if(found.length) assert.equal(found[0].conclusion,'skipped','Unexpected job: '+name);
      statuses[name]='skipped';
    }
  }
  aggregate(v.level,statuses);
  return v;
}
module.exports={LEVELS,JOBS,validSha,validatePlan,requiredJobs,aggregate,verdictName,parseVerdict,verifyRun};

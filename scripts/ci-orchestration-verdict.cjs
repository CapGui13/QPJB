'use strict';
const {JOBS,aggregate,verdictName}=require('./ci-orchestration-core.cjs');
const assert=require('node:assert/strict');
const env=process.env;
const names={
 'Audit des données et du code':'integrity','Simulations longues du parcours V1':'parcours-long',
 'Validation chromium':'smoke','Validation webkit':'webkit',
 'QPJB quick':'quick','QPJB UI chromium':'ui-chromium','QPJB UI webkit':'ui-webkit'
};
const needs=JSON.parse(env.NEEDS_JSON);
const statuses={plan:needs.plan?.result};
for(const [name,id] of Object.entries(names))statuses[name]=needs[id]?.result;
assert.equal(needs.plan?.outputs?.head,env.GITHUB_SHA,'Verdict checkout SHA mismatch');
const level=needs.plan.outputs.level,base=needs.plan.outputs.base;
aggregate(level,statuses);
console.log(verdictName(level,env.GITHUB_SHA,base));

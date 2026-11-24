'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {validSha}=require('./ci-orchestration-core.cjs');
const {api,git,checkpoint,effectiveBase,exactMain,verifiedSourceRun}=require('./ci-publication-state.cjs');
function guard({id,attempt,head,workflowSha},deps={api,git,checkpoint,effectiveBase,exactMain,verifiedSourceRun}){
 assert(validSha(head)&&head===workflowSha,'Publisher workflow revision differs from tested commit');
 const verdict=deps.verifiedSourceRun(id,attempt,head);
 if(verdict.level!=='FULL'){
  const cp=deps.checkpoint();
  assert(cp,'Reduced verdict without current trusted deployment');
  assert.equal(deps.effectiveBase(cp.sha,head),verdict.base,'Publication base changed since validation');
 }
 deps.exactMain(head);
 return verdict;
}
function main(){
 const head=process.env.VERIFIED_SHA;
 assert(validSha(head)&&git(['rev-parse','HEAD']).trim()===head,'Checkout not exactly tested commit');
 if(process.argv[2]==='exact-main'){exactMain(head);return;}
 assert.equal(process.argv[2],'verify','Unknown gate command');
 const v=guard({id:Number(process.env.SOURCE_RUN),attempt:Number(process.env.SOURCE_ATTEMPT),head,workflowSha:process.env.GITHUB_SHA});
 fs.appendFileSync(process.env.GITHUB_OUTPUT,'level='+v.level+'\npublish='+(v.level!=='DOC_ONLY')+'\n');
 console.log('Verified source run '+process.env.SOURCE_RUN+' '+JSON.stringify(v));
}
if(require.main===module)main();
module.exports={guard};

'use strict';
// Supplemental pedagogical PR recipe only. Never a publication verdict.
// Manual invocation, unknown change, missing proof, or classification error
// must run the complete recipe (or fail); no bypass of training-smoke.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {classify}=require('./ci-classify.cjs');
const SHA=/^[0-9a-f]{40}$/;
function git(args){return execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
function needsFull({event,base,head,merge},deps={git,classify}){
 if(event!=='pull_request')return true;
 try{
  if(![base,head,merge].every(x=>SHA.test(x||'')))return true;
  if(deps.git(['rev-parse','HEAD'])!==merge)return true;
  deps.git(['merge-base','--is-ancestor',base,merge]);
  deps.git(['merge-base','--is-ancestor',head,merge]);
  const mb=deps.git(['merge-base',base,head]);
  if(!SHA.test(mb))return true;
  const plans=[deps.classify(mb,head),deps.classify(base,merge)];
  return plans.some((p,i)=>!p||p.schema!=='QPJB_CI_PLAN_V1'||p.baseSha!==[mb,base][i]||p.headSha!==[head,merge][i]||
   !['DOC_ONLY','QUICK','UI'].includes(p.level));
 }catch(e){console.error('Supplemental recipe defaults to FULL:',e.message);return true;}
}
if(require.main===module){
 const full=needsFull({event:process.env.GITHUB_EVENT_NAME,base:process.env.PR_BASE,head:process.env.PR_HEAD,merge:process.env.GITHUB_SHA});
 fs.appendFileSync(process.env.GITHUB_OUTPUT,'full='+full+'\n');
 console.log('TRANSVERSAL_SCOPE '+(full?'FULL':'targeted CI only'));
}
module.exports={needsFull};

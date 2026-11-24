'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {LEVELS,validSha,validatePlan}=require('./ci-orchestration-core.cjs');
const {routineRange}=require('./ci-routine.cjs');
const {git,ancestor,checkpoint,effectiveBase}=require('./ci-publication-state.cjs');
function classify(base,head) {
 const raw=execFileSync(process.execPath,['scripts/ci-classify.cjs','--base',base,'--head',head],
  {encoding:'utf8',stdio:['ignore','pipe','inherit'],maxBuffer:16*1024*1024,timeout:60000});
 return validatePlan(JSON.parse(raw),base,head);
}
function maxLevel(a,b) {return LEVELS[Math.max(LEVELS.indexOf(a),LEVELS.indexOf(b))];}
// Classify the net diff AND every newly reachable commit (including merged
// side branches). A sensitive change followed by a revert must not disappear.
// A base outside the first-parent lineage conservatively forces FULL.
function cumulative(base,head,run=classify) {
 assert(validSha(base)&&validSha(head)&&ancestor(base,head),'Invalid cumulative range');
 // Only explicitly scoped, linear routine ranges bypass the historical classifier.
 if(run===classify&&routineRange(base,head))return 'QUICK';
 const lineage=git(['rev-list','--first-parent','--reverse',base+'..'+head]).trim().split('\n').filter(Boolean);
 if(lineage.length && git(['rev-parse',lineage[0]+'^1']).trim()!==base)return 'FULL';
 const commits=git(['rev-list','--topo-order','--reverse','--parents',base+'..'+head]).trim().split('\n').filter(Boolean);
 if(commits.length>128)return 'FULL';
 let level=run(base,head);
 for(const row of commits){
  if(level==='FULL')break;
  const [c,parent]=row.split(' ');
  if(!validSha(c)||!validSha(parent))return 'FULL';
  level=maxLevel(level,run(parent,c));
 }
 return level;
}
function choose({head,event,prBase,prHead},deps={checkpoint,effectiveBase,classify,cumulative}) {
 assert(validSha(head),'Invalid checked SHA');
 assert(['push','workflow_dispatch','pull_request'].includes(event),'Unknown event');
 const full=reason=>({head,base:'none',level:'FULL',reason});
 const targeted=reason=>({head,base:'none',level:'TARGETED',reason});
 if(event==='workflow_dispatch')return full('Manual complete recipe');
 const cp=deps.checkpoint();
 if(!cp)return targeted('No attested deployment: validate all current public resources');
 const base=deps.effectiveBase(cp.sha,head);
 if(!base)return targeted('No ancestral deployment: validate all current public resources');
 let level=deps.cumulative(base,head,deps.classify);
 if(event==='pull_request'){
  assert(validSha(prBase)&&validSha(prHead)&&ancestor(prBase,head)&&ancestor(prHead,head),'Invalid PR merge checkout');
  const mergeBase=git(['merge-base',prBase,prHead]).trim();
  assert(validSha(mergeBase),'Missing PR merge-base');
  const prLevel=maxLevel(deps.cumulative(mergeBase,prHead,deps.classify),deps.cumulative(prBase,head,deps.classify));
  // The targeted validator will see the cumulative base/head range. If the
  // PR-only range is stricter, FULL is safer than testing a different range.
  if(LEVELS.indexOf(prLevel)>LEVELS.indexOf(level))level='FULL';
 }
 // The legacy classifier still identifies scope, but global recipes are opt-in.
 if(level==='FULL'||level==='UI')level='TARGETED';
 return {head,base,level,reason:'Attested Pages deployment '+cp.deploymentId};
}
function main(){
 const head=process.env.GITHUB_SHA,event=process.env.GITHUB_EVENT_NAME;
 assert(validSha(head)&&git(['rev-parse','HEAD']).trim()===head,'Checkout not at expected SHA');
 let p;
 if(!fs.existsSync('scripts/ci-classify.cjs'))p={head,base:'none',level:'TARGETED',reason:'Classifier unavailable: validate all current public resources'};
 else p=choose({head,event,prBase:process.env.PR_BASE,prHead:process.env.PR_HEAD});
 fs.appendFileSync(process.env.GITHUB_OUTPUT,'level='+p.level+'\nbase='+p.base+'\nhead='+p.head+'\n');
 console.log(JSON.stringify(p));
}
if(require.main===module)main();
module.exports={classify,cumulative,choose,maxLevel};

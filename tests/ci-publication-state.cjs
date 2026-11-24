'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {checkpoint,exactMain,effectiveBase,verifiedBot,ancestor,catalogueSource}=require('../scripts/ci-publication-state.cjs');
const {guard}=require('../scripts/ci-publication-guard.cjs');
const {cumulative,choose}=require('../scripts/ci-orchestration-plan.cjs');
const repo='CapGui13/QPJB',head='a'.repeat(40),base='b'.repeat(40),repoId=99;
process.env.GITHUB_REPOSITORY=repo;
const run={id:12,run_attempt:2,path:'.github/workflows/verified-pages.yml',event:'workflow_run',head_branch:'main',head_sha:base,repository:{id:repoId},head_repository:{id:repoId},status:'completed',conclusion:'success'};
const job={id:13,run_id:12,run_attempt:2,name:'QPJB publication V1 '+base,status:'completed',conclusion:'success',steps:[{name:'Déployer QPJB',status:'completed',conclusion:'success'}]};
const responses={
 'deployments?environment=github-pages&per_page=1':[{id:14,sha:base,environment:'github-pages'}],
 'deployments/14/statuses?per_page=1':[{state:'success',log_url:'https://github.com/'+repo+'/actions/runs/12/job/13'}],
 'actions/runs/12':run,
 'actions/runs/12/attempts/2/jobs?per_page=100':{jobs:[job],total_count:1},
 'git/ref/heads/main':{ref:'refs/heads/main',object:{type:'commit',sha:head}}
};
const reader=r=>key=>{assert(key in r,'Unexpected API: '+key);return r[key]};
assert.deepEqual(checkpoint(reader(responses),repoId),{sha:base,deploymentId:14,runId:12,attempt:2});
let cases=1;
const attested={sha:head,runId:12,attempt:2};
for(const [cp,h,m,event,id,attempt,expected] of [
 [attested,head,head,'workflow_run',12,2,true],
 [attested,head,head,'workflow_run',13,2,false],
 [attested,head,head,'workflow_run',12,1,false],
 [attested,head,head,'workflow_run',NaN,2,false],
 [attested,head,base,'workflow_run',12,2,false],
 [attested,base,base,'workflow_run',12,2,false],
 [null,head,head,'workflow_run',12,2,false],
 [attested,head,head,'pull_request',12,2,false],
 [attested,head,head,'workflow_dispatch',NaN,NaN,true]
]){assert.equal(catalogueSource(cp,h,m,event,id,attempt),expected);cases++;}
for(const [key,mutate] of [
 ['deployments?environment=github-pages&per_page=1',a=>a.splice(0)],
 ['deployments?environment=github-pages&per_page=1',a=>a[0].sha=head],
 ['deployments/14/statuses?per_page=1',a=>a[0].state='failure'],
 ['deployments/14/statuses?per_page=1',a=>a[0].state='in_progress'],
 ['deployments/14/statuses?per_page=1',a=>a[0].log_url=''],
 ['deployments/14/statuses?per_page=1',a=>a[0].log_url='https://evil.invalid/actions/runs/12/job/13'],
 ['deployments/14/statuses?per_page=1',a=>a[0].log_url=a[0].log_url.replace('/13','/999')],
 ['actions/runs/12',a=>a.event='pull_request'],
 ['actions/runs/12',a=>a.path='.github/workflows/other.yml'],
 ['actions/runs/12',a=>a.conclusion='failure'],
 ['actions/runs/12',a=>a.head_sha=head],
 ['actions/runs/12/attempts/2/jobs?per_page=100',a=>a.jobs[0].conclusion='skipped'],
 ['actions/runs/12/attempts/2/jobs?per_page=100',a=>a.jobs[0].steps[0].conclusion='failure'],
 ['actions/runs/12/attempts/2/jobs?per_page=100',a=>a.jobs[0].name='Old deployment'],
 ['actions/runs/12/attempts/2/jobs?per_page=100',a=>a.total_count=2]
]){
 const r=structuredClone(responses);mutate(r[key]);assert.equal(checkpoint(reader(r),repoId),null);cases++;
}
exactMain(head,reader(responses));assert.throws(()=>exactMain(base,reader(responses)));cases+=2;
const deps={verifiedSourceRun:()=>({level:'QUICK',base,head}),checkpoint:()=>({sha:base}),effectiveBase:()=>base,exactMain:()=>{}};
const source={id:2,attempt:1,head,workflowSha:head};
assert.equal(guard(source,deps).level,'QUICK');cases++;
for(const bad of [
 {...deps,checkpoint:()=>null},{...deps,effectiveBase:()=>head},
 {...deps,exactMain:()=>{throw Error('stale')}},{...deps,verifiedSourceRun:()=>{throw Error('bad verdict')}}
]){assert.throws(()=>guard(source,bad));cases++;}
assert.throws(()=>guard({...source,workflowSha:base},deps));cases++;
assert.equal(guard(source,{...deps,checkpoint:()=>null,verifiedSourceRun:()=>({level:'FULL',base:'none',head})}).level,'FULL');cases++;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-m3-git-')),original=process.cwd();
try{
 process.chdir(temp);
 const git=(...a)=>execFileSync('git',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git('init','-b','main');git('config','user.name','M3 Sandbox');git('config','user.email','m3@example.invalid');
 function put(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,v);}
 function commit(message){git('add','.');git('commit','-m',message);return git('rev-parse','HEAD');}
 put('quizz.html','original');put('catalogue.json','old');put('site-version.json','old');
 put('scripts/build_catalogue.py','from pathlib import Path\nimport subprocess,json\nr=Path(__file__).resolve().parents[1]\n(r/"catalogue.json").write_text("generated")\n(r/"site-version.json").write_text(json.dumps({"revision":subprocess.check_output(["git","rev-parse","HEAD"],cwd=r,text=True).strip()}))\n');
 const deployed=commit('deployed');
 // Signed-commit API metadata is injected only in tests; real git diff,
 // worktree and Python regeneration execute against this disposable repo.
 put('catalogue.json','generated');put('site-version.json',JSON.stringify({revision:deployed}).replace(':',': '));
 const bot=commit('Actualiser automatiquement le catalogue QPJB');
 const metadata={sha:bot,parents:[{sha:deployed}],author:{login:'github-actions[bot]'},committer:{login:'web-flow'},commit:{message:'Actualiser automatiquement le catalogue QPJB',verification:{verified:true,reason:'valid'}}};
 const fake=()=>metadata;
 assert(verifiedBot(deployed,bot,fake));cases++;
 assert.equal(effectiveBase(deployed,bot,(p,c)=>verifiedBot(p,c,fake)),bot);cases++;
 assert(!verifiedBot(deployed,bot,()=>({...metadata,author:{login:'human'}})));cases++;
 assert(!verifiedBot(deployed,bot,()=>({...metadata,committer:{login:'human'}})));cases++;
 assert(!verifiedBot(deployed,bot,()=>({...metadata,commit:{...metadata.commit,verification:{verified:false}}})));cases++;
 put('quizz.html','sensitive');const sensitive=commit('unpublished failure');
 put('Docs/image.png','new');const image=commit('only latest commit looks quick');
 function classifier(a,b){
  const files=git('diff','--name-only',a,b).split('\n').filter(Boolean);
  if(files.some(f=>!f.startsWith('Docs/')))return 'FULL';
  return files.length?'QUICK':'DOC_ONLY';
 }
 assert.equal(classifier(sensitive,image),'QUICK');
 assert.equal(cumulative(bot,image,classifier),'FULL');cases+=2;
 put('quizz.html','original');const reverted=commit('revert sensitive');
 assert.equal(classifier(bot,reverted),'QUICK');
 assert.equal(cumulative(bot,reverted,classifier),'FULL');cases+=2;
 assert.equal(choose({head:reverted,event:'push'},{checkpoint:()=>null}).level,'FULL');cases++;
 assert.equal(choose({head:reverted,event:'push'},{checkpoint:()=>({sha:deployed,deploymentId:14}),effectiveBase:()=>bot,cumulative,classify:classifier}).level,'FULL');cases++;
 git('checkout','-b','clean-main',bot);
 put('Docs/main.png','main');const cleanMain=commit('main image');
 git('checkout','-b','side',bot);
 put('quizz.html','hidden sensitive');commit('side sensitive');
 put('quizz.html','original');put('Docs/side.png','side');commit('side revert and image');
 git('checkout','clean-main');git('merge','--no-ff','side','-m','merge side');
 const merged=git('rev-parse','HEAD');
 assert.equal(classifier(bot,merged),'QUICK');
 assert.equal(cumulative(bot,merged,classifier),'FULL');cases+=2;
 git('checkout','-b','quick-side',cleanMain);
 put('Docs/quick.png','quick');commit('only image');
 git('checkout','-b','quick-main',cleanMain);
 put('Docs/another.png','another');commit('another image');
 git('merge','--no-ff','quick-side','-m','merge quick side');
 assert.equal(cumulative(cleanMain,git('rev-parse','HEAD'),classifier),'QUICK');cases++;
 git('checkout','--orphan','rollback');git('rm','-rf','.');put('quizz.html','other history');const rollback=commit('unrelated');
 assert(!ancestor(deployed,rollback));assert.equal(effectiveBase(deployed,rollback),null);cases+=2;
}finally{process.chdir(original);fs.rmSync(temp,{recursive:true,force:true});}
console.log('M3 publication state PASS: '+cases+' assertions; temporary Git/worktree/Python and checkpoint adversaries');

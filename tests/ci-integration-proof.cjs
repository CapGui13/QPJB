'use strict';
// Integration proof only. A disposable local repository, never a push or deploy.
// The injected checkpoint stands for an attested published base in the test;
// the actual production planner still queries GitHub and fails closed.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-ci-integration-'));
const work=path.join(tmp,'repo');
function git(...args){return execFileSync('git',args,{cwd:work,encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024}).trim();}
function run(command,args,env={},expected=0){
 const start=Date.now();
 const p=spawnSync(command,args,{cwd:work,env:{...process.env,...env},encoding:'utf8',maxBuffer:16*1024*1024,timeout:180000});
 assert(!p.error,p.error?.message);
 console.log(p.stdout,p.stderr);
 assert.equal(p.status,expected,command+' '+args.join(' '));
 return {seconds:(Date.now()-start)/1000,out:p.stdout,err:p.stderr};
}
try {
 execFileSync('git',['clone','--quiet','--shared','--no-checkout',root,work]);
 const base=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 git('checkout','--detach',base); git('config','user.name','QPJB integration fixture');git('config','user.email','fixture@example.invalid');
 process.chdir(work);
 const planner=require(path.join(work,'scripts/ci-orchestration-plan.cjs'));
 const state=require(path.join(work,'scripts/ci-publication-state.cjs'));
 const core=require(path.join(work,'scripts/ci-orchestration-core.cjs'));
 const dep={checkpoint:()=>({sha:base,deploymentId:1}),effectiveBase:(b,h)=>state.effectiveBase(b,h,()=>false),classify:planner.classify,cumulative:planner.cumulative};
 const mode=process.argv[2];
 const cat=JSON.parse(fs.readFileSync('catalogue.json','utf8'));
 const session=cat.seances.find(s=>s.folder.endsWith('Mumu'));
 const pbn=path.join(session.folder,'B989 - integration fixture.pbn');
 const original=path.join(session.folder,session.fichiers[0].name);
 const newImage='Docs/Integration fixture.png';
 const css='qpjb-bridge-ui.css';
 function commit(label){git('add','-A');git('commit','-m',label);return git('rev-parse','HEAD');}
 function reset(){git('reset','--hard',base);git('clean','-fd');}
 function plan(head,expected,deps=dep){
  const p=planner.choose({head,event:'push'},deps);
  assert.equal(p.level,expected);assert.equal(p.head,head);
  assert.equal(p.base,deps===dep?base:'none');
  const result=JSON.parse(execFileSync(process.execPath,['scripts/ci-classify.cjs','--base',base,'--head',head],{encoding:'utf8'}));
  const actual=core.validatePlan(result,base,head);
  if(deps===dep)assert.equal(actual,expected);
  console.log('INTEGRATION_PLAN',expected,head,JSON.stringify(p));
  return p;
 }
 function verdict(p,success){
  const ids={'Audit des données et du code':'integrity','Simulations longues du parcours V1':'parcours-long','Validation chromium':'smoke','Validation webkit':'webkit','QPJB quick':'quick','QPJB UI chromium':'ui-chromium','QPJB UI webkit':'ui-webkit'};
  const needed=core.requiredJobs(p.level);
  // Simulated job results exercise the real verdict implementation; never an
  // attestation of a production run. All relevant real commands are run below.
  const needs={plan:{result:'success',outputs:{head:p.head,base:p.base,level:p.level}}};
  for(const [name,id] of Object.entries(ids))needs[id]={result:needed.includes(name)?'success':'skipped'};
  if(!success)needs.quick={result:'failure'};
  const cmd=spawnSync(process.execPath,['scripts/ci-orchestration-verdict.cjs'],{cwd:work,env:{...process.env,NEEDS_JSON:JSON.stringify(needs),GITHUB_SHA:p.head},encoding:'utf8'});
  assert.equal(cmd.status,success?0:1,cmd.stdout+cmd.stderr);
  console.log('VERDICT_FIXTURE',p.level,success?'accepted':'rejected');
 }
 function quick(p,ok=true){
  const result=run('python3',['scripts/ci-quick-check.py','--base',p.base,'--head',p.head],{},ok?0:1);
  assert.equal(result.out.includes('QUICK_PASS'),ok);
  console.log('INTEGRATION_QUICK_SECONDS',result.seconds);
  return result;
 }
 if(mode==='quick'){
  // Copy real valid image and PBN, then exercise the exact M1→M3→M2 interfaces.
  fs.copyFileSync(original,pbn);
  const sample=cat.images.find(x=>x.name.endsWith('.png'));
  fs.copyFileSync(path.join('Docs',sample.name),newImage);
  const good=plan(commit('valid course resources'),'QUICK');quick(good);verdict(good,true);verdict(good,false);
  reset();fs.writeFileSync(pbn,Buffer.from([0,1,2]));const broken=plan(commit('invalid PBN'),'QUICK');quick(broken,false);verdict(broken,false);
  reset();fs.appendFileSync('quizz-parcours.js','\n// disposable sensitive change\n');commit('sensitive');fs.copyFileSync(original,pbn);plan(commit('image/PBN after sensitive'),'FULL');
  reset();fs.appendFileSync('quizz-parcours.js','\n// disposable reverted change\n');commit('sensitive');fs.writeFileSync('quizz-parcours.js',gitRaw(base,'quizz-parcours.js'));commit('revert');fs.copyFileSync(original,pbn);plan(commit('PBN after revert'),'FULL');
  reset();const report=git('ls-files','audits/wave2/ux').split('\n').find(s=>s.includes('PASSE_14_')&&s.endsWith('.md'));assert(report);
  fs.appendFileSync(report,'\nIntegration fixture note.\n');const doc=plan(commit('internal note'),'DOC_ONLY');verdict(doc,true);
  fs.copyFileSync(original,pbn);plan(commit('public and internal cumulative'),'FULL');
  reset();fs.copyFileSync(original,pbn);const head=commit('valid PBN without trusted base');plan(head,'FULL',{...dep,checkpoint:()=>null});
  reset();fs.appendFileSync(css,'\n/* disposable integration UI change */\n');const ui=plan(commit('valid CSS'),'UI');quick(ui);
  console.log('INTEGRATION_SCENARIOS_PASS 7 scenarios, exact SHA, real QUICK pass/fail, verdict fail-closed');
 }else if(mode==='chromium'||mode==='webkit'){
  fs.appendFileSync(css,'\n/* disposable integration UI change */\n');
  const p=plan(commit('valid CSS'),'UI');
  const t=run(process.execPath,['tests/ci-ui-targeted.cjs'],{PW_BROWSER:mode,NODE_PATH:path.join(root,'node_modules')});
  assert(t.out.includes('UI_PASS '+mode+' '+p.head));verdict(p,true);
  console.log('INTEGRATION_UI_SECONDS',mode,t.seconds);
 }else throw Error('Expected quick, chromium or webkit');
 function gitRaw(ref,file){return execFileSync('git',['show',ref+':'+file],{cwd:work,maxBuffer:16*1024*1024});}
}finally{process.chdir(root);fs.rmSync(tmp,{recursive:true,force:true});}

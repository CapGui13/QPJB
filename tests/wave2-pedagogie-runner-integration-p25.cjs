'use strict';
// P25 : teste le lanceur réel avec des sous-processus simulés, sans lire les QCM.
// Les scripts pédagogiques réels ne sont PAS exécutés par cette simulation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {hasPassMarker}=require('./wave2-pedagogie-runner-p24.cjs');
const suiteFile=path.join(__dirname,'wave2-pedagogie-suite.cjs');
const suiteCode=fs.readFileSync(suiteFile,'utf8');
const listMatch=suiteCode.match(/const tests=\[([\s\S]*?)\];/);
assert(listMatch,'Liste des scripts absente dans le vrai lanceur');
const files=[...listMatch[1].matchAll(/'([^']+\.cjs)'/g)].map(x=>x[1]);
assert(files.length>=19,'Une suite anormalement courte a été détectée');
assert.equal(new Set(files).size,files.length,'Le lanceur contient des doublons');
const aliases={
 'wave2-pedagogie-parcours.cjs':'wave2-pedagogie',
 'wave2-pedagogie-contre-expertise-avancee.cjs':'wave2-pedagogie-contre-expertise'
};
const marker=file=>'PASS '+(aliases[file]||file.slice(0,-4))+' : test simule OK';
class ExitSignal extends Error{constructor(code){super('exit:'+code);this.code=code;}}
function run(failure=null,code=suiteCode){
 const calls=[],stdout=[],stderr=[],logs=[],errors=[];
 const fakeProcess={execPath:process.execPath,
  stdout:{write:s=>stdout.push(String(s))},stderr:{write:s=>stderr.push(String(s))},
  exit:c=>{throw new ExitSignal(c)}};
 const spawn=(executable,args,options)=>{
  const i=calls.length,file=path.basename(args[0]);
  assert.equal(executable,process.execPath,'Node executable incorrect');
  assert.equal(file,files[i],'Ordre des commandes différent du manifeste');
  assert.equal(options.encoding,'utf8');
  assert.equal(options.timeout,120000,'Timeout absent');
  assert.equal(options.cwd,path.resolve(__dirname,'..'));
  calls.push(file);
  const r={status:0,stdout:marker(file)+'\n',stderr:''};
  if(failure&&i===failure.index){
   switch(failure.kind){
    case 'wrongMarker': r.stdout=marker(files[(i+1)%files.length])+'\n';break;
    case 'falsePositive': r.stdout='DEBUG PASS\n'+marker(files[(i+1)%files.length])+'\n';break;
    case 'noMarker': r.stdout='Output sans validation';break;
    case 'nonzero': r.status=9;break;
    case 'spawnError': r.error=new Error('ETIMEDOUT');r.status=null;break;
    case 'stderrOnly': r.stderr=marker(file);r.stdout='';break;
    case 'afterFail': r.stdout=marker(file)+'\nFAIL '+file+' : erreur tardive\n';break;
    case 'afterOtherPass': r.stdout=marker(file)+'\n'+marker(files[(i+1)%files.length])+'\n';break;
    default: throw Error('Cas de test inconnu');
   }
  }
  return r;
 };
 const fakeRequire=name=>{
  if(name==='node:child_process')return {spawnSync:spawn};
  if(name==='node:path')return path;
  if(name==='./wave2-pedagogie-runner-p24.cjs')return {hasPassMarker};
  throw new Error('Import inattendu '+name);
 };
 let exitCode=0;
 try{vm.runInNewContext(code,{require:fakeRequire,__dirname,process:fakeProcess,
   console:{log:s=>logs.push(String(s)),error:s=>errors.push(String(s))}},
   {filename:'wave2-pedagogie-suite.cjs',timeout:5000});}
 catch(e){if(e instanceof ExitSignal)exitCode=e.code;else throw e;}
 return {calls,stdout,stderr,logs,errors,exitCode};
}
const all=run();
assert.equal(all.exitCode,0);assert.deepEqual(all.calls,files);
assert(all.logs.some(x=>x==='PASS wave2-pedagogie-suite : '+files.length+' tests successifs')); 
const cases=['wrongMarker','falsePositive','noMarker','nonzero','spawnError','stderrOnly','afterFail','afterOtherPass'];
for(const kind of cases){
 const faultIndex=7,result=run({kind,index:faultIndex});
 assert.equal(result.exitCode,1,'Échec '+kind+' non propagé');
 assert.equal(result.calls.length,faultIndex+1,'La suite ne s’arrête pas immédiatement pour '+kind);
 assert(result.errors.some(x=>x.startsWith('FAIL '+files[faultIndex])));
 assert(!result.logs.some(x=>x.startsWith('PASS wave2-pedagogie-suite')));
}
// Contre-preuve : l'ancienne condition accepte un marqueur PASS quelconque.
const oldCode=suiteCode.replace('if(!hasPassMarker(file,res.stdout))',"if(!res.stdout.includes('PASS'))");
assert.notEqual(oldCode,suiteCode,'Mutation de la condition du lanceur sans effet');
const obsolete=run({kind:'wrongMarker',index:7},oldCode);
assert.equal(obsolete.exitCode,0,'La contre-preuve doit montrer l’ancien faux positif');
assert.equal(obsolete.calls.length,files.length);
console.log('PASS wave2-pedagogie-runner-integration-p25 : '+files.length+' scripts simules, 8 echecs rejetes, ancien faux succes demontre');

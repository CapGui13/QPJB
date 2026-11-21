'use strict';
/* Orchestrateur de recette M3 : un scénario défaillant ne doit pas masquer les suivants. */
async function runScenarioPlan(cases,{log=console.log,error=console.error}={}){
 const results=[];
 for(const item of cases){
  if(!item||!item.name||typeof item.run!=='function')throw new Error('Scénario M3 invalide');
  const begun=Date.now();
  try{
   await item.run();
   const done={name:item.name,status:'passed',durationMs:Date.now()-begun};
   results.push(done);
   log('M3 PASS '+item.name+' ('+done.durationMs+' ms)');
  }catch(failure){
   const done={name:item.name,status:'failed',durationMs:Date.now()-begun,
    error:String(failure&&failure.stack||failure)};
   results.push(done);
   error('M3 FAIL '+item.name+' : '+done.error);
  }
 }
 return {passed:results.filter(r=>r.status==='passed').length,
  failed:results.filter(r=>r.status==='failed').length,results};
}
module.exports={runScenarioPlan};

'use strict';
/* Ne pas accepter une capture ou un scénario UX si le JS/CSS local échoue.
 * Une ressource manquante peut ne déclencher aucune erreur `pageerror`.
 */
const assert=require('node:assert/strict');
function watchLocalAssets(page,origin){
 const expectedOrigin=new URL(origin).origin;
 const failures=[];
 function local(request){
  const type=request.resourceType();
  if(type!=='script'&&type!=='stylesheet')return false;
  try{return new URL(request.url()).origin===expectedOrigin}
  catch(_){return false}
 }
 page.on('response',response=>{
  const request=response.request();
  if(local(request)&&response.status()>=400){
   failures.push(`${request.resourceType()} HTTP ${response.status()} : ${request.url()}`);
  }
 });
 page.on('requestfailed',request=>{
  if(local(request)){
   const reason=request.failure()?.errorText||'network failure';
   failures.push(`${request.resourceType()} ${reason} : ${request.url()}`);
  }
 });
 return {
  failures,
  assertClean(label='M3'){
   assert.deepEqual(failures,[],`Ressource CSS/JS locale manquante (${label})`);
  }
 };
}
module.exports={watchLocalAssets};

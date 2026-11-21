'use strict';
/* Recette complète LONG M3 ; aucune modification du dépôt ni publication.
 * Après installation de playwright@1.64.1 et des navigateurs correspondants :
 *   node tests/wave2-ux-runner.cjs
 * Exécution d'un seul moteur :
 *   PW_BROWSER=webkit node tests/wave2-ux-runner.cjs
 */
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const selector=process.env.PW_BROWSER;
if(selector&&!['chromium','webkit'].includes(selector)){
 console.error('PW_BROWSER doit être chromium ou webkit');process.exit(2);
}
const engines=selector?[selector]:['chromium','webkit'];
const steps=[
 {name:'Contrat statique et SHA-256 catalogue',file:'tests/wave2-ux-contract.cjs'},
 {name:'Focus et transitions isolés',file:'tests/wave2-ux-focus.cjs'},
 {name:'Orchestration et isolation des erreurs',file:'tests/wave2-ux-plan-test.cjs'},
 ...engines.map(engine=>({name:'Navigation navigateur '+engine,
   file:'tests/wave2-ux-browser.cjs',engine}))
];
let fails=0;
for(const step of steps){
 console.log('\n====== M3 : '+step.name+' ======');
 const env={...process.env};if(step.engine)env.PW_BROWSER=step.engine;
 const result=spawnSync(process.execPath,[step.file],{
  cwd:root,env,encoding:'utf8',stdio:'inherit',timeout:15*60*1000
 });
 const success=result.status===0&&!result.error;
 if(result.error)console.error('Échec du lancement : '+result.error.message);
 if(!success)fails++;
 console.log('M3 '+(success?'SUCCÈS':'ÉCHEC')+' : '+step.name);
}
console.log('\nM3 : '+(steps.length-fails)+' / '+steps.length+' étapes réussies.');
if(fails){
 console.error('RECETTE M3 INCOMPLÈTE : '+fails+' étape(s) non validée(s). Ne pas lever HOLD.');
 process.exitCode=1;
}else{
 console.log('Recette technique M3 réussie ; la validation visuelle humaine et la décision de fusion restent distinctes.');
}

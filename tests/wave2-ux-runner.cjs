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
 {name:'Projection de sauvegarde avant/après',file:'tests/wave2-ux-storage-projection-test.cjs'},
 {name:'Serveur HTTP de recette, erreurs explicites',file:'tests/wave2-ux-http-test.cjs'},
 {name:'Ressources JavaScript/CSS du navigateur',file:'tests/wave2-ux-asset-watch-test.cjs'},
 {name:'Main mobile sans contenu rogné',file:'tests/wave2-ux-reflow-check-test.cjs'},
 {name:'Rapport visuel malgré échecs et captures partielles',file:'tests/wave2-ux-visual-report-test.cjs'},
 ...engines.map(engine=>({name:'Navigation navigateur '+engine,
   file:'tests/wave2-ux-browser.cjs',engine})),
 ...engines.map(engine=>({name:'Comparaison visuelle avant/après '+engine,
   file:'tests/wave2-ux-visual.cjs',engine}))
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

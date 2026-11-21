'use strict';
// M1 : exécuter localement node tests/wave2-pedagogie-suite.cjs
// Ce fichier n'ajoute aucun step à la CI, réservé à la coordination.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const tests=[
 'wave2-pedagogie-parcours.cjs',
 'wave2-pedagogie-progressions.cjs',
 'wave2-pedagogie-cas-sef.cjs',
 'wave2-pedagogie-stress.cjs',
 'wave2-pedagogie-contre-expertise-avancee.cjs',
 'wave2-pedagogie-prerequis.cjs',
 'wave2-pedagogie-coherence.cjs',
 'wave2-pedagogie-revue-restants.cjs',
 'wave2-pedagogie-validations.cjs',
 'wave2-pedagogie-preuves.cjs',
 'wave2-pedagogie-reprise.cjs',
 'wave2-pedagogie-texas-accords.cjs',
 'wave2-pedagogie-couverture-suite.cjs',
 'wave2-pedagogie-gates-p19.cjs'
];
for(const file of tests){
 const res=spawnSync(process.execPath,[path.join(root,'tests',file)],{cwd:root,encoding:'utf8',timeout:120000});
 if(res.stdout)process.stdout.write(res.stdout);
 if(res.stderr)process.stderr.write(res.stderr);
 if(res.error||res.status!==0){console.error('FAIL '+file+(res.error?' : '+res.error.message:''));process.exit(1);}
 if(!res.stdout.includes('PASS')){console.error('FAIL '+file+' : sortie PASS absente');process.exit(1);}
}
console.log('PASS wave2-pedagogie-suite : '+tests.length+' tests successifs');

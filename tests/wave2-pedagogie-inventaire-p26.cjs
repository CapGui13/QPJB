'use strict';
// P26 : éprouver le vrai garde-fou d'inventaire sur un faux dépôt local isolé.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const coverage=fs.readFileSync(path.join(root,'tests','wave2-pedagogie-couverture-suite.cjs'),'utf8');
const suite=fs.readFileSync(path.join(root,'tests','wave2-pedagogie-suite.cjs'),'utf8');
const match=suite.match(/const tests=\[([\s\S]*?)\];/);
assert(match,'Lanceur sans inventaire');
const listed=[...match[1].matchAll(/'([^']+\.cjs)'/g)].map(x=>x[1]);
assert(listed.length>=20,'Suite raccourcie depuis P26');
assert.equal(new Set(listed).size,listed.length);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-m1-p26-'));
const testDir=path.join(dir,'tests');
try{
 fs.mkdirSync(testDir,{recursive:true});
 fs.mkdirSync(path.join(dir,'audits/wave2/pedagogie'),{recursive:true});
 fs.writeFileSync(path.join(testDir,'wave2-pedagogie-suite.cjs'),suite);
 fs.writeFileSync(path.join(testDir,'wave2-pedagogie-couverture-suite.cjs'),coverage);
 for(const f of listed){
  if(f==='wave2-pedagogie-couverture-suite.cjs')continue;
  fs.writeFileSync(path.join(testDir,f),"'use strict';\nconsole.log('PASS fixture : ' + "+JSON.stringify(f)+");\n");
 }
 const checkpoint={status:'MISSION_NON_TERMINEE_HOLD',realNodeExecution:false,
  realGitHubCIExecution:false,passedScriptNames:Array(12).fill('PASS'),
  nextSuiteScriptNames:listed.slice(0,13),tested:[{passed:12}],failed:[]};
 fs.writeFileSync(path.join(dir,'audits/wave2/pedagogie/CHECKPOINT_P18_TESTS_HOLD.json'),JSON.stringify(checkpoint));
 function run(){return spawnSync(process.execPath,[path.join(testDir,'wave2-pedagogie-couverture-suite.cjs')],{cwd:dir,encoding:'utf8',timeout:15000});}
 let result=run();
 assert.equal(result.status,0,'Un inventaire conforme doit passer : '+result.stderr);
 assert(result.stdout.includes('PASS wave2-pedagogie-couverture-suite'));
 // C'est la mutation qui passait auparavant : script nouveau NON référencé.
 const rogue='wave2-pedagogie-non-reference-p26.cjs';
 fs.writeFileSync(path.join(testDir,rogue),"'use strict';\nconsole.log('PASS rogue');\n");
 // Contre-épreuve : ôter en mémoire le garde-fou prouve l'ancien faux succès.
 const startInventory=coverage.indexOf('const filesOnDisk=fs.readdirSync(');
 const endInventory=coverage.indexOf('for(const filename of listed){');
 assert(startInventory>0&&endInventory>startInventory,'Bloc de garde du disque introuvable');
 const oldCoverage=coverage.slice(0,startInventory)+coverage.slice(endInventory);
 fs.writeFileSync(path.join(testDir,'wave2-pedagogie-couverture-suite.cjs'),oldCoverage);
 result=run();
 assert.equal(result.status,0,'L’ancienne version doit laisser passer le script oublié');
 fs.writeFileSync(path.join(testDir,'wave2-pedagogie-couverture-suite.cjs'),coverage);
 result=run();
 assert.notEqual(result.status,0,'Un test supplémentaire oublié ne doit jamais passer');
 assert(result.stderr.includes('Script')||result.stderr.includes('script')||result.stderr.includes('inventaire'),'Diagnostic non explicite pour le test oublié');
 fs.unlinkSync(path.join(testDir,rogue));
 // Un fichier hors motif ne doit pas bloquer le lanceur.
 fs.writeFileSync(path.join(testDir,'README.txt'),'fixture');
 result=run();
 assert.equal(result.status,0,'Un fichier de documentation ne doit pas bloquer : '+result.stderr);
 // Un script déclaré mais absent doit être détecté.
 const missing=listed.find(f=>f!=='wave2-pedagogie-couverture-suite.cjs');
 fs.unlinkSync(path.join(testDir,missing));
 result=run();
 assert.notEqual(result.status,0,'Un script manquant ne doit pas passer');
 fs.writeFileSync(path.join(testDir,missing),"'use strict';\nconsole.log('PASS restored');\n");
 result=run();
 assert.equal(result.status,0,'La restauration doit rétablir le PASS : '+result.stderr);
 console.log('PASS wave2-pedagogie-inventaire-p26 : '+listed.length+' scripts recensés, ancien faux succès reproduit, script oublié rejeté, absence détectée, restauration OK');
}finally{fs.rmSync(dir,{recursive:true,force:true});}

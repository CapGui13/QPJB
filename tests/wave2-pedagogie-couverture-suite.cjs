'use strict';
// M1 : test d'inventaire de la suite, sans mutation Git ni réseau.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const expected=[
'wave2-pedagogie-parcours.cjs','wave2-pedagogie-progressions.cjs',
'wave2-pedagogie-cas-sef.cjs','wave2-pedagogie-stress.cjs',
'wave2-pedagogie-contre-expertise-avancee.cjs','wave2-pedagogie-prerequis.cjs',
'wave2-pedagogie-coherence.cjs','wave2-pedagogie-revue-restants.cjs',
'wave2-pedagogie-validations.cjs','wave2-pedagogie-preuves.cjs',
'wave2-pedagogie-reprise.cjs','wave2-pedagogie-texas-accords.cjs',
'wave2-pedagogie-couverture-suite.cjs'];
const launch=fs.readFileSync(path.join(root,'tests','wave2-pedagogie-suite.cjs'),'utf8');
const match=launch.match(/const tests=\[([\s\S]*?)\];/);
assert(match,'Tableau du lanceur absent');
const listed=[...match[1].matchAll(/'([^']+\.cjs)'/g)].map(x=>x[1]);
assert.deepEqual(listed,expected,'Inventaire du lanceur modifié');
assert.equal(new Set(listed).size,13);
assert(!listed.includes('wave2-pedagogie-suite.cjs'),'Suite récursive interdite');
for(const filename of listed){
 assert(/^wave2-pedagogie-[a-z-]+\.cjs$/.test(filename));
 const src=fs.readFileSync(path.join(root,'tests',filename),'utf8');
 assert(src.startsWith("'use strict';"),'Mode strict manquant : '+filename);
 assert(src.includes('PASS'),'Marque PASS absent : '+filename);
}
const checkpoint=JSON.parse(fs.readFileSync(path.join(root,'audits/wave2/pedagogie/CHECKPOINT_P18_TESTS_HOLD.json'),'utf8'));
assert.equal(checkpoint.status,'MISSION_NON_TERMINEE_HOLD');
assert.equal(checkpoint.realNodeExecution,false);
assert.equal(checkpoint.realGitHubCIExecution,false);
assert.equal(checkpoint.passedScriptNames.length,12);
assert.deepEqual(checkpoint.nextSuiteScriptNames,expected);
assert.equal(checkpoint.tested.reduce((n,g)=>n+g.passed,0),12);
assert.equal(checkpoint.failed.length,0);
console.log('PASS wave2-pedagogie-couverture-suite : 13 scripts déclarés, 12 exécutés en JS isolé, Node/CI non attestés');

'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const p=read('audits/wave2/pedagogie/PREUVES_SEF_P15_HOLD.json'),reg=read('audits/wave2/pedagogie/ARBITRAGES_P14_HOLD.json');
assert.equal(p.status,'HOLD_HUMAN_APPROVAL_REQUIRED');
assert.equal(p.sourceChecks.length,11);
assert.deepEqual(p.sourceChecks.map(x=>x.id),reg.agreements.map(x=>x.id));
assert.deepEqual(p.summary,{
 SOURCE_EXPLICITE_CADRE:6,SOURCE_PARTIELLE_CONVENTION:2,
 ACCORD_LOCAL_NON_UNIVERSEL:2,SOURCE_NON_CONCORDANTE_A_ARBITRER:1
});
for(const c of p.sourceChecks){
 assert.equal(c.reviewStatus,'HOLD_NEEDS_REFERENT');
 assert.equal(c.answerUnchanged,true);
 assert(c.finding.length>10&&c.caveat.length>10);
 if(c.tier==='ACCORD_LOCAL_NON_UNIVERSEL')assert.equal(c.source,null);
 else assert(c.source&&c.source.startsWith('https://'));
}
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const found=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);assert(found);
const data=JSON.parse(found[1]),texas=data.exercises.find(x=>x.id==='SEF-L25-004');assert(texas);
assert.deepEqual(texas.hand[2],['A','D','8','4']);
assert.equal(texas.hand[1].length,2);assert.equal(texas.answer,'Passe');
assert.equal(p.criticalExample.id,texas.id);
assert.equal(p.criticalExample.notProvedWrong,true);
// Simulation d'une levée HOLD non autorisée : elle doit différer de l'original figé.
const fake=structuredClone(p);fake.status='APPROVED';assert.notEqual(fake.status,p.status);
console.log('PASS wave2-pedagogie-preuves : 11 sources classées, Texas ♦AD84 discordant avec une variante, HOLD intact');

'use strict';
// Vérification en lecture seule : ne jamais publier ou écrire dans main.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const htmlPath='preview/v2-eleve/parcours-sef-65-r1.html';
const bytes=fs.readFileSync(path.join(root,htmlPath));
const sha=crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(sha,'4edc289dfa6d1e929e6985985152321adf8edb342923b4fadc061405aef386b6');
assert.equal(bytes.length,1937683);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal(index.split('id="qpjb-v2-quizz-entry"').length,2);
assert.equal(index.split('href="./'+htmlPath+'"').length,2);
assert.ok(!index.includes('qpjb-v2-preview-entry'));
assert.match(index,/#vquizz\.is-session #qpjb-v2-quizz-entry\{display:none\}/);
const original=index
 .replace('#vquizz.is-session #qpjb-v2-quizz-entry{display:none}\n','')
 .replace(/  <div id="qpjb-v2-quizz-entry"[\s\S]*?(?=  <div id="quizz-frame-wrap">)/,'');
const ob=Buffer.from(original);
const baseline=crypto.createHash('sha1').update('blob '+ob.length+'\0').update(ob).digest('hex');
assert.equal(baseline,'a7bdd7f9f3eb67d4d1f42d5b065e548a97a20065','Accueil modifié hors opt-in');
const file=bytes.toString('utf8');
assert.match(file,/<meta name="robots" content="noindex,nofollow">/);
assert.ok(!file.includes('qpjb-preview-v2-eleve-01')&&!file.includes('qpjb-preview-v2-eleve-02-hold'));
const m='<script id="ay-payload" type="application/json">',start=file.indexOf(m),end=file.indexOf('</script>',start+m.length);
assert.ok(start>=0&&end>start);
const d=JSON.parse(file.slice(start+m.length,end));
assert.equal(d.catalog.length,1523);assert.equal(d.addons.length,0);
assert.equal(d.releaseDecision,'HOLD');assert.equal(d.editorialApproval,'APPROVED_BY_USER');
assert.equal(d.candidatePublished,false);
assert.equal(d.candidateVersion,'QPJB-V2-65-19A-20261120-R1');
const gambling=d.catalog.find(x=>x.id==='SEF-L06-029');
assert.equal(gambling.theme,'sa');assert.equal(gambling.answer,'4♦');
assert.match(file,/barrage:gambling_3sa_passe_corrige/);
console.log('QPJB V2 INTEGRATION GUARD PASS : HTML R1 exact, index opt-in, 1523 QCM, HOLD');

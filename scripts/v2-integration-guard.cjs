'use strict';
// Vérification en lecture seule : ne jamais publier ou écrire dans main.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const htmlPath='preview/v2-eleve/parcours-sef-65-r1.html';
const bytes=fs.readFileSync(path.join(root,htmlPath));
// La V2 a recu ensuite ses propres modifications d'ergonomie (#221 et #222).
// La proteger par le SHA Git du fichier public reel, non par les anciennes
// substitutions de texte issues de la release #217.
const blobSha=crypto.createHash('sha1')
 .update('blob '+bytes.length+String.fromCharCode(0)).update(bytes).digest('hex');
assert.equal(blobSha,'12095819f58980163b4d79d31e7b7f3c1575ea9b',
 'Archive V2 modifiee : analyse pedagogique et migration requises avant alteration');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(!index.includes('qpjb-v2-quizz-entry'),'V2 absente de la navigation');
assert.ok(!index.includes('href="./'+htmlPath+'"'),'Lien de la V2 retire');
assert.ok(!index.includes('qpjb-v2-preview-entry'));
assert.match(index,/href="\.\/quizz\.html"/,'Bouton Quizz inchange');
assert.match(index,/id="quizz-frame"/,'Iframe du quiz preservee');
// Do not freeze the whole V1 homepage: presentation is allowed to evolve.
// Preserve the actual routing contract, plus the immutable V2 archive above.
assert.ok(!/preview\/v2-eleve\//i.test(index),'Aucun accès à la préversion V2 dans l’accueil');
assert.equal((index.match(/id="quizz-frame"/g)||[]).length,1,'Iframe V1 unique');
assert.equal((index.match(/href="\.\/quizz\.html"/g)||[]).length,1,'Entrée Quiz V1 unique');
const file=bytes.toString('utf8');
assert.match(file,/<meta name="robots" content="noindex,nofollow">/);
assert.ok(!file.includes('qpjb-preview-v2-eleve-01')&&!file.includes('qpjb-preview-v2-eleve-02-hold'));
const m='<script id="ay-payload" type="application/json">',start=file.indexOf(m),end=file.indexOf('</script>',start+m.length);
assert.ok(start>=0&&end>start);
const d=JSON.parse(file.slice(start+m.length,end));
assert.equal(d.catalog.length,1523);assert.equal(d.addons.length,0);
assert.equal(d.releaseDecision,'PUBLISHED');assert.equal(d.candidatePublished,true);assert.equal(d.editorialApproval,'APPROVED_BY_USER');
assert.equal(d.candidateVersion,'QPJB-V2-65-19A-20261120-R1');
const gambling=d.catalog.find(x=>x.id==='SEF-L06-029');
assert.equal(gambling.theme,'sa');assert.equal(gambling.answer,'4♦');
assert.match(file,/barrage:gambling_3sa_passe_corrige/);
console.log('QPJB V1 ENTRY PASS : navigation unique V1, 1523 QCM et archive V2 preserves');

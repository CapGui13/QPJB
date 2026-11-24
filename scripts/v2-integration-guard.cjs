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
const original=index;
const ob=Buffer.from(original);
const baseline=crypto.createHash('sha1').update('blob '+ob.length+'\0').update(ob).digest('hex');
// Référence approuvée : réorganisation des séances en trois groupes (PR #292).
// Les contrôles de navigation V1 et d'intégrité de l'archive V2 restent identiques.
assert.equal(baseline,'ce88eb1e28788d9d0b9256a65028d7b51f5cd635','Accueil modifié hors opt-in');
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

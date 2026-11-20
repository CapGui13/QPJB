'use strict';
// Vérification en lecture seule : ne jamais publier ou écrire dans main.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const htmlPath='preview/v2-eleve/parcours-sef-65-r1.html';
const bytes=fs.readFileSync(path.join(root,htmlPath));
// Vérifier qu'après annulation des seules mentions de diffusion, le contenu
// est strictement identique au candidat pédagogique R1 déjà testé.
const substitutions=[
 [
  "QPJB — Parcours guidé 65 séances · pédagogie validée · publication HOLD",
  "QPJB — Parcours guidé SEF · 65 séances"
 ],
 [
  "PARCOURS V2 — CANDIDAT PRIVÉ, 19 DÉCISIONS VALIDÉES — PAS ENCORE PUBLIÉ.",
  "PARCOURS GUIDÉ SEF — 65 SÉANCES · 19 DÉCISIONS PÉDAGOGIQUES VALIDÉES."
 ],
 [
  "Aperçu privé NON PUBLIÉ · 1 523 QCM SEF (3 corrections validées) · sauvegarde isolée. Aucun cours écrit, aucun ajout expérimental. Les 19 décisions pédagogiques sont validées. Publication toujours non autorisée.",
  "Parcours guidé SEF · 1 523 QCM source · 65 séances · sauvegarde locale indépendante et exportable. Les 19 décisions pédagogiques sont validées."
 ],
 [
  "\"releaseDecision\":\"HOLD\"",
  "\"releaseDecision\":\"PUBLISHED\""
 ],
 [
  "\"candidatePublished\":false",
  "\"candidatePublished\":true"
 ],
 [
  "Parcours SEF · projet éditorial HOLD",
  "Parcours guidé SEF · 65 séances"
 ],
 [
  "Question du catalogue de test (HOLD)",
  "Question du Quiz SEF"
 ],
 [
  "CANDIDAT PRIVÉ V2 : 19 décisions validées. 65 séances, 1 523 QCM, 0 ajout. Sauvegarde versionnée et exportable. Aucun déploiement ni changement du Quiz SEF public.",
  "PARCOURS GUIDÉ V2 : 65 séances, 1 523 QCM source, aucune question expérimentale. Sauvegarde indépendante, versionnée et exportable. Quiz SEF classique inchangé."
 ]
];
let canonical=bytes.toString('utf8');
for(const [avant,apres] of substitutions){
 assert.equal(canonical.split(apres).length,2,'Mention manquante ou dupliquée: '+apres.slice(0,40));
 canonical=canonical.replace(apres,avant);
}
const original=Buffer.from(canonical,'utf8');
assert.equal(original.length,1937683);
assert.equal(crypto.createHash('sha256').update(original).digest('hex'),
 '4edc289dfa6d1e929e6985985152321adf8edb342923b4fadc061405aef386b6');
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
assert.equal(d.releaseDecision,'PUBLISHED');assert.equal(d.candidatePublished,true);assert.equal(d.editorialApproval,'APPROVED_BY_USER');
assert.equal(d.candidatePublished,false);
assert.equal(d.candidateVersion,'QPJB-V2-65-19A-20261120-R1');
const gambling=d.catalog.find(x=>x.id==='SEF-L06-029');
assert.equal(gambling.theme,'sa');assert.equal(gambling.answer,'4♦');
assert.match(file,/barrage:gambling_3sa_passe_corrige/);
console.log('QPJB V2 RELEASE GUARD PASS : contenu R1 inchange, accueil preserve, 1523 QCM, public');

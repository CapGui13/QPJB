'use strict';
// Génère un fichier HTML autonome depuis la simulation AY déjà produite.
// L'outil n'écrit jamais dans quizz.html, dans le Quiz SEF ni dans les sauvegardes.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'artifacts/v2-ay');
const json=fs.readFileSync(path.join(dir,'parcours-intercale-ay.json'),'utf8');
const report=JSON.parse(json);
assert.equal(report.schema,'QPJB_V2_AY_INTERLEAVED_PREVIEW_1');
assert.equal(report.quizSEFCatalogCount,1523);
assert.equal(report.changeToSEF,0);
assert.equal(report.releaseDecision,'HOLD');
assert.equal(report.output.length,3);
for(const x of report.output){
  assert.equal(x.baselineSessions.length,65);
  for(const variant of ['mode7','mode8']){
    const sessions=x[variant].sessions;
    assert.equal(sessions.length,65);
    assert.ok(sessions.every(s=>s.questions.length===10));
    assert.equal(x[variant].supplementalJournal.length,variant==='mode7'?7:8);
  }
}
const template=fs.readFileSync(path.join(root,'templates/parcours-v2-extension-ay.html'),'utf8');
const sentinel='__AY_DATA__';
assert.equal(template.split(sentinel).length,2,'Marqueur JSON manquant ou répété');
const escaped=JSON.stringify(report).replace(/</g,'\\u003c').replace(/&/g,'\\u0026');
const html=template.replace(sentinel,escaped);
assert.ok(!html.includes(sentinel));
const match=html.match(/<script type="application\/json" id="dataset">([\s\S]*?)<\/script>/);
assert.ok(match);
assert.deepEqual(JSON.parse(match[1]),report);
const tags=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(tags.length,2);
new vm.Script(tags[1][1],{filename:'parcours-v2-extension-ay.html'});
const out=path.join(dir,'QPJB_V2_AY_Parcours_65_Seances.html');
fs.writeFileSync(out,html,'utf8');
console.log('QPJB-AY-PACK PASS 65 sessions x 3 profiles x 3 modes, HTML validé : '+path.basename(out));

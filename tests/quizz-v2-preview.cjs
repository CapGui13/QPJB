'use strict';
// QPJB V2-H — prévisualisation autonome de la PR, isolée du site public.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'preview/parcours-v2-autonome.html'),'utf8');
const originalHtml=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const sourceTag='<script id="training-data" type="application/json">';
const start=originalHtml.indexOf(sourceTag);
const end=originalHtml.indexOf('</script>',start+sourceTag.length);
assert.ok(start>=0&&end>start);
const original=JSON.parse(originalHtml.slice(start+sourceTag.length,end)).exercises;
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .map(([,attrs,body])=>({attrs,body}));
assert.equal(scripts.length,7,'4 sources JSON + 3 scripts autonomes');
const sources={};
for(const {attrs,body} of scripts){
  const match=attrs.match(/\bid="([^"]+)"/);
  if(match)sources[match[1]]=body;
}
for(const id of ['catalog-data','sa-data','stayman-data','review-flags'])
  assert.ok(sources[id]);
const data=JSON.parse(sources['catalog-data']);
const sa=JSON.parse(sources['sa-data']);
const stayman=JSON.parse(sources['stayman-data']);
const flags=JSON.parse(sources['review-flags']);
assert.equal(data.length,1523);
assert.equal(original.length,1523);
assert.equal(sa.assignments.length,14);
assert.equal(stayman.assignments.length,65);
assert.equal(flags.length,19);
const byId=new Map(original.map(q=>[q.id,q]));
const previewIds=new Set();
for(const q of data){
  assert.ok(byId.has(q.id),'ID de QCM réellement existant: '+q.id);
  assert.ok(!previewIds.has(q.id),'Aucune duplication');
  previewIds.add(q.id);
  const o=byId.get(q.id);
  for(const field of ['theme','answer','choices','context','auction','hand',
    'h','difficulty','explain'])
    assert.deepEqual(q[field],o[field],'Source originale inchangée '+q.id+' '+field);
  assert.equal(q.caseFamily,o.caseFamily||o.id);
  assert.ok(q.choices.includes(q.answer),'Réponse dans les choix');
}
for(const [id,note] of flags){
  assert.ok(byId.has(id),'Cas sensible doit exister');
  assert.ok(typeof note==='string'&&note.length>15);
}
assert.ok(!/\blocalStorage\b|\bsessionStorage\b|\bfetch\s*\(|XMLHttpRequest/.test(html),
  'Aucun stockage persistant ni requête réseau dans le prototype');

let listener=null;
const app={innerHTML:''};
const nodes=Object.fromEntries(Object.entries(sources).map(([id,textContent])=>
  [id,{textContent}]));
const nav=()=>({setAttribute(){}});
const document={
  getElementById:id=>id==='app'?app:nodes[id]||nav(),
  addEventListener:(type,callback)=>{if(type==='click')listener=callback}
};
const window={};
const sandbox=vm.createContext({window,document,console});
for(const script of scripts.filter(s=>!s.attrs.includes('application/json'))){
  vm.runInContext(script.body,sandbox,{timeout:60000});
}
assert.ok(window.QPJBParcours);
assert.ok(window.PreviewPilot);
assert.equal(window.PreviewPilot.loadCatalog().length,1523);
assert.equal(window.PreviewPilot.loadAnnotations().size,79);
assert.ok(app.innerHTML.includes('Un laboratoire pour tester'));
assert.ok(typeof listener==='function');
function click(action,choice,index){
  listener({target:{closest:()=>({dataset:{action,choice,index},disabled:false})}});
}
click('start');
assert.match(app.innerHTML,/Question 1 sur 10/);
for(let j=0;j<10;j++){
  click('answer','0');
  assert.ok(app.innerHTML.includes('Réponse du catalogue'));
  click('next');
}
assert.match(app.innerHTML,/Bilan de la séance 1/);
click('start');
assert.match(app.innerHTML,/Séance fictive 2/);
click('review-open');
assert.match(app.innerHTML,/Revue pédagogique — 19 cas signalés/);
click('review-select',undefined,'2');
assert.ok(app.innerHTML.includes('SEF-V416-008'));
click('review-answer','0');
assert.ok(app.innerHTML.includes('Réponse du catalogue'));
click('reset');
assert.ok(app.innerHTML.includes('Un laboratoire pour tester'));
console.log('PARCOURS V2 PREVIEW PASS — 1523/1523 identités conservées, 79 micro-propositions, 19 cas signalés, navigation et QCM fonctionnels, zéro stockage');

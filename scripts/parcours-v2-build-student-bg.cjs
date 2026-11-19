'use strict';
// QPJB BG : page élève SEF autonome, séparée du laboratoire AZ.
// Zéro supplément AY embarqué ; toutes les autres pages et sauvegardes restent intactes.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const AZ=require('./parcours-v2-ay-live-build.cjs');
const ROOT=path.resolve(__dirname,'..');
const target='preview/v2-eleve/parcours-sef-65.html';
function once(s,needle,replacement){
 assert.equal(s.split(needle).length,2,'Ancre absente ou répétée : '+needle.slice(0,90));
 return s.replace(needle,replacement);
}
function studentHtml(html){
 const source='<script id="ay-payload" type="application/json">';
 const begin=html.indexOf(source);
 assert.ok(begin>=0,'Données AZ introuvables');
 const start=begin+source.length,end=html.indexOf('</script>',start);
 assert.ok(end>start,'Fin des données absente');
 const payload=JSON.parse(html.slice(start,end));
 assert.equal(payload.catalog.length,1523);
 assert.equal(payload.addons.length,8);
 assert.equal(payload.releaseDecision,'HOLD');
 assert.equal(payload.sourceModified,false);
 const student={...payload,schema:'QPJB_V2_BG_STUDENT_PREVIEW_1',addons:[]};
 const json=JSON.stringify(student).replace(/</g,'\\u003c').replace(/&/g,'\\u0026');
 html=html.slice(0,start)+json+html.slice(end);
 html=once(html,
  "const STUDENT_ONLY=new URLSearchParams(location.search).get('mode')==='eleve';",
  'const STUDENT_ONLY=true;');
 html=once(html,
  '<title>QPJB — Parcours guidé AZ, prototype adaptatif privé</title>',
  '<title>QPJB — Parcours guidé SEF, 65 séances (aperçu privé)</title>');
 html=once(html,
  '<div class="pill">Aperçu AZ — HORS PRODUCTION</div>',
  '<div class="pill">Aperçu privé SEF — HORS PRODUCTION</div>');
 html=once(html,
  '<h1>Parcours guidé adaptatif QPJB</h1>',
  '<h1>Parcours guidé SEF — 65 séances</h1>');
 html=once(html,
  '65 séances de 10 QCM SEF par défaut, avec rappels adaptés à tes réponses.\nLes 7 ou 8 situations complémentaires ne sont proposées que dans les modes expérimentaux, sans toucher à ta progression QPJB.',
  '65 séances de 10 QCM SEF avec rappels adaptés à tes réponses. Ce fichier ne contient aucun des huit exercices complémentaires non validés.');
 html=once(html,
  'Essai privé non publié · les compléments AY ne sont pas encore approuvés pédagogiquement · aucune connexion réseau requise.\nLa sauvegarde, lorsqu\'elle fonctionne, est limitée au navigateur où ce prototype est ouvert. Elle ne se synchronise pas avec le site.',
  'Aperçu privé non publié · 1 523 QCM SEF originaux · sauvegarde locale indépendante. Aucun cours écrit, aucun ajout expérimental. Les accords des 19 cas sensibles attendent encore validation pédagogique.');
 const scripts=[...html.matchAll(/<script(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/script>/g)];
 assert.equal(scripts.length,5,'HTML autonome incomplet');
 for(const item of scripts.slice(1))new vm.Script(item[1]);
 const actual=JSON.parse(html.slice(html.indexOf(source)+source.length,
   html.indexOf('</script>',html.indexOf(source)+source.length)));
 assert.equal(actual.addons.length,0,'Un supplément ne doit jamais être embarqué');
 assert.equal(actual.catalog.length,1523);
 assert.ok(html.includes('const STUDENT_ONLY=true;'));
 assert.ok(!html.includes('Les 7 ou 8 situations complémentaires'));
 return html;
}
function build(){
 const az=AZ.build();
 const html=studentHtml(fs.readFileSync(az.output,'utf8'));
 const out=path.join(ROOT,'artifacts/v2-bg');
 fs.mkdirSync(out,{recursive:true});
 const output=path.join(out,'QPJB_V2_BG_Parcours_SEF_65.html');
 fs.writeFileSync(output,html,'utf8');
 const manifest={schema:'QPJB_V2_BG_STUDENT_PREVIEW_1',
  catalog:1523,addons:0,sessions:65,questionsPerSession:10,
  storageKey:'qpjb-preview-v2-eleve-01',
  releaseDecision:'HOLD',teacherApproval:false,sitePublished:false,
  sha256:crypto.createHash('sha256').update(html).digest('hex'),
  sizeBytes:Buffer.byteLength(html),versionedPath:target};
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log('QPJB-BG-BUILD '+JSON.stringify(manifest));
 return {output,html,manifest};
}
module.exports={studentHtml,build,target};
if(require.main===module)build();

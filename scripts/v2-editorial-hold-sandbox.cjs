'use strict';
// Fabrication privée d'un aperçu éditorial HOLD des 65 séances.
// JAMAIS de changement de quizz.html, du site, ni de sauvegarde V2 existante.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const root=path.resolve(__dirname,'..');
const sourceRoot=path.resolve(root,process.env.QPJB_V2_SOURCE_DIR||'source-v2');
const sourceFile=path.join(sourceRoot,'preview/v2-eleve/parcours-sef-65.html');
const sourceHash='c478dd2d24c13e2e706cbdc168b7a822258f9fe1c09c65cf44cb75516c29d879';
const publicBlob='dfd1f21dfc3c2256b066b36b777c437d2973e895';
const oldKey='qpjb-preview-v2-eleve-01';
const newKey='qpjb-preview-v2-eleve-02-hold';
const holdFile='Docs/PARCOURS_V2_CORRECTIONS_4_QCM_HOLD_20261120.json';
const block='<script id="ay-payload" type="application/json">';
const quizBlock='<script id="training-data" type="application/json">';
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const parseBlock=(s,mark)=>{
 const a=s.indexOf(mark);
 assert.ok(a>=0&&s.indexOf(mark,a+mark.length)===-1,'Marqueur absent ou répété : '+mark);
 const b=s.indexOf('</script>',a+mark.length);
 assert.ok(b>a,'Balise JSON non refermée : '+mark);
 return {value:JSON.parse(s.slice(a+mark.length,b)),begin:a+mark.length,end:b};
};
const single=(s,search,replace)=>{
 assert.equal(s.split(search).length,2,'Remplacement non unique : '+search.slice(0,60));
 return s.replace(search,replace);
};
function build(){
 const publicHtml=fs.readFileSync(path.join(root,'quizz.html'));
 const actualBlob=crypto.createHash('sha1').update('blob '+publicHtml.length+'\0')
   .update(publicHtml).digest('hex');
 assert.equal(actualBlob,publicBlob,'Le Quiz SEF public épinglé a changé');
 const publicCatalog=parseBlock(publicHtml.toString('utf8'),quizBlock).value.exercises;
 assert.equal(publicCatalog.length,1523);

 const sourceBytes=fs.readFileSync(sourceFile);
 assert.equal(sha256(sourceBytes),sourceHash,'Aperçu original V2 différent du fichier approuvé techniquement');
 const originalHtml=sourceBytes.toString('utf8');
 assert.ok(originalHtml.includes('const STUDENT_ONLY=true;'));
 assert.ok(originalHtml.includes('const MAX_SESSIONS=65;'));
 assert.equal(originalHtml.split(oldKey).length,2,'Clé de sauvegarde source inattendue');
 assert.ok(!originalHtml.includes(newKey));

 const {value:payload,begin,end}=parseBlock(originalHtml,block);
 assert.equal(payload.schema,'QPJB_V2_BG_STUDENT_PREVIEW_1');
 assert.equal(payload.catalog.length,1523);
 assert.deepEqual(payload.catalog,publicCatalog,'Le catalogue original ne correspond plus à main');
 assert.deepEqual(payload.addons,[]);
 assert.equal(payload.sourceModified,false);
 assert.equal(payload.releaseDecision,'HOLD');
 const review=JSON.parse(fs.readFileSync(path.join(root,holdFile),'utf8'));
 assert.equal(review.publicReferenceCommit,'a0ffaed6e49ab7259de800773a4ee384be755339');
 assert.equal(review.schema,'QPJB_V2_EDITORIAL_PATCH_PROPOSAL_1');
 assert.equal(review.sourceEdited,false);
 assert.equal(review.approved,false);
 assert.equal(review.releaseDecision,'HOLD');
 assert.equal(review.sourceQuestionCount,1523);
 assert.equal(review.proposedPatches.length,4);

 const permitted=new Map([
  ['SEF-V416-008',['answer','choices','context','explain']],
  ['SEF-V416-009',['answer','choices','context','explain']],
  ['SEF-L25-007',['explain']],
  ['SEF-L06-029',[]]
 ]);
 const changes=new Map();
 const originalById=new Map(publicCatalog.map(x=>[x.id,x]));
 for(const entry of review.proposedPatches){
   assert.ok(permitted.has(entry.id),'QCM hors périmètre : '+entry.id);
   assert.ok(!changes.has(entry.id),'QCM en double');
   assert.equal(entry.editorialApproval,'PENDING');
   const orig=originalById.get(entry.id);
   assert.ok(orig,'QCM original introuvable');
   assert.equal(sha256(JSON.stringify(orig)),entry.originalQuestionSHA256,
     'Empreinte source inattendue : '+entry.id);
   assert.deepEqual(Object.keys(entry.proposedChanges).sort(),permitted.get(entry.id).slice().sort());
   assert.deepEqual(entry.affectedFields.slice().sort(),permitted.get(entry.id).slice().sort());
   changes.set(entry.id,entry.proposedChanges);
 }
 assert.deepEqual([...changes.keys()].sort(),[...permitted.keys()].sort());
 assert.equal(review.proposedClassification.id,'SEF-L06-029');
 assert.equal(review.proposedClassification.sourceThemeUnchanged,'sa');
 assert.equal(review.proposedClassification.editorialApproval,'PENDING');
 const proposedCatalog=publicCatalog.map(orig=>{
  const delta=changes.get(orig.id);
  return delta?{...orig,...delta}:orig;
 });
 assert.equal(proposedCatalog.length,1523);
 assert.equal(new Set(proposedCatalog.map(x=>x.id)).size,1523);
 const modified=[];
 for(let n=0;n<publicCatalog.length;n++){
  const before=publicCatalog[n],after=proposedCatalog[n];
  assert.equal(before.id,after.id);
  assert.deepEqual(before.hand,after.hand,'Main modifiée : '+after.id);
  assert.deepEqual(before.auction,after.auction,'Enchères modifiées : '+after.id);
  assert.equal(before.theme,after.theme,'Thème modifié : '+after.id);
  assert.equal(before.h,after.h,'Points modifiés : '+after.id);
  assert.ok(after.choices.includes(after.answer),'Bonne réponse absente : '+after.id);
  assert.equal(new Set(after.choices).size,after.choices.length);
  if(!same(before,after))modified.push(after.id);
 }
 assert.deepEqual(modified.slice().sort(),['SEF-L25-007','SEF-V416-008','SEF-V416-009'].sort());
 assert.deepEqual(review.hypotheticalModifiedIDs.slice().sort(),modified.slice().sort());

 // Isoler les sauvegardes : jamais de copie ni lecture de l'ancienne clé,
 // même pour une séance partiellement corrigée.
 const draftPayload={...payload,catalog:proposedCatalog,sourceModified:true,
   editorialApproval:'PENDING',releaseDecision:'HOLD',
   editorialPatchPreview:true,editorialPatchIDs:modified};
 const json=JSON.stringify(draftPayload).replace(/</g,'\\u003c');
 let html=originalHtml.slice(0,begin)+json+originalHtml.slice(end);
 html=single(html,oldKey,newKey);
 html=single(html,
   '<title>QPJB — Parcours guidé SEF, 65 séances (aperçu privé)</title>',
   '<title>QPJB — Parcours guidé 65 séances · corrections NON VALIDÉES · HOLD</title>\n<meta name="robots" content="noindex,nofollow">');
 html=single(html,'<body>',
   '<body><div role="alert" style="position:relative;z-index:9999;padding:18px 24px;background:#fff0c7;border-bottom:3px solid #ba7b15;color:#352307;font:700 17px/1.5 system-ui;text-align:center">'
   +'PROTOTYPE ÉDITORIAL — CORRECTIONS NON VALIDÉES — NE PAS DISTRIBUER AUX ÉLÈVES. '
   +'Sauvegarde séparée : aucune reprise ni suppression de l’ancien parcours.</div>');
 html=single(html,
   'Correspondance avec le corrigé d’origine',
   'Correspondance avec le corrigé proposé dans cet aperçu');
 html=single(html,
   'Réponse différente du corrigé d’origine',
   'Réponse différente du corrigé proposé dans cet aperçu');
 html=single(html,'Réponse publiée : <b>','Réponse de cet aperçu : <b>');
 html=single(html,'Question du Quiz SEF','Question du catalogue de test (HOLD)');
 html=single(html,
  'Parcours SEF · aperçu privé',
  'Parcours SEF · projet éditorial HOLD');
 html=single(html,
  'Aperçu privé du parcours SEF uniquement · aucune publication · sauvegarde locale propre à cet essai. Le Quiz classique, V2-F et les autres tests ne sont pas modifiés.',
  'PROTOTYPE ÉDITORIAL NON VALIDÉ. 3 QCM seraient modifiés ; les 1 523 identifiants sont conservés. Sauvegarde isolée V2 02-hold ; aucune publication et aucun changement de V1/V2-F ni du Quiz public.');
 html=single(html,
  'Aperçu privé non publié · 1 523 QCM SEF originaux · sauvegarde locale indépendante.',
  'Aperçu privé NON VALIDÉ · 1 523 QCM SEF (3 propositions modifiées) · sauvegarde isolée.');
 // Test final depuis le HTML livré, et non uniquement depuis les objets en mémoire.
 const parsed=parseBlock(html,block).value;
 assert.deepEqual(parsed.catalog,proposedCatalog);
 assert.equal(parsed.sourceModified,true);
 assert.equal(parsed.releaseDecision,'HOLD');
 assert.equal(parsed.editorialApproval,'PENDING');
 assert.equal(parsed.editorialPatchPreview,true);
 assert.deepEqual(parsed.addons,[]);
 assert.equal(html.split(newKey).length,2);
 assert.ok(!html.includes(oldKey),'L’ancienne clé de sauvegarde doit être absente');
 assert.ok(html.includes('const STUDENT_ONLY=true;'));
 assert.ok(html.includes('const MAX_SESSIONS=65;'));
 assert.ok(html.includes('noindex,nofollow'));
 assert.ok(html.includes('PROTOTYPE ÉDITORIAL — CORRECTIONS NON VALIDÉES'));
 assert.ok(!html.includes('Réponse publiée :'));
 const dir=path.join(root,'artifacts/v2-editorial-hold-private');
 fs.mkdirSync(dir,{recursive:true});
 const filename='QPJB_V2_65_SEANCES_CORRECTIONS_PROPOSEES_HOLD.html';
 const bytes=Buffer.from(html,'utf8');
 fs.writeFileSync(path.join(dir,filename),bytes);
 const manifest={schema:'QPJB_V2_EDITORIAL_SANDBOX_1',status:'HOLD',approved:false,
   published:false,originalPublicQcmSourceUnchanged:true,
   originalPreviewSHA256:sourceHash,
   proposedQcmModified:modified,previewQuestionCount:1523,
   previewSessions:65,storageKey:newKey,priorStorageKeyPreserved:oldKey,
   oldSaveAutoImported:false,filename,htmlBytes:bytes.length,sha256:sha256(bytes)};
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('QPJB EDITORIAL HOLD PREVIEW VALIDATED '+JSON.stringify(manifest));
}
build();

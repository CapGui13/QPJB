'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const input=path.join(root,'artifacts/v2-editorial-hold-private/QPJB_V2_65_SEANCES_CORRECTIONS_PROPOSEES_HOLD.html');
const outputDir=path.join(root,'artifacts/v2-pedagogy-candidate-private');
const filename='QPJB_V2_65_SEANCES_CANDIDAT_PEDAGOGIQUE.html';
const version='QPJB-V2-65-19A-20261120-R1',key='qpjb-v2-eleve-65-pedago-r1';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const approved=JSON.parse(fs.readFileSync(path.join(root,'audits/references/v2/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json')));
assert.equal(approved.caseDecisions.length,19);
assert.equal(new Set(approved.caseDecisions.map(x=>x.id)).size,19);
assert.ok(approved.caseDecisions.every(x=>x.approval==='APPROVED_BY_USER'));
assert.equal(approved.approvedForPublication,false);
const bytes=fs.readFileSync(input);
assert.equal(hash(bytes),'c646f7b9f8ffb1b66d2d924ee60ce580499ce5a7e4c622c93c9af06d1dbe7531');
let html=bytes.toString('utf8');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Ancre manquante '+a.slice(0,65));return s.replace(a,b)};
const metadata='<script id="ay-payload" type="application/json">';
let a=html.indexOf(metadata),b=html.indexOf('</script>',a+metadata.length);
const payload=JSON.parse(html.slice(a+metadata.length,b));
assert.equal(payload.catalog.length,1523);
assert.equal(payload.releaseDecision,'HOLD');
assert.equal(payload.editorialApproval,'APPROVED_BY_USER');
assert.equal(payload.catalog.find(x=>x.id==='SEF-L06-029').theme,'sa');
assert.equal(payload.catalog.find(x=>x.id==='SEF-L06-029').answer,'4♦');
payload.candidateVersion=version;
payload.candidatePublished=false;
html=html.slice(0,a+metadata.length)+JSON.stringify(payload).replace(/</g,'\\u003c')+html.slice(b);
html=once(html,'qpjb-preview-v2-eleve-02-hold',key);
html=once(html,'PROTOTYPE ÉDITORIAL — CORRECTIONS VALIDÉES — PUBLICATION NON AUTORISÉE.',
 'PARCOURS V2 — CANDIDAT PRIVÉ, 19 DÉCISIONS VALIDÉES — PAS ENCORE PUBLIÉ.');
html=once(html,'Les accords des 19 cas sensibles attendent encore validation pédagogique.',
 'Les 19 décisions pédagogiques sont validées. Publication toujours non autorisée.');
html=once(html,'<a id="az-return-v1" href="../../quizz.html?v2preview=1" style="display:inline-block;margin:0 0 12px;font-weight:700;color:#155c8a;">← Retour au Quiz classique (prévisualisation)</a>',
 '<div class="hint">Fichier autonome hors ligne. Aucun lien trompeur vers le site public.</div>');
html=once(html,'const MAX_SESSIONS=65;', 'const MAX_SESSIONS=65;\nconst CONTENT_VERSION="'+version+'";');
html=once(html,'return {schema:1,model:mode,engineState:state,current:null,',
 'return {schema:2,contentVersion:CONTENT_VERSION,model:mode,engineState:state,current:null,');
html=once(html,'if(!v||v.schema!==1||!Object.prototype.hasOwnProperty.call(MODELS,v.model)||',
 'if(!v||v.schema!==2||v.contentVersion!==CONTENT_VERSION||!Object.prototype.hasOwnProperty.call(MODELS,v.model)||');
html=once(html,' if(incompatibleSave)return false;\n try{localStorage.setItem(STORAGE,JSON.stringify(record));',
 ' if(incompatibleSave||!record||record.schema!==2||record.contentVersion!==CONTENT_VERSION)return false;\n try{localStorage.setItem(STORAGE,JSON.stringify(record));');
const before="const F=window.AYEngine;";
const after="const F=window.AYEngine;\n"+
"// Vue pédagogique V2 : ni le thème ni les données du Quiz original ne changent.\n"+
"const oldLoad=F.loadAnnotations,oldSelect=F.select,oldRecord=F.recordSession;\n"+
"F.loadAnnotations=function(){const a=oldLoad(),x=a.get('SEF-L06-029');\n"+
" if(!x||x.concept!=='sa:gambling_3sa_passe_corrige'||x.stage!==5)throw Error('Gambling inconnu');\n"+
" a.set('SEF-L06-029',{...x,concept:'barrage:gambling_3sa_passe_corrige'});return a;};\n"+
"const mapTheme=q=>q.id==='SEF-L06-029'?{...q,theme:'barrage'}:q;\n"+
"F.select=function(c,s,a,n){return oldSelect(c.map(mapTheme),s,a,n)};\n"+
"F.recordSession=function(s,c,ans,a){return oldRecord(s,c.map(mapTheme),ans,a)};";
html=once(html,before,after);
html=once(html,'PROTOTYPE ÉDITORIAL VALIDÉ SUR LE FOND (19/19) MAIS NON PUBLIÉ. 3 QCM modifiés dans cet aperçu privé ; les 1 523 identifiants sont conservés. Sauvegarde isolée V2 02-hold ; aucune publication et aucun changement de V1/V2-F ni du Quiz public.',
 'CANDIDAT PRIVÉ V2 : 19 décisions validées. 65 séances, 1 523 QCM, 0 ajout. Sauvegarde versionnée et exportable. Aucun déploiement ni changement du Quiz SEF public.');
html=once(html,'<div id="view"></div><div class="disclaimer">',
 '<div id="view"></div><section id="backup-tools" class="pane" style="margin:16px 0;padding:15px">'+
 '<h3>Ma progression — sauvegarde locale</h3><p>Pour conserver ou transférer ta progression, utilise un fichier JSON propre à cette version.</p>'+
 '<button id="backup-export" type="button">Exporter ma sauvegarde</button>'+
 '<label for="backup-import" style="display:block;margin:10px 0">Restaurer une sauvegarde de cette version</label>'+
 '<input id="backup-import" type="file" accept=".json,application/json" style="max-width:100%">'+
 '<p id="backup-result" role="status"></p></section><div class="disclaimer">');
const controls=String.raw`
<script>
(function(){
 const KEY='qpjb-v2-eleve-65-pedago-r1',VER='QPJB-V2-65-19A-20261120-R1';
 const $=x=>document.getElementById(x);
 const status=s=>$('backup-result').textContent=s;
 function valid(v){
  if(!v||v.schema!==2||v.contentVersion!==VER||v.model!=='core'||
   !Array.isArray(v.completed)||v.completed.length>65||
   !Array.isArray(v.addonAnswers)||v.addonAnswers.length!==0||
   !v.engineState||!Number.isInteger(v.engineState.session)||
   v.engineState.session!==v.completed.length||
   !Number.isInteger(v.nextSession)||v.nextSession!==v.completed.length+1||
   typeof v.finished!=='boolean'||v.finished!==(v.nextSession>65))
   throw Error('Version ou structure incompatible');
  if(v.current){
   if(v.current.number!==v.nextSession||!Array.isArray(v.current.items)||
    v.current.items.length!==10||!Array.isArray(v.current.answers)||
    v.current.answers.length!==10||!Number.isInteger(v.current.position)||
    v.current.position<0||v.current.position>9)
    throw Error('Séance incompatible');
  }
  return v;
 }
 $('backup-export').onclick=()=>{
  try{
   const raw=localStorage.getItem(KEY);if(!raw)throw Error('Aucune progression enregistrée');
   const record=valid(JSON.parse(raw));
   const data={format:'QPJB_V2_STUDENT_BACKUP_1',contentVersion:VER,
    savedAt:new Date().toISOString(),record};
   const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='QPJB_V2_65_SEANCES_SAUVEGARDE.json';
   document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   status('Sauvegarde exportée.');
  }catch(e){status('Export refusé : '+e.message)}
 };
 $('backup-import').onchange=async()=>{
  const inp=$('backup-import'),file=inp.files?.[0];inp.value='';
  if(!file)return;
  try{
   if(file.size>1500000)throw Error('Fichier trop volumineux');
   const data=JSON.parse(await file.text());
   if(data?.format!=='QPJB_V2_STUDENT_BACKUP_1'||data.contentVersion!==VER)
    throw Error('Sauvegarde d’une autre version');
   const record=valid(data.record),prior=localStorage.getItem(KEY);
   if(prior!==null&&!window.confirm('Remplacer uniquement la progression de ce candidat V2 ?')){
    status('Import annulé.');return;
   }
   localStorage.setItem(KEY,JSON.stringify(record));
   window.location.reload();
  }catch(e){status('Import refusé : '+e.message)}
 };
})();
</script>
`;
html=once(html,'</body></html>',controls+'</body></html>');
assert.ok(!html.includes('qpjb-preview-v2-eleve-01'));
assert.ok(!html.includes('qpjb-preview-v2-eleve-02-hold'));
assert.ok(html.includes('noindex,nofollow'));
assert.ok(html.includes('barrage:gambling_3sa_passe_corrige'));
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(match[0].includes('type="application/json"'))continue;
 new Function(match[1]);
}
fs.mkdirSync(outputDir,{recursive:true});
const out=Buffer.from(html,'utf8');
fs.writeFileSync(path.join(outputDir,filename),out);
const manifest={schema:'QPJB_V2_CANDIDATE_R1',status:'HOLD',
 pedagogicalApprovals:19,publicationAuthorized:false,questions:1523,sessions:65,
 gamblingOriginalTheme:'sa',gamblingV2Theme:'barrage',
 contentVersion:version,saveKey:key,manualBackup:true,filename,
 sha256:hash(out),bytes:out.length};
fs.writeFileSync(path.join(outputDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('QPJB V2 CANDIDATE OK '+JSON.stringify(manifest));

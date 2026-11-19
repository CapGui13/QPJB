'use strict';
// QPJB AZ : vrai moteur V2-F, QCM source et exercices AY réunis dans un HTML autonome.
// Aucune écriture dans quizz.html ni les sauvegardes V1/V2-F.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const F=require('./parcours-v2-pilot.cjs');
const AY=require('./parcours-v2-extension-ay.cjs');
function once(source,needle,replacement){
 assert.equal(source.split(needle).length,2,'Ancre source modifiée : '+needle.slice(0,60));
 return source.replace(needle,replacement);
}
function browserEngine(){
 let source=read('scripts/parcours-v2-pilot.cjs');
 source=once(source,
  "const fs=require('node:fs');\nconst path=require('node:path');\nconst P=require('../quizz-parcours.js');\nconst ROOT=path.resolve(__dirname,'..');",
  "const P=window.QPJBParcours;");
 const start=source.indexOf('function readJson(name){');
 const end=source.indexOf('function loadAnnotations(){');
 assert.ok(start>=0&&end>start,'V2-F loaders non reconnus');
 source=source.slice(0,start)+
  'function readJson(name){return window.__AZ_DATA.docs[name]}\n'+
  'function loadCatalog(){return window.__AZ_DATA.catalog}\n'+
  source.slice(end);
 const entry=source.indexOf('if(require.main===module){');
 assert.ok(entry>0,'Mode CLI V2-F absent');
 source=source.slice(0,entry);
 assert.ok(!source.includes("require("),'Dépendance Node résiduelle');
 const result='(function(){const module={exports:{}};\n'+source+
  '\nwindow.AYEngine=module.exports;\n})();';
 new vm.Script(result);
 assert.ok(!/<\/script/i.test(result));
 return result;
}
function data(){
 const catalog=F.loadCatalog();
 assert.equal(catalog.length,1523);
 assert.equal(new Set(catalog.map(q=>q.id)).size,1523);
 assert.equal(F.loadAnnotations().size,79);
 const addons=AY.buildSupplement();
 assert.equal(addons.length,8);
 const docs={};
 for(const name of ['PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json',
  'PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json'])
   docs[name]=JSON.parse(read('Docs/'+name));
 return {schema:'QPJB_V2_AZ_LIVE_1',catalog,docs,addons,
  quizCount:1523,editorialApproval:false,releaseDecision:'HOLD',
  sourceModified:false};
}
function build(){
 const payload=data();
 let html=read('templates/parcours-v2-ay-live.html');
 const P=read('quizz-parcours.js'),engine=browserEngine();
 const runtime=read('templates/parcours-v2-ay-live-runtime.js');
 new vm.Script(runtime);
 const json=JSON.stringify(payload).replace(/</g,'\\u003c').replace(/&/g,'\\u0026');
 for(const [needle,value] of Object.entries({
  '__AZ_DATA__':json,'__AZ_P_LIB__':P,
  '__AZ_ENGINE__':engine,'__AZ_RUNTIME__':runtime
 }))html=once(html,needle,value);
 const totalScripts=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
 assert.equal(totalScripts.length,5,'Un JSON et quatre scripts exécutables attendus');
 for(const item of totalScripts.slice(1))new vm.Script(item[1]);
 const outdir=path.join(ROOT,'artifacts/v2-az');
 fs.mkdirSync(outdir,{recursive:true});
 const output=path.join(outdir,'QPJB_V2_AZ_Parcours_Adaptatif.html');
 fs.writeFileSync(output,html,'utf8');
 const manifest={schema:payload.schema,sizeBytes:Buffer.byteLength(html),
  sha256:crypto.createHash('sha256').update(html).digest('hex'),
  catalog:payload.quizCount,addons:payload.addons.length,annotations:79,
  newStorageKey:'qpjb-preview-v2-az-01',
  originalV1V2KeysUntouched:true,sourceQcmModified:false,
  releaseDecision:'HOLD',publicDeployment:false};
 fs.writeFileSync(path.join(outdir,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log('QPJB-AZ-BUILD '+JSON.stringify(manifest));
 return {output,manifest};
}
module.exports={build,browserEngine,data};
if(require.main===module)build();

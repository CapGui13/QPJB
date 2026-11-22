'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {writeVisualReport}=require('./wave2-ux-visual-report.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-m3-visual-report-'));
const dir=path.join(root,'run-unique'),file=path.join(root,'comparatif-chromium.json');
try{
 fs.mkdirSync(dir);
 fs.writeFileSync(path.join(dir,'chromium-320x844-avant-question.png'),Buffer.from('image réelle de test'));
 const partial=[
  {width:320,height:844,status:'passed',gainPolicePx:8},
  {width:390,height:844,status:'failed',error:'erreur volontaire après capture'}
 ];
 const failed=writeVisualReport({file,engine:'chromium',baseline:'base',rows:partial,runDir:dir});
 assert.equal(failed.status,'failed');
 assert.deepEqual(failed.formats,{passed:1,failed:1,observed:2});
 assert.equal(failed.images.length,1,'Capture partielle conservée');
 assert.equal(failed.images[0].bytes,20);
 assert.equal(failed.images[0].sha256.length,64);
 assert.match(fs.readFileSync(file,'utf8'),/erreur volontaire/);
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:partial.slice(0,1),runDir:dir}).status,'incomplete',
  'Un seul format ne valide pas trois formats attendus');
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:[],runDir:dir,fatal:'WebKit non disponible'}).status,'failed',
  'Un échec précoce doit aussi produire un manifeste exploitable');
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:[...partial.slice(0,1),{width:390,status:'passed'},{width:844,status:'passed'}],
  runDir:dir}).status,'passed','Trois formats réussis restent acceptés');
 assert.throws(()=>writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:[{status:'unknown'}],runDir:dir}),/non classé/);
 console.log('PASS M3 visuel : échec partiel, PNG + SHA conservés, absence de preuve rejetée, succès complet reconnu');
}finally{fs.rmSync(root,{recursive:true,force:true})}

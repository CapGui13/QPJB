'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {writeVisualReport,crc32}=require('./wave2-ux-visual-report.cjs');
const zlib=require('node:zlib');
function png(width,height){
 const sig=Buffer.from('89504e470d0a1a0a','hex');
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;
 const chunk=(type,payload)=>{
  const label=Buffer.from(type,'ascii'),size=Buffer.alloc(4),crc=Buffer.alloc(4);
  size.writeUInt32BE(payload.length);
  crc.writeUInt32BE(crc32(Buffer.concat([label,payload])));
  return Buffer.concat([size,label,payload,crc]);
 };
 return Buffer.concat([sig,chunk('IHDR',ihdr),
  chunk('IDAT',zlib.deflateSync(Buffer.alloc((width*4+1)*height))),
  chunk('IEND',Buffer.alloc(0))]);
}
const root=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-m3-visual-report-'));
const dir=path.join(root,'run-unique'),file=path.join(root,'comparatif-chromium.json');
try{
 fs.mkdirSync(dir);
 fs.writeFileSync(path.join(dir,'chromium-320x844-avant-question.png'),png(320,844));
 const partial=[
  {width:320,height:844,status:'passed',gainPolicePx:8},
  {width:390,height:844,status:'failed',error:'erreur volontaire après capture'}
 ];
 const failed=writeVisualReport({file,engine:'chromium',baseline:'base',rows:partial,runDir:dir});
 assert.equal(failed.status,'failed');
 assert.deepEqual(failed.formats,{passed:1,failed:1,observed:2});
 assert.equal(failed.images.length,1,'Capture partielle conservée');
 assert.equal(failed.images[0].bytes,png(320,844).length);
 assert.equal(failed.images[0].sha256.length,64);
 assert.match(fs.readFileSync(file,'utf8'),/erreur volontaire/);
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:partial.slice(0,1),runDir:dir}).status,'incomplete',
  'Un seul format ne valide pas trois formats attendus');
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:[],runDir:dir,fatal:'WebKit non disponible'}).status,'failed',
  'Un échec précoce doit aussi produire un manifeste exploitable');
 const complete=[...partial.slice(0,1),{width:390,height:844,status:'passed'},{width:844,height:390,status:'passed'}];
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:complete,runDir:dir}).status,'incomplete',
  'Trois formats restent incomplets si les captures sont manquantes');
 for(const size of ['320x844','390x844','844x390']){
  for(const version of ['avant','apres']){
   for(const stage of ['question','propositions','correction']){
    fs.writeFileSync(path.join(dir,'chromium-'+size+'-'+version+'-'+stage+'.png'),
     png(Number(size.split('x')[0]),Number(size.split('x')[1])));
   }
  }
 }
 const success=writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:complete,runDir:dir});
 assert.equal(success.status,'passed','Trois formats et 18 captures validés');
 assert.deepEqual(success.captures,{expected:18,observed:18,invalid:0});
 fs.writeFileSync(path.join(dir,'chromium-390x844-avant-question.png'),Buffer.from('faux PNG'));
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:complete,runDir:dir}).status,'failed','Un seul faux PNG doit être rejeté');
 fs.writeFileSync(path.join(dir,'chromium-390x844-avant-question.png'),png(390,844));
 const corrupted=Buffer.from(png(390,844));corrupted[20]^=1;
 fs.writeFileSync(path.join(dir,'chromium-390x844-avant-question.png'),corrupted);
 const broken=writeVisualReport({file,engine:'chromium',baseline:'base',rows:complete,runDir:dir});
 assert.equal(broken.status,'failed','CRC PNG invalide rejeté');
 assert.match(broken.images.find(x=>x.file.includes('390x844-avant-question')).issue,/CRC PNG/);
 fs.writeFileSync(path.join(dir,'chromium-390x844-avant-question.png'),png(320,844));
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:complete,runDir:dir}).status,'failed','Fausse largeur de capture rejetée');
 fs.writeFileSync(path.join(dir,'chromium-390x844-avant-question.png'),png(390,844));
 fs.rmSync(path.join(dir,'chromium-390x844-avant-correction.png'));
 assert.equal(writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:complete,runDir:dir}).status,'incomplete',
  'Une seule image manquante interdit un succès trompeur');
 assert.throws(()=>writeVisualReport({file,engine:'chromium',baseline:'base',
  rows:[{status:'unknown'}],runDir:dir}),/non classé/);
 console.log('PASS M3 visuel : échec partiel, PNG + SHA conservés, 18 PNG exigés, absence de preuve rejetée');
}finally{fs.rmSync(root,{recursive:true,force:true})}

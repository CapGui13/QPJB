'use strict';
/* Manifeste à échec explicite : même une comparaison interrompue conserve
 * ses erreurs et les captures réellement présentes, jamais des PNG inventés.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const PNG_SIGNATURE=Buffer.from('89504e470d0a1a0a','hex');
const CRC_TABLE=Uint32Array.from({length:256},(_,i)=>{
 let value=i;for(let j=0;j<8;j++)value=value&1?0xedb88320^(value>>>1):value>>>1;
 return value>>>0;
});
function crc32(bytes){
 let crc=0xffffffff;
 for(const byte of bytes)crc=CRC_TABLE[(crc^byte)&255]^(crc>>>8);
 return (crc^0xffffffff)>>>0;
}
function pngEvidence(bytes){
 if(bytes.length<45||!bytes.subarray(0,8).equals(PNG_SIGNATURE))
  return {valid:false,reason:'Signature PNG absente ou fichier tronqué'};
 let offset=8,seenIHDR=false,seenIDAT=false,seenIEND=false,width=null,height=null;
 while(offset+12<=bytes.length){
  const size=bytes.readUInt32BE(offset);
  if(size>bytes.length-offset-12)
   return {valid:false,reason:'Segment PNG tronqué'};
  const type=bytes.toString('ascii',offset+4,offset+8);
  const payload=bytes.subarray(offset+8,offset+8+size);
  const recordedCRC=bytes.readUInt32BE(offset+8+size);
  const actualCRC=crc32(bytes.subarray(offset+4,offset+8+size));
  if(recordedCRC!==actualCRC)return {valid:false,reason:'CRC PNG invalide: '+type};
  if(!seenIHDR){
   if(type!=='IHDR'||size!==13)return {valid:false,reason:'IHDR PNG absent'};
   width=payload.readUInt32BE(0);height=payload.readUInt32BE(4);
   if(!width||!height)return {valid:false,reason:'Dimensions PNG nulles'};
   seenIHDR=true;
  }else if(type==='IDAT')seenIDAT=true;
  else if(type==='IEND'){
   if(size!==0||!seenIDAT||offset+12!==bytes.length)
    return {valid:false,reason:'Fin PNG invalide ou données manquantes'};
   seenIEND=true;break;
  }
  offset+=12+size;
 }
 return seenIHDR&&seenIDAT&&seenIEND?
  {valid:true,width,height}:{valid:false,reason:'Segments PNG obligatoires absents'};
}
const FORMATS=[[320,844],[390,844],[844,390]];
function expectedImageNames(engine){
 const names=new Map();
 for(const [width,height] of FORMATS)
  for(const version of ['avant','apres'])
   for(const stage of ['question','propositions','correction'])
    names.set(engine+'-'+width+'x'+height+'-'+version+'-'+stage+'.png',{width,height});
 return names;
}
function writeVisualReport({file,engine,baseline,rows,runDir,fatal=null,expected=3}){
 if(!['chromium','webkit'].includes(engine))throw Error('Moteur M3 inconnu');
 if(!Array.isArray(rows)||!Number.isInteger(expected)||expected<1)
  throw Error('Plan de comparaison M3 invalide');
 const valid=new Set(['passed','failed']);
 for(const row of rows){
  if(!valid.has(row?.status))throw Error('Résultat M3 visuel non classé');
 }
 const expectedNames=expectedImageNames(engine);
 const images=fs.existsSync(runDir)?fs.readdirSync(runDir)
  .filter(name=>name.endsWith('.png')&&name.startsWith(engine+'-'))
  .sort().map(name=>{
   const bytes=fs.readFileSync(path.join(runDir,name));
   const png=pngEvidence(bytes),expected=expectedNames.get(name);
   const valid=!!expected&&png.valid&&png.width===expected.width&&
    png.height>=expected.height;
   return {file:path.relative(path.dirname(file),path.join(runDir,name)),
    bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
    valid,dimensions:png.valid?{width:png.width,height:png.height}:null,
    issue:valid?null:!expected?'Nom de capture non attendu':
     !png.valid?png.reason:'Dimensions de capture incorrectes'};
  }):[];
 const passed=rows.filter(row=>row.status==='passed').length;
 const failed=rows.filter(row=>row.status==='failed').length;
 // Chaque format requiert AVANT/APRÈS x question/propositions/corrigé.
 // Trois lignes "passed" ne prouvent rien sans les 18 captures réelles.
 const expectedImages=expected*6;
 const rowFormats=rows.filter(row=>row.status==='passed');
 const correctFormats=expected===FORMATS.length&&rowFormats.length===FORMATS.length&&
  FORMATS.every(([width,height])=>rowFormats.some(row=>row.width===width&&row.height===height));
 const correctImages=images.length===expectedImages&&images.every(x=>x.valid)&&
  images.every(x=>expectedNames.has(path.basename(x.file)));
 const invalidImages=images.filter(x=>!x.valid).length;
 const status=fatal||failed||invalidImages?'failed':
  correctFormats&&correctImages?'passed':'incomplete';
 const report={schemaVersion:2,baseline,engine,status,
  generatedAt:new Date().toISOString(),expectedFormats:expected,
  formats:{passed,failed,observed:rows.length},
  captures:{expected:expectedImages,observed:images.length,invalid:invalidImages},
  fatal:fatal?String(fatal):null,rows,images};
 fs.mkdirSync(path.dirname(file),{recursive:true});
 const temporary=file+'.'+process.pid+'.tmp';
 fs.writeFileSync(temporary,JSON.stringify(report,null,2)+'\n');
 fs.renameSync(temporary,file);
 return report;
}
module.exports={writeVisualReport,crc32};

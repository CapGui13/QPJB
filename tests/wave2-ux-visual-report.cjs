'use strict';
/* Manifeste à échec explicite : même une comparaison interrompue conserve
 * ses erreurs et les captures réellement présentes, jamais des PNG inventés.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
function writeVisualReport({file,engine,baseline,rows,runDir,fatal=null,expected=3}){
 if(!['chromium','webkit'].includes(engine))throw Error('Moteur M3 inconnu');
 if(!Array.isArray(rows)||!Number.isInteger(expected)||expected<1)
  throw Error('Plan de comparaison M3 invalide');
 const valid=new Set(['passed','failed']);
 for(const row of rows){
  if(!valid.has(row?.status))throw Error('Résultat M3 visuel non classé');
 }
 const images=fs.existsSync(runDir)?fs.readdirSync(runDir)
  .filter(name=>name.endsWith('.png')&&name.startsWith(engine+'-'))
  .sort().map(name=>{
   const bytes=fs.readFileSync(path.join(runDir,name));
   return {file:path.relative(path.dirname(file),path.join(runDir,name)),
    bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
  }):[];
 const passed=rows.filter(row=>row.status==='passed').length;
 const failed=rows.filter(row=>row.status==='failed').length;
 // Chaque format requiert AVANT/APRÈS x question/propositions/corrigé.
 // Trois lignes "passed" ne prouvent rien sans les 18 captures réelles.
 const expectedImages=expected*6;
 const status=fatal||failed?'failed':
  rows.length===expected&&passed===expected&&images.length===expectedImages?
   'passed':'incomplete';
 const report={schemaVersion:2,baseline,engine,status,
  generatedAt:new Date().toISOString(),expectedFormats:expected,
  formats:{passed,failed,observed:rows.length},
  captures:{expected:expectedImages,observed:images.length},
  fatal:fatal?String(fatal):null,rows,images};
 fs.mkdirSync(path.dirname(file),{recursive:true});
 const temporary=file+'.'+process.pid+'.tmp';
 fs.writeFileSync(temporary,JSON.stringify(report,null,2)+'\n');
 fs.renameSync(temporary,file);
 return report;
}
module.exports={writeVisualReport};

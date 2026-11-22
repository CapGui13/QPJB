'use strict';
// M1 P24: reconnaitre le marqueur PASS du test reel, pas un PASS quelconque.
const assert=require('node:assert/strict');
const aliases={
  'wave2-pedagogie-parcours.cjs':'wave2-pedagogie',
  'wave2-pedagogie-contre-expertise-avancee.cjs':'wave2-pedagogie-contre-expertise'
};
function hasPassMarker(file,stdout){
  const expected=aliases[file]||file.replace(/\.cjs$/,'');
  if(!/^wave2-pedagogie-[a-z0-9-]+\.cjs$/.test(file))return false;
  const lines=String(stdout||'').split(/\r?\n/).filter(line=>line.trim().length>0);
  const last=lines.length?lines[lines.length-1]:'';
  const match=/^PASS (wave2-pedagogie(?:-[a-z0-9]+)*)\s*:\s*/.exec(last);
  return !!match&&match[1]===expected;
}
module.exports={hasPassMarker};
if(require.main===module){
  const valid=[
    ['wave2-pedagogie-parcours.cjs','PASS wave2-pedagogie: 1523 IDs'],
    ['wave2-pedagogie-contre-expertise-avancee.cjs','PASS wave2-pedagogie-contre-expertise : 15 cas'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-progressions : 92 IDs'],
    ['wave2-pedagogie-payload-p22.cjs','preparation\nPASS wave2-pedagogie-payload-p22 : OK\n'],
    ['wave2-pedagogie-runner-p24.cjs','PASS wave2-pedagogie-runner-p24 : OK']
  ];
  for(const [file,output] of valid)assert.equal(hasPassMarker(file,output),true,'Faux rejet '+file);
  const invalid=[
    ['wave2-pedagogie-progressions.cjs','not PASS wave2-pedagogie-progressions : OK'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-stress : OK'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-progressions-extra : OK'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-progressions'],
    ['wave2-pedagogie-progressions.cjs','\nPASS other-test : OK\n'],
    ['wave2-pedagogie-progressions.cjs',''],
    ['training-smoke.cjs','PASS training-smoke : OK'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-progressions : OK\nFAIL wave2-pedagogie-progressions : erreur tardive'],
    ['wave2-pedagogie-progressions.cjs','PASS wave2-pedagogie-progressions : OK\nPASS wave2-pedagogie-stress : autre test']
  ];
  for(const [file,output] of invalid)assert.equal(hasPassMarker(file,output),false,'Fausse acceptation '+file+' : '+output);
  console.log('PASS wave2-pedagogie-runner-p24 : 5 vrais marqueurs acceptes, 9 faux succes rejetes');
}

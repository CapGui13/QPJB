'use strict';
// Répartit les données pédagogiques sans changer les identifiants ou les corrections.
// node scripts/split_training_data.cjs         => écrit les fichiers
// node scripts/split_training_data.cjs --check => vérifie leur synchronisation
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const original=fs.readFileSync(path.join(root,'entrainement/training-data.js'),'utf8').trim();
assert(original.startsWith('const D=')&&original.endsWith(';'));
const D=JSON.parse(original.slice(8,-1));
const base={categories:D.categories,bidding:[],play:[],workshops:D.workshops,
 counts:{bidding:D.bidding.filter(x=>x.reviewStatus!=='a_verifier').length,
  play:D.play.filter(x=>x.reviewStatus!=='a_verifier').length}};
const files={
 'training-data-bootstrap.js':[
  '// Données de référence et chargement différé par espace.',
  'const D='+JSON.stringify(base)+';',
  'const trainingDataLoads=Object.create(null);',
  'function trainingDataReady(mode){',
  " const key=mode==='play'?'play':'bidding';",
  ' return D[key].length>0;',
  '}',
  'function ensureTrainingData(mode){',
  " const key=mode==='play'?'play':'bidding';",
  ' if(trainingDataReady(key))return Promise.resolve();',
  ' if(trainingDataLoads[key])return trainingDataLoads[key];',
  ' trainingDataLoads[key]=new Promise((resolve,reject)=>{',
  "  const script=document.createElement('script');",
  "  script.src='./training-data-'+key+'.js?v=20261030d1';",
  '  script.async=true;',
  '  script.onload=()=>{',
  '   if(trainingDataReady(key))resolve();',
  "   else reject(new Error('Données '+key+' indisponibles'));",
  '  };',
  "  script.onerror=()=>reject(new Error('Impossible de charger les données '+key));",
  '  document.head.appendChild(script);',
  ' }).catch(error=>{delete trainingDataLoads[key];throw error});',
  ' return trainingDataLoads[key];',
  '}',
  ''
 ].join('\n'),
 'training-data-bidding.js':'D.bidding='+JSON.stringify(D.bidding)+';\n',
 'training-data-play.js':'D.play='+JSON.stringify(D.play)+';\n'
};
const check=process.argv.includes('--check');
for(const [filename,expected] of Object.entries(files)){
 const p=path.join(root,'entrainement',filename);
 if(check){
  assert.equal(fs.readFileSync(p,'utf8'),expected,filename+' out of sync with training-data.js');
 }else fs.writeFileSync(p,expected);
}
console.log(JSON.stringify({status:check?'PASS':'GENERATED',
 bidding:D.bidding.length,play:D.play.length,bytes:Object.fromEntries(Object.entries(files).map(([k,v])=>[k,Buffer.byteLength(v)]))}));

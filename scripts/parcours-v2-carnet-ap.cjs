'use strict';
// Carnet AP : reprend exactement le rendu AN déjà validé et son catalogue.
// Seule la sélection de V2-F est remplacée en mémoire par AP, jamais en production.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const ROOT=path.resolve(__dirname,'..');
const VFILE=require.resolve('./parcours-v2-visite-30.cjs');
const ANCHOR="const F=require('./parcours-v2-pilot.cjs');";
const REPLACE="const F=require('./parcours-v2-etaler-ouvertures-ap.cjs').compile();";
function viewer(){
 const original=fs.readFileSync(VFILE,'utf8');
 if(original.split(ANCHOR).length!==2)throw Error('Ancre du carnet AN modifiée');
 const clone=new Module(VFILE,module);
 clone.filename=VFILE;
 clone.paths=Module._nodeModulePaths(path.dirname(VFILE));
 clone._compile(original.replace(ANCHOR,REPLACE),VFILE);
 return clone.exports;
}
function create(outdir=path.join(ROOT,'artifacts/v2-ap-carnet')){
 const V=viewer();
 const report=V.generate();
 report.schema='QPJB_AP_VISITE_30_SEANCES_1';
 report.source='Variante AP hors production : un choix d’ouverture par séance après la cinquième';
 report.originalEngineUnchanged=true;
 report.experimental=true;
 for(const s of report.scenarios){
  if(s.sessions.length!==30)throw Error('30 séances attendues');
  if(s.sessions.slice(5).some(d=>d.questions.filter(q=>q.theme==='ouv').length!==1))
    throw Error('AP n’assure pas une ouverture par séance');
 }
 let html=V.html(report);
 const heading='Visite guidée des 30 premières séances V2';
 if(!html.includes(heading))throw Error('Titre AN inattendu');
 html=html.replaceAll(heading,'Visite AP · 30 séances avec ouvertures étalées');
 const anchor='<p>Ce carnet affiche les <b>vrais QCM du catalogue</b>';
 if(!html.includes(anchor))throw Error('En-tête du carnet manquant');
 html=html.replace(anchor,
  '<p><strong>Version AP expérimentale.</strong> Les séances 1 à 5 restent celles de V2-F ;'+
  ' après, une seule question de choix d’ouverture est réservée par séance.'+
  ' Ce fichier ne remplace pas la version actuelle et ne contient aucune donnée d’élève.</p>'+anchor);
 fs.mkdirSync(outdir,{recursive:true});
 const json=path.join(outdir,'AP-visite-30-seances.json');
 const page=path.join(outdir,'AP-visite-30-seances.html');
 fs.writeFileSync(json,JSON.stringify(report,null,2),'utf8');
 fs.writeFileSync(page,html,'utf8');
 const mini={schema:report.schema,source:report.source,
  metrics:report.scenarios.map(s=>({id:s.id,uniqueFamilies:s.summary.uniqueFamilies,
    recalls:s.summary.scheduledRecalls,themes:s.summary.themesSeen,
    openingsPerSession:s.sessions.map(d=>d.questions.filter(q=>q.theme==='ouv').length),
    originalIdsFirst5:s.sessions.slice(0,5).map(d=>d.questions.map(q=>q.id))}))};
 fs.writeFileSync(path.join(outdir,'AP-synthese.json'),JSON.stringify(mini,null,2),'utf8');
 console.log('QPJB AP CARNET OK '+JSON.stringify(mini.metrics.map(x=>({
  id:x.id,families:x.uniqueFamilies,recalls:x.recalls,themes:x.themes,
  openings21to30:x.openingsPerSession.slice(20,30)}))));
 return {report,html,paths:{json,page}};
}
if(require.main===module)create();
module.exports={viewer,create};

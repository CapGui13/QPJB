'use strict';
// Fixtures explicites uniquement pour catalogues synthétiques des tests M4.
// Les IDs SEF réels restent soumis aux métadonnées de production.
const core=require('../quizz-parcours.js');
const reco=require('../parcours-recommandations.js');
function report(state,options){
 if(!options||!Array.isArray(options.exercises))return reco.buildReport(state,options);
 const byId=Object.fromEntries(options.exercises.map(q=>{
  if(/^SEF-/i.test(q.id))throw Error('ID réel interdit dans les fixtures M4');
  return [q.id,{concept:q.theme+':'+q.answer,stage:0,minSession:0,requires:[]}];
 }));
 const parcours=core.createForTests({schema:'QPJB_PREREQUIS_V1',byId});
 return reco.buildReport(state,{...options,parcours});
}
module.exports={report};

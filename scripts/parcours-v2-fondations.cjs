'use strict';
/* QPJB V2 phase K — calendrier documentaire, sans accès au moteur élève.
 * Les propositions ne déverrouillent rien, ne notent rien et ne prouvent aucune maîtrise.
 */
const path=require('node:path');
const fs=require('node:fs');
const SOURCE=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_K_FONDATIONS_CARTOGRAPHIE_20261118.json');
const load=()=>JSON.parse(fs.readFileSync(SOURCE,'utf8'));
function rotation(items,shift){
  if(!items.length)return [];
  const n=shift%items.length;
  return items.slice(n).concat(items.slice(0,n));
}
function proposeFoundations(data,completedSessions,limit=4){
  if(!data||data.status!=='CANDIDATURE_DOCUMENTAIRE_NON_ACTIVE'||data.unlockEngineEnabled!==false||data.gradingEnabled!==false||data.masteryInferenceEnabled!==false)
    throw new Error('Cartographie documentaire non valide ou moteur activé');
  if(!Number.isSafeInteger(completedSessions)||completedSessions<0)
    throw new RangeError('completedSessions doit être un entier positif ou nul');
  if(!Number.isSafeInteger(limit)||limit<1||limit>8)
    throw new RangeError('limit doit être compris entre 1 et 8');
  // Les conventions à arbitrer et les compétences couvertes par un seul cas
  // sont exclues des suggestions ordinaires, sans les supprimer du catalogue.
  const eligible=data.foundations.filter(f=>
    ['CANDIDATE','INDIRECTE'].includes(f.coverageStatus)&&
    f.suggestedEarliestCompletedSessions<=completedSessions
  );
  const recent=eligible.filter(f=>f.suggestedEarliestCompletedSessions>=completedSessions-2);
  const older=eligible.filter(f=>f.suggestedEarliestCompletedSessions<completedSessions-2);
  const selected=[];
  function add(items,n){
    for(const x of items){
      if(selected.length>=n)break;
      if(!selected.some(y=>y.id===x.id))selected.push(x);
    }
  }
  add(rotation(recent,completedSessions),Math.min(limit,2));
  add(rotation(older,completedSessions*3+1),limit);
  add(rotation(eligible,completedSessions*5+2),limit);
  return selected.map(x=>({
    id:x.id,label:x.label,sourceExerciseIds:x.evidence.map(y=>y.id),
    suggestedEarliestCompletedSessions:x.suggestedEarliestCompletedSessions,
    scope:'EXPLORATION_DOCUMENTAIRE_SANS_ACTIVATION',
    masteryThreshold:null,enforceUnlock:false
  }));
}
module.exports={load,proposeFoundations};
if(require.main===module){
  const sessions=Number(process.argv[2]??12);
  const result=proposeFoundations(load(),sessions);
  process.stdout.write(JSON.stringify({completedSessions:sessions,propositions:result.map(x=>x.id),avertissement:'Prévisualisation documentaire, aucun déblocage ni mesure de maîtrise'},null,2)+'\n');
}

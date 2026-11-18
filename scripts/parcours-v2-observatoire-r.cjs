'use strict';
/* QPJB V2-R: extension passive de cinq axes documentaires à V2-P.
 * Aucun exercice tiré/ajouté, aucun score, aucune nouvelle transition.
 */
const fs=require('node:fs'),path=require('node:path');
const Pilot=require('./parcours-v2-pilot.cjs');
const N=require('./parcours-v2-observatoire-n.cjs');
const P=require('./parcours-v2-observatoire-p.cjs');
const FILE=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_R_LACUNES_CANDIDATES_20261118.json');
function load(){return JSON.parse(fs.readFileSync(FILE,'utf8'))}
function audit(sessions,state,catalog,annotations,extension=load()){
  if(extension.status!=='EXTENSION_DOCUMENTAIRE_NON_ACTIVE'||
     extension.publicRuntimeWired!==false||
     extension.masteryInferenceEnabled!==false||
     extension.unlockEngineEnabled!==false||
     extension.gradingEnabled!==false||extension.additionalAxes!==5)
    throw Error('Extension R non active obligatoire');
  const p=P.load(),base=P.readOnlyAudit(sessions,state,catalog,N.loadIndex(catalog),p);
  const lookup=new Map(catalog.map(q=>[q.id,q]));
  const additions=extension.extraAxes.map(g=>{
    const known=new Set(g.source.map(x=>x.id)),seen=[],sess=new Set(),fams=new Set();
    for(const x of g.source){
      const q=lookup.get(x.id);
      if(!q||q.answer!==x.answer||q.theme!==x.theme||
        (q.caseFamily||q.id)!==x.family||q.difficultyReason!==x.editorialReason)
        throw Error('Source R incohérente : '+x.id);
      if(g.role.startsWith('ouv:')&&Pilot.roleOpening(q)!==g.role)
        throw Error('Rôle ouverture incohérent : '+x.id);
      if(g.role.startsWith('rep:')&&Pilot.roleOpening(q)!==g.role)
        throw Error('Rôle réponse incohérent : '+x.id);
    }
    for(let i=0;i<sessions.length;i++)for(const q of sessions[i]){
      if(!known.has(q.id))continue;
      seen.push({id:q.id,session:i+1});sess.add(i+1);fams.add(Pilot.family(q));
    }
    return {id:g.id,role:g.role,coverageStatus:g.status,catalogQcm:known.size,
      catalogFamilies:g.sourceFamilyCount,seenPresentations:seen.length,
      seenDifferentIds:new Set(seen.map(x=>x.id)).size,
      seenDifferentFamilies:fams.size,sessionsSeen:sess.size,
      firstSession:sess.size?Math.min(...sess):null,
      lastSession:sess.size?Math.max(...sess):null,
      mastered:false,teacherReviewRequired:true};
  });
  const periods=[[1,5],[6,15],[16,30],[31,45]];
  const windows=periods.filter(([a])=>a<=sessions.length).map(([from,to])=>{
    const end=Math.min(to,sessions.length),questions=sessions.slice(from-1,end).flat();
    const counters=Object.fromEntries(extension.extraAxes.map(g=>{
      const ids=new Set(g.source.map(e=>e.id));
      const subset=questions.filter(q=>ids.has(q.id));
      return [g.id,{presentations:subset.length,independentFamilies:new Set(subset.map(Pilot.family)).size}];
    }));
    const allRoles=Object.create(null);
    for(const q of questions){const role=Pilot.roleOpening(q);if(role)allRoles[role]=(allRoles[role]||0)+1}
    return {from,to:end,questions:questions.length,
      candidateExposures:counters,
      fullCatalogRoles:Object.fromEntries(['ouv:1♣','ouv:1♦','rep:1♣','rep:1♦'].map(x=>[x,allRoles[x]||0]))};
  });
  if(additions.length!==5||base.candidateAxesTotal!==16)
    throw Error('Base P ou extension R inattendue');
  return {schema:'QPJB_V2_R_EXPOSITIONS_20261118_1',
    status:'OBSERVATION_PASSIVE_SIMULEE',sessions:sessions.length,questions:sessions.length*10,
    candidateAxes:base.candidateAxesTotal+additions.length,
    baselineThemes:base.original22ThemesSeen,
    baselineFamilies:base.originalUniqueFamilies,
    baselineRecalls:base.originalScheduledRecalls,
    additionalAxes:additions,windows,masteryInferred:false,unlocksEnabled:false};
}
function matrix(){
  const cat=Pilot.loadCatalog(),ann=Pilot.loadAnnotations(),rows=[];
  const extra=load(),bases=P.load();
  for(const profile of ['balanced','fragile-mineures','facile'])for(const seed of [13,29,47]){
    const sim=Pilot.simulateV2(cat,ann,{sessions:45,seed,profile});
    const r=audit(sim.sessions,sim.state,cat,ann,extra);
    rows.push({profile,seed,uniqueFamilies:r.baselineFamilies,
      all22Themes:r.baselineThemes,scheduledReviews:r.baselineRecalls,
      observedAxes:r.additionalAxes.map(x=>({id:x.id,presentations:x.seenPresentations,
        firstSession:x.firstSession,independentFamilies:x.seenDifferentFamilies})),
      firstFive:r.windows[0],middle:r.windows[2],last:r.windows[3]});
  }
  const ranges=Object.fromEntries(extra.extraAxes.map(g=>{
    const series=rows.map(x=>x.observedAxes.find(y=>y.id===g.id));
    const numbers=series.map(x=>x.presentations);
    const first=series.map(x=>x.firstSession).filter(Number.isInteger);
    return [g.id,{presentations:[Math.min(...numbers),Math.max(...numbers)],
      firstSession:first.length?[Math.min(...first),Math.max(...first)]:null,
      scenariosWithZero:numbers.filter(x=>x===0).length,
      seenDifferentFamilies:[Math.min(...series.map(x=>x.independentFamilies)),
        Math.max(...series.map(x=>x.independentFamilies))]}];
  }));
  const earlyRoles=['ouv:1♣','ouv:1♦','rep:1♣','rep:1♦'];
  return {schema:'QPJB_V2_R_9_SCENARIOS_20261118_1',
    status:'SIMULATION_SYNTHESE_DOCUMENTAIRE_NON_ACTIVE',
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    sourceCatalogSize:cat.length,candidateAxes:21,
    originalPaxes:bases.axes.length,additionalAxes:extra.additionalAxes,
    uniqueDocumentedQcm:extra.totalUniqueQcm,
    actualCandidateExposures:ranges,
    firstFiveRoles:Object.fromEntries(earlyRoles.map(k=>[k,
      [Math.min(...rows.map(x=>x.firstFive.fullCatalogRoles[k])),
       Math.max(...rows.map(x=>x.firstFive.fullCatalogRoles[k]))]])),
    allEarlyMinorRolesPresent:rows.every(x=>earlyRoles.every(k=>x.firstFive.fullCatalogRoles[k]>0)),
    all22ThemesEachRun:rows.every(x=>x.all22Themes),
    unchangedSelectedFamiliesRange:[Math.min(...rows.map(x=>x.uniqueFamilies)),Math.max(...rows.map(x=>x.uniqueFamilies))],
    unchangedScheduledRecallRange:[Math.min(...rows.map(x=>x.scheduledReviews)),Math.max(...rows.map(x=>x.scheduledReviews))],
    rows,masteryInferred:false,unlocksEnabled:false};
}
module.exports={load,audit,matrix};
if(require.main===module)console.log(JSON.stringify(matrix(),null,2));

'use strict';
/* QPJB V2-Q — observatoire des situations d'apprentissage.
 * Sans tirage nouveau : on exploite exclusivement les séances de V2-F.
 * Une présence en simulation n'est pas une connaissance acquise.
 */
const fs=require('node:fs'),path=require('node:path');
const Pilot=require('./parcours-v2-pilot.cjs');
const P=require('./parcours-v2-observatoire-p.cjs');
const QFILE=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_Q_PROGRESSION_CANDIDATE_20261118.json');
function load(){return JSON.parse(fs.readFileSync(QFILE,'utf8'))}
function observations(sessions,model=load(),axis=P.load()){
  if(model.selectionUnaffected!==true||model.publicRuntimeWired!==false||
    model.masteryInferenceEnabled!==false||model.unlockEngineEnabled!==false)
    throw Error('Les repères Q doivent rester strictement documentaires');
  const idsByAxis=new Map(axis.axes.map(a=>[a.id,new Set(a.sourceIds)]));
  if(idsByAxis.size!==16||model.groups.length!==5)
    throw Error('Graphes P/Q inattendus');
  const observed=[];
  for(const group of model.groups){
    const ids=new Set(group.axes.flatMap(id=>[...(idsByAxis.get(id)||[])]));
    const hit=[];
    for(let s=0;s<sessions.length;s++){
      for(const q of sessions[s])if(ids.has(q.id))
        hit.push({session:s+1,id:q.id,family:Pilot.family(q)});
    }
    observed.push({groupId:group.id,exposures:hit.length,
      independentFamiliesSeen:new Set(hit.map(x=>x.family)).size,
      firstSession:hit.length?Math.min(...hit.map(x=>x.session)):null,
      sessionsSeen:new Set(hit.map(x=>x.session)).size});
  }
  const periods=[[1,5],[6,10],[11,20],[21,30],[31,45]];
  const windows=periods.filter(([from])=>from<=sessions.length).map(([from,last])=>{
    const end=Math.min(last,sessions.length);
    const deck=sessions.slice(from-1,end).flat();
    const groups=Object.fromEntries(model.groups.map(g=>{
      const ids=new Set(g.axes.flatMap(id=>[...(idsByAxis.get(id)||[])]));
      const sub=deck.filter(q=>ids.has(q.id));
      return [g.id,{presentations:sub.length,
        differentFamilies:new Set(sub.map(Pilot.family)).size}];
    }));
    const roleCount={};
    for(const q of deck){
      const role=Pilot.roleOpening(q);
      if(role)roleCount[role]=(roleCount[role]||0)+1;
    }
    return {from,end,questions:deck.length,
      uniqueThemes:new Set(deck.map(x=>x.theme)).size,
      uniqueFamilies:new Set(deck.map(Pilot.family)).size,
      groupPresentations:groups,
      openings:Object.fromEntries(['1♣','1♦','1♥','1♠','1SA','Passe'].map(x=>[x,roleCount['ouv:'+x]||0])),
      replies:Object.fromEntries(['1♣','1♦','1♥','1♠','1SA'].map(x=>[x,roleCount['rep:'+x]||0]))};
  });
  return {schema:'QPJB_V2_Q_LECTURE_SEULE_20261118_1',
    sessions:sessions.length,questions:sessions.length*10,
    observedGroups:observed,windows,masteryInferred:false,unlocksEnabled:false};
}
function matrix(){
  const catalog=Pilot.loadCatalog(),annotations=Pilot.loadAnnotations();
  const plan=load(),axis=P.load();
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const r=Pilot.simulateV2(catalog,annotations,{sessions:45,profile,seed});
      const audit=observations(r.sessions,plan,axis);
      const m=r.metrics;
      rows.push({profile,seed,totalFamilies:m.uniqueFamilies,totalThemes:Object.keys(m.themes).length,
        scheduledReviews:m.revision.scheduledDueRecalls,
        firstFive: audit.windows[0],
        groups:audit.observedGroups,
        windows:audit.windows});
    }
  const summary={};
  for(const g of plan.groups){
    const values=rows.map(row=>row.groups.find(x=>x.groupId===g.id));
    const range=key=>[Math.min(...values.map(x=>x[key])),Math.max(...values.map(x=>x[key]))];
    const first=values.filter(x=>x.firstSession!==null).map(x=>x.firstSession);
    summary[g.id]={presentations:range('exposures'),
      differentFamilies:range('independentFamiliesSeen'),
      firstEncounterRange:first.length?[Math.min(...first),Math.max(...first)]:null,
      scenariosWithNoExposure:values.filter(x=>x.firstSession===null).length};
  }
  return {schema:'QPJB_V2_Q_9_SCENARIOS_20261118_1',
    status:'PARCOURS_SYNTHETIQUES_NON_ACTIFS',catalogCount:catalog.length,
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    conceptualGroups:plan.groups.length,axes:axis.axes.length,
    foundationalGaps:modelGaps(plan),
    metricsByGroup:summary,
    firstFiveMinorOpeningsAllScenarios:rows.every(x=>
      x.firstFive.openings['1♣']>0&&x.firstFive.openings['1♦']>0),
    firstFiveMinorResponsesAllScenarios:rows.every(x=>
      x.firstFive.replies['1♣']>0&&x.firstFive.replies['1♦']>0),
    firstFiveMajorResponsesAllScenarios:rows.every(x=>
      x.firstFive.replies['1♥']>0&&x.firstFive.replies['1♠']>0),
    all22ThemesEveryRun:rows.every(x=>x.totalThemes===22),
    rows:process.argv.includes('--detail')?rows:rows.map(x=>({
      profile:x.profile,seed:x.seed,
      uniqueFamilies:x.totalFamilies,scheduledReviews:x.scheduledReviews,
      firstFiveOpenings:x.firstFive.openings,firstFiveReplies:x.firstFive.replies,
      groups:x.groups
    })),
    masteryInferred:false,unlocksEnabled:false};
}
function modelGaps(plan){return plan.unmappedContexts.map(x=>({id:x.id,label:x.label,needsCatalogReview:x.needsCatalogReview}))}
module.exports={load,observations,matrix};
if(require.main===module)console.log(JSON.stringify(matrix(),null,2));

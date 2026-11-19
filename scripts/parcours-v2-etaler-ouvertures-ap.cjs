'use strict';
// QPJB AP : étaler les 84 questions d'ouverture uniques sur l'ensemble du parcours.
// Un moteur alternatif compilé en mémoire : V2-F, prévisualisation et QCM inchangés.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const F=require('./parcours-v2-pilot.cjs');
const SOURCE=require.resolve('./parcours-v2-pilot.cjs');
const PROFILES=['balanced','fragile-mineures','facile'],SEEDS=[13,29,47];
const ANCHOR_SPEC=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(specific.length&&!pool.some(q=>!state.families[family(q)]))pool=specific;"
].join('\n');
const REPLACEMENT_SPEC=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(session>=5&&slot.startsWith('ouv:')){",
"        // L'ouverture précise est épuisée : en trouver une AUTRE encore inédite.",
"        const unusedOpen=pool.filter(q=>q.theme==='ouv'&&",
"          !state.families[family(q)]);",
"        if(unusedOpen.length)pool=unusedOpen;",
"        else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"          pool=specific;",
"      }else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"        pool=specific;"
].join('\n');
const ANCHOR_POOL=[
"    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));",
"    if(!pool.length)break;"
].join('\n');
const REPLACEMENT_POOL=[
"    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));",
"    // Après les cinq premières séances, un seul choix d'ouverture par séance.",
"    // Ne pas éliminer les rappels d'autres thèmes ; les questions restent au nombre de 10.",
"    if(session>=5&&chosen.some(q=>q.theme==='ouv'))",
"      pool=pool.filter(q=>q.theme!=='ouv');",
"    if(!pool.length)break;"
].join('\n');
function compile(){
  let source=fs.readFileSync(SOURCE,'utf8');
  if(source.split(ANCHOR_SPEC).length!==2)throw Error('Source sélection spécificité non reconnue');
  if(source.split(ANCHOR_POOL).length!==3)throw Error('Source deux bassins non reconnue');
  source=source.replace(ANCHOR_SPEC,REPLACEMENT_SPEC)
    .replaceAll(ANCHOR_POOL,REPLACEMENT_POOL);
  const clone=new Module(SOURCE,module);
  clone.filename=SOURCE;clone.paths=Module._nodeModulePaths(path.dirname(SOURCE));
  clone._compile(source,SOURCE);
  return clone.exports;
}
function count(sessions,a,b,fn){return sessions.slice(a-1,b).flat().filter(fn).length}
function window(sessions,a,b){
 const qs=sessions.slice(a-1,b).flat();
 const opening=qs.filter(q=>q.theme==='ouv');
 const reps=qs.filter(q=>F.roleOpening(q).startsWith('rep:'));
 return {from:a,to:b,openings:opening.length,
   minorOpenings:opening.filter(q=>['1♣','1♦'].includes(q.answer)).length,
   majorOpenings:opening.filter(q=>['1♥','1♠'].includes(q.answer)).length,
   advancedOpenings:opening.filter(q=>q.difficulty>=3).length,
   replies:reps.length,minorReplies:reps.filter(q=>['rep:1♣','rep:1♦'].includes(F.roleOpening(q))).length,
   families:new Set(qs.map(F.family)).size,
   high:qs.filter(q=>q.difficulty>=4).length,
   mean:Math.round(qs.reduce((a,q)=>a+q.difficulty,0)/qs.length*100)/100};
}
function audit(sim,catalog){
 const sessions=sim.sessions;
 const byId=new Map(catalog.map(q=>[q.id,q])),seen=new Map();
 let duplicates=0,tooSoon=0,wrongSource=0,tripleAnswer=0;
 const per=[];
 for(let s=0;s<sessions.length;s++){
  const deck=sessions[s];if(deck.length!==10)throw Error('Séance incomplète '+(s+1));
  if(new Set(deck.map(F.family)).size!==10)duplicates++;
  const answers={};
  for(const q of deck){
   if(byId.get(q.id)!==q)wrongSource++;
   const f=F.family(q);
   if(seen.has(f)&&s-seen.get(f)<4)tooSoon++;
   seen.set(f,s);
   answers[q.answer]=(answers[q.answer]||0)+1;
  }
  if(Object.values(answers).some(n=>n>=3))tripleAnswer++;
  per.push({session:s+1,opening:deck.filter(q=>q.theme==='ouv')
    .map(q=>({id:q.id,answer:q.answer,difficulty:q.difficulty,family:F.family(q)})),
    uniqueFamilies:new Set(deck.map(F.family)).size,answers});
 }
 return {summary:{families:sim.metrics.uniqueFamilies,themes:Object.keys(sim.metrics.themes).length,
   scheduled:sim.metrics.revision.scheduledDueRecalls,
   actualDue:sim.metrics.revision.actualDueRecalls,
   duplicates,tooSoon,wrongSource,tripleAnswer},
   first5Ids:sessions.slice(0,5).map(d=>d.map(q=>q.id)),
   windows:[[1,5],[6,10],[11,20],[21,30],[31,45]].map(x=>window(sessions,...x)),
   perSession:per};
}
function matrix(){
 const catalog=F.loadCatalog(),annotations=F.loadAnnotations(),ALT=compile();
 if(catalog.length!==1523||annotations.size!==79)throw Error('Catalogue modifié');
 const allOpen=catalog.filter(q=>q.theme==='ouv');
 const inventory={total:allOpen.length,families:new Set(allOpen.map(F.family)).size,
   difficulty:Object.fromEntries([1,2,3,4,5].map(k=>[k,allOpen.filter(q=>q.difficulty===k).length])),
   answer:Object.fromEntries([...new Set(allOpen.map(q=>q.answer))].sort()
     .map(k=>[k,allOpen.filter(q=>q.answer===k).length]))};
 const rows=[];
 for(const profile of PROFILES)for(const seed of SEEDS){
  const opts={profile,seed,sessions:45};
  const ref=F.simulateV2(catalog,annotations,opts);
  const sim=ALT.simulateV2(catalog,annotations,opts);
  const a=audit(ref,catalog),b=audit(sim,catalog);
  const diff={
   opening21to30:b.windows[3].openings-a.windows[3].openings,
   opening31to45:b.windows[4].openings-a.windows[4].openings,
   families:b.summary.families-a.summary.families,
   recalls:b.summary.scheduled-a.summary.scheduled,
   minorReplies:b.windows[3].minorReplies-a.windows[3].minorReplies,
   themes:b.summary.themes-a.summary.themes,
   highEarly:b.windows.slice(0,2).reduce((s,w)=>s+w.high,0)-
       a.windows.slice(0,2).reduce((s,w)=>s+w.high,0)
  };
  const first5=JSON.stringify(a.first5Ids)===JSON.stringify(b.first5Ids);
  const everyAfter5=b.perSession.slice(5).every(x=>x.opening.length===1);
  const failures=[];
  if(!first5)failures.push('FIRST_5_CHANGED');
  if(!everyAfter5)failures.push('NOT_ONE_OPENING');
  if(diff.opening21to30<4)failures.push('OPENING_NO_GAIN');
  if(diff.opening31to45<5)failures.push('OPENING_NO_LATE_GAIN');
  if(diff.families< -3)failures.push('FAMILY_LOSS');
  if(diff.recalls< -2)failures.push('RECALL_LOSS');
  if(diff.minorReplies< -2)failures.push('MINOR_REPLIES_LOSS');
  if(diff.themes<0)failures.push('THEME_COVERAGE_LOSS');
  if(b.summary.duplicates||b.summary.tooSoon||b.summary.wrongSource)
    failures.push('ORIGINAL_OR_SPACING_ERROR');
  if(b.summary.tripleAnswer>a.summary.tripleAnswer+1)
    failures.push('ANSWER_REPETITION');
  if(diff.highEarly!==0)failures.push('EARLY_DIFFICULTY_CHANGE');
  rows.push({profile,seed,first5Identical:first5,everyAfter5,diff,
    guardPass:failures.length===0,failures,
    baseline:{summary:a.summary,windows:a.windows,openings:a.perSession.map(p=>p.opening.length)},
    candidate:{summary:b.summary,windows:b.windows,openings:b.perSession.map(p=>p.opening.length),
      perSession:b.perSession}});
 }
 // S'assurer que le stock d'ouvertures permet aussi un étalement jusqu'à S65.
 const extended=[];
 for(const profile of PROFILES){
  const opts={profile,seed:13,sessions:65};
  const r=ALT.simulateV2(catalog,annotations,opts),d=r.sessions;
  extended.push({profile,sessions:d.length,totalOpenings:d.flat().filter(q=>q.theme==='ouv').length,
    openings31to65:count(d,31,65,q=>q.theme==='ouv'),
    sessionsWithNoOpening:d.slice(5).map((deck,i)=>({session:i+6,count:deck.filter(q=>q.theme==='ouv').length}))
       .filter(x=>x.count===0).map(x=>x.session),
    recentFamilies:[...new Set(d.flat().map(F.family))].length,
    themes:Object.keys(r.metrics.themes).length,
    scheduled:r.metrics.revision.scheduledDueRecalls});
 }
 const range=key=>[Math.min(...rows.map(x=>x.diff[key])),Math.max(...rows.map(x=>x.diff[key]))];
 return {schema:'QPJB_AP_SPREAD_OPENINGS_1',
  sourceQcm:catalog.length,originalUnmodified:true,realLearners:false,
  inventory,scenarios:rows.length,sessions:45,
  digest:{passed:rows.filter(x=>x.guardPass).length,
    openingGain21to30:range('opening21to30'),
    openingGain31to45:range('opening31to45'),
    familiesDelta:range('families'),recallDelta:range('recalls'),
    minorRepliesDelta:range('minorReplies'),
    failures:rows.filter(x=>!x.guardPass).map(x=>({
      profile:x.profile,seed:x.seed,reasons:x.failures}))},
  extended65:extended,rows};
}
if(require.main===module){
 const output=matrix(),arg=process.argv.find(x=>x.startsWith('--output='));
 if(arg)fs.writeFileSync(arg.slice(9),JSON.stringify(output,null,2));
 console.log('QPJB-AP-INVENTORY '+JSON.stringify(output.inventory));
 console.log('QPJB-AP-DIGEST '+JSON.stringify(output.digest));
 console.log('QPJB-AP-EXTENDED '+JSON.stringify(output.extended65));
}
module.exports={compile,matrix};

'use strict';
// AQ : ouverture inédite une séance sur deux, avec rappels prioritaires.
// Modèle isolé compilé en mémoire : aucun effet sur la V2 des élèves.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const F=require('./parcours-v2-pilot.cjs');
const SOURCE=require.resolve('./parcours-v2-pilot.cjs');
const POOL=[
"    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));",
"    if(!pool.length)break;"
].join('\n');
const FOR=[
"    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));",
"    // Un seul choix d'ouverture au plus ; ouverture planifiée une séance sur deux.",
"    // Exception : laisser une révision due prioritaire à la rotation.",
"    if(session>=5&&(chosen.some(q=>q.theme==='ouv')||",
"      ((session-5)%2===1&&slot!=='revision')))",
"      pool=pool.filter(q=>q.theme!=='ouv');",
"    if(!pool.length)continue;"
].join('\n');
const WHILE=[
"    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));",
"    if(session>=5&&(chosen.some(q=>q.theme==='ouv')||(session-5)%2===1))",
"      pool=pool.filter(q=>q.theme!=='ouv');",
"    if(!pool.length)break;"
].join('\n');
const SPEC=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(specific.length&&!pool.some(q=>!state.families[family(q)]))pool=specific;"
].join('\n');
const SPECFIX=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(session>=5&&slot.startsWith('ouv:')){",
"        // Ne pas épuiser les autres thèmes en imposant une catégorie d'ouverture épuisée.",
"        const otherNewOpen=pool.filter(q=>q.theme==='ouv'&&",
"          !state.families[family(q)]);",
"        if(otherNewOpen.length)pool=otherNewOpen;",
"        else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"          pool=specific;",
"      }else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"        pool=specific;"
].join('\n');
function compile(){
 let source=fs.readFileSync(SOURCE,'utf8');
 if(source.split(POOL).length!==3||source.split(SPEC).length!==2)
   throw Error('Référence V2-F inattendue');
 source=source.replace(POOL,FOR).replace(POOL,WHILE).replace(SPEC,SPECFIX);
 const clone=new Module(SOURCE,module);
 clone.filename=SOURCE;clone.paths=Module._nodeModulePaths(path.dirname(SOURCE));
 clone._compile(source,SOURCE);
 return clone.exports;
}
function describe(sim,catalog){
 const sessions=sim.sessions,refs=new Map(catalog.map(q=>[q.id,q])),last=new Map();
 let duplicate=0,tooSoon=0,foreign=0,threeSame=0;
 const row=[];
 for(let s=0;s<sessions.length;s++){
  const deck=sessions[s],counts={};
  if(deck.length!==10)throw Error('Séance incomplète '+(s+1));
  if(new Set(deck.map(F.family)).size!==10)duplicate++;
  for(const q of deck){
   if(refs.get(q.id)!==q)foreign++;
   const fam=F.family(q);
   if(last.has(fam)&&s-last.get(fam)<4)tooSoon++;
   last.set(fam,s);
   counts[q.answer]=(counts[q.answer]||0)+1;
  }
  if(Object.values(counts).some(n=>n>=3))threeSame++;
  row.push({session:s+1,openers:deck.filter(q=>q.theme==='ouv').map(q=>({
    id:q.id,family:F.family(q),answer:q.answer,level:q.difficulty})),
    minorResponses:deck.filter(q=>['rep:1♣','rep:1♦'].includes(F.roleOpening(q))).length});
 }
 const window=(a,b)=>{const rows=row.slice(a-1,b);
  return {from:a,to:b,opening:rows.reduce((n,x)=>n+x.openers.length,0),
    activeSessions:rows.filter(x=>x.openers.length).length,
    minorResponses:rows.reduce((n,x)=>n+x.minorResponses,0),
    uniqueOpeningFamilies:new Set(rows.flatMap(x=>x.openers.map(y=>y.family))).size};
 };
 return {counts:{families:sim.metrics.uniqueFamilies,
   themes:Object.keys(sim.metrics.themes).length,
   scheduled:sim.metrics.revision.scheduledDueRecalls,
   due:sim.metrics.revision.actualDueRecalls,
   duplicate,tooSoon,foreign,threeSame},
   firstFiveIds:sessions.slice(0,5).map(d=>d.map(q=>q.id)),
   windows:[[1,5],[6,10],[11,20],[21,30],[31,45]].map(x=>window(...x)),
   row};
}
function matrix(){
 const catalog=F.loadCatalog(),ann=F.loadAnnotations(),AQ=compile();
 if(catalog.length!==1523||ann.size!==79)throw Error('Source inattendue');
 const rows=[];
 for(const profile of ['balanced','fragile-mineures','facile'])for(const seed of [13,29,47]){
  const settings={sessions:45,profile,seed};
  const b=describe(F.simulateV2(catalog,ann,settings),catalog),
    a=describe(AQ.simulateV2(catalog,ann,settings),catalog);
  const delta={openings21to30:a.windows[3].opening-b.windows[3].opening,
    openings31to45:a.windows[4].opening-b.windows[4].opening,
    families:a.counts.families-b.counts.families,
    recalls:a.counts.scheduled-b.counts.scheduled,
    minorResponses:a.windows[3].minorResponses-b.windows[3].minorResponses,
    themes:a.counts.themes-b.counts.themes};
  const firstFive=JSON.stringify(a.firstFiveIds)===JSON.stringify(b.firstFiveIds);
  const errors=[];
  if(!firstFive)errors.push('FIRST5_CHANGED');
  if(a.counts.duplicate||a.counts.foreign||a.counts.tooSoon)errors.push('FAMILY_SAFETY');
  if(a.counts.threeSame>b.counts.threeSame+1)errors.push('ANSWER_REPETITION');
  if(delta.families< -3)errors.push('FAMILIES_LOST');
  if(delta.recalls< -3)errors.push('RECALLS_LOST');
  if(delta.minorResponses< -2)errors.push('MINOR_RESPONSES_LOST');
  if(delta.themes<0)errors.push('THEMES_LOST');
  if(a.windows[3].opening<3||a.windows[4].opening<5)errors.push('OPENING_SPACING_INSUFFICIENT');
  rows.push({profile,seed,firstFive,baseline:b,experimental:a,delta,
    safeguardsPassed:!errors.length,safeguards:errors});
 }
 const extended=[];
 for(const profile of ['balanced','fragile-mineures','facile']){
  const sim=AQ.simulateV2(catalog,ann,{sessions:65,seed:13,profile}),
   a=describe(sim,catalog);
  extended.push({profile,totalOpeners:a.row.reduce((n,x)=>n+x.openers.length,0),
    openings31to65:a.row.slice(30).reduce((n,x)=>n+x.openers.length,0),
    after30Sessions:a.row.slice(30).filter(x=>x.openers.length).map(x=>x.session),
    uniqueFamilies:a.counts.families,recalls:a.counts.scheduled,themes:a.counts.themes,
    errors:{duplicates:a.counts.duplicate,tooSoon:a.counts.tooSoon,foreign:a.counts.foreign}});
 }
 const range=fn=>[Math.min(...rows.map(fn)),Math.max(...rows.map(fn))];
 return {schema:'QPJB_AQ_ALTERNATE_OPENINGS_1',source:catalog.length,referenceIntact:true,
  scenarios:rows.length,sessions:45,
  digest:{passed:rows.filter(x=>x.safeguardsPassed).length,
    opening21to30:range(x=>x.experimental.windows[3].opening),
    opening31to45:range(x=>x.experimental.windows[4].opening),
    familyDiff:range(x=>x.delta.families),recallDiff:range(x=>x.delta.recalls),
    failures:rows.filter(x=>!x.safeguardsPassed).map(x=>({profile:x.profile,seed:x.seed,reasons:x.safeguards}))},
  extended,rows};
}
if(require.main===module){
 const result=matrix(),out=process.argv.find(x=>x.startsWith('--output='));
 if(out)fs.writeFileSync(out.slice(9),JSON.stringify(result,null,2));
 console.log('QPJB-AQ-DIGEST '+JSON.stringify(result.digest));
 console.log('QPJB-AQ-EXTENDED '+JSON.stringify(result.extended));
}
module.exports={compile,matrix};

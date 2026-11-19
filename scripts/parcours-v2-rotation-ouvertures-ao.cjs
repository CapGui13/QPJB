'use strict';
// QPJB AO: variantes V2-F compilées en mémoire, sans changement de production.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const F=require('./parcours-v2-pilot.cjs');
const SOURCE=require.resolve('./parcours-v2-pilot.cjs');
const PROFILES=['balanced','fragile-mineures','facile'];
const SEEDS=[13,29,47],MIN_GAP=6;
const VARIANTS={reference:null,three:3,two:2,each:1};
const TARGET=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(specific.length&&!pool.some(q=>!state.families[family(q)]))pool=specific;"
].join('\n');
function createEngine(mode){
  if(!Object.hasOwn(VARIANTS,mode))throw Error('Variante inconnue '+mode);
  if(mode==='reference')return F;
  const original=fs.readFileSync(SOURCE,'utf8');
  if(original.split(TARGET).length!==2)throw Error('Ancre V2-F introuvable ou répétée');
  const rate=VARIANTS[mode];
  const PATCH=[
"      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);",
"      if(unusedSpecific.length)pool=unusedSpecific;",
"      else if(slot.startsWith('ouv:')&&session>=20&&session%"+rate+"===0){",
"        // Réutilisation d'une ouverture permise uniquement après six séances.",
"        const spaced=pool.filter(q=>q.theme==='ouv'&&",
"          (!state.families[family(q)]||",
"            session-state.families[family(q)].lastSession>="+MIN_GAP+"));",
"        if(spaced.length)pool=spaced;",
"        else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"          pool=specific;",
"      }else if(specific.length&&!pool.some(q=>!state.families[family(q)]))",
"        pool=specific;"
  ].join('\n');
  const text=original.replace(TARGET,PATCH);
  if(text===original)throw Error('Variantes identiques');
  const clone=new Module(SOURCE,module);
  clone.filename=SOURCE;
  clone.paths=Module._nodeModulePaths(path.dirname(SOURCE));
  clone._compile(text,SOURCE);
  return clone.exports;
}
function windowMetrics(sessions,from,to){
  const qs=sessions.slice(from-1,to).flat();
  const opening=qs.filter(q=>q.theme==='ouv');
  const standard=opening.filter(q=>['1♣','1♦','1♥','1♠','1SA','Passe'].includes(q.answer));
  const replies=qs.filter(q=>F.roleOpening(q).startsWith('rep:'));
  return {from,to,openings:opening.length,standardOpenings:standard.length,
    openingAnswers:Object.fromEntries([...new Set(opening.map(x=>x.answer))].map(k=>
      [k,opening.filter(q=>q.answer===k).length])),
    replies:replies.length,
    minorReplies:replies.filter(q=>['rep:1♣','rep:1♦'].includes(F.roleOpening(q))).length,
    uniqueFamilies:new Set(qs.map(F.family)).size,
    highLevel:qs.filter(q=>q.difficulty>=4).length,
    meanDifficulty:Math.round(qs.reduce((a,q)=>a+q.difficulty,0)/qs.length*100)/100};
}
function audit(engine,catalog,annotations,params){
  const sim=engine.simulateV2(catalog,annotations,params),sessions=sim.sessions;
  const windows=[[1,5],[6,10],[11,20],[21,30],[31,45]].map(([a,b])=>
    windowMetrics(sessions,a,b));
  let duplicateSessions=0,recentReuse=0,wrongSources=0,repeatedAnswers=0;
  const source=new Map(catalog.map(q=>[q.id,q])),seen=new Map();
  for(let s=0;s<sessions.length;s++){
    const deck=sessions[s],answers={};
    if(deck.length!==10)throw Error('Séance incomplète '+s);
    if(new Set(deck.map(F.family)).size!==10)duplicateSessions++;
    for(const q of deck){
      if(source.get(q.id)!==q)wrongSources++;
      const key=F.family(q);
      if(seen.has(key)&&s-seen.get(key)<4)recentReuse++;
      seen.set(key,s);
      answers[q.answer]=(answers[q.answer]||0)+1;
    }
    if(Object.values(answers).some(v=>v>=3))repeatedAnswers++;
  }
  return {windows,summary:{families:sim.metrics.uniqueFamilies,
    themes:Object.keys(sim.metrics.themes).length,
    scheduled:sim.metrics.revision.scheduledDueRecalls,
    actualDue:sim.metrics.revision.actualDueRecalls,
    duplicateSessions,recentReuse,wrongSources,repeatedAnswers},
    sessionIds:sessions.map(d=>d.map(q=>q.id)),
    openingsBySession:sessions.slice(20,30).map((deck,i)=>({
      session:i+21,opening:deck.filter(q=>q.theme==='ouv').map(q=>
        ({id:q.id,answer:q.answer,difficulty:q.difficulty,family:F.family(q)}))
    }))};
}
function stocks(catalog,annotations,params){
  const state=F.newState(params.seed),data=[];
  for(let s=0;s<45;s++){
    if(s>=20&&s<30){
      const all=catalog.filter(q=>q.theme==='ouv'&&F.available(q,s,annotations));
      const fresh=all.filter(q=>!state.families[F.family(q)]);
      const spaced=all.filter(q=>!state.families[F.family(q)]||
        s-state.families[F.family(q)].lastSession>=MIN_GAP);
      data.push({session:s+1,eligible:all.length,unseen:fresh.length,
        spaced:spaced.length,unseenHigh:fresh.filter(q=>q.difficulty>=4).length,
        byAnswer:Object.fromEntries([...new Set(spaced.map(q=>q.answer))].sort().map(a=>
          [a,spaced.filter(q=>q.answer===a).length]))});
    }
    const deck=F.select(catalog,state,annotations,10);
    F.recordSession(state,deck,F.simulatedAnswers(deck,s,params.seed,params.profile),annotations);
  }
  return data;
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)throw Error('Source modifiée');
  const engines=Object.fromEntries(Object.keys(VARIANTS).map(k=>[k,createEngine(k)]));
  const rows=[];
  for(const profile of PROFILES)for(const seed of SEEDS){
    const params={sessions:45,profile,seed};
    const runs=Object.fromEntries(Object.entries(engines).map(([k,e])=>
      [k,audit(e,catalog,annotations,params)]));
    const original=runs.reference,ref=original.summary;
    const candidates={};
    for(const variant of ['three','two','each']){
      const run=runs[variant],now=run.summary;
      const win=run.windows[3],base=original.windows[3];
      const diff={openingGain:win.openings-base.openings,
        families:now.families-ref.families,
        recalls:now.scheduled-ref.scheduled,
        minorReplies:win.minorReplies-base.minorReplies,
        themes:now.themes-ref.themes,
        highEarly:run.windows.slice(0,2).reduce((a,x)=>a+x.highLevel,0)-
          original.windows.slice(0,2).reduce((a,x)=>a+x.highLevel,0)};
      const first20=JSON.stringify(run.sessionIds.slice(0,20))===
        JSON.stringify(original.sessionIds.slice(0,20));
      const failures=[];
      if(!first20)failures.push('FIRST_20_CHANGED');
      if(now.duplicateSessions||now.recentReuse||now.wrongSources)
        failures.push('FAMILY_OR_SOURCE_ERROR');
      if(now.repeatedAnswers>ref.repeatedAnswers+1)failures.push('REPETITIVE_ANSWERS');
      if(diff.families< -3)failures.push('LOSS_OF_FAMILIES');
      if(diff.recalls< -2)failures.push('LOSS_OF_RECALLS');
      if(diff.minorReplies< -2)failures.push('LOSS_OF_MINOR_REPLIES');
      if(diff.themes<0)failures.push('THEME_COVERAGE_LOSS');
      if(diff.highEarly>0)failures.push('EARLY_COMPLEXITY');
      if(diff.openingGain<2)failures.push('INSUFFICIENT_OPENING_GAIN');
      candidates[variant]={summary:now,window21to30:win,delta:diff,
        first20Unchanged:first20,guardPass:failures.length===0,
        guardFailures:failures,openingsBySession:run.openingsBySession};
    }
    rows.push({profile,seed,
      reference:{summary:original.summary,window21to30:original.windows[3],
        openingsBySession:original.openingsBySession},
      availableOpeningStock21to30:stocks(catalog,annotations,params),
      candidates});
  }
  const digest={};
  for(const k of ['three','two','each']){
    const results=rows.map(r=>r.candidates[k]);
    const range=fn=>[Math.min(...results.map(fn)),Math.max(...results.map(fn))];
    digest[k]={pass:results.filter(x=>x.guardPass).length,
      openingGain:range(x=>x.delta.openingGain),
      familyDelta:range(x=>x.delta.families),
      recallDelta:range(x=>x.delta.recalls),
      failed:rows.filter(r=>!r.candidates[k].guardPass)
        .map(r=>({profile:r.profile,seed:r.seed,
          reasons:r.candidates[k].guardFailures}))};
  }
  return {schema:'QPJB_AO_ROTATION_1',catalog:1523,profiles:9,
    sessions:45,onlyPost20:true,minGap:MIN_GAP,originalUntouched:true,
    artificialResponses:true,canRecommend:undefined,digest,rows};
}
if(require.main===module){
  const result=matrix(),outfile=process.argv.find(x=>x.startsWith('--output='));
  if(outfile)fs.writeFileSync(outfile.slice(9),JSON.stringify(result,null,2));
  console.log('QPJB-AO-DIGEST '+JSON.stringify(result.digest));
  console.log('QPJB-AO-STOCK '+JSON.stringify(result.rows[0].availableOpeningStock21to30));
  console.log('QPJB-AO-BASE '+JSON.stringify(result.rows.map(r=>({
    profile:r.profile,seed:r.seed,openings:r.reference.window21to30.openings,
    uniqueFamilies:r.reference.summary.families,scheduled:r.reference.summary.scheduled}))));
}
module.exports={createEngine,audit,stocks,matrix};

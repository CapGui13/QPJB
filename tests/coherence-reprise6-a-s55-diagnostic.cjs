'use strict';
// Counterfactual diagnostics only; never use modified histories for student selection.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const C=require('./coherence-concrete-m6-campaign.cjs'),T=require('../quizz-coherence-m6-traces.js'),L=require('../quizz-coherence-reprise6-a-lookahead.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa',root=path.resolve(__dirname,'..');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const src=Object.fromEntries(git('ls-tree','--name-only',BASE).trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js').map(p=>[p,git('show',BASE+':'+p)]));
const old=src['quizz-parcours.js'];
function inject(source,anchor,replacement){assert.equal(source.split(anchor).length,2,'anchor '+anchor);return source.replace(anchor,replacement)}
// Observational hook inserted after the native ranking and before its tie-break.
let observed=inject(old,'      if(m1Choice||m4Choice)reportDecision','      if(typeof options.diagnosticSlot===\'function\')options.diagnosticSlot({session:s+1,category,priority,forcedReason,selected:selected.map(x=>x.exercise.id),chosen:q.id,ranked:ranked.map(({q,v})=>({id:q.id,v,family:family(q),concept:mOf(q).concept,fresh:fresh(q),novel:novelFamily(q),oldFamily:oldFamily(q),due:!!due(q),bad:!!bad(q),classification:classify(q),stratum:stratum(q)})),evidence:{lastFamily:e.lastFamily,lastConcept:e.lastConcept,localTargets:Object.fromEntries(e.localTargets),weakConcept:e.weakConcept,weakContext:e.weakContext}});\n      if(m1Choice||m4Choice)reportDecision');
const e=C.engine({...src,'quizz-parcours.js':observed}),control=C.engine(src),{api,exercises,meta}=e;
const full={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
const copy=x=>JSON.parse(JSON.stringify(x)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),ids=d=>d.map(q=>q.id),sort=d=>ids(d).sort(),byId=new Map(exercises.map(q=>[q.id,q]));
const watched=['SEF-V416-002','SEF-044-1','SEF-V49-037'];
const qinfo=Object.fromEntries(watched.map(id=>{const q=byId.get(id);return [id,{family:q.caseFamily,concept:meta.byId[id].concept,auction:q.auction,answer:q.answer,h:q.h,shape:q.shape,difficulty:q.difficulty,context:q.context}]}));
function compact(slot){
 const w=slot.ranked.filter(r=>watched.includes(r.id));return {session:slot.session,category:slot.category,priority:slot.priority,forcedReason:slot.forcedReason,selected:slot.selected,chosen:slot.chosen,count:slot.ranked.length,top:slot.ranked.slice(0,8),watched:w,watchedFamilies:Object.fromEntries(watched.map(id=>[id,slot.evidence.lastFamily[qinfo[id].family]??null])),redTarget:slot.evidence.localTargets['red.base'],redLast:slot.evidence.lastConcept['red.base'],redWeak:slot.evidence.weakConcept['red.base']||0};
}
function run(v,engine=e){
 const {api,exercises,meta}=engine,state=api.empty(),sessions=[],states={},slots={},decisions=[];
 for(let s=1;s<=57;s++){
  engine.clock(s*86400000);
  if([5,54,55,56,57].includes(s))states[s]=copy(state);
  const p=v==='native'?null:L.prepare({api,state,exercises,metadataById:meta.byId,options:full,variant:v});
  const settings={...full,...(p?{coherenceM1:p.policy}:{})};
  if([5,55,57].includes(s)){slots[s]=[];settings.diagnosticSlot=slot=>slots[s].push(compact(slot));}
  const deck=api.start(state,exercises,settings);
  assert.equal(deck.length,10);assert.equal(new Set(ids(deck)).size,10);assert(api.eligibilityBatch(deck,state,exercises).every(x=>x.eligible));
  if(p?.decision)decisions.push(p.decision);
  const rows=deck.map((q,i)=>{const a=T.outcome('intermediaire',103,q,s),choice=a.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);assert(api.record(state,q,a.result,i,choice,a.assisted,a.hadFreeError));return {id:q.id,concept:meta.byId[q.id].concept,...a,choice,selection:state.active.selection[i]}});
  assert(api.finish(state,exercises));sessions.push(rows);
 }
 return {sessions,states,slots,decisions};
}
const native=run('native'),candidate=run('lookahead-context'),plain=run('native',control);
assert.deepEqual(native.sessions,plain.sessions,'observation must not perturb selection');
function sameSet(a,b){return sort(a).join()===sort(b).join()}
const diffs=native.sessions.flatMap((rows,i)=>sameSet(rows,candidate.sessions[i])?[]:[{s:i+1,removed:rows.filter(r=>!candidate.sessions[i].some(x=>x.id===r.id)),added:candidate.sessions[i].filter(r=>!rows.some(x=>x.id===r.id))}]);
assert.equal(diffs[0].s,5);assert.equal(diffs[1].s,55);assert.equal(diffs[2].s,57);
for(let s=6;s<=54;s++)for(const r of native.sessions[s-1]){const n=candidate.sessions[s-1].find(x=>x.id===r.id);assert(n);for(const k of ['result','assisted','hadFreeError'])assert.equal(n[k],r[k]);}
const b=native.states[55],a=candidate.states[55],keys=[...new Set([...Object.keys(b),...Object.keys(a)])],stateDiff=keys.filter(k=>!eq(b[k],a[k]));
const entryDiff=[...new Set([...Object.keys(b.entries),...Object.keys(a.entries)])].filter(k=>!eq(b.entries[k],a.entries[k]));
const journalDiff=b.journal.flatMap((row,i)=>eq(row,a.journal[i])?[]:[{s:row.session,sameSet:sameSet(row.answers,a.journal[i].answers)}]);
function probe(label,state){
 e.clock(55*86400000);const slots=[],snapshot=JSON.stringify(state);
 const deck=api.select(exercises,state,10,{...full,diagnosticSlot:x=>slots.push(compact(x))});assert.equal(JSON.stringify(state),snapshot);
 return {label,ids:ids(deck),matchesNative:sameSet(deck,native.sessions[54]),matchesCandidate:sameSet(deck,candidate.sessions[54]),slots};
}
// Replace only fields on isolated copies; these states are deliberately NOT
// eligible for use or import in production. No evidence is written to real arms.
const probes=[probe('native',copy(b)),probe('candidate',copy(a))];
for(const fields of [['entries'],['journal'],['skills'],['micros','axes'],['entries','journal'],['entries','journal','skills','micros','axes']]){
 const s=copy(a);for(const f of fields)s[f]=copy(b[f]);probes.push(probe('candidate + native '+fields.join('+'),s));
}
const reverse=copy(b);reverse.entries=copy(a.entries);probes.push(probe('native + candidate entries',reverse));
const output={base:BASE,head:git('rev-parse','HEAD').trim(),qinfo,diffs,stateDiff,entryDiff,journalDiff,entries:Object.fromEntries(entryDiff.map(k=>[k,{native:b.entries[k]||null,candidate:a.entries[k]||null}])),probes,nativeSlots:native.slots,candidateSlots:candidate.slots,states:{native:native.states,candidate:candidate.states}};
const dest=process.argv[2]||'s55-diagnostic';fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'diagnostic.json'),JSON.stringify(output));
const summary={diffs:diffs.map(x=>({s:x.s,removed:ids(x.removed),added:ids(x.added)})),stateDiff,entryDiff,journalDiff:journalDiff.length,watched:qinfo,probes:probes.map(p=>({label:p.label,base:p.matchesNative,alternative:p.matchesCandidate,chosen:p.ids.filter(id=>watched.includes(id)),slots:p.slots.filter(s=>watched.includes(s.chosen)).map(x=>({category:x.category,chosen:x.chosen,watched:x.watched,families:x.watchedFamilies,target:x.redTarget}))}))};
fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));

'use strict';
// Adaptateur de banc : charge les blobs de la base, injecte seulement les
// deltas après les filtres de choose(), avant le tri. Jamais en production.
function engineFrom({engine,pre,plan},policy,observe){
  const modules={};
  function load(name,source){
    const m={exports:{}};
    new Function('module','require','policy','observe',source)(m,p=>{
      if(!Object.hasOwn(modules,p))throw Error('unknown dependency '+p);
      return modules[p];
    },policy,observe);
    modules[name]=m.exports;return m.exports;
  }
  const metadata=load('./quizz-prerequis.js',pre).byId;
  load('./quizz-session-plan.js',plan);
  const marker='const ranked=candidates.map(q=>({q,v:score(q,category)}));';
  const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
  function replaceOnce(s,a,b){
    if(s.split(a).length!==2)throw Error('base incompatible: '+a);
    return s.replace(a,b);
  }
  let source=replaceOnce(engine,marker,`const deltas=policy&&forcedReason!=='rappel_erreur_aide'?
    new Map(policy.rank({session:s+1,candidates,metadataById:prerequis.byId,history:state,
      selected,category}).map(x=>[x.id,x.delta])):new Map();
    const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)}));`);
  source=replaceOnce(source,end,`if(observe)observe({session:s+1,selected,eligible:selected.every(v=>evaluate(v.exercise,state,e).eligible),pool});
    `+end);
  return {api:load('./quizz-parcours.js',source),metadata};
}
const foundation=['ouv.sa1','ouv.sa2','ouv.majeure','ouv.mineure','ouv.passe','mineur.base','mineur.soutien','majeur.base','majeur.soutien','sa1.seuil','sa2.seuil','red.base','red.bicolore','second.base','apres_fit.base','sa1.stayman','sa1.texas','sa1.stayman.reponse','intervenir.base','contre.base','reponse_inter.base','apres_inter.base','barrage.ouverture','reveil.base'];
const profiles=['autonome','intermediaire','faible','ciblee','aide'];
const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function answer(profile,seed,q,s){
  const v=hash(seed+'|'+s+'|'+q.id+'|result')/4294967296;
  const help=hash(seed+'|'+s+'|'+q.id+'|help')/4294967296;
  let p=profile==='autonome'?1:profile==='intermediaire'?.67:profile==='faible'?.30:profile==='ciblee'?(['contre','intervenir','apres_inter','reponse_inter'].includes(q.theme)?.25:.85):.75;
  if(profile!=='autonome')p=Math.max(.08,p-.05*(q.difficulty-1));
  return {result:v<p?'correct':'wrong',assisted:profile==='aide'&&help<.55,hadFreeError:profile==='aide'&&help>=.55&&help<.65};
}
function run(blobs,cat,policy,profile,seed,horizon=153){
  let obs;const {api,metadata}=engineFrom(blobs,policy,x=>obs=x);
  const state=api.empty(),families=new Set(),ids=new Set(),themes=new Set(),seen=new Map(),proof=new Map(),last=new Map();
  const byId=new Map(cat.map(q=>[q.id,q]));let phase={gapDays:0,advancedWithoutProof:0,advancedFirst:0,discovery:0,hard:0,weak:0,duplicates:0,violations:0,mirror:0,decisionRepeat:0,localJumps:0,firstByConcept:{},gapByConcept:{},phaseFamilies:new Set(),phaseConcepts:new Set(),difficulty:[0,0,0,0,0],reasons:{}};
  const snapshots={},boundary={};let violations=0,short=0,duplicate=0;
  let t=Date.now();
  function snap(s){
    return {families:families.size,ids:ids.size,themes:themes.size,concepts:seen.size,proofConcepts:proof.size,violations,short,duplicate,firstByConcept:Object.fromEntries([...seen].map(([k,v])=>[k,v.first]))};
  }
  for(let s=1;s<=horizon;s++){
    const deck=api.start(state,cat),inPhase=s>=21&&s<=65;
    if(!obs||obs.session!==s||!obs.eligible)violations++;
    if(deck.length!==10)short++;
    if(new Set(deck.map(q=>q.caseFamily||q.id)).size!==deck.length)duplicate++;
    if([20,21,65,66].includes(s))boundary[s]=deck.map(q=>q.id);
    const sc=new Set();
    if(inPhase){
      const eligibleConcepts=new Set(obs.pool.map(q=>metadata[q.id].concept));
      for(const k of foundation)if(last.has(k)&&eligibleConcepts.has(k)&&s-last.get(k)>8)phase.gapDays++;
      if(!obs.eligible)phase.violations++;
      phase.duplicates+=deck.length-new Set(deck.map(q=>q.caseFamily||q.id)).size;
      for(let i=1;i<deck.length;i++){
        const a=deck[i-1],b=deck[i];
        if(a.answer===b.answer)phase.decisionRepeat++;
        if(a.theme===b.theme&&a.answer!==b.answer&&String(a.answer).replace(/[♥♠♣♦]/g,'X')===String(b.answer).replace(/[♥♠♣♦]/g,'X'))phase.mirror++;
      }
    }
    const before=new Set(seen.keys());
    for(let i=0;i<deck.length;i++){
      const q=deck[i],m=metadata[q.id],k=m.concept,f=q.caseFamily||q.id,a=answer(profile,seed,q,s);
      if(inPhase){
        phase.phaseFamilies.add(f);phase.phaseConcepts.add(k);phase.difficulty[q.difficulty-1]++;
        if(q.difficulty>=4)phase.hard++;
        if(a.result!=='correct'||a.assisted||a.hadFreeError)phase.weak++;
        if(!before.has(k)&&!sc.has(k)){
          phase.discovery++;phase.firstByConcept[k]=s;
          if(m.stage>=2){
            phase.advancedFirst++;
            if((m.requires||[]).some(r=>r.concept!==k&&!proof.has(r.concept)))phase.advancedWithoutProof++;
          }
        }
        if(last.has(k)&&!sc.has(k))phase.gapByConcept[k]=Math.max(phase.gapByConcept[k]||0,s-last.get(k));
        if(q.difficulty>=4&&!proof.has(k))phase.localJumps++;
        const why=state.active.selection[i].reason;phase.reasons[why]=(phase.reasons[why]||0)+1;
      }
      if(!seen.has(k))seen.set(k,{first:s});sc.add(k);
      ids.add(q.id);families.add(f);themes.add(q.theme);
      if(!api.record(state,q,a.result,i,a.result==='correct'?q.answer:null,a.assisted,a.hadFreeError))throw Error('record failed');
    }
    for(const k of sc)last.set(k,s);
    // Proofs from previous sessions only when measuring discovery risk.
    for(const q of deck){const a=answer(profile,seed,q,s),k=metadata[q.id].concept;if(a.result==='correct'&&!a.assisted&&!a.hadFreeError&&q.difficulty<=3){if(!proof.has(k))proof.set(k,new Set());proof.get(k).add(q.caseFamily||q.id)}}
    if(!api.finish(state,cat))throw Error('finish failed');
    if([20,65,153].includes(s))snapshots[s]=snap(s);
  }
  phase.phaseFamilies=phase.phaseFamilies.size;phase.phaseConcepts=phase.phaseConcepts.size;
  return {profile,seed,snapshots,phase,boundary,ms:Date.now()-t};
}
function compare(blobs,cat,policy,profile,seed,horizon=153){
  return {before:run(blobs,cat,null,profile,seed,horizon),after:run(blobs,cat,policy,profile,seed,horizon)};
}
function checkout(){
  const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'../../..');
  const get=p=>fs.readFileSync(path.join(root,p),'utf8');
  const blobs={engine:get('quizz-parcours.js'),pre:get('quizz-prerequis.js'),plan:get('quizz-session-plan.js')};
  const cat=JSON.parse(get('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
  if(cat.length!==1879)throw Error('catalogue non conforme');
  return {blobs,cat,policy:require(path.join(root,'quizz-pedagogie-intermediaire.js'))};
}
module.exports={engineFrom,run,compare,profiles,answer,checkout};
if(require.main===module){
  const {blobs,cat,policy}=checkout();
  const selected=process.argv[2]?[process.argv[2]]:profiles;
  const seeds=process.argv[3]?[Number(process.argv[3])]:[11,47,103];
  const rows=[];for(const p of selected)for(const s of seeds)rows.push(compare(blobs,cat,policy,p,s));
  console.log(JSON.stringify(rows,null,2));
}

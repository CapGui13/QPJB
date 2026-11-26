'use strict';
// Banc isolé : le moteur et le catalogue ne sont jamais réécrits sur disque.
const BASE='dc5ecced63716672813905472bf32c4505253665';
const PROFILES=['autonome','modere','faible','cible','aide','faiblesse_passe'];
const SEEDS=[11,47,103], HORIZONS=[20,65,153];
const FOUNDATIONS=['ouv','majeur','mineur','sa','red','second','stayman'];
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>q.caseFamily||q.id;
const pass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const weak=a=>a.result!=='correct'||a.assisted||a.hadFreeError;
function makeEngine(source,meta,plan){
  if(plan){
    const from=`const priorities=ROADMAP.filter(([t,intro])=>s>=intro&&
        ((!Object.hasOwn(e.lastTheme,t)&&s-intro>=2)||
        (FOUNDATIONS.includes(t)&&Object.hasOwn(e.lastTheme,t)&&s-e.lastTheme[t]>=6)))
        .sort(([a,ia],[b,ib])=>(s-(e.lastTheme[b]??ib-1))-(s-(e.lastTheme[a]??ia-1)));`;
    assert(source.split(from).length===2,'Exact historical selector hook not found');
    source=source.replace(from,`const priorities=M3.priorityThemes({roadmap:ROADMAP,completed:s,lastTheme:e.lastTheme,eligibleThemes:pool.map(q=>q.theme)});`);
  }
  // Batch diagnostic identical to the existing public eligibility method,
  // but compute immutable pre-session evidence only once for the ten cases.
  const diagnosticMarker='return {eligibility,createForTests:';
  assert(source.split(diagnosticMarker).length===2,'Exact diagnostic hook not found');
  source=source.replace(diagnosticMarker,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,createForTests:');
  const module={exports:{}};
  new Function('module','require','M3',source)(module,name=>{
    assert(name==='./quizz-prerequis.js','Unexpected module '+name);return meta;
  },plan);
  return module.exports;
}
function run(api,qs,meta,profile,seed,horizon=153){
  const st=api.empty(),first={},last={},gaps={},fam=new Set,concept=new Set,ids=new Set;
  const firstConcept={},difficultyCounts={},stageCounts={},answers=new Set,auctions=new Set;let maxSameTheme=0;
  const exposed=new Map,byId=new Map(qs.map(q=>[q.id,q])),pending=new Map,delays=[];
  let adj=0,triple=0,hard=0,violations=0,repeat=0,shapeAdj=0,forceAdj=0,discovery=0,maintenance=0,weakness=0,transfer=0;
  let n=seed;const rng=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
  const out=[],t=Date.now();
  for(let s=0;s<horizon;s++){
    const deck=api.start(st,qs),sel=st.active.selection,counts={},diagnostics=api.eligibilityBatch(deck,st,qs);
    assert(deck.length===10&&new Set(deck.map(q=>q.id)).size===10&&new Set(deck.map(family)).size===10,'Distinct ten S'+(s+1));
    assert(sel.every((x,i)=>x.id===deck[i].id),'Selection alignment');
    if(s===0||s===19||s===64){
      const resumed=api.load(JSON.stringify(st));assert(JSON.stringify(resumed.active)===JSON.stringify(st.active),'Resume');
      assert(api.start(resumed,qs).map(q=>q.id).join()===deck.map(q=>q.id).join(),'Resume IDs');
    }
    const pp=deck.flatMap((q,i)=>pass(q)?[i]:[]);
    if(s===0){
      assert(deck.every(q=>q.theme==='ouv'&&q.difficulty===1),'S1');
      assert(pp.length===3&&pp.every((p,i)=>p<=[1,4,6][i]&&(!i||p-pp[i-1]>=2)&&deck[p].h<12),'S1 passes');
      for(const [b,k] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])assert(deck.filter(q=>bid(q)===b).length>=k,'S1 balance');
    }else{
      const weakPass=(st.micros?.['ouv:passe']?.score||0)<0||
       (st.journal||[]).filter(e=>e.mode==='parcours'&&s-e.session+1<=3).some(e=>e.answers.some(a=>byId.has(a.id)&&pass(byId.get(a.id))&&st.entries[a.id]&&weak(st.entries[a.id])));
      assert(pp.length<=(s===2?1:weakPass?2:1),'Pass cap S'+(s+1));
      if(s===1){
        assert(pp.length>=1&&pp.every((p,i)=>p<=[3,6][i]&&(!i||p-pp[i-1]>=2)),'S2 passes');
        assert(['1♣','1♦'].every(b=>deck.some(q=>q.theme==='ouv'&&bid(q)===b)),'S2 minors');
        assert(deck.filter(q=>['majeur','mineur'].includes(q.theme)).length>=6,'S2 responses');
        for(const [theme,b] of [['mineur','1♣'],['mineur','1♦'],['majeur','1♥'],['majeur','1♠']])assert(deck.some(q=>q.theme===theme&&String(q.auction?.[0]||'').includes(b)),'S2 context');
      }
    }
    for(let i=0;i<deck.length;i++){
      const q=deck[i],m=meta.byId[q.id],k=m.concept;
      if(!m||s<m.minSession||s<api.INTRO[q.theme]||m.requires.some(r=>(exposed.get(r.concept)?.size||0)<r.minExposure)||!diagnostics[i].eligible)violations++;
      counts[q.theme]=(counts[q.theme]||0)+1;first[q.theme]??=s+1;firstConcept[k]??=s+1;
      difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]||0)+1;stageCounts[m.stage]=(stageCounts[m.stage]||0)+1;
      answers.add(bid(q));auctions.add(JSON.stringify(q.auction||[]));
      if(fam.has(family(q)))repeat++;fam.add(family(q));concept.add(k);ids.add(q.id);hard+=+(q.difficulty>=4);
      if(i&&bid(q)===bid(deck[i-1]))adj++;
      if(s&&i>=2&&q.theme===deck[i-1].theme&&q.theme===deck[i-2].theme)triple++;
      if(i&&q.shape&&q.shape.join()===deck[i-1].shape?.join())shapeAdj++;
      if(i&&Number.isInteger(q.h)&&q.h===deck[i-1].h)forceAdj++;
      if(pending.has(q.id)){delays.push(s-pending.get(q.id));pending.delete(q.id)}
      const reason=sel[i].reason;
      if(reason==='renforcement_lacune'||reason==='rappel_erreur_aide')weakness++;
      else if(reason==='transfert_contexte')transfer++;
      else if(sel[i].kind==='revision')maintenance++;
      else discovery++;
    }
    maxSameTheme=Math.max(maxSameTheme,...Object.values(counts));
    for(const theme of Object.keys(api.INTRO)){
      if(last[theme]!==undefined)gaps[theme]=Math.max(gaps[theme]||0,s-last[theme]);
      if(counts[theme])last[theme]=s;
    }
    for(let i=0;i<deck.length;i++){
      const q=deck[i],k=meta.byId[q.id].concept,u=rng(),v=rng();
      const wrong=u<(profile==='autonome'?0:profile==='modere'?.33:profile==='faible'?.94:profile==='cible'?(q.theme==='sa'?.9:.12):profile==='faiblesse_passe'?(pass(q)?1:0):.15);
      const assisted=profile==='aide'&&v<.72;
      assert(api.record(st,q,wrong?'wrong':'correct',i,null,assisted,false),'record');
      if(wrong||assisted)if(!pending.has(q.id))pending.set(q.id,s);
      if(!exposed.has(k))exposed.set(k,new Set);exposed.get(k).add(q.id);
    }
    assert(api.finish(st,qs),'finish');
    if(HORIZONS.includes(s+1)){
      const gf=Math.max(0,...FOUNDATIONS.map(k=>gaps[k]||0)),go=Math.max(0,...Object.entries(gaps).filter(([k])=>!FOUNDATIONS.includes(k)).map(([,v])=>v));
      const sorted=delays.slice().sort((a,b)=>a-b);
      out.push({horizon:s+1,first:{...first},firstConcept:{...firstConcept},difficultyCounts:{...difficultyCounts},stageCounts:{...stageCounts},distinctAnswers:answers.size,distinctAuctions:auctions.size,maxSameTheme,gaps:{...gaps},gf,go,families:fam.size,concepts:concept.size,ids:ids.size,hard,adj,triple,shapeAdj,forceAdj,repeat,discovery,maintenance,weakness,transfer,violations,pending:pending.size,medianDelay:sorted.length?sorted[Math.floor((sorted.length-1)/2)]:null,p90Delay:sorted.length?sorted[Math.floor((sorted.length-1)*.9)]:null,ms:Date.now()-t});
    }
  }
  return out;
}
module.exports={BASE,PROFILES,SEEDS,HORIZONS,makeEngine,run};
if(typeof require==='function'&&require.main===module){
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root=path.join(__dirname,'..');
  const historical=p=>require('node:child_process').execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
  const html=historical('quizz.html'),source=historical('quizz-parcours.js');
  const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
  // Require exact current base: no stale goldens or synthetic substitutes.
  assert(blob(html)==='5307457d7ad6c57af890a3e17acc36174213090b','catalogue SHA');
  assert(blob(source)==='e32bccd3cae340b6cf8d7c3d385b101de2c927fe','engine SHA');
  assert(blob(fs.readFileSync(path.join(root,'quizz-prerequis.js'),'utf8'))==='d1d8ad465461df20eb26eb2e5a10746ad6b7b48a','metadata SHA');
  const data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  assert(data.exercises.length===1879&&data.themes.length===22,'catalogue dimensions');
  const meta=require('../quizz-prerequis.js'),plan=require('../quizz-session-plan.js');
  const before=makeEngine(source,meta),after=makeEngine(source,meta,plan);
  const args=process.argv.slice(2),rows=[];
  for(const profile of PROFILES.filter(p=>!args[0]||args[0]===p))for(const seed of SEEDS.filter(s=>!args[1]||Number(args[1])===s)){
    const horizon=args[2]?Number(args[2]):153;assert(HORIZONS.includes(horizon),'horizon');
    const a=run(before,data.exercises,meta,profile,seed,horizon),b=run(after,data.exercises,meta,profile,seed,horizon);
    rows.push({profile,seed,before:a,after:b});
  }
  console.log(JSON.stringify(rows,null,2));
}

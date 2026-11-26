'use strict';
// M1 #419/#420. Exécuter depuis un checkout de la base + les nouveaux fichiers.
// node tests/coherence-concrete-m1-bench.cjs [profil|all] [seed|all] [horizon] [fichier JSON]
// Le seul changement de sélection est l'injection additive au point de tri de choose().
const BASE='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'],SEEDS=[11,47,103],HORIZONS=[5,20,65,153,180];
const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const ok=(x,m)=>{if(!x)throw Error(m)};
const same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>String(q.caseFamily||q.id);
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const opener=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1]||'';
const fit=q=>q.theme==='majeur'&&q.auction?.length===1&&/^1[♥♠]$/.test(opener(q))&&bid(q)==='2'+opener(q)[1];
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
function outcome(profile,seed,q,s){
 const u=hash(q.id+'|'+s+'|'+seed),v=hash('a|'+q.id+'|'+s+'|'+seed);
 const probability=profile==='autonome'?0:profile==='intermediaire'?.33:
 profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):
 profile==='passe'?(openingPass(q)?.9:.1):.15;
 return {wrong:u<probability,help:profile==='aide'&&v<.6};
}
function compile(source,req){const m={exports:{}};new Function('module','require',source)(m,req);return m.exports}
// Single injection shared by Node and browser. V1/V2 unchanged when compose is absent.
function sourceFor(source,after,diagnostics=true){
 const anchor='const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)}));';
 const tail='return {eligibility,adaptiveDiagnostics,createForTests:';
 const counter='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const sort='ranked.sort((a,b)=>b.v-a.v||hash(a.q.id+\'#\'+s)-hash(b.q.id+\'#\'+s)||a.q.id.localeCompare(b.q.id));';
 const picked='const m=mOf(q),cat=category||classify(q);';
 for(const key of [anchor,tail,counter,sort,picked])ok(source.split(key).length===2,'Exact base anchor '+key);
 const extra='const m1Context={session:s+1,candidates,metadataById:prerequis.byId,history:state,selected,category:category||null,priority,forcedReason};\n      const m1Deltas=new Map(curriculum.rank(m1Context).map(r=>[r.id,r.delta]));\n      const ranked=curriculum.prefer(m1Context).map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)+(m1Deltas.get(q.id)||0)}));';
 const hook=`
      let m1Choice=null;
      if(typeof curriculum.compose==='function'&&s>=2&&s<65&&!m1Changed){
        const flagsById=Object.fromEntries(ranked.map(({q})=>[q.id,{due:!!due(q),bad:!!bad(q),novelFamily:novelFamily(q),firstConcept:!e.seen.has(mOf(q).concept),overdueCore:oldConcept(q)>=5,stage:mOf(q).stage}]));
        m1Choice=curriculum.compose({...m1Context,changed:m1Changed,flagsById},ranked);
        if(m1Choice){
          const index=ranked.findIndex(x=>x.q.id===m1Choice.id);
          if(index<1)throw Error('M1 returned an invalid alternate');
          ranked.unshift(...ranked.splice(index,1));m1Changed=true;
        }
      }`;
 const event=`
      if(typeof observe==='function'&&m1Choice)observe({session:s+1,category,actualId:q.id,...m1Choice});
      `;
 const latePool=`
      if(typeof observe==='function'&&[44,54,55,59].includes(s+1)){
        const objective=curriculum.curriculum[s],keys=[...objective.primary,...objective.secondary];
        const count=xs=>Object.fromEntries(keys.map(k=>[k,xs.filter(v=>mOf(v).concept===k).length]));
        observe({session:s+1,category:category||null,priority:!!priority,forcedReason:forcedReason||null,primaryPool:count(pool),candidatePool:count(candidates),winner:q.id});
      }
      `;
 const diagnostic='return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:';
 let src=source;
 if(after)src=src.replace(counter,counter+' let m1Changed=false;').replace(anchor,extra).replace(sort,sort+hook).replace(picked,event+picked);
 if(diagnostics)src=src.replace(picked,latePool+picked).replace(tail,diagnostic);
 return src;
}
function instrument(source,req,curriculum,after){
 const events=[],m={exports:{}};
 new Function('module','require','curriculum','observe',sourceFor(source,after))(m,req,curriculum,event=>events.push(event));
 m.exports.m1Events=events;
 return m.exports;
}
function verifyEarly(deck,s){
 const pp=deck.flatMap((q,i)=>openingPass(q)?[i]:[]);
 if(s===0){
   ok(deck.every(q=>q.theme==='ouv'&&q.difficulty===1),'S1 fundamental');
   ok(pp.length===3&&pp.every((v,i)=>v<=[1,4,6][i]&&(!i||v-pp[i-1]>=2)&&deck[v].h<12),'S1 passes');
   for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])ok(deck.filter(q=>bid(q)===a).length>=n,'S1 '+a);
 }
 if(s===1){
   ok(pp.length>=1&&pp.length<=2&&pp.every((v,i)=>v<=[3,6][i]&&(!i||v-pp[i-1]>=2)),'S2 passes');
   ok(deck.slice(0,2).every(q=>q.theme==='ouv'&&!openingPass(q)),'S2 openings');
   const supports=deck.flatMap((q,i)=>fit(q)?[i]:[]);
   ok(supports.length>=2&&supports.every(i=>deck[i].shape[bid(deck[i])==='2♠'?0:1]===3),'S2 fit 5-3');
   const ties=deck.filter(q=>q.theme==='ouv'&&q.shape?.[2]===q.shape?.[3]&&[3,4].includes(q.shape[2]));
   ok(ties.some(q=>q.shape[2]===3&&bid(q)==='1♣')&&ties.some(q=>q.shape[2]===4&&bid(q)==='1♦'),'S2 meilleure mineure');
   ok(supports.every((v,i)=>!i||v-supports[i-1]>1),'S2 supports séparés');
 }
 if(s===2)ok(pp.length<=1,'S3 passe');
 if(s>2)ok(pp.length<=2,'Later opening passe');
}
function run(api,peer,curriculum,meta,qs,profile,seed,horizon){
 const state=api.empty(),families=new Set(),ids=new Set(),concepts=new Set(),themes=new Set(),last=new Map(),first=new Map(),proof=new Map(),pending=new Map(),delays=[];
 const trace=[],checkpoints=[];let debt=0,conceptDebt=0,hard=0,mirrors=0,repeat=0,recalls=0,focus=0,focusSlots=0,wrongCount=0,assistCount=0;
 const clock=()=>typeof performance!=='undefined'?performance.now():Date.now();const start=clock();
 for(let s=0;s<horizon;s++){
   const begin=clock(),deck=api.start(state,qs),selection=state.active.selection,ms=clock()-begin;
   ok(deck.length===10,'Short S'+(s+1));ok(new Set(deck.map(q=>q.id)).size===10&&new Set(deck.map(family)).size===10,'Duplicate S'+(s+1));
   same(selection.map(x=>x.id),deck.map(q=>q.id),'Selection alignment');
   ok(api.eligibilityBatch(deck,state,qs).every(v=>v.eligible),'Eligibility S'+(s+1));verifyEarly(deck,s);
   const p=curriculum.curriculum[s],cs={};
   for(const [c,at] of last){if(CORE.has(c)&&s-at>8)debt++;if(s-at>20)conceptDebt++;}
   let n=0;
   const items=deck.map((q,i)=>{
     const m=meta.byId[q.id],c=m.concept,role=curriculum.role({session:s+1,metadataById:meta.byId},q),v=selection[i],o=outcome(profile,seed,q,s);
     cs[c]=(cs[c]||0)+1;families.add(family(q));if(ids.has(q.id))repeat++;ids.add(q.id);concepts.add(c);themes.add(q.theme);last.set(c,s);if(!first.has(c))first.set(c,s+1);
     if(role==='objectif')n++;if(q.difficulty>=4)hard++;if(i&&bid(q)===bid(deck[i-1]))mirrors++;
     if(v.reason==='rappel_erreur_aide')recalls++;
     if(pending.has(q.id)){delays.push(s-pending.get(q.id));pending.delete(q.id)}
     if(o.wrong||o.help)pending.set(q.id,s);wrongCount+=+o.wrong;assistCount+=+o.help;
     if(!o.wrong&&!o.help){const pr=proof.get(c)||{families:new Set(),sessions:new Set()};pr.families.add(family(q));pr.sessions.add(s);proof.set(c,pr)}
     return {id:q.id,concept:c,level:q.difficulty,role,reason:v.reason,kind:v.kind,wrong:o.wrong,help:o.help};
   });
   if(p){focus+=Math.min(p.target,n);focusSlots+=p.target;}
   for(let i=0;i<deck.length;i++){
    const q=deck[i],o=items[i];ok(api.record(state,q,o.wrong?'wrong':'correct',i,null,o.help,false),'Record');
    if(i===0&&[0,2,4,19,64,152,179].includes(s)){
     const restored=peer.load(JSON.stringify(state));same(restored.active,state.active,'Active session intact');same(peer.start(restored,qs).map(v=>v.id),deck.map(v=>v.id),'Exact resumed IDs');
    }
   }
   ok(api.finish(state,qs),'Finish');
   trace.push({session:s+1,objective:p?.title||null,focusCount:n,target:p?.target||null,conceptCounts:cs,ms,items});
   if(HORIZONS.includes(s+1)){
     const sorted=delays.slice().sort((a,b)=>a-b);
     checkpoints.push({session:s+1,focus,focusSlots,ids:ids.size,families:families.size,concepts:concepts.size,themes:themes.size,proof:[...proof.values()].filter(x=>x.families.size>=2&&x.sessions.size>=2).length,debt,conceptDebt,hard,mirrors,repeat,recalls,medianRecall:sorted.length?sorted[Math.floor((sorted.length-1)/2)]:null,wrongCount,assistCount,first:Object.fromEntries(first),ms:clock()-start});
   }
 }
 return {trace,checkpoints,events:api.m1Events||[]};
}
function compare({source,req,curriculum,meta,qs},profile,seed,horizon=180){
 ok(PROFILES.includes(profile)&&SEEDS.includes(seed)&&HORIZONS.includes(horizon),'Invalid profile seed horizon');
 ok(qs.length===1915,'Catalogue size');ok(new Set(Object.values(meta.byId).map(m=>m.concept)).size===99,'Concept count');
 const a=instrument(source,req,curriculum,false),b=instrument(source,req,curriculum,true);
 const before=run(a,b,curriculum,meta,qs,profile,seed,horizon),after=run(b,a,curriculum,meta,qs,profile,seed,horizon);
 const review=[];
 for(let i=0;i<before.checkpoints.length;i++){const x=before.checkpoints[i],y=after.checkpoints[i],at=y.session;
  if(y.families<.95*x.families)review.push('S'+at+' families <95%');
  if(y.themes<x.themes)review.push('S'+at+' themes '+x.themes+' -> '+y.themes);
  if(at>=65&&x.proof-y.proof>Math.max(3,.1*x.proof))review.push('S'+at+' proofs '+x.proof+' -> '+y.proof);
  if(at>=65&&x.concepts-y.concepts>2)review.push('S'+at+' concepts '+x.concepts+' -> '+y.concepts);
  if(y.debt>x.debt+Math.max(10,.15*x.debt))review.push('S'+at+' debt '+x.debt+' -> '+y.debt);
  if(y.mirrors>x.mirrors+2)review.push('S'+at+' adjacent answers '+x.mirrors+' -> '+y.mirrors);
 }
 same(before.trace.slice(0,2).map(x=>x.items),after.trace.slice(0,2).map(x=>x.items),'S1/S2 exact');
 if(typeof curriculum.fitRole==='function'){
  const byId=new Map(qs.map(q=>[q.id,q]));
  const actual=side=>side.trace[2].items.filter(x=>curriculum.fitRole(byId.get(x.id))==='support-5-3').length;
  ok(actual(after)>=1&&actual(after)>=actual(before),'S3 true support 5–3 must not disappear');
 }
 return {profile,seed,horizon,before,after,review};
}
function questionDictionary(qs,meta,results){
 const used=new Set(results.flatMap(p=>[p.before,p.after].flatMap(b=>b.trace.flatMap(s=>s.items.map(x=>x.id)))));
 return Object.fromEntries(qs.filter(q=>used.has(q.id)).map(q=>[q.id,{hand:q.hand,h:q.h,shape:q.shape,auction:q.auction,context:q.context,answer:q.answer,theme:q.theme,family:family(q),level:q.difficulty,concept:meta.byId[q.id].concept}]));
}
module.exports={BASE,PROFILES,SEEDS,HORIZONS,compile,sourceFor,instrument,compare,questionDictionary};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
 const root=path.join(__dirname,'..'),old=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const source=old('quizz-parcours.js'),data=old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1],qs=JSON.parse(data).exercises;
 const cache={};function req(n){if(cache[n])return cache[n];ok(/^\.\/quizz-[a-z0-9-]+\.js$/.test(n),'Unexpected require '+n);return cache[n]=compile(old(n.slice(2)),req);}
 const meta=req('./quizz-prerequis.js'),curriculum=require(process.env.QPJB_M1_POLICY==='window'?'../quizz-coherence-m1-window.js':process.env.QPJB_M1_POLICY==='targeted'?'../quizz-coherence-m1-targeted.js':process.env.QPJB_M1_POLICY==='fit'?'../quizz-coherence-m1-fit.js':process.env.QPJB_M1_POLICY==='conditional'?'../quizz-coherence-m1-conditional.js':process.env.QPJB_M1_POLICY==='guarded'?'../quizz-coherence-m1-guarded.js':'../quizz-coherence-m1-curriculum.js');
 const profiles=process.argv[2]&&process.argv[2]!=='all'?[process.argv[2]]:PROFILES,seeds=process.argv[3]&&process.argv[3]!=='all'?[Number(process.argv[3])]:SEEDS,horizon=Number(process.argv[4]||180);
 const input={source,req,curriculum,meta,qs};
 const fixed=Date.UTC(2026,10,26,12);const now=Date.now;Date.now=()=>fixed;
 let results;try{results=profiles.flatMap(profile=>seeds.map(seed=>compare(input,profile,seed,horizon)));}finally{Date.now=now;}
 const report={base:BASE,policy:curriculum.policy||'initial-v1',profiles,seeds,horizon,results,questions:questionDictionary(qs,meta,results)};
 if(process.argv[5])fs.writeFileSync(process.argv[5],JSON.stringify(report));else console.log(JSON.stringify(report));
 if(results.some(p=>p.review.length))process.exitCode=2;
}

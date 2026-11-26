'use strict';
const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'../../..');
const policy=require(path.join(root,'quizz-pedagogie-initiation.js'));const prereq=require(path.join(root,'quizz-prerequis.js'));const plan=require(path.join(root,'quizz-session-plan.js'));
const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');const qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
function adapter(source){
 const anchor="const ranked=candidates.map(q=>({q,v:score(q,category)}));";
 if(source.split(anchor).length!==2)throw Error('Injection point changed');
 return source.replace(anchor,`const m1Delta = (!priority || s===0) && !explicitRecall ? new Map(initiation.rank({session:s+1,candidates,metadataById:prerequis.byId,history:state,selected,category}).map(x=>[x.id,x.delta])) : new Map();\n      const ranked=candidates.map(q=>({q,v:score(q,category)+(m1Delta.get(q.id)||0)}));`);
}
function benchmark(makeEngine,policy,qs,meta,horizon=21){
 const core=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296};
 const rows=[];
 for(const variant of ['base','candidate']){
  const engine=makeEngine(variant==='candidate'?policy:null);
  for(const profile of ['auto','middle','weak','target','help','pass'])for(const seed of [11,47,103]){
   const st=engine.empty(),first={},last={},gaps={},fam=new Set(),conceptFam={},theme=new Set(),ids=new Set(),diff={},pass=[],decks=[],lastFamily={},firstOther={};
   let invalid=0,short=0,duplicate=0,hard=0,repeated=0,gapEvents=0;const t=Date.now();
   for(let s=1;s<=horizon;s++){
    const deck=engine.start(st,qs);const local=new Set(),lf=new Set();let nPass=0;
    if(deck.length!==10)short++;
    for(const q of deck)if(!engine.eligibility(q,st,qs).eligible)invalid++;
    for(let i=0;i<deck.length;i++){
     const q=deck[i],m=meta[q.id],c=m.concept,f=q.caseFamily||q.id;
     if(local.has(q.id)||lf.has(f))duplicate++;local.add(q.id);lf.add(f);
     if(q.theme==='ouv'&&q.answer==='Passe')nPass++;
     fam.add(f);ids.add(q.id);theme.add(q.theme);(conceptFam[c]??=new Set()).add(f);
     first[c]??=s;if(conceptFam[c].size>=2)firstOther[c]??=s;
     if(last[c]!==undefined&&last[c]!==s){const gap=s-last[c];gaps[c]=Math.max(gaps[c]||0,gap);if(core.includes(c)&&gap>6)gapEvents++;}
     last[c]=s;if(lastFamily[f]!==undefined)repeated++;lastFamily[f]=s;
     diff[q.difficulty]=(diff[q.difficulty]||0)+1;if(q.difficulty>=4)hard++;
     const r=hash(`${seed}|${s}|${q.id}`),wrong=profile==='weak'?r<.75:profile==='middle'?r<.33:profile==='target'?r<(q.theme==='sa'?.8:.12):profile==='pass'?r<(q.theme==='ouv'&&q.answer==='Passe'?.9:.1):false;
     engine.record(st,q,wrong?'wrong':'correct',i,q.answer,profile==='help'&&r<.6,false);
    }
    pass.push(nPass);if(s<=3||[20,21,65,66,153].includes(s))decks.push({s,ids:deck.map(q=>q.id)});
    engine.finish(st,qs);
    if([20,21,65,153].includes(s)||s===horizon){
      const holes=core.filter(c=>first[c]).map(c=>Math.max(gaps[c]||0,s-last[c]));
      rows.push({variant,profile,seed,s,uniqueFamilies:fam.size,uniqueIds:ids.size,themes:theme.size,concepts:Object.keys(first).length,first:{...first},firstOther:{...firstOther},coreGapMax:Math.max(...holes,0),coreGapSum:holes.reduce((a,b)=>a+b,0),gapEvents,tailHoles:core.filter(c=>first[c]&&s-last[c]>6).length,hard,invalid,short,duplicate,difficulty:{...diff},repeated,pass:pass.slice(0,3),decks:[...decks],conceptFamilies:Object.fromEntries(Object.entries(conceptFam).map(([k,v])=>[k,v.size])),elapsedMs:Date.now()-t});
    }
   }
  }
 }
 return rows;
}
const make=pol=>{const module={exports:{}};new Function('module','require','initiation',pol?adapter(source):source)(module,p=>p.includes('prerequis')?prereq:plan,pol);return module.exports;};
const rows=benchmark(make,policy,qs,prereq.byId,Number(process.argv[2]||21));console.log(JSON.stringify(rows,null,2));

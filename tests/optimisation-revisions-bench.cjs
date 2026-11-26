'use strict';
// Exact engine source is loaded without changing its production file.
// A/B are isolated candidates; all eligibility, quotas, state and ordering stay V1.
function compile(source,meta,policy,mode){
  function replaceOnce(s,a,b){
    if(s.split(a).length!==2)throw Error('M2 injection anchor changed: '+a);
    return s.replace(a,b);
  }
  if(mode==='A'||mode==='B'){
    source=replaceOnce(source,'let pool=eligiblePool(exercises,state,e);','let pool=eligiblePool(exercises,state,e);');
    source=replaceOnce(source,"const quotas=profile==='weak'?", "const revision=__policy.prepare({state,metadata:prerequis.byId,exercises,candidates:pool,mode:__mode});\n    const quotas=profile==='weak'?");
    source=replaceOnce(source,'return value;\n    }\n    function choose','return value+(s>=3?revision.bonus(q,category,concepts):0);\n    }\n    function choose');
    source=replaceOnce(source,"if(!choose(pool.filter(q=>due(q)&&bad(q)),'weakness','rappel_erreur_aide'))break;",
      "if(!choose(s>=3?revision.recall(pool,concepts):pool.filter(q=>due(q)&&bad(q)),'weakness','rappel_erreur_aide'))break;");
    source=replaceOnce(source,"const kind=!isFresh||isAlternate?'revision':'nouveau';",
      "const alternateRecall=s>=3&&isFresh&&forcedReason==='rappel_erreur_aide'&&revision.rank(q,{})?.variant;\n      const kind=!isFresh||isAlternate||alternateRecall?'revision':'nouveau';");
    source=replaceOnce(source,"const reason=isAlternate?'rappel_nouvelle_situation':","const reason=isAlternate||alternateRecall?'rappel_nouvelle_situation':");
  }
  if(mode==='C'){
    source=replaceOnce(source,"const quotas=profile==='weak'?", "const revision=__policy.prepare({state,metadata:prerequis.byId,exercises,candidates:pool,mode:__mode});\n    const quotas=profile==='weak'?");
    source=replaceOnce(source,'const q=ranked[0].q,m=mOf(q),cat=category||classify(q);',
      "const original=ranked[0].q;\n      const substitute=s>=3&&explicitRecall?revision.replacement(original,pool.filter(distinct),concepts):null;\n      const q=substitute||original,m=mOf(q),cat=category||classify(q);");
    source=replaceOnce(source,"const kind=!isFresh||isAlternate?'revision':'nouveau';","const kind=!isFresh||isAlternate||substitute?'revision':'nouveau';");
    source=replaceOnce(source,"const reason=isAlternate?'rappel_nouvelle_situation':","const reason=isAlternate||substitute?'rappel_nouvelle_situation':");
  }
  const m={exports:{}};
  new Function('module','require','__policy','__mode',source)(m,()=>meta,policy,mode);
  return m.exports;
}
const profiles=['autonome','modere','echecs','aides','cible'],seeds=[11,29,47],horizons=[20,65,153];
const family=q=>String(q.caseFamily||q.id);
const weak=a=>a.result!=='correct'||a.assisted||a.hadFreeError;
function assert(ok,msg){if(!ok)throw Error(msg)}
function simulate(api,policy,meta,qs,profile,seed,max=153){
  const state=api.empty(),byId=new Map(qs.map(q=>[q.id,q])),ids=new Map(),families=new Map(),concepts=new Map(),themes=new Map(),decisions=new Set(),contexts=new Set();
  const foundations=['ouv','mineur','majeur','sa','red','second','stayman'];
  const pending=new Map(),delay={wrong:[],help:[],clean:[]},counts={wrong:0,help:0,clean:0},served={wrong:0,help:0,clean:0};
  let repId=0,repFamily=0,repConcept=0,shortId=0,shortFamily=0,exactWeak=0,transfer=0,sameAnswer=0,hard=0,foundGap=0,ms=0;
  let rng=seed>>>0;
  const rand=()=>((rng=(Math.imul(1664525,rng)+1013904223)>>>0)/4294967296);
  const rows=[];
  const quant=(a,p)=>a.length?a.slice().sort((x,y)=>x-y)[Math.floor((a.length-1)*p)]:null;
  const pass=q=>q.theme==='ouv'&&q.answer==='Passe';
  for(let s=0;s<max;s++){
    // The policy schedule is also a shared measurement ruler, not a claim of learning.
    // Independent metric below uses first subsequent concept exposure and fixed deadlines.
    const start=Date.now(),deck=api.start(state,qs);ms+=Date.now()-start;
    assert(deck.length===10&&new Set(deck.map(q=>q.id)).size===10&&new Set(deck.map(family)).size===10,'distinct deck '+s);
    const passes=deck.map((q,i)=>pass(q)?i:-1).filter(i=>i>=0);
    if(s===0)assert(passes.length===3&&passes[0]<3&&passes.every((v,i)=>!i||v-passes[i-1]>1)&&deck.every(q=>q.theme==='ouv'),'S1');
    if(s===1)assert(passes.length>=1&&passes.length<=2&&deck.filter(q=>['majeur','mineur'].includes(q.theme)).length>=6,'S2');
    if(s===2)assert(passes.length<=1,'S3');
    const seenNow=new Set(),answers=[];
    for(let i=0;i<deck.length;i++){
      const q=deck[i],c=meta.byId[q.id].concept,f=family(q);
      assert(s>=meta.byId[q.id].minSession&&s>=api.INTRO[q.theme],'calendar');
      const p=pending.get(c);
      if(p&&p.s<s&&!seenNow.has(c)){
        delay[p.type].push(s-p.s);if(s>=p.due)served[p.type]++;
        if(p.type!=='clean'&&p.families.every(x=>x!==f)&&p.hands.every(x=>x!==JSON.stringify(q.hand)))transfer++;
        if(p.type!=='clean'&&p.ids.includes(q.id))exactWeak++;
        pending.delete(c);
      }
      if(ids.has(q.id)){repId++;if(s-ids.get(q.id)<=2)shortId++}
      if(families.has(f)){repFamily++;if(s-families.get(f)<=2)shortFamily++}
      if(concepts.has(c))repConcept++;
      if(i&&deck[i-1].answer===q.answer)sameAnswer++;
      if(q.difficulty>=4)hard++;
      ids.set(q.id,s);families.set(f,s);concepts.set(c,s);themes.set(q.theme,s);
      contexts.add(q.theme+'|'+String(q.auction?.[0]||''));decisions.add(q.theme+'|'+q.answer);seenNow.add(c);
      const u=rand(),v=rand(),w=rand();
      const wrong=profile==='cible'?pass(q)||u<.08:u<({autonome:0,modere:.33,echecs:.94,aides:.15}[profile]);
      const a={result:wrong?'wrong':'correct',assisted:profile==='aides'&&v<.72,hadFreeError:profile==='aides'&&w<.08};
      assert(api.record(state,q,a.result,i,null,a.assisted,a.hadFreeError),'record');
      answers.push({q,c,a});
    }
    for(const c of seenNow){
      const events=answers.filter(x=>x.c===c),bad=events.filter(x=>weak(x.a)),type=bad.some(x=>x.a.result!=='correct')?'wrong':bad.length?'help':'clean',anchor=bad.length?bad:events;
      counts[type]++;pending.set(c,{s,due:s+(type==='clean'?3:1),type,families:anchor.map(x=>family(x.q)),hands:anchor.map(x=>JSON.stringify(x.q.hand)),ids:anchor.map(x=>x.q.id)});
    }
    for(const t of foundations)if(themes.has(t))foundGap=Math.max(foundGap,s-themes.get(t));
    assert(api.finish(state,qs)&&state.completed===s+1,'finish');
    if(horizons.includes(s+1)){
      const delays=Object.fromEntries(Object.keys(delay).map(k=>[k,{observed:delay[k].length,median:quant(delay[k],.5),p90:quant(delay[k],.9),dueOrLater:served[k],events:counts[k],pending:[...pending.values()].filter(p=>p.type===k).length,overdue:[...pending.values()].filter(p=>p.type===k&&p.due<=s).length}]));
      const save=api.load(JSON.stringify(state));
      assert(save.completed===s+1&&JSON.stringify(save.entries)===JSON.stringify(state.entries),'save');
      rows.push({profile,seed,horizon:s+1,ids:ids.size,families:families.size,concepts:concepts.size,themes:themes.size,decisions:decisions.size,contexts:contexts.size,repId,repFamily,repConcept,shortId,shortFamily,exactWeak,transfer,sameAnswer,hard,foundGap,delays,ms});
    }
  }
  return rows;
}
if(typeof require==='function'&&require.main===module){
  const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
  const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),meta=require('../quizz-prerequis.js'),policy=require('../quizz-revision-policy.js');
  const data=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  assert(data.exercises.length===1879&&data.themes.length===22,'catalogue');
  const [p,s,m,h]=process.argv.slice(2),rows=[];
  for(const mode of m?[m]:['base','A','B','C'])for(const profile of p?[p]:profiles)for(const seed of s?[Number(s)]:seeds){
    rows.push(...simulate(compile(source,meta,policy,mode),policy,meta,data.exercises,profile,seed,h?Number(h):153).map(r=>({mode,...r})));
  }
  console.log(JSON.stringify(rows,null,2));
}
module.exports={compile,simulate,profiles,seeds,horizons};

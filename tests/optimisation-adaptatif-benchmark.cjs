#!/usr/bin/env node

'use strict';
const BASE='dc5ecced63716672813905472bf32c4505253665';
const PROFILES=['autonome','intermediaire','faible','cible','aides'], SEEDS=[11,29,47], HORIZONS=[20,65,153];
function check(ok,msg){if(!ok)throw Error(msg)}
function replaceOnce(src,old,next){check(src.split(old).length===2,'anchor absent or ambiguous: '+old);return src.replace(old,next)}
function candidate(src,kind){
 if(kind==='base')return src;
 check(['local','revocable'].includes(kind),'unknown candidate');
 src=replaceOnce(src,'const weakConcept={},weakContext={};',
 'const weakConcept={},weakContext={},localHistory=new Map();');
 src=replaceOnce(src,'add(seen,m.concept,q.id);',
 String.raw`add(seen,m.concept,q.id);
      if(!localHistory.has(m.concept))localHistory.set(m.concept,[]);
      localHistory.get(m.concept).push({family:family(q),difficulty:q.difficulty,session:s,weak:weakAnswer(a),skipped:a.result==='skipped'});`);
 src=replaceOnce(src,'return {seen,basic,proofs,byConcept,lastTheme,lastFamily,lastConcept,weakConcept,weakContext,recent};',
 String.raw`const localTargets=new Map(),localFragility=new Map();
    for(const [key,items] of byConcept){
      const floor=Math.min(...items.map(q=>q.difficulty));
      const history=localHistory.get(key)||[];
      const sessions=[...new Set(history.map(r=>r.session))].slice(-6);
      const recentLocal=history.filter(r=>sessions.includes(r.session));
      const clean=recentLocal.filter(r=>!r.weak);
      const weakSessions=new Set(recentLocal.filter(r=>r.weak&&!r.skipped).map(r=>r.session));
      const lastWeak=Math.max(-1,...weakSessions);
      const recovery=clean.filter(r=>r.session>lastWeak);
      const cleanSessions=new Set(recovery.map(r=>r.session));
      const weak=weakSessions.size>=2&&cleanSessions.size<2;
      let target=floor;
      if(recovery.length){
        // Three sessions and two families for promotion; isolated successes
        // or assisted attempts never increase the target.
        for(let level=floor;level<5;level++){
          const atLevel=recovery.filter(r=>r.difficulty>=level);
          if(new Set(atLevel.map(r=>r.session)).size>=3&&new Set(atLevel.map(r=>r.family)).size>=2)
            target=Math.max(target,level+1);
          else if(new Set(atLevel.map(r=>r.session)).size>=2&&new Set(atLevel.map(r=>r.family)).size>=2)
            target=Math.max(target,level);
        }
      }
      if(weak)target=Math.max(floor,target-1);
      localTargets.set(key,target);
      if(weak)localFragility.set(key,{lastWeak,weakSessions:weakSessions.size});
    }
    return {seen,basic,proofs,byConcept,lastTheme,lastFamily,lastConcept,weakConcept,weakContext,recent,localTargets,localFragility};`);
 src=replaceOnce(src,'const target=clamp((targetByTheme[t]||1)+(state.difficultyAdjustment||0),1,5);',
 String.raw`// An old saved theme level is preserved; absence of local journal
      // does not magically confer mastery of an unobserved concept.
      const target=clamp((e.localTargets.get(m.concept)||targetByTheme[t]||1)+(state.difficultyAdjustment||0),1,5);`);
 src=replaceOnce(src,'let value= -28*Math.abs(q.difficulty-target)',
 'let value= -48*Math.abs(q.difficulty-target)');
 src=replaceOnce(src,'value+=Math.min(75,(e.weakConcept[m.concept]||0)*8);',
 'value+=Math.min(75,(e.weakConcept[m.concept]||0)*8); if(e.localFragility.has(m.concept)&&novelFamily(q)&&q.difficulty<=target)value+=45;');
 if(kind==='revocable'){
   src=replaceOnce(src,'const proof=keys.flatMap(key=>(e.proofs.get(key)||[]).filter(p=>p.difficulty<q.difficulty));',
   String.raw`const proof=keys.flatMap(key=>(e.proofs.get(key)||[]).filter(p=>p.difficulty<q.difficulty&&
        (!e.localFragility.has(key)||p.session>e.localFragility.get(key).lastWeak)));`);
 }
 src=replaceOnce(src,'-28*Math.abs(x.difficulty-levelFor(state,exercises,x.theme))',
 '-28*Math.abs(x.difficulty-(e.localTargets.get(metadata(x).concept)||levelFor(state,exercises,x.theme)))');
 return src;
}
function makeEngine(src,prerequis,kind){
 let s=candidate(src,kind);
 s=replaceOnce(s,'return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));',
 'if(selected.some(v=>!evaluate(v.exercise,state,e).eligible))throw Error("ineligible selection"); return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));');
 const mod={exports:{}};
 new Function('module','require',s)(mod,()=>prerequis);
 return mod.exports;
}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function uniform(seed,session,id,salt){return hash(seed+'|'+session+'|'+id+'|'+salt)/4294967296}
function response(profile,q,s,seed){
 const target=(q.theme==='ouv'&&q.answer==='Passe')||q.theme==='sa';
 const d=q.difficulty-1;
 const error=profile==='autonome'?.025+.025*d:profile==='intermediaire'?.14+.08*d:
   profile==='faible'?.53+.075*d:profile==='cible'?(target?.57:.08)+.055*d:.12+.06*d;
 const assisted=profile==='aides'&&uniform(seed,s,q.id,'help')<.68;
 const result=uniform(seed,s,q.id,'result')<error?'wrong':'correct';
 const hadFreeError=result==='correct'&&!assisted&&profile!=='autonome'&&uniform(seed,s,q.id,'free')<.06;
 return {result,assisted,hadFreeError};
}
const weak=a=>a.result!=='correct'||a.assisted||a.hadFreeError;
const family=q=>String(q.caseFamily||q.id);
const FOUND=['ouv','majeur','mineur','sa','red','second','stayman'];
function simulate(api,exercises,prerequis,profile,seed,horizon=153){
 let state=api.empty(),rows=[],ids=new Set(),families=new Set(),concepts=new Set(),themes=new Set(),decisions=new Set();
 const level=[0,0,0,0,0],lastTheme={},weakConcept=new Map(),lastWeak=new Map(),priorFamily=new Set();
 let bad=0,helped=0,free=0,recalls=0,delay=0,transfer=0,transferOK=0,foundation=0,gap=0,adjacent=0,repeat=0,familyDuplicates=0,elapsed=0;
 for(let s=0;s<horizon;s++){
   const tick=Date.now(),deck=api.start(state,exercises);elapsed+=Date.now()-tick;
   check(deck.length===10&&new Set(deck.map(q=>q.id)).size===10,'short/duplicate deck '+s);
   familyDuplicates+=10-new Set(deck.map(family)).size;
   if(s===0){
     const passes=deck.map((q,i)=>q.answer==='Passe'?i:-1).filter(i=>i>=0);
     check(deck.every(q=>q.theme==='ouv'&&q.difficulty===1)&&passes.length===3&&passes[0]<=2&&passes.every((i,j)=>j===0||i>passes[j-1]+1),'S1');
   }
   if(s===1)check(deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').length<=2,'S2');
   if(s>=2)check(deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').length<=2,'Passe cap');
   const freshWeak=[];
   for(let i=0;i<deck.length;i++){
     const q=deck[i],k=prerequis.byId[q.id].concept,f=family(q),a=response(profile,q,s,seed);
     if(lastWeak.has(q.id)){recalls++;delay+=s-lastWeak.get(q.id);lastWeak.delete(q.id)}
     if(weakConcept.has(k)&&!priorFamily.has(f)){transfer++;if(!weak(a))transferOK++}
     if(weak(a)){bad++;freshWeak.push(k);lastWeak.set(q.id,s)}
     if(a.assisted)helped++;if(a.hadFreeError)free++;
     if(ids.has(q.id))repeat++;
     ids.add(q.id);families.add(f);concepts.add(k);themes.add(q.theme);decisions.add(q.theme+'|'+q.answer);
     level[q.difficulty-1]++;if(FOUND.includes(q.theme))foundation++;
     lastTheme[q.theme]=s;
     if(i&&deck[i-1].answer===q.answer)adjacent++;
     check(api.record(state,q,a.result,i,null,a.assisted,a.hadFreeError),'record');
     if(i===3&&(s===0||s===19||s===64||s===152)){
       const restored=api.load(JSON.stringify(state));
       check(JSON.stringify(restored.active)===JSON.stringify(state.active),'active resume');state=restored;
     }
   }
   deck.forEach(q=>priorFamily.add(family(q)));freshWeak.forEach(k=>weakConcept.set(k,s));
   check(api.finish(state,exercises)&&state.completed===s+1,'finish');
   for(const t of FOUND)if(Object.hasOwn(lastTheme,t))gap=Math.max(gap,s-lastTheme[t]);
   if(HORIZONS.includes(s+1)){
     const imported=api.importProgress(JSON.stringify(api.exportProgress(state,exercises,{})));
     check(imported.completed===state.completed&&JSON.stringify(imported.entries)===JSON.stringify(api.load(JSON.stringify(state)).entries),'export/import entries');
     check(JSON.stringify(imported.journal)===JSON.stringify(state.journal),'journal');
     rows.push({profile,seed,horizon:s+1,ids:ids.size,families:families.size,concepts:concepts.size,themes:themes.size,decisions:decisions.size,level:level.slice(),weak:bad,helped,free,repeat,recalls,meanRecallDelay:recalls?delay/recalls:null,transfer,transferOK,foundation,gap,adjacent,familyDuplicates,unresolvedWeak:lastWeak.size,elapsedMs:elapsed});
   }
 }
 return rows;
}
function execute(src,prerequis,data,profiles=PROFILES,kinds=['base','local','revocable'],horizon=153){
 check(data.exercises.length===1879&&data.themes.length===22&&new Set(data.exercises.map(q=>q.id)).size===1879,'catalogue');
 const out=[];
 for(const kind of kinds){const api=makeEngine(src,prerequis,kind);
 for(const profile of profiles)for(const seed of SEEDS)out.push(...simulate(api,data.exercises,prerequis,profile,seed,horizon).map(x=>({...x,kind})))}
 return out;
}
module.exports={BASE,PROFILES,SEEDS,HORIZONS,candidate,makeEngine,simulate,execute};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path');
 const read=p=>cp.execFileSync('git',['show',BASE+':'+p],{cwd:path.join(__dirname,'..'),encoding:'utf8',maxBuffer:10*1024*1024});
 const html=read('quizz.html'),data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 const mod={exports:{}};new Function('module',read('quizz-prerequis.js'))(mod);
 const [profile,kind,horizon]=process.argv.slice(2);
 console.log(JSON.stringify(execute(read('quizz-parcours.js'),mod.exports,data,profile?[profile]:PROFILES,kind?[kind]:undefined,horizon?Number(horizon):153),null,2));
}

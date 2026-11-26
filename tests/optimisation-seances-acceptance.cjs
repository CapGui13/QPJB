'use strict';
const check=(ok,message)=>{if(!ok)throw Error(message)};
const PROFILES=['autonome','modere','faible','cible','aide','faiblesse_passe'];
const SEEDS=[11,47,103], H=[20,65,153];
function acceptRows(rows){
  check(rows.length===18,'18 pairs');
  const keys=new Set(rows.map(r=>r.profile+'|'+r.seed));
  for(const p of PROFILES)for(const seed of SEEDS)check(keys.has(p+'|'+seed),'Missing '+p+' '+seed);
  let minRetention=1,violations=0;
  for(const row of rows){
    check(row.before.length===3&&row.after.length===3,'Three checkpoints');
    for(let i=0;i<3;i++){
      const a=row.before[i],b=row.after[i],tag=row.profile+' '+row.seed+' S'+H[i];
      check(a.horizon===H[i]&&b.horizon===H[i],tag+' horizon');
      check(a.violations===0&&b.violations===0,tag+' prerequisites');
      violations+=b.violations;
      minRetention=Math.min(minRetention,b.families/a.families);
      check(b.families>=a.families*.95,tag+' family retention');
      check(b.gf<=6&&b.gf<=Math.max(6,a.gf),tag+' foundational gaps');
      check(b.go<=10&&b.go<=a.go,tag+' nonfoundational gaps');
      check(b.concepts>=a.concepts,tag+' concept coverage');
      check(Object.keys(b.first).length===Object.keys(a.first).length,tag+' rubric coverage');
      if(i===0){
        check(Object.keys(b.first).length===14&&b.first.sa>=4&&b.first.sa<=8&&b.first.red===5&&b.first.stayman===8,tag+' early progression');
        check(b.adj<=2&&b.triple<=2,tag+' presentation');
        check(b.families===a.families&&b.hard===a.hard&&b.concepts===a.concepts,tag+' early nonregression');
        if(['faible','aide'].includes(row.profile))check(b.hard===0,tag+' no advanced difficulty in S1-20');
      }else check(Object.keys(b.first).length===22,tag+' all 22 rubrics');
      if(i===2)check(b.go<a.go,tag+' actual long-term improvement');
    }
  }
  return {pairs:rows.length,checkpoints:rows.length*3,minRetention,violations};
}
function smallPool(api,qs,meta){
  const state=api.empty();state.completed=40;
  const subset=[];
  for(const theme of ['ouv','sa','intervenir','barrage','contre']){
    const q=qs.find(q=>q.theme===theme&&q.answer!=='Passe'&&q.difficulty<=2&&meta.byId[q.id].requires.length===0&&
      api.eligibility(q,state,qs).eligible&&!subset.some(v=>(v.caseFamily||v.id)===(q.caseFamily||q.id)));
    if(q)subset.push(q);
    if(subset.length===3)break;
  }
  // A legacy state without evidence need not have three eligible rubrics.
  // Fill the small pool only with distinct eligible real cases.
  for(const q of qs){
    if(subset.length===3)break;
    if(q.answer!=='Passe'&&q.difficulty<=2&&meta.byId[q.id].requires.length===0&&
      !subset.some(v=>(v.caseFamily||v.id)===(q.caseFamily||q.id))&&api.eligibility(q,state,qs).eligible)subset.push(q);
  }
  check(subset.length===3,'Real small pool');
  const deck=api.start(state,subset);
  check(deck.length===3&&new Set(deck.map(q=>q.id)).size===3,'No invented fillers');
  check(deck.every(q=>api.eligibility(q,state,subset).eligible),'Small pool eligibility');
  check(api.record(state,deck[0],'wrong',0,null,false,false),'Interrupted answer');
  api.move(state,1);
  const resumed=api.load(JSON.stringify(state)),active=JSON.stringify(resumed.active);
  check(api.start(resumed,qs).map(q=>q.id).join()===deck.map(q=>q.id).join(),'Interrupted order survives larger pool');
  check(JSON.stringify(resumed.active)===active,'Interrupted answers untouched');
  check(api.startConsolidation(resumed,qs).map(q=>q.id).join()===deck.map(q=>q.id).join(),'Consolidation respects active');
  const advanced=qs.find(q=>meta.byId[q.id].minSession>=20);
  check(api.start(api.empty(),[advanced]).length===0,'No advanced fallback');
  let rejected=false;try{api.select([...subset,{id:'missing-metadata',theme:'ouv',difficulty:1}],api.empty())}catch(e){rejected=true}
  check(rejected,'Missing metadata fails closed');
  return {smallPool:deck.map(q=>q.id),resume:true,emptyPool:true,failClosed:true};
}
module.exports={acceptRows,smallPool};
if(typeof require==='function'&&require.main===module){
  const fs=require('node:fs'),path=require('node:path'),B=require('./optimisation-seances-benchmark.cjs');
  const root=path.join(__dirname,'..'),dir=path.join(root,'audits/optimisation-parcours/m3');
  const rows=PROFILES.flatMap(p=>SEEDS.map(s=>JSON.parse(fs.readFileSync(path.join(dir,'resultats-'+p+'-'+s+'.json'),'utf8'))));
  const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8'),qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
  const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),meta=require('../quizz-prerequis.js');
  const api=B.makeEngine(source,meta,require('../quizz-session-plan.js'));
  console.log(acceptRows(rows),smallPool(api,qs,meta));
}

'use strict';
const adapter=require('./coherence-concrete-m4-adapter.cjs');
const m4=require('../quizz-coherence-m4-diversite.js');
const reserve=require('../quizz-coherence-m4-reserve.js');
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'];
const SEEDS=[11,47,103], HORIZONS=[5,20,65,153,180];
const CORE=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
const family=q=>String(q.caseFamily||q.id);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296}
function response(profile,seed,s,q,m){
  const u=k=>hash([profile,seed,s,q.id,k].join('|'));
  const p={autonome:1,intermediaire:.67,faible:.22,cible:/^(red|second|intervenir|contre)\./.test(m.concept)?.22:.77,aide:.65,passe:m.concept==='ouv.passe'?.06:.85}[profile];
  const assisted=profile==='aide'&&u('help')<.7;
  const correct=assisted||u('correct')<p;
  return {result:correct?'correct':'wrong',choice:correct?q.answer:q.choices.find(c=>c!==q.answer),assisted,hadFreeError:false};
}
function early(deck,s){
  if(s>3)return [];
  const failures=[],pass=deck.map((q,i)=>q.theme==='ouv'&&q.answer==='Passe'?i+1:null).filter(Boolean);
  if(s===1){
    const deadlines=[2,5,7];
    if(deck.some(q=>q.theme!=='ouv'||q.difficulty!==1))failures.push('S1 ouvertures de base');
    if(pass.length!==3||pass.some((v,i)=>v>deadlines[i]||(i>0&&v-pass[i-1]<2))||deck.some(q=>q.theme==='ouv'&&q.answer==='Passe'&&q.h>=12))failures.push('S1 Passes');
    for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])if(deck.filter(q=>q.answer===a).length<n)failures.push('S1 '+a);
  }else{
    if((s===2&&(pass.length<1||pass.length>2))||(s===3&&pass.length>1))failures.push('Passe S'+s);
    if(pass.some((v,i)=>v>[4,7][i]||(i>0&&v-pass[i-1]<2)))failures.push('position Passe S'+s);
    const opener=q=>(q.auction?.[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠]))/)?.[1]||'';
    for(const q of deck){
      const o=opener(q);
      if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^[2-7][♣♦]$/.test(q.answer)&&q.answer[1]===o[1])failures.push('soutien mineur prématuré');
      if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&/^[2-7][♥♠]$/.test(q.answer)&&q.answer[1]===o[1]&&
        (q.answer[0]!=='2'||q.shape[o==='1♠'?0:1]!==3||q.auction.length!==1))failures.push('fit autre que 5–3 prématuré');
    }
    if(s===2){
      const openings=deck.filter(q=>q.theme==='ouv');
      if(!openings.some(q=>q.answer==='1♣'&&q.shape[2]===3&&q.shape[3]===3)||!openings.some(q=>q.answer==='1♦'&&q.shape[2]===4&&q.shape[3]===4))failures.push('S2 égalités mineures');
    }
  }
  return failures;
}
function run({source,requireBase,exercises,meta,profile,seed,horizon=180,candidate=false,maxSession=180,policy='A',verify=true,measure=()=>0}){
  let now=Date.UTC(2026,0,1);const changes=[];
  class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
  const mod={exports:{}},pick=(ctx,rows,q)=>adapter.pick({...ctx,nowMs:now},rows,q,maxSession,c=>changes.push(c),policy);
  const reservation={plan:ctx=>ctx.session<=maxSession?reserve.plan(ctx):[],record:r=>changes.push(r)};
  new Function('module','exports','require','Date','__m4Pick','__m4Reserve',candidate?adapter.instrument(source,policy):source)(mod,mod.exports,requireBase,FixedDate,pick,reservation);
  const api=mod.exports,state=api.empty(),sessions=[],last=new Map(),seenFamilies=new Set(),seenConcepts=new Set(),seenThemes=new Set(),nearLast=new Map(),seenIds=new Set(),proof=new Map(),checkpoints=[];
  let nearPairs=0,decisionPairs=0,nearRecent=0,repeatFamily=0,coreDebt=0,themeDebt=0,earlyViolations=0,hard=0,independent=0,violations=0,short=0,dupes=0;
  const lastGap={},lastTheme=new Map();const times=[];
  for(let s=1;s<=horizon;s++){
    now=Date.UTC(2026,0,1)+s*86400000;
    const t=measure(),deck=api.start(state,exercises);times.push(Math.max(0,measure()-t));
    const selected=state.active.selection;
    const rows=deck.map((q,i)=>{
      const m=meta[q.id],f=m4.features(q,m),a=response(profile,seed,s,q,m);
      const e=verify?api.eligibility(q,state,exercises):{eligible:null,reasons:[]};
      if(e.eligible===false)violations++;
      return {id:q.id,concept:m.concept,stage:m.stage,requires:m.requires,theme:q.theme,level:q.difficulty,context:q.context,auction:q.auction,hand:q.hand,h:q.h,shape:q.shape,answer:q.answer,family:family(q),decision:f?.decision,near:f?.near,role:selected[i].kind,reason:selected[i].reason,position:i+1,positionReason:'ordre historique logicalOrder (M2 hors périmètre)',eligible:e.eligible,response:a};
    });
    if(deck.length!==10)short++;
    const earlyFailures=early(deck,s);earlyViolations+=earlyFailures.length;
    if(new Set(rows.map(r=>r.id)).size!==rows.length||new Set(rows.map(r=>r.family)).size!==rows.length)dupes++;
    let localNear=0,localDecision=0,localRecent=0;
    for(let i=0;i<rows.length;i++){
      const r=rows[i];
      for(let j=0;j<i;j++){if(r.near&&r.near===rows[j].near)localNear++;if(r.decision&&r.decision===rows[j].decision)localDecision++}
      if(r.near&&nearLast.has(r.near)&&s-nearLast.get(r.near)<=2&&s>nearLast.get(r.near))localRecent++;
      if(seenFamilies.has(r.family))repeatFamily++;
      seenFamilies.add(r.family);seenIds.add(r.id);seenConcepts.add(r.concept);seenThemes.add(r.theme);
      if(last.has(r.concept)&&last.get(r.concept)!==s)lastGap[r.concept]=Math.max(lastGap[r.concept]||0,s-last.get(r.concept));
      last.set(r.concept,s);lastTheme.set(r.theme,s);
      if(r.level>=4)hard++;
      const a=r.response;if(a.result==='correct'&&!a.assisted&&!a.hadFreeError){independent++;const p=proof.get(r.concept)||{families:new Set(),sessions:new Set()};p.families.add(r.family);p.sessions.add(s);proof.set(r.concept,p)}
    }
    for(const r of rows)if(r.near)nearLast.set(r.near,s);
    nearPairs+=localNear;decisionPairs+=localDecision;nearRecent+=localRecent;
    for(const c of CORE)if(last.has(c))coreDebt+=Math.max(0,s-last.get(c)-6);
    for(const t of ['ouv','majeur','mineur','sa','red','second','stayman'])if(lastTheme.has(t))themeDebt+=Math.max(0,s-lastTheme.get(t)-6);
    // Reprise d'une séance réellement commencée, testée avant de la finir.
    for(let i=0;i<deck.length;i++){const a=rows[i].response;if(!api.record(state,deck[i],a.result,i,a.choice,a.assisted,a.hadFreeError))throw Error('record '+s);
      if(i===0&&[1,5,20,65,153,180].includes(s)){
        const snapshot=JSON.stringify(state);const resumed=api.start(state,exercises);
        if(JSON.stringify(resumed.map(x=>x.id))!==JSON.stringify(deck.map(x=>x.id))||JSON.stringify(state)!==snapshot)throw Error('reprise '+s);
      }}
    if(!api.finish(state,exercises))throw Error('finish '+s);
    sessions.push({session:s,nearPairs:localNear,decisionPairs:localDecision,nearRecent:localRecent,earlyFailures,rows});
    if(HORIZONS.includes(s)||s===horizon)checkpoints.push({session:s,nearPairs,decisionPairs,nearRecent,repeatFamily,coreDebt,themeDebt,earlyViolations,hard,independent,violations,short,dupes,families:seenFamilies.size,ids:seenIds.size,concepts:seenConcepts.size,themes:seenThemes.size,proof:[...proof.values()].filter(p=>p.families.size>=2&&p.sessions.size>=2).length,maxGap:{...lastGap},p95Ms:times.slice().sort((a,b)=>a-b)[Math.floor((times.length-1)*.95)]});
  }
  return {profile,seed,horizon,candidate,maxSession,policy,checkpoints,sessions,changes};
}
function pair(opts){const before=run(opts),after=run({...opts,candidate:true});return {profile:opts.profile,seed:opts.seed,horizon:opts.horizon,before,after}}
module.exports={run,pair,early,PROFILES,SEEDS,HORIZONS};
if(require.main===module){
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
  const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
  function blob(s){return crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex')}
  assert.equal(blob(source),'4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9');
  assert.equal(blob(html),'7a952dc57b582a2a7b5be73f83306df83881f3a8');
  const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
  const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
  const meta=requireBase('./quizz-prerequis.js').byId;
  assert.equal(exercises.length,1915);assert.equal(new Set(Object.values(meta).map(m=>m.concept)).size,99);
  const horizon=Number(process.env.HORIZON||180),maxSession=Number(process.env.MAX_SESSION||180);
  const out=process.env.OUT||path.join(root,'audits/coherence-concrete-20261126/m4/native');
  fs.mkdirSync(out,{recursive:true});
  for(const profile of PROFILES.filter(p=>!process.env.PROFILE||p===process.env.PROFILE))for(const seed of SEEDS.filter(s=>!process.env.SEED||s===Number(process.env.SEED))){
    const p=pair({source,requireBase,exercises,meta,profile,seed,horizon,maxSession,policy:process.env.POLICY||'A',measure:()=>performance.now()});
    fs.writeFileSync(path.join(out,profile+'-'+seed+'.json'),JSON.stringify(p));
    console.log(JSON.stringify({profile,seed,policy:p.after.policy,before:p.before.checkpoints,after:p.after.checkpoints,changes:p.after.changes.length,reservations:p.after.changes.filter(x=>x.kind==='reservation').length}));
    assert.ok(p.before.checkpoints.every(x=>!x.violations&&!x.dupes&&!x.short&&!x.earlyViolations),'référence structurelle');
    assert.ok(p.after.checkpoints.every(x=>!x.violations&&!x.dupes&&!x.short&&!x.earlyViolations),'candidat structurel');
  }
}

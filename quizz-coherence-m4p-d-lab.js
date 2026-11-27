'use strict';
// M4-D #449: independent trace consumer; never imports a selection policy.
const BASE='49298ada3f96e347833d8717c7e205518ea02fce';
const ENGINE='4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9', CATALOGUE='7a952dc57b582a2a7b5be73f83306df83881f3a8';
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'], SEEDS=[11,47,103], HORIZONS=[5,20,65,153,180];
const CORE=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
const THEMES=['ouv','majeur','mineur','sa','red','second','stayman'];
const DIRECTION={nearPairs:1,decisionPairs:1,nearRecent:1,coreDebt:1,themeDebt:1,hard:1,proof:-1,concepts:-1,families:-1,independent:-1};
const ZERO=['violations','dupes','short','earlyViolations'];
const fail=m=>{throw Error('M4-D TECHNIQUE: '+m)};
const check=(x,m)=>{if(!x)fail(m)};
const key=x=>x.profile+'/'+x.seed;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clean=a=>a.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function guard(rows,s){
 const errors=[],passes=rows.filter(q=>q.theme==='ouv'&&q.answer==='Passe').map(q=>q.position);
 if(s===1){
  if(rows.some(q=>q.theme!=='ouv'||q.level!==1))errors.push('S1 ouvertures de base');
  if(passes.length!==3||passes.some((p,i)=>p>[2,5,7][i]||(i&&p-passes[i-1]<2))||rows.some(q=>q.theme==='ouv'&&q.answer==='Passe'&&q.h>=12))errors.push('S1 Passes');
  for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])if(rows.filter(q=>q.answer===a).length<n)errors.push('S1 '+a);
 }else if(s<=3){
  if(s===2?(passes.length<1||passes.length>2):passes.length>1)errors.push('Passe S'+s);
  if(passes.some((p,i)=>p>[4,7][i]||(i&&p-passes[i-1]<2)))errors.push('position Passe S'+s);
  for(const q of rows){
   const o=(q.auction[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠]))/)?.[1]||'';
   if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^[2-7][♣♦]$/.test(q.answer)&&q.answer[1]===o[1])errors.push('soutien mineur prématuré');
   if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&/^[2-7][♥♠]$/.test(q.answer)&&q.answer[1]===o[1]&&(q.answer[0]!=='2'||q.shape[o==='1♠'?0:1]!==3||q.auction.length!==1))errors.push('fit autre que 5–3 prématuré');
  }
  if(s===2&&(!rows.some(q=>q.theme==='ouv'&&q.answer==='1♣'&&q.shape[2]===3&&q.shape[3]===3)||!rows.some(q=>q.theme==='ouv'&&q.answer==='1♦'&&q.shape[2]===4&&q.shape[3]===4)))errors.push('S2 égalités mineures');
 }
 return errors;
}
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296}
function response(profile,seed,s,q){
 const u=k=>hash([profile,seed,s,q.id,k].join('|'));
 const p={autonome:1,intermediaire:.67,faible:.22,cible:/^(red|second|intervenir|contre)\./.test(q.concept)?.22:.77,aide:.65,passe:q.concept==='ouv.passe'?.06:.85}[profile];
 const assisted=profile==='aide'&&u('help')<.7;
 return {result:assisted||u('correct')<p?'correct':'wrong',assisted,hadFreeError:false};
}
function analyze(t,{catalogue,metadata,features,registry,verifyResponse=true,legacy=false}={}){
 check(PROFILES.includes(t.profile)&&SEEDS.includes(t.seed),'profil/graine');
 check(Number.isInteger(t.horizon)&&t.horizon>0&&t.horizon<=180&&Array.isArray(t.sessions)&&t.sessions.length===t.horizon,'trace tronquée');
 const seen={family:new Set(),id:new Set(),concept:new Set(),theme:new Set()},nearLast=new Map(),last=new Map(),lastTheme=new Map(),proof=new Map(),gap={},conceptDebt={},first={},exposures={},errors=[],contrastPairs=[];
 const totals={nearPairs:0,decisionPairs:0,nearRecent:0,repeatFamily:0,coreDebt:0,themeDebt:0,earlyViolations:0,hard:0,independent:0,violations:0,short:0,dupes:0};
 const checkpoints=[],sessions=[];
 const cat=catalogue instanceof Map?catalogue:catalogue?new Map(catalogue.map(q=>[q.id,q])):null;
 for(let i=0;i<t.sessions.length;i++){
  const s=i+1,record=t.sessions[i],rows=record.rows;
  check(record.session===s&&Array.isArray(rows),'séance absente '+s);
  if(rows.length!==10){totals.short++;errors.push({s,kind:'short'})}
  if(new Set(rows.map(q=>q.id)).size!==rows.length||new Set(rows.map(q=>q.family)).size!==rows.length){totals.dupes++;errors.push({s,kind:'duplicate'})}
  const local={nearPairs:0,decisionPairs:0,nearRecent:0,contrasts:0};
  for(let j=0;j<rows.length;j++){
   const q=rows[j],a=q.response;
   check(q.position===j+1&&['id','concept','family','answer','theme','role','reason'].every(k=>typeof q[k]==='string'&&q[k].length)&&Array.isArray(q.auction)&&Array.isArray(q.hand)&&Array.isArray(q.shape)&&q.shape.length===4&&Number.isInteger(q.h)&&Number.isInteger(q.level),'ligne invalide '+s+'/'+j);
   check(typeof q.eligible==='boolean','éligibilité non attestée '+q.id);
   if(!q.eligible){totals.violations++;errors.push({s,id:q.id,kind:'ineligible'})}
   check(a&&['correct','wrong'].includes(a.result)&&typeof a.assisted==='boolean'&&typeof a.hadFreeError==='boolean','réponse non attestée '+q.id);
   if(verifyResponse){const expected=response(t.profile,t.seed,s,q);for(const k of Object.keys(expected))check(a[k]===expected[k],'règle réponse '+q.id+'/'+k)}
   check((a.result==='correct')===(a.choice===q.answer),'choix/résultat '+q.id);
   if(cat){const c=cat.get(q.id);check(c&&c.answer===q.answer&&c.theme===q.theme&&c.difficulty===q.level&&String(c.caseFamily||c.id)===q.family&&c.h===q.h&&same(c.hand,q.hand)&&same(c.shape,q.shape)&&same(c.auction,q.auction)&&c.context===q.context,'catalogue divergent '+q.id);if(a.result==='wrong')check(a.choice===c.choices.find(x=>x!==c.answer),'distracteur non canonique '+q.id);if(metadata)check(metadata[q.id]?.concept===q.concept,'concept divergent '+q.id);if(features){const f=features(c,metadata[q.id]);check(f?.decision===q.decision&&f?.near===q.near,'signature divergente '+q.id)}}
   for(const p of rows.slice(0,j)){
    if(q.near&&q.near===p.near)local.nearPairs++;
    if(q.decision&&q.decision===p.decision){local.decisionPairs++;if(q.near!==p.near){local.contrasts++;const qa=registry?.[q.id],pa=registry?.[p.id];contrastPairs.push({s,ids:[p.id,q.id],status:qa?.status==='validated'&&pa?.status==='validated'&&qa.contrast&&pa.contrast&&qa.contrast!==pa.contrast?'C-contrast':'unreviewed'});}}
   }
   if(q.near&&nearLast.has(q.near)&&s-nearLast.get(q.near)<=2)local.nearRecent++;
   if(seen.family.has(q.family))totals.repeatFamily++;
   for(const k of Object.keys(seen))seen[k].add(q[k]);
   if(last.get(q.concept)!==s){if(last.has(q.concept))gap[q.concept]=Math.max(gap[q.concept]||0,s-last.get(q.concept));first[q.concept]??=s;exposures[q.concept]=(exposures[q.concept]||0)+1;last.set(q.concept,s)}
   lastTheme.set(q.theme,s);
   if(q.level>=4)totals.hard++;
   if(clean(a)){totals.independent++;const p=proof.get(q.concept)||{families:new Set(),sessions:new Set()};p.families.add(q.family);p.sessions.add(s);proof.set(q.concept,p)}
  }
  for(const q of rows)if(q.near)nearLast.set(q.near,s);
  for(const k of ['nearPairs','decisionPairs','nearRecent'])totals[k]+=local[k];
  const early=guard(rows,s);totals.earlyViolations+=early.length;for(const kind of early)errors.push({s,kind});
  for(const c of CORE)if(last.has(c)){const d=Math.max(0,s-last.get(c)-6);conceptDebt[c]=(conceptDebt[c]||0)+d;totals.coreDebt+=d}
  for(const c of THEMES)if(lastTheme.has(c))totals.themeDebt+=Math.max(0,s-lastTheme.get(c)-6);
  sessions.push({session:s,...local,concepts:[...new Set(rows.map(q=>q.concept))]});
  if(HORIZONS.includes(s)||s===t.horizon){
   const validProof=[...proof].filter(([,p])=>p.families.size>=2&&p.sessions.size>=2).map(([c])=>c).sort();
   const cp={session:s,...totals,families:seen.family.size,ids:seen.id.size,concepts:seen.concept.size,themes:seen.theme.size,proof:validProof.length,maxGap:{...gap},proofConcepts:validProof,conceptDebt:{...conceptDebt},terminalGap:Object.fromEntries(CORE.map(c=>[c,last.has(c)?s-last.get(c):null])),first:{...first},exposures:{...exposures}};
   const original=t.checkpoints?.find(x=>x.session===s);
   check(original,'checkpoint absent S'+s);
   for(const k of [...Object.keys(DIRECTION),...ZERO,'repeatFamily','ids','themes']){
    if(legacy&&original[k]===undefined)continue;
    check(original[k]===cp[k],'checkpoint contredit S'+s+'/'+k+' '+original[k]+' != '+cp[k]);
   }
   check(Object.entries(gap).every(([c,v])=>original.maxGap?.[c]===v)&&Object.keys(original.maxGap||{}).length===Object.keys(gap).length,'maxGap divergent S'+s);
   if(original.p95Ms!==undefined){check(Number.isFinite(original.p95Ms)&&original.p95Ms>=0,'latence invalide');cp.p95Ms=original.p95Ms}
   checkpoints.push(cp);
  }
 }
 check(t.checkpoints.length===checkpoints.length,'checkpoints surnuméraires');
 return {profile:t.profile,seed:t.seed,horizon:t.horizon,checkpoints,sessions,errors,contrastPairs};
}
function compareCheckpoints(rows,{requireEarly=true,requireDebt=true,requireReservation=false,fullMatrix=true}={}){
 check(Array.isArray(rows)&&rows.length>0,'matrice vide');
 const ids=new Set(),violations=[],totals={},changes={count:0,reservations:0};let earlyGain=false,debtGain=false;
 for(const p of rows){
  check(PROFILES.includes(p.profile)&&SEEDS.includes(p.seed)&&!ids.has(key(p)),'paire inconnue/dupliquée '+key(p));ids.add(key(p));
  check(Array.isArray(p.before)&&Array.isArray(p.after)&&p.before.length===p.after.length,'appariement');
  if(fullMatrix)check(p.before.length===5,'horizons incomplets');
  check(Number.isInteger(p.changes)&&p.changes>=0,'changements non attestés');changes.count+=p.changes;changes.reservations+=p.reservations||0;
  for(let i=0;i<p.before.length;i++){
   const a=p.before[i],b=p.after[i],h=a.session;
   check(h===b.session&&(!fullMatrix||h===HORIZONS[i]),'horizon divergent');
   const add=(metric,before,after)=>violations.push({profile:p.profile,seed:p.seed,h,metric,before,after});
   for(const [k,sign] of Object.entries(DIRECTION)){
    check(Number.isFinite(a[k])&&Number.isFinite(b[k]),'métrique manquante '+k);
    const v=(totals[h]??={})[k]??=[0,0];v[0]+=a[k];v[1]+=b[k];
    if(sign*(b[k]-a[k])>0)add(k,a[k],b[k]);
    if(h===5&&['nearPairs','decisionPairs','nearRecent'].includes(k)&&b[k]<a[k])earlyGain=true;
    if(h===180&&k==='coreDebt'&&b[k]<a[k])debtGain=true;
   }
   for(const k of ZERO){check(Number.isInteger(a[k])&&Number.isInteger(b[k]),'structure non attestée '+k);if(a[k]||b[k])add(k,a[k],b[k]);}
  }
 }
 if(fullMatrix)check(ids.size===18,'matrice incomplète '+ids.size+'/18');
 const verdict=changes.count>0&&(!requireEarly||earlyGain)&&(!requireDebt||debtGain)&&(!requireReservation||changes.reservations>0)&&!violations.length?'CANDIDAT_A_REVOIR':'HOLD';
 return {verdict,changes,earlyGain,debtGain,totals,violations};
}
function comparePair(pair,opts={}){
 check(pair.before&&pair.after&&key(pair)===key(pair.before)&&key(pair)===key(pair.after)&&pair.horizon===pair.before.horizon&&pair.horizon===pair.after.horizon,'paire non appariée');
 if(!opts.legacy){
  const m=pair.provenance;check(m?.base===BASE&&m.engine===ENGINE&&m.catalogue===CATALOGUE&&/^[a-f0-9]{40}$/.test(m.testedSha)&&m.responseRule==='fnv1a-m4-v1'&&m.baseline==='native-uninstrumented','provenance absente/divergente');
 }
 const before=analyze(pair.before,opts),after=analyze(pair.after,opts);
 const regressions=[];
 for(let i=0;i<before.checkpoints.length;i++){
  const a=before.checkpoints[i],b=after.checkpoints[i],h=a.session;
  for(const c of CORE){
   if((b.conceptDebt[c]||0)>(a.conceptDebt[c]||0))regressions.push({h,metric:'conceptDebt',concept:c,before:a.conceptDebt[c]||0,after:b.conceptDebt[c]||0});
   if(a.terminalGap[c]!==null&&(b.terminalGap[c]===null||b.terminalGap[c]>a.terminalGap[c]))regressions.push({h,metric:'terminalGap',concept:c,before:a.terminalGap[c],after:b.terminalGap[c]});
  }
  for(const c of a.proofConcepts)if(!b.proofConcepts.includes(c))regressions.push({h,metric:'proofConceptLost',concept:c});
  if(a.p95Ms!==undefined&&b.p95Ms!==undefined&&b.p95Ms>a.p95Ms)regressions.push({h,metric:'latency-observation',before:a.p95Ms,after:b.p95Ms});
 }
 const changes=pair.after.changes||[];
 check(Array.isArray(changes),'journal changements invalide');
 return {profile:pair.profile,seed:pair.seed,before:before.checkpoints,after:after.checkpoints,changes:changes.length,reservations:changes.filter(x=>x.kind==='reservation').length,regressions,structure:[...before.errors,...after.errors],contrasts:{before:before.contrastPairs,after:after.contrastPairs}};
}
function verifyRank(rank,ctx,{bound=44,minSession=1,maxSession=180}={}){
 const snapshot=JSON.stringify(ctx),a=rank(ctx),b=rank(ctx);
 check(JSON.stringify(ctx)===snapshot&&same(a,b)&&Array.isArray(a),'rank non pur/déterministe');
 const ids=new Set(ctx.candidates.map(q=>q.id)),seen=new Set();
 for(const x of a){check(ids.has(x.id)&&!seen.has(x.id)&&Number.isFinite(x.delta)&&Math.abs(x.delta)<=bound&&typeof x.reason==='string'&&x.reason.trim(),'rank hors contrat');seen.add(x.id)}
 if(ctx.session<minSession||ctx.session>maxSession)check(a.every(x=>x.delta===0),'intervention directe hors périmètre');
 return a;
}
module.exports={BASE,ENGINE,CATALOGUE,PROFILES,SEEDS,HORIZONS,CORE,DIRECTION,ZERO,guard,response,analyze,comparePair,compareCheckpoints,verifyRank};

/* QPJB #421 — local pedagogical ordering. Only rearranges an existing deck. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.QPJBCoherenceM2=api;
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const schema='QPJB_COHERENCE_M2_V1';
 const clean=x=>String(x||'').replace(/[\uFE0E\uFE0F\s]/g,'');
 const bid=q=>clean(q.answer);
 const opener=q=>String(q.auction?.[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠])|Passe|Contre|Surcontre)/)?.[1]||'';
 const pass=q=>q.theme==='ouv'&&bid(q)==='Passe';
 const major=q=>q.theme==='mineur'&&q.auction?.length===1&&((bid(q)==='1♥'&&q.shape?.[1]===4)||(bid(q)==='1♠'&&q.shape?.[0]===4));
 const sa=q=>q.theme==='mineur'&&q.auction?.length===1&&bid(q)==='1SA'&&q.shape?.[0]<4&&q.shape?.[1]<4;
 const fit=q=>q.theme==='majeur'&&/^1[♥♠]$/.test(opener(q))&&/^[2-7][♥♠]$/.test(bid(q))&&bid(q)[1]===opener(q)[1];
 const natural=/^(ouv\.majeure|mineur\.base|mineur\.soutien|majeur\.soutien|majeur\.base|red\.base|red\.bicolore|second\.base|intervenir\.base|apres_inter\.base|reponse_inter\.base|reveil\.base|apres_fit\.base|barrage\.ouverture|barrage\.reponse)$/;
 function decisionPattern(q,meta){
  const o=opener(q),a=bid(q),c=meta?.concept;
  if(q.auction?.length===1){
   if(fit(q))return 'fit-majeur|'+a[0];
   if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^[2-7][♣♦]$/.test(a)&&a[1]===o[1])return 'fit-mineur|'+a[0];
   if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^1[♥♠]$/.test(a))return 'reponse-majeure-sur-mineure';
   if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-mineure';
   if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-majeure';
  }
  if(!c||!a)return '';
  const sequence=[...(Array.isArray(q.auction)?q.auction:[]),a].map(v=>String(v).replace(/[\uFE0E\uFE0F]/g,'').trim().replace(/\s+/g,' ')).join('|');
  const variants=[sequence];
  if(natural.test(c))for(let mask=1;mask<4;mask++)variants.push(sequence.replace(/[♥♠♣♦]/g,x=>({'♥':mask&1?'♠':'♥','♠':mask&1?'♥':'♠','♣':mask&2?'♦':'♣','♦':mask&2?'♣':'♦'})[x]));
  return c+'|'+variants.sort()[0];
 }
 function feature(q,m,item){
  const kind=typeof (item?.kind||item?.target)==='string'?(item.kind||item.target):'';
  return {id:q.id,q,c:m?.concept||'',requires:[...new Set((Array.isArray(m?.requires)?m.requires:[]).map(x=>x?.concept).filter(Boolean))],stage:Number.isInteger(m?.stage)?m.stage:null,d:Number.isInteger(q.difficulty)?q.difficulty:null,
   a:bid(q),p:decisionPattern(q,m),t:q.theme,f:String(q.caseFamily||q.id),kind,selectionReason:typeof item?.reason==='string'?item.reason:'',
   role:kind==='maintenance'||kind==='revision'?'rappel':kind==='weakness'?'consolidation_ciblee':kind==='discovery'?'acquisition':kind==='transfer'?'reinvestissement_conditionnel':kind.startsWith('micro:')||kind.startsWith('axis:')?'consolidation_ciblee':'application'};
 }
 // Only explicit discriminants supported by actual shape, sequence, and answer.
 // No convention analogy, no inference of mastery, no claim of transfer for mirror cases.
 const regular=q=>Array.isArray(q.shape)&&['2,3,3,5','2,3,4,4','3,3,3,4'].includes(q.shape.slice().sort((a,b)=>a-b).join());
 const majorMax=q=>Math.max(q.shape?.[0]??99,q.shape?.[1]??99);
 const hBetween=(q,lo,hi)=>Number.isInteger(q.h)&&q.h>=lo&&q.h<=hi;
 function contrast(a,b){
  if(a.f===b.f||a.a===b.a)return '';
  const x=a.q,y=b.q;
  const empty=x.theme==='ouv'&&y.theme==='ouv'&&!x.auction?.length&&!y.auction?.length;
  const sameShape=Array.isArray(x.shape)&&Array.isArray(y.shape)&&x.shape.join()===y.shape.join();
  const sameAuction=x.auction?.length===1&&y.auction?.length===1&&x.auction[0]===y.auction[0];
  const naturalMinor=z=>z.c==='ouv.mineure'&&/^1[♣♦]$/.test(z.a);
  const naturalMajor=z=>z.c==='ouv.majeure'&&/^1[♥♠]$/.test(z.a)&&majorMax(z.q)>=5;
  if(empty&&a.c==='ouv.mineure'&&b.c===a.c){
   const tie=(q,n)=>q.shape?.[2]===n&&q.shape?.[3]===n&&q.shape?.[0]<5&&q.shape?.[1]<5;
   if((tie(x,3)&&a.a==='1♣'&&tie(y,4)&&b.a==='1♦')||(tie(y,3)&&b.a==='1♣'&&tie(x,4)&&a.a==='1♦'))return 'meilleure_mineure_egalite_3_3_4_4';
  }
  if(empty&&sameShape&&regular(x)&&regular(y)){
   const sa1=z=>z.c==='ouv.sa1'&&z.a==='1SA'&&hBetween(z.q,15,17);
   const sa2=z=>z.c==='ouv.sa2'&&z.a==='2SA'&&hBetween(z.q,20,21);
   const low=z=>naturalMinor(z)&&hBetween(z.q,12,14)&&majorMax(z.q)<5;
   if((sa1(a)&&low(b))||(sa1(b)&&low(a)))return 'ouverture_mineure_ou_1SA_meme_distribution_zones_force_distinctes';
   if((sa1(a)&&sa2(b))||(sa1(b)&&sa2(a)))return 'ouverture_1SA_ou_2SA_meme_distribution_zones_force_distinctes';
  }
  if(empty&&hBetween(x,12,14)&&hBetween(y,12,14)&&Math.abs(x.h-y.h)<=1&&
     ((naturalMajor(a)&&naturalMinor(b)&&majorMax(y)<5)||(naturalMajor(b)&&naturalMinor(a)&&majorMax(x)<5)))
   return 'ouverture_majeure_cinquieme_ou_mineure_force_comparable';
  if(empty&&sameShape&&
     ((pass(x)&&hBetween(x,0,11)&&hBetween(y,12,19)&&/^1[♣♦♥♠]$/.test(b.a))||(pass(y)&&hBetween(y,0,11)&&hBetween(x,12,19)&&/^1[♣♦♥♠]$/.test(a.a))))
   return 'passe_ou_ouverture_force_distribution_constante';
  if(sameAuction&&x.theme==='mineur'&&y.theme==='mineur'&&/^1[♣♦]$/.test(opener(x))&&
     ((major(x)&&sa(y))||(major(y)&&sa(x)))&&Number.isInteger(x.h)&&Number.isInteger(y.h)&&Math.abs(x.h-y.h)<=2)
   return 'reponse_majeure_quatrieme_ou_1SA';
  if(sameAuction&&x.theme==='majeur'&&y.theme==='majeur'&&/^1[♥♠]$/.test(opener(x))&&hBetween(x,6,10)&&hBetween(y,6,10)){
   const suit=opener(x)==='1♠'?0:1;
   const support=z=>fit(z.q)&&z.a==='2'+opener(z.q)[1]&&z.q.shape?.[suit]===3;
   const nonfit=z=>z.q.shape?.[suit]<=2&&(z.a==='1SA'||(opener(z.q)==='1♥'&&z.a==='1♠'));
   if((support(a)&&nonfit(b))||(support(b)&&nonfit(a)))return 'fit_majeur_5_3_ou_reponse_naturelle_sans_fit';
  }
  if(sameAuction&&opener(x)==='1SA'){
   const simple=z=>z.c==='sa1.seuil'&&regular(z.q)&&majorMax(z.q)<4&&
    ((z.a==='Passe'&&hBetween(z.q,0,7))||(z.a==='2SA'&&hBetween(z.q,8,9))||(z.a==='3SA'&&hBetween(z.q,10,15)));
   if(simple(a)&&simple(b))return 'reponse_sur_1SA_seuil_passe_invitation_manche';
   const stay=z=>z.c==='sa1.stayman'&&z.a==='2♣'&&majorMax(z.q)===4&&hBetween(z.q,8,15);
   const texas=z=>z.c==='sa1.texas'&&/^2[♦♥]$/.test(z.a)&&majorMax(z.q)===5&&Math.min(z.q.shape[0],z.q.shape[1])<4&&hBetween(z.q,8,15);
   if(Math.abs(x.h-y.h)<=2&&((stay(a)&&texas(b))||(stay(b)&&texas(a))))return 'stayman_quatre_ou_texas_cinq_cartes_force_comparable';
  }
  return '';
 }
 const HARD=['exact','triples','mirrors','nearMirrors','answerABAB','themeABAB','familyAdjacent'];
 const SOFT=['prereqOrderInversions','stageInversions','difficultyInversions','roleInversions','largeJumps','sameShape','sameForce','missedContrasts'];
 const weights={prereqOrderInversions:14,stageInversions:12,difficultyInversions:6,roleInversions:4,largeJumps:3,sameShape:1,sameForce:1,missedContrasts:10};
 function valid(f,s){
  if(f.length!==10||s>3)return true;
  const pp=f.flatMap((x,i)=>pass(x.q)?[i+1]:[]);
  if(s===1&&(pp.length!==3||f.some(x=>pass(x.q)&&!(x.q.difficulty===1&&Number.isInteger(x.q.h)&&x.q.h<12))))return false;
  if(s===2&&(pp.length<1||pp.length>2))return false;
  if(s===3&&pp.length>1)return false;
  const deadlines=s===1?[2,5,7]:[4,7];
  if(!pp.every((v,i)=>v<=deadlines[i]&&(!i||v-pp[i-1]>=2)))return false;
  if(s===2&&f.filter(x=>x.t==='ouv'&&!pass(x.q)).length>=2){
   if(!f.slice(0,2).every(x=>x.t==='ouv'&&!pass(x.q)))return false;
   const first=f.findIndex(x=>fit(x.q));
   if(first>=0&&[major,sa].some(fn=>f.some(x=>fn(x.q))&&!f.slice(0,first).some(x=>fn(x.q))))return false;
   const supports=f.flatMap((x,i)=>fit(x.q)?[i]:[]);
   if(supports.some((v,i)=>i&&v-supports[i-1]===1))return false;
  }
  return true;
 }
 function metric(f,s,links){
  const m=Object.fromEntries([...HARD,...SOFT].map(k=>[k,0]));
  const position=new Map(f.map((x,i)=>[x.id,i]));
  const first=new Map();for(let i=0;i<f.length;i++)if(!first.has(f[i].c))first.set(f[i].c,i);
  m.rawSameShape=0;m.rawSameForce=0;
  const linked=(a,b)=>links.some(l=>(l.a===a.id&&l.b===b.id)||(l.b===a.id&&l.a===b.id));
  for(let i=0;i<f.length;i++){
   const x=f[i],a=f[i-1],b=f[i-2],c=f[i-3];
   for(const req of x.requires)if(req!==x.c&&first.has(req)&&first.get(req)>i)m.prereqOrderInversions++;
   if(a){
    m.exact+=+(x.a===a.a);m.mirrors+=+(!!x.p&&x.p===a.p);m.familyAdjacent+=+(x.f===a.f);
    const shape=Array.isArray(x.q.shape)&&x.q.shape.join()===a.q.shape?.join(),force=Number.isInteger(x.q.h)&&x.q.h===a.q.h,meaningful=linked(x,a);
    m.rawSameShape+=+shape;m.rawSameForce+=+force;
    m.sameShape+=+(shape&&!meaningful);m.sameForce+=+(force&&!meaningful);
    m.largeJumps+=+(x.d!==null&&a.d!==null&&Math.abs(x.d-a.d)>=2);
   }
   if(b){m.nearMirrors+=+(!!x.p&&x.p===b.p);m.triples+=+(s>1&&x.t===a.t&&x.t===b.t);}
   if(c){m.answerABAB+=+(x.a===b.a&&a.a===c.a&&x.a!==a.a);m.themeABAB+=+(s>1&&x.t===b.t&&a.t===c.t&&x.t!==a.t);}
   for(let j=0;j<i;j++){
    const y=f[j];
    if(!x.c||x.c!==y.c)continue;
    if(x.stage!==null&&y.stage!==null&&x.stage<y.stage)m.stageInversions++;
    if(x.stage===y.stage&&x.d!==null&&y.d!==null&&x.d<y.d)m.difficultyInversions++;
    if(x.stage===y.stage&&x.d===y.d&&x.role==='rappel'&&y.role==='acquisition')m.roleInversions++;
   }
  }
  for(const l of links)if(Math.abs(position.get(l.a)-position.get(l.b))>2)m.missedContrasts++;
  return m;
 }
 // Risk is observable, not a new eligibility rule. A strict improvement may
 // consist solely of removing an ABAB pattern; the previous score missed it.
 const risk=m=>m.answerABAB+m.themeABAB+m.stageInversions;
 const score=m=>10000*risk(m)+SOFT.reduce((sum,k)=>sum+m[k]*weights[k],0);
 // The native selector emits French kind/reason values. These labels
 // describe the actual purpose of a question, not a proof of mastery.
 // Keep the certified numerical ordering policy unchanged: roleInversions
 // is the legacy heuristic on feature.role, not an actual-role metric.
 function annotateSelectionRole(kind,reason,priorExposure=false){
  if(reason==='rappel_erreur_aide'||reason==='renforcement_lacune')return 'consolidation_ciblee';
  if(reason==='rappel_question'||reason==='rappel_nouvelle_situation')return 'rappel';
  if(reason==='transfert_contexte')return 'reinvestissement_conditionnel';
  if(reason==='nouveau_qcm'||reason==='equilibre_ouvertures'||kind==='nouveau')return priorExposure?'application':'acquisition';
  if(kind==='revision'||kind==='maintenance')return 'rappel';
  if(kind==='weakness'||String(kind||'').startsWith('micro:')||String(kind||'').startsWith('axis:'))return 'consolidation_ciblee';
  if(kind==='transfer')return 'reinvestissement_conditionnel';
  if(kind==='discovery')return priorExposure?'application':'acquisition';
  return 'application';
 }
 function priorConcepts(ctx){
  const found=new Set(),m=ctx.metadataById||{};
  const observe=id=>{const c=m[id]?.concept;if(c)found.add(c);};
  for(const id of Object.keys(ctx.history?.entries||{}))observe(id);
  for(const event of ctx.history?.journal||[])for(const answer of event.answers||[])observe(answer.id);
  return found;
 }
 function explain(f,links,prior){
  const seen=new Set();
  return f.map((x,i)=>{
   const p=f[i-1],link=links.find(l=>(l.a===x.id||l.b===x.id)&&f.slice(Math.max(0,i-2),i).some(y=>y.id===(l.a===x.id?l.b:l.a)));
   const baseRole=annotateSelectionRole(x.kind,x.selectionReason,prior.has(x.c)||seen.has(x.c));
   const role=link?'discrimination':baseRole;
   const purpose=baseRole==='consolidation_ciblee'?'Renforcement ciblé selon le motif de sélection, sans preuve de maîtrise ajoutée.':
    baseRole==='rappel'?'Rappel d’une question ou d’une notion rencontrée, sans preuve de maîtrise ajoutée.':
    baseRole==='reinvestissement_conditionnel'?'Réinvestissement dans un autre contexte selon le motif de sélection ; transfert à vérifier.':
    baseRole==='acquisition'?'Premier exemple de cette notion non retrouvé dans l’historique fourni ni plus tôt dans cette séance ; acquisition, pas maîtrise.':
    'Application d’une notion déjà rencontrée dans l’historique fourni ou cette séance.';
   let reason=link?'Contraste attesté par les champs du catalogue : '+link.criterion+'. '+purpose:
    pass(x.q)?'Passe conservé comme décision à part entière, à une position autorisée. '+purpose:purpose;
   if(i===0&&baseRole==='rappel')reason='Rappel en amorce. '+reason;
   if(p&&x.c&&x.c===p.c&&x.stage!==null&&p.stage!==null&&x.stage>p.stage)reason+=' Stade supérieur après application plus simple.';
   if(p&&x.c&&x.c===p.c&&x.stage===p.stage&&x.d!==null&&p.d!==null&&x.d>p.d)reason+=' Difficulté croissante dans la même notion.';
   const anchors=f.slice(0,i).filter(y=>x.requires.includes(y.c)&&y.c!==x.c);
   if(anchors.length)reason+=' Prérequis déjà rencontré dans ce deck : '+[...new Set(anchors.map(y=>y.c))].join(', ')+'.';
   const prepares=f.slice(i+1).find(y=>y.requires.includes(x.c)&&y.c!==x.c);
   if(prepares&&!seen.has(x.c))reason+=' Cette question prépare '+prepares.c+' plus loin dans la séance.';
   if(p&&x.p&&x.p!==p.p)reason+=' Décision distincte de la précédente.';
   if(x.c)seen.add(x.c);
   return {id:x.id,position:i+1,role,baseRole,selectionRole:x.kind,selectionReason:x.selectionReason,reason,contrastWith:link?(link.a===x.id?link.b:link.a):null};
  });
 }
 function order(ctx={}){
  if(!ctx||typeof ctx!=='object')ctx={};
  const deck=Array.isArray(ctx.deck)?ctx.deck:[],ids=deck.map(x=>typeof x==='string'?x:x?.id||x?.exercise?.id);
  const fallback=(reason)=>({ids:ids.slice(),reasons:ids.map((id,i)=>({id,position:i+1,role:'historique',reason})),changed:false,status:reason});
  const s=ctx.session;
  if(!Number.isInteger(s)||s<1||ids.some(x=>typeof x!=='string')||new Set(ids).size!==ids.length)return fallback('invalid-context');
  if(ctx.history?.active)return fallback('active-session');
  if(ids.length<2||ids.length>20)return fallback('deck-size');
  const exercises=new Map((Array.isArray(ctx.exercises)?ctx.exercises:[]).filter(q=>q&&typeof q.id==='string').map(q=>[q.id,q]));
  const selected=new Map((Array.isArray(ctx.selected)?ctx.selected:[]).map(x=>[x?.id||x?.exercise?.id,x]));
  const f=deck.map((x,i)=>{const q=x?.exercise||(x?.answer?x:exercises.get(ids[i]));const m=ctx.metadataById?.[ids[i]];return q&&m?.concept?feature(q,m,selected.get(ids[i])||x):null});
  if(f.some(x=>!x))return fallback('metadata-unavailable');
  if(!valid(f,s))return fallback('historical-guard');
  const links=[];
  for(let i=0;i<f.length;i++)for(let j=i+1;j<f.length;j++){
   const criterion=contrast(f[i],f[j]);if(criterion)links.push({a:f[i].id,b:f[j].id,criterion});
  }
  const before=metric(f,s,links);
  // Optional M3 transition advice: only pairs actually present in this deck,
  // and only before the first documented elementary example.
  const requested=(Array.isArray(ctx.transitionGroups)?ctx.transitionGroups:[]).filter(g=>
   Array.isArray(g.simple)&&Array.isArray(g.complex)&&f.some(x=>g.simple.includes(x.id))&&f.some(x=>g.complex.includes(x.id)));
  const exposed=new Set();
  if(requested.length){
   for(const row of ctx.history?.journal||[])if(row.mode==='parcours'&&row.session<s)
    for(const a of row.answers||[])exposed.add(a.id);
   for(const [id,e] of Object.entries(ctx.history?.entries||{}))
    if(e?.assessment&&e.assessment.lastSession<s-1)exposed.add(id);
  }
  const groups=requested.filter(g=>!g.simple.some(id=>exposed.has(id)));
  function transitionCost(p){
   let n=0;
   for(const g of groups){
    const first=p.findIndex(x=>g.simple.includes(x.id));
    if(first>=0)n+=p.slice(0,first).filter(x=>g.complex.includes(x.id)).length;
   }
   return n;
  }
  const semanticBefore=transitionCost(f);
  const candidateScore=(p,m)=>score(m)+10000000*transitionCost(p);
  // #419 coordinateur: optional experimental constraint. record() updates
  // skills independently by theme but is sensitive to within-theme order.
  // Retain the exact sequence per theme; never change storage or scoring.
  const preserveThemeOrder=ctx.preserveThemeOrder===true;
  const originalIndex=new Map(f.map((x,i)=>[x.id,i]));
  function candidateValid(p){
   if(!valid(p,s))return false;
   if(!preserveThemeOrder)return true;
   const last=new Map();
   for(const x of p){
    const i=originalIndex.get(x.id);
    if(last.has(x.t)&&i<last.get(x.t))return false;
    last.set(x.t,i);
   }
   return true;
  }
  // Preserve every historical diversity guard and every pedagogical cost
  // on the final permutation. An adjacent true contrast may intentionally
  // share a distribution/force; raw values are retained for audit.
  let current=f,after=before;
  function admissible(p,m){return candidateValid(p)&&transitionCost(p)<=semanticBefore&&!HARD.some(k=>m[k]>before[k])&&!SOFT.some(k=>m[k]>before[k]);}
  function alternatives(deck,relocate){
   const out=[];
   for(let i=0;i<deck.length;i++)for(let j=i+1;j<deck.length;j++){
    const p=deck.slice();[p[i],p[j]]=[p[j],p[i]];out.push(p);
    if(relocate&&j>i+1){const a=deck.slice(),b=deck.slice();a.splice(j,0,a.splice(i,1)[0]);b.splice(i,0,b.splice(j,1)[0]);out.push(a,b);}
   }
   return out;
  }
  for(let k=0;k<2;k++){
   let best=current,bestM=after;
   const firstMoves=alternatives(current,s<=5||risk(after)>0);
   for(const p of firstMoves){
    if(!candidateValid(p))continue;
    const m=metric(p,s,links);
    if(admissible(p,m)&&candidateScore(p,m)<candidateScore(best,bestM)){best=p;bestM=m;}
   }
   // An early contrast often needs two moves to retain Passe and fit guards.
   // Search at most 24 near candidates, not an unrestricted factorial search.
   if(best===current&&((s<=5&&(after.missedContrasts||after.prereqOrderInversions))||risk(after)>0)){
    const near=firstMoves.filter(p=>candidateValid(p)).map(p=>({p,m:metric(p,s,links)}))
     .sort((a,b)=>(HARD.reduce((v,k)=>v+Math.max(0,a.m[k]-before[k]),0)-HARD.reduce((v,k)=>v+Math.max(0,b.m[k]-before[k]),0))||candidateScore(a.p,a.m)-candidateScore(b.p,b.m)).slice(0,24);
    for(const n of near)for(const p of alternatives(n.p,false)){
     if(!candidateValid(p))continue;
     const m=metric(p,s,links);
     if(admissible(p,m)&&candidateScore(p,m)<candidateScore(best,bestM)){best=p;bestM=m;}
    }
   }
   if(best===current)break;
   current=best;after=bestM;
  }
  // S2 can need three coordinated swaps: simple fit before the harder fit,
  // while all early positions, Passe deadlines and diversity remain valid.
  // Search only if an actual inversion survives local moves. First two
  // openings are compulsory; stop at the first zero-risk strict improvement.
  let rescueNodes=0;
  if(s===2&&f.length===10&&risk(after)>0){
   const work=current.slice(),hasNatural=[major,sa].map(fn=>work.some(x=>fn(x.q)));
   const visit=(prefix,remaining)=>{
    if(++rescueNodes>90000)return false;
    if(!remaining.length){
     if(!candidateValid(prefix))return false;
     const m=metric(prefix,s,links);
     if(admissible(prefix,m)&&candidateScore(prefix,m)<candidateScore(current,after)&&risk(m)===0){
      current=prefix.slice();after=m;return true;
     }
     return false;
    }
    const pos=prefix.length;
    for(let i=0;i<remaining.length;i++){
     const x=remaining[i];
     if(preserveThemeOrder&&remaining.some(y=>y.t===x.t&&originalIndex.get(y.id)<originalIndex.get(x.id)))continue;
     if(pos<2&&(x.t!=='ouv'||pass(x.q)))continue;
     if(pos>=2&&fit(x.q)&&[major,sa].some((fn,j)=>hasNatural[j]&&!prefix.some(y=>fn(y.q))))continue;
     if(fit(x.q)&&remaining.some(y=>y!==x&&y.c===x.c&&y.stage!==null&&x.stage!==null&&y.stage<x.stage))continue;
     if(prefix.some(y=>y.c===x.c&&y.stage!==null&&x.stage!==null&&y.stage>x.stage))continue;
     const last=prefix.at(-1),prev=prefix.at(-2),third=prefix.at(-3);
     if(last&&(x.a===last.a&&before.exact===0||x.p&&x.p===last.p&&before.mirrors===0||x.f===last.f&&before.familyAdjacent===0||fit(x.q)&&fit(last.q)||pass(x.q)&&pass(last.q)))continue;
     if(prev&&(x.p&&x.p===prev.p&&before.nearMirrors===0||x.t===last.t&&x.t===prev.t&&before.triples===0))continue;
     if(third&&(x.a===prev.a&&last.a===third.a&&x.a!==last.a||x.t===prev.t&&last.t===third.t&&x.t!==last.t))continue;
     const chosenPass=prefix.filter(y=>pass(y.q)).length+Number(pass(x.q));
     if(pos>=3&&chosenPass<1||pos>=6&&work.filter(y=>pass(y.q)).length===2&&chosenPass<2)continue;
     if(visit([...prefix,x],remaining.filter((_,j)=>j!==i)))return true;
    }
    return false;
   };
   visit([],work);
  }
  // Early lessons: a bounded beam can recover useful combinations of moves
  // which a greedy pass cannot reach. Only the final permutation is eligible,
  // and every original HARD/SOFT bound still applies. No ID-specific rules.
  if(s<=20&&f.length===10&&(after.prereqOrderInversions||after.largeJumps||after.missedContrasts||transitionCost(current))){
   const seen=new Set([current.map(x=>x.id).join('|')]);
   let frontier=[{p:current,m:after}];
   for(let depth=0;depth<3;depth++){
    const next=[];
    for(const n of frontier)for(const p of alternatives(n.p,true)){
     if(!candidateValid(p))continue;
     const key=p.map(x=>x.id).join('|');if(seen.has(key))continue;seen.add(key);
     const m=metric(p,s,links);
     if(admissible(p,m)&&candidateScore(p,m)<candidateScore(current,after)){current=p;after=m;}
     const excess=[...HARD,...SOFT].reduce((v,k)=>v+Math.max(0,m[k]-before[k]),0);
     next.push({p,m,key,excess});
    }
    next.sort((a,b)=>a.excess-b.excess||candidateScore(a.p,a.m)-candidateScore(b.p,b.m)||(a.key<b.key?-1:a.key>b.key?1:0));
    frontier=next.slice(0,8);if(!frontier.length||!(after.prereqOrderInversions||after.largeJumps||after.missedContrasts||transitionCost(current)))break;
   }
  }
  const prior=priorConcepts(ctx);
  return {ids:current.map(x=>x.id),reasons:explain(current,links,prior),changed:current!==f,
   status:current===f?'historical-optimal-or-no-safe-swap':'improved',beforeReasons:explain(f,links,prior),before,after,contrastPairs:links,scoreBefore:score(before),scoreAfter:score(after),rescueNodes,...(groups.length?{semanticBefore,semanticAfter:transitionCost(current)}:{})};
 }
 return Object.freeze({schema,order,decisionPattern,annotateSelectionRole,HARD:Object.freeze(HARD),SOFT:Object.freeze(SOFT),weights:Object.freeze(weights)});
});
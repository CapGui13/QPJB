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
  return {id:q.id,q,c:m?.concept||'',stage:Number.isInteger(m?.stage)?m.stage:null,d:Number.isInteger(q.difficulty)?q.difficulty:null,
   a:bid(q),p:decisionPattern(q,m),t:q.theme,f:String(q.caseFamily||q.id),kind,
   role:kind==='maintenance'||kind==='revision'?'rappel':kind==='weakness'?'consolidation_ciblee':kind==='discovery'?'acquisition':kind==='transfer'?'reinvestissement_conditionnel':kind.startsWith('micro:')||kind.startsWith('axis:')?'consolidation_ciblee':'application'};
 }
 // Only explicit discriminants supported by actual shape, sequence, and answer.
 // No convention analogy, no inference of mastery, no claim of transfer for mirror cases.
 function contrast(a,b){
  if(a.f===b.f||a.a===b.a)return '';
  const x=a.q,y=b.q;
  if(x.theme==='ouv'&&y.theme==='ouv'&&!x.auction?.length&&!y.auction?.length&&a.c==='ouv.mineure'&&b.c===a.c){
   const tie=(q,n)=>q.shape?.[2]===n&&q.shape?.[3]===n&&q.shape?.[0]<5&&q.shape?.[1]<5;
   if((tie(x,3)&&a.a==='1♣'&&tie(y,4)&&b.a==='1♦')||(tie(y,3)&&b.a==='1♣'&&tie(x,4)&&a.a==='1♦'))return 'meilleure_mineure_egalite_3_3_4_4';
  }
  if(x.theme==='mineur'&&y.theme==='mineur'&&opener(x)===opener(y)&&/^1[♣♦]$/.test(opener(x))&&x.auction?.[0]===y.auction?.[0]&&
     ((major(x)&&sa(y))||(major(y)&&sa(x)))&&Number.isInteger(x.h)&&Number.isInteger(y.h)&&Math.abs(x.h-y.h)<=2)
   return 'reponse_majeure_quatrieme_ou_1SA';
  if(x.theme==='ouv'&&y.theme==='ouv'&&!x.auction?.length&&!y.auction?.length&&Array.isArray(x.shape)&&x.shape.join()===y.shape?.join()&&
     ((pass(x)&&x.h<=11&&y.h>=12&&/^1[♣♦♥♠]$/.test(b.a))||(pass(y)&&y.h<=11&&x.h>=12&&/^1[♣♦♥♠]$/.test(a.a))))
   return 'passe_ou_ouverture_force_distribution_constante';
  return '';
 }
 const HARD=['exact','triples','mirrors','nearMirrors','answerABAB','themeABAB','familyAdjacent'];
 const SOFT=['stageInversions','difficultyInversions','roleInversions','largeJumps','sameShape','sameForce','missedContrasts'];
 const weights={stageInversions:12,difficultyInversions:6,roleInversions:4,largeJumps:3,sameShape:1,sameForce:1,missedContrasts:5};
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
  for(let i=0;i<f.length;i++){
   const x=f[i],a=f[i-1],b=f[i-2],c=f[i-3];
   if(a){
    m.exact+=+(x.a===a.a);m.mirrors+=+(!!x.p&&x.p===a.p);m.familyAdjacent+=+(x.f===a.f);
    m.sameShape+=+(Array.isArray(x.q.shape)&&x.q.shape.join()===a.q.shape?.join());
    m.sameForce+=+(Number.isInteger(x.q.h)&&x.q.h===a.q.h);
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
 const score=m=>SOFT.reduce((sum,k)=>sum+m[k]*weights[k],0);
 function explain(f,links){
  const seen=new Set();
  return f.map((x,i)=>{
   const p=f[i-1],link=links.find(l=>(l.a===x.id||l.b===x.id)&&f.slice(Math.max(0,i-2),i).some(y=>y.id===(l.a===x.id?l.b:l.a)));
   const role=link?'discrimination':x.role;
   let reason=link?'Contraste attesté par les champs du catalogue : '+link.criterion:
    pass(x.q)?'Passe conservé comme décision à part entière, à une position autorisée.':
    !seen.has(x.c)&&x.c?'Premier exemple de ce concept dans cette séance ; motif de sélection conservé.':
    'Application supplémentaire du concept, sans modifier le motif de sélection.';
   if(i===0&&role==='rappel')reason='Rappel en amorce ; aucune preuve de maîtrise déduite.';
   if(p&&x.c&&x.c===p.c&&x.stage!==null&&p.stage!==null&&x.stage>p.stage)reason+=' Stade supérieur après application plus simple.';
   if(p&&x.p&&x.p!==p.p)reason+=' Décision distincte de la précédente.';
   if(x.c)seen.add(x.c);
   return {id:x.id,position:i+1,role,selectionRole:x.kind,reason,contrastWith:link?(link.a===x.id?link.b:link.a):null};
  });
 }
 function order(ctx={}){
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
  // Preserve all existing diversity guards; require a strict pedagogical gain.
  // Limit to two deterministic best-improvement passes, no random or clock inputs.
  let current=f,after=before;
  for(let k=0;k<2;k++){
   let best=current,bestM=after;
   for(let i=0;i<current.length;i++)for(let j=i+1;j<current.length;j++){
    const p=current.slice();[p[i],p[j]]=[p[j],p[i]];
    if(!valid(p,s))continue;
    const m=metric(p,s,links);
    if(HARD.some(key=>m[key]>before[key])||SOFT.some(key=>m[key]>before[key]))continue;
    if(score(m)<score(bestM)){best=p;bestM=m;}
   }
   if(best===current)break;
   current=best;after=bestM;
  }
  return {ids:current.map(x=>x.id),reasons:explain(current,links),changed:current!==f,
   status:current===f?'historical-optimal-or-no-safe-swap':'improved',beforeReasons:explain(f,links),before,after,contrastPairs:links,scoreBefore:score(before),scoreAfter:score(after)};
 }
 return Object.freeze({schema,order,decisionPattern,HARD:Object.freeze(HARD),SOFT:Object.freeze(SOFT),weights:Object.freeze(weights)});
});
/* QPJB #396/#398. M2 durable — post-réponse, aucune modification du moteur. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-durable-m2-data.js'));
 else root.QPJBDurableRemediation=factory(root.QPJBDurableM2Data);
})(typeof globalThis!=='undefined'?globalThis:this,function(data){
 'use strict';
 const schema='QPJB_DURABLE_REMEDIATION_V1', own=(o,k)=>o!=null&&Object.prototype.hasOwnProperty.call(o,k);
 const suits=['♠','♥','♦','♣'], names=['Piques','Cœurs','Carreaux','Trèfles'];
 const labels={force:'évaluation de la force',distribution:'longueurs et distribution',fit:'recherche du fit',priorite:'priorité des enchères',niveau:'choix du palier',forcing:'caractère forcing',convention:'signification de la convention',competition:'contexte compétitif',contexte:'contexte de la séquence'};
 const bid=s=>typeof s==='string'&&/^(?:[1-7](?:♠|♥|♦|♣|SA)|Passe|Contre|Surcontre)$/.test(s);
 function signature(q){return JSON.stringify([q.id,q.theme,q.h,q.shape,q.hand,q.auction,q.context,q.answer,q.choices,q.explain,q.caseFamily]);}
 // Version guard, not a security primitive; full frozen catalogue remains the source of truth.
 function fingerprint(q){const s=signature(q);let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return [s.length,(a>>>0).toString(36),(b>>>0).toString(36)].join(':');}
 function valid(q){return !!q&&typeof q.id==='string'&&typeof q.context==='string'&&typeof q.explain==='string'&&q.explain.length>0&&bid(q.answer)&&Array.isArray(q.choices)&&q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)&&q.choices.every(bid)&&Array.isArray(q.auction)&&q.auction.every(a=>typeof a==='string')&&Array.isArray(q.hand)&&q.hand.length===4&&Array.isArray(q.shape)&&q.shape.length===4&&q.hand.every((s,i)=>Array.isArray(s)&&s.length===q.shape[i]&&new Set(s).size===s.length&&s.every(c=>/^(?:A|R|D|V|10|[2-9])$/.test(c)))&&q.shape.reduce((a,b)=>a+b,0)===13&&q.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0)===q.h;}
 function explicit(q,choice){
  // Exact rejected bid + local contrast marker; conservative heuristic, not editorial certification.
  const esc=choice.replace(/[.*+?^$()|[\]\\]/g,'\\$&');
  const re=new RegExp('(?:^|[^0-9A-Za-z])'+esc+'(?![0-9A-Za-z])','u');
  return q.explain.split(/[.!?;]\s*/).some(s=>re.test(s)&&/trop|insuffis|ne (?:convient|permet|montre|décrit|correspond|promet|garantit|justifie)|n[’'](?:est|a|annonc)|masquer|surévalu|sous-évalu|au contraire|contrairement|plutôt que|et non|pas (?:de |la |le |les |un |une )|inutile|risqu|fermerait|empêcherait|serait (?:faible|fort|prématur)/i.test(s));
 }
 const rule=(id,feedback,checkNext,criteria)=>({id,feedback,checkNext,criteria});
 // Every branch requires a real hand, exact sequence, compatible canonical text and diagnostic axis.
 function contextual(q,c,axis){
  if(!valid(q)||c===q.answer||!q.choices.includes(c))return null;
  const h=q.h,s=q.shape,x=q.explain,a=q.auction,ans=q.answer,reg=['4333','4432','5332'].includes([...s].sort((a,b)=>b-a).join(''));
  const count=ch=>s[suits.indexOf(ch)], nm=ch=>names[suits.indexOf(ch)];
  const opening=q.theme==='ouv'&&a.length===0&&/ouvr|donneur/i.test(q.context+' '+x);
  if(opening){
   if(axis==='distribution'&&/^1[♥♠]$/.test(c)&&count(c[1])<5&&/majeure|cinquième|cinq cartes/i.test(x)&&/ouvr/i.test(x))
    return rule('opening-major-length','Tu as '+count(c[1])+' '+nm(c[1])+'. La majeure choisie ne compte pas cinq cartes.','Sur une autre ouverture, vérifie la force puis compte les cartes de chaque majeure.',['force-ouverture','longueur-majeure-ouverture']);
   if(axis==='force'&&reg&&s[0]<5&&s[1]<5&&((ans==='1SA'&&h>=15&&h<=17&&c==='2SA'&&/15\s*[–-]\s*17\s*H/.test(x))||(ans==='2SA'&&h>=20&&h<=21&&c==='1SA'&&/20\s*[–-]\s*21\s*H/.test(x)))&&/régulièr/i.test(x))
    return rule('opening-sa-zone',c==='2SA'?'2SA annoncerait 20–21 H, contre '+h+' H ici.':'1SA annoncerait 15–17 H : '+h+' H dépassent cette zone.','Sur une autre main régulière, distingue les deux zones de force avant de regarder les couleurs.',['force-ouverture','zone-sa']);
   if(axis==='priorite'&&reg&&s[0]<5&&s[1]<5&&/^1[♣♦]$/.test(c)&&ans==='1SA'&&h>=15&&h<=17&&/15\s*[–-]\s*17\s*H/.test(x)&&/régulièr/i.test(x))
    return rule('opening-sa-priority','La mineure choisie ne précise pas la force de '+h+' H et la régularité aussi directement que 1SA.','Sur une autre main régulière, vérifie la zone de Sans-Atout avant de chercher une mineure.',['force-ouverture','priorite-sa']);
   if(axis==='priorite'&&/^1[♣♦]$/.test(c)&&/^1[♣♦]$/.test(ans)&&s[0]<5&&s[1]<5&&/meilleure mineure/i.test(x)&&/Carreaux|Trèfles/i.test(x)){
    const expected=s[2]>s[3]?'1♦':s[2]<s[3]?'1♣':s[2]===3?'1♣':s[2]===4?'1♦':null;
    if(expected===ans)return rule('opening-minor-comparison','Compare les '+s[2]+' Carreaux aux '+s[3]+' Trèfles : ce sont les longueurs qui départagent les deux mineures.','Sur une autre main sans majeure cinquième, compare les deux mineures, y compris si elles sont de même longueur.',['longueur-mineures','egalite-mineures']);
   }
   if(axis==='force'&&ans==='Passe'&&h<12&&Math.max(...s)<=4&&/^1(?:[♣♦♥♠]|SA)$/.test(c)&&/12\s*H|13\s*HL/.test(x))
    return rule('opening-pass-force','Avec '+h+' H et aucune cinquième carte, aucun point de longueur ne vient compléter la force.','Sur une autre main, vérifie la force d’ouverture avant de chercher la couleur.',['force-ouverture','points-longueur']);
  }
  const firstMinor=q.theme==='mineur'&&a.length===1&&/^Partenaire : 1[♣♦]$/.test(a[0]);
  if(firstMinor&&/^1[♥♠]$/.test(ans)&&count(ans[1])>=4&&/quatre|4 cartes|cinq|5 cartes|majeure/i.test(x)){
   if(axis==='priorite'&&c==='1SA')return rule('response-minor-major-first','1SA ne montrerait pas les '+count(ans[1])+' '+nm(ans[1])+' disponibles.','Sur une autre réponse à une mineure, cherche une majeure annonçable avant Sans-Atout.',['force-reponse','majeure-reponse']);
   if(axis==='distribution'&&/^1[♥♠]$/.test(c)&&count(c[1])<4&&/quatre|4 cartes/i.test(x))return rule('response-minor-major-length','La majeure choisie ne compte que '+count(c[1])+' cartes.','Sur une autre réponse à une mineure, compte les cartes de chaque majeure.',['majeure-reponse','longueur-majeure-reponse']);
   if(axis==='force'&&c==='Passe'&&h>=6&&/répondre|réponse/.test(x))return rule('response-minor-force','Avec '+h+' H, le corrigé retient une réponse plutôt que Passe.','Sur une autre main, décide d’abord si tu as assez de force pour répondre.',['force-reponse']);
  }
  const major=a.length===1&&/^Partenaire : 1[♥♠]$/.test(a[0])?a[0].slice(-1):null;
  if(q.theme==='majeur'&&major&&ans==='2'+major&&count(major)>=3&&/fit|atouts/i.test(x)&&axis==='fit'&&c==='1SA')
   return rule('response-major-fit','Le partenaire promet cinq '+nm(major)+' et tu en as '+count(major)+'. Le fit est déjà établi.','Sur une autre main, calcule le nombre d’atouts communs avant d’envisager Sans-Atout.',['fit-majeur','atouts-communs']);
  const sa=a.length===1&&/^Partenaire : [12]SA(?: \([^)]*\))?$/.test(a[0])?a[0].match(/[12]SA/)[0]:null;
  if(sa&&axis==='convention'&&/Stayman/i.test(x)&&/Texas/i.test(x+' '+q.context)&&ans===(sa==='1SA'?'2♣':'3♣')&&/^([23])[♦♥]$/.test(c)&&c[0]===ans[0]&&Math.max(s[0],s[1])>=4){
   const dest=c[1]==='♦'?'♥':'♠';
   if(count(dest)<5)return rule('stayman-texas-length','Le Texas choisi désignerait '+nm(dest)+', où tu n’as que '+count(dest)+' cartes.','Sur une autre réponse à Sans-Atout, distingue la recherche d’un fit 4–4 et l’annonce d’une majeure longue.',['stayman-texas','longueur-majeure']);
  }
  if(axis==='convention'&&q.theme==='chelem'&&a.length===1&&/^Partenaire : 4SA.*(?:Blackwood|clés)/i.test(a[0])&&/30\s*[–-]\s*41/.test(q.context+' '+x)&&/clés/i.test(x)&&/^5[♣♦♥♠]$/.test(c)){
   const t=q.context.match(/Atout\s+(Pique|Cœur|Carreau|Trèfle)\s+agréé/i);
   if(t){const j=['pique','cœur','carreau','trèfle'].indexOf(t[1].toLowerCase());const n=q.hand.filter(cards=>cards.includes('A')).length+Number(q.hand[j].includes('R'));const expected=n===0||n===3?'5♣':n===1||n===4?'5♦':n===2?(q.hand[j].includes('D')?'5♠':'5♥'):null;
    if(expected===ans)return rule('blackwood-count-keys','À l’atout '+names[j]+', compte '+q.hand.filter(cards=>cards.includes('A')).length+' As et '+Number(q.hand[j].includes('R'))+' Roi d’atout : '+n+' clé(s).','Sur une autre main, nomme l’atout agréé, compte les clés puis distingue les réponses 30–41.',['blackwood-atout','blackwood-cles','blackwood-code']);
   }
  }
  return null;
 }
 function rowFor(q){const row=q&&own(data?.rows,q.id)?data.rows[q.id]:null;return row&&row[0]===fingerprint(q)?row:null;}
 function option(row,c){return row&&row[3].find(v=>v[0]===c);}
 function match(d,q,c,v){return !!v&&!!d&&d.status==='hypothesis'&&d.category===v[1]&&d.confidence===v[2]&&['high','medium'].includes(d.confidence)&&own(labels,d.category)&&d.evidence?.id===q.id&&d.evidence?.choice===c&&d.evidence?.expected===q.answer&&d.evidence?.offered===true&&(!d.evidence.concept||d.evidence.concept===rowFor(q)?.[1])&&d.evidence?.rule===v[3];}
 function repeat(history,row,c,axis,id){
  const live=history&&Array.isArray(history.journal)&&Number.isInteger(history.completed);
  const exp=history?.format==='QPJB_PROGRESS_EXPORT_1'&&Array.isArray(history.sessions)&&Number.isInteger(history.summary?.completedSessions);
  if(!live&&!exp)return null;
  const events=live?history.journal:history.sessions,completed=live?history.completed:history.summary.completedSessions;
  if(completed<1)return null;
  const fam=new Set(),sess=new Set();let exact=false;
  for(const e of events){if(e?.mode!=='parcours'||!Number.isInteger(e.session)||e.session<Math.max(1,completed-5)||e.session>completed||!Array.isArray(e.answers))continue;
   for(const a of e.answers){if(!a||a.assisted!==false||a.hadFreeError===true||a.result!=='wrong'||!bid(a.choice))continue;
    const r=own(data?.rows,a.id)?data.rows[a.id]:null,v=option(r,a.choice);
    if(!r||!v||!['high','medium'].includes(v[2])||v[1]!==axis||!r[2]||(a.family&&a.family!==r[2]))continue;
    if(a.id===id&&a.choice===c)exact=true;
    if(r[2]!==row[2]){fam.add(r[2]);sess.add(e.session);}
   }
  }
  if(fam.size>=2&&sess.size>=2)return 'Deux choix antérieurs sur des familles distinctes concernaient aussi ce critère : '+labels[axis]+'. Cela ne prouve pas une cause identique.';
  if(exact)return 'Cette même enchère avait déjà été choisie sur cet exercice. Reprends le critère de décision.';
  return null;
 }
 function explain(input={}){
  const q=input?.exercise,a=input?.answer;
  const out={canonical:'',feedback:null,reminder:null,checkNext:null,targetConcept:null,targetCriteria:[],kind:'unanswered'};
  if(!q||!a||!['correct','wrong','skipped'].includes(a.result)||(a.id!=null&&a.id!==q.id))return out;
  out.canonical=typeof q.explain==='string'?q.explain:'';
  if(a.result==='skipped')return {...out,kind:'skipped'};
  if(!bid(a.choice)||!bid(q.answer)||(a.result==='correct')!==(a.choice===q.answer))return {...out,kind:'unknown'};
  const row=valid(q)?rowFor(q):null;
  if(a.result==='correct'&&a.hadFreeError!==true)return a.assisted===true?{...out,kind:'assisted',checkNext:'Sur une autre main, formule ton enchère avant de regarder les propositions.'}:{...out,kind:a.assisted===false&&a.hadFreeError===false?'correct':'correct-unverified'};
  const corrected=a.result==='correct',c=corrected?a.firstGuess:a.choice;
  const fallback=corrected?{...out,kind:'corrected',checkNext:'Sur une autre main, justifie ton enchère avant de regarder les propositions.'}:{...out,kind:'wrong-unknown'};
  if(!row||!bid(c)||c===q.answer||!q.choices.includes(c))return fallback;
  const v=option(row,c),d=input.diagnostic;
  if(!match(d,q,c,v))return fallback;
  const r=contextual(q,c,d.category);
  // Preserve the actual historical targeted feedback; do not broaden signed text to another option.
  const old=v[4],selected=old?{id:'legacy',feedback:old[0],checkNext:old[1],criteria:[d.category]}:r;
  if(!selected)return corrected?fallback:{...out,kind:'canonical-only'};
  const feedback=old?selected.feedback:explicit(q,c)?null:selected.feedback;
  return {...out,kind:corrected?'corrected-targeted':'targeted',feedback:feedback?(corrected?'Sur ta première enchère : '+feedback:feedback):null,reminder:repeat(input.history,row,c,d.category,q.id),checkNext:selected.checkNext,targetConcept:row[1],targetCriteria:selected.criteria.slice()};
 }
 return Object.freeze({schema,explain,contextual,explicit,valid,fingerprint});
});

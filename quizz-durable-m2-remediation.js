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
 function digest(s){let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return [s.length,(a>>>0).toString(36),(b>>>0).toString(36)].join(':');}
 function fingerprint(q){return digest(signature(q));}
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
   if(axis==='force'&&c==='Passe'&&h>=6&&/répondre|réponse/.test(x))return rule('response-minor-force',null,'Sur une autre main, décide d’abord si tu as assez de force pour répondre.',['force-reponse']);
  }
  const major=a.length===1&&/^Partenaire : 1[♥♠]$/.test(a[0])?a[0].slice(-1):null;
  if(q.theme==='majeur'&&major&&ans==='2'+major&&count(major)>=3&&/fit|atouts/i.test(x)&&axis==='fit'&&c==='1SA')
   return rule('response-major-fit','Le partenaire promet cinq '+nm(major)+' et tu en as '+count(major)+'. Le fit est déjà établi.','Sur une autre main, calcule le nombre d’atouts communs avant d’envisager Sans-Atout.',['fit-majeur','atouts-communs']);
  if(q.theme==='majeur'&&major&&axis==='fit'&&c==='2'+major&&count(major)<3&&/fit|atouts|soutien|soutenir|deux (?:Cœurs|Piques)/i.test(x)&&/deux|2 cartes|singleton|chicane|pas.*fit|absence.*fit/i.test(x))
   return rule('response-major-short-fit','Avec '+count(major)+' cartes en soutien, les cinq cartes promises ne suffisent pas à établir huit atouts communs.','Sur une autre réponse à une majeure, compte les atouts garantis avant de choisir un soutien.',['fit-majeur','atouts-communs']);
  if(axis==='convention'&&a.length===2&&a[0]==='Vous : 1SA'&&/^Partenaire : 2♣/.test(a[1])&&/Stayman/i.test(x+' '+q.context)&&/majeure|quatre|4 cartes/i.test(x)&&['2♦','2♥','2♠','2SA'].includes(c)){
   const expected=s[0]>=4?(s[1]>=4?'2SA':'2♠'):(s[1]>=4?'2♥':'2♦');
   if(ans===expected)return rule('stayman-response-count','Tu détiens '+s[0]+' Piques et '+s[1]+' Cœurs : vérifie que le code choisi décrit bien ces deux longueurs.','Sur une autre ouverture à 1SA suivie du Stayman, compte séparément les deux majeures puis retrouve le code.',['stayman-code','deux-majeures']);
  }
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

 // Réinvestissement: une question de méthode, pas une deuxième explication.
 // Les DEUX textes doivent corroborer l'axe, la main et la séquence sont validées,
 // et le diagnostic exact a été signé par le registre de la base.
 function transfer(q,c,d,concept){
  if(!valid(q)||!d||!d.reason||!q.choices.includes(c)||c===q.answer)return null;
  const x=q.explain,y=d.reason,a=q.auction,s=q.shape,ans=q.answer,axis=d.category;
  const both=re=>re.test(x)&&re.test(y), partner=a.some(v=>/^Partenaire : (?!Passe)/.test(v)), opp=a.some(v=>/^Adversaire : (?!Passe)/.test(v));
  const result=(id,prompt,criteria)=>rule(id,null,prompt,criteria);
  const scope=q.theme==='intervenir'?'avant d’intervenir':q.theme==='reveil'?'en position de réveil':q.theme==='ouv'?'avant d’ouvrir':q.theme==='red'?'avant ta redemande':q.theme==='second'?'à ta deuxième enchère':'dans cette séquence';
  const reg=['4333','4432','5332'].includes([...s].sort((a,b)=>b-a).join(''));
  const bidSuit=b=>/^[1-7][♠♥♦♣]$/.test(b)?b[1]:null;
  const cs=bidSuit(c),as=bidSuit(ans),length=z=>s[suits.indexOf(z)];
  // Conditions spécifiques : rôle, palier, longueurs et preuve dans les deux textes.
  const partnerOpen=a.length===1&&/^Partenaire : 1[♣♦♥♠]$/.test(a[0]);
  const direct=a.length===1&&/^Adversaire : 1[♣♦♥♠]$/.test(a[0]);
  const hl=q.h+s.reduce((n,k)=>n+Math.max(0,k-4),0);
  if(axis==='force'&&q.theme==='ouv'&&a.length===0&&c==='Passe'&&/^1[♣♦♥♠]$/.test(ans)&&q.h>=12&&/force d[’']ouvrir|force nécessaire|valeurs.*ouvrir|ouverture/i.test(x)&&/seuil|force|sous.estim|\d+ H/i.test(y))
   return result('transfer-opening-threshold','Sur une autre ouverture, vérifie d’abord si les points H ou HL permettent de parler, puis décide de la couleur.',['force-ouverture','seuil-force']);
  if(axis==='force'&&partnerOpen&&c==='Passe'&&q.h>=6&&/^1(?:[♣♦♥♠]|SA)$/.test(ans)&&/répond|réponse/i.test(x)&&/force|valeurs|seuil|sous.évalu/i.test(y))
   return result('transfer-response-threshold','Sur une autre première réponse, vérifie la force minimale de réponse sans la confondre avec la force nécessaire pour ouvrir.',['force-reponse','seuil-force']);
  if(axis==='force'&&partnerOpen&&c==='1SA'&&/^2[♣♦♥♠]$/.test(ans)&&ans[1]!==a[0].slice(-1)&&/11\s*H|12\s*HL/.test(x)&&/changement de couleur|2 sur 1|forcing/i.test(x)&&/seuil|valeurs|force/i.test(y))
   return result('transfer-response-two-over-one','Sur une autre première réponse, vérifie le seuil du changement de couleur au palier de deux et distingue-le d’une réponse limitée à 1SA.',['force-reponse','seuil-deux-sur-un']);
  if(axis==='force'&&direct&&c==='Passe'&&as&&ans[0]<='2'&&length(as)>=5&&/intervention|adversaire|palier|naturel/i.test(x)&&/intervention|intervenir/i.test(y)&&/HL|\d+ H|valeurs|force/i.test(y))
   return result('transfer-overcall-values','Sur une autre intervention naturelle, contrôle la force, la longueur et la qualité de la couleur ainsi que le palier disponible.',['force-intervention','longueur-couleur','qualite-couleur']);
  if(axis==='force'&&direct&&q.theme==='intervenir'&&c==='1SA'&&as&&length(as)>=5&&hl<16&&/HL|\d+ H/i.test(x)&&/intervention.*1SA|1SA.*valeurs|1SA.*force/i.test(y))
   return result('transfer-overcall-sa-vs-long-suit','Sur une autre intervention, compare la zone du 1SA direct avec celle de l’intervention naturelle à la couleur ; vérifie aussi la tenue adverse.',['zone-intervention-sa','force-intervention','arret-adverse']);
  if((axis==='distribution'||axis==='priorite')&&direct&&c==='Contre'&&as&&length(as)>=5&&/Contre/i.test(x)&&/contre/i.test(y)&&/couleur|longue|Piques|Cœurs|Carreaux|Trèfles/i.test(x+' '+y))
   return result('transfer-overcall-shape','Sur une autre intervention, compare la longue que tu peux annoncer aux couleurs dans lesquelles le partenaire risque de répondre au Contre.',['distribution-intervention','contre-vs-couleur']);
  if(axis==='convention'&&a.length===3&&/^Adversaire : 1[♣♦♥♠]$/.test(a[0])&&a[1]==='Partenaire : Contre'&&a[2]==='Adversaire : Passe'&&c==='2'+a[0].slice(-1)&&/Contre/i.test(x)&&/cue.bid/i.test(y))
   return result('transfer-cuebid-after-double','Sur une autre réponse au contre d’appel, repère la couleur ouverte par l’adversaire : distingue son cue-bid d’une réponse naturelle.',['cue-bid','role-encherisseur']);
  if(axis==='convention'&&a.length===1&&/^Partenaire : 2♦.*forcing de manche/i.test(a[0])&&/As|barème/i.test(x)&&/As|barème|codifi/i.test(y))
   return result('transfer-strong-diamond-response','Sur une autre réponse au 2♦ forcing de manche, compte les As puis vérifie la force et le barème de réponses enseigné ; ne lis pas le relais comme une couleur naturelle.',['fortes-as','fortes-code']);
  if(axis==='convention'&&q.theme==='apres_inter'&&a.length===2&&/^Partenaire : 1[♥♠]$/.test(a[0])&&/^Adversaire : /.test(a[1])&&[ans,c].includes('2SA')&&/2SA fitté|Truscott/i.test(x)&&/2SA fitté|Truscott/i.test(y))
   return result('transfer-competitive-fit-sa','Sur une autre main fittée, distingue une intervention naturelle d’un Contre adverse avant de retrouver la signification du 2SA et sa zone de soutien.',['contexte-competitif','2sa-fitte','zone-soutien']);
  if(axis==='priorite'&&direct&&/^michaels\.(intervention|choix)/.test(concept)&&s.filter(k=>k>=5).length===2&&cs&&length(cs)>=5&&/Micha[eë]l/i.test(x)&&/deux|bicolore|masque|révèle/i.test(y))
   return result('transfer-michaels-both-suits','Sur une autre main bicolore, compare l’information d’une intervention naturelle à celle de l’enchère précisée qui décrit les deux longues.',['michaels-deux-longues','information-enchere']);
  if(axis==='niveau'&&partnerOpen&&as&&cs===as&&ans[0]!==c[0]&&/soutien|HLD/i.test(x)&&/palier|niveau/i.test(y)&&s[suits.indexOf(as)]>=3&&a[0].slice(-1)===as)
   return result('transfer-support-level','Sur une autre main de soutien, compte les atouts et évalue la force selon le fit ; vérifie le sens de chaque palier dans cette séquence.',['fit','zone-soutien','palier']);
  if(axis==='force'){
   if(partner&&both(/\bHLD\b|points? D|points? de distribution/i)&&/fit|atout|soutien/i.test(x)&&/fit|atout|soutien/i.test(y))
    return result('transfer-force-hld','Sur une autre main fittée, distingue les points H et la réévaluation au fit, puis compare la zone du soutien.',['evaluation-hld','fit','zone-soutien']);
   if(both(/\bHL\b|point[s]? de longueur/i)&&Math.max(...s)>=5&&/force|zone|seuil|suffis|valeurs|H\b/i.test(y))
    return result('transfer-force-hl','Sur une autre main, compte les points H puis les points de longueur retenus '+scope+'. La zone nécessaire est-elle atteinte ?',['evaluation-hl','seuil-force']);
   if(partner&&both(/manche|invitation|invitant|partielle|conclus/i)&&/\d+\s*H(?:L[D]?)?\b|force|valeurs/i.test(x)&&/force|valeurs|H\b|zone|minimum|maximum/i.test(y))
    return result('transfer-force-contract','Sur une autre main dans cette situation, estime les valeurs promises par ton partenaire : faut-il s’arrêter, inviter ou imposer la manche ?',['force-partenaire','objectif-contrat']);
   if(opp&&q.theme==='intervenir'&&a.length===1&&/^Adversaire : 1[♠♥♦♣]$/.test(a[0])&&c==='1SA'&&both(/16\s*[–-]\s*18\s*HL/i))
    return result('transfer-direct-sa','Sur une autre intervention directe à Sans-Atout, contrôle séparément force, régularité et arrêt dans la couleur adverse.',['zone-intervention-sa','regularite','arret-adverse']);
   if(both(/zone|seuil|force|valeurs/i)&&/\d+\s*[–-]\s*\d+\s*H(?:L[D]?)?\b|au moins \d+\s*H|minimum|maximum/i.test(x)&&/\d+\s*H(?:L[D]?)?\b|zone|seuil/i.test(y))
    return result('transfer-force-zone','Sur une autre main, repère la zone de force propre à cette enchère '+scope+' et situe ta main par rapport à ses limites.',['zone-force','role-encherisseur']);
   if(c==='Passe'&&/\d+\s*H(?:L[D]?)?\b/.test(x)&&both(/répond|interven|ouvr/i)&&/force|valeurs|seuil|suffis|H\b/i.test(y))
    return result('transfer-force-pass','Sur une autre main comparable, vérifie d’abord si tu as les valeurs nécessaires pour parler '+scope+', avant de chercher une enchère.',['seuil-force','passe']);
  }
  if(axis==='distribution'){
   if(both(/bicolore|deux couleurs|seconde couleur|deux longues/i)&&s.filter(n=>n>=4).length>=2)
    return result('transfer-shape-two-suits','Sur une autre main à deux couleurs longues, compte les cartes de chacune et vérifie laquelle doit être décrite maintenant.',['deux-longues','ordre-description']);
   if(both(/régulièr|irrégulièr|singleton|chicane|courte/i)&&(c.endsWith('SA')||ans.endsWith('SA')))
    return result('transfer-shape-regular','Sur une autre main, repère la couleur la plus courte et la plus longue ; une enchère à Sans-Atout décrit-elle vraiment cette forme ?',['forme-main','regularite-sa']);
   if(both(/cinquième|sixième|septième|longueur|cartes|longue|quatrième/i)&&((cs&&length(cs)!==undefined)||(as&&length(as)!==undefined)))
    return result('transfer-shape-length','Sur une autre main dans la même séquence, compte les cartes de la couleur que tu envisages d’annoncer et vérifie la longueur que cette enchère promet.',['longueur-couleur','promesse-enchere']);
  }
  if(axis==='fit'&&partner&&both(/fit|atout|soutien/i)){
   if(/^(michaels|multilandy)\.(reponse|suite)/i.test(concept)&&a.some(v=>/^Partenaire : (?!Passe)/.test(v))&&/deux|bicolore|cinq/i.test(x))
    return result('transfer-fit-two-suits','Sur une autre réponse à ce bicolore, compare les nombres d’atouts communs dans les deux couleurs promises avant de choisir.',['fit-bicolore','atouts-communs']);
   if(/(?:Partenaire : 1[♠♥])(?:$| \()/i.test(a.find(v=>/^Partenaire : 1[♠♥]/.test(v))||'')&&/trois|deux|cinq|3 cartes|2 cartes|5 cartes|huit|neuf|8 atouts|9 atouts/i.test(x))
    return result('transfer-fit-major','Sur une autre main, additionne tes cartes de la majeure et celles promises par ton partenaire avant de choisir le soutien.',['fit-majeur','atouts-communs']);
   if(/quatre|cinq|six|trois|deux|huit|neuf|dix|\d\s*(?:cartes|atouts)|[458][–-][345]/i.test(x))
    return result('transfer-fit-count','Sur une autre main dans cette séquence, identifie la couleur vraiment promise par le partenaire et compte le minimum d’atouts communs.',['couleur-promise','atouts-communs']);
  }
  if(axis==='niveau'&&both(/palier|saut|niveau|manche|partielle|invitation|barrage|chelem/i)){
   if(cs&&as&&cs===as&&c[0]!==ans[0]&&/saut|invitation|manche|partielle|barrage/i.test(x))
    return result('transfer-level-same-suit','Sur une autre main avec cette même couleur, compare les deux paliers et ce que chacun promet, sans supposer qu’une enchère plus haute est toujours plus forte.',['palier','promesse-enchere','objectif-contrat']);
   if(c.endsWith('SA')&&ans.endsWith('SA')&&c[0]!==ans[0]&&/invitation|manche|partielle|chelem/i.test(x))
    return result('transfer-level-sa','Sur une autre main, compare la signification des deux paliers à Sans-Atout dans cette séquence : quelle ambition et quelle force chacun indique-t-il ?',['palier-sa','objectif-contrat']);
   if(/invitation|invitant|conclu|partielle|manche|chelem/i.test(x)&&partner&&explicit(q,c))
    return result('transfer-level-ambition','Sur une autre main, précise d’abord le contrat que tu cherches : partielle, manche ou davantage. Choisis ensuite le palier qui laisse la bonne liberté au partenaire.',['objectif-contrat','palier']);
  }
  if(axis==='forcing'&&partner&&both(/forcing|obligatoire|doit répondre|appelle une réponse|pas passer|passer/i)&&/forcing|obligatoire|demande une réponse|appelle une réponse/i.test(x))
   return result('transfer-forcing','Sur une autre séquence, vérifie si l’enchère précédente te permet de passer, puis si celle que tu envisages oblige le partenaire à reparler.',['caractere-forcing','information-manquante']);
  if(axis==='priorite'&&both(/montr|décri|masqu|cach|priorit|annonc|transmet|révél|recherch/i)){
   if((c.endsWith('SA')&&as)||(ans.endsWith('SA')&&cs)){
    if(/majeure|Piques|Cœurs|Carreaux|Trèfles|arrêt|longue|couleur/i.test(x))
     return result('transfer-priority-sa-suit','Sur une autre main, compare l’information que transmet chaque enchère, naturelle ou conventionnelle dans cette séquence : laquelle est prioritaire ici ?',['information-enchere','priorite-sa-couleur']);
   }
   if(q.theme==='red'&&a.length===2&&/^Vous : 1[♠♥♦♣]$/.test(a[0])&&cs===a[0].slice(-1)&&as&&as!==cs&&length(as)>=4&&/seconde couleur|bicolore|quatre|4 cartes/i.test(x))
    return result('transfer-priority-rebid','Sur une autre redemande, vérifie si une deuxième couleur peut être décrite économiquement avant de répéter la première.',['seconde-couleur','economie-redemande']);
   if(opp&&c==='Contre'&&as&&/contre|longue|bicolore/i.test(x)&&/contre|longue|bicolore/i.test(y))
    return result('transfer-priority-overcall','Sur une autre intervention, compare ce qu’une enchère à la couleur révèle et ce qu’un contre laisse au partenaire le soin de choisir.',['description-intervention','contre-vs-couleur']);
  }
  if(axis==='convention'){
   const conv=(pattern)=>pattern.test(x+' '+q.context)&&pattern.test(y+' '+(d.evidence?.rule||''));
   if(/^sa[12]\.stayman\.reponse/.test(concept)&&/Stayman/i.test(x)&&a.length>=2&&a.some(v=>/^Vous : [12]SA/.test(v))&&a.some(v=>/^Partenaire : [23]♣/.test(v))&&both(/majeure|Piques|Cœurs|quatre|distribution/i))
    return result('transfer-stayman-response','Sur une autre réponse au Stayman, compte d’abord les Piques et les Cœurs ; retrouve le code correspondant à aucune, une ou deux majeures quatrièmes.',['stayman-code','deux-majeures']);
   if(/^roudi\.reponse/.test(concept)&&/Roudi/i.test(x)&&a.some(v=>/^Partenaire : 2♣.*Roudi/i.test(v))&&/trois|3 cartes|minimum|maximum|fit/i.test(x)&&/Roudi|cod|majeure/i.test(y))
    return result('transfer-roudi-response','Sur une autre réponse au Roudi, vérifie d’abord les cartes de la majeure du répondant, puis la zone minimum ou maximum si le soutien est présent.',['roudi-soutien','roudi-zone','roudi-code']);
   if(/^roudi\./.test(concept)&&conv(/Roudi/i)&&/fit|majeure|cinq|cinquième/i.test(x))
    return result('transfer-roudi-purpose','Sur une autre main après la redemande à 1SA, identifie l’information encore nécessaire sur la majeure et distingue la demande conventionnelle d’une enchère naturelle.',['roudi-objectif','information-manquante']);
   if(/texas/i.test(concept)&&conv(/Texas|transfert/i)&&/rectif|transfert|couleur|majeure/i.test(x))
    return result('transfer-texas','Sur une autre séquence de Texas, nomme la couleur demandée par le transfert avant de décider s’il faut rectifier ou poursuivre.',['texas-couleur-cible','texas-suite']);
   if(/^drury\./.test(concept)&&conv(/Drury/i)&&/passé|position/i.test(x)&&/fit|soutien|atout/i.test(x))
    return result('transfer-drury','Sur une autre main, vérifie qui a déjà passé et le soutien disponible avant d’utiliser le Drury.',['drury-position','drury-fit']);
   if(/^michaels\.(intervention|choix|reveil)/.test(concept)&&conv(/Micha[eë]l|bicolore/i)&&opp&&/deux|bicolore|5\s*[–-]\s*5|cinq/i.test(x))
    return result('transfer-michaels','Sur une autre ouverture adverse, identifie les deux couleurs que l’enchère bicolore promet et vérifie leur longueur dans ta main.',['michaels-couleur-adverse','michaels-deux-longues']);
   if(/^multilandy\.(intervention|choix)/.test(concept)&&conv(/Multi.?Landy|bicolore/i)&&opp&&/majeure|mineure|longue/i.test(x))
    return result('transfer-multilandy','Sur une autre main après 1SA adverse, distingue une majeure longue seule des mains à deux couleurs et retrouve le code correspondant.',['multilandy-distribution','multilandy-code']);
   if(/^rubensohl\./.test(concept)&&/^Partenaire : 1SA/.test(a[0]||'')&&/^Adversaire : /.test(a[1]||'')&&conv(/Rubensohl|Texas|transfert/i)&&opp&&/Texas|transfert|naturel/i.test(x))
    return result('transfer-rubensohl','Sur une autre intervention sur 1SA, repère la couleur adverse puis distingue l’enchère naturelle encore disponible et la couleur que désigne le transfert.',['rubensohl-contexte','rubensohl-code']);
   if(/^competitif\./.test(concept)&&conv(/Spoutnik|Truscott|cue.bid|Surcontre/i)&&opp&&/contre|intervention|adversaire/i.test(x))
    return result('transfer-competitive-code','Sur une autre séquence compétitive, identifie l’intervention adverse exacte puis ce que l’enchère conventionnelle transmet sur la force ou le fit.',['contexte-competitif','signification-convention']);
   if(/^chelem\./.test(concept)&&conv(/Blackwood|clés/i)&&/atout|As|Roi/i.test(x)&&/clé|code/i.test(y))
    return result('transfer-blackwood','Sur une autre main, identifie d’abord l’atout agréé et le renseignement demandé : nombre de clés, Dame d’atout ou suite du Blackwood.',['blackwood-atout','blackwood-information']);
   if(/^apres_fit\./.test(concept)&&conv(/essai|barrage/i)&&/fit|soutien|atout/i.test(x))
    return result('transfer-fit-trial','Sur une autre main après soutien, distingue une enchère qui invite à la manche d’une enchère destinée à occuper de l’espace.',['essai-manche','barrage']);
  }
  if((axis==='competition'||axis==='contexte')&&opp&&both(/réveil|position|adversaire|compétiti|intervention/i)){
   if(a.length>=3&&/^Adversaire : 1/.test(a[0])&&a[1]==='Partenaire : Passe'&&a[2]==='Adversaire : Passe'&&/réveil/i.test(x))
    return result('transfer-context-balancing','Sur une autre séquence, vérifie si les deux Passe te placent en réveil avant d’appliquer les critères de force et de distribution.',['position-reveil','contexte-competitif']);
   if(a.length===1&&/^Adversaire : 1/.test(a[0])&&/intervention/i.test(x))
    return result('transfer-context-direct','Sur une autre main, repère que l’adversaire a déjà ouvert : ne transpose pas automatiquement les critères d’une ouverture à une intervention.',['position-intervention','contexte-competitif']);
   if(partner&&/contre|intervention|adversaire/i.test(x)&&explicit(q,c))
    return result('transfer-context-auction','Sur une autre séquence, identifie qui a annoncé la dernière enchère et ce que l’intervention adverse change avant de choisir.',['role-encherisseur','contexte-competitif']);
  }
  // Pass 2: narrow additional rules, after existing rules (no replacement).
  // Signed diagnosis, exact sequence, actual computed hand facts, canonical corroboration.
  const key=d.evidence?.rule, op=a.length===0&&q.theme==='ouv', responseSA=a.length===1&&/^Partenaire : [12]SA(?: \([^)]*\))?$/.test(a[0]);
  const startSA=responseSA?a[0].match(/[12]SA/)[0]:null, p=startSA==='1SA'?'2':'3';
  const majorOpen=partnerOpen&&/[♥♠]$/.test(a[0]), major=majorOpen?a[0].slice(-1):null;
  const specific=(id,feedback,prompt,criteria)=>rule('pass2-'+id,feedback,prompt,criteria);
  if(op&&key==='opening-major-first'&&axis==='priorite'&&/^1[♥♠]$/.test(ans)&&/^1[♣♦]$/.test(c)&&length(as)>=5&&length(as)>=length(cs)&&/majeure cinquième|cinq (?:Piques|Cœurs)/i.test(x))
   return specific('opening-major-first','Tu as '+length(as)+' cartes dans la majeure, contre '+length(cs)+' dans la mineure choisie. Dans ce cas, la majeure cinquième est prioritaire.','Sur une autre ouverture, vérifie d’abord les majeures cinquièmes avant de comparer les mineures.',['priorite-majeure','longueur-ouverture']);
  if(op&&key==='opening-major-length'&&axis==='distribution'&&/^1[♥♠]$/.test(c)&&length(cs)<5&&((ans==='Passe'&&/seuil d[’']ouverture|force.*ouvrir/i.test(x)&&hl<13&&q.h<12)||(reg&&/^[12]SA$/.test(ans)&&/régulièr/i.test(x)&&((ans==='1SA'&&q.h>=15&&q.h<=17)||(ans==='2SA'&&q.h>=20&&q.h<=21)))))
   return specific('opening-short-major','Indépendamment de la force, la majeure choisie ne compte que '+length(cs)+' cartes : ce n’est pas une majeure cinquième.','Sur une autre main, vérifie séparément le seuil d’ouverture, la longueur majeure et la zone de Sans-Atout.',['force-ouverture','longueur-majeure-ouverture']);
  if(op&&key==='opening-best-minor'&&axis==='priorite'&&/^1[♣♦]$/.test(ans)&&/^1[♣♦]$/.test(c)&&s[0]<5&&s[1]<5&&/meilleure mineure/i.test(x)){
   const expected=s[2]>s[3]?'1♦':s[2]<s[3]?'1♣':s[2]===3?'1♣':s[2]===4?'1♦':null;
   if(expected===ans)return specific('opening-minor-tie','La comparaison donne '+s[2]+' Carreaux et '+s[3]+' Trèfles. '+(s[2]===s[3]?'C’est la règle d’égalité '+s[2]+'–'+s[3]+' qui tranche.':'C’est la mineure la plus longue qui tranche.'),'Sur une autre ouverture sans majeure cinquième, applique la comparaison puis, si nécessaire, la règle d’égalité.',['longueur-mineures','egalite-mineures']);
  }
  if(key==='response-major-before-minor-support'&&axis==='priorite'&&partnerOpen&&/[♣♦]$/.test(a[0])&&c==='2'+a[0].slice(-1)&&/^1[♥♠]$/.test(ans)&&length(as)>=4&&/quatre|4 cartes|majeure/i.test(x)&&/fit|masquer|forcing/i.test(x))
   return specific('minor-major-before-support','Tu détiens '+length(as)+' cartes dans une majeure annonçable au palier de un. Le soutien mineur ne les montre pas.','Sur une autre réponse à une mineure, cherche d’abord la majeure naturelle disponible avant le soutien mineur.',['majeure-reponse','priorite-fit-majeur']);
  if(key==='major-support-short'&&axis==='fit'&&majorOpen&&c==='2'+major&&length(major)<3&&/sans fit|pas.*fit|absence.*fit|ne suffi|non fitt/i.test(x))
   return specific('major-short-support','Tes '+length(major)+' cartes face aux cinq promises ne garantissent pas huit atouts.','Sur une autre réponse à une majeure, compte les atouts garantis avant de choisir un soutien.',['fit-majeur','atouts-communs']);
  if(key==='response-premature-two-level'&&axis==='force'&&majorOpen&&major==='♥'&&ans==='1♠'&&/^2[♣♦]$/.test(c)&&s[0]>=4&&q.h<11&&hl<12&&/forcing|naturel|quatre|cinq/i.test(x))
   return specific('major-low-two-over-one','Tes '+q.h+' H ('+hl+' HL) sont en dessous du seuil de changement de couleur au palier de deux retenu dans le quiz. La majeure est annonçable au palier de un.','Sur une autre main après 1♥, compare le seuil du deux-sur-un à celui de 1♠ avant de choisir.',['force-reponse','seuil-deux-sur-un']);
  if(responseSA&&axis==='distribution'&&ans==='Passe'&&reg&&/manche/i.test(x)&&/aucun espoir|pas la force nécessaire|pas.*espoir/i.test(x)&&((startSA==='1SA'&&q.h<=6)||(startSA==='2SA'&&q.h<=2))){
   if(key==='pn3-sa-threshold-no-major'&&c===p+'♣'&&s[0]<4&&s[1]<4)
    return specific('sa-no-stayman-major','Tu as '+s[0]+' Piques et '+s[1]+' Cœurs. Sur cette main régulière et faible, aucun fit majeur 4–4 n’est à rechercher.','Sur une autre réponse faible à Sans-Atout, compte les majeures et vérifie la force avant le Stayman.',['stayman-longueurs','force-reponse-sa']);
   if(key==='pn3-sa-threshold-no-transfer-length'&&c[0]===p&&['♦','♥'].includes(c[1])&&length(c[1]==='♦'?'♥':'♠')<5)
    return specific('sa-no-transfer-length','La majeure désignée par ton Texas ne compte que '+length(c[1]==='♦'?'♥':'♠')+' cartes.','Sur une autre réponse faible et régulière à Sans-Atout, vérifie la longueur de la majeure que désigne le Texas.',['texas-couleur-cible','longueur-majeure']);
  }
  if(responseSA&&axis==='convention'&&/Texas/i.test(x)&&ans[0]===p&&['♦','♥'].includes(ans[1])){
   const dest=ans[1]==='♦'?'♥':'♠';
   if(length(dest)>=5&&key==='texas-natural-target'&&c===p+dest)
    return specific('texas-target-not-direct','Le Texas désigne '+(dest==='♥'?'les Cœurs':'les Piques')+' par l’enchère inférieure. Annoncer directement la couleur n’est pas le transfert demandé.','Sur une autre réponse à Sans-Atout, nomme la majeure longue, puis retrouve le palier du Texas correspondant.',['texas-couleur-cible','texas-code']);
   if(startSA==='1SA'&&length(dest)>=5&&key==='texas-pass'&&c==='Passe'&&/partiel|pas de minimum|levée.*atout|jouer.*couleur/i.test(x))
    return specific('texas-before-pass','Tes '+length(dest)+' cartes dans la majeure peuvent être utiles comme atouts, même si la manche est hors de portée.','Sur une autre main faible sur 1SA, distingue Passe immédiat et Texas suivi de Passe.',['texas-couleur-cible','objectif-partielle']);
  }
  if(responseSA&&key==='stayman-vs-texas'&&axis==='convention'&&ans===p+'♣'&&c[0]===p&&['♦','♥'].includes(c[1])&&Math.max(s[0],s[1])===4&&/Stayman/i.test(x)&&/fit|quatre|4–4/i.test(x))
   return specific('stayman-before-texas','La majeure désignée par le Texas choisi ne compte que '+length(c[1]==='♦'?'♥':'♠')+' cartes. Le Stayman recherche ici une majeure quatrième chez l’ouvreur.','Sur une autre réponse à Sans-Atout, distingue les mains à majeure quatrième de celles à majeure cinquième.',['stayman-texas','longueur-majeure']);
  const rebid=a.length===2&&/^Vous : 1[♣♦♥♠]$/.test(a[0])&&/^Partenaire : 1[♥♠]$/.test(a[1]), first=rebid?a[0].slice(-1):null, reply=rebid?a[1].slice(-1):null;
  if(rebid&&key==='rebid-sa-zone'&&axis==='force'&&reg&&length(reply)<4&&/régulièr/i.test(x)&&((ans==='1SA'&&c==='2SA'&&q.h>=12&&q.h<=14&&/12\s*[–-]\s*14\s*H/.test(x))||(ans==='2SA'&&c==='1SA'&&q.h>=18&&q.h<=19&&/18\s*[–-]\s*19\s*H/.test(x))))
   return specific('rebid-sa-zone','Tu as '+q.h+' H. La redemande à Sans-Atout ne décrit pas les mêmes zones qu’une ouverture à Sans-Atout.','Sur une autre redemande régulière sans fit, distingue 1SA (12–14 H) et 2SA à saut (18–19 H).',['zone-redemande-sa','force-ouverture-vs-redemande']);
  if(rebid&&key==='rebid-regular-vs-repeat'&&axis==='distribution'&&reg&&length(first)===4&&length(reply)<4&&c==='2'+first&&/^[12]SA$/.test(ans)&&/régulièr/i.test(x))
   return specific('rebid-short-repeat','La couleur ouverte ne compte que quatre cartes. La main régulière est décrite par la redemande à Sans-Atout dans cette séquence.','Sur une autre redemande, compare longueur de la couleur ouverte et régularité de la main.',['longueur-redemande','regularite-sa']);
  if(key==='natural-overcall-vs-double'&&axis==='competition'&&direct&&c==='Contre'&&as&&ans[0]==='1'&&length(as)>=5&&/Contre d[’']appel/i.test(x)&&/naturel|cinquième|couleur/i.test(x))
   return specific('direct-overcall-vs-double',null,'Sur une autre intervention directe, identifie la couleur longue annonçable et compare l’information transmise par la couleur et le Contre d’appel.',['intervention-naturelle','contre-vs-couleur']);
  if(key==='takeout-double-weak-sa'&&axis==='force'&&a.length===3&&/^Adversaire : 1[♣♦]$/.test(a[0])&&a[1]==='Partenaire : Contre'&&a[2]==='Adversaire : Passe'&&c==='1SA'&&/^1[♥♠]$/.test(ans)&&length(as)>=4&&q.h<=5&&/obligatoire|doit répondre/i.test(x))
   return specific('double-weak-response','Tes '+q.h+' H ne t’empêchent pas de répondre au Contre d’appel ; la majeure quatrième est disponible au palier de un.','Sur une autre réponse faible au Contre d’appel, repère la couleur annonçable au plus bas palier avant de choisir Sans-Atout.',['reponse-contre','force-reponse-contre']);
  if(key==='competitive-fit-before-new-suit'&&axis==='priorite'&&a.length===2&&/^Partenaire : 1[♥♠]$/.test(a[0])&&/^Adversaire : 1[♥♠]$/.test(a[1])&&ans==='2'+a[0].slice(-1)&&length(as)>=3&&/^2[♣♦]$/.test(c)&&/soutien simple/i.test(x)&&/6\s*[–-]\s*10\s*HLD/i.test(x))
   return specific('competitive-fit-first','Le soutien dispose déjà de '+length(as)+' atouts en face de la majeure cinquième promise. Le changement de couleur ne transmet pas ce fit.','Sur une autre réponse après intervention, identifie le fit et évalue la zone de soutien avant d’envisager une autre couleur.',['fit-competitif','zone-soutien']);
  const simpleFit=a.length===2&&/^Vous : 1[♥♠]$/.test(a[0])&&a[1]==='Partenaire : 2'+a[0].slice(-1);
  if(simpleFit&&axis==='niveau'&&ans==='2SA'&&/essai|invitation|proposer la manche/i.test(x)&&(/pas de l[’']imposer|pas.*imposer|minimum|refuse|accepte/i.test(x))&&((key==='pn3-trial-not-stop'&&c==='Passe')||(key==='pn3-trial-not-game'&&c==='4'+a[0].slice(-1))))
   return specific('fit-trial-ambition',c==='Passe'?'Passe arrête la séquence alors qu’une invitation reste possible.':'Cette conclusion impose la manche alors que le soutien peut être minimum.','Sur une autre main après soutien simple, distingue arrêt, essai généralisé et conclusion directe à la manche.',['essai-manche','objectif-contrat']);
  const roudi=a.length===3&&/^Partenaire : 1[♣♦]$/.test(a[0])&&/^Vous : 1[♥♠]$/.test(a[1])&&a[2]==='Partenaire : 1SA';
  if(roudi&&key==='roudi-vs-weak-repeat'&&axis==='convention'&&c==='2♣'&&ans==='2'+a[1].slice(-1)&&length(as)>=5&&/partielle|non forcing|sans obliger/i.test(x)&&/manche.*pas|non la manche|faible|injustifiée/i.test(x))
   return specific('roudi-weak-repeat','La répétition naturelle permet de jouer la majeure longue ; le relais Roudi sert à explorer, non à proposer directement cette partielle.','Sur une autre main après la redemande à 1SA, distingue une répétition faible non forcing et une recherche constructive du fit.',['roudi-objectif','objectif-partielle']);
  if(roudi&&key==='roudi-vs-nonforcing-repeat'&&axis==='forcing'&&ans==='2♣'&&c==='2'+a[1].slice(-1)&&length(cs)>=5&&/Roudi/i.test(x)&&/faible|plus faible|espoir de manche/i.test(x))
   return specific('roudi-constructive-repeat',null,'Sur une autre main constructive après 1SA, vérifie si une répétition non forcing risque de fermer la recherche du fit 5–3 et de la manche.',['roudi-objectif','caractere-forcing']);
  if(majorOpen&&key==='fit-2sa'&&axis==='convention'&&ans==='2SA'&&c==='2'+major&&length(major)===3&&/2SA fitté/i.test(x)&&/11\s*[–-]\s*12\s*HLD/i.test(x))
   return specific('fit-2sa-zone','Le fit troisième est établi ; c’est la zone invitante explicitée dans le corrigé qui distingue le 2SA fitté du soutien simple.','Sur une autre réponse à une majeure, distingue le nombre d’atouts et la zone de force du soutien.',['2sa-fitte','zone-soutien']);


  // Pass 4 — transfer only where the previous rule set abstained; never displace signed reviews.
  if(explicit(q,c))return null;
  const p4=(id,prompt,criteria)=>result('pass4-'+id,prompt,criteria);
  const partnerMinor=partnerOpen&&/[♣♦]$/.test(a[0]), partnerMajor=partnerOpen&&/[♥♠]$/.test(a[0]);
  const m=partnerMajor?a[0].slice(-1):null;
  if(op&&axis==='priorite'&&reg&&Math.max(s[0],s[1])<5&&/^1[♣♦]$/.test(c)&&((ans==='1SA'&&q.h>=15&&q.h<=17&&/15\s*[–-]\s*17\s*H/.test(x))||(ans==='2SA'&&q.h>=20&&q.h<=21&&/20\s*[–-]\s*21\s*H/.test(x)))&&/régulièr/i.test(x))
   return p4('opening-sa-before-minor','Sur une autre ouverture régulière, situe d’abord tes points H dans les zones de Sans-Atout ; une mineure peut-elle être annoncée sans masquer cette zone ?',['zone-sa','priorite-sa']);
  if(op&&axis==='priorite'&&ans==='1♠'&&c==='1♥'&&s[0]===5&&s[1]===5&&/deux majeures cinquièmes|deux majeures de cinq/i.test(x)&&/plus chère/i.test(x))
   return p4('opening-equal-majors','Sur une autre main à deux majeures de cinq cartes, compare l’ordre des ouvertures avec celui des réponses à une mineure.',['longueur-ouverture','ordre-majeures']);
  if(op&&axis==='force'&&ans==='Passe'&&/^[12]SA$/.test(c)&&q.h<12&&hl<13&&/12\s*H\s*(?:ou|\/)\s*13\s*HL/.test(x)&&/seuil|force|insuffis/i.test(x))
   return p4('opening-below-threshold','Sur une autre main faible, calcule H et HL avant de choisir entre Passe et une ouverture.',['force-ouverture','points-longueur']);
  if(partnerMinor&&axis==='force'&&ans==='Passe'&&/^([12][♣♦♥♠]|1SA)$/.test(c)&&hl<=4&&/pas la force nécessaire pour répondre|trop faible pour répondre|force insuffisante pour répondre/i.test(x))
   return p4('response-minor-below-threshold','Sur une autre première réponse, vérifie les valeurs de réponse avant de chercher une couleur, même si une majeure est disponible.',['force-reponse','seuil-force']);
  if(partnerMinor&&axis==='force'&&ans==='1SA'&&c==='2♣'&&a[0]==='Partenaire : 1♦'&&reg&&s[0]<4&&s[1]<4&&hl<11&&/pas la force nécessaire pour annoncer les Trèfles au palier de deux/i.test(x))
   return p4('minor-two-over-one-values','Sur une autre réponse à 1♦ sans majeure quatrième, compare les valeurs nécessaires pour le changement de couleur à 2♣ à celles d’une réponse limitée.',['force-reponse','seuil-deux-sur-un']);
  if(partnerMajor&&axis==='force'&&ans==='Passe'&&c[1]===m&&['2','3'].includes(c[0])&&length(m)>=3&&Math.min(...s)>=3&&q.h+2*Math.max(0,length(m)-3)<6&&/6\s*HLD|soutien simple/i.test(x)&&/faible|insuffis|sous les/i.test(x))
   return p4('major-support-below-threshold','Sur une autre main fittée, évalue les points de distribution puis vérifie si le soutien simple est justifié, avant de choisir son palier.',['evaluation-hld','zone-soutien']);
  if(partnerMajor&&axis==='distribution'&&ans==='2'+m&&c==='1♠'&&m==='♥'&&s[0]<4&&s[1]>=3&&/atouts|soutien|fit/i.test(x)&&/HLD/i.test(x))
   return p4('major-fit-versus-short-spades','Sur une autre réponse à 1♥, compare le nombre de Piques réellement détenus et les atouts Cœur déjà garantis.',['fit-majeur','longueur-majeure-reponse']);
  if(responseSA&&axis==='niveau'&&ans==='3SA'&&reg&&Math.max(s[0],s[1])<4&&((startSA==='1SA'&&c==='2SA'&&q.h>=11&&q.h<=14&&/manche|conclu|27 H|26 H/i.test(x))||(startSA==='2SA'&&c==='4SA'&&q.h>=5&&q.h<=9&&/manche|conclu|2[5-9]\s*H/i.test(x))))
   return p4('sa-game-level','Sur une autre main après ouverture à Sans-Atout, additionne ta force au minimum et au maximum de l’ouvreur ; distingue invitation, manche et exploration du chelem.',['force-partenaire','objectif-contrat']);
  if(direct&&axis==='priorite'&&ans==='1SA'&&c==='Contre'&&reg&&hl>=16&&hl<=18&&/16\s*[–-]\s*18\s*HL/.test(x)&&/tenue|arrêt/i.test(x)&&/Contre d[’']appel décrirait moins bien/i.test(x))
   return p4('direct-sa-before-double','Sur une autre intervention directe, contrôle la régularité, la force et l’arrêt dans la couleur d’ouverture avant de comparer 1SA au Contre d’appel.',['zone-intervention-sa','regularite','arret-adverse']);
  if(direct&&axis==='force'&&ans==='Contre'&&c==='1SA'&&hl<16&&length(a[0].slice(-1))===1&&s.filter(n=>n===4).length===3&&/singleton/i.test(x)&&/tricolore|trois autres couleurs/i.test(x)&&/Contre d[’']appel/i.test(x))
   return p4('direct-double-tricolor','Sur une autre main tricolore courte dans la couleur adverse, compare la force nécessaire pour 1SA direct et la distribution décrite par le Contre d’appel.',['zone-intervention-sa','distribution-contre']);
  if(q.theme==='second'&&axis==='force'&&a.length===3&&/^Partenaire : 1[♣♦]$/.test(a[0])&&/^Vous : 1[♥♠]$/.test(a[1])&&/^Partenaire : (?:1SA|2[♣♦])$/.test(a[2])&&ans==='2'+a[1].slice(-1)&&c==='3'+a[1].slice(-1)&&length(a[1].slice(-1))>=6&&q.h<=8&&/partiel|faible|non forcing|sans forcer/i.test(x))
   return p4('responder-weak-repeat','Sur une autre deuxième enchère du répondant, distingue une répétition simple pour jouer la partielle et un saut qui invite à la manche.',['force-repondant','objectif-partielle','niveau-redemande']);
  if(q.theme==='red'&&axis==='force'&&a.length===2&&/^Vous : 1[♣♦]$/.test(a[0])&&/^Partenaire : 1[♦♥]$/.test(a[1])&&/^1[♥♠]$/.test(ans)&&c==='2SA'&&reg&&q.h>=12&&q.h<=14&&length(ans[1])>=4&&/majeure|Piques|Cœurs/i.test(x)&&/12\s*[–-]\s*14\s*H|première zone/i.test(x))
   return p4('opener-major-before-sa-jump','Sur une autre redemande régulière, vérifie la zone du 2SA à saut puis si une majeure quatrième reste annonçable au palier de un.',['zone-redemande-sa','priorite-majeure']);
  if(q.theme==='forcing'&&axis==='priorite'&&a.length===4&&/^Vous : 1[♣♦]$/.test(a[0])&&/^Partenaire : 1[♥♠]$/.test(a[1])&&/^Vous : 1[♥♠]$/.test(a[2])&&/4e (?:couleur )?forcing/i.test(a[3])&&ans==='2'+a[1].slice(-1)&&length(a[1].slice(-1))===3&&c==='2SA'&&/prioritaire|d’abord|d'abord|premier devoir/i.test(x)&&/arrêt|tenue/i.test(x))
   return p4('fourth-forcing-support-priority','Sur une autre quatrième couleur forcing, vérifie d’abord le soutien différé dans la majeure du répondant, puis l’arrêt dans la quatrième couleur.',['quatrieme-forcing','soutien-differe','arret']);
  if(q.theme==='multilandy'&&axis==='distribution'&&a.length===1&&/^Adversaire : 1SA/.test(a[0])&&ans==='2♦'&&c==='2♣'&&Math.max(s[0],s[1])>=6&&s.filter(n=>n>=4).length===1&&/Multi.Landy|2♦ Multi/i.test(x)&&/sixième|six |unicolore/i.test(x)&&/sans (?:seconde|deuxième) couleur quatrième/i.test(x))
   return p4('multilandy-unicolor-not-landy','Sur une autre intervention sur 1SA, compte les deux majeures et vérifie s’il existe une seconde couleur avant de choisir le code Multi-Landy.',['multilandy-distribution','multilandy-code']);
  if(q.theme==='chelem'&&['niveau','contexte'].includes(axis)&&a.length===2&&/^Vous : 4SA \(Blackwood 5 clés, atout Cœur\)/.test(a[0])&&/^Partenaire : 5♦ \(1 ou 4 clés\)/.test(a[1])&&ans==='5♥'&&['5SA','6♥'].includes(c)&&q.hand.filter(cards=>cards.includes('A')).length+Number(q.hand[1].includes('R'))===3&&/il en manque une|manque une clé/i.test(x)&&/5♥ est un arrêt|revenez donc à 5♥/i.test(x))
   return p4('blackwood-missing-key-stop','Sur une autre réponse ambiguë au Blackwood, élimine les nombres de clés impossibles à partir de tes propres clés avant de décider si l’arrêt au palier de cinq reste nécessaire.',['blackwood-cles','blackwood-arret']);


  // Pass 5 — narrowly scoped learning decisions, validated on the frozen option catalogue.
  // Existing rules/reviews have precedence. No new canonical text.
  const p5=(id,prompt,criteria)=>result('pass5-'+id,prompt,criteria);
  const rr=a.filter(t=>t!=='Adversaire : Passe');
  const val=t=>t?.match(/^(?:Vous|Partenaire|Adversaire) : ([1-7](?:SA|[♣♦♥♠])|Passe|Contre|Surcontre)/)?.[1];
  const b0=val(rr[0]),b1=val(rr[1]),b2=val(rr[2]),b3=val(rr[3]);
  const isM=z=>z==='♥'||z==='♠', isMinor=z=>z==='♣'||z==='♦';
  const afterMinor=partnerMinor, afterMajor=partnerMajor;
  const support=afterMajor?m:null, other=z=>z==='♥'?'♠':'♥';
  const wrongNewSuit=cs&&as!==cs;
  const ownFirst=rr[0]?.startsWith('Vous : '), partnerFirst=rr[0]?.startsWith('Partenaire : '), advFirst=rr[0]?.startsWith('Adversaire : ');
  const p1=partnerFirst&&/^1[♣♦♥♠]$/.test(b0||'');
  const ownRebid=rr.length===2&&ownFirst&&/^1[♣♦♥♠]$/.test(b0||'')&&rr[1].startsWith('Partenaire : ');
  const replySecond=rr.length===3&&p1&&rr[1].startsWith('Vous : ')&&/^1[♥♠]$/.test(b1||'')&&rr[2].startsWith('Partenaire : ');
  const firstSuit=ownRebid?b0[1]:null, replySuit=ownRebid&&/^1[♥♠]$/.test(b1||'')?b1[1]:null;
  const longReply=replySecond?b1[1]:null;
  const hld=z=>q.h+s.reduce((n,k)=>n+Math.max(0,k-4),0)+2*Math.max(0,length(z)-3)+s.reduce((n,k,i)=>i===suits.indexOf(z)?n:n+(k===0?3:k===1?2:k===2?1:0),0);
  // HLD formula only used on exactly three or four atouts with no fifth card anywhere (no double count).
  const rankBid=b=>/^[1-7](?:[♣♦♥♠]|SA)$/.test(b||'')?5*(Number(b[0])-1)+['♣','♦','♥','♠','SA'].indexOf(b.slice(1)):-1;
  const lowBid=(z,b)=>{for(let i=1;i<=7;i++){const t=i+z;if(rankBid(t)>rankBid(b))return t;}return null;};
  const control=z=>length(z)<=1||q.hand[suits.indexOf(z)]?.some(t=>t==='A'||t==='R');
  if(afterMinor&&axis==='priorite'&&ans==='1♥'&&c==='1♠'&&s[0]===4&&s[1]===4&&/moins chère|d’abord 1♥|d'abord 1♥|Cœurs.*en premier/i.test(x))
   return p5('minor-two-four-majors','Sur une autre réponse à une mineure avec deux majeures quatrièmes, vérifie dans quel ordre elles peuvent être nommées sans perdre d’espace.',['ordre-majeures','majeures-quatriemes']);
  if(afterMinor&&['fit','priorite'].includes(axis)&&/^1[♥♠]$/.test(ans)&&length(as)>=4&&c==='2'+b0[1]&&length(b0[1])<=3&&/quatre cartes|4 Piques|4 Cœurs|majeure quatrième/i.test(x))
   return p5('minor-fit-not-established','Sur une autre réponse à une mineure, compte les cartes de soutien réellement garanties et recherche la majeure quatrième disponible.',['fit-mineur','majeure-reponse']);
  if(afterMinor&&['priorite','niveau'].includes(axis)&&/^1[♥♠]$/.test(ans)&&length(as)>=4&&/^2[♣♦]$/.test(c)&&hl<=12&&/jusqu[’']à 12 HL|priorité le fit majeur/i.test(x))
   return p5('minor-major-priority-hl','Sur une autre main de cette zone, compare la priorité du fit majeur au changement de couleur mineure au palier de deux.',['majeure-reponse','priorite-fit-majeur','zone-force']);
  if(afterMinor&&axis==='force'&&ans==='1SA'&&c==='2♣'&&b0==='1♦'&&q.h<11&&hl<12&&Math.max(s[0],s[1])<4&&/11\s*H.*12\s*HL|11 H ou 12 HL/i.test(x))
   return p5('minor-insufficient-two-over-one','Sur une autre main après 1♦, calcule H et HL avant d’envisager 2♣ et vérifie s’il existe une réponse au palier de un.',['seuil-deux-sur-un','force-reponse']);
  if(afterMinor&&axis==='force'&&ans==='1SA'&&c==='3'+b0[1]&&reg&&q.h>=6&&q.h<=8&&length(b0[1])>=4&&/réponse limitée/i.test(x))
   return p5('minor-limited-not-jump','Sur une autre réponse à une mineure, distingue la réponse limitée à 1SA d’un soutien à saut en évaluant d’abord la force et la forme de la main.',['zone-soutien-mineur','force-reponse']);
  if(afterMajor&&axis==='force'&&ans==='Passe'&&/^[12](?:[♣♦♥♠]|SA)$/.test(c)&&hl<=4&&length(support)<3&&/pas la force nécessaire pour répondre|trop faible pour répondre/i.test(x))
   return p5('major-response-too-weak','Sur une autre première réponse à une majeure, vérifie d’abord la force et l’existence éventuelle d’un fit avant de décider de parler.',['force-reponse','fit-majeur']);
  if(afterMajor&&axis==='priorite'&&support==='♥'&&ans==='1♠'&&/^2[♣♦]$/.test(c)&&s[0]>=4&&s[1]<3&&/forcing un tour|illimitée?|prioritaire/i.test(x)&&/quatre Piques|quatre cartes/i.test(x))
   return p5('major-natural-one-before-minor','Sur une autre réponse à 1♥, vérifie que 1♠ est disponible et que son caractère forcing permet de décrire ensuite la mineure sans limiter la main.',['priorite-majeure','forcing-un-tour']);
  if(afterMajor&&axis==='force'&&ans==='1SA'&&/^2[♣♦♥]$/.test(c)&&cs!==support&&q.h<11&&hl<12&&length(support)<3&&/11\s*H.*12\s*HL|11 H ou 12 HL/i.test(x)&&/non forcing|limit/i.test(x))
   return p5('major-two-over-one-insufficient','Sur une autre réponse sans fit, compare les H et HL au seuil du deux-sur-un ; vérifie si 1SA reste la seule réponse limitée adaptée.',['seuil-deux-sur-un','force-reponse']);
  if(afterMajor&&axis==='force'&&c==='Passe'&&/^2[♣♦♥]$/.test(ans)&&as!==support&&length(as)>=5&&length(support)<3&&(q.h>=11||hl>=12)&&/11\s*H.*12\s*HL|11 H ou 12 HL/i.test(x)&&/forcing/i.test(x))
   return p5('major-two-over-one-sufficient','Sur une autre réponse sans fit, vérifie la longueur et le seuil du changement de couleur au palier de deux puis son caractère forcing.',['seuil-deux-sur-un','longueur-couleur','forcing']);
  if(afterMajor&&axis==='distribution'&&support==='♠'&&c==='2♥'&&s[1]<5&&/^2[♣♦]$/.test(ans)&&length(as)>=4&&/2♥.*cinq Cœurs|2♥.*cinq cartes/i.test(x))
   return p5('major-two-hearts-length','Sur une autre réponse à 1♠, compte les Cœurs avant d’envisager 2♥ et compare la longueur réellement détenue dans la mineure.',['longueur-couleur','seuil-deux-sur-un']);
  if(afterMajor&&axis==='force'&&ans==='2'+support&&c==='Passe'&&length(support)>=3&&/HLD/i.test(x)&&/soutien simple|première zone/i.test(x)&&/\b(?:6|7|8|9|10)\s*HLD\b/.test(x))
   return p5('major-support-sufficient','Sur une autre main avec fit, évalue la main en HLD et distingue la première zone de soutien d’une main qui doit passer.',['evaluation-hld','zone-soutien']);
  // Natural rebids: independent tests for shape, range and fit.
  if(ownRebid&&replySuit&&['priorite','niveau','force'].includes(axis)&&ans==='2'+replySuit&&length(replySuit)===4&&q.h>=12&&q.h<=14&&((c==='2'+firstSuit&&length(firstSuit)<=4)||(c==='3'+replySuit))&&/fit est établi|fit.*établi|quatre.*atouts|4.*(?:Cœurs|Piques)/i.test(x)&&/12\s*[–-]\s*14\s*H|première zone/i.test(x))
   return p5('opener-minimum-four-fit','Sur une autre redemande, compte les quatre atouts nécessaires au soutien de la majeure du répondant puis distingue le soutien simple du saut.',['fit-ouvreur','zone-soutien-ouvreur']);
  if(ownRebid&&replySuit&&reg&&length(replySuit)<4&&((ans==='1SA'&&q.h>=12&&q.h<=14&&/12\s*[–-]\s*14\s*H/.test(x))||(ans==='2SA'&&q.h>=18&&q.h<=19&&/18\s*[–-]\s*19\s*H/.test(x)))&&((axis==='force'&&['1SA','2SA'].includes(c))||(axis==='distribution'&&c==='2'+firstSuit&&length(firstSuit)<=4))&&/réguli/i.test(x))
   return p5('opener-regular-range-or-length','Sur une autre redemande sans fit, sépare la régularité, la zone de force et la longueur nécessaire pour répéter la couleur ouverte.',['zone-redemande-sa','longueur-redemande','fit-ouvreur']);
  if(ownRebid&&firstSuit&&replySuit&&axis==='distribution'&&/^1[♥♠]$/.test(ans)&&as!==replySuit&&length(as)>=4&&c==='2'+firstSuit&&length(firstSuit)===4&&/naturelle au palier de 1|majeure.*palier de un|quatre Piques|quatre Cœurs/i.test(x))
   return p5('opener-four-card-new-major','Sur une autre redemande, compare la majeure quatrième encore nommable au palier de un et la longueur nécessaire pour répéter la couleur d’ouverture.',['priorite-majeure','longueur-redemande']);
  if(ownRebid&&firstSuit&&isM(firstSuit)&&b1==='1SA'&&/^2[♥♠]$/.test(ans)&&as!==firstSuit&&length(firstSuit)===5&&length(as)>=4&&((axis==='priorite'&&c==='2'+firstSuit)||(axis==='force'&&(c==='3'+as||c==='2SA')))&&q.h>=12&&q.h<=14&&/bicolore économique|seconde majeure|cinq Piques et quatre Cœurs/i.test(x))
   return p5('opener-economical-two-suits','Sur une autre redemande après 1SA, compare la description d’un bicolore économique à la répétition de la première couleur et à une enchère à saut.',['bicolore-economique','longueur-redemande','zone-force']);
  if(ownRebid&&firstSuit&&isM(firstSuit)&&/^2[♣♦]$/.test(b1||'')&&ans==='2'+firstSuit&&length(firstSuit)>=6&&q.h>=12&&q.h<=14&&axis==='distribution'&&(c==='2SA'||(cs&&cs!==firstSuit&&length(cs)<4))&&/répétition économique|six Piques|six Cœurs/i.test(x)&&/auto.forcing/i.test(x))
   return p5('opener-repeat-after-two-over-one','Sur une autre redemande après un deux-sur-un naturel, distingue la répétition économique d’une sixième et l’annonce d’une autre couleur réellement détenue ; le répondant doit encore reparler.',['longueur-redemande','auto-forcing']);
  // Responder's second action after a natural rebid.
  if(replySecond&&b2==='1SA'&&ans==='2'+longReply&&length(longReply)>=5&&q.h<=8&&/partiel|faible|non forcing/i.test(x)&&((axis==='distribution'&&c==='Passe')||(axis==='force'&&['2SA','3SA','3'+longReply].includes(c))))
   return p5('second-weak-long-major','Sur une autre deuxième enchère après 1SA, compare la longueur de ta majeure à la force totale du camp avant de choisir la partielle ou une invitation.',['longueur-majeure','objectif-partielle','zone-force']);
  if(replySecond&&b2==='1SA'&&ans==='Passe'&&reg&&length(longReply)===4&&q.h<=7&&/réguli/i.test(x)&&/répétition|quatre.*(?:Piques|Cœurs)|quatrième/i.test(x)&&((axis==='force'&&['2SA','3SA'].includes(c))||(axis==='convention'&&c==='2♣')))
   return p5('second-weak-four-card-stop','Sur une autre deuxième enchère avec une majeure quatrième seulement, vérifie si la force justifie un relais constructif ou une invitation après 1SA.',['force-repondant','longueur-majeure','roudi-objectif']);
  if(replySecond&&b2==='1SA'&&ans==='3SA'&&reg&&length(longReply)===4&&q.h>=13&&q.h<=15&&/12\s*[–-]\s*14\s*H|25 H/i.test(x)&&/sans fit|fit.*pas|pas de fit/i.test(x)&&((axis==='distribution'&&c==='2'+longReply)||(axis==='force'&&['Passe','2SA'].includes(c))))
   return p5('second-game-no-fit','Sur une autre deuxième enchère, additionne les valeurs minimales de l’ouvreur aux tiennes puis vérifie si une majeure suffisamment longue justifie encore une recherche de fit.',['force-partenaire','objectif-manche','longueur-majeure']);
  if(replySecond&&/^2[♣♦]$/.test(b2||'')&&ans==='2'+longReply&&length(longReply)>=6&&q.h<=8&&axis==='force'&&c==='2SA'&&/partiel|faible|non forcing|sans forcer/i.test(x))
   return p5('second-six-card-partial','Sur une autre deuxième enchère après répétition mineure, compare la longue majeure sixième et la force requise pour proposer la manche à Sans-Atout.',['longueur-majeure','objectif-partielle']);
  if(replySecond&&/^2[♣♦]$/.test(b2||'')&&ans==='Passe'&&q.h<=7&&length(b2[1])>=4&&length(longReply)===4&&/non forcing|n[’']est pas forcing/i.test(x)&&/partiel/i.test(x)&&axis==='forcing'&&wrongNewSuit)
   return p5('second-accept-partial','Sur une autre redemande non forcing de l’ouvreur, vérifie si tu possèdes un bon contrat partiel et les valeurs nécessaires avant de créer une enchère forcing.',['caractere-forcing','objectif-partielle']);
  // Competition after partner's opening, intervention or takeout double.
  const competed=p1&&rr.length===2&&rr[1].startsWith('Adversaire : ')&&/^[12][♣♦♥♠]$/.test(b1||'');
  const cm=competed&&isM(b0[1])?b0[1]:null;
  if(cm&&axis==='priorite'&&ans==='2'+cm&&length(cm)===3&&wrongNewSuit&&c[0]>='2'&&/6\s*[–-]\s*10\s*HLD/i.test(x)&&/soutien simple/i.test(x)&&/intervention naturelle/i.test(x)&&Math.max(...s)<=4)
   return p5('competitive-simple-fit-first','Sur une autre réponse après intervention naturelle, vérifie la zone HLD du soutien simple avant de nommer une couleur secondaire au palier de deux ou trois.',['fit-competitif','zone-soutien']);
  if(cm&&axis==='force'&&ans==='Passe'&&q.h<=3&&hl<=4&&length(cm)<3&&/ni un soutien|pas.*force|manque.*force/i.test(x)&&(c==='Contre'||/^2[♣♦♥♠]$/.test(c)))
   return p5('competitive-no-values','Sur une autre réponse après intervention, contrôle séparément force, fit et conditions du Contre avant de décider de participer.',['force-reponse','fit-competitif','contre-spoutnik']);
  if(cm&&axis==='convention'&&ans==='3'+cm&&c==='2SA'&&rankBid('2'+cm)<rankBid(b1)&&length(cm)>=3&&/soutien naturel le plus économique|2[♥♠] est indisponible/i.test(x))
   return p5('competitive-minimum-support-level','Sur une autre intervention, calcule le plus bas palier où le soutien demeure disponible ; ne confonds pas soutien économique et soutien à saut.',['palier-disponible','fit-competitif']);
  if(competed&&isMinor(b0[1])&&axis==='force'&&c==='Passe'&&/^2[♥♠]$/.test(ans)&&length(as)>=5&&(q.h>=11||hl>=12)&&/forcing|oblige.*reparler/i.test(x)&&/naturel/i.test(x))
   return p5('competitive-natural-two-over-one','Sur une autre intervention sur une mineure, vérifie la longueur et la force d’une réponse naturelle au palier de deux avant de choisir entre Passe, Contre et couleur.',['force-reponse','seuil-deux-sur-un','contexte-competitif']);
  const doubleResponse=rr.length===2&&advFirst&&/^1[♣♦♥♠]$/.test(b0||'')&&rr[1].startsWith('Partenaire : Contre')&&a[a.length-1]==='Adversaire : Passe';
  const minMajor=doubleResponse&&as&&isM(as)?lowBid(as,b0):null;
  if(doubleResponse&&minMajor===ans&&length(as)>=4&&q.h<=7&&/réponse.*obligatoire|répondez même|plus bas palier|enchère économique/i.test(x)&&((axis==='niveau'&&c===(Number(ans[0])+1)+as)||(axis==='priorite'&&c==='1SA'&&/priorit|privilégi/i.test(x))))
   return p5('double-weak-lowest-major','Sur une autre réponse faible au Contre d’appel, repère la majeure quatrième et le palier minimal disponible avant de choisir entre réponse simple, saut et Sans-Atout.',['reponse-contre','palier-disponible','zone-force']);
  if(doubleResponse&&c==='Passe'&&['competition','forcing'].includes(axis)&&/transformerait|convertirait|transformation punitive/i.test(x)&&/sans justification|pas.*suffisante|ni.*pénalit|atout adverse insuffisante/i.test(x))
   return p5('double-pass-penalty-condition','Sur une autre réponse au Contre d’appel après Passe adverse, distingue la réponse normalement obligatoire de la transformation punitive qui exige des atouts adverses adaptés.',['reponse-contre','transformation-punitive']);
  if(doubleResponse&&minMajor&&ans===(Number(minMajor[0])+1)+as&&length(as)>=4&&q.h>=8&&q.h<=10&&axis==='contexte'&&c==='1SA'&&/8\s*[–-]\s*10\s*H/.test(x)&&/saut/i.test(x))
   return p5('double-jump-medium','Sur une autre réponse au Contre d’appel, distingue la zone du saut dans une majeure et celle de la réponse économique.',['zone-reponse-contre','palier-disponible']);
  if(direct&&axis==='force'&&ans==='Passe'&&q.h<=5&&hl<=5&&Math.max(...s)<=4&&(c==='Contre'||c==='1SA')&&/intervention.*injustifiée|pas.*force|trop faible|seulement.*H/i.test(x))
   return p5('direct-weak-pass','Sur une autre intervention directe, vérifie que la force et la distribution permettent réellement un Contre ou une intervention à Sans-Atout avant d’agir.',['force-intervention','distribution-intervention']);
  if(direct&&ans==='Contre'&&length(b0[1])===1&&s.filter(n=>n===4).length===3&&q.h>=12&&/singleton/i.test(x)&&/quatre cartes.*(?:autres|libres)|tricolore/i.test(x)&&((axis==='competition'&&c==='Passe')||(axis==='distribution'&&cs&&length(cs)===4)))
   return p5('direct-double-all-suits','Sur une autre intervention, repère la courte adverse et les trois couleurs disponibles : compare l’information du Contre d’appel à celle d’une couleur seulement quatrième.',['distribution-contre','contre-vs-couleur']);
  if(direct&&axis==='competition'&&c==='Contre'&&/^2[♣♦♥]$/.test(ans)&&length(as)>=6&&/Contre d[’']appel ne décrirait pas aussi précisément/i.test(x)&&/qualité|longueur/i.test(x))
   return p5('direct-long-suit-not-double','Sur une autre intervention au palier de deux, vérifie la longueur et la qualité de la couleur naturelle, puis compare ce qu’un Contre d’appel décrirait.',['longueur-intervention','qualite-couleur','contre-vs-couleur']);
  const overcallReply=advFirst&&rr.length>=2&&/^1[♣♦♥♠]$/.test(b0||'')&&rr[1].startsWith('Partenaire : ')&&/intervention/i.test(rr[1])&&/^[12][♥♠]$/.test(b1||'');
  if(overcallReply&&rr.length===2&&axis==='force'&&ans==='Passe'&&c==='1SA'&&length(b1[1])<3&&q.h<=4&&/manque de force et de fit|ressources suffisantes/i.test(x))
   return p5('overcall-response-weak-no-fit','Sur une autre réponse à une intervention du partenaire, vérifie la force disponible, les atouts communs et la tenue adverse avant d’envisager Sans-Atout.',['force-reponse-intervention','fit-majeur','arret-adverse']);
  if(overcallReply&&rr.length===2&&axis==='force'&&ans==='1SA'&&c==='Passe'&&length(b1[1])<3&&q.h>=8&&q.h<=10&&/arrêt net|arrêt solide/i.test(x)&&/réponse naturelle non forcing/i.test(x))
   return p5('overcall-response-sa-values','Sur une autre réponse à une intervention, distingue une main trop faible d’une réponse naturelle à Sans-Atout avec arrêt et sans fit.',['force-reponse-intervention','arret-adverse','fit-majeur']);
  if(overcallReply&&rr.length===3&&/^2[♣♦]$/.test(b2||'')&&b2[1]===b0[1]&&ans==='2SA'&&length(b1[1])===4&&q.h>=7&&q.h<=9&&/mixed raise/i.test(x)&&/7\s*[–-]\s*9\s*H/.test(x)&&((axis==='force'&&c==='3'+b0[1])||(axis==='convention'&&c==='2'+b1[1])))
   return p5('overcall-mixed-raise','Sur une autre réponse après soutien adverse, distingue le soutien économique, le barrage, le mixed raise à 2SA et le cue-bid fort ; vérifie exactement la séquence et les quatre atouts.',['mixed-raise','zone-soutien','fit-competitif']);
  const balancing=rr.length===2&&advFirst&&/^1[♣♦♥♠]$/.test(b0||'')&&rr[1]==='Partenaire : Passe'&&a.length===3&&a[2]==='Adversaire : Passe';
  if(balancing&&axis==='force'&&ans==='Passe'&&q.h<=4&&hl<=4&&Math.max(...s)<=4&&['Contre','1SA'].includes(c)&&/réveil.*(?:pas|obligatoire)|ni force pour 1SA ou Contre/i.test(x))
   return p5('balancing-pass-weak','Sur une autre main en réveil, distingue la possibilité d’agir plus légèrement de l’obligation d’agir : vérifie encore force et distribution.',['position-reveil','force-reveil']);
  if(balancing&&axis==='force'&&ans==='Contre'&&c==='Passe'&&q.h>=8&&length(b0[1])===1&&s.filter(n=>n===4).length===3&&/contre de réveil/i.test(x)&&/quatre cartes dans chaque couleur libre/i.test(x))
   return p5('balancing-double-shape','Sur une autre main en réveil, vérifie les trois couleurs libres et la courte adverse avant de comparer Passe et Contre d’appel.',['position-reveil','distribution-contre']);
  if(balancing&&axis==='priorite'&&ans==='1SA'&&c==='Contre'&&reg&&q.h>=10&&q.h<=13&&/10\s*[–-]\s*13\s*H/.test(x)&&/tenue|arrêt/i.test(x))
   return p5('balancing-sa-zone','Sur une autre main après deux Passe, compare la zone du 1SA de réveil et celle du 1SA direct, puis vérifie régularité et arrêt.',['zone-reveil-sa','position-reveil','arret-adverse']);
  if(balancing&&ans==='Contre'&&hl>13&&Math.max(...s)>=6&&/plafond de 13 HL|au-dessus de 13 HL/i.test(x)&&/Contre d[’']abord|départ de force/i.test(x)&&((axis==='force'&&cs&&length(cs)>=6)||(axis==='distribution'&&c==='1SA')))
   return p5('balancing-strong-start-double','Sur une autre main longue en réveil, compare les HL au plafond du réveil naturel et vérifie quand un départ par Contre permet de montrer davantage de force.',['zone-reveil-naturel','contre-fort']);
  // Slam controls: only known suit information, no new convention.
  if(concept==='chelem.controles'&&rr.length===3&&p1&&isM(b0[1])&&rr[1].startsWith('Vous : 3'+b0[1])&&/contrôle/i.test(rr[2])&&ans[0]==='4'&&as&&as!==b0[1]&&control(as)&&['priorite','contexte','niveau'].includes(axis)&&['4SA','4'+b0[1], '4♥','4♠','5♣'].includes(c)&&rankBid(c)>rankBid(ans)&&/premier contrôle|ordre économique|plus économique|montrer ce dernier contrôle/i.test(x))
   return p5('slam-control-order','Sur une autre main fittée avec ambition de chelem, repère les contrôles déjà connus et annonce le contrôle disponible le plus économique avant de décider du Blackwood.',['ordre-controles','controle-couleur','blackwood-declenchement']);
  if(concept==='chelem.controles'&&rr.length===3&&p1&&rr[1].startsWith('Vous : 3'+b0[1])&&/contrôle/i.test(rr[2])&&ans[0]==='4'&&as&&as!==b0[1]&&control(as)&&axis==='convention'&&cs&&c[0]==='4'&&rankBid(c)<rankBid(ans)&&!control(cs)&&/ne protège pas|aucun contrôle|sauté/i.test(x))
   return p5('slam-do-not-invent-control','Sur une autre recherche de chelem, vérifie si la couleur sautée est réellement contrôlée et ce que son omission communique au partenaire.',['controle-couleur','ordre-controles']);
  if(concept==='chelem.controles'&&rr.length===3&&p1&&ans==='4'+b0[1]&&/sauté 4♣/i.test(x)&&/aucun contrôle Trèfle/i.test(x)&&!control('♣')&&['convention','priorite','contexte'].includes(axis)&&c!==ans)
   return p5('slam-stop-uncontrolled-suit','Sur une autre recherche de chelem, identifie une couleur sautée par le partenaire et vérifie si tu peux la contrôler ; à défaut, distingue le coup de frein d’une nouvelle exploration.',['controle-couleur','arret-chelem']);
  if(/^chelem\.splinter/.test(concept)&&as&&length(as)<=1&&ans[0]>='3'&&/Splinter/i.test(x)&&/courte|singleton|chicane/i.test(x)&&/fit|soutien|atouts/i.test(x)&&((axis==='convention'&&cs&&cs!==as&&length(cs)>=2&&c[0]===ans[0])||(['niveau','priorite'].includes(axis)&&cs&&cs!==as&&length(cs)>=4&&/soutien fort|fit fort|quatre atouts|quatre Piques|quatre Cœurs/i.test(x))))
   return p5('splinter-shortness-versus-fit','Sur une autre séquence autorisant un Splinter, vérifie quelle couleur est agréée, quelle courte est réellement détenue et ce que le soutien direct ne permettrait pas de préciser.',['splinter-courte','fit','contexte-splinter']);
  if(concept==='michaels.defense'&&rr.length===2&&p1&&rr[1].startsWith('Adversaire : ')&&/Micha|bicolore/i.test(rr[1])&&/cue.bid/i.test(x)&&/premier|second|économique|ordre d[’']enchère/i.test(x)&&/forcing de manche|valeurs de manche/i.test(x)&&['convention','niveau','priorite'].includes(axis)&&as&&cs&&c!==ans)
   return p5('michaels-defense-cuebid-order','Sur une autre intervention bicolore précisée, identifie les deux couleurs adverses, classe leurs cue-bids par enchère réellement disponible et distingue la description du fit de celle de la quatrième couleur.',['michaels-couleurs-adverses','ordre-cue-bids','fit-competitif']);
  // Weak twos: position, force, length and intention.
  if(concept==='barrage.ouverture'&&a.length===0&&/^2[♥♠]$/.test(ans)&&length(as)===6&&q.h>=6&&q.h<=10&&/première position/i.test(x)&&/deux faible|2[♥♠] faible/i.test(x)&&((axis==='competition'&&c==='Passe')||(axis==='force'&&c==='1'+as)||(axis==='niveau'&&c==='3'+as)))
   return p5('weak-two-opening-choice','Sur une autre ouverture en première position, contrôle la force, les six cartes et la qualité de la couleur avant de distinguer Passe, ouverture naturelle et barrage au palier de deux ou trois.',['barrage-force','barrage-longueur','qualite-couleur']);
  if(concept==='barrage.ouverture'&&a.length===0&&/^1[♥♠]$/.test(ans)&&length(as)>=6&&q.h>=12&&axis==='force'&&['Passe','2'+as,'3'+as].includes(c)&&/6\s*[–-]\s*10\s*H|véritable ouverture naturelle/i.test(x))
   return p5('weak-two-too-strong','Sur une autre main sixième, distingue la force d’une ouverture constructive de la zone limitée d’un barrage.',['barrage-force','force-ouverture']);
  if(concept==='barrage.ouverture'&&a.length===0&&ans==='Passe'&&axis==='force'&&q.h<=4&&/^1[♥♠]$/.test(c)&&length(cs)>=6&&/6\s*(?:à|[–-])\s*10\s*H/i.test(x)&&/qualité|gros honneurs/i.test(x))
   return p5('weak-two-too-weak','Sur une autre main à couleur sixième, ne confonds pas longueur suffisante et qualité/force suffisantes pour un barrage en première position.',['barrage-force','qualite-couleur']);
  if(concept==='barrage.reponse'&&rr.length===1&&partnerFirst&&/^2[♥♠]$/.test(b0||'')&&ans==='Passe'&&length(b0[1])===2&&q.h<=6&&/six.*(?:Cœurs|Piques)|six cartes/i.test(x)&&/contrat.*suffit|Passe évite/i.test(x)&&((axis==='force'&&c==='2SA')||(axis==='niveau'&&c==='4'+b0[1])))
   return p5('weak-two-response-stop','Sur une autre réponse à un deux faible, compte les atouts garantis et distingue la prolongation du barrage de l’exploration constructive.',['fit-barrage','objectif-contrat']);
  if(concept==='barrage.reponse'&&rr.length===1&&partnerFirst&&/^2[♥♠]$/.test(b0||'')&&ans==='4'+b0[1]&&length(b0[1])>=4&&/vulnérabilité favorable/i.test(x)&&/prolongation du barrage/i.test(x)&&['contexte','niveau','force'].includes(axis)&&['Passe','2SA','3'+b0[1]].includes(c))
   return p5('weak-two-extend-favorable','Sur une autre réponse fittée à un deux faible, vérifie le nombre total d’atouts et la vulnérabilité avant de distinguer barrage prolongé et manche de force.',['fit-barrage','vulnerabilite','objectif-barrage']);
  // Forcing fourth suit and free/forced rebids under competition.
  const fourth=rr.length===4&&ownFirst&&/4e (?:couleur )?forcing/i.test(rr[3])&&rr[1].startsWith('Partenaire : ')&&/^1[♥♠]$/.test(b1||'');
  if(fourth&&axis==='priorite'&&as===b1[1]&&length(as)===3&&['2','3'].includes(ans[0])&&c!==ans&&/prioritaire|prioritairement|premier devoir|d’abord|d'abord/i.test(x)&&/trois (?:Cœurs|Piques)|soutien différé/i.test(x))
   return p5('fourth-show-three-support','Sur une autre réponse à la quatrième couleur forcing, vérifie en priorité les trois cartes dans la majeure du répondant, puis le palier correspondant à ta zone de force.',['quatrieme-forcing','soutien-differe','zone-force']);
  if(concept==='forcing.quatrieme'&&replySecond&&/^1[♣♦♥♠]$|^2[♣♦♥♠]$/.test(b2||'')&&axis==='forcing'&&as&&![b0[1],b1[1],b2[1]].includes(as)&&/quatrième couleur/i.test(x)&&/forcing|poursuivre le dialogue|demander des précisions/i.test(x)&&['2SA','2'+b1[1],'2'+b0[1]].includes(c))
   return p5('fourth-ask-before-limiting','Sur une autre séquence à trois couleurs nommées, identifie la quatrième et l’information manquante avant de limiter la main par une préférence ou Sans-Atout.',['quatrieme-forcing','information-manquante']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&/^Adversaire : 1[♥♠]$/.test(a[3])&&/^Partenaire : 1[♥♠]$/.test(a[2])&&ans==='Passe'&&reg&&length(a[2].slice(-1))===3&&/redemande est libre|redemande libre/i.test(x)&&/aucune tenue|sans.*tenue/i.test(x)&&((axis==='contexte'&&c==='1SA')||(axis==='fit'&&c==='2'+a[2].slice(-1))))
   return p5('competitive-rebid-free-pass','Sur une autre intervention du quatrième joueur, distingue redemande libre et redemande obligée ; vérifie l’arrêt et les quatre cartes de soutien avant de choisir.',['redemande-libre','arret-adverse','fit-ouvreur']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&a[3]==='Adversaire : Passe'&&/^Adversaire : 1[♥♠]$/.test(a[1])&&/^Partenaire : 1[♥♠]$/.test(a[2])&&ans==='1SA'&&reg&&length(a[2].slice(-1))===3&&/redemande obligée/i.test(x)&&/ne promet pas l[’']arrêt/i.test(x)&&((axis==='fit'&&c==='2'+a[2].slice(-1))||(axis==='distribution'&&cs===b0[1]&&length(cs)<=4)))
   return p5('competitive-rebid-obligatory-sa','Sur une autre redemande forcée par le changement de couleur du répondant, compare la promesse d’arrêt du 1SA libre et celle du 1SA obligé ; ne crée pas un fit de quatre cartes absent.',['redemande-obligee','arret-adverse','fit-ouvreur']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&a[3]==='Adversaire : Contre'&&/^Partenaire : 1[♥♠]$/.test(a[2])&&ans==='Surcontre'&&length(a[2].slice(-1))===3&&/Surcontre de soutien/i.test(x)&&/exactement trois/i.test(x)&&['priorite','fit','convention'].includes(axis))
   return p5('competitive-support-redouble','Sur une autre séquence où le quatrième joueur contre la réponse majeure, distingue le Surcontre de soutien troisième du soutien direct quatrième.',['surcontre-soutien','fit-ouvreur']);
  // Rubensohl, Landy, Drury and other convention-specific developments.
  if(/^rubensohl\./.test(concept)&&rr.length===3&&ownFirst&&b0==='1SA'&&/^Adversaire : 2[♥♠]/.test(rr[1])&&/Texas impossible.*Stayman/i.test(rr[2])&&as===other(b1[1])&&ans==='3'+as&&length(as)>=4&&/majeure.*quatrième|quatre (?:Piques|Cœurs)/i.test(x)&&/fit|information demandée/i.test(x)&&((axis==='convention'&&c==='3'+b1[1])||(axis==='niveau'&&c==='4'+as)||(axis==='priorite'&&c==='3SA')))
   return p5('rubensohl-stayman-show-major','Sur une autre réponse de l’ouvreur au Texas impossible, recherche d’abord la majeure quatrième non nommée par les adversaires avant de préciser l’arrêt.',['rubensohl-stayman','majeure-quatrieme','arret-adverse']);
  if(/^rubensohl\./.test(concept)&&rr.length===3&&ownFirst&&b0==='1SA'&&/^Adversaire : 2[♥♠]/.test(rr[1])&&/Texas impossible.*Stayman/i.test(rr[2])&&length(other(b1[1]))<4&&((ans==='3SA'&&c==='3'+b1[1]&&axis==='convention'&&/arrêter l[’']intervention|arrêt.*(?:solide|Cœur|Pique)/i.test(x))||(ans==='3'+b1[1]&&c==='3SA'&&axis==='contexte'&&/ni quatre.*ni arrêt|double absence/i.test(x))))
   return p5('rubensohl-stayman-stop-or-wait','Sur une autre réponse au Texas impossible sans majeure quatrième disponible, distingue l’enchère naturelle à 3SA avec arrêt et le cue-bid d’attente sans arrêt.',['rubensohl-stayman','arret-adverse','cue-bid']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&rr[1].startsWith('Adversaire : ')&&/naturel/i.test(rr[1])&&/^2[♥♠♦]$/.test(b1||'')&&/^2[♥♠]$/.test(ans)&&rankBid(ans)>rankBid(b1)&&length(as)>=5&&q.h<=7&&/naturel.*non forcing/i.test(x)&&/partiel|jouer au palier de deux/i.test(x)&&axis==='force'&&['Contre','3SA'].includes(c))
   return p5('rubensohl-natural-partial','Sur une autre intervention naturelle sur 1SA, vérifie si la majeure peut encore être annoncée naturellement au palier de deux et si ton projet est seulement une partielle.',['rubensohl-palier','objectif-partielle']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&/^Adversaire : 2[♥♠♦]/.test(rr[1])&&ans==='Contre'&&c==='Passe'&&axis==='force'&&q.h>=8&&q.h<=10&&/Contre est d[’']appel dès 8 H/i.test(x))
   return p5('rubensohl-double-invite','Sur une autre intervention naturelle sur 1SA, vérifie la zone du Contre d’appel convenue et les majeures disponibles avant de renoncer à la recherche de manche.',['rubensohl-contre','zone-force']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&/^Adversaire : 2[♥♠♦]/.test(rr[1])&&ans==='2SA'&&length('♣')>=6&&q.h<=7&&/2SA est un Texas pour 3♣|Texas Trèfle/i.test(x)&&axis==='distribution'&&cs&&cs!=='♣'&&length(cs)<5)
   return p5('rubensohl-club-transfer','Sur une autre intervention sur 1SA, identifie le Texas qui mène à la mineure longue et distingue-le d’une couleur naturelle qui n’est pas détenue.',['rubensohl-code','longueur-couleur']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&/^Adversaire : 2♠/.test(rr[1])&&ans==='3♦'&&c==='3♥'&&axis==='convention'&&s[1]>=6&&q.h<=7&&/transfère vers 3♥|Texas Cœur/i.test(x)&&/partielle/i.test(x))
   return p5('rubensohl-blocked-heart-transfer','Sur une autre intervention qui dépasse 2♥, vérifie comment atteindre la partielle à Cœur par le Texas convenu et quelle suite donne le répondant après rectification.',['rubensohl-code','palier-disponible','objectif-partielle']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&/Contre \(bicolore/i.test(rr[1])&&ans==='2♣'&&s[0]===4&&s[1]===4&&axis==='distribution'&&['2♦','2♥'].includes(c)&&/réponses usuelles|reste le Stayman/i.test(x))
   return p5('rubensohl-artificial-double-stayman','Sur une autre intervention par Contre artificiel sur 1SA, vérifie si les réponses usuelles sont conservées dans l’accord, puis distingue Stayman et Texas selon les longueurs.',['rubensohl-contexte','stayman-texas']);
  if(/^multilandy\./.test(concept)&&rr.length===3&&advFirst&&b0==='1SA'&&b1==='2♣'&&/Landy/i.test(rr[1])&&b2==='2♦'&&/relais/i.test(rr[2])&&rr[1].startsWith('Vous : ')&&ans==='2'+(s[0]>s[1]?'♠':'♥')&&Math.min(s[0],s[1])>=4&&/majeure la plus longue/i.test(x)&&['convention','niveau'].includes(axis)&&c!==ans)
   return p5('landy-relay-longer-major','Sur une autre réponse au relais 2♦ du Landy, compare la longueur des deux majeures et vérifie la réponse économique convenue, y compris à égalité.',['landy-relais','longueur-majeures']);
  if(/^multilandy\./.test(concept)&&rr.length===2&&advFirst&&b0==='1SA'&&b1==='2♣'&&/Landy/i.test(rr[1])&&rr[1].startsWith('Partenaire : ')&&ans==='2♦'&&s[0]===s[1]&&/relais artificiel|majeure la plus longue/i.test(x)&&((axis==='priorite'&&/^2[♥♠]$/.test(c))||(axis==='force'&&c==='2SA'&&q.h<=7)))
   return p5('landy-relay-equal-support','Sur une autre réponse au Landy, compare tes longueurs majeures avant de choisir une préférence directe ou le relais qui demande la majeure la plus longue.',['landy-relais','longueur-majeures']);
  if(/^multilandy\./.test(concept)&&rr.length===3&&advFirst&&b0==='1SA'&&/^2[♥♠]$/.test(b1||'')&&/Multi.Landy/i.test(rr[1])&&b2==='2SA'&&/relais positif/i.test(rr[2])&&axis==='convention'&&/grille mini\/maxi|zone maximale|zone minimale/i.test(x)&&/mineure/i.test(x)&&/^3[♣♦♥♠]$/.test(ans)&&/^3[♣♦♥♠]$/.test(c)&&length(b1[1])>=5&&Math.max(s[2],s[3])>=4)
   return p5('multilandy-positive-relay-grid','Sur une autre réponse au relais positif de Multi-Landy, identifie la mineure réellement détenue et la zone mini/maxi avant d’appliquer la grille de l’accord étudié.',['multilandy-code','zone-mini-maxi','mineure']);
  if(/^drury\./.test(concept)&&rr.length===3&&rr[0]==='Partenaire : Passe'&&rr[1].startsWith('Vous : 1')&&/3e position/i.test(rr[1])&&b2==='2♣'&&/Drury/i.test(rr[2])&&ans==='2'+b1[1]&&hl<13&&/moins de 13 HL|pas la force d[’']une ouverture normale/i.test(x)&&((axis==='convention'&&c==='2♦')||(axis==='niveau'&&c[1]===b1[1])))
   return p5('drury-opener-light','Sur une autre ouverture en troisième position suivie du Drury, vérifie la force réelle de l’ouverture avant de choisir entre le retour faible dans la majeure et une réponse constructive.',['drury-force-ouvreur','drury-code']);
  if(/^drury\./.test(concept)&&rr.length===2&&rr[0]?.startsWith('Vous : Passe')&&rr[1].startsWith('Partenaire : 1')&&/3e position/i.test(rr[1])&&ans==='2'+b1[1]&&length(b1[1])===3&&Math.min(...s)>=3&&q.h<=10&&/Drury.*11 HLD/i.test(x)&&((axis==='convention'&&c==='2♣')||(axis==='niveau'&&c==='3'+b1[1])))
   return p5('drury-responder-insufficient','Sur une autre main passée d’entrée, calcule les HLD avec trois atouts et vérifie le seuil du Drury avant de choisir le soutien simple.',['drury-fit','drury-zone']);
  if(concept==='drury.suite'&&rr.length===4&&rr[0]?.startsWith('Vous : Passe')&&rr[1].startsWith('Partenaire : 1')&&b2==='2SA'&&/singleton/i.test(rr[2])&&b3==='3♣'&&/courte/i.test(rr[3])&&axis==='convention'&&length(b1[1])>=4&&s.filter(n=>n===1).length===1&&/singleton|courte/i.test(x)&&/relais/i.test(x)&&/^3[♦♥♠]$/.test(ans))
   return p5('drury-shortness-relay-code','Sur une autre réponse au relais 3♣ après le 2SA fitté d’une main passée, identifie le singleton réel et retrouve son codage, notamment lorsque le retour dans l’atout code les Trèfles.',['drury-courte','drury-code']);
  if(/^sa1\.texas_mineur\.suite/.test(concept)&&rr.length===3&&partnerFirst&&b0==='1SA'&&/Texas/i.test(rr[1])&&/rectification/i.test(rr[2])&&isMinor(b2?.[1])&&length(b2[1])>=6&&ans==='Passe'&&q.h<=5&&axis==='force'&&/partiel|pas.*manche|ne justifie pas.*manche/i.test(x))
   return p5('minor-texas-weak-stop','Sur une autre main après rectification du Texas mineur, distingue la main faible qui a atteint sa partielle de la main forte qui doit encore décrire sa courte.',['texas-mineur','objectif-partielle','description-courte']);
  if(/^sa1\.texas_mineur\.suite/.test(concept)&&rr.length===3&&partnerFirst&&b0==='1SA'&&/Texas/i.test(rr[1])&&/rectification/i.test(rr[2])&&isMinor(b2?.[1])&&length(b2[1])>=6&&q.h>=10&&axis==='convention'&&as&&length(as)<=1&&ans[0]==='3'&&cs&&length(cs)>=2&&/nomme la courte|montre.*courte/i.test(x))
   return p5('minor-texas-describe-shortness','Sur une autre main forte après Texas mineur rectifié, identifie la courte réelle et vérifie pourquoi elle ne constitue pas un arrêt pour 3SA.',['texas-mineur','description-courte','arret']);
  if(/^sa1\.stayman\.suite/.test(concept)&&rr.length===3&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&b2==='2♦'&&Math.max(s[0],s[1])===4&&reg&&/nie.*majeure|nie quatre|pas de fit 4[–-]4/i.test(x)&&((ans==='2SA'&&q.h>=8&&q.h<=9&&/invit/i.test(x))||(ans==='3SA'&&q.h>=10&&q.h<=14&&/manche/i.test(x)))&&c==='Passe'&&['convention','force'].includes(axis))
   return p5('stayman-no-fit-sa-level','Sur une autre réponse négative au Stayman, vérifie l’absence de fit 4–4 puis situe la force totale du camp pour choisir arrêt, invitation ou manche à Sans-Atout.',['stayman-reponse-negative','objectif-contrat']);
  if(concept==='sa1.seuil'&&responseSA&&startSA==='1SA'&&reg&&Math.max(s[0],s[1])<4&&axis==='force'&&((ans==='Passe'&&q.h<=7&&/aucun espoir de manche|pas.*espoir de manche/i.test(x)&&['2SA','3SA'].includes(c))||(ans==='2SA'&&q.h>=8&&q.h<=9&&/manche.*possible|proposez|invitation/i.test(x)&&['Passe','3SA'].includes(c))||(ans==='3SA'&&q.h>=10&&q.h<=14&&/25 H|manche.*justifiée|conclu/i.test(x)&&['Passe','2SA'].includes(c))))
   return p5('one-nt-pass-invite-game','Sur une autre main régulière sans majeure quatrième, additionne tes points au minimum et au maximum de 1SA pour distinguer arrêt, invitation et manche.',['zone-reponse-sa','objectif-contrat']);
  if(concept==='contre.deux_faible'&&rr.length===2&&advFirst&&/^2[♥♠]$/.test(b0||'')&&/faible/i.test(rr[0])&&rr[1].startsWith('Partenaire : Contre')&&a[a.length-1]==='Adversaire : Passe'&&as&&ans===lowBid(as,b0)&&length(as)>=4&&q.h<8&&/moins de 8 H|inférieure à 8 H|réponse naturelle au palier minimal/i.test(x)&&((axis==='force'&&c==='2SA')||(axis==='niveau'&&c===(Number(ans[0])+1)+as)||(axis==='convention'&&c==='3'+b0[1])))
   return p5('double-weak-two-minimum','Sur une autre réponse au Contre d’un deux faible, vérifie la zone inférieure à 8 H et la couleur disponible au plus bas palier avant d’envisager un relais constructif.',['contre-deux-faible','mini-cue-bid','palier-disponible']);
  if(concept==='contre.deux_faible'&&rr.length===2&&advFirst&&/^2[♥♠]$/.test(b0||'')&&rr[1].startsWith('Partenaire : Contre')&&ans==='2SA'&&q.h>=8&&q.h<=11&&/mini.cue.bid/i.test(x)&&/8\s*[–-]\s*11\s*H/.test(x)&&axis==='force'&&c==='3'+b0[1])
   return p5('double-weak-two-mini-cue','Sur une autre réponse au Contre d’un deux faible, distingue la zone intermédiaire du mini-cue-bid à 2SA et le cue-bid fort ; ne lis pas le relais comme un Sans-Atout naturel.',['mini-cue-bid','zone-reponse-contre']);
  if(concept==='competitif.truscott'&&rr.length===2&&p1&&rr[1].startsWith('Adversaire : Contre')&&ans==='Surcontre'&&q.h>=10&&/Surcontre exprime cette force|Surcontre.*valeurs/i.test(x)&&axis==='force'&&/^(?:1SA|2[♣♦♥♠])$/.test(c))
   return p5('redouble-values','Sur une autre réponse après Contre adverse, distingue l’annonce générale des valeurs par Surcontre d’une réponse limitée ou d’un soutien ; vérifie d’abord les possibilités naturelles prioritaires.',['surcontre-valeurs','contexte-competitif']);
  if(concept==='competitif.spoutnik'&&competed&&isMinor(b0[1])&&ans==='Contre'&&/Spoutnik/i.test(x)&&((s[0]===4&&s[1]===4&&['competition','priorite'].includes(axis)&&/^2[♥♠]$/.test(c)&&/deux.*fits|deux majeures/i.test(x))||(b1==='1♠'&&s[1]>=4&&q.h>=8&&q.h<11&&hl<12&&c==='Passe'&&axis==='force'&&/force insuffisante|constructive limitée/i.test(x))))
   return p5('spoutnik-keep-major-search','Sur une autre intervention sur une mineure, compte les majeures et vérifie la force d’une enchère naturelle au palier de deux avant d’utiliser le Contre Spoutnik.',['contre-spoutnik','majeure-quatrieme','seuil-deux-sur-un']);


  // Pass 6 — second layer of decisions. Only previous HOLD candidates can reach this point.
  const p6=(id,prompt,criteria)=>result('pass6-'+id,prompt,criteria);
  if(afterMinor&&axis==='priorite'&&/^1[♥♠]$/.test(ans)&&c==='1'+other(as)&&length(as)===5&&length(cs)===4&&/majeure la plus longue|cinq.*quatre/i.test(x)&&/répond|réponse/i.test(x))
   return p6('minor-five-four-major-order','Sur une autre réponse avec deux majeures de longueurs différentes, compare la priorité de la majeure cinquième à l’ordre des majeures quatrièmes.',['ordre-majeures','longueur-majeures']);
  if(afterMinor&&axis==='force'&&ans==='1SA'&&reg&&q.h>=6&&q.h<=10&&Math.max(s[0],s[1])<4&&/réponse limitée/i.test(x)&&((c==='2SA')||(b0==='1♦'&&c==='2♣'&&hl<11&&s[3]<5)))
   return p6('minor-limited-sa-not-stronger','Sur une autre réponse à une mineure sans majeure quatrième, compare les zones de force et les longueurs nécessaires pour une réponse limitée, un changement de couleur au palier de deux ou une invitation à Sans-Atout.',['force-reponse','zone-reponse-sa','seuil-deux-sur-un']);
  if(concept==='mineur.base'&&rr.length===2&&rr[0]?.startsWith('Vous : Passe')&&rr[1]?.startsWith('Partenaire : 1')&&isMinor(b1?.[1])&&/3e|troisième position/i.test(rr[1])&&/^2[♥♠]$/.test(ans)&&length(as)>=5&&length(b1[1])>=4&&q.h>=8&&q.h<=11&&/enchère de rencontre/i.test(x)&&axis==='convention'&&c==='2'+b1[1])
   return p6('passed-hand-fit-jump','Sur une autre main passée d’entrée, distingue le soutien simple de l’enchère de rencontre qui décrit une longue et le soutien simultanément.',['rencontre','main-passee','fit-mineur']);
  if(afterMajor&&axis==='force'&&ans==='1SA'&&length(support)<3&&q.h>=6&&q.h<11&&hl<12&&/non forcing/i.test(x)&&/force.*insuffisante|sous les 11 H|force nécessaire/i.test(x)&&((c==='Passe')||(/^2[♣♦♥]$/.test(c)&&cs!==support)))
   return p6('major-limited-response-not-pass','Sur une autre réponse sans fit majeur, vérifie d’abord si tu dois répondre, puis si ta force permet le deux-sur-un naturel ou seulement 1SA.',['force-reponse','seuil-deux-sur-un','zone-reponse-sa']);
  if(afterMajor&&axis==='priorite'&&support==='♠'&&ans==='2♥'&&/^2[♣♦]$/.test(c)&&s[1]>=5&&length(cs)<s[1]&&(q.h>=11||hl>=12)&&/majeure cinquième.*avant|priorité.*majeure/i.test(x))
   return p6('major-five-hearts-before-minor','Sur une autre réponse à 1♠ avec les valeurs du deux-sur-un, compare les longueurs et la priorité de la majeure cinquième avant d’annoncer une mineure.',['longueur-couleur','priorite-majeure']);
  if(afterMajor&&axis==='fit'&&ans==='Passe'&&c==='2'+support&&length(support)<3&&q.h<=4&&hl<=5&&/pas la force nécessaire pour répondre|trop faible/i.test(x))
   return p6('major-pass-without-fit','Sur une autre réponse très faible, vérifie séparément le nombre d’atouts promis et détenus et la force qui permettrait de parler.',['fit-majeur','force-reponse']);
  if(afterMajor&&ans==='Passe'&&length(support)>=3&&Math.min(...s)>=3&&q.h+2*Math.max(0,length(support)-3)<6&&/6 HLD|soutien simple/i.test(x)&&/faible|insuffis|sous les|ne disposez pas/i.test(x)&&axis==='force'&&['1SA','2SA','3'+support].includes(c))
   return p6('major-fit-but-no-values','Sur une autre main très faible mais fittée, distingue la présence du fit des valeurs nécessaires pour le soutien constructif ou la réponse à Sans-Atout.',['evaluation-hld','zone-soutien','force-reponse']);
  if(afterMajor&&axis==='convention'&&ans==='2'+support&&c==='2SA'&&length(support)===3&&/\b6\s*[–-]\s*10\s*HLD\b/.test(x)&&/fit huitième|première zone/i.test(x))
   return p6('major-simple-versus-fitted-nt','Sur une autre réponse avec trois atouts, calcule les HLD puis distingue le soutien simple de l’enchère conventionnelle à 2SA.',['fit-majeur','2sa-fitte','zone-soutien']);
  // Redemande: use the actual opener/respondent roles, no newly invented thresholds.
  if(ownRebid&&replySuit&&ans==='2'+replySuit&&length(replySuit)===4&&axis==='distribution'&&/^1[♥♠]$/.test(c)&&cs!==replySuit&&length(cs)<4&&/fit est établi|fit.*établi/i.test(x))
   return p6('opener-fit-not-invent-major','Sur une autre redemande, compte les atouts du répondant et ceux de la majeure non annoncée ; ne masque pas un fit établi par une couleur non détenue.',['fit-ouvreur','longueur-majeure']);
  if(ownRebid&&replySuit&&reg&&length(replySuit)===3&&['1SA','2SA'].includes(ans)&&c==='2'+replySuit&&axis==='fit'&&/réguli|régulier/i.test(x)&&/trois (?:Piques|Cœurs)|non fitt/i.test(x)&&/12\s*[–-]\s*14\s*H|18\s*[–-]\s*19\s*H/.test(x))
   return p6('opener-no-four-card-fit','Sur une autre redemande régulière avec trois cartes dans la majeure du répondant, distingue le fit établi du fit seulement possible et situe ta force dans la zone de Sans-Atout.',['fit-ouvreur','zone-redemande-sa']);
  if(ownRebid&&firstSuit&&ans==='2'+firstSuit&&length(firstSuit)>=6&&q.h>=12&&q.h<=14&&axis==='distribution'&&((c==='1SA'&&replySuit&&length(replySuit)<4)||(cs&&cs!==firstSuit&&length(cs)<4))&&/six (?:Carreaux|Trèfles|Cœurs|Piques)|sixième/i.test(x)&&/première zone|partielle|minimale/i.test(x))
   return p6('opener-six-card-repeat','Sur une autre redemande minimale, vérifie si la couleur ouverte est réellement sixième et si une seconde couleur ou un fit peut être décrit avant de répéter naturellement.',['longueur-redemande','zone-force']);
  if(ownRebid&&replySuit&&/^1[♥♠]$/.test(ans)&&as!==replySuit&&length(as)>=4&&q.h>=12&&q.h<=14&&c==='2SA'&&axis==='force'&&/redemande naturelle au palier de 1|majeure disponible au palier de un/i.test(x))
   return p6('opener-one-level-not-jump-sa','Sur une autre redemande de première zone, compare les valeurs nécessaires au 2SA à saut et la majeure quatrième disponible au palier de un.',['zone-redemande-sa','priorite-majeure']);
  if(ownRebid&&firstSuit&&isM(firstSuit)&&b1==='1SA'&&/^2[♣♦]$/.test(ans)&&length(firstSuit)===5&&length(as)>=4&&q.h>=12&&q.h<=14&&axis==='force'&&['2SA','3'+as].includes(c)&&/deuxième couleur|bicolore économique/i.test(x)&&/force absente|plus de force/i.test(x))
   return p6('opener-economic-minor-second-suit','Sur une autre redemande après 1SA, vérifie les deux longueurs et si le partenaire peut revenir à la première couleur au même palier ; distingue le bicolore économique du saut.',['bicolore-economique','zone-force']);
  if(ownRebid&&firstSuit&&isM(firstSuit)&&/^2[♣♦]$/.test(b1||'')&&/^2[♥♠]$/.test(ans)&&as!==firstSuit&&length(firstSuit)>=5&&length(as)>=4&&axis==='fit'&&c==='3'+b1[1]&&length(b1[1])<3&&/bicolore économique/i.test(x)&&/auto.forcing/i.test(x))
   return p6('opener-two-over-one-second-suit','Sur une autre redemande après deux-sur-un, compare le soutien réel de la mineure du répondant et la seconde couleur disponible ; vérifie le caractère auto-forcing de la réponse.',['bicolore-economique','fit-mineur','auto-forcing']);
  // Second decision, with explicit destination and available continuation.
  if(replySecond&&b2==='2'+longReply&&ans==='Passe'&&length(longReply)>=4&&q.h<=8&&/huit atouts|8 atouts/i.test(x)&&/insuffisante pour inviter|pas.*manche|force.*insuffisante/i.test(x)&&axis==='force'&&['2SA','3'+longReply,'4'+longReply].includes(c))
   return p6('second-fit-minimum-stop','Sur une autre main après soutien de l’ouvreur, réévalue ta force au fit et distingue l’arrêt dans la partielle de l’invitation à la manche.',['fit-majeur','objectif-partielle','zone-force']);
  if(replySecond&&b2==='1SA'&&ans==='Passe'&&reg&&length(longReply)===4&&q.h<=8&&axis==='distribution'&&c==='2'+longReply&&/ne justifie ni répétition|ne justifient pas une répétition|répétition.*cinq cartes/i.test(x))
   return p6('second-do-not-repeat-four','Sur une autre deuxième enchère après 1SA, vérifie la longueur nécessaire pour répéter la majeure et distingue une main quatrième régulière d’une main cinquième.',['longueur-majeure','objectif-partielle']);
  if(replySecond&&b2==='1SA'&&ans==='2SA'&&reg&&length(longReply)===4&&q.h>=10&&q.h<=11&&axis==='distribution'&&c==='2'+longReply&&/invitation naturelle non forcing|invite.*manche/i.test(x)&&/quatre (?:Cœurs|Piques)|4 cartes/i.test(x))
   return p6('second-invite-without-five-card-major','Sur une autre main invitante après 1SA, compare la recherche d’un fit 5–3 à l’invitation naturelle lorsque tu n’as qu’une majeure quatrième.',['longueur-majeure','objectif-invitation','roudi-objectif']);
  if(replySecond&&/^2[♣♦]$/.test(b2||'')&&ans==='Passe'&&q.h<=7&&length(b2[1])>=4&&length(longReply)===4&&/non forcing|n[’']est pas forcing/i.test(x)&&/partiel/i.test(x)&&axis==='force'&&c==='3'+b2[1])
   return p6('second-accept-not-raise-minor','Sur une autre redemande non forcing dans la mineure de l’ouvreur, vérifie si la partielle est déjà satisfaisante et si une montée de palier est justifiée par ta force.',['objectif-partielle','zone-force']);
  // Competitive fit and conventional responses.
  if(cm&&axis==='convention'&&ans==='3'+cm&&c==='2SA'&&rankBid('2'+cm)>rankBid(b1)&&length(cm)===4&&/11\s*[–-]\s*12\s*HLD/.test(x)&&/soutien à saut constructif/i.test(x)&&/2SA.*trois atouts/i.test(x))
   return p6('competitive-four-card-invitational-jump','Sur une autre réponse après intervention, vérifie que le soutien simple reste disponible, puis distingue le saut constructif quatrième du 2SA fitté troisième.',['fit-competitif','zone-soutien','palier-disponible']);
  if(cm&&axis==='force'&&ans==='Passe'&&q.h<=3&&hl<=4&&length(cm)<3&&c==='Contre'&&/ni.*fit|pas.*fit/i.test(x)&&/ne suffisent pas|force supérieure|pas.*force/i.test(x))
   return p6('competitive-no-spoutnik-values','Sur une autre main très faible après intervention adverse, vérifie les valeurs nécessaires au Contre Spoutnik même si une couleur quatrième est disponible.',['contre-spoutnik','force-reponse','fit']);
  if(p1&&rr.length===2&&b0==='1♥'&&b1==='Contre'&&ans==='1♠'&&s[0]>=4&&s[1]<3&&q.h>=6&&q.h<=10&&c==='Passe'&&axis==='force'&&/forcing pour un tour|forcing un tour/i.test(x))
   return p6('competitive-natural-major-after-double','Sur une autre réponse à 1♥ après Contre adverse, vérifie si la majeure quatrième peut être annoncée naturellement au palier de un et si la main a les valeurs pour répondre.',['majeure-reponse','force-reponse','contexte-competitif']);
  if(cm&&ans==='4'+cm&&length(cm)>=5&&q.h<=5&&/vulnérabilité favorable/i.test(x)&&/barrage offensif|barrage/i.test(x)&&['priorite','force','convention'].includes(axis)&&['2SA','3'+cm,'3'+b1[1]].includes(c))
   return p6('competitive-five-card-barrage','Sur une autre réponse avec dix atouts garantis à vulnérabilité favorable, distingue la force constructive des enchères de fit et l’objectif de barrage.',['barrage-competitif','fit','vulnerabilite']);
  if(overcallReply&&rr.length===3&&/nouvelle couleur/i.test(rr[2])&&ans==='2SA'&&length(b1[1])===4&&q.h>=7&&q.h<=9&&/mixed raise/i.test(x)&&/7\s*[–-]\s*9\s*H/.test(x)&&axis==='force'&&c==='3'+b0[1])
   return p6('mixed-raise-third-player-new-suit','Sur une autre séquence après intervention du partenaire, vérifie si le troisième joueur a parlé, puis distingue le mixed raise quatrième du cue-bid plus fort.',['mixed-raise','contexte-competitif','zone-soutien']);
  if(overcallReply&&rr.length===3&&/nouvelle couleur/i.test(rr[2])&&ans==='3'+b1[1]&&length(b1[1])===4&&q.h<=5&&/vulnérabilité favorable/i.test(x)&&/barrage/i.test(x)&&axis==='force'&&c==='2SA')
   return p6('overcall-raise-preemptive','Sur une autre réponse après une nouvelle couleur adverse, compte les atouts garantis et vérifie si ta force est celle d’un barrage ou d’un mixed raise.',['mixed-raise','barrage-competitif','fit']);
  if(overcallReply&&rr.length===2&&ans==='2'+b0[1]&&length(b1[1])>=3&&q.h>=11&&/cue.bid forcing/i.test(x)&&/fit huitième|perspective de manche/i.test(x)&&axis==='force'&&c==='Passe')
   return p6('overcall-strong-fit-cue-bid','Sur une autre réponse à l’intervention du partenaire, vérifie la force au fit et distingue le cue-bid forcing de la couleur adverse du soutien limité.',['cue-bid','fit-competitif','objectif-manche']);
  if(doubleResponse&&as&&isMinor(as)&&ans===lowBid(as,b0)&&length(as)>=5&&q.h<=7&&/répondre au contre|réponse naturelle économique|première enchère naturelle/i.test(x)&&((axis==='force'&&c==='1SA')||(axis==='distribution'&&cs&&isM(cs)&&length(cs)<4)))
   return p6('double-best-minor-no-major','Sur une autre réponse faible au Contre d’appel, cherche la meilleure couleur disponible ; ne choisis pas Sans-Atout ou une majeure qui ne décrit pas la longueur détenue.',['reponse-contre','longueur-couleur','palier-disponible']);
  if(doubleResponse&&minMajor===ans&&length(as)>=4&&q.h<=7&&c==='1SA'&&axis==='force'&&/réponse.*obligatoire|répondez même/i.test(x)&&/plus bas palier|enchère économique/i.test(x))
   return p6('double-weak-major-not-nt','Sur une autre réponse au Contre d’appel avec peu de jeu, distingue la réponse naturelle à la couleur au palier économique de la réponse à Sans-Atout, qui décrit une zone et une tenue.',['reponse-contre','zone-reponse-sa','longueur-majeure']);
  if(doubleResponse&&ans==='2'+b0[1]&&b0==='1♣'&&q.h>=8&&q.h<=10&&s[0]===4&&s[1]===4&&/cue.bid/i.test(x)&&/choisir sa majeure|choisir.*couleur/i.test(x)&&axis==='convention'&&/^2[♥♠]$/.test(c))
   return p6('double-two-major-cue-bid','Sur une autre réponse au Contre d’appel avec deux majeures quatrièmes, vérifie le rôle précis du cue-bid dans cette séquence pour laisser le contreur choisir le fit.',['cue-bid','recherche-fit','contexte-competitif']);
  if(direct&&axis==='force'&&ans==='Passe'&&q.h<=6&&Math.max(...s)<=4&&['Contre','1SA'].includes(c)&&/distribution et votre force ne justifient pas|force.*supérieure|ne suffisent pas à une intervention/i.test(x)&&/intervention/i.test(x))
   return p6('direct-insufficient-no-five-card-suit','Sur une autre intervention directe sans couleur cinquième, vérifie séparément la force et la distribution requises pour intervenir, contrer ou annoncer 1SA.',['force-intervention','distribution-intervention']);
  if(direct&&axis==='distribution'&&ans==='1SA'&&reg&&hl>=16&&hl<=18&&cs&&length(cs)<5&&/16\s*[–-]\s*18\s*HL/.test(x)&&/tenue|arrêt/i.test(x))
   return p6('direct-nt-not-short-suit','Sur une autre intervention régulière avec arrêt et les valeurs de 1SA direct, compare cette description à une couleur qui ne possède pas la longueur nécessaire.',['zone-intervention-sa','longueur-couleur','arret-adverse']);
  if(direct&&axis==='force'&&ans==='Passe'&&q.h<=4&&hl<=5&&cs&&length(cs)===5&&c[0]==='2'&&/ne justifient pas de monter au palier de deux|intervention trop risquée/i.test(x))
   return p6('direct-low-values-two-level','Sur une autre intervention au palier de deux, vérifie si les valeurs et la qualité de la couleur compensent le risque de parler à ce palier.',['force-intervention','qualite-couleur','palier-disponible']);
  if(balancing&&axis==='force'&&ans==='Contre'&&c==='Passe'&&q.h>=8&&length(b0[1])===1&&s.filter(n=>n===4).length===3&&/Contre de réveil/i.test(x)&&/tricolore|quatre cartes dans chacune/i.test(x)&&/7\s*[–-]\s*8\s*H/.test(x))
   return p6('balancing-tricolor-lower-threshold','Sur une autre main tricolore en réveil, vérifie la courte adverse et le seuil du Contre de réveil, distinct de celui du Contre direct.',['position-reveil','distribution-contre','zone-force']);
  if(balancing&&axis==='force'&&ans==='Passe'&&q.h<=4&&Math.max(...s)<=4&&['Contre','1SA'].includes(c)&&/sans force ni longue exploitable/i.test(x))
   return p6('balancing-no-force-no-suit','Sur une autre main en quatrième position, cherche les ressources réelles de force et de distribution avant de décider si un réveil est raisonnable.',['position-reveil','force-reveil']);
  if(balancing&&ans==='2'+as&&as&&isM(as)&&length(as)===6&&hl>=11&&hl<=13&&/11\s*[–-]\s*13\s*HL/.test(x)&&/saut constructif/i.test(x)&&((axis==='force'&&c==='Passe')||(axis==='distribution'&&c==='1SA')))
   return p6('balancing-constructive-jump','Sur une autre main en réveil avec une belle sixième, situe les HL et distingue le saut constructif du réveil économique ou du Sans-Atout régulier.',['zone-reveil-naturel','longueur-couleur','palier-disponible']);
  // Controls and Blackwood: verify actual control cards/keys before any prompt.
  if(concept==='chelem.controles'&&rr.length===3&&p1&&isM(b0[1])&&rr[1].startsWith('Vous : 3'+b0[1])&&/contrôle/i.test(rr[2])&&ans[0]==='4'&&as&&as!==b0[1]&&control(as)&&['priorite','contexte','niveau'].includes(axis)&&rankBid(c)>rankBid(ans)&&/montre économiquement|sauterait une information|contrôle de deuxième tour|contrôle de premier tour/i.test(x))
   return p6('slam-economical-control-not-jump','Sur une autre main fittée, identifie les contrôles d’honneur et de courte puis vérifie quelle information peut encore être donnée économiquement avant de conclure ou d’interroger.',['controle-couleur','ordre-controles']);
  if(concept==='chelem.controles'&&rr.length===3&&p1&&/contrôle/i.test(rr[2])&&ans[0]==='4'&&as&&as!==b0[1]&&control(as)&&axis==='convention'&&cs&&rankBid(c)<rankBid(ans)&&!control(cs)&&/n[’']est pas un contrôle|ne constitue pas.*contrôle|non contrôlé/i.test(x))
   return p6('slam-jack-not-control','Sur une autre recherche de chelem, distingue un honneur qui ne contrôle pas les deux premiers tours d’une vraie courte ou d’un As/Roi de contrôle.',['controle-couleur','ordre-controles']);
  const agreed=rr[0]?.match(/atout (Cœur|Pique|Carreau|Trèfle)/i)?.[1]?.toLowerCase();
  const at=({cœur:'♥',pique:'♠',carreau:'♦',trèfle:'♣'})[agreed];
  const keys=at?q.hand.filter(z=>z.includes('A')).length+Number(q.hand[suits.indexOf(at)].includes('R')):null;
  if(concept==='chelem.blackwood.suite'&&rr.length===2&&ownFirst&&b0==='4SA'&&/Blackwood/i.test(rr[0])&&b1==='5♦'&&/une ou quatre|1 ou 4/i.test(rr[1])&&at==='♠'&&ans==='5♥'&&keys>=3&&!q.hand[0].includes('D')&&/Dame de Pique|cette Dame/i.test(x)&&/interroge|demande/i.test(x)&&((axis==='niveau'&&c==='6♠')||(axis==='contexte'&&c==='5♠')||(['priorite','convention'].includes(axis)&&c==='5SA')))
   return p6('blackwood-spade-queen-ask','Sur une autre réponse ambiguë au Blackwood, élimine d’abord le nombre de clés impossible, puis vérifie si la Dame d’atout reste inconnue et quelle enchère permet de la demander sans dépasser l’arrêt.',['blackwood-cles','blackwood-dame','palier-arret']);
  if(concept==='chelem.blackwood.suite'&&rr.length===2&&ownFirst&&b0==='4SA'&&at==='♥'&&b1==='5♦'&&keys===3&&ans==='5♥'&&c==='5♠'&&axis==='convention'&&/il en manque une|manque une clé/i.test(x)&&/question à la Dame/i.test(x))
   return p6('blackwood-heart-queen-ask-too-high','Sur une autre réponse au Blackwood avec une clé manquante, vérifie si la question à la Dame permet encore de s’arrêter à cinq dans l’atout agréé.',['blackwood-dame','palier-arret','blackwood-cles']);
  if(concept==='chelem.blackwood.suite'&&rr.length===2&&ownFirst&&b0==='4SA'&&b1==='5♠'&&at&&keys===3&&ans==='6'+at&&c==='7'+at&&axis==='niveau'&&/deux clés/i.test(rr[1])&&/Dame/i.test(rr[1])&&/petit chelem envisagé|petit chelem/i.test(x)&&/grand chelem/i.test(x))
   return p6('blackwood-five-keys-not-grand-proof','Sur une autre réponse réunissant les cinq clés et la Dame d’atout, distingue la sécurité des clés de la preuve des treize levées nécessaire pour explorer un grand chelem.',['blackwood-cles','objectif-chelem','levées']);
  // Rubensohl and Stayman, include diamonds interference when both majors can be searched.
  const rStay=/^rubensohl\./.test(concept)&&rr.length===3&&ownFirst&&b0==='1SA'&&/^Adversaire : 2[♦♥♠]/.test(rr[1])&&/Texas impossible.*Stayman/i.test(rr[2]);
  if(rStay&&b1==='2♦'&&isM(as)&&ans==='3'+as&&length(as)>=4&&axis==='convention'&&c==='3♦'&&/majeure.*prioritaire|majeure.*quatrième|quatre (?:Cœurs|Piques)/i.test(x)&&/Stayman/i.test(x))
   return p6('rubensohl-diamond-interference-major','Sur une autre réponse au Texas impossible après intervention à 2♦, vérifie les majeures quatrièmes avant de préciser la tenue dans la couleur adverse.',['rubensohl-stayman','majeure-quatrieme','arret-adverse']);
  if(rStay&&b1==='2♦'&&Math.max(s[0],s[1])<4&&ans==='3SA'&&c==='3♦'&&axis==='convention'&&/tenue.*Carreau|arrêt.*Carreau/i.test(x)&&/majeure quatrième/i.test(x))
   return p6('rubensohl-diamond-no-major-stop','Sur une autre réponse au Texas impossible sur 2♦, vérifie qu’aucune majeure quatrième n’est disponible avant de choisir Sans-Atout avec arrêt.',['rubensohl-stayman','arret-adverse']);
  if(rStay&&isM(b1?.[1])&&length(other(b1[1]))<4&&axis==='distribution'&&c==='3'+other(b1[1])&&['3SA','3'+b1[1]].includes(ans)&&/trois Piques|trois Cœurs|ni quatre/i.test(x)&&/arrêt|tenue/i.test(x))
   return p6('rubensohl-no-invented-major','Sur une autre réponse au Texas impossible, compte la majeure recherchée plutôt que celle de l’adversaire et distingue la réponse avec arrêt de celle qui signale son absence.',['rubensohl-stayman','majeure-quatrieme','arret-adverse']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&/Landy/i.test(rr[1])&&ans==='2♦'&&s[2]>=6&&q.h<=7&&/naturelle et non forcing/i.test(x)&&/contrat partiel/i.test(x)&&((axis==='priorite'&&c==='Passe')||(axis==='contexte'&&c==='Contre')))
   return p6('rubensohl-after-landy-natural-diamonds','Sur une autre intervention par Landy sur 1SA, repère les couleurs adverses et vérifie si la mineure longue peut encore être annoncée naturellement pour jouer une partielle.',['landy-adverse','rubensohl-palier','objectif-partielle']);
  if(/^rubensohl\./.test(concept)&&rr.length===2&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&/Landy/i.test(rr[1])&&/^2[♥♠]$/.test(ans)&&c==='3SA'&&axis==='contexte'&&/cue.bid de tenue/i.test(x)&&/vérifier la tenue/i.test(x))
   return p6('rubensohl-landy-check-both-stops','Sur une autre main avec espoir de manche face à une intervention montrant deux couleurs, distingue l’arrêt déjà détenu de celui que le partenaire doit encore vérifier avant 3SA.',['arret-adverse','cue-bid','landy-adverse']);
  if(concept==='sa1.stayman.suite'&&rr.length===3&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&b2==='2♦'&&reg&&Math.max(s[0],s[1])===4&&ans==='3SA'&&c==='2SA'&&q.h>=10&&axis==='niveau'&&/nie quatre|pas de fit|sans fit/i.test(x)&&/conclu|manche/i.test(x))
   return p6('stayman-negative-game-not-invite','Sur une autre réponse négative au Stayman, additionne les valeurs minimales du camp pour distinguer une invitation de la conclusion à la manche.',['stayman-reponse-negative','objectif-manche']);
  if(concept==='sa1.stayman.suite'&&rr.length===3&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&b2==='2SA'&&axis==='convention'&&((ans==='3♣'&&c==='3♦'&&s[1]===4&&s[0]<4)||(ans==='3♦'&&c==='3♣'&&s[0]===4&&s[1]<4))&&q.h>=8&&q.h<=9&&/relais invitant/i.test(x))
   return p6('stayman-both-majors-invite-code','Sur une autre réponse 2SA au Stayman montrant les deux majeures, vérifie le fit recherché et le code du relais invitant par opposition au transfert de manche.',['stayman-deux-majeures','objectif-invitation','code-relais']);
  if(concept==='sa1.stayman.suite'&&rr.length===3&&partnerFirst&&b0==='1SA'&&b1==='2♣'&&b2==='2SA'&&q.h>=10&&((ans==='4♣'&&s[1]===4&&s[0]<4&&/transfère vers 4♥|transfert.*4♥/i.test(x))||(ans==='4♦'&&s[0]===4&&s[1]<4&&/transfère vers 4♠|transfert.*4♠/i.test(x)))&&/main forte|ouvreur déclarant/i.test(x)&&((axis==='contexte'&&c==='4'+(ans==='4♣'?'♥':'♠'))||(axis==='convention'&&c==='3'+(ans==='4♣'?'♥':'♠'))))
   return p6('stayman-both-majors-game-transfer','Sur une autre réponse montrant les deux majeures, distingue le transfert qui fait jouer la manche par la main forte de l’enchère naturelle ou d’une exploration de chelem.',['stayman-deux-majeures','transfert-manche','main-declarant']);
  if(concept==='barrage.reponse'&&rr.length===1&&partnerFirst&&/^2[♥♠]$/.test(b0||'')&&ans==='4'+b0[1]&&length(b0[1])>=4&&q.h<=9&&/prolonge le barrage|prolongation du barrage/i.test(x)&&((axis==='contexte'&&c==='Passe')||(axis==='convention'&&c==='2SA')))
   return p6('weak-two-raise-objective','Sur une autre main fittée face au deux faible, distingue les enchères destinées à gêner les adversaires de celles qui demandent des précisions pour réaliser une manche.',['fit-barrage','objectif-barrage','relais-constructif']);
  if(concept==='barrage.reponse'&&rr.length===1&&partnerFirst&&/^2[♥♠]$/.test(b0||'')&&ans==='4'+b0[1]&&length(b0[1])>=4&&q.h>=14&&axis==='distribution'&&cs&&cs!==b0[1]&&length(cs)<5&&/vise la réalisation de la manche|conclure à 4/i.test(x))
   return p6('weak-two-strong-fit-game','Sur une autre réponse forte à un barrage, compte les atouts et les honneurs utiles puis distingue la manche envisagée pour la réaliser d’une simple prolongation de barrage.',['fit-barrage','objectif-manche','force']);
  if(concept==='barrage.reponse'&&rr.length===1&&partnerFirst&&/^3[♥♠]$/.test(b0||'')&&ans[0]==='4'&&as&&as!==b0[1]&&length(b0[1])>=3&&control(as)&&c==='4'+b0[1]&&axis==='priorite'&&/contrôle agréant le fit/i.test(x)&&/explorer le chelem/i.test(x))
   return p6('three-level-preempt-control','Sur une autre réponse forte à une ouverture de barrage au palier de trois, distingue le contrôle de chelem agréant le fit de la simple conclusion à la manche.',['controle-couleur','fit-barrage','objectif-chelem']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&/^Adversaire : 1[♥♠]$/.test(a[3])&&/^Partenaire : 1[♥♠]$/.test(a[2])&&ans==='1SA'&&reg&&q.h>=12&&q.h<=14&&length(a[2].slice(-1))===3&&/redemande.*libre/i.test(x)&&/tenue|arrête/i.test(x)&&((axis==='distribution'&&cs===b0[1]&&length(cs)<=4)||(axis==='force'&&c==='2SA')))
   return p6('competitive-free-nt-range-stop','Sur une autre redemande libre après intervention du quatrième joueur, contrôle la force, la régularité et la tenue adverse avant de choisir 1SA plutôt qu’un saut ou une répétition de couleur.',['redemande-libre','zone-redemande-sa','arret-adverse']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&/^Adversaire : 1[♥♠]$/.test(a[3])&&/^Partenaire : 1[♥♠]$/.test(a[2])&&ans==='2'+b0[1]&&length(b0[1])>=6&&axis==='fit'&&c==='2'+a[2].slice(-1)&&length(a[2].slice(-1))<4&&/répéter librement|couleur sixième/i.test(x))
   return p6('competitive-free-repeat-no-fit','Sur une autre redemande libre, compare la couleur ouverte réellement sixième et le nombre d’atouts dans la majeure du répondant avant de soutenir.',['redemande-libre','longueur-redemande','fit-ouvreur']);
  if(concept==='red.competitif'&&a.length===4&&ownFirst&&/^Adversaire : 1[♥♠]$/.test(a[3])&&ans==='2SA'&&reg&&q.h>=18&&q.h<=19&&axis==='force'&&c==='Passe'&&/troisième zone/i.test(x)&&/redemande libre/i.test(x)&&/double arrêt|deux arrêts/i.test(x))
   return p6('competitive-free-strong-nt','Sur une autre redemande libre avec une main régulière forte, vérifie la zone de 2SA et la qualité de la tenue adverse avant de renoncer à décrire cette force.',['redemande-libre','zone-redemande-sa','arret-adverse']);

  return null;
 }

 function rowFor(q){const row=q&&own(data?.rows,q.id)?data.rows[q.id]:null;return row&&row[0]===fingerprint(q)?row:null;}
 function option(row,c){return row&&row[3].find(v=>v[0]===c);}
 function match(d,q,c,v){return !!v&&!!d&&d.status==='hypothesis'&&d.category===v[1]&&d.confidence===v[2]&&['high','medium'].includes(d.confidence)&&own(labels,d.category)&&d.evidence?.id===q.id&&d.evidence?.choice===c&&d.evidence?.expected===q.answer&&d.evidence?.offered===true&&(!d.evidence.concept||d.evidence.concept===rowFor(q)?.[1])&&d.evidence?.rule===v[3]&&typeof d.reason==='string'&&digest(d.reason)===v[5];}
 function repeat(history,row,c,axis,id){
  const live=history&&Array.isArray(history.journal)&&Number.isInteger(history.completed);
  const exp=history?.format==='QPJB_PROGRESS_EXPORT_1'&&Array.isArray(history.sessions)&&Number.isInteger(history.summary?.completedSessions);
  if(!live&&!exp)return null;
  const events=live?history.journal:history.sessions,completed=live?history.completed:history.summary.completedSessions;
  if(completed<1)return null;
  const fam=new Set(),sess=new Set();let exact=false;
  for(const e of events){if(e?.mode!=='parcours'||!Number.isInteger(e.session)||e.session<Math.max(1,completed-5)||e.session>completed||!Array.isArray(e.answers))continue;
   for(const a of e.answers){if(!a||typeof a.assisted!=='boolean'||a.hadFreeError===true||a.result!=='wrong'||!bid(a.choice))continue;
    const r=own(data?.rows,a.id)?data.rows[a.id]:null,v=option(r,a.choice);
    if(!r||!v||!['high','medium'].includes(v[2])||v[1]!==axis||(a.assisted===true&&v[6]!==true)||!r[2]||(a.family&&a.family!==r[2]))continue;
    if(a.id===id&&a.choice===c)exact=true;
    if(r[2]!==row[2]){fam.add(r[2]);sess.add(e.session);}
   }
  }
  if(fam.size>=2&&sess.size>=2)return 'Deux choix antérieurs sur des familles distinctes relevaient aussi de cette catégorie : '+labels[axis]+'. Cela ne prouve pas une cause identique.';
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
  if(!match(d,q,c,v)||(!corrected&&a.assisted===true&&v[6]!==true))return fallback;
  const r=contextual(q,c,d.category)||transfer(q,c,d,row[1]);
  // Preserve the actual historical targeted feedback; do not broaden signed text to another option.
  const old=v[4],selected=old?{id:'legacy',feedback:old[0],checkNext:old[1],criteria:[d.category]}:r;
  if(!selected)return corrected?fallback:{...out,kind:'canonical-only'};
  const mentioned=q.explain.includes(c); // préférer le réinvestissement lorsque le choix est déjà cité
  const feedback=old?selected.feedback:mentioned||['opening-minor-comparison','blackwood-count-keys'].includes(selected.id)?null:selected.feedback;
  return {...out,kind:corrected?'corrected-targeted':'targeted',feedback:feedback?(corrected?'Sur ta première enchère : '+feedback:feedback):null,reminder:repeat(input.history,row,c,d.category,q.id),checkNext:selected.checkNext,targetConcept:row[1],targetCriteria:selected.criteria.slice()};
 }
 return Object.freeze({schema,explain,contextual,transfer,explicit,valid,fingerprint,digest});
});

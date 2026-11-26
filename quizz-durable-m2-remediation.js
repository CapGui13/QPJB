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

/* M1 #419/#420 — curriculum V1, composition facultative avant l'ordre historique.
 * Aucune modification du catalogue, des prérequis, de la maîtrise ou des rappels.
 * Les fenêtres sont des intentions d'enseignement, jamais des dates de déblocage.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.QPJBCoherenceCurriculum=api;})(typeof window==='undefined'?null:window,function(){
'use strict';
const schema='QPJB_COHERENCE_M1_V1';
const rows=[
['Ouvrir ou passer','ouv.passe ouv.mineure ouv.majeure ouv.sa1','',1,2,10],
['Répondre naturellement et reconnaître le premier fit','mineur.base majeur.base majeur.soutien','ouv.passe ouv.mineure',2,3,7],
['Reconnaître le fit majeur et le distinguer de son absence','majeur.soutien majeur.base','mineur.base ouv.sa2 ouv.mineure ouv.passe',3,5,4],
['Évaluer les chances de manche sur 1SA','sa1.seuil','majeur.soutien mineur.base ouv.sa1',4,6,4],
['Comprendre la redemande naturelle de l’ouvreur','red.base','sa1.seuil majeur.base mineur.base sa1.stayman sa1.texas',5,8,4],
['Décrire une deuxième couleur ou une main régulière','red.base red.bicolore','mineur.base majeur.base sa1.seuil',6,9,3],
['Choisir le contrat après une redemande simple','second.base','red.base sa2.seuil majeur.soutien',7,10,3],
['Rechercher une majeure sur 1SA','sa1.stayman sa1.stayman.reponse sa1.texas','sa1.seuil red.base',8,11,3],
['Réévaluer la main après un fit majeur','apres_fit.base majeur.soutien','fit.2sa sa1.seuil second.base',9,12,3],
['Poursuivre les enchères naturelles et les recherches de fit','sa1.stayman.suite sa1.texas.suite','sa1.stayman sa1.texas second.base',10,14,3],
['Intervenir naturellement','intervenir.base','ouv.majeure ouv.mineure red.base',11,15,3],
['Choisir entre intervention et abstention','intervenir.base','ouv.passe reponse_inter.base apres_fit.base',12,16,3],
['Comprendre le contre et la réponse naturelle','contre.base','intervenir.base majeur.base',13,17,3],
['Répondre à une intervention du partenaire','reponse_inter.base','intervenir.base majeur.soutien',14,18,3],
['Adapter la réponse à une intervention adverse','apres_inter.base','mineur.base majeur.base contre.base',15,19,3],
['Choisir un soutien compétitif','competitif.2sa_fitte apres_inter.base','majeur.soutien fit.2sa',16,20,3],
['Distinguer soutiens naturels et compétitifs','competitif.truscott contre.base','apres_inter.base majeur.soutien',17,21,3],
['Comprendre les ouvertures de barrage','barrage.ouverture','ouv.passe ouv.majeure intervenir.base',18,22,3],
['Répondre aux barrages et intervenir sur deux faible','barrage.reponse intervenir.deux_faible','barrage.ouverture contre.base',19,23,3],
['Décider en réveil','reveil.base','intervenir.base ouv.passe contre.base',20,24,3],
['Réinvestir les enchères naturelles en compétition','apres_inter.base reponse_inter.base','mineur.base majeur.base majeur.soutien',21,25,2],
['Comparer intervention directe et réveil','reveil.base intervenir.base','contre.base barrage.ouverture',22,26,2],
['Comprendre quand rechercher un fit 5–3 avec Roudi','roudi.init roudi.choix','red.base second.base majeur.soutien',23,27,2],
['Choisir entre Roudi et une suite naturelle','roudi.choix roudi.init','second.base red.base',23,28,2],
['Reconnaître le contexte du Drury','drury.init drury.choix','ouv.position majeur.soutien',25,29,2],
['Répondre au Roudi','roudi.reponse roudi.choix','roudi.init red.base',25,30,2],
['Distinguer une ouverture forte et une ouverture naturelle','fortes.ouverture','ouv.sa2 ouv.majeure ouv.mineure',27,31,2],
['Répondre à une ouverture forte','fortes.relais','fortes.ouverture ouv.sa2',28,32,2],
['Comprendre les enchères forcing','forcing.base forcing.troisieme forcing.quatrieme','red.base second.base red.bicolore',29,35,2],
['Décrire une main après un relais fort','fortes.redemande','fortes.relais fortes.ouverture',30,35,2],
['Exploiter les développements du Roudi','roudi.suite roudi.reponse','roudi.init second.base',31,37,2],
['Replacer le Drury dans une séquence complète','drury.reponse drury.suite','drury.init majeur.soutien ouv.position',27,37,2],
['Distinguer les interventions sur 1SA','multilandy.choix multilandy.intervention','intervenir.base contre.base',33,38,2],
['Distinguer recherche de fit et forcing','forcing.checkback forcing.quatrieme','red.base second.base roudi.choix',34,39,2],
['Répondre après intervention sur 1SA','rubensohl.naturel rubensohl.init','apres_inter.base sa1.seuil sa1.texas',35,40,2],
['Répondre à Multi-Landy','multilandy.reponse multilandy.intervention','multilandy.choix intervenir.base',35,41,2],
['Reconnaître un bicolore d’intervention','michaels.choix michaels.intervention','intervenir.base red.bicolore',37,42,2],
['Poursuivre après Rubensohl','rubensohl.reponse rubensohl.init','rubensohl.naturel sa1.texas',37,43,2],
['Répondre à une intervention Michaëls','michaels.reponse michaels.choix','michaels.intervention reponse_inter.base',39,44,2],
['Distinguer les démarches vers le chelem','chelem.controles chelem.quantitatif','apres_fit.base sa1.seuil sa2.seuil',40,45,2],
['Comprendre les conditions du Blackwood','chelem.blackwood.declenchement chelem.cles','chelem.controles majeur.soutien',41,47,2],
['Distinguer recherche de fit et recherche de chelem','chelem.splinter chelem.controles','apres_fit.essai fit.2sa',40,47,2],
['Adapter les bicolores au contexte compétitif','michaels.reveil michaels.defense','michaels.choix reveil.base',43,49,2],
['Interpréter les suites du Blackwood','chelem.blackwood.suite chelem.blackwood.dame_rois','chelem.cles chelem.controles',44,51,2],
['Distinguer splinter et autres enchères de fit','chelem.splinter.variante chelem.splinter','fit.2sa apres_fit.essai',45,52,2],
['Réinvestir les réponses après intervention','apres_inter.base competitif.spoutnik','contre.base mineur.base',15,50,2],
['Poursuivre une intervention sur Sans-Atout','intervenir.sa.suite multilandy.suite','intervenir.base multilandy.reponse',37,52,2],
['Comparer les suites naturelles à Sans-Atout','sa2.stayman.suite sa2.texas.suite','sa2.seuil sa1.seuil',13,53,2],
['Distinguer les Texas majeurs et mineurs','sa1.texas_mineur sa1.texas_mineur.suite','sa1.texas sa1.texas_mineur.reponse',13,54,2],
['Réinvestir les séquences de barrage','barrage.suite contre.deux_faible reveil.deux_faible','barrage.ouverture barrage.reponse',21,55,2],
['Choisir le niveau après fit','apres_fit.essai apres_fit.essai.suite fit.2sa.suite','majeur.soutien apres_fit.base',11,56,2],
['Réexaminer les bicolores de l’ouvreur','red.bicolore_cher second.bicolore_cher','red.bicolore red.base second.base',17,57,2],
['Choisir une suite forcing adaptée','forcing.troisieme.suite forcing.quatrieme.suite','forcing.troisieme forcing.quatrieme',31,58,2],
['Réagir à un contre sur une convention SA','sa1.stayman.contre sa1.texas.contre','sa1.stayman sa1.texas',19,59,2],
['Poursuivre après 2SA','sa2.stayman.reponse sa2.texas.reponse','sa2.stayman sa2.texas sa2.seuil',11,60,2],
['Comparer les ouvertures fortes et leurs suites','fortes.suite fortes.redemande','fortes.ouverture fortes.relais',32,61,2],
['Réinvestir les enchères de chelem','chelem.quantitatif.suite chelem.blackwood.suite','chelem.quantitatif chelem.cles',44,62,2],
['Discriminer les outils compétitifs','rubensohl.suite michaels.defense','rubensohl.init michaels.choix',43,63,2],
['Revenir sur les mains irrégulières et exceptions','ouv.bicolore.exception sa2.bicolore sa.gambling','ouv.mineure ouv.sa1 red.bicolore',31,64,2],
['Distinguer les réponses naturelles en compétition','red.competitif competitif.sa_adverse','red.base apres_inter.base',21,65,2],
['Réinvestir la réponse et la redemande naturelles','mineur.base majeur.base red.base','ouv.passe ouv.mineure second.base',2,65,2],
['Choisir entre manche, partielle et essai','sa1.seuil apres_fit.base apres_fit.essai','majeur.soutien sa2.seuil',9,65,2],
['Réunir les connaissances compétitives','intervenir.base contre.base reponse_inter.base','reveil.base apres_inter.base',14,65,2],
['Réinvestir les suites après 2SA','sa2.texas_mineur.reponse sa2.stayman.suite','sa2.texas sa2.seuil',23,65,2],
['Consolider la décision dans une séquence complète','second.base red.base majeur.soutien','sa1.seuil mineur.base ouv.passe',7,65,2]
];
const split=s=>s?s.split(' '):[];
const map=Object.freeze(rows.map(([title,p,s,from,to,target],i)=>Object.freeze({session:i+1,title,primary:Object.freeze(split(p)),secondary:Object.freeze(split(s)),window:Object.freeze([from,to]),target})));
const meta=(m,id)=>m instanceof Map?m.get(id):m?.[id];
const clean=a=>a.result==='correct'&&!a.assisted&&!a.hadFreeError;
const question=x=>x?.exercise||x;
const foundation=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
const normalize=q=>String(q?.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
function status(ctx,keys){
 const wanted=new Set(keys),out={};
 for(const c of wanted)out[c]={last:null,autonomousFamilies:0,autonomousSessions:0,exposures:0};
 const fam={},ses={};
 for(const row of ctx.history?.journal||[]){
  if(row.mode!=='parcours'||!Number.isInteger(row.session)||row.session<1||row.session>=ctx.session)continue;
  for(const a of row.answers||[]){
   const c=meta(ctx.metadataById,a.id)?.concept;if(!wanted.has(c))continue;
   const o=out[c];o.last=Math.max(o.last||0,row.session);o.exposures++;
   if(clean(a)&&a.family){(fam[c]??=new Set()).add(a.family);(ses[c]??=new Set()).add(row.session);}
  }
 }
 for(const c of wanted){out[c].autonomousFamilies=fam[c]?.size||0;out[c].autonomousSessions=ses[c]?.size||0;}
 return out;
}
function plan(ctx={}){
 const row=map[ctx.session-1];if(!row||!Number.isInteger(ctx.session))return null;
 const keys=[...new Set([...row.primary,...row.secondary,...foundation])];
 const stats=status(ctx,keys);
 const candidates=(ctx.candidates||[]).map(question).filter(q=>q&&meta(ctx.metadataById,q.id));
 const available=[...new Set(candidates.map(q=>meta(ctx.metadataById,q.id).concept))];
 const active=row.primary.filter(c=>available.includes(c));
 const prereq={};
 for(const c of row.primary){const variants=candidates.filter(q=>meta(ctx.metadataById,q.id).concept===c);prereq[c]=variants.map(q=>({id:q.id,requires:meta(ctx.metadataById,q.id).requires||[]}));}
 const overdue=foundation.filter(c=>stats[c].last!==null&&ctx.session-stats[c].last>=6);
 return {session:row.session,objective:row.title,primary:row.primary.slice(),secondary:row.secondary.slice(),targetConcepts:active,window:row.window.slice(),roles:{focus:row.primary.slice(),reinforcement:row.secondary.slice(),necessaryRecall:overdue},softQuotas:{focus:row.target,necessaryRecall:'priorité historique',discrimination:'si éligible et utile',reinvestment:'conditionnel'},prerequisites:prereq,evidence:stats,justification:'Objectif indicatif ; la preuve et l’éligibilité restent celles du moteur.',fallback:active.length?'Conserver rappel explicite, quotas et priorités historiques ; objectif non obligatoire.':'Aucun candidat cible dans cette strate : sélection historique.'};
}
function role(ctx,q){const row=map[ctx.session-1],c=meta(ctx.metadataById,q.id)?.concept;if(!row)return 'entretien-historique';if(row.primary.includes(c))return 'objectif';if(row.secondary.includes(c))return 'rappel-ou-lien';if(foundation.includes(c))return 'entretien-fondamental';return 'adaptation-ou-diversite';}
// A soft focus slot acts only within the historical, already filtered
// discovery bucket. No new eligibility, no priority or due recall bypass.
// Empty subsets always return the original candidates (including object identity).
function prefer(ctx={}){
 const row=map[ctx.session-1],s=ctx.session,list=ctx.candidates||[];
 if(!row||!Number.isInteger(s)||s<3||ctx.history?.active||ctx.priority||ctx.forcedReason||ctx.category!=='discovery')return list;
 const chosen=(ctx.selected||[]).map(question),concept=q=>meta(ctx.metadataById,q.id)?.concept;
 const focus=chosen.filter(q=>row.primary.includes(concept(q)));
 const target=s<=5?row.target:1;
 if(focus.length>=target)return list;
 // Preserve the first 2SA opening as a parallel early discovery; one
 // additional 2SA exercise is not itself a reason to displace fit practice.
 if(s===3&&!chosen.some(q=>concept(q)==='ouv.sa2')&&list.some(q=>concept(q)==='ouv.sa2'))return list;
 const eligible=list.filter(q=>row.primary.includes(concept(q))&&q.difficulty<=3&&meta(ctx.metadataById,q.id)?.stage<=1);
 if(!eligible.length)return list;
 if(s===3){
  const supports=focus.filter(q=>concept(q)==='majeur.soutien').length;
  const natural=focus.filter(q=>concept(q)==='majeur.base').length;
  const preferred=eligible.filter(q=>concept(q)===(supports<2?'majeur.soutien':natural<1?'majeur.base':concept(q)));
  if(preferred.length)return preferred;
 }
 if(s===4){
  const uncovered=eligible.filter(q=>!focus.some(v=>normalize(v)===normalize(q)));
  if(uncovered.length)return uncovered;
 }
 return eligible;
}
function rank(ctx={}){
 const s=ctx.session,row=map[s-1];
 // S1/S2 immuables. Après S65 aucun changement direct. Les rappels
 // et toutes les sélections prioritaires restent exactement au moteur.
 if(!row||!Number.isInteger(s)||s<3||ctx.history?.active||ctx.priority||ctx.forcedReason||ctx.category!=='discovery')return [];
 const selected=(ctx.selected||[]).map(question),concept=q=>meta(ctx.metadataById,q.id)?.concept;
 const focus=selected.filter(q=>row.primary.includes(concept(q))),count=focus.length;
 const list=(ctx.candidates||[]).filter(q=>q&&typeof q.id==='string'&&meta(ctx.metadataById,q.id));
 // Les conventions et variantes avancées restent admises mais ne deviennent
 // pas la solution artificielle à un quota. Aucune pénalité hors S3–5.
 const limit=s<=5?100:60,seen=new Set(),out=[];
 for(const q of list){
  if(seen.has(q.id))continue;seen.add(q.id);
  const c=concept(q),m=meta(ctx.metadataById,q.id),a=normalize(q);let delta=0,reason='';
  if(count<row.target&&row.primary.includes(c)&&q.difficulty<=3&&m.stage<=1){
   delta=limit;reason='objectif-principal-non-couvert';
   if(s===3&&c==='majeur.base'&&focus.filter(v=>concept(v)==='majeur.base').length>=1&&focus.filter(v=>concept(v)==='majeur.soutien').length<2)delta=25;
   if(s===4&&focus.some(v=>normalize(v)===a))delta=45;
   if(s===5&&focus.some(v=>normalize(v)===a))delta=60;
  }else if(count>=row.target&&row.primary.includes(c)){delta=-30;reason='objectif-deja-represente';}
  else if(s===3&&c==='ouv.sa2'&&selected.some(v=>concept(v)===c)){delta=-65;reason='une-decouverte-2SA-suffit-dans-cette-strate';}
  else if(s===4&&q.theme==='ouv'&&selected.filter(v=>v.theme==='ouv').length>=2){delta=-65;reason='ouvertures-deja-representees';}
  else if(s===5&&['sa1.stayman','sa1.texas'].includes(c)&&selected.some(v=>['sa1.stayman','sa1.texas'].includes(concept(v)))&&count<row.target){delta=-65;reason='limiter-dispersion-des-nouvelles-conventions';}
  if(delta)out.push({id:q.id,delta,reason});
 }
 return out;
}
return Object.freeze({schema,curriculum:map,plan,rank,role,prefer});
});

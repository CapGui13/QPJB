'use strict';
/* QPJB AD — editorial comprehension probes for standalone lessons.
 * These are NOT Quiz SEF QCM, do not modify catalog, and NEVER auto-score.
 * Teacher-only expected indicators are anchored in the actual AB/AC lessons.
 */
const AB=require('./parcours-v2-lecons-ab.cjs');
const F=require('./parcours-v2-pilot.cjs');
const POLICY=Object.freeze({
  scope:'STANDALONE_POST_LESSON_COMPREHENSION_DISCUSSION',
  status:'EDITORIAL_DRAFT_TEACHER_REVIEW',
  type:'OPEN_ENDED_REFORMULATION',
  noQcmAdded:true,
  noAutomatedCorrection:true,
  scored:false,
  answersPersisted:false,
  readinessInferred:false,
  publicRuntimeWired:false,
  sourceExercisesUnchanged:true,
  studentValidationDone:false,
  teacherApprovalRequired:true
});
const PROMPTS=Object.freeze([
  {
    id:'AD-R01',lesson:'rubensohl',skill:'Distinguer deux sens conventionnels selon le contexte',
    prompt:'Deux séquences commencent par une ouverture de 1SA, et un joueur annonce ensuite 3♣. Explique pourquoi le sens de 3♣ ne peut pas être déduit de son seul symbole.',
    teacherIndicators:[
      'Dans la situation avec 2♣ Landy adverse, 3♣ du répondant est présenté comme un Texas pour les Carreaux.',
      'Dans la situation avec intervention naturelle à 2♦, 3♣ du répondant est présenté comme Stayman forcing de manche.',
      'La nature de l’intervention et l’accord de la paire expliquent cette différence.'
    ],
    anchors:['3♣ du répondant est un Texas pour les Carreaux',
      '3♣ est explicitement défini comme un Stayman forcing de manche',
      'On ne déduit pas le sens d’une enchère de son seul symbole'],
    misunderstanding:'Affirmer que 3♣ annonce nécessairement des Trèfles ou toujours la même convention.',
    sources:['SEF-V486-022','SEF-V481-009']
  },
  {
    id:'AD-R02',lesson:'rubensohl',skill:'Lire une intervention artificielle adverse',
    prompt:'Dans le contexte présenté, après 1SA, l’adversaire intervient à 2♣ Landy. Que savons-nous de ses couleurs et pourquoi ce 2♣ ne se lit-il pas comme un 2♣ naturel ?',
    teacherIndicators:[
      'Le Landy 2♣ adverse montre les deux majeures, Cœurs et Piques.',
      'L’enchère est artificielle : le symbole ♣ ne promet pas des Trèfles dans cet accord.'
    ],
    anchors:['2♣ adverse annonce les deux majeures',
      'Naturelle : elle décrit généralement la couleur nommée. Artificielle : son sens dépend d’un accord'],
    misunderstanding:'Croire que 2♣ Landy garantit des Trèfles.',
    sources:['SEF-V486-022']
  },
  {
    id:'AD-R03',lesson:'rubensohl',skill:'Méthode de décodage d’une séquence',
    prompt:'Avant d’interpréter une enchère artificielle après 1SA et une intervention adverse, quelles informations cherches-tu, dans quel ordre ?',
    teacherIndicators:[
      'Identifier le joueur qui a ouvert de 1SA et les joueurs successivement à la parole.',
      'Reconnaître si l’intervention adverse est naturelle ou artificielle.',
      'Vérifier le sens convenu de l’enchère dans cette séquence, sans l’inventer.'
    ],
    anchors:['Lis successivement l’ouverture, la nature de l’intervention, l’identité du joueur qui parle',
      'les développements n’ont pas nécessairement le même sens'],
    misunderstanding:'Attribuer un sens universel à 3♣ sans lire l’intervention ni les rôles.',
    sources:['SEF-V486-022','SEF-V481-009']
  },
  {
    id:'AD-M01',lesson:'michaels',skill:'Comprendre la distribution 5–5',
    prompt:'Explique ce que promet une intervention bicolore « au moins 5–5 ». Combien de cartes, au minimum, sont dans ces deux couleurs réunies ?',
    teacherIndicators:[
      'Au moins cinq cartes dans chacune des deux couleurs.',
      'Au moins dix cartes cumulées dans les deux couleurs promises.'
    ],
    anchors:['Au moins cinq cartes dans chacune des deux couleurs promises, soit dix cartes au minimum'],
    misunderstanding:'Penser que 5–5 signifie cinq cartes au total dans les deux couleurs.',
    sources:['SEF-C2-007','SEF-V45-044']
  },
  {
    id:'AD-M02',lesson:'michaels',skill:'Comparer les couleurs annoncées par deux cue-bids',
    prompt:'Dans les deux situations Michaels précisés présentées, quelles couleurs sont promises par 2♦ après 1♦ adverse, puis par 2♠ après 1♠ adverse ? Explique la différence.',
    teacherIndicators:[
      'Après 1♦ adverse, 2♦ décrit Piques et Cœurs au moins cinquièmes.',
      'Après 1♠ adverse, 2♠ décrit Cœurs et Trèfles au moins cinquièmes.',
      'Ces deux cue-bids ne cherchent pas à jouer dans la couleur d’ouverture adverse.'
    ],
    anchors:['Le cue-bid 2♦ promet ici les deux majeures',
      'Le cue-bid 2♠ promet ici au moins cinq Cœurs et cinq Trèfles',
      'ce n’est pas un soutien de la couleur adverse'],
    misunderstanding:'Présumer que le cue-bid 2♠ promet des Piques dans notre camp.',
    sources:['SEF-C2-007','SEF-V45-044']
  },
  {
    id:'AD-M03',lesson:'michaels',skill:'Ne pas confondre convention et décision compétitive',
    prompt:'Ton partenaire a annoncé un bicolore Michaels et les adversaires enchérissent encore. Pourquoi connaître son bicolore ne suffit-il pas, à lui seul, à décider de surenchérir ?',
    teacherIndicators:[
      'Les couleurs du partenaire sont connues, mais le fit effectif n’est pas automatiquement garanti.',
      'Il faut confronter les longueurs promises par le partenaire à ses propres cartes.',
      'Le palier atteint et la vulnérabilité interviennent dans la décision.'
    ],
    anchors:['il ne crée pas artificiellement un fit',
      'il tient compte du palier, des couleurs garanties et de la vulnérabilité',
      'Une longue couleur personnelle ne prouve pas un fit'],
    misunderstanding:'Croire que l’annonce d’un bicolore garantit un fit ou oblige à surenchérir.',
    sources:['SEF-L04-029']
  }
]);
function validate(lessons=AB.LESSONS,catalog=F.loadCatalog()){
  const source=AB.validate(catalog);
  if(source.lessons!==2||source.sourceQuestions!==5)
    throw Error('AD : provenance AB/AC non conforme');
  const byId=new Map(lessons.map(x=>[x.id,x]));
  if(byId.size!==2||PROMPTS.length!==6)throw Error('AD : 2 leçons, 6 questions ouvertes attendues');
  const seen=new Set(),count={rubensohl:0,michaels:0};
  for(const item of PROMPTS){
    if(seen.has(item.id)||!/^AD-[RM]\d{2}$/.test(item.id)||!byId.has(item.lesson))
      throw Error('AD : item inconnu ou dupliqué : '+item.id);
    seen.add(item.id);count[item.lesson]++;
    if(item.teacherIndicators.length<2||item.anchors.length<1||
       !item.prompt||!item.skill||!item.misunderstanding||
       item.sources.length<1)
      throw Error('AD : tâche de compréhension incomplète : '+item.id);
    const lesson=byId.get(item.lesson),corpus=JSON.stringify(lesson);
    for(const anchor of item.anchors){
      if(!corpus.includes(anchor))
        throw Error('AD : critère pédagogique sans ancrage dans la leçon '+item.id+' : '+anchor);
    }
    for(const src of item.sources)
      if(!lesson.sourceIds.includes(src))
        throw Error('AD : source extérieure à la leçon : '+src);
    if(item.teacherIndicators.some(x=>x===item.prompt))
      throw Error('AD : réponse incluse dans la question : '+item.id);
  }
  if(count.rubensohl!==3||count.michaels!==3)throw Error('AD : répartition 3/3 obligatoire');
  return {schema:'QPJB_AD_COMPREHENSION_EDITORIAL_1',items:6,lessons:2,
    counts:count,sourceQuestions:source.sourceQuestions,
    originalCatalogCount:source.catalogQuestions,
    checkpoints:PROMPTS.reduce((n,x)=>n+x.teacherIndicators.length,0),
    sourceAnchors:PROMPTS.reduce((n,x)=>n+x.anchors.length,0),
    policy:POLICY,reviewNeeded:true};
}
function report(){
  const check=validate();
  return {...check,tasks:PROMPTS,
    procedure:[
      'Lire la mini-leçon correspondant à la convention étudiée.',
      'Masquer le cours et demander une reformulation libre, sans propositions.',
      'Utiliser les repères de discussion seulement après la réponse du joueur.',
      'Noter qualitativement le vocabulaire incompris et les confusions restantes, sans attribuer une note ni un niveau.',
      'Faire relire/clarifier les passages difficiles avant tout essai réel en classe.'
    ],
    notStudentResults:true,
    decisionsNotAutomatic:true
  };
}
module.exports={POLICY,PROMPTS,validate,report};
if(require.main===module)process.stdout.write(JSON.stringify(report(),null,2)+'\n');

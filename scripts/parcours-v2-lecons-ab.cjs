'use strict';
/* QPJB AB — lessons separate from QCM: exact agreements grounded in FIVE
 * original catalog cases. Not a quiz, a live integration, or SEF certification.
 */
const F=require('./parcours-v2-pilot.cjs');
const Y=require('./parcours-v2-transitions-y.cjs');
const EXPECTED=Object.freeze({
  'SEF-V486-022':{theme:'rubensohl',answer:'3♣',auction:'2♣ (Landy',explain:'3♣ est un Texas pour les Carreaux'},
  'SEF-V481-009':{theme:'rubensohl',answer:'3♠',auction:'3♣ (Texas impossible : Stayman forcing de manche)',explain:'3♠ montre quatre cartes'},
  'SEF-C2-007':{theme:'michaels',answer:'2♦',auction:'Adversaire : 1♦',explain:'deux majeures au moins cinquièmes'},
  'SEF-V45-044':{theme:'michaels',answer:'2♠',auction:'Adversaire : 1♠',explain:'cinq Cœurs et cinq Trèfles'},
  'SEF-L04-029':{theme:'michaels',answer:'Passe',auction:'Partenaire : 2♠',explain:'aucun fit d’au moins huit cartes garanti'}
});
const LESSONS=Object.freeze([
  {
    id:'rubensohl',title:'Rubensohl : lire les interventions sur 1SA',
    lead:'Une même enchère peut changer de sens selon la nature de l’intervention adverse. Avant de répondre, décode toute la séquence.',
    aim:'Distinguer les deux situations précises décrites dans les exercices QPJB, sans extrapoler à toutes les défenses après 1SA.',
    level:'Découverte des conventions — joueur connaissant déjà les enchères de base (pas débutant absolu)',
    prerequisites:[
      'Savoir lire une ouverture de 1SA et reconnaître le rôle de son partenaire.',
      'Savoir suivre une séquence où un adversaire intervient après notre ouverture.',
      'Connaître les quatre couleurs ; le sens des enchères artificielles est expliqué ci-dessous.'
    ],
    vocabulary:[
      {term:'Enchère naturelle / artificielle',meaning:'Naturelle : elle décrit généralement la couleur nommée. Artificielle : son sens dépend d’un accord et peut désigner une autre couleur ou poser une question.'},
      {term:'Landy',meaning:'Dans le cas étudié, 2♣ adverse après 1SA annonce les deux majeures (♥ et ♠).'},
      {term:'Texas',meaning:'Transfert conventionnel : on nomme une couleur pour demander au partenaire d’en annoncer une autre. Dans notre exemple après Landy, 3♣ est un Texas Carreau.'},
      {term:'Stayman forcing de manche',meaning:'Enchère artificielle recherchant une majeure quatrième et engageant le camp vers une manche. Dans le deuxième exemple, 3♣ a ce sens explicitement annoncé par la séquence.'},
      {term:'Texas impossible',meaning:'Dans le deuxième exemple, la couleur vers laquelle un Texas transférerait est celle de l’intervention adverse à 2♦ ; l’accord transforme donc 3♣ en Stayman forcing de manche.'}
    ],
    cautions:[
      '3♣ ne décrit pas nécessairement des Trèfles : dans les deux séquences étudiées, l’enchère est artificielle mais n’a pas le même sens.',
      'On ne déduit pas le sens d’une enchère de son seul symbole : il faut connaître l’intervention adverse et l’accord de la paire.',
      'Ces deux cas n’enseignent pas toutes les réponses possibles après une intervention sur 1SA.'
    ],
    learnerGoal:'À la fin, je peux expliquer pourquoi 3♣ change de sens entre Landy adverse et intervention naturelle à 2♦, sans prétendre connaître tout le Rubensohl.',
    sourceIds:['SEF-V486-022','SEF-V481-009'],
    blocks:[
      {label:'1. Reconnaître l’intervention',
       body:'L’ouverture est 1SA (15–17 H). Vérifie ensuite si l’adversaire intervient naturellement ou artificiellement : les développements n’ont pas nécessairement le même sens.'},
      {label:'2. Exemple de contexte : Landy adverse',
       auction:'Partenaire : 1SA — Adversaire : 2♣ (Landy)',
       body:'Ici, le 2♣ adverse annonce les deux majeures. Dans l’accord décrit par le QCM source, l’enchère 3♣ du répondant est un Texas pour les Carreaux. Ce n’est pas une annonce naturelle de Trèfle.',
       evidence:'SEF-V486-022'},
      {label:'3. Autre contexte : intervention naturelle',
       auction:'Vous : 1SA — Adversaire : 2♦ naturel — Partenaire : 3♣',
       body:'Dans cette séquence source, 3♣ est explicitement défini comme un Stayman forcing de manche (« Texas impossible »). L’ouvreur doit tenir compte de la majeure quatrième qu’il possède pour répondre.',
       evidence:'SEF-V481-009'},
      {label:'4. Méthode de lecture',
       body:'Lis successivement l’ouverture, la nature de l’intervention, l’identité du joueur qui parle et le sens convenu des enchères artificielles. Le nombre de cartes dans une couleur ne suffit pas à interpréter une enchère sans l’accord.'}
    ],
    contrast:['1SA — (2♣ Landy) : 3♣, réponse du partenaire de l’ouvreur, a le sens de Texas Carreau dans ce cas.',
      '1SA — (2♦ naturel) — 3♣ : l’enchère 3♣ du partenaire est ici un Stayman forcing de manche selon la séquence.'],
    takeaway:'Retenir le CONTEXTE avant le nom de l’enchère. Les deux accords ci-dessus sont propres aux cas documentés du catalogue et ne constituent pas une table complète du Rubensohl.',
    boundary:'L’exactitude externe de ces accords et les autres interventions ne sont pas certifiées par cette mini-leçon ; elle reprend les corrigés QPJB.'
  },
  {
    id:'michaels',title:'Michaels précisés : comprendre un cue-bid bicolore',
    lead:'Un cue-bid peut décrire une distribution bicolore plutôt qu’un soutien à la couleur de l’adversaire.',
    aim:'Lire les deux couleurs garanties par les Michaels précisés des exercices QPJB et distinguer l’annonce du bicolore d’une décision compétitive ultérieure.',
    level:'Découverte des interventions bicolores — joueur connaissant déjà les ouvertures au palier de 1',
    prerequisites:[
      'Savoir reconnaître une ouverture adverse de 1♦ ou de 1♠.',
      'Distinguer les couleurs majeures (♥ et ♠) des mineures (♣ et ♦).',
      'Pouvoir compter le nombre de cartes de deux couleurs et lire une intervention au palier de 2.'
    ],
    vocabulary:[
      {term:'Cue-bid',meaning:'Dans ces exemples, annoncer au palier de 2 la couleur déjà annoncée par l’adversaire. Ce n’est pas vouloir jouer dans sa couleur : l’enchère décrit un accord.'},
      {term:'Bicolore au moins 5–5',meaning:'Au moins cinq cartes dans chacune des deux couleurs promises, soit dix cartes au minimum dans ces deux couleurs.'},
      {term:'Michaels précisés',meaning:'Accord d’intervention dans lequel certaines enchères décrivent précisément deux couleurs longues, selon la couleur d’ouverture adverse.'},
      {term:'Fit',meaning:'Longueur d’atout cumulée avec le partenaire. Un fit d’au moins huit cartes est normalement recherché avant de surenchérir haut à l’atout.'},
      {term:'Vulnérabilité',meaning:'Situation qui modifie les gains et pénalités au bridge ; elle entre dans la prudence des décisions compétitives.'}
    ],
    cautions:[
      'Le cue-bid 2♠ après 1♠ adverse ne promet pas des Piques à notre camp : il décrit ici Cœurs + Trèfles.',
      'Un bicolore 5–5 promet cinq cartes dans CHACUNE des deux couleurs, et non cinq cartes au total.',
      'Une longue couleur personnelle ne prouve pas un fit dans les deux couleurs promises par le partenaire.',
      'Ces exemples se limitent aux Michaels précisés : ne transpose pas leur signification aux variantes non précisées.'
    ],
    learnerGoal:'À la fin, je peux expliquer les deux bicolores promis après 1♦–2♦ et 1♠–2♠, puis distinguer la convention d’une décision compétitive ultérieure.',
    sourceIds:['SEF-C2-007','SEF-V45-044','SEF-L04-029'],
    blocks:[
      {label:'1. Qu’est-ce qu’un cue-bid ici ?',
       body:'L’adversaire ouvre d’une couleur au palier de 1. Dans l’accord de Michaels précisés décrit dans ces sources, répéter cette couleur au palier de 2 sert à annoncer un bicolore convenu : ce n’est pas un soutien de la couleur adverse.'},
      {label:'2. Après une ouverture adverse de 1♦',
       auction:'Adversaire : 1♦ — Notre camp : 2♦',
       body:'Le cue-bid 2♦ promet ici les deux majeures, chacune au moins cinquième (♠ et ♥, 5–5 minimum).',
       evidence:'SEF-C2-007'},
      {label:'3. Après une ouverture adverse de 1♠',
       auction:'Adversaire : 1♠ — Notre camp : 2♠',
       body:'Le cue-bid 2♠ promet ici au moins cinq Cœurs et cinq Trèfles. La couleur Pique de l’adversaire n’est pas l’une des deux couleurs promises.',
       evidence:'SEF-V45-044'},
      {label:'4. Quand les enchères continuent',
       body:'Une fois le bicolore annoncé, le partenaire distingue les longueurs garanties de celles qu’il possède réellement. En cas de surenchère adverse, il ne crée pas artificiellement un fit : il tient compte du palier, des couleurs garanties et de la vulnérabilité.',
       evidence:'SEF-L04-029'}
    ],
    contrast:['Après 1♦ adverse, 2♦ décrit les deux majeures au moins 5–5.',
      'Après 1♠ adverse, 2♠ décrit Cœurs + Trèfles au moins 5–5.'],
    takeaway:'Le cue-bid montre le bicolore du système convenu. L’annonce du bicolore et la décision de surenchérir ensuite sont deux problèmes différents.',
    boundary:'Ces exemples concernent les Michaels PRÉCISÉS documentés par QPJB. Ils ne doivent pas être transposés automatiquement aux Michaels non précisés.'
  }
]);
const POLICY=Object.freeze({
  status:'EXPERIMENTAL_PEDAGOGICAL_REVIEW',
  surface:'STANDALONE_LESSON_ONLY',
  graded:false,questionsIncluded:false,answersRecorded:false,
  publicRuntimeWired:false,selectionChanged:false,studentMasteryInferred:false,
  externalSefCertified:false,teacherApprovalRequired:true,
  audience:'FIRST_CONVENTION_LEARNER_NOT_ABSOLUTE_BEGINNER',
  glossaryProvided:true,prerequisitesExplicit:true,pedagogicalEffectNotMeasured:true
});
function validate(catalog){
  if(catalog.length!==1523)throw Error('AB: catalogue de 1523 QCM attendu');
  const orig=new Map(catalog.map(q=>[q.id,q]));
  if(orig.size!==1523)throw Error('AB: IDs originaux répétés');
  const all=new Set(),review=[];
  for(const lesson of LESSONS){
    if(!lesson.id||lesson.blocks.length!==4||lesson.contrast.length!==2||
       !lesson.aim||!lesson.takeaway||!lesson.boundary||
       !lesson.level||lesson.prerequisites.length<3||
       lesson.vocabulary.length<4||lesson.cautions.length<3||
       !lesson.learnerGoal)
      throw Error('AB: leçon incomplète '+lesson.id);
    if(lesson.prerequisites.some(x=>!x.trim())||
       lesson.vocabulary.some(x=>!x.term||!x.meaning)||
       lesson.cautions.some(x=>!x.trim()))
      throw Error('AC: prérequis, lexique ou pièges incomplets '+lesson.id);
    for(const id of lesson.sourceIds){
      if(all.has(id))throw Error('AB: source dupliquée '+id);
      all.add(id);
      const q=orig.get(id),e=EXPECTED[id];
      if(!q||!e||q.theme!==lesson.id||q.theme!==e.theme||
         q.answer!==e.answer||
         !q.auction.some(x=>x.includes(e.auction))||
         !q.explain.includes(e.explain))
        throw Error('AB: accord source changé, relecture obligatoire : '+id);
      if(!q.choices.includes(q.answer)||!q.context||q.hand.flat().length!==13)
        throw Error('AB: QCM original invalide : '+id);
      review.push({id,theme:q.theme,answer:q.answer,
        sourceFamily:F.family(q),difficulty:q.difficulty});
    }
    for(const b of lesson.blocks){
      if(!b.label||!b.body||!b.body.trim())throw Error('AB: paragraphe vide');
      if(b.evidence&&!lesson.sourceIds.includes(b.evidence))
        throw Error('AB: preuve hors périmètre : '+b.evidence);
    }
  }
  if(all.size!==5||LESSONS.length!==2)throw Error('AB: 2 leçons, 5 sources attendues');
  return {schema:'QPJB_AB_SOURCE_VALIDATION_1',catalogQuestions:catalog.length,
    lessons:LESSONS.length,sourceQuestions:all.size,sourceChecks:review,
    policy:POLICY};
}
function outline(){
  const catalog=F.loadCatalog(),report=validate(catalog);
  return {...report,lessons:LESSONS,sourceEditorReviewRequired:true,
    originalCatalogEdited:false,noQcmCopiedIntoLesson:true};
}
function scenarioCoverage(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations(),check=validate(catalog);
  if(annotations.size!==79)throw Error('AB: annotations originales modifiées');
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const sim=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
      const before=sim.sessions.map(d=>d.map(q=>q.id));
      const state=JSON.stringify(sim.state);
      const y=Y.firstEncounter(sim.sessions,catalog);
      const first=y.observations.filter(x=>['rubensohl','michaels'].includes(x.theme));
      if(first.length!==2||first.some(x=>x.status!=='OBSERVEE'))throw Error('AB: première leçon non exposée');
      const matched=first.map(x=>{
        const lesson=LESSONS.find(l=>l.id===x.theme);
        return {theme:x.theme,firstQcm:x.first.id,session:x.firstSession,
          lessonAvailable:!!lesson&&lesson.sourceIds.includes(x.first.id)};
      });
      if(matched.some(x=>!x.lessonAvailable)||JSON.stringify(before)!==
          JSON.stringify(sim.sessions.map(d=>d.map(q=>q.id)))||
          state!==JSON.stringify(sim.state))
        throw Error('AB: perte de couverture ou modification des séances');
      rows.push({profile,seed,first:matched,
        familyCount:sim.metrics.uniqueFamilies,
        targetedRecalls:sim.metrics.revision.scheduledDueRecalls});
    }
  const range=field=>[Math.min(...rows.map(x=>x[field])),Math.max(...rows.map(x=>x[field]))];
  return {schema:'QPJB_AB_9_SCENARIOS_1',scenarios:9,
    sessionsPerScenario:45,questionsPerScenario:450,
    lessonCount:check.lessons,sourceQcmCount:check.sourceQuestions,
    encounteredConventions:rows.reduce((n,x)=>n+x.first.length,0),
    availableLessons:rows.reduce((n,x)=>n+x.first.filter(y=>y.lessonAvailable).length,0),
    uniqueFamiliesRange:range('familyCount'),targetedRecallsRange:range('targetedRecalls'),
    originalCatalogEdited:false,selectionChanged:false,publicRuntimeWired:false,
    studentMasteryInferred:false,teacherApprovalRequired:true,rows};
}
module.exports={EXPECTED,LESSONS,POLICY,validate,outline,scenarioCoverage};
if(require.main===module){
  const report=process.argv.includes('--matrix')?scenarioCoverage():outline();
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}

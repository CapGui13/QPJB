'use strict';
/* QPJB AE — human classroom pilot PROTOCOL, not human observations.
 * Reads the already-audited AD prompts and AB lessons; never changes the QCM.
 */
const AD=require('./parcours-v2-comprehension-ad.cjs');
const AB=require('./parcours-v2-lecons-ab.cjs');
const F=require('./parcours-v2-pilot.cjs');
const POLICY=Object.freeze({
  status:'PROTOCOL_READY_NO_REAL_SESSION_HELD',
  participantDataStored:false,
  participantNamesCollected:false,
  siteOrQuizWired:false,
  gradeComputed:false,
  studentMasteryInferred:false,
  participationVoluntary:true,
  teacherReviewRequired:true,
  sourceCatalogChanged:false,
  inventedResults:false
});
const PROTOCOL=Object.freeze({
  title:'Essai pilote des mini-leçons Rubensohl et Michaels précisés',
  audience:'Joueurs connaissant déjà les bases d’enchères, débutant uniquement dans la convention examinée.',
  targetVolunteers:'4 à 6 volontaires si possible, 2 à 3 par convention ; ce petit effectif ne permet aucune généralisation statistique.',
  format:'Une seule convention par personne pour limiter la fatigue ; alternance Rubensohl/Michaels lorsque possible.',
  approximateDuration:'15 à 20 minutes par personne, sans chronométrer ni pénaliser un temps de réflexion.',
  purpose:'Repérer des passages incompris, pas classer les joueurs ni estimer leur maîtrise du SEF.',
  invitation:'Nous testons la clarté de deux fiches de cours, pas tes compétences. Tu peux refuser ou arrêter à tout moment. Aucune note ni identité n’est recueillie dans cet outil.',
  procedure:[
    {step:'A',label:'Présenter le but',detail:'Expliquer que le document est en cours d’amélioration, que participer est facultatif et qu’aucune réponse ne sera enregistrée numériquement.'},
    {step:'B',label:'Vérifier les bases',detail:'S’assurer oralement que les notions de 1SA, rôle du répondant, majeures/mineures et longueur d’une couleur sont familières ; sinon reporter l’essai de cette convention.'},
    {step:'C',label:'Faire lire UNE mini-leçon',detail:'Utiliser le document AB/AC hors ligne pour Rubensohl OU Michaels. Autoriser les demandes de clarification sans dicter les réponses aux questions de reformulation.'},
    {step:'D',label:'Faire reformuler à cours masqué',detail:'Utiliser les trois questions ouvertes AD correspondant à la leçon. Laisser la réponse libre ; ouvrir les repères enseignants seulement après la tentative.'},
    {step:'E',label:'Recueillir un retour de clarté',detail:'Demander ce qui était difficile, quels mots ont manqué et quel exemple aiderait. Écrire seulement des notes générales sans identité, si le participant accepte.'},
    {step:'F',label:'Synthétiser après les essais',detail:'Décrire les passages à améliorer par ID AD, préserver les désaccords et transmettre à l’enseignante avant de retoucher les leçons.'}
  ],
  qualitativeLabels:['expliqué clairement','à reformuler','non abordé'],
  difficultyTypes:['mot ou définition','sens de la séquence','contraste entre deux cas','longueur / bicolore / fit','contexte absent de la leçon','consigne ou ergonomie','autre difficulté à préciser'],
  exitQuestions:[
    'Quel passage demanderait une explication différente ?',
    'Quel mot ou exemple manque pour comprendre la convention ?',
    'Pourrais-tu expliquer le principe à un partenaire sans relire la leçon ? Qu’est-ce qui t’en empêcherait ?'
  ],
  observerRules:[
    'Aucune identité, coordonnées, capture d’écran, audio ou vidéo ; aucune étiquette de niveau individuel.',
    'Aucun QCM noté : les questions AD sont des demandes de reformulation libres, pas des évaluations du jeu en situation.',
    'Les mots exacts de l’élève ne sont pas nécessaires ; noter le TYPE de confusion et le passage du cours concerné.',
    'Ne pas compter les réponses comme des acquis : une réponse correcte après lecture du cours n’est pas une preuve de transfert en compétition.',
    'Ne pas forcer la participation ou l’enregistrement ; laisser les cases vides si aucune observation n’est souhaitée.',
    'Les papiers remplis restent sous le contrôle de l’enseignante. Ne pas les déposer dans le dépôt GitHub.'
  ]
});
const QUESTIONS=Object.freeze(AD.PROMPTS.map(x=>Object.freeze({
  id:x.id,lesson:x.lesson,skill:x.skill,question:x.prompt,
  reviewAfterResponse:x.teacherIndicators.slice(),
  possibleConfusion:x.misunderstanding,
  sourceIds:x.sources.slice()
})));
function validate(catalog=F.loadCatalog()){
  const a=AB.validate(catalog),d=AD.validate(AB.LESSONS,catalog);
  if(a.sourceQuestions!==5||d.items!==6||d.sourceAnchors<10)
    throw Error('AE : sources AB/AD non conformes');
  if(QUESTIONS.length!==6||new Set(QUESTIONS.map(q=>q.id)).size!==6)
    throw Error('AE : six questions distinctes attendues');
  for(const q of QUESTIONS){
    const fromAD=AD.PROMPTS.find(x=>x.id===q.id);
    if(!fromAD||q.lesson!==fromAD.lesson||q.question!==fromAD.prompt||
       JSON.stringify(q.sourceIds)!==JSON.stringify(fromAD.sources)||
       JSON.stringify(q.reviewAfterResponse)!==JSON.stringify(fromAD.teacherIndicators))
      throw Error('AE : question ou repère non fidèle à AD : '+q.id);
  }
  if(PROTOCOL.procedure.length!==6||PROTOCOL.exitQuestions.length!==3||
     PROTOCOL.qualitativeLabels.length!==3||
     PROTOCOL.difficultyTypes.length<6||
     PROTOCOL.observerRules.length<5)
    throw Error('AE : déroulé incomplet');
  const counts=Object.fromEntries(['rubensohl','michaels'].map(lesson=>
    [lesson,QUESTIONS.filter(x=>x.lesson===lesson).length]));
  if(counts.rubensohl!==3||counts.michaels!==3)
    throw Error('AE : déséquilibre entre les conventions');
  return {
    schema:'QPJB_AE_CLASSROOM_PILOT_PROTOCOL_1',
    status:POLICY.status,questions:QUESTIONS.length,
    conventions:2,sourceQcm:5,originalCatalog:catalog.length,
    protocolStages:PROTOCOL.procedure.length,
    instructionLabels:PROTOCOL.qualitativeLabels.length,
    observationSections:6,participantsObserved:0,
    examplesFictitious:false,actualDataCollected:false,
    sourceExercisesUnchanged:true,publicRuntimeWired:false,
    noteStored:false,teacherApprovalRequired:true
  };
}
function report(){
  const summary=validate();
  return {...summary,policy:POLICY,protocol:PROTOCOL,
    questions:QUESTIONS,observations:[],
    // Empty on purpose: there is no real human data to aggregate.
    qualitativeFindings:[],studentResultsNotInvented:true};
}
module.exports={POLICY,PROTOCOL,QUESTIONS,validate,report};
if(require.main===module)process.stdout.write(JSON.stringify(report(),null,2)+'\n');

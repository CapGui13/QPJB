# M2 — architecture de l'apprentissage (#388)

Base f8ae2120eb893c68b4cac315b7901ece69806b87. Catalogue 99049d0d5790767ba991414240aa7d837c1b188e ; prérequis a0333a153c274ab49f8e355c4695f8116b50d967. Contrat #386 ; références #293 #366–369 #375 #377–381 #385 #255 #256 #365 #376. Aucun changement de production.

## Cartographie et cibles
99 concepts, 1879 IDs. Avant : 4 stages de prérequis, pas de carte des six rôles ni d'objectif observable propre à chaque concept. Cibles : 99/99 objectifs et plans, 1879/1879 IDs classés avec justification et traçabilité, aucune nouvelle barrière, aucune assimilation de l'aide à la maîtrise. Réservoirs limités et étapes non étayées explicitement HOLD, pas de quota artificiel.

## Méthode
Objectifs et voisinages écrits concept par concept. Les prérequis agrègent les exigences effectives de la base (nombre d'IDs, min et max d'exposition), et ne constituent pas une exigence commune à tous les IDs. Les six étapes sont des fonctions pédagogiques possibles, pas un calendrier. Découverte relative au concept, non au niveau global ; heuristique de séquence minimale et stage local. Consolidation : même enchère et séquence, autre famille et H ou distribution. Discrimination : même séquence exacte, deux réponses présentes dans les deux choix, familles et H/distributions différents ; le contraste est un candidat structurel, pas une preuve d'isolation causale. Approfondissement : séquence développée ou contexte compétitif explicite ; pas seulement difficulté. Transfert : changement de structure (longueur de séquence, présence d'intervention, position), même décision, autre famille et main ; une permutation de couleurs seule ne suffit pas. Review : possibilité de rappel, pas de délai imposé. Les preuves sont conservatrices, pas une relecture éditoriale manuelle de chaque paire. Les lacunes sont des HOLD à vérifier, non des besoins de QCM démontrés automatiquement. Pas de modification des prérequis, pas de nouvelle règle SEF.

## Résultats avant/après
```json
{
  "concepts": 99,
  "ids": 1879,
  "roleCounts": {
    "discovery": 919,
    "consolidation": 726,
    "discrimination": 1254,
    "deepening": 635,
    "transfer": 561,
    "review": 1879
  },
  "conceptCoverage": {
    "discovery": 99,
    "consolidation": 62,
    "discrimination": 89,
    "deepening": 43,
    "transfer": 47,
    "review": 99
  },
  "lowFamilyConcepts": [
    "sa2.stayman",
    "drury.init",
    "forcing.base",
    "multilandy.choix",
    "michaels.choix",
    "sa1.texas_mineur",
    "sa.gambling",
    "sa2.texas.reponse",
    "sa1.stayman.contre",
    "sa1.texas.contre",
    "sa1.texas_mineur.reponse",
    "ouv.bicolore.exception",
    "sa2.stayman.reponse",
    "sa2.bicolore",
    "sa2.texas_mineur.reponse"
  ],
  "gaps": 170,
  "contrasts": 1035
}
```

Scénarios synthétiques reproductibles (pas de données d'élève) :
```json
[
  {
    "name": "new",
    "evidence": "unseen",
    "next": "discovery",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "old",
    "evidence": "exposed",
    "next": "consolidation",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "assisted",
    "evidence": "exposed",
    "next": "consolidation",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "free-error",
    "evidence": "exposed",
    "next": "consolidation",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "invalid-choice",
    "evidence": "exposed",
    "next": "consolidation",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "first",
    "evidence": "first_success",
    "next": "consolidation",
    "proofFamilies": 1,
    "proofSessions": 1
  },
  {
    "name": "same-session",
    "evidence": "first_success",
    "next": "consolidation",
    "proofFamilies": 2,
    "proofSessions": 1
  },
  {
    "name": "same-family",
    "evidence": "first_success",
    "next": "consolidation",
    "proofFamilies": 1,
    "proofSessions": 2
  },
  {
    "name": "independent",
    "evidence": "multi_family_evidence",
    "next": "discrimination",
    "proofFamilies": 2,
    "proofSessions": 2
  },
  {
    "name": "consolidation-only",
    "evidence": "unseen",
    "next": "discovery",
    "proofFamilies": 0,
    "proofSessions": 0
  },
  {
    "name": "relapse",
    "evidence": "fragile",
    "next": "consolidation",
    "proofFamilies": 2,
    "proofSessions": 2
  }
]
```

5895 assertions exécutées dans V8 en mémoire sur les données exactes, 9 ms pour la suite (indicatif, pas benchmark navigateur). Le test Node et le smoke UMD navigateur via vm sont livrés ; pas exécutés ici dans Node ou Chromium/WebKit. Commande : node tests/professeur-numerique-m2-concepts.cjs.

## Recette finale complémentaire
19 486 assertions exécutées en V8 sur le module UMD effectivement relu, en modes CommonJS et window simulés. 495 scénarios concept/profil (99 × 5), plus 11 cas détaillés. Vérification des 1 254 liens de discrimination, 726 de consolidation et 561 de transfert. Voir recette.json. 14 paires didactiques ciblées relues dans le catalogue et associées à leurs concepts via contextContrasts : elles expliquent le critère à distinguer, mais ne constituent pas une preuve automatique de discrimination. Réservoir de meilleure mineure 3–3 : un seul cas, SEF-012-1 ; le contraste 15 H régulier est utile, mais ne remplace pas d'autres mains 3–3. 4SA quantitatif et 4SA Blackwood : même enchère, sens différent, pas de preuve de compréhension si l'élève donne 4SA dans les deux. Les 14 cas à trois atouts incluent des réponses Passe : ne pas les compter tous comme soutiens. La distinction multi-familles n'implique pas plusieurs contextes.

## Intégration
UMD QPJBApprentissageConcepts ; describe(concept), classify(id) renvoient les objets figés ou null. recommend({history,concept,candidates,selected,category}) renvoie {schema,concepts,candidates:[{id,delta,reason,concept,role}]} ; uniquement candidats fournis, tri souple, delta borné, aucune sélection, aucune persistance, aucun changement de score, catégorie review/maintenance/weakness/due neutre. history suit journal réel #385 (mode parcours, session humaine <= completed, answers), anciennes entries.assessment uniquement exposition, jamais preuve ; succès strictement autonomes avec choix exact. La consolidation ciblée et séance active ne prouvent pas de maîtrise. Deux familles et séances distinctes sont un indice, pas une mesure de maîtrise ; échec récent signale fragilité. Les contrastes/transferts demandent les deux preuves en séances différentes. Pas de contrôle de durée : moteur responsable de la révision. Aucun raccordement de production ni simulation d'un nouveau moteur par M2. Le coordinateur peut consommer uniquement le signal explicatif ou classer souplement après éligibilité.

## Limites
Les rôles par ID sont une classification structurelle argumentée, non un visa éditorial exhaustif : une revue enseignant doit confirmer les paires et distinguer facteurs concurrents, notamment frontières d'ouverture, 3–3 mineure, fit 5–3 et chelems. Aucun ajout M1 anticipé. Les preuves d'apprentissage humain ne sont pas établies. La carte ne doit jamais révéler la réponse à l'élève avant réponse. Le test de navigateur réel et recette globale restent au coordinateur.

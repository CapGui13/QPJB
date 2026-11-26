# M3 — diagnostic des erreurs (#389)

Base figée f8ae2120eb893c68b4cac315b7901ece69806b87. Contrats #386/#389, références #293, #366–369, #375, #377–381, #385, #255–256, #342/#349/#356/#365 consultées. Lecture du blob HTML exact, de la table des prérequis et du moteur ; extraction du catalogue intégral et examen mécanique de toutes les options. Les règles sont conditionnelles, et ne constituent pas une revue humaine exhaustive de la plausibilité. Aucun accès aux données élèves.

## Objectifs et résultats
{
  "base": "f8ae2120eb893c68b4cac315b7901ece69806b87",
  "htmlBlob": "99049d0d5790767ba991414240aa7d837c1b188e",
  "qcm": 1879,
  "concepts": 99,
  "wrongOptions": 5637,
  "initialStructuredDiagnostics": 0,
  "afterModule": {
    "hypothesis": 719,
    "unknown": 4918,
    "correct": 0
  },
  "afterPatchesHypotheses": 719,
  "categories": {
    "priorite": 102,
    "force": 110,
    "distribution": 56,
    "inconnu": 4918,
    "niveau": 263,
    "fit": 56,
    "convention": 122,
    "forcing": 1,
    "competition": 5,
    "contexte": 4
  },
  "distinctHypothesisCategoriesPerQuestionSum": {
    "beforePatches": 551,
    "afterPatches": 556
  },
  "patches": 5,
  "performance": {
    "environment": "V8 Code Mode, direct same factory; not Node/browser",
    "calls": 37580,
    "elapsedMs": 1343
  },
  "goals": {
    "catalogueCoverage": 1879,
    "conceptCoverage": 99,
    "wrongOptions": 5637,
    "zeroInvalidPatches": true,
    "unknownAllowed": true,
    "patchesNoQuota": true
  }
}

## Intégration
UMD `QPJBDiagnosticErreurs` / CommonJS, schema `QPJB_DIAGNOSTIC_V1`. Appeler `diagnose({exercise,choice,assisted,hadFreeError})` uniquement après un choix effectif. Pour la première réponse libre erronée, passer `firstGuess` lui-même comme choice, pas le choix corrigé. Une réussite assistée renvoie correct au sens du corrigé, jamais une preuve de maîtrise. Aucune mutation, aucun historique ni score, aucune requête, aucun texte de remédiation. Confidence décrit l'adéquation de la piste au contraste, pas l'intention. Les réponses libres hors choix sont traitées uniquement quand une règle explicite s'applique ; un appel non légal ou non reconnu reste unknown. La carte embarquée lie concept à signature de contenu hors choices, de sorte que les patches d'options restent compatibles ; un changement de main, contexte, réponse ou corrigé exige revalidation. Nouveaux IDs non référencés : unknown. La signature est un garde de cohérence non cryptographique.

`cartographie.json` contient un statut par option et par ID, `mesures.json` la couverture par concept ; `patches.json` est une proposition séparée, aucune modification directe de quizz.html. Les cinq remplacements sont ciblés sur des paires de distracteurs de majeure quatrième sémantiquement redondants ; leur gain mesuré est une diversité de catégories, non une preuve d'apprentissage. HOLD : tous les cas unknown de la cartographie restent sans attribution, sans proposition de changement de réponse ; une option peut avoir plusieurs causes. Aucune équivalence ou seconde bonne réponse ne doit être inférée de unknown. Les conventions avancées non couvertes ne sont pas forcées dans une catégorie. Pas de quota.

## Recette et limites
La fonction factory exacte et runChecks ont été exécutées en V8 Code Mode sur les 1879 cas et tous les choix, avec assertions. Le test Node livré ajoute parité UMD en VM, non exécuté dans Node ici : accès git local impossible (DNS), pas de navigateur ni CI déclenchée volontairement. Commande : `node tests/professeur-numerique-m3-diagnostic.cjs`. La couverture structurée avant M3 est zéro (pas de module de ce contrat), pas zéro valeur pédagogique du corrigé existant. Les hypothèses ne prouvent pas la cause et la diversité des catégories ne prouve pas l'efficacité humaine. L'audit qualitatif manuel des 5637 options n'est pas achevé ; ne pas considérer la mission définitive avant recette native et revue des HOLD pertinents.

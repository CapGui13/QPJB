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
    "hypothesis": 1232,
    "unknown": 4405,
    "correct": 0
  },
  "afterPatchesHypotheses": 1232,
  "categories": {
    "priorite": 102,
    "force": 187,
    "distribution": 105,
    "inconnu": 4405,
    "niveau": 317,
    "fit": 191,
    "convention": 235,
    "competition": 41,
    "contexte": 28,
    "forcing": 26
  },
  "distinctHypothesisCategoriesPerQuestionSum": {
    "beforePatches": 968,
    "afterPatches": 973
  },
  "patches": 5,
  "performance": {
    "environment": "V8 exact UMD source, CommonJS/window emulation; not Node/browser",
    "calls": 37580,
    "elapsedMs": 1770
  },
  "goals": {
    "catalogueCoverage": 1879,
    "conceptCoverage": 99,
    "wrongOptions": 5637,
    "zeroInvalidPatches": true,
    "unknownAllowed": true,
    "patchesNoQuota": true
  },
  "rules": {
    "opening-sa-first": 27,
    "opening-sa-zone": 67,
    "opening-major-length": 38,
    "opening-pass": 35,
    "ambiguous": 4154,
    "opening-major-first": 16,
    "opening-sa-shape": 9,
    "opening-best-minor": 27,
    "opening-weak": 8,
    "response-major-before-sa": 32,
    "canonical-ambiguous-contrast": 251,
    "same-denomination-natural-level": 263,
    "response-major-length": 9,
    "major-support-vs-sa": 20,
    "sa-response-threshold": 24,
    "stayman-vs-texas": 18,
    "texas-pass": 9,
    "texas-natural-target": 12,
    "canonical-explicit-contrast": 245,
    "fit-2sa": 12,
    "major-support-short": 36,
    "stayman-fit-vs-sa": 17,
    "stayman-continuation-level": 14,
    "stayman-no-fit": 9,
    "stayman-four-responses": 48,
    "texas-weak-stop": 6,
    "texas-known-fit": 12,
    "natural-overcall-vs-double": 32,
    "response-to-takeout-double": 21,
    "roudi-response-code": 42,
    "texas-fit-not-established": 8,
    "texas-continuation-level": 6,
    "strong-relay-pass": 1,
    "strong-relay-code": 5,
    "strong-game-force-response": 31,
    "blackwood-response-code": 24,
    "negative-double-vs-natural": 5,
    "passed-partner-opening": 4,
    "truscott-vs-direct-raise": 13,
    "truscott-raise-level": 5,
    "two-suiter-preference": 13,
    "diamond-transfer-pass": 1,
    "diamond-transfer-rectification": 2,
    "stayman-two-majors-transfer": 6
  },
  "conceptsWithHypothesis": 91,
  "questionsWithHypothesis": 798,
  "holdTextualSignals": 4,
  "confidences": {
    "high": 448,
    "medium": 539,
    "low": 245
  },
  "holdAfterManualReview": 0,
  "testHarness": {
    "mode": "Exact .cjs executed with in-memory V8 shims for fs/path/vm; native Node not run",
    "output": [
      "{\"counts\":{\"hypothesis\":1232,\"unknown\":4405,\"correct\":0},\"categories\":{\"priorite\":102,\"force\":187,\"distribution\":105,\"inconnu\":4405,\"niveau\":317,\"fit\":191,\"convention\":235,\"competition\":41,\"contexte\":28,\"forcing\":26},\"afterHyp\":1232,\"beforeDistinct\":968,\"afterDistinct\":973,\"elapsedMs\":1646}"
    ]
  }
}

## Intégration
UMD `QPJBDiagnosticErreurs` / CommonJS, schema `QPJB_DIAGNOSTIC_V1`. Appeler `diagnose({exercise,choice,assisted,hadFreeError})` uniquement après un choix effectif. Pour la première réponse libre erronée, passer `firstGuess` lui-même comme choice, pas le choix corrigé. Une réussite assistée renvoie correct au sens du corrigé, jamais une preuve de maîtrise. Aucune mutation, aucun historique ni score, aucune requête, aucun texte de remédiation. Confidence décrit l'adéquation de la piste au contraste, pas l'intention. Les réponses libres hors choix sont traitées uniquement quand une règle explicite s'applique ; un appel non légal ou non reconnu reste unknown. La carte embarquée lie concept à signature de contenu hors choices, de sorte que les patches d'options restent compatibles ; un changement de main, contexte, réponse ou corrigé exige revalidation. Nouveaux IDs non référencés : unknown. La signature est un garde de cohérence non cryptographique.

`cartographie.json` contient un statut par option et par ID, `mesures.json` la couverture par concept ; `patches.json` est une proposition séparée, aucune modification directe de quizz.html. Les cinq remplacements sont ciblés sur des paires de distracteurs de majeure quatrième sémantiquement redondants ; leur gain mesuré est une diversité de catégories, non une preuve d'apprentissage. hold.json contient quatre signaux textuels relus, tous résolus sans patch. HOLD : tous les cas unknown de la cartographie restent sans attribution, sans proposition de changement de réponse ; une option peut avoir plusieurs causes. Aucune équivalence ou seconde bonne réponse ne doit être inférée de unknown. Les conventions avancées non couvertes ne sont pas forcées dans une catégorie. Pas de quota.

## Recette et limites
La source UMD exacte et le fichier de test CJS exact ont été exécutés dans V8 (adaptateurs mémoire pour fs/path/vm) ; égalité de toutes les sorties du catalogue, légalité des options, assertions réelles, invariants et benchmark. Les contrastes textuels explicitement attribués à l’option enrichissent les preuves ; une catégorie lexicale unique ne reçoit qu’une confiance faible. Les axes multiples restent unknown. Les hypothèses faibles ne doivent pas être utilisées pour prétendre à une remédiation ciblée certaine. Le test Node livré ajoute parité UMD en VM, non exécuté dans Node ici : accès git local impossible (DNS), pas de navigateur ni CI déclenchée volontairement. Commande : `node tests/professeur-numerique-m3-diagnostic.cjs`. La couverture structurée avant M3 est zéro (pas de module de ce contrat), pas zéro valeur pédagogique du corrigé existant. Les hypothèses ne prouvent pas la cause et la diversité des catégories ne prouve pas l'efficacité humaine. L'audit qualitatif manuel des 5637 options n'est pas achevé ; ne pas considérer la mission définitive avant recette native et revue des HOLD pertinents.

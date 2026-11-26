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
    "hypothesis": 2117,
    "unknown": 3520,
    "correct": 0
  },
  "afterPatchesHypotheses": 2117,
  "categories": {
    "priorite": 179,
    "force": 418,
    "distribution": 196,
    "inconnu": 3520,
    "niveau": 410,
    "fit": 346,
    "convention": 427,
    "forcing": 48,
    "competition": 52,
    "contexte": 41
  },
  "distinctHypothesisCategoriesPerQuestionSum": {
    "beforePatches": 1631,
    "afterPatches": 1638
  },
  "patches": 7,
  "performance": {
    "environment": "V8 exact UMD source, CommonJS/window emulation; not Node/browser",
    "calls": 37580,
    "elapsedMs": 1962
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
    "ambiguous": 3321,
    "opening-major-first": 16,
    "opening-sa-shape": 9,
    "opening-best-minor": 27,
    "opening-weak": 8,
    "response-major-before-minor-support": 13,
    "response-major-before-sa": 32,
    "response-threshold": 14,
    "canonical-ambiguous-contrast": 199,
    "same-denomination-natural-level": 263,
    "response-major-length": 9,
    "response-two-level-weak": 17,
    "response-too-weak": 17,
    "major-support-vs-sa": 20,
    "sa-response-threshold": 24,
    "stayman-vs-texas": 18,
    "texas-pass": 9,
    "texas-natural-target": 12,
    "rebid-show-major-first": 8,
    "rebid-sa-zone": 24,
    "rebid-regular-vs-repeat": 13,
    "rebid-support-four": 24,
    "rebid-long-vs-sa": 37,
    "rebid-two-suits-vs-sa": 26,
    "rebid-show-second-suit": 30,
    "rebid-second-suit-level": 8,
    "rebid-repeat-level": 20,
    "roudi-vs-weak-repeat": 10,
    "responder-weak-vs-invite": 27,
    "responder-repeat-length": 23,
    "responder-unneeded-roudi": 6,
    "responder-sa-threshold": 14,
    "response-diamond-before-1sa": 5,
    "two-over-one-threshold": 11,
    "two-over-one-vs-1sa": 33,
    "fit-2sa": 12,
    "response-major-before-1sa": 10,
    "major-support-short": 36,
    "rebid-show-fit": 13,
    "roudi-vs-nonforcing-repeat": 9,
    "responder-regular-invite": 12,
    "stayman-fit-vs-sa": 17,
    "stayman-continuation-level": 14,
    "stayman-no-fit": 9,
    "stayman-four-responses": 48,
    "texas-weak-stop": 6,
    "texas-known-fit": 12,
    "direct-overcall-sa-zone": 26,
    "natural-overcall-vs-double": 32,
    "canonical-explicit-contrast": 197,
    "takeout-double-weak-sa": 17,
    "response-to-takeout-double": 21,
    "competitive-fit-pass": 13,
    "competitive-fit-sa": 22,
    "competitive-support-short": 14,
    "competitive-response-weak": 2,
    "reply-overcall-pass": 21,
    "reply-overcall-fit": 20,
    "reply-overcall-no-fit": 27,
    "balancing-natural-vs-double": 11,
    "balancing-strong-double": 7,
    "responder-repeat-level": 4,
    "roudi-four-cards": 6,
    "roudi-response-code": 42,
    "drury-vs-natural-choice": 10,
    "drury-vs-direct-support": 11,
    "drury-no-fit": 6,
    "drury-rebid-level": 16,
    "drury-rebid-code": 12,
    "response-sa-zone": 18,
    "rebid-support-level": 8,
    "responder-fit-level": 7,
    "responder-known-fit": 11,
    "texas-fit-not-established": 8,
    "texas-continuation-level": 6,
    "competitive-major-first": 11,
    "competitive-new-suit-level": 17,
    "competitive-raise-level": 16,
    "strong-relay-pass": 1,
    "strong-relay-code": 5,
    "strong-game-force-response": 31,
    "forcing-investigate-vs-repeat": 11,
    "weak-repeat-vs-fourth": 2,
    "weak-repeat-vs-sa": 3,
    "rubensohl-transfer-code": 16,
    "blackwood-response-code": 24,
    "negative-double-vs-natural": 5,
    "passed-partner-opening": 4,
    "truscott-vs-direct-raise": 13,
    "truscott-raise-level": 5,
    "blackwood-queen-kings": 24,
    "two-suiter-preference": 13,
    "forcing-show-delayed-support": 5,
    "forcing-support-level": 4,
    "minor-transfer-code": 12,
    "minor-transfer-stop": 9,
    "minor-transfer-shortness": 14,
    "slam-controls-before-keycards": 8,
    "blackwood-init-vs-other": 35,
    "gambling-pass-correct": 2,
    "2sa-transfer-fit": 9,
    "doubled-stayman-redouble": 5,
    "doubled-stayman-stopper": 2,
    "doubled-stayman-show-major": 2,
    "diamond-transfer-pass": 1,
    "diamond-transfer-rectification": 2,
    "2sa-major-two-suiter": 9,
    "stayman-two-majors-transfer": 6,
    "gambling-stopper": 2,
    "2sa-major-choice": 2
  },
  "conceptsWithHypothesis": 99,
  "questionsWithHypothesis": 1175,
  "holdTextualSignals": 4,
  "confidences": {
    "high": 747,
    "medium": 1173,
    "low": 197
  },
  "holdAfterManualReview": 0,
  "testHarness": {
    "mode": "Exact .cjs executed with in-memory V8 shims for fs/path/vm; native Node not run",
    "output": [
      "{\"counts\":{\"hypothesis\":2117,\"unknown\":3520,\"correct\":0},\"categories\":{\"priorite\":179,\"force\":418,\"distribution\":196,\"inconnu\":3520,\"niveau\":410,\"fit\":346,\"convention\":427,\"forcing\":48,\"competition\":52,\"contexte\":41},\"afterHyp\":2117,\"beforeDistinct\":1631,\"afterDistinct\":1638,\"elapsedMs\":1962}",
      "{\"before\":{\"options\":5637,\"sameFamily\":265,\"sameContext\":1562,\"sameAuction\":1648,\"noCatalogueExample\":2162,\"unknownWithExample\":1939,\"unknownWithoutExample\":1581,\"conflicts\":0,\"sameRulePairs\":503},\"after\":{\"options\":5637,\"sameFamily\":265,\"sameContext\":1560,\"sameAuction\":1649,\"noCatalogueExample\":2163,\"unknownWithExample\":1939,\"unknownWithoutExample\":1581,\"conflicts\":0,\"sameRulePairs\":496}}"
    ]
  },
  "continuation": {
    "previousHypotheses": 1232,
    "intermediateHypotheses": 1749,
    "newHypothesesSinceLastCommit": 368,
    "upgradedFromLowSinceLastCommit": 18,
    "newRuleFixtures": 25,
    "previousHighMediumPreserved": true,
    "uncoveredConcepts": []
  },
  "plausibility": {
    "before": {
      "options": 5637,
      "sameFamily": 265,
      "sameContext": 1562,
      "sameAuction": 1648,
      "noCatalogueExample": 2162,
      "unknownWithExample": 1939,
      "unknownWithoutExample": 1581,
      "conflicts": 0,
      "sameRulePairs": 503
    },
    "after": {
      "options": 5637,
      "sameFamily": 265,
      "sameContext": 1560,
      "sameAuction": 1649,
      "noCatalogueExample": 2163,
      "unknownWithExample": 1939,
      "unknownWithoutExample": 1581,
      "conflicts": 0,
      "sameRulePairs": 496
    }
  }
}

## Intégration
UMD `QPJBDiagnosticErreurs` / CommonJS, schema `QPJB_DIAGNOSTIC_V1`. Appeler `diagnose({exercise,choice,assisted,hadFreeError})` uniquement après un choix effectif. Pour la première réponse libre erronée, passer `firstGuess` lui-même comme choice, pas le choix corrigé. Une réussite assistée renvoie correct au sens du corrigé, jamais une preuve de maîtrise. Aucune mutation, aucun historique ni score, aucune requête, aucun texte de remédiation. Confidence décrit l'adéquation de la piste au contraste, pas l'intention. Les réponses libres hors choix sont traitées uniquement quand une règle explicite s'applique ; un appel non légal ou non reconnu reste unknown. La carte embarquée lie concept à signature de contenu hors choices, de sorte que les patches d'options restent compatibles ; un changement de main, contexte, réponse ou corrigé exige revalidation. Nouveaux IDs non référencés : unknown. La signature est un garde de cohérence non cryptographique.

`cartographie.json` contient un statut par option et par ID, `mesures.json` la couverture par concept ; `patches.json` est une proposition séparée, aucune modification directe de quizz.html. Cinq remplacements ciblent des paires de distracteurs de majeure quatrième sémantiquement redondants ; deux autres remplacent un 2SA redondant par un soutien à saut trop fort dans des redemandes fittées de première zone ; leur gain mesuré est une diversité de catégories, non une preuve d'apprentissage. hold.json contient quatre signaux textuels relus, tous résolus sans patch. HOLD : tous les cas unknown de la cartographie restent sans attribution, sans proposition de changement de réponse ; une option peut avoir plusieurs causes. Aucune équivalence ou seconde bonne réponse ne doit être inférée de unknown. Les conventions avancées non couvertes ne sont pas forcées dans une catégorie. Pas de quota.

## Recette et limites
La source UMD exacte et le fichier de test CJS exact ont été exécutés dans V8 (adaptateurs mémoire pour fs/path/vm) ; égalité de toutes les sorties du catalogue, légalité des options, assertions réelles, invariants et benchmark. Les contrastes textuels explicitement attribués à l’option enrichissent les preuves ; une catégorie lexicale unique ne reçoit qu’une confiance faible. Les axes multiples restent unknown. Les hypothèses faibles ne doivent pas être utilisées pour prétendre à une remédiation ciblée certaine. Le test Node livré ajoute parité UMD en VM, non exécuté dans Node ici : accès git local impossible (DNS), pas de navigateur ni CI déclenchée volontairement. Commande : `node tests/professeur-numerique-m3-diagnostic.cjs`. La couverture structurée avant M3 est zéro (pas de module de ce contrat), pas zéro valeur pédagogique du corrigé existant. Les hypothèses ne prouvent pas la cause et la diversité des catégories ne prouve pas l'efficacité humaine. L'audit qualitatif manuel des 5637 options n'est pas achevé ; ne pas considérer la mission définitive avant recette native et revue des HOLD pertinents.

## Approfondissement
Règles supplémentaires ciblées sur les redemandes, réponses à 1SA, Roudi, Drury, forcing, réponses compétitives, Texas mineurs, 2SA bicolore majeur, Stayman contré, gambling et Blackwood. Tous les diagnostics précédents de confiance moyenne ou élevée sont conservés à l’identique ; les contrastes faibles peuvent être supplantés par une règle contextualisée. Un cas réel par nouvelle règle est ajouté aux tests. Les exceptions et la signification conventionnelle restent liées au cas. Le test M3 n’est pas appelé par la CI TARGETED historique, même lorsqu’elle est verte.

## Audit de plausibilité contrastive
`plausibilite.json` : chaque mauvaise option a un statut diagnostique et, si disponible, un exemple où cette enchère est correcte sur une autre main dans la même séquence exacte. Priorité à la même famille, puis au contexte identique. Ce lien documente la possibilité de l’enchère dans un cas contrasté, **pas** son adéquation ici ni une intention de l’élève. L’absence de cas comparable ne démontre pas qu’un distracteur est absurde. Les collisions main/séquence/contexte sont recherchées séparément. `node tests/professeur-numerique-m3-plausibilite.cjs` reconstruit exactement la cartographie et contrôle les métriques et les preuves. Les sept patches sont proposés, non appliqués au HTML. Les tests exacts de diagnostic et de plausibilité sont exécutés dans V8 avec adaptateurs mémoire, pas en Node natif. Aucune assertion n’impose un quota artificiel d’hypothèses. Les options non attribuées et sans contraste restent à revoir qualitativement avant clôture définitive.

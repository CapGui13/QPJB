# M2 — PASSE 14 : garde-fou catalogue compatible avec le chantier UX M3

**PASSE 14 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON** (tests M2 complets sur checkout encore non exécutés).

## Défaut reproductible identifié

Avant cette passe, `tests/wave2-adaptatif-invariants.cjs` comparait le blob Git **de l'intégralité** de `quizz.html` au SHA `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`. C'était un faux invariant pédagogique : toute modification UI autorisée par M3 dans `quizz.html` changerait ce blob, alors que le catalogue de 1 523 QCM peut rester **identique**.

La branche indépendante M3 (`wave2/experience-eleve-20261121`, PR #265) modifie effectivement `quizz.html` pour l'UX. Le garde-fou historique `tests/quizz-ui-vnext-static.cjs`, lu au **commit de base figé** `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` ainsi que sur M3, fournit l'invariant *du seul JSON pédagogique* :

- longueur de la chaîne JavaScript JSON extraite : **1 741 625** ;
- empreinte FNV-1a 32 bits de la chaîne : **`5eba3d0a`** ;
- **1 523 exercices**, **22 rubriques**.

## Correctif M2 strictement autorisé

1. `tests/wave2-adaptatif-invariants.cjs` : garde le SHA Git **du moteur** `d0f06f1c259f7a766f2d1c8c47289374a74138dc` (contrat LOT B historique), mais remplace le verrou du fichier HTML entier par l'empreinte du JSON exact, son unicité d'insertion, la longueur, les ID distincts et les rubriques. Une UX conforme n'est donc plus bloquée par M2.
2. `tests/wave2-adaptatif-invariants-contract.cjs` : nouveau test de non-régression, vérifiant un changement de titre/style en conservant le JSON, la détection de mutation du JSON, les vecteurs FNV-1a `''` et `'a'`, et les rejets en l'absence de catalogue ou en cas de duplication. Les chaînes d'essai sont techniques, sans invention de donne de bridge.
3. `tests/wave2-adaptatif-suite.cjs` et `tests/wave2-adaptatif-suite-selftest.cjs` : ajout du test de coexistence UX dans la suite rapide ; **5 commandes rapides / 10 commandes complètes** et contrat mis à jour.

Les quatre commits source successifs sont `2a81fdce`, `b21c14b0`, `a824160b`, `2c1b0ad`.

## Vérifications exécutées pour cette passe

Sur les quatre fichiers locaux exacts :

- `node --check` **4/4 : succès** avec Node **22.16.0**.
- `node tests/wave2-adaptatif-invariants-contract.cjs` : **PASS**, HTML hors JSON modifiable, JSON modifié détecté, catalogue absent/dupliqué rejeté.
- `node tests/wave2-adaptatif-suite-selftest.cjs` : **PASS**, 5 rapides, 10 complètes, propagation d'échec et arguments.
- `node tests/wave2-adaptatif-suite.cjs --list` : structure JSON contrôlée **5/10**.
- Identité de contenu entre tests locaux exécutés et fichiers committés sur GitHub : les blobs SHA Git sont identiques :
  - `wave2-adaptatif-invariants.cjs` : `6199e619f59bb5a888e2f23b0d998f78c3219de8` ;
  - `wave2-adaptatif-invariants-contract.cjs` : `216b8063fc59fef1a1cc3c58df37e1a01b65ec5b` ;
  - `wave2-adaptatif-suite.cjs` : `5796cc3c20226c170ea3356aa9be4183ffffa1ee` ;
  - `wave2-adaptatif-suite-selftest.cjs` : `1511ba8e5bd1dce69d5b9c7cbebc28a85ab89680`.

## Réserves et décision

- La comparaison du JSON de **1 741 625 caractères** n'a pas pu être relancée avec `quizz.html` réel dans le conteneur : la lecture du gros fichier par le connecteur GitHub est vide et le clone Git échoue (DNS). On utilise l'empreinte de référence vérifiée par le garde-fou préexistant, mais **ne pas présenter les tests du vrai catalogue comme exécutés localement**.
- Le hash FNV-1a de la base est un garde-fou de non-régression **non cryptographique**, mais son format et sa valeur coïncident avec le test UX historique. L'unicité des ID et les 22 rubriques sont contrôlées à l'exécution sur le vrai catalogue.
- Le run CI associé à cette tête devra être relu après exécution ; le succès sur une tête antérieure ne couvre pas ce nouveau diff.
- Aucun changement à `quizz.html`, au moteur pédagogique, aux workflows M5 ou aux autres branches. Les choix `foundation`, `recall`, `overdue` restent non dominants et non déployés.

**PASSE 14 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

**PROCHAINE PASSE : P15** — vérifier la CI de la nouvelle tête, le diff complet, les points d'interface avec M3 et le test de bout en bout de `--quick` / `--full` dès qu'un runner ayant le dépôt réel peut les exécuter. Si aucun signal nouveau, conserver la PR en brouillon HOLD plutôt que prétendre une clôture technique.

**Ne jamais fusionner ou publier sans validation séparée.**

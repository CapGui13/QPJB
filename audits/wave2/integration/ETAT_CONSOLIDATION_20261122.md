# QPJB V2 — Assemblage contrôlé des cinq chantiers (22/11/2026)

**Statut : HOLD / validation et arbitrages.** Aucune fusion vers `main`, aucune publication Pages, aucune décision SEF appliquée.

## Sources figées et méthode

| Mission | Branche / PR | SHA source | Fichiers sélectionnés |
|---|---|---|---:|
| M1 — pédagogie | PR #261 | `cb2ad100ca5473b9e3fbfe6fd3c839c5fe86a5ec` | 92 |
| M2 — adaptatif | PR #263 | `5197f04ef8b530e5a73c5e414f26d8d0ef4f2d15` | 56 |
| M3 — expérience élève | PR #265 | `35ebb3c928d4b3f4a1e1c2cf8dab00e9c6d32020` | 41 |
| M4 — recommandations | PR #262 | `8896fc149b14e203f9339d0c9382be99c1f9e1b3` | 52 |
| M5 — CI | PR #264 | `65ab1df7df27e02f8e410beac005a3cbf5896f49` | 18 |

La branche d'assemblage part du **SHA `9aac018359dfa0cca51475be47275b7f4507650f` de la PR de recette #269**, qui contient M3 + M5 et un workflow temporaire de recette navigateur. Les **41 chemins M3** sont identiques, blob à blob, entre le HEAD #265 et #269. Ce dernier SHA descendait de `main` `67223f0c7ac3123592860a66152a586ca3a473d0`, ce qui conserve les récents ajouts de séances de `main`.

Sur cette base, les **200 chemins M1/M2/M4** ont été copiés par identifiants de blobs Git, sans aucun chemin commun entre PR #261, #263, #262 et #269. Les fichiers de production `quizz.html` et `quizz-parcours.js` viennent de M3 + `main` ; le moteur adaptatif V1 demeure inchangé. Aucun QCM et aucune des 36 propositions pédagogiques historiques ne sont modifiés ni appliqués par l'assemblage.

## Correctif croisé M4/M3

Le test `tests/wave2-recos-integrity.test.js` comparait auparavant le SHA Git du **HTML entier** et refusait une modification d'interface M3 même si le catalogue était intact. Il vérifie désormais strictement :

- la présence du JSON `training-data` et son SHA-256 brut `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a` ;
- les **1 523 exercices** présents et parsables ;
- le SHA Git inchangé de `quizz-parcours.js` et les autres interdictions de mutation M4.

Cette correction reproduit le principe du patch M1 P36 testé localement (avant : M4+M3 106/107 ; après patch local : 107/107). La nouvelle branche doit **encore obtenir son propre verdict GitHub Actions**.

## Recette de consolidation

Un workflow sans publication `.github/workflows/qpjb-wave2-integration-recette.yml` exécute sous Node 22 :

- `node tests/wave2-pedagogie-suite.cjs` ;
- `node tests/wave2-adaptatif-suite.cjs --quick` ;
- `node tests/wave2-adaptatif-suite.cjs --full` (30 trajectoires, séparé pour mesurer la durée) ;
- `node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js`.

Le workflow M3 hérité de #269 exécute `node tests/wave2-ux-runner.cjs` avec Playwright 1.64.1 sous Chromium et WebKit et archive les 36 PNG ; `QPJB Training smoke` conserve ses contrôles historiques dont les gardes M5. Aucun de ces workflows de PR ne doit publier.

**Tous les résultats du nouveau SHA doivent être lus avant toute demande de fusion.** Ne pas confondre succès des branches d'origine et validation de la branche assemblée.

## Décisions non automatiques et risques restants

1. M1 : **6 propositions de clarifications et 11 accords** attendent un vrai arbitrage humain. Aucun QCM ne doit être modifié sans accord explicite.
2. M4 : le module de recommandations est en lecture seule. Son **raccordement visible à l'interface** est une décision d'intégration et une modification fonctionnelle distincte, non présumée validée par les tests du module isolé.
3. Vérifier l'identité du catalogue et les sauvegardes élèves après les tests transversaux.
4. La PR de synthèse reste **brouillon/HOLD**, aucun merge vers `main` sans approbation explicite de l'utilisatrice ; après approbation seulement, nouvelle vérification des SHA et du déploiement.

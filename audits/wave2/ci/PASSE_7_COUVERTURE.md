# M5 — PASSE 7 : protection complémentaire de la couverture navigateur

## Défaut réel identifié

Le garde historique `tests/ci-training-workflow-guard.cjs` protège les **58 commandes CLI** et **7 scripts navigateur par moteur**. Mais `training-smoke.yml` en utilise **8** : `quizz-ui-vnext-browser.cjs` n'était pas dans sa liste, pas plus que les nouvelles sondes d'échec et leur collecte d'artefacts.

## Correction

`tests/wave2-ci-coverage.cjs` complète le garde historique **sans le modifier**. Il exige :
- Quatre jobs requis ; la simulation longue et les cinq garde-fous de l'audit rapide.
- Les **8 scripts navigateur exactement une fois en Chromium et WebKit** (16 commandes), plus deux sondes de panne contrôlée.
- Artefacts Lot07 toujours sauvegardés avec `if: always()` ; aucun `continue-on-error: true` ni `needs` dans ces jobs.
- Le verrou Pages : conclusion success, branche main, exclusion des PR, checkout du SHA testé.

**Quatre contre-tests négatifs** sont intégrés au test : disparition du 8e script WebKit, disparition de la sonde WebKit, suppression de l'upload WebKit sur échec et suppression du filtre anti-PR. Ils doivent tous faire échouer le garde. Les 58 commandes restent vérifiées par leur garde historique non modifié.

**Tests P7 :** parsing JavaScript validé et vérification des 16 commandes sur le workflow réel en mémoire ; validation GitHub Actions du SHA P7 à confirmer. Les tests fonctionnels historiques ne sont pas supprimés, le verrou Pages n'est pas changé.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 8 :** consulter les exécutions Actions P4–P7 et les résultats des quatre contre-épreuves ; corriger les échecs réels avant toute clôture.

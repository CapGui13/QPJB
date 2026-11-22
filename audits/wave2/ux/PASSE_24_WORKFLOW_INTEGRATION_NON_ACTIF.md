# M3 — PASSE 24 : chemin d'exécution CI prêt, recette navigateur encore dépendante de l'intégration

## Diagnostic exact

- Source M3 : `wave2/experience-eleve-20261121`, base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- Le runner `node tests/wave2-ux-runner.cjs` comporte **12 étapes** : 8 tests Node, un parcours navigateur de 7 scénarios sous Chromium et WebKit, un comparatif visuel de 18 captures par moteur.
- `.github/workflows/training-smoke.yml` a été inspecté sur les branches M3 **et** M5 ; aucun de ces workflows n'appelle le runner M3. Leurs résultats ne peuvent donc pas valider ces scénarios.
- `workflow_dispatch` existe dans l'historique, mais le déclencher tel quel ne lancerait pas M3. Ne pas le présenter comme une solution.
- Dans le conteneur actuel, DNS GitHub indisponible ; pas de checkout complet ni paquet Playwright JS/WebKit utilisable, Chromium local refuse les navigations de test. Le connecteur GitHub accessible ne propose pas d'action de déclenchement de workflow paramétré. **Le runner M3 n'a pas été exécuté ici.**

## Livrable concret, périmètre respecté

Fichier **`audits/wave2/ux/EXEMPLE_CI_INTEGRATION_M3_M5.yml`**, un workflow GitHub Actions à copier **seulement** sur la branche d'intégration autorisée sous `.github/workflows/qpjb-m3-integration-recette.yml` après rapprochement du code M3 et M5.

Ce workflow non actif :
- se déclenche sur la PR d'intégration lorsqu'elle contient l'UI/test M3 ou le workflow lui-même ;
- utilise un checkout complet (`fetch-depth: 0`) et vérifie la présence de `2d0ac848...:quizz.html` ;
- installe Node 22 et `playwright@1.64.1` dans le conteneur `mcr.microsoft.com/playwright:v1.64.1-noble` ;
- lance `node tests/wave2-ux-runner.cjs` sans sélectionner un moteur unique, donc Chromium **et** WebKit ;
- sauvegarde le log et **`artifacts/wave2-ux/**` même en cas d'échec**, avec `if: always()` et un nom d'artefact unique par exécution ;
- n'autorise aucune publication et ne modifie pas les workflows déjà affectés au chantier M5.

## Tests réellement exécutés

- `node tests/wave2-ux-http-test.cjs`, `node tests/wave2-ux-asset-watch-test.cjs`, `node tests/wave2-ux-reflow-check-test.cjs`, `node tests/wave2-ux-visual-report-test.cjs` : **4/4 PASS**.
- Validateur YAML Python : **parsing réussi**, 6 étapes, conteneur Playwright attendu, installation Playwright, commande M3 et upload d'artefacts `if: always()` présents.
- GitHub : modèle relu à partir de la branche, conforme ; **55 commits devant la base / 0 en retard / 40 fichiers modifiés, aucun hors périmètre** après publication du modèle.
- **Non exécuté** : workflow GitHub nouvellement préparé (il n'est pas installé sous `.github/workflows`), suite M3 complète, navigation Chromium/WebKit et 36 captures.

## Verdict

**PASSE 24 — PRÉPARATION DU DÉBLOCAGE FINIE, RECETTE NAVIGATEUR NON FINIE.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**

**PROCHAINE PASSE : P25 uniquement après création de la branche d'intégration M3+M5 et lancement effectif du workflow proposé : examiner la sortie 12/12, les 14 scénarios et les 36 PNG, corriger les défauts observés et maintenir HOLD autrement.**

Aucune fusion, publication, modification de code de production ou d'une autre branche. La PR #265 reste en brouillon/HOLD.

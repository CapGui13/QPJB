# QPJB M1 — P21 : 17 QCM vérifiés contre la source primaire

**PASSE 21 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Mesure sur le catalogue réel
Le connecteur GitHub a fourni le blob intégral `quizz.html` de SHA `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7` (1 835 508 caractères). Le JSON embarqué donne **1 523 QCM et 22 thèmes**, sans ID QCM répété.

Rapprochement précis des **17 IDs en attente** avec les clichés d'audit P8 (3 QCM), P10 (7), P13 (7) : **0 divergence** dans les mains, points, distributions, séquences, contextes, quatre choix, réponses, explications et autres champs disponibles. Les **six textes `before` de P20** sont identiques aux champs courants des QCM. Les **36 propositions historiques** sont exclues de ces 17 dossiers.

Les SHA de `quizz.html`, `quizz-parcours.js` et des deux listes historiques de propositions sont identiques entre `main` et la branche M1 à l'instant de la vérification (lecture seule de `main`).

## Test de non-régression
Le nouveau `tests/wave2-pedagogie-catalogue-p21.cjs` reconstitue ce rapprochement directement depuis le catalogue embarqué ; sous Node, il calcule le SHA-1 Git sur le fichier. **Exécution en moteur JS isolé avec les vrais fichiers GitHub : PASS**, dont trois altérations en mémoire détectées (bonne réponse Texas, main Blackwood, explication). **Limite** : le hachage a été simulé à partir du SHA Git connu dans l'environnement JS isolé ; **aucune exécution native Node de la suite ni CI GitHub attestée**. Lanceur à **16 tests**.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P22 — bilan transversal et contrat d'exécution native/validation humaine sans inventer de nouveaux arbitrages.** Aucune fusion, publication ou mutation des QCM.

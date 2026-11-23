# LONG M4 — Passe 9 : intégrité du périmètre, CI et reprise

**PASSE 9 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Preuves d'intégrité vérifiées sur GitHub

Base figée : 2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a.
Branche de travail : wave2/recommandations-20261121.
Dernier HEAD inspecté avant cette passe : 9cd561414fccd394ab09ce6c151dcec5e5a00024.

Le compare base→HEAD remontait **0 fichier hors du périmètre** : parcours-recommandations.js, tests/wave2-recos-* et audits/wave2/recommandations/**. Il indiquait 8 commits d'avance, 0 en retard sur le commit de départ, PR #262 ouverte et encore en brouillon, pas de fusion.

Empreintes Git blob comparées directement à la base :
- quizz-parcours.js : d0f06f1c259f7a766f2d1c8c47289374a74138dc (IDENTIQUE).
- quizz.html : 9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7 (IDENTIQUE).

Un test supplémentaire tests/wave2-recos-integrity.test.js contrôle ces deux empreintes et l'absence de primitives DOM, réseau et stockage dans le module M4. Ce test ne modifie aucune donnée.

## État CI réellement constaté lors de cette passe

- Commit P2 47d05de2... : workflow GitHub Training smoke #44949461319 **terminé avec succès**. Logs du job « Audit des données et du code » : 13 tests historiques recommandations « pass 13 », contrôle d'intégrité « 1523 exercises, 22 topics », et autres audits PASS.
- Commit P3 583150012... : job « Audit des données et du code » **succès**, avec 13 tests historiques « pass 13 » et vérification des 1523 QCM/22 thèmes ; le workflow complet restait en cours (WebKit).
- P4 à P8 : jobs CI partiellement en cours / en file d'attente au moment de la consultation. **Ne pas interpréter une file d'attente comme réussite.**
- Les tests nouveaux wave2-recos-* ne sont pas invoqués par training-smoke.yml. Leur présence ne vaut pas preuve d'exécution.

## Recette ciblée obligatoire avant conclusion

Depuis la branche de travail, sous Node 22 :

node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js

Évaluer les lignes M4-P4 (5 profils 65/153) et M4-P7 (65/153 séances de 10 réponses), vérifier que les **52 scénarios déclarés** (13 historiques + 39 nouveaux) passent, corriger tout échec et revalider les empreintes. Le nombre 52 est un dénombrement de scénarios écrits, **PAS un résultat de tests verts**.

Aucune modification du workflow GitHub n'est autorisée par le périmètre de M4. Le coordinateur doit décider s'il exécute la commande ou l'intègre à sa mission CI (M5).

## Résultats livrés (périmètre strict)

P2 contre-tests aide/erreurs/révision, P3 regroupement prouvé et visibilité action, P4 trajectoires 65/153, P5 explications observé/limite/action, P6 compatibilité, P7 vraies séances de 10 questions, P8 contre-épreuve à compteurs égaux, P9 garde-fou de contenu.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**
**PROCHAINE PASSE :** exécuter réellement les tests nouveaux, diagnostiquer les échecs, récupérer le CI final du dernier SHA et présenter le contrat au coordinateur sans appliquer de raccordement. PR DRAFT/HOLD, aucune fusion ni publication.

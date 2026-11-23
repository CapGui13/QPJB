# LONG M4 — Passe 14 : sessions réelles sans micro-compétence auditée

**PASSE 14 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Résultats de la recette récupérés avant la correction

- Workflow P11 **#44953470984** : quatre jobs SUCCESS ; dans les logs Node22 de l'audit **57 tests / 57 pass / 0 fail**.
- Workflow P12 **#44953593298** : quatre jobs SUCCESS ; audit **61 tests / 61 pass / 0 fail**.
- Workflow P13 **#44953681053** : quatre jobs SUCCESS ; audit historique **13 tests / 13 pass / 0 fail** après retrait de la sonde. Les nouveaux wave2-recos-* ne sont pas invoqués automatiquement dans ce workflow normal.
- Ces observations sont des résultats **exécutés**, pas seulement des scénarios préparés.

## Défaut nouvellement reproduit avec le vrai moteur

Après dix réponses à des exercices de type `stayman` non associés à une micro-compétence ou un axe audité, `record` puis `finish` produisent `completed=1`, un journal détaillé, `parcours.autonomous=10`, mais **aucune recommandation**. L'ancien garde-fou `!stats.detailedSessions` masquait l'information précisément parce que le journal existait.

Correction : lorsque la séance est terminée, sans `active`, et sans `micros` ou `axes` utilisables, conserver un conseil *neutre* sous le type historique `not_evaluated`. Trois formulations sont distinguées : état totalement vide, sauvegarde historique sans journal, et séances consignées mais sans classification auditée. L'explication donne le nombre de séances terminées et détaillées, sans jamais affirmer qu'une réponse prouve la maîtrise d'une notion. L'action dit « poursuivre » quand des séances existent.

Quatre tests nouveaux dans `tests/wave2-recos-unclassified.test.js` : 10 réponses correctes hors taxonomie, 3 erreurs hors taxonomie, legacy 65 séances, reprise après séance non classifiée. Aucune nouvelle taxonomie, notation ou seuil ; l'état V1 et le catalogue restent intacts.

**Commande de recette ciblée** : `node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js`. La suite M4 contient désormais **66 scénarios** (62 précédents + 4 nouveaux). Exécution complète Node22 de cette révision **non encore attestée**, contrairement aux 61 scénarios P12.

**PROCHAINE PASSE :** tester le regroupement micro/axe face aux réponses répétées et au journal tronqué ; vérifier la compatibilité et l'absence d'effet de bord. Ne pas modifier la CI (mission M5), ni fusionner/publier. PR DRAFT/HOLD.

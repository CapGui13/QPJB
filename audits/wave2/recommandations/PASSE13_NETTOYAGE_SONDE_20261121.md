# LONG M4 — Passe 13 : retrait de la sonde et garde-fous définitifs

**PASSE 13 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Nettoyage de l'instrumentation

Le commit de la passe 10 avait ajouté à parcours-recommandations.js un crochet temporaire explicitement réservé aux runs GitHub Actions de la PR M4. Il a servi à exécuter sous Node22 les 52 scénarios P1-P9 ; job Audit #136995187100 conclu SUCCESS, 52 pass / 0 fail. Il a ensuite servi aux runs P11/P12 (57 et 61 tests attendus), dont les conclusions doivent être collectées séparément.

**Ce crochet est entièrement supprimé du code de production.** Il n'y a désormais aucun require des fichiers de test, aucun GITHUB_HEAD_REF ni autre dépendance à GitHub Actions dans parcours-recommandations.js. La forme de l'API publique reste inchangée.

Un test additionnel de garde-fou dans tests/wave2-recos-integrity.test.js contrôle explicitement l'absence de ces marqueurs. Les tests wave2-recos-* restent autonomes et se lancent par la commande :

node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js

La suite finale **déclare 62 scénarios** : 13 historiques + 49 nouveaux (P1-P9 : 39, P11 : 5, P12 : 4, garde-fou P13 : 1). Sous Node22, les 61 précédents ont été soumis à la CI P12 avec sonde ; le 62e nouveau contrôle d'absence est une assertion statique après suppression.

## Critères de clôture encore ouverts

1. Lire les logs des runs Node22 P11 et P12 (jobs Audits) : relever le vrai nombre pass/fail, et corriger toute anomalie si nécessaire.
2. Contrôler le workflow GitHub normal déclenché par ce commit après suppression de la sonde, et l'état brouillon de la PR.
3. Revérifier qu'il y a zéro fichier hors des chemins M4 autorisés dans le diff base→HEAD, et que les blobs de quizz-parcours.js et quizz.html restent identiques à la base.
4. Le coordinateur (mission M5) devra intégrer explicitement les nouveaux tests à la CI durable si désiré ; M4 ne peut pas modifier .github/workflows/**.

**PROCHAINE PASSE :** collecte CI, revue finale du contrat d'intégration, aucune fusion ni publication. PR DRAFT/HOLD.

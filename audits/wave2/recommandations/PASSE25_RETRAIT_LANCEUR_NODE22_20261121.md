# LONG M4 — Passe 25 : nettoyage du lanceur Node22 et garde-fou

**PASSE 25 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Recettes natives déjà prouvées

- Workflow 44956828082, job Audit 137006688776 : Node 22, # tests 89, # pass 89, # fail 0, conformément aux logs réels du commit 175c2f5f67c4b216c546742952c04dd06c68dd65.
- L'instrumentation éphémère utilisée pour cette recette était entièrement confinée à parcours-recommandations.js. Les jobs des commits P23 et P24 ont été créés sous leurs SHAs distincts ; leurs conclusions doivent être relevées avant de revendiquer 95/96 tests passés.

## Nettoyage du module livré

La totalité du bloc commenté PASSE 22 et ses imports node:fs, node:path, env GITHUB_ACTIONS, inspection process.argv et require dynamique des tests ont été retirés. Aucune mutation des fichiers hors M4. L'API publique reste VERSION, OUTCOMES, outcome, buildReport.

Un cinquième test d'intégrité sous tests/wave2-recos-integrity.test.js interdit explicitement un futur crochet GitHub Actions, un explorateur readdirSync des tests ou une commande conditionnée au processus de tests dans le module de production.

## Complément au contrat de la passe 19

- evidence.assistedOnly=true : journal complet composé uniquement de réussites aidées ou corrigées après première erreur libre ; le type historique est conservé, le titre est « Autonomie à consolider ».
- evidence.helpedAndSkipped=true avec helpedCount et skippedCount : journal complet composé de réponses aidées et de sauts sans erreur finale constatée ; le type, la priorité et les scores V1 sont inchangés.
- evidence.skippedOnly=true : toutes les questions ont été sautées ; conseil neutre, jamais difficulté diagnostiquée.
- Les marqueurs n'existent que lorsque le journal détaillé est complet et non contradictoire ; les sauvegardes anciennes ne reçoivent aucun marqueur inventé.
- La matrice P24 balaie 125 suites de trois séances (5 issues possibles par séance) et vérifie décomptes, stabilité, non-mutation et absence de faux acquis.

La commande à intégrer par M5 demeure :

    node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js

Au commit de P24, la cible était de 96 tests : 92 tests JS hors filesystem et 4 tests fs/crypto. Le nouveau garde-fou de P25 porte la cible à **97 tests**. Les résultats déjà obtenus ne permettent pas de prétendre 97/97 sous Node22.

**PROCHAINE PASSE :** récupérer les logs natifs des runs P23/P24, vérifier le dernier CI standard après retrait de l'instrumentation, contrôler les deux SHAs protégés et le diff, et transmettre les résultats au coordinateur M5 sans fusion ni publication. PR #262 reste DRAFT/HOLD.
# M5 — PASSE 10 : vérification sémantique du verrou Pages

## Limite corrigée
La passe 6 vérifiait les commandes Git/rollback en situation réelle dans un dépôt temporaire, mais les filtres `workflow_run` du workflow Pages étaient seulement recherchés par sous-chaînes dans le YAML. Un opérateur `&&` remplacé par `||` pouvait donc laisser les mêmes sous-chaînes et contourner le verrou sans être détecté.

## Contre-épreuves ajoutées
`tests/wave2-ci-pages-conditions.cjs` lit le véritable `.github/workflows/verified-pages.yml` (inchangé) et exécute son expression de filtrage contre **12 situations de workflow_run**, combinant conclusion (success/failure/cancelled), branche (main/autre) et événement (push/pull_request). Seul un run **success/main/non-PR** est admis, ce qui interdit une publication d'un run de PR même si le code de tests est vert. Le test vérifie également que la source Pages doit être `workflow` et que `publish` dépend de `pages-source` avec `enabled == 'true'`.

Six mutations dangereuses doivent être rejetées : `&&` remplacé par `||`, branche `main` inversée, PR acceptée, type de source inversé, dépendance Pages supprimée, test `enabled` inversé. Les scénarios ne contactent ni GitHub Pages ni `main` ; ce sont des contre-épreuves locales de la condition réellement déclarée.

La nouvelle vérification est ajoutée à l'audit rapide de `training-smoke.yml`. Le garde `tests/wave2-ci-coverage.cjs` protège désormais **six** contrôles rapides, sans supprimer les **58 commandes historiques** ni les **16 scripts navigateur**. La PR reste brouillon.

**Tests P10 :** analyse syntaxique JavaScript et simulation des **12 cas / 6 mutations** réussies sur le YAML actuel ; vérification GitHub Actions du commit P10 à venir.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 11 :** examiner la CI P9/P10, l'absence de publication déclenchée et les éventuelles anomalies restantes ; conserver HOLD.

# LONG M4 — Passe 31 : code de production nettoyé et même blob que la recette native

**PASSE 31 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON (attente de la conclusion de la CI standard complète et raccordement inter-missions).**

## Vérification de nettoyage

La sonde strictement temporaire de P30 a été supprimée dans le commit `0301474e9d5dfc1621fbd02c9f724973c54abbff`. Le blob Git de `parcours-recommandations.js` est **`cebe2b3060cf89926010fd981a0b31bcd5b0c292`**, identique **octet pour octet** au blob testé sur GitHub Actions en P30.

Le module livré ne contient plus `M4_P30_NATIVE_107_TEMPORARY_PROBE`, `GITHUB_ACTIONS`, `readdirSync(`, `process.argv[1]`, ni accès au DOM, stockage ou réseau. Les anciens garde-fous P9/P13/P25 n'ont pas été assouplis.

## Validation réellement effectuée

- **Node 22 natif sur le blob exact de production** : run GitHub **44998295333**, job Audit **137134022715**, **107/107 PASS, 0 FAIL**, avec les 20 suites `wave2-recos-*.test.js` et la suite historique. Le test d'intégrité natif de 5 assertions fait partie de ces 107 cas. Le premier résultat avec un saut de ligne en trop n'est pas utilisé comme preuve bit à bit.
- **Exécution V8 sur le commit nettoyé P31** : **102/102 PASS**, en deux lots de 53 et 49 tests, incluant les matrices de 125 et de 625 trajectoires.
- **CI historique du commit P31** : run **44998384563**, job Audit **137134303571**, **13/13 PASS** selon les logs natifs de GitHub. Les jobs navigateurs et simulations longues étaient encore en cours au moment de ce rapport ; ne pas présumer un succès complet.

## Intégrité du périmètre

Comparaison de la base figée M4 `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` au commit P31 : **36 commits d'avance, 50 fichiers modifiés, zéro hors périmètre**. Seuls `parcours-recommandations.js`, `tests/wave2-recos-*` et `audits/wave2/recommandations/**` ont été modifiés ; **aucun** autre fichier GitHub.

Blobs protégés inchangés : `quizz-parcours.js` = `d0f06f1c259f7a766f2d1c8c47289374a74138dc` ; `quizz.html` = `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`. Le module reste **lecture seule** et n'invente aucune compétence ni seuil.

## Contrat à M5 et au coordinateur

La suite M4 n'est pas déclenchée automatiquement par `training-smoke.yml`, qui appelle seulement les 13 tests historiques. Cette limite est délibérément laissée à M5 et au coordinateur (qui possèdent les workflows et l'interface). Pour la recette permanente sur la branche de synthèse, ajouter **sans instrumenter le module** :

```sh
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js
```

Enregistrer l'empreinte Git du module, les logs avec 107 tests, les résultats des simulations et les captures UI si le coordinateur branche le contrat dans `quizz.html`. Le dossier de transfert fonctionnel est dans `audits/wave2/recommandations/PASSE29_DOSSIER_INTEGRATION_FINAL_20261122.md`.

**PROCHAINE PASSE :** récupérer les conclusions complètes du workflow du commit propre, communiquer le raccordement à M5/coordinateur et, si toutes les preuves M4 sont acquises, clôturer la mission *sur son périmètre* sans fusionner ni publier la PR. **DRAFT/HOLD**.
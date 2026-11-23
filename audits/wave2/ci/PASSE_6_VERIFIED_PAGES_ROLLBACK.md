# M5 — PASSE 6 : contrat Pages et retour arrière simulé

## Sources observées

- [Training smoke 44942138879](https://github.com/CapGui13/QPJB/actions/runs/44942138879), `push` sur `main`, a abouti après la seconde tentative ; [Pages 44943188024](https://github.com/CapGui13/QPJB/actions/runs/44943188024) a ensuite validé la source, checkout du SHA testé, ascendance/diff et déployé QPJB **avec succès** vers 19:52 UTC le 21/11/2026. Déploiement historique **antérieur** à M5, jamais déclenché par cette mission.
- [Pages 44950033475](https://github.com/CapGui13/QPJB/actions/runs/44950033475) lié à une PR : deux jobs **skipped**. Les runs de PR ne doivent pas déclencher de publication.

## Contrat existant, sans changement du verrou

`.github/workflows/verified-pages.yml` filtre `workflow_run.conclusion == 'success'`, `head_branch == 'main'`, `event != 'pull_request'` et une source Pages `workflow`. Il checkout précisément le `head_sha` testé, exige qu'il soit ancêtre de `main` et interdit les modifications de source non validées ; seules les deux exceptions historiques `catalogue.json` et `site-version.json` sont acceptées après ce SHA.

## Contre-épreuves réelles sur un dépôt Git isolé

`tests/wave2-ci-pages-rollback.cjs` **extrait le bloc Bash réel** de la protection de déploiement et l'exécute contre un dépôt et un remote Git **temporaires** (jamais l'origine QPJB). Node 22 et Git 2.47.3 : test local de la logique réussi.

1. SHA exactement testé et encore au HEAD : accepté.
2. Une modification ultérieure du seul `catalogue.json` : acceptée.
3. Une modification ultérieure de `site-version.json` également : acceptée.
4. Une modification ultérieure de `quizz.html` : refus explicite « Modification non validée ».
5. Un SHA sorti de l'historique de `main` après changement d'historique simulé : refus explicite d'ascendance.

Conditions GitHub de succès, branche et absence de PR vérifiées statiquement. La nouvelle suite est exécutée dans l'audit rapide de `training-smoke.yml` ; résultat GitHub Actions sur le SHA P6 à confirmer.

## Procédure de rollback opératoire

Avant fusion : garder la PR brouillon ou la fermer ; aucun rollback de production (main inchangé). Après une éventuelle fusion **expressément autorisée**, si incident : identifier et `git revert` les commits CI sur main (pas de force-push), laisser la recette **entière** Training smoke valider audit + simulations + Chromium + WebKit, puis vérifier la publication et son SHA. Ne jamais déployer depuis une PR, un SHA non ancêtre ou un run rouge. Préserver les artefacts et le manifeste historique des 58 commandes.

**Limite :** seul le contrat Git est effectivement testé, **pas** un rollback de Pages en production (interdit dans M5).

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 7 :** lire les runs P4/P5/P6 et leurs diagnostics, corriger uniquement des anomalies démontrées, confirmer l'absence de dérive avant tout bilan final.

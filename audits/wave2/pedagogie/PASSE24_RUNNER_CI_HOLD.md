# QPJB M1 — PASSE 24 : fiabilisation du lanceur et relais M5

**PASSE 24 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON/HOLD.**

## Défaut concret confirmé
Le lanceur historique `tests/wave2-pedagogie-suite.cjs` validait une sous-exécution réussie si la sortie standard contenait simplement `PASS`. Cette condition ne vérifiait pas que **le bon test** avait émis ce marqueur. Une sortie `PASS wave2-pedagogie-stress` aurait donc pu valider à tort l'étape `wave2-pedagogie-progressions.cjs` pourvu que le processus sorte avec code 0.

## Correction de code
Nouveau `tests/wave2-pedagogie-runner-p24.cjs`, appelé par le lanceur, qui exige **une ligne commençant par le marqueur PASS exact du fichier testé**. Deux intitulés historiques ont une différence de libellé documentée : `parcours.cjs` écrit `wave2-pedagogie` et `contre-expertise-avancee.cjs` écrit `wave2-pedagogie-contre-expertise`. Les autres scripts sont nommés identiquement dans leur sortie.

Le test P24 comprend **5 sorties valides** et **7 faux succès**, incluant un autre test, un préfixe trompeur, un PASS dans une phrase et une sortie vide. Il a été **vraiment exécuté sous Node v22.16.0 dans le conteneur : PASS (12/12 cas)**, avec `node --check` également réussi. Il s'agit **uniquement du nouveau test P24**, pas de la suite complète. La suite passe de 17 à **18 scripts**.

## Véritable état des GitHub Actions et lacune CI
Sur le commit P23 `baf694b9acb376fa9a53a454ac31d66605af35de`, le workflow public `QPJB Training smoke` (run [44956315997](https://github.com/CapGui13/QPJB/actions/runs/44956315997)) a été observé en cours : son job **Audit des données et du code a réussi**, mais il ne lance **aucun** `node tests/wave2-pedagogie-suite.cjs`. Les autres jobs en cours ne représentent pas une validation M1. Les deux variantes de `.github/workflows/training-smoke.yml` (branche M1 et branche M5 `wave2/fiabilite-20261121`) configurent Node 22 mais ne référencent pas cette suite.

Le conteneur local a Node 22.16.0 mais n'arrive pas à résoudre `github.com`. **Aucune exécution Node native des 18 scripts à la suite, et aucune CI GitHub de ces 18 scripts, ne sont attestées.**

## Contrat précis de raccordement (à M5 / coordinateur, pas appliqué dans M1)
Dans une **branche d'intégration contenant les fichiers M1**, ajouter au job `integrity` de `training-smoke.yml` une étape distincte après `actions/setup-node@v4` :

```yaml
- name: Pédagogie SEF M1 — suite documentaire
  run: node tests/wave2-pedagogie-suite.cjs
```

Laisser GitHub Actions bloquer si un script échoue ; fournir URL du run, SHA, logs et sorties des 18 tests. Ce changement de workflow est **hors périmètre M1** et doit être réalisé par M5 ou le coordinateur au moment du raccordement ; ne pas le committer prématurément sur M5 tant que les fichiers de M1 n'existent pas dans sa branche.

## Restant avant clôture
Les **6 clarifications éditoriales** et **11 accords pédagogiques** restent HOLD en attente des référents. Aucun QCM, moteur, interface, workflow, branche d'un autre chantier n'a été touché. **MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P25 uniquement si la suite Node/CI est effectivement exécutée ou si de nouvelles validations écrites permettent un arbitrage réel.** Aucun merge ni publication.

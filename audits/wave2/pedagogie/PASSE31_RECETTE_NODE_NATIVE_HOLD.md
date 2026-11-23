# QPJB M1 — Passe 31 : recette native complète des 20 tests, enfin obtenue

**PASSE 31 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Résultat principal — le vrai dépôt, sans projection ni simulation

Le conteneur local historique ne résout pas `github.com`, mais une **machine de test isolée avec accès réseau** a permis de **cloner réellement** `https://github.com/CapGui13/QPJB.git` et de positionner la branche **`wave2/pedagogie-sef-20261121`** sur le commit intégral :

```
git rev-parse HEAD
0030dc15c27542ea92ace3979f2df64dc02dbc36
node --version
v22.23.5
node tests/wave2-pedagogie-suite.cjs
```

**EXÉCUTION NODE NATIVE COMPLÈTE : PASS.** Les **20 scripts réels du dépôt**, contenant les données pédagogiques et le catalogue **1 523 QCM / 22 thèmes**, sont exécutés par le lanceur normal, **sans adaptation, mocks ni projection des fichiers**. Le processus parent retourne **code 0**. Le journal contient **21 lignes `PASS wave2-pedagogie...`** (20 scripts individuels + le PASS final du lanceur), et se termine par :

```
PASS wave2-pedagogie-payload-p22 : QCM 1523 / 22, SHA-256 JSON, UI libre, mutation du catalogue detectee
PASS wave2-pedagogie-runner-p24 : 5 vrais marqueurs acceptes, 9 faux succes rejetes
PASS wave2-pedagogie-runner-integration-p25 : 20 scripts simules, 8 echecs rejetes, ancien faux succes demontre
PASS wave2-pedagogie-inventaire-p26 : 20 scripts recensés, ancien faux succès reproduit, absence détectée, restauration OK
PASS wave2-pedagogie-suite : 20 tests successifs
```

La deuxième exécution de recette dure **1 247 ms** sur la machine isolée (temps de commande rapporté). Le clone est **propre après exécution** : `git status --porcelain` retourne **0 ligne**.

## Contre-épreuve native d'un changement non autorisé

Sur **une copie de ce même checkout**, un seul identifiant du JSON embarqué a été temporairement modifié, **`SEF-L25-004` → `SEF-L25-0X4`**, sans modifier la structure de la page ou le nombre de QCM. Exécution **réelle du lanceur complet** :

- **code de sortie 1**, échec sur `wave2-pedagogie-progressions.cjs` ;
- empreinte SHA-256 calculée différente de l'empreinte de catalogue figée `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a` ;
- arrêt effectif de la suite à la première erreur ;
- restauration de `quizz.html` depuis une sauvegarde exacte, **`git status --porcelain` de nouveau propre (0 modification)**.

Aucune mutation n'a été committée ou envoyée vers GitHub ; la modification n'existait que dans la machine temporaire.

## Ce que cela résout et ce qui reste

**Blocage Node natif M1 : RÉSOLU.** L'exécution sur les fichiers complets de la branche remplace les anciens contrôles uniquement en JS isolé ou sur projections.

**Blocage CI GitHub Actions : NON RÉSOLU.** Le workflow `.github/workflows/training-smoke.yml` actuel n'invoque pas `node tests/wave2-pedagogie-suite.cjs`. Son raccordement doit être fait par le chantier M5/le coordinateur, sur une branche réunissant M1 et la CI ; aucun workflow n'est modifié ici.

Les **6 clarifications rédactionnelles et 11 accords de paire** attendent toujours des visas humains explicites. Leur dossier prêt à arbitrer est `BULLETIN_17_ARBITRAGES_P29_HOLD.md`. La recette Node verte n'est **pas** une validation pédagogique des accords.

**Changements P31 sur le dépôt :** uniquement ce rapport et un checkpoint de preuve dans `audits/wave2/pedagogie/**`. Aucun QCM, moteur, UI, workflow ni autre branche modifié. Pas de fusion ou publication.

**PASSE 31 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P32 — recette native intégrale avec le HTML réel de M3 pour tester la compatibilité d'intégration, sans écrire sur la branche M3 ; puis transfert précis à M5 pour CI.**

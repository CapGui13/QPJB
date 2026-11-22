# M5 — PASSE 8 : mesures corrigées par les deux nouvelles recettes réussies

## Résultats CI vérifiés (preuves primaires)

- [P4 run 44950070578](https://github.com/CapGui13/QPJB/actions/runs/44950070578), SHA `c9709c95074ca7d8609c8a85c5c4de96b9149ff5`, **4/4 jobs succès** : audit 13 s ; Chromium 259 s ; WebKit 317 s ; parcours long 353 s. Lot07 **51/51 contrôles** par navigateur ; les deux sondes (erreur générique et **vrai détachement d'iframe**) **réussissent en Chromium et WebKit**.
- [P5 run 44950243527](https://github.com/CapGui13/QPJB/actions/runs/44950243527), SHA `ce006684169fb91c06022cdfacac636ff641f594`, **4/4 jobs succès** : audit 11 s ; Chromium 261 s ; WebKit 281 s ; parcours long 279 s. Lot07 **51/51 contrôles** et sondes dans chaque moteur ; contrôle de performance P5 validé dans les logs Actions.
- Les **58 commandes historiques** restent protégées par l'audit et non supprimées ; les garde-fous de P5 ont produit le JSON attendu.

## Réconciliation de la mesure, sans faire disparaître la variabilité

Le snapshot `observed-performance.json` passe de **3 à 5** exécutions optimisées. Les 6 runs historiques antérieurs sont conservés ; jeu de mesures et corrections reproduits par `tests/wave2-ci-performance.cjs`.

| Mesure | Avant (6 runs) | Après (5 runs) | Évolution |
| --- | ---: | ---: | ---: |
| Médiane premier démarrage au dernier achèvement | 579,5 s | **379 s** | **-34,6 %** |
| Médiane somme des durées de jobs | 812,5 job-s | **832 job-s** | **+2,4 %** |

**Attention** : la somme des durées des jobs n'est **pas** la facture réelle GitHub Actions. Ne pas confondre baisse du temps écoulé et baisse du coût de calcul. L'objectif indicatif -25 % en temps écoulé est atteint sur cet échantillon ; le temps cumulé n'a pas baissé de façon démontrée.

Pour mieux distinguer tests lents et runners arrivant en décalé, la mesure expose désormais pour chaque run `wallSeconds - criticalJobSeconds`, **écart observé**, et non une mesure directe de durée de file d'attente :

| Run | Durée mur | Job le plus long | Écart | Somme des jobs |
| --- | ---: | ---: | ---: | ---: |
| 44950070578 | 477 s | 353 s | **124 s** | 942 job-s |
| 44950243527 | 433 s | 281 s | **152 s** | 832 job-s |

Ce sont des exécutions réussies sans test sauté ; les écarts ne prouvent pas à eux seuls la cause de l'attente. Les traces de démarrages décalés sont visibles dans les horodatages des jobs ; la concurrence des cinq chantiers peut être un facteur, sans certitude causale.

## Validation P8

Le script de mesure conserve ses contre-tests qui rejettent WebKit manquant, identifiant de run dupliqué, durée impossible ; il ajoute un détail `staggerByRun`, sans seuil bloquant de plus. Validation syntaxique JS et recalcul sur les cinq observations **réussis**. La recette GitHub Actions sur le nouveau SHA P8 devra être confirmée ; les runs P6 et P7 sont encore en file ou en cours, ne pas les annoncer comme déjà validés.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 9 :** contrôler la CI de P6, P7, P8 et la sûreté du verrou Pages ; corriger une anomalie réelle si elle se manifeste, sinon laisser un état validé sans forcer de clôture prématurée.

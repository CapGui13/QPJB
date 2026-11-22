# M5 — PASSE 9 : recettes P7 et P8 validées, horodatages vérifiables

## Résultats réels
- [P7 run 44950807063](https://github.com/CapGui13/QPJB/actions/runs/44950807063), SHA `2e7abdef457fcc3ca8fbb9459c91ca27ca69a42e` : **4/4 jobs succès**, audit 21 s, Chromium 251 s, WebKit 320 s, parcours long 227 s, durée du premier au dernier job **436 s**.
- [P8 run 44951445806](https://github.com/CapGui13/QPJB/actions/runs/44951445806), SHA `1ec6e60b3358eae6d9ec8330e339313b232c8396` : **4/4 jobs succès**, audit 17 s, Chromium 257 s, WebKit 283 s, parcours long 285 s, durée **391 s**.
- Sur chacun : **51/51 assertions Lot07 Chromium et 51/51 WebKit**, sondes de panne volontaire et de véritable détachement d'iframe validées ; protection des **58 commandes historiques**, garde des 16 contrôles navigateurs et du rollback Pages validés par logs.
- **Sept recettes M5 successives** : runs 44944243351, 44949454425, 44950070578, 44950243527, 44950374169, 44950807063, 44951445806. Toutes terminées en succès à la première tentative. Ce constat ne démontre pas une absence absolue de flakiness.

## Problème corrigé
Le rapport de performance jusqu'à P8 ne stockait que des durées *recopiées* ; une erreur de saisie pouvait échapper aux tests de plausibilité. Le schéma 2 de `audits/wave2/ci/observed-performance.json` ajoute les heures réelles `started_at`/`completed_at` par job, relevées depuis l'API GitHub pour les **13 runs** (6 avant et 7 après). `tests/wave2-ci-performance.cjs` vérifie désormais chaque durée **par recomposition chronologique**, ainsi que le temps mur du premier démarrage au dernier achèvement. Cinq mutations délibérées doivent échouer : suppression WebKit, doublon de run, temps mur erroné, durée de job falsifiée, horaire de fin corrompu.

## Mesures revalidées sur 6 avant / 7 après
| Indicateur | Avant | Après | Évolution |
| --- | ---: | ---: | --- |
| Médiane durée du premier au dernier job | 579.5 s | **391 s** | **32.5 %** de réduction |
| Médiane somme des durées des jobs | 812.5 job-s | **832 job-s** | 2.4 % de hausse |

Les durées excluent l'attente avant le premier démarrage. La somme des durées n'est pas la facture GitHub. Aucun seuil de rapidité ne bloque la publication : warnings seulement. **Tests locaux P9** : syntaxe JS, contrôle des 13 historiques, calcul et cinq contre-mutations **réussis** ; le nouveau SHA devra encore passer la CI GitHub complète.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 10 :** examiner le run P9, la publication restée verrouillée et la pertinence d'autres corrections réelles. Ne pas merger, publier ou toucher à d'autres branches.

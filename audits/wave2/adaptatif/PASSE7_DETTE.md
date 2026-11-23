# M2 — PASSE 7 : dette de rappels, unités honnêtes et vieillissement

**PASSE 7 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Problème réel du banc, pas preuve de défaut pédagogique

Le premier indicateur `weakDueRecallRate` faisait le ratio entre **sélections de rappels faibles** et la **somme d'opportunités répétées** de rappel : un même QCM restant dû pendant 40 séances multiplie le dénominateur par 40. Ce ratio n'est **pas** la proportion de QCM distincts rappelés et ne doit jamais être nommé « taux de rappel individuel ». Les résultats P2/P3/P4/P5 restent reproductibles, mais leur interprétation nécessite cette clarification.

Instrumentation corrigée dans `tests/wave2-adaptatif-benchmark.cjs` **sans changement de moteur** : `weakDueEverDistinct` = nombre distinct d'IDs jamais dus, `weakDueRecalledDistinct` = IDs dus revus au moins une fois, `weakDueDistinctEverRecalledShare` = rapport des deux ; `weakDueOutstandingAtEnd` = nombre de QCM faibles dus à la fin, `weakDueOverdue20AtEnd` = sous-ensemble en retard ≥20 séances depuis leur `due`; `weakDueOldestOverdueAtEnd` = retard maximal, `weakDueBacklogAverage/Maximum` = taille du stock observé au début des séances. Ces indicateurs ne déduisent aucune preuve de maîtrise nouvelle.

## 5 profils × 65/153 séances, graine 11

| Profil | Séances | QCM distincts dus | Distincts revus | % distincts revus (sur tous jamais dus) | Dus faibles en fin | Retard ≥20 séances en fin | Retard maximal (séances) |
|---|---:|---:|---:|---:|---:|---:|---:|
| autonome | 65 | 0 | 0 | n/a | 0 | 0 | n/a |
| echecs | 65 | 475 | 58 | 12.2 % | 473 | 306 | 63 |
| modere | 65 | 155 | 95 | 61.3 % | 75 | 35 | 57 |
| aides | 65 | 397 | 71 | 17.9 % | 375 | 224 | 63 |
| progression | 65 | 327 | 74 | 22.6 % | 287 | 207 | 63 |
| autonome | 153 | 0 | 0 | n/a | 0 | 0 | n/a |
| echecs | 153 | 1135 | 109 | 9.6 % | 1124 | 951 | 151 |
| modere | 153 | 374 | 227 | 60.7 % | 177 | 119 | 132 |
| aides | 153 | 924 | 151 | 16.3 % | 858 | 719 | 151 |
| progression | 153 | 476 | 209 | 43.9 % | 297 | 282 | 151 |

Les 10 trajectoires supplémentaires représentent **10 900 réponses synthétiques**. Toutes les statistiques originales de référence P2 sont **strictement identiques** après enrichissement des métriques. Reprise d'état actif, sauvegardes, export/import et vérifications de 1 523 QCM / 22 rubriques passent dans le banc V8.

## Lecture et limites de mesure

- Le groupe `echecs` réussit environ 6 % des questions : le stock de cas faibles croît mécaniquement bien au-delà des deux places de rappels disponibles par séance. Une dette de 1 124 QCM ne veut pas dire 1 124 erreurs d'un élève réel.
- `aides` et `progression` présentent aussi un vieillissement du stock. La stratégie de découverte encore active explique en partie la saturation.
- Le ratio « distincts revus / jamais dus » **ne représente ni la fréquence moyenne de rappel ni une probabilité de succès** ; il reste borné par le nombre de positions et dépend du temps d'entrée de chaque QCM dans le stock.
- Une question due en fin de simulation n'a pas forcément eu une occasion raisonnable d'être reprogrammée, et les 3 graines restent à confronter dans une passe ultérieure.
- Aucune escalade aveugle du quota : P4 a déjà montré qu'on sacrifie la diversité.

## Suite — problème concret à tester sans nouveau quota

**PASSE 8 :** faire varier uniquement l'arbitrage **entre rappels faibles déjà dus**, en favorisant les plus anciens tout en gardant le quota de deux. Comparer sur 65 puis 153 séances les stocks finaux en retard ≥20 séances, le plus ancien rappel, le nombre d'IDs/familles distincts et la variété des thèmes. Si aucun résultat dominant, documenter le rejet, préserver le moteur exact et laisser le bilan en HOLD pour revue Node.

**HOLD :** aucun changement de QCM, d'interface, de rubriques ou de branche tierce. Les nouveaux tests restent exécutés dans V8 avec adaptateurs Node, non dans la CLI Node du dépôt.

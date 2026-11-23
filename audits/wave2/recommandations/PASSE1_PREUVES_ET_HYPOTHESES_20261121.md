# QPJB — Vague 2 / Mission 4 — Passe 1 : inventaire des preuves et limites

**Statut : PASSE 1 FINIE ; MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Références vérifiées sur la base figée
- Commit de départ : `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- Module : `parcours-recommandations.js`, blob `9709980afe548040d3117eecc80fb81e4f0a22cf`.
- Tests existants : `tests/parcours-recommandations-v1.test.js`, blob `0b3628a35b658e5cc775d41d225dcbafe87c1e5d` : **13 scénarios déclarés**.
- Moteur V1, lu seulement : `quizz-parcours.js`, blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc`.
- Cet inventaire repose sur l'inspection du code et des tests existants, **pas sur une nouvelle campagne d'exécution des tests**.

## Sources de preuve réellement utilisées
| Source V1 | Rôle du module | Limite impérative |
|---|---|---|
| `active` | reprise de séance et réponses déjà consignées | aucune inférence de réussite future |
| `journal` | comptage des résultats par séance, avec dédoublonnage | anciennes séances sans journal non reconstituées |
| `micros` / `axes` | score, essais, indépendance, dernière preuve | clés inconnues ignorées ; ne pas créer de nouveaux axes |
| `consolidationPlan(state, exercises, 10)` | confirme qu'une révision complémentaire existe | absent si catalogue non transmis ou séance en cours |
| `completed` | séances effectivement terminées | une séance de consolidation ne compte pas comme séance ordinaire |
| `entries` / `skills` | lecture éventuelle d'activité (mais non preuve ajoutée) | `seen`, `streak` et niveau débloqué ne valent pas maîtrise |

## Classement des réponses
- `correct` et sans `assisted` / `hadFreeError` → `autonomous` ;
- `correct` après proposition ou première erreur libre → `helped` ;
- `wrong` → `wrong` ; `skipped` → `skipped`.
- Le journal de consolidation est présenté séparément et ne vaut pas promotion de niveau.

## Six familles de recommandations existantes
| Type | Priorité numérique (plus petit = avant) | Déclencheur |
|---|---:|---|
| `resume` | 5 | séance active |
| `persistent_difficulty` | 20 | `score <= -2` et au moins deux essais |
| `revision_session` | 30 | plan de consolidation effectivement disponible |
| `consolidate` | 40 | score inférieur à 2, au moins deux essais et au moins une réponse non autonome |
| `repeated_autonomous` | 70 | score 3, au moins trois preuves indépendantes, preuve non produite pendant la séance courante |
| `not_evaluated` | 90 | aucune preuve exploitable |

La page publique plafonne actuellement l'affichage à **3 conseils** (`maxRecommendations:3`), alors que l'API en accepte jusqu'à 10. Ce décalage est volontairement étudié en V2, sans changer l'UI depuis cette branche.

## Hypothèses à éprouver (PAS des bugs confirmés)
1. **Doublons micro/axe.** Deux conseils portant sur la même difficulté vécue par l'élève peuvent occuper plusieurs des trois places visibles. Mesurer les cooccurrences avant de proposer un regroupement.
2. **Conseils masqués.** Plusieurs difficultés persistantes peuvent éclipser une proposition de révision disponible ou les réussites autonomes répétées. Éprouver la pertinence des priorités plutôt que changer arbitrairement les scores.
3. **Anciennes sauvegardes.** Le chargement peut préserver une activité synthétique tout en ayant zéro journal détaillé. Les conseils doivent afficher leurs limites, pas reconstruire des réponses fictives.
4. **Reprise + consolidation.** Une séance active prime toujours sur la création d'une nouvelle révision ; vérifier que toutes les autres recommandations restent cohérentes dans cet état.
5. **Grand volume longitudinal.** Vérifier avec de vrais états produits par le moteur (65 puis 153 séances), et non des tableaux fictifs non représentatifs.

## Passe 2 attendue
- Ajouter des scénarios automatisés ciblant les cinq hypothèses, utilisant `QPJBParcours.record` et `finish` réels pour créer les états.
- Mesurer le nombre de recommandations distinctes pertinentes effectivement visibles sous limite de 3 ; séparer « recommandations non affichées » et « recommandations incohérentes ».
- Ne modifier aucune note ni sauvegarde ; réserver le regroupement ou changement de priorité à une passe ultérieure **si** l'expérience étaye l'amélioration.

**Aucune correction appliquée aux QCM, aucun changement du moteur, aucun changement de l'interface. PR en brouillon / HOLD.**

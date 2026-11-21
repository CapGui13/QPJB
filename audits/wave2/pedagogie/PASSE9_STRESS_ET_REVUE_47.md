# QPJB — M1 / Passe 9 : tests de résistance et file de contre-lecture

**PASSE 9 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## Comparaison P3 → P7 sur les données réelles
Les **mêmes 1 523 exercices / 22 rubriques / 36 exclusions** sont utilisés. P3 a été reconstruit selon sa règle initiale (tri N croissant puis ID, unicité de famille et signature par rubrique). P7 est lu depuis son manifeste figé.

| Profil | Remplacements | Réponses distinctes par rubrique P3→P7 | Séquences distinctes par rubrique P3→P7 | Motifs distincts par rubrique P3→P7 | Marqueurs de revue P3→P7 |
|---|---:|---:|---:|---:|---:|
| Découverte | 8 / 20 | 15 → **20** | 7 → **8** | 6 → 11 | 20 → 19 |
| Consolidation | 23 / 40 | 28 → **40** | 27 → **40** | 16 → 33 | 34 → 27 |
| Approfondissement | 16 / 32 | 25 → **32** | 24 → **32** | 24 → 30 | 2 → 2 |

**47 substitutions exactes** (8 + 23 + 16), 45 IDs repris, toujours 92 IDs et 92 familles distinctes. Pour chaque rubrique, la variété des **réponses**, des **enchères complètes** et des **motifs de difficulté textuels** augmente dans ce prototype. Ce sont des **proxies descriptifs**, pas une garantie d'apprentissage. Les marqueurs `pedagogicalReview*` ne reflètent que la présence d'une métadonnée d'audit : leur absence **ne signifie pas** qu'aucune revue n'a jamais eu lieu.

## Contre-épreuve structurelle, 92 cas
- 92/92 mains à 13 cartes, `h` recalculé égal au stocké, formes cohérentes avec les quatre couleurs, 4 choix distincts, bonne réponse parmi les choix, explication non vide.
- **0 anomalie structurelle** détectée ; les 47 cas nouvellement sélectionnés satisfont les mêmes critères.
- 7 cas ont une séquence `auction=[]` ; ce n'est pas automatiquement une erreur (décision d'ouverture possible). La source du contexte doit être relue avant de parler d'absence d'information.
- Les mesures ne vérifient ni la pertinence des distracteurs ni les conventions à enseigner avant chaque phase.

## Risque réel révélé
La nouvelle sélection pousse plus de cas N4/N5, dont certains ne portent pas de marqueur de revue éditoriale. Dans les 92 sélectionnés, marqueur présent : **19/20** en découverte, **27/40** en consolidation, **2/32** en approfondissement. Parmi les **47 remplacements**, **15 cas N4/N5** sans marqueur sont placés en **priorité P1 pour revue humaine**. Ils ne sont pas qualifiés d'erronés.

File exploitable : `FILE_REVUE_P9_47_HOLD.json` (47 IDs, palier, thème, niveau, présence du marqueur et ordre de priorité), sans modification du catalogue.

## Test reproductible et tests négatifs
`node tests/wave2-pedagogie-stress.cjs` : reconstruit P3, compare à P7, recalcule les métriques, contrôle la file de 47, la validité des 92 QCM et vérifie que des corruptions **en mémoire** (mauvais total H, réponse absente, doublon de choix) sont bien détectées. La comparaison du test existant `wave2-pedagogie-progressions.cjs` reste le garde-fou primaire pour reproduire la sélection et les 36 exclusions. Ces tests restent documentaires et non branchés dans `training-smoke.yml` (périmètre CI réservé aux autres missions).

## Porte d'intégration
Les nombres de diversité et de difficulté sont favorables à P7, mais **pas suffisants pour fusionner** : 15 cas avancés N4/N5 sans marqueur nécessitent une contre-lecture prioritaire, puis une vérification des transitions d'apprentissage. **PROCHAINE PASSE : P10 — audit individuel ciblé des cas P1 de la file P9, avec décision SEF et identification de nouveaux blocages éventuels ; ne pas appliquer de correction.**

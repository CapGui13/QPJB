# M2 — PASSE 3 : protection supplémentaire des fondamentaux, candidat non déployé

**PASSE 3 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Hypothèse et code d'expérience

Avec au moins 10 observations de fondamentaux sur les 8 dernières séances, taux de fragilité ≥50 %, et ≥75 % pour « sévère », le moteur pénalise déjà les QCM de niveau 4–5 (−250 sévère / −110 autre). Le candidat P3 essaie **−520 / −220**, uniquement dans le score de nouveaux cas, sans désactiver les rubriques, modifier le catalogue, les seuils de maîtrise, les sauvegardes ni le quota de rappels.

Patch **en mémoire**, implémenté par `tests/wave2-adaptatif-candidates.cjs --variant foundation`, comparé au moteur de référence P2. Aucun changement de politique pédagogique publié. 5 profils × (65 + 153 séances) × graine 11 = **10 trajectoires**, 10 900 réponses synthétiques.

## Comparaison avec la référence, graine 11

| Profil | Séances | Difficiles 4–5 % (base → candidat) | Δ IDs uniques | Δ familles uniques | Fondamentaux % (base → candidat) | Rappels % (base → candidat) |
|---|---:|---:|---:|---:|---:|---:|
| autonome | 65 | 40.00 → 40.00 | 0.00 | 0.00 | 28.92 → 28.92 | 9.08 → 9.08 |
| autonome | 153 | 28.89 → 28.89 | 0.00 | 0.00 | 42.61 → 42.61 | 10.00 → 10.00 |
| echecs | 65 | 0.00 → 0.00 | 0.00 | 0.00 | 73.69 → 73.69 | 19.54 → 19.54 |
| echecs | 153 | 9.35 → 9.15 | 0.00 | -4.00 | 58.76 → 58.50 | 19.80 → 19.80 |
| modere | 65 | 14.15 → 14.15 | 0.00 | 0.00 | 38.15 → 38.15 | 19.69 → 19.69 |
| modere | 153 | 27.84 → 27.84 | 0.00 | 0.00 | 35.82 → 35.82 | 19.87 → 19.87 |
| aides | 65 | 0.31 → 0.00 | 0.00 | 2.00 | 74.77 → 74.62 | 19.54 → 19.54 |
| aides | 153 | 9.87 → 9.15 | 0.00 | -11.00 | 57.71 → 56.47 | 19.80 → 19.80 |
| progression | 65 | 1.69 → 0.00 | 0.00 | -7.00 | 66.92 → 68.31 | 19.54 → 19.54 |
| progression | 153 | 28.24 → 25.23 | 0.00 | -8.00 | 44.12 → 43.59 | 19.80 → 19.80 |

Tous les cas conservent 22 rubriques observées. Les 10 QCM restent distincts dans chaque séance. `uniqueFamilies` mesure `theme + caseFamily`, sans présumer la maîtrise.

## Verdict provisoire

- Le durcissement de pénalité réduit certains QCM difficiles à 65/153 séances, surtout pour les profils avec aides ou progression initiale ; il peut cependant réduire les familles distinctes et déplacer la couverture vers d'autres contextes.
- Il n'améliore pas à lui seul la proportion de rappels : la structure à deux positions de rappel reste inchangée.
- Ce n'est pas une preuve de gain d'apprentissage ni encore un candidat dominant : contre-épreuves sur graines 29 et 47 en P5 obligatoires. S'il n'est pas dominant sur variété et expositions, **ne pas modifier** le moteur.

## Tests et limites

Les 10 trajectoires ont exécuté le CommonJS avec adaptateur de lecture/assertions V8, pas la CLI Node réelle. Les journaux, sauvegardes, 1 523 QCM et 22 rubriques sont contrôlés par le banc. JSON bruts `PASSE3_FOUNDATION_*json`.

**PROCHAINE PASSE : P4** autre famille de candidats : 3 rappels planifiés au lieu de 2 ; mesurer le prix exact en couverture d'IDs/familles/contextes avant toute décision. Puis P5 contre-tests multi-graines, sauvegardes interrompues et P6 verdict. **HOLD**.

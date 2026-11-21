# QPJB — Vague 2 / M1 — Passe 2 : prérequis, contextes et hypothèses vérifiables

**PASSE 2 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Sources et garde-fous
- Catalogue figé : 1 523 IDs uniques, 22 rubriques, extrait du JSON inchangé de `quizz.html` à la base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` (ligne de contexte PR #254).
- Ordre d'introduction : constante `ROADMAP` de `quizz-parcours.js`, blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc` (lecture seule). Les numéros sont les **indices de séances à partir de zéro**, et non des prérequis validés individuellement.
- Les 36 propositions historiques sont exclues de toute nouvelle rédaction et ne sont pas appliquées.

## Introduction effective et diversité observable

| Thème | Séance initiale (index 0) | QCM | N1+N2 | N4+N5 | Contextes d'ouverture | Situations ouverture+réponse | Familles | Propositions historiques |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ouv` | 0 | 84 | 72 | 2 | 2 | 11 | 55 | 0 |
| `mineur` | 1 | 84 | 72 | 4 | 3 | 20 | 58 | 12 |
| `majeur` | 1 | 85 | 71 | 5 | 2 | 18 | 57 | 0 |
| `sa` | 3 | 86 | 64 | 12 | 3 | 22 | 66 | 0 |
| `red` | 4 | 124 | 45 | 29 | 4 | 46 | 114 | 0 |
| `second` | 6 | 121 | 54 | 17 | 4 | 39 | 113 | 0 |
| `stayman` | 7 | 65 | 34 | 10 | 2 | 17 | 59 | 0 |
| `intervenir` | 10 | 65 | 22 | 3 | 6 | 29 | 47 | 0 |
| `contre` | 12 | 64 | 29 | 24 | 6 | 39 | 56 | 0 |
| `apres_inter` | 14 | 146 | 40 | 63 | 4 | 60 | 136 | 0 |
| `barrage` | 17 | 65 | 26 | 22 | 9 | 40 | 52 | 0 |
| `apres_fit` | 8 | 48 | 9 | 13 | 2 | 17 | 48 | 8 |
| `reponse_inter` | 13 | 67 | 25 | 20 | 5 | 36 | 56 | 0 |
| `reveil` | 19 | 60 | 16 | 33 | 5 | 42 | 46 | 0 |
| `roudi` | 22 | 38 | 11 | 9 | 2 | 15 | 35 | 9 |
| `drury` | 24 | 40 | 8 | 11 | 1 | 11 | 36 | 3 |
| `fortes` | 26 | 42 | 3 | 26 | 3 | 24 | 42 | 0 |
| `forcing` | 28 | 54 | 1 | 42 | 4 | 25 | 54 | 0 |
| `multilandy` | 32 | 31 | 3 | 13 | 1 | 10 | 31 | 2 |
| `rubensohl` | 34 | 49 | 7 | 24 | 1 | 13 | 49 | 2 |
| `michaels` | 36 | 40 | 9 | 10 | 4 | 28 | 40 | 0 |
| `chelem` | 39 | 65 | 0 | 44 | 7 | 25 | 65 | 0 |

**Interprétation prudente :** un contexte = premier appel d'enchère visible dans `auction[0]`, une situation = ce contexte + réponse correcte. Ces proxies ne prouvent ni l'unicité d'une règle SEF ni la diversité de mains. Les familles proviennent de `caseFamily` et ne sont pas des preuves d'acquisition.

## Risques pédagogiques objectivement observables
- Le moteur ouvre `ouv` à l'index 0, `majeur` et `mineur` à 1, mais `sa` seulement à 3 : le classement `Débutant` du catalogue ne signifie donc pas une exposition immédiate de tous les thèmes de base.
- `red` commence à l'index 4 avec 0 QCM N1 et 45 N2 ; `second` commence à 6 avec 4 N1 ; `apres_fit` commence à 8 avec 0 N1. Cela constitue un **écart de difficulté d'entrée mesurable**, pas une preuve que les élèves échouent.
- `roudi` commence à l'index 22 (38 QCM, 11 N2) et `drury` à 24 (40 QCM, 8 N2). Un élève débutant ne doit pas être évalué sur ces conventions avant introduction explicite.
- `chelem` est introduit à 39, sans N1/N2 ; aucune obligation artificielle de rendre ce thème facile.
- Les 36 propositions sont concentrées sur `mineur` (12), `apres_fit` (8), `roudi` (9), `drury` (3), `multilandy` (2), `rubensohl` (2). Les cas existants ne doivent pas être présentés comme de nouvelles anomalies.

## Distinction entre constat et lacune
- **Prouvé :** distribution de niveaux et d'indices d'introduction, variété des contextes observables, concentration documentaire.
- **À vérifier avant correction :** taux de rappel et difficulté réellement sélectionnée par profil, adéquation d'une main au niveau, alternatives SEF acceptables, erreurs individuelles démontrables.
- **Non inférable :** taux de réussite élève, compétence maîtrisée, équivalence pédagogique entre familles.

## Échantillon de contre-examen hors des 36 cas historiques

| ID | Thème | Niveau | Enchère attendue | Motif courant |
|---|---|---:|---|---|
| `SEF-N051-2` | majeur | 3 | 2SA | Reconnaître le 2SA fitté à trois atouts avec une force propositionnelle après 1♥. |
| `SEF-N056-1` | majeur | 3 | 2SA | Reconnaître le 2SA fitté à trois atouts avec une force propositionnelle après 1♠. |
| `SEF-N067-1` | majeur | 3 | 2♦ | Distinguer soutien majeur et réponse forcing dans une couleur sixième avec une force suffisante. |
| `SEF-V4-002-1` | apres_fit | 3 | 2SA | Apprécier une main non minimale pour proposer la manche |
| `SEF-V4-004-1` | apres_fit | 3 | 2SA | Apprécier une main non minimale pour proposer la manche |
| `SEF-V4-006-2` | apres_fit | 4 | 3♥ | Distinguer le barrage d’une proposition de manche |
| `SEF-V4-007-1` | apres_fit | 3 | 4♥ | Réévaluer la force avec une courte et un fit établi |
| `SEF-V4-007-2` | apres_fit | 3 | 4♥ | Réévaluer la force avec une courte et un fit établi |
| `SEF-V4-008-1` | apres_fit | 3 | 4♥ | Réévaluer la force avec une courte et un fit établi |
| `SEF-V4-009-1` | apres_fit | 3 | 3♥ | Après 1♥–2♥–2SA, refuser l'essai généralisé avec un soutien minimum de 6 HLD. |
| `SEF-V4-011-1` | apres_fit | 3 | 3♥ | Distinguer soutien minimum et acceptation de manche après 1♥–2♥–2SA. |
| `SEF-V4-012-1` | apres_fit | 3 | 4♥ | Déterminer le bon niveau après découverte du fit |
| `SEF-V4-014-1` | apres_fit | 3 | 2SA | Apprécier une main non minimale pour proposer la manche |
| `SEF-V4-016-2` | apres_fit | 3 | 2SA | Apprécier une main non minimale pour proposer la manche |
| `SEF-V4-018-1` | apres_fit | 4 | 3♠ | Distinguer le barrage d’une proposition de manche |
| `SEF-V4-019-1` | apres_fit | 3 | 4♠ | Réévaluer la force avec une courte et un fit établi |
| `SEF-V4-020-1` | apres_fit | 3 | 4♠ | Réévaluer la force avec une courte et un fit établi |
| `SEF-V4-020-3` | apres_fit | 3 | 4♠ | Réévaluer la force avec une courte et un fit établi |

Cet échantillon est une **file d'audit**, non une liste d'erreurs. Toute correction P5 exige vérification de la main, séquence, réponses et référence SEF. Prochaine passe : parcours alternatifs sur IDs existants et mesure de faisabilité.

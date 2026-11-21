# QPJB — Vague 2 / Mission 1 — Passe 1 : cartographie de couverture

**Statut : PASSE 1 FINIE ; MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Traçabilité / méthode
- Base figée : `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` ; fichier `quizz.html` blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`.
- Le JSON embarqué a été extrait de la ligne de contexte **inchangée** du diff de la PR #254, dont le contenu de la page est resté identique sur `main` pour le catalogue. Contrôles : 1 523 exercices, 1 523 IDs distincts, 22 thèmes.
- Les 36 dossiers éditoriaux non validés proviennent de deux fichiers déjà présents sur `main` (blobs `f73719cc80a8b1f2c83f17bb125c6c1b675c7fb7` et `96e918c3d21e4831edab6577f153070db4cebc4f`) ; tous leurs IDs existent dans le catalogue.
- Comptages réalisés sur les enregistrements réels. Ces volumes sont un inventaire, **pas un audit de qualité pédagogique** ni une preuve d'efficacité du tirage.

## Distribution globale

| Indicateur | Valeur |
|---|---:|
| QCM / IDs uniques | 1523 / 1523 |
| Rubriques | 22 |
| Paires (rubrique, famille) distinctes | 1315 |
| Étape Débutant | 253 (16,6 %) |
| Étape Consolidation | 989 (64,9 %) |
| Étape Approfondissement | 281 (18,5 %) |
| Niveaux 1 à 5 | 142 / 479 / 466 / 342 / 94 |
| Propositions éditoriales déjà ouvertes, non appliquées | 36 |

## Détail des 22 rubriques

| Rubrique | Étape | QCM | N1 | N2 | N3 | N4 | N5 | Familles | Dossiers existants |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `ouv` — Choisir son ouverture | Débutant | 84 | 40 | 32 | 10 | 1 | 1 | 55 | 0 |
| `mineur` — Répondre à 1♣ / 1♦ | Débutant | 84 | 44 | 28 | 8 | 4 | 0 | 58 | 12 |
| `majeur` — Répondre à 1♥ / 1♠ | Débutant | 85 | 28 | 43 | 9 | 5 | 0 | 57 | 0 |
| `sa` — Répondre à 1SA / 2SA | Consolidation | 86 | 26 | 38 | 10 | 10 | 2 | 66 | 0 |
| `red` — La redemande de l’ouvreur | Consolidation | 124 | 0 | 45 | 50 | 22 | 7 | 114 | 0 |
| `second` — La 2e enchère du répondant | Consolidation | 121 | 4 | 50 | 50 | 15 | 2 | 113 | 0 |
| `stayman` — Après Stayman et Texas | Consolidation | 65 | 0 | 34 | 21 | 7 | 3 | 59 | 0 |
| `intervenir` — Interventions | Consolidation | 65 | 0 | 22 | 40 | 3 | 0 | 47 | 0 |
| `contre` — Après un contre d’appel | Consolidation | 64 | 0 | 29 | 11 | 22 | 2 | 56 | 0 |
| `apres_inter` — Après intervention adverse | Consolidation | 146 | 0 | 40 | 43 | 36 | 27 | 136 | 0 |
| `barrage` — Barrages simples à la couleur | Consolidation | 65 | 0 | 26 | 17 | 18 | 4 | 52 | 0 |
| `apres_fit` — Après un fit majeur | Consolidation | 48 | 0 | 9 | 26 | 11 | 2 | 48 | 8 |
| `reponse_inter` — Répondre à une intervention | Consolidation | 67 | 0 | 25 | 22 | 18 | 2 | 56 | 0 |
| `reveil` — Réveils simples | Consolidation | 60 | 0 | 16 | 11 | 29 | 4 | 46 | 0 |
| `roudi` — Le Roudi | Consolidation | 38 | 0 | 11 | 18 | 8 | 1 | 35 | 9 |
| `drury` — Le Drury | Consolidation | 40 | 0 | 8 | 21 | 11 | 0 | 36 | 3 |
| `fortes` — Ouvertures fortes et réponses | Approfondissement | 42 | 0 | 3 | 13 | 17 | 9 | 42 | 0 |
| `forcing` — Troisième et quatrième couleur forcing | Approfondissement | 54 | 0 | 1 | 11 | 36 | 6 | 54 | 0 |
| `multilandy` — Défense contre 1SA : Multi-Landy | Approfondissement | 31 | 0 | 3 | 15 | 9 | 4 | 31 | 2 |
| `rubensohl` — Après intervention sur notre 1SA | Approfondissement | 49 | 0 | 7 | 18 | 22 | 2 | 49 | 2 |
| `michaels` — Interventions bicolores (Michaels) | Approfondissement | 40 | 0 | 9 | 21 | 7 | 3 | 40 | 0 |
| `chelem` — Contrôles, Splinters et Blackwood | Approfondissement | 65 | 0 | 0 | 21 | 31 | 13 | 65 | 0 |

## Constats à explorer (non conclusifs)
- `apres_inter` (146), `red` (124) et `second` (121) sont les rubriques les plus fournies ; `multilandy` (31), `roudi` (38) et `drury` (40) parmi les moins fournies. **Les volumes seuls ne prouvent pas une lacune.**
- `chelem` possède 0 QCM de niveau 1 ou 2, cohérent avec un thème d'approfondissement : ne pas corriger artificiellement cette distribution.
- Le nombre de familles est un indicateur distinct du nombre de QCM ; il faut encore mesurer les décisions/séquences/distracteurs avant de juger les quasi-doublons ou les trous de progression.
- Les 36 propositions documentaires se trouvent déjà dans la base : ne pas relancer leur rédaction ni les appliquer sans validation humaine séparée.
- Il faut comparer les prérequis réellement utilisés par le parcours V1 et les rubriques effectivement introduites avant de proposer un ordre d'apprentissage.

## Passe 2 (à poursuivre)
1. Reconstituer la carte des prérequis et les seuils d'introduction depuis `quizz-parcours.js` (lecture seule).
2. Quantifier les décisions et les contextes distincts, et rechercher des trous prouvés par ID plutôt que par volume.
3. Confronter prioritairement réponses aux mineures, soutiens majeurs, enchères d'essai et Roudi aux accords pédagogiques validés, sans retoucher les 36 propositions historiques.

La PR de cette branche est **brouillon / HOLD**, sans fusion ni publication.

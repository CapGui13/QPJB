# QPJB Quizz — contre-expertise de 2 réserves et revue de 24 ouvertures
*4 novembre 2026 · Lot V4.55*

## Périmètre et contrôles

Uniquement le **Quizz de 993 exercices (22 rubriques, 3 972 choix)**. Aucun changement à l'Entraînement (677 exercices), aux PBN, aux modules de jeu de la carte ou à la PWA.

Deux dossiers disposaient déjà d'une revue datée **sous réserve** ; ils font l'objet d'une **contre-expertise distincte**, sans être comptés deux fois parmi les nouvelles revues. Les vingt-quatre ouvertures n'avaient pas de verdict individuel daté : examen du nombre de cartes, des points H, de la distribution, des quatre choix, de la priorité majeure cinquième / ouverture à SA / meilleure mineure, des seuils de force et des cas faibles.

## Contre-expertise 1 — `SEF-V417-008` : 4♠ conservé

**Séquence :** 1♠ – 2♣ – 2♠. **Répondant :** ♠D54 ♥52 ♦AR8 ♣RV732, 13 H.
Choix : 3♣, 3♠, 4♠, 3SA. **Réponse retenue : 4♠.**

- Après un changement de couleur au palier 2, la répétition des Piques par l'ouvreur montre une longue majeure. Trois atouts suffisent pour un fit au moins neuvième dans la séquence enseignée.
- La Fédération française de bridge enseigne explicitement dans la séquence **1♠–2♣–2♠–3♠** que **3♠ signifie une recherche de chelem**, non une simple invitation à la manche. Ce fait éclaircit le distracteur.
- La main de 13 H a des valeurs utiles (♦AR, ♣RV), mais ne possède ni les premiers honneurs d'atout ni contrôle à Cœur : **4♠ est la conclusion de manche prudente**. Une exploration de chelem par 3♠ doit correspondre à des ambitions réelles, pas au seul fait de posséder 13 H.
- **Décision : réserve levée dans le cadre du Quiz et de ses quatre choix** ; 4♠ conservé, explication améliorée. Cela ne veut pas dire que 3♠ serait conventionnellement illégal ou que 4♠ serait optimal sur toutes les mains possibles de l'ouvreur.

**Références :** [FFB — livret Espérance par paires 2014, séance 2, donne 7, page 9](https://cdn.ffbridge.fr/cms/articles/0001/04/6afb5268192c73b00911f14e6527ee4fa0468985.pdf) ; [Adelie Bridge Club — soutien direct ou différé](https://www.adeliebridge.fr/soutien-direct-ou-soutien-differe/).

## Contre-expertise 2 — `SEF-V426-004` : Passe conservé

**Séquence :** partenaire ouvre de 2♥ faible, adversaires passent.
Main : ♠AD83 ♥94 ♦RV75 ♣R103, 13 H. Choix : Passe, 3♦, 3♠, 4♥.

- Seulement **deux atouts** à Cœur, pas de nouvelle couleur de cinq cartes, pas de base sûre pour imposer la manche. 3♦ et 3♠ ne décrivent pas une longueur constructive ; 4♥ serait un saut injustifié.
- iBridge donne un exemple explicite : **avec 13 H sans fit sur 2♥ faible, Passe**. L'enchère de 2SA est un relais de recherche de manche destiné à des mains plus constructives ; elle ne devient pas obligatoire parce qu'on possède 13 H.
- **Décision : réserve levée parmi les quatre choix**, en rappelant que la disponibilité de 2SA relève d'une convention étudiée, mais ne transforme pas cette main en main de manche.

**Références :** [iBridge — répondant après 2 majeur faible, niveau 2](https://www.ibridge.fr/public/fichedetails/152) ; [iBridge — répondant après 2 majeur faible, niveau 1](https://dev.ibridge-club.fr/public/fichedetails/54).

**Traçabilité :** les anciennes réserves `reserve_option_3pique_exploration_chelem` et `reserve_relais_2sa_non_propose` sont conservées dans `pedagogicalCounterExpertise20261104V455.previousVerdict` ; les anciens textes sont archivés dans `sourceOriginalExplain20261104V455`. Les bonnes réponses ne sont pas modifiées.

## Vingt-quatre ouvertures : revue individuelle

| N° | ID | H | Distribution | Enchère | Raisonnement |
|---:|---|---:|---|---|---|
| 1 | `SEF-001-1` | 15 | 3-3-4-3 | **1SA** | 15 H, 3-3-4-3 : la zone 15–17 H et une distribution régulière commandent 1SA, et non l’ouverture de 1♦. |
| 2 | `SEF-001-2` | 16 | 3-3-4-3 | **1SA** | 16 H, distribution 3-3-4-3 : 1SA décrit la force ; 2SA promet 20–21 H. |
| 3 | `SEF-002-3` | 15 | 4-3-3-3 | **1SA** | 15 H, 4-3-3-3 : quatre Piques ne constituent pas une majeure cinquième, 1SA est prioritaire. |
| 4 | `SEF-002-1` | 17 | 4-3-3-3 | **1SA** | 17 H, 4-3-3-3 : 1SA reste conforme malgré les quatre Piques et l’absence de mineure quatrième. |
| 5 | `SEF-003-2` | 15 | 3-2-5-3 | **1SA** | 15 H, 3-2-5-3 : cinq Carreaux en main régulière 5-3-3-2 n’empêchent pas 1SA. |
| 6 | `SEF-003-1` | 17 | 3-2-5-3 | **1SA** | 17 H, 3-2-5-3 : 1SA prime sur 1♦ pour la main régulière de 15–17 H. |
| 7 | `SEF-004-1` | 21 | 4-3-3-3 | **2SA** | 21 H, 4-3-3-3 : ouverture de 2SA 20–21 H, sans chercher un fit majeur avant l’ouverture. |
| 8 | `SEF-005-1` | 20 | 3-3-4-3 | **2SA** | 20 H, 3-3-4-3 : 2SA désigne directement la main régulière forte. |
| 9 | `SEF-005-2` | 21 | 3-3-4-3 | **2SA** | 21 H, 3-3-4-3 : ouverture de 2SA ; 2♣ fort est réservé à une zone supérieure pour cette forme régulière. |
| 10 | `SEF-006-2` | 12 | 5-2-4-2 | **1♠** | 12 H, cinq Piques et quatre Carreaux : la majeure cinquième ouvre de 1♠. |
| 11 | `SEF-006-1` | 14 | 5-2-4-2 | **1♠** | 14 H, cinq Piques et quatre Carreaux : la majeure cinquième à 1♠ précède l’annonce de la mineure. |
| 12 | `SEF-007-1` | 12 | 2-5-4-2 | **1♥** | 12 H, cinq Cœurs et quatre Carreaux : ouverture naturelle à 1♥. |
| 13 | `SEF-007-2` | 13 | 2-5-4-2 | **1♥** | 13 H, cinq Cœurs et quatre Carreaux : 1♥, 1SA serait réservé aux mains régulières 15–17 H. |
| 14 | `SEF-008-2` | 12 | 5-5-2-1 | **1♠** | 12 H et distribution 5 Piques–5 Cœurs : en présence de deux majeures cinquièmes, ouvrir la plus chère à 1♠. |
| 15 | `SEF-009-1` | 12 | 3-2-5-3 | **1♦** | 12 H, cinq Carreaux sans majeure cinquième : ouvrir 1♦, meilleure mineure. |
| 16 | `SEF-009-2` | 13 | 3-2-5-3 | **1♦** | 13 H, cinq Carreaux et pas de majeure cinquième : 1♦ plutôt que 1SA (15–17 H). |
| 17 | `SEF-010-3` | 12 | 3-2-3-5 | **1♣** | 12 H, cinq Trèfles : 1♣, meilleure mineure sans ouverture à SA disponible. |
| 18 | `SEF-010-1` | 14 | 3-2-3-5 | **1♣** | 14 H, cinq Trèfles sans majeure cinquième : 1♣ avant toute redemande. |
| 19 | `SEF-011-2` | 12 | 4-4-3-2 | **1♦** | 12 H, quatre cartes dans chaque majeure et trois Carreaux contre deux Trèfles : meilleure mineure 1♦. |
| 20 | `SEF-012-1` | 12 | 4-3-3-3 | **1♣** | 12 H, mineures 3-3 et quatre Piques : ouvrir 1♣ ; quatre Piques ne permettent pas 1♠. |
| 21 | `SEF-013-1` | 7 | 4-3-3-3 | **Passe** | 7 H et forme 4-3-3-3 : trop faible pour ouvrir, Passe. |
| 22 | `SEF-013-2` | 8 | 4-3-3-3 | **Passe** | 8 H et forme 4-3-3-3 : Passe, aucune ouverture à la couleur ou à SA. |
| 23 | `SEF-014-1` | 6 | 5-3-3-2 | **Passe** | 6 H malgré cinq Piques, sans zone d’ouverture ni barrage justifié : Passe. |
| 24 | `SEF-014-2` | 8 | 5-3-3-2 | **Passe** | 8 H avec cinq Piques et forme 5-3-3-2 : Passe ; 1♠ réclame une force d’ouverture. |

### Corrections éditoriales

- **24 contextes** « Tu es donneur » remplacés par « Vous êtes donneur. Personne n'a encore enchéri. Quelle est votre décision ? », sans faire apparaître la réponse.
- **8 corrigés** précisés, anciens textes conservés en `sourceOriginalExplain20261104V455`.
- Ancien contexte de chacune des 24 fiches conservé dans `sourceOriginalContext20261104V455`.
- **0 changement** des réponses, options, cartes, points H, niveaux, séquences d'enchères, rubriques et identifiants.

**Références ouvertes :** [FFB — Logique, mon cher Watson : majeure cinquième, 1SA 15–17 H, 2SA 20–21 H](https://cdn.ffbridge.fr/cms/geds/0001/06/7e4e354329c78170591e8d12803eb5425897d654.pdf) ; [FFB — La règle du jeu : ordre de priorité des ouvertures et meilleure mineure](https://cdn.ffbridge.fr/cms/articles/0001/04/4d768425643f0b1f3f9f4068659b6bc31639e3cc.pdf) ; [Club affilié FFB d'Auch — Ouverture en mineure](https://bridge-auch.club.ffbridge.fr/documents/cours-initiation-2-421187).

## Décompte et limites

- **333/993** revues individuelles datées (309 avant + 24 nouvelles), **660** encore sans verdict daté.
- **0 réserve pédagogique ouverte** sur les deux cas antérieurement signalés ; les verdicts sont motivés dans le cadre des quatre choix.
- Les **166 vigilances heuristiques initiales** ont déjà toutes une revue datée depuis V4.54.
- **Ne pas assimiler une revue documentée à une certification universelle** des enchères ou de la qualité de tous les distracteurs.

## CI et publication

À vérifier séparément sur la branche (audit, Chromium, WebKit), après fusion sur `main`, puis GitHub Pages. Les tests automatisés ne remplacent pas la validation physique Safari/iPhone.

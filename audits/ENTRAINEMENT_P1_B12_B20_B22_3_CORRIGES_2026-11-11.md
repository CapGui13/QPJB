# Entraînement QPJB — trois reprises P1 B12-2, B20-4, B22-6

**Date :** 11 novembre 2026. **Périmètre :** Entraînement enchères uniquement, sans modification du Quiz SEF.

## Sources vérifiées (PDF d'origine, page 1 sujet/corrigé)

| Fascicule | PDF sujet SHA-256 | PDF corrigé SHA-256 |
|---|---|---|
| Bridge & Mois débutant B12, 7 novembre 2025 | `92109c6d43791e93cb55a20821c7bc783c16b78b48a7ba1b2948974408b1e1b8` | `b34198f094b179d89feca6679737a605789c15d48ef2821d2bd0250afeb9786d` |
| Bridge & Mois débutant B20, 3 juillet 2026 | `3128d74486e86d492ce6cb1081ab413c8bb477be2d970f80db2c0fd07af88d19` | `0ad4b00ba1e1847d4c00ca037855a6cb93ffa5764d926f0f11235c3a6eab05da` |
| Bridge & Mois débutant B22, 4 septembre 2026 | `cc7641724ab7838d35c2353a94a13127401c32b181383b5a9806fdced481735a` | `51ebcd6203688c1cd44f212dd4d1e6febf4b4ff6815d3b139b1f496a22568f78` |

Archive native : `/QPJB Training/Archives/BM_originaux_2026-10-23.zip`. Fichiers d'origine : `12 BRIDGE&MOIS_DEBUTANT EXERCICE.pdf` / `SOLUTION.pdf`, `20 BRIDGE&MOIS_DEBUTANT EXERCICE juillet 2026.pdf` / `SOLUTION juillet 2026.pdf`, `22 BRIDGE&MOIS_DEBUTANT EXERCICE septembre 2026.pdf` / `SOLUTION septembre 2026.pdf`.
Les pages 1 ont été extraites, rendues et inspectées visuellement, puis comparées à leurs textes. Aucun PDF original n'a été modifié.

## B12-2 — `EN-barrage-002`, réponse **Passe**

- Main source : ♠R6 ♥5 ♦R42 ♣D986542 = **8 H**, sept Trèfles de mauvaise qualité et deux Rois extérieurs.
- Le QPJB publié indiquait « même avec une force importante » : cette expression est trompeuse, car 8 H est compatible avec le plafond de **9 à 10 H** fixé par le fascicule pour un barrage en mineure.
- La source refuse le barrage car la longue ♣ n'est commandée que par la Dame et les deux gros honneurs sont **dans les autres couleurs**. Une explication entièrement réécrite rend ces critères explicites sans extrapoler en règle absolue pour tous les systèmes.
- Même main, quatre choix, réponse Passe, séquence, sourceRef, statut et progression.

## B20-4 — `EN-suite-repondant-001`, réponse **3♥**

- Source : 1♦ – 1♥ – 2♥, Sud avec ♠R75 ♥D9872 ♦R5 ♣V42. Le corrigé original compte **12 HLD** grâce à 9 H, deux points pour le neuvième atout et un point pour le doubleton Carreau.
- Ancien texte QPJB : phrases accidentellement tronquées (« Le répondant peut ajouter 2D ... Cet espoir se 3♥. traduit ... »).
- Nouvelle explication fidèle : proposer 3♥ pour inviter face au soutien simple 12–16 HLD, rechercher 27 HLD si l'ouvreur est maximum ; l'ouvreur minimum passe, maximum peut conclure à 4♥.
- Aucune modification de l'enchère correcte ou de la structure d'enchères.

## B22-6 — `EN-redemande-014`, réponse **3♣**

- **Sujet original :** ♠V ♥D52 ♦RD8 ♣RV10743.
- **Corrigé original :** ♠V ♥952 ♦RD3 ♣RDV1073. Les deux textes impriment l'enchère 3♣, mais ils ne contiennent **pas la même main**.
- QPJB montrait déjà la main du corrigé suivant l'arbitrage du 31 octobre 2026. La divergence n'était pas affichée clairement dans l'énoncé **avant les choix**.
- Un `sourceContext` et une question explicites indiquent désormais que le QCM utilise la main du corrigé, tout en donnant les deux mains du fascicule.
- L'explication distingue le risque réel des Piques (adversaires possèdent au moins neuf cartes à Pique dans les accords du corrigé) d'une entame certaine, qui ne peut pas être prouvée. La réponse documentaire 3♣, refus d'invitation à 3SA, reste inchangée.
- La question ne prétend pas qu'un autre traitement de 2SA serait universellement impossible hors des accords du document.

## Contrôles et portée

- **3** objets d'enchères modifiés, les **635** autres inchangés ; **188** exercices de jeu de la carte inchangés ; total **826** identifiants.
- Champs protégés conservés : `id`, `hand`, `auction`, `correct`, `choices`, `reviewStatus`, `choiceStatus`, `sourceRef`, indices de distracteurs et progression.
- Deux explications et une question + avertissement de source sont corrigés ; étiquettes de révision ajoutées.
- Vérification de cohérence entre `training-data.js` et `training-data-bidding.js`, sept nouvelles assertions, versionnement du cache PWA, CI intégrité + Chromium + WebKit au commit exact.
- Relecture documentaire informée, non contre-expertise aveugle ni certification de l'unicité universelle de chaque décision d'enchère.

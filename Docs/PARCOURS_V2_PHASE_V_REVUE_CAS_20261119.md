# QPJB — Phase V : comparaison pédagogique des mains originales

**19 novembre 2026 · PR #214, audit expérimental · aucun changement du site élève ni des exercices.**

## 1. Source et limites

Les cas proviennent des objets **actifs** du bloc JSON `training-data` de `quizz.html` dans la PR #214, soit **1 523 QCM**. La sélection de la phase U identifiait des répétitions d'enchères/réponses : la phase V inspecte **les cartes, les points H, les distributions, les choix, les bonnes réponses, les explications et les familles** pour éviter de confondre des libellés identiques avec un doublon pédagogique.

Le script `scripts/parcours-v2-revue-v.cjs` produit une vue de ces huit QCM originaux, vérifie les points H à partir des honneurs, les 13 cartes, la distribution, les IDs et les réponses, et peut suivre leur apparition en neuf simulations fictives de V2-F (`--matrix`). Le test `tests/quizz-v2-revue-v.cjs` assure que cette lecture ne modifie aucun contenu.

Les conclusions portent sur **les textes actuels du catalogue**. Elles ne remplacent pas une vérification de conformité à une édition officielle du SEF, ni une mesure de maîtrise d'élèves.

## 2. Réponse de 1SA sur l'ouverture de 1♦ : deux décisions distinctes

| ID / famille | Main (♠ ♥ ♦ ♣) | H et forme | Réponse / distracteurs principaux | Le contraste réel |
|---|---|---|---|---|
| `SEF-N040-2` / `cas-096` | ♠A52 ♥V64 ♦DV1042 ♣V9 | 9 H, 3-3-5-2 | **1SA** ; 2♦, 3♦, Passe | **Cinq Carreaux du répondant** : 1SA plutôt que soutien direct |
| `SEF-N043-1` / `cas-099` | ♠A83 ♥RV7 ♦752 ♣V1065 | 9 H, 3-3-3-4 | **1SA** ; 2SA, 3SA, Passe | **Seulement trois Carreaux**, quatre Trèfles : choisir le bon palier de SA |

**Verdict : `CONTRASTE_A_CONSERVER`.** Même ouverture, même force H et même réponse, mais **longueur à Carreau différente** et familles de mauvaises réponses différentes. La présence des cinq Carreaux dans le premier cas crée précisément le piège du soutien. Aucun doublon démontré.

## 3. Réponse à 1♣ avec cinq Carreaux et une majeure quatrième : groupe à quatre contrastes

Les deux exercices d'abord suspects (`SEF-V49-006` et `SEF-V426-002`) sont les **variantes fortes** de deux paires **faible/forte** présentes dans le même catalogue. Chaque main comporte **cinq ♦ et quatre cartes dans une majeure**.

| Majeure | Variante faible | Variante forte | Le choix mis en opposition |
|---|---|---|---|
| **Cœurs** | `SEF-V49-005` : 7 H, 2-4-5-2, **1♥** | `SEF-V49-006` : 14 H, 2-4-5-2, **1♦** | Majeure quatrième vs couleur cinquième selon la force |
| **Piques** | `SEF-V426-001` : 8 H, 4-2-5-2, **1♠** | `SEF-V426-002` : 13 H, 4-2-5-2, **1♦** | Même décision de priorité avec l'autre majeure |

**Verdict : `ENSEMBLE_DE_CONTRASTES_A_PRESERVER`.** Le catalogue enseigne explicitement la règle « majeure quatrième jusqu'à 12 HL après 1♣, puis priorité possible à 1♦ au-delà » dans ses explications actives. **H et HL ne sont pas interchangeables** : ne pas fabriquer un seuil de réussite fondé seulement sur les nombres H affichés. Les deux variantes fortes se ressemblent, mais leur existence permet une matrice 2×2 avec les deux variantes faibles ; ce n'est pas une raison suffisante pour en supprimer une.

**Amélioration pédagogique candidate, sans changement de tirage :** vérifier par observation si les élèves rencontrent effectivement, à distance raisonnable, une main forte **et** une main faible de chacun des deux contextes ♥/♠. Ne pas imposer cette exposition avant d'avoir mesuré les effets sur la diversité et les rappels.

## 4. Passe après l'ouverture de 1SA : deux justifications utiles

| ID / famille | Main | H et forme | Décision / distracteurs principaux | Le contraste réel |
|---|---|---|---|---|
| `SEF-N088-1` / `cas-140` | ♠V92 ♥1073 ♦987 ♣RV75 | 5 H, 3-3-3-4 | **Passe** ; 2SA, 2♦, 2♣ | Faiblesse et absence de majeure quatrième |
| `SEF-N089-2` / `cas-141` | ♠V108 ♥1042 ♦R7652 ♣43 | 4 H, 3-3-5-2 | **Passe** ; 2SA, 2♦, 2♣ | Faiblesse **malgré cinq Carreaux** |

**Verdict : `CONTRASTE_A_CONSERVER`.** Même réponse finale, mais le second explore le piège d'une mineure cinquième. Des variantes existent déjà au sein des familles `cas-140` et `cas-141` ; ne pas les compter comme des notions totalement nouvelles.

## 5. Résultats du banc d'exposition (validés par GitHub Actions)

**Exécution #44488564587 : contrôle ciblé U/V réussi**, test de lecture des 1 523 sources compris. Matrice disponible dans l'artefact `qpjb-v2-u-audit`, fichier `phase-v-matrix.json`. Ce sont **neuf parcours fictifs** (3 profils × 3 graines), chacun de 45 séances de 10 QCM ; aucune donnée d'élève.

| Source de la grille 1♣, cinq ♦ et quatre M | Premier passage dans les 9 parcours |
|---|---|
| `SEF-V49-005` (7 H, 1♥) | séances **16–20** |
| `SEF-V49-006` (14 H, 1♦) | séances **24–27** |
| `SEF-V426-001` (8 H, 1♠) | séances **16–24** |
| `SEF-V426-002` (13 H, 1♦) | séances **22–27** |

**Chaque exercice apparaît exactement une fois dans chacun des neuf parcours** : 36 présentations au total pour les quatre IDs. Les deux variantes ♥ (faible/forte) et les deux variantes ♠ (faible/forte) sont donc toutes rencontrées dans les neuf parcours simulés.

Dans **4/9** parcours, deux des quatre questions sont présentées à la même séance. Détail :
- Profil équilibré graine 29 et profil fragile-mineures graine 29 : **deux variantes fortes**, toutes deux avec la réponse 1♦, réunies en séance 26.
- Profil fragile-mineures graine 47 : **variante ♠ faible et forte** réunies en séance 22, un contraste direct de réponse 1♠ / 1♦.
- Profil facile graine 29 : **deux variantes faibles**, réponses 1♥ et 1♠, réunies en séance 16.

Le groupe est donc **déjà couvert dans chaque simulation sans injection spécifique**. La présence simultanée de deux variantes fortes et de la même réponse 1♦ dans 2/9 parcours peut mériter une revue visuelle du déroulement des séances, mais **n'établit pas une répétition nocive**. Les autres co-présentations peuvent même créer des contrastes intéressants. Il n'est pas justifié de modifier V2-F sur cette seule observation.

## 6. Décision

- **Aucune suppression, aucun changement de corrigé, d'ID ou de famille.**
- **Pas de pénalité de score automatique** sur un même libellé d'enchère.
- V2-F reste la référence tant qu'une amélioration n'a pas prouvé l'absence de régression sur les familles distinctes, les réponses mineures et les rappels.
- Les résultats éventuels de la matrice `--matrix` sont **des expositions synthétiques**, pas une preuve que les élèves ont appris la règle.

**Statut : `PHASE_V_REVUE_SOURCES / CONTRASTES_CONSERVES / AUCUNE_SUBSTITUTION / AUCUN_DEPLOIEMENT`.**

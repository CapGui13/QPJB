# Mission C — Inventaire de référence Entraînement QPJB

**Instantané immuable :** dépôt `CapGui13/QPJB`, branche `main`, commit `2e9e41c8538fbf5f154dbb86e05b907168cdc6bb` (13 novembre 2026). **Périmètre :** `entrainement/` uniquement ; Quiz SEF non examiné et non modifié. Aucun exercice modifié.

## Comptages et vérifications

| Contrôle | Résultat |
|---|---:|
| Enchères présentes dans `D.bidding` | 638 |
| Carte présente dans `D.play` | 188 |
| Total des enregistrements | 826 |
| Identifiants uniques | 826 |
| Exercices actifs (exclusion `reviewStatus=a_verifier`) | 826 |
| Quarantaines bloquantes `a_verifier` | 0 |
| Doublons d’identifiant | 0 |
| Doublons stricts de données de décision | 0 |
| Références source entièrement vides | 0 |
| Discordances numéro BH entre identifiant et référence | 0 |

La comparaison JSON intégrale de `training-data.js` avec `training-data-bidding.js` et `training-data-play.js` est **identique pour les deux tableaux**, dans le même ordre, avec les mêmes champs. Les compteurs de `training-data-bootstrap.js` indiquent également 638 et 188. Le code de l’application exclut les seules entrées `reviewStatus=a_verifier` des tirages aléatoires ; il ne consulte pas `sourceAudit.publication_autorisee`.

## Problèmes d’indexation constatés

### 1. Contradiction apparente de métadonnées de publication — 9 fiches

Ces fiches se trouvent dans les données actives alors que leur champ documentaire `sourceAudit.publication_autorisee` vaut explicitement `false` : `EN-BH-134-03`, `EN-BH-136-05`, `EN-BH-139-06`, `EN-BH-140-01`, `EN-BH-140-02`, `EN-BH-140-05`, `JC-BH-136-01`, `JC-BH-139-01`, `JC-BH-140-01`. Cela **n’autorise pas à les retirer** : la signification / l’actualité de ce champ est à clarifier par l’équipe éditoriale.

### 2. Références partagées sans identifiant de sous-exercice — 14 références, 63 fiches

Ces références désignent un fascicule commun à plusieurs décisions. Aucune fusion ni redondance n’en découle :

- `BridgeHebdo:BH-007` (5) : `JC-BH-007-Q01`, `JC-BH-007-Q02`, `JC-BH-007-Q03`, `JC-BH-007-Q04`, `JC-BH-007-Q05`
- `BridgeHebdo:BH-014` (4) : `JC-BH-014-Q01`, `JC-BH-014-Q02`, `JC-BH-014-Q03`, `JC-BH-014-Q04`
- `BridgeHebdo:BH-017` (4) : `JC-BH-017-Q01`, `JC-BH-017-Q02`, `JC-BH-017-Q03`, `JC-BH-017-Q04`
- `BridgeHebdo:BH-020` (6) : `JC-BH-020-Q01`, `JC-BH-020-Q02`, `JC-BH-020-Q03`, `JC-BH-020-Q04`, `JC-BH-020-Q05`, `JC-BH-020-Q06`
- `BridgeHebdo:BH-021` (6) : `JC-BH-021-Q01`, `JC-BH-021-Q02`, `JC-BH-021-Q03`, `JC-BH-021-Q04`, `JC-BH-021-Q05`, `JC-BH-021-Q06`
- `BridgeHebdo:BH-022` (4) : `JC-BH-022-Q01`, `JC-BH-022-Q02`, `JC-BH-022-Q03`, `JC-BH-022-Q04`
- `BridgeHebdo:BH-023` (6) : `JC-BH-023-Q01`, `JC-BH-023-Q02`, `JC-BH-023-Q03`, `JC-BH-023-Q04`, `JC-BH-023-Q05`, `JC-BH-023-Q06`
- `BridgeHebdo:BH-024` (4) : `JC-BH-024-Q01`, `JC-BH-024-Q02`, `JC-BH-024-Q03`, `JC-BH-024-Q04`
- `BridgeHebdo:BH-028` (4) : `JC-BH-028-Q01`, `JC-BH-028-Q02`, `JC-BH-028-Q03`, `JC-BH-028-Q04`
- `BridgeHebdo:BH-031` (4) : `JC-BH-031-Q01`, `JC-BH-031-Q02`, `JC-BH-031-Q03`, `JC-BH-031-Q04`
- `BridgeHebdo:BH-034` (6) : `JC-BH-034-Q01`, `JC-BH-034-Q02`, `JC-BH-034-Q03`, `JC-BH-034-Q04`, `JC-BH-034-Q05`, `JC-BH-034-Q06`
- `BridgeHebdo:BH-036` (4) : `JC-BH-036-Q01`, `JC-BH-036-Q02`, `JC-BH-036-Q03`, `JC-BH-036-Q04`
- `BridgeHebdo:BH-040` (4) : `JC-BH-040-Q01`, `JC-BH-040-Q02`, `JC-BH-040-Q03`, `JC-BH-040-Q04`
- `BridgeHebdo:BH-041` (2) : `JC-BH-041-Q01`, `JC-BH-041-Q02`

### 3. Références dérivées de l’ID QPJB — 66 fiches

Le `sourceRef` est égal à l’ID QPJB ou à `BridgeHebdo:` suivi de cet ID ; l’ancrage au document original n’est donc pas indépendant. **Liste complète :** `EN-BH-032-P2-01`, `EN-BH-032-P2-02`, `EN-BH-033-P2-02`, `EN-BH-036-P2-01`, `EN-BH-036-P2-02`, `EN-BH-036-P2-03`, `EN-BH-036-P2-04`, `EN-BH-040-P2-03`, `EN-BH-040-P2-04`, `EN-BH-040-P2-05`, `EN-BH-042-P2-01`, `EN-BH-042-P2-02`, `EN-BH-043-P2-01`, `EN-BH-137-03`, `EN-BH-136-03`, `EN-BH-139-05`, `EN-BH-126-06`, `EN-BH-129-05`, `EN-BH-128-02`, `EN-BH-128-06`, `EN-BH-129-02`, `EN-BH-130-06`, `EN-BH-129-03`, `EN-BH-089-03`, `EN-BH-097-01`, `EN-BH-097-04`, `EN-BH-097-06`, `EN-BH-126-01`, `EN-BH-127-04`, `EN-BH-097-02`, `EN-BH-097-03`, `EN-BH-097-05`, `JC-BH-039-M02`, `JC-BH-039-M03`, `JC-BH-039-M04`, `JC-BH-087-P2`, `JC-BH-088-P2-A`, `JC-BH-092-P2`, `JC-BH-093-P2`, `JC-BH-094-P2`, `JC-BH-099-P2`, `JC-BH-102-P2`, `JC-BH-106-P2`, `JC-BH-054-P2`, `JC-BH-062-P2`, `JC-BH-067-P2`, `JC-BH-069-P2`, `JC-BH-132-Q01`, `JC-BH-132-Q05`, `JC-BH-132-Q06`, `JC-BH-077-P2`, `JC-BH-086-P2`, `JC-BH-114-P2-01`, `JC-BH-114-P2-02`, `JC-BH-114-P2-03`, `JC-BH-114-P2-04`, `JC-BH-104-05`, `JC-BH-127-01`, `JC-BH-079-02`, `JC-BH-111-01`, `JC-BH-118-P2`, `JC-BH-126-01`, `JC-BH-058-P2`, `JC-BH-079-03`, `JC-BH-091-03`, `JC-BH-091-04`.

### 4. Référence seulement au numéro de Bridge Hebdo — 82 fiches

Les `sourceRef` de forme `BridgeHebdo:BH-NNN` ne précisent pas le numéro de l’exercice ; les 63 fiches à référence partagée peuvent y être incluses, les catégories se recoupent. **IDs concernés :** `JC-BH-001-Q01`, `JC-BH-005-Q01`, `JC-BH-008-Q01`, `JC-BH-009-Q01`, `JC-BH-011-Q01`, `JC-BH-015-Q01`, `JC-BH-018-Q01`, `JC-BH-026-Q01`, `JC-BH-030-Q01`, `JC-BH-037-Q01`, `JC-BH-039-Q01`, `JC-BH-041-Q01`, `JC-BH-042-Q01`, `JC-BH-043-Q01`, `JC-BH-041-Q02`, `JC-BH-020-Q01`, `JC-BH-020-Q02`, `JC-BH-020-Q03`, `JC-BH-020-Q04`, `JC-BH-020-Q05`, `JC-BH-020-Q06`, `JC-BH-021-Q01`, `JC-BH-021-Q02`, `JC-BH-021-Q03`, `JC-BH-021-Q04`, `JC-BH-021-Q05`, `JC-BH-021-Q06`, `JC-BH-023-Q01`, `JC-BH-023-Q02`, `JC-BH-023-Q03`, `JC-BH-023-Q04`, `JC-BH-023-Q05`, `JC-BH-023-Q06`, `JC-BH-034-Q01`, `JC-BH-034-Q02`, `JC-BH-034-Q03`, `JC-BH-034-Q04`, `JC-BH-034-Q05`, `JC-BH-034-Q06`, `JC-BH-007-Q01`, `JC-BH-007-Q02`, `JC-BH-007-Q03`, `JC-BH-007-Q04`, `JC-BH-007-Q05`, `JC-BH-014-Q01`, `JC-BH-014-Q02`, `JC-BH-014-Q03`, `JC-BH-014-Q04`, `JC-BH-017-Q01`, `JC-BH-017-Q02`, `JC-BH-017-Q03`, `JC-BH-017-Q04`, `JC-BH-022-Q01`, `JC-BH-022-Q02`, `JC-BH-022-Q03`, `JC-BH-022-Q04`, `JC-BH-024-Q01`, `JC-BH-024-Q02`, `JC-BH-024-Q03`, `JC-BH-024-Q04`, `JC-BH-028-Q01`, `JC-BH-028-Q02`, `JC-BH-028-Q03`, `JC-BH-028-Q04`, `JC-BH-031-Q01`, `JC-BH-031-Q02`, `JC-BH-031-Q03`, `JC-BH-031-Q04`, `JC-BH-036-Q01`, `JC-BH-036-Q02`, `JC-BH-036-Q03`, `JC-BH-036-Q04`, `JC-BH-040-Q01`, `JC-BH-040-Q02`, `JC-BH-040-Q03`, `JC-BH-040-Q04`, `JC-BH-006-Q01`, `JC-BH-010-Q01`, `JC-BH-012-Q01`, `JC-BH-032-Q01`, `JC-BH-033-Q01`, `JC-BH-035-Q01`.

### 5. Nom explicite du PDF absent — 545 fiches

Pour ces lignes, aucun nom de PDF n’est fourni par les métadonnées de l’exercice ni par la correspondance documentaire interne `B01`–`B23`. **La liste exhaustive des IDs figure dans `anomalies-indexation.csv`** sous le code `PDF_EXPLICITE_ABSENT`, et le catalogue permet de filtrer cette valeur. Cela signifie **métadonnée de liaison manquante**, pas absence prouvée de source originale. 281 lignes ont au moins un nom de PDF exact disponible par métadonnées directes ou rapprochement Bxx. Aucun fichier PDF ou ZIP d’origine n’est versionné dans l’arbre Git au commit examiné ; l’accès aux archives externes relève des missions d’inventaire A et B.

### 6. Motif de quarantaine conservé sans statut bloquant — 1 fiche

`JC-023` conserve un `quarantineReason` signalant une incohérence du diagramme source (deux ♠6 et absence du ♠3), mais son `reviewStatus` est `transcrit_source` et l’application ne le filtre pas. Il s’agit d’un **signal documentaire déjà présent**, non d’une nouvelle contre-expertise.

## Rapprochement Bridge & Mois — codes internes / numéros de fichiers

Attention : `B01`…`B23` sont des **codes internes QPJB**, pas nécessairement les numéros d’origine. Le lien ci-dessous est déduit des métadonnées `sourceDocumentAudit` des 23 fiches `JC-001`…`JC-023` et propagé aux fiches d’enchères ayant le même code Bxx. Les pages d’enchères non attestées restent vides.

| Code interne | Numéro lu dans le nom du PDF | Nom exact du PDF corrigé |
|---|---:|---|
| `B01` | 3 | `3 BRIDGE&MOIS_DEBUTANT SOLUTION_7-02.pdf` |
| `B02` | 6 | `6 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B03` | 10 | `10 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B04` | 13 | `13 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B05` | 15 | `15 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B06` | 19 | `19 BRIDGE&MOIS_DEBUTANT SOLUTION juin 2026.pdf` |
| `B07` | 20 | `20 BRIDGE&MOIS_DEBUTANT SOLUTION juillet 2026.pdf` |
| `B08` | 22 | `22 BRIDGE&MOIS_DEBUTANT SOLUTION septembre 2026.pdf` |
| `B09` | 1 | `1. BRIDGE&MOIS_DEBUTANT SOLUTION 10-12-2024.pdf` |
| `B10` | 2 | `2 BRIDGEMOIS_DEBUTANT SOLUTION.pdf` |
| `B11` | 4 | `4 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B12` | 5 | `5 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B13` | 7 | `7 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B14` | 8 | `8 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B15` | 9 | `9 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B16` | 11 | `11 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B17` | 12 | `12 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B18` | 14 | `14 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B19` | 16 | `16 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B20` | 17 | `17 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B21` | 18 | `18 BRIDGE&MOIS_DEBUTANT SOLUTION mai 2026.pdf` |
| `B22` | 21 | `21 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` |
| `B23` | 23 | `23 BRIDGE&MOIS_DEBUTANT SOLUTION octobre 2026.pdf` |

## Méthode, champs et limites

- `catalogue-entrainement-main.csv` comporte **826 lignes d’exercices**, toutes présentes dans l’application. Il garde l’ID, le contexte de main/enchères, l’énoncé, les choix, la bonne réponse, les alternatives explicitement structurées lorsqu’elles existent, l’explication, les statuts et les ancrages documentaires. Un champ vide est un champ absent de la donnée, jamais une valeur inventée.
- `anomalies-indexation.csv` contient une **ligne par anomalie et par ID**. Les codes de plusieurs catégories peuvent se cumuler : ne pas sommer les compteurs pour calculer un nombre d’exercices uniques.
- Détection de doublons stricts sur les données pédagogiques détaillées (énoncé, main, séquence, contrat, entame, options, réponse, explication), indépendamment de l’identifiant et de la référence ; aucun constat positif. Deux exercices abordant la même technique **ne sont pas déclarés redondants**.
- Les noms de PDF et numéros de pages proviennent uniquement des métadonnées déjà intégrées. Les contenus des PDF archivés n’ont **pas** été revus ici ; vérifier leur exhaustivité relève des missions A et B. Les relectures pédagogiques précédentes ne sont pas rouvertes.
- Toutes les écritures de cette mission sont limitées au répertoire `audits/cloture-entrainement/C/`. Aucun fichier applicatif ni fichier du Quiz SEF n’est modifié. PR volontairement brouillon et non fusionnée.

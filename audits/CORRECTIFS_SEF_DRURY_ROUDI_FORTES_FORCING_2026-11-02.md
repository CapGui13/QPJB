# QPJB — correctifs SEF ciblés après audits Drury, Roudi, fortes et forcing

**Date : 2 novembre 2026.** Dépôt `CapGui13/QPJB`, branche `main`. Ce rapport compare chaque fiche du catalogue avant le lot (commit `b3f8d2fb`) et après le commit de code [`5d55d0a`](https://github.com/CapGui13/QPJB/commit/5d55d0a0ca9997652e545d792445e386640ed6b3).

## Bilan exact

- **993 exercices conservés, 993 IDs uniques**, toutes les bonnes réponses, les quatre choix, la séquence et la rubrique de chaque fiche conservés.
- **31 exercices distincts modifiés**, dont **2 mains Drury réparées** (5 HLD → 6 HLD), **3 énoncés qui révélaient l'enchère corrigés**, **27 difficultés recalibrées individuellement** avec justification. L'une des trois questions neutralisées (`SEF-C2-011`) est aussi recalibrée, d'où le chevauchement des comptes.
- **Aucun exercice supprimé ou renuméroté**, aucune remise à zéro globale de la progression.
- **5 marqueurs de révision ciblés** introduits dans `revisedSefNov2026` pour archiver et remettre à travailler **seulement** les deux mains modifiées et les trois questions auparavant révélatrices. Une modification de `difficulty` ou `difficultyReason` n'entraîne pas de révision de progression.
- Protection en code : le mécanisme existant conserve `archivedPreRevision` et vérifie `pedagogicalRevision` pour ne pas refaire la remise à travailler sur chaque visite.

## Corrections pédagogiques

### Deux soutiens Drury insuffisants — corrigés par la main

1. **`SEF-V4-099-2`** : ♠852 ♥A95 ♦9732 ♣V85 (**5 H, 5 HLD**) → ♠852 ♥A95 ♦V732 ♣V85 (**6 H, 6 HLD**). Conserver **2♥** avec trois atouts ; le corrigé explicite le seuil de 6 HLD. Il reste quatre choix.
2. **`SEF-V4-105-2`** : ♠RD6 ♥854 ♦9432 ♣743 (**5 H, 5 HLD**) → ♠RD6 ♥854 ♦V432 ♣743 (**6 H, 6 HLD**). Conserver **2♠** avec trois atouts ; corrigé de seuil et quatre choix conservés.

**Règle :** après Passe d'entrée et ouverture majeure en troisième position, le soutien simple à 2M avec trois atouts nécessite 6–10 HLD ; en dessous, Passe. Le Drury à 2♣ demande au moins 11 HLD. Référence : [Drury SEF 2024](https://www.bridge-chailley.fr/wp-content/uploads/2024/10/E2048-Drury-inferences-corr-2.pdf).

### Trois questions qui donnaient la solution — neutralisées

- `SEF-C2-011` : retirer du contexte « pour dire 2♣ » et le calcul donné de 11 HLD ; conserver la séquence de troisième position et la réponse **2♣**. Niveau **4→3**, réponse à calculer à partir de la main.
- `SEF-C2-012` : retirer du contexte le nom du relais **2♣** Roudi ; conserver le déroulé 1♣–1♥–1SA, les quatre choix et la bonne réponse **2♣**.
- `SEF-V45-003` : retirer « 2♣ fort indéterminé » de l'énoncé ; conserver la main, la séquence vide et la réponse **2♣** fondée sur la force et la sixième majeure.

## Détail des 31 IDs, sans chevauchement

| ID | Famille | Nature de la modification | Difficulté | Réponse conservée |
|---|---|---|---|---|
| `SEF-V4-076-3` | roudi | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V4-077-1` | roudi | Difficulté + motif | 4 → 3 | 2♥ |
| `SEF-V4-078-1` | roudi | Difficulté + motif | 4 → 3 | 2♠ |
| `SEF-V4-082-1` | roudi | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V4-083-1` | roudi | Difficulté + motif | 4 → 3 | 2♥ |
| `SEF-V4-084-1` | roudi | Difficulté + motif | 4 → 3 | 2♠ |
| `SEF-V4-088-1` | roudi | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V4-089-1` | roudi | Difficulté + motif | 4 → 3 | 2♥ |
| `SEF-V4-090-1` | roudi | Difficulté + motif | 4 → 3 | 2♠ |
| `SEF-V4-094-1` | roudi | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V4-095-2` | roudi | Difficulté + motif | 4 → 3 | 2♥ |
| `SEF-V4-096-1` | roudi | Difficulté + motif | 4 → 3 | 2♠ |
| `SEF-V4-099-2` | drury | Main 5→6 H | Inchangée | 2♥ |
| `SEF-V4-101-2` | drury | Difficulté + motif | 4 → 3 | 2♥ |
| `SEF-V4-102-1` | drury | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V4-105-2` | drury | Main 5→6 H | Inchangée | 2♠ |
| `SEF-V4-107-3` | drury | Difficulté + motif | 4 → 3 | 2♠ |
| `SEF-V4-108-1` | drury | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V44-067` | drury | Difficulté + motif | 5 → 4 | 2SA |
| `SEF-V44-068` | drury | Difficulté + motif | 5 → 4 | 2SA |
| `SEF-V45-002` | fortes | Difficulté + motif | 4 → 3 | 2♦ |
| `SEF-V45-003` | fortes | Énoncé neutralisé | Inchangée | 2♣ |
| `SEF-V45-016` | forcing | Difficulté + motif | 5 → 4 | 2♣ |
| `SEF-V45-017` | forcing | Difficulté + motif | 5 → 4 | 1♠ |
| `SEF-V45-018` | forcing | Difficulté + motif | 5 → 4 | 2♥ |
| `SEF-V45-019` | forcing | Difficulté + motif | 5 → 4 | 2♦ |
| `SEF-V45-020` | forcing | Difficulté + motif | 5 → 4 | 2♥ |
| `SEF-V45-021` | forcing | Difficulté + motif | 5 → 4 | 2SA |
| `SEF-V45-022` | forcing | Difficulté + motif | 5 → 2 | 2♥ |
| `SEF-C2-011` | drury | Énoncé neutralisé + difficulté | 4 → 3 | 2♣ |
| `SEF-C2-012` | roudi | Énoncé neutralisé | Inchangée | 2♣ |

### Répartition des 27 difficultés

- **Drury : 7** : quatre redemandes de l'ouvreur `4→3`, deux variantes de soutien 2SA avec singleton `5→4`, et `SEF-C2-011` `4→3`.
- **Roudi : 12** : les trois réponses codées de l'ouvreur après Roudi (2♦ sans fit, 2♥ fit minimum, 2♠ fit maximum) de `4→3`; cinq conclusions plus complexes demeurent au niveau 4.
- **Ouvertures fortes : 1** : `SEF-V45-002` (25 H réguliers, 2♦ forcing de manche) de `4→3`.
- **Forcing : 7** : les six cas de quatrième couleur et suites `SEF-V45-016` à `SEF-V45-021` passent de `5→4`; `SEF-V45-022` (répétition naturelle 2♥ faible, 6 H) passe de `5→2`.

Les difficultés d'autres fiches, les distracteurs et les corrigés non ciblés sont **inchangés**. Les sources de règles SEF et les verdicts individuels se trouvent dans les audits de chaque famille : `REVUE_SEF_DRURY_19_2026-11-02.md`, `REVUE_SEF_ROUDI_33_2026-11-02.md`, `REVUE_SEF_FORTES_FORCING_22_2026-11-02.md`.

## Validation technique

**Contrôles statiques effectués avant commit et après relecture sur `main` :** 993 mains de 13 cartes, tous les points H exacts, distributions cohérentes, aucun doublon de rang par couleur ou situation main+séquence, quatre choix distincts incluant la bonne réponse ; aucun changement à un champ protégé (IDs, réponses, choix, enchères, familles).

**Test de non-régression ajouté :** [`tests/quizz-integrity.cjs`](../tests/quizz-integrity.cjs) contrôle les deux seuils 6 HLD, la conservation des réponses 2M, l'absence de réponse révélée dans les trois contextes, un niveau approprié à la répétition faible 2♥ et les cinq versions de progression.

**État CI / Pages à confirmer séparément** : les commits de données et de tests lancent leurs propres workflow Actions ; un test `pending`/`in_progress` n'est pas réussi. Un run échoué sur un ancien commit ne prouve pas une régression du nouveau code, et les nouveaux runs peuvent être annulés par les changements documentaires. Une validation sur iPhone physique **n'a pas été réalisée**.

## Suivi

Mettre à jour `REGISTRE_993_REVUES_2026-11-02.csv` pour les **31 fiches corrigées/recalibrées** (difficulté actuelle et verdict exact), puis la feuille de route unique `SUIVI_UPGRADES_2026-11-02.md`. Le nombre de dossiers nominativement examinés **ne change pas** : une correction de 31 fiches déjà revues ne constitue pas 31 nouvelles revues.

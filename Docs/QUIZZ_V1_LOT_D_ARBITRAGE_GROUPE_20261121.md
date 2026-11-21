# Validation groupée — QPJB V1, onze propositions éditoriales

**Statut : PR brouillon de préparation. AUCUNE proposition encore activée, AUCUN QCM public modifié.**  
Base : [PR #237](https://github.com/CapGui13/QPJB/pull/237) et [PR #234](https://github.com/CapGui13/QPJB/pull/234). Prévisualisation exacte machine : `audits/QPJB_V1_LOT_D_11_CORRECTIONS_CANDIDATES_20261121.json`. Le test dédié prouve que les 11 changements envisagés sont exclusivement ceux annoncés.

## D1 — Sept soutiens simples à réparer : validation requise

Chaque original possède **5 H, trois atouts, aucune courte**, tout en affirmant avoir répondu `2M` à `1M`. Ces propositions ajoutent **un seul Valet** en lieu et place d'une petite carte pour obtenir **6 H et 6 HLD**, sans changer la forme, la séquence, les choix ou la bonne réponse.

| ID | Main originale | Main candidate | H |
| --- | --- | --- | ---: |
| `SEF-V4-009-1` | ♠943 · ♥954 · ♦A1065 · ♣V74 | ♠V94 · ♥954 · ♦A1065 · ♣V74 | 5 → 6 |
| `SEF-V4-011-1` | ♠8632 · ♥A76 · ♦V106 · ♣1042 | ♠8632 · ♥A76 · ♦V106 · ♣V104 | 5 → 6 |
| `SEF-V4-021-1` | ♠V32 · ♥742 · ♦A982 · ♣732 | ♠V32 · ♥742 · ♦A982 · ♣V73 | 5 → 6 |
| `SEF-V4-023-3` | ♠953 · ♥DV93 · ♦D64 · ♣864 | ♠953 · ♥DV93 · ♦D64 · ♣V86 | 5 → 6 |
| `SEF-V416-006` | ♠R93 · ♥D84 · ♦10752 · ♣963 | ♠R93 · ♥D84 · ♦10752 · ♣V96 | 5 → 6 |
| `SEF-V418-006` | ♠D85 · ♥V74 · ♦V1082 · ♣V92 | ♠DV8 · ♥V74 · ♦V1082 · ♣V92 | 5 → 6 |
| `SEF-V421-012` | ♠R64 · ♥975 · ♦10863 · ♣D94 | ♠R64 · ♥975 · ♦10863 · ♣DV9 | 5 → 6 |

En plus de la main, la modification technique **obligatoire** concerne le champ `h` (5→6), la consigne, l'explication et le motif de difficulté. **Aucune bonne réponse ne change** (refus de l'essai à `3♥` ou `3♠`). La qualité éditoriale exacte des sept mains proposées doit être validée, elle n'est pas établie par les tests.

**Décision D1 :** accepter les 7 propositions telles quelles / demander une correction cas par cas / suspendre ces 7 modifications.

## D2 — Roudi : un motif incorrect

`SEF-L10-030` : corriger uniquement `difficultyReason`, qui évoque une répétition faible alors que le QCM valide `2♣` Roudi avec six Piques et 11 HL. Main, question et bonne réponse inchangées.

**Décision D2 :** accepter la rectification du motif / conserver en attente.

## D3 — Texas Trèfle : cohérence avec la décision existante

`SEF-L25-007` : appliquer l'explication **déjà validée** pour `2SA`, modulation positive avec gros honneur troisième et main non minimum. Corriger également `difficultyReason` pour ne plus indiquer « maximum » comme une nécessité. Aucune nouvelle convention inventée ; le manifeste historique reste marqué HOLD pour la publication V1.

**Décision D3 :** appliquer l'explication approuvée et aligner le motif / maintenir en attente.

## D4 — Deux motifs Texas étiquetés Stayman

`SEF-V44-027` et `SEF-V44-030` : remplacer uniquement le motif parlant de Stayman par un motif correspondant au **Texas majeur** des séquences réelles. Conserver les bonnes réponses `2SA` et `3♥`, les rubriques existantes et toutes les cartes.

**Décision D4 :** accepter les deux libellés / maintenir en attente.

## Décision indépendante — Lot C

[PR #239](https://github.com/CapGui13/QPJB/pull/239) : essai de classification fine sur 14 QCM. Le pilote prouve que les questions de la compétence faible sont plus souvent proposées, **pas** que les élèves apprennent mieux. Deux réserves : `SEF-V44-054` nécessite de qualifier `3♠` après `1♥–2♥` (retour à `3♥` impossible) ; `SEF-V44-053` exige relecture de la qualité de l'essai à Carreau. **Proposition : conserver le lot C non actif et ne pas élargir la classification** à ce stade.

## Conditions de mise en ligne

1. Validation explicite de D1, D2, D3, D4 par l'utilisatrice ; arbitrage C distinct.
2. Appliquer uniquement les groupes approuvés à `quizz.html` dans une PR **distincte de publication**, avec contrôle des 1 523 QCM, des 22 rubriques, des mains/points, des bonnes réponses et des sauvegardes.
3. Tests intégrité, moteur, Chromium, WebKit, puis fusion et publication contrôlées. Ne pas engager d'homologation générale des 620 classifications en attente.

**Aucune de ces propositions n'est une autorisation implicite de fusion ou de publication.**

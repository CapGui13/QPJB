# Arbitrage groupé — QPJB V1, onze corrections éditoriales approuvées

**Statut au 21/11/2026 : 11/11 propositions approuvées pédagogiquement dans la conversation, dont une rectification de bonne réponse. PR brouillon : AUCUNE correction appliquée au Quiz public, aucun déploiement autorisé.**  
Base : [PR #237](https://github.com/CapGui13/QPJB/pull/237) et [PR #234](https://github.com/CapGui13/QPJB/pull/234). Prévisualisation exacte machine : `audits/QPJB_V1_LOT_D_11_CORRECTIONS_CANDIDATES_20261121.json`. Le test dédié prouve que les 11 changements envisagés sont exclusivement ceux annoncés.

## D1 — Sept soutiens simples : 7/7 validés

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

En plus de la main, la modification technique **obligatoire** concerne le champ `h` (5→6), la consigne, l'explication et le motif de difficulté. **Aucune bonne réponse ne change** (refus de l'essai à `3♥` ou `3♠`). La qualité éditoriale exacte des sept mains proposées a été **acceptée par l'utilisatrice** (deux validations individuelles, cinq en bloc) ; les tests contrôlent uniquement leur cohérence technique.

**Décision D1 : VALIDÉ — les sept mains à 6 HLD, les champs h et leurs explications.**

## D2 — Roudi : un motif incorrect

`SEF-L10-030` : corriger uniquement `difficultyReason`, qui évoque une répétition faible alors que le QCM valide `2♣` Roudi avec six Piques et 11 HL. Main, question et bonne réponse inchangées.

**Décision D2 : VALIDÉ — motif Roudi corrigé, réponse 2♣ inchangée.**

## D3 — Texas Trèfle : cohérence avec la décision existante

`SEF-L25-007` : appliquer l'explication **déjà validée** pour `2SA`, modulation positive avec gros honneur troisième et main non minimum. Corriger également `difficultyReason` pour ne plus indiquer « maximum » comme une nécessité. Aucune nouvelle convention inventée ; le manifeste historique reste marqué HOLD pour la publication V1.

**Décision D3 : VALIDÉ — explication Texas Trèfle et motif « non minimum », réponse 2SA inchangée.**

## D4 — Deux cas Texas : un motif corrigé, un corrigé de manche rectifié

`SEF-V44-027` : corriger uniquement le motif Stayman en motif **Texas Pique**. Bonne réponse **2SA** inchangée avec cinq Piques et 9 H (invitation de manche).

`SEF-V44-030` : l'utilisatrice a **rejeté l'ancienne proposition conservant 3♥**. Avec six Cœurs ♥ARV753, **9 H + 2 L = 11 HL** et une couleur solide, on **impose la manche à 4♥** face à 1SA 15–17. Il faut modifier les champs `answer` (**3♥ → 4♥**), `context`, `explain` et `difficultyReason`. Les quatre choix existants contiennent déjà 4♥ et restent inchangés. La main, les valeurs H, la séquence, le thème, l'ID et la famille restent inchangés. Comparaison utile : les cinq Piques du QCM 10 sont moins beaux, et ce QCM 10 reste seulement invitationnel.

**Décision D4 : VALIDÉ — QCM 10, motif Texas Pique (2SA conservé) ; QCM 11, correction complète avec bonne réponse 4♥ et 11 HL.**

## Décision indépendante — Lot C

[PR #239](https://github.com/CapGui13/QPJB/pull/239) : essai de classification fine sur 14 QCM. Le pilote prouve que les questions de la compétence faible sont plus souvent proposées, **pas** que les élèves apprennent mieux. Deux réserves : `SEF-V44-054` nécessite de qualifier `3♠` après `1♥–2♥` (retour à `3♥` impossible) ; `SEF-V44-053` exige relecture de la qualité de l'essai à Carreau. **Proposition : conserver le lot C non actif et ne pas élargir la classification** à ce stade.

## Conditions de mise en ligne

1. **D1–D4 validés pédagogiquement (11/11)** par l'utilisatrice ; conserver séparément l'arbitrage du lot C, non actif.
2. Appliquer uniquement les groupes approuvés à `quizz.html` dans une PR **distincte de publication**, avec contrôle des 1 523 QCM, des 22 rubriques, des mains/points, des bonnes réponses et des sauvegardes.
3. Tests intégrité, moteur, Chromium, WebKit, puis fusion et publication contrôlées. Ne pas engager d'homologation générale des 620 classifications en attente.

**Ces validations éditoriales ne sont PAS une autorisation implicite de fusion ou de publication.**

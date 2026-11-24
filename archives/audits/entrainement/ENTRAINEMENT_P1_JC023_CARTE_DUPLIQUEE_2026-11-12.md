# QPJB Entraînement — JC-023 : duplication de ♠6 et comparaison de deux impasses

**Date :** 12 novembre 2026. **Périmètre :** `JC-023` uniquement, sans modification du Quiz SEF.

## Sources primaires (PDF originaux de la Bibliothèque)

Archive : `/QPJB Training/Archives/BM_originaux_2026-10-23.zip`. Pages **2** des deux PDF rendues en images et inspectées visuellement.

| Document | SHA-256 |
|---|---|
| `23 BRIDGE&MOIS_DEBUTANT EXERCICE octobre 2026.pdf` | `d6febe0b7989eacf6e7bee71606f2e2f58665b01c89a1b9245956abda5ee2a74` |
| `23 BRIDGE&MOIS_DEBUTANT SOLUTION octobre 2026.pdf` | `fc85574478a84e9d01235112d8c2e4a76539ea76f4702b63a17f0fddfab3edd9` |

Aucun PDF modifié. Le corrigé d'origine reste intégralement sous `sourceOriginalAnswerText`.

## Anomalie source démontrée

Le PDF corrigé donne :
- **Nord :** ♠42 ♥75 ♦AR10963 ♣652
- **Est :** ♠DV109 ♥932 ♦D75 ♣983
- **Sud :** ♠R76 ♥ARV ♦V4 ♣ADV104
- **Ouest :** ♠A865 ♥D10864 ♦82 ♣R7

La carte **♠6 figure à la fois en Ouest et en Sud**, et **♠3 n'existe dans aucune main**. Chaque main présente 13 cartes, mais le paquet est invalide : les 52 cartes ne sont pas distinctes. Le sujet et la main visible en Sud ne sont pas modifiés.

Pour les deux exemples suivants, et **uniquement pour leur simulation**, on remplace la carte ♠6 **d'Ouest** par ♠3 (Ouest ♠A853). Cette correction d'une carte cachée est une **hypothèse**, pas une donnée du fascicule ou une réparation silencieuse du jeu d'origine.

## Exemple 1 : Trèfle d'abord — 13 plis légalement vérifiés sur la reconstruction

| Pli | Cartes dans l'ordre de jeu | Pli gagné par |
|---|---|---|
| 1 | O ♥6 · N ♥5 · E ♥2 · S ♥V | S |
| 2 | S ♦4 · O ♦2 · N ♦A · E ♦5 | N |
| 3 | N ♣2 · E ♣3 · S ♣V · O ♣R | O |
| 4 | O ♠A · N ♠2 · E ♠9 · S ♠6 | O |
| 5 | O ♠5 · N ♠4 · E ♠10 · S ♠R | S |
| 6 | S ♣A · O ♣7 · N ♣5 · E ♣8 | S |
| 7 | S ♣D · O ♥4 · N ♣6 · E ♣9 | S |
| 8 | S ♣10 · O ♥8 · N ♦3 · E ♥3 | S |
| 9 | S ♣4 · O ♥10 · N ♦6 · E ♥9 | S |
| 10 | S ♥A · O ♥D · N ♥7 · E ♦7 | S |
| 11 | S ♥R · O ♦8 · N ♦9 · E ♦D | S |
| 12 | S ♦V · O ♠3 · N ♦R · E ♠V | N |
| 13 | N ♦10 · E ♠D · S ♠7 · O ♠8 | N |

**Résultat de cette ligne précise : 11 levées Nord/Sud, 2 Est/Ouest.** Toutes les cartes distinctes de la reconstruction sont consommées exactement une fois. Cette défense n'est pas annoncée comme optimale ; il s'agit d'une preuve d'existence d'une ligne gagnante sur la distribution hypothétique.

## Exemple 2 : impasse immédiate à Carreau — cinq plis défensifs en six levées

| Pli | Cartes dans l'ordre de jeu | Pli gagné par |
|---|---|---|
| 1 | O ♥6 · N ♥5 · E ♥2 · S ♥V | S |
| 2 | S ♦V · O ♦2 · N ♦3 · E ♦D | E |
| 3 | E ♠D · S ♠R · O ♠A · N ♠2 | O |
| 4 | O ♠8 · N ♠4 · E ♠V · S ♠6 | E |
| 5 | E ♠10 · S ♠7 · O ♠5 · N ♦6 | E |
| 6 | E ♠9 · S ♣4 · O ♠3 · N ♦9 | E |

La défense possède **cinq levées dès le sixième pli** : ♦D, ♠A, ♠V, ♠10 et ♠9. La chute de 3SA dans cet exemple est certaine.

## Limites, décision et invariants

- L'audit justifie la **préférence pédagogique des Trèfles** par les communications et le danger de rendre la main à Est sur l'impasse Carreau.
- L'invalidité de la donne imprimée est **certaine** ; le remplacement de ♠6 d'Ouest par ♠3 demeure **hypothétique** et est distinct du sujet original.
- Ni les exemples ni les raisonnements du document ne certifient l'optimalité contre **toutes les distributions** et tous les retours.
- Ancien corrigé archivé mot pour mot ; **quarantineReason** corrigé pour signaler l'erreur matérielle désormais prouvée, son ancien libellé archivé dans **sourceOriginalQuarantineReason**. Main, question, image, sourceRef, reviewStatus, historicalReviewStatus et progression inchangés.
- **Un seul objet carte modifié éditorialement ; 187 autres exercices de carte et 638 enchères strictement inchangés. Total 826 ID.**
- Synchronisation maître/module jeu de la carte, invalidation cache PWA et assertions ciblées. **CI intégrité + Chromium + WebKit requises avant toute fusion**.

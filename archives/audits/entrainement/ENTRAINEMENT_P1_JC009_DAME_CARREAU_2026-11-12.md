# QPJB Entraînement — JC-009 : pointage des honneurs et localisation de ♦D

**Date :** 12 novembre 2026. **Périmètre :** `JC-009` uniquement (jeu de la carte).

## Sources primaires
Archive : `/QPJB Training/Archives/BM_originaux_2026-10-23.zip`. Pages 2 du sujet et du corrigé extraites, rendues, lues visuellement puis recoupées avec le texte PDF.

| Original | SHA-256 |
|---|---|
| `1. BRIDGE&MOIS_DEBUTANT EXERCICE 06-12-2024.pdf` | `6c7bbdd8d5fdf9357624acbda459fa90939c93a843ab75d6970c589a5a3b68df` |
| `1. BRIDGE&MOIS_DEBUTANT SOLUTION 10-12-2024.pdf` | `9cf95786cada7af355bd008cf5941b48948ea9a3584b6135fb9d94a68893d770` |

PDF originaux inchangés. Ancien corrigé `answerText` conservé **intégralement** dans `sourceOriginalAnswerText`.

## Cartes originales du corrigé (3SA Sud, entame ♥V)

| Siège | ♠ | ♥ | ♦ | ♣ | H |
|---|---|---|---|---|---:|
| Nord | A2 | 75 | AV6542 | 1073 | 9 |
| Est | DV | AD1094 | D9 | V652 | 12 |
| Sud | R843 | R832 | R3 | ARD | 18 |
| Ouest | 109765 | V6 | 1087 | 984 | 1 |

Contrôle programmatique : les 52 cartes sont **toutes distinctes**, 13 par siège, 13 par couleur ; total 40 H. Nord-Sud = 27 H, Est-Ouest = 13 H.

## Preuve de neuf plis gagnants sur cette donne

Une ligne concrète (la défense **laisse** ♥R remporter la première levée comme dans la question) :

| Pli | Ordre des cartes | Gagnant |
|---|---|---|
| 1 | O ♥V · N ♥5 · E ♥4 · S ♥R | S |
| 2 | S ♦R · O ♦7 · N ♦2 · E ♦9 | S |
| 3 | S ♦3 · O ♦8 · N ♦A · E ♦D | N |
| 4 | N ♦V · E ♥9 · S ♠3 · O ♦10 | N |
| 5 | N ♦6 · E ♥10 · S ♠4 · O ♠5 | N |
| 6 | N ♦5 · E ♣2 · S ♥2 · O ♠6 | N |
| 7 | N ♦4 · E ♣5 · S ♥3 · O ♠7 | N |
| 8 | N ♠A · E ♠V · S ♠8 · O ♠9 | N |
| 9 | N ♠2 · E ♠D · S ♠R · O ♠10 | S |

**Neuf plis Nord-Sud consécutifs**, vérifiés avec un validateur (carte disponible, fourniture à la couleur, rang du gagnant, droit d'entame). La ligne prouve la réussite dans la variante publiée, **pas l'optimalité universelle**.

## La localisation de ♦D suppose une valeur minimale de l'ouverture

Avec 27 H connus, il reste **13 H** au flanc ; le ♥V d'Ouest représente déjà **1 H**. Si Est détient **au moins 11 H**, Ouest ne peut avoir que **2 H au maximum**. La présence de ♦D en Ouest donnerait pourtant **3 H au minimum** à Ouest (♥V + ♦D). **Sous l'hypothèse Est ≥ 11 H, ♦D est donc forcément en Est.**

En revanche, certaines ouvertures distribuées à 10 H sont permises par la **règle des 20** (H + somme des longueurs des deux couleurs), avec honnête concentration des honneurs dans le bicolore. Pour une main 6♥5♠ de 10 H : 10 + 6 + 5 = 21, ce qui permet à une paire d'ouvrir de 1♥ en premier. Le critère est sourcé par les supports d'enseignement :
- `https://graulhetbridgeclub.wifeo.com/documents/jouez-au-bridge-sef.pdf`
- `https://abc-du-bridge.scenari-community.org/003-02/co/003-02-01.html`

### Contre-exemple valide, différent du corrigé imprimé

Les mains visibles **Nord et Sud sont identiques au sujet** ; seules Est et Ouest, inconnus de l'élève, diffèrent :

| Siège | ♠ | ♥ | ♦ | ♣ | H |
|---|---|---|---|---|---:|
| Nord | A2 | 75 | AV6542 | 1073 | 9 |
| Est | DV1095 | AD10964 | 9 | V | **10** |
| Sud | R843 | R832 | R3 | ARD | 18 |
| Ouest | 76 | V | D1087 | 986542 | **3** |

Contrôle : exactement 52 cartes distinctes, 13 par siège et 40 H. Est peut ouvrir **1♥ avec six Cœurs et cinq Piques (10 H, bicolore 6-5)** dans une approche basée sur la règle des 20 ; Ouest peut légalement entamer du **♥V singleton** (entame inhabituelle mais possible). **♦D est cette fois en Ouest.**

Cela réfute la **certitude générale** de la déduction, sans réfuter la position de ♦D dans la donne originale ni établir qu'une ligne de jeu alternative est meilleure dans l'ensemble des distributions.

## Décision et invariants
- Corriger la **portée** de l'inférence : conclusion conditionnelle à une ouverture d'Est d'**au moins 11 H** ; ne pas présenter 12 H en Est comme une promesse générale de 1♥.
- Garder la stratégie du document pour sa donne : ♦R, puis ♦A pour faire tomber ♦D seconde, puis longue du mort.
- **Une seule carte/exercice édité** : `JC-009` ; **187** autres exercices de carte et **638** enchères inchangés, **826 identifiants** conservés.
- Mains, image, ID, question, source, niveaux, statuts, sauvegardes et progression historiques inchangés. Pas de revendication de simulation double-dummy exhaustive.
- Modules maître et carte synchronisés, cache PWA versionné, assertions ciblées, CI intégrité + Chromium + WebKit requise avant fusion.

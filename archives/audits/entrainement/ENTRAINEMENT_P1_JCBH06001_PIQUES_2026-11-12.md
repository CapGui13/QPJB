# QPJB Entraînement — JC-BH-060-01 : 3SA, développer les Piques sans perdre le tempo

**Date :** 12 novembre 2026. **Audit indépendant et conditionnel :** un seul exercice de jeu de la carte. Aucune simulation double-dummy exhaustive ou certification d'optimalité générale.

## Sources originales inspectées
Archive : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.
- `60 Exercice Votre Bridge Hebdo débutant 21-04-2023.pdf`, SHA-256 `6def30ebd259fa163ea9678c069ceb6be16bdf65838531baac1a1aa1b2f8f998`.
- `60 Solution Votre Bridge Hebdo débutant 21-04-2023.pdf`, SHA-256 `26d3902d8d962b1c7635cd913e0f65925ee1d073809c7962d6743c766b302a15`.

Pages **2** des deux documents extraites et inspectées visuellement, puis recoupées avec le texte. Les PDF n'ont pas été modifiés. `sourceOriginalAnswerText` et `sourceOriginalTechnicalQA` archivent exactement les champs précédents de QPJB.

## Donne originale du corrigé

Contrat **3SA par Sud**, entame **♥R par Ouest**.

| Siège | ♠ | ♥ | ♦ | ♣ |
|---|---|---|---|---|
| N | RD643 | A6 | 984 | D32 |
| E | V107 | 7543 | D3 | V1076 |
| S | 85 | 982 | AR765 | AR8 |
| O | A92 | RDV10 | V102 | 954 |

Contrôle de la donne : 13 cartes par siège, 52 cartes distinctes, 13 cartes par couleur.

## Analyse des levées

**6 plis immédiats :** ♥A, ♦A-R, ♣A-R-D. Les 3 levées supplémentaires recherchées viennent des Piques (♠A en Ouest et partage 3-3 des six Piques du flanc), en conservant les communications vers ♠R-D et les petites Piques affranchies.

### Ligne A — Piques d'abord, 9 levées sur 13 (donne imprimée)

| Pli | Quatre cartes dans l'ordre | Gagnant |
|---:|---|---|
| 1 | O ♥R · N ♥A · E ♥3 · S ♥2 | N |
| 2 | N ♣2 · E ♣6 · S ♣A · O ♣4 | S |
| 3 | S ♠5 · O ♠A · N ♠3 · E ♠7 | O |
| 4 | O ♥D · N ♥6 · E ♥4 · S ♥8 | O |
| 5 | O ♥V · N ♦4 · E ♥5 · S ♥9 | O |
| 6 | O ♥10 · N ♦8 · E ♥7 · S ♦5 | O |
| 7 | O ♣5 · N ♣D · E ♣7 · S ♣8 | N |
| 8 | N ♣3 · E ♣10 · S ♣R · O ♣9 | S |
| 9 | S ♠8 · O ♠2 · N ♠R · E ♠10 | N |
| 10 | N ♠D · E ♠V · S ♦6 · O ♠9 | N |
| 11 | N ♠6 · E ♦3 · S ♦7 · O ♦2 | N |
| 12 | N ♠4 · E ♣V · S ♦R · O ♦10 | N |
| 13 | N ♦9 · E ♦D · S ♦A · O ♦V | S |

**Bilan : N/S 9, E/O 4**. Les seuls plis défensifs sont ♠A et trois Cœurs. La ligne réalise quatre Piques (♠R, ♠D, ♠6, ♠4), un Cœur, un Carreau et trois Trèfles. Les obligations de fournir à la couleur, la disponibilité de chaque carte, le gagnant de chaque pli et le droit d'entamer le suivant ont été vérifiés par un validateur de levées à sans-atout.

### Ligne B — Carreaux d'abord, cinq levées défensives dès le huitième pli

| Pli | Quatre cartes dans l'ordre | Gagnant |
|---:|---|---|
| 1 | O ♥R · N ♥A · E ♥3 · S ♥2 | N |
| 2 | N ♦4 · E ♦3 · S ♦A · O ♦2 | S |
| 3 | S ♦R · O ♦10 · N ♦8 · E ♦D | S |
| 4 | S ♦7 · O ♦V · N ♦9 · E ♥4 | O |
| 5 | O ♥D · N ♥6 · E ♥5 · S ♥8 | O |
| 6 | O ♥V · N ♠3 · E ♥7 · S ♥9 | O |
| 7 | O ♥10 · N ♠4 · E ♣6 · S ♦6 | O |
| 8 | O ♠A · N ♠6 · E ♠7 · S ♠5 | O |

**Bilan après huit plis : E/O 5** (♦V, ♥D, ♥V, ♥10, ♠A). Cette ligne illustre le risque que décrit le corrigé en donnant la main à Carreau avant d'avoir développé les Piques.

## La répartition 4-4 des Cœurs n'est pas une nécessité universelle

La conclusion du fascicule indique que sans partage 4-4 des Cœurs, la défense réaliserait nécessairement quatre Cœurs et un Pique. C'est vrai pour des distributions et communications défensives données, mais pas pour toute distribution des huit Cœurs.

**Contre-exemple explicitement hypothétique :** en conservant totalement Nord et Sud de la source, remplacer **♥10 d'Ouest par ♦3 d'Est**. Cela donne :
- Ouest : ♠A92 ♥RDV ♦V1032 ♣954 (**trois Cœurs**).
- Est : ♠V107 ♥107543 ♦D ♣V1076 (**cinq Cœurs**).

52 cartes distinctes, toutes les répartitions valides. Ouest entame toujours ♥R. Une ligne légale sur cette reconstruction est :

| Pli | Quatre cartes dans l'ordre | Gagnant |
|---:|---|---|
| 1 | O ♥R · N ♥A · E ♥3 · S ♥2 | N |
| 2 | N ♣2 · E ♣6 · S ♣A · O ♣4 | S |
| 3 | S ♠5 · O ♠A · N ♠3 · E ♠7 | O |
| 4 | O ♥D · N ♥6 · E ♥4 · S ♥8 | O |
| 5 | O ♥V · N ♦4 · E ♥5 · S ♥9 | O |
| 6 | O ♦3 · N ♦8 · E ♦D · S ♦A | S |
| 7 | S ♣R · O ♣5 · N ♣3 · E ♣7 | S |
| 8 | S ♠8 · O ♠2 · N ♠R · E ♠10 | N |
| 9 | N ♠D · E ♠V · S ♦5 · O ♠9 | N |
| 10 | N ♠6 · E ♥7 · S ♦6 · O ♦2 | N |
| 11 | N ♠4 · E ♣10 · S ♦7 · O ♦10 | N |
| 12 | N ♣D · E ♣V · S ♣8 · O ♣9 | N |
| 13 | N ♦9 · E ♥10 · S ♦R · O ♦V | S |

**Bilan : N/S 10, E/O 3** (♠A, ♥D, ♥V). La défense ne fait pas automatiquement quatre levées de Cœur en raison du défaut de reprise permettant d'accéder aux Cœurs supplémentaires d'Est. Cet exemple ne prouve pas que la ligne gagne contre toute défense ; il invalide uniquement la prétendue nécessité universelle du 4-4.

## Décision éditoriale et garde-fous

- Conserver le plan du fascicule : éviter de perdre le tempo à Carreau, rentrer en Sud à Trèfle et jouer petit Pique vers ♠R-D du mort.
- Expliciter la **condition ♠A en Ouest, Piques 3-3** et le rôle des communications ; illustrer l'enjeu des quatre Cœurs d'Ouest sur la donne d'origine.
- Ne pas présenter le **partage 4-4 des Cœurs** comme une nécessité sur toutes les autres donnes.
- Corriger seulement `JC-BH-060-01` : le texte, les métadonnées d'audit, la source et sa provenance. Les statuts, mains, question, illustration, leçon et progression demeurent inchangés. **638 enchères, 187 autres cartes et 826 identifiants préservés**.
- Synchronisation des modules et cache PWA incrémenté, assertions dédiées ; intégrité, Chromium et WebKit requis avant fusion.

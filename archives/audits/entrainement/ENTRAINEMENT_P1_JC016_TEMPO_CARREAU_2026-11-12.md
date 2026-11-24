# Entraînement QPJB — JC-016 : priorité au Carreau, contrôle pli par pli

**Date :** 12 novembre 2026. **Périmètre :** exercice `JC-016` de jeu de la carte, sans modification du Quiz SEF.

## Sources primaires

Archive Bibliothèque `/QPJB Training/Archives/BM_originaux_2026-10-23.zip` ; pages **2** de deux PDF extraites, rendues en image et confrontées au texte.

| PDF original | SHA-256 |
|---|---|
| `11 BRIDGE&MOIS_DEBUTANT EXERCICE.pdf` | `9fd0c6b6455f845612067800e8ed4bb9f62e2fec6c78502d79cdb7f6c272afa3` |
| `11 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf` | `19f4d4be860c0858cd4ab236f1df9ddb647dffca08f49fcee1eeac5b7579721e` |

Le sujet montre uniquement Nord et Sud ; le corrigé divulgue **les quatre mains**. Le PDF originel n'est pas modifié.

## Donne authentique vérifiée

| Siège | ♠ | ♥ | ♦ | ♣ |
|---|---|---|---|---|
| Nord | D763 | RD82 | V3 | A75 |
| Est | R1084 | A5 | 8764 | DV6 |
| Sud | A | V109763 | A102 | 982 |
| Ouest | V952 | 4 | RD95 | R1043 |

Chaque joueur a 13 cartes ; les 52 cartes sont distinctes et les 13 cartes de chaque couleur sont représentées exactement une fois. **Contrat : 4♥ en Sud, entame : ♦R en Ouest.**

## Variante gagnante du corrigé (10 levées, seulement trois levées adverses)

Cartes dans l'ordre de jeu de chaque pli ; N = Nord, E = Est, S = Sud, O = Ouest.

| Pli | Cartes jouées dans l'ordre | Gagnant |
|---|---|---|
| 1 | O ♦R · N ♦3 · E ♦4 · S ♦A | S |
| 2 | S ♦2 · O ♦D · N ♦V · E ♦6 | O |
| 3 | O ♣3 · N ♣A · E ♣6 · S ♣2 | N |
| 4 | N ♠3 · E ♠4 · S ♠A · O ♠2 | S |
| 5 | S ♦10 · O ♦5 · N ♣5 (défausse) · E ♦7 | S |
| 6 | S ♥V · O ♥4 · N ♥2 · E ♥A | E |
| 7 | E ♣D · S ♣8 · O ♣4 · N ♣7 | E |
| 8 | E ♣V · S ♣9 · O ♣10 · N ♥8 (coupe) | N |
| 9 | N ♥R · E ♥5 · S ♥3 · O ♠5 | N |
| 10 | N ♥D · E ♠8 · S ♥6 · O ♠9 | N |
| 11 | N ♠D · E ♠R · S ♥7 (coupe) · O ♠V | S |
| 12 | S ♥10 · O ♦9 · N ♠6 · E ♠10 | S |
| 13 | S ♥9 · O ♣R · N ♠7 · E ♦8 | S |

**Bilan : N/S = 10 plis ; E/O = 3 plis** (♦D, ♥A et ♣D). La coupe au huitième pli exploite le Trèfle défaussé au cinquième pli.

## Variante chutable en jouant atout immédiatement (4 levées adverses)

| Pli | Cartes jouées dans l'ordre | Gagnant |
|---|---|---|
| 1 | O ♦R · N ♦3 · E ♦4 · S ♦A | S |
| 2 | S ♥3 · O ♥4 · N ♥2 · E ♥A | E |
| 3 | E ♣D · S ♣2 · O ♣3 · N ♣A | N |
| 4 | N ♠3 · E ♠4 · S ♠A · O ♠2 | S |
| 5 | S ♦2 · O ♦D · N ♦V · E ♦6 | O |
| 6 | O ♣R · N ♣5 · E ♣6 · S ♣8 | O |
| 7 | O ♣10 · N ♣7 · E ♣V · S ♣9 | E |

**Bilan : quatre plis adverses déjà acquis** (♥A, ♦D, ♣R, ♣V). Ces séquences ont été vérifiées par un contrôle indépendant des cartes jouées : disponibilité de chaque carte, obligation de fournir à la couleur, coupe et gagnant de chaque pli, identité du joueur ayant l'entame du pli suivant.

## Portée exacte des conclusions

- L'exemple valide **le mécanisme pédagogique du ♦2 à la deuxième levée** et montre le coût d'une ligne naïve commençant par les atouts.
- Ces **deux lignes explicites** ne constituent ni exploration exhaustive des défenses possibles ni preuve de l'optimalité au sens double-dummy.
- Le corrigé original, conservé intégralement sous `sourceOriginalAnswerText`, conclut « Il ne peut plus rien vous arriver » ; la version éditoriale limite cette promesse à la variante concrètement examinée.
- Les **638 enchères, 187 autres exercices de carte, 826 IDs, mains, question, image, sourceRef, statut et progression historique** restent inchangés.
- Versions de cache/scripts et assertions de non-régression dédiées ; intégrité, Chromium et WebKit doivent être verts avant toute fusion.

# QPJB Entraînement — JC-020 : ♦V non garanti par l'entame de ♦D
**Date :** 12 novembre 2026. **Périmètre :** Jeu de la carte, exercice `JC-020` seulement.

## Sources primaires et intégrité
- Archive : `/QPJB Training/Archives/BM_originaux_2026-10-23.zip`.
- Sujet : `17 BRIDGE&MOIS_DEBUTANT EXERCICE.pdf`, SHA-256 `690eb90b7fa808608c34a14aa1dc00b5f2da93d39570f919c12ff765016da824`.
- Corrigé : `17 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf`, SHA-256 `e993374b5f0b89932753e823a7bee460ae9c1e1fd1092b8869f4d0d61b3b18b0`.
- Pages **2** des deux documents extraites, rendues et lues visuellement, puis recoupées avec l'extraction textuelle. PDF originaux inchangés.
- Le corrigé original, intégral, est préservé dans `sourceOriginalAnswerText`. Aucun autre exercice modifié.

## Donne originale du PDF — 4♥ en Sud, entame ♦D d'Ouest

| Siège | ♠ | ♥ | ♦ | ♣ |
|---|---|---|---|---|
| Nord | ARV | 1072 | A104 | 8732 |
| Est | D9654 | 53 | 8752 | A10 |
| Sud | 32 | RDV986 | R6 | D65 |
| Ouest | 1087 | A4 | DV93 | RV94 |

**Vérification complète :** 13 cartes par joueur, 52 cartes distinctes, chaque couleur de l'As au 2 représentée exactement une fois.

## Ligne gagnante (13 plis légalement vérifiés)

| Pli | Ordre exact des cartes | Gagnant |
|---|---|---|
| 1 | O ♦D, N ♦4, E ♦2, S ♦R | S |
| 2 | S ♦6, O ♦3, N ♦10, E ♦5 | N |
| 3 | N ♦A, E ♦7, S ♣5 (défausse), O ♦9 | N |
| 4 | N ♠A, E ♠4, S ♠2, O ♠7 | N |
| 5 | N ♠R, E ♠5, S ♠3, O ♠8 | N |
| 6 | N ♥2, E ♥5, S ♥R, O ♥4 | S |
| 7 | S ♥D, O ♥A, N ♥7, E ♥3 | O |
| 8 | O ♣4, N ♣2, E ♣A, S ♣6 | E |
| 9 | E ♣10, S ♣D, O ♣R, N ♣3 | O |
| 10 | O ♣V, N ♣7, E ♠6, S ♥V (coupe) | S |
| 11 | S ♥9, O ♠10, N ♥10, E ♠9 | N |
| 12 | N ♠V, E ♠D, S ♥8 (coupe), O ♦V | S |
| 13 | S ♥6, O ♣9, N ♣8, E ♦8 | S |

**Résultat vérifié : 10 plis N/S, 3 plis E/O (♥A, ♣A, ♣R).** Le contrôle vérifie à chaque pli : disponibilité des quatre cartes, obligation de fournir à la couleur, valeur de la coupe, rang gagnant et droit d'entamer le pli suivant. Cette séquence prouve une réussite contre **cette ligne défensive**, pas une garantie de réussite face à toute défense.

**Si Ouest couvre le ♦6 de ♦V au deuxième pli :** Nord peut prendre de ♦A et jouer ♦10 ensuite (Ouest restant avec ♦9 et ♦3). Cela confirme la possibilité de défausse sur la donne imprimée.

## Contre-exemple valide à l'affirmation « une autre [impasse] réussit à coup sûr »

Les mains N et S sont **strictement celles du sujet**, mais les mains cachées sont redistribuées :

| Siège | ♠ | ♥ | ♦ | ♣ |
|---|---|---|---|---|
| Nord | ARV | 1072 | A104 | 8732 |
| Est | D96 | 53 | V87532 | A10 |
| Sud | 32 | RDV986 | R6 | D65 |
| Ouest | 108754 | A4 | D9 | RV94 |

Cette donne comporte également 52 cartes valides. Ouest peut entamer **♦D** depuis son doubleton ♦D9. Première levée : O ♦D, N ♦4, E ♦2, S ♦R. Deuxième levée : S ♦6, O ♦9, N ♦10, **E ♦V gagne**. La défausse de Sud au troisième tour de Carreau n'est donc pas acquise. Ce contre-exemple démontre **la non-garantie de l'impasse**, pas nécessairement la chute de 4♥ dans cette autre donne.

## Décision éditoriale et limites

- Conserver le plan et son objectif pédagogique : **prendre ♦R puis ♦6 vers ♦10, et défausser un Trèfle de Sud sur ♦A** lorsque le ♦V est en Ouest.
- Remplacer la formule absolue du corrigé par une condition explicite sur le placement de ♦V, et une illustration légale sur la donne du document.
- Ne pas prétendre avoir exploré toutes les défenses ni optimisé le plan par une étude double-dummy.
- `JC-020` uniquement : `answerText`, archivage du texte original et métadonnées d'audit. **638 enchères et 187 autres cartes intégralement inchangées ; total de 826 ID**. Aucune main, question, image, sourceRef, statut, sauvegarde ou réponse modifiés.
- Synchroniser module maître et module des cartes, actualiser cache PWA et assertions de test. **CI intégrité, Chromium, WebKit avant toute publication.**

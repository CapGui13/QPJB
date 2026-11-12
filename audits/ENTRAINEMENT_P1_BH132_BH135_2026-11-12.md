# QPJB Entraînement — contre-expertise BH-132 et BH-135

**Date : 12 novembre 2026.** Périmètre : trois fiches **JC-BH-132-M01**, **JC-BH-132-M02** et **JC-BH-135-J01**. Archive de référence : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`. Pages **2** des quatre PDF (exercices et solutions) inspectées visuellement, puis texte recoupé. Aucun PDF modifié.

## Verdicts

| Exercice | Vérification | Verdict |
| --- | --- | --- |
| **BH-132-M01** | ♣ARV5 au mort face à ♣1042, toutes les rentrées extérieures disponibles. Coup de sonde par ♣A ou ♣R, puis petit Trèfle de Sud vers ♣V. Dans la répartition illustrative du fascicule, Ouest ♣D8 et Est ♣9763, quatre levées de Trèfle sont effectivement possibles, à condition de **garder le ♣10** pour dépasser ♣9. | **Conforme et conditionnel** ; quatre levées non garanties contre toute répartition. |
| **BH-132-M02** | ♣ARV109 au mort face à ♣42 en Sud. Deux impasses vers les honneurs du mort permettent de profiter d'une Dame chez Ouest au plus quatrième ; le coup de sonde initial supprime une remontée d'impasse de Sud. | **Conforme** ; probabilités vérifiées **43,2 %** contre **28,3 %** sous les hypothèses explicitées ci-dessous. |
| **BH-135-J01** | 3SA par Sud, ♦R entamé par Ouest. Débloquer ♠R-D, accéder au mort par ♥A, encaisser ♠A puis ♥D, revenir en Sud avec ♣A et encaisser ♥R-V. | **Conforme** ; neuf levées réalisées dans une ligne légale, uniquement sur une reconstruction de ♣6 *hypothétique* pour traiter la coquille du fascicule. |

## BH-132 : démonstrations

### M01 — Conserver le 10

Sur les **13 Trèfles du diagramme du corrigé** : Nord ♣ARV5, Sud ♣1042, Ouest ♣D8, Est ♣9763.

1. Nord encaisse ♣A (Est ♣3, Sud ♣2, Ouest ♣8).
2. Après un **transfert extérieur** vers Sud, Sud joue ♣4 ; Ouest met ♣D, le mort prend de ♣R, Est fournit ♣6.
3. Nord joue ♣5 ; Est fournit ♣7, Sud prend de **♣10** (Ouest est défaussé).
4. Après un autre **transfert extérieur** au mort, Nord encaisse ♣V devant ♣9 d'Est.

**Quatre levées à Trèfle**, et aucun pli adverse dans cette couleur. Le recours à des reprises extérieures est une hypothèse **explicitement donnée par le sujet**, non une distribution inventée.

### M02 — Probabilités contrôlées

Les six Trèfles adverses sont **♣D, ♣8, ♣7, ♣6, ♣5, ♣3**. Pour une répartition donnée, si Ouest possède \(k\) de ces cartes, le poids combinatoire est \(\binom{20}{13-k}\) parmi \(\binom{26}{13}\) attributions équiprobables de cartes inconnues (les 20 cartes non-Trèfles manquantes sont libres).

- **Deux impasses** depuis Sud : cinq levées si ♣D se trouve en Ouest dans une longueur à Trèfle de **1 à 4**. Somme exacte : **43,1987578 %**, soit **43,2 %**.
- **♣A puis une impasse** : cinq levées dans le cas ♣D chez Ouest avec longueur **1 à 3**, ou ♣D **sèche en Est** prise à l'As. Somme exacte : **28,2608696 %**, soit **28,3 %**.

Ces chiffres sont conditionnels au modèle de répartition indiqué, à la disponibilité des reprises extérieures et à l'objectif de **cinq levées de Trèfle sans perte**. Ils ne décrivent pas la probabilité de réussir un contrat complet.

Sur l'exemple du fascicule (Ouest ♣D875, Est ♣63), la ligne **♣2 vers ♣V, retour Sud, ♣4 vers ♣10, puis ♣A-R-9** fait cinq levées. Le coup de sonde par ♣A ferait perdre cette possibilité, Ouest pouvant conserver ♣D jusqu'au quatrième tour.

## BH-135 : ne pas transformer une coquille en prétendue source

**Le sujet et le corrigé** impriment tous deux le ♣6 chez Nord **et** chez Sud ; ils omettent le ♣7. La somme des mains imprimées fait 52 cartes, mais seulement **51 cartes distinctes**.

| Siège | ♠ | ♥ | ♦ | ♣ |
| --- | --- | --- | --- | --- |
| Nord | A43 | AD | 863 | 98642 |
| Est | V972 | 109873 | 104 | D5 |
| Sud | RD | RV62 | A95 | A1063 |
| Ouest | 10865 | 54 | RDV72 | RV |

La fiche publique QPJB a déjà correctement **masqué les deux ♣6 litigieux** dans l'énoncé et conservé les deux mains partielles. Nous ne les remplaçons pas.

**Simulation uniquement hypothétique :** attribuer le ♣7 en Sud **à la place** du ♣6 de Sud, sans modifier Nord, Est ni Ouest. Cette réparation arbitraire rend les 52 cartes distinctes. Une séquence de **13 plis légaux** sur cette distribution donne **9 levées N/S, 4 E/O**. Les neuf premières levées sont, dans l'ordre :

1. ♦A de Sud sur ♦R d'Ouest.
2. ♠R de Sud.
3. ♠D de Sud.
4. ♥A au mort depuis ♥2.
5. ♠A du mort.
6. ♥D du mort.
7. ♣A en Sud, sur un petit Trèfle du mort.
8. ♥R de Sud.
9. ♥V de Sud.

La logique pédagogique est donc correcte et **ne dépend pas** de la petite carte dupliquée. Cette ligne ne certifie pas l'optimalité double-dummy de 3SA contre toutes les défenses.

## Empreintes SHA-256 des PDF archivés

| Document | SHA-256 |
| --- | --- |
| 132 Exercice, 06/09/2024 | `9eab7cf573674f8a8647ef7d8f951cd3bda937b8db0efbcf2dd7ba6d785a9dff` |
| 132 Solution, 06/09/2024 | `ea7ef866315d7384fd11ffc635bc8d8d08210db926ec0e2ce87819890a331e61` |
| 135 Exercice, 27/09/2024 | `edcb33ddad1edf61117abc87dee10a9bec1e67ed7f395f09efe871dcdef3981a` |
| 135 Solution, 27/09/2024 | `28ef4b9d2b01f2f42600013789b224fb946b7ec4578d19bede4e97302d07394a` |

## Garde-fous GitHub

Le test `tests/training-card-bh132-bh135-proof.cjs` vérifie le décompte combinatoire de BH-132, deux séquences de maniement, la duplication exacte de ♣6 dans BH-135, l'intégrité d'une **réparation explicitement hypothétique** et les **13 plis de 3SA** (carte disponible, obligation de fournir, sens du jeu, gagnant de chaque pli, entame suivante). Il est appelé par le smoke test.

**Aucune correction éditoriale requise :** ni `training-data.js`, ni modules d'exercices, ni énoncés, ni mains visibles, ni progression, ni cache PWA modifiés. **638 exercices d'enchères + 188 de carte = 826 identifiants conservés.**

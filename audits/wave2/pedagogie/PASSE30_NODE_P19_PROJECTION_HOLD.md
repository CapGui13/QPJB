# QPJB — M1 / P30 : premier contrôle P19 avec son code exact sous Node

**PASSE 30 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Travail nouveau par rapport aux simulations antérieures
Le test `tests/wave2-pedagogie-gates-p19.cjs` (blob GitHub **`1a268080a074b1280db6483b8f67757b19a30ccf`**) a été copié **octet pour octet** depuis GitHub dans un environnement local Node **22.16.0**. Une seconde vérification `git hash-object` du fichier local a confirmé cette identité.

Les **cinq documents GitHub de référence** ont été consultés intégralement, puis leurs **champs consommés effectivement par ce test** ont été projetés dans cinq fichiers JSON locaux (projection réduite, source vérifiée en lecture seule). Le test **original non modifié** a été exécuté avec **Node natif : PASS**, rapportant **6 précisions éditoriales + 11 accords toujours HOLD, deux contre-exemples internes détectés**.

**Contrôles adverses externes sous Node :**
1. Dans une copie temporaire de la projection, validation humaine de l'accord n°9 simulée (`confirmedByHuman=true`) : **FAIL explicite « Accord approuve sans visa humain »**.
2. Suppression de l'arrêt Carreau du cas Texas (`diamondStopper=false`) : **FAIL « Contre-exemple Texas perdu »**.
3. Restauration des deux fichiers source projetés : **PASS**.

**Contre-vérification sur données intégrales (non Node natif)** : le **même fichier de test exact** a été exécuté en moteur JavaScript isolé avec les **cinq documents GitHub complets** : **PASS 6+11 HOLD et deux contre-tests**. Ces documents originaux ont les blobs Git :
- `ARBITRAGES_P14_HOLD.json` : `b0a91559043988f0695add2b0682bd67f9cfd9f7`
- `MATRICE_REPRISE_P16_HOLD.json` : `7427c4df1f9280a8599d60d99d29d5ad41a6adfa`
- `PREUVES_SEF_P15_HOLD.json` : `22b4c95f5f828e62d986fdabd6b60dcfbf9cc893`
- `TEXAS_CONTRADICTOIRE_P17_HOLD.json` : `53e22641694b93f4217c4b6792f0056831b35bdf`
- `CHECKPOINT_P18_TESTS_HOLD.json` : `8192684dd3e164f284f407c7737ea2dc9da1cbdf`

## Qualification des résultats
Ce n'est **PAS** une exécution des cinq documents **complets** dans le même Node natif : Node a reçu **les seuls champs lus par le test**, tirés des sources GitHub, tandis que la vérification intégrale s'est faite en JavaScript isolé. Il ne faut pas en déduire que les 20 scripts du dépôt ont tourné en CI ou en Node. L'environnement terminal ne peut toujours pas cloner GitHub (DNS inaccessible), et le workflow standard ne déclenche pas le lanceur M1.

**Ce qui est établi** : vrai code du test P19 sous Node, champs source conformes, logique des deux barrières négatives effectivement exécutée ; aucun arbitrage humain ajouté. L'ancien statut du checkpoint P18 est historique et n'a pas été réécrit.

Les **6 clarifications + 11 conventions** restent non approuvées. Le bulletin P29 est disponible pour le référent ; **0 QCM, moteur, interface, workflow ou autre branche modifié**, aucune fusion ni publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P31 seulement si nouvelle voie fiable d'exécution complète, sortie de CI avec la suite M1, arbitrage humain ou anomalie concrète.** Ne pas ajouter de nouveaux tests documentaires redondants.

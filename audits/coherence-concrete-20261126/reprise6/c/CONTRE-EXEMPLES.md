# Contre-exemples réels — C1/C2

Source : catalogue figé a7a5989f85482f35cac16f1004b80c7c9b837c04, journal d'échanges des paires CI 46016906055. Les réponses et mains ci-dessous sont celles du catalogue, non des variantes inventées.

| Profil / modèle / séance | QCM retiré (enchères, réponse) | QCM rappelé (enchères, réponse) | Analyse |
|---|---|---|---|
| cible/103 M6 S75 | SEF-V425-005 : ♠AR94 ♥ADV85 ♦R6 ♣V3, 18 H ; 1♥–2♣ → 2♠ | SEF-044-1 : ♠V95 ♥RD4 ♦A63 ♣D1096, 12 H ; 1♣–1♠ → 1SA | Réactivation red.base après 12 séances, mais retire un transfert de bicolore cher (red.bicolore_cher), difficulté 4→2. |
| cible/103 M6 S79 | SEF-Q26-M2-015 : ♠R84 ♥975 ♦V986 ♣832, 4 H ; 3SA gambling–(Passe) → 4♣ | SEF-010-1 : ♠753 ♥R8 ♦A75 ♣AR865, 14 H ; donneur → 1♣ | Réactivation meilleure mineure après 12 séances. Le donneur est un contraste individuel #448 (passe ou corrige, pas d'arrêt). |
| cible/103 D S79 | SEF-V470-006 : ♠A96 ♥R82 ♦DV75 ♣V83, 11 H ; 1♥–(Contre) → Surcontre | SEF-010-1 : ♠753 ♥R8 ♦A75 ♣AR865, 14 H ; donneur → 1♣ | Écart 13. Le donneur discrimine trois et quatre atouts en Truscott ; contraste individuel #448, absent de l'ensemble des IDs des relations bilatérales protégées. |
| faible/103 M6 S148 | SEF-Q26-M1-011 : ♠R82 ♥5 ♦DV964 ♣A843, 10 H ; 1♦ → 3♦ | SEF-009-2 : ♠R86 ♥AR ♦R10952 ♣952, 13 H ; donneur → 1♦ | Écart 22. Le donneur contraste soutien invitant et 2SA sur une courte. Preuves de réussite du concept ne prouvent pas la maîtrise du contraste. |
| faible/103 M6 S159 | SEF-V3-101-1 : ♠97 ♥1098642 ♦DV9 ♣72, 3 H ; donneur → Passe | SEF-N106-1 : ♠RD2 ♥RV96 ♦1064 ♣DV3, 12 H ; 1♣–1♥ → 2♥ | Écart 16. Rappel red.base mais perte du test de qualité de couleur du deux faible. Ce Passe est un barrage et non le concept ouv.passe. |

## Effet longitudinal constaté
- cible/103 M6 : 7 substitutions, 106 decks différents, dette six-séances 11745→10218, 25 alertes strictes dont 7 pertes de preuve. D : 7 substitutions, dette 8087→6223, 13 alertes individuelles hors latence et violations du gate original (p. ex. difficulté haute S153 346→355, indépendance S180 1174→1163).
- faible/103 M6 : 2 substitutions, 31 decks différents, dette 6614→6632, 15 alertes dont une preuve intervenir.sa.suite perdue à S153. D : aucune substitution, dette 6305 inchangée. Une amélioration d'un modèle ne démontre ni stabilité de l'autre ni apprentissage humain.
- Passe/47 M6 : 11 substitutions, dette 15355→17535, 18 alertes ; D : 8 substitutions, dette 12378→9435, 14 alertes. Direction contradictoire malgré les mêmes seuils, selon le modèle de réponses.

## Limites de capacité et de protection
La sonde réelle autonome/11 M6 S66–70 n'a aucun concept doublé dans les cinq decks : le donneur C1 strict n'existe pas dans ces séances. À S70, écart ouv.passe=13 et sa1.seuil=12. Dans le catalogue filtré stade <=1 et difficulté <=3, 9/9 familles ouv.passe sont déjà vues, 4/17 familles de sa1.seuil et 9/29 de ouv.mineure restent inédites. Ce décompte est une borne de catalogue, pas une certification d'éligibilité des items. Aucun Passe d'ouverture dans ces cinq decks. C1/C2 imposent par construction la parité nouveauté et interdisent un Passe d'ouverture supplémentaire : ils ne traitent pas ce cas. L'absence de capacité C1 sur toute la matrice est mesurée par zéro échange ; elle ne prouve pas l'impossibilité de toute stratégie.

La garde C2 couvre les 12 HOLD et les 376 IDs distincts associés aux contrastes/séquences bilatérales de relations.json. statuts.json contient des classifications individuelles supplémentaires (p. ex. 686 `contraste`, 47 `sequence`, autres catégories CONTRASTE_* et MIROIR_UTILE). Le contrôle postérieur tests/coherence-reprise6-c-gate.cjs dénombre les donneurs ainsi classés. Il ne faut ni assimiler la liste bilatérale à l'ensemble des contrastes, ni supposer qu'un succès récent sur un concept permet de supprimer tout autre cas du concept. La garde devrait couvrir ces statuts individuels avant toute nouvelle expérimentation ; une telle extension n'a pas été simulée ici.

## Prochain arbitrage, non implémenté et non autorisé
Ne pas activer C1 ni C2. Si le coordinateur ouvre une nouvelle expérience, distinguer une échéance de rappel d'une réservation native, prévoir les cas saturés sans nouveaux IDs en respectant les limites natives de Passe et de répétition, protéger aussi les classifications individuelles et reporter explicitement les créneaux donneurs avec remboursement vérifiable. Une réservation isolée et son contre-factuel apparié doivent conserver les objectifs, la preuve et la couverture. Aucun assouplissement des gates, aucune généralisation à partir d'une baisse agrégée. Ne pas déclarer cette piste validée.

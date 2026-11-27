# M4 quota Q/R — résultat natif commun #419
Base de comparaison M2, modèle fixe M6 (pas le modèle historique M4-D). 18 jobs [46002412075](https://github.com/CapGui13/QPJB/actions/runs/46002412075) PASS techniquement, 5 bras S180 × 18 × 1800 = 162000 présentations synthétiques. Code moteur expérimental, aucun déploiement. SHA de recette 4daa2586d946378c88b6435f534f71c6fd3c2d1a. Logs exacts agrégés dans quota-native-1.json / quota-native-2.json ; traces et checkpoints complets dans artefacts CI temporaires.

| Métrique S180 | M2 témoin | Q (nouveauté conservée) | R (une exception maintenance) |
|---|---:|---:|---:|
| Dette fondamentale cumulée D (9 concepts) | 241051 | 241899 | 207916 |
| Concepts avec preuves autonomes (somme des profils) | 1562 | 1562 | 1564 |
| Familles cumulées | 25703 | 25703 | 25707 |
| Décisions directes M4 | 0 | 4 | 18 |
| Séances de composition différente | 0 | 256 | 448 |
| Alertes M6 | 0 | 6 | 8 |
| Alertes individuelles strictes supplémentaires | 0 | 45 | 115 |

Q HOLD : la dette augmente et trois trajectoires ont des alertes strictes. R HOLD : dette -13,75 %, mais huit trajectoires avec alertes strictes et cinq avec alertes M6 ; les changements se propagent aux choix suivants. Ne pas traiter des preuves agrégées plus nombreuses comme absence de perte de preuve individuelle. Le test strict est un comparateur inspiré de D (dettes, écarts terminaux, preuves, familles/difficulté/répétition), pas le gate D original intégral.

Différence structurelle : créneau déjà classé maintenance, priorité et découvertes intouchables, Q dans candidats après nouveauté, R au plus une exception avant nouveauté toutes les deux séances, budget contrôlé et donneur déjà couvert ou prouvé récemment. Pas de modification de l'éligibilité ni d'augmentation volontaire de difficulté. Cette hypothèse ne suffit pas à garantir l'absence de cascade longitudinale. Aucun abaissement de seuil. Ne pas fusionner dans la branche candidate sans autre solution.

**M4 NON/HOLD.**

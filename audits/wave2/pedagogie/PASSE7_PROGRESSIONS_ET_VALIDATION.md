# QPJB — M1 / Passe 7 : correction mesurable de la progression expérimentale

**PASSE 7 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## Problème hérité de P4/P6
La sélection P3 trie la difficulté croissante puis prend les quatre/cinq premiers cas de chaque rubrique. Elle donne exactement 20 N1, 40 N2 et 32 N3 : aucune montée de difficulté interne aux trois parcours. Les tests de P5 n'ont jamais été explicitement exécutés sous Node.

## Nouvelle hypothèse documentaire et protocole
Un **prototype externe**, sans modifier le moteur V1 ni les QCM, alterne les rubriques de chaque parcours par **phases**. Les niveaux cibles des phases sont :
- Découverte : N1, N1, N1, N2, N2 (4 thèmes × 5 phases).
- Consolidation : N2, N2, N3, N3 (10 thèmes × 4 phases).
- Approfondissement : N3, N3, N4, N5 (8 thèmes × 4 phases).

Chaque phase sélectionne **un ID déjà présent par rubrique**, sur les niveaux autorisés ; les 36 propositions non validées sont exclues. La sélection est déterministe : priorité au niveau cible, ensuite proximité du niveau, ensuite nouveautés d'enchère correcte et de séquence au sein de la rubrique, puis ID. Les familles et signatures (séquence complète, réponse) ne sont jamais répétées dans le prototype. Il s'agit d'une **progression de difficulté éditoriale**, pas d'une garantie de réussite ou de prérequis acquis. Aucune modification du catalogue, de la ROADMAP ou des sauvegardes.

## Résultat comparatif sur le même catalogue de 1 523 QCM

| Parcours | P3/P4 | Nouvelle sélection | IDs | Rubriques | Familles distinctes |
|---|---|---|---:|---:|---:|
| Découverte | 20 N1 ; 0 N2 | **12 N1 ; 8 N2** | 20 | 4 | 20 |
| Consolidation | 40 N2 ; 0 N3 | **20 N2 ; 20 N3** | 40 | 10 | 40 |
| Approfondissement | 32 N3 ; 0 N4/N5 | **16 N3 ; 9 N4 ; 7 N5** | 32 | 8 | 32 |

**Total : 92 IDs distincts, 92 familles distinctes, 22 rubriques, zéro des 36 propositions historiques.**
**Repli explicite :** phase 4, Drury : N5 demandé, aucun N5 admissible dans la rubrique (0 N5 dans le catalogue) ; `SEF-L01-F-04` N4 est proposé. Aucune promotion artificielle en N5.

Manifeste machine-lisible : `audits/wave2/pedagogie/PROGRESSION_P7_HOLD.json`. Vérificateur : `tests/wave2-pedagogie-progressions.cjs`, à exécuter avec `node tests/wave2-pedagogie-progressions.cjs`. Il reconstruit la sélection à partir des **vrais fichiers du dépôt**, vérifie la hash Git du catalogue, la couverture, les exclusions, l'absence de collisions, les paliers, le repli Drury et teste une corruption volontaire du manifeste.

## Preuve d'exécution / limites
- **Vérifications en lecture seule par exécution JavaScript sur le blob Git exact** : résultats ci-dessus, 92 ID/familles uniques, 1 repli Drury ; comparaison automatique des distributions effectuée pendant la création du manifeste.
- **Node/CI : non confirmé pour le nouveau test** à ce stade. Le workflow historique `training-smoke.yml` ne lance pas `tests/wave2-pedagogie-*` ; son succès ne doit pas être présenté comme une exécution de ce vérificateur.
- Les phases sont un outil de revue. La conformité SEF de chaque nouvelle sélection et son utilité pédagogique individuelle nécessitent contre-lecture, en particulier les cas N4/N5.

**PROCHAINE PASSE : P8 — instruire entièrement les trois QCM encore en discussion avec preuves SEF, examiner les biais de sélection et vérifier les écarts entre les 92 IDs du manifeste et le prototype P3, sans appliquer aucune correction.**

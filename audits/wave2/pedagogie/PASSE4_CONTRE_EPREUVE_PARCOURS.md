# QPJB — M1 / Passe 4 : contre-épreuve des parcours proposés

**PASSE 4 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Protocole reproductible
- Reprise exacte des critères de la P3 sur le catalogue figé 1 523 QCM, 22 thèmes, 36 propositions exclues.
- Trois scénarios **théoriques**, sans données d'élèves : débutant découvrant les ouvertures et réponses, joueur intermédiaire consolidant les enchères naturelles, joueur avancé travaillant les conventions.
- Mesures : nombre de QCM dans le réservoir autorisé, échantillon, variété de familles, réponses et séquences, distribution des niveaux. Aucun taux de réussite inventé.
- Un test de robustesse purement structurel ne valide ni la qualité des distracteurs ni l'ordre didactique à l'intérieur d'une séance.

## Résultats
| Profil | Réservoir hors 36 | Échantillon | Couverture réservoir | Familles distinctes | Réponses distinctes (par thème) | Séquences distinctes (par thème) | N1/N2/N3/N4/N5 |
|---|---:|---:|---:|---:|---:|---:|---|
| Découverte | 269 | 20 | 7.4 % | 20 | 15 | 7 | 20/0/0/0/0 |
| Consolidation | 584 | 40 | 6.8 % | 40 | 28 | 27 | 0/40/0/0/0 |
| Approfondissement | 305 | 32 | 10.5 % | 32 | 25 | 24 | 0/0/32/0/0 |

## Lecture critique
- **Aucune répétition de famille au sein d'une rubrique** par construction ; cela ne garantit pas l'absence de quasi-doublons inter-rubriques.
- Le tri croissant des difficultés favorise mécaniquement les niveaux les plus bas autorisés. Une progression didactique en plusieurs séances devrait éviter de traiter les quatre cas d'un même thème comme un bloc figé.
- Les signatures d'enchères complètes mesurent davantage de diversité que la seule ouverture ; elles ne mesurent pas les différences de raisonnement entre deux mains.
- Les 36 propositions historiques ne figurent pas dans ces parcours de référence, mais elles demeurent **dans le catalogue public inchangé** : leur exclusion ici ne les retire pas de l'application.
- La P3/P4 n'a pas testé le comportement du moteur adaptatif réel, qui appartient à la mission #256. Toute comparaison de réussite ou de tirage serait spéculative.

## Tests et portes de sortie
- Invariants contrôlés à l'extraction : 1 523 IDs uniques, 22 thèmes, 36 exclusions, 92 sélections sans collision, 0 thème sous-rempli.
- Vérifications P4 : réservoir positif dans chaque thème, famille non répétée au sein d'un thème, répartition des difficultés bornée par profil, variété des séquences et réponses mesurée.
- **Limite importante** : pas de tests automatisés exécutables déposés pour reproduire les calculs depuis le dépôt ; le protocole doit être porté dans `tests/wave2-pedagogie-*` avant clôture définitive.

**PROCHAINE PASSE : P5** — audit contradictoire de QCM individuels hors des 36 propositions existantes ; ne proposer de changement de rédaction que lorsqu'une erreur démontrable est documentée.

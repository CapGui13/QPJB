# LONG M4 — Passe 3 : regroupement prouvé et conseils visibles

**PASSE 3 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Correction du module, sans changement d'API existante

- Les classifications micro et axe des **mêmes réponses du journal** ne produisent plus deux cartes concurrentes, *uniquement* lorsque les ensembles complets de réponses coïncident, ainsi que les scores, essais et succès indépendants. L'empreinte est (session, ID de QCM). La carte micro conserve les détails, et evidence.sameAnswersAs mentionne l'axe complémentaire comme **autre classement, pas autre preuve**.
- Une sauvegarde ancienne ou un journal tronqué ne donne aucun regroupement automatique ; une simple égalité de scores ne vaut pas preuve de chevauchement.
- Si une révision est réellement disponible, maxRecommendations >= 2 et les diagnostics remplissent toutes les places, une place est réservée à la révision. Avec limite 1, la priorité du diagnostic reste inchangée. Une séance active interdit toujours un nouveau plan.
- L'ordre de priorité numérique existant est conservé (resume 5, difficultes 20, revision 30). Aucune nouvelle notation ni modification de stockage.

## Tests

- Suite historique de 13 tests inchangée.
- 8 contre-tests de P2 dont les 2 attentes avant correction remplacées par le résultat après correction.
- 6 tests de P3 : chevauchement exact, ancienne sauvegarde, journal partiel, scores égaux mais observations distinctes, limite 1, déterminisme/limite et tri.

Commande : node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-evidence.test.js tests/wave2-recos-grouping.test.js

## Limites et travail restant

Cette règle conservative peut laisser quelques doublons visibles si le journal n'est pas complet ; il vaut mieux préserver deux diagnostics que fusionner deux histoires possiblement différentes. Évaluer longitudinalement 65 puis 153 séances, et vérifier les performances et la stabilité des sorties en P4. Contractualiser preuves, limites et intégration sans toucher au moteur ni à quizz.html.

**PROCHAINE PASSE :** cinq profils 65/153 avec états issus de record/finish, mesure brute/visible, répétabilité et coût. PR #262 DRAFT/HOLD.

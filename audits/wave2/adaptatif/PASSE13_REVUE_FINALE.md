# M2 — PASSE 13 : revue finale de périmètre, décision et dépendance externe

**PASSE 13 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON (validation Node dédiée restante).**

## Git / PR / conformité

Contrôle de `CapGui13/QPJB` sur `wave2/adaptatif-20261121`, avant ce commit documentaire :

- HEAD `ce8e303b2652076f44a05bacb4cde7e36c8d17c5`, branche de base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- **55 commits devant / 0 derrière** la base de départ figée, **47 fichiers** dans le diff : 47 ajouts ; **0 fichier hors périmètre**.
- Les seuls chemins sont `audits/wave2/adaptatif/**` et `tests/wave2-adaptatif-*`. `quizz-parcours.js` ne figure **pas** dans le diff : les gains d'exécution expérimentaux de P2/P6 ont bien été restaurés hors production en P9 pour respecter le test historique.
- `quizz.html`, 1 523 QCM/22 rubriques, schémas et fichiers des missions M1/M3/M4/M5 inchangés.
- PR #263 toujours **open, draft, non mergée** ; aucune publication ni fusion.

## Portée de la CI

- **Dernier run terminé et vérifié** : `QPJB Training smoke` run **44953503616 / #1631**, `success`, 4 jobs/4 verts sur la tête P10 intégrée dans le commit de fusion de test `84787fca`. Logs Node : historique parcours V1 `LOT B PASS`, 5 profils jusqu'à 153 séances ; audit `413 checks passed`.
- Une fois les ajouts documentaires et le lanceur déposés, nouveaux runs déclenchés :
  - `44956533473` (P11) en cours au contrôle P13 ;
  - `44956725354` (lanceur/autotest) en attente ;
  - `44956806069` (tête P12) en attente.
- **Ne pas dire que la nouvelle tête est CI verte** avant conclusion GitHub réelle ; les workflows historiques ne contiennent pas les cinq scripts de tests M2 préexistants, ni le nouveau point d'entrée M2.

## Verdict scientifique définitif de la recherche, sans prétendre à une validation technique définitive

- **P3 `foundation`** : contre-tests appariés 30 trajets, perte de diversité et hausse de difficulté sur certaines graines/profils. Non dominant.
- **P4 `recall`** : rappels renforcés mais perte de variété/découverte et difficulté accrue sur `modere/153`. Rejeté.
- **P8 `overdue`** : rappels distincts mieux couverts, mais `modere/153` difficultés 4–5 **27,84 % → 30,72 %** ; `echecs/65` 504 → 487 familles distinctes. Rejeté.
- **`score-cache`** : essai de tri neutre en copie seulement ; moteur de production restauré exactement parce que le contrat de SHA du test LOT B aurait échoué. Pas de gain livré.
- Les profils sont **synthétiques**, aucune preuve d'apprentissage réel chez les élèves. Toute nouvelle mutation pédagogique serait injustifiée sur ces seules mesures.

## Clôture de l'action M2 et dette de validation

P11 a levé la réserve sur le **CI historique**, P12 fournit un lanceur Node 22 vérifié de manière autonome (auto-test PASS, blobs identiques GitHub). **Il reste une dette réelle non levée** : le `--quick` et le `--full` sur la vraie arborescence QPJB n'ont pas été exécutés dans un checkout Node ; leur intégration aux workflows relève exclusivement de **M5** et non du périmètre M2.

Le travail de recherche, d'analyse des variantes, d'instrumentation et de préparation du contrat d'intégration **ne présente plus d'anomalie corrigeable démontrée dans le périmètre M2**. Multiplier des passes documentaires ou modifier le moteur sans gain mesuré serait artificiel.

**MISSION DÉFINITIVEMENT TERMINÉE : NON — blocage de validation externe explicitement conservé.**

**PROCHAINE PASSE : P14, conditionnelle à un run Node 22 réel du nouveau lanceur sur le dépôt :** relever `--quick` et `--full`, traiter chaque échec dans le seul périmètre M2, recontrôler SHA/diff et mettre à jour issue #256 / PR #263 ; si tous les critères sont prouvés, proposer clôture technique au coordinateur. **HOLD** tant que ce signal manque : ni fusion ni publication.

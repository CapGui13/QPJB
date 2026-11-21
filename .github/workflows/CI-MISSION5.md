# Mission 5 — CI QPJB : mesures et retour arrière

## Base / périmètre

- Point de départ imposé : `1736c99561dd83b0d9e279747066f32274ec8771`.
- Fichiers modifiés : `.github/workflows/training-smoke.yml`, documents CI de ce dossier, `tests/ci-training-*`.
- Aucune modification des QCM, du moteur V1, des pages HTML, des archives ou des sauvegardes.
- Toutes les 58 commandes historiques de contrôle Node sont reprises **une fois** ; les sept scripts navigateur sont exécutés en Chromium et WebKit.
- Aucun test historique supprimé, aucune publication déclenchée par la branche.

## Échantillon avant changement

Source : journaux horodatés des jobs GitHub Actions `QPJB Training smoke`. Mesure = première ligne horodatée du premier job à dernière ligne horodatée du dernier job (hors temps de file d'attente et sans workflow Pages).

| Run | Durée (secondes) | Durée |
| --- | ---: | --- |
| 44907054271 | 520 | 8 min 40 s |
| 44932277990 | 636 | 10 min 36 s |
| 44900294918 | 635 | 10 min 35 s |
| 44898074754 | 667 | 11 min 07 s |
| 44893848527 | 673 | 11 min 13 s |
| 44836965404 | 644 | 10 min 44 s |

Médiane : **640 s (10 min 40 s)**, moyenne des troisième et quatrième durées triées. Objectif -25 % : **480 s (8 min)**. L'ancien workflow attendait la fin de l'audit (~352–366 s sur les derniers runs) avant d'initialiser Chromium et WebKit (~4–5 min chacun).

Note : le run 44829004643 du 20 novembre est exclu de cet échantillon car l'audit de cette révision ne durait que ~27 s, avant l'intégration du parcours long actuel : il ne constitue pas un avant comparable.

## Modification ciblée

1. Le job `integrity` garde les contrôles rapides (QCM, Entraînement, mises à jour), les rapports et le nom de check existant.
2. Le test historique `node tests/quizz-parcours.cjs` quitte uniquement l'étape d'audit pour un job obligatoire séparé `parcours-long`. Son contenu et ses assertions sont inchangés.
3. Les jobs `smoke` (Chromium) et `webkit` ne dépendent plus de la fin de `integrity`. Les quatre jobs démarrent indépendamment ; tout échec rend le workflow entier rouge.
4. Un garde-fou `tests/ci-training-workflow-guard.cjs` compare le workflow à une liste figée des 58 commandes historiques et vérifie les 14 appels navigateur ainsi que le verrou Pages.

## Verrou de publication (conservé)

`.github/workflows/verified-pages.yml` n'est pas modifié. Il ne publie qu'à l'issue du `workflow_run` **réussi** de `QPJB Training smoke` sur **main**, hors PR, avec checkout du SHA testé, vérification d'ascendance et refus des changements de source non validés. Un seul job vert ne suffit pas : la conclusion de l'ensemble des quatre jobs doit être `success`.

Le projet doit conserver **Settings > Pages > Source > GitHub Actions**, conformément au contrôle existant du workflow de publication. Le garde-fou automatique teste la logique source ; l'état réel du réglage Pages n'est pas attesté par ce test.

## Mesures après changement

Premier run vérifié : [44935166484](https://github.com/CapGui13/QPJB/actions/runs/44935166484) — **276 s (4 min 36 s)**, les quatre jobs en succès. Horodatages du premier au dernier job : 18:22:29.984Z → 18:27:06.033Z.

| Job | Durée |
| --- | ---: |
| Audit des données et du code (rapide) | 9 s |
| Simulations longues du parcours V1 | 221 s |
| Validation Chromium | 240 s |
| Validation WebKit | 275 s |

**Réduction constatée sur ce premier run : 56,9 %** relativement à la médiane initiale de 640 s. Il s'agit d'une observation, pas encore d'une médiane après optimisation. Les résultats complémentaires et la médiane finale figurent dans la [PR #249](https://github.com/CapGui13/QPJB/pull/249), pour éviter de modifier le SHA CI à chaque mesure. Mesurer toujours par journaux complets et exclure la file GitHub.

### Autres workflows mesurés (aucune suppression non justifiée)

| Workflow | Run | Durée du premier au dernier job |
| --- | ---: | ---: |
| Registre des compétences V1 | 44932278156 | 3 s |
| Quiz SEF — intégrité | 44893848639 | 4 s |
| Benchmark longitudinal | 44893848474 | 17 s |
| Palette NS/EO | 44893848475 | 52 s |
| Tableau LOT A | 44893848476 | 241 s |
| Ergonomie et progression | 44893848533 | 314 s |

Ces workflows contiennent des vérifications spécialisées et ne sont pas supprimés : la couverture strictement équivalente n'a pas été démontrée.

## Retour arrière

- **Avant fusion** : fermer la PR et laisser `main` inchangé ; aucun déploiement à annuler.
- **Après une éventuelle fusion autorisée** : faire un `git revert` du/des commit(s) CI de la PR, lancer le workflow complet sur `main`, contrôler audit + Chromium + WebKit et vérifier le verrou `verified-pages.yml` avant toute nouvelle publication.
- Conserver le manifeste historique des 58 commandes pour contrôler la couverture lors du retour arrière.

Aucune fusion ni publication n'est autorisée par cette mission.

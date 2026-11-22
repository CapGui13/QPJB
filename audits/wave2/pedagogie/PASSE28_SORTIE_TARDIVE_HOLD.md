# QPJB M1 — Passe 28 : ne pas valider une sortie PASS suivie d'une erreur

**PASSE 28 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON/HOLD.**

## Faux succès réellement démontré
Le test `tests/wave2-pedagogie-runner-p24.cjs` renvoyait **true dès qu'une ligne** de stdout portait un `PASS` correspondant au test. Une exécution qui émettait `PASS wave2-pedagogie-progressions : OK` **puis** `FAIL wave2-pedagogie-progressions : erreur tardive` avec code de sortie 0 était donc **acceptée à tort**. Même problème si un autre test écrivait son propre `PASS` après le marqueur du bon script.

Contre-épreuve native avant correction : `hasPassMarker` retournait **true dans les deux cas**. En ajoutant d'abord ces exemples aux tests P24/P25, **les deux tests réels sous Node 22.16.0 ont échoué** (`Fausse acceptation...`, `Échec afterFail non propagé`).

## Modification et tests
`hasPassMarker` exige désormais que **la dernière ligne non vide de stdout** porte le marqueur exact du script lancé. Les alias historiques restent acceptés. Examen en lecture seule des 20 scripts du lanceur : les messages de succès propres à chaque script sont émis après les vérifications finales (certaines sources utilisent un `finally` de nettoyage ensuite).

Les fichiers modifiés sont uniquement :
- `tests/wave2-pedagogie-runner-p24.cjs` : ajout de **2 négatifs** (PASS suivi de FAIL, PASS suivi d'un autre PASS) ; **5 valides/9 invalides**.
- `tests/wave2-pedagogie-runner-integration-p25.cjs` : ajout des scénarios `afterFail` et `afterOtherPass`, en sus des six échecs précédents ; **20 sous-processus simulés, 8 catégories d'échecs rejetées, arrêt immédiat démontré**.

**Sous Node 22.16.0 :**
- P24 **PASS** ;
- P25 **PASS** ;
- P26 **PASS**, aucun changement du garde-fou d'inventaire ;
- `node --check` des 3 fichiers : **3/3 PASS** ;
- simulation de **21 scripts futurs** : **3/3 PASS** sous Node ;
- avant correction, **2 sorties adverses acceptées et deux tests rouges** ; après, elles sont rejetées.

**Empreintes exactes du code exécuté** : `7584b8b374a6b025e647e02dda390dd288ab5945` (P24) et `5a82ba490b0cc7aee1c2b371d36b3651e69fd113` (P25). Les SHA de blob GitHub ont été comparés à `git hash-object` des fichiers natifs avant commit. Suite inchangée à **20 tests**.

## Limites
Ce sont de **vrais tests de sécurité du lanceur sous Node**, mais **pas une exécution native intégrale du catalogue et des vingt scripts pédagogiques** : le clone GitHub est inaccessible depuis le terminal (DNS bloqué) et le workflow M5 n'invoque pas encore la suite sur une branche d'intégration. Aucun QCM, moteur, UI, workflow, autre branche, fusion ni publication. Les **6 clarifications et 11 conventions** demeurent soumises au référent humain, Texas `SEF-L25-004` inclus.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P29 — examiner les dernières surfaces de faux succès du lanceur et chercher une recette native des tests documentaires avec leurs sources exactes, sans inventer de CI réussie.**

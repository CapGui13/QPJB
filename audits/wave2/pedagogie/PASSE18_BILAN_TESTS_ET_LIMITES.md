# QPJB — M1 / Passe 18 : contre-exécution groupée des tests et limite d'accès Node

**PASSE 18 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Progrès réellement observé
Les **12 fichiers de test P5 et P7–P17** de la branche `wave2/pedagogie-sef-20261121` ont été relus puis **évalués en trois groupes contre les mêmes sources exactes extraites de GitHub**, avec un adaptateur JS en mémoire reproduisant les appels `readFileSync`, `path.join`, `assert`, `structuredClone`. Les sorties **PASS** ont été constatées pour **6 + 3 + 3 = 12 tests, 0 échec**.

| Groupe | Tests | Résultat |
|---|---|---|
| P5, P7–P11 | 6 tests de catalogue, progression, corrections et prérequis | **6/6 PASS** |
| P12–P14 | 3 tests de cohérence, 32 contre-lectures et arbitrages | **3/3 PASS** |
| P15–P17 | 3 tests de sources, reprise et Texas contré | **3/3 PASS** |

**Limite décisive :** ceci n'est **pas une exécution native sous Node du lanceur** ni une exécution CI GitHub. Le terminal dispose de `node v22.16.0` mais ne peut pas résoudre `raw.githubusercontent.com` ; le clone/les sources Git ne peuvent donc pas y être récupérés via le réseau de cet environnement. L'adaptateur émule les modules `fs/path/assert`; en particulier le hachage SHA-1 du test P7 est remplacé par la valeur du blob Git explicitement obtenu, et **ne vaut pas vérification cryptographique indépendante**. La suite `node tests/wave2-pedagogie-suite.cjs` devra être exécutée dans un clone Node opérationnel, puis intégrée en CI uniquement par la mission disposant du périmètre `.github/workflows/`.

## Garde-fou nouveau
`tests/wave2-pedagogie-couverture-suite.cjs` valide, en lecture seule, les 13 noms de test, le référencement dans le lanceur, la disponibilité du source de chacun et l'absence de doublon ou de référence circulaire. Le lanceur contient désormais les **12 anciens tests + ce contrôle = 13 scripts**. Ce nouveau contrôle doit lui-même être éprouvé ; son succès en sandbox sera indiqué dans le commentaire P18.

`CHECKPOINT_P18_TESTS_HOLD.json` conserve les fichiers testés et le détail des limites, sans annoncer faussement une CI verte.

## Invariants / blocages
- Catalogue **1 523 QCM** et **22 rubriques**, anciennes **36 propositions non appliquées**.
- **Six** textes de clarification non validés et **onze** accords/conventions à statuer ; dont le Texas contré qui accepte deux traitements documentés.
- Tout reste en **HOLD**, sans modification de QCM, de moteur, d'interface ou de workflows, ni merge ni publication.

**PROCHAINE PASSE : P19 — contraindre la suite native par un environnement Node muni du dépôt, traiter les arbitrages normatifs encore ouverts, et conserver le statut NON terminé sans validation explicite.**

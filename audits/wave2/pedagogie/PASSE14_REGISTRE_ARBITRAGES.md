# QPJB — M1 / Passe 14 : arbitrages consolidés et suite de tests
**PASSE 14 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

Le registre `ARBITRAGES_P14_HOLD.json` regroupe **6 clarifications éditoriales nouvelles** (P8 : 3, P10 : 1, P13 : 2) et **11 accords/références à confirmer** (P10 : 6, P13 : 5). Les six propositions conservent les bonnes réponses et les choix ; aucune modification du catalogue. Les 36 anciennes propositions restent distinctes et non appliquées.

**Six propositions** : `SEF-N051-2` (P8, context) ; `SEF-N056-1` (P8, context) ; `SEF-N067-1` (P8, explain) ; `SEF-L02-E-17` (P10, explain) ; `SEF-V3-103-3` (P13, context) ; `SEF-V44-005` (P13, context).

**Onze accords** : `SEF-L13-012` (P10) ; `SEF-L14-002` (P10) ; `SEF-L20-002` (P10) ; `SEF-L27-006` (P10) ; `SEF-L01-C-04` (P10) ; `SEF-L13-017` (P10) ; `SEF-L10-005` (P13) ; `SEF-L13-010` (P13) ; `SEF-L25-004` (P13) ; `SEF-V479-004` (P13) ; `SEF-C-008` (P13). Ces réserves ne constituent pas onze erreurs prouvées : un référent doit confirmer les conventions et leurs variantes avant toute intégration.

`tests/wave2-pedagogie-validations.cjs` vérifie provenance, unicité et invariants de non-application. `tests/wave2-pedagogie-suite.cjs` inclut maintenant **neuf tests** (P5, P7–P14). La suite peut être lancée par `node tests/wave2-pedagogie-suite.cjs`, mais ce lancement Node/CI n'est **pas encore confirmé** ; seules les assertions JS sur données Git réelles et contrôles syntaxiques ont été observés jusqu'ici.

La PR reste en brouillon sans fusion, publication ni changement moteur. **PROCHAINE PASSE : P15 — rechercher et examiner les références SEF permettant de lever certaines des 11 réserves, maintenir les autres À DISCUTER.**
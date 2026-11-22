# LONG M4 — Passe 26 : confirmation des trois workflows GitHub

**PASSE 26 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Contrôle direct des jobs GitHub et des journaux du 22/11, sans inférer un succès d'une file d'attente :

| Passe / commit | Workflow GitHub | Job d'audit | Tests natifs Node 22 | Autres jobs |
|---|---|---|---|---|
| P23 `2e8dee1f1627791d130aedabab533066b77f37c6` | 44956954162 | 137007086734 | **95/95 PASS, 0 FAIL** | Chromium, WebKit, simulations : SUCCESS |
| P24 `efe28a2d3052039782795442d0a7cc85e04b4ea9` | 44957206209 | 137007844871 | **96/96 PASS, 0 FAIL** | Chromium, WebKit, simulations : SUCCESS |
| P25 `82c4cf72be3a6670a7e54687abc0440410e44880` | 44957424758 | 137008510019 | **13/13 tests historiques PASS, 0 FAIL** | Chromium, WebKit, simulations : SUCCESS |

Les deux premières exécutions utilisent l'adaptateur de tests **éphémère** M4 sur leurs commits historiques. L'adaptateur a été **retiré** au commit P25. Le workflow standard du HEAD nettoyé conserve la vérification du catalogue : **1 523 exercices, 22 rubriques, 581 situations annotées**.

La preuve P24 inclut la ligne de journal `M4-P24` avec **125 trajectoires** et les mesures `M4-P17` : 650 réponses dans 65 séances, 1530 réponses dans 153 séances. La réussite 96/96 n'est **pas** attribuée à la version ultérieure de P25, qui ajoute un cinquième test d'intégrité.

## Résidu de validation

Le HEAD P25 comporte **97 tests** déclarés (92 tests JS et 5 contrôles `node:fs` / `node:crypto`). Sous Node 22, 96/96 est attesté sur le commit P24 et la CI standard de P25 est attestée, mais la commande explicite des **97 tests sur le code P25 nettoyé** n'a pas été exécutée par la CI. Ce test doit être assuré durablement par M5, propriétaire des workflows, selon le contrat P19 et le rapport P25. Ne pas réintroduire d'adaptateur CI de production pour contourner cette séparation.

## Garantie d'intégrité

Au début de la passe, 27 commits d'avance sur la base figée, 43 chemins modifiés et **zéro hors périmètre M4**. Empreintes préservées : `quizz-parcours.js` = `d0f06f1c259f7a766f2d1c8c47289374a74138dc` ; `quizz.html` = `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`. PR #262 ouverte, DRAFT, non fusionnée.

**PROCHAINE PASSE :** poursuivre les contre-épreuves utiles sur l'exactitude des conseils et la robustesse des historiques ; si aucune anomalie justifiable ne reste, livrer un dossier de prêt-à-intégrer, sans fusion ni publication. La connexion CI permanente et l'intégration UI sont réservées au coordinateur/M5.
# LONG M3 — PASSE 21 : détecter les mains réellement rognées sur mobile

**Branche exclusive :** `wave2/experience-eleve-20261121`. Point de départ P20 : `5f005e5700fd177e6800c539a39b9f022704f305`. PR #265 toujours brouillon / HOLD.

## Contre-exemple mesuré dans les captures réelles

Les captures historiques `training-visual-chromium` / `training-visual-webkit` ont été ouvertes et inspectées. Dans `measurements.json` en mode `large-text`, sur un viewport **390 px** :
- Chromium : `docWidth=390`, mais `.suit` déborde jusqu'à **444 px**. Le dernier symbole (trèfle) est rogné dans l'image.
- WebKit : `docWidth=390`, `overflowNodes=[]` et les quatre couleurs sont visibles.

Il s'agit de **l'interface Entraînement, hors du périmètre M3**. Aucun de ses fichiers n'a été modifié. Ce cas réel prouve néanmoins que « largeur totale de page ≤ viewport » ne garantit pas la lisibilité d'une main placée dans une zone qui coupe ou fait défiler son propre contenu.

## Défaut de couverture corrigé dans la recette M3

La recette visuelle et mobile M3 contrôlait principalement `document.documentElement.scrollWidth <= clientWidth+2`. Elle pouvait ainsi accepter une main dont un rang ou un symbole débordait à l'intérieur du conteneur.

**Implémentation :**
- `tests/wave2-ux-reflow-check.cjs` : garde dédié vérifiant page, `hand.scrollWidth/clientWidth`, présence des **4** longueurs de couleur et limites de leurs rectangles à l'intérieur de la main.
- `tests/wave2-ux-reflow-check-test.cjs` : cas valide, tolérance 1 px, débordement de page, contenu interne coupé malgré page correcte, rang à 444 px, couleur absente, mesure manquante.
- `tests/wave2-ux-browser.cjs` : mesure et garde réellement branchés aux scénarios mobiles **320 et 390 px**, ainsi qu'au reflow **195 px CSS**.
- `tests/wave2-ux-visual.cjs` : mêmes mesures intégrées au comparatif des captures 320/390 px de la version M3 ; la référence historique n'est pas artificiellement soumise aux règles de mise en page révisées.
- `tests/wave2-ux-runner.cjs` : ajoute un contrôle Node autonome. La suite M3 passe à **11 étapes** : 7 contrôles Node, 2 navigateurs (7 scénarios par moteur) et 2 comparatifs visuels (18 captures par moteur prévues).

## Contre-épreuves effectivement exécutées

Dans le conteneur avec Node 22 :
- `node --check` sur six fichiers de modules/tests Node `wave2-ux-http-*`, `wave2-ux-asset-watch-*` et `wave2-ux-reflow-check-*` : **6/6 OK**.
- `node tests/wave2-ux-http-test.cjs` : **PASS**.
- `node tests/wave2-ux-asset-watch-test.cjs` : **PASS**.
- `node tests/wave2-ux-reflow-check-test.cjs` : **PASS**, **2 états valides et 5 corruptions détectées**.
- Sources du module de reflow et de son test : blobs locaux réellement exécutés identiques aux blobs GitHub `c89900ed5a74785318b890f6344717d54e5e29e1` et `349903fb17adf3de391c428b5218e79a16e88eb6`.
- Sources GitHub exactes des trois scripts intégrés `wave2-ux-browser.cjs`, `wave2-ux-visual.cjs`, `wave2-ux-runner.cjs` : **3/3 analyses syntaxiques OK** et appels au garde vérifiés.

## Conditions qui empêchent encore la validation finale

La suite complète 11 étapes **n'a pas été exécutée** en Chromium **et** WebKit sur un checkout QPJB. Les exécutions dans le conteneur ne disposent ni du dépôt complet (`github.com` inaccessible) ni de WebKit; Chromium local refuse les navigations `ERR_BLOCKED_BY_ADMINISTRATOR`. Les captures historiques sont des preuves limitées d'un autre module et ne sont pas présentées comme des captures M3.

La coordination avec M5 a été ouverte dans l'issue #259. Les fichiers des deux missions doivent être présents dans une même branche d'intégration avant d'ajouter et d'exécuter `node tests/wave2-ux-runner.cjs` sous Playwright 1.64.1 et d'archiver `artifacts/wave2-ux/**` même en cas d'échec. Le coordinateur doit examiner les **36 captures M3 prévues**, les 14 scénarios navigateur, la sauvegarde/reprise et les éventuels échecs réels avant toute fusion.

**PASSE 21 FINIE — nouvelle contre-épreuve de rognage basée sur une anomalie historique visible.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P22 — recette M3 réelle 11 étapes sur la branche d'intégration M3+M5, analyse Chromium/WebKit des captures et correction des seuls défauts démontrés.**

**HOLD maintenu**. Aucun moteur, QCM, catalogue, donnée de sauvegarde, fichier CI/M5 ni autre branche modifié. Aucune fusion/publication.

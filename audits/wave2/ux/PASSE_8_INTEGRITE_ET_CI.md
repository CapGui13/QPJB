# M3 — PASSE 8 : vérification forte du catalogue et lecture CI
Branche `wave2/experience-eleve-20261121`, état P7 `3c8877d7c11a827841b4d911190f1162700eddaf`.

## Risque réel découvert dans le garde-fou P3
Le test `tests/wave2-ux-contract.cjs` comparait le bloc JSON à la base via `git show 2d0ac...:quizz.html` mais, si l'historique Git n'était pas présent dans un checkout superficiel, le bloc `catch` reportait la comparaison et le test pouvait réussir malgré une modification des QCM.

## Correctif test seul
- Empreinte **SHA-256 du seul bloc brut `training-data`**, épinglée à la base figée : `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`.
- Calcul via `node:crypto` obligatoire et hors `try/catch` ; aucune sortie réussie possible si le JSON diffère, que `git show` fonctionne ou non.
- Une comparaison Git reste complémentaire quand l'objet est disponible.
- Empreinte calculée à partir du fichier original réellement récupéré sur GitHub ; contrôlée avec une implémentation SHA-256 ayant passé les vecteurs standards « vide » et « abc ». **1 808 148 octets UTF-8** / **1 741 625 unités JS**, strictement identiques à la branche.

## Résultats CI réels consultés
- P4 : QPJB — palette NS/EO et charte commune = success ; QPJB V1 — LOT A tableau de progression (sans publication) = success ; QPJB Training smoke = success ; Quiz SEF - integrite du catalogue = success ; QPJB ergonomie — progression et quiz (HOLD) = success
- P5 : Quiz SEF - integrite du catalogue = success ; QPJB ergonomie — progression et quiz (HOLD) = in_progress ; QPJB Training smoke = in_progress ; QPJB — palette NS/EO et charte commune = success ; QPJB V1 — LOT A tableau de progression (sans publication) = queued
- P6 : Quiz SEF - integrite du catalogue = success ; QPJB ergonomie — progression et quiz (HOLD) = in_progress ; QPJB V1 — LOT A tableau de progression (sans publication) = in_progress ; QPJB — palette NS/EO et charte commune = success ; QPJB Training smoke = in_progress
- P7 : QPJB — palette NS/EO et charte commune = queued ; Quiz SEF - integrite du catalogue = queued ; QPJB Training smoke = queued ; QPJB V1 — LOT A tableau de progression (sans publication) = queued ; QPJB ergonomie — progression et quiz (HOLD) = queued

**P4 : 5/5 workflows verts**, dont Training smoke avec Chromium/WebKit. P5–P7 : plusieurs workflows encore en cours ou en attente au relevé. La suite autonome M3 `tests/wave2-ux-browser.cjs` n'est toujours pas branchée sur la CI : ne pas confondre suites historiques et recette M3 spécifique.

## Tests de la passe
Code du test Node compilé en V8 ; empreinte vérifiée indépendamment par l'analyse du bloc JSON de base et celui de la branche (égalité stricte). Les contrôles statiques précédents (**30/30**) restent applicables. Exécution Node du fichier de test dans un clone GitHub toujours à effectuer.

**PASSE 8 FINIE (durcissement de la garde d'intégrité et état CI). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P9 — contrôler les CI P7/P8 achevées, analyser toute régression réelle et clarifier les limites avant intégration.**
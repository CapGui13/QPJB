# LONG M3 — PASSE 18 : cohérence historique de la preuve de sauvegarde

Branche exclusive `wave2/experience-eleve-20261121`. La passe P17 a sécurisé la projection des historiques, mais une contre-épreuve démontre qu'elle acceptait encore des synthèses correctes **sans trace historique cohérente**.

## Problème démontré

Le garde `assertProgressEvidence` vérifiait seulement `attempt.lastResult === answer.result` et l'ID de l'exercice. Il acceptait donc des sauvegardes qui avaient :
- un tableau `history: []` malgré une réponse prétendument enregistrée ;
- une dernière enchère historique différente de la réponse ;
- une assistance historique qui contredit celle du parcours ;
- un drapeau `hadFreeError` historique qui contredit la réponse.

Les 4 états sont **acceptés par le garde P17**, alors qu'ils ne constituent pas une preuve fiable de sauvegarde.

## Correction dans les seuls tests M3

Dans `tests/wave2-ux-storage-projection.cjs` : `assertProgressEvidence` exige maintenant la **dernière tentative effective** de l'ID répondu et vérifie l'égalité de `result`, `choice`, `assisted`, `hadFreeError` avec la réponse stockée dans `parcoursState.active.answers`. La vérification ne concerne que les tests de comparaison **de sessions neuves** ; elle ne modifie pas la lecture ni le schéma des anciennes sauvegardes en production.

Dans `tests/wave2-ux-storage-projection-test.cjs` : la fixture reproduit désormais la structure des historiques effectivement produits par `recordAttempt` dans `quizz.html` (mode `qcm`, choix, assistance, première enchère et erreur libre), avec **4 tests négatifs supplémentaires**. Total cumulé P17+P18 : **8 contre-épreuves**.

## Preuves locales exécutées

- `node --check tests/wave2-ux-storage-projection.cjs` : OK.
- `node --check tests/wave2-ux-storage-projection-test.cjs` : OK.
- `node tests/wave2-ux-storage-projection-test.cjs` : OK.
- Test croisé ancien/nouveau sur les quatre mutations P18 : **4/4 faux succès reproduits sur le garde P17 ; 4/4 rejetés par P18**.
- SHA Git blob du fichier source testé localement : `b6947bc47f90c5be61471089718eaa396ba94132`.
- SHA Git blob du fichier de tests testé localement : `1c47dde618c640d709639d522208f90fd08230b6`.

Aucun QCM, règle métier, code de production, sauvegarde réelle, workflow ou fichier d'une autre mission modifié.

## Recette restant bloquée

Le poste local possède Chromium système, mais **pas le checkout complet QPJB ni WebKit compatible**, et les tests M3 ne sont toujours pas câblés dans les workflows GitHub. Un essai minimal de navigation Chromium sur une page de test **ne vaut pas** exécution du quiz. La recette réelle `node tests/wave2-ux-runner.cjs` sur le HEAD exact de cette branche, dans un checkout Playwright 1.64.1 comportant la base figée, reste obligatoire. Le câblage `.github/workflows/**` est réservé à M5.

**PASSE 18 FINIE — quatre nouvelles contre-épreuves rouges avant / vertes après.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P19 — exécuter les 8 étapes de recette Playwright Chromium/WebKit, analyser les captures et corriger uniquement des échecs réellement observés.**

PR #265 **brouillon / HOLD**. Aucune fusion ni publication.

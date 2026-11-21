# LONG M3 — PASSE 17 : contre-épreuves de sauvegarde et vérification CI

Branche exclusive `wave2/experience-eleve-20261121`, PR #265 **brouillon / HOLD**, issue #257. Point de reprise : `e6212295f346e4ab19d260356096230c47f579bc` (P16). Aucun périmètre M2, M4, M5 ni QCM touché.

## Vérification GitHub effective

Sur le SHA P16, **5/5 workflows historiques verts** ; le workflow QPJB Training smoke a ses **4 jobs** (audit, simulations, Chromium, WebKit) réussis. Le comparatif base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` → P16 montre 18 commits d'avance, 0 en retard et 24 fichiers strictement dans `quizz.html`, `tests/wave2-ux-*` et `audits/wave2/ux/**`.

**Attention :** le workflow historique n'exécute pas les scripts spécifiques `tests/wave2-ux-browser.cjs`, `tests/wave2-ux-visual.cjs` et `tests/wave2-ux-runner.cjs`. Ils ne sont donc **pas validés** par ses résultats verts. Le checkout réseau et les exécutables Playwright Chromium/WebKit requis ne sont pas accessibles ensemble dans la présente session. Ne pas fabriquer de captures.

## Anomalies réelles du comparatif P15/P16

Le projecteur de stockage ignorait :
1. `active.answers[i].hadFreeError` (première enchère libre fausse) ;
2. `saved[id].history[].firstGuess`, `mode`, `assisted`, `hadFreeError`, `choice` ;
3. la relation entre l'ID effectivement répondu, son résultat et le dernier résultat de l'historique sauvegardé.

**Fausse sécurité avant :** une différence d'erreur libre ou de première enchère donnait des projections identiques, et une tentative d'un ID non répondu suffisait à valider les sauvegardes comme « non vides ».

**Correction :** `tests/wave2-ux-storage-projection.cjs` conserve maintenant ces éléments dans la projection tout en excluant seulement les horodatages ; `assertProgressEvidence` vérifie que le résultat sauvegardé correspond à la tentative de **l'ID répondu**. `tests/wave2-ux-storage-projection-test.cjs` ajoute **4 contre-épreuves** (erreur libre, premier choix différent, tentative d'un autre ID, résultat contraire).

## Exécutions réellement effectuées

- `node --check` des deux fichiers : **OK** ;
- `node tests/wave2-ux-storage-projection-test.cjs` : **OK** ;
- contre-épreuves indépendantes ancien/nouveau : **3 fausses sécurités reproduites avant, 3 différences détectées après** ;
- contrôle `git hash-object` des **deux fichiers locaux réellement testés** : SHA blob strictement identiques aux blobs publiés dans les commits GitHub ;
- aucun moteur, QCM ou `quizz.html` modifié.

Commits correctifs : `52773c92023186b2d24a788e515c6366c57b8b4e` et `a54aa3bf278ad5abe9b35236ff5b3c69a9c69921`.

## Dépendance de recette à clôturer

Sur le commit final M3, exécuter dans un checkout complet disposant de la base, avec Playwright 1.64.1 :

```sh
npm install --no-save playwright@1.64.1
node tests/wave2-ux-runner.cjs
```

Puis examiner les rapports/captures dans `artifacts/wave2-ux/`. Le raccordement du runner à `.github/workflows/**` relève de **M5**, pas de M3 : aucun workflow de l'autre mission n'a été modifié.

**PASSE 17 — SOUS-PASSE DE FIABILISATION EFFECTUÉE ; RECETTE NAVIGATEUR P17 TOUJOURS EN ATTENTE.**
**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : exécuter la recette M3 Chromium/WebKit sur le HEAD exact, analyser les captures, corriger les anomalies réellement observées.**

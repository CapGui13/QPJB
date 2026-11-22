# LONG M3 — PASSE 22 : préserver la preuve des échecs visuels

**Branche exclusive :** `wave2/experience-eleve-20261121`, PR #265 en brouillon/HOLD. Reprise du SHA P21 `c89d06878259c5d63fb7eae9dfbad4946d11c1e4`.

## Vérifications au début de la reprise

- Lecture de l'issue #257, de la PR #265, des derniers commentaires et des fichiers de test.
- Comparaison base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` : P21 **42 commits en avance, 0 en retard, 35 fichiers tous dans le périmètre M3**.
- CI du SHA P21 : `Quiz SEF - intégrité du catalogue` **success**, autres workflows en attente ou en cours au relevé ; ne pas affirmer 5/5.
- Le checkout réseau depuis le conteneur est impossible (`github.com`, `raw.githubusercontent.com`, GitHub Pages : résolution DNS indisponible) ; lancement de Chromium système via Playwright Python sur `data:` renvoie `ERR_BLOCKED_BY_ADMINISTRATOR`. Ni WebKit ni `playwright@1.64.1` Node disponible ici. Les suites GitHub historiques ne câblent pas les scénarios M3.
- Aucun navigateur M3 ni comparatif complet n'est revendiqué comme réussi.

## Défaillance réelle identifiée dans la recette existante

Dans `tests/wave2-ux-visual.cjs`, l'ancien script s'arrêtait à la première assertion échouée. L'écriture du JSON `comparatif-<moteur>.json` n'intervenait **qu'après réussite des trois formats**. Un défaut à 320 px pouvait donc empêcher la recette à 390 px et en paysage et laisser des PNG sans manifeste exploitable. De plus, un simple décompte de lignes `passed` sans preuve d'images pouvait être interprété à tort comme une recette complète.

## Correctif livré

- Nouveau `tests/wave2-ux-visual-report.cjs` : manifeste JSON atomique et `fail-closed`, avec statut `passed/failed/incomplete`, compteurs par format, erreur fatale éventuelle, liste des **PNG réellement présents** avec taille et SHA-256. Un résultat `passed` exige **3 formats et les 18 PNG** du moteur. Les chemins de capture sont isolés par exécution (`visuel-<moteur>-<timestamp>-<pid>`) pour ne jamais mélanger les anciennes preuves et les nouvelles.
- Nouveau `tests/wave2-ux-visual-report-test.cjs` : comparaison partiellement échouée, capture conservée et hachée, format absent, échec d'initialisation, 3 formats « réussis » mais images absentes, 18 captures présentes, une capture manquante et statut non classé.
- `tests/wave2-ux-visual.cjs` : initialisation base/Playwright sous `try`, capture AVANT/APRÈS poursuivie sur les trois formats même après erreur, rapport écrit après chaque format et en fin d'exécution ; verdict global non nul si erreur ou résultat incomplet. Les PNG ne sont pas générés artificiellement et le script ne fait ni fusion ni publication.
- `tests/wave2-ux-runner.cjs` : ajoute le test de manifeste au plan. **12 étapes** pour la recette intégrale (8 tests Node et 2 scénarios navigateur + 2 comparatifs visuels).

## Tests effectivement exécutés

Dans Node 22, depuis les sources exactes vérifiées par blob GitHub :
- `node tests/wave2-ux-visual-report-test.cjs` **PASS** : images partielles traçables, erreurs capturées, preuve manquante refusée, 18 PNG obligatoires.
- Les trois autres suites Node du dossier local : `wave2-ux-http-test`, `wave2-ux-asset-watch-test`, `wave2-ux-reflow-check-test` **PASS** (total **4/4 suites Node locales**).
- `node --check` des 8 fichiers Node locaux : **8/8 OK**.
- Empreintes `git hash-object` des deux nouveaux fichiers testés = les blobs GitHub exacts `1c05f97fa5da38881416af5e3cfe216c5200b65f` et `d97d56973f7926d801de4f275e156edc5271a8db`. Les fichiers intégrés `wave2-ux-visual.cjs` et `wave2-ux-runner.cjs` ont été analysés syntaxiquement depuis leur contenu GitHub (sans navigateur).
- Les contrôles GitHub après P22 attendent leur exécution ; aucune réussite CI post-P22 inventée.

## État de mission

**PASSE 22 FINIE — journalisation des échecs et contre-épreuves de preuve visuelle.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P23 — exécuter `node tests/wave2-ux-runner.cjs` sur le HEAD M3 exact en Chromium ET WebKit dans une branche d'intégration autorisée, contrôler les 12 étapes, 14 scénarios et 36 captures, puis corriger uniquement les anomalies réellement observées.**

La dépendance M5 est documentée dans l'issue #259 : raccorder après présence du code M3 sur une branche d'intégration. **Aucun fichier M5, moteur, JSON QCM, sauvegarde de production ou branche tierce modifié. Aucune fusion/publication. PR brouillon / HOLD.**

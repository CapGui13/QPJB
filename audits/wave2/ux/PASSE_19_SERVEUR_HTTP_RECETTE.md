# LONG M3 — PASSE 19 : serveur de recette visuelle à échec explicite

Branche exclusive : `wave2/experience-eleve-20261121`. Référence avant P19 : `9c7b4eed4f3ab52b210bf7787aabe0dcaac567e5`.

## CI contrôlée au début de la passe

Pour ce SHA P18 précis : **5 workflows GitHub Actions terminés, 5 réussis**, dont QPJB Training smoke (tests historiques Chromium/WebKit). Cette réussite ne vaut **pas** exécution de la recette M3 indépendante `tests/wave2-ux-runner.cjs`.

## Anomalie réelle et reproduction négative

Dans `tests/wave2-ux-visual.cjs`, l'ancien serveur de comparatif exécutait :

```js
res.writeHead(200, ...);
fs.createReadStream(file).pipe(res);
```

dans un `try/catch`. Or `fs.createReadStream` échoue de façon **asynchrone** si le fichier demandé n'existe pas. Le `catch` ne le reçoit pas ; il a déjà envoyé le statut HTTP 200. Sans gestionnaire `error`, l'erreur de stream peut interrompre le processus.

**Reproduction dynamique Node isolée, effectivement exécutée** sur la même séquence : requête d'un `missing.css` absent → `tryCaught=false`, `streamError=ENOENT`, `expectedHttp404=false`. Le serveur original ne fournit donc pas un diagnostic HTTP fiable.

Par ailleurs, le comparatif visuel ne surveillait que les exceptions JavaScript de page : une CSS ou un script local non chargé pouvait fausser les mesures/captures.

## Correction livrée

- Nouveau `tests/wave2-ux-http.cjs` : chemin local contrôlé, chargement de la ressource **avant** l'envoi des en-têtes, statut 404 pour ressource absente, 403 pour chemin hors racine, 400 pour URL malformée ; cache désactivé.
- Nouveau `tests/wave2-ux-http-test.cjs` : serveur HTTP réel et **7 vérifications positives/négatives**, sans dépendance Playwright.
- `tests/wave2-ux-visual.cjs` : utilise le serveur sûr et refuse explicitement tout statut HTTP 4xx/5xx sur les scripts/styles locaux de chaque capture.
- `tests/wave2-ux-runner.cjs` : ajoute une étape Node autonome de vérification du serveur (**9 étapes** au total en mode deux navigateurs).

## Tests et preuves réellement produits

- `node --check` des deux nouveaux scripts : **OK**.
- `node tests/wave2-ux-http-test.cjs` sur la version publiée : **7 vérifications effectuées et succès**.
- Empreintes `git hash-object` du code local testé et comparaison des blobs publiés sur GitHub : `8775d1c6af4dae8e546c52f3613e2720be659d74` (serveur) et `2808df23d09c226c74142fbbb9b18db98b1fa2b1` (tests), identité vérifiée.
- Syntaxe des deux scripts modifiés `wave2-ux-visual.cjs` et `wave2-ux-runner.cjs` : analyse syntaxique JS **OK** à partir des fichiers relus sur GitHub.
- Aucune exécution réelle de `wave2-ux-visual.cjs` ni capture sous Chromium/WebKit : **non revendiquée**.

## Limitations et prochain travail

Le container d'exécution dispose de Node 22 et Chromium système, mais **pas du checkout de QPJB (GitHub inaccessible en DNS), ni de `playwright` Node 1.64.1 / WebKit**. Le test complet exige un checkout contenant le SHA de référence `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` et un environnement Playwright avec Chromium + WebKit.

À raccorder par la mission **M5** sans modifier ses workflows depuis M3 : exécuter `node tests/wave2-ux-runner.cjs` sur le HEAD M3 exact et conserver `artifacts/wave2-ux/**` même en cas d'échec. Les tests M3 doivent pouvoir échouer si une ressource statique manque ; ne pas les passer au vert artificiellement.

**PASSE 19 FINIE — durcissement du serveur et tests unitaires.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P20 — obtenir la vraie recette des 9 étapes Chromium/WebKit, relever et traiter ses erreurs, comparer les captures ; maintenir HOLD jusque-là.**

Pas de changement du Quiz de production, du JSON QCM, des sauvegardes, des moteurs ou des autres branches. PR #265 **brouillon / HOLD**, aucune fusion/publication.

# LONG M3 — PASSE 23 : preuves PNG réelles plutôt que simples extensions

## Reprise et vérifications

- Branche exclusive `wave2/experience-eleve-20261121`, PR #265 brouillon/HOLD, issue #257.
- Point de départ P22 : `c5e3ed8f150bb257e3aa20c1d7ba5793fa69aff1`. Base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- Le parcours spécifique M3 demeure **non branché** dans les workflows historiques ; le runner a **12 étapes**, dont 14 scénarios Chromium/WebKit et 36 captures M3 attendues.
- Diagnostic de l'environnement réel : `curl` vers `raw.githubusercontent.com` retourne `Could not resolve host` ; `node v22.16.0` est présent, mais le package Node `playwright` et un checkout complet ne le sont pas. Lancement expérimental via Playwright Python et `/usr/bin/chromium` vers un vrai serveur local : `Page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR`. Pas de WebKit exécutable. **Aucune exécution M3 sous navigateur ni capture M3 revendiquée.**

## Défaut démontré : 18 faux PNG pouvaient valider le comparatif

Le rapport P22 exigeait 18 fichiers `.png` par moteur mais ne vérifiait ni leurs octets, ni leur géométrie, ni les noms précis. Sa **fixture de succès créait 18 fichiers texte renommés `.png` et la déclarait PASS**. C'était une fausse garantie démontrée par l'ancien test (non un défaut prouvé de l'interface de production).

## Correction réelle

**`tests/wave2-ux-visual-report.cjs`** :
- Inspecte chaque fichier par signature PNG et segments `IHDR`, `IDAT`, `IEND` ; contrôle les CRC-32 des segments et les dimensions positives.
- Exige exactement les **18 noms attendus** (3 formats × 2 versions × 3 étapes) et les largeurs correctes pour `320×844`, `390×844`, `844×390`. Capture plein écran : hauteur autorisée supérieure ou égale au viewport.
- Vérifie que les **3 formats attendus** ont bien un résultat `passed` ; compte et rapporte les captures invalides (motif d'échec). Un échec de données reste `failed`, une preuve manquante `incomplete`.
- Conserve les diagnostics, les SHA-256 et les fichiers réels : aucune image inventée, aucune modification du Quiz.

**`tests/wave2-ux-visual-report-test.cjs`** :
- Remplace les fausses images texte par des PNG de test réellement encodés (RGBA, compression zlib, CRC).
- Contre-épreuves de faux PNG, CRC modifié, largeur mensongère, image manquante, rapport incomplet et trois formats sans images.
- Aucun nouveau script/étape inutile : les **12 étapes** du runner existant sont conservées.

## Exécutions réellement effectuées sur les sources identiques à GitHub

- `node --check` des **8/8 fichiers Node présents** dans le répertoire local M3 : PASS.
- `node tests/wave2-ux-http-test.cjs`, `node tests/wave2-ux-asset-watch-test.cjs`, `node tests/wave2-ux-reflow-check-test.cjs`, `node tests/wave2-ux-visual-report-test.cjs` : **4/4 suites PASS**.
- Comparaison explicite des deux blobs GitHub avec les scripts réellement exécutés : `6d83cc0b96deb20e84833dbeedc475efa3d80a8e` (contrôle PNG) et `0efc954bc62e6a88d6597ee07ea2837e26c0703d` (contre-épreuves), **identité stricte**.
- Contre-contrôle complémentaire : une vraie image PNG issue d'une archive GitHub historique, réencodée en 390×844 avec Pillow puis lue par le module Node, est correctement reconnue `valid=true` avec dimensions 390×844. **Il s'agit d'une capture historique d'Entraînement, pas d'une exécution M3.**
- Les checks GitHub associés au dernier SHA étaient encore **en attente** au contrôle, hors test d'intégrité du catalogue déjà réussi. Aucun succès complet CI P23 revendiqué.

## Verrou et décision

Les scénarios M3 dans Chromium et WebKit ainsi que les 36 captures comparatives ne peuvent être produits ici par une méthode autorisée et techniquement fonctionnelle. Le blocage **n'est pas résolu par des tests Node supplémentaires**. Le coordinateur doit préparer une branche d'intégration autorisée M3+M5, avec un job Playwright 1.64.1 / Node 22 utilisant le SHA exact M3 et donnant accès à la base figée, puis archiver `artifacts/wave2-ux/**` en cas de succès **ou** d'échec.

**PASSE 23 FINIE — faux succès sur faux PNG éliminé et contre-éprouvé.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P24 — uniquement après accès à une vraie recette Chromium+WebKit ; inspecter les rapports et images M3, puis traiter les régressions observées.**

**PR BROUILLON / HOLD**, aucune fusion, publication, modification de workflow M5 ni d'une autre branche. Le point dépendant d'une coordination externe est **documenté**, sans répétition de passes artificielles.

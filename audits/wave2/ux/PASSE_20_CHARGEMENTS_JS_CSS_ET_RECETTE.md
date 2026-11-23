# LONG M3 — PASSE 20 : traçage des ressources JS/CSS, captures historiques et blocage navigateur

**Branche M3 uniquement :** `wave2/experience-eleve-20261121`, PR brouillon #265, base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`. Point de départ P19 : `889572fcb3152ada6357e419e8508866ae7bc299`.

## État des preuves de recette

Au moment de cette reprise, **QPJB Training smoke** du SHA P19 a terminé avec succès ses quatre jobs (audit, simulations, Chromium historique, WebKit historique). Les contrôles spécifiques `tests/wave2-ux-*` n'étaient **toujours pas appelés** par ces workflows. Il faut distinguer leur réussite d'une véritable recette M3.

Deux archives réelles de captures historiques ont été téléchargées depuis ce workflow GitHub (artefacts `14744677816` Chromium et `14744119313` WebKit). **102 PNG et 3 JSON par navigateur**. Quatre dispositions de l'interface Entraînement ont été examinées visuellement (360 px, iPhone 390 px, paysage et texte agrandi), avec les métriques `measurements.json`. Elles ne sont **pas** des captures de la suite M3 `wave2-ux-visual.cjs`.

### Défaut hors périmètre observé dans les captures

Dans la capture *large-text-bidding* (Entraînement, et non le Quiz M3), la main déborde en **Chromium** : nœud `.suit` jusqu'à **444 px** pour un espace visible de **390 px** ; le dernier symbole est rogné. Le même cas WebKit n'a aucun `overflowNodes` dans `measurements.json`. Le test historique peut rester vert puisque `docWidth=390` dans les deux moteurs. **Ne pas corriger ce défaut dans M3** : il appartient aux fichiers Entraînement/CSS exclus du périmètre.

## Lacune détectée et correction M3

Dans le scénario navigateur M3 historique, l'écoute de `page.on('pageerror')` seule ne prouvait pas que tous les scripts ou feuilles CSS locaux avaient été chargés. De plus, le serveur navigateur avait une gestion propre des erreurs différente du serveur sûr du comparatif visuel P19, susceptible de quitter sur une URL malformée (`decodeURIComponent` hors `try`).

**Travail livré :**

1. `tests/wave2-ux-asset-watch.cjs` : observateur commun des chargements CSS et JS locaux. Il rejette HTTP 4xx/5xx **et** les erreurs réseau `requestfailed`, sans classer abusivement comme erreur le chargement externe de polices ou une image.
2. `tests/wave2-ux-asset-watch-test.cjs` : contre-épreuves avec source Node native (`EventEmitter`) pour scripts/styles 200/304, script 404, CSS 500, connexion rompue, origines externes/images hors périmètre.
3. `tests/wave2-ux-browser.cjs` : les **5 fonctions de scénario** installent cet observateur et refusent un succès si des ressources JS/CSS locales sont manquantes. Le serveur est désormais le même serveur fail-closed `wave2-ux-http.cjs` que le comparatif visuel.
4. `tests/wave2-ux-visual.cjs` : le même observateur couvre les erreurs réseau ainsi que les statuts HTTP; la comparaison reste bloquante.
5. `tests/wave2-ux-runner.cjs` : le nouveau test Node est une étape explicite. Le runner complet comporte désormais **10 étapes** pour Chromium + WebKit.

**Aucun changement de code de production :** `quizz.html`, les 1 523 QCM / 22 rubriques, le moteur, les clés de sauvegarde, et les branches des autres missions restent intacts.

## Tests effectivement exécutés et limites

Dans le conteneur Node 22 local :

- `node --check` sur les modules de serveur HTTP + observateur et leurs tests : **4/4 sans erreur**.
- `node tests/wave2-ux-http-test.cjs` : **PASS** (7 vérifications HTTP positives/négatives).
- `node tests/wave2-ux-asset-watch-test.cjs` : **PASS** (cas 200, 304, 404, 500, réseau rompu, images et origines externes).
- SHA Git blobs des deux nouveaux fichiers testés localement : **identiques** aux fichiers GitHub, respectivement `7a8d800ceaa7b198faf8333d229399cd391dcaf7` et `d45e147c9c8e760224419d26e093b1b5423e18ef`.
- Analyse syntaxique du contenu exact GitHub de `wave2-ux-browser.cjs`, `wave2-ux-visual.cjs` et `wave2-ux-runner.cjs` : **3/3 OK**, cinq scénarios navigateur équipés d'une vérification de chargement, comparatif visuel équipé.
- Échec d'accès au dépôt : DNS `github.com` indisponible depuis le conteneur, y compris tentative d'adresse IP explicite.
- Tentative de vraie navigation Playwright Chromium locale vers `localhost` et `data:` : `ERR_BLOCKED_BY_ADMINISTRATOR`. L'environnement ne dispose pas de WebKit exécutable ni du paquet npm `playwright@1.64.1`.

**Ne pas confondre** ces tests Node avec une réussite des 10 étapes du runner sur le site : **la recette spécifique Chromium/WebKit et les 36 captures comparatives M3 restent non exécutées**.

## Contrat de coordination nécessaire avec M5 / intégration

Le chantier M5 (PR #264) a achevé son périmètre indépendant, mais **sa branche ne contient pas les fichiers M3**. Le coordinateur doit préparer une **branche d'intégration** contenant les deux chantiers, puis ajouter dans la CI (sans toucher M3 aux fichiers M5) :

```sh
npm install --no-save playwright@1.64.1
node tests/wave2-ux-runner.cjs
```

Exécuter sous l'image Playwright 1.64.1 avec Chromium **et** WebKit, un checkout où le commit de base figée peut être résolu, et conserver `artifacts/wave2-ux/**` avec `if: always()`. Associer chaque rapport/capture au SHA exact de la branche d'intégration, vérifier 320/390 px, paysage, zoom, reprise et fidélité des sauvegardes.

**PASSE 20 FINIE — instrumentation et contre-épreuves natives vérifiées.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P21 — obtenir puis exécuter la CI de recette M3 10 étapes sur Chromium et WebKit, inspecter les captures et corriger les régressions démontrées ; conserver HOLD sinon.**

Aucune fusion, aucune publication, aucune branche autre que M3 modifiée.

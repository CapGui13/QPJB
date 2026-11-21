# M3 — PASSE 6 : recette croisée et contre-épreuves de navigation
**Branche :** `wave2/experience-eleve-20261121` — commit précédent `120abb99bc3cb7526ecf8411f32471b0f2c4d524`.

## Vérifications réalisées
- Nouvelle analyse du code déposé : **28/28 contrats statiques vérifiés**, syntaxes JavaScript de l'interface et du scénario navigateur valides.
- Intégrité : **1 523 exercices / 22 rubriques / 1 523 IDs uniques**, le catalogue `training-data` n'a pas été touché. La comparaison intégrale avec la base figée a été effectuée précédemment : **1 741 625 caractères JSON strictement identiques**.
- La CI GitHub **Training smoke** du commit P3 `415797a` est **réellement verte**, avec 4 jobs réussis, notamment **Chromium**, **WebKit**, simulations longues et audit des données. Les workflows vérifiés sur les commits récents ne lancent pas encore les nouveaux fichiers `tests/wave2-ux-*`.
- La CI « Quiz SEF - integrite du catalogue » est également verte sur P3, P4 et P5. Les autres checks du dernier SHA peuvent encore être en file / en cours.

## Extension de recette M3
`tests/wave2-ux-browser.cjs` contient désormais les **6 parcours suivants** par moteur : 320 px, 390 px, vrai tactile 390 px (clavier bridge avec 16 touches et 44 px minimum), largeur CSS 195 px (reflow analogue au zoom 200 %), paysage 844 × 390 et bilan/reprise après rechargement. Captures prévues pour le paysage et le zoom dans `artifacts/wave2-ux/`, après exécution ; aucune capture M3 spécifique n'est revendiquée comme déjà produite. Un calcul de contraste WCAG de la cellule de séquence et l'absence d'animation sous `reduced-motion` sont vérifiés dans le script.

## État de CI relevé pour P5
- QPJB V1 — LOT A tableau de progression (sans publication) : in_progress (run 44949962322)
- QPJB Training smoke : queued (run 44949962310)
- Quiz SEF - integrite du catalogue : success (run 44949962353)
- QPJB ergonomie — progression et quiz (HOLD) : in_progress (run 44949962307)
- QPJB — palette NS/EO et charte commune : in_progress (run 44949962308)

## Limites non dissimulées
**Cette passe ne constitue pas encore la recette P6 définitive.** Les suites historiques Chromium/WebKit sont vérifiées vertes sur P3, mais **le nouveau script M3 n'a pas été exécuté** ni en local ni dans les workflows existants : le présent périmètre interdit d'ajouter les commandes à `.github/workflows/`. Le rendu visuel réel avant/après, le vrai zoom à 200 % (distinct de la largeur simulée), et la restitution par lecteur d'écran restent ouverts.

**Contrat d'intégration à transmettre au coordinateur CI (sans modification ici) :**
```sh
node tests/wave2-ux-contract.cjs
PW_BROWSER=chromium node tests/wave2-ux-browser.cjs
PW_BROWSER=webkit node tests/wave2-ux-browser.cjs
```
Package Playwright requis, par exemple la version correspondant à l'image CI.

**PASSE 6 FINIE pour l'outillage et le constat de CI, MAIS recette finale non close. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P7 — analyser les runs P5 achevés, corriger toute régression réelle et préparer un verdict de recette honnête.**

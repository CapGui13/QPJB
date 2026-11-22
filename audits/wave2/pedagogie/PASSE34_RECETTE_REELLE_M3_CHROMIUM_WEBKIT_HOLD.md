# QPJB M1 — PASSE 34 : première recette navigateur M3 native, blocages d'intégration documentés

**PASSE 34 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## 1. Reprise M1 et état des dépendances

- Dépôt `CapGui13/QPJB`, PR M1 #261, branche `wave2/pedagogie-sef-20261121`, état parent `2c43261772b09be1826fe75c7a3baafb96680721`.
- M1 : **20/20 tests natifs Node validés aux passes P31/P32/P33** ; aucun nouveau défaut M1 justifiant une altération du catalogue ou du lanceur.
- M2 : le rapport propriétaire `audits/wave2/adaptatif/PASSE18_NODE_FULL_VERDICT.md` confirme la **suite native `--full` 12/12 PASS en 474,6 s**, 5 profils × 65/153 séances / 3 graines ; le moteur livré reste **inchangé** (blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc`). **Ne pas refaire** cette recette.
- M4 : la régression M4–M3 sur le hash du HTML complet identifiée à P33 n'était toujours pas corrigée dans `tests/wave2-recos-integrity.test.js` (blob `dd2f62052d4f76d03b67cc6aa018acf52b61878b`). Le correctif candidate est aux commentaires de l'issue #258 et de la PR #262, non appliqué par M1.
- M5 : workflow `training-smoke.yml` (blob `35fc614d95f5dbcf45d50478ff5d3bf1fa18d16a`) **n'invoque toujours pas** `node tests/wave2-pedagogie-suite.cjs`. Le raccordement reste réservé à M5 / coordinateur sur branche d'intégration.
- **Arbitrages pédagogiques M1 : 6 rédactions et 11 conventions encore PENDING** (bulletin P29), aucune décision inventée.

## 2. Nouveau travail substantiel : recette *réelle* de M3 sur deux navigateurs

Une machine Linux éphémère et connectée, **Node v22.23.5**, disposant de **Playwright 1.64.1**, a cloné le commit M3 **`d85608d95f4af093c1117f161332069010a0fbf8`**. Le package Playwright, les exécutables Chromium/WebKit et leurs bibliothèques système ont été réellement installés.

Commande réelle (sans mock) :

```
node tests/wave2-ux-runner.cjs
```

**Résultat : EXIT 1 — 8/12 étapes PASS**, deux navigations et deux comparatifs visuels en échec. Tous les **huit tests Node** du runner réussissent.

**Navigation Chromium : 6/7 scénarios PASS** ; **navigation WebKit : 6/7 PASS** : réussites effectives à 320 px, 390 px (sauvegarde/reprise), clavier tactile, sélection vide, clavier physique et paysage 844×390. Échec identique des deux moteurs au **zoom 200 %, viewport 195×422** :
`AssertionError: Zoom 200% : saisie en une colonne; 2 !== 1`, ligne `tests/wave2-ux-browser.cjs:158`.

Sur Chromium, mesure native 195 px : `matchMedia('(max-width:270px)') === true`, `innerWidth=195`, grille de réponse **`32px 82px`**, entrée x=37/y=1018, bouton x=76/y=1018 — **éléments côte à côte** au lieu d'une colonne.

**Comparatifs PNG réels** : 18 images / navigateur, **36 PNG** (plus deux screenshots paysage), rapports `comparatif-chromium.json` et `comparatif-webkit.json` avec statut `failed`, **1/3 formats PASS** par moteur :
- 320×844 : taille police main **19 → 19 px** ; aucune amélioration ;
- 390×844 : **21,06 → 19 px** ; baisse de taille ;
- 844×390 : **24 → 24 px** ; format considéré PASS.

Les PNG ont été **produits et comptés par les contrôles**, mais **pas inspectés manuellement image par image ni archivés durablement** : sandbox non persistant fermé automatiquement. Une inspection visuelle humaine de captures archivées reste indispensable pour autoriser M3.

## 3. Contre-épreuves CSS temporaires (aucune écriture distante)

Proposition de modification de taille `#body .hand .suit` dans le bloc `@media(max-width:390px)`, de `font-size:19px` vers **`font-size:clamp(20px,6vw,24px)`**. Recette réellement relancée sous Chromium et WebKit dans le sandbox : **10/12 étapes PASS** (contre 8/12), deux comparatifs visuels **PASS 3/3 formats avec 18 PNG par moteur** :
- 320 px : **19 → 20 px** ;
- 390 px : **21,06 → 23,4 px** ;
- paysage 844 px : **24 → 24 px**, inchangé.

Ce **n'est PAS un correctif de M3 committé** ; vérifier l'ergonomie réelle, le débordement et les captures à l'écran avant d'adopter la règle.

Deux tentatives locales de reflow 195 px `#body .free-entry-row` (colonne flex et grille avec `grid-auto-flow:row`) n'ont pas levé **les deux échecs navigation** ; le test actuel calcule `getComputedStyle(...).gridTemplateColumns`, même lorsque `display:flex` rend cette propriété non pertinente. L'instrumentation du scénario a aussi confirmé le défaut réel de grille dans la version originale. La correction doit vérifier **les rectangles réels des champs et du bouton** et pas seulement découper une propriété CSS en tokens. Il ne faut **ni désactiver ni truquer** le test.

**Aucune des 12 étapes échouées n'a été déclarée PASS.** La mission M3 n'est pas terminée sur cette preuve.

## 4. Transmission et traçabilité

Le diagnostic complet avec versions, mesures et proposition CSS a été communiqué au propriétaire **M3 issue #257, PR #265**, sans toucher à ses branches. Après la recette, la branche M3 a avancé à `3ec39601260b9b4169c6bf4ec319798856abef1b`, mais ses trois blobs pertinents sont **identiques** à ceux testés :
- `quizz.html` : `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3`,
- `tests/wave2-ux-browser.cjs` : `c565383ae527a73731f5a5384a39537ea66a3bb9`,
- `tests/wave2-ux-visual.cjs` : `872f6433e8129f21ee1ed223df397b39be0c4fef`.

Le test M3 sur le vrai navigateur est une **contre-recette d'intégration extérieure**, pas une validation de la mission pédagogique M1, déjà verte sous Node. Cette passe ne modifie que le présent rapport et son checkpoint dans `audits/wave2/pedagogie/**` ; aucune modification des QCM, interface, moteurs, CI, workflows ou autres branches.

**PASSE 34 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P35 uniquement après correction effective M3/M4, raccordement CI M5 ou décisions écrites des 17 dossiers pédagogiques. Ne pas répéter inutilement les mêmes tests.** Ni fusion ni publication.

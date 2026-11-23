# LONG M3 — PASSE 11 : bilan consolidé, HOLD et reprise
Branche exclusive `wave2/experience-eleve-20261121` ; commit précédent `e45ce028c4b2b57df578d55b6227dd3fa4941994` ; base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.

## État technique réconcilié
- Passes déjà réalisées auparavant : **P1–P2** (audits et priorisation), **P3 partielle**.
- Passes traitées dans cette reprise : **P3 à P10**, chacune avec commit et commentaires sur l'issue #257 et la PR #265 :
  - P3 `415797a` : navigation d'évitement et erreurs ARIA.
  - P4 `8ac554b` : retour clavier, reprise annoncée, position de la séance.
  - P5 `120abb9` : main 19 px en 2 colonnes sous 390 px ; reflow 1 colonne sous 270 px ; focus et contraste.
  - P6 `3fe7539` : scénario navigateur 320/390, tactile, reflow et paysage.
  - P7 `3c8877d` : corrections du test zoom et du focus liste vide/sortie.
  - P8 `854d4a8` : garde SHA-256 obligatoire du catalogue même sans historique Git.
  - P9 `fdf07b5` : simulation dynamique des transitions question/liste vide/retour, réussie.
  - P10 `e45ce02` : scénario clavier Enter complet, fonction de focus choix isolée et exécutée.
- **Diff GitHub réel** comparé à la base : `audits/wave2/ux/PASSES_1_3_AUDIT_ET_ACCESSIBILITE.md`, `audits/wave2/ux/PASSE_10_CLAVIER.md`, `audits/wave2/ux/PASSE_4_REPRISE_ET_TRANSITIONS.md`, `audits/wave2/ux/PASSE_5_ACCESSIBILITE.md`, `audits/wave2/ux/PASSE_6_RECETTE_CROISEE_ET_LIMITES.md`, `audits/wave2/ux/PASSE_7_CONTRE_EPREUVES.md`, `audits/wave2/ux/PASSE_8_INTEGRITE_ET_CI.md`, `audits/wave2/ux/PASSE_9_FOCUS_DYNAMIQUE.md`, `quizz.html`, `tests/wave2-ux-browser.cjs`, `tests/wave2-ux-contract.cjs`, `tests/wave2-ux-focus.cjs`. **Tous les fichiers strictement autorisés**, aucun commit parallèle touché, `behind_by=0`.
- **Catalogue** : 1 523 QCM, 22 thèmes, 1 523 IDs uniques, bloc JSON identique à la base (1 741 625 caractères / 1 808 148 octets UTF-8) et SHA-256 `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`.

## Passes et CI observées
Les suites historiques Training smoke sont réussies sur **P3, P4, P5**, y compris **Chromium, WebKit** et simulations longues. P4 : 5 workflows/5 réussis.
Dernier état P5 : Quiz SEF - integrite du catalogue = success ; QPJB — palette NS/EO et charte commune = success ; QPJB Training smoke = success ; QPJB V1 — LOT A tableau de progression (sans publication) = success ; QPJB ergonomie — progression et quiz (HOLD) = queued.
Dernier état P10 : QPJB V1 — LOT A tableau de progression (sans publication) = queued ; QPJB ergonomie — progression et quiz (HOLD) = queued ; QPJB — palette NS/EO et charte commune = queued ; QPJB Training smoke = queued ; Quiz SEF - integrite du catalogue = queued.

**Attention :** la CI historique ne référence pas encore `tests/wave2-ux-*`. Ses succès ne sont donc pas une validation des scénarios nouveaux. Les derniers runs peuvent encore être en attente.

## Une seule commande pour reprendre la recette M3
Nouveau `tests/wave2-ux-runner.cjs`, sans écriture dans le dépôt : il lance, avec état d'échec global strict, les contrats statiques + SHA-256, les tests de focus dynamique, puis Chromium et WebKit. 
```sh
npm install --no-save playwright@1.64.1
node tests/wave2-ux-runner.cjs
```
Utiliser l'environnement officiel Playwright v1.64.1 pour disposer des deux navigateurs. Paramètre facultatif `PW_BROWSER=chromium` ou `PW_BROWSER=webkit` pour isoler un moteur.

## Décision et dépendances
**Ne pas lever HOLD** avant :
1. Exécution vérifiable du runner M3 sur le SHA exact de la branche, Chromium et WebKit, puis correction de toute erreur.
2. Captures effectivement produites et comparées aux versions de référence ; vérifier 320/390 px, paysage, zoom réel 200 %, lisibilité des mains et absence de débordement.
3. Validation clavier/lecteur d'écran incluant la reprise après suspension et le bilan.
4. Arbitrage explicite du coordinateur pour une éventuelle intégration. Aucun workflow M5 modifié ici et les 36 propositions pédagogiques restent hors périmètre.

**PASSE 11 FINIE (outil de recette et bilan). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P12 — exécuter le runner dans le CI autorisé ou un checkout disposant de Playwright, investiguer et corriger les régressions démontrées.**

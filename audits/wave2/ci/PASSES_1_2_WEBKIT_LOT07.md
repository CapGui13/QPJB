# QPJB V2 / M5 — Passe 1 et 2 : incident WebKit, instrumentation et correction ciblée

**Branche** `wave2/fiabilite-20261121` — **base** `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.

## PASSE 1 FINIE — Diagnostic reproductible depuis les traces existantes

Source primaire : [run 44942138879](https://github.com/CapGui13/QPJB/actions/runs/44942138879), tentatives 1 et 2.

- Tentative 1, job WebKit `136961470730` : échec du seul pas `Test Lot 07 selected leads (webkit)` entre **19:43:53 et 19:44:34 UTC**. Le journal affiche `LOT07 webkit desktop JC-BH-079-03 rendered` à 19:44:04, suivi d'un `locator.waitFor: Timeout 30000ms exceeded` à 19:44:34 sur `locator('#training-frame').contentFrame().locator('.play-free-panel .deal-seat').first()`.
- Tentative 1 : audits rapides, Chromium et simulations longues réussis. WebKit a échoué ; le workflow global n'était pas validé.
- Tentative 2 : WebKit réussi, six cas (3 entames × 2 tailles) et **51 contrôles**. Job WebKit **312 s**, Chromium **238 s**, audit rapide **14 s**, simulations longues **362 s** (durées des jobs, pas du workflow). Lot 07 WebKit entre 19:50:29 et 19:50:42 UTC.
- **Diagnostic** : le code injectait directement un exercice dans un objet `child` précis, puis recherchait sa main via `page.frameLocator('#training-frame')`, qui résout dynamiquement l'iframe actuelle. Une navigation asynchrone du parent peut changer le cadre entre ces opérations. La trace prouve la discordance « rendu confirmé / élément invisible » ; elle **ne prouve pas à elle seule** que l'iframe a été remplacée. Hypothèse testable, non certitude.

## PASSE 2 FINIE — Correction et observabilité

Commits :
- `0d304ce8520afdbd3696c9346293850ca60e3981` : garde statique `tests/wave2-ci-lot07-static.cjs`.
- `10dd17f01458f153789c0a25c0b1d8f155c00ff8` : tous les sélecteurs de la carte contrôlée utilisent le **même Frame Playwright** que le rendu vérifié. Si le cadre est détruit, le test doit signaler un contexte détaché plutôt que chercher 30 secondes dans un autre cadre.
- `92d313f34d76bcf288751ea1a44ec96ab131eee7` : exécution du garde statique dans l'audit rapide et conservation des captures Lot07 dans les artefacts Chromium/WebKit.

En cas de main invisible, le test recueille la vue, l'ID courant, les indicateurs de navigation, le nombre de mains présentes, l'URL du cadre, la liste des cadres actifs et une capture `*-failure.png`. Le délai local de diagnostic est de 8 s **après rendu vérifié** : ce n'est pas un assouplissement du timeout. Les vérifications de 826 exercices, de 3 entames et de leurs réponses sont maintenues.

## Validation et limites

- **Preuve d'avant** : échec WebKit en tentative 1 et succès sans modification en tentative 2.
- **Vérifications de code** : garde statique ajouté, mais la validation GitHub Actions de la branche est **à attendre** ; aucune prétention de tests Chromium/WebKit déjà exécutés sur les nouveaux commits.
- Aucun fichier hors périmètre modifié ; aucun QCM, moteur, parcours ou verrou Pages modifié.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**

**PROCHAINE PASSE 3 :** examiner les nouveaux logs/captures si un échec survient et confronter l'hypothèse de remplacement d'iframe aux faits ; si le nouveau garde échoue, corriger sans masquer une véritable régression.

**PASSES 4–6 RESTANTES :** répétitions complètes Chromium+WebKit, métriques de durée sur plusieurs runs, vérification des 58 commandes historiques et du contrat `Training smoke` → `verified-pages.yml` ; documenter rollback. **Aucune fusion/publication avant validation explicite.**

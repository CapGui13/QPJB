# Feuille de route QPJB — 3 novembre 2026

La feuille de route historique demeure dans [SUIVI_UPGRADES_2026-11-02.md](SUIVI_UPGRADES_2026-11-02.md).

## Lot EN : quatre fiches réintégrées

Le détail des décisions et des sources figure dans [REINTEGRATION_EN_4_2026-11-03.md](REINTEGRATION_EN_4_2026-11-03.md).

- EN-BH-075-04 et EN-BH-102-01 : 3♠ confirmé (12 HLD et quatre atouts).
- EN-2sa-006 : réponse corrigée de 4SA en 5SA quantitatif.
- EN-BH-090-06 : réponse corrigée de 6♠ en 4SA Blackwood cinq clés.
- Les quatre fiches reviennent en auto-évaluation non notée ; historiques conservés.
- Catalogue : 563 EN conservés, 560 accessibles et 3 masqués. Les 114 cartes sont conservées, dont 111 accessibles.
- Modules 20261103b et cache PWA qpjb-v46.

## À traiter

- EN-suite-repondant-003, EN-BH-077-04 et EN-BH-078-05 restent masqués en attendant un corrigé SEF sans ambiguïté.
- Confirmer les tests GitHub sur Chromium et WebKit, puis la publication GitHub Pages.
- Faire un essai sur un iPhone physique.
- Poursuivre l'audit pédagogique global des exercices et les anciens dossiers sans identifiants rapprochés.

## Revalidation intégrée après modification concurrente

Le commit `e825e93e` a passé l'audit, Chromium et WebKit, mais Pages a refusé le déploiement, car une modification indépendante du sous-titre de la séance 2-04 et la mise à jour de `config.json` sont arrivées ensuite. Ce refus est volontaire et sûr. Une validation du nouvel état complet de `main` est requise ; le garde-fou Pages ne doit pas être élargi pour ignorer cette modification.

## Reprise du chantier et P0 validée — 3 novembre 2026

- Dernier contrôle intégré **effectivement terminé** : [QPJB Training smoke #41592819392](https://github.com/CapGui13/QPJB/actions/runs/41592819392), exécuté sur `a5c59703850b8f3a0b657079afd696cfe20245c7` : **success** pour les trois jobs « Audit des données et du code », « Validation chromium » et « Validation webkit ». La [mise à jour du catalogue #41592819258](https://github.com/CapGui13/QPJB/actions/runs/41592819258) a également réussi.
- **GitHub Pages publié** : [QPJB Pages #41593208965](https://github.com/CapGui13/QPJB/actions/runs/41593208965), `success` sur le commit de catalogue `2f22ce3380f1649544acb37bb5ade1633ba70fc8`. Ses deux jobs « Vérifier la source de publication » et « Publier uniquement la version validée » ont réussi. Le run Pages `41592886993` était `skipped` et **ne constitue pas** cette preuve : la réussite correspond bien au run `41593208965`.
- L'échec antérieur de Pages après `e825e93e`, dû à la modification concurrente de la séance 2-04, est **dépassé par cette revalidation complète**, sans désactiver le garde-fou de publication. La séance 2-04 (« Jeu face au mort ») reste distincte du lot pédagogique EN ; aucune modification concurrente ne doit être écrasée.
- **P0 clos pour cet état vérifié.** Le succès des navigateurs simulés ne vaut toujours pas essai Safari sur iPhone physique. La présente mise à jour est documentaire, sans modification des QCM ou des historiques.

### P1 — Cahier des charges de reprise des trois quarantaines EN

L'[arbitrage des trois réserves](ARBITRAGE_EN_3_RESERVES_2026-11-03.md) est confirmé par lecture des trois enregistrements actuels de `training-data-bidding.js`. **Aucun des trois anciens QCM ne doit être simplement réactivé en conservant son ancien barème.** Ils restent `a_verifier` pendant le travail éditorial.

1. `EN-suite-repondant-003` (BM020 Q6, 1♣–1♠–4♠–?) : remplacer la présentation d'un saut direct à **6♠** comme décision certaine sur le seul total de **33 HLD**. Priorité : rendre pédagogique le besoin de vérifier les contrôles (notamment ♣, inconnus avec ♣82) et les cartes clés ; ne retenir une nouvelle enchère exacte qu'après validation de son sens dans la séquence. Conserver l'ancien corrigé sous provenance source.
2. `EN-BH-077-04` (BH077 Q4, 1♣–1♥–2SA–?) : **6♥ direct** n'est pas certifié ; la redemande régulière à 2SA indique 18–19 HL sans promettre trois Cœurs. Reconcevoir les quatre réponses pour rechercher d'abord la nature du fit et les contrôles. Vérifier le statut forcing précis de l'enchère candidate dans le SEF avant toute mutation de `correct`.
3. `EN-BH-078-05` (BH078 Q5, ouverture 3♠–?) : **4♠** reste une option de barrage défendable avec dix atouts, mais non universelle. Pour un nouveau QCM, préciser la vulnérabilité et l'objectif tactique (hypothèses nouvelles, à distinguer du document source), inclure **Passe** comme distracteur véritablement plausible, et expliquer la loi des atouts sans déduire gratuitement les levées adverses.

**Critères de livraison :** relecture SEF indépendante des trois QCM réécrits, unicité défendable de la bonne réponse, quatre choix crédibles, difficulté réaliste, origine PDF et ancien corrigé conservés, IDs inchangés ; banque canonique et modules différés/générateur synchronisés, contrôle de non-régression de la progression `localStorage`, tests audit/Chromium/WebKit, publication Pages sur état exact de `main`. Les 114 fiches de jeu de la carte et les 993 Quizz n'entrent pas dans ce correctif. Faire ensuite un contrôle matériel iPhone distinct.

**État éditorial à cette étape :** aucune réécriture ni réintégration des trois QCM ci-dessus ; les compteurs documentés restent **563 EN en banque, 560 accessibles, 3 en quarantaine**. Les hypothèses ci-dessus sont un plan de correction et non des réponses SEF déjà certifiées.


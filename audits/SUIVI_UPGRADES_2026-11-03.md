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

## Clôture des trois quarantaines EN — publication du 3 novembre 2026

- **Pull request [#14](https://github.com/CapGui13/QPJB/pull/14) fusionnée** sur `main` par squash `b2cfae040a1d7cc02058e16c35b215cfd94f03a9`. Rapport : [REINTEGRATION_EN_3_SEF_2026-11-03.md](REINTEGRATION_EN_3_SEF_2026-11-03.md).
- `EN-suite-repondant-003` : 6♠ immédiat remplacé par **5♥ contrôle**, avec recherche des contrôles avant chelem ; l'ancien corrigé source est archivé.
- `EN-BH-077-04` : 6♥ immédiat remplacé par **3♥**, six Cœurs forcing après 2SA à saut, exploration du chelem ; ancien corrigé archivé.
- `EN-BH-078-05` : **4♠ maintenu** dans un contexte de vulnérabilité favorable désormais explicite ; Passe ajouté comme alternative ; réponse source conservée.
- **Protection :** les trois IDs, mains, séquences, PDF et historiques locaux sont conservés. Les anciens corrigés, choix et raisons de quarantaine ont été archivés en données. Chaque fiche est `transcrit_source`, c'est-à-dire une auto-évaluation **sans notation automatique**. Aucune migration/réinitialisation de `localStorage`.
- **Compteurs après fusion : 563 exercices EN conservés et 563 accessibles, zéro quarantaine EN** ; 114 exercices de jeu de la carte conservés, dont 111 accessibles. Modules `20261103c`, cache PWA `qpjb-v47` ; rubriques `suite-repondant` 73 et `rep-barrage` 12.
- **CI de la PR** : [run #41595887184](https://github.com/CapGui13/QPJB/actions/runs/41595887184), succès des trois jobs audit, Chromium et WebKit au SHA `1bd933bb`.
- **Revalidation de `main` après fusion** : [run #41596542604](https://github.com/CapGui13/QPJB/actions/runs/41596542604) au SHA `b2cfae04`, succès des trois mêmes jobs. [Actualisation du catalogue #41596542501](https://github.com/CapGui13/QPJB/actions/runs/41596542501) : succès.
- **Publication GitHub Pages finale** : [run #41596979603](https://github.com/CapGui13/QPJB/actions/runs/41596979603), succès des deux jobs vérification et publication, sur le commit généré `2be961b917236fc470877e42f1036c2466931836`. Ce succès constitue la preuve de publication ; il ne faut pas le confondre avec les anciens runs `skipped`.

**P0 clôturé pour ce lot et cette version de code.** Vérification Safari sur **iPhone physique** encore à réaliser, à distinguer de WebKit automatisé. Le reste du projet reste ouvert : les 3 quarantaines du jeu de la carte, l'audit pédagogique transversal des EN, l'audit indépendant des 993 Quizz et le rapprochement des anciens rapports nominatifs ; ne pas les déclarer terminés du seul fait de ce lot.

## Clôture des trois quarantaines jeu de la carte — publication du 3 novembre 2026

- **[Pull request #15](https://github.com/CapGui13/QPJB/pull/15) fusionnée** sur `main` avec squash `edb62041c2f491182155f0f0bda09e4bec1bb1b1`. Le rapport pédagogique détaillé figure dans [REINTEGRATION_JC_3_2026-11-03.md](REINTEGRATION_JC_3_2026-11-03.md).
- `JC-BH-014-Q01` : le plan source ne permettait pas d'encaisser tous les honneurs montrés ; la question adaptée cible uniquement le déblocage certain du **Roi de Carreau sec en Sud**, avant de quitter la main.
- `JC-BH-028-Q04` : sur l'entame ♥3 avec ♥1072 au mort dont ♥2 est fourni, **♥9** reste la plus petite carte équivalente sur la levée ; preuve et hypothèses rendues explicites, sans généraliser l'équivalence à toutes les levées.
- `JC-BH-036-Q02` : reprise extérieure en Sud annoncée, **As en sonde puis impasse au Valet** ; l'ancienne option « 7 vers As », compatible avec le bon plan, est remplacée par un distracteur réellement distinct.
- Pour les trois ID : **`transcrit_source` (auto-évaluation sans notation automatique)** ; cartes, référence source, anciens énoncés/choix/réponses/explications et réserves archivés, sans suppression d'identifiant ni migration des résultats élèves. Le texte du module différencie désormais **explication pédagogique adaptée** et **corrigé original**.
- **Compteurs : 563/563 enchères accessibles, 114/114 jeu de la carte accessibles ; zéro quarantaine active dans ces deux banques.** Cela clôt ces quarantaines nominatives, **pas** l'audit pédagogique intégral des deux catalogues ni celui des 993 Quizz.
- Versions : ressources de données et interface `20261103d` ; PWA `qpjb-v48` ; modules différés et banque canonique synchronisés. Scénarios navigateur ajoutés pour ouverture directe des trois fiches, sélection/désélection des choix, affichage sans notation et absence d'écriture automatique dans `localStorage`.
- **Tests sur la PR** : [QPJB Training smoke #41637950615](https://github.com/CapGui13/QPJB/actions/runs/41637950615), `success` pour audit des données/code, Chromium et WebKit, au SHA `2debdf9dd78f8064e777bf34b96689d83477df32`.
- **Revalidation sur `main` fusionné** : [QPJB Training smoke #41638795018](https://github.com/CapGui13/QPJB/actions/runs/41638795018), succès des trois jobs sur `edb62041` ; [Actualiser le catalogue #41638795050](https://github.com/CapGui13/QPJB/actions/runs/41638795050), `success`.
- **Publication GitHub Pages confirmée** : [QPJB Pages #41639320811](https://github.com/CapGui13/QPJB/actions/runs/41639320811), `success` sur le commit de catalogue généré `0142bf9aa7455a4db634d9084601069e61a915a1`. Les deux jobs de vérification et publication ont conclu avec succès. Ne pas confondre avec les runs antérieurs `skipped`.

**Suite active :** test réel sur Safari iPhone/PWA, puis poursuite de l'audit pédagogique transversal des cartes et des 563 EN ainsi que de l'audit indépendant des 993 Quizz. Aucun essai matériel iPhone déclaré à ce stade.

## Audit préliminaire des 30 plans de jeu classiques — 3 novembre 2026

- **Revue indépendante de premier niveau des 30/30 fiches classiques de carte** : 23 `JC-001` à `JC-023` et sept `JC-BH-*`. Rapport nominatif : [AUDIT_JC_30_PLANS_PRELIMINAIRE_2026-11-03.md](AUDIT_JC_30_PLANS_PRELIMINAIRE_2026-11-03.md). Cette revue identifie les mécanismes, les hypothèses et les réserves, mais **ne constitue pas 30 certifications stratégiques complètes ou des simulations double-dummy**.
- **[Pull request #16](https://github.com/CapGui13/QPJB/pull/16) fusionnée** par squash `00de5bc5f1990f30e6b01b203dd3a3267fc6c2f8`, après validation complète.
- `JC-BH-120-01` : avec ♠AV9 au mort et ♠R10 en Sud, sur l'entame ♠4, ♠9 du mort et ♠2 d'Est, prendre avec ♠R puis **jouer ♠10 depuis Sud vers As-Valet**. L'ancien texte demandait de « revenir au mort » sans préciser l'unique communication ; la clarification est dans `answerText` et le texte initial dans `sourceOriginalAnswerText`.
- `JC-013` : la promesse de coupes croisées garanties est **réfutée par une distribution adverse complète valide** (Ouest chicane Pique, ♣87654, ♥RD1064, ♦R107 ; Est ♠RD109873, ♥32, ♦V832). Sur l'entame ♦7, Nord prend ♦A et Ouest peut couper **♠A** du mort de ♣4 au deuxième pli. Le texte d'origine est archivé et le nouveau corrigé explicite le risque de coupe/surcoupe. **Aucune prétention à une stratégie complète certifiée**.
- **Protection** : les 28 autres corrigés de ce groupe, les mains, identifiants, PDF, progression élève et statut d'accès restent inchangés. Aucun `localStorage` réinitialisé. Catalogue : **563/563 EN + 114/114 carte = 677 exercices accessibles**. Module et PWA versionnés `20261103e` / `qpjb-v49` ; smoke ciblé renforcé.
- **Contrôle de la PR** : [QPJB Training smoke #41645715131](https://github.com/CapGui13/QPJB/actions/runs/41645715131) `success`, audit données/code, Chromium et WebKit, sur `51fa159a`.
- **Contre-vérification après fusion sur `main`** : [QPJB Training smoke #41646477703](https://github.com/CapGui13/QPJB/actions/runs/41646477703), `success` des trois jobs sur `00de5bc5` ; [actualisation du catalogue #41646477712](https://github.com/CapGui13/QPJB/actions/runs/41646477712), `success`.
- **Publication GitHub Pages effectivement conclue** : [QPJB Pages #41647000194](https://github.com/CapGui13/QPJB/actions/runs/41647000194), `success` sur commit de catalogue `67bc35a278cd4e199010ed7866a779f599870caf` (les deux jobs vérification et déploiement ont réussi).

**Prochain lot recommandé** : traiter avec contre-exemples / analyses de distribution `JC-012` (défense et nombre de plis), `JC-021` (tempo et reprises), `JC-007` (commentaire sur le saut direct au chelem), puis `JC-002`, `JC-016` et `JC-BH-060-01`. La révision du plan complet de `JC-013` reste ouverte malgré la correction de son affirmation universelle. Essai Safari sur un iPhone physique toujours non effectué.



## Reprise du 3 novembre — JC-012, JC-007 et réserve démontrée JC-021

- **JC-012** : l'inférence abusive de ♥A forcément en Ouest a été corrigée dans `answerText` tout en conservant le texte d'origine et les cartes (commit `3ecb4188e6`). Tests audit/Chromium/WebKit [#41649902757](https://github.com/CapGui13/QPJB/actions/runs/41649902757) concluants ; publication Pages [#41650640695](https://github.com/CapGui13/QPJB/actions/runs/41650640695) réussie.
- **JC-007** : la présentation d'un saut automatique à 6♥ après 2SA fort a été corrigée sans toucher à la donne ni au plan de carte (commit `a87f706f42`). Tests [#41652116357](https://github.com/CapGui13/QPJB/actions/runs/41652116357) réussis et Pages [#41652696036](https://github.com/CapGui13/QPJB/actions/runs/41652696036) réussi sur le commit de catalogue `136295a1c5`.
- **JC-021** : un nouveau **contre-exemple de 52 cartes vérifié** réfute la garantie du corrigé en 3SA : Ouest ♠DV4, Est ♠109876 et ♦RV ; Est conserve des Piques après les deux impasses à Carreau et la défense encaisse cinq plis. Voir `AUDIT_JC_30_PLANS_PRELIMINAIRE_2026-11-03.md`. **Aucun corrigé de JC-021 modifié ni validé** : poursuivre l'étude stratégique avant toute adaptation notée ou publiée.
- **Compteurs inchangés** : 563 exercices d'enchères et 114 de jeu de la carte accessibles ; cette mise à jour documente uniquement l'audit. Test iPhone Safari réel toujours en attente.

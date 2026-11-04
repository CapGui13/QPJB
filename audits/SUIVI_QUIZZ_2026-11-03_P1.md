# QPJB · Feuille de route Quizz exclusivement — 3 novembre 2026

**Périmètre verrouillé : le Quizz des 993 exercices, 22 rubriques, 3 972 propositions.** Aucun chantier sur les 677 exercices d'Entraînement, les PBN, les PDF, les écrans de jeu de la carte ni leur progression.

## État et jalons

- **P1 — lot des 20 signalements prioritaires** : revue individuelle et justifications consignées dans [REVUE_20_PRIORITES_QUIZZ_2026-11-03.md](./REVUE_20_PRIORITES_QUIZZ_2026-11-03.md). 17 réponses cohérentes, deux corrigés reformulés sans modifier l'enchère attendue, une réserve documentée (`SEF-V426-004`). Deux homologues hors priorité ont reçu la même correction de formulation, soit **22 fiches tracées**.
- **Registre** : [REGISTRE_993_REVUES_2026-11-02.csv](./REGISTRE_993_REVUES_2026-11-02.csv), 993 lignes conservées. 22 fiches reçoivent un verdict individuel daté ; le reste conserve son historique de preuve. Une revue documentée est une preuve de démarche, pas une garantie d'unicité théorique du contrat.
- **Version du Quizz** : `prototype-2026-11-03-v4-49-audit-priorites`. Aucun changement de réponse, de proposition, de main, de niveau, d'identifiant, de sauvegarde locale ou de rubrique. Archive du texte historique directement dans quatre fiches. Tests d'intégrité Quizz renforcés.
- **CI / publication :** état **à vérifier après commit**. Ne pas confondre PR créée, fusion et publication GitHub Pages ; relever les trois étapes séparément.

## Reste à traiter, dans l'ordre

1. Lever la réserve `SEF-V426-004` sur le relais à 2SA et la force constructive.
2. Expertiser les **166 fiches en vigilance**, avec verdicts et justification nominative, sans remplacement automatique des bonnes réponses.
3. Compléter les fiches restantes jusqu'à **993 traces individuelles** ; ne pas effacer les 199 revues thématiques déjà effectuées.
4. Réécrire les corrigés laconiques et revoir les quatre distracteurs, puis vérifier les 203 familles à variantes ; **ne pas réintroduire automatiquement** d'anciens `whyNot`.
5. Recalibrer la difficulté des cinq niveaux et vérifier l'UX du Quizz sur un iPhone Safari physique.

**Critère de sécurité** : chaque modification de bonne enchère éventuelle devra faire l'objet d'une preuve SEF, d'un archivage de l'ancien résultat et d'un test de migration. Aucun changement de bonne enchère dans ce lot.


## Validation et publication GitHub vérifiées

- [PR n°21](https://github.com/CapGui13/QPJB/pull/21) **fusionnée** sur `main` (commit `88aad8e7111a933d24f035c263d74261f88a1031`). Portée de la PR : `quizz.html`, `tests/quizz-integrity.cjs`, registre 993 et documents Quizz uniquement.
- [Tests de branche #41667555295](https://github.com/CapGui13/QPJB/actions/runs/41667555295) : audit données et code, Chromium et WebKit **réussis**.
- [Tests après fusion sur main #41668397961](https://github.com/CapGui13/QPJB/actions/runs/41668397961) : trois jobs **réussis** ; [catalogue #41668398365](https://github.com/CapGui13/QPJB/actions/runs/41668398365) actualisé avec succès.
- [Publication Pages #41669051961](https://github.com/CapGui13/QPJB/actions/runs/41669051961) : vérification du commit exact et déploiement **réussis** ; Quizz V4.49 publié. Cette validation couvre les navigateurs simulés, pas un essai physique iPhone.
- **Registre après ce lot : 175/993 fiches avec verdict individuel daté ; 818 restantes**. Les 20 priorités heuristiques restent signalées par leur ancien score (qui n'analyse pas le texte des corrigés), mais ont leur verdict nominatif. La réserve `SEF-V426-004` reste volontairement ouverte.


## P1 — Lot 1 des 166 cas en vigilance, 3 novembre

- **20 fiches** relues nominativement : 5 réponses à une mineure, 2 réponses à 2SA, 13 suites Stayman/Texas. [Rapport détaillé](./REVUE_20_VIGILANCES_QUIZZ_2026-11-03.md). Les quatre choix, les 20 bonnes réponses et les exercices précédents demeurent inchangés.
- **7 corrigés du Quizz clarifiés** avec seuils de force et mise en garde sur les fausses réponses : ancien texte archivé par exercice. `quizz.html` version `prototype-2026-11-03-v4-50-vigilances-20`. Contrôle Quizz ajouté à `tests/quizz-integrity.cjs`.
- **Registre : 195 fiches datées / 993**, soit 20 nouvelles revues et **798 sans verdict individuel daté**. Dans l'ancien groupe de vigilance, **146 restent à examiner** ; les scores heuristiques ne constituent pas des verdicts.
- **Réserve `SEF-V426-004`** : maintenue après confrontation avec les sources documentant le relais 2SA après deux majeur faible. Le 2SA ne figure pas parmi les quatre choix, mais cela ne démontre pas qu'il faille changer Passe. Pas de réponse corrigée sans preuve.
- **CI/Pages :** résultats à confirmer après la fusion ; publication non présumée. Aucun changement des 677 exercices d'Entraînement.


## Publication vérifiée de la V4.50

- **[PR n°22](https://github.com/CapGui13/QPJB/pull/22) fusionnée** sur `main`, commit `7a1beafd75bda9acb77644c69e0c4948830000b2` : 20 fiches Quizz documentées, sept explications clarifiées, zéro modification de bonne réponse ou de proposition. Périmètre limité au Quizz, à ses tests et aux documents d'audit.
- **[Tests de branche #41679035348](https://github.com/CapGui13/QPJB/actions/runs/41679035348) réussis** : audit des données, Chromium et WebKit. La première exécution #41678841024 avait échoué sur une apostrophe non échappée dans un *test* ; l'erreur de syntaxe a été réparée avant la validation et la fusion.
- **[Tests post-fusion #41679668848](https://github.com/CapGui13/QPJB/actions/runs/41679668848) réussis** sur `main`, trois jobs verts ; [catalogue #41679668641](https://github.com/CapGui13/QPJB/actions/runs/41679668641) actualisé avec succès.
- **[GitHub Pages #41680236850](https://github.com/CapGui13/QPJB/actions/runs/41680236850) réussi** : vérification du commit exact et publication de la version validée ; le Quizz **V4.50 est en ligne**. Le test réel iPhone/Safari physique demeure hors du périmètre des navigateurs simulés.
- **Registre actuel : 195/993 fiches avec verdict individuel daté** ; 146 autres du groupe initial des 166 vigilances restent à revoir. La réserve `SEF-V426-004` reste ouverte conformément au rapport, aucune réponse élève n'a été changée.


## P1 — Lot 2 des 166 vigilances : 31 réponses au Contre (V4.51)

- [Revue nominative de 31 cas](./REVUE_31_VIGILANCES_CONTRE_2026-11-03.md), centrée sur `contre`. **28 réponses normalement obligatoires après Passe adverse**, **3 réponses libres après enchère adverse**. L'ancien distracteur « Passe » est conservé lorsqu'il est didactique, et chaque corrigé en explique désormais la différence ; exception 3♥ avec quatre Cœurs après 1♠–X–Passe précisée.
- **31 corrigés Quizz clarifiés** et textes d'origine archivés. Aucun changement de bonne réponse, de distracteur, de main, d'identifiant, de difficulté ou de progression. Version `prototype-2026-11-03-v4-51-reponses-contre` et régression Quizz dans `tests/quizz-integrity.cjs`.
- **Registre : 226 fiches datées sur 993** (+31) ; **767 fiches** sans verdict daté ; **115** autres de l'ancien groupe de 166 vigilances encore à examiner. Réserve `SEF-V426-004` toujours ouverte.
- **CI et Pages** : état à vérifier après commit, avant d'affirmer que les explications sont en ligne.


## V4.51 — validation et publication vérifiées

- **[PR n°23](https://github.com/CapGui13/QPJB/pull/23) fusionnée** sur `main` : commit `d931ff953e4ae3749f5aca3a5bc2295098892d04`. Revue ciblée de 31 réponses au Contre d'appel, distinction obligatoire/libre et exception 3♥ sur 1♠–X–Passe. Aucune bonne réponse, option, main, difficulté, ID ou progression modifiés.
- **[Contrôles sur branche #41735687326](https://github.com/CapGui13/QPJB/actions/runs/41735687326) : succès** de l'audit et des parcours Chromium/WebKit.
- **[Contrôles après fusion #41736217163](https://github.com/CapGui13/QPJB/actions/runs/41736217163) : succès** des trois jobs sur `main` ; [catalogue #41736217180](https://github.com/CapGui13/QPJB/actions/runs/41736217180) actualisé avec succès.
- **[Publication Pages #41736734978](https://github.com/CapGui13/QPJB/actions/runs/41736734978) : succès** de la vérification source et de la publication du commit testé. **Quizz V4.51 publié.** La validation Safari sur iPhone réel reste ouverte.
- **Registre actuel : 226/993 fiches avec verdict individuel daté**, 767 sans verdict daté ; **115 fiches** du groupe initial des 166 vigilances restent à examiner. Le cas `SEF-V426-004` reste sous réserve, sans changement d'enchère.


## P1 — Lot V4.52 du 4 novembre : 30 autres vigilances Quizz

- **[Revue des 30 exercices](./REVUE_30_VIGILANCES_FIT_ET_SECONDE_2026-11-04.md)** : 11 après fit majeur, 19 deuxièmes enchères du répondant. 19 corrigés Quizz explicités et archivés ; 29 réponses cohérentes parmi les choix, **1 réserve** à contre-expertiser (`SEF-V417-008` sur 3♠ ou 4♠ après 1♠–2♣–2♠). Aucune réponse ni proposition modifiée.
- **Correction de décompte** : sur les 166 vigilances initiales, **83 n'avaient pas de verdict daté** avant ce lot, et non 115 ; 32 avaient déjà une revue datée avant nos lots. Après les 30 fiches : **53 vigilances non revues**.
- **Registre : 256 / 993 avec revue individuelle datée**, dont des réserves ouvertes, et **737 sans verdict daté**. Ne pas confondre revue documentée et certification pédagogique certaine.
- **Quizz V4.52** : `prototype-2026-11-04-v4-52-apres-fit-redemande`, zéro bonne enchère modifiée, historique élève préservé. Tests d'intégrité ajoutés.
- **Validation et publication** : à contrôler après PR/CI/Pages avant annonce de mise en ligne.


## V4.52 — fusion, contrôles et publication vérifiés

- **[PR n°24](https://github.com/CapGui13/QPJB/pull/24) fusionnée**, commit `96ea82e3a8cd9108836ac7f5b717fa6e2e7a286c`. Le lot concerne 30 fiches du Quizz (11 essais après fit, 19 deuxièmes enchères), 19 explications clarifiées et 30 verdicts enregistrés ; **aucune bonne réponse ni proposition modifiée**.
- **[Tests sur branche #41741783253](https://github.com/CapGui13/QPJB/actions/runs/41741783253) réussis** : audit des données, Chromium et WebKit.
- **[Tests sur main #41742267943](https://github.com/CapGui13/QPJB/actions/runs/41742267943) réussis**, trois jobs verts ; [catalogue #41742268061](https://github.com/CapGui13/QPJB/actions/runs/41742268061) actualisé.
- **[GitHub Pages #41742724147](https://github.com/CapGui13/QPJB/actions/runs/41742724147) : publication réussie** du commit testé. La **V4.52 est en ligne**, sous réserve du cache éventuel côté navigateur. Les tests automatisés n'équivalent pas à une validation sur iPhone réel.
- **Suivi rectifié** : 256/993 fiches avec revue individuelle datée, 737 sans revue datée ; **53 vigilances encore sans revue datée** dans le groupe heuristique des 166 (les 32 précédemment revues ne doivent pas être recomptées). Deux réserves pédagogiques restent ouvertes : `SEF-V417-008` et `SEF-V426-004`.


## P1 — V4.53 du 4 novembre : 25 vigilances après intervention adverse

- [Revue nominative de 25 cas](./REVUE_25_VIGILANCES_APRES_INTERVENTION_2026-11-04.md) de la rubrique `apres_inter` : contrôles des réponses naturelles, contres Spoutnik, soutiens compétitifs et Passes sans force. **25 réponses conservées** dans les choix proposés ; **9 corrigés clarifiés** et textes antérieurs archivés.
- **Registre : 281/993 revues individuelles datées**, 712 encore sans revue datée. Groupe de 166 vigilances : **28 sans verdict daté** (53 moins ce lot de 25).
- Version : `prototype-2026-11-04-v4-53-apres-intervention`. Réponses, quatre choix, mains, niveaux, identifiants et progression élèves inchangés.
- **Réserves ouvertes :** `SEF-V417-008` et `SEF-V426-004`. Suite : 28 vigilances restant à revoir, contre-expertise sur les réserves, puis revue nominative des autres fiches.
- **CI / fusion / publication Pages :** à confirmer séparément après création de la PR ; aucun succès présumé à cette étape.


## V4.53 — fusion, validations et publication confirmées

- [PR n°25](https://github.com/CapGui13/QPJB/pull/25) **fusionnée** sur `main`, commit `98a04f4c8ded9ca58897942e9a99737e75c08b50`.
- [Tests de branche #41813977323](https://github.com/CapGui13/QPJB/actions/runs/41813977323) **réussis** : audit, Chromium et WebKit.
- [Tests post-fusion #41814810987](https://github.com/CapGui13/QPJB/actions/runs/41814810987) **réussis** ; [catalogue #41814810964](https://github.com/CapGui13/QPJB/actions/runs/41814810964) actualisé.
- [Publication Pages #41815219806](https://github.com/CapGui13/QPJB/actions/runs/41815219806) **réussie**. V4.53 en ligne, sous réserve du cache local et de la validation physique iPhone.

## P1 — V4.54 du 4 novembre : clôture des 28 vigilances non datées et correction quantitative

- [Rapport des 28 décisions](./REVUE_28_VIGILANCES_ET_CORRECTION_2SA_2026-11-04.md) : 4 interventions directes, 7 réponses à l'intervention, 3 réveils, 2 ouvertures, 1 réponse mineure, 2 soutiens majeurs, 6 réponses à SA, 3 redemandes de l'ouvreur.
- **27 bonnes réponses maintenues ; une correction SEF : `SEF-V44-014` passe de 4SA à 3SA** avec 11 H réguliers en face de 2SA (20–21 H), selon la règle quantitative FFB (4SA avec 12 H).
- **22 corrigés précisés**, anciens textes et ancienne bonne enchère archivés ; marqueur de migration non destructif pour le seul exercice dont la réponse change.
- **Registre : 309 / 993 fiches avec verdict individuel daté**, 684 restantes ; les **166 vigilances initiales ont désormais toutes une revue datée**. Cela ne certifie pas l'ensemble des 993 exercices.
- Les deux réserves `SEF-V417-008` et `SEF-V426-004` restent ouvertes. Priorités suivantes : contre-expertise de ces cas, élargissement des preuves à 993 fiches et audit des variantes.
- Version `prototype-2026-11-04-v4-54-dernieres-vigilances`. **CI/Pages à vérifier** après PR, fusion et déploiement. Périmètre Quizz uniquement.


## V4.54 — fusion et publication confirmées le 4 novembre 2026

- [PR n°26](https://github.com/CapGui13/QPJB/pull/26) **fusionnée** sur `main`, commit `cb247e6a0dee5b04ebe452b091dd1f72fe67de56`.
- [Tests de branche #41815658528](https://github.com/CapGui13/QPJB/actions/runs/41815658528) **réussis** (audit, Chromium, WebKit).
- [Tests post-fusion #41816126662](https://github.com/CapGui13/QPJB/actions/runs/41816126662) **réussis** (trois jobs) ; [actualisation du catalogue #41816126628](https://github.com/CapGui13/QPJB/actions/runs/41816126628) **réussie**.
- [Publication Pages #41816574545](https://github.com/CapGui13/QPJB/actions/runs/41816574545) **réussie** : source publiée `a15fab044fa6a38cfcb11be2efefcd10e820f986`, Quizz `prototype-2026-11-04-v4-54-dernieres-vigilances` contrôlé sur `main`.
- **Bilan net : 309/993 revues datées ; 0/166 vigilances initiales non datées ; 22 corrigés clarifiés et une bonne réponse corrigée (4SA → 3SA, `SEF-V44-014`) avec archivage/migration ciblée.** Les deux réserves `SEF-V417-008` et `SEF-V426-004` restent ouvertes. La validation physique sur iPhone réel est toujours distincte.


## P2 — V4.55 du 4 novembre : 24 ouvertures et contre-expertise des réserves

- [Rapport de 24 ouvertures et de deux contre-expertises](./REVUE_24_OUVERTURES_ET_2_RESERVES_2026-11-04.md) : 24 décisions nominatives d'ouverture, huit corrigés approfondis, 24 contextes passés du tutoiement au vouvoiement avec anciens textes archivés.
- **Deux réserves levées dans le SEF du Quiz, sans modification des bonnes réponses :** `SEF-V417-008` (4♠ conclusif plutôt que 3♠ de recherche de chelem) et `SEF-V426-004` (Passe avec 13 H sans soutien suffisant après 2♥ faible). Verdicts historiques conservés dans les fiches, références FFB et iBridge dans le rapport.
- **Registre : 333/993 revues individuelles datées**, 660 encore sans revue individuelle datée ; plus de réserve ouverte parmi les deux suivies. Les 166 vigilances heuristiques restent couvertes, sans prétendre certifier les 993 exercices.
- **Version :** `prototype-2026-11-04-v4-55-ouvertures-et-reserves`. Aucun changement de bonne enchère, proposition, main, difficulté, rubrique, ID ni progression.
- **Suivants :** revue nominative des 660 autres (priorité redemandes de l'ouvreur, soutiens majeurs, secondes enchères du répondant) ; contrôles des distracteurs et variantes.
- **CI / fusion / GitHub Pages :** à confirmer séparément avant d'annoncer cette version publiée.


## V4.55 — validation et publication confirmées le 4 novembre 2026

- [PR n°27](https://github.com/CapGui13/QPJB/pull/27) **fusionnée** sur `main`, commit `d1c386b461ce43f7beb87f355f6795326c8510a9`.
- [Tests de branche #41817857485](https://github.com/CapGui13/QPJB/actions/runs/41817857485) **réussis** : audit données/code, Chromium et WebKit.
- [Tests post-fusion #41818257800](https://github.com/CapGui13/QPJB/actions/runs/41818257800) **réussis** : trois jobs ; [catalogue #41818257632](https://github.com/CapGui13/QPJB/actions/runs/41818257632) actualisé avec succès.
- [Publication GitHub Pages #41818645625](https://github.com/CapGui13/QPJB/actions/runs/41818645625) **réussie** du commit `50417fe5a81a6c3cb11bc25c7e308e0074fe2e02`, contenant le Quizz `prototype-2026-11-04-v4-55-ouvertures-et-reserves`.
- **Bilan confirmé : 333 revues individuelles datées sur 993 ; 660 restantes.** Deux réserves pédagogiques initiales levées avec contre-expertise FFB/iBridge et anciennes décisions archivées ; 24 nouvelles ouvertures revues, 8 corrigés enrichis, 24 énoncés mis au vouvoiement. Aucune bonne réponse ni historique élève modifiés.
- Suivi des prochaines revues : redemandes de l'ouvreur, soutiens majeurs, deuxièmes enchères du répondant. Un contrôle physique sur Safari/iPhone demeure nécessaire et distinct des simulateurs Chromium/WebKit.

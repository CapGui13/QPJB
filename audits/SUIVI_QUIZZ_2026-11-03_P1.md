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

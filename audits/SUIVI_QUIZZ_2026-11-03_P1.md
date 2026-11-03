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

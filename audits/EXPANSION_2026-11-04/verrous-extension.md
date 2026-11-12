# QPJB — Verrous techniques relevés avant l'extension de la base
**Analyse du 4 novembre 2026, branche de diagnostic ; aucune modification du Quiz ni des tests.**

## Tests actuellement bloquants si l'on ajoute une fiche
| Fichier | Verrou exact | Adaptation recommandée |
|---|---|---|
| `tests/quizz-integrity.cjs` | Deux assertions exactes `exercises.length === 993` | Remplacer par une vérification d'inclusion intégrale des 993 identifiants historiques et de leurs contenus immuables + total dynamique |
| `tests/quizz-quality.cjs` | `xs.length === 993`; rapport `qualite-993.csv` | Nombre et nom de rapport dynamiques, tout en préservant les invariants des QCM |
| `tests/quizz-distractors.cjs` | `exercises.length === 993`, `comparisonRows.length === 2979`, noms `comparaison-2979-propositions.csv` | Écrire `3 * exercises.length` pour le nombre de distracteurs, reporter un nom dynamique |
| `tests/quizz-content-audit.cjs` | `report.total === 993` ; `familyVariants.length === 203` | Préserver les familles historiques, permettre l'ajout de familles nouvelles et de vrais contrastes |
| `tests/quizz-browser.cjs` | Test de longueur `dataC01.exercises.length === 993` | Tester tous les IDs attendus + bon fonctionnement de l'interface pour le nouveau catalogue |

## Autres constantes visibles
`quizz.html` contient le texte **« 993 exercices sélectionnés »**, une description **« 993 exercices »** et le JSON de version/description avec `993`. Ces chiffres devront venir de la **base réelle**, et non d'un remplacement manuel à chaque version.

## À ne pas sacrifier en rendant les chiffres dynamiques
- Les **993 exercices d'origine** doivent rester identiques, identifiables et exploitables. Une référence figée avec empreinte des champs protégés `id,theme,hand,h,shape,auction,context,answer,choices,explain,difficulty,caseFamily` doit servir d'oracle anti-régression.
- Les nouveaux exercices reçoivent des **identifiants stables** et un registre de revue distinct de l'historique `REGISTRE_993_REVUES_2026-11-02.csv`, sans réécrire le passé.
- Vérifier 13 cartes, points H, distribution, couleurs, légalité de chaque enchère, justesse de réponse SEF et plausibilité des trois distracteurs.
- Contrôler l'absence de situation strictement identique et l'**intérêt du contraste** avec les exercices déjà connus.
- Le Quiz ne doit afficher ni textes de brouillon ni exercices marqués rejetés, même si les JSON de revue sont présents dans les audits.

## Intégration proposée
1. PR technique courte pour rendre les tests extensibles **avec obligation de conservation de l'existant** ; vérifier qu'elle passe d'abord sur les 993 actuels.
2. PR pédagogique avec uniquement les fiches **retenues après validation SEF**, recalcul du nombre, vérification sur Chromium et WebKit.
3. Publication GitHub Pages seulement si les contrôles et la revue sont validés.

**À ce stade, ces adaptations sont diagnostiquées, pas implémentées.**

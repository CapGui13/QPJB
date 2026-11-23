# LONG M3 — PASSE 15 : protéger les résultats lors du comparatif avant/après

Branche `wave2/experience-eleve-20261121`, parent `77d314d4f277a99066a040b65d86ae2f9c06cf0a`.

## Problème de la recette P14
La comparaison visuelle savait vérifier que les mains et séquences étaient identiques ; elle ne comparait pas l'effet du même clic sur les données sauvegardées. Une régression de notation/reprise pourrait donc coexister avec des captures visuellement correctes.

## Correction
- Nouveau module pur `tests/wave2-ux-storage-projection.cjs`, utilisé par le comparatif. À la fin des captures, il projette depuis `localStorage` : IDs de séance et index actifs, mode, réponses enregistrées (résultat, choix, aide) et compteurs d'exercices (correct, wrong, skipped, autonomie/aide).
- Les **horodatages** sont volontairement exclus de la comparaison car les deux pages sont chargées successivement, avec dates distinctes. Les changements de choix, score, aide ou position restent détectables.
- `tests/wave2-ux-visual.cjs` compare cette projection pour **avant vs après** aux trois formats ; l'essai échoue si les actions de l'élève ne conduisent pas à une même progression.
- Nouveau test `tests/wave2-ux-storage-projection-test.cjs` ajouté au runner : désormais **8 étapes**, avec échec strict si l'une échoue.

## Preuves réellement obtenues
Le module exact a été exécuté avec les deux états fictifs aux mêmes réponses, mais à dates distinctes : projections **égales**. Une mutation fictive de l'enchère (1♣ → 1♦) est **détectée**. Syntaxe des quatre fichiers testée. Les fichiers de production / JSON QCM / sauvegardes des élèves restent totalement intacts : aucune modification de `quizz.html` ou du moteur dans cette passe.

## État non clos
La suite de captures et le runner navigateur ne sont pas encore exécutés en Chromium/WebKit à cause du checkout distant indisponible et du raccordement CI qui relève de M5. Les captures promettent des résultats mais ne sont **pas présentées comme produites**.

**PASSE 15 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P16 — vérifier CI/branche et livrer une recette de coordination prête à exécuter, sans intervention sur les autres branches.**

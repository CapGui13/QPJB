# LONG M4 — Passe 16 : désaccord entre journal et compteurs

**PASSE 16 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Anomalie démontrée

Le module rapprochait correctement des réponses de micro-compétence et d'axe quand leurs identifiants `session+question` coïncidaient, mais ne comparait pas le nombre de réussites réellement autonomes du journal avec les `independent` agrégés. Une sauvegarde incohérente pouvait conserver `score=3, independent=3` tout en ayant **trois réponses `wrong`** dans le journal : la recommandation « réussites autonomes répétées » était indûment affichée. L'inverse pouvait prétendre une difficulté persistante alors que les réponses détaillées étaient toutes correctes.

## Correction conservative, sans reclassification

Lors du regroupement, le module recompte les réponses réellement autonomes pour chaque micro/axe à partir du journal dédoublonné et non contradictoire, **uniquement si toutes les tentatives agrégées y figurent**. Si la preuve complète contredit `independent` :

- le conseil concernant ce micro/axe est écarté ;
- aucun résultat ni score de l'état V1 n'est modifié ;
- une limite est inscrite dans le rapport et dans la réserve des conseils encore visibles ;
- si aucun autre conseil ne subsiste, une information neutre de vérification de sauvegarde est présentée, sans inventer de maîtrise ou de difficulté ;
- les journaux partiels ne déclenchent pas de déclaration d'incohérence (preuve insuffisante).

Quatre tests nouveaux dans `tests/wave2-recos-consistency.test.js` : faux acquis, faux diagnostic, réussite légitime, journal partiel. Le moteur V1 réel produit les états via `record/finish`, les variations du journal simulent uniquement les imports incohérents.

**PROCHAINE PASSE :** mesurer l'impact sur le traitement de 65/153 séances et de la borne à 1 000 événements du journal, vérifier l'absence de régression des 73 scénarios et le périmètre M4. Les nouveaux tests Node22 demandent une exécution ciblée à part ; aucun changement de workflow M5. PR DRAFT/HOLD, sans fusion/publication.

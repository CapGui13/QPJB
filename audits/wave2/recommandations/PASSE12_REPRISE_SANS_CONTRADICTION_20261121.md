# LONG M4 — Passe 12 : éliminer le conseil contradictoire « commencer / reprendre »

**PASSE 12 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Défaut constaté

Sur l'état V1 vide avec active={ids:[...],answers:{}}, le module produisait simultanément :
- resume : « Reprendre la séance interrompue » ;
- not_evaluated : « Commence une séance du parcours ».
Ce second conseil est contradictoire : la bonne action est de reprendre. Les deux cartes pouvaient être affichées car la limite de trois n'écartait pas not_evaluated.

## Correction minimale

Le conseil not_evaluated n'est proposé que lorsqu'aucune séance n'est active. Les autres recommandations et leur ordre ne changent pas ; aucune donnée de sauvegarde, progression ou moteur n'est modifiée.

Quatre contre-tests nouveaux dans tests/wave2-recos-resume.test.js : séance ordinaire ouverte à zéro réponse, consolidation ouverte, état réellement vide sans séance, import ancien de 65 séances avec reprise. Ils vérifient aussi l'immutabilité et l'historique incomplet.

## Recette

La sonde temporaire de P10 lance maintenant **61 scénarios attendus** (13 historiques + 48 nouveaux), dans le job historique Node22, sans modifier .github/workflows.
Commande native recommandée : node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js.
La réussite des 61 tests reste à confirmer dans les logs du nouveau run.

**PROCHAINE PASSE :** supprimer toute sonde temporaire après résultat Node22, comparer les SHAs moteur/HTML et vérifier PR brouillon/HOLD.

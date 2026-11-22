# LONG M4 — Passe 5 : explicabilité et limites de preuve

**PASSE 5 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Nouveau contrat ADDITIF

Chaque carte conserve strictement id, type, priority, title, message, evidence et reçoit :
explanation: {observed, caveat, action}.

- observed cite les données réellement disponibles (essais, indépendance, score et libellé V1 ; nombre de réponses actives ; nombre de cas de révision réellement éligibles).
- caveat énonce ce qu'il est interdit de déduire (absence de maîtrise globale, score agrégé plutôt que détail de chaque situation, séance en cours non validée, évolution future non garantie).
- action propose une étape concrète sans déclencher ni écrire quoi que ce soit.
- Les six types existants sont couverts ; aucune nouvelle catégorie ni nouvelle preuve ne sont introduites.
- L'ajout est en lecture seule, sans modifier les sauvegardes ni le moteur. Le contrat ancien reste intact.

## Contre-épreuves

Six nouveaux tests dans tests/wave2-recos-explain.test.js : couverture des 6 familles, chiffres des agrégats, aide/erreur libre, réserves d'ancienne sauvegarde, séance active, et éligibilité réelle du plan.

Commandes de recette :
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-evidence.test.js tests/wave2-recos-grouping.test.js tests/wave2-recos-longitudinal.test.js tests/wave2-recos-explain.test.js

Les textes doivent être utilisés comme descriptions de preuve, et ne doivent pas être interprétés par l'intégrateur comme des scores supplémentaires ou comme des validations d'acquis.

**PROCHAINE PASSE :** compatibilité API stricte, propriétés des entrées malformées / journaux partiels, revue des trajectoires, contrat d'intégration et bilan explicite des tests exécutés ou non. PR DRAFT/HOLD.

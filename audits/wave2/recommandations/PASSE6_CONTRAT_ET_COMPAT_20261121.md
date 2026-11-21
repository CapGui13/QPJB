# LONG M4 — Passe 6 : compatibilité et contrat d'intégration (HOLD)

**PASSE 6 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Contrat de consommation pour le coordinateur, sans raccordement

Chargement après le moteur V1 : parcours-recommandations.js expose window.QPJBParcoursRecommandations ou module.exports.

buildReport(rawState, {parcours, exercises, maxRecommendations:3}) lit l'état V1 sans mutation et renvoie :
- schemaVersion = 1, status = ok|unavailable, completedSessions ;
- currentSession si une séance est en cours, sinon null ;
- observations avec résultats parcours/consolidation distincts et couverture du journal ;
- revision = null si séance active ou catalogue non fourni ; sinon plan éligible tel que confirmé par le moteur, sans le démarrer ;
- recommendations (max 1..10) avec id/type/priority/title/message/evidence et explanation {observed,caveat,action} ;
- limitations globales : historique absent, catalogue non fourni et distinction des consolidations.

Le champ facultatif evidence.sameAnswersAs désigne des **classements parallèles de la même réponse**, non des preuves supplémentaires. Ne jamais afficher comme deux compétences maîtrisées.

**Entrées non autorisées :** état absent, JSON mal formé, version autre que 1 : status unavailable, aucune suggestion. Options absentes/nulles/primitives normalisées à {}. Les anciennes clés publiques et catégories sont préservées.

## Garanties et tests ajoutés

Six tests : options invalides, limites 1..10, état/catalogue profondément gelés, événement de journal invalide, versions incompatibles, surface d'API intacte. Avec P1-P5, les suites visées comptent 13 tests historiques + 8 P2 + 6 P3 + 6 P4 + 6 P5 + 6 P6 = **45 assertions de scénarios exécutables** (non présumées vertes avant exécution).

Commande :
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-evidence.test.js tests/wave2-recos-grouping.test.js tests/wave2-recos-longitudinal.test.js tests/wave2-recos-explain.test.js tests/wave2-recos-compat.test.js

## Portes de sortie (NON FRANCHIES)

1. Exécuter réellement les 45 tests ciblés sur Node 22, puis corriger tout échec.
2. Examiner les diagnostics M4-P4 des dix profils réels, sans confondre scénarios générés et succès attestés.
3. Confirmer le smoke GitHub complet du dernier commit.
4. Vérifier le diff final ne touche que les fichiers autorisés.
5. Faire valider le raccordement UI par le coordinateur ; cette branche ne doit pas modifier quizz.html.

**PROCHAINE PASSE :** lever les blocages de recette ciblée, vérifier les CI et contre-épreuves de stabilité ; si aucun nouvel accès d'exécution, documenter honnêtement sans clôture définitive. PR DRAFT/HOLD.

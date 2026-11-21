# LONG M4 — Passe 2 : contre-épreuves avant correction

**PASSE 2 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Origine : issue #258, brouillon #262, passe 1 SHA 96b55ec6ccb319ed475a3332abd2fb91ce3f94af.

## Scénarios vérifiables

Le fichier tests/wave2-recos-evidence.test.js contient **8 tests** s'appuyant sur le vrai QPJBParcours.record/finish, sauf dans le cas ancien dépourvu d'historique :
- Aide et erreur libre ne deviennent pas des réussites autonomes ; saut distinct d'échec.
- QCM SEF-026-3 : deux mauvaises réponses classées à la fois dans micro majeur:1♠ et axe fit produisent deux conseils avec les mêmes faits : **recouvrement concret**.
- Trois micro-difficultés avec un catalogue permettant 7 familles de la notion visée : révision disponible dans l'état mais **absente des 3 cartes visibles**.
- Séance active : priorité à la reprise sans proposer de nouvelle séance.
- Cinq réussites en consolidation, dont trois après erreur libre : zéro preuve de réussite du parcours principal.
- État ancien à 65 séances, micro agrégé et aucun journal : 65 séances sans détail, aucune reconstitution.
- Réimportation en double d'un événement de journal : observation comptée une fois.
- Plusieurs rapports consécutifs : état et catalogue immuables.

Les deux tests de recouvrement et de visibilité documentent volontairement le comportement AVANT correction ; ils seront adaptés en P3 avec comparaison explicite. Aucune preuve de maîtrise ni aucun nouveau seuil pédagogique n'est ajouté.

## Arbitrage de la passe 3

1. Ne regrouper micro et axe que lorsque le journal fournit une preuve *précise* de chevauchement d'observations ; ne jamais le déduire d'une simple égalité de scores.
2. Conserver la preuve spécifique et la preuve générale, sans inventer un acquis.
3. Une révision confirmée comme disponible doit disposer d'une chance d'apparaître dans les 3 conseils affichés, sans prendre le pas sur la reprise active.
4. Vérifier et mesurer sous maxRecommendations=3, puis à limite 10.

Commande : node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-evidence.test.js

**PROCHAINE PASSE :** tests de regroupement ciblés, correction minimale du module, priorités d'action, non-régression, rapport avant/après. PR HOLD, aucune fusion ni publication.

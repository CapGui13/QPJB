# M4 — transfert pédagogique, livraison partielle #400

Base d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. Aucun fichier historique ou moteur modifié.

## Bilan mesuré

| Mesure | Avant | Après proposé |
|---|---:|---:|
| QCM | 1915 | 1918 |
| Familles | 1556 | 1559 |
| Concepts | 99 | 99 |
| Paires distinctes de toute nature | 35 | 118 |
| Concepts avec au moins une paire | 36 | 99 |

18 paires historiques de transfert couvrant 22 concepts, conservées comme candidates. 83 nouveaux rapprochements. Répartition exacte : {"historical_transfer_candidate":18,"historical_discrimination":17,"contextual_candidate":42,"discrimination":18,"discrimination_context":22,"role_complement":1}. Une paire de discrimination ou de rôles complémentaires ne vaut pas preuve de transfert. Le registre de 1915 IDs est exhaustif structurellement, pas une certification éditoriale de chacun. Les trois nouveaux IDs sont enregistrés séparément. Les critères de miroir sont heuristiques ; aucun crédit automatique.

## Production

Trois ajouts ciblés à mains indépendantes : Texas faible 1SA/2SA, rectification Cœur 1SA/2SA, Stayman ordinaire/contré. Les passes suivantes réutilisent les corrigés existants pour distinguer conventions, seuils, forcing, compétition et rôles. Dernière passe : 21 paires retenues sur 22, 1 écartée pour famille commune. Ne pas forcer de nouveaux exercices si une comparaison pertinente existe déjà.

## Tests et limites

{"assertions":5052,"ids":1915,"additions":3,"pairs":118,"status":"PASS"}. Entrée complète CJS exécutée en V8 avec données GitHub exactes et adaptateurs fs/git, pas Node CLI natif : DNS du terminal indisponible. Rejouer après checkout : node tests/durable-m4-transfert.cjs. Aucun navigateur réel ni intégration moteur. Contrôles structurels ne prouvent pas la qualité humaine de chaque corrigé. Concepts sans aucune paire : 0; cela ne signifie pas que les concepts liés disposent tous d'un vrai transfert intercontextuel. Restent la revue éditoriale individuelle complète des 1915 QCM, la lecture complète des références historiques et des accords, la validation humaine des nouveaux exercices et la recette native. Ne pas assimiler une couverture de paires à une couverture de maîtrise.

## Intégration par le coordinateur

additions.json : vérifier et viser les nouveaux cas avant insertion. contrasts.json : données consultatives, automaticCredit=false. QPJBDurableTransfer.links({id,concept,contrasts,candidates}) : uniquement candidats déjà éligibles, aucune mutation, score ou modification du parcours. Aucun changement de production ni fusion.

MISSION DÉFINITIVEMENT TERMINÉE : NON.

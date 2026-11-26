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

## Reprise — revue qualitative des paires

Les 118 paires initiales ont été relues à partir de leurs forces, distributions, séquences, réponses et corrigés exacts. Huit nouveaux liens exploitent des QCM existants ; aucune création artificielle. Le registre `revue-paires.json` complète la cartographie historique : 197 anciens IDs impliqués dans une revue de critère, 1718 anciens IDs sans revue de critère de paire dans cette passe, 99 dispositions conceptuelles. Il ne prétend pas certifier chaque main ni distracteur. Bilan : {
  "intercontextual": 35,
  "near_transfer": 10,
  "context_boundary": 37,
  "hold": 3,
  "discrimination": 31,
  "role_complement": 9,
  "consolidation": 1
} ; 43/99 concepts avec au moins un indice intercontextuel candidat. Les cas HOLD restent dans le registre mais sont exclus par le module. Cas #271 SEF-L25-004 conservé conformément au visa #364. `links({purpose:'transfer',...})` exclut tous les liens non intercontextuels et les données non revues ; `purpose:'practice'` ou absence de purpose donne les contrastes non HOLD, sans crédit automatique. Ne pas confondre discrimination de contexte et réussite autonome transférée. Aucun score ni sélection. Les deux tests CJS complets ont été exécutés dans V8 sur blobs exacts : 5132 + 7730 assertions PASS. Node CLI/navigateur non exécutés ; cartographie structurelle conservée, revue éditoriale des 1915 QCM et visa humain des trois ajouts restent à faire. Aucun merge.

## Passe 5 — enrichissement des transferts contextuels

22 paires supplémentaires sur QCM existants, sans nouveau QCM ni changement des anciens. 148 paires au total ; 47 candidates intercontextuelles, 59/99 concepts concernés. 222/1915 anciens IDs relus pour le critère de paire, non pour un visa éditorial global. 1693 anciens IDs restent sans cette revue. Les 3 HOLD sont toujours exclus. Michaël en réveil/compétition, redemandes fortes, passe-ou-corrige, seuils SA, barrage, soutien après contre et réponses codées bénéficient de contrastes supplémentaires. 0 proposition(s) écartée(s), voir mesures.json. Tests CJS sur blobs exacts en V8 : 5352 + 8074 assertions PASS. Pas de recette Node CLI ou navigateur intégrale. MISSION DÉFINITIVEMENT TERMINÉE : NON.

## Passe 6 — transfert entre notions voisines

26 paires supplémentaires sur QCM existants, sans ajout ni modification de QCM. 174 paires au total ; 66 candidates intercontextuelles, 81/99 concepts concernés. Nouveaux concepts concernés : mineur.base, majeur.base, fit.2sa, roudi.init, red.bicolore_cher, rubensohl.naturel, rubensohl.init, sa2.texas.reponse, sa1.stayman.contre, sa1.texas_mineur.reponse, sa2.texas_mineur.reponse, roudi.choix, forcing.checkback, drury.reponse, drury.suite, competitif.2sa_fitte, competitif.spoutnik, sa1.texas_mineur, michaels.choix, second.bicolore_cher, sa1.texas.contre, intervenir.sa.suite. 250/1915 anciens IDs relus pour le critère de paire, non pour un visa éditorial global. 1665 anciens IDs restent sans cette revue. Les 3 HOLD sont toujours exclus. 0 proposition(s) écartée(s), voir mesures.json. Tests CJS sur blobs exacts en V8 : 5612 + 8488 assertions PASS. Pas de recette Node CLI ou navigateur intégrale. MISSION DÉFINITIVEMENT TERMINÉE : NON.

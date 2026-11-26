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

## Passe 7 — contrôle individuel mécanique et décisions d'ouverture

20 paires supplémentaires sur QCM historiques ; 194 paires au total, 77 candidates intercontextuelles, 92/99 concepts. 276/1915 anciens IDs relus pour le critère de paire. Les 7 concepts sans candidat intercontextuel sont décrits individuellement dans mesures.json ; ne pas forcer un transfert pour une règle circonscrite à une seule situation. 4 paires HOLD exclues. Registre revue-ouvertures.json : 52 QCM des quatre concepts d'ouverture lus individuellement (mains, forces, contexte, choix, corrigés, motifs), 49 cohérents dans le référentiel du catalogue, 3 réserves documentées ; pas de visa universel. Le contrôle mécanique exhaustif est dans controle-mecanique.json : cartes, H, forme, quatre choix, licéité partielle du préfixe et choix, texte non vide, indépendance des mains des paires et absence de permutation exacte de couleurs. 15839 assertions PASS, aucun défaut mécanique détecté ; ni l'unicité pédagogique ni le tour de parole complet ne sont prouvés par ces tests. Total des trois suites réellement exécutées sous V8 sur blobs exacts : 5812 + 8800 + 15839 assertions. Node CLI et navigateur non attestés ; revue individuelle complète du reste du catalogue et visa des trois ajouts restent à faire. Aucun changement de production. MISSION DÉFINITIVEMENT TERMINÉE : NON.

## Passe 8 — revue des notions résiduelles et exercices sans indice

Les 107 QCM des six notions résiduelles autres que fortes.ouverture ont été relus individuellement, avec statut et motif par ID dans revue-notions-residuelles.json : {"coherent_in_catalogue_framework":93,"guided_not_independent":12,"bounded_context":1,"hold_editorial":1}. Avec les 52 ouvertures de la passe précédente, 159 anciens QCM disposent d'une revue individuelle ciblée (pas visa externe complet du SEF). V2-M1-031 admet explicitement 1♦ alors que 2♣ est attendu : conserver l'historique, ne pas utiliser comme décision unique. Les deux anciens énoncés du relais 2♣ fort indéterminé fournissent la règle ; deux propositions sans indice, 0 H et 14 H, comblent cette lacune, sans nouveau transfert artificiel. Les cinq propositions ont un dossier de revue dans revue-ajouts.json ; visa final du coordinateur requis. Catalogue projeté : 1920 QCM / 1561 familles, 196 paires (77 intercontextuelles candidates, 92 concepts) dont 4 HOLD exclues. Quatre suites CJS exécutées en V8 sur blobs exacts : 5854 + 8832 + 15859 + 341 assertions PASS. Aucun ancien QCM ni fichier de production changé. La revue individuelle exhaustive des 1756 autres QCM, la lecture intégrale des références encore non contrôlées et la recette native Node/navigateur ne sont pas achevées. MISSION DÉFINITIVEMENT TERMINÉE : NON.

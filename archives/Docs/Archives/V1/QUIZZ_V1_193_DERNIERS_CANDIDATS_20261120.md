# Quiz V1 — Couverture documentaire des 1 523 QCM : 193 derniers candidats

**20 novembre 2026 — issue #226.** Ceci est une **préclassification de travail non homologuée**, pas une publication d'un moteur pédagogique ni une validation automatique des corrigés. Aucun QCM n'a été inventé, corrigé ou remplacé.

## Pourquoi cette PR ne gêne pas l'autre instance

La PR [#231](https://github.com/CapGui13/QPJB/pull/231) de l'autre instance a déjà été fusionnée : traçabilité des motifs de tirage et diagnostics, avec des changements dans `quizz-parcours.js` et `tests/quizz-ergonomie*.cjs`. La précédente PR [#232](https://github.com/CapGui13/QPJB/pull/232) de cartographie a été fusionnée séparément avec un contrôle de non-chevauchement réussi.

Cette nouvelle livraison n'édite **aucun** fichier du moteur, des tests ergonomiques, des règles de sélection ni des QCM. Elle crée des registres `audits/`, le script d'intégrité `scripts/verify-v1-193-final-preclassification.cjs`, le présent rapport et adapte uniquement le workflow de **l'audit pédagogique dédié**. Les sources `quizz.html` et `audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json` restent inchangées.

## Les 193 cas restants sont couverts sans duplication

Les propositions ont été établies **à partir des mains, séquences, choix, corrigés, explications et motifs de difficulté du catalogue V1**, et conservées avec leurs questions intégrales dans sept registres indépendants, reliés à [la carte de leurs 75 groupes candidats](../../audits/QPJB_V1_193_GROUPES_CANDIDATS_20261120.json).

| Rubrique de la source V1 | QCM | Groupes candidats |
| --- | ---: | ---: |
| [Ouvertures fortes](../../audits/QPJB_V1_FINAL_FORTES_42_PRECLASSIFICATION_20261120.json) | 42 | 18 |
| [Drury après Passe](../../audits/QPJB_V1_FINAL_DRURY_40_PRECLASSIFICATION_20261120.json) | 40 | 13 |
| [Michaëls précisés](../../audits/QPJB_V1_FINAL_MICHAELS_40_PRECLASSIFICATION_20261120.json) | 40 | 13 |
| [Roudi](../../audits/QPJB_V1_FINAL_ROUDI_38_PRECLASSIFICATION_20261120.json) | 38 | 12 |
| [Multi-Landy](../../audits/QPJB_V1_FINAL_MULTILANDY_31_PRECLASSIFICATION_20261120.json) | 31 | 17 |
| [Ouverture forte isolée](../../audits/QPJB_V1_FINAL_OUV_1_PRECLASSIFICATION_20261120.json) | 1 | 1 |
| [Après Spoutnik isolé](../../audits/QPJB_V1_FINAL_APRES_INTER_1_PRECLASSIFICATION_20261120.json) | 1 | 1 |
| **Total** | **193** | **75** |

Chaque groupe garde la liste des ID exacts ; chaque fiche conserve les éléments source, sa compétence **proposée** et ses alertes. Une catégorie d'un seul QCM n'est pas une preuve suffisante de maîtrise. Les variations de même famille source sont signalées pour éviter les répétitions artificielles.

## Contre-expertises prioritaires

### Ouvertures fortes — 42 QCM

Séparer `2♣` fort indéterminé, `2♦` forcing de manche et leurs développements respectifs. Les réponses au `2♦` FM codent zéro/un/deux As et l'exception des deux Rois ; elles ne peuvent pas être évaluées uniquement en H. Les conséquences de `2♣–2♦–2SA` (super 2SA, Stayman, quantitatif), les Splinters et les propositions de chelem sont des objectifs distincts. Examiner les seuils H, HL, les levées de jeu et les alternatives, notamment `SEF-L27-003` sur le refus d'une ouverture forte.

### Drury — 40 QCM

Bien différencier le soutien simple après Passe, le `2♣` Drury **fitté**, le `2SA` fitté après Passe, les redemandes de l'ouvreur et l'annonce d'une courte. Le **nombre d'atouts, les HLD, la position et le Passe initial** changent le sens du soutien. Le cas `SEF-L01-F-02` relève de la sécurité distributionnelle théorique, à ne pas assimiler automatiquement à un contrat tactiquement optimal.

### Michaëls précisés — 40 QCM

Séparer cue-bid de la mineure (deux majeures), cue-bid de la majeure (majeure opposée et mineure), `2SA` des deux mineures et variantes à `3♣`, puis les réponses et la compétition ultérieure. Les treize cas `SEF-V478-001..013` demandent une revue spécifique des **fits, des paliers et de la vulnérabilité**. `SEF-L13-012` est transversal : cue-bid après soutien adverse, pas forcément même compétence que tous les Michaels d'ouverture.

### Roudi — 38 QCM

Distinguer le relais `2♣` du répondant après la redemande `1SA`, la répétition faible de sa majeure, et les trois réponses codées du partenaire : `2♦` sans fit, `2♥` fit minimum, `2♠` fit maximum. Les suites à `2SA`, `3SA`, `3M`, `4M` et les cas de seconde majeure doivent être isolés.

**Réserve explicite sur `SEF-L10-030`** : la justification d'origine parle de répétition faible à six cartes alors que le corrigé est `2♣`, classé à titre provisoire comme déclenchement du Roudi. Il faut examiner la main et la logique initiale avant d'homologuer cette attribution ; le corrigé d'origine n'est pas modifié.

### Multi-Landy — 31 QCM

Le Multi-Landy est un **accord conventionnel extérieur au SEF de base** ; le fait qu'un QCM ait un ID préfixé `SEF-` ne rend pas l'accord universel. Distinguer `2♣` pour les deux majeures, `2♦` majeure indéterminée, `2♥/2♠` majeure-mineure, `2SA` deux mineures, ainsi que les réponses et suites (passe/corrige, relais `2SA`, manche). Les seize exercices `SEF-V479-001..016` sont une série de développements proches ; ne pas les comptabiliser comme seize preuves indépendantes.

### Deux thèmes isolés

- `SEF-V44-002` : ouverture `2♣` forte avec 22 H réguliers ; recoupe la famille des ouvertures fortes. Le thème source `ouv` n'est pas changé.
- `SEF-L28-002` : saut à `4♥` après Contre Spoutnik. Compétence transversale après intervention adverse ; le thème source `apres_inter` n'est pas changé.

## Couverture totale des registres, sans homologation

| Source / étape | QCM |
| --- | ---: |
| Repères de contexte heuristiques déjà présents dans V1 | 903 |
| Propositions historiques SA / Stayman-Texas | 79 |
| Propositions « Après fit » | 48 |
| Propositions Barrages et Chelems | 130 |
| Propositions Interventions, Forcing, Rubensohl | 170 |
| **Dernières propositions de cette PR** | **193** |
| **Total de questions avec repère ou proposition** | **1 523** |
| Reste *sans proposition* | **0** |

**Cette égalité est uniquement comptable.** Elle ne démontre ni la justesse des corrigés ni la compétence effectivement acquise par un élève. Les **620 micro-classifications proposées** ne sont pas homologuées ; les **903 repères V1** sont heuristiques. Les décisions déjà approuvées sur certaines questions restent valables dans leur périmètre, sans devenir une homologation globale de ces nouvelles étiquettes.

La commande `node scripts/verify-v1-193-final-preclassification.cjs` compare les 193 originaux et les 348 précédemment proposés aux **541 IDs source**, contrôle les 13 cartes, points H, formes, choix, bonne réponse, absence de doublons et couverture 1 523. Elle échoue dès qu'un snapshot original est altéré ou qu'un ID disparaît.

## Étape suivante : homologation et simulations V1

1. Examiner le sens exact de chaque nouvelle étiquette sur les questions sources et les alternatives recevables, avec justification SEF ou accord conventionnel explicite.
2. Prioriser les réserves déjà identifiées : sept soutiens simples à 5 H sans courte, doubles transferts V1/V2, 5SA quantitatif/Blackwood, `SEF-L10-030`, suites de forcing, réponses au 2SA faible, et les dépendances de vulnérabilité.
3. Retenir seulement les regroupements pédagogiquement indépendants, sans inventer d'exercice ; documenter `CONFIRMÉ`, `À_CORRIGER` ou `AMBIGU` par ID.
4. Simuler le comportement réel du moteur V1 sur des profils d'élèves différents **avant** toute activation, sans écraser les historiques `qpjb-sef-parcours-01`, sans toucher aux diagnostics de tirage introduits par la PR #231.
5. Préserver le Quiz SEF classique, Entraînement et la V2 archivée.

**Aucune nouvelle règle de sélection, aucune réponse, aucun fichier du Quiz élève ou sauvegarde n'est modifié dans cette PR.**

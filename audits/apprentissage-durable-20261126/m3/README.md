# M3 — maîtrise et mémorisation durable (#399)

Base immuable : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. Contrat #396. Branche exclusivement M3. Module autonome : `quizz-durable-m3-maitrise.js` (blob 4a906cb66a025c422f9054aef7b00bbe74e36378). Aucun changement du moteur, du catalogue, de la progression, du stockage ou de l'interface existants.

## Cartographie initiale et décisions

Les données réelles de #395 donnent 1 915 exercices, 99 concepts et 1 556 familles distinctes. Les 99 concepts ont au moins trois familles. Le registre JSON énumère chaque concept, ses IDs, ses familles et ses références de paire. Les 59 paires historiques ont été vérifiées structurellement : 18 discriminations, 18 transferts proposés, 23 réinvestissements de remédiation. Ces derniers ne sont pas requalifiés en transferts. Aucune nouvelle décision éditoriale SEF n'est introduite. Les références #377–395, #293, #367–368, #271 et #364 et les documents de référence consultés éclairent la continuité ; ce travail n'est pas une nouvelle relecture éditoriale exhaustive des archives ou des corrigés.

### Champs réellement disponibles

| Source | Signification et traitement M3 |
|---|---|
| journal[].mode | parcours = évaluation ; consolidation = entraînement séparé, exposition et pratique seulement |
| journal[].session | indice humain à partir de 1 ; consolidation ne fait pas progresser completed |
| journal[].recordedAt | fin de séance au format ISO UTC, pas heure de réponse. Intervalle entre fins de séances uniquement |
| journal[].answers | id, résultat, choix, assisted, hadFreeError, famille, métadonnées ; comparaison aux IDs/familles/réponses de référence |
| entries[id].assessment | dernier résumé ; exposition possible, aucune reconstruction d'une tentative |
| entries[id].result, assisted, streak, seen, due | agrégats historiques, parfois issus de consolidation ; pas de preuves autonomes reconstituées |
| active.createdAt | compteur de séances, pas une date ; active non terminée exclue |
| quizQuestionHistory | historique de quiz borné par ID (12), mélange quiz libre et parcours ; aucune jointure temporelle présumée |
| exportedAt, difficultyFeedback, lastConsolidation | dates ou résumés d'autres événements, pas des réponses ; inutilisés comme horodatage de preuve |

Le chargement historique ne conserve que les 1 000 derniers événements et normalise certains indicateurs en booléens ; une absence de champ déjà normalisée en false par V1 ne peut plus être détectée. M3 borne également le journal brut à 1 000 événements et signale la troncature possible, les sessions détaillées manquantes, les incohérences, les duplications et le retour d'horloge. Les exports sont lus via algorithmState, avec format, version, clé de stockage et compteur vérifiés. Aucune écriture ni migration.

## Modèle de preuve

- Exposition distincte de première réussite autonome (choix correct et deux drapeaux explicitement false), diversité des familles et des sessions, et disponibilité de preuves en temps différé.
- Une séance contenant une réponse faible ou ambiguë sur un concept ne sert pas à promouvoir ce concept. Une erreur, réponse assistée/corrigée ou saut après erreur rend fragile. Deux familles et deux séances propres ultérieures permettent d'observer une récupération ; la famille faible non retestée reste signalée. Une absence n'est pas une erreur. Les preuves historiques ne sont pas supprimées par une difficulté ultérieure.
- La répétition d'une famille est mesurée séparément. La rétention généralisée candidate exige deux familles et deux séances. Dates absentes, non canoniques, futures ou retour d'horloge : pas d'intervalle inventé. Un intervalle entre fins de séances est un proxy, pas une mesure de la durée entre réponses ni une preuve psychologique de mémoire.
- Discrimination : deux membres distincts dans des séances distinctes, dans l'un ou l'autre ordre. Transfert/réinvestissement : A puis B, distincts. États historiques et actuels séparés ; une paire non disponible ou non justifiée s'abstient. Le statut observed_candidate n'est jamais une certification.
- Toujours mastery=not_established ; aucune probabilité de réussite future inventée.

## Rappels et calibration initiale

| Niveau de preuve | Jours | Séances |
|---|---:|---:|
| Fragile ou sans autonomie | 1 | 1 |
| Autonomie isolée | 3 | 3 |
| Diversité familles/séances | 7 | 6 |
| 3 familles / 3 séances et intervalle >=7 j | 14 | 12 |
| 3 familles / 3 séances et intervalle >=30 j | 30 | 24 |

Échéance si l'un des deux axes disponibles atteint le seuil. Date inconnue : axe séance seulement si disponible. Retard plafonné à 30 jours dans le bonus ; pas de perte de niveau par simple absence. Consolidation et saut sans erreur ne repoussent pas l'échéance existante. Les seuils sont des hypothèses déterministes et auditables, non une calibration empirique de l'élève.

## Recette exécutée et bilan avant/après

Le runner `node tests/durable-m3-maitrise.cjs` est livré. Il lit les sources de comparaison par git show au SHA figé (un clone superficiel doit disposer de ce commit), et le module M3 dans le checkout. L'exécution effectuée ici est le corps intégral de ce runner dans V8, avec les blobs GitHub exacts, adaptateurs git/fs/vm et mode CommonJS/window simulé. **49 877 assertions réussies**, 99 concepts et 1 915 IDs réels, 59 paires historiques, 693 vérifications sur oracle sans erreur. Aucune exécution Node native ou Chromium/WebKit revendiquée.

| Mesure construite (99 concepts) | Base | M3 |
|---|---:|---:|
| Sessions espacées dans un intervalle inférieur à 24 h | 99 indicateurs spaced (en séances) | 0 rétention >=24 h |
| Après 90 jours sans séance nouvelle | 0 échéances exactes initiales | 99 échéances conceptuelles |
| Dates absentes | pas de mesure calendaire | 99 inconnues |
| Rétention candidate sur intervalle long | non mesurée en jours | 99/99 |
| Autonomie dégradée après oubli simulé | — | 99/99 fragiles |
| Aide exclue de la preuve autonome | — | 99/99 |

La base ne prétend pas mesurer des jours avec spaced : la première ligne compare précisément deux granularités différentes. Les 693 vérifications sont des attentes construites et non des mesures auprès d'élèves.

18 historiques synthétiques : 6 profils (groupé, quotidien, hebdomadaire, oubli, assistance, reprise), graines 11/47/103, 180 événements par profil-graine (168 évaluations, 12 consolidations), 32 400 réponses au total dont 30 240 d'évaluation. Les appels réels record/finish/load/export/import sont exécutés. Les decks synthétiques reposent sur des IDs/familles réels, mais ne sont pas des trajectoires issues du tirage réel : aucune conformité globale de la sélection n'en est inférée. 126 checkpoints aux événements 20/65/90/91/105/153/180 (pas les mêmes indices de séances à cause des consolidations).

| Profil à l'événement 180 | Concepts avec au moins un ID dû, base (3 graines) | Concepts dus M3 (3 graines) |
|---|---|---|
| Groupé | 99/99/99 | 24/22/23 |
| Quotidien | 99/99/99 | 0/0/0 |
| Hebdomadaire | 99/99/99 | 59/59/59 |
| Oubli | 99/99/99 | 0/2/0 |
| Assistance | 99/99/99 | 96/99/98 |
| Reprise | 99/99/99 | 0/2/0 |

Ces métriques comparent les échéances, pas les rappels effectivement servis : M3 n'efface aucun rappel exact de V1. Pour le profil oubli à l'événement 105, les 90/89/83 concepts fragiles sont tous dus par les deux méthodes, et récupèrent à la fin (0 fragile). Assistance finale : 95/97/97 concepts fragiles tous dus par les deux méthodes. Pour la graine 47, les concepts avec preuve multifamille passent de 3 à 2, par qualification plus conservatrice ; ce n'est pas une perte démontrée d'apprentissage.

Charge maximale : 1 000 événements / 20 000 réponses, 75 ms assess, 66 ms rankReview direct, 47 ms préparation et 6 ms pour dix appels de classement préparé dans cette exécution V8. 155 candidats avec bonus borné. Résultat détaillé d'environ 5,3 millions de caractères JSON à cette charge : ne pas le persister ni le recalculer à chaque candidat. Les temps sont indicatifs et dépendent de la machine. Données complètes par concept, graine et checkpoint dans resultats.json.

## Interface et intégration réservée au coordinateur

UMD/CommonJS, schema QPJB_DURABLE_MASTERY_V1. assess({history,exercises,nowMs,contrastPairs?,metadataById?}) retourne concepts, pairs, quality, calibration. Les 99 concepts restent présents même sans preuve. Les ajouts signés du coordinateur peuvent fournir metadataById, sans réinterpréter un ID historique. Une paire fournie exige critère, différence de contexte, evidence et concepts cohérents ; kind transfer doit être explicite. Le coordinateur valide ces données : ce n'est pas un visa éditorial automatique.

Pour le classement facultatif, préparer une seule fois après choix de l'heure injectée :
```js
const review = QPJBDurableMastery.prepareReview({history:state,exercises,nowMs});
const hints = review.rank({candidates,selected,category,forcedReason,priority});
```
rankReview accepte les mêmes champs directement. Le bonus est borné à 30, jamais une exclusion. Aucun bonus pour S1–3, une séance active, découverte/faiblesse, rappel explicite, priorité, ID/famille/concept déjà sélectionné. Ne l'ajouter qu'après les filtres existants d'éligibilité, prérequis, diversité et quotas ; ne jamais changer un rappel exact ni une priorité de rubrique. Recommandation de calibration (non appliquée) : réserver au plus un ou deux emplacements d'entretien déjà existants aux signaux temporels et comparer les profils de reprise/assistance en particulier. Les entrées sélectionnées du moteur sous forme {exercise,reason,kind} sont supportées. Une nouvelle séance ou un changement d'historique impose une nouvelle préparation. Aucun raccordement de production effectué dans M3.

## Proposition de stockage ultérieur (non appliquée)

Un journal versionné distinct, append-only, pourrait enregistrer attemptId/sessionId stables, sessionKind, concept/id/famille/catalogueVersion, presentedAt/answeredAt/completedAt, source d'horloge, epoch de redémarrage, résultat, firstGuess, choix, assisted et hadFreeError avec état inconnu explicite. Distinguer heure UTC de durée monotone locale, jamais réconcilier automatiquement deux horloges incohérentes. Dédupliquer par attemptId, conserver les métadonnées de qualité et les bornes de rétention. V1 reste lisible et inchangée : import en lecture seule, migration additive idempotente et réversible par le coordinateur, sans backfill temporel ni création de preuves à partir des agrégats. Les anciens journaux sans timestamps restent sans mesure du temps. Évaluer taille, quota navigateur et consentement avant tout changement. Ne pas stocker le résultat détaillé d'assess.

## Complément de reprise — sélecteur expérimental, validation croisée

Le paragraphe historique « Limites / clôture » ci-dessous précède les essais de sélection isolés. Le runner `tests/durable-m3-selector.cjs` a ensuite exécuté le sélecteur réel figé avec un raccordement **en mémoire uniquement**, sans modification de production. Les 12 comparaisons initiales (six profils, graine 47, deux stratégies) sont auditées dans `selector-review.json` : 60 516 assertions rapportées, 4 320 séances simulées. La reprise a exécuté six comparaisons calendaires supplémentaires de 180 séances par variante, soit 30 258 assertions réussies, 2 160 séances et 21 600 réponses simulées. Chaque profil calendaire a maintenant deux graines, et les six nouveaux fichiers sont conservés. Le contrôle transversal des 12 résultats calendaires a réussi 564 vérifications. Au total, 36 trajectoires de sélection, 6 480 séances et 90 774 assertions du runner de sélection (distinctes de la recette principale de maîtrise). Les variantes de référence sont répétées entre stratégies et ne sont pas indépendantes.

| Profil | Graine | Familles Δ | Rétention différée Δ | Fragiles Δ | Rappels dus servis Δ | Rappels fragiles servis Δ | Rappels explicites Δ | Lacunes >20 Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| grouped | 47 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| grouped | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| daily | 47 | 0 | 0 | 0 | -2 | 0 | 0 | -4 |
| daily | 103 | 0 | 0 | 0 | -2 | 0 | 0 | -4 |
| weekly | 47 | -12 | -2 | 2 | 27 | 5 | 0 | -2 |
| weekly | 11 | 3 | 3 | -3 | -75 | -62 | 0 | 6 |
| forgetting | 47 | 3 | 4 | -4 | 0 | -13 | -2 | 0 |
| forgetting | 103 | 8 | 3 | -2 | -1 | -5 | 0 | 2 |
| assisted | 47 | 4 | 0 | 1 | -20 | -28 | 1 | -12 |
| assisted | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| resumption | 47 | 0 | 2 | -2 | -8 | -2 | -6 | -4 |
| resumption | 103 | 0 | 0 | 0 | 0 | 2 | 9 | 0 |

Les écarts sont candidat moins référence. La politique calendaire peut améliorer certaines preuves différées, mais ne domine pas systématiquement : le nombre de rappels dus/fragiles servis ou les lacunes de concepts peuvent se dégrader, et le nombre d'occasions varie. La comparaison ne mesure pas l'apprentissage humain. Conserver le classement V1 par défaut ; module d'évaluation candidat à la revue du coordinateur, bonus large HOLD, bonus calendaire expérimental uniquement. Troisième graine par profil (complétée ci-dessous), validation native Node/Chromium/WebKit et recette intégrée restent à faire ; pas de changement de production. Exécution de cette reprise en V8, avec blobs figés et runner exact, pas d'exécution native revendiquée. Données et détails dans `selector-calendar-cross-seed.json`.

## Recette calendaire complète — trois graines par profil

La troisième passe a exécuté six comparaisons supplémentaires sur le sélecteur figé, soit **30 258 assertions réussies**, 2 160 séances et 21 600 réponses simulées supplémentaires. La matrice calendaire est désormais complète : six profils × trois graines (11, 47, 103), 18 comparaisons, 36 trajectoires, 6 480 séances, 90 774 assertions. Avec les six comparaisons de la politique large (graine 47), le total du runner sélecteur est de **24 comparaisons, 48 trajectoires, 8 640 séances, 86 400 réponses, 121 032 assertions**. Les trajectoires de référence peuvent se répéter entre politiques et le profil quotidien n'utilise pas la graine pour ses réponses.

Contrôle reproductible sur les 18 fichiers calendaires : `node tests/durable-m3-three-seeds.cjs` (corps exécuté en V8 : 1 099 vérifications réussies). Rapport complet : `selector-calendar-three-seeds.json`, comprenant différences absolues et taux de rappels servis sur occasions dues, sans division par zéro. Résultats finaux :

| Indicateur | Meilleur | Identique | Moins bon |
|---|---:|---:|---:|
| Concepts rencontrés | 0 | 18 | 0 |
| Familles distinctes | 6 | 11 | 1 |
| Preuves différées candidates | 5 | 12 | 1 |
| Fragilité (moins = mieux) | 5 | 11 | 2 |
| Rappels dus servis (nombre brut) | 3 | 7 | 8 |
| Rappels fragiles servis (nombre brut) | 3 | 8 | 7 |
| Rappels explicites servis (nombre brut) | 3 | 12 | 3 |
| Concepts non revus >20 séances (moins = mieux) | 7 | 7 | 4 |

Sur toutes les trajectoires calendaires, aucune séance courte, aucune duplication de famille/ID et aucune violation d'éligibilité détectées. Alerte explicite : profil assisté, graine 103, 98 concepts rencontrés sur 99 dans les deux variantes ; aucune perte de couverture attribuable au M3. La couverture du registre/module reste 99/99. Les écarts de nombres de rappels doivent être interprétés avec les dénominateurs et l'évolution des états ; la simulation ne mesure pas un gain causal de mémorisation.

**Décision finale de calibration : HOLD_DEFAULT.** Ne pas activer les bonus de sélection large ni calendaire par défaut ; intégrer le modèle d'état après recette coordinateur. Le troisième tirage calendaire est terminé. La politique large est maintenue HOLD ; la validation à trois graines est complétée dans la section suivante. Node v22.16.0 et Chromium sont installés dans le conteneur de reprise mais `git ls-remote https://github.com/CapGui13/QPJB.git HEAD` échoue avec résolution DNS indisponible : les sources lues via connecteur ne constituent pas un checkout natif. Aucun résultat de test natif Node, Chromium ou WebKit revendiqué. Aucun workflow commun modifié.

## Recette complète des deux politiques et transmission native

Cette section actualise les conclusions et les compteurs des passes précédentes. Les **36 comparaisons** (6 profils × 3 graines × 2 politiques) sont désormais réalisées sur le sélecteur figé : **72 trajectoires, 12 960 séances, 129 600 réponses et 181 548 assertions** du runner. Douze nouvelles comparaisons de classement large : 60 516 assertions, 4 320 séances et 43 200 réponses supplémentaires. Les références sont répétées entre politiques ; les réponses quotidiennes ne dépendent pas de la graine. Les métriques ne constituent pas des échantillons indépendants ni des preuves d'apprentissage humain.

`selector-broad-three-seeds.json` et `tests/durable-m3-broad-three-seeds.cjs` : 1 586 vérifications réussies en V8, parité de tous les indicateurs finaux non temporels des références large et calendaire sur les 18 couples profil/graine. Les données calendaires sont vérifiées séparément par `durable-m3-three-seeds.cjs`. Une reproduction supplémentaire de grouped/47/broad (5 043 assertions) confirme la compatibilité des archives historiques sans champ strategy avec le runner actuel ; les compteurs de la matrice n'incluent pas cette reproduction ni les contrôles ciblés.

| Indicateur | Large : mieux / égal / moins bien | Calendaire : mieux / égal / moins bien |
|---|---:|---:|
| Concepts rencontrés | 1 / 17 / 0 | 0 / 18 / 0 |
| Familles distinctes | 8 / 6 / 4 | 6 / 11 / 1 |
| Preuves différées candidates | 7 / 7 / 4 | 5 / 12 / 1 |
| Fragilité (moins = mieux) | 7 / 6 / 5 | 5 / 11 / 2 |
| Rappels dus servis (nombre brut) | 12 / 0 / 6 | 3 / 7 / 8 |
| Rappels fragiles servis (nombre brut) | 7 / 3 / 8 | 3 / 8 / 7 |
| Rappels explicites servis (nombre brut) | 6 / 8 / 4 | 3 / 12 / 3 |
| Lacunes >20 séances (moins = mieux) | 13 / 2 / 3 | 7 / 7 / 4 |

Sur les 36 comparaisons : aucune séance courte, duplication ID/famille ni violation d'éligibilité détectée par le runner. Les taux de rappels servis sur occasions dues figurent dans les deux rapports. **HOLD_DEFAULT** pour les deux bonus ; intégrer uniquement le modèle d'état après recette coordinateur. Ni suppression de rappels ni modification du classement de référence en production.

### Alerte de couverture identifiée

`selector-coverage-alert.json` et `tests/durable-m3-coverage-alert.cjs` : scénario assisté, graine 103. Le concept absent est `sa2.texas_mineur.reponse` (six QCM). Aux checkpoints jusqu'à S153 inclus, aucun de ces QCM n'est éligible ; à la fin de S180 les six le sont dans les quatre trajectoires. La référence et la politique calendaire n'ont présenté aucun QCM de ce concept ; le classement large en a présenté aux séances 173 et 179. Ces observations localisent une question de progression/éligibilité et de priorité à examiner par le coordinateur, sans prouver une cause de classement ni justifier l'activation générale du bonus. Deux comparaisons ciblées reproduites avec instrumentation en mémoire, 10 086 assertions, distinctes de la matrice principale. Aucun changement de production.

### Recette native autonome prête à lancer

Depuis un checkout de la PR contenant le commit figé, avec Node et Playwright (Chromium/WebKit installés) :

```bash
node tests/durable-m3-native.cjs
```

Le runner vérifie le commit de référence, lance la recette maîtrise, la politique calendaire, les contrôles d'archives, la reproduction de l'alerte de couverture, les 36 comparaisons natives (égalité des résultats archivés hors mesures de durée et normalisation du champ historique strategy), puis compare le résultat du module CommonJS avec le module UMD chargé dans Chromium et WebKit réels hors ligne, sur sept scénarios issus des 1 915 QCM. Il échoue si un contrôle échoue ; un résultat `PASS` n'est émis que si tout est exécuté. `--quick` et `--node-only` sont des recettes partielles, signalées `PARTIAL_PASS`. Si Playwright n'est pas résolu, installer en dehors du dépôt et utiliser `QPJB_PLAYWRIGHT_MODULE` pour indiquer le chemin absolu de son module (aucune dépendance de production ajoutée).

Les sept scénarios et les fonctions de vérification ont été exécutés en V8 sur les blobs figés ; le runner native complet et la comparaison dans de vrais navigateurs n'ont pas pu être exécutés ici. Node v22.16.0 et Chromium sont installés localement, mais `git ls-remote` échoue (DNS et connexion directe indisponibles), la récupération publique du blob brut échoue également, et les workflows de validation de la PR sont ignorés (seul Training smoke passe, hors périmètre M3). Aucun workflow commun modifié, aucun environnement externe facturable créé. Le coordinateur doit lancer la recette native sur un checkout réel puis raccorder le modèle, sans bonus par défaut.

## Limites / clôture

Tests natifs checkout impossible dans cet environnement (résolution DNS github.com indisponible). Le moteur comparatif a été réellement exécuté sur ses blobs, y compris les essais du sélecteur raccordé en mémoire (voir complément ci-dessus). L'intégration de production et la recette globale coordinateur restent à faire. Le registre est exhaustif par concept/ID et paire historique recensée, pas une nouvelle validation humaine de tous les corrigés ni de toutes les archives historiques. Aucune mesure causale d'apprentissage. Le code et les résultats sont livrés en PR brouillon, aucun merge ni publication.

MISSION DÉFINITIVEMENT TERMINÉE : NON — livraison fonctionnelle et recette V8 complète ; validation native et validation du raccordement restant non exécutées.

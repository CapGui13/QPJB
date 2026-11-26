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

Les écarts sont candidat moins référence. La politique calendaire peut améliorer certaines preuves différées, mais ne domine pas systématiquement : le nombre de rappels dus/fragiles servis ou les lacunes de concepts peuvent se dégrader, et le nombre d'occasions varie. La comparaison ne mesure pas l'apprentissage humain. Conserver le classement V1 par défaut ; module d'évaluation candidat à la revue du coordinateur, bonus large HOLD, bonus calendaire expérimental uniquement. Troisième graine par profil, validation native Node/Chromium/WebKit et recette intégrée restent à faire ; pas de changement de production. Exécution de cette reprise en V8, avec blobs figés et runner exact, pas d'exécution native revendiquée. Données et détails dans `selector-calendar-cross-seed.json`.

## Limites / clôture

Tests natifs checkout impossible dans cet environnement (résolution DNS github.com indisponible). Le moteur comparatif a été réellement exécuté sur ses blobs, y compris les essais du sélecteur raccordé en mémoire (voir complément ci-dessus). L'intégration de production et la recette globale coordinateur restent à faire. Le registre est exhaustif par concept/ID et paire historique recensée, pas une nouvelle validation humaine de tous les corrigés ni de toutes les archives historiques. Aucune mesure causale d'apprentissage. Le code et les résultats sont livrés en PR brouillon, aucun merge ni publication.

MISSION DÉFINITIVEMENT TERMINÉE : NON — livraison fonctionnelle et recette V8 complète ; validation native et validation du raccordement restant non exécutées.

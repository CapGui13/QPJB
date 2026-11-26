# M2 — Cohérence pédagogique intermédiaire (S21–65)

Contrat [#377](https://github.com/CapGui13/QPJB/issues/377), mission [#379](https://github.com/CapGui13/QPJB/issues/379).
Base immuable `2c6edd95c09a4e8073813f01bc976c31ed4649aa`.
Blobs: moteur `ab2fc0c14e7c13f6459266ae3e41f7d3a07488f3`, prérequis `d1d8ad465461df20eb26eb2e5a10746ad6b7b48a`, plan `a3a6d9b6a5c9ce5e797ab748f986e88694e4ce61`, HTML `436efea9efcbe9f2815ab9968a3bab06a26a6fc5`. Aucun changement de ces fichiers. Module `db44bf996b051d6c85c649487ecede91d59fa6f3`, banc `f42d86ad13a79950ba7d5bb325eb03c62ebaea46`, tests `de12673b5a39acdc2b06ef9ceb1c24a7bfdcd641`.

## Cartographie et choix pédagogiques

Catalogue réel 1 879 QCM, 22 rubriques, 99 concepts. Lecture de #293, #366–369, #365, #375, #376 et de leurs commentaires, moteur de base et table complète des prérequis. Première trajectoire autonome depuis S1, examen des séances 21–65 : la progression générale est valide, mais les priorités portent surtout sur les rubriques et les familles nouvelles. Une rubrique peut rester entretenue tout en oubliant ses concepts naturels (ex. redemande simple lorsque les redemandes compétitives deviennent dominantes). Exemples réellement constatés dans la trajectoire initiale : S23 comprend trois `roudi.init` et deux `roudi.choix` ; S33 trois `multilandy.intervention` ; S37 trois `michaels.intervention` ; S39 trois `michaels.reponse`. S40 introduit simultanément les contrôles, le quantitatif et le splinter. Ce ne sont pas des violations d'éligibilité ni des motifs de réécriture du catalogue.

Articulations examinées :
- Naturel : ouvertures, réponses mineures/majeures, fit, seuils SA, redemandes et deuxième enchère. Cas contrastés par concept, maintien des variantes naturelles simples avant et pendant les conventions.
- Roudi : redemande naturelle et deuxième enchère, choix/initiation puis réponse puis suite. Drury : position d'ouverture et soutien majeur, choix/initiation puis réponse/suite.
- Forcing : bicolores naturels et deuxième enchère avant troisième/quatrième couleur et leurs suites.
- Compétition : intervention naturelle, contre, réponse à l'intervention, réponse après intervention, barrage et réveil, puis Multi-Landy, Rubensohl et Michaels ; distinctions de rôle plutôt que mots-clés dans l'explication.
- SA et chelem : seuils, Stayman/Texas, leurs développements ; distinction quantitatif, contrôles et clés. Pas de date de maîtrise imposée. L'éligibilité existante reste l'unique barrière.

Objectif de travail : réduire substantiellement les retards de rappel (repère chiffré de recette : 25 % agrégé, seuil non préenregistré avant le tout premier replay), préserver >=95 % des familles à chaque horizon/trajectoire, zéro violation, 10 familles distinctes, 22 rubriques à S65, phase S1–20 inchangée et couverture des concepts au plus à -1 par horizon. Réduire les difficultés avancées sans preuves et ne pas augmenter significativement les découvertes de suites sans réussite autonome. Pas de quota de corrections.

## Production

`quizz-pedagogie-intermediaire.js` UMD (Node et fenêtre `QPJBPedagogieIntermediaire`), schema QPJB_PEDAGOGIE_V1, phase intermediaire. `rank(context)` renvoie des deltas bornés [-100,100] uniquement pour des IDs candidats, [] hors S21–65. Bonus de rappel par concept fondamental après 6 séances, consolidation d'une première découverte, petite préférence aux initiations simples ; malus souple aux suites nouvelles si des dépendances explicites n'ont aucune réussite autonome élémentaire, aux conventions nouvelles dont les liens naturels sont fragiles, et aux découvertes redondantes. Aucun malus n'est une interdiction : les élèves faibles peuvent toujours avancer. Une exposition d'une ancienne sauvegarde n'est jamais assimilée à une preuve ; les consolidations et les réponses assistées ne comptent pas comme preuves. Pas d'état persistant.

Pas de patch de prérequis : aucun cas individuel suffisamment démontré ici ne justifie de modifier le graphe ; le moteur interdit déjà les cas inéligibles. Les éventuels problèmes d'avant S21 sont à M1 ; l'ordre intra-séance et les miroirs à M4. Les difficultés sur les fondamentaux, dont la meilleure mineure, sont traitées comme entretien du concept, pas comme preuve d'un manque éditorial.

### Point de raccordement exact
Dans `select()` / `choose()`, après les filtres available, distinct, novelFamily, repeatBudget et balanced, juste avant le calcul de `ranked` : appeler rank avec session=s+1, candidates, metadataById=prerequis.byId, history=state, selected (wrappers {exercise,kind,reason}), category. Additionner les deltas par ID à score(q,category) avant tri. **Ne pas appeler** le module si forcedReason==='rappel_erreur_aide'. Aucun changement de filtre, de sélection forcée ou de logicalOrder. L'adaptateur bench.cjs effectue exactement cette injection sur une copie en mémoire et vérifie que le marqueur est unique, puis observe l'éligibilité effective avant le retour de select. Le coordinateur seul branche le module en production.

## Recette comparative effectuée

15 paires de trajectoires, 5 profils x graines 11/47/103, chaque trajectoire depuis S1 jusqu'à S153. 30 trajectoires, 45 900 présentations simulées. Les réponses sont déterministes par profil/graine/ID/séance, indépendantes de la position de la question. Les profils et seuils de simulation sont dans bench.cjs ; il ne s'agit pas de données élèves. Les fichiers JSON contiennent chaque trajectoire, les trois horizons, les frontières S20/21 et S65/66, les délais par concept et les motifs. Toutes les valeurs suivantes sont calculées sur ces fichiers.

| Profil (3 graines) | Retards base → M2 | Premières suites sans preuve base → M2 | Difficulté 4–5 base → M2 |
|---|---:|---:|---:|
| Autonome | 1560 → 900 | 0 → 0 | 510 → 438 |
| Intermédiaire | 1334 → 638 | 16 → 17 | 82 → 53 |
| Faible | 1152 → 674 | 51 → 52 | 0 → 0 |
| Faiblesse ciblée compétition | 1430 → 700 | 11 → 9 | 161 → 111 |
| Aide fréquente | 1135 → 620 | 51 → 52 | 0 → 0 |
| **Total** | **6611 → 3532 (-46,6 %)** | **129 → 130** | **753 → 602** |

Retard = une unité pour chaque paire (séance S21–65, concept fondamental déjà exposé et encore éligible) dont le dernier rappel remonte à plus de huit séances au début de la séance. Un même concept peut donc contribuer plusieurs unités ; ce ne sont ni des personnes ni des questions. Preuve = au moins une réponse correcte sans aide/erreur libre de difficulté <=3 dans une séance antérieure ; ni cette mesure ni le nombre de concepts avec preuve ne constituent une certification de maîtrise. Première suite = première exposition au concept de stage >=2, absence de preuve sur au moins une dépendance explicite non réflexive. Les deux mesures ne sont pas équivalentes. Les sauts locaux N4/5 sans preuve élémentaire du concept passent de 20 à 11 (un prérequis légitime peut toutefois être une autre notion).

Autres résultats : 0 violation d'éligibilité, 0 séance courte, 0 famille répétée dans une même séance dans les 30 trajectoires ; S20 et son deck identiques ; module actif uniquement S21–65 ; 22 rubriques à S65 pour tous ; 99 concepts à S153 pour tous ; ratio minimal de familles cumulées 99,04 % sur les 45 couples trajectoire/horizon. Découvertes nouvelles en phase 753→754 ; familles distinctes en phase (somme des trajectoires) 6137→6116 ; concepts distincts en phase 1396→1365 ; écarts de couverture cumulée à S65 au pire -1 concept, à S153 zéro. Temps total V8 238589→240846 ms (+0,95 %, indicatif, non benchmark navigateur). Indicateurs simples de réponses identiques ou miroir même thème : 0→0 dans ce banc, ne remplacent pas la recette sémantique M4.

## Compromis et limites

Le gain le plus solide est l'entretien des fondamentaux ; pas d'amélioration démontrée du taux de premières suites sans preuve autonome (129→130). La baisse des niveaux élevés chez les autonomes peut être utile pour l'entretien mais ne doit pas être interprétée comme meilleure maîtrise. Quelques trajectoires ont moins de concepts avec une preuve élémentaire : intermédiaire graine 11 à S65 92→87, aide graine 47 à S65 63→57, faible graine 103 à S153 72→66. D'autres progressent ; pas de gain universel de maîtrise. Certains trous restent longs, p.ex. maximum observé entre expositions sa2.stayman.reponse 54→53 et ouv.sa2 47→51. L'indicateur agrégé ne garantit pas chaque concept. Le passage S66 ne réinitialise rien : la sélection redevient neutre, historique conservé. Ne pas augmenter les bonus sans recette globale. Aucun blocage artificiel ni hard gate supplémentaire. Le coordinateur devra vérifier ce compromis avec les modules M1/M3/M4 et les exports réels ; si la preuve autonome est dégradée après intégration, garder la base ou réduire les bonus.

## Tests et reproduction

Exécuté réellement : chargement des blobs exacts par API GitHub dans V8, compilation CommonJS en mémoire via new Function, `bench.compare({engine,pre,plan},cat,policy,profile,seed,153)` pour chaque profil/graine, puis `test.unit(policy)`, `test.acceptance(rows)`, `test.active(bench,blobs,cat,policy)` : succès (12 groupes unitaires, 15 paires acceptées, 4 contrôles de reprise). Test de reprise active S21 et compatibilité avec moteur de base. Les JSON sont les résultats effectivement obtenus, pas des valeurs attendues inventées.

Commandes de reproduction **non exécutées dans un checkout Node** dans cette instance :
```sh
node tests/coherence-progression-m2-policy.cjs
node audits/coherence-progression-20261126/m2/bench.cjs autonome 11
node audits/coherence-progression-20261126/m2/bench.cjs > m2-replay.json
```
Exécuter sur branche à base figée ; l'adaptateur refuse un marqueur divergent. Le banc n'est pas le navigateur/CI FULL et n'exécute pas la totalité des tests historiques : ces validations restent au coordinateur, conformément au contrat. Le profil Passe dédié facultatif n'a pas été ajouté ; les cinq profils obligatoires sont couverts. Aucune fusion ni publication. Le candidat est livré pour arbitrage ; l'issue reste ouverte pour intégration.

**MISSION DÉFINITIVEMENT TERMINÉE : OUI (périmètre M2 autonome, intégration exclue).**

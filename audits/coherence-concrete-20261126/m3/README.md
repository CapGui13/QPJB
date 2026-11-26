# M3 — prérequis et transitions entre concepts

Références : #419, #422. Base figée `2d336054bc91fbd6ac762c093ecb5ec6da9f97e8`. PR brouillon #436. Aucun fichier historique, workflow, accord SEF, réponse, stockage ni catalogue modifié. Les patchs sont expérimentaux, uniquement injectés dans une copie en mémoire du catalogue de métadonnées par le banc. Le coordinateur décide seul du visa et du raccordement.

## Décision de livraison

- Candidat Texas : six ID de mains 10–12 H, stage 0 → 1, ajout d'une exposition préalable au concept sa1.texas. Le seuil d'accès historique reste intact, ainsi que l'autonomie exigée pour les niveaux avancés. L'exposition n'est pas assimilée à la réussite. Le but est de rencontrer d'abord le transfert élémentaire sur main faible, puis de le réinvestir avec un projet de manche.
- Huit reclassements red.bicolore → red.base : HOLD. Une majeure quatrième sur main régulière n'atteste pas nécessairement une vraie distribution 5–4, mais le mécanisme de changement de couleur est commun ; les 18 trajectoires courtes rencontrent déjà un vrai bicolore à S6. Aucun gain net démontré.
- Texas : gain concret de progression, mais **visa en attente**. Ne pas activer automatiquement : les métriques individuelles, le délai de la variante forte et les protections de rappel doivent être arbitrés.

## Résultats effectivement exécutés

V8, blobs de la base réelle via GitHub. Pas de checkout Node natif ni de navigateur : DNS GitHub indisponible dans le terminal. Le banc S1–20 utilise le moteur et les trois modules pédagogiques figés (module durable non chargé car jamais appelé avant S21). Les trois campagnes S180 chargent les 19 blobs exacts, dont toutes les dépendances durables, et exécutent le sélecteur réel ; injection limitée à la table de métadonnées candidate et à une méthode d'observation de l'éligibilité. Les réponses sont synthétiques, déterministes, appariées par ID/séance/graine.

- S1–20 : 54 trajectoires (18 référence, 18 Texas, 18 red), 1 080 séances, 10 800 sélections ; variante exploratoire Texas stage 0 : 18 trajectoires supplémentaires.
- S1–180 : 36 trajectoires, 18 paires (6 profils × 3 graines), 6 480 séances, 64 800 sélections. Parité parfaite des traces S1–20 avec le banc court. Toutes les sélections passent le prédicat d'éligibilité de leur propre moteur ; aucun doublon de famille, ni séance courte, ni dépassement du Passe initial vérifié. S1–3 identiques sur les 18 paires.
- 3 829 assertions unitaires et 164 assertions d'éligibilité/récupération/reprise ; les deux suites et le banc S1–5 final ont été rejoués à partir des fichiers committés dans V8.
- Le test d'éligibilité montre les six variantes fortes autorisées par la base à S5 et refusées par le candidat. Elles deviennent de nouveau éligibles à S6 après exposition réelle au Texas élémentaire, y compris si l'élève a répondu faux, avec aide, après correction libre, ou passé la question. Ces cas ne créent aucune preuve autonome. Une séance commencée sur l'ancienne version conserve exactement son état et ses IDs.

| Indicateur, 18 trajectoires par bras | Base | Texas |
|---|---:|---:|
| Première rencontre du Texas : main forte en tête | 15 | 0 |
| Texas fort présent dans la séance de découverte S5 | 18 | 0 |
| Première rencontre du Texas | S5 pour 18/18 | S5 pour 18/18 |
| Première rencontre forte, intervalle | S5 | S6–31 |
| Somme concepts distincts à S20 | 865 | 864 |
| Somme concepts distincts à S65 | 1752 | 1754 |
| Somme concepts distincts à S153/S180 | 1782 | 1782 |
| Somme familles distinctes à S180 | 25703 | 25731 |
| Répétitions de famille à 1–3 séances | 162 | 152 |
| Répétitions d'ID à S180 | 4938 | 4940 |
| Questions N4/N5 | 6768 | 6798 |
| Erreurs synthétiques à S180 | 9279 | 9402 |

Exemple S5, profil faible / 47 : SEF-N084-1 (11 H, 5 Cœurs, réponse 2♦, projet de manche) est remplacé par SEF-037-1 (4 H, 5 Cœurs, réponse 2♦, partielle). Les neuf autres IDs sont conservés ; l'ordonnancement est recalculé par le moteur historique. Le profil autonome / 47 remplace son deuxième Texas, fort, par SEF-036-1 (Stayman), et conserve le Texas élémentaire.

Écarts à ne pas masquer : l'intermédiaire/47 ne revoit la variante forte qu'en S31 ; aide/11 perd 10 familles distinctes à S180 ; faible/103 perd deux concepts à S65 (rattrapés à S153). Les erreurs synthétiques augmentent de 123 au total (les réponses sont tirées de l'ID et de la séance, donc une variation de séquence change les tirages, et ne démontre ni progrès ni régression humaine). Le Texas mineur sur 2SA reste parfois tardif : aide/47 S55 → S104 ; faible/11 S104 → S108. Ne pas supprimer les protections de preuve pour accélérer ces questions N4. La variante sans changement de stage a donné les mêmes délais de première rencontre forte dans le banc court ; elle ne résout pas le cas intermédiaire/47.

## Graphe et registre

- 1 915 IDs, 99 concepts, 317 arcs (source, cible, seuil distinct), 102 auto-arcs sur 66 concepts, 6 composantes cycliques inter-concepts, aucune référence inconnue.
- Les six composantes ont des entrées hors cycle. Les 15 arcs inter-concepts internes à ces cycles ont un motif ciblé, des exemples et la disposition de maintien. Les autres arcs disposent de leur provenance exacte, exemples et disposition prudente, mais pas d'un visa individuel exhaustif.
- Les 1 915 IDs sont accessibles dans un calcul **structurel optimiste d'exposition** (avant et après, y compris les deux variantes cumulées). Ce calcul ne simule ni les quotas ni les réussites autonomes des niveaux avancés ; la matrice réelle complète la vérification.
- Le registre distingue les 14 propositions individuelles (6 candidates + 8 HOLD), les 7 visas historiques de fit 5–3 préservés et l'inventaire structurel des autres IDs. Les dépendances larges non revues individuellement restent explicitement non certifiées. Ne pas présenter la cartographie mécanique comme une revue SEF individuelle des 1 915 mains.

## Fichiers et exécution

- `quizz-coherence-m3-prerequis.js` : UMD/CommonJS, rules(ctx) consultatif, patches(metadataById, exercises), graph, reachability et applyExperimental. Aucun effet de bord ; le helper expérimental ne doit pas être raccordé à la production.
- `registry.json` : métadonnées effectives, patchs old/new/preuve/accord, cycles, calcul d'accessibilité, résultat unitaire.
- `arc-review-and-coverage.json` : 317 dispositions, exemples exacts, six cycles et dates de première sélection des 99 concepts par trajectoire.
- `benchmark-s20.json`, `benchmark-texas-stage0-s20.json` : traces réelles et raisons de sélection sur banc court.
- `benchmark-s180-pilot.json`, `benchmark-s180-seed11.json`, `benchmark-s180-seed103.json` : traces ordonnées d'IDs jusqu'à S180 sur moteur à dépendances intégrales. Les checkpoints figurent dans chaque trajectoire ; les mains et réponses sont celles du catalogue figé.
- `summary-s180.json` : contrôles croisés, agrégats, écarts individuels, premières rencontres par concept.
- `early-sessions-detailed.json`, `fiches-s1-s5.md` : 1 800 positions appariées, dictionnaire de 82 questions exactes, raisons historiques du moteur. L'ordre des questions relève de M2 ; le rôle est calculé à partir de l'exposition historique.
- `eligibility-results.json` : motifs du prédicat réel, cinq cas de récupération, reprise.
- Depuis un clone complet du dépôt contenant le SHA de base : `node tests/coherence-concrete-m3-unit.cjs`, `node tests/coherence-concrete-m3-eligibility.cjs`, `node tests/coherence-concrete-m3-benchmark.cjs 180 none,texas 11,47,103`. Pour red : `node tests/coherence-concrete-m3-benchmark.cjs 20 none,red 11,47,103`.

## Reprise après interruption — nouvelles preuves

- Relecture ciblée des 22 arcs de première accessibilité structurelle S1–5, 558 occurrences d'IDs sur ces arcs (pas 558 questions distinctes). `early-arc-review.json` donne un motif propre à chaque arc, avec exemples exacts ; aucune prétention à un visa exhaustif par ID.
- Redemandes : 72 QCM `red.base` imposent les deux concepts mineur.base et majeur.base, y compris si l'ouverture n'appartient qu'à un seul contexte. 67 modifications exploratoires sur niveaux 1–3, cinq niveaux avancés laissés inchangés. Nouveau banc `node tests/coherence-concrete-m3-red-context.cjs` : 18 paires (six profils, trois graines), S1–10, 360 séances / 3600 sélections, zéro séance modifiée. Les 72 lignes et les comparaisons sont dans `red-context-s10.json`. HOLD intégral ; aucun gain concret mesuré et aucun patch ajouté à la liste activable.
- `rules(ctx)` distingue désormais les exigences d'exposition et les preuves inférieures indépendantes : famille native `caseFamily`, seuil N4/N5 de deux/trois séances, nombre de familles plafonné au nombre disponible, fondation de niveau inférieur, exclusion des réponses aidées et du niveau égal/supérieur. Cette sortie est consultative et n'est pas le prédicat complet d'éligibilité. `node tests/coherence-concrete-m3-advisory-parity.cjs` compare le moteur figé et l'avis M3 aux S1/5/10/20, six profils et graine 47, référence et candidat Texas. 48 états, 91 920 comparaisons d'exposition, 47 376 comparaisons portant aussi sur les fondations/preuves, zéro divergence sur les motifs testés. Résultat dans `advisory-parity.json`.
- Suites unitaires et d'éligibilité relues depuis les blobs committés et rejouées en V8 : 3836 et 164 assertions réussies ; cinq récupérations testées. La correction est dans l'avis seulement, pas dans la sélection.
- La contrainte Texas reste une exposition au concept, non un visa par ID d'une variante faible pour les anciennes sauvegardes. Une ancienne exposition à une main forte peut donc satisfaire ce prérequis. Le délai S31 relève aussi de la sélection après éligibilité ; ne pas corriger hors périmètre M3. Le coordinateur doit arbitrer ce point et les métriques par profil avant toute activation.
- Relecture des protections #385/#395/#409 : les seuils de dette et les preuves distinctes doivent être vérifiés au niveau intégré, sans abaisser les garde-fous et sans créditer les HOLD. Le contrat #419 mentionne en plus une alerte M2 indépendante sur la sensibilité de record() à l'ordre. Aucune intervention sur ces fichiers hors périmètre.
- Le terminal ne peut toujours pas résoudre github.com ; tests V8 réels sur blobs, pas de prétention à une recette Node native ou navigateur. Les workflows de recette intégrée ne sont pas automatiquement exécutés sur cette branche. Les limites précédentes restent applicables.

## Garde-fous historiques sur les 18 paires S180

Recalcul exécuté des critères historiques #385 à partir des 36 traces archivées, avec les réponses déterministes d'origine. Les contraintes S1–3 et Passe ultérieur sont respectées sur les 36 trajectoires. Une alerte de couverture des preuves autonomes pour faible/103 à S65 : 43→38 (seuil historique max(3,10%) dépassé). Aucune alerte de dette fondamentale sur ces seuils, mais des écarts individuels persistent. Candidat Texas maintenu en HOLD, ne pas activer. Voir `historical-metrics-s180.json` et `tests/coherence-concrete-m3-historical-metrics.cjs`. Recalcul partiel #385 : ne couvre pas motifs miroirs, éligibilité réelle, reprise, latence, ni modèle #409. L'essai longitudinal de la variante stage 0 a été interrompu par la limite d'appels ; aucun résultat nouveau revendiqué.

## Reprise suivante — variantes et justification S6–20

- Texas stage historique 0 avec le seul ajout d'exposition au concept : expérience V8 exécutée sur les 19 blobs exacts, faible/aide/intermediaire graine 103, 65 séances chacun. Les 195 séances (1950 sélections) sont strictement identiques au candidat stage 1 correspondant ; faible/103 conserve 38 concepts avec preuves autonomes à S65 contre 43 en base. Aucun correctif démontré. Rapport `texas-stage0-s65-seed103.json`, commande de reproduction `node tests/coherence-concrete-m3-texas-stage0.cjs` (wrapper CLI ajouté après l'exécution V8 équivalente, pas exécuté en Node natif). HOLD maintenu. Ne pas cibler uniquement SEF-N084-1 sous prétexte qu'il apparaît dans toutes les S5 de référence : cela ne garantirait pas l'introduction élémentaire pour d'autres trajectoires.
- Stayman sur 1SA : deux ID (SEF-V416-007 et SEF-PN26-M1-033) de réponse 2SA montrant les deux majeures quatrièmes ; l'ajout d'une exposition préalable à sa1.stayman.reponse a été testé en V8 sur 18 paires S1–20 (3600 sélections). Découverte en S8 inchangée, première réponse 2SA 1/18→0/18, mais 17/18 trajectoires modifiées ; toutes ces 17 S8 de référence contiennent déjà des réponses simples et 2SA. Somme des concepts distincts à S20 -4, cible/103 -4. La correction appropriée paraît être de conserver les IDs et de placer les réponses simples avant 2SA au sein de la séance, sous réserve de l'arbitrage M2/coordinateur sur la sensibilité de record() à l'ordre. Patch M3 HOLD et non intégré. Rapport `stayman-fourth-s20.json`, banc `node tests/coherence-concrete-m3-stayman-fourth.cjs`.
- Les 113 arcs d'accessibilité structurelle S6–20 ont un motif individuel d'arc et un exemple exact du catalogue dans `mid-arc-review.json`. Avec les 22 arcs précédents, 135/317 arcs ont maintenant une justification ciblée au niveau de l'arc. Aucun visa individuel exhaustif des IDs n'est revendiqué.
- Les deux Passe sur 2SA (SEF-C-005 et V2-M2-003) sont légitimement classés sa2.texas : avec 3 H et cinq cartes, le Texas expose à 3SA sans fit. Ne pas reclasser en Passe générique ; les corrigés distinguent la rectification fittée sur 2SA de la rectification normale sur 1SA.
- Les 18 traces de référence rencontrent la suite normale du Texas sur 1SA avant sa variante contrée ; aucune violation de cette chronologie observée. Le contre d'entame n'est pas le contre d'appel : dépendance générique à contre.base à conserver sans nouveau visa faute de bénéfice de retrait démontré.

## Longue passe — revue complète des arcs, décisions et garde-fous

- Les 182 arcs restants ont reçu une justification ciblée au niveau de l'arc, sur un exemple du catalogue. Total 317/317. Le registre consolidé `decision-register.json` est reconstruit et contrôlé par `tests/coherence-concrete-m3-register.cjs` : 1 915 IDs et 99 concepts, 114 IDs avec décision ciblée, 228 exemples d'arc, 7 visas historiques préservés, 1 566 IDs explicitement structurels seulement. Aucun visa individuel exhaustif ni réécriture du SEF n'est revendiqué. Ce registre supplante les statuts exploratoires du registre initial.
- Départage souple du Texas, après filtres réels, uniquement entre deux mains de même enchère et difficulté : 18 paires S20 par seuil (écart 0 puis 48). 15→0 premières découvertes fortes, mais le seuil 48 n'apporte rien de plus que l'égalité stricte. Les deux variantes reproduisent 15 trajectoires sur 18 du candidat à verrou, notamment faible/103. Pour les trois autonomes, une main faible précède une main de manche dans la même S5 ; le cas fort reste éligible. Ce n'est pas une solution à la régression longitudinale. `transition-advice-s20.json` et `tests/coherence-concrete-m3-transition-advice.cjs`. Adaptateur expérimental en mémoire, aucun raccordement de production.
- Variante à distribution identique, score exactement égal, main faible avec points H positifs : 18 trajectoires S20, découverte forte 15→3 (les trois autonomes ont également une main faible en S5, mais après la forte). Campagne S180 graine 103, six profils et 10 800 sélections, exécutée sur les 19 blobs exacts, parité parfaite des S1–20 avec le banc court. Faible/103 : preuve S65 43→43, mais dette fondamentale à S153 300→348 (au-delà du seuil historique de 15 %, soit 45), contre 300 en base. Aucun autre seuil de revue calculé dépassé sur ces six profils. Aucun garde-fou S1–3/Passe enfreint. Le candidat ne franchit pas la recette, HOLD. Les graines 11 et 47 ne sont pas déclarées testées à S180 pour cette variante. Voir `texas-matched-shape-s20.json`, `texas-matched-shape-s180-seed103.json`, `texas-matched-shape-guards-seed103.json` et banc correspondant.
- `patches()` marque désormais explicitement toutes les 14 propositions HOLD ; `applyExperimental()` sans groupe renvoie une copie inchangée. Aucun patch de production, aucun changement de réponse.
- `rules(ctx).transition` expose des sous-variantes observées sur Texas et réponses Stayman, les alternatives élémentaires présentes dans les candidats, et les éléments déjà sélectionnés dans la séance. Ces trois états ne sont jamais confondus : sélection n'est pas exposition passée, exposition n'est pas preuve. Aucun veto, aucun crédit, préserve les rappels explicites et les lacunes ; conserve la décision native si aucune alternative n'est disponible. Le module séparé de conseil de transition reste sans activation automatique.
- Tests rejoués après ces changements, en V8 sur sources exactes : 3 862 assertions unitaires, 164 d'éligibilité et 23 de conseil (4 049 au total), cinq scénarios de récupération ; comparaison des motifs d'exposition et de preuve au moteur réel sur 91 920 évaluations, dont 47 376 sur critères de fondation/preuve, zéro divergence. `final-advisory-tests.json`. Le terminal Node est présent mais DNS github.com indisponible : pas de recette native ni navigateur attestée. Les rapports d'expérimentation restent des simulations.
- Décision pour le coordinateur : ne pas activer les trois candidats Texas, ni le verrou Stayman, ni les reclassements/redemandes contextuels. Les données et conseils peuvent servir au raccordement M1/M2/M4, avec recette complète de l'ensemble, sans déplacer un rappel ou confondre preuve et exposition. La préférence pour une réponse simple avant 2SA au Stayman relève prioritairement de M2 (mêmes IDs lorsque les deux sont déjà dans S8), sous réserve de l'arbitrage de la sensibilité de record() à l'ordre. Voir `HANDOFF.md`.

## Restes et réserves

Le cahier des charges n'est pas entièrement rempli : revue pédagogique individuelle des dépendances résiduelles et exhaustivité des références historiques non attestées ; raisons de sélection détaillées disponibles jusqu'à S20 (IDs réels complets jusqu'à S180), pas de justification de position M2 ; métriques de dette, latence, rappel et protections #385/#395/#409 non toutes rejouées ; exécution Node natif/Chromium/WebKit non effectuée dans cette branche. L'intégration et la publication relèvent du coordinateur. Aucune fusion ni modification de main.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**

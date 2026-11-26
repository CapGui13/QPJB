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

Exemple S5, profil faible / 47 : SEF-N084-1 (11 H, 5 Cœurs, réponse 2♦, projet de manche) est remplacé par SEF-037-1 (6 H, 5 Cœurs, réponse 2♦, partielle). Les neuf autres IDs sont conservés ; l'ordonnancement est recalculé par le moteur historique. Le profil autonome / 47 remplace son deuxième Texas, fort, par SEF-036-1 (Stayman), et conserve le Texas élémentaire.

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

## Restes et réserves

Le cahier des charges n'est pas entièrement rempli : revue pédagogique individuelle des dépendances résiduelles et exhaustivité des références historiques non attestées ; raisons de sélection détaillées disponibles jusqu'à S20 (IDs réels complets jusqu'à S180), pas de justification de position M2 ; métriques de dette, latence, rappel et protections #385/#395/#409 non toutes rejouées ; exécution Node natif/Chromium/WebKit non effectuée dans cette branche. L'intégration et la publication relèvent du coordinateur. Aucune fusion ni modification de main.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**

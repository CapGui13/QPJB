# M4-B #447 — réactivation des fondamentaux, livraison expérimentale HOLD
Base commune : 49298ada3f96e347833d8717c7e205518ea02fce. Contrats #419, #423, #445, #447 ; PR mère #427 ; livraison brouillon #452 vers coherence-concrete/m4-diversite. Aucun candidat activé, moteur/catalogue/ordre final intact, aucune fusion. Décision : P à examiner **uniquement** pour le catalogue totalement saturé ; pas de solution générale validée.

## Diagnostic : mécanisme de la dette
Historique : A/B/C/C2 puis D/E/F/G/H/I/K. D/F/G ne baissent pas la dette ; H 228622→38653 / preuves 1520→1490 ; I 228622→76718 / preuves 1520→1512 ; K 228622→234613 / preuves 1520→1520 (12 régressions). G était incomplet ; les six logs manquants et les 18 paires de traces originales G sont désormais archivés et contrôlés. Les anciennes performances ne sont pas attribuées à B.
Le filtre unseen intervient avant le score, repeatBudget natif fort/moyen/faible 0/1/2, réservation fondamentale S21–65 seulement, extinction après S65. Les rappels explicites d'erreur, les priorités thématiques et les quotas se disputent 10 places. La faible réserve de familles ne peut pas être ressuscitée par une simple prime de score. Une famille partagée par plusieurs concepts peut être globalement consommée sans exposition du concept concerné.
Catalogue réel 1915 QCM, 99 concepts, 1556 familles. Neuf fondamentaux, dette de référence cumulée sur 18 trajectoires, écart maximal incluant terminal :

| Concept | QCM | Familles (partagées) | Familles élémentaires | Dette S180 | Écart max |
|---|---:|---:|---:|---:|---:|
| ouv.passe | 14 | 9 (0) | 9 | 43170 | 116 |
| ouv.mineure | 39 | 29 (4) | 29 | 17577 | 117 |
| ouv.majeure | 19 | 11 (1) | 10 | 47939 | 117 |
| ouv.sa1 | 15 | 9 (3) | 9 | 55311 | 124 |
| mineur.base | 96 | 64 (4) | 63 | 310 | 17 |
| majeur.base | 63 | 42 (1) | 42 | 2308 | 24 |
| majeur.soutien | 38 | 24 (2) | 23 | 10700 | 61 |
| sa1.seuil | 25 | 17 (3) | 17 | 48931 | 115 |
| red.base | 72 | 65 (1) | 60 | 2376 | 33 |

La dette M4 = somme, à chaque fin de séance, de max(0, écart depuis la dernière exposition – 6), pour les concepts déjà exposés. Preuve = au moins deux familles et deux séances avec réussite autonome, sans aide ni erreur libre ; une exposition ne suffit pas. Les écarts, l'exposition, le rappel explicite, la réactivation (écart >=7) et la preuve sont séparés dans les traces. Cible/11 : Passe dernière S72 (108 séances terminales), 1SA dernière S142, seuils dernière S65 (115 séances terminales). Au total S66–180, 5124 occurrences de familles déjà rencontrées ; 499 slots de maintenance dont le concept est aussi représenté ailleurs dans la séance, **8 seulement** avec famille déjà rencontrée (borne supérieure à l'éligibilité de M, avant filtres et gardes). Cible/11 38 redondants dont 0 répétée. Les familles et concepts réellement disponibles varient avec les prérequis, le niveau et le profil.

## Cinq politiques isolées (pas de changement direct S1–20)
- L : échéance adaptative 7/9/12 (selon diversité des preuves autonomes des 24 dernières séances), bonus borné 32, créneau fondamental natif ou maintenance redondante, même thème/niveau/stage/novelty. Pas de contournement des filtres.
- M : compression atomique d'un rappel de famille répétée non prioritaire, concept sortant conservé dans la séance, preuve récente et multi-familles/séances, même thème/niveau/stage. Aucune augmentation de répétitions. La capacité observée explique la neutralité.
- N : fixture d'arbitrage M1 explicitement doublement opt-in ; après S65, une exception au plus sur quatre séances, target absent >=18, prévision dette à 7 séances, ancien concept couvert ou récemment prouvé, protection du rappel d'erreur, du niveau local et du plafond Passe. Autorise au plus une répétition supplémentaire et une famille inédite déplacée, journal des deux coûts. Réel gain mais pertes non acceptables.
- O : rotation d'un slot déjà répété et positivement maîtrisé, sans perte de famille inédite dans la séance ni hausse de répétitions, thème préservé même si prioritaire, rappel d'erreur/transfert/fragilité protégé. Due positif uniquement sous garde de preuve récente différente ou concept retenu. Fixture M1 explicite. Gain dans quelques trajectoires, mais effets en cascade.
- P : réutilise la rotation O après **saturation réelle de toutes les familles**, tous les concepts prouvés historiquement, deux dernières séances entièrement autonomes, journal complet. Pas de nom de profil, pas de seuil indexé sur S153, pas de relaxation du gate. Ne vise pas les élèves dont le catalogue est encore en cours d'acquisition. Fixture M1 explicite, inclut les slots de complément positifs sous les mêmes gardes. Les neuf autres objets du deck restent intacts avant logicalOrder. Toutes les politiques sont pures et non importées en production ; aucun objectif réel M1 supposé acquis.

## Recette native (Node 22, SHA figés)
| Bras | Dette S180 | Preuves | Familles | Directes | Trajectoires en régression | Violations |
|---|---:|---:|---:|---:|---:|---:|
| Natif | 228622 | 1520 | 25806 | 0 | – | – |
| L | 228622 | 1520 | 25806 | 0 | 0 | 0 |
| M | 228622 | 1520 | 25806 | 0 | 0 | 0 |
| N | 103324 | 1508 | 25755 | 173 | 12 | 85 |
| O | 221019 | 1518 | 25812 | 10 | 4 | 13 |
| P | 225145 | 1520 | 25806 | 3 | 0 | 0 |

18 trajectoires = 6 profils x 3 graines ; 5 candidats sur 180 séances ; 108 bras uniques avec témoin = 194400 présentations archivées ; 162 bras réellement exécutés (291600 présentations, les témoins réexécutés entre campagnes). Tous les 72 jobs de matrice natifs réussis techniquement ; les jobs d'archive réussis. 78 assertions distinctes ciblées (24+19+22+13), exécutées dans la CI finale et sur fixtures V8 ; ancres et compilation sur moteur réel. Les tests de reprise du banc historique, identités exactes des decks S1–20, 10 QCM, aucune inéligibilité, aucun doublon ID/famille intra-séance ont réussi. L/M : decks complets identiques au témoin. Checkpoints natifs identiques à la référence historique K hors latence, re-témoins identiques entre campagnes. Les temps p95 restent archivés, pas agrégés en somme.
Gate D/K conservé par trajectoire et horizon S5/20/65/153/180 ; plus garde de perte d'un concept ou d'une preuve individuelle. Le gate intégré exige toujours le gain S5 de A ; B ne peut y intervenir. Aucun résultat de moyenne ne blanchit une violation. N 134 pertes de nouveauté directe, 29 pertes individuelles de preuve (à travers horizons). O pas de perte de nouveauté directe, mais 13 violations. P 0 violation D/K, 0 perte de preuve individuelle, toutefois les effets en cascade déplacent un peu de dette entre concepts (ouv.mineure +48, majeur.soutien +9, sa1.seuil +93, red.base +51 sur le total des 18). Gain principal ouv.sa1 –3528, majeur.base –150. P reste limité : trois graines autonomes donnent en réalité la même trajectoire parfaite ; les quinze autres restent identiques. Ne pas interpréter comme trois validations humaines ni comme résolution générale.

Cas P réel : autonome/11 S170, sortie SEF-V4-026-3 (réponse à intervention, 7 H, 2♥, difficulté 3) → SEF-001-1 (15 H réguliers, 1SA, difficulté 1, position effective 7). Concept sortant retenu ailleurs et 8 familles / 7 séances autonomes récentes ; entrant dernier S62, écart 108, famille dernière S6, écart 164. À S169, 1556/1556 familles vues ; budget théorique 0 mais deck natif déjà 10 répétitions par saturation, après 10 répétitions, aucune nouveauté évincée. Par trajectoire autonome dette 17603→16444 ; preuves 99→99 ; familles 1556→1556. Deux autres graines mêmes résultats. Les quatre profils non autonomes intéressants et Passe restent inchangés par P ; la fragilité et l'aide ne sont pas utilisées comme noms de profil.
Contre-exemples : N passe/11 perd la preuve de ouv.passe, N cible/103 perd forcing.base à S153 et ouv.bicolore.exception/sa1.texas.contre à S180 ; N autonome perd 12 familles à S153 malgré retour à 1556 à S180. O intermediaire/47, passe/47 et passe/103 perdent des preuves ; passe/11 a une autre violation malgré gain agrégé de preuve. P ne gomme pas ces échecs de N/O.

## Archives et reproductibilité
- native/manifest.json : 108 traces complètes compressées, SHA256 bruts et compressés, chaque SHA testé ; 180 séances × 10 lignes chacune (ID, main, contexte, enchère, niveau, concept, famille, décision, rôle, motif, réponse effective, éligibilité, position), détail des 99 concepts aux cinq horizons.
- comparatif-exhaustif.json : 90 comparaisons par profil/graine/candidat, checkpoints, gate, neuf concepts séparés, capacité et saturation par concept.
- registre-substitutions.json : 186 décisions directes (173 N + 10 O + 3 P), entrant/sortant, mains, échéances, preuves, catégorie, budget, coût et position. Les traces complètes contiennent les effets indirects ; ne pas assimiler l'ID natif local sortant à l'ID témoin à même séance après divergence d'historique.
- historical-g/manifest.json et g-six-missing-native.json : 18 paires originales G, 6 logs antérieurement manquants comparés exactement aux artefacts, pas de résultats inventés. G reste dette 228622→228622, preuve 1520→1520, trois substitutions D héritées.
- Run LM 45983061749, SHA dab1455f4721eb1b872e41fd1338ab5805b5dd9a ; N 45983795003, SHA e2af78a8a64fb5eb7db47ef89ee69c350e7c01ed ; O 45984289953, SHA fd6866818e29b95c3562cde4a5c170fe1e5e90db ; P 45984704496, SHA 33d26f08402e15e9c752068e1b957473f90bdf57. Les PR techniques #453/#456/#461/#463 sont fermées sans fusion ; aucune CI nouvelle dans la livraison.
- tests/coherence-concrete-m4p-b-report.cjs vérifie SHA256, structure, dette par concept et preuve, reconstitue registre et comparatifs ; exécution archive P réellement réussie.
- Tests historiques (moteur inchangé) run 45983901080 : Chromium et WebKit, parcours et offline + durable integration browser réussis ; tests/quizz-parcours.cjs (lot B historique 5 profils x 153 x 2), quizz-prerequis.cjs et quizz-progression-selection-assets.cjs réussis. Test quizz-progression-selection-real.cjs échoue ligne 8 : 1915 !== 1879. Les blobs test/moteur/HTML sont strictement identiques à la base. Run 45984977366 indépendant : quizz-retours, durable-contract, durable-evidence, durable-m6-guards, verify-sef réussis ; professeur-numerique-integrated.cjs échoue ligne 13 sur l'égalité textuelle du moteur antérieur (intégration durable déjà présente dans la base). Aucune correction ni contournement hors périmètre. #457/#465 fermées sans fusion. Les navigateurs testent uniquement la production inchangée, pas une intégration P.

## Arbitrage chiffré à M1 (aucune activation)
Banc de capacité séparé, exécuté localement sur les 18 traces natives téléchargées et vérifiées. Code tests/coherence-concrete-m4p-b-capacity.cjs, synthèse arbitrage-capacite-synthese.json ; réexécutable sur native/ (écrit arbitrage-capacite.json). Ajoute virtuellement une exposition, **sans éviction de QCM, sans réponse, sans éligibilité, sans cascade** : capacité optimiste, pas une recette candidate ni une preuve mathématique d'impossibilité de toutes politiques.

| Cible d'écart | Rappels virtuels/trajectoire | Total 18 | Pic quotidien |
|---|---:|---:|---:|
| 7 | 70–99 | 1600 | 3 |
| 10 | 39–63 | 982 | 4 |
| 14 | 23–40 | 607 | 3 |
| 21 | 10–22 | 312 | 3 |

1 toutes les 4 séances : 28–29/1150 places (2,4–2,5 %), dette virtuelle 30949 ; 1 toutes les 2 : 51–58/1150 (4,4–5,0 %), dette 9357 ; 1 par séance max : 68–92/1150 (5,9–8,0 %), dette 1753 ; 2 max : dette 1148 ; 3 max : dette 1114 (dette antérieure S65). Ce modèle ne réserve pas réellement les places et surestime les gains possibles. N a consommé 173 slots dont 134 évictions de nouveauté et a échoué ; ce n'est pas comparable à une insertion gratuite.
Proposition M1 : garder les 10 QCM ; préserver rappels d'erreur/aide, découvertes de concepts non prouvés, prérequis, niveau local et contrastes Passe. Réserver dans le quota de maintenance **une place glissante toutes les 2 séances si disponible**, prioriser la dette individuelle avec échéances 7/9/12 selon preuve récente ; tester ensuite une place de collision optionnelle uniquement si donateur validé et couverture de nouveaux concepts préservée. Pas de retrait automatique d'une découverte ; si aucun donateur, différer et journaliser le conflit (concept, preuve, délai, raison). Comparer à la variante plafond 14 (23–40 rappels par trajectoire) et au témoin. Demander au coordinateur/M1 d'autoriser explicitement le transfert de budget sur fenêtre et le traitement des familles globalement épuisées ; M6/D recette indépendante avant raccordement. Si perte de preuve/famille ou autre régression, HOLD ; ne pas augmenter à 11 QCM ni modifier catalogue sans décision de contrat. P est un sous-cas conservateur pouvant être évalué indépendamment, non une autorisation d'activation.

## Statut et limites
Contrats et corps d'issues historiques #293/#365/#375–409 consultés ; archives principales et code pertinent A–K lus. Je n'atteste pas la lecture manuelle de chaque commentaire ou de chaque archive individuelle historique, ni le visa SEF de chaque contraste (M4-C), ni la validation de toutes suites historiques #385/#395/#409. Modèle de réponse déterministe historique, non preuve d'apprentissage humain ; aucune recette intégrée M1/M2/M3/M5/M6 ni validation indépendante M4-D. Les deux tests historiques en échec sont signalés au coordinateur, non modifiés. Le périmètre testé montre la rareté des créneaux compatibles et l'échec des arbitrages généraux essayés, pas l'impossibilité mathématique de toute solution. P passe le gate contractuel B et est un résultat positif limité, mais ne résout pas la dette pour les autres élèves. Ne pas fusionner automatiquement.
**SOUS-MISSION DÉFINITIVEMENT TERMINÉE : NON — livraison autonome exploitable, solution générale et arbitrage M1 ouverts.**

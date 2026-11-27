# M4-D — laboratoire indépendant (#445 / #449)
Base immuable 49298ada3f96e347833d8717c7e205518ea02fce. Moteur 4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9 ; catalogue 7a952dc57b582a2a7b5be73f83306df83881f3a8 ; métadonnées 8e920bb9c925c7474bb04701f0f2fecac5288b91. Aucun fichier de production ni gate historique modifié. Aucun merge.
## Résultats natifs
Run 45982982513, SHA 5129f278687dc9ab617bda108279d126b9959a98 : 36 paires D/K S180 réussies techniquement ; Chromium et WebKit réussis (build, intégration durable, offline, parcours). 129600 présentations, 18 références répétées deux fois. 36 archives durables gzip+base64 sous native/, indexées par politique/profil/graine. Chaque archive contient SHA, job, empreinte SHA256 de la chaîne base64, 180 séances de 10 lignes par bras, ID, rôle, motif, éligibilité attestée, résultat, choix, aide, erreur libre ; mains/contexte/réponse/niveau/signatures reconstitués du catalogue figé. Les 18 références identiques ont été vérifiées ID/motif/réponse par ID dans le second run 45983555669, SHA 1662b8e638c5701e89b373196f4dda51bc9e8f5a : 6/6 jobs PASS, 97200 lignes rejouées sur moteur natif (18 références uniques et 36 bras candidats). L'éligibilité des candidats est réévaluée avant chaque réponse sur état natif reconstitué ; le rejeu ne prétend pas resélectionner les candidats, sélection attestée par le premier run. Reprise active et finish vérifiés.
 
| Indicateur | Base | D | K |
|---|---:|---:|---:|
| Proximité récente S5 | 74 | 71 | 71 |
| Dette fondamentale S180 | 228622 | 228622 | 234613 |
| Proximité récente S180 | 408 | 405 | 393 |
| Paires même décision S180 | 649 | 649 | 652 |
| Preuves autonomes S180 | 1520 | 1520 | 1520 |
| Familles cumulées S180 | 25806 | 25806 | 25806 |
| QCM niveau >=4 S180 | 6813 | 6813 | 6822 |
| Régressions gate historique | — | 0 | 12 |
| Alertes supplémentaires concept/gap/preuve | — | 0 | 45 |

D : 3 substitutions, gate historique REVIEW, gate commun HOLD (dette inchangée). K : 6 changements dont 3 réservations, HOLD même si proximité réduite ; dette S153 162013→161968 mais S180 augmente. Les 45 alertes supplémentaires sont des entrées concept/horizon/profil, pas 45 élèves. Aucune structure invalide. Totaux = sommes des trajectoires, non nombre de QCM distincts dans le catalogue. Latence observée sans seuil inventé.
 
## Historique et contre-exemples
G : récupération six jobs manquants de run 45906411851, checkpoints natifs historiques, pas nouvelle exécution G. Matrice 18/18, aucune substitution dans ces six ; dette inchangée 228622, preuve 1520. D/G même total. F/H/I : lecture historique, H/I détruisent des preuves ; archives détaillées non toutes réexécutées.
C2 historique : rejeu indépendant V8 des 18 traces appariées S20, 7200 présentations ; S5 proximité 40→34, décisions 262→240, preuve 93→92 ; S20 dette 1→4, preuve 356→347, couverture concepts 854→851 ; 30 substitutions, 19 violations gate historique, HOLD. Aucun défaut structurel. Ce n'est pas le nouveau M4-C.
29 tests Node D PASS, contre-exemples : moyenne qui masque un profil, perte d'autonomie, falsification dette, assistance déguisée, famille dupliquée, inéligible, graine/SHA/horizon/trace manquants, rang mutateur/hors phase/hors candidats/hors borne. 
Quick historique : quizz-parcours et lot B PASS, prérequis 1915/99 accessibles ; quizz-progression-selection-real.cjs échoue sur assertion 1879 contre 1915 sur catalogue figé. Le fichier est hors périmètre, pas corrigé, pas assoupli. La chaîne s'arrête à ce test ; suites suivantes non attestées dans ce run. Voir quick-receipt.json. Les deux PR techniques #450/#454 sont fermées sans fusion.
 
## Echange et intégration
`node tests/coherence-concrete-m4p-d-test.cjs` ; `node tests/coherence-concrete-m4p-d-native.cjs autonome 11 D` (ou K ; OUT et HORIZON paramétrables) ; `node tests/coherence-concrete-m4p-d-archive.cjs` (ou dossier puis profil). Le runner accepte M4PD_ADAPTER=/chemin/adaptateur.cjs export runCandidate(opts) : doit appeler moteur figé et rendre un bras au format campaign.run ; vérifier phase et raisons sur hooks, préserver garde historique, produire journal des changements réels. Le candidat ne choisit pas sa référence. Comparer via comparePair puis compareCheckpoints sur 18 couples, horizons complets, vérifier toute alerte conceptuellement ; pas de décision sur moyenne. Pour A : gain S5 et S20, fenêtre directe 1–20 ; pour B : rappel direct S21–180, gain dette ; pour combinaison : exiger les deux gains. C : annotations non validées = avis, pas de filtre ni crédit automatique. Un adaptateur séparé est requis pour plan/replace, justifier toutes réservations. Une trace sans éligibilité, provenance ou ligne canonique n'est pas une preuve. Les seuils D/K restent inchangés. HOLD si régression ; REVIEW n'est jamais autorisation d'activation. M1 réel et M6 intégration/navigateurs sur candidat raccordé nécessaires avant activation. A/B/C ne sont pas validés par les tests historiques. Pas de preuve d'apprentissage humain.
 
## Contrôle des livraisons disponibles
B #452, SHA e2af78a8a64fb5eb7db47ef89ee69c350e7c01ed : checkpoints natifs L/M (18/18 chacun) repassés au gate indépendant. 0 changements, 0 gain dette, HOLD pour les deux. Ce contrôle ne remplace pas le rejeu des bras B. C #451 SHA 0ffe95e5864eb8639a9e3be0e84b698d09930cf3 : registre disponible, statut HOLD ; les annotations ne sont pas un visa. A en cours de recette technique #455, pas de livraison finale à ce stade. Ne pas modifier leurs branches.
 
## Registre durable
- recovered-g-checkpoints.json : six G historiques et provenance.
- replay-c2-s20.json : 18 trajectoires C2, verdicts par profil/horizon.
- native/*.json : 36 archives, deux politiques, six profils et trois graines.
- native-D-summary.json et native-K-summary.json : résultats exacts, gates, alertes concept.
- native-replay-browser-receipts.json : 6 jobs rejeu, deux navigateurs.
- quick-receipt.json : 29 tests D + suites historiques passées et échec réel.
- b-lm-independent-checkpoints.json : 36 couples de checkpoints B et provenance.
 
Statut : laboratoire natif opérationnel et archives vérifiées ; recette historique globale incomplète, candidats A/B/C finaux non tous disponibles. Voir compléments ultérieurs sur cette branche. Aucune fusion ni publication.

## Reprise après ouverture de #458
Le gate opérationnel supplémentaire `tests/coherence-concrete-m4p-d-compare.cjs <dir> A|B|AB <SHA>` reçoit les 18 paires brutes. Vérifie la référence exacte ordonnée issue des archives D, SHA des blobs et du candidat déclaré, métadonnées stage/prérequis, 5 horizons, chaque réponse, et comparaison indépendante ; 0=REVIEW (non activation), 1=erreur technique, 2=HOLD pédagogique. A doit améliorer S5 et S20, B doit améliorer dette et préserver préfixe S1–20 ; AB exige les deux. Toute perte de preuve par concept, dette accrue sur un fondamental, terminal gap aggravé ou défaut structurel bloque. Latence reste un signal séparé (pas de seuil arbitraire). Les journaux d'interventions directes doivent être vérifiés au niveau de l'adaptateur (effets de trajectoire autorisés après S20 pour A). Le contrôle des contrastes est un proxy, pas un visa : les relations C non validées restent avis.
 
Run 45984178809, SHA 3000849627064bab2bd755e809bc737793fc021f : gate de livraison PASS sur D/A (REVIEW), D/AB (HOLD), K/AB (12+45), D/B (préfixe altéré), référence falsifiée, SHA divergent, matrice incomplète. C #451 snapshot 0ffe95e5864eb8639a9e3be0e84b698d09930cf3 lu dans checkout séparé : 1915/1915 ID, famille, concept, réponse, niveau, force, distribution, séquence, stage et minSession conformes ; 28 relations, 36 revues IA, 1879 uniquement automatiques, zéro visa éditorial. Recette durable historique : contract 5969, evidence 21, M6 guards 131 assertions PASS. Wave2-resume échoue au compteur 1523 vs 1915, intégration progression échoue avec shallow Git, puis relance complète 45984503654 au SHA 85d2932997d9c594287c99947798fc2ef1371c38 : échec "Embedded catalogue byte-identical" (comparaison avec catalogue historique, pas une modification D). Ces trois échecs historiques de comptage/identité doivent être arbitrés par le coordinateur ; aucune assertion retirée ni modifiée. PR techniques #459/#462 fermées sans fusion.
 
Autres historiques indépendamment relus :
| Variante | Périmètre | Changements | Régressions strictes | Dette S180 | Preuves S180 |
|---|---|---:|---:|---:|---:|
| A historique | 18 paires S5, traces | 55 | 16 | — | — |
| B historique | 18 paires S20, traces | 112 | 58 | — | — |
| C historique | 18 paires S5, traces | 21 | 5 | — | — |
| C2 | 18 paires S180, checkpoints natifs | 170 | 129 | 234376 | 1515 |
| D | 18 paires S180, régénérées | 3 | 0 | 228622 | 1520 |
| E | 18 paires S20, checkpoints V8 | 0 | 0 | — | — |
| F | 18 paires S180, checkpoints natifs | 3 | 0 | 228622 | 1520 |
| G | 18 paires S180, checkpoints natifs | 3 | 0 | 228622 | 1520 |
| H | 18 paires S180, checkpoints natifs | 425 | 102 | 38653 | 1490 |
| I | 18 paires S180, checkpoints natifs | 287 | 68 | 76718 | 1512 |
| J | 18 paires S20, checkpoints V8 | 0 | 0 | — | — |
| K | 18 paires S180, régénérées | 6 | 12 | 234613 | 1520 |
 
La référence S180 est 228622 dette / 1520 preuves. Chaque chiffre de régression est une entrée métrique/profil/graine/horizon, non une trajectoire unique. A/B/C dans le tableau = variantes historiques, distinctes des agents actuels. Les checkpoints A–K sont relus à des niveaux différents de preuve, pas une nouvelle campagne native complète de toutes variantes. Sources et résultats dans replay-a-s5.json, replay-b-s20.json, replay-c-s5.json, historical-fhi-independent.json, historical-c2-dej-independent.json. 
A agent #460 snapshot d3ff297d62fbf6eb97311663dcb642889774d7d8 : T, 18/18 paires S180 de checkpoints natifs, 3 substitutions, nearPairs S5 40→37 et S20 96→93, zéro régression au gate historique ; candidat très limité REVIEW pour A seul, pas gain de dette et pas autorisation de production. Voir a-t-independent-checkpoints.json. Contre-recette native externe sur artefacts T et B L/M/N/O lancée dans #464, SHA ae29fd8f513ae57c85ff65392d7b2ce76322e932, run 45984730024. Les branches externes sont lues seules. Ne pas considérer le lancement comme PASS.

## Clôture du laboratoire et contre-recette externe
Run [45984730024](https://github.com/CapGui13/QPJB/actions/runs/45984730024), SHA ae29fd8f513ae57c85ff65392d7b2ce76322e932 : cinq jobs natifs PASS. A T téléchargé depuis son run natif 45983780337 (head c1dde5fc9c2e026df34ceb14e1b471855fc6355b), B L/M/N/O depuis le snapshot Git 852f3d7915324a73a9a59c80fc55120292e931cf, manifeste des SHA256 gzip et JSON vérifié. 90 couples, 162000 réponses candidates rejouées sur moteur réel, comparaison exacte à 18 témoins D archivés, 5 horizons par couple, zéro erreur technique, contrôle éligibilité natif, reprise et finish ; toutes interventions directes dans la phase permise. Pas de nouvelle sélection des candidats : contre-recette indépendante des traces effectivement produites par leurs campagnes. 
| Agent / variante | Changements directs | Dette S180 | Preuves S180 | Violations historiques | Alertes additionnelles | Décision |
|---|---:|---:|---:|---:|---:|---|
| A T | 3 | 228622 | 1520 | 0 | 0 | REVIEW A seul |
| B L | 0 | 228622 | 1520 | 0 | 1 (aucun changement) | HOLD |
| B M | 0 | 228622 | 1520 | 0 | 1 (aucun changement) | HOLD |
| B N | 173 | 103324 | 1508 | 56 | 146 | HOLD |
| B O | 10 | 221019 | 1518 | 9 | 25 | HOLD |
 
Pour N, 95 réponses autonomes perdues et 51 familles de moins à S180 ; pour O, 13 réponses autonomes perdues, malgré 6 familles de plus. T améliore les paires proches S5/S20 de 3, n'agit pas sur la dette. Aucun de ces résultats ne permet l'activation d'un candidat AB. Les alertes additionnelles sont des entrées par concept/horizon/profil, non des personnes. Les rapports complets avec deltas par profil et horizon sont dans external-a-b-lmo-receipts.json et external-b-n-receipt.json. Les archives B sources sont durables sur B ; A source T dans les artefacts du run natif (rétention finie dans l'index A), non copiée intégralement dans D ; le résultat indépendant est durable, les 36 archives D/K restent intégralement durables. 
Les cinq PR techniques propres à D #450/#454/#459/#462/#464 sont fermées sans fusion ; la PR #458 demeure brouillon. Tous les chemins D ajoutés uniquement dans le périmètre. Aucun fichier de production ni workflow actif modifié, aucune fusion ni publication. Le checkout local Git était indisponible (DNS) ; les preuves natives viennent de GitHub Actions, pas de tests locaux simulés présentés comme natifs. L'historique pertinent est analysé avec registres et variantes, sans prétendre une lecture manuelle exhaustive de tous les anciens commentaires/fiches.
 
**SOUS-MISSION DÉFINITIVEMENT TERMINÉE : OUI — laboratoire autonome et gate indépendant livrés, tests propres et contre-recettes exécutés.** Validation intégrée M4 : NON, HOLD maintenu. Trois tests historiques obsolètes échouent sur la base figée (1879/1523 et identité ancienne du catalogue) ; le coordinateur doit arbitrer sans affaiblir les gardes. C reste en revue éditoriale ; résultats de C limités au snapshot contrôlé. M1 réel, raccordement et recette intégrée M6 demeurent au coordinateur, pas à D. Aucun gain humain démontré.

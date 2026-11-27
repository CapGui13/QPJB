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

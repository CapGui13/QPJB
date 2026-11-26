# Diagnostic complémentaire HOLD cible 103 — S65

Exécution comparative en mémoire V8 sur catalogue réel (blob 77f10161e8f1a7b327d03937b55bd7e76bf83109), moteur et dépendances au SHA figé d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7, module M1 de la branche. Deux trajectoires de 650 réponses, profil cible graine 103, mêmes règles de réponse que durable-m1-banc.cjs. Instrumentation : avant api.start, appeler eligibilityBatch sur le catalogue entier et relever la première séance où au moins un exercice du concept est éligible ; relever également la première sélection. Pas de modification du moteur.

| Concept | Première éligibilité témoin | Première exposition témoin | Première éligibilité M1 | Première exposition M1 |
|---|---:|---:|---|---|
| chelem.blackwood.dame_rois | 60 | 60 | non observée S65 | non observée S65 |
| chelem.blackwood.suite | 59 | 59 | non observée S65 | non observée S65 |
| rubensohl.suite | 56 | 56 | non observée S65 | non observée S65 |

S65 témoin/M1 : familles 576/573 ; IDs 584/581 ; concepts 99/96 ; thèmes 22/22 ; preuves 71/68 ; erreurs 208/199 ; rappels 64/66 ; ciblages 5/8 ; zéro violation d'intégrité. S1–3 et métriques S20 identiques.

Prérequis réels : blackwood.suite exige 2 ou 3 expositions chelem.cles et 1 chelem.controles (minSession 43 ou 47) ; dame_rois exige de plus 1 exposition blackwood.suite. rubensohl.suite exige 2 rubensohl.init et 1 rubensohl.reponse (minSession 40). Le retard d'éligibilité est établi ; la condition exacte bloquante parmi les prérequis et les autres règles du moteur reste à tracer. Le garde-fou sur les seuls candidats inédits ne peut pas protéger un concept non éligible. Ne pas contourner les prérequis.

Reproduction : instrumenter run dans tests/durable-m1-banc.cjs juste avant api.start avec api.eligibilityBatch(qs,state,qs), relever la première éligibilité par meta.byId[q.id].concept ; dans la boucle deck relever la première exposition. Comparer cible 103 65 avant/après. Exécution V8, pas Node natif. Aucun changement de production ni arbitrage du HOLD ; le coordinateur reste seul habilité selon #396.

# M6 — qualité quiz, conventions et chelems

Mission #312 / contrat #306. Base figée `4bb2df19929f921aff81468be22830445d4f87b0`, catalogue `55633e60ad6e8583616ad11b1da3acf1da013844`, prérequis `9071d5ab03115c9967fb3c54ee819f91a1cec84e`. Branche `qualite-quiz/m6-conventions-chelems`.

## Bilan

- 287 anciens QCM dans les six rubriques ; 199 conservés, 87 corrigés, 1 à arbitrer (conservé en attendant).
- 85 explications, 24 consignes, 111 champs au total ; réponses, choix, mains, niveaux et IDs existants inchangés.
- 12 nouveaux QCM complets, 6 lacunes ciblées traitées. Les IDs et familles M6 sont provisoires ; le pilote alloue les IDs finaux. 

## Application

`plan.json` : inventaire initial et objectif ; `review.json` : une décision par ID ; `patch.json` : tableau plat, entrées avec old/new = corrections, autres = QCM neufs (retirer les champs de transport prerequis/source du catalogue, reporter prerequis dans la source du moteur et source dans la provenance selon les règles du pilote). Ne jamais écraser un old différent. Préserver les champs historiques. Les quatre livrables sont seuls dans ce commit.

## Méthode et sources

Une cartographie unique depuis le blob, puis lecture groupée des mains, enchères, réponses, distracteurs, difficulté et explications des 287 lignes ; lecture ciblée des contextes génériques/complexes et contrôle programmatique de présence de contexte et métadonnées pour toutes les lignes. Réutilisation des audits historiques V475/V480/V483/V484, Roudi, #271 et du manifeste de visa global du 24/11. Les formulations déjà approuvées sont conservées sauf contradiction ou clarification démontrée. La revue n'est pas une certification indépendante des 287 séquences par le SEF intégral : ouvrage complet non disponible ; les références ponctuelles sont indiquées dans les patches et les règles sont ancrées dans le catalogue et les audits, sans inventer de page. Le checkback est corroboré par Comprenez le Bridge, SEF 2024 suite et fin. 

## Arbitrage groupé

- SEF-L44-004 : Contradiction nouvelle entre le corrigé qui présente 3♠ comme naturel et SEF-L20-002 qui établit 3♠ Splinter sur exactement 2♣–2♦–2♥. Le cadre du double saut à 4♠ et l'éventuelle distinction de force/contrôle doivent être confirmés. Ne pas remplacer automatiquement 4♠ par 3♠ : le cas L20-002 a été validé dans #271 et la réponse L44-004 n'est pas tranchée par cette seule comparaison. SEF-L20-002 ; SEF-L44-004 ; audits/wave2/pedagogie/REVUE_48_PREUVES_COMPLEMENTAIRES_20261123_HOLD.md ; visa global #271. Réponse et explication existantes non modifiées dans l'attente.

## Contrôles ciblés exécutés

- 1523 entrées source, 287/287 lignes M6 distinctes avec prérequis connus ; périmètre et cohérence review/patch ; old exacts, identifiants et réponses préservés.
- 299 QCM M6 projetés : 13 cartes, rangs valides et distincts par couleur, H/shape exacts, quatre choix uniques et réponse présente une fois, contexte/explication/difficulté/motif présents, concepts/prérequis connus ; 12 nouveaux IDs et familles distincts, aucun doublon exact main + enchères face aux 1523 anciennes entrées ; aucun auto-prérequis nouveau. **0 erreur détectée**.
- Pas de test global, navigateur ou CI déclenché ici ; application et recette FULL sur la version assemblée par le pilote. Les contrôles de légalité d'enchères détaillés et la vérification de tout contexte/motif existant n'ont pas été automatisés. Les deux ajouts de troisième couleur utilisent un concept partagé avec M3 : vérifier l'absence de double production inter-lots. Les minSession/stage des nouvelles entrées sont proposés, aucun changement des métadonnées historiques.

## SHA

Base ci-dessus ; SHA de livraison = commit contenant ce README (à relever dans le bilan de l'issue / PR). Aucun merge ni publication.

# Quiz QPJB — V4.71 — redemandes libres et forcées après intervention
4 novembre 2026 · Branche pédagogique isolée

## Justification de cette extension
L'audit de la PR #45 identifie la redemande libre après intervention du quatrième joueur (D24) comme une décision utile absente des 101 redemandes préexistantes. Le lot ne reprend pas les trois candidats réservés C05/C09/C14, ni le rejet C08 : la V4.70 a déjà traité la première priorité et l'ajout d'exercices n'est pas un objectif quantitatif.

**Principe SEF :** 1♦ – Passe – 1♥ – 1♠ – ? : l'ouvreur n'est plus obligé de reparler. 1SA libre requiert la tenue à Pique, contrairement à la redemande 1SA obligée sur 1♦ – (1♥) – 1♠ – Passe – ?. Soutien simple avec quatre cartes dans la majeure du répondant ; répétition libre d'une mineure sixième solide ; 2SA sur 1M adverse avec main régulière de 3e zone et double arrêt.

## Six décisions réellement distinctes
| ID | Séquence | Main ♠/♥/♦/♣ | H | Choix | Compétence vérifiée |
| --- | --- | --- | ---: | --- | --- |
| 001 | 1♦–P–1♥–(1♠) | 863 / AR5 / RD74 / D96 | 14 | Passe | Pas d'arrêt ; pas de fit ni de mineure sixième |
| 002 | 1♦–P–1♥–(1♠) | A94 / R75 / RV86 / R85 | 14 | 1SA | Même forme et même force que 001, seul l'arrêt change la décision |
| 003 | 1♦–P–1♥–(1♠) | 84 / AD97 / RV86 / R53 | 13 | 2♥ | Quatrième Cœur, priorité au fit |
| 004 | 1♦–P–1♥–(1♠) | 94 / 86 / ARD1085 / R72 | 12 | 2♦ | Six Carreaux solides, rebid naturel libre |
| 005 | 1♦–P–1♥–(1♠) | AR7 / R85 / AR74 / V73 | 18 | 2SA | Troisième zone et double arrêt Pique |
| 006 | 1♦–(1♥)–1♠–P | R94 / 972 / AD86 / RV4 | 13 | 1SA | Réponse 1♠ forcing : 1SA obligatoire malgré aucun arrêt Cœur |

## Examen interne des trois distracteurs de chaque fiche
- **001** 1SA (pas d'arrêt Pique), 2♦ (seulement quatre), 2♥ (seulement trois Cœurs). Le Passe libre avec une ouverture minimale est autorisé.
- **002** Passe (renonce à décrire une main régulière solide et l'arrêt), 2♦ (quatre), 2SA (nécessite troisième zone et double arrêt).
- **003** Passe (occulte le fit majeur 4–4), 1SA (arrêt Pique absent), 2♦ (quatre Carreaux alors que le fit Cœur prime).
- **004** Passe (ne montre pas les six beaux Carreaux), 1SA (pas d'arrêt Pique), 2♥ (deux Cœurs).
- **005** Passe (18 H insuffisamment décrits), 1SA (trop faible descriptivement), 2♥ (seulement trois Cœurs).
- **006** Passe (interdit après la réponse forcing à 1♠), 2♦ (seulement quatre Carreaux), 2♠ (fit Pique de seulement trois cartes).

Les corrigés visibles n'expliquent que la réponse correcte ; les distracteurs sont documentés ici, pas affichés aux élèves.

## Sources et réserves
1. iBridge, [redemande après intervention du joueur 4](https://dev.ibridge-club.fr/public/fichedetails/382), cas E1001, E1002, E1004, répartition des soutiens, 1SA et 2SA.
2. [Le SEF 2024 (1), Olivier Chailley](https://www.bridge-chailley.fr/le-sef-2024-1/) : arrêt imposé pour 1SA libre, non imposé pour 1SA forcé après une réponse forcing.
3. [Marc Kerlero, réponse sur les 1SA obligés ou libres](https://amourdubridge.fr/forums/topic/2eme-enchere-a-2-sa-de-louvreur/) : contre-vérification indépendante.
4. iBridge, [répétition de la couleur d'ouverture](https://dev.ibridge-club.fr/public/fichedetails/449) : 1♦ puis 1♥ implique six Carreaux pour la répétition.

**Statut initial :** prévalidation pédagogique. Valider la CI GitHub Actions sur le HEAD exact avant de publier. Tester les annonces et les distracteurs ; ne jamais toucher aux 1004 cartes historiques ni à l'Entraînement.

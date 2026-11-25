# M3 — Redemandes et deuxième enchère du répondant

Base `4bb2df19929f921aff81468be22830445d4f87b0`, catalogue `55633e60ad6e8583616ad11b1da3acf1da013844`, prérequis `9071d5ab03115c9967fb3c54ee819f91a1cec84e`. Contrat #306, mission #309.

## Bilan
- 245 examinés (124 red, 121 second) ; 195 conservés, 49 corrigés, 1 arbitrage seul ; 49 explications modifiées ; 1 réponse modifiée.
- 7 nouveaux QCM complets, 6 lacunes couvertes. IDs et familles provisoires M3, allocation définitive par le pilote. Le catalogue original reste intact.
- Les 2 poursuites de troisième couleur font passer ce concept à 3 familles dans M3 ; la variante Splinter atteint 3 dans M3. Quantitatif mini-maxi : deux cas opposés suffisants localement.

## Format d'intégration
`patch.json` est une liste mixte : entrées existantes id/old/new/reason/source, puis objets QCM complets avec `prerequis` séparé (à extraire lors de l'intégration). `review.json` contient une décision par ID. `plan.json` est la cartographie initiale avec objectif fixé dans le commentaire de #309. Ne pas renuméroter les anciens IDs, ne pas copier `prerequis` dans le catalogue si le pilote conserve son stockage séparé.

## Arbitrages / interface pilote
- SEF-V411-007 : La correction 2♦ artificiel relève du concept forcing.troisieme ; proposer un changement explicite de prérequis au pilote, pas une modification du moteur.
- SEF-L07-015 : Contexte donne expressément la règle Roudi, mais dépend de cette convention ; proposer au pilote de vérifier l'exposition préalable à Roudi sans toucher au moteur.
- SEF-L36-001 : La réponse 2♥ est prioritaire, pas nécessairement une promesse de deux majeures. Corrigé et contexte ajustés, sans nouvelle convention.
- Aucun accord historique #271 rouvert. Le registre réel indique 24 complets, 7 partiels, 22 HOLD ; respecter les statuts. Vérifier le plancher de difficulté de SEF-V411-007 à l'intégration, avec le concept forcing.troisieme (pas un changement de moteur par M3). Les nouveaux QCM héritent des métadonnées des cas analogues, y compris les planchers tardifs des conventions.

## Sources
Référentiel déjà intégré dans le catalogue figé et arbitrages #271 ; iBridge (troisième couleur, 2/1, soutiens forts) et synthèses SEF 2024 Chailley (mini-maxi, relais, Splinter), liens dans les patches. Le texte intégral du SEF 2024 n'a pas été consulté. Les sources ne sont pas présentées comme des visas de paire.

## Tests ciblés exécutés avant écriture
- 245/245 IDs du lot et décisions uniques ; 7 nouveaux IDs uniques, familles uniques, aucun doublon exact main+auction avec base ; comparaison stricte de chaque old avec le blob figé.
- 252 mains (245 après patch simulé + 7 nouvelles) : 13 cartes, aucune carte répétée dans une couleur, H et shape recalculés ; 4 choix distincts et réponse présente ; prérequis présents.
- Pas de CI globale ni publication par M3 ; la recette assemblée demeure au pilote. Le test de structure ne prouve pas la validité SEF de tous les cas limites. Aucun autre fichier modifié par cette mission.

## Transmission structurée des prérequis existants
Pour SEF-V411-007, proposition explicite au pilote (à intégrer avec le nouveau corrigé, pas à appliquer à main indépendamment) : `{"concept":"forcing.troisieme","stage":3,"minSession":32,"requires":[{"concept":"forcing.base","minExposure":1},{"concept":"forcing.troisieme","minExposure":2},{"concept":"second.base","minExposure":1}]}`. Modèle SEF-V45-013 et SEF-L17-002 ; le plancher historique de la notion n'est pas abaissé. Pour SEF-L07-015, ajouter l'exposition au concept Roudi approprié à la règle des trois paliers si le pilote confirme la dépendance. Pour M3-002, le classement `red.bicolore_cher` hérite de SEF-V416-003 ; ne pas enseigner que le bicolore à saut et le bicolore cher sans saut sont identiques.

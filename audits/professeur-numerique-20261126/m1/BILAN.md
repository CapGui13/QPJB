# M1 — richesse du catalogue, lot autonome

Base f8ae2120eb893c68b4cac315b7901ece69806b87. Catalogue blob 99049d0d5790767ba991414240aa7d837c1b188e ; prérequis blob a0333a153c274ab49f8e355c4695f8116b50d967. #386/#387 et références #293, #366–369, #375, #377–381, #385 lues. Référentiel SEF et exemples de production consultés. Moteur récupéré (78480 caractères) ; pas de modification de moteur ni d'HTML. Cartographie automatisée exhaustive des 1879 objets et 99 concepts ; elle n'est pas une relecture éditoriale manuelle de chaque question.

## Objectifs à partir des lacunes observées
- Égalité mineure 3–3 : 1 famille initiale ; créer des preuves indépendantes en zone 12–14 et 18–19, avec pièges honneurs/majeure/SA. Renforcer le contraste avec 4–4 sans quota global.
- Fit majeur : une paire contrastée contrôlée à 7 H, trois contre deux atouts ; ne pas introduire des soutiens à quatre cartes avant ce principe.
- Seuil SA 7/8 sans majeure quatrième ; cas 7 H absent sous cette distribution.
- Réponses Stayman/Texas 2SA : variantes de force et de distribution manquantes, sans modifier la règle ; Texas mineur faible 7♦ et fort 6♣.
- Choix Multi-Landy : ajouter le cas positif unicolore sixième ; Michaels choix : ajouter bicolore positif 5–5 face aux cas naturels. Ne pas traiter chaque concept de faible effectif comme une lacune.

## Résultat
14 propositions, projection 1893 QCM, 99 concepts. Aucun ancien ID modifié. Chaque cas est associé à une preuve historique et à des distracteurs diagnostiques prudents. Cartographie détaillée avant/après dans cartographie.json, IDs et effectifs par concept, formes, plage H, réponses, contextes, niveaux et étapes ; famille = caseFamily déclaré, non preuve d'indépendance sémantique. Les deux questions 005/006 forment volontairement une paire contrôlée (une carte déplacée), et doivent être séparées dans une séance. Familles distinctes pour le moteur ; pas un clone à bonne enchère identique.

## Limites / HOLD
Pas d’ajout de convention litigieuse : exception ♠–♣ 5–5 (perdantes), Drury frontières de force, gambling, Texas mineurs contrés/modulations, choix de manche 5–5 avec soutiens équivalents : petits réservoirs existants mais pas de nouveau cas unique démontré dans ce lot ; à réexaminer éditorialement si nécessaire. Pour forcing.base, les cas existants mêlent plusieurs décisions naturelles et artificielles ; pas de nouveau cas sans qualification plus fine de l'unicité. Les autres concepts sont cartographiés mais non revus individuellement au niveau sémantique ; aucune prétention à l’exhaustivité des lacunes. Les cas proposés restent à valider éditorialement par le coordinateur conformément à #386.

## Tests
La fonction verify du fichier tests/professeur-numerique-m1-catalogue.cjs a été exécutée directement en JavaScript sur les deux blobs de base et les propositions exactes : {"base":1879,"concepts":99,"new":14,"projected":1893,"checks":"PASS"}. Vérifie couverture des IDs/concepts, cartes, H, forme, familles, choix, références, métadonnées et règles ciblées. Le runner Node dans le checkout, la CI, les navigateurs et la simulation globale n'ont pas été exécutés ici. La licéité générale n'est pas une preuve d'unicité éditoriale ; contrôle manuel ciblé sur ces séquences. Ne pas fusionner avant revue.

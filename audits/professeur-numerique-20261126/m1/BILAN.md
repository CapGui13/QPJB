# M1 — richesse du catalogue, lot autonome

Base f8ae2120eb893c68b4cac315b7901ece69806b87. Catalogue blob 99049d0d5790767ba991414240aa7d837c1b188e ; prérequis blob a0333a153c274ab49f8e355c4695f8116b50d967. #386/#387 et références #293, #366–369, #375, #377–381, #385 lues. Référentiel SEF et exemples de production consultés. Moteur récupéré (78480 caractères) ; pas de modification de moteur ni d'HTML. Cartographie automatisée exhaustive des 1879 objets et 99 concepts ; elle n'est pas une relecture éditoriale manuelle de chaque question.

## Objectifs à partir des lacunes observées
- Égalité mineure 3–3 : 1 famille initiale ; créer des preuves indépendantes en zone 12–14 et 18–19, avec pièges honneurs/majeure/SA. Renforcer le contraste avec 4–4 sans quota global.
- Fit majeur : une paire contrastée contrôlée à 7 H, trois contre deux atouts ; ne pas introduire des soutiens à quatre cartes avant ce principe.
- Seuil SA 7/8 sans majeure quatrième ; cas 7 H absent sous cette distribution.
- Réponses Stayman/Texas 2SA : variantes de force et de distribution manquantes, sans modifier la règle ; Texas mineur faible 7♦ et fort 6♣.
- Choix Multi-Landy : ajouter le cas positif unicolore sixième ; Michaels choix : ajouter bicolore positif 5–5 face aux cas naturels. Ne pas traiter chaque concept de faible effectif comme une lacune.

## Résultat
36 propositions, projection 1915 QCM, 99 concepts. Aucun ancien ID modifié. Chaque cas est associé à une preuve historique et à des distracteurs diagnostiques prudents. Cartographie détaillée avant/après dans cartographie.json, IDs et effectifs par concept, formes, plage H, réponses, contextes, niveaux et étapes ; famille = caseFamily déclaré, non preuve d'indépendance sémantique. Les paires 005/006, 016/017 et 018/019 sont volontairement contrôlées (une carte déplacée ou un Contre ajouté) : décision différente, séparation souhaitable dans une séance. Familles distinctes pour le moteur ; pas un clone à bonne enchère identique.

## Limites / HOLD
Pas d’ajout de convention litigieuse : exception ♠–♣ 5–5 (perdantes), gambling, Texas mineurs contrés/modulations, choix de manche 5–5 avec soutiens équivalents : petits réservoirs existants mais pas de nouveau cas unique démontré dans ce lot ; à réexaminer éditorialement si nécessaire. Pour forcing.base, les cas existants mêlent plusieurs décisions naturelles et artificielles ; pas de nouveau cas sans qualification plus fine de l'unicité. Les autres concepts sont cartographiés mais non revus individuellement au niveau sémantique ; aucune prétention à l’exhaustivité des lacunes. Les cas proposés restent à valider éditorialement par le coordinateur conformément à #386.

## Tests
La fonction verify du fichier tests/professeur-numerique-m1-catalogue.cjs a été exécutée directement en JavaScript sur les deux blobs de base et les propositions exactes : {"base":1879,"concepts":99,"new":14,"projected":1893,"checks":"PASS"}. Vérifie couverture des IDs/concepts, cartes, H, forme, familles, choix, références, métadonnées et règles ciblées. Le runner Node dans le checkout, la CI, les navigateurs et la simulation globale n'ont pas été exécutés ici. La licéité générale n'est pas une preuve d'unicité éditoriale ; contrôle manuel ciblé sur ces séquences. Ne pas fusionner avant revue.

## Complément de production : 5 cas réellement manquants
- 015 : Drury à 11 HLD plats, opposé à 10 HLD ; référence historique V4.84 et SEF-V4-097-1. Les 22 QCM drury.init/choix existants ne dépassent pas 10 H en réponse initiale.
- 016/017 : rectification normale sur 1SA avec deux atouts contre Passe sur Texas contré (même main). Le premier apprentissage était implicite dans les 16 cas de suite Texas, jamais posé directement. Stage 1 index 8 proposé, après sa1.texas. 017 conserve les prérequis historiques du Texas contré.
- 018/019 : deux refus de manche après invitation à 2SA, sans puis avec fit. Les deux exemples existants V2-M2-027/028 acceptent la manche avec 17 H, d’où les deux branches de décision manquantes. Contrastes non assimilables à des clones à réponse constante.
- Recalcul structurel des 19 additions sur les blobs et exécution directe en V8 des cinq contrôles ciblés : PASS. Résultat projeté 1898 QCM. Le test Node livré inclut ces contrôles ; il n'a pas été lancé comme processus Node. La validation de la couverture sémantique complète des 99 concepts reste non attestée.

## Production complémentaire : 11 cas (020–030)
- SEF-PN26-M1-020 (Passe) : Les sept Passes sur mineure sont tous à 1–3 H ; vérifie le dernier point avant le seuil de réponse, avec une majeure quatrième tentante.
- SEF-PN26-M1-021 (Passe) : Les sept Passes fittés sont à 0–3 H ; manque la frontière 5 HLD face au soutien simple à 6.
- SEF-PN26-M1-022 (2SA) : Les sept exemples de fit.2sa sont tous à 11 H, y compris les 12 HLD avec doubleton ; ajoute 12 H plats.
- SEF-PN26-M1-023 (2SA) : Premier 2SA fitté à 10 H revalorisés à 11 HLD ; à opposer au 10 H plat de V2-M1-039 qui répond 2♥.
- SEF-PN26-M1-024 (3SA) : Tous les 3SA de sa2.seuil ont une mineure 4e ou 5e mais pas deux mineures 4e ; discrimination Stayman contre deux couleurs quatrièmes quelconques.
- SEF-PN26-M1-025 (3SA) : Aucune question du catalogue n’a une enchère initiale 3SA correcte ; les six cas sa.gambling supposent déjà l’ouverture. Ici l’ouvreur doit reconnaître la convention.
- SEF-PN26-M1-026 (1♠) : Le seul 5–5 négatif historique a 13 H ; six perdantes avec 15 H démontrent que la force H seule ne déclenche pas l’exception.
- SEF-PN26-M1-027 (Surcontre) : Les anciens exemples positifs de Surcontre concernent le Texas Cœur ; transpose à la couleur du Contre différente avec minimum 15 H, à opposer au Passe du nouveau cas 017.
- SEF-PN26-M1-028 (3♣) : Le seul refus de modulation historique est à 15 H ; 17 H sans honneur Trèfle isole la qualité du soutien de la force.
- SEF-PN26-M1-029 (3SA) : Les deux refus historiques sont tous à 20 H ; le refus à 21 H dissocie force et soutien.
- SEF-PN26-M1-030 (4♥) : Les deux choix de manche historiques comparent quatre atouts à deux ; ce cas apprend qu’un soutien de trois suffit, même sans neuf atouts.

Le relevé des réponses par concept et par force a confirmé les frontières de réponse à 5 H, le 2SA fitté à 12 H et à 10 H + D, et l’absence de question initiale de 3SA gambling. Les autres cas isolent la force des critères de distribution, de qualité d'appui ou de perdantes. Le corps intégral du test livré, y compris la licéité des 120 options, a été exécuté en V8 sur les 30 propositions exactes et les blobs de référence : {"base":1879,"concepts":99,"new":30,"projected":1909,"checks":"PASS"}. Le processus Node/CI n’a pas été exécuté. Les chiffres 14 puis 19 mentionnés plus haut sont historiques ; total actuel 30.

## Production finale : 6 cas (031–036)
- SEF-PN26-M1-031 (1♠) : Complément contrôlé du cas 020 : cinq Piques plutôt que quatre avec la même force H ; aucune réponse à 1♠ du concept n'était à 5 H.
- SEF-PN26-M1-032 (2♥) : Le cas 021 passe avec 5 H plats ; le doubleton permet de soutenir à 6 HLD. Aucun soutien simple du concept n’était à 5 H.
- SEF-PN26-M1-033 (2SA) : Le seul 2SA du concept sa1.stayman.reponse est à 16 H. Le minimum 15 H isole la distribution de la force.
- SEF-PN26-M1-034 (3♣) : Le seul Stayman à 5 H sur 2SA possède les deux majeures quatrièmes ; une seule suffit. Contraste avec le Passe à 3 H malgré quatre Cœurs.
- SEF-PN26-M1-035 (6SA) : Les réponses quantitatives initiales sur 1SA s’arrêtent à 17 H et 4SA ; 6SA direct n’est exercé que sur 2SA. Transfert du seuil 33 H.
- SEF-PN26-M1-036 (5♦) : Les deux 5♦ historiques correspondent chacun à une seule clé. Il manque le second sens du code, quatre clés, sans chicane.

## État final du lot
36 propositions, projection 1915 QCM, 99 concepts. Les signatures de décision distinctes passent de 1767 à 1802 (métrique approximative, pas une preuve de diversité sémantique). La revue des séquences par concept, contrastes et réserves est dans revue-concepts.json. Les 99 concepts sont couverts par ce criblage ; les cas non retenus sont notés sans prétention de certification éditoriale. Les 144 choix et le corps du test de validation final ont été réellement exécutés en V8 : {"base":1879,"concepts":99,"new":36,"projected":1915,"checks":"PASS"}. La tentative de récupération locale des blobs a échoué (DNS réseau indisponible), donc pas de processus Node natif ni CI. Aucune modification du catalogue ni des prérequis. Les chiffres 14, 19, 30 ci-dessus sont les étapes historiques de production.

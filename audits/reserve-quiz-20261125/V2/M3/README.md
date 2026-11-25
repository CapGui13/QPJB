# V2-M3 — Redemandes, seconde enchère et fit

Base : 0c3da298c3a1973665f709a92d643284fcf59ccd. Contrats #320, #327, #330. Catalogue virtuel : 1628 (1595 + 33 V1). Périmètre : red, second, apres_fit.

## Bilan
Objectif : environ 40 nouveaux QCM et 20 groupes. Réalisé : **42 QCM / 21 familles contrastées**, zéro correction historique. Les groupes partagent leur clé pour éviter une exposition artificiellement gonflée. Les prérequis proviennent d'ancres figées.

- reserve-v2-m3-g01 : Cher après 2 sur 1, même bicolore 6–4 — Force suffisante ou non pour une redemande chère (2♥ / 2♠).
- reserve-v2-m3-g02 : Saut dans une majeure encore nommable — Force à distribution 6–4 constante (1♠ / 2♠).
- reserve-v2-m3-g03 : Économie après changement de couleur au palier de deux — Quatrième Carreau ou sixième Pique à force identique (2♦ / 2♠).
- reserve-v2-m3-g04 : Mini-maxi ou soutien de la mineure — Quatre Trèfles au lieu de trois, et main bicolore (2SA / 3♣).
- reserve-v2-m3-g05 : Tricolore court dans la mineure du répondant — Forme 4–4–4–1 contre unicolore sixième à force identique (3SA / 3♦).
- reserve-v2-m3-g06 : Zone forte régulière : soutien artificiel ou sans-atout naturel — Quatrième Cœur chez l'ouvreur (3SA / 2SA).
- reserve-v2-m3-g07 : Intervention et caractère libre de la redemande — Position de l'intervention : avant ou après la réponse (1SA / Passe).
- reserve-v2-m3-g08 : Surcontre de soutien ou soutien direct — Trois ou quatre Piques face à la réponse contrée (Surcontre / 2♠).
- reserve-v2-m3-g09 : Redemande libre : tenue ou fit établi — Fit Cœur versus main régulière avec arrêt Pique (1SA / 2♥).
- reserve-v2-m3-g10 : Répétition du répondant après bicolore cher — Force à longueur sixième et absence de fit dans la seconde couleur constantes (2♠ / 3♠).
- reserve-v2-m3-g11 : Sans-atout direct ou modérateur sur bicolore cher — Force du répondant, tenue dans la couleur non nommée conservée (2SA / 3SA).
- reserve-v2-m3-g12 : Soutien direct de la seconde couleur chère ou chemin modérateur — Force suffisante pour rendre le fit Cœur forcing de manche (2SA / 3♥).
- reserve-v2-m3-g13 : Bicolore économique après 1SA : préférence ou laisser jouer — Nombre de Carreaux, à force faible et deux Piques constants (2♠ / Passe).
- reserve-v2-m3-g14 : Après répétition forte de l'ouvreur : arrêt ou manche — Force à fit huitième Cœur constant (Passe / 4♥).
- reserve-v2-m3-g15 : Fit dans la seconde couleur économique : partielle ou invitation — Force du répondant avec cinq Carreaux (Passe / 3♦).
- reserve-v2-m3-g16 : Seconde majeure de l'ouvreur ou préférence mineure — Quatre Piques ou cinq Trèfles avec quatre Cœurs et force constante (2♠ / 2♣).
- reserve-v2-m3-g17 : Essai à la couleur : emplacement des honneurs — Mêmes H et distribution, Roi-Dame dans la couleur d'essai ou ailleurs (4♠ / 3♠).
- reserve-v2-m3-g18 : Après fit simple : barrage ou rester au palier de deux — Neuvième atout présumé avec force minimale et vulnérabilité favorable (Passe / 3♠).
- reserve-v2-m3-g19 : Essai généralisé ou essai ciblé dans la seconde majeure — Existence d'une seconde couleur quatrième significative (3♥ / 2SA).
- reserve-v2-m3-g20 : 2SA fitté : alternative à Sans-Atout ou manche majeure — Qualité des atouts et concentration des tenues extérieures (3SA / 4♠).
- reserve-v2-m3-g21 : 2SA fitté Cœur : rechercher un second fit ou conclure — Quatrième Pique chez l'ouvreur (3♠ / 4♥).

## Contrôle local
Calcul automatique de H et des distributions ; 13 cartes, pas de rang doublé dans une couleur, quatre choix distincts, bonne réponse présente, IDs uniques, recherche de collision main/séquence normalisée contre le catalogue virtuel et dans le lot. Vérification rédactionnelle des décisions et des ancres au moment de la construction. Pas de CI, pas de test global, pas de modification du catalogue ni des prérequis.

## Limites
- Les concepts rares présents dans les rubriques mais attribués aux autres missions (forcing.troisieme, forcing.troisieme.suite, michaels.defense, chelem.quantitatif.suite, chelem.splinter.variante) ne sont pas enrichis ici.
- Les variantes compétitives du 2SA fitté répondant relèvent du propriétaire des compétitives ; pas de nouveau traitement non attesté.
- Les cas de 3SA artificiel dans le silence et 2SA mini-maxi sont strictement limités aux séquences attestées ; aucun changement de règle locale.
- Les familles historiques restent inchangées. Les groupes nouveaux visent des contrastes utiles ; leurs décisions élémentaires peuvent être déjà enseignées, sans prétendre inventer des règles. Réexamen sémantique transversal à la consolidation.

Livraison par commit unique sur reserve-quiz/v2-m3-redemandes. Aucun merge, PR vers main, intégration ou publication.

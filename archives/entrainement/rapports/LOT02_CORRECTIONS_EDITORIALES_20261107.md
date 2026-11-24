# Lot 02 — corrections éditoriales (7 novembre 2026)

Cette branche corrige **7 exercices** déjà publiés et nettoie la ponctuation d'une huitième fiche. **Aucun ajout ni retrait** : 627 enchères + 185 exercices de carte = 812. IDs, cartes, enchères-clés, distracteurs, contrats, sièges et ordre restent inchangés.

- BH-133 n°1 : divergence 1♥ sujet / 1♠ corrigé explicitée dans la question.
- BH-136 : 1SA sans arrêt ♠ présenté seulement comme accord particulier.
- BH-140 : vulnérabilité favorable explicitement ajoutée comme hypothèse pédagogique, et alternative Passe reconnue.
- BH-129 carte : accord préférentiel annoncé avant le plan de retour à ♦.
- BH-132 maniement : correction d'une erreur de fond détectée en relecture indépendante. Un coup de sonde ♣A oblige Sud (♣42) à fournir l'une de ses deux petites cartes, ce qui empêche ensuite deux impasses successives depuis Sud. Vérification combinatoire des 6 Trèfles manquants : deux impasses privilégiées (43,2 % contre 28,3 % pour ♣A puis une seule impasse).
- BH-091 carte : suppression de la fausse reprise à Sud.
- BH-037 maniement : sens de jeu corrigé Nord → Sud vers le Valet.
- BH-104 chelem : nettoyage de ponctuation.

Cache qpjb-v62, ressources 20261107l07, version visuelle V7.49. Les statuts de relecture pédagogique sont conservés : ces textes doivent rester soumis au contrôle indépendant avant levée de ces statuts. La correction ne concerne pas le Quiz SEF.


## Relecture pédagogique finale du maniement ♣ARV109 / ♣42

Hypothèses : les mains Nord/Sud sont connues, les six Trèfles manquants (D, 8, 7, 6, 5, 3) sont répartis sans information supplémentaire entre Est et Ouest, chaque défenseur détient 13 cartes et toutes les communications extérieures nécessaires sont disponibles. Ces probabilités comparent **deux lignes fixées à l'avance** ; elles ne signifient pas que toutes les adaptations du maniement sont recensées.

- Deux impasses successives depuis Sud réussissent à cinq levées lorsque ♣D est chez Ouest dans une longueur de **1 à 4** Trèfles : 4 492 930 configurations pondérées sur 10 400 600, soit **43,1988 %**.
- ♣A d'abord, puis une impasse depuis Sud réussit si ♣D est chez Ouest dans une longueur de **1 à 3** cartes, ou si ♣D est sèche chez Est : 2 939 300 sur 10 400 600, soit **28,2609 %**.
- Le nombre de configurations est calculé par la formule C(26,13) au dénominateur ; pour une Dame en Ouest avec k Trèfles, la contribution est C(5,k-1) × C(20,13-k). Par symétrie, la Dame sèche en Est a la même contribution que la Dame sèche en Ouest.
- Le coup de sonde préalable n'autorise pas deux impasses successives car Sud doit fournir l'un de ses deux petits Trèfles sur ♣A.

Les sept autres fiches ont été revues sur les mains, séquences, orientations, choix et nuances tels que présents sur la branche. Les alternatives recevables (notamment 2♣/2♦ après Contre Spoutnik et Passe sur 4♥) restent reconnues selon les accords et la vulnérabilité. Cette relecture des données **ne remplace pas** un nouvel examen visuel de tous les PDF originaux. Les statuts `relecture_pedagogique_necessaire` sont conservés.

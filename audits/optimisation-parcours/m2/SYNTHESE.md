# M2 — bilan final, 26 novembre 2026

**Décision : conserver le moteur de référence V1 par défaut.** Les trois politiques sont livrées comme module autonome expérimental, sans intégration de production. Aucun candidat ne satisfait tous les critères pré-déclarés dans CONTRAT.md. Une baisse des reprises exactes n'est pas à elle seule une preuve d'amélioration de la mémorisation.

## Méthode et reproductibilité
- Base immuable : dc5ecced63716672813905472bf32c4505253665. Catalogue : 1 879 QCM, 22 thèmes, 1 520 familles, 99 concepts.
- 5 profils (autonome, modéré, échecs, aides, faiblesse Passe), 3 graines (11, 29, 47), 4 modes (base, A, B, C), 153 séances par trajectoire : **60 trajectoires, 9 180 séances, 91 800 réponses simulées, 180 points de mesure** aux horizons 20, 65 et 153.
- Les horizons sont des snapshots cumulés des mêmes trajectoires, pas 180 trajectoires indépendantes. Le profil autonome répond toujours correctement, donc les graines n'introduisent pas de variabilité dans ses réponses.
- A : échéance concept + rappel d'une autre famille/main. B : A + bonus d'entretien. C : substitution conservatrice, famille déjà rencontrée, même concept/thème/difficulté, délai minimal 3 séances, sinon rappel exact V1.
- Les simulations exécutent le source exact du moteur figé dans un banc isolé, avec points d'injection contrôlés. Le catalogue, la logique d'éligibilité, les quotas, le stockage et la production restent intacts.
- Les 20 fichiers JSON profil/graine sont les données brutes de la matrice. Tests et exécution : moteur JS V8 isolé, assertions unitaires exécutées avec équivalents stricts de node:assert; commandes Node reproductibles dans le dépôt. La CI native et le navigateur de production ne sont pas déclarés validés.

## Résultats agrégés
Reprises d'ID, reprises à <=2 séances, reprises exactes après faiblesse et retours sur autre famille ET autre main : sommes sur les 12 trajectoires non autonomes par mode. Couverture : moyenne sur les 15 trajectoires. H = nombre de séances.

| H | Mode | ID uniques moyens | Familles moyennes | Reprises ID | ID <=2 | Exact après faiblesse | Autre famille/main | Thèmes moyens |
|---:|:---|---:|---:|---:|---:|---:|---:|---:|
|20|base|176,67|176,67|350|50|36|772|14|
|20|A|195,40|195,27|69|53|24|811|14|
|20|B|195,40|195,27|69|53|25|800|14|
|20|C|185,93|176,67|211|50|33|761|14|
|65|base|572,67|572,67|1160|50|140|3115|22|
|65|A|643,53|642,20|97|53|28|3192|22|
|65|B|642,47|641,40|113|53|28|3132|22|
|65|C|604,07|572,67|689|50|86|3116|22|
|153|base|1327,20|1298,47|2997|50|315|8150|22|
|153|A|1418,60|1341,33|1626|53|43|8281|22|
|153|B|1420,73|1345,13|1606|53|39|8251|22|
|153|C|1382,87|1298,87|2162|50|167|8180|22|

À H153, parmi les retours observés après faiblesse, part autre famille/main : base 8150/8478 (96,13 %), A 8281/8341 (99,28 %), B 8251/8312 (99,27 %), C 8180/8372 (97,71 %). Le nombre de retours augmente de 1,61 %, 1,24 % et 0,37 %, loin de la cible 15 %. Le taux initial est déjà près du plafond : ne pas confondre réduction des rappels exacts et amélioration prouvée du transfert. Les reprises ID <=2 séances sont toutes observées avant ou à S20 dans la matrice; elles ne baissent pas. Reprises famille <=2 à H153 : base 52, A 62, B 58, C 50. Toutes les trajectoires couvrent les 22 thèmes dès H65. Les trous maximaux des fondamentaux agrégés sont de 5 séances à H153.

## Garde-fous et hétérogénéité
P90 des délais de premier retour sur un concept après erreur, moyenne des trois P90 par profil à H153 (les P90 ne sont pas agrégés en un quantile global).

| Profil | Base | A | B | C |
|---|---:|---:|---:|---:|
|Modéré|21|21|32,33|21,33|
|Échecs|16|17,33|17,33|16,33|
|Aides|18|18,33|22,67|15,67|
|Faiblesse Passe|14,33|5,33|5,67|17,33|

Les mêmes délais après réussite assistée dans le profil aides : 16 / 18,33 / 20 / 17,67. Le profil autonome n'a pas d'épisodes de faiblesse. P90 moyen de retour après réussite autonome tous profils : 14,67 / 14,60 / 11,73 / 14,53. C conserve mieux les difficultés faibles, mais perd le bénéfice de A sur la faiblesse ciblée.

H153, difficultés 4–5 cumulées sur les 6 trajectoires échecs/aides : base 444/9180; A 620/9180; B 650/9180; C 449/9180. A/B accélèrent la consommation des familles faciles et déplacent le profil de difficulté; causalité précise à confirmer, mais la régression observée suffit à rejeter ces candidats en l'état. Le seuil de surveillance utilisé est +1 point de part de difficultés 4–5 pour les profils faibles (référence historique #293).

Contrôles par point de mesure (45 par candidat, horizons inclus) : familles >=95 % de la référence; pas de perte de thèmes; écart p90 erreur/aide <=+2 séances; trou fondamentaux <=+1 séance; difficulté faible <=+1 point. A : 9 points en violation (5 p90 erreur, 1 aide, 5 difficulté, 1 fondamentaux). B : 13 (8 erreur, 5 aide, 5 difficulté, 1 fondamentaux). C : 5 (3 erreur, 2 aide). Un point peut cumuler plusieurs violations. Aucun défaut de couverture familles/thèmes selon ces seuils. Les trois échouent aux objectifs de reprises courtes et de transfert; aucun seuil n'a été changé pour forcer une adoption.

## Échéances réelles et sauvegardes — contrôle complémentaire
Fichier echeances-modere-11.json : 4 modes, profil modéré, graine 11, jusqu'à H153. Les opportunités échues éligibles sont comptées **par séance**, donc un même rappel non servi peut être compté plusieurs fois. Ne pas les lire comme un nombre d'élèves ni de rappels distincts. Le calendrier concept est la politique effective de rappel/bonus des candidats A/B à partir de S4, et un diagnostic contrefactuel pour base/C. Le calendrier ID reste celui du moteur V1 pour tous. Un concept est considéré servi si le deck contient un exercice de ce concept, même si ce n'est pas le rappel explicitement priorisé.

| Mode | ID échus éligibles | ID servis | ID à l'heure | Concepts échus éligibles | Concepts servis | Concepts à l'heure |
|---|---:|---:|---:|---:|---:|---:|
|base|102224|151|4|10371|627|117|
|A|112613|27|3|10551|667|175|
|B|112557|22|3|10129|701|218|
|C|106650|91|5|10223|651|112|

Le retard maximal d'un concept servi est de 111/122/108/105 séances. Les détails de retard cumulé, échéances faibles servies et snapshots 20/65/153 sont dans le JSON. Ce contrôle confirme que le calendrier ID ne correspond pas à une promesse de service exact à chaque échéance, et qu'une meilleure ponctualité sur les concepts ne garantit pas la qualité du reste du parcours.
Les 612 decks sont dans le pool éligible du moteur. 16 aller-retours export/import de séance active (ordre et réponses inchangés), 12 de progression terminée, 4 de sauvegarde sans journal : tous passent. Les 60 trajectoires principales vérifient également decks de 10 IDs/familles distincts, règles S1/S2/S3, calendrier et chargement des entrées aux 3 horizons.

## Conclusion et limites
Le module est utilisable en isolation et le contrat d'intégration décrit les points d'injection. Base = seul mode recommandé pour production à ce stade. A est le signal de recherche le plus intéressant pour les faiblesses ciblées; C est le signal le plus conservateur pour les profils fragiles. Ces résultats ne justifient pas leur activation. En particulier, A réduit les reprises exactes post-faiblesse de 86,35 % mais ne satisfait pas tous les garde-fous.
Les profils stochastiques simulent des réponses, pas une courbe d'apprentissage validée. Les tirages sont appariés par position et graine, non par QCM lorsque les decks divergent. Le retour après erreur/aide est mesuré sur l'exposition suivante et censuré en fin de trajectoire; le nombre de retours observés doit être lu avec les compteurs pending/overdue. Aucun effet de mémorisation humaine n'est établi. La CI et la recette intégrée M1/M2/M3 relèvent du coordinateur et ne sont pas revendiquées ici.

**Mission M2 : livrables et comparaison terminés. Politique de référence conservée. PR brouillon, aucun merge dans main.**

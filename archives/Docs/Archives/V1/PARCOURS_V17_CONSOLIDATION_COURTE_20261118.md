# QPJB — parcours guidé V1.7 : consolidations courtes, selon les QCM originaux

## Problème concret (catalogue analysé le 18 novembre 2026)

La V1.6 exigeait **10 familles distinctes** pour proposer une consolidation : ce seuil rendait inaccessibles certaines micro-compétences pourtant difficiles, malgré des QCM existants et validés.

Le décompte réel sur les **1 523 QCM Quiz SEF** a donné :

| Micro-compétence | QCM audités par taxonomie | Familles distinctes | V1.6 | V1.7 |
| --- | ---: | ---: | --- | --- |
| Décider de passer (`ouv:passe`) | 14 | 9 | Non proposée | 9 questions |
| Intervenir sur un deux faible (`intervenir:barrage`) | 5 | 5 | Non proposée | 5 questions |
| Réveiller après une ouverture au palier de deux (`reveil:barrage`) | 2 | 2 | Non proposée | Non proposée : corpus trop restreint |
| Répondre à 1♣ (`mineur:1♣`) | 43 | 30 | 10 questions | 10 questions |

Bilan structurel : **24 des 25 micro-compétences classées** possèdent maintenant assez de familles originales pour un module autonome de 4 à 10 questions, si une faiblesse est constatée et si la rubrique est débloquée. La 25e reste disponible dans le parcours et les révisions ordinaires ; seul le module ciblé est bloqué.

## Politique algorithmique V1.7

- Ne proposer une consolidation que si le suivi existant contient au moins deux essais et un score **≤ −2**, sur une micro-compétence déterministe ou un axe transversal explicitement audité.
- Sélectionner jusqu'à **10 familles distinctes** et, lorsque l'offre réelle est plus petite, permettre **4 à 9 questions**. En dessous de quatre familles, ne pas proposer la séance ciblée.
- Respecter les limites de diversité et de difficulté de V1.6 ; privilégier les questions originales encore inconnues, puis les anciennes familles pas revues récemment.
- Conserver le mode normal strictement à **10 QCM**, la sauvegarde `qpjb-sef-parcours-01`, la reprise de séance, l'historique, et une consolidation au plus par palier principal.
- Adapter le nombre affiché sur la carte d'accueil et la bannière de séance au **nombre réellement tiré**, et non à dix par défaut. Aucune question n'est créée, dupliquée ou reformulée.

## Validation

- Tests Node : 10 familles en couverture complète ; 8 dans un corpus restreint ; cas réels de 9 et 5 familles ; refus propre à 2 ou 3 familles ; rechargement, enregistrement, achèvement, blocage de re-consolidation.
- Tests navigateur Chromium et WebKit : affichage « 5 situations », séance de 5, achèvement, compteur normal intact, refus lorsque seules 2 familles existent.
- Tests de régression du parcours principal et d'intégrité des **1 523 QCM**. Catalogue, réponses, explications et autres modules d'Entraînement non modifiés.
- Cache PWA `qpjb-v91`, module `quizz-parcours.js?v=9`.

## Limites assumées

Les variantes dans une même famille pédagogique ne sont pas comptées comme des situations distinctes. Il n'y a **aucune synthèse IA** ni génération de nouvelles donnes. Quand moins de quatre familles existent pour une cible, le parcours normal et les révisions existantes restent accessibles : un module ciblé ne prétend pas avoir du contenu supplémentaire.

**Publication uniquement après tous les tests CI verts** (intégrité et navigateurs).

# V2-M6 — Qualité pédagogique : barrages, contre, réveil

Contrats #342, #349, #355. Base `4678fcba3a45333c968d3c8c04c50e88446d4532`, réserve V1 `04b57eab66605e55f71101c5d0e19321d85d64dd`. Branche `coherence-integrale/v2-m6-barrages-contre-reveil`.

## Bilan

- 225 / 225 QCM examinés, 57 patches utiles pour une cible initiale de 55, 167 OK, 1 réserve héritée (SEF-V476-005), aucune nouvelle réserve.
- 124 patches V1 projetés, dont 2 modifications de prérequis ; 0 divergence sur old, 20 réserves V1 conservées hors arbitrage. M6 : 32 corrections V1 conservées, toute retouche d'un même champ repose sur sa valeur virtuelle.
- 56 patches portant uniquement sur explain ; 1 porte aussi sur context (SEF-L42-004 : retire l'obligation de réveiller). Aucun changement de réponse, de main, de choix, d'ID, de difficulté, de famille ou de prérequis en V2.

| Thème | Examinés | Patch | OK | Réserve héritée |
|---|---:|---:|---:|---:|
| contre | 76 | 21 | 54 | 1 |
| barrage | 76 | 22 | 54 | 0 |
| reveil | 73 | 14 | 59 | 0 |

## Axes

- Contre : réponse obligatoire/libre, saut relatif, cue-bid fort ou moyen, force de manche avec/sans arrêt, mini-cue-bid et redemande du contreur.
- Barrages : position et vulnérabilité, fit compétitif distinct de la manche constructive, relais interrogatif (minimum avant maximum, honneur annexe avant courte), contrôle fitté et conséquence d'un contrôle sauté.
- Réveil : 8–13 HL naturel, saut constructif 11–13 HL, contre de force ou de distribution, tenue et zones de 2SA selon le palier adverse, contraste entre réveil et quatrième joueur derrière soutien.

## Contrôles réalisés

Lecture des trois issues, de l'index V1 et des six patch.json ; reconstruction du catalogue figé et de la table de prérequis avec vérification des valeurs old sur 124 propositions et 2 métadonnées. Revue des 225 exercices virtuels (main, H, forme, séquence, choix, réponse et corrigé). Vérification mécanique : unicité des ID, couverture, 13 cartes/rangs/absence de doublon par couleur, H, shape, quatre choix distincts contenant la réponse, existence des prérequis, old exact des patches V2. Résultats détaillés dans review.json. Pas de CI globale.

## Limites et transmission V3

Aucun arbitrage de la réserve V1 SEF-V476-005 sur la frontière à 11 H. Pas de consultation externe nouvelle : les sources sont les ancres du catalogue virtuel effectivement lues, les contrats et les patches V1. Les conventions locales et décisions historiques priment. Pas de modification de production, aucune fusion ou publication. L'inventaire transversal de difficulté/prérequis et l'arbitrage global restent à V3/pilote. Les exemples contrastés sont utilisés comme preuves de cohérence interne, pas comme validation universelle d'une convention.

# V2-M4 — Compétition : qualité pédagogique des corrigés

Contrats #342, #349, mission #353. Base catalogue `4678fcba3a45333c968d3c8c04c50e88446d4532` ; réserve cumulative V1 `04b57eab66605e55f71101c5d0e19321d85d64dd`. Branche `coherence-integrale/v2-m4-competition`.

## Bilan

- 328/328 QCM examinés (79 intervenir, 80 reponse_inter, 169 apres_inter).
- Cible initiale 60 améliorations ; 64 patches utiles, 258 conservés, 6 réserves V1 maintenues, aucune nouvelle réserve formelle.
- 64 explications et 11 contextes proposés ; 0 changement de réponse, de choix, de main, de famille, de niveau ou de prérequis ; 0 ajout/suppression.
- Dépendances V1 : SEF-V418-007. La valeur old de chaque proposition est tirée de la projection V1, et non du catalogue de base.

| Thème | Total | OK | Patch | Réserve V1 |
| --- | ---: | ---: | ---: | ---: |
| intervenir | 79 | 69 | 10 | 0 |
| apres_inter | 169 | 130 | 34 | 5 |
| reponse_inter | 80 | 59 | 20 | 1 |

## Apports

Séparer force, tenue et distribution pour l'intervention à SA ; comparer les seuils de soutien et les unités H/HL/HLD ; distinguer les réponses du n°4 selon la prise de parole du n°3, et les réponses après un contre ou un bicolore ; expliquer la différence de statut forcing entre ouverture de un, deux faible et intervention adverse ; comparer les sauts en majeure, rencontre et Splinter en comptant les paliers disponibles. Corrigés déjà suffisants conservés. Les quelques contextes modifiés retirent un indice qui donnait la règle ou le choix, tout en conservant la séquence et le système.

## Contrôles réalisés

Lecture des trois issues, de l'index V1, des six patch.json V1, du catalogue et de la table de prérequis figés ; projection des 124 patches et des deux propositions de prérequis, vérification des valeurs old V1. Vérification locale des 328 mains (13 cartes, H, distribution, cartes uniques dans chaque couleur), quatre choix distincts avec réponse présente, prérequis présents, couverture des IDs et unicité, exactitude de chaque old V2, absence d'ajouts et de changements de réponse. 0 écart mécanique. Les 328 corrigés ont été examinés avec leurs mains, séquences, choix et réponses ; les contextes des cas ciblés ont été lus pour les modifications. Pas de CI globale ni de preuve externe nouvelle : les propositions reposent sur les accords et ancres du catalogue virtuel. Les formulations ne valent pas arbitrage d'une variante.

## Réserves et signaux

Les six réserves V1 M4 sont rappelées séparément sous reservesV1 et dans review.json ; reserves ne contient que les nouvelles réserves. Aucun HOLD #271 rouvert. Les autres réserves V1 restent dans leur lot d'origine. Signal SEF-L13-009 déjà connu : classement V3. Les formulations du Truscott fort 3SA (SEF-L24-002 et SEF-L44-003) diffèrent sur la borne haute ; à harmoniser en V3 sans changer les exemples à 15 HLD. Les sources sont les contrats, les audits et les cas repères du catalogue ; aucun nouvel accord de paire adopté. Pas d'application, intégration, fusion ou publication. Le SHA de livraison sera consigné sur #353.

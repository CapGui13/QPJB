# M6 — Laboratoire indépendant de validation (#419 / #425)

Base immuable : `2d336054bc91fbd6ac762c093ecb5ec6da9f97e8`. Aucune modification du moteur, du catalogue, de la production ou du workflow commun. M6 observe et compare ; la décision de raccordement M1–M5, les arbitrages et la publication appartiennent au coordinateur.

## Exécuter
- `node tests/coherence-concrete-m6-unit.cjs` : métriques et cas négatifs.
- `node tests/coherence-concrete-m6-contracts.cjs` : contrats normalisés sur fixtures, pas une preuve de conformité des modules M1–M5 réels.
- `node tests/coherence-concrete-m6-campaign.cjs baseline` : voir l'aide du script pour profil, graine, horizon et dossier.
- Le mode `pair` compare le moteur de la base et celui du checkout candidat ; le mode `matrix-pair` couvre les 18 couples. Le script écrit les traces JSON, fiches Markdown et le registre par horizon. Le mode `matrix` sert à constituer la référence.
- `workflow-proposal.yml` : proposition inactive, destinée à une recette technique isolée ; ne pas la fusionner dans la production.
- `tests/coherence-concrete-m6-aggregate.cjs` : validation des 18 archives de contrôle d'identité.

La politique de réponse fixe et le calendrier sont identiques entre avant/après. Une comparaison est rejetée si la référence, le profil, la graine ou le catalogue ne correspondent pas. Les changements de métadonnées nécessitent un manifeste explicite. L'ordre est la suite réellement rendue par start ; les motifs natifs sont distingués des interprétations de rôle/position et de l'objectif dominant observé. Un objectif observé n'est pas une intention pédagogique prouvée.

## Mesures et contrôles
Les indicateurs couvrent les familles distinctes, concepts, thèmes, répétitions exactes/miroirs, séries thématiques, sauts de difficulté, réactivation, prérequis, preuves autonomes et dette des fondamentaux, temps de sélection p95, écarts de composition et d'ordre. Le score d'ordre ne remplace pas un jugement didactique ; un score élevé n'exclut ni dispersion ni progression mal choisie. Les règles historiques sont conservées et les régressions sont évaluées par profil et graine, pas uniquement en moyenne. Voir le code du comparateur pour les seuils explicites. Les contrôles négatifs vérifient que le banc peut détecter les violations, pas seulement accepter une référence.

## Preuves réellement disponibles à ce stade
- 197 assertions unitaires et 22 assertions sur contrats normalisés : PASS en V8, fichiers committés.
- 18 trajectoires de cinq séances, 900 QCM réels du moteur de base, 90 reprises actives : zéro violation structurelle ou de prérequis détectée.
- Familles distinctes sur 50 questions : 43 à 50 ; concepts : 12 à 14. Aucun des défauts d'ordre mesurés dans cet horizon. Une dette à seuil >8 séances est trivialement nulle à S5 ; ne pas en tirer une conclusion longitudinale.
- Sept IDs ont une dérogation historique effective aux métadonnées brutes pour le fit 5–3. Le banc observe metadata(q) et archive les deux versions sans changer la règle. 
- Les 18 résultats détaillés sont consignés dans register.json. Les traces exhaustives à S180, les suites natives et le navigateur restent à attester par la recette isolée et/ou la recette d'intégration. Le terminal local ne résout pas github.com ; aucune exécution Node sur checkout réel n'est revendiquée.

## Avant/après et décision
La branche M6 ne change aucune question ni sélection. Un contrôle d'identité est attendu ; il ne constitue pas un résultat avant/après des missions M1–M5. Les candidats intégrés n'existent pas dans cette branche. Aucun gain pédagogique ni absence de régression à S180 n'est revendiqué sans archives vérifiées. Pas de merge.

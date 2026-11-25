# Réserve V2 — M4 interventions

Base : `0c3da298c3a1973665f709a92d643284fcf59ccd` (réserve V1, 1628 QCM virtuels ; 14 réserves intactes). Contrats #320, #327, #331.

## Bilan
Cible 40 QCM / 20 groupes. Réalisé 40 / 20. Aucun patch historique, aucune intégration. Priorité : réveil sur deux faible (4 familles observées). Puis contraste par position, palier, force, qualité, forme, réponse au contre, soutien fort et Texas après 1SA. Michaëls exclus (M5).

- intervenir.base : 62 QCM virtuels, 44 familles observées, 10 ajouts, 6 groupes concernés.
- contre.base : 49 QCM virtuels, 41 familles observées, 8 ajouts, 4 groupes concernés.
- reponse_inter.base : 65 QCM virtuels, 54 familles observées, 6 ajouts, 3 groupes concernés.
- reveil.base : 51 QCM virtuels, 37 familles observées, 2 ajouts, 2 groupes concernés.
- intervenir.deux_faible : 5 QCM virtuels, 5 familles observées, 2 ajouts, 1 groupes concernés.
- contre.deux_faible : 15 QCM virtuels, 15 familles observées, 4 ajouts, 2 groupes concernés.
- michaels.reveil : 10 QCM virtuels, 10 familles observées, 0 ajouts, 0 groupes concernés.
- reveil.deux_faible : 4 QCM virtuels, 4 familles observées, 6 ajouts, 3 groupes concernés.
- intervenir.sa.suite : 7 QCM virtuels, 7 familles observées, 2 ajouts, 1 groupes concernés.

Chaque groupe comporte deux décisions différentes et une clé partagée ; les deux groupes transversaux intervention/réveil sont comptés une seule fois au total. Les ancrages historiques attestent les règles et fournissent les métadonnées, sans prétendre à une nouvelle validation indépendante. Les seuils tactiques sont contextualisés.

## Contrôle local réalisé
Extraction du training-data et des prérequis figés ; lecture de l'index et des six patchs V1 ; contrôle groupé des 40 mains (13 cartes, rangs uniques par couleur, H et forme calculés), des quatre choix distincts, de la présence de la réponse et de la légalité du palier de contrat, des signatures main/séquence face aux 1628 QCM virtuels, des clés de famille et du périmètre. Métadonnées recopiées des ancres existantes ; relecture pédagogique au fil de la rédaction, pas de validation indépendante. Aucun test global. Les décisions déjà attestées servent de repères : les nouvelles familles contrastées restent soumises à l'arbitrage de consolidation.

Livraison : quatre fichiers uniquement, SHA indiqué dans le commentaire de #331. Aucune PR, fusion, publication ni modification de production.

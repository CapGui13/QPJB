# AUDIT3000-F — revue partielle, passe 1

Base ccd8f20811b9531bbfccb8352ec60953dd7d07cb, issue #562 et contrat #556. Branche exclusive ; aucune modification commune.

## Bilan
- 436 IDs attendus et retrouvés sur 3000 IDs catalogue et prérequis, tous uniques.
- 40/436 relus individuellement, verdicts provisoires : {"VALIDE":20,"ARBITRAGE":4,"RECLASSER_REFORMULER":16} ; 16 QCM complets corrigés ; 3 ajouts proposés aux groupes ; aucun prérequis modifié.
- 136 IDs sans groupe direct dans programme-normalise.json, à distinguer du réservoir global ; absence n'est pas preuve d'une erreur. Ne pas réintégrer en masse.
- Comparaison de signatures (enchères, réponse, honneurs par couleur, forme) sur catalogue entier : deux candidats proches dans les 40 premiers, V45-011/Q400-D-030 et C2-010/Q400-D-092. Doublons sémantiques non exhaustivement arbitrés. Les contrastes 0/3, As/Roi d'atout, 2 clés avec/sans Dame et espace d'interrogation sont conservés.
- Point doctrinal à arbitrer : V45-017, quatrième couleur 1♠ économique, traitement catalogue vs lecture SEF 2024 p.53. Ne pas imposer une convention externe sans arbitrage.

## Contrôles réellement exécutés
Calcul JS sur données réelles : 436/436 mains de 13 cartes, H, forme, rangs non dupliqués par couleur, quatre choix distincts et réponse incluse, minSession des groupes directs ; zéro anomalie pour ces contrôles. Catalogue 3000, IDs uniques. 40 verdicts uniques et tous présents dans périmètre, patches reliés aux verdicts, groupes proposés existants. Contrôles structurels ne valent pas revue pédagogique.

Tests Node du dépôt non exécutés : accès aux fichiers via GitHub, pas de clone/exécution Node du dépôt dans cette passe. Légalité complète des séquences et comparaison sémantique globale restent à approfondir. Références externes consultées : FFB manuel cycle 2 séance 13 (p.79–80), synthèse des modifications SEF 2024 chapitre 6, iBridge ouverture 2♣, Chailley SEF 2024 p.53. Références RKCB internes, pas de certification externe.

## Statut
INCOMPLET : 396 IDs sans verdict individuel, pas de validation globale. Aucune fusion. Ne pas intégrer les patches avant revue coordinateur.

# Bilan comparatif AUDIT3000 — décision de non-activation

## Références et périmètre

- Référence pré-audit exacte : `ccd8f20811b9531bbfccb8352ec60953dd7d07cb`.
- Candidat technique contrôlé : `4c7ac7ca05ee65febfd440f2b25225eb450ead6b`.
- [Campagne expérimentale complète](https://github.com/CapGui13/QPJB/actions/runs/46080834800) : 30/30 jobs, 6 profils × 5 graines, 180 séances × 5 trajectoires par scénario = 27 000 séances simulées (150 trajectoires). 18 scénarios initiaux (11,47,103), 12 nouveaux (211,307).
- [Répétition sur candidat final](https://github.com/CapGui13/QPJB/actions/runs/46081177872) : 30/30 jobs exécutés ; agrégats ci-dessous calculés sur la première campagne, pas un double comptage.
- Quatre politiques comparées au même pré-audit : témoin actuel, rappel fondamental renforcé, transfert renforcé, combinaison. Toutes les variantes expérimentales restent non activées.
- 0 violation structurelle dans les 30 résultats de la première campagne. Un job expérimental vert indique exécution sans violation structurelle ; il ne signifie pas absence d'alerte pédagogique.

## Résultat agrégé

| Politique | Sans alerte (18 initiaux) | Sans alerte (12 nouveaux) | Sans alerte (30) | Occurrences d'alertes | Scénarios avec alerte vs témoin actuel |
|---|---:|---:|---:|---:|---:|
| Actuel | 10 | 9 | 19 | 31 | 0 |
| Fondamentaux | 8 | 7 | 15 | 47 | 7 |
| Transfert | 11 | 7 | 18 | 20 | 11 |
| Combiné | 11 | 5 | 16 | 22 | 16 |

Une occurrence = un seuil franchi à un point de contrôle. Plusieurs seuils peuvent être franchis dans un même scénario ; les occurrences ne sont pas des élèves distincts.

### Deltas cumulés à S180 par rapport au pré-audit (30 scénarios)

| Politique | Réponses indépendantes | Preuves | Transferts | Dette totale | Dette fondamentaux | Rétention 30j, delta moyen (points %) |
|---|---:|---:|---:|---:|---:|---:|
| Actuel | +89 | +29 | +78 | +1086 | -199 | -0,0733 |
| Fondamentaux | +416 | -20 | -124 | +2111 | -12414 | -0,0387 |
| Transfert | +73 | +13 | +151 | +2654 | +25 | +0,0287 |
| Combiné | +517 | +25 | -23 | +3685 | -12385 | -0,0063 |

La dette est un cumul d'échéances non servies, non un nombre d'élèves ; une diminution est favorable. Les preuves et la rétention sont des indicateurs de l'agent synthétique, pas une mesure d'effet réel. La moyenne peut masquer les trajectoires défavorables.

### Occurrences d'alertes par scénario (actuel / fondamentaux / transfert / combiné)

| Profil | Graine | Alertes |
|---|---:|---|
| autonome | 11 | 0 / 0 / 1 / 1 |
| autonome | 47 | 1 / 2 / 0 / 2 |
| autonome | 103 | 0 / 1 / 1 / 1 |
| autonome | 211 | 0 / 0 / 1 / 1 |
| autonome | 307 | 0 / 2 / 0 / 2 |
| intermediaire | 11 | 1 / 1 / 0 / 0 |
| intermediaire | 47 | 1 / 0 / 2 / 0 |
| intermediaire | 103 | 0 / 2 / 0 / 0 |
| intermediaire | 211 | 0 / 1 / 0 / 1 |
| intermediaire | 307 | 0 / 0 / 0 / 0 |
| faible | 11 | 2 / 3 / 2 / 2 |
| faible | 47 | 0 / 0 / 0 / 0 |
| faible | 103 | 6 / 9 / 0 / 0 |
| faible | 211 | 0 / 0 / 4 / 0 |
| faible | 307 | 8 / 5 / 0 / 1 |
| cible | 11 | 1 / 5 / 0 / 2 |
| cible | 47 | 0 / 2 / 1 / 0 |
| cible | 103 | 0 / 0 / 0 / 0 |
| cible | 211 | 2 / 3 / 2 / 3 |
| cible | 307 | 3 / 3 / 2 / 2 |
| aide | 11 | 0 / 0 / 1 / 1 |
| aide | 47 | 0 / 0 / 0 / 0 |
| aide | 103 | 5 / 7 / 0 / 0 |
| aide | 211 | 0 / 0 / 0 / 0 |
| aide | 307 | 0 / 0 / 0 / 0 |
| passe | 11 | 1 / 1 / 0 / 0 |
| passe | 47 | 0 / 0 / 2 / 1 |
| passe | 103 | 0 / 0 / 0 / 0 |
| passe | 211 | 0 / 0 / 0 / 0 |
| passe | 307 | 0 / 0 / 1 / 2 |

## Décision

Aucune hypothèse ne domine le témoin. Le rappel renforcé améliore les fondamentaux mais sacrifie des preuves/transferts et augmente la dette générale. Le transfert renforcé réduit les occurrences d'alerte et améliore certains scénarios fragiles, mais augmente les scénarios signalés, la dette et régresse sur les nouvelles graines. La combinaison concentre davantage le parcours et dégrade 16 scénarios relativement au témoin. Le moteur actuel est conservé : il minimise le nombre de scénarios signalés et présente la meilleure généralisation sur les 12 nouvelles graines parmi ces quatre hypothèses. Ne pas surajuster les graines, annuler les corrections justes ou modifier les seuils pour obtenir artificiellement des voyants verts.

La sélection expérimentale n'est pas activée. Les 11/30 scénarios signalés du témoin restent une limite ouverte ; les huit alertes de la matrice officielle 18 scénarios et le comparatif historique 1915 restent bloquants selon le contrat strict. Pas de preuve d'une dégradation chez des élèves réels ni de garantie d'absence de dégradation. Un éventuel choix de publier malgré ces alertes nécessite une décision explicite et ne serait pas une validation complète.

## Recette technique indépendante

[Recette exacte 4c7ac7c](https://github.com/CapGui13/QPJB/actions/runs/46081177820) : job recette vert, 10/18 comparaisons longitudinales sans alerte. [Laboratoire historique](https://github.com/CapGui13/QPJB/actions/runs/46081177817) : tests techniques exécutés avant la comparaison réussis ; comparaison historique rouge, navigateur ignoré jusqu'ici. Séparer la comparaison historique en job autonome bloquant, afin que Chromium/WebKit puissent vérifier le parcours et le hors-ligne indépendamment, sans assouplir les seuils ni convertir les échecs en succès. Le test browser dédié utilise l'ancien moteur exact pour générer une sauvegarde synthétique, puis contrôle la reprise de la séance sur le site construit et le refus des versions incompatibles. Les tests navigateur nouveaux restent à exécuter nativement. Pas de fusion ni publication.

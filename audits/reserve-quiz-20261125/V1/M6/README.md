# Réserve V1-M6 — Splinters et suites Blackwood

Contrat #320, mission #326. Base figée `e910307511f8a98dba6876df9d6677f9fc74e2b2` ; branche `reserve-quiz/v1-m6-chelems`.

## Clôture

| Concept | N≤3 initial | Cible | Ajouts | N≤3 après collecte virtuelle | Exceptions |
|---|---:|---:|---:|---:|---:|
| Splinter | 2 | 1 | 1 | 3 | 0 |
| Variantes | 0 | 1 | 1 | 1 | 2 |
| Suite Blackwood | 0 | 3 | 3 | 3 | 0 |
| Dame/Rois | 0 | 1 | 1 | 1 | 2 |
| Total | 2 | 6 | 6 | 8 | 4 |

4/4 concepts traités. Déficit brut de 10 : six décisions indépendantes livrées et quatre exceptions argumentées (pas de quota artificiel). 0 patch historique. Les 36 fiches historiques du lot, dont les 3 ajouts #319, ont été consultées à partir de la table des prérequis et du blob figé. Les audits V474/V483 ont été réutilisés. Les cas de variante et de Dame/Rois restant non couverts à N3 sont motivés dans review.json et reserves ; aucune simplification qui supprimerait le raisonnement conventionnel. Les six nouveaux cas gardent stage 3, les planchers 43/47/48 et les dépendances exactes des cas homologues. N3 signifie décision isolée guidée, pas séance débutant.

## Vérifications locales réellement exécutées

Contrôle JavaScript des six objets : 13 cartes, rangs valides, pas de rang répété dans une couleur, H et shape calculés, quatre options distinctes et licites au-dessus de la dernière enchère, réponse présente, contexte et explication, IDs et familles distincts et absents du blob, mains nouvelles non identiques au catalogue, prérequis exacts attestés dans la table. 0 erreur. Comparaison pédagogique manuelle des situations existantes et des six décisions. Aucun test de recette globale. Aucune source SEF nouvelle revendiquée : références reprises du catalogue/audits validés, y compris l'accord QPJB 30–41 et le dialogue Dame/Rois.

## Livraison

Quatre fichiers exclusivement dans ce répertoire, aucun changement du catalogue, du moteur, de la CI ou de main ; aucune PR, fusion, publication ou consolidation. La SHA de livraison est indiquée dans le commentaire de #326 après commit. Collecte par le pilote.

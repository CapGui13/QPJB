# Réserve cumulative V1 — M1 : bicolores et redemandes

Contrat #320, mission #321 ; base `e910307511f8a98dba6876df9d6677f9fc74e2b2` et travaux #319, #309, #271 repris. Aucun fichier de production modifié.

| Concept | QCM historiques | Familles N≤3 avant | Ajouts | Familles N≤3 projetées | Déficit restant justifié |
|---|---:|---:|---:|---:|---:|
| ouv.bicolore.exception | 3 | 0 | 0 | 0 | 3 |
| red.bicolore_cher | 9 | 0 | 1 | 1 | 2 |
| second.bicolore_cher | 10 | 0 | 1 | 1 | 2 |
| red.competitif | 15 | 1 | 2 | 3 | 0 |

Cible fixée après une cartographie : 4 ajouts, 7 écarts argumentés sur déficit brut de 11. Réalisé : 4/4, 4/4 concepts traités, zéro patch historique. Les exceptions ne sont pas des QCM manquants à produire mécaniquement : la règle de cinq perdantes est déjà couverte au niveau avancé, les reverse positifs et réponses usuelles sont déjà nombreux. Les nouveaux cas N3 sont ciblés sur une décision sans frontière de force ambiguë ; stage et planchers copiés des ancrages, dépendance red.bicolore ajoutée au cas compétitif qui la requiert. Le cas de soutien direct à 3♥ n'exige pas de maîtriser les enchères de chelem, seulement de garder le dialogue ouvert.

## Contrôles réellement exécutés
Lecture du catalogue figé (1595 QCM) et de la table explicite, inventaire des quatre concepts, comparaison manuelle des situations historiques et parents pertinents ; vérification JS locale des 4 IDs/familles, 13 cartes par main, rangs distincts par couleur, H recalculés (13/14/13/15), longueurs, enchères ascendantes, quatre choix légaux et distincts avec réponse incluse, unicité main/séquence normalisée face au catalogue et entre ajouts, présence des concepts requis. JSON sérialisé et relu localement. Aucun test global ni recette CI.

## Limites
Sources : cas du catalogue figé et audits/registre existants ; le texte intégral du SEF 2024 n'a pas été consulté. Les nouvelles situations sont des applications du référentiel existant, non des visas supplémentaires. La taxonomie des familles est une proposition conservatrice ; le pilote peut signaler un recoupement sans arbitrage intermédiaire. Les planchers avancés sont conservés, y compris le prérequis auto-référent historique pour le cas de redemande forcée (stage 3, après exposition au concept). Aucune nouvelle règle locale. V44-007 reste réservé ; aucune décision du registre #271 rouverte. Aucun merge, PR, intégration ou publication. SHA à consigner dans le commentaire de clôture #321.

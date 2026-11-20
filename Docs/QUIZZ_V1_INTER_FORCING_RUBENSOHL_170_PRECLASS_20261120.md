# QPJB V1 — Audit des 170 questions : réponses aux interventions, forcing, Rubensohl

**Date : 20 novembre 2026 · Suivi : issue #226 · Statut : propositions pédagogiques non homologuées et inactives.**

## Coordination avec l'autre instance

Le **20 novembre**, la PR <https://github.com/CapGui13/QPJB/pull/231> est en cours en **brouillon HOLD** pour tracer le **motif de sélection des QCM** et ajouter des diagnostics dans les exports de progression. Ses changements connus concernent exclusivement :
- `quizz-parcours.js`
- `tests/quizz-ergonomie.cjs`
- `tests/quizz-ergonomie-browser.cjs`

**Ce lot de cartographie n'écrit dans aucun de ces fichiers.** Il crée trois registres dans `audits/`, un vérificateur propre à la cartographie dans `scripts/`, ce rapport, et étend uniquement `.github/workflows/qpjb-v1-competences-audit.yml`. Il ne modifie aucun moteur, aucun paramètre de tirage, aucune mesure de répartition, aucune sauvegarde.

Le périmètre est donc séparé au niveau des fichiers et des règles. Comme les branches peuvent évoluer en parallèle, vérifier leurs HEAD avant fusion ; ne pas fusionner la PR #231 à la place de l'autre instance.

## Sources vérifiables

- Catalogue V1 de référence : `quizz.html` (1 523 QCM).
- File d'audit source : `audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json` (541 IDs, sauvegardes et corrigés intacts).
- [67 réponses aux interventions](../audits/QPJB_V1_REPONSE_INTER_67_PRECLASSIFICATION_20261120.json) : 20 groupes candidats.
- [54 cas de forcing](../audits/QPJB_V1_FORCING_54_PRECLASSIFICATION_20261120.json) : 21 groupes candidats.
- [49 Rubensohl](../audits/QPJB_V1_RUBENSOHL_49_PRECLASSIFICATION_20261120.json) : 22 groupes candidats.
- `node scripts/verify-v1-inter-forcing-rubensohl-170.cjs` : chaque ID, main, distribution, points H, séquence, choix, réponse et explication est comparé à la source. Vérifie aussi l'absence de doublon avec les 48 après-fit, 65 barrages et 65 chelems.

**Bilan du lot : 170 QCM, 63 groupes candidats, zéro compétence homologuée.** Les catégories sont des *hypothèses de travail* sans effet sur l'algorithme V1.

## Réponses aux interventions — 67 QCM, 20 catégories

Distinguer notamment les réponses à **une intervention naturelle du partenaire** des réponses à **l'ouverture du partenaire après intervention adverse**, malgré leur rangement actuel sous un même thème source.

- Soutien simple à 2M, distinction soutien à trois atouts ou à quatre atouts réguliers.
- Soutien à saut compétitif après intervention : quatre atouts, une courte, vulnérabilité et nombre d'atouts.
- Passe sans fit ni ressources ; 1SA naturel avec arrêt ; manche directe à 4M.
- Cue-bid constructif, cue-bid à saut, soutien mixte (**2SA artificiel** avec quatre atouts et 7–9 H) lorsque le n°3 a parlé ; nouvelle couleur forcing ou non forcing selon le n°3.
- **Distinction de 2SA selon les séquences :** `SEF-L10-005` est **2SA naturel** après intervention du partenaire et Passe du numéro 3, tandis que `SEF-L13-009` est **2SA fitté après l'ouverture du partenaire sur intervention adverse** ; les mixed raises `SEF-V473-001`, `SEF-V486-011/012` et `SEF-L16-008` forment un troisième usage.
- `SEF-L10-013` demande le **palier théorique de la loi des atouts**, pas une prescription de contrat tactique.
- `SEF-L38-004/005` : Texas et Texas impossible en réponse à une **intervention naturelle du partenaire à 1SA**. Ne pas les assimiler au Rubensohl contre une intervention sur l'ouverture de 1SA.

Réserves : répétition de familles source, vulnérabilité, caractère forcing des nouvelles couleurs, contre-expertise des alternatives aux cue-bids et mécanismes de 2SA.

## Forcing — 54 QCM, 21 catégories

- **Troisième couleur artificielle / collante** et **quatrième couleur forcing** : séquences, niveaux et rôle des joueurs précis.
- Troisième enchère de l'ouvreur après quatrième couleur : **fit majeur de trois cartes prioritaire**, arrêt de la quatrième couleur et 2SA, enchère d'attente sans arrêt/fit, redemande de mineure longue et annonce de la zone de force.
- Suite du répondant : conclure à la manche, continuer partiellement, réinterroger sur la tenue, soutien cherchant le chelem.
- **Exceptions transversales** : `SEF-L13-003` check-back après le saut à 2SA ; `SEF-L13-004` Splinter ; `SEF-L13-005` répétition naturelle non forcing ; `SEF-L13-006` troisième couleur naturelle ; `SEF-L17-010` bicolore majeur 5–5 naturel. Ne pas inférer qu'une enchère est artificielle du seul thème `forcing`.
- Les **15 variantes `SEF-V480`** testent des priorités voisines et ne doivent pas constituer 15 preuves indépendantes de maîtrise.
- `SEF-V486-029/030` rappellent qu'une quatrième couleur économique ne rend pas automatiquement toute la séquence forcing de manche ; vérifier chaque palier et le contexte.
- `SEF-V45-017` et `SEF-L24-001` nécessitent une expertise sur le seuil HL de la quatrième couleur à 1♠.

## Rubensohl — 49 QCM, 22 catégories

Un même palier d'enchère peut avoir un sens différent **selon la couleur de l'intervention, son caractère naturel ou artificiel et la place dans la séquence**.

- Après intervention naturelle sur **1SA ouvert par le partenaire** : réponses naturelles faibles, transferts 2SA vers Trèfles, 3♣ vers Carreaux, 3♦ vers Cœurs, 3♥ vers Piques, Texas impossible de type Stayman, 3SA naturel, Contre et Passe.
- **Texas impossible** : l'enchère artificielle change avec la couleur de l'adversaire ; 3♣ et 3♦ ne doivent pas être unifiés sans préciser l'intervention.
- **16 redemandes de l'ouvreur `SEF-V481-001..016`** : choisir majeure quatrième, annoncer l'arrêt, cue-bid sans arrêt ou rectification de transfert. Ce sont des variations proches sur quelques trames.
- **Landy à 2♣** et **Contre artificiel mineure–majeure** (`SEF-V486-017..022`, `SEF-L19-007`, `SEF-L21-004`, `SEF-L23-003/004`) doivent être étudiés séparément de l'intervention naturelle 2♥/2♠.
- `SEF-L17-011` (3♠ cue-bid sur 2♠) et `SEF-L27-006` (3♠ conventionnel après 2♥) : distinguer ces contextes avant de rattacher à une même notion « demande de tenue ».
- Le **2SA artificiel de transfert** dans cette rubrique ne doit pas être confondu avec 2SA naturel, 2SA fitté ou le 2SA essai de manche.

## Couverture de l'audit et décisions nécessaires

| Type de classement | QCM |
| --- | ---: |
| Repères contextuels heuristiques déjà présents dans V1 | 903 |
| 79 candidats SA/Stayman/Texas (précédents lots) | 79 |
| 48 candidats après fit | 48 |
| 65 barrages + 65 chelems | 130 |
| **67 interventions + 54 forcing + 49 Rubensohl (présent lot)** | **170** |
| QCM sans proposition après ces dossiers | **193** |
| **Total source V1** | **1 523** |

Les **193 autres** se répartissent comme suit : **42 ouvertures fortes, 40 Drury, 40 Michaels, 38 Roudi, 31 Multi-Landy et 2 cas isolés** (`ouv`, `apres_inter`).

**Ne pas activer les 427 propositions** (79+48+130+170) sur la seule base de ce classement : il faut vérifier le fond SEF 2024, les réponses alternatives recevables, les dépendances pédagogiques, et tester l'effet réel sur la progression V1. Les 903 micro-clés existantes sont des indices heuristiques, non des acquis certifiés. Après homologation, simuler des profils d'élèves sur la V1 en conservant la clé `qpjb-sef-parcours-01` et les anciens historiques.

Aucun QCM, corrigé, identifiant, moteur, fichier de progression, interface, donnée de l'Entraînement ou PR parallèle n'est modifié par cette livraison.

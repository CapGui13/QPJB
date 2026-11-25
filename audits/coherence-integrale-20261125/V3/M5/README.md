# V3-M5 — conventions et chelems

Contrats #342, #349, #356, #361 ; base 4678fcba3a45333c968d3c8c04c50e88446d4532 ; réserve cumulative bd0e644f8987c3448d47a92746ad33a7a89d333e. Projection reconstruite par application chronologique des 124 + 369 patches et 2 objets de prérequis : 480 IDs distincts, zéro divergence old.

Cible motivée : 25 corrections ; 25 propositions retenues, 311 OK et 11 réserves historiques, aucune nouvelle. La cartographie initiale et les statuts sont dans plan.json et review.json.

| Thème | Total | Patch | OK | Réserve |
|---|---:|---:|---:|---:|
| drury | 48 | 6 | 39 | 3 |
| fortes | 54 | 2 | 50 | 2 |
| forcing | 71 | 8 | 63 | 0 |
| multilandy | 39 | 2 | 33 | 4 |
| michaels | 48 | 1 | 46 | 1 |
| chelem | 87 | 6 | 80 | 1 |

## Changements proposés
- Drury : 6 développements après 2SA et relais 3♣, concept suite, dépendance au choix initial, regroupement de trois paires de permutations de couleurs sans fusion des trois codages distincts.
- Forcing : une première exposition explicite à la quatrième couleur et 7 redemandes au stade d'application suivant.
- Contrôles : 4 cas réparés V1 couvrant un contrôle sauté passent à la difficulté 4 avec les dépendances correspondantes ; contraste conservé avec le frein.
- Harmonisation de difficultés et prérequis entre cas voisins de Multi-Landy, Michaël, ouverture forte et Splinter ; une dépendance Splinter lors du déclenchement du Blackwood ; justification ciblée du retour à 4♥.
- Aucun changement de main, réponse, choix, texte de corrigé ni thème. Aucun ajout ni suppression. Aucun HOLD tranché. Les 11 réserves locales sont reproduites comme héritées ; ne pas les recompter comme nouvelles. SEF-L33-005 appartient à ouv, transmis à M1/pilote.

## Contrôles et limites
{
  "virtualCatalogue": 1879,
  "v1PatchesApplied": 124,
  "v2PatchesApplied": 369,
  "distinctPatchedIds": 480,
  "v1PrerequisApplied": 2,
  "projectionOldMismatch": 0,
  "coverage": 347,
  "uniqueIDs": 347,
  "validHands": 347,
  "validH": 347,
  "validShape": 347,
  "validChoices": 347,
  "validPrerequis": 347,
  "oldExact": 25,
  "patches": 25,
  "reserves": 11,
  "errors": []
}

Revue comparative des 347 séquences, réponses, niveaux, familles et métadonnées ; le contrôle des textes longs est ciblé sur les propositions et leurs ancres, avec appui sur la revue V2 plutôt qu'une seconde relecture éditoriale intégrale de tous les corrigés. Les statuts OK signifient absence d'écart démontré dans ce contrôle transversal, non certification technique indépendante du SEF. Aucun test global de déblocage ni CI ; vérifier à la consolidation les effets de regroupement des familles et les chemins d'exposition. Aucun arbitrage, application, fusion ou publication.

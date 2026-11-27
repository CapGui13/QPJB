# AUDIT3000 — point de coordination avant intégration
Contrat #556. Base immuable ccd8f20811b9531bbfccb8352ec60953dd7d07cb. Instantané des six PR brouillon, aucun merge. Les fichiers de verdicts et corrections ont été lus directement aux SHA ci-dessous ; les comptages ne reposent pas uniquement sur les descriptions de PR. Les audits partiels ne sont pas déclarés terminés.

| Lot | PR | SHA | Audités | Attendus | VALIDE | RECLASSER_REFORMULER | ERREUR_PEDAGOGIQUE | ARBITRAGE | Patches | Patches historiques | Réponses modifiées |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | #567 | `1df9d878f635ebc8ea03cdaea240602bac97dabe` | 419 | 419 | 228 | 144 | 0 | 47 | 147 | 65 | 0 |
| B | #566 | `d9cc44034e16a37b0e4d05632c232b43107ae688` | 454 | 454 | 306 | 122 | 12 | 14 | 99 | 52 | 3 |
| C | #568 | `2bb5ed54cfd1c75b2b832756ded3b3bdff96e224` | 564 | 608 | 340 | 210 | 0 | 14 | 207 | 36 | 0 |
| D | #563 | `1098868b6abe24afa1e59c9e7851a943335ace27` | 360 | 543 | 165 | 178 | 9 | 8 | 180 | 104 | 5 |
| E | #564 | `b561e6255b1dab25dcac761da6528eff7d823adf` | 360 | 540 | 102 | 237 | 0 | 21 | 220 | 29 | 0 |
| F | #565 | `d9b677f28054196b3a8c56c5b4ae6876cac0ba0f` | 436 | 436 | 215 | 213 | 3 | 5 | 212 | 13 | 0 |
| Total | | | 2593 | 3000 | 1356 | 1104 | 24 | 109 | 1065 | 299 | 8 |

Couverture vérifiée : 2593 IDs uniques, 0 doublon de verdict, 0 ID inconnu, 407 manquants. Corrections : 1065 objets réellement différents de la base, 0 ID de patch inconnu, 0 doublon de patch. Cela ne vaut pas validation pédagogique ou autorisation d'intégrer les patches conditionnels. Transferts de concepts et conflits de réservoir à contrôler ensuite.

## Bloquants avant intégration
- C : 44 Drury restants ; D : 183 interventions/contres/barrages/réveils ; E : 180 compétition et défenses. Reprendre chacun sur sa branche ; aucun audit des autres lots à leur place. Les listes ci-dessous sont calculées depuis la base moins l'union des verdicts, pas une approximation.
- 109 arbitrages actuellement recensés, dont des corrections conditionnelles. Traiter les transferts et arbitrages communs avant application.
- 299 patches touchent les 993 QCM historiques. Le test tests/quizz-integrity.cjs contrôle le SHA historique après normalisation inverse par exceptions exactes (tests/quizz-v488-approved-revisions.cjs). Préserver le hash et les assertions ; faire approuver les avant/après exacts, ne pas réinitialiser l'empreinte.
- 8 réponses changées à vérifier et migrer sans perte d'historique : B SEF-V44-017 3♥→2♥, SEF-V44-018 3♠→2♠, SEF-V412-001 2♠→3♠ ; D SEF-V4-053-4 2♥→3♥, SEF-V4-056-2 2♣→3♣, SEF-V44-058 2♣→3♣, SEF-V44-059 2♣→3♣, SEF-V44-061 2♦→3♦.
- Assertion de formulation de quizz-integrity.cjs : 16 contrevenants dans le catalogue de base, 12 restent après projection indicative des 1065 patches (même conditionnels) : SEF-V3-036-1, SEF-V479-003, SEF-L41-004, SEF-Q26-M2-012, V1-M3-006, V2-M2-016, V2-M2-026, SEF-Q400-B-053, SEF-Q400-B-099, SEF-Q685-B-065, SEF-Q685-D-037, SEF-Q685-D-123. Contrôler doctrine et remplacer formulations, pas seulement retirer les mots interdits. Aucun nouveau contrevenant détecté dans cette projection.
- Tests natifs complets non exécutés dans cette coordination ; les rapports de lots signalent DNS/runner et absence de CI. Refaire les tests existants sur un environnement disposant du clone. Ne pas modifier le moteur ou affaiblir les contrôles.
- Redondances sémantiques hors signatures/familles non certifiées exhaustivement ; revue globale ciblée à poursuivre après stabilisation des six lots.

## IDs restant à auditer par lot et concept
### Lot C — 44
- drury.reponse (25) : `SEF-V4-101-2`, `SEF-V4-102-1`, `SEF-V4-107-3`, `SEF-V4-108-1`, `SEF-V484-011`, `SEF-V484-012`, `SEF-V484-013`, `SEF-V484-014`, `SEF-L01-F-03`, `SEF-L01-F-05`, `SEF-L01-F-06`, `V2-M6-011`, `V2-M6-012`, `SEF-Q400-B-082`, `SEF-Q400-B-083`, `SEF-Q400-B-084`, `SEF-Q400-B-085`, `SEF-Q685-B-083`, `SEF-Q685-B-154`, `SEF-Q685-B-155`, `SEF-Q685-B-156`, `SEF-Q685-B-157`, `SEF-Q685-B-158`, `SEF-Q685-B-168`, `SEF-Q685-B-169`
- drury.suite (19) : `SEF-V484-001`, `SEF-V484-002`, `SEF-V484-003`, `SEF-V484-004`, `SEF-V484-005`, `SEF-V484-006`, `SEF-V484-007`, `SEF-V484-008`, `SEF-V484-009`, `SEF-V484-010`, `SEF-L01-F-01`, `SEF-L01-F-02`, `SEF-L01-F-04`, `SEF-Q400-B-086`, `SEF-Q400-B-087`, `SEF-Q400-B-088`, `SEF-Q685-B-159`, `SEF-Q685-B-160`, `SEF-Q685-B-170`

### Lot D — 183
- barrage.ouverture (21) : `V2-M5-013`, `V2-M5-014`, `V2-M5-015`, `V2-M5-016`, `SEF-Q400-C-067`, `SEF-Q400-C-068`, `SEF-Q400-C-069`, `SEF-Q400-C-070`, `SEF-Q400-C-071`, `SEF-Q400-C-072`, `SEF-Q400-C-073`, `SEF-Q685-C-095`, `SEF-Q685-C-096`, `SEF-Q685-C-097`, `SEF-Q685-C-098`, `SEF-Q685-C-099`, `SEF-Q685-C-100`, `SEF-Q685-C-101`, `SEF-Q685-C-163`, `SEF-Q685-C-164`, `SEF-Q685-C-165`
- barrage.suite (7) : `V2-M5-017`, `V2-M5-018`, `SEF-Q400-C-078`, `SEF-Q400-C-079`, `SEF-Q685-C-108`, `SEF-Q685-C-109`, `SEF-Q685-C-110`
- barrage.reponse (12) : `V2-M5-019`, `V2-M5-020`, `SEF-Q400-C-074`, `SEF-Q400-C-075`, `SEF-Q400-C-076`, `SEF-Q400-C-077`, `SEF-Q685-C-102`, `SEF-Q685-C-103`, `SEF-Q685-C-104`, `SEF-Q685-C-105`, `SEF-Q685-C-106`, `SEF-Q685-C-107`
- intervenir.base (20) : `SEF-Q400-C-001`, `SEF-Q400-C-002`, `SEF-Q400-C-003`, `SEF-Q400-C-004`, `SEF-Q400-C-005`, `SEF-Q400-C-006`, `SEF-Q400-C-007`, `SEF-Q400-C-008`, `SEF-Q400-C-009`, `SEF-Q400-C-010`, `SEF-Q400-C-026`, `SEF-Q400-C-027`, `SEF-Q400-C-028`, `SEF-Q685-C-001`, `SEF-Q685-C-002`, `SEF-Q685-C-003`, `SEF-Q685-C-004`, `SEF-Q685-C-005`, `SEF-Q685-C-028`, `SEF-Q685-C-029`
- intervenir.deux_faible (16) : `SEF-Q400-C-011`, `SEF-Q400-C-012`, `SEF-Q400-C-013`, `SEF-Q400-C-029`, `SEF-Q685-C-006`, `SEF-Q685-C-007`, `SEF-Q685-C-008`, `SEF-Q685-C-009`, `SEF-Q685-C-010`, `SEF-Q685-C-011`, `SEF-Q685-C-012`, `SEF-Q685-C-073`, `SEF-Q685-C-074`, `SEF-Q685-C-075`, `SEF-Q685-C-076`, `SEF-Q685-C-077`
- reponse_inter.base (12) : `SEF-Q400-C-014`, `SEF-Q400-C-015`, `SEF-Q400-C-016`, `SEF-Q400-C-017`, `SEF-Q400-C-018`, `SEF-Q400-C-019`, `SEF-Q685-C-013`, `SEF-Q685-C-014`, `SEF-Q685-C-015`, `SEF-Q685-C-016`, `SEF-Q685-C-017`, `SEF-Q685-C-078`
- intervenir.sa.suite (16) : `SEF-Q400-C-020`, `SEF-Q400-C-021`, `SEF-Q400-C-022`, `SEF-Q400-C-023`, `SEF-Q400-C-024`, `SEF-Q400-C-025`, `SEF-Q685-C-018`, `SEF-Q685-C-019`, `SEF-Q685-C-020`, `SEF-Q685-C-021`, `SEF-Q685-C-022`, `SEF-Q685-C-023`, `SEF-Q685-C-024`, `SEF-Q685-C-025`, `SEF-Q685-C-026`, `SEF-Q685-C-027`
- contre.base (27) : `SEF-Q400-C-030`, `SEF-Q400-C-031`, `SEF-Q400-C-032`, `SEF-Q400-C-034`, `SEF-Q400-C-035`, `SEF-Q400-C-036`, `SEF-Q400-C-037`, `SEF-Q400-C-038`, `SEF-Q400-C-039`, `SEF-Q685-C-030`, `SEF-Q685-C-031`, `SEF-Q685-C-032`, `SEF-Q685-C-033`, `SEF-Q685-C-034`, `SEF-Q685-C-035`, `SEF-Q685-C-036`, `SEF-Q685-C-037`, `SEF-Q685-C-038`, `SEF-Q685-C-039`, `SEF-Q685-C-040`, `SEF-Q685-C-079`, `SEF-Q685-C-080`, `SEF-Q685-C-081`, `SEF-Q685-C-157`, `SEF-Q685-C-158`, `SEF-Q685-C-159`, `SEF-Q685-C-160`
- reveil.base (16) : `SEF-Q400-C-033`, `SEF-Q400-C-080`, `SEF-Q400-C-081`, `SEF-Q400-C-082`, `SEF-Q400-C-083`, `SEF-Q685-C-111`, `SEF-Q685-C-112`, `SEF-Q685-C-113`, `SEF-Q685-C-114`, `SEF-Q685-C-115`, `SEF-Q685-C-116`, `SEF-Q685-C-117`, `SEF-Q685-C-118`, `SEF-Q685-C-119`, `SEF-Q685-C-120`, `SEF-Q685-C-121`
- contre.deux_faible (24) : `SEF-Q400-C-040`, `SEF-Q400-C-041`, `SEF-Q400-C-042`, `SEF-Q400-C-043`, `SEF-Q400-C-044`, `SEF-Q400-C-045`, `SEF-Q400-C-046`, `SEF-Q685-C-041`, `SEF-Q685-C-042`, `SEF-Q685-C-043`, `SEF-Q685-C-044`, `SEF-Q685-C-045`, `SEF-Q685-C-046`, `SEF-Q685-C-047`, `SEF-Q685-C-048`, `SEF-Q685-C-049`, `SEF-Q685-C-050`, `SEF-Q685-C-051`, `SEF-Q685-C-082`, `SEF-Q685-C-083`, `SEF-Q685-C-084`, `SEF-Q685-C-085`, `SEF-Q685-C-086`, `SEF-Q685-C-087`
- reveil.deux_faible (12) : `SEF-Q400-C-084`, `SEF-Q400-C-085`, `SEF-Q685-C-122`, `SEF-Q685-C-123`, `SEF-Q685-C-124`, `SEF-Q685-C-125`, `SEF-Q685-C-126`, `SEF-Q685-C-127`, `SEF-Q685-C-128`, `SEF-Q685-C-129`, `SEF-Q685-C-130`, `SEF-Q685-C-131`

### Lot E — 180
- apres_inter.base (17) : `SEF-Q400-C-053`, `SEF-Q400-C-054`, `SEF-Q400-C-055`, `SEF-Q400-C-056`, `SEF-Q685-C-052`, `SEF-Q685-C-053`, `SEF-Q685-C-054`, `SEF-Q685-C-055`, `SEF-Q685-C-056`, `SEF-Q685-C-057`, `SEF-Q685-C-058`, `SEF-Q685-C-059`, `SEF-Q685-C-060`, `SEF-Q685-C-061`, `SEF-Q685-C-088`, `SEF-Q685-C-089`, `SEF-Q685-C-090`
- competitif.spoutnik (12) : `SEF-Q400-C-057`, `SEF-Q400-C-058`, `SEF-Q400-C-059`, `SEF-Q400-C-060`, `SEF-Q685-C-062`, `SEF-Q685-C-063`, `SEF-Q685-C-064`, `SEF-Q685-C-065`, `SEF-Q685-C-066`, `SEF-Q685-C-067`, `SEF-Q685-C-091`, `SEF-Q685-C-092`
- red.competitif (15) : `SEF-Q400-C-061`, `SEF-Q400-C-062`, `SEF-Q400-C-063`, `SEF-Q400-C-064`, `SEF-Q400-C-065`, `SEF-Q400-C-066`, `SEF-Q685-C-068`, `SEF-Q685-C-069`, `SEF-Q685-C-070`, `SEF-Q685-C-071`, `SEF-Q685-C-072`, `SEF-Q685-C-093`, `SEF-Q685-C-094`, `SEF-Q685-C-161`, `SEF-Q685-C-162`
- competitif.2sa_fitte (16) : `SEF-Q400-C-086`, `SEF-Q400-C-087`, `SEF-Q400-C-088`, `SEF-Q400-C-089`, `SEF-Q400-C-090`, `SEF-Q685-C-132`, `SEF-Q685-C-133`, `SEF-Q685-C-134`, `SEF-Q685-C-135`, `SEF-Q685-C-136`, `SEF-Q685-C-137`, `SEF-Q685-C-138`, `SEF-Q685-C-139`, `SEF-Q685-C-140`, `SEF-Q685-C-141`, `SEF-Q685-C-142`
- competitif.truscott (18) : `SEF-Q400-C-091`, `SEF-Q400-C-092`, `SEF-Q400-C-093`, `SEF-Q400-C-094`, `SEF-Q400-C-095`, `SEF-Q400-C-096`, `SEF-Q685-C-143`, `SEF-Q685-C-144`, `SEF-Q685-C-145`, `SEF-Q685-C-146`, `SEF-Q685-C-147`, `SEF-Q685-C-148`, `SEF-Q685-C-149`, `SEF-Q685-C-150`, `SEF-Q685-C-166`, `SEF-Q685-C-167`, `SEF-Q685-C-168`, `SEF-Q685-C-169`
- competitif.sa_adverse (11) : `SEF-Q400-C-097`, `SEF-Q400-C-098`, `SEF-Q400-C-099`, `SEF-Q400-C-100`, `SEF-Q685-C-151`, `SEF-Q685-C-152`, `SEF-Q685-C-153`, `SEF-Q685-C-154`, `SEF-Q685-C-155`, `SEF-Q685-C-156`, `SEF-Q685-C-170`
- multilandy.intervention (12) : `SEF-Q400-D-041`, `SEF-Q400-D-042`, `SEF-Q400-D-043`, `SEF-Q400-D-044`, `SEF-Q400-D-045`, `SEF-Q400-D-046`, `SEF-Q685-D-041`, `SEF-Q685-D-042`, `SEF-Q685-D-043`, `SEF-Q685-D-044`, `SEF-Q685-D-045`, `SEF-Q685-D-046`
- multilandy.choix (5) : `SEF-Q400-D-047`, `SEF-Q685-D-037`, `SEF-Q685-D-038`, `SEF-Q685-D-039`, `SEF-Q685-D-040`
- multilandy.reponse (9) : `SEF-Q400-D-048`, `SEF-Q400-D-049`, `SEF-Q685-D-047`, `SEF-Q685-D-048`, `SEF-Q685-D-049`, `SEF-Q685-D-050`, `SEF-Q685-D-051`, `SEF-Q685-D-052`, `SEF-Q685-D-056`
- multilandy.suite (4) : `SEF-Q400-D-050`, `SEF-Q685-D-053`, `SEF-Q685-D-054`, `SEF-Q685-D-055`
- rubensohl.init (12) : `SEF-Q400-D-051`, `SEF-Q400-D-052`, `SEF-Q400-D-054`, `SEF-Q400-D-055`, `SEF-Q400-D-056`, `SEF-Q685-D-061`, `SEF-Q685-D-062`, `SEF-Q685-D-063`, `SEF-Q685-D-064`, `SEF-Q685-D-065`, `SEF-Q685-D-066`, `SEF-Q685-D-068`
- rubensohl.naturel (6) : `SEF-Q400-D-053`, `SEF-Q685-D-057`, `SEF-Q685-D-058`, `SEF-Q685-D-059`, `SEF-Q685-D-060`, `SEF-Q685-D-067`
- rubensohl.reponse (7) : `SEF-Q400-D-057`, `SEF-Q400-D-058`, `SEF-Q400-D-059`, `SEF-Q685-D-069`, `SEF-Q685-D-070`, `SEF-Q685-D-071`, `SEF-Q685-D-072`
- rubensohl.suite (5) : `SEF-Q400-D-060`, `SEF-Q685-D-073`, `SEF-Q685-D-074`, `SEF-Q685-D-075`, `SEF-Q685-D-076`
- michaels.intervention (13) : `SEF-Q400-D-061`, `SEF-Q400-D-062`, `SEF-Q400-D-063`, `SEF-Q400-D-065`, `SEF-Q400-D-066`, `SEF-Q685-D-077`, `SEF-Q685-D-078`, `SEF-Q685-D-079`, `SEF-Q685-D-080`, `SEF-Q685-D-081`, `SEF-Q685-D-082`, `SEF-Q685-D-083`, `SEF-Q685-D-084`
- michaels.choix (3) : `SEF-Q400-D-064`, `SEF-Q685-D-085`, `SEF-Q685-D-086`
- michaels.reponse (7) : `SEF-Q400-D-067`, `SEF-Q400-D-068`, `SEF-Q685-D-087`, `SEF-Q685-D-088`, `SEF-Q685-D-089`, `SEF-Q685-D-090`, `SEF-Q685-D-091`
- michaels.defense (6) : `SEF-Q400-D-069`, `SEF-Q400-D-070`, `SEF-Q685-D-094`, `SEF-Q685-D-095`, `SEF-Q685-D-096`, `SEF-Q685-D-097`
- michaels.reveil (2) : `SEF-Q685-D-092`, `SEF-Q685-D-093`

## Décision de coordination
Ne pas intégrer en l'état. Terminer C/D/E, relire les arbitrages et les corrections conditionnelles, vérifier l'exclusivité exacte des 3000 IDs, puis préparer une intégration contrôlée sur la branche coordinateur avec recette et tests réels. Aucun merge main sans accord utilisateur. MISSION GLOBALE DÉFINITIVEMENT TERMINÉE : NON.

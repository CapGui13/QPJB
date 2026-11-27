# Archive du premier bilan M2

**Version de référence : [FINAL.md](FINAL.md) et [registre-final.json](registre-final.json).** Ce README conserve les résultats historiques du premier candidat ; ne pas les confondre avec la recette finale.

# M2 — Ordre réel, bilan autonome (26 novembre 2026)

Contrats #419/#421, base immuable 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Code testé : 5f88dd8db67f11de372d84a967c473bae7ab26ef. PR brouillon #426. Aucun changement de fichier de production existant, aucun merge.

## Cartographie et décisions

Le moteur historique (logicalOrder, decisionPattern, select/start, record/finish et consolidationPlan) protège déjà les ouvertures, les Passe, le fit et les répétitions. Les références #293, #365, #375–409 ont été lues, notamment #376/#381/#385. Les blobs de base du catalogue (7a952dc57b582a2a7b5be73f83306df83881f3a8, 1915 QCM), des prérequis (8e920bb9c925c7474bb04701f0f2fecac5288b91) et du moteur ont servi au banc. Il ne s'agit pas d'une nouvelle sélection, d'un changement d'accord SEF, ni d'une certification humaine de toutes les archives.

Passage 1 : permuter le deck existant, garder les règles de décision historiques, réduire les inversions de difficulté/stade et les répétitions improductives. Recette pilote native 45902184426 : 21/21 jobs, 2304 gains locaux sur les decks historiques; seulement 10/90 en S1–5. Lacune prioritaire confirmée : 2SA avant rappel de 1SA, contrastes encore trop éloignés.

Passage 2 : coût explicite des prérequis déjà présents dans le deck, contrastes discriminants vérifiés sur les mains/enchères/forces, voisinage ciblé, relocalisations et recherche bornée à deux mouvements en S1–5. Aucune introduction de prérequis ni changement des IDs. Une distribution ou force identique est comptée séparément quand elle constitue un vrai contraste, sans assimiler cette répétition à une répétition improductive. Les métriques brutes restent visibles. Le module reste pur et déterministe et renvoie le deck historique si aucune permutation sûre n'améliore le score.

## Raccordement

Appeler QPJBCoherenceM2.order(ctx) sur le deck historique issu de logicalOrder, avec les données et métadonnées effectives, avant matérialisation de la nouvelle séance seulement. Le banc injecte cette opération en mémoire au point de retour de logicalOrder et exécute start/record/finish du moteur figé. Ne jamais repasser une séance active par M2. La production, le cache et le stockage ne sont pas modifiés dans cette branche. Le coordinateur doit adapter son appel à l'interface et vérifier l'ensemble M1–M6. Pas de nouvelle règle d'éligibilité.

## Recette réelle

Run final natif [45902482555](https://github.com/CapGui13/QPJB/actions/runs/45902482555), 21/21 jobs réussis : 18 paires de trajectoires S180, unité Node (3872 assertions et consolidation native/reprise), Chromium 156 et WebKit 27.2 (1957 assertions chacun, UMD hors ligne). Smoke historique [45902457709](https://github.com/CapGui13/QPJB/actions/runs/45902457709) réussi au SHA de code. Les autres workflows historiques de ce SHA sont ignorés ou non terminés au moment de ce bilan : ne pas leur attribuer un succès. La recette intégrée et le visa de publication sont réservés au coordinateur.

6 profils × 3 graines, mêmes réponses déterministes par ID/séance/graine, même horloge. Baseline native indépendante, candidat injecté dans le moteur exact. 3240 séances par bras, 32400 QCM par bras. Les 18 ZIP natifs ont été téléchargés et lus, et vérifiés pour 180 séances, 10 IDs distincts par séance, permutation historique/proposée/réelle et raisons non vides. Registre exhaustif des 3240 unités dans registre.json, index des artefacts par profil/graine et SHA256. Tous les JSON comportent contexte, main, bonne enchère, concept, niveau, rôle et raison; les 18 fiches Markdown détaillent S1–5 et les traces JSON continuent à S180. Artefacts Actions à durée limitée, régénérables avec le banc. Aucun élève réel n'a été testé.

| Horizon | Séances comparées | Ordre final différent | Gains locaux sur deck candidat | Sets modifiés |
|---|---:|---:|---:|---:|
| S5 | 90 | 85 | 82 | 0 |
| S20 | 360 | 346 | 297 | 0 |
| S65 | 1170 | 1129 | 978 | 0 |
| S153 | 2754 | 2675 | 2390 | 0 |
| S180 | 3240 | 3149 | 2831 | 0 |

Les changements longitudinaux incluent des effets du journal sur l'ordre historique : ils ne sont pas tous des gains causés directement par M2. 409 decks candidats conservés sans gain local sûr. Sur decks historiques indépendants, 2807 améliorations locales. Toutes les familles, premières expositions, maxGaps, niveaux, premières expositions thématiques, themeGaps et dette simplifiée sont identiques à chaque horizon pour chaque profil/graine. Aucun changement de composition observé; ce n'est pas une garantie universelle sur d'autres réponses.

| Métrique cumulée | S5 avant → après | S65 | S180 |
|---|---:|---:|---:|
| inversions de prérequis | 96 → 10 | 1116 → 110 | 3268 → 375 |
| inversions de stade | 8 → 3 | 37 → 7 | 128 → 31 |
| inversions de difficulté | 7 → 0 | 14 → 1 | 87 → 8 |
| ruptures de difficulté ≥2 | 1 → 0 | 1454 → 394 | 5998 → 2193 |
| contrastes manqués | 244 → 127 | 263 → 128 | 266 → 129 |
| ABAB réponse | 0 → 0 | 7 → 2 | 38 → 21 |
| ABAB thème | 0 → 1 | 0 → 1 | 4 → 5 |
| réponses identiques proches (exact) | 0 → 0 | 0 → 0 | 48 → 48 |
| miroirs / miroirs proches / triples / familles adjacentes | 0 → 0 | 0 → 0 | 0 → 0 |

Bruts même distribution S180 1→42, même force 7→25 : les contrastes discriminants expliquent la hausse; répétitions improductives 1→1 et 7→2. P95 de sélection finale selon les profils/graines : baseline 31–55 ms, candidat 29–55 ms (runner, pas mobile).

## Exemples réellement générés, autonome/11

S1 : SEF-002-3 (1SA) suivi de SEF-PN26-M1-001 (1♣) au lieu d'être séparés; même distribution, zones de force différentes. Les Passe restent aux positions 1,4,7. SEF-N023-1 (Passe) suivi de SEF-007-2 (1♥), même distribution, décision selon la force.

S2 : inchangée pour autonome/11, car aucun gain local sûr; meilleure mineure au début et réponses naturelles avant les fits restent protégées. Ne pas déplacer pour fabriquer du volume.

S3 : SEF-N017-2 (1SA) passe de Q4 à Q1, SEF-004-1 (2SA) de Q2 à Q4, SEF-005-2 (2SA) de Q7 à Q8. Le rappel précède la nouvelle décision au lieu de la suivre.

S4 : SEF-N088-1 (Passe sur 1SA, 5H) passe de Q2 à Q3; SEF-033-1 (3SA, 10H) reste Q5. La distance diminue de 3 à 2. SEF-N091-3 (2SA, 8H) reste Q9 : le troisième élément du contraste reste éloigné et doit être signalé, pas inventé.

S5 : SEF-PN26-M1-006 (1♠, réponse naturelle majeure) passe de Q8 à Q1; SEF-N122-1 (2♥, redemande) passe de Q1 à Q10. Le contraste Stayman/Texas existe mais reste éloigné sur ce deck; les gardes priment. Voir les traces natives pour les 18 variantes, pas seulement cet exemple.

## Régressions / HOLD / limites

Sur 4 combinaisons profil/graine, les différences longitudinales font apparaître six événements défavorables : cible/11 S4 ABAB thème; faible/11 S2 et S136 inversions stade; modere/11 S2 inversion stade, S12 ABAB réponse; modere/47 S172 ABAB réponse. Chacun 0→1 local par rapport au témoin indépendant; certaines sont compensées par des gains ultérieurs. Pas de hausse des métriques protégées dans une permutation comparée à son propre deck historique. Ne pas présenter ces écarts comme supprimés, ni activer sans arbitrage intégré. Le réordonnancement ne résout pas la composition, les prérequis absents, le choix des rappels ou les contrastes absents : M1/M3/M4. Les rôles/raisons ne sont pas un nouveau curriculum et ne prouvent pas l'apprentissage humain.

## Reproduction / statut

Exécuter les tests M2 depuis le SHA de code avec la base disponible dans git. Le banc accepte les paramètres documentés dans le fichier, et fournit les deux traces complètes, les fiches et les checkpoints. Recettes techniques #428/#430 isolées, jamais à fusionner dans la production. L'activation et la recette historique/intégrée exhaustive restent au coordinateur, et les six événements défavorables sont signalés pour arbitrage. Livraison autonome code + banc + registre + bilan effectuée; statut global non clôturé, pas de publication.

# M5 — enseignement explicite (#401)

Base figée : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. Contrat commun #396. Catalogue blob 77f10161e8f1a7b327d03937b55bd7e76bf83109 ; prérequis blob 8e920bb9c925c7474bb04701f0f2fecac5288b91.

## Cartographie initiale et objectifs
99 concepts, 1 915 QCM attribués. La base fournit corrigés et parcours, mais pas de corpus autonome M5. Objectif : une disposition, une règle, une mini-vérification non évaluée et un rappel autonome pour chaque concept ; exemples commentés vérifiés, contrastes utiles (pas de quota), accès conditionné par calendrier et exposition. Pas de modification de l'ancien catalogue, pas d'ajout de QCM évalués.

## Bilan comparatif

| Mesure | Base | M5 |
|---|---:|---:|
| Concepts disposant d'une leçon explicite M5 | 0/99 | 99/99 |
| Dispositions recensées | 0 | 99 |
| Exemples commentés hors évaluation | 0 | 139 |
| Contrastes complémentaires | 0 | 40 |
| Mini-vérifications non notées | 0 | 99 |
| Rappels autonomes | 0 | 99 |
| Écritures de score/progression M5 | 0 | 0 |
| Fichiers existants modifiés | 0 | 0 |

99 leçons prêtes sur les règles sélectionnées (0 HOLD identifié sur les exemples sélectionnés ; pas un visa éditorial global). Règles : 208 caractères en moyenne, 316 au maximum ; rappels <=190 caractères, sans oui/non isolé ; 7 glossaires ciblés. 11 contrastes sont différés dans le scénario de découverte au premier instant d'éligibilité. Les autres contrastes peuvent être consultés si leurs propres prérequis le permettent. L'atelier replie les exemples et vérifications ; aucun déclenchement automatique. La relecture complète reste une option volontaire distincte du rappel court. Aucun apprentissage humain ni réduction effective de la durée des séances n'est démontré.

## Règles et traçabilité
Chaque leçon a été rédigée individuellement ; registre.json associe concept, disposition, motifs, ID source, taille de couverture du concept, prérequis, calendrier et contrastes. Les 139 mains ont été contrôlées : 13 cartes, unicité par couleur, H, distribution, choix, identité de main/séquence/corrigé/contextes avec le catalogue canonique. Les règles suivent les accords et le contexte des exemples. 20 règles approfondies au second passage ; exemples des corrections historiques : SEF-V49-005/006 (priorité majeure jusqu'à 12 HL), SEF-V44-054 (essai économique), SEF-V470-005/SEF-V472-001/003 (Truscott), SEF-L25-007/SEF-L37-004 (Texas mineurs), SEF-C-005 (Texas sur 2SA faible). La clôture du 21 novembre supersède l'ancienne décision de priorité mineure. La lecture de #396 et #401 est intégrale ; #377–395, #293, #271, #364, #366–369 et des archives SEF/QPJB ont été consultées. La lecture intégrale de toutes les références et la contre-vérification éditoriale de toutes les variantes et seuils ne sont pas certifiées. Le registre ne transforme pas les 1915 QCM en contenu nouvellement homologué.

## Raccordement (coordinateur uniquement)
Global QPJBDurableLessons, CommonJS, schema QPJB_DURABLE_LESSONS_V1. `lesson({concept,history,nowMs,mode})` : discovery (si concept non rencontré), reminder (rappel court si rencontré), study (relecture volontaire d'un concept rencontré) ou null. `available(ctx)` fournit les titres éligibles. Résultats immuables, assisted:true, assessment:false ; les checks ne constituent jamais une réussite autonome. Exposition distincte par ID dans séances ordinaires terminées ou assessment historique explicite non skipped ; la réussite n'est pas requise et ne prouve pas la maîtrise. Les exemples secondaires ont chacun calendrier et prérequis propres. Le plancher de découverte suit ROADMAP et prérequis du premier exemple choisi ; exception de fit 5–3 documentée SEF-028-2. Le module refuse active !== null, contexte exercise/answer/candidates/selected, questionActive vrai ou invalide, modes inconnus ou état incomplet. L'horloge n'est pas utilisée. L'intégrateur doit interdire l'accès à la route d'enseignement tant qu'une question guidée ou libre est active (une activité non transmise au module ne peut être détectée). Aucun accès à score, stockage, réseau ou sélection ; ne pas convertir l'aide en preuves de M3. Aucune modification du parcours de production et aucune sécurité contre inspection des fichiers statiques revendiquée.

## Recettes réelles
- Test initial (V8) puis relance avec contrastes : 3 037 assertions, 20 000 appels état vide en 74 ms à la relance.
- Recette complémentaire finale sur les blobs figés et le module complet : 3595 assertions V8, 1 000 listes sur historique fictif avancé en 434 ms ; 99 concepts, 139 exemples, seuils structurels, prérequis des contrastes, pureté et garde-fous. Voir recette.json. Mesures indicatives, pas benchmark mobile.
- Chromium 144.0.7559.96 : 81 contrôles de clavier/focus, dévoilement volontaire, rappel, contrastes, absence de stockage et débordement horizontal sur 1280×800, 360×740, 320×640. Le test a été exécuté avec le runtime et les scripts DOM de la branche vérifiés par empreintes FNV-1a, un concept réel et un contraste synthétique ; module intégré au HTML par le banc. Ce n'est pas une recette navigateur intégrale des 99 concepts ni WebKit.
- Reproduction checkout : `node tests/durable-m5-lecons.cjs`, `node tests/durable-m5-contrastes.cjs`, `python audits/apprentissage-durable-20261126/m5/test-navigation.py` (Playwright et Chromium requis). DNS GitHub local indisponible : pas de checkout complet, Node natif des deux suites et navigateur sur corpus intégral non exécutés. Aucun succès CI M5 revendiqué.

## Restant
Recette sur checkout complet (Node natif et Chromium/WebKit avec le corpus intégral) et contre-vérification complète des variantes/seuils et références historiques. Raccordement, tests de parcours intégré, publication et arbitrages appartiennent au coordinateur, non à M5. PR brouillon, aucun merge ni publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** — les limitations de recette et relecture intégrale empêchent de déclarer le périmètre autonome achevé au sens du contrat #396.

## Reprise : extensions à accès progressif
22 approfondissements individuels dans 16 concepts, 32 références canoniques (dont 4 déjà présentes dans les contrastes). Les doubles transferts, mini-cue-bid, Texas impossible, variantes Multi-Landy, chicane utile, distinction forcing après Roudi et autres limites ne sont plus proposés comme une relecture systématique : accès en mode study uniquement, après calendrier et exposition distincte aux prérequis réels de tous les exemples. Les deux exemples d'égalité mineure 3–3 et 4–4 sont ajoutés au noyau. La leçon de base reste courte, aucun score. Les exemples déjà visibles sont dédupliqués dans la présentation. Le module refuse un identifiant concept non textuel. 707 assertions exécutées sous V8 sur le module complet et les blobs figés. Le test Node durable est fourni, pas exécuté en Node natif.

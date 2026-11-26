# M5 — enseignement explicite (#401)

Base figée : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. Contrat commun #396. Branche apprentissage-durable/m5-enseignement. Catalogue blob 77f10161e8f1a7b327d03937b55bd7e76bf83109 ; prérequis blob 8e920bb9c925c7474bb04701f0f2fecac5288b91.

## Cartographie initiale et production

99 concepts et 1 915 QCM attribués. La base fournit les corrigés et le parcours, mais pas de corpus autonome M5. Les leçons et approfondissements sont rédigés individuellement, avec exemples canoniques, règle contextualisée, mini-vérification non notée, rappel et disponibilité par calendrier/exposition. Aucun QCM ajouté ni modifié.

| Mesure | Base commune | Première livraison 7d67bfa | Dernière recette |
|---|---:|---:|---:|
| Leçons de base | 0 | 99 | 99 |
| Dispositions | 0 | 99 | 99 |
| Exemples de base | 0 | 139 | 150 |
| Approfondissements conditionnels | 0 | 0 | 49 |
| Références d'approfondissement | 0 | 0 | 83 |
| IDs canoniques distincts présentés | 0 | 139 | 228 |
| Mini-vérifications non notées | 0 | 99 | 148 |
| Rappels autonomes | 0 | 99 | 99 |
| QCM existants modifiés | 0 | 0 | 0 |

49 approfondissements répartis sur 28 concepts ; exemples de base et approfondissements dédupliqués à la présentation. Le noyau reste concis (213 caractères de règle en moyenne, maximum 307) ; aucun affichage automatique. Les doubles transferts, mini-cue-bid, Texas impossible, chicane utile, variantes Multi-Landy, réponses fortes, soutiens et enchères naturelles distinctes sont approfondis séparément après les prérequis. Les 99 concepts sont traités ; aucune nouvelle homologation de la totalité des 1 915 QCM.

## Vérification éditoriale et registre

Registre exhaustif par concept : disposition, source, prérequis, calendrier, exemples contrastifs, approfondissements et motifs. Les 228 mains distinctes utilisées sont contrôlées contre le catalogue (13 cartes, H, longueurs, choix, copie exacte du contexte, séquence et corrigé). Les seuils et variantes ajoutés ont été vérifiés à partir de ces corrigés réels, et les accords locaux sont signalés. Lecture intégrale de #396 et #401 ; consultation de #377–395, #293, #271, #364, #366–369 et références historiques ciblées, dont le registre de 35 arbitrages finaux. Les décisions conservées n'ont pas été réouvertes : priorité majeure jusqu'à 12 HL, 1SA non forcing en SEF, distinctions 2/1 auto-forcing/non auto-forcing, essai économique, Texas, Truscott, Drury, Landy et variantes locales. Les cas douteux au-delà des exemples choisis ne sont pas déclarés nouvellement homologués. La lecture intégrale de toutes les archives historiques et la vérification exhaustive de toutes les variantes ne sont pas certifiées.

## Contrat de raccordement (coordinateur uniquement)

Global QPJBDurableLessons, CommonJS, schema QPJB_DURABLE_LESSONS_V1. lesson({concept,history,nowMs,mode}) : discovery (si concept non rencontré), reminder (rappel court si rencontré), study (relecture volontaire d'un concept rencontré), ou null. available(ctx) fournit les titres éligibles. Résultats immuables, assisted:true, assessment:false ; les checks et exemples ne constituent jamais une réussite autonome. Exposition distincte par ID dans séances ordinaires terminées ou assessment historique explicite non skipped ; la réussite n'est pas requise et ne prouve pas la maîtrise. Les exemples secondaires et approfondissements ont leurs propres calendrier/prérequis ; les approfondissements sont uniquement en mode study. Le plancher de découverte suit ROADMAP et prérequis du premier exemple choisi ; exception de fit 5–3 documentée SEF-028-2. Le module refuse active !== null, contexte exercise/answer/candidates/selected, questionActive vrai ou invalide, modes inconnus ou état incomplet. Le coordinateur doit appeler la route d'enseignement uniquement hors question guidée ou libre : une activité non transmise au module ne peut être détectée. Aucune écriture de score, état, stockage ou sélection, aucun accès réseau. Ne pas convertir l'aide en preuves de M3. Aucune prétention de sécurité contre inspection des fichiers statiques.

## Recette sur la dernière version

| Banc | Assertions | Environnement |
|---|---:|---|
| Leçons | 3 037 | V8, sources et données réelles |
| Contrastes | 3 771 | V8, sources et données réelles |
| Approfondissements | 1 139 | V8, sources et données réelles |
| DOM complet | 1 162 | V8, module exact et script de démonstration exact, DOM simulé |
| Trajectoires S1–65 (3 profils) | 48716 | V8, moteur V1 réel |
| Navigation clavier/mobile | 99 | Chromium 144, trois concepts réels, runtime et script exacts, fixture réduite |

Trois tailles : 1280×800, 360×740, 320×640. Le test Chromium couvre focus clavier, ouverture et fermeture, rappel sans exemple, approfondissement replié puis ouvert au clavier, exemple et vérification non notée, absence de stockage et débordement horizontal. Empreintes du runtime et script vérifiées. Le banc DOM complet teste rendu de 99 rappels, 99 leçons, 49 approfondissements et 228 IDs. Mesures de performance du noyau : 20 000 appels état vide en 95 ms ; 1 000 listes sur historique fictif avancé en 434 ms (mesure V8 indicative).

### Trajectoires synthétiques sur le vrai moteur

| Profil | Séances | Réponses | Notions rencontrées à S65 | Rappels disponibles à S65 | Approfondissements devenus accessibles |
|---|---:|---:|---:|---:|---:|
| Autonome | 65 | 650 | 99 | 99 | 48/49 |
| Faible | 65 | 650 | 94 | 91 | 47/49 |
| Aide | 65 | 650 | 97 | 97 | 42/49 |

195 séances, 1 950 réponses ; appels réels sur états issus de start/record/finish, vérification à chaque séance de non-mutation et blocage en cours de séance ; export/import à S20. Le profil faible peut avoir rencontré une notion sans que toutes les conditions de la leçon soient prouvées (skips exclus par prudence), et aucune notion ne lui est imposée. L'aide et la réussite sont distinguées ; aucune amélioration de l'apprentissage humain ou de la maîtrise n'est prouvée par ces simulations.

## Complément : objectifs observables

Les 99 objectifs, auparavant identiques aux titres, ont été reformulés individuellement à partir de la règle et de la mini-vérification de chaque concept. Le démonstrateur les affiche en découverte et en relecture, sans allonger le rappel court. Aucun changement de règle, d'exemple, de seuil ou de convention. Comparaison effective V8 du module avant/après sur les 99 concepts dans les trois modes : seules les valeurs `objective` changent ; le blocage en présence d'une question active reste effectif. Banc DOM exact étendu : 1364 assertions, 99 rappels, 99 relectures, 49 approfondissements, 228 IDs. Voir `recette.json` pour le détail ; cette exécution n'est pas une recette navigateur native.

## Reproduction et limites

Sur checkout : node tests/durable-m5-lecons.cjs ; node tests/durable-m5-contrastes.cjs ; node tests/durable-m5-extensions.cjs ; node tests/durable-m5-dom.cjs ; node tests/durable-m5-trajectoires.cjs ; python audits/apprentissage-durable-20261126/m5/test-navigation.py. Les résultats V8 proviennent d'une exécution effective avec adaptateurs CommonJS et fichiers en mémoire sur les blobs exacts, non d'une exécution Node CLI du checkout. Le DNS GitHub local reste indisponible : la recette native Node/Chromium sur le corpus complet et WebKit n'est pas attestée. Les tests Chromium ciblés sont réels, distincts du DOM simulé. Aucun succès CI M5 revendiqué. La revue historique exhaustive reste à certifier. Les raccordements, tests intégrés et publication relèvent du coordinateur ; aucune modification des fichiers de production existants, aucun merge ni publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** — production substantielle et recettes autonomes livrées ; le contrat strict #396 ne permet pas de masquer les limites historiques et la recette navigateur native complète manquante.

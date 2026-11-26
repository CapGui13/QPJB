# M5 — enseignement explicite (#401)

Base figée : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. Contrat commun #396. Branche apprentissage-durable/m5-enseignement. Catalogue blob 77f10161e8f1a7b327d03937b55bd7e76bf83109 ; prérequis blob 8e920bb9c925c7474bb04701f0f2fecac5288b91.

## Cartographie initiale et production

99 concepts et 1 915 QCM attribués. La base fournit les corrigés et le parcours, mais pas de corpus autonome M5. Les leçons et approfondissements sont rédigés individuellement, avec exemples canoniques, règle contextualisée, mini-vérification non notée, rappel et disponibilité par calendrier/exposition. Aucun QCM ajouté ni modifié.

| Mesure | Base commune | Première livraison 7d67bfa | Recette intermédiaire (49 approfondissements) |
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

## Complément : 35 arbitrages définitifs (#364)

Relecture ciblée du registre final figé : 35/35 réponses du catalogue vérifiées, 7 décisions utilisées directement comme exemples (identité du contexte, de la main, des enchères et du corrigé), 28 non utilisées comme exemples, portée et disposition explicitées par ID dans `arbitrages-35.json`. Cinq concepts revus : priorité majeure jusqu'à 12 HL, soutien mineur contextualisé, 2/1 auto-forcing limité au silence adverse, distinction 3M / trois atouts, 2SA Landy local soumis à accord. L'approfondissement 2SA naturel précise le silence adverse et l'absence d'obligation de deux arrêts majeurs sûrs. Aucun changement de main, bonne enchère, corrigé, prérequis, calendrier ou nombre de leçons. Le statut keep_current ne valide pas toute une convention. Les six bancs V8 ont été exécutés à nouveau sur les blobs réels et le candidat (y compris les trois trajectoires S1–65), résultats synthétiques dans `recette.json` et `trajectoires.json`. Les checkpoints de la nouvelle exécution ne sont pas conservés. Nouveau test reproductible : `node tests/durable-m5-arbitrages.cjs`. Cette revue ciblée ne remplace ni la recette native complète ni une homologation exhaustive des autres archives.

## Complément : approfondissements historiques V473 à V485

Treize archives relues sur la base figée, puis rapprochement avec le catalogue réel. 24 approfondissements nouveaux dans 17 concepts, 61 exemples canoniques distincts supplémentaires (289 au total), 73 approfondissements au total. Ajouts ciblés : fortes, Dame d'atout, mini-cue-bid, Michaëls compétitif, Multi-Landy, quatrième forcing, Rubensohl, Texas mineurs, contrôles, Drury et réponses compétitives. Les cas historiques dont la réponse a évolué ne sont pas recopiés depuis l'archive : le catalogue figé prime. Chaque approfondissement est facultatif, relecture seulement, avec union des prérequis réels et une exposition au concept. Voir `archives-v473-v485.json` et `tests/durable-m5-archives.cjs`. Contrôle V8 ciblé exécuté : 504 assertions, 1541 contrôles de construction/invariants. La recette intégrale est documentée séparément.

## Recette navigateur exhaustive à exécuter sur checkout

Le banc historique `test-navigation.py` est conservé. Le nouveau `test-navigation-full.py` exige le corpus complet et traverse les 99 rappels et relectures, tous les approfondissements et exemples, sur trois tailles d'écran dans Chromium et WebKit. Les contrôles DOM réels sont groupés dans le navigateur, et les événements clavier de confiance sont testés séparément sur des contrôles représentatifs. Le banc vérifie le texte canonique effectivement rendu, l'état replié initial, le retour de focus, la non-notation, l'absence de stockage, de requête et de débordement horizontal. Les empreintes SHA-256 sont imprimées. La première version a dépassé le temps disponible ; le banc optimisé a passé 15 867 assertions sous Chromium 144 sur un corpus entièrement synthétique de même cardinalité (99/73/289), avec les empreintes des portions exactes du runtime et du démonstrateur vérifiées. Cela valide le banc et non une recette native du corpus QPJB réel. Le DNS bloque toujours le transfert des blobs complets vers le navigateur local ; WebKit n'est pas installé. Le registre des 35 arbitrages compte maintenant 8 exemples directement employés, 27 autres cas contextualisés, après introduction de V474-010.

## Recette intégrale après extension historique

Sept suites V8 sur les blobs réels, **61 222 assertions réussies**, dont 50 714 sur les trajectoires S1–65 (195 séances, 1 950 réponses), 1 436 sur DOM simulé, 157 sur arbitrages et 504 sur les nouvelles archives. Les résultats exacts sont dans `recette.json` et les résumés des profils dans `trajectoires.json`. Le premier passage a détecté V474-010 devenu exemple sans mise à jour du registre ; synchronisation puis reprise des sept suites. 73 approfondissements, 289 exemples distincts, 172 mini-vérifications, aucune modification du catalogue ni des prérequis. Les données de recette navigateur synthétiques ne sont pas un nouveau corpus pédagogique. 

## Complément : seuils et conditions historiques

Neuf archives supplémentaires relues, avec arbitrages chronologiques : le catalogue figé prime sur les propositions antérieures. Sept leçons/rappels précisés, six approfondissements et douze exemples canoniques supplémentaires, dont le Truscott fort (13–15 HLD) distingué du 2SA limite, le mixed raise, les rencontres, les barrages avec neuf atouts et le Roudi. 969 contrôles de construction/invariants et 115 assertions du banc dédié exécutés sous V8 sur sources exactes, sans Node CLI native. Voir `seuils-historiques.json` et `tests/durable-m5-seuils.cjs`. Aucun changement du catalogue ou de la production. Recette intégrale du candidat à relancer.

## Recette du candidat enrichi (SHA 747ac3dc5fb10d31143ae348c475a892655de064)

Huit suites V8 exécutées avec succès sur les blobs exacts : 62 201 assertions (dont 51 458 sur trois trajectoires S1–65, 1 950 réponses synthétiques). Corpus : 99 leçons, 79 approfondissements, 301 exemples distincts, 178 mini-vérifications. Le test historique conserve son périmètre de 289 exemples et contrôle aussi les 301 du corpus actuel, sans abaisser les exigences. Résultats dans `recette.json`, `trajectoires.json`. Le nouveau banc navigateur reste à exécuter sur checkout réel ; aucune nouvelle validation Chromium/WebKit revendiquée. Le contrôle historique supplémentaire couvre neuf archives, pas toutes les archives du dépôt.

## Reproduction et limites

Sur checkout : node tests/durable-m5-lecons.cjs ; node tests/durable-m5-contrastes.cjs ; node tests/durable-m5-extensions.cjs ; node tests/durable-m5-dom.cjs ; node tests/durable-m5-trajectoires.cjs ; python audits/apprentissage-durable-20261126/m5/test-navigation.py. Les résultats V8 proviennent d'une exécution effective avec adaptateurs CommonJS et fichiers en mémoire sur les blobs exacts, non d'une exécution Node CLI du checkout. Le DNS GitHub local reste indisponible : la recette native Node/Chromium sur le corpus complet et WebKit n'est pas attestée. Les tests Chromium ciblés sont réels, distincts du DOM simulé. Aucun succès CI M5 revendiqué. La revue historique exhaustive reste à certifier. Les raccordements, tests intégrés et publication relèvent du coordinateur ; aucune modification des fichiers de production existants, aucun merge ni publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** — production substantielle et recettes autonomes livrées ; le contrat strict #396 ne permet pas de masquer les limites historiques et la recette navigateur native complète manquante.

## Recette exhaustive des expositions par identifiant

Nouveau banc `node tests/durable-m5-expositions.cjs` : **117 549 assertions réussies**, 1 915 identifiants, 26 909 scénarios et 159 portes de prérequis. Chaque ID est vérifié dans les deux canaux (journal et assessment historique), résultat correct/incorrect, avec/sans aide, cas sautés, consolidation, sessions futures et absence de session valide. Les répétitions d'un même ID ne gonflent pas l'exposition ; l'union des IDs distincts est acceptée. Blocage des trois modes en présence de question ou de contexte ambigu, y compris via available(). Exécution V8 effective sur les blobs exacts, détails dans `expositions.json`. Ce test utilise des historiques synthétiques, sans prétention de mesure de l'apprentissage réel. Aucun changement du moteur ni du catalogue ; la recette native complète et la relecture historique exhaustive restent non attestées. Le workflow Training smoke du SHA b79068c a réussi, mais les quatre recettes intégrées ont été ignorées : aucun succès CI M5 spécifique revendiqué. Statut NON inchangé.

### Commandes de recette native pour le coordinateur

Depuis un checkout du SHA de la PR (ou du candidat intégrant M5) :

```sh
for f in tests/durable-m5-*.cjs; do node "$f" || exit 1; done
python -m pip install playwright
python -m playwright install --with-deps chromium webkit
python audits/apprentissage-durable-20261126/m5/test-navigation-full.py
```

Conserver les sorties et les empreintes des trois fichiers imprimées par le banc navigateur. Ne pas substituer le corpus synthétique à la recette réelle. Aucun workflow actif n'a été ajouté ni modifié par M5.

## Complément V471/V472/V487 et note Walsh

Quatre archives relues intégralement, avec contrôle des 21 fiches actuelles correspondantes et des deux candidats écartés. Neuf approfondissements et quinze exemples canoniques supplémentaires : 88 approfondissements, 316 exemples, 187 mini-vérifications. Notamment redemandes libres/obligées, contre/surcontre de soutien, cue-bids après nouvelle couleur, 4SA après 2♣ fort, arrêt à 3♣ et quatrième couleur répétée ou soutien différé. Registre `archives-complementaires.json` et test dédié ; cardinalités historiques maintenues dans les anciens tests. Dix suites exécutées sous V8 sur sources exactes au SHA 855e04d03153efaab4a053f71f517eb3ac26bd0a : **181081 assertions réussies** dont 52 458 pour les trois trajectoires de 65 séances (1 950 réponses synthétiques). Voir `recette-complementaire.json`. Aucun changement du catalogue ni du moteur V1. La recette native Chromium/WebKit et la vérification éditoriale exhaustive restent non attestées ; statut NON maintenu.

## Consolidation des décisions historiques et lisibilité élève

Rapprochement de 118 clôtures V4.110, 29 dossiers du 24 novembre, 26 textes approuvés et cinq modifications du 23 novembre : 178 enregistrements (169 IDs distincts), avec champs historiques et champs figés, usage pédagogique et disposition, dans `validation-historique-finale.json`. Les 118 réponses sont comparées : 117 concordent, SEF-020-3 a été ultérieurement corrigé de 2♣ à 1SA ; la base figée prévaut. 17 champs des approbations anciennes diffèrent du catalogue actuel et sont conservés dans le registre sans restauration. Les arbitrages finaux restent inchangés : 17 exemples employés dans leur concept, un contraste inter-concept supplémentaire documenté.

22 approfondissements et 33 exemples canoniques supplémentaires ; cinq règles de base précisées (ordre des majeures, réponses aux essais, code Roudi, 2SA fitté dans son contexte, bilan Blackwood). Glossaire contextuel ajouté à 71 concepts, 103 définitions, au plus deux ajouts par leçon, aucun dans les rappels. 99 leçons, 110 approfondissements, 349 exemples distincts, 209 mini-vérifications. Pas de modification du catalogue ni du moteur V1. La moyenne des règles de base est 220 caractères (maximum 358), hors définitions facultatives dans la leçon. Les aides ne constituent jamais une évaluation autonome.

Onze suites exécutées sous V8 sur sources exactes au SHA 51fd86e6b3c8dfbc0a27d3b0a95b1cb1a9677f39 : **185634 assertions réussies**, dont 55 071 pour trois trajectoires de 65 séances (1 950 réponses synthétiques). Le test DOM simulé a rendu les 349 exemples. Le registre historique a été comparé aux sources exactes, et les anciens tests continuent de vérifier leurs cardinalités historiques. Voir `recette-validation-historique.json`. Il ne s'agit pas d'une validation native Node/Chromium/WebKit ni d'une homologation exhaustive de toutes les archives et variantes. Le coordinateur doit actualiser son manifeste d'intégration avant recette native sur ce nouveau candidat.

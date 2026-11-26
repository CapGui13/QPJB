# M1 — état de recette de la variante protégée (26 novembre 2026)

**Statut actuel : NON — 8/25 comparaisons validées, 17 confiées à la recette native isolée.** Ce bilan remplace les statuts historiques ci-dessous.

Le module reste au blob `a09254905aae5021062087b3175ce24ad156ef68`. La variante `preserve-concept-level` protège jusqu'à S65 le concept et le niveau du choix de référence, en n'ajoutant le bonus qu'au sein de ce cadre; elle ne modifie aucun fichier de production. Elle est définie dans le banc de tests, non activée publiquement. Les sept preuves initiales sont les fichiers protection-concept-niveau-prioritaires-s180.json et protection-concept-niveau-cible-aide-s180.json; la huitième (faible 47) est protection-concept-niveau-faible-47-s180.json, commit bb01b281e05f333ed73fc0fbf6a06207d920ffc8. Toutes les huit ont zéro HOLD et zéro violation d'intégrité, et 99 concepts à S180. Faible 47 : preuves 62→68, ciblages 37→62, familles 1233→1236, erreurs synthétiques 1361→1349. Le témoin historique est réutilisé après contrôle du module et de la base identiques; seule la candidate a été exécutée.

Recette native sur SHA source `5e2a9ccadf4a303b0528232930b0b4596b7c1263` : [PR technique #415](https://github.com/CapGui13/QPJB/pull/415) et [run 45898381293](https://github.com/CapGui13/QPJB/actions/runs/45898381293), 17 candidats en matrice et un contrat Node 22. Le workflow temporaire existe uniquement sur la branche de recette, jamais sur la branche M1 ni main. Aucun résultat natif n'est revendiqué avant lecture des jobs et des preuves. Fermer #415 sans fusion après récupération; conserver les JSON et le bilan agrégé sur M1. Les huit comparaisons déjà acquises ne sont pas rejouées. Toute régression reste HOLD. Les preuves synthétiques ne démontrent pas un apprentissage humain. Ne pas fusionner #405 avant arbitrage du coordinateur.

---

# M1 — Adaptation cognitive (contrats #396 et #397)

Base immuable : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. PR #405 brouillon. Production existante intacte.

## Recette de reprise — état courant (remplace les statuts historiques ci-dessous)

Module testé : commit c4e8807a5a10478611786a0dd43ce6516becf43d, blob a09254905aae5021062087b3175ce24ad156ef68. Les changements ultérieurs sont uniquement tests et preuves de recette.

### Protection de l'initiation et de la diversité

La version précédente présentait un HOLD force à S20 (17 → 13 concepts avec preuves autonomes). Un simple plafond de 2, 4, 6, 8 ou 12 n'a pas suffi à rétablir les preuves (17 → 14). Règle retenue : S4–20, bonus uniquement si signal local fort et contraste historique explicite, plafond 8 ; à partir de S21, plafond 24 (récupération partielle 12, transversal 24 maximum). Le plafond contractuel 48 demeure une borne supérieure, pas le bonus effectif. Aucun nouveau filtre d'éligibilité. Les autres catégories et contraintes historiques restent intactes. L'initiation accepte donc une adaptation ponctuelle et démontrable, pas une accélération générale. Le profil force S20 est identique au témoin sur les trois graines examinées (11, 47, 103). La version retenue est testée ci-dessous.

### Recette S180 sur le module corrigé

Les 18 comparaisons standards (six profils × trois graines) et sept profils spécifiques (graine 47) ont été réellement exécutés jusqu'à S180 sur les blobs figés, avec instrumentation mémoire du moteur réel. Les 25 fichiers banc-phase-protegee-*.json contiennent avant/après, horizons S20/65/153/180, traces de sélection et HOLD. Les deux fichiers synthese-phase-protegee-*.json agrègent ces preuves. Total : 25 paires, 50 trajectoires, 90 000 réponses synthétiques. Les sommes de familles et concepts ne sont pas des nombres de familles/concepts uniques du catalogue.

| Ensemble | Ciblages | Familles (somme) | Concepts avec preuves (somme) | Erreurs simulées | HOLD |
| --- | ---: | ---: | ---: | ---: | ---: |
| Standards, 18 paires | 170 → 367 | 25703 → 25689 | 1562 → 1555 | 9279 → 9336 | 1 |
| Spécifiques, 7 paires | 90 → 186 | 10390 → 10469 | 629 → 636 | 4077 → 4045 | 0 |
| Total | 260 → 553 | 36093 → 36158 | 2191 → 2191 | 13356 → 13381 | 1 |

Toutes les trajectoires S1–3 identiques, zéro violation d'éligibilité, famille dupliquée dans une séance, séance courte, dépassement Passe, sur les quatre horizons ; 99 concepts et 22 thèmes à S180 pour chaque trajectoire. Les 18 standards conservent les métriques S20. Le ciblage compte les sélections satisfaisant la règle actuelle, y compris au témoin ; ses chiffres ne sont pas directement comparables aux anciens bancs utilisant des critères moins conservateurs. Les preuves sont des réussites autonomes sur plusieurs familles/séances, pas une preuve de maîtrise ou d'apprentissage humain.

Force 47 : preuves S20 17→17, S65 62→66, S153 79→79, S180 81→85 ; familles S180 1394→1445, ciblages 34→67, erreurs 966→944. HOLD initial résolu. Fit 47 : S65 67→64 preuves, familles 558→539, erreurs 297→328 ; S180 86→85 preuves, familles 1384→1415. Récupération 47 : changements de difficulté aux séances 26 et 46, preuves S180 97→96, signaux recovered 1→2, ciblages 2→9.

HOLD restant : cible 103, S65, concepts 99→96, preuves 71→68 ; concepts manquants confirmés par instrumentation supplémentaire : chelem.blackwood.dame_rois, chelem.blackwood.suite, rubensohl.suite. Tous sont exposés à S153. Le test d'un garde-fou « neutraliser le rang si un concept inédit est présent dans les candidats avant S65 » reproduit strictement ce HOLD : variante non intégrée. Ne pas assouplir le seuil pour le faire disparaître. Recommandation au coordinateur : examiner l'effet indirect sur les prérequis, dates de première exposition et ordre des créneaux, puis arbitrer la tolérance ou rejouer une variante sur la matrice entière. Autre vigilance : aide 11, preuves S180 84→78, sous le seuil du banc mais non négligeable ; hausse d'erreurs sur l'intermédiaire (1744→1793 sur trois graines). Ne pas assimiler davantage de ciblage à de meilleurs résultats pour tous.

### Tests et limites

Contrat réexécuté avec adaptateurs mémoire V8 pour require, fs et assertions : 25 325 assertions, 1 915 QCM, 5 745 mauvaises options, 5 416 hypothèses, 329 unknown, 195 low, 621 groupes, 82 groupes offrant un bonus dans le scénario de paire d'erreurs tardive. Test positif initiation : SEF-015-1, SEF-016-3, SEF-017-1 → signal local fort mineur.base:priorite → SEF-N029-2, bonus 8 à S5 / 24 à S25. Test négatif de la paire récurrente en initiation, neuf axes transversaux, contrat UMD window simulé. Voir tests-contrat-phase-protegee.json et tests/durable-m1-contract.cjs.

Node natif disponible dans le terminal, mais git ls-remote échoue (DNS github.com), donc pas de checkout ni de lancement natif de ces nouveaux tests. CI smoke du commit 6e332453f3dd80db7fa118ac71700a2ce42bc228 réussie (run 45893102666, jobs ciblés ; navigateurs et simulations longues ignorés), ne valide pas spécifiquement le contrat M1 natif. Aucun Chromium/WebKit attesté. Aucun fichier de production existant modifié, aucun merge ni publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** — production autonome et matrice exhaustive livrées ; HOLD cible 103 S65 à arbitrer par le coordinateur selon #396, test natif M1 non attesté. Aucun autre profil S180 manquant. Les sections suivantes sont conservées comme historique de la première livraison, et ne décrivent plus l'état courant.

---

## Historique — cartographie et objectifs
- 1915 QCM, 99 concepts, 5745 options erronées, 5416 hypothèses et 329 unknown ; chacune exécutée via QPJBProfesseur.diagnose du SHA figé. 1207 high, 4014 medium, 195 low. Aucun nouveau visa éditorial : les motifs de #395 sont conservés.
- Registre 0–3 : une entrée par ID, concept, famille, difficulté, prérequis, rôles, contraste historique, chaque choix avec statut, catégorie, confiance, critère lexical, règle, raison et disposition. Les règles lexicales distinguent notamment H, HL, HLD, longueur, priorité de fit, forcing, palier ; elles ne certifient pas un raisonnement psychologique. Les 195 low et les 329 unknown sont exclus des adaptations.
- Cibles : 100% des options recensées ; aucun bonus sans récurrence indépendante multi-famille/multi-séance ; bonus borné à 48 ; S1–3 identiques ; aucun contournement de filtre, quota, rappel explicite, famille ou reprise. Objectif comparatif : hausse des occasions de discrimination et familles >=95% de référence par trajectoire, pas de régression substantielle de preuve/exposition.

## Intégration
Le coordinateur charge quizz-durable-m1-adaptation.js après le module professeur. API UMD/CommonJS schema QPJB_DURABLE_ADAPTATION_V1 ; analyze({history,exercises,diagnose}) retourne {schema,signals,observations,limits}. Les signalIds, références aux ID/familles/séances, force, limites, récupération et succès contradictoires sont explicites. Fournir QPJBProfesseur.diagnose. Calculer une fois par construction de nouvelle séance ; aucun stockage supplémentaire. rank({history,exercises,candidates,selected,signals,conceptStates,category}) renvoie uniquement des bonus d'IDs candidats ; appliquer après tous les filtres de choose() et après rankPedagogy, exclusivement si !explicitRecall && !priority et s>=3. Ne rien modifier dans active, ni sur consolidation, ni si signal incomplet. conceptStates facultatif : aucun override de maîtrise. Voir tests/durable-m1-banc.cjs pour les ancres exactes du moteur.

La fenêtre est de 10 séances normales. Un signal isolé, une aide seule, un choix non offert, une première enchère inconnue, une incohérence d'identité ou une confiance faible sont neutres. Deux erreurs indépendantes, sur deux familles et deux séances, sont requises pour récurrence ; trois familles/séances et deux high pour force élevée, avec atténuation par preuves contradictoires. Deux réussites autonomes ultérieures sur familles/séances distinctes réduisent le signal à recovered ; ce n'est pas une preuve de maîtrise. Le journal réel ne stocke pas toujours firstGuess : aucune reconstruction. Les réussites assistées ne comptent pas comme preuve autonome. Les axes transversaux convention et compétition restent informatifs, pas de transfert automatique entre conventions.

Le rang exige une autre famille, une difficulté comparable, un exercice inédit, un contraste référencé ou des décisions réciproques, et un rôle de discrimination existant. Maximum 32 sur récurrence, 48 sur signal fort, 24 transversal, 12 récupération partielle. Aucun bonus découverte/maintenance. Le choix reste au score du moteur. Les empreintes du catalogue figé servent à l'abstention en cas de modification, pas à l'authentification cryptographique. Si catalogue évolue, régénérer et contrôler le registre/index avant activation. Le signal est une hypothèse, non une certitude sur l'intention ni un défaut de connaissance établi.

## Tests et bilan
Contrat exécuté sur données et sources réelles sous V8 (adaptateurs mémoire pour Node), 25319 assertions, dont les contrôles transversaux et UMD window simulé. Le test vérifie les 5745 options, anciens historiques, assistance, correction, répétition de famille, récupération, bornes, non-mutation et groupe concept-critère. 621 groupes examinés structurellement ; 82 offrent au moins un bonus dans le scénario de paire d'erreurs testé. Ce nombre n'est pas une limite de couverture générale. Voir tests-contrat.json.

Banc réellement raccordé en mémoire au moteur de #395, paire intermédiaire graine 47 S180 réalisée sur le premier module (commit 8f814d4) : 10→32 ciblages, 1501→1517 familles, 99 concepts et 22 rubriques conservés, 91 concepts avec preuves multifamilles/multiséances, 0 éligibilité/doublon/séance courte/violation Passe, S1–3 exactes, 587→627 erreurs simulées, dette fondamentale 693→688. Les différences de réponses simulées sont des compromis, pas un effet mesuré chez l'élève. Le dernier durcissement ec3a159 (contrat réexécuté) ne constitue pas à lui seul une nouvelle recette S180.

## Reproduction
```sh
node tests/durable-m1-contract.cjs
node tests/durable-m1-banc.cjs intermediaire 47 180
for p in autonome intermediaire faible cible aide passe; do
  for seed in 11 47 103; do node tests/durable-m1-banc.cjs "$p" "$seed" 180; done
done
for p in force longueur fit forcing convention competition recuperation; do
  node tests/durable-m1-banc.cjs "$p" 47 180
done
```
Le banc lit la base exacte via git show, fonctionne sans réseau sur checkout complet. Les profils sont synthétiques. Le DNS du terminal a empêché le checkout natif ; Node natif/Chromium/WebKit non attestés par M1.

## HOLD / statut
Recette des 18 paires S180 et profils spécifiques non intégralement exécutée ; vérifier les compromis par profil, la stabilité de l'exposition et les mesures de latence. Les signaux de récupération sont des preuves indirectes ; la sélection ne démontre ni rétention humaine ni transfert réel. Aucun merge ni publication. Le coordinateur arbitre et raccorde.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** (recette comparative exhaustive non attestée).

### Recette complémentaire sur la version durcie ec3a159

S20 : 6 profils × 3 graines (18 paires, 7 200 réponses cumulées avant/après), données par graine dans banc-s20-*.json. Aucun écart S1–3, violation d'éligibilité, famille dupliquée, séance courte, dépassement Passe ou baisse du nombre de familles. Ciblages 18→53 (+35). Détail par profil : autonome 0→0, intermédiaire 1→6, faible 13→39, cible 3→5, aide 1→3, Passe 0→0. Des variations de preuves existent malgré l'absence de HOLD au seuil du banc.

S65 : six profils spécifiques, graine 47, dans banc-s65-confusions.json (7 800 réponses avant/après). Ciblages : force 14→34 ; longueur 4→12 ; fit 11→29 ; forcing 0→5 ; convention 9→18 ; compétition 0→0. Total 38→98. Zéro violation, couverture des 22 thèmes. HOLD explicite force S20 : 17→13 concepts avec preuves multi-familles/multi-séances, au-delà du seuil de tolérance. Fit S65 : 67→62 preuves, familles 558→551, sous le seuil d'alerte du banc mais à surveiller. Compétition : aucune occasion admissible dans la trajectoire, pas de bonus forcé. Ne pas présenter ces résultats comme preuve de maîtrise ou d'amélioration humaine.

S180 récupération et difficulté, graine 47, dans banc-recuperation-47.json : ciblages 7→31, familles 1534→1526 (-0,52 %), concepts 99→99, thèmes 22→22, preuve autonome 97→95, erreurs 395→401, zéro violation, S1–3 exactes. Scénario de difficulté ajustée aux séances 26 et 46, changement de probabilité d'erreur à S41. A S180, signaux récurrents/forts 2→0, récupération 1→1. Indicateurs synthétiques uniquement.

Reste : 17 des 18 paires standards S180 non exécutées, et la paire intermédiaire 47 doit être rejouée sur la version durcie (seule l'ancienne a S180). 6 profils spécifiques testés à S65, non à S180 ; le profil récupération est à S180 sur version durcie. HOLD force S20 à résoudre, et audit du compromis de la preuve autonome. Le statut demeure NON. Les tests de contrat de 25319 assertions ont été pérennisés dans tests/durable-m1-contract.cjs ; l'environnement V8 a exécuté le corps et les contrôles complémentaires équivalents, pas Node natif. Aucun merge.

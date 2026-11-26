# M2 — Remédiation approfondie (apprentissage durable)

Contrat [#396](https://github.com/CapGui13/QPJB/issues/396), mission [#398](https://github.com/CapGui13/QPJB/issues/398). Base immuable `d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7`. Branche exclusive M2. Aucune modification du catalogue ni des modules de production existants.

## Cartographie initiale et objectifs

1 915 QCM, 99 concepts, 5 745 mauvaises options. Le professeur numérique historique produit 5 416 hypothèses dont 195 de confiance faible, 329 unknown, 140 remédiations ciblées dont 119 compléments et 140 pistes. Les autres cas restent au corrigé canonique. Objectifs : conserver intégralement les 140 cas, ne jamais modifier le canonique, contrôler les 5 745 mauvaises options et 1 915 bonnes réponses, augmenter les compléments utiles sans paraphrase systématique, distinguer aide/réussite autonome/correction spontanée, ne jamais inventer un accord, proposer un critère et des références inter-familles lorsque vérifiables.

Lecture des contrats et historiques #377–395, du professeur numérique, de la table des prérequis, de la classification des concepts, du diagnostic M3, du module M4 antérieur et des formats réels de journal/export. Certaines longues références historiques n'ont pu être relues intégralement dans la fenêtre disponible ; aucune prétention de revue SEF exhaustive.

## Résultat mesuré sur les blobs de la base

| Indicateur | Avant | Après |
|---|---:|---:|
| Remédiations ciblées (diagnostic sans aide) | 140 | 2 595 |
| Compléments de feedback non vides | 119 | 186 |
| Pistes de réinvestissement non vides | 140 | 2 595 |
| Remédiations ciblées avec diagnostic après affichage des propositions | non mesuré | 2 426 |
| Références de transfert même concept, même règle, catégorie et critères, autre famille, autre main, autre bonne enchère | non mesuré | 2 129 |
| Questions et options contrôlées | — | 1 915 / 5 745 |
| Anciens compléments et pistes ciblés conservés sur les diagnostics compatibles | 140 | 140 |

Les 2 595 pistes comprennent 140 historiques, 132 issues de règles contextualisées (dont certaines sans complément textuel volontairement), 2 323 issues de règles de réinvestissement. Le registre conserve également 304 contrastes canoniques détectés par heuristique et encore à valider éditorialement, 524 abstentions (329 unknown, 195 hypothèses faibles) et **2 322 HOLD** sans règle validée. Total exact 5 745. Tous les cas ont une disposition technique ; les HOLD ne sont pas individuellement arbitrés et ne doivent pas être considérés comme traités sur le fond. Aucun nouveau texte individualisé n'est revendiqué comme relu exhaustivement. La mesure de non-redondance vérifie qu'un nouveau complément n'est pas ajouté si l'enchère rejetée figure déjà dans le canonique ; elle n'établit pas l'absence de toute redondance sémantique. Les règles de transfert sont des questions de méthode contextualisées, pas une preuve d'apprentissage humain.

## Fichiers et reproductibilité

- `quizz-durable-m2-remediation.js` : UMD/CommonJS autonome, synchrone, sans réseau, sans stockage, sans horloge interne. Signature de l'exercice et empreinte du diagnostic de la base, contrôle du choix réellement formulé. L'empreinte est un garde-version non cryptographique. Les règles requièrent main valide, rôle/séquence, bonne enchère et compatibilité avec canonique et diagnostic. Les règles générales n'ajoutent pas de nouveaux accords SEF.
- `quizz-durable-m2-data.js` : données figées des options; provenance générée à partir des modules historiques et de la table réelle de concepts. Compatibilité du diagnostic avec une mauvaise réponse assistée explicitement calculée.
- `registre.json` : une entrée par mauvaise option, disposition, motif, catégorie, confiance, règle de diagnostic, présence des champs et critères. Les HOLD et contrastes provisoires sont visibles.
- `transferts.json` : références de mains distinctes, autre famille, autre bonne réponse, même concept, règle, catégorie et critères. La borne de stade est au plus +1. Ces références ne constituent pas une sélection éligible ni un verdict de maîtrise; le coordinateur doit filtrer les prérequis et le stade réel avant utilisation.
- `exemples.json`, `mesures.json` : exemples par règle et compteurs.
- `demo.html` : 37 scénarios à deux mains, réponse libre, propositions facultatives, corrigé après validation, sans score/progression; ouverture locale depuis un checkout du dépôt. Les diagnostics sont des fixtures réelles du catalogue figé; les réponses utilisateur ne sont jamais transmises. Aucun changement de production.
- `tests/durable-m2-remediation.cjs` : reproduit les données et le registre à partir de `git show BASE:fichier`; contrôle les options et bonnes réponses, incompatibilités, déterminisme, canonique, historique réel (dont exports), aide, première réponse corrigée, UMD et pureté. `--write` régénère les données principales et références, pas le HTML de démo.
- `tests/durable-m2-demo.cjs` : double DOM (focus demandé, soumission, fuite avant validation, erreur, aide, correction, passage autre main).

Commandes après checkout :
```sh
node tests/durable-m2-remediation.cjs
node tests/durable-m2-demo.cjs
```

**Réellement exécuté** : corps exact des deux tests en V8 avec blobs GitHub de la base et fichiers committés, module CommonJS et UMD global. 100 488 assertions du test exhaustif, 296 du démonstrateur sur double DOM (37 scénarios). Dernière exécution du banc exhaustif : 16 323 ms, incluant la génération et le parcours de toutes les options, non une mesure de latence individuelle. Les fichiers data/registre/transferts committés ont été comparés aux résultats générés. Clone/CLI Node non exécutés (résolution DNS GitHub indisponible dans le conteneur), Chromium/WebKit réels et navigation clavier/mobile visuelle non exécutés. Aucun succès de CI revendiqué.

## Raccordement coordinateur (non réalisé par M2)

Charger data puis remediation. Appeler exclusivement après validation avec la main réelle de la base et l'objet answer réel. En cas de bonne réponse après première enchère libre incorrecte et connue, calculer le diagnostic sur firstGuess avec assisted:false et hadFreeError:true; sinon diagnostic sur le choix final avec flags réels. Ne jamais fabriquer une première réponse sur reprise historique. Exemple :

```js
const first = answer.result === 'correct' && answer.hadFreeError === true && typeof answer.firstGuess === 'string';
const diagnostic = QPJBProfesseur.diagnose({
  exercise, choice: first ? answer.firstGuess : answer.choice,
  assisted: first ? false : answer.assisted, hadFreeError: answer.hadFreeError
});
const result = QPJBDurableRemediation.explain({exercise,answer,diagnostic,history});
```

Afficher le canonique historique une seule fois; ajouter feedback, reminder et checkNext séparément s'ils existent. Ne pas utiliser reminder ou targetCriteria comme preuve de maîtrise ou pour écraser la séance active. Sur diagnostic modifié/non compatible, version d'exercice différente, choix libre non proposé, données incohérentes : repli canonique. La répétition concerne les mauvaises options réellement observées dans les six séances de parcours terminées; une erreur assistée n'est retenue que si son diagnostic historique est compatible, jamais l'aide seule. L'historique ancien ne stocke pas toujours la première enchère libre ni une empreinte de version; aucun diagnostic rétrospectif de ce premier choix n'est produit. Les signaux M1 ne sont pas consommés à ce stade. Ne pas ajouter de champs au schéma existant. Tests intégration et publication du coordinateur distincts.

## Pass 2 — reprise après 640ba77b2f6f91af48d2936a622694e6a0e76ab1

131 options supplémentaires couvertes par 18 règles étroites (`pass2-*`) conditionnées au diagnostic signé, à la séquence, aux longueurs/force calculées et au canonique. Aucun ancien ciblage supprimé. Le registre et les références de transfert sont régénérés sur la base figée. Détail par option, contexte et règle dans `pass2.json`. Résultat courant : 2726 ciblages, 288 compléments, 2199 références distinctes ; 100721 assertions exécutées dans V8 en 16844 ms sur le nouveau module et les artefacts générés. Les chiffres du tableau précédent décrivent la première livraison. Pas de relecture individuelle exhaustive revendiquée.

## Limites et suite

Restent 2194 HOLD à examiner au fond, 301 contrastes provisoires à valider, et une recette réelle Node/Chromium/WebKit à exécuter. Ne pas substituer une question générique à un critère non démontré. Les 524 abstentions restent prudentes. La couverture pédagogique intégrale demandée par #398 n'est pas atteinte. Ne pas fusionner automatiquement.

MISSION DÉFINITIVEMENT TERMINÉE : NON


## Passe 3 — relecture des contrastes

Relecture éditoriale IA des 301 contrastes sur 266 exercices : 297 corrigés suffisants pour écarter l'option, sans feedback supplémentaire ni inférence causale. Quatre contrastes restent en arbitrage, motivés dans `revue-contrastes.json`. Chaque décision conserve le corrigé source, l'empreinte, la catégorie, la confiance et la règle du diagnostic. Le générateur contrôle la correspondance et l'utilisation de toutes les décisions. 101 318 assertions exécutées dans V8, avec aller-retour des artefacts générés. Les 2 194 HOLD et les 524 abstentions restent distincts ; aucune relecture humaine ou recette navigateur réelle n'est revendiquée. Le code de production et le module de remédiation restent inchangés durant cette passe.


## Passe 4 — critères de réinvestissement supplémentaires

68 HOLD convertis en remédiations ciblées sans nouveau complément textuel, par 15 règles effectives. Chaque cas est vérifié sur la main, la séquence, la bonne enchère, le diagnostic signé et le corrigé figé ; le détail est dans `pass4.json`. Aucun autre statut ni ciblage existant modifié. Total : 2794 ciblages, 288 compléments, 2203 références distinctes ; 2126 HOLD et 4 contrastes encore à arbitrer. Banc exhaustif exécuté en V8 : 101386 assertions avec reproduction des trois artefacts. Les tests Node CLI et navigateur réel ne sont pas exécutés. Relecture éditoriale exhaustive et validation humaine non réalisées. Statut NON.


## Passe 5 — traitement transversal des enchères naturelles et conventionnelles

453 HOLD convertis en remédiations ciblées sans nouveau complément textuel, par 74 règles effectives. Les règles contrôlent la main, la séquence, la bonne enchère, le diagnostic signé et les critères du corrigé figé ; le détail est dans `pass5.json`. Aucun autre statut ni ciblage existant modifié. Total : 3247 ciblages, 288 compléments, 2470 références distinctes ; 1673 HOLD et 4 contrastes encore à arbitrer. Banc exhaustif exécuté en V8 : 101839 assertions avec reproduction des trois artefacts. Les tests Node CLI et navigateur réel ne sont pas exécutés. Relecture éditoriale exhaustive et validation humaine non réalisées. Statut NON.


## Passe 6 — approfondissement transversal et développements avancés

124 HOLD convertis en remédiations ciblées sans nouveau complément textuel, par 52 règles effectives. Les règles contrôlent la main, la séquence, la bonne enchère, le diagnostic signé et les critères du corrigé figé ; le détail est dans `pass6.json`. Aucun autre statut ni ciblage existant modifié. Total : 3371 ciblages, 288 compléments, 2495 références distinctes ; 1549 HOLD et 4 contrastes encore à arbitrer. Banc exhaustif exécuté en V8 : 101963 assertions avec reproduction des trois artefacts. Les tests Node CLI et navigateur réel ne sont pas exécutés (clone GitHub impossible dans le conteneur, DNS). Relecture éditoriale exhaustive et validation humaine non réalisées. Statut NON.


## Passe 7 — revue éditoriale des contrastes déjà suffisants

84 options relues sur la main, la séquence, le corrigé et le diagnostic signé : 82 HOLD avec contraste exact déjà présent dans le corrigé, plus deux arbitrages (SEF-L23-001|Passe et SEF-L39-002|4♥) fondés sur l'objectif explicite de la question. Pas de nouveau texte redondant ni de modification du module. Les deux autres arbitrages restent ouverts : SEF-V470-007|Contre et SEF-L08-026|Contre. Le banc vérifie désormais également la provenance des contrastes exacts et maintient les anciennes conditions pour les revues historiques. Registre individuel `pass7.json`, revue IA et non humaine. Total : 3371 ciblages, 288 compléments, 2495 références distinctes, 381 corrigés suffisants, 1467 HOLD et 2 contrastes en attente. Banc V8 : 102512 assertions, reproduction des artefacts comprise. Node CLI et navigateur réel non exécutés. Statut NON.


## Passe 8 — revue contextualisée individuelle

55 décisions éditoriales IA supplémentaires (54 HOLD et un contraste provisoire), sans nouveau feedback redondant. Chaque décision est liée à la main, la séquence, la force, la distribution, le diagnostic signé, le corrigé intégral et la justification individuelle dans `pass8-propositions.json` (instantané de la proposition, désormais intégrée). Le test contrôle ces éléments et reproduit les données et transferts existants ; comparaison exhaustive avec le registre précédent : exactement 55 changements attendus. 1413 HOLD et un contraste restant ; 3371 ciblages, 436 corrigés suffisants, 524 abstentions. Banc exact exécuté en V8 : 102731 assertions. Node CLI et navigateurs réels non exécutés. Revue IA, non humaine. Statut NON.

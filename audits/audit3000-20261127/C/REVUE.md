# AUDIT3000-C — revue exhaustive (608/608), tests dépôt en attente

Base immuable : ccd8f20811b9531bbfccb8352ec60953dd7d07cb. Contrat #556, mission #559.

## Passes réalisées
- P1 : 42 ouvertures (25 ouv.sa1 + 17 ouv.sa2).
- P2 : 39 réponses quantitatives sa1.seuil.
- P3 : 49 réponses Stayman initial (1SA/2SA) et seuils 2SA.
- P4 : 75 QCM (Texas majeur initial 1SA/2SA et réponses aux Stayman 1SA/2SA).
- P5 : 62 QCM de développements sur 1SA (35 Stayman, 27 Texas).
- P6 : 53 QCM (17 suites Stayman 2SA, 18 suites Texas majeur 2SA, 18 rectifications Texas 2SA).
- 231 VALIDE, 83 RECLASSER_REFORMULER, 0 ERREUR_PEDAGOGIQUE, 6 ARBITRAGE. 83 objets complets corrigés. 1 changement de prérequis et 1 changement de réservoir proposés.
- Les 131 cas revus sans groupe explicite sont laissés en réserve potentielle ; l'accessibilité par le moteur n'a pas été vérifiée. Au total 227/608 ne figurent dans aucun groupe explicite du programme normalisé. Ne pas les injecter indistinctement.

## Anomalies et arbitrage
- V2-M1-003 : caseFamily indiquait un singleton absent de la main.
- Deux difficultés 3 ramenées à 1 pour la reconnaissance directe d'une ouverture de 2SA ; stage et verrous conservés.
- Distracteurs mieux ciblés (quatre majeures vs cinq, ouverture de la mineure longue vs SA), énoncé sans indice de réponse et corrigés faibles/longueur précisés.
- SEF-N091-1 : 9 H + cinq Carreaux = 10 HL ; proposition SEF 3SA dans le verdict, non appliquée tant que le traitement catalogue H/HL n'est pas arbitré. SEF-N091-3 : 8 H + cinq Carreaux = 9 HL, correction explicative sans changement de réponse.
- Référence secondaire consultée : https://www.bridge-chailley.fr/wp-content/uploads/2024/10/S-1SA-2SA-Q.pdf (fiche SEF 2024, p. 1), pas de certification externe.

- SEF-Q685-B-024 : bicolore majeur 5–4 forcing de manche, à sortir de S7/1 ; nouvelle difficulté 4, prérequis repris du cas V2-M2-017, transfert proposé à S57/5 réinvestissement (groupe réel). Distracteur Texas Pique rétabli, explication du chassé-croisé.
- SEF-Q685-B-022/023 : force de manche, pas simple invitation, et 3SA direct comme distracteur.
- Seuils 2SA et Stayman : références https://abc-du-bridge.scenari-community.org/003-03/co/003-03-03.html et https://passemurailles.fr/bridge/ ; absence de cas 4 H sans majeure dans cette passe, à traiter en éventuelle lacune, pas par création arbitraire.

- P4 : quatre énoncés L38/L40/L41/L43 ne donnent plus la réponse en décrivant la majeure recherchée ; code Stayman à quatre réponses précisé pour plusieurs séries ; difficulté 2 harmonisée pour les applications directes. Correction du re-Texas après refus 3SA sur 2SA, confirmée par Q26-M2-022/V2-M2-012 ; distinction Texas faible vs valeurs de manche sur 1SA, distracteurs 3SA direct ajoutés en manche.

- P5 : 8 corrections de formulation, notamment chassé-croisé non révélé et objectif de faire déclarer l'ouvreur. SEF-V44-026/027 et SEF-Q400-B-036 : 9 H + majeure cinquième = 10 HL ; proposition 3SA en arbitrage H/HL, référence fiche Ecole GAB avril 2024 (extrait indexé) https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf. V44-031 : six Piques, 11 HL, invitation discutable ; 4♠ proposé. Q685-B-052 : bicolore 5♥4♦, annonce naturelle de la mineure à examiner ; proposition de main régulière cible. Aucun arbitrage appliqué.

- P6 : 19 formulations/corrigés revus ; suppression des indices de longueur/force et clarification du choix du déclarant pour re-Texas et transfert après 3SA artificiel. Distinction systématique fit troisième et refus sur 2SA. Aucun changement de prérequis/réservoir pour P6.

## Contrôles réellement exécutés
- Extraction JSON de training-data via blob 59fb3ca4c826d4f08905b1c5b076b7f09a5304fb ; 3000 objets, 3000 IDs distincts ; 608 IDs selon prérequis, tous présents.
- Sur 608 : 13 cartes, rangs valides, unicité des cartes par couleur, H et forme recalculés, quatre choix distincts avec réponse présente : aucune anomalie détectée.
- Sur les 320 revus : légalité des enchères possibles au tour concerné, lecture individuelle, comparaison des analogues par empreinte main/séquence et profil force/forme/réponse sur l'ensemble des 3000 ; aucun doublon exact de main/séquence détecté parmi les 320. Les analogues sont des candidats, pas une preuve d'identité sémantique complète.
- P5–P6 : contrôle mécanique des rangs d'enchères croissants et des choix au-dessus de la dernière enchère (ou Passe) : 115/115.
- 83 corrections : mêmes contrôles structurels, aucune anomalie ; relecture de verdicts.json et corrections.json depuis la branche, unicité et appartenance des IDs, cohérence des clés.
- Tests locaux du dépôt et CI non exécutés à ce stade : pas de checkout/environnement Node associé au dépôt dans le connecteur. La vérification de toute la légalité des séquences complexes et des prérequis/séances restants n'est pas faite.

## Passe 7 — Texas mineurs 1SA
58 verdicts individuels; 34 corrections complètes, 1 arbitrage. Corrigés Q685-B-066/067 contextualisés (trois/quatre Carreaux), questions révélatrices neutralisées, difficulté harmonisée sur rectifications directes. Contrastes faible/fort, Trèfle/Carreau, modulation favorable ou non conservés. B-117/118 très proches, éviter répétition. B-063 6 H + longueur : seuil HL à arbitrer. Référence secondaire SEF 2024 : https://scjc-bridge.fr/les-nouveautes-du-sef-2018 (courte nommée, 3SA autre mineure sans ambition chelem). Traitement QPJB du catalogue conservé. Contrôles JS réellement exécutés : 58 mains et H/forme, choix/rangs, appartenance et unicité verdicts; groupes et verrous lus; comparaison profils et empreintes sur 3000 objets. Aucun test local Node/CI; pas de recette moteur.

## Passe 8 — Contres d'entame et développements 2SA
48 verdicts; 29 corrections. Contraste : Surcontre punitif après Stayman, fitté sans tenue après Texas. Q685-B-036 : distracteur 2♥ rétabli. Q685-B-126 : 4♦ 5–5 majeur limité à la manche, projet précisé sans prétendre exclure le chelem avec 9 H et une distribution forte. 2SA–3♠ : traitement QPJB du Texas Trèfle fitté préservé; pas de généralisation du seuil exact ni de certification SEF indépendante. Plusieurs répétitions strictes de profils signalées. Références secondaires : https://encheresdebridge.fr/intervention-stayman-texas.php ; https://bridgesaintcloud.fr/espoir2_11.html ; https://bridgus.online/. Contrôles réellement exécutés : 48 mains H/forme/13 cartes, rangs et choix (Surcontre après Contre), unicité et appartenance des verdicts, lecture groupes et verrous, comparaison profils/empreintes sur 3000 objets. Aucun test local Node/CI.

## Passe 9 — Déclenchements et choix Roudi
40 QCM lus individuellement. Seuil 11 HL avec cinq cartes ; six cartes, 11–12 HL pour le relais. Sources secondaires consultées : https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/le-roudi-2 et https://bridgesaintcloud.fr/quesaquo1509.html. Q685-B-132 à arbitrer (13 HL avec six cartes) ; Q685-B-071 corrigé (fit 6–3). Trois invitations naturelles 2SA à reclasser en roudi.choix, sans changement de groupe S29/2. Questions révélatrices neutralisées. Contrôles JS sur 40 mains, H/HL, forme, rangs et choix, unicité des IDs, groupes/verrous et analogues catalogue. Tests locaux et CI non exécutés.

## Passe 10 — Réponses et suites Roudi
53 QCM lus individuellement. Les codes 2♦ non fitté sans force, 2♥ trois cartes minimum, 2♠ trois cartes maximum sont cohérents sur les mains testées (12/14 H fittées ; manque de cas 13 H fitté à évaluer, ainsi que l'exception main faible à Trèfle). Les questions donnant longueur/force sont neutralisées. Quatre arbitrages de 3♥ sur réponse 2♥ minimum (V44-064, V2-M6-005, Q400-B-071, Q685-B-143) ; distinguer invitation catalogue et séquences SEF décrites par les références, arrêter ou conclure selon valorisation. V1-M5-001 : statut du saut 3♠ après 2♦ avec six cartes, divergence de sources ; pas de correction sans arbitrage. Après 2♠ maximum, ne pas enseigner 3M comme simple invitation. Sources effectivement consultées : https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/ ; https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html ; https://bridgesaintcloud.fr/quesaquo1509.html ; https://www.adeliebridge.fr/roudi-trois-reponses/. Contrôles JS sur 53 mains, H/HL, forme, rangs et choix, unicité IDs, groupes/verrous et analogues catalogue ; tests locaux/CI non exécutés.

## Passe 11 — Déclenchements et choix Drury
45 QCM lus individuellement. Conditions SEF 2024 confirmées par sources secondaires : 3 atouts et ≥11 HLD ou ≥4 atouts, ≥11 HLD sans singleton/chicane pour Drury ; 2SA après Passe fitté ≥4 avec singleton/chicane. Faux Drury sans fit non retenu. V2-M6-008 (1SA sans fit) reclassé drury.choix, groupe S30/2 inchangé. Questions révélatrices neutralisées, corrigés de seuil développés. Q685-B-167 : priorité éventuelle d'une rencontre 3♦ avec AD762 à arbitrer. Formes/honneurs proches (B-152/153 et B-080/146) signalés ; contrastes utiles faible/constructif, doubleton/singleton et fit/non-fit conservés. Références consultées : https://scjc-bridge.fr/les-nouveautes-du-sef-2018 ; https://www.bridgesaintcloud.fr/quesaquoDRURY.html ; https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523. Contrôles JS sur 45 mains H/HL, forme, rangs et choix, unicité IDs, groupes/verrous et analogues catalogue ; tests locaux/CI non exécutés.

## Passe 12 — Réponses et suites Drury
44 QCM lus individuellement. Référence fédérale : Jean-Pierre Desmoulins, L'As de Trèfle n°52, septembre 2024, p.28–29, https://res.cloudinary.com/ffbridge/image/upload/v1725446344/production/cms/ADTN_52_BD_2_6a558ea8dd.pdf ; texte récupéré, capture PDF refusée (taille 21,7 Mo). La répétition simple montre une ouverture faible, non six cartes obligatoires ; 2♦ attente avec espoir de manche ; saut 3M chelem, 4M conclusion. Après 2♦ le répondant revient au palier 2 avec trois atouts et 3 avec quatre. Relais 3♣ après 2SA fitté court : courte nommée, retour atout = Trèfle. Exemples proches en Cœur et Pique conservés comme contrastes de code. Questions révélatrices neutralisées, corrigés faibles/chelem/valorisation et seuils explicités. Aucun arbitrage ajouté dans cette passe.

## Bilan cumulé
{"VALIDE":358,"RECLASSER_REFORMULER":236,"ARBITRAGE":14} ; 233 corrections complètes, 5 changements prérequis, 1 réservoir.

## Contrôles finaux exécutés
Catalogue réel : 3000 objets ; prérequis : 3000 IDs ; périmètre C exact : 608 ; 608 verdicts, 608 IDs distincts, aucun ID manquant ou hors périmètre. 233 corrections complètes : ID, main de 13 cartes, H, forme, quatre choix distincts et réponse présente contrôlés. 5 prérequis proposés cohérents avec les verdicts ; groupes initiaux réels, groupes proposés existants ; 0 anomalie de ce contrôle. Vérification des rangs et choix à chaque passe, hors cas où la légalité fine des séquences implicites n'est pas prouvée. Contrôles effectués en JS via données GitHub, pas d'exécution des scripts de test du dépôt ni de CI ; pas de recette du moteur.

## Arbitrages à résoudre par coordinateur
- SEF-N091-1 : 9 H et cinq Carreaux = 10 HL : la règle SEF quantitative en HL conduit normalement à 3SA, tandis que le corrigé applique 8–9 H. Arbitrage sur maintien d'un traitement QPJB documenté ou correction à 3SA.
- SEF-V44-026 : 9 H + cinq Cœurs = 10 HL : 2SA actuel cohérent avec traitement H de plusieurs cas QPJB, mais SEF enseigné 8–9 HL invitation, 10 HL manche. Proposition 3SA soumise à arbitrage commun H/HL.
- SEF-V44-027 : 9 H + cinq Piques = 10 HL : même conflit H/HL que 026. Proposition 3SA, sans changer avant arbitrage.
- SEF-V44-031 : 9 H + six Piques = 11 HL, fit huitième assuré, doubleton : 3♠ invitation justifiée par qualité dans corrigé historique mais seuil HL de manche. Arbitrer avec 030 ; proposition 4♠ ou remplacement de main pour tester une véritable invitation.
- SEF-Q400-B-036 : 9 H et cinq Piques = 10 HL, 2SA actuel : même arbitrage de seuil que V44-026/027, 3SA proposé.
- SEF-Q685-B-052 : 10 H, cinq Cœurs et quatre Carreaux, 3SA proposé. Le 3♦ naturel forcing de manche pourrait être pertinent pour ce bicolore mais n'est pas offert ; arbitrer en gardant la main régulière cible ou en remplaçant par une forme 5–3–3–2.
- SEF-Q685-B-063 : 6 H et six Carreaux = 8 HL avec RV9742 : 2SA invitation peut être défendable selon évaluation de la longue et traitement ; arbitrer la frontière faible/invitante plutôt que masquer ce choix.
- SEF-Q685-B-132 : 11 H + 2 L = 13 HL, six Piques : hors zone 11–12 HL du Roudi sixième selon le SEF ; 4♠ direct possible, 3♠ direct forcing de manche avec espoir de chelem. Choix proposés ne permettent pas une réponse SEF claire. Arbitrer avec le coordinateur.
- SEF-V44-064 : 11 H, cinq Cœurs et doubleton ♣ : 3♥ donné comme invitation après 2♥ minimum. Certaines références SEF privilégient arrêt au palier 2 ou manche et réservent les enchères intermédiaires à d'autres projets. Demander arbitrage explicite sur le statut de 3♥ et la valorisation HLD ; ajouter Passe aux choix si retenu.
- V1-M5-001 : 10 H + 2 L = 12 HL, six Piques face à deux : 2♠ est non forcing, mais source SEF 2018 propose saut à 3♠ pour invitation avec six cartes après négatif. Question 'si minimum' suppose force non connue. Arbitrer statut de 3♠ et reformuler le projet.
- V2-M6-005 : 11 H, cinq Cœurs, doubleton ♣ et fit minimum : 3♥ présenté comme invitation. Statut à arbitrer avec SEF et traitements du catalogue ; comparer 006 même main maximum.
- SEF-Q400-B-071 : 11 H, cinq Cœurs et doubleton ♠, fit minimum : 3♥ donné comme invitation. Même problème de statut que V44-064. Arbitrer et prévoir Passe comme option si nécessaire.
- SEF-Q685-B-143 : 11 H, cinq Cœurs et doubleton ♣, fit minimum : 3♥ invitation selon catalogue, statut contesté dans références. Arbitrer comme V44-064.
- SEF-Q685-B-167 : 10 H, quatre Piques, ♥6 singleton et cinq Carreaux AD762 : 2SA fitté parmi choix. Une enchère de rencontre à 3♦ pourrait être défendable avec une belle cinquième selon traitement ; vérifier priorité de rencontre vs 2SA dans catalogue/SEF avant de considérer réponse unique.

## Limites
Aucun QCM restant à auditer individuellement. Les arbitrages ne sont pas appliqués silencieusement. Les tests existants locaux/CI, l'accès effectif des réserves implicites et l'intégration restent non vérifiés. Aucun merge ni fichier commun modifié.

## Recette complémentaire de reprise — 27/11/2026

Sur le SHA 45008293ba6de27c07621db7fceda4295c9d886c : catalogue réel extrait du blob quizz.html (3000 objets), 608 IDs C distincts, ensemble exact avec la table de prérequis, 608 justifications non vides et concepts initiaux concordants ; 233 corrections rattachées à un verdict de modification, 5 prérequis conformes aux verdicts et 1 changement de réservoir dans le périmètre. Application virtuelle des 233 objets corrigés au catalogue, sans écriture commune : contrôle des 608 mains (13 cartes, H, forme, rangs distincts par couleur, quatre choix distincts, réponse présente), 0 anomalie. Reproduction en JavaScript des règles de inspect_question de scripts/audit_quiz_auction_legality.py, SHA blob 60bb76e997f059e0dbc2e22f31e66080b8da097e, rotation non stricte (Passe implicites) : avant 608 CONFORME / 0 ANOMALIE / 0 NON_ANALYSABLE ; après 608 / 0 / 0, soit 2432 choix contrôlés par état. Ce diagnostic ne constitue ni une exécution du script Python original, ni une validation SEF externe, ni une recette du moteur. Node v22.16.0 disponible mais git ls-remote échoue effectivement par DNS ; 0 check-run, 0 workflow run, 0 statut pour le SHA testé. Le workflow quiz-sef-integrite.yml est filtré par chemins et les six livrables C ne déclenchent pas ce workflow ; le connecteur ne propose pas workflow_dispatch. Les 14 arbitrages restent réservés au coordinateur, voir la liste ci-dessus. La recette intégrée doit être exécutée sur le catalogue consolidé.


## Recette locale partielle — tests unitaires originaux

Le checkout Git est toujours bloqué (git ls-remote : Could not resolve host: github.com). Les fichiers scripts/audit_quiz_auction_legality.py et tests/test_quiz_auction_legality.py ont été récupérés séparément puis reconstitués localement ; git hash-object donne exactement les blobs GitHub 60bb76e997f059e0dbc2e22f31e66080b8da097e et b978e651454640f9e006d856cb924fb57449b9b9. Exécution réelle : python -m unittest discover -s tests -p test_quiz_auction_legality.py ; 18 tests, 0 échec, OK. La suite test_quiz_sef_integrite.py a également donné 15 tests réussis sur les copies locales reconstituées, mais les SHA Git ne concordent pas pour cette paire de fichiers ; résultat indicatif, non certifié comme exécution exacte du dépôt. Ne pas confondre ces tests unitaires avec l'exécution des scripts originaux sur le catalogue complet intégré. Les 608 diagnostics comparatifs en JS restent documentés ci-dessus. CI, tests Node et recette intégrée restent à exécuter par coordinateur.


## Recette locale — certification des quatre fichiers, 33/33

Copies locales des deux suites et de leurs deux scripts maintenant strictement identiques aux blobs GitHub : git hash-object donne scripts/audit_quiz_auction_legality.py 60bb76e997f059e0dbc2e22f31e66080b8da097e ; scripts/verify_quiz_sef.py b0890fea87575e778797fd12f613efd254829b3b ; tests/test_quiz_auction_legality.py b978e651454640f9e006d856cb924fb57449b9b9 ; tests/test_quiz_sef_integrite.py 19dbbaea014a0716b23bb4df9b4d3e8f8b67ee15. Les divergences précédentes étaient dues uniquement à la mise en forme des lignes et fins de fichier des copies locales. Commande réellement exécutée : python -m unittest discover -s tests -p 'test_quiz*.py' ; Ran 33 tests in 6.224s ; OK (18 légalité + 15 intégrité). Ce résultat remplace la réserve sur les 15 tests précédents. Checkout Git toujours impossible (Could not resolve host: github.com). Les scripts originaux sur le catalogue consolidé, tests Node et CI ne sont pas exécutés ; la recette sur 608 QCM via JS reste distincte. Aucune modification du moteur, du catalogue commun ni des tests du dépôt. Les 14 arbitrages et la recette intégrée relèvent du coordinateur.


## Dernier contrôle global de non-régression structurelle

Reproduction en JS du contrôle inspect de verify_quiz_sef.py sur le catalogue réel (blob 59fb3ca4c826d4f08905b1c5b076b7f09a5304fb), avant et après application virtuelle des 233 corrections C : 3000/3000, zéro erreur, zéro avertissement (y compris ordre des cartes, thème, difficulté, énoncé et explication non vides, choix canoniques). Lot C après correction : 608/608, zéro erreur et avertissement. Aucun changement de fichier commun. Quatre SHA Git des scripts/tests Python locaux revérifiés ; python -m unittest discover -s tests -p 'test_quiz*.py' : 33 tests en 6.184 s, OK. git ls-remote échoue toujours par DNS. PR #568 : base inchangée ccd8f20811b9531bbfccb8352ec60953dd7d07cb, zéro workflow run au SHA f5b6a15bfbf9c44edde8bdd95b955a2753b611c0. Ce contrôle ne remplace pas la recette intégrée du coordinateur (arbitrages, application commune, scripts originaux sur catalogue consolidé, Node/CI). Aucun travail pédagogique individuel restant.


## Passe consolidée de résolution proposée des 14 arbitrages C

Les 14 cas A_TRAITER du registre du coordinateur sont repris ci-dessous : objets QCM complets, différences avant/après, références, conditions d'intégration et groupe/prérequis d'origine. Une 15e proposition dépendante préserve le miroir V2-M6-005/006. Aucun changement de verdict ni de correction canonique avant décision du coordinateur. Sur 15 objets, contrôle JS effectif : 13 cartes, ordre/rangs, H/forme recalculés, 4 choix distincts, réponse présente, légalité croissante des enchères et choix au-dessus du dernier contrat (Passe autorisé), thème, difficulté, énoncé et corrigé. Zéro anomalie ; couverture exacte des 14 arbitrages. Rotation complète, conformité pédagogique indépendante, recette du moteur et CI non certifiées. Le support de formation FFB/Université du Bridge (diapo 50, correction proposée à la p. 51 du SEF 2024) montre le saut propositionnel avec six cartes après 2♦; ce n'est pas une validation universelle de 3M après 2♥ fitté. Les 10 propositions de retrait d'affectation de la contre-revue restent dans le commentaire #7228462108, sans suppression. Rectification de traçabilité : les comptes rendus antérieurs de 33 tests unitaires locaux ne sont pas indépendamment vérifiables dans le conteneur actuel (aucun fichier ni log disponible) ; ne pas les retenir comme preuve certifiée sans réexécution. Vérification réelle dans cette reprise : git ls-remote https://github.com/CapGui13/QPJB.git HEAD échoue par DNS ; Node v22.16.0 et Python 3.13.5 disponibles. Aucun script natif du dépôt ni CI exécuté dans cette passe.

```json
{
  "schema": "QPJB_C_ARBITRAGES_PROPOSITIONS_V1",
  "base": "ccd8f20811b9531bbfccb8352ec60953dd7d07cb",
  "headRead": "764b95a159131a09f6a483c034d58dfda40c71aa",
  "scope": "14 arbitrages C + 1 dépendance miroir; propositions alternatives non intégrées, aucun verdict ni fichier commun modifié.",
  "checks": {
    "arbitrages": 14,
    "dependent": 1,
    "structuralErrors": 0,
    "formalErrors": 0,
    "answerChanges": 7
  },
  "items": [
    {
      "id": "SEF-N091-1",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.seuil",
      "groups": [],
      "prerequis": {
        "concept": "sa1.seuil",
        "stage": 0,
        "minSession": 3,
        "requires": [
          {
            "concept": "ouv.sa1",
            "minExposure": 1
          }
        ]
      },
      "reason": "Corrige la confusion H/HL.",
      "condition": "Sous réserve de l'harmonisation du seuil H/HL sur le catalogue.",
      "references": [
        "https://encheresdebridge.fr/reponses-precises.php",
        "https://www.bridge-chailley.fr/apres-louverture-d1sa-debutants/"
      ],
      "changes": [
        {
          "field": "answer",
          "before": "2SA",
          "after": "3SA"
        },
        {
          "field": "explain",
          "before": "Avec 9 H et une main régulière sans majeure quatrième, votre camp totalise 24 à 26 H face à 1SA (15–17 H). Proposez la manche par 2SA.",
          "after": "9 H et une mineure cinquième donnent 10 HL. Sans majeure quatrième, concluez à 3SA sur 1SA (15–17 H). 2SA est réservé à la zone propositionnelle de 8–9 HL."
        }
      ],
      "qcm": {
        "id": "SEF-N091-1",
        "theme": "sa",
        "hand": [
          [
            "R",
            "D",
            "8"
          ],
          [
            "10",
            "5",
            "3"
          ],
          [
            "R",
            "V",
            "7",
            "6",
            "2"
          ],
          [
            "8",
            "3"
          ]
        ],
        "h": 9,
        "shape": [
          3,
          3,
          5,
          2
        ],
        "auction": [
          "Partenaire : 1SA"
        ],
        "context": "Votre partenaire ouvre de 1SA (15–17 H) et les adversaires passent. Quelle est votre réponse selon le SEF ?",
        "answer": "3SA",
        "choices": [
          "2♣",
          "Passe",
          "2SA",
          "3SA"
        ],
        "explain": "9 H et une mineure cinquième donnent 10 HL. Sans majeure quatrième, concluez à 3SA sur 1SA (15–17 H). 2SA est réservé à la zone propositionnelle de 8–9 HL.",
        "difficulty": 1,
        "difficultyReason": "Calcul élémentaire de la zone de manche face à Sans-Atout",
        "caseFamily": "cas-143",
        "sourceOriginalExplain20261104V462": "Même avec cinq Carreaux, 8 à 9 H réguliers justifient une proposition de manche à 2SA.",
        "sourceOriginalContext20261104V462": "Le partenaire ouvre de 1SA (15-17 H). Quelle réponse ?",
        "pedagogicalReview20261104V462": {
          "audit": "REVUE_54_REPONSES_SANS_ATOUT_2026-11-04.md",
          "verdict": "reponse_coherente_dans_les_choix",
          "answerUnchanged": true,
          "editorialChange": true,
          "contextEdited": true,
          "reason": "Avec 9 H, cinq Carreaux, une main 3-3-5-2 et pas de majeure quatrième, la réponse à 2SA est une invitation naturelle face à 1SA."
        }
      }
    },
    {
      "id": "SEF-V44-026",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas.suite",
      "groups": [
        {
          "session": 10,
          "group": 3,
          "decision": "Texas rectifié : Passe, invitation, choix de manche avec 5 ou 6",
          "role": "objectif",
          "phase": "initial"
        },
        {
          "session": 15,
          "group": 1,
          "decision": "Même force, distributions différentes : choix du bon outil",
          "role": "objectif",
          "phase": "initial"
        }
      ],
      "prerequis": {
        "concept": "sa1.texas.suite",
        "stage": 2,
        "minSession": 9,
        "requires": [
          {
            "concept": "sa1.texas",
            "minExposure": 1
          }
        ]
      },
      "reason": "Conserve une véritable invitation.",
      "condition": null,
      "references": [
        "https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf"
      ],
      "changes": [
        {
          "field": "h",
          "before": 9,
          "after": 8
        },
        {
          "field": "explain",
          "before": "Vous avez exactement cinq Cœurs et 9 H (24–26 H cumulés). Après la rectification normale sur 1SA, le fit troisième reste inconnu : 2SA invite en laissant les deux décisions à l'ouvreur. Avec trois Cœurs, il peut préférer la majeure ; sans ce soutien, il choisit Passe ou 3SA selon sa force. 4♥ direct supposerait un fit et une acceptation non établis.",
          "after": "Cinq Cœurs, 8 H soit 9 HL. La rectification à 2♥ sur 1SA ne garantit pas le fit troisième. 2SA propose la manche : l'ouvreur choisit le contrat et le palier selon sa force et son soutien."
        },
        {
          "field": "hand",
          "before": [
            [
              "V",
              "7",
              "4"
            ],
            [
              "A",
              "9",
              "7",
              "6",
              "4"
            ],
            [
              "D",
              "V",
              "8"
            ],
            [
              "V",
              "9"
            ]
          ],
          "after": [
            [
              "V",
              "7",
              "4"
            ],
            [
              "A",
              "9",
              "7",
              "6",
              "4"
            ],
            [
              "D",
              "V",
              "8"
            ],
            [
              "9",
              "8"
            ]
          ]
        }
      ],
      "qcm": {
        "theme": "stayman",
        "shape": [
          3,
          5,
          3,
          2
        ],
        "h": 8,
        "answer": "2SA",
        "auction": [
          "Partenaire : 1SA",
          "Vous : 2♦ (Texas Cœur)",
          "Partenaire : 2♥"
        ],
        "explain": "Cinq Cœurs, 8 H soit 9 HL. La rectification à 2♥ sur 1SA ne garantit pas le fit troisième. 2SA propose la manche : l'ouvreur choisit le contrat et le palier selon sa force et son soutien.",
        "difficulty": 3,
        "choices": [
          "2SA",
          "3♥",
          "3SA",
          "4♥"
        ],
        "context": "Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♦ pour les Cœurs, rectifié par l'ouvreur à 2♥. Quelle est votre deuxième enchère ?",
        "id": "SEF-V44-026",
        "hand": [
          [
            "V",
            "7",
            "4"
          ],
          [
            "A",
            "9",
            "7",
            "6",
            "4"
          ],
          [
            "D",
            "V",
            "8"
          ],
          [
            "9",
            "8"
          ]
        ],
        "caseFamily": "v44-cas-026",
        "difficultyReason": "Après Texas Cœur, inviter par 2SA avec cinq Cœurs et 9 H, sans supposer le fit troisième de l'ouvreur.",
        "sourceOriginalContext20261104V468": "Quelle enchère convient à cette situation ?",
        "sourceOriginalExplain20261104V468": "Cinq Cœurs exactement et 9 H : 2SA propose la manche. L’ouvreur peut choisir 3SA ou 4♥ selon son soutien.",
        "pedagogicalReview20261104V468": {
          "audit": "REVUE_30_STAYMAN_TEXAS_2026-11-04.md",
          "verdict": "reponse_coherente_dans_les_choix",
          "answerUnchanged": true,
          "contextEdited": true,
          "editorialChange": true,
          "reason": "Avec exactement cinq Cœurs (♥A9764), 9 H et la forme 3-5-3-2, la rectification du Texas n'assure pas que l'ouvreur possède trois cartes dans votre majeure. 2SA constitue une invitation de manche : selon sa force et son soutien, l'ouvreur pourra passer, jouer 3SA ou choisir la majeure."
        }
      }
    },
    {
      "id": "SEF-V44-027",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas.suite",
      "groups": [],
      "prerequis": {
        "concept": "sa1.texas.suite",
        "stage": 2,
        "minSession": 9,
        "requires": [
          {
            "concept": "sa1.texas",
            "minExposure": 1
          }
        ]
      },
      "reason": "Corrige le seuil sans changer la main.",
      "condition": null,
      "references": [
        "https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf"
      ],
      "changes": [
        {
          "field": "answer",
          "before": "2SA",
          "after": "3SA"
        },
        {
          "field": "explain",
          "before": "Avec exactement cinq Piques et 9 H, la manche dépend de l'évaluation de l'ouvreur (24–26 H cumulés). Sa rectification à 2♠ ne promet pas trois atouts. 2SA invite tout en lui permettant de revenir aux Piques s'il en possède trois, ou de rester à Sans-Atout sinon. 3♠ inviterait dans une couleur supposant ici une longueur supplémentaire.",
          "after": "Cinq Piques et 9 H donnent 10 HL. La rectification à 2♠ ne promet pas trois Piques. 3SA impose la manche et laisse l'ouvreur revenir à 4♠ avec trois Piques."
        }
      ],
      "qcm": {
        "theme": "stayman",
        "shape": [
          5,
          3,
          3,
          2
        ],
        "h": 9,
        "answer": "3SA",
        "auction": [
          "Partenaire : 1SA",
          "Vous : 2♥ (Texas Pique)",
          "Partenaire : 2♠"
        ],
        "explain": "Cinq Piques et 9 H donnent 10 HL. La rectification à 2♠ ne promet pas trois Piques. 3SA impose la manche et laisse l'ouvreur revenir à 4♠ avec trois Piques.",
        "difficulty": 3,
        "choices": [
          "2SA",
          "3♠",
          "3SA",
          "4♠"
        ],
        "context": "Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♥ pour les Piques, rectifié par l'ouvreur à 2♠. Quelle est votre deuxième enchère ?",
        "id": "SEF-V44-027",
        "hand": [
          [
            "V",
            "10",
            "7",
            "5",
            "3"
          ],
          [
            "A",
            "R",
            "6"
          ],
          [
            "10",
            "7",
            "2"
          ],
          [
            "V",
            "6"
          ]
        ],
        "caseFamily": "v44-cas-027",
        "difficultyReason": "Après Texas Pique 1SA–2♥–2♠, inviter à la manche par 2SA avec cinq Piques et 9 H, en distinguant la recherche du fit 5–3 d'une majeure sixième.",
        "sourceOriginalContext20261104V468": "Quelle enchère convient à cette situation ?",
        "sourceOriginalExplain20261104V468": "Avec cinq Piques exactement et 9 H, 2SA invite à la manche tout en laissant le choix du contrat à l’ouvreur.",
        "pedagogicalReview20261104V468": {
          "audit": "REVUE_30_STAYMAN_TEXAS_2026-11-04.md",
          "verdict": "reponse_coherente_dans_les_choix",
          "answerUnchanged": true,
          "contextEdited": true,
          "editorialChange": true,
          "reason": "Avec exactement cinq Piques (♠V10753), 9 H et la forme 5-3-3-2, la rectification du Texas n'assure pas que l'ouvreur possède trois cartes dans votre majeure. 2SA constitue une invitation de manche : selon sa force et son soutien, l'ouvreur pourra passer, jouer 3SA ou choisir la majeure."
        }
      }
    },
    {
      "id": "SEF-V44-031",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas.suite",
      "groups": [],
      "prerequis": {
        "concept": "sa1.texas.suite",
        "stage": 2,
        "minSession": 9,
        "requires": [
          {
            "concept": "sa1.texas",
            "minExposure": 1
          }
        ]
      },
      "reason": "Conserve le contraste proposition/manche avec V44-030, sur des valeurs différentes.",
      "condition": null,
      "references": [
        "https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf"
      ],
      "changes": [
        {
          "field": "h",
          "before": 9,
          "after": 7
        },
        {
          "field": "explain",
          "before": "Avec 9 H et six Piques, vous avez un fit certain face à l'ouverture régulière de 1SA. Mais la longue ♠RV10965 ne comporte pas l'As et le Roi réunis, contrairement au cas d'une couleur très productive. Dans cette décision limite, 3♠ invite l'ouvreur à la manche en tenant compte de la qualité de la main ; ce n'est pas un seuil absolu de points.",
          "after": "Six Piques et 7 H donnent 9 HL. L'ouverture régulière de 1SA garantit au moins deux Piques : le fit est établi. 3♠ propose la manche avec une longue sixième et des valeurs limites ; 2SA ne décrirait pas cette longueur."
        },
        {
          "field": "hand",
          "before": [
            [
              "R",
              "V",
              "10",
              "9",
              "6",
              "5"
            ],
            [
              "V",
              "4"
            ],
            [
              "A",
              "7",
              "4"
            ],
            [
              "8",
              "5"
            ]
          ],
          "after": [
            [
              "D",
              "V",
              "10",
              "9",
              "6",
              "5"
            ],
            [
              "9",
              "4"
            ],
            [
              "A",
              "7",
              "4"
            ],
            [
              "8",
              "5"
            ]
          ]
        }
      ],
      "qcm": {
        "theme": "stayman",
        "shape": [
          6,
          2,
          3,
          2
        ],
        "h": 7,
        "answer": "3♠",
        "auction": [
          "Partenaire : 1SA",
          "Vous : 2♥ (Texas Pique)",
          "Partenaire : 2♠"
        ],
        "explain": "Six Piques et 7 H donnent 9 HL. L'ouverture régulière de 1SA garantit au moins deux Piques : le fit est établi. 3♠ propose la manche avec une longue sixième et des valeurs limites ; 2SA ne décrirait pas cette longueur.",
        "difficulty": 2,
        "choices": [
          "3♠",
          "2SA",
          "3SA",
          "4♠"
        ],
        "context": "Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♥ pour les Piques, rectifié par l'ouvreur à 2♠. Quelle est votre deuxième enchère ?",
        "id": "SEF-V44-031",
        "hand": [
          [
            "D",
            "V",
            "10",
            "9",
            "6",
            "5"
          ],
          [
            "9",
            "4"
          ],
          [
            "A",
            "7",
            "4"
          ],
          [
            "8",
            "5"
          ]
        ],
        "caseFamily": "v44-cas-031",
        "difficultyReason": "Compléter naturellement un Stayman ou un Texas",
        "sourceOriginalContext20261104V468": "Quelle enchère convient à cette situation ?",
        "sourceOriginalExplain20261104V468": "Six Piques et 9 H : 3♠ constitue une invitation à la manche à l’atout, différente du 2SA avec cinq cartes.",
        "pedagogicalReview20261104V468": {
          "audit": "REVUE_30_STAYMAN_TEXAS_2026-11-04.md",
          "verdict": "reponse_coherente_dans_les_choix",
          "answerUnchanged": true,
          "contextEdited": true,
          "editorialChange": true,
          "reason": "Votre main de 9 H compte six Piques (♠RV10965), ce qui garantit au moins huit atouts face à un ouvreur de 1SA même s'il n'en a que deux. Après la rectification du Texas, 3♠ est une proposition de manche dans la longue, à distinguer du 2SA avec seulement cinq cartes."
        }
      }
    },
    {
      "id": "SEF-Q400-B-036",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas.suite",
      "groups": [
        {
          "session": 10,
          "group": 3,
          "decision": "Texas rectifié : Passe, invitation, choix de manche avec 5 ou 6",
          "role": "objectif",
          "phase": "initial"
        }
      ],
      "prerequis": {
        "concept": "sa1.texas.suite",
        "stage": 2,
        "minSession": 9,
        "requires": [
          {
            "concept": "sa1.texas",
            "minExposure": 1
          }
        ]
      },
      "reason": "Préserve l'invitation S10/G3.",
      "condition": null,
      "references": [
        "https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "3"
            ],
            [
              "R",
              "7"
            ],
            [
              "8",
              "6",
              "2"
            ]
          ],
          "after": [
            [
              "R",
              "10",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "3"
            ],
            [
              "R",
              "7"
            ],
            [
              "8",
              "6",
              "2"
            ]
          ]
        },
        {
          "field": "h",
          "before": 9,
          "after": 8
        },
        {
          "field": "explain",
          "before": "9 H, distribution 5–3–2–3. Avec exactement cinq Piques et 9 H, invitez à 2SA. La rectification n’a pas promis trois Piques.",
          "after": "Cinq Piques et 8 H donnent 9 HL. 2SA invite à la manche. La rectification à 2♠ sur 1SA ne garantit pas trois atouts : l'ouvreur choisit le contrat et le palier."
        }
      ],
      "qcm": {
        "id": "SEF-Q400-B-036",
        "theme": "stayman",
        "hand": [
          [
            "R",
            "10",
            "9",
            "7",
            "4"
          ],
          [
            "D",
            "8",
            "3"
          ],
          [
            "R",
            "7"
          ],
          [
            "8",
            "6",
            "2"
          ]
        ],
        "h": 8,
        "shape": [
          5,
          3,
          2,
          3
        ],
        "auction": [
          "Partenaire : 1SA",
          "Adversaire : Passe",
          "Vous : 2♥ (Texas)",
          "Adversaire : Passe",
          "Partenaire : 2♠",
          "Adversaire : Passe"
        ],
        "context": "Les adversaires passent. Selon les traitements QPJB indiqués par la séquence, quelle est votre prochaine enchère ?",
        "answer": "2SA",
        "choices": [
          "Passe",
          "2SA",
          "3♠",
          "3SA"
        ],
        "explain": "Cinq Piques et 8 H donnent 9 HL. 2SA invite à la manche. La rectification à 2♠ sur 1SA ne garantit pas trois atouts : l'ouvreur choisit le contrat et le palier.",
        "difficulty": 3,
        "difficultyReason": "Décision ciblée : Avec exactement cinq Piques et 9 H, invitez à 2SA.",
        "caseFamily": "q400-b-texas-suite1",
        "editorialSource": "Catalogue QPJB : SEF-V44-027; contrat #536 et mission #538."
      }
    },
    {
      "id": "SEF-Q685-B-052",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas.suite",
      "groups": [
        {
          "session": 10,
          "group": 3,
          "decision": "Texas rectifié : Passe, invitation, choix de manche avec 5 ou 6",
          "role": "objectif",
          "phase": "initial"
        }
      ],
      "prerequis": {
        "concept": "sa1.texas.suite",
        "stage": 2,
        "minSession": 9,
        "requires": [
          {
            "concept": "sa1.texas",
            "minExposure": 1
          }
        ]
      },
      "reason": "Élimine le bicolore 5–4 et une réponse naturelle concurrente absente des choix.",
      "condition": null,
      "references": [
        "https://bridgelegecapferret.club.ffbridge.fr/document-download/662775ec8a17f_Simultanlvesavril2024.pdf"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "D",
              "7"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "A",
              "9",
              "6",
              "2"
            ],
            [
              "8",
              "3"
            ]
          ],
          "after": [
            [
              "D",
              "7"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "A",
              "9",
              "6"
            ],
            [
              "8",
              "3",
              "2"
            ]
          ]
        },
        {
          "field": "shape",
          "before": [
            2,
            5,
            4,
            2
          ],
          "after": [
            2,
            5,
            3,
            3
          ]
        },
        {
          "field": "context",
          "before": "Les adversaires passent sauf indication contraire. Quelle est votre enchère ?",
          "after": "Votre partenaire ouvre de 1SA. Vous faites un Texas Cœur, qu'il rectifie à 2♥. Les adversaires passent. Quelle est votre deuxième enchère ?"
        },
        {
          "field": "explain",
          "before": "10 H, distribution 2–5–4–2. 5 Cœurs, 10 H : sur 1SA la rectification ne garantit pas trois atouts. Le retour à Sans-Atout laisse l’ouvreur choisir avec son éventuel soutien.",
          "after": "Cinq Cœurs, 10 H soit 11 HL, et une forme 2–5–3–3. 3SA impose la manche sans présumer un soutien de trois Cœurs. L'ouvreur choisira 4♥ avec trois atouts ou 3SA sinon."
        }
      ],
      "qcm": {
        "id": "SEF-Q685-B-052",
        "theme": "stayman",
        "hand": [
          [
            "D",
            "7"
          ],
          [
            "R",
            "V",
            "9",
            "7",
            "4"
          ],
          [
            "A",
            "9",
            "6"
          ],
          [
            "8",
            "3",
            "2"
          ]
        ],
        "h": 10,
        "shape": [
          2,
          5,
          3,
          3
        ],
        "auction": [
          "Partenaire : 1SA",
          "Vous : 2♦",
          "Partenaire : 2♥"
        ],
        "context": "Votre partenaire ouvre de 1SA. Vous faites un Texas Cœur, qu'il rectifie à 2♥. Les adversaires passent. Quelle est votre deuxième enchère ?",
        "answer": "3SA",
        "choices": [
          "2SA",
          "3♥",
          "3SA",
          "4♥"
        ],
        "explain": "Cinq Cœurs, 10 H soit 11 HL, et une forme 2–5–3–3. 3SA impose la manche sans présumer un soutien de trois Cœurs. L'ouvreur choisira 4♥ avec trois atouts ou 3SA sinon.",
        "difficulty": 2,
        "difficultyReason": "Décision ciblée : 5 Cœurs, 10 H : sur 1SA la rectification ne garantit pas trois atouts. Le retour à Sans-Atout laisse l’ouvreur choisir avec son éventuel soutien.",
        "caseFamily": "q685-b-sa1-texas-suite-P1SAV2kP2c-3SA",
        "editorialSource": "Catalogue QPJB : SEF-V44-028 ; contrat #546 et mission #548."
      }
    },
    {
      "id": "SEF-Q685-B-063",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "sa1.texas_mineur",
      "groups": [
        {
          "session": 14,
          "group": 1,
          "decision": "Texas Trèfle 2♠, Texas Carreau 3♣",
          "role": "objectif",
          "phase": "initial"
        }
      ],
      "prerequis": {
        "concept": "sa1.texas_mineur",
        "stage": 0,
        "minSession": 12,
        "requires": [
          {
            "concept": "sa1.seuil",
            "minExposure": 1
          },
          {
            "concept": "sa1.texas.suite",
            "minExposure": 1
          }
        ]
      },
      "reason": "Élimine la frontière 8 HL ambiguë.",
      "condition": null,
      "references": [
        "https://www.bridgeclubduclair.fr/wp-content/uploads/2024/04/comment-declarer-un-singleton-sur-louverture-de-1SA.pdf"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "9",
              "8"
            ],
            [
              "D",
              "7",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4",
              "2"
            ],
            [
              "8",
              "6"
            ]
          ],
          "after": [
            [
              "9",
              "8"
            ],
            [
              "V",
              "7",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4",
              "2"
            ],
            [
              "8",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 6,
          "after": 5
        },
        {
          "field": "context",
          "before": "Les adversaires passent sauf indication contraire. Quelle est votre enchère ?",
          "after": "Votre partenaire ouvre de 1SA (15–17 H) et les adversaires passent. Quelle est votre réponse ?"
        },
        {
          "field": "explain",
          "before": "6 H, distribution 2–3–6–2. 6 Carreaux et 6 H : privilégiez la partielle dans la longue par 3♣, Texas Carreaux.",
          "after": "Six Carreaux et 5 H, soit 7 HL : votre jeu est faible. 3♣ est le Texas Carreau ; vous passerez sur 3♦. 2SA serait une invitation trop ambitieuse."
        }
      ],
      "qcm": {
        "id": "SEF-Q685-B-063",
        "theme": "sa",
        "hand": [
          [
            "9",
            "8"
          ],
          [
            "V",
            "7",
            "3"
          ],
          [
            "R",
            "V",
            "9",
            "7",
            "4",
            "2"
          ],
          [
            "8",
            "6"
          ]
        ],
        "h": 5,
        "shape": [
          2,
          3,
          6,
          2
        ],
        "auction": [
          "Partenaire : 1SA"
        ],
        "context": "Votre partenaire ouvre de 1SA (15–17 H) et les adversaires passent. Quelle est votre réponse ?",
        "answer": "3♣",
        "choices": [
          "Passe",
          "2♠",
          "2SA",
          "3♣"
        ],
        "explain": "Six Carreaux et 5 H, soit 7 HL : votre jeu est faible. 3♣ est le Texas Carreau ; vous passerez sur 3♦. 2SA serait une invitation trop ambitieuse.",
        "difficulty": 2,
        "difficultyReason": "Décision ciblée : 6 Carreaux et 6 H : privilégiez la partielle dans la longue par 3♣, Texas Carreaux.",
        "caseFamily": "q685-b-sa1-texas_mineur-P1SA-3t",
        "editorialSource": "Catalogue QPJB : SEF-V482-002 ; contrat #546 et mission #548."
      }
    },
    {
      "id": "SEF-Q685-B-132",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.init",
      "groups": [
        {
          "session": 29,
          "group": 1,
          "decision": "Recherche du fit 5–3",
          "role": "objectif",
          "phase": null
        }
      ],
      "prerequis": {
        "concept": "roudi.init",
        "stage": 0,
        "minSession": 22,
        "requires": [
          {
            "concept": "second.base",
            "minExposure": 1
          }
        ]
      },
      "reason": "Revient dans la zone 11–12 HL du Roudi sixième.",
      "condition": null,
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "A",
              "D",
              "9",
              "8",
              "6",
              "4"
            ],
            [
              "R",
              "7"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "9",
              "6"
            ]
          ],
          "after": [
            [
              "A",
              "D",
              "9",
              "8",
              "6",
              "4"
            ],
            [
              "R",
              "7"
            ],
            [
              "V",
              "8",
              "2"
            ],
            [
              "9",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 11,
          "after": 10
        },
        {
          "field": "context",
          "before": "Quelle est votre enchère selon le traitement QPJB décrit dans la séquence ?",
          "after": "Après votre réponse de 1♠ à 1♣, votre partenaire redemande 1SA (12–14 H). Les adversaires passent. Quelle est votre deuxième enchère dans le Roudi à trois réponses ?"
        },
        {
          "field": "explain",
          "before": "11 H, distribution 6–2–3–2. Six Piques, onze points, recherche de fit et de force.",
          "after": "Six Piques et 10 H, soit 12 HL : zone propositionnelle d'une majeure sixième. 2♣ Roudi interroge sur le soutien et, s'il est troisième, sur la force de l'ouvreur. 2♠ direct serait un arrêt faible."
        }
      ],
      "qcm": {
        "id": "SEF-Q685-B-132",
        "theme": "roudi",
        "hand": [
          [
            "A",
            "D",
            "9",
            "8",
            "6",
            "4"
          ],
          [
            "R",
            "7"
          ],
          [
            "V",
            "8",
            "2"
          ],
          [
            "9",
            "6"
          ]
        ],
        "h": 10,
        "shape": [
          6,
          2,
          3,
          2
        ],
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♠",
          "Partenaire : 1SA"
        ],
        "context": "Après votre réponse de 1♠ à 1♣, votre partenaire redemande 1SA (12–14 H). Les adversaires passent. Quelle est votre deuxième enchère dans le Roudi à trois réponses ?",
        "answer": "2♣",
        "choices": [
          "2♠",
          "2SA",
          "2♣",
          "3SA"
        ],
        "explain": "Six Piques et 10 H, soit 12 HL : zone propositionnelle d'une majeure sixième. 2♣ Roudi interroge sur le soutien et, s'il est troisième, sur la force de l'ouvreur. 2♠ direct serait un arrêt faible.",
        "difficulty": 3,
        "difficultyReason": "Décision ciblée : Six Piques, onze points, recherche de fit et de force.",
        "caseFamily": "q685-b-roudi-init-P1tV1pP1SA-2t",
        "editorialSource": "Catalogue QPJB : SEF-V4-079-3 ; contrat #546 et mission #548."
      }
    },
    {
      "id": "SEF-V44-064",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.suite",
      "groups": [
        {
          "session": 40,
          "group": 1,
          "decision": "Suite du Roudi",
          "role": "objectif",
          "phase": null
        }
      ],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Cas de manche nette face au minimum.",
      "condition": null,
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "h",
          "before": 11,
          "after": 13
        },
        {
          "field": "answer",
          "before": "3♥",
          "after": "4♥"
        },
        {
          "field": "explain",
          "before": "Le 2♥ codé du Roudi annonce trois Cœurs et un minimum. Vos cinq Cœurs assurent le fit et vos 11 H, avec un doubleton, permettent une invitation : 3♥ laisse au partenaire le choix d'accepter. Face à une réponse maximum 2♠, la manche serait bien plus attractive.",
          "after": "2♥ au Roudi confirme trois Cœurs et un minimum. Cinq Cœurs, 13 H, un point de longueur et un doubleton donnent environ 15 HLD. Malgré le minimum, le fit et les valeurs justifient 4♥. N'enseignez pas 3♥ avec cinq cartes comme invitation automatique."
        },
        {
          "field": "choices",
          "before": [
            "3♥",
            "4♥",
            "2SA",
            "3SA"
          ],
          "after": [
            "Passe",
            "3♥",
            "4♥",
            "3SA"
          ]
        },
        {
          "field": "hand",
          "before": [
            [
              "A",
              "7",
              "6"
            ],
            [
              "R",
              "8",
              "7",
              "4",
              "3"
            ],
            [
              "D",
              "5",
              "3"
            ],
            [
              "D",
              "6"
            ]
          ],
          "after": [
            [
              "A",
              "7",
              "6"
            ],
            [
              "R",
              "8",
              "7",
              "4",
              "3"
            ],
            [
              "D",
              "5",
              "3"
            ],
            [
              "A",
              "6"
            ]
          ]
        }
      ],
      "qcm": {
        "theme": "roudi",
        "shape": [
          3,
          5,
          3,
          2
        ],
        "h": 13,
        "answer": "4♥",
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♥",
          "Partenaire : 1SA",
          "Vous : 2♣ (Roudi)",
          "Partenaire : 2♥ (fit, minimum)"
        ],
        "explain": "2♥ au Roudi confirme trois Cœurs et un minimum. Cinq Cœurs, 13 H, un point de longueur et un doubleton donnent environ 15 HLD. Malgré le minimum, le fit et les valeurs justifient 4♥. N'enseignez pas 3♥ avec cinq cartes comme invitation automatique.",
        "difficulty": 4,
        "choices": [
          "Passe",
          "3♥",
          "4♥",
          "3SA"
        ],
        "context": "Après votre Roudi sur 1SA, le partenaire répond 2♥ (trois Cœurs, minimum). Quelle enchère choisissez-vous ?",
        "id": "SEF-V44-064",
        "hand": [
          [
            "A",
            "7",
            "6"
          ],
          [
            "R",
            "8",
            "7",
            "4",
            "3"
          ],
          [
            "D",
            "5",
            "3"
          ],
          [
            "A",
            "6"
          ]
        ],
        "caseFamily": "v44-cas-064",
        "difficultyReason": "Combiner réponse minimum au Roudi, fit confirmé et force propositionnelle pour annoncer 3♥."
      }
    },
    {
      "id": "V1-M5-001",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.suite",
      "groups": [],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Les supports SEF 2018/2024 et PPT signalent le saut propositionnel avec six cartes après 2♦ ; d'autres cours décrivent le retour économique non forcing.",
      "condition": "N'intégrer que si le coordinateur valide ce traitement dans le référentiel commun ; sinon retenir le retour économique avec un objectif de partielle explicite.",
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "R",
              "D",
              "10",
              "9",
              "8",
              "4"
            ],
            [
              "V",
              "8",
              "3"
            ],
            [
              "A",
              "7"
            ],
            [
              "8",
              "5"
            ]
          ],
          "after": [
            [
              "R",
              "D",
              "10",
              "9",
              "8",
              "4"
            ],
            [
              "9",
              "8",
              "3"
            ],
            [
              "A",
              "7"
            ],
            [
              "8",
              "5"
            ]
          ]
        },
        {
          "field": "h",
          "before": 10,
          "after": 9
        },
        {
          "field": "context",
          "before": "Les adversaires passent. Le partenaire a répondu au Roudi par 2♦. Avec cette main, dans quel contrat pouvez-vous vous arrêter si le partenaire est minimum ?",
          "after": "Votre partenaire répond 2♦ au Roudi : il n'a que deux Piques, sans indication de force. Vous jouez le traitement dans lequel une répétition à saut avec six cartes est propositionnelle. Quelle enchère invite à la manche en Pique ?"
        },
        {
          "field": "choices",
          "before": [
            "2SA",
            "3♠",
            "2♠",
            "3SA"
          ],
          "after": [
            "2♠",
            "2SA",
            "3♠",
            "4♠"
          ]
        },
        {
          "field": "answer",
          "before": "2♠",
          "after": "3♠"
        },
        {
          "field": "explain",
          "before": "Le 2♦ codé indique deux Piques, sans préciser la zone 12–14 H. Vos six Piques assurent donc huit atouts. Avec 10 H et deux points de longueur, vous n'avez pas de manche certaine. 2♠ est naturel et non forcing : ce n'est pas une nouvelle invitation formelle. L'ouvreur pourra poursuivre avec des compléments utiles. 3♠ serait plus engageant et 3SA sacrifierait le fit.",
          "after": "Six Piques et 9 H donnent 11 HL, et le fit huitième est certain. Dans le traitement indiqué, 3♠ propose la manche ; 2♠ est non forcing au palier le plus bas et 4♠ conclurait. 2♦ ne précise pas la force de l'ouvreur."
        }
      ],
      "qcm": {
        "id": "V1-M5-001",
        "theme": "roudi",
        "caseFamily": "reserve-v1-m5-roudi-retour-six-atouts-negatif",
        "hand": [
          [
            "R",
            "D",
            "10",
            "9",
            "8",
            "4"
          ],
          [
            "9",
            "8",
            "3"
          ],
          [
            "A",
            "7"
          ],
          [
            "8",
            "5"
          ]
        ],
        "h": 9,
        "shape": [
          6,
          3,
          2,
          2
        ],
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♠",
          "Partenaire : 1SA",
          "Vous : 2♣ (Roudi)",
          "Partenaire : 2♦ (deux Piques)"
        ],
        "context": "Votre partenaire répond 2♦ au Roudi : il n'a que deux Piques, sans indication de force. Vous jouez le traitement dans lequel une répétition à saut avec six cartes est propositionnelle. Quelle enchère invite à la manche en Pique ?",
        "choices": [
          "2♠",
          "2SA",
          "3♠",
          "4♠"
        ],
        "answer": "3♠",
        "explain": "Six Piques et 9 H donnent 11 HL, et le fit huitième est certain. Dans le traitement indiqué, 3♠ propose la manche ; 2♠ est non forcing au palier le plus bas et 4♠ conclurait. 2♦ ne précise pas la force de l'ouvreur.",
        "difficulty": 3,
        "difficultyReason": "Une seule décision : la sixième carte change le refus de soutien troisième en fit certain."
      }
    },
    {
      "id": "V2-M6-005",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.suite",
      "groups": [],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Freinage sur minimum, sans invitation automatique avec cinq cartes.",
      "condition": "Appliquer simultanément le patch dépendant V2-M6-006.",
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "A",
              "8",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "V",
              "6"
            ]
          ],
          "after": [
            [
              "A",
              "8",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "9",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 11,
          "after": 10
        },
        {
          "field": "choices",
          "before": [
            "2SA",
            "3♥",
            "3SA",
            "4♥"
          ],
          "after": [
            "Passe",
            "3♥",
            "3SA",
            "4♥"
          ]
        },
        {
          "field": "answer",
          "before": "3♥",
          "after": "Passe"
        },
        {
          "field": "explain",
          "before": "Le 2♥ du Roudi est codé : trois cartes dans votre majeure et minimum de l'ouverture. Vos cinq Cœurs assurent huit atouts ; les 11 H et le doubleton Trèfle donnent une main constructive, pas une manche à imposer face au minimum. 3♥ invite à 4♥ en conservant le fit ; 4♥ serait plus engagé.",
          "after": "2♥ codé confirme trois Cœurs et un minimum. Vous avez 10 H, cinq Cœurs et un doubleton, environ 12 HLD : le jeu est limite et le partenaire s'est déclaré minimum. Arrêtez-vous à 2♥. Le même jeu face au maximum codé justifie la manche."
        }
      ],
      "qcm": {
        "id": "V2-M6-005",
        "theme": "roudi",
        "hand": [
          [
            "A",
            "8",
            "3"
          ],
          [
            "R",
            "V",
            "9",
            "7",
            "4"
          ],
          [
            "D",
            "8",
            "2"
          ],
          [
            "9",
            "6"
          ]
        ],
        "h": 10,
        "shape": [
          3,
          5,
          3,
          2
        ],
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♥",
          "Partenaire : 1SA (12–14 H)",
          "Vous : 2♣ (Roudi)",
          "Partenaire : 2♥ (trois Cœurs, minimum)"
        ],
        "context": "Les adversaires passent. Vous avez trouvé huit atouts Cœur ; quelle enchère tient compte de la zone de l'ouvreur ?",
        "choices": [
          "Passe",
          "3♥",
          "3SA",
          "4♥"
        ],
        "answer": "Passe",
        "explain": "2♥ codé confirme trois Cœurs et un minimum. Vous avez 10 H, cinq Cœurs et un doubleton, environ 12 HLD : le jeu est limite et le partenaire s'est déclaré minimum. Arrêtez-vous à 2♥. Le même jeu face au maximum codé justifie la manche.",
        "difficulty": 4,
        "difficultyReason": "Croiser la force du répondant et le code minimum/maximum du Roudi.",
        "caseFamily": "reserve-v2-m6-suite-zone-ouvreur",
        "editorialSource": "Catalogue QPJB figé e9103075 : SEF-V44-064/065/066 ; contraste V2, sans nouvel accord."
      }
    },
    {
      "id": "SEF-Q400-B-071",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.suite",
      "groups": [
        {
          "session": 40,
          "group": 1,
          "decision": "Suite du Roudi",
          "role": "objectif",
          "phase": null
        }
      ],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Cas de freinage S40/G1.",
      "condition": null,
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "A",
              "5"
            ],
            [
              "D",
              "V",
              "10",
              "8",
              "3"
            ],
            [
              "R",
              "7",
              "4"
            ],
            [
              "V",
              "9",
              "6"
            ]
          ],
          "after": [
            [
              "A",
              "5"
            ],
            [
              "D",
              "V",
              "10",
              "8",
              "3"
            ],
            [
              "R",
              "7",
              "4"
            ],
            [
              "9",
              "8",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 11,
          "after": 10
        },
        {
          "field": "answer",
          "before": "3♥",
          "after": "Passe"
        },
        {
          "field": "explain",
          "before": "11 H, distribution 2–5–3–3. Le fit Cœur est trouvé, mais le partenaire est minimum. 11 H et le doubleton invitent à 3♥, pas à une manche certaine.",
          "after": "2♥ codé donne trois Cœurs et un minimum. Vous avez 10 H, cinq Cœurs et un doubleton, environ 12 HLD. Sans valeurs suffisantes pour imposer la manche face au minimum, passez sur 2♥. Le fit est trouvé et une invitation supplémentaire n'est pas nécessaire."
        }
      ],
      "qcm": {
        "id": "SEF-Q400-B-071",
        "theme": "roudi",
        "hand": [
          [
            "A",
            "5"
          ],
          [
            "D",
            "V",
            "10",
            "8",
            "3"
          ],
          [
            "R",
            "7",
            "4"
          ],
          [
            "9",
            "8",
            "6"
          ]
        ],
        "h": 10,
        "shape": [
          2,
          5,
          3,
          3
        ],
        "auction": [
          "Partenaire : 1♣",
          "Adversaire : Passe",
          "Vous : 1♥",
          "Adversaire : Passe",
          "Partenaire : 1SA (12–14 H)",
          "Adversaire : Passe",
          "Vous : 2♣ (Roudi trois réponses)",
          "Adversaire : Passe",
          "Partenaire : 2♥ (soutien troisième, minimum)",
          "Adversaire : Passe"
        ],
        "context": "Les adversaires passent. Dans le Roudi à trois réponses utilisé au QPJB, quelle enchère choisissez-vous ?",
        "answer": "Passe",
        "choices": [
          "Passe",
          "2SA",
          "3♥",
          "4♥"
        ],
        "explain": "2♥ codé donne trois Cœurs et un minimum. Vous avez 10 H, cinq Cœurs et un doubleton, environ 12 HLD. Sans valeurs suffisantes pour imposer la manche face au minimum, passez sur 2♥. Le fit est trouvé et une invitation supplémentaire n'est pas nécessaire.",
        "difficulty": 4,
        "difficultyReason": "Décision ciblée : Le fit Cœur est trouvé, mais le partenaire est minimum.",
        "caseFamily": "q400-b-roudi-suite",
        "editorialSource": "Catalogue QPJB : SEF-V44-064; contrat #536 et mission #538."
      }
    },
    {
      "id": "SEF-Q685-B-143",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "roudi.suite",
      "groups": [
        {
          "session": 40,
          "group": 1,
          "decision": "Suite du Roudi",
          "role": "objectif",
          "phase": null
        }
      ],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Contraste avec l'arrêt sur minimum, sans accord privé.",
      "condition": null,
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "R",
              "D",
              "7"
            ],
            [
              "A",
              "9",
              "8",
              "6",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "9",
              "6"
            ]
          ],
          "after": [
            [
              "R",
              "D",
              "7"
            ],
            [
              "A",
              "9",
              "8",
              "6",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "D",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 11,
          "after": 13
        },
        {
          "field": "answer",
          "before": "3♥",
          "after": "4♥"
        },
        {
          "field": "choices",
          "before": [
            "3♥",
            "4♥",
            "2SA",
            "3SA"
          ],
          "after": [
            "Passe",
            "2SA",
            "3♥",
            "4♥"
          ]
        },
        {
          "field": "explain",
          "before": "11 H, distribution 3–5–3–2. Fit Cœur et minimum, onze points, invitation à 3♥.",
          "after": "L'ouvreur a trois Cœurs et un minimum. Avec 13 H, cinq Cœurs et un doubleton, vous avez environ 15 HLD. Le fit et vos valeurs suffisent pour demander 4♥, même face à ce minimum."
        }
      ],
      "qcm": {
        "id": "SEF-Q685-B-143",
        "theme": "roudi",
        "hand": [
          [
            "R",
            "D",
            "7"
          ],
          [
            "A",
            "9",
            "8",
            "6",
            "4"
          ],
          [
            "D",
            "8",
            "2"
          ],
          [
            "D",
            "6"
          ]
        ],
        "h": 13,
        "shape": [
          3,
          5,
          3,
          2
        ],
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♥",
          "Partenaire : 1SA",
          "Vous : 2♣ (Roudi)",
          "Partenaire : 2♥ (fit, minimum)"
        ],
        "context": "Quelle est votre enchère selon le traitement QPJB décrit dans la séquence ?",
        "answer": "4♥",
        "choices": [
          "Passe",
          "2SA",
          "3♥",
          "4♥"
        ],
        "explain": "L'ouvreur a trois Cœurs et un minimum. Avec 13 H, cinq Cœurs et un doubleton, vous avez environ 15 HLD. Le fit et vos valeurs suffisent pour demander 4♥, même face à ce minimum.",
        "difficulty": 4,
        "difficultyReason": "Décision ciblée : Fit Cœur et minimum, onze points, invitation à 3♥.",
        "caseFamily": "q685-b-roudi-suite-P1tV1cP1SAV2tP2c-3c",
        "editorialSource": "Catalogue QPJB : SEF-V44-064 ; contrat #546 et mission #548."
      }
    },
    {
      "id": "SEF-Q685-B-167",
      "status": "PROPOSITION_NON_INTEGREE",
      "concept": "drury.choix",
      "groups": [
        {
          "session": 30,
          "group": 4,
          "decision": "Extension explicite S30 : Drury ou 2SA fitté après Passe, en fonction de la courte ; après exposition suffisante à Drury.",
          "role": "reserve",
          "phase": "extension_conditionnelle"
        }
      ],
      "prerequis": {
        "concept": "drury.choix",
        "stage": 3,
        "minSession": 28,
        "requires": [
          {
            "concept": "drury.choix",
            "minExposure": 2
          },
          {
            "concept": "majeur.soutien",
            "minExposure": 1
          },
          {
            "concept": "ouv.position",
            "minExposure": 1
          }
        ]
      },
      "reason": "Évite le chevauchement avec une belle cinquième de rencontre ; 3♦ distracteur explicite.",
      "condition": null,
      "references": [
        "https://scjc-bridge.fr/sef-2024",
        "https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523",
        "https://amourdubridge.fr/la-main-den-face-26/"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "R",
              "9",
              "8",
              "4"
            ],
            [
              "6"
            ],
            [
              "A",
              "D",
              "7",
              "6",
              "2"
            ],
            [
              "V",
              "8",
              "3"
            ]
          ],
          "after": [
            [
              "R",
              "9",
              "8",
              "4"
            ],
            [
              "6"
            ],
            [
              "A",
              "10",
              "7",
              "6",
              "2"
            ],
            [
              "R",
              "8",
              "3"
            ]
          ]
        },
        {
          "field": "context",
          "before": "Quelle est votre enchère selon le traitement QPJB décrit dans la séquence ?",
          "after": "Vous avez passé d'entrée. Votre partenaire ouvre 1♠ en troisième position, sans intervention. Quelle est votre première réponse ?"
        },
        {
          "field": "choices",
          "before": [
            "4♠",
            "3♠",
            "2SA",
            "2♣"
          ],
          "after": [
            "3♦",
            "3♠",
            "2SA",
            "2♣"
          ]
        },
        {
          "field": "explain",
          "before": "10 H, distribution 4–1–5–3. Quatre Piques, singleton Cœur et 10 H : le 2SA fitté avec courte est plus descriptif que Drury.",
          "after": "10 H, quatre Piques, un singleton Cœur et un neuvième atout probable : soutien constructif. Les Carreaux ne sont pas une belle cinquième pour une enchère de rencontre. 2SA fitté avec courte est descriptif ; 2♣ Drury conviendrait à un soutien sans cette courte quatrième-fittée."
        }
      ],
      "qcm": {
        "id": "SEF-Q685-B-167",
        "theme": "drury",
        "hand": [
          [
            "R",
            "9",
            "8",
            "4"
          ],
          [
            "6"
          ],
          [
            "A",
            "10",
            "7",
            "6",
            "2"
          ],
          [
            "R",
            "8",
            "3"
          ]
        ],
        "h": 10,
        "shape": [
          4,
          1,
          5,
          3
        ],
        "auction": [
          "Vous : Passe",
          "Adversaire : Passe",
          "Partenaire : 1♠ (3e position)",
          "Adversaire : Passe"
        ],
        "context": "Vous avez passé d'entrée. Votre partenaire ouvre 1♠ en troisième position, sans intervention. Quelle est votre première réponse ?",
        "answer": "2SA",
        "choices": [
          "3♦",
          "3♠",
          "2SA",
          "2♣"
        ],
        "explain": "10 H, quatre Piques, un singleton Cœur et un neuvième atout probable : soutien constructif. Les Carreaux ne sont pas une belle cinquième pour une enchère de rencontre. 2SA fitté avec courte est descriptif ; 2♣ Drury conviendrait à un soutien sans cette courte quatrième-fittée.",
        "difficulty": 4,
        "difficultyReason": "Décision ciblée : Quatre Piques, singleton Cœur et 10 H : le 2SA fitté avec courte est plus descriptif que Drury.",
        "caseFamily": "q685-b-drury-choix-VPP1p-2SA",
        "editorialSource": "Catalogue QPJB : SEF-V44-068 ; contrat #546 et mission #548."
      }
    },
    {
      "id": "V2-M6-006",
      "status": "DEPENDANCE_OPTIONNELLE_A_VALIDER",
      "concept": "roudi.suite",
      "groups": [],
      "prerequis": {
        "concept": "roudi.suite",
        "stage": 3,
        "minSession": 30,
        "requires": [
          {
            "concept": "roudi.init",
            "minExposure": 2
          },
          {
            "concept": "roudi.reponse",
            "minExposure": 1
          }
        ]
      },
      "reason": "Patch miroir dépendant qui remplace alors la correction existante de 006.",
      "condition": "Ne pas intégrer seul ; conserver le lien avec V2-M6-005.",
      "references": [
        "https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/",
        "https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi_1.html",
        "https://bridgesaintcloud.fr/quesaquo1508.html",
        "https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870#page=50"
      ],
      "changes": [
        {
          "field": "hand",
          "before": [
            [
              "A",
              "8",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "V",
              "6"
            ]
          ],
          "after": [
            [
              "A",
              "8",
              "3"
            ],
            [
              "R",
              "V",
              "9",
              "7",
              "4"
            ],
            [
              "D",
              "8",
              "2"
            ],
            [
              "9",
              "6"
            ]
          ]
        },
        {
          "field": "h",
          "before": 11,
          "after": 10
        },
        {
          "field": "choices",
          "before": [
            "2SA",
            "3♥",
            "3SA",
            "4♥"
          ],
          "after": [
            "Passe",
            "3♥",
            "3SA",
            "4♥"
          ]
        },
        {
          "field": "explain",
          "before": "2♠ est codé : trois Cœurs et maximum. Avec vos cinq Cœurs, 11 H et un doubleton, la manche à 4♥ est acquise. Une enchère intermédiaire après ce maximum ne serait pas une simple invitation à la manche.",
          "after": "2♠ est artificiel au Roudi : trois Cœurs et maximum. Avec vos cinq Cœurs, 10 H, un doubleton et le maximum annoncé, demandez la manche à 4♥. Comparez au même jeu face au minimum dans V2-M6-005."
        }
      ],
      "qcm": {
        "id": "V2-M6-006",
        "theme": "roudi",
        "hand": [
          [
            "A",
            "8",
            "3"
          ],
          [
            "R",
            "V",
            "9",
            "7",
            "4"
          ],
          [
            "D",
            "8",
            "2"
          ],
          [
            "9",
            "6"
          ]
        ],
        "h": 10,
        "shape": [
          3,
          5,
          3,
          2
        ],
        "auction": [
          "Partenaire : 1♣",
          "Vous : 1♥",
          "Partenaire : 1SA (12–14 H)",
          "Vous : 2♣ (Roudi)",
          "Partenaire : 2♠ (trois Cœurs, maximum)"
        ],
        "context": "Les adversaires passent. Vous avez trouvé huit atouts Cœur ; quelle enchère tient compte de la zone de l'ouvreur ?",
        "choices": [
          "Passe",
          "3♥",
          "3SA",
          "4♥"
        ],
        "answer": "4♥",
        "explain": "2♠ est artificiel au Roudi : trois Cœurs et maximum. Avec vos cinq Cœurs, 10 H, un doubleton et le maximum annoncé, demandez la manche à 4♥. Comparez au même jeu face au minimum dans V2-M6-005.",
        "difficulty": 4,
        "difficultyReason": "Croiser la force du répondant et le code minimum/maximum du Roudi.",
        "caseFamily": "reserve-v2-m6-suite-zone-ouvreur",
        "editorialSource": "Catalogue QPJB figé e9103075 : SEF-V44-064/065/066 ; contraste V2, sans nouvel accord."
      }
    }
  ]
}
```

MISSION INDIVIDUELLE : LIVREE — 14 propositions d'arbitrage soumises, 1 dépendance ; recette consolidée et décisions au coordinateur.
MISSION DÉFINITIVEMENT TERMINÉE : NON — arbitrages et recette intégrée non validés.

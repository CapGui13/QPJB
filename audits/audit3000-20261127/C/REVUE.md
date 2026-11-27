# AUDIT3000-C — revue PARTIELLE (466/608)

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

## Bilan cumulé
{"VALIDE":293,"RECLASSER_REFORMULER":165,"ARBITRAGE":8} ; 163 corrections complètes, 4 changements prérequis.

## Limites
142 QCM restent à auditer. Aucun merge, aucun fichier commun modifié.

MISSION DÉFINITIVEMENT TERMINÉE : NON

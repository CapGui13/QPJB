# AUDIT3000-C — revue PARTIELLE (205/608)

Base immuable : ccd8f20811b9531bbfccb8352ec60953dd7d07cb. Contrat #556, mission #559.

## Passes réalisées
- P1 : 42 ouvertures (25 ouv.sa1 + 17 ouv.sa2).
- P2 : 39 réponses quantitatives sa1.seuil.
- P3 : 49 réponses Stayman initial (1SA/2SA) et seuils 2SA.
- P4 : 75 QCM (Texas majeur initial 1SA/2SA et réponses aux Stayman 1SA/2SA).
- 148 VALIDE, 56 RECLASSER_REFORMULER, 0 ERREUR_PEDAGOGIQUE, 1 ARBITRAGE. 56 objets complets corrigés. 1 changement de prérequis et 1 changement de réservoir proposés.
- Les 80 cas revus sans groupe explicite sont laissés en réserve potentielle ; l'accessibilité par le moteur n'a pas été vérifiée. Au total 227/608 ne figurent dans aucun groupe explicite du programme normalisé. Ne pas les injecter indistinctement.

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

## Contrôles réellement exécutés
- Extraction JSON de training-data via blob 59fb3ca4c826d4f08905b1c5b076b7f09a5304fb ; 3000 objets, 3000 IDs distincts ; 608 IDs selon prérequis, tous présents.
- Sur 608 : 13 cartes, rangs valides, unicité des cartes par couleur, H et forme recalculés, quatre choix distincts avec réponse présente : aucune anomalie détectée.
- Sur les 205 revus : légalité des enchères possibles au tour concerné, lecture individuelle, comparaison des analogues par empreinte main/séquence et profil force/forme/réponse sur l'ensemble des 3000 ; aucun doublon exact de main/séquence détecté parmi les 205. Les analogues sont des candidats, pas une preuve d'identité sémantique complète.
- 56 corrections : mêmes contrôles structurels, aucune anomalie ; relecture de verdicts.json et corrections.json depuis la branche, unicité et appartenance des IDs, cohérence des clés.
- Tests locaux du dépôt et CI non exécutés à ce stade : pas de checkout/environnement Node associé au dépôt dans le connecteur. La vérification de toute la légalité des séquences complexes et des prérequis/séances restants n'est pas faite.

## Limites
403 QCM restent à auditer pédagogiquement, dont Stayman, Texas, Roudi, Drury et suites. Pas de validation globale des 608, aucune fusion, aucun changement de fichier commun. Le coordinateur ne doit pas intégrer ce lot comme complet.

MISSION DÉFINITIVEMENT TERMINÉE : NON

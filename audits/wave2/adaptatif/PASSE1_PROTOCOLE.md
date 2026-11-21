# QPJB V2 — Adaptatif — Passe 1 : instrumentation longitudinale

**PASSE 1 FINIE (instrumentation), MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Base figée
- SHA de départ : `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- Fichier moteur : `quizz-parcours.js`, blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc`.
- Aucune modification du moteur de production, du catalogue, de l'interface ou du module de recommandations.

## Livrable de passe 1
`tests/wave2-adaptatif-benchmark.cjs` : simulation déterministe du **vrai** moteur et des **vrais 1 523 QCM**, 5 profils × 2 horizons (65/153 séances) × 3 graines = **30 trajectoires** et **32 700 réponses simulées** (10 questions par séance).

Profils : 100 % autonome, 94 % erreurs persistantes, 33 % erreurs modérées, 72 % d'aide parmi les réussites potentielles, erreurs décroissantes au fil de l'apprentissage. Ces comportements sont des **hypothèses synthétiques**, non des observations d'élèves. Les graines servent à reproduire le résultat.

Le banc mesure : IDs, rubriques, familles, contextes, décisions distinctes ; part de niveaux 4–5, révisions, échecs et aides ; diversité moyenne par séance. Vérifie dix QCM distincts par séance, 65/153 séances effectivement terminées, et aller-retour de sauvegarde. Les trajectoires utilisent `start`, `record`, `finish`, `load` du moteur publié.

Commande : `node tests/wave2-adaptatif-benchmark.cjs --json`.

## Limite de vérification de cette passe
L'exécution Node n'a **pas encore été possible** dans l'environnement de travail : l'accès GitHub direct depuis le conteneur est indisponible et l'interface connecteur permet l'écriture/lecture GitHub, pas l'exécution locale du dépôt. **Aucun résultat de benchmark n'est revendiqué à ce stade.** Les 30 trajectoires / 32 700 réponses sont la taille prévue du protocole, non des résultats mesurés.

## Lecture statique du moteur
- 22 rubriques déverrouillées selon `ROADMAP` (séances 0 à 39).
- Priorité aux erreurs et aides, mais quota de rappels limité ; score composite inclut variété familiale, contextuelle et de réponse.
- Protection des fondamentaux fragiles : pénalité des cas difficiles, bonus d'exploration et plafond implicite de 8/10 cas fondamentaux en situation d'échec.
- Risques à **tester**, sans conclure : dilution des rappels lorsque le nombre de QCM nouveaux reste élevé ; arbitrage entre exploration et fragilité ; possible concentration des familles sur les longues trajectoires.

## Passe 2 — prochaine
1. Exécuter et corriger le banc Node, obtenir les 30 lignes de résultats réels.
2. Consolider moyennes et dispersions par profil/horizon, vérifier reproductibilité.
3. Capturer les résultats de la version de référence dans un fichier machine-lisible versionné avant tout essai de candidat.

## Passes non réalisées
P2 (mesures effectives), P3 (candidat fondamentaux), P4 (candidat découverte/rappel), P5 (contre-tests), P6 (sélection ou retour strict au moteur initial).

**HOLD : aucune fusion ni publication autorisée.**

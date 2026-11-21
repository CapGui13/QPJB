# M2 — PASSE 2 : reference longue executee

**PASSE 2 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Protocole et provenance

- Branche : `wave2/adaptatif-20261121`, base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
- Catalogue intact : 1 523 exercices, 22 rubriques, blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`.
- **30 trajectoires réellement exécutées** : 5 profils × 65/153 séances × 3 graines = 32 700 réponses de simulation.
- Exécution Javascript V8 contrôlée, banc CommonJS original exécuté via équivalents de lecture du catalogue et d'assertion (sans machine Node du dépôt). Ne **pas** annoncer « tests Node exécutés ».
- Fichiers détaillés `PASSE2_BASELINE_*json` versionnés dans ce répertoire. Chaque trajectoire contrôle dix QCM uniques/séance, nombre de séances, journal, sauvegarde, taille du catalogue.
- Optimisation de score sans modification de classement : empiriquement mêmes 600 choix pour 5 profils × 12 séances, graine 29 ; la trajectoire échecs 65 séances graine 11 produit les mêmes métriques avant/après. Temps de cette trajectoire : environ 69,65s → 9,58s dans l'environnement V8 (micro-benchmark indicatif, pas profilage navigateur).

## Résultats descriptifs (moyenne des 3 graines)

| Profil | Horizon | IDs distincts | Familles distinctes | Rubriques distinctes | Rappels (%) | Fondamentaux (%) | Niveaux 4-5 (%) | Thèmes/séance |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| autonome | 65 | 650 | 638 | 22 | 9.1 | 28.9 | 40 | 6.938 |
| autonome | 153 | 1523 | 1315 | 22 | 10 | 42.6 | 28.9 | 6.922 |
| echecs | 65 | 523 | 499.333 | 22 | 19.5 | 75.7 | 0 | 5.431 |
| echecs | 153 | 1227 | 1027.667 | 22 | 19.8 | 58.4 | 9.3 | 6.608 |
| modere | 65 | 522 | 475.667 | 22 | 19.7 | 39.5 | 12.4 | 7.544 |
| modere | 153 | 1226 | 1097.667 | 22 | 19.9 | 37.7 | 26.9 | 7.874 |
| aides | 65 | 523 | 507.667 | 22 | 19.5 | 74.7 | 0.5 | 5.897 |
| aides | 153 | 1227 | 1035.667 | 22 | 19.8 | 56.9 | 9.8 | 7.107 |
| progression | 65 | 523 | 486 | 22 | 19.5 | 68.7 | 1.2 | 6.313 |
| progression | 153 | 1227 | 1091.667 | 22 | 19.8 | 45 | 25.4 | 7.789 |

## Interprétation et réserves

- Toutes les rubriques sont représentées d'ici 65 séances, **sans** preuve que chaque rubrique serait maîtrisée.
- La part de rappel est plafonnée à environ 20 % pour les profils présentant des erreurs ou des aides, en raison des deux positions de révision dans une séance de dix questions ; la dette de rappel doit se lire comme une somme répétée d'occasions, pas comme un nombre de QCM distincts oubliés.
- Les profils de difficulté persistante rencontrent des QCM de niveau 4-5 sur le long horizon : vérifier les séances et les classes de difficulté, sans supprimer automatiquement des rubriques entières.
- L'optimisation de tri n'est pas un gain pédagogique : elle conserve les sélections à égalité de profil/graine. Aucun gain de maîtrise n'est revendiqué.
- Les scores de fragilité et de progression des cinq profils sont simulés ; ce ne sont ni des observations ni des taux d'acquisition d'élèves.

## Prochaine passe

**P3 :** essais contrôlés d'une protection conservatrice des fondamentaux sur échecs persistants/aides/progression, et vérification du prix en variété, rappels et accès aux 22 thèmes. P4 : second candidat indépendant (politique d'espacement / ratio découverte-rappel). P5 : contre-tests 65 et 153, 3 graines, compatibilité sauvegarde. P6 : conserver uniquement une amélioration démontrée, sinon ne laisser en production que l'optimisation sémantiquement neutre.

**HOLD :** PR brouillon, aucune fusion, aucune publication, aucune modification des QCM ou de l'interface.

# M2 — PASSE 4 : deuxième famille de candidats, coût de 3 rappels

**PASSE 4 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Hypothèse indépendante

Remplacer dans une copie du moteur les deux positions planifiées (4e et 8e question) par trois positions (4e, 8e et 10e), et augmenter au maximum à trois les rappels faibles dus. Aucun changement du suivi de maîtrise ou de l'éligibilité des rubriques.

Candidat exploratoire **non déployé** : `node tests/wave2-adaptatif-candidates.cjs --variant recall --json` ; 5 profils × 65/153 séances × graine 11 = 10 trajectoires, 10 900 réponses synthétiques, comparées au P2 sur la même graine.

## Avant / candidat

| Profil | Séances | Rappels % | IDs distincts | Familles distinctes | Difficultés 4–5 % | Rubriques |
|---|---:|---:|---:|---:|---:|---:|
| autonome | 65 | 9.08 → 9.08 | 650 → 650 | 638 → 638 | 40.00 → 40.00 | 22 → 22 |
| autonome | 153 | 10.00 → 10.00 | 1523 → 1523 | 1315 → 1315 | 28.89 → 28.89 | 22 → 22 |
| echecs | 65 | 19.54 → 29.23 | 523 → 460 | 504 → 428 | 0.00 → 0.00 | 22 → 22 |
| echecs | 153 | 19.80 → 29.67 | 1227 → 1076 | 1029 → 922 | 9.35 → 2.35 | 22 → 22 |
| modere | 65 | 19.69 → 29.23 | 522 → 460 | 475 → 416 | 14.15 → 11.85 | 22 → 22 |
| modere | 153 | 19.87 → 29.67 | 1226 → 1076 | 1108 → 974 | 27.84 → 31.31 | 22 → 22 |
| aides | 65 | 19.54 → 29.08 | 523 → 461 | 491 → 450 | 0.31 → 0.00 | 22 → 22 |
| aides | 153 | 19.80 → 29.61 | 1227 → 1077 | 1037 → 979 | 9.87 → 6.08 | 22 → 22 |
| progression | 65 | 19.54 → 29.23 | 523 → 460 | 480 → 409 | 1.69 → 0.62 | 22 → 22 |
| progression | 153 | 19.80 → 29.67 | 1227 → 1076 | 1097 → 954 | 28.24 → 22.81 | 22 → 22 |

## Verdict

**Candidat REJETÉ : non dominant.** Il fait monter les rappels de ≈19,5–19,9 % à ≈29,1–29,7 % chez les élèves fragiles mais retranche environ 12 % des IDs distincts, avec pertes conséquentes de familles. Pour le profil erreurs modérées, la proportion de QCM difficiles **augmente** à 153 séances : le compromis n'est pas acceptable pour un moteur généraliste et n'est pas compensé par un gain de maîtrise démontré.

Ne pas transformer ce résultat en « meilleure rétention », car les réponses sont synthétiques et paramétrées. Les 22 rubriques restent visibles mais la couverture interne est dégradée. Les JSON bruts `PASSE4_RECALL_*json` sont conservés en audit.

## Tests, suites

Test du vrai code JavaScript via CommonJS sous V8 avec adaptations contrôlées des fonctions Node (fs, path, assert). **Pas de processus Node CLI exécuté** ; valider ces tests dans Node/CI avant intégration. Pas d'écriture des QCM, du HTML, des schémas sauvegarde.

**PROCHAINE PASSE : P5** contre-tests de la variante P3 « fondamentaux » graines 29 et 47 sur 65/153 séances, vérification des sauvegardes interrompues/compatibilité, et contrôle d'intégrité final. **P6** ne garder qu'un candidat dominant démontré ; sinon préserver la seule optimisation sans changement de tirage. PR brouillon **HOLD**.

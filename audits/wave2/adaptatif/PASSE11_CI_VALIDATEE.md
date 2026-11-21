# M2 — PASSE 11 : résultat réel GitHub Actions et portée exacte de la validation

**PASSE 11 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Périmètre et source

- Branche exclusive : `wave2/adaptatif-20261121`.
- Tête de code contrôlée **avant ce commit documentaire** : `75cae8a476e90534f1334968df28db712ce7955d`.
- Workflow GitHub Actions `QPJB Training smoke`, run **#1631**, ID **44953503616**, état **completed / success**.
- Le runner de PR a testé le commit synthétique de fusion `84787fca0ee0c46ce5a40fc485f5f2aabcc87c02`, dont le premier parent résulte de `main` et qui incorpore bien notre tête `75cae8a`. Cette distinction empêche d'assimiler naïvement le SHA de la PR à celui du checkout Actions.
- Journaux examinés : jobs `136996419733` (WebKit), `136996419844` (simulations V1), `136996419849` (Chromium), `136996419927` (audit).

## Tests réellement passés sur GitHub

| Job | Conclusion | Preuve dans les étapes / logs |
|---|---|---|
| Validation WebKit | **success** | flux QCM, ressources hors ligne, mises en page, lots 06/07, quiz, parcours, recommandations |
| Simulations longues du parcours V1 | **success** | `node tests/quizz-parcours.cjs`, message `LOT B PASS — 5 profils x 153 séances x 2 versions` |
| Validation Chromium | **success** | mêmes catégories de tests navigateur |
| Audit des données et du code | **success** | `QPJB Training smoke: 413 checks passed`, `QUIZZ UI VNEXT STATIC OK — JSON identique, 1523 QCM`, tests Entraînement/intégrité |

Le défaut historique de SHA du LOT B, détecté en P9 puis corrigé par restauration exacte du moteur, **n'a pas reproduit d'échec dans ce run**. La version testée conserve 1 523 QCM / 22 thèmes. Il s'agit de **tests Node réellement exécutés par GitHub**, et non de simulations locales présentées comme une CLI Node.

## Réserve : les nouveaux tests dédiés M2 ne sont pas intégrés au workflow

Les scripts `tests/wave2-adaptatif-invariants.cjs`, `tests/wave2-adaptatif-selection-regression.cjs`, `tests/wave2-adaptatif-resume.cjs`, `tests/wave2-adaptatif-benchmark.cjs` et `tests/wave2-adaptatif-candidates.cjs` **ne figurent pas parmi les commandes de ce workflow**. Son succès ne prouve donc pas qu'ils passent en CLI Node. Un checkout réseau GitHub n'est pas accessible depuis le conteneur d'exécution ici ; le gros `quizz.html` n'est pas retourné par l'API Contents à cause de sa taille. Ne pas revendiquer d'exécution Node locale.

Contrôle complémentaire effectivement exécuté pendant P11 : compilation en JavaScript V8 de quatre moteurs-candidats construits à partir du moteur restauré (`foundation`, `recall`, `overdue`, `score-cache`), avec vérification des points d'ancrage uniques et de l'API exportée : **4/4 OK**. Ce contrôle avec adaptateurs n'est **ni** un benchmark complet **ni** une exécution Node CLI.

## Intégrité, décision et suite

- Aucun nouveau défaut de production observé sur le run validé.
- Candidats pédagogiques P3/P4/P8 déjà rejetés/non dominants : **aucun changement de moteur proposé**.
- Modifications de P11 : **rapport documentaire uniquement**, sous `audits/wave2/adaptatif/**`.
- **HOLD** : ne fusionner, publier, modifier ni `quizz.html`, ni les 1 523 QCM, ni le moteur historique, ni les workflows réservés à M5.
- La CI de tout nouveau commit documentaire devra être distinguée du run #1631, qui porte sur la tête avant P11.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P12** — finaliser une matrice d'exécution explicite des cinq scripts M2, vérifier la couverture et les préconditions des scénarios, préparer le contrat d'intégration avec le chantier M5 pour qu'ils puissent être exécutés dans Node 22 sans modifier ses workflows depuis M2. N'annoncer « OUI » qu'une fois l'exécution dédiée et les critères de clôture réellement vérifiés.

# M2 — PASSE 15 : validation sur les blobs Git réels, CI et compatibilité M3

**PASSE 15 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON** (la CLI Node dédiée complète reste à faire).

## Contexte exact

- Branche `wave2/adaptatif-20261121`, HEAD au début de cette passe : `e04b54b89646b451bbfcf1115c60d583ed5109ac`.
- GitHub Actions `QPJB Training smoke` **run #1675 / 44957435996** : `completed / success`, **4 jobs / 4 succès** : audit, simulations longues V1, Chromium et WebKit. Résultat du **véritable runner GitHub** sur cette tête, distinct des tests de recherche M2.
- Revue diff avant P15 : **50/50 chemins autorisés** (tests `wave2-adaptatif-*` et `audits/wave2/adaptatif/**`), aucun changement de `quizz-parcours.js` ou `quizz.html`, 61 commits d'avance sur la base figée et 0 derrière. PR #263 brouillon, non fusionnée.

## Accès au vrai catalogue, blocage de lecture contourné en lecture seule

L'API GitHub Contents renvoyait une chaîne vide pour `quizz.html` de plus de 1 Mo. La lecture de l'objet Git **par son SHA** via le connecteur GitHub retourne le HTML complet sans nécessiter de clone :

- Base/M2 `quizz.html` Git blob **`9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`**, **1 835 508 caractères HTML** ;
- `<script id="training-data">` : exactement **1 741 625 caractères**, FNV-1a **`5eba3d0a`**, **1 523 QCM**, **1 523 IDs uniques**, **22 rubriques**.

La branche **M3** `wave2/experience-eleve-20261121` PR #265 expose le blob `quizz.html` **`354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3`** : 1 839 792 caractères HTML. **Les deux chaînes JSON embarquées sont rigoureusement identiques caractère par caractère**, malgré un HTML différent. Le test M2 corrigé en P14 a donc le bon contrat pour une future intégration M3 : ne pas bloquer l'UX si le contenu pédagogique ne bouge pas.

## Exécutions effectivement réalisées sur les sources et données réelles

Les scripts CommonJS et le moteur exacts ont été lus depuis GitHub puis exécutés **en JavaScript V8 dans un isolat**. Les modules Node (`fs`, `path`, `assert`) ont été adaptés, et les opérations réelles de lecture de `quizz.html` ont consommé les 1 523 QCM extraits du blob Git. Ce sont de **vraies exécutions de la logique des scripts** avec catalogue réel, **mais pas des invocations de `node fichier.cjs` en CLI** ; l'adaptateur d'assertion profonde utilise la comparaison des données JSON et ne se substitue pas à `node:assert/strict`.

| Scénario | Résultat observé |
|---|---|
| Catalogue entier | Longueur, empreinte FNV, 1 523 IDs distincts et 22 rubriques : **conformes** |
| `wave2-adaptatif-selection-regression.cjs` | **PASS**, 5 profils × 12 séances = **600 sélections de référence** |
| `wave2-adaptatif-resume.cjs` | **PASS**, cinq variantes de reprise, export/import et anciens états |
| `wave2-adaptatif-benchmark.cjs` `modere/65/g11` | **PASS**, **650 réponses simulées** ; **tous les champs** identiques à `PASSE2_BASELINE_65_G11.json` ; 22 thèmes et **475 familles** |
| `wave2-adaptatif-benchmark.cjs` `modere/153/g11` | **PASS**, **1 530 réponses simulées** ; **tous les champs** identiques à `PASSE2_BASELINE_153_G11_B.json` ; 22 thèmes, **1 108 familles**, difficulté 4–5 **27,84 %** |
| `wave2-adaptatif-candidates.cjs --variant score-cache --profile modere --horizon 65 --seed 11` | **PASS**, **650 réponses simulées**, ses **20 champs de métriques** identiques à la référence ; reste un candidat isolé, non déployé |

Aucune mesure ci-dessus ne constitue une preuve d'apprentissage chez de vrais élèves.

## Réserve vérifiable et décision

La connexion réseau du conteneur `git ls-remote` reste indisponible (DNS `github.com`), donc aucun `node tests/wave2-adaptatif-suite.cjs --quick` ou `--full` n'a été lancé sur un **checkout physique complet**. Le vrai catalogue a été exploité dans V8 via connecteur, mais cela ne doit pas être renommé « Node CLI complète » ni « 30 trajectoires exécutées à nouveau ». Les nouveaux tests spécifiques M2 ne sont toujours pas inclus dans les workflows historiques, par séparation des responsabilités M2 / M5.

**Décision :** pas de mutation du moteur ; la CI historique de la tête P14 est verte, le catalogue et M3 ont été vérifiés directement, les scénarios V8 ciblés concordent. **Aucun nouveau défaut corrigeable dans le périmètre M2 n'est révélé.** Conserver la PR #263 **DRAFT / HOLD**, sans fusion ni publication.

**PASSE 15 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

**PROCHAINE PASSE : P16 conditionnelle** au lancement du contrat M2 `node tests/wave2-adaptatif-suite.cjs --quick` puis `--full` sur un runner Node 22 disposant du dépôt complet (intégration CI réservée à M5). Si une anomalie réelle apparaît, corriger dans les seuls tests/audits M2 et documenter avant nouvelle vérification ; sinon demander la décision d'intégration au coordinateur. Ne pas fabriquer de passes documentaires sans nouveaux signaux.

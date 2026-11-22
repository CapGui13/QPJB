# M2 — PASSE 12 : point d'entrée Node et contrat CI avec M5

**PASSE 12 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Réalisation

Création exclusive sur `wave2/adaptatif-20261121`, sans modification de workflow ni de production :

- `tests/wave2-adaptatif-suite.cjs` : lanceur Node de validations, strictement séquentiel, codes de retour propagés, modes `--quick`, `--full`, `--list`.
- `tests/wave2-adaptatif-suite-selftest.cjs` : teste le contrat des arguments, la liste, les étapes, l'arrêt immédiat sur premier échec (code 7), le succès simulé et les arguments invalides (code 2).

`--quick` exécute **4 commandes** : autotest, invariants blob moteur/catalogue, sélection de **600 QCM** sur 5 profils/12 séances, reprise/export/import sur cinq états.

`--full` exécute **9 commandes** : les 4 rapides et le benchmark de base **30 trajectoires** (5 profils, 65/153 séances, 3 graines), puis 4 contre-exemples ciblés sur le profil `modere` : `foundation` 153/g29, `recall` 153/g11, `overdue` 153/g11 et `score-cache` 65/g11. Les candidats restent uniquement des copies en mémoire, sans mutation du moteur. Les résultats antérieurs attestent bien 22 thèmes pour les profils/horizons choisis ; ce n'est pas une preuve qu'ils réussissent maintenant en CLI Node.

## Tests réellement exécutés P12

- Node **v22.16.0** dans le conteneur : `node --check` des **deux nouveaux scripts**, OK.
- Node **v22.16.0** : exécution réelle de l'auto-test du lanceur, **PASS** (9 commandes annoncées, échec propagé, arguments vérifiés).
- `node ...suite.cjs --list` : liste valide ; mode invalide : code de sortie **2**.
- Preuve d'identité byte pour byte entre les scripts testés sous Node et ceux déposés dans GitHub : blobs Git locaux et distants **identiques** :
  - `wave2-adaptatif-suite.cjs` : `7d79575eede9c1eaf7fc15735d4b68ebbbf88226`
  - `wave2-adaptatif-suite-selftest.cjs` : `b2572d6a86937a4735425784104a704ac2dc1bf7`.

**Limite importante :** ni `--quick` ni `--full` sur le vrai catalogue n'ont été exécutés dans ce conteneur. `quizz.html` est trop volumineux pour la réponse de l'API GitHub Contents (contenu vide malgré son blob SHA connu), et le DNS du conteneur interdit le clone du dépôt. Seuls le lanceur, son auto-test et les garde-fous de compilation des candidats (P11) ont été exécutés localement. Les suites historiques de GitHub Actions ont bien été exécutées en Node sur le commit antérieur (P11, run #1631).

## Commandes pour un checkout Node >=22

```bash
node tests/wave2-adaptatif-suite.cjs --list
node tests/wave2-adaptatif-suite.cjs --quick
node tests/wave2-adaptatif-suite.cjs --full
```

### Contrat de raccordement au chantier M5 (sans intervention dans son périmètre)

1. Pour le contrôle rapide : depuis la racine du dépôt, installer Node 22 ou ultérieur, puis `node tests/wave2-adaptatif-suite.cjs --quick`, **une seule fois** dans les contrôles CLI appropriés. Échec non zéro = blocage.
2. Pour une recette lourde séparée, **sur demande / hors chemin critique** : `node tests/wave2-adaptatif-suite.cjs --full`. Ce mode inclut 30 trajectoires et quatre contre-tests séquentiels, potentiellement longs. Ne jamais le lancer systématiquement à chaque push sans mesure de durée préalable.
3. Si M5 décide un workflow dédié, publier les logs/rapports comme artefacts. Ne pas modifier les workflows depuis M2.
4. **Ne pas confondre** le succès des suites historiques de GitHub Actions et celui des tests dédiés M2. La mutation pédagogique reste refusée faute de candidat dominant, même si tous les scripts passent.

## État et suite

- Branche M2 seulement, **aucun QCM / HTML / moteur / workflow modifié**.
- PR #263 **DRAFT/HOLD**, pas de fusion, pas de publication.
- La dernière CI verte documentée porte sur la tête P10 (run #1631) ; les nouvelles têtes générées par P11/P12 font l'objet de nouveaux runs et doivent être contrôlées séparément.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P13** — vérifier la dernière tête GitHub, le diff final et les dépendances des nouveaux scripts ; distinguer précisément la dette extérieure au périmètre M2 et clôturer la recherche sans prétendre à une validation Node non réalisée. L'intégration des scripts à la CI appartient à M5.

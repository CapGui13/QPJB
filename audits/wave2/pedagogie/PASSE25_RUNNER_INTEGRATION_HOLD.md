# QPJB — M1 / Passe 25 : recette native du mécanisme de lancement

**PASSE 25 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Vérifications de la source
GitHub confirme la branche `wave2/pedagogie-sef-20261121`, SHA parent `c9d9b061c18679ea3a20aeccfd4de8ebea2abe8e`, PR #261 brouillon. Dans `training-smoke.yml`, le job intégrité effectue bien les contrôles historiques mais **ne lance pas** la suite `node tests/wave2-pedagogie-suite.cjs`. Le job existant ne permet donc pas de déclarer une recette M1 complète au vert. Le terminal Node v22.16.0 est disponible, mais `git ls-remote` ne peut pas résoudre `github.com`, ce qui empêche un clonage direct.

## Lacune concrète P24 et correction
P24 testait les marqueurs PASS individuellement, mais pas le comportement du **lanceur réellement exécuté** en présence d'un sous-processus défaillant. Le nouveau `tests/wave2-pedagogie-runner-integration-p25.cjs` lit le véritable lanceur, exécute son JavaScript sous `node:vm` avec `spawnSync` simulé et mesure le code de sortie, le nombre d'appels et la propagation des erreurs.

**Exécution native locale de ce nouveau test avec Node 22.16.0 : PASS.**
- Scénario positif : **19 sous-processus simulés**, dans l'ordre, avec timeout, cwd et binaire Node vérifiés.
- **6 anomalies** provoquent un arrêt à la huitième commande, sans dérouler la suite : mauvaise signature PASS, simple texte contenant PASS, absence de marqueur, statut non nul, erreur de lancement, marqueur seulement dans stderr.
- Contre-épreuve : restauration en mémoire de la vieille condition `stdout.includes('PASS')`, qui accepte alors à tort le scénario à mauvais marqueur. Le test détecte donc réellement la régression historique.
- `node --check` du nouveau script réussi ; `wave2-pedagogie-runner-p24.cjs` également PASS sur Node.
- Lanceur porté de **18 à 19 scripts**, inventaire `couverture-suite.cjs` mis à jour, checkpoint historique P18 préservé.

**Limite majeure :** seuls le lanceur et son comportement simulé ont été vérifiés ici ; **les 19 véritables tests pédagogiques n'ont pas été exécutés successivement sous Node ou en CI**. Ne jamais confondre 19 lancements simulés et 19 tests fonctionnels réels.

## Dépendances restantes
**6 clarifications** et **11 accords conventionnels** en attente d'arbitrage humain ; raccordement de la suite Node dans la CI à traiter par M5/coordinateur sur branche d'intégration, sans écriture hors périmètre M1. Aucun catalogue, moteur, UI ni workflow modifié.

**PASSE 25 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P26 uniquement sur résultat de la suite Node/CI intégrale, nouvelle preuve de divergence, ou arbitrage explicite des 17 cas.** Ne pas fusionner, ne pas publier.

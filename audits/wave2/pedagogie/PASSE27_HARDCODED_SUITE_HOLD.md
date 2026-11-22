# QPJB M1 — P27 : réparation d'une régression réelle, testée sous Node

**PASSE 27 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON/HOLD.**

## Erreur réelle à l'état P26
L'ajout du 20e script par P26 a rendu le test P25 incompatible avec la suite : `tests/wave2-pedagogie-runner-integration-p25.cjs` exigeait encore `files.length === 19` et recherchait la sortie exacte « 19 tests successifs ». Sur la **vraie version de ces deux fichiers issue du SHA P26**, la commande native `node tests/wave2-pedagogie-runner-integration-p25.cjs` a échoué avec **`AssertionError: Nombre de tests P25 attendu; 20 !== 19`**. C'est un échec factuel qui aurait bloqué la suite M1, jamais exécutée intégralement jusque-là.

Le test P26 était affecté par le même défaut de conception pour le prochain ajout : `listed.length === 20`. Dans une copie de la suite déclarant volontairement un 21e script, l'ancienne version de P26 échoue.

## Correction mesurée
Deux fichiers existants ont été modifiés, **sans créer un 21e script** :
- **P25 :** le nombre de scripts exécutés simulés et attendu dans le marqueur final est désormais calculé depuis le **véritable manifeste** ; l'unicité des scripts est comparée à sa taille réelle, avec un plancher historique de 19 scripts (détecte une réduction anormale).
- **P26 :** le contrôle de présence, la détection des fichiers non référencés et la lecture du checkpoint P18 restent stricts. Le nombre de scripts est déduit du manifeste et un plancher historique de 20 remplace l'égalité figée. Aucun relâchement de la comparaison exacte entre fichiers du répertoire et fichiers déclarés.

**Node.js v22.16.0, tests réels :**
- avant correction, **P25 FAIL** sur le vrai lanceur de 20 scripts, reproduit nativement ;
- après correction, **P24 PASS, P25 PASS, P26 PASS** ;
- P25 : **20 simulations de sous-processus, six catégories d'erreurs correctement propagées, ancien faux PASS démontré** ;
- P26 : **ancien oubli de fichier démontré, oubli et fichier manquant détectés, restauration acceptée** ;
- `node --check` P25/P26 : **2/2 PASS** ;
- **future suite de 21 scripts simulée dans un dossier temporaire : P25 PASS et P26 PASS** ;
- **contre-épreuve 21 scripts avec anciennes assertions figées : P25 FAIL et P26 FAIL**.

Les deux fichiers localement exécutés ont exactement les empreintes Git blobs `f2a7a3bdb96b046d9161a614a59f5fdd43fe2f1b` (P25) et `fbdb775c5bf17dd5d20a2c0351477a24f78c7b4c` (P26), vérifiées via GitHub avant commit.

## Statut et limites
Le conteneur ne peut pas résoudre `github.com` pour cloner le dépôt. Les **20 tests pédagogiques complets n'ont pas été exécutés en série** et ne sont pas encore intégrés au workflow M5. Cette passe n'invente ni CI verte ni approbation pédagogique. Les **6 clarifications éditoriales et 11 accords** restent en attente, notamment `SEF-L25-004` sur Texas Cœur contré et arrêt Carreau ♦AD84.

Zéro modification QCM, moteur, UI, workflow ou autre branche. Aucune fusion/publication.

**PASSE 27 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P28 — tester un véritable sous-ensemble documentaire de la suite sur ses fichiers GitHub exacts et rechercher d'autres anomalies d'exécution, ou reprendre la CI si son exécution devient accessible.**

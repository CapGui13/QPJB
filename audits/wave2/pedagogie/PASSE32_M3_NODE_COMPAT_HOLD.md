# QPJB M1 — P32 : recette Node native intégrale avec le HTML exact de M3

**PASSE 32 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON/HOLD.**

## Pourquoi ce contrôle était nécessaire
M3 — Expérience élève travaille sur `quizz.html`. M1 ne doit pas confondre une évolution d'interface légitime avec une modification des QCM embarqués. En P22/P23 cette compatibilité avait été testée en JavaScript isolé avec un adaptateur SHA-256. P32 apporte une **preuve native sur les 20 tests réels**.

## Sources exactes / exécution réelle
Dans la machine de test Linux temporaire (Node **v22.23.5**), clone public M1 :
- code et tests M1 : commit `0030dc15c27542ea92ace3979f2df64dc02dbc36` (aucun changement test entre P30 et P32) ;
- branche M3 récupérée **en lecture seule** avec `git fetch --depth=1 origin wave2/experience-eleve-20261121`, commit `c89d06878259c5d63fb7eae9dfbad4946d11c1e4` ;
- `quizz.html` M1 : blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7` ;
- `quizz.html` M3 : blob `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3` ;
- HTML M1 : **1 902 712 octets**, HTML M3 : **1 907 011 octets** ;
- extraction exacte entre `<script id="training-data" type="application/json">` et `</script>` : **JSON brut identique entre M1 et M3**, **1 523 QCM**.

**Contre-recette :** la copie locale de `quizz.html` M1 a été remplacée temporairement par le HTML complet M3 **dans la seule machine de test**, puis la commande normale `node tests/wave2-pedagogie-suite.cjs` a été exécutée sur les **20 scripts réels de M1**.

Résultat : **exit 0, les 20 scripts PASS et le lanceur final PASS (21 lignes)**, notamment les tests d'empreinte SHA-256 du JSON (`progressions`, `catalogue-p21`, `payload-p22`). Après ce contrôle, le HTML M1 original a été restauré : `git status --porcelain` donne **0 changement**. Aucun commit, aucun fichier ni aucune branche de M3 modifié.

## Ce qui est désormais prouvé et ce qui ne l'est pas
**Compatibilité M1 + HTML M3 : RÉUSSITE NATIVE 20/20** sur ces deux versions exactes. Cela valide le contrat « styles/UX modifiables, contenu du JSON pédagogique figé ».

Cela **ne valide pas les comportements UX navigateur M3** (Chromium/WebKit, reprise élève) : ils relèvent de sa propre recette. Cela n'est pas non plus un run GitHub Actions M1 : M5 doit raccorder `node tests/wave2-pedagogie-suite.cjs` sur une branche contenant les fichiers M1.

Les 6 clarifications et 11 accords conventionnels restent en attente des visas du référent, aucun QCM n'est modifié.

**PASSE 32 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P33 — tester l'assemblage M1 avec le moteur réel M2 et l'interface M3 sans écrire dans leurs branches ; documenter les conflits avant raccordement CI par M5.** Aucune fusion ni publication.

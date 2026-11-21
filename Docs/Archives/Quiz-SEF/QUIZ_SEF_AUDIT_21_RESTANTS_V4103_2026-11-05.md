# QPJB Quiz SEF — V4.103 : calibrages et contextes sécurisés

**Date :** 5 novembre 2026. **Cible :** `CapGui13/QPJB/quizz.html` exclusivement.

## Révisions effectuées

| ID | Intervention | Impact |
|---|---|---|
| SEF-C-008 | Difficulté de 3 à 2 : 1SA sur 1♠ avec 6 H et deux atouts | Difficulté seulement |
| SEF-V419-001 | Ouverture 1♠ en troisième position, 11 H, vulnérabilité favorable | Énoncé et corrigé |
| SEF-V44-002 | Ouverture artificielle 2♣ avec 22 H réguliers, difficulté 1 à 3 | Énoncé, corrigé, difficulté |
| SEF-V44-011 | Barrage de soutien à 4♥ avec fit dixième, non vulnérable contre vulnérable | Énoncé et corrigé |
| SEF-V44-012 | Barrage de soutien à 4♠ avec fit dixième, non vulnérable contre vulnérable | Énoncé et corrigé |
| SEF-V473-007 | Correction arithmétique du calcul de HLD : 14, et non environ 15 | Énoncé et corrigé |
| SEF-V45-029 | 2SA pour le bicolore mineur 5–5 en Multi-Landy : convention clairement désignée | Énoncé et corrigé |
| SEF-V486-011 | Difficulté de 2 à 3 : soutien mixte à 2SA après nouvelle couleur adverse | Difficulté seulement |
| SEF-V44-046 | Barrage d'ouverture à 3♣ en première position et vulnérabilité favorable | Énoncé et corrigé |
| SEF-V44-047 | Barrage d'ouverture à 3♦ en première position et vulnérabilité favorable | Énoncé et corrigé |

Les dix bonnes enchères, mains, choix et séquences sont inchangés. Les éventuels changements de contexte, de texte et de difficulté sont archivés dans `tests/quizz-v4103-approved-revisions.json` avec snapshots complets. Le test V4.103 ajoute une protection historique de l'ensemble des **1 223 QCM / 22 thèmes**, et aucun fichier de `/entrainement/` n'est modifié.

## Signalements mineurs restant à arbitrer ou vérifier

11 cas parmi les 81 signalements mineurs historiques n'ont pas été modifiés automatiquement.

| ID | Pourquoi réserver ? | Suivi |
|---|---|---|
| `SEF-V426-001` | Walsh explicite mais contraire au périmètre SEF standard choisi | ARBITRAGE SYSTÈME |
| `SEF-V49-033` | 1♦ comme distracteur pourrait devenir une seconde bonne réponse | ARBITRAGE D'UNICITÉ |
| `SEF-V411-012` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V412-019` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V417-011` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V422-006` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V423-004` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V423-005` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V424-005` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V424-006` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |
| `SEF-V44-042` | Changement naturel au palier de 2 après intervention : portée autoforcing | SOURCE SEF |

Sur les neuf situations au palier de deux après intervention, le registre recommande de distinguer **« forcing un tour »** et **« autoforcing »**. Des supports FFB décrivent les changements de couleur 2/1 comme autoforcing, mais la transposition exacte aux différentes enchères compétitives du Quiz doit être justifiée par une source pertinente, sans généraliser une règle à tort.

Sources de contexte complémentaires :
- FFB, « Les changements de couleur en 2/1 » : https://cdn.ffbridge.fr/cms/default/0001/08/e59ea4330e7ca327d0a950ee3adaa3528f173607.pdf
- Développements en enchères compétitives (discussion experte) : https://amourdubridge.fr/forums/topic/le-repondant-au-palier-de-2-apres-intervention/

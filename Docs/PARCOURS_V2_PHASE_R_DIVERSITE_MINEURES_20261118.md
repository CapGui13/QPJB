# QPJB V2 — Phase R : approfondir les ouvertures/réponses mineures sans casser le mélange

**18 novembre 2026 · PR #214 non fusionnée · développement et audit uniquement.**

## 1. Résultats certifiés de la phase Q

GitHub Actions **#44391961636** (intégrité, Chromium et WebKit : succès). Source des mesures : sortie de `scripts/parcours-v2-reperes-q.cjs` dans l'audit d'intégrité. **Neuf simulations synthétiques, trois profils × trois graines × 45 séances × 10 QCM**, sans aucune donnée d'élève.

| Groupe documentaire Q | Première apparition | Présentations des QCM rattachés dans 450 questions |
|---|---|---:|
| Socle et fit majeur | 1re séance | 16–19 |
| Invitation, Stayman et Texas après 1SA | 4e séance | 16–19 |
| Notre intervention / réponse après contre adverse | Séances 15–28 | 3–10 |
| Convention après 2SA et extensions | Séances 4–6 | 7–14 |
| Chelems et cas spéciaux | Séances 40–42, ou jamais | 0–1 |

**Observation importante :** ces chiffres décrivent uniquement les QCM *rattachés aux cinq groupes candidats*. Ils ne représentent **pas tous les exercices de même thème** que V2-F montre. Ainsi, les réponses aux mineures étaient déjà travaillées, mais elles ne possédaient pas encore d'axe documentaire autonome.

### Premières cinq séances : les deux mineures sont déjà présentes

Dans chacun des neuf parcours, sur 50 QCM :

| Catégorie véritable du catalogue (tous QCM, pas seulement ceux de la cartographie) | Occurrences |
|---|---:|
| Choix d'ouverture **1♣** | **3–4** |
| Choix d'ouverture **1♦** | **3–4** |
| Réponses sur ouverture **1♣** | **5–6** |
| Réponses sur ouverture **1♦** | **5** |

La présence est robuste dans ces neuf simulations. **Aucune injection forcée n'est nécessaire** pour remédier à l'absence supposée des mineures dans le démarrage. On peut conserver l'alternance des ouvertures et réponses en suivant ces métriques.

L'attention doit plutôt porter sur la diversité des **décisions** à l'intérieur des réponses (majeure, 1SA, 1♦ sur 1♣, soutien) et sur la progression ultérieure des situations compétitives. Ces points demandent une revue pédagogique ; l'observation des seules catégories ne suffit pas à conclure.

## 2. Nouvelle extension documentaire de 16 à 21 axes

Le fichier `Docs/PARCOURS_V2_PHASE_R_LACUNES_CANDIDATES_20261118.json` fournit **cinq nouveaux axes candidats**, sans toucher aux seize axes de P.

| Axe nouveau | Exemples du catalogue actuel | Familles distinctes |
|---|---:|---:|
| Choisir l'ouverture **1♣** | 6 | 6 |
| Choisir l'ouverture **1♦** | 6 | 6 |
| Répondre sur **1♣** | 12 | 12 |
| Répondre sur **1♦** | 11 | 11 |
| Adapter Stayman/Texas après un **Contre d'entame** adverse | 6 | 6 |

Total : **41 associations supplémentaires sur 41 QCM originaux distincts**, sans chevauchement avec les **122 QCM documentés précédemment**. La cartographie candidate couvre à présent **163 QCM distincts** du catalogue original de 1 523 questions, répartis entre 21 axes. Ces chiffres sont un **échantillonnage vérifiable**, pas un inventaire exhaustif des 1♣/1♦ ou un nombre de compétences maîtrisées.

Les exemples après 1♣ incluent plusieurs décisions concurrentes : 1♥, 1♠, 1♦, 1SA et soutien. Les exemples après 1♦ incluent 1♥, 1♠, 1SA, 2♣ et soutien à 3♦. Les différences de force et les priorités entre majeure quatrième et Carreau après 1♣ demandent une revue SEF. On ne déduit **aucune règle Walsh** de ces échantillons.

Les six QCM Stayman/Texas contrés (`SEF-L25-001` à `SEF-L25-006`) sont **des contres d'entame sur la convention**, pas des réponses à un Contre d'appel adverse sur l'ouverture. Ils restent en `CONVENTION_A_ARBITRER`.

## 3. Comparateur R : vérifier sans intervenir

`scripts/parcours-v2-observatoire-r.cjs` lit le moteur **V2-F inchangé** et calcule, sur neuf simulations de 45 séances :

- Présentations, familles et première apparition des cinq axes supplémentaires ;
- Dans les fenêtres 1–5, 6–15, 16–30 et 31–45, répartition des quatre rôles **ouv:1♣**, **ouv:1♦**, **rep:1♣**, **rep:1♦** ;
- Rappels ciblés et nombre de familles distinctes de V2-F (contrôles de non-régression).

`tests/quizz-v2-extension-r.cjs` vérifie chacun des **41 QCM** contre les IDs, séquences, réponses, familles et justifications originales ; l'unicité des familles ; la présence précoce des deux mineures ; la reproductibilité et la non-mutation des séances/rappels. Le test ainsi que le comparateur sont intégrés à `.github/workflows/training-smoke.yml`.

**Attention :** les résultats détaillés de la nouvelle phase R ne doivent pas être annoncés comme validés avant la fin de sa propre CI.

## 4. Décision provisoire et suite

- **Conserver V2-F**, qui présente déjà 1♣, 1♦ et leurs réponses tôt et sans 40 questions d'ouverture identiques.
- **Ne pas transformer un axe en verrou** : pas d'acquis automatique, pas de progression bloquée sur une réponse.
- Étudier ensuite si le groupe concurrentiel peut être présenté un peu plus tôt **sans** dégrader la diversité, le rythme des réponses ni les rappels. Cela exige un essai comparatif isolé et des critères d'abandon explicites, pas une substitution automatique.
- Conserver les cas spéciaux à source unique, notamment 3SA gambling et Texas mineur après 2SA, en observation jusqu'à revue des sources et conventions.

**Statut :** `V2_F_REFERENCE / R_21_AXES_DOCUMENTAIRES_NON_ACTIFS / NO_DEPLOY_NO_MERGE`.

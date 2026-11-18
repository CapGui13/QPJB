# QPJB V2 — Phase J : robustesse des tirages et prérequis proposés

**18 novembre 2026 — Audit hors production.**
Référence : `scripts/parcours-v2-pilot.cjs`, `scripts/parcours-v2-robustesse.cjs`, `Docs/PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json`.

## 1. Mesure multi-profils sur le catalogue réel

Neuf simulations de **45 séances × 10 QCM** : trois profils purement fictifs et trois graines (`13`, `29`, `47`). Les QCM sont sélectionnés parmi les **1 523 exercices originaux**. Les réponses fictives proviennent d'une empreinte déterministe de l'ID et de la séance. Aucune donnée d'apprenant n'est utilisée.

| Profil simulé | Graine | Familles distinctes (sur 450) | Rappels ciblés exécutés | Rappels à échéance après erreur | Rappels à échéance après réussite |
| --- | ---: | ---: | ---: | ---: | ---: |
| Standard (`balanced`) | 13 | 443 | 77 | 53 | 40 |
| Standard (`balanced`) | 29 | 448 | 75 | 61 | 31 |
| Standard (`balanced`) | 47 | 443 | 75 | 51 | 42 |
| Fragile sur mineures (`fragile-mineures`) | 13 | 450 | 77 | 53 | 40 |
| Fragile sur mineures | 29 | 447 | 76 | 65 | 32 |
| Fragile sur mineures | 47 | 448 | 77 | 57 | 43 |
| Très à l'aise (`facile`) | 13 | 443 | 70 | 7 | 72 |
| Très à l'aise | 29 | 444 | 73 | 17 | 66 |
| Très à l'aise | 47 | 440 | 69 | 6 | 71 |

**À interpréter correctement :** les deux dernières colonnes représentent **tous** les rappels à échéance, qu'ils aient été programmés ou rencontrés incidemment. Leur somme n'est donc **pas** égale au nombre de rappels ciblés. La distribution des erreurs du profil fragile mineures diffère du standard, mais les scénarios utilisent les mêmes règles de sélection.

**Constats techniques :**
- **22 rubriques sur 22** rencontrées dans chacun des neuf scénarios.
- **440 à 450 familles originales différentes** parmi 450 questions par scénario.
- Les rappels ciblés coexistent avec les nouvelles familles : **69 à 77 rappels programmés exécutés**.
- Aucune duplication de la même famille **au cours d'une séance** (invariant du moteur), et contrôles des retours après réussite / erreur dans le test dédié.
- La diversité n'est **pas** une validation pédagogique. Un simulateur qui privilégie les familles inédites peut masquer un déficit de répétitions sur de longues périodes. Ne pas déclarer la V2 plus efficace que la V1 sur ces chiffres.

Reproduire la mesure :

```bash
node scripts/parcours-v2-robustesse.cjs --detail
node tests/quizz-v2-prerequis.cjs
```

## 2. Proposition de prérequis — sans blocage

Le fichier `Docs/PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json` contient **33 micro-objectifs candidats** (8 SA + 25 Stayman/Texas), associés à **79 QCM distincts**. Ils sont reliés à **15 fondations pédagogiques** (évaluation H, ouvertures de 1SA et 2SA, Stayman/Texas, fit, invitation, contre, chelem, etc.) et à **23 liens « apprendre avant » proposés**.

Les quinze fondations **ne sont pas encore reliées à des IDs d'exercices précis** ; le fichier les marque `NON_CARTOGRAPHIEE_EN_ID_QCM`. Aucun seuil de maîtrise, aucun déblocage ni ordre obligatoire n'est configuré. Les dépendances sont orientées sans cycle et restent soumises à la validation de l'enseignante.

### Trois risques à traiter avant un déploiement

1. **10 micro-objectifs candidats ne possèdent qu'une seule famille d'origine indépendante.** Même plusieurs passages sur cette même donne ne peuvent être considérés comme des preuves indépendantes.
2. **12 objectifs candidat sont signalés pour arbitrage conventionnel ou éditorial** : notamment le transfert de manche après Stayman, le Texas mineur, les annonces sur intervention et le 3SA gambling. Le fichier propose des parcours, pas de nouveaux corrigés.
3. **Les 15 fondations sont encore qualitatives.** Sans table de correspondance avec les exercices déjà classés du Quiz SEF, on ne peut pas établir de déblocage fiable. Les coder comme « maîtrisées par défaut » serait artificiel.

## 3. Proposition de séquençage pédagogique (non imposée)

- **Fondations** : choix d'ouverture et premières réponses à 1♣ / 1♦ / 1♥ / 1♠ ; evaluation H, distribution et identification des ouvertures de 1SA / 2SA.
- **Conventions régulières** : réponses de l'ouvreur au Stayman sur 1SA, Texas majeur simple, invitations et conclusions à la manche. Des choix d'ouvertures continuent d'apparaître pour maintenir la variété.
- **Développements** : Stayman et Texas après 2SA, rectifications avec/sans fit, Texas mineur et suites descriptives.
- **Extensions et cas sensibles** : contre d'entame, chassé-croisé, relais, transfert spécifique et chelems, à introduire seulement une fois les accords enseignés.

Ce séquençage est une **hypothèse de progression**, sans prétention à l'unicité et sans moteur de prérequis actif. Il faut encore confronter les 33 intitulés aux corrigés exacts et aux accords SEF retenus avant toute adaptation de l'interface élève.

## 4. Statut des livrables

- `scripts/parcours-v2-robustesse.cjs` : évaluation reproductible sur 9 scénarios.
- `Docs/PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json` : 33 objectifs, 15 fondations, 23 arcs non actifs.
- `tests/quizz-v2-prerequis.cjs` : contrôles de couverture 79/79, absence de cycles et de seuils activés.
- GitHub Actions exécute les nouveaux contrôles dans le job d'intégrité.
- Le prototype autonome `preview/parcours-v2-autonome.html` reste en lecture/usage local sur la branche de la PR, **non déployé sur GitHub Pages**.

**Aucun fichier du parcours public, du Quiz libre, du module Entraînement ou des sauvegardes élèves n'est modifié.**

# QPJB — Cartographie initiale des 993 exercices du Quiz
Date : 4 novembre 2026. **Source figée :** `main` au commit `28ae8e5161655534bf17376673decc92c72f2a79` (Quiz V4.69).
**Périmètre : Quiz seulement**, sans changement d'exercice, de corrigé, d'interface ni de données de production.

## Ce qui a été fait
- Les **993 objets** de `quizz.html` ont été lus et classés individuellement dans `cartographie-993.csv`, avec leur ID, thème, séquence, enchère, force H, distribution, famille et notion dominante calculée.
- 89 **groupes de compétences dominantes** ont été repérés automatiquement. Attention : un groupe regroupe des décisions similaires, **ce n'est pas une compétence du SEF certifiée** ni une validation approfondie des 993 cas.
- 22 thèmes, 150 **séquences normalisées distinctes** (une convention entre parenthèses est ignorée pour ce comptage).
- Répartition par étape : Débutant : 236 ; Consolidation : 689 ; Approfondissement : 68.
- Signature de comparaison = rubrique + séquence normalisée + bonne enchère + H + distribution. 26 groupes répètent cette signature, soit **27 exercices supplémentaires**. **Ce ne sont pas automatiquement des doublons** : cartes, arrêts ou qualité des couleurs peuvent être déterminants.

## Couverture observée (indicateurs descriptifs, pas quotas)
| Rubrique | Fiches | Notions dominantes automatiques | Séquences | Séquences avec plusieurs bonnes enchères distinctes |
|---|---:|---:|---:|---:|
| Choisir son ouverture | 77 | 6 | 3 | 2 |
| Répondre à 1♣ / 1♦ | 78 | 5 | 2 | 2 |
| Répondre à 1♥ / 1♠ | 81 | 7 | 2 | 2 |
| Répondre à 1SA / 2SA | 62 | 6 | 2 | 2 |
| La redemande de l’ouvreur | 101 | 4 | 13 | 13 |
| La 2e enchère du répondant | 103 | 5 | 27 | 22 |
| Après Stayman et Texas | 45 | 4 | 12 | 9 |
| Interventions | 56 | 4 | 4 | 4 |
| Après un contre d’appel | 41 | 4 | 6 | 5 |
| Après intervention adverse | 65 | 6 | 16 | 11 |
| Barrages simples à la couleur | 38 | 3 | 4 | 3 |
| Après un fit majeur | 39 | 2 | 8 | 7 |
| Répondre à une intervention | 44 | 5 | 7 | 6 |
| Réveils simples | 43 | 4 | 4 | 4 |
| Le Roudi | 33 | 4 | 13 | 8 |
| Le Drury | 19 | 2 | 4 | 4 |
| Ouvertures fortes et réponses | 12 | 4 | 4 | 3 |
| Troisième et quatrième couleur forcing | 10 | 2 | 8 | 2 |
| Défense contre 1SA : Multi-Landy | 11 | 4 | 1 | 1 |
| Après intervention sur notre 1SA | 13 | 3 | 3 | 2 |
| Interventions bicolores (Michaels) | 11 | 3 | 4 | 2 |
| Contrôles, Splinters et Blackwood | 11 | 2 | 3 | 2 |

Les deux CSV joints permettent de repartir de chaque observation et de remonter à ses fiches. Aucun seuil du type « au moins 20 exercices par rubrique » n'est utilisé.

## Limite : ce qui reste à valider humainement
1. La notion dominante est affectée par règles **heuristiques** (rubrique, séquence et bonne enchère). Une fiche peut travailler simultanément force, fit, longueur, convention et jugement compétitif ; ces dimensions nécessitent un codage pédagogique fin.
2. La similarité de séquence est insensible aux annotations : « Roudi », « forcing », etc. peuvent changer profondément l'interprétation d'une enchère ; on ne doit jamais s'en servir pour décréter qu'une notion est déjà maîtrisée.
3. Aucune conclusion de conformité universelle au SEF n'est tirée par ces scripts. Le référentiel local `QUIZZ_REFERENCE_SEF.md` demande une validation individuelle des cas dépendant de conventions.
4. Aucune donnée de réponses des élèves ni fréquence de donnes réelles n'a été étudiée. La **priorité pédagogique** doit résulter des erreurs concrètes, de la fréquence vraisemblable en jeu et de la décision à apprendre, pas d'un volume brut.
5. La cartographie est une **première passe exhaustive sur les 993 enregistrements** ; elle ne remplace pas encore une annotation conceptuelle humaine de chaque fiche.

## Procédure de validation de la phase 2
- Vérifier chaque piste de `pistes-lacunes.md` en lisant ses cas voisins.
- Énoncer la décision à apprendre, ses confusions typiques, les limites SEF et la valeur ajoutée par rapport aux fiches proches.
- Accepter une fiche nouvelle uniquement si elle apporte un **contraste pédagogique identifié** ; autrement, renforcer le corrigé existant ou ne rien créer.
- Faire valider les cas retenus avant génération des nouvelles mains, choix et corrigés.

## Préservation
Aucun fichier `quizz.html`, test, catalogue ou corrigé n'est modifié dans cette PR ; fichiers de travail de revue uniquement.

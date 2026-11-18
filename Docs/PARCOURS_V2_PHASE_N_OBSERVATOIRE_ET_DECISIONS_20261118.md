# Parcours QPJB — phase N : bilan du contre-test M et observatoire non intrusif

**18 novembre 2026 · branche de la PR #214 uniquement · aucun déploiement.**

## 1. Décision après le test des trois moteurs

V2-F reste le **moteur de référence**. Les statistiques de V2-L et V2-M viennent de simulations **déterministes de profils fictifs**, pas de résultats d'élèves.

| Comparaison sur 9 scénarios × 45 séances × 10 QCM | V2-F | V2-L | V2-M |
|---|---:|---:|---:|
| Familles originales distinctes (sur 450) | 440–450 | 413–426 | 440–449 |
| Rappels ciblés | 69–77 | 67–78 | 69–77 |
| Séances avec quatre réponses identiques | 0 | 0 | 0 |
| Substitutions ciblées par scénario | 0 | 43 | 0–4 |
| Couverture de 22 rubriques à chaque scénario | Oui | Non | Non |

**Bilan :** V2-L introduit trop de répétitions. V2-M réussit à préserver tous les rappels ciblés, mais peut encore réduire le nombre de familles rencontrées (écart allant de **−6 à +3**) et fait parfois perdre la couverture des 22 rubriques. Aucun remplacement de moteur n'est donc justifié. On conserve ces deux variantes **seulement comme bancs d'essai documentés**.

Sources : `scripts/parcours-v2-variete-l.cjs` et `scripts/parcours-v2-variete-m.cjs`, journaux de l'audit GitHub Actions de la PR #214, notamment la run **44385135947** (phase M). Il n'y a **aucune mesure de compétence réelle d'élève** dans ces chiffres.

## 2. Phase N : observer au lieu de forcer

L'outil `scripts/parcours-v2-observatoire-n.cjs` lit le résultat du **moteur de référence V2-F inchangé**.

Il recoupe ses 10 QCM par séance avec la cartographie K+L : **15 fondations candidates**, **110 IDs QCM distincts**, **122 liens** entre ID et fondation.

Pour chaque scénario il relève :
- Nombre d'apparitions d'un QCM appartenant à la cartographie et nombre de **familles indépendantes** rencontrées par fondation ;
- Première et dernière séance d'apparition, nombre de séances concernées ;
- Fondations **non rencontrées**, ainsi que celles n'ayant qu'une famille réellement rencontrée ;
- Nombre de rubriques et de familles différentes dans chaque fenêtre successive de cinq séances ;
- Nombre de rappels ciblés et couverture des 22 rubriques, sans influence sur le moteur de tirage.

**Distinction essentielle :** `encounteredFamilies` compte les familles vues dans une simulation, pas les notions comprises. Un QCM peut appartenir à deux fondations : il apparaît alors dans deux relevés, mais **ne devient pas deux preuves indépendantes**.

La présence d'une fondation dans les tirages ne constitue **jamais un prérequis acquis**, une note, un déblocage, ni un droit à passer à la notion suivante. Les 15 catégories restent **éditorialement candidates**, et l'évaluation des points H demeure indirecte.

### Vérification

```bash
node tests/quizz-v2-observatoire-n.cjs
node scripts/parcours-v2-observatoire-n.cjs
node scripts/parcours-v2-observatoire-n.cjs --detail
```

Le test de non-régression vérifie la correspondance exacte des IDs, familles, rubriques et réponses du catalogue original, le nombre de liens, la reproductibilité et surtout **l'absence de modification des séances et des rappels**.

## 3. Suite pédagogique proposée (pas un blocage)

- Faire examiner aux enseignantes les compétences et variantes *réellement rencontrées* par V2-F, en particulier les zones non couvertes et les ambiguïtés SEF.
- Pour chaque notion suffisamment documentée, envisager une **exposition puis un rappel contextualisé**, plutôt qu'un seuil arbitraire de séances avant d'autoriser la suite.
- Maintenir les choix d'ouverture (1♣, 1♦, 1♥, 1♠, 1SA, Passe) **tout au long du parcours**, sans créer de série de 40 ouvertures faciles.
- Conserver l'alternance des thèmes et les rappels de la V2-F tant que des essais fiables ne démontrent pas le bénéfice d'un changement.

**Statut : `V2_F_REFERENCE / V2_L_ET_M_NON_RETENUS / V2_N_OBSERVATOIRE_NON_ACTIF`.**

Aucun fichier du Quiz public, aucun corrigé, aucune sauvegarde et aucun module Entraînement n'est modifié.

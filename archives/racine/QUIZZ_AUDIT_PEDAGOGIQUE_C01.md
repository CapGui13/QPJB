# QPJB · Quizz — audit pédagogique C01 (31 octobre 2026)

## Portée et méthode

Audit du catalogue intégré `quizz.html`, sans modification ni suppression des exercices originaux, de leurs identifiants ou des sauvegardes historiques. Les probabilités réelles de rencontre des donnes ne sont **pas** estimées à partir de la base ; l'enrichissement privilégie qualitativement les décisions récurrentes et les contrastes utiles entre enchères.

## Constats vérifiés

| Mesure | Après C01 |
|---|---:|
| Exercices | **981** (969 préexistants + 12 nouveaux) |
| Rubriques | 22 |
| Familles pédagogiques | **778** |
| Familles à plusieurs variantes | 203 |
| Occurrences supplémentaires avec même texte de situation, réponse et explication | 231 |
| Situations strictement identiques (même main et même séquence) | **0** |
| Corrigés enrichis avec une enchère alternative commentée et une règle à retenir | **54** |

Les 231 occurrences de texte répété ne sont pas 231 doublons avérés : les mains varient souvent. Leur suppression automatique pourrait faire perdre des contrastes pédagogiques intéressants. La revue individuelle devra décider si les différences de distribution, de points ou de qualité d'honneurs apportent une valeur d'entraînement.

## Enrichissement effectué

Douze nouveaux cas `SEF-C-001` à `SEF-C-012` : réponses après 1SA et 2SA (six cas), réponses aux ouvertures majeures (trois), interventions naturelles et contre d'appel (deux), réponse au contre d'appel (un). Les conditions de système sont précisées lorsque nécessaires : Texas, Stayman, 1SA forcing. Chaque cas reçoit un contraste pédagogique et un point à retenir.

Les 42 autres corrigés détaillés sont répartis dans les rubriques déjà présentes, y compris enchères compétitives et quelques conventions plus rares. Aucun corrigé original n'a été supprimé : les textes contrastifs viennent en complément.

## Couverture : à traiter dans les lots suivants

Les six rubriques d'approfondissement totalisent encore **58 exercices** : Multi-Landy (8), Michaels (9), chelems (9), forcing (10), Rubensohl (10), ouvertures fortes (12). Elles ne doivent pas être artificiellement équilibrées avec les cas courants ; rechercher d'abord les séquences classiques non couvertes et les frontières entre réponses plausibles.

Prochains axes recommandés :
1. **Audit qualitatif des 203 familles à variantes**, en distinguant cas réellement nouveaux et simple permutation des petites cartes ; ne rien retirer sans conserver les identifiants et la progression.
2. **Audit ciblé des conventions avancées** contre les accords du partenariat : Roudi, Drury, 1SA forcing, Multi-Landy, Rubensohl, Michaels, Blackwood 30–41.
3. **Amélioration progressive des corrigés** là où un distracteur crédible éclaire une frontière de force ou de distribution.
4. **Validation pédagogique** des situations potentiellement dépendantes de la vulnérabilité, de la position et du style de barrage.

## Garde-fous

Le script `tests/quizz-content-audit.cjs` analyse la répartition, les familles, les textes répétés et les corrigés contrastifs. Il bloque les situations strictement dupliquées et les contradictions de structure des comparaisons, mais ne certifie pas automatiquement la justesse technique d'une enchère. Les tests navigateurs Chromium et WebKit vérifient l'affichage des nouveaux corrigés ; l'iPhone physique reste une validation distincte.

Aucune « probabilité réelle » n'est attribuée aux 981 situations.

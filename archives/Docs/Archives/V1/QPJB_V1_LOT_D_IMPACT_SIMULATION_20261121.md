# QPJB V1 — Impact du LOT D sur la simulation du parcours

**21 novembre 2026 — audit comparatif, non décision de publication.** Les données ci-dessous proviennent d'une exécution réelle de la CI sur la PR #242, avant la séparation du benchmark historique du lot B : [run 44892242960](https://github.com/CapGui13/QPJB/actions/runs/44892242960), commit source `44e9d6cda7995c82b8984277a8b7f19e532fe84e`. Le seul changement ultérieur est la méthode de test du benchmark historique, pas le moteur pédagogique ni les 11 fiches approuvées.

## Deux objectifs différents, à ne pas confondre

1. **Historique du lot B** : démontrer l'amélioration de l'algorithme du 20 novembre dans les conditions de référence du lot B, avant les corrections D. Pour le rendre reproductible à l'identique après l'édition des QCM, le test `tests/quizz-parcours-lot-b.cjs` reconstruit en mémoire les anciens 11 QCM et les 4 anciennes justifications d'audit dans les deux versions moteur. Il conserve le contrôle SHA du moteur historique et tous les seuils d'amélioration originels. Le vrai moteur et les vraies questions sur GitHub ne sont pas modifiés par ce test.
2. **Sensibilité sur le catalogue corrigé** : évaluer l'algorithme B sur le catalogue des 11 QCM D, après synchronisation de quatre preuves transversales (105 préservées). Le tableau suivant est **un test de sensibilité**, non une preuve d'apprentissage.

## Résultats relevés — 153 séances, cinq profils, 10 QCM/séance, deux versions moteur

Les colonnes `avant → après` comparent une version *sans* priorité B à la version B, toutes deux utilisant le **catalogue éditorial corrigé** et les mêmes 105 preuves d'axes. Une simulation déterministe, sans données personnelles ni réponse réelle d'élève.

| Profil | QCM difficulté 4–5 (avant→après) | QCM avancés pendant faiblesse (avant→après) | Familles distinctes (avant→après) | Contextes (avant→après) |
|---|---:|---:|---:|---:|
| Tout juste | 442 → 442 (0) | 0 → 0 (0) | 1315 → 1315 (0) | 171 → 171 (0) |
| Échec persistant | 204 → 142 (-62) | 668 → 644 (-24) | 1022 → 1027 (+5) | 119 → 155 (+36) |
| Erreurs modérées | 488 → 488 (0) | 0 → 0 (0) | 1084 → 1084 (0) | 168 → 168 (0) |
| Aides fréquentes | 208 → 235 (+27) | 602 → 462 (-140) | 1041 → 1056 (+15) | 125 → 163 (+38) |
| Progression graduelle | 456 → 443 (-13) | 198 → 130 (-68) | 1079 → 1089 (+10) | 169 → 168 (-1) |

### Lecture indispensable

- Avec **échec persistant**, le lot B réduit encore les questions difficiles et les QCM avancés pendant les faiblesses, tout en augmentant la couverture des contextes.
- Pour les **aides fréquentes**, le nombre de questions difficiles **augmente** dans cette nouvelle simulation, de **208 à 235** (+27) ; en revanche les QCM avancés pendant une faiblesse diminuent de **602 à 462** (−140), les familles et les contextes distincts augmentent. **Il serait incorrect de déclarer « aucune régression » sur cette métrique.**
- Pour les réponses **tout juste** et les **erreurs modérées**, avant/après sont identiques, comme attendu du rattrapage conditionnel.
- Ces résultats sont particulièrement sensibles au tirage et à la trajectoire des erreurs ; une divergence de fréquence dans un profil synthétique ne prouve ni gain ni perte pédagogique réelle.

### Décision technique

La PR d'intégration conserve la priorité adaptative du lot B **strictement inchangée**. Les **quatre preuves éditoriales de l'axe palier** sont adaptées à leurs nouveaux textes, sans modifier le scoring ou les sauvegardes ; les 105 preuves restent couvertes. La comparaison historique du lot B doit continuer de passer sur son catalogue initial, tandis que cette nouvelle sensibilité reste signalée séparément et n'est pas maquillée par un affaiblissement de seuil. L'éventuelle optimisation de la métrique « QCM difficiles avec aide » demanderait un **chantier moteur dédié**, avec test chiffré sur le catalogue actuel.

**HOLD** : ce document n'autorise ni fusion ni publication. Le lot C de classification demeure non actif.

# QPJB — Parcours V1.9 : distinguer entraînement ciblé et évaluation du niveau

## Anomalie constatée sur V1.8

Le moteur utilise le compteur `completed` des **séances ordinaires** pour identifier les preuves d'apprentissage (`lastScoredSession`, `lastCleanSession` et `lastLevelChangeSession`). Une séance de consolidation a intentionnellement **le même compteur** que la séance ordinaire à venir, car elle ne doit pas débloquer de thème.

En V1.8, `record()` modifiait néanmoins les scores des micro-compétences, des axes et les niveaux au cours d'une consolidation. Dans le scénario concret « consolidation → séance normale », la consolidation prenait donc le numéro de preuve `completed`; une bonne réponse ultérieure en séance normale pouvait ne pas modifier le score. À l'inverse, une série de réponses ciblées pouvait influencer artificiellement le niveau.

## Règle V1.9

- **Consolidation = entraînement guidé et révision**, sans attribution ni retrait de points de maîtrise et sans promotion/rétrogradation du niveau de difficulté.
- Chaque réponse de consolidation reste enregistrée dans `state.entries` : résultat, aide éventuelle, répétitions, famille et échéance de révision.
- Les **bilans V1.8** (bonnes réponses autonomes, avec aide, erreurs et questions passées, par objectif quand disponible) sont intégralement conservés.
- Les **séances ordinaires** continuent exactement à appliquer les règles V1.2–V1.5 : une preuve par micro-compétence/axe et par numéro de séance, progression prudente des niveaux, erreurs prioritaires.
- Le compteur `completed` ne change toujours pas à l'issue d'une consolidation ; les séances normales restent à 10 QCM ; la consolidation reste entre 4 et 10 QCM, sans répétition de famille.
- L'interface précise explicitement que **l'évaluation du niveau s'effectue dans les séances normales**.

## Intégrité et compatibilité

- **1 523 QCM Quiz SEF, réponses, justifications, explications et données de l'Entraînement inchangés.**
- Aucune migration de stockage, sauvegarde `qpjb-sef-parcours-01`, version interne `1` inchangées.
- Les anciennes consolidations déjà réalisées conservent leurs scores historiquement enregistrés. Il est impossible de les « défaire » fiablement sans inventer la chronologie. La nouvelle règle s'applique aux consolidations V1.9 et suivantes.
- Cache PWA `qpjb-v93`, module `quizz-parcours.js?v=11`.

## Tests de non-régression

1. 10 erreurs pendant une consolidation : bilan correct, historique d'erreurs conservé, **scores et niveaux inchangés**.
2. Séance normale suivante au **même numéro `completed`** : la première réussite autonome est effectivement comptée, et `lastScoredSession` reçoit ce numéro.
3. Consolidation avec résultats mixtes sur micro-compétence + axe audité : score, tentatives évaluées et niveaux inchangés ; bilan par objectif cohérent.
4. Navigateur Chromium et WebKit : 10 questions passées, 5 questions passées, bilan correct, absence de modification des scores et niveaux ; navigation/rechargement conservés.
5. Contrôles de catalogue, de PWA, de Quiz libre et d'Entraînement inchangés.

**Publication après validation complète de la CI uniquement.**

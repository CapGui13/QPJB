# LONG M4 — Passe 19 : contrat de raccordement et état de recette

**PASSE 19 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Référence : issue #258, PR brouillon #262, branche `wave2/recommandations-20261121` exclusivement. Base initiale `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.

## 1. Contrat d'intégration futur (coordinateur uniquement)

**Le raccordement à `quizz.html` n'est PAS effectué par M4.**

Charger `quizz-parcours.js` avant `parcours-recommandations.js`. Exemple de consommation côté navigateur, à l'initiative du coordinateur :

```js
const report = window.QPJBParcoursRecommandations.buildReport(rawSavedState, {
  parcours: window.QPJBParcours,
  exercises: validatedCatalogueQCM,
  maxRecommendations: 3
});
if (report.status === 'ok') {
  // Afficher report.recommendations, puis report.limitations.
  // Ne jamais écrire le rapport dans la sauvegarde élève.
}
```

- `rawSavedState` doit être l'état brut V1 déjà enregistré, pas une nouvelle structure.
- `exercises` est **optionnel**. Sans catalogue, `revision=null` et une limite explique que l'éligibilité à la révision n'a pas été vérifiée. Avec catalogue mais séance active, `revision=null` : reprendre avant d'ouvrir une autre séance.
- `maxRecommendations` 1 à 10, **3 pour l'interface publique**. Avec une limite de 3 et une révision effectivement disponible, une place est préservée pour cette action, sauf limite 1. La reprise conserve la priorité.
- Un état absent/incompatible renvoie `status='unavailable'` et une forme minimale (pas de `observations`, `currentSession` ou `revision` garantie dans ce cas). L'UI doit vérifier `status` AVANT de lire ces champs.

Chaque conseil exposé conserve `id/type/priority/title/message/evidence` et ajoute `explanation:{observed,caveat,action}`. L'action est une indication pour l'élève, **pas un appel déclenché par M4**.

## 2. Interprétation des preuves et contre-preuves

- `observations.parcours` et `observations.consolidation` sont distincts. `correct` avec `assisted` ou `hadFreeError` est **helped**, jamais autonome. `skipped` n'est pas une erreur constatée.
- `evidence.source` vaut selon les cas `micros`, `axes`, `active`, `consolidationPlan`, `journalConsistency` ou est absent/null. Le coordinateur **ne doit jamais convertir les données du rapport en nouvelles notes de maîtrise**.
- `evidence.sameAnswersAs` signale un **classement parallèle des mêmes réponses**, jamais une seconde preuve indépendante.
- `evidence.skippedOnly === true` et `type='not_evaluated'` signifient « seulement des questions sautées », à **réessayer**, pas « deux erreurs ».
- `type='not_evaluated'` peut aussi signaler un suivi historique sans détail, une séance terminée mais sans micro/axe audité, ou un suivi contradictoire impossible à interpréter. **Afficher le titre, la preuve et la réserve exacts**, ne pas déduire une seule signification du type.
- Quand le journal complet contredit le nombre de réponses autonomes des compteurs, les conseils de cette notion sont volontairement écartés. Une information neutre et une limite signalent l'incohérence. Aucun état n'est corrigé silencieusement.
- Les sauvegardes anciennes et les journaux tronqués à 1000 événements fournissent des observations **partielles** ; aucune réussite manquante n'est reconstruite. Les preuves anciennes indiquent la dernière séance observée.

## 3. Recette CI à confier au responsable M5

**M4 ne peut pas modifier `.github/workflows/**`.** Le workflow historique `training-smoke.yml` n'exécute actuellement que les **13 tests V1** des recommandations après le retrait, déjà vérifié, de la sonde temporaire.

Commande exacte à ajouter à la recette appropriée de M5 depuis la racine du dépôt, sous Node 22 :

```bash
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js
```

En cas de défaut, ne fusionner aucune PR. Enregistrer le SHA testé, le nombre de tests `pass/fail` et les logs ; revalider l'absence de mutation.

**À cette passe, 80 scénarios de test ciblés sont présents :**
- 13 scénarios V1 existants ;
- 67 scénarios `wave2-recos-*`, dont **4** imposent Node `fs` / `crypto` pour contrôler les empreintes.
- Les **76 autres** ont effectivement été exécutés avec succès sur les sources exactes dans l'isolat JavaScript V8 : **76/76 pass, 0 fail**, y compris 5 profils 65/153 et les séances complètes de 10 réponses.
- La plus récente recette CI ciblée intégrale attestée sous Node22 est celle de P12 : **61/61 pass** ; P13 a **13/13 historiques** et le workflow complet SUCCESS.
- Le dernier CI de P18 a été aperçu **en file** à la création du présent rapport : ne pas présumer son succès ni celui des 80 tests (que la CI standard ne lance pas).

## 4. Intégrité et décision

Comparaison explicite base→commit P18 `647f99bce0fb876e9b8871e25d8d7a8c8530dac4` : **33 chemins modifiés, aucun hors du périmètre**. `quizz-parcours.js` Git blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc` ; `quizz.html` Git blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`, **tous deux identiques à la base**. Aucune modification des 1523 QCM, 22 rubriques, 36 propositions ou schémas de sauvegarde.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.** Pré-requis restants : exécution Node22 des 80 tests avec un CI durable/raccordement par M5 ; lecture des résultats, correction de tout échec ; validation fonctionnelle de l'intégration par le coordinateur.

**PROCHAINE PASSE :** contrôle final du diff et état de la PR, puis surveillance / récupération des éventuels résultats CI une fois disponibles. **PR #262 DRAFT / HOLD — ne pas fusionner, ne pas publier.**

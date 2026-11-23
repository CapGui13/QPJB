# LONG M4 — Passe 29 : dossier de validation et contrat définitif de raccordement

**PASSE 29 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON (raccordement UI/CI réservé à la coordination).**

## État du code indépendant

Référence à la fin de P28 : `c89f16f679259afa2d6df00708a078285d5b29f2`. M4 a procédé par 28 passes de corrections/mesures puis cette passe de transfert, exclusivement dans `parcours-recommandations.js`, `tests/wave2-recos-*` et `audits/wave2/recommandations/**`.

**Tests JS réellement exécutés sur P28 : 102/102, 0 échec** (65/65 + 37/37 dans l'isolat JavaScript V8, vrai moteur et vrai module récupérés de GitHub ; les tests d'intégrité Node nécessitant `fs`/`crypto` ne sont pas exécutés dans cet isolat). Les contre-épreuves comprennent la matrice P24 de 125 trajectoires, la matrice P28 de **625 trajectoires** (108 formulations corrigées) et les profils longs 65 et 153 séances. Aucun seuil de maîtrise ni donnée de donne n'a été inventé.

**Cible actuelle : 107 scénarios** = 102 tests JavaScript et cinq tests natifs d'intégrité. Dernière validation native complète réellement attestée : P24 **96/96 sous Node22**, run `44957206209`, job `137007844871` ; P25 module nettoyé : **13/13 historiques** et quatre jobs SUCCESS, run `44957424758`. Les modifications ultérieures P27/P28 ne sont pas encore vérifiées par une invocation Node22 explicite des 107 tests. Le run de workflow standard P28 `44997682290` était en file au dernier relevé.

### API, séparation et preuves

Point d'entrée inchangé : `QPJBParcoursRecommandations.buildReport(rawState,{parcours,exercises,maxRecommendations})`. Le module ne lance aucun exercice, n'écrit aucune sauvegarde et n'interagit avec ni DOM, ni stockage, ni réseau.

Un rapport de statut `unavailable` est une forme minimale ; l'intégration doit tester `status` avant de lire `observations`, `currentSession`, `revision` et `recommendations`. Lorsque le catalogue des exercices n'est pas fourni, **ne jamais annoncer de disponibilité de révision**. Reprendre une séance active avant toute autre séance.

Un conseil conserve `id`, `type`, `priority`, `title`, `message`, `evidence` et `explanation:{observed,caveat,action}`. Le composant élève doit présenter **le titre, l'explication et ses réserves** ; il ne doit pas traduire le seul `type` en diagnostic de maîtrise ou d'échec. Les textes nuancés conservent volontairement le type historique, afin de ne pas rompre le contrat V1.

Principaux marqueurs de preuve **additifs et conditionnels** :

- `sameAnswersAs`: micro/axe décrivant exactement les mêmes tentatives, pas deux preuves indépendantes ;
- `skippedOnly`: toutes les tentatives détaillées ont été sautées, donc aucune erreur finale prouvée ;
- `assistedOnly`: toutes les réponses finales sont correctes avec aide ou première erreur libre, sans réussite autonome ;
- `helpedAndSkipped` avec `helpedCount/skippedCount`: mélange de réponses aidées et de sauts, aucune réponse finale fausse ;
- `noFinalWrong` avec `autonomousCount/helpedCount/skippedCount`: au moins une réussite autonome, aucune réponse finale fausse, mais score V1 encore fragile ;
- `journalConsistency`: compteurs agrégés incompatibles avec un journal complet ; suspendre les recommandations de notion concernées sans corriger silencieusement l'historique.

**Ne jamais inférer ces marqueurs à partir d'un journal partiel**. Le module mentionne les séances anciennes sans détail, refuse les recouvrements de classement infondés, détecte les versions contradictoires d'une même réponse et conserve les résultats de consolidation **strictement distincts** du parcours normal.

### Corrigé de la passe 27 — consolidations multiples

V1 n'incrémente pas `completed` lorsqu'une consolidation est terminée ; deux consolidations au même `(session,id)` sont distinctes si elles ont des horodatages `recordedAt` différents. M4 inclut `recordedAt` dans la clé de dédoublonnage des consolidations, sans modifier la clé du parcours normal. Une copie exacte reste dédoublonnée ; **sans horodatage exploitable, le rapport reste conservateur** et ne crée pas de réponse fictive.

### Raccordement CI — dépendance externe

Le responsable du workflow / coordinateur doit intégrer dans la CI Node22 depuis la racine de l'arbre M4 (ou un arbre de synthèse de la vague 2) la commande :

```bash
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js
```

Au minimum, relever le SHA complet, les `# tests`, `# pass`, `# fail`, les rapports `M4-P17`, `M4-P24`, `M4-P28`, et les cinq tests d'intégrité. **Ne pas réintroduire le chargeur de CI éphémère dans le module livré**. Les précédents chargeurs de recette ont été retirés ; la protection est testée dans `wave2-recos-integrity.test.js`.

### Intégration à main et limites

Au début de la passe 29, `main` était au SHA `67223f0c7ac3123592860a66152a586ca3a473d0` : **six commits supplémentaires** depuis la base figée M4. La PR était toujours ouverte, en brouillon, non fusionnée et considérée fusionnable par GitHub, mais **aucune fusion n'est autorisée**. Les blobs `quizz-parcours.js` et `quizz.html` étaient identiques sur `main` et la branche M4 (respectivement `d0f06f1c259f7a766f2d1c8c47289374a74138dc` et `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`).

Le propriétaire M5 a indiqué sa mission technique clôturée à P10 ; **il ne faut pas supposer qu'il intégrera les tests M4 automatiquement**. La coordination de la vague 2 doit faire l'ajout et vérifier les résultats sur une branche d'intégration autorisée, sans toucher au périmètre M4 ni forcer une fusion.

## Décision

Le module est **prêt pour une revue d'intégration**, après 102/102 vérifications JavaScript sur le HEAD et la preuve native antérieure P24 96/96. La mission ne peut pas être déclarée définitivement terminée tant que la recette Node22 complète **107/107 sur le code final** et le raccordement à l'interface ne sont pas validés par les responsables de leurs fichiers.

**PROCHAINE PASSE :** contrôle de la CI standard P28, tests Node22 exhaustifs sur l'arbre de synthèse, éventuelles corrections ciblées puis transmission au coordinateur. **PR #262 DRAFT / HOLD : aucun merge ni GitHub Pages.**
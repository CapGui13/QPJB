# QPJB M1 — Passe 5 : contre-lecture de huit cas réels hors des 36 propositions
**PASSE 5 FINIE (audit ciblé), MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Méthode
Lecture des enregistrements réels du catalogue figé (JSON embarqué dans `quizz.html`), sans inventer de donne ni de réponse. Vérification de l'ID, main (ordre des quatre couleurs conservé tel que stocké), séquence, réponse actuelle, motif et difficulté. Les 36 propositions déjà documentées sont exclues. Les huit cas ci-dessous sont un échantillon de contre-lecture, **pas huit corrections validées**. Les choix de réponse et explications complètes ne sont pas présents dans l'extraction ciblée ; aucune nouvelle rédaction complète ne peut donc être honnêtement certifiée sur cette seule preuve.

| ID | Séquence actuelle | Bonne réponse actuelle | Observation factuelle | Verdict provisoire |
|---|---|---|---|---|
| `SEF-001-1` | Aucune (donneur) | 1SA | Main régulière, ouverture de SA ; niveau 1 | Pas d'anomalie démontrée |
| `SEF-V410-022` | Partenaire 1♥ | 1♠ | Quatre Piques ; motif explicite de réponse au palier de 1 | Pas d'anomalie démontrée |
| `SEF-N051-2` | Partenaire 1♥ | 2SA | Trois Cœurs, motif 2SA fitté ; vérifier convention exacte de force | À discuter avant réécriture |
| `SEF-N056-1` | Partenaire 1♠ | 2SA | Trois Piques, motif 2SA fitté ; vérifier accord de force | À discuter avant réécriture |
| `SEF-N067-1` | Partenaire 1♥ | 2♦ | Six Carreaux et motif de réponse forcing ; vérifier alternatives de soutien | À discuter avant réécriture |
| `SEF-042-2` | Vous 1♣, partenaire 1♥ | 1♠ | Redemande économique ; motif cohérent avec l'objectif | Pas d'anomalie démontrée |
| `SEF-L10-030` | 1♣–Passe–1♠–Passe–1SA–Passe | 2♣ | Roudi avec six Piques et 11 HL déjà corrigé dans la vague antérieure | Ne pas rouvrir |
| `SEF-V4-076-3` | 1♣–1♥–1SA–2♣ Roudi | 2♦ | Deux Cœurs et réponse sans fit à Roudi ; motif cohérent | Pas d'anomalie démontrée |

## Réserves nécessaires
- **Aucune proposition de modification prête à intégrer.** Le niveau de preuve requis par l'issue (choix complets, corrigé complet, alternatives recevables et référence SEF) n'est pas atteint pour les trois cas « à discuter ».
- La P5 ne satisfait donc **pas encore** le critère de paquet de corrections proposées ; le refus d'inventer des corrections est intentionnel.
- Les 36 propositions historiques ne sont ni appliquées ni requalifiées.
- Un test statique `tests/wave2-pedagogie-parcours.cjs` a été committé ; il contrôle les invariants du catalogue et des parcours. **Exécution Node non vérifiée** depuis cet environnement ; son résultat CI ne doit pas être présumé.

**PROCHAINE PASSE : P6** — classement contradictoire et contrat d'intégration, avec mention explicite des travaux incomplets.

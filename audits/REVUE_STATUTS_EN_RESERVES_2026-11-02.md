# QPJB Entraînement — état nominatif des anciennes réserves EN (2 novembre 2026)

**Nature de cette intervention : audit de statut, sans modification pédagogique.** Source actuelle : `entrainement/training-data-bidding.js` sur `main`, recoupée avec les rapports historiques du dépôt privé `CapGui13/QPJBTraining` (`RAPPORT_AUDIT_PASSE01.md`, `PASSE02.md`, `PASSE03.md`). Les rapports sont des constats antérieurs : leur simple mention ne démontre pas qu'une anomalie persiste pédagogiquement.

## Résultat technique reproductible

- 563 exercices EN stockés dans la banque active.
- 3 ont aujourd'hui `reviewStatus: a_verifier`, donc sont exclus de la navigation et de la correction automatique : `EN-BH-075-04`, `EN-BH-090-06`, `EN-BH-102-01`.
- 38 portent la trace `historicalReviewStatus: a_verifier`, dont **35 actuellement accessibles** avec un autre statut. Ce marqueur historique **ne signifie pas nécessairement** que les 35 doivent être remis en quarantaine : une correction ou un arbitrage ultérieur a pu intervenir.
- Parmi les 35, **13 portent encore un `quarantineReason` explicite** alors qu'ils sont accessibles, sans preuve de levée de réserve dans les métadonnées de la fiche. Cette discordance de traçabilité nécessite un contrôle individuel ; ne pas l'assimiler sans preuve à 13 réponses fausses.
- Le champ `quarantineReason` n'est **pas** utilisé comme garde d'accès par la logique active ; le filtrage repose sur `reviewStatus`. Les trois décisions explicites `pedagogicalReview_v610.decision: quarantaine` sont, elles, correctement appliquées.

## Liste nominative des 38 fiches à rapprocher

| ID | Statut actif | Motif de réserve encore présent |
|---|---|---|
| `EN-1m-003` | `transcrit_source` | Réserve documentaire |
| `EN-1m-009` | `transcrit_source` | Non |
| `EN-1m-011` | `transcrit_source` | Non |
| `EN-1m-020` | `transcrit_source` | Non |
| `EN-1m-028` | `transcrit_source` | Non |
| `EN-1sa-007` | `transcrit_source` | Réserve documentaire |
| `EN-1sa-008` | `transcrit_source` | Oui |
| `EN-1sa-011` | `transcrit_source` | Oui |
| `EN-2sa-005` | `transcrit_source` | Oui |
| `EN-2sa-006` | `transcrit_source` | Oui |
| `EN-redemande-014` | `transcrit_source` | Réserve documentaire |
| `EN-redemande-035` | `transcrit_source` | Réserve documentaire |
| `EN-suite-repondant-003` | `transcrit_source` | Oui |
| `EN-barrage-003` | `transcrit_source` | Réserve documentaire |
| `EN-bicolore-003` | `transcrit_source` | Réserve documentaire |
| `EN-BH-013-06` | `transcrit_source` | Réserve documentaire |
| `EN-BH-063-03` | `transcrit_source` | Réserve documentaire |
| `EN-BH-048-03` | `transcrit_source` | Oui |
| `EN-BH-075-04` | `a_verifier` | Réserve documentaire |
| `EN-BH-049-04` | `transcrit_source` | Non |
| `EN-BH-055-06` | `transcrit_source` | Non |
| `EN-BH-077-04` | `transcrit_source` | Oui |
| `EN-BH-078-05` | `transcrit_source` | Oui |
| `EN-BH-087-04` | `transcrit_source` | Réserve documentaire |
| `EN-BH-090-03` | `transcrit_source` | Réserve documentaire |
| `EN-BH-090-06` | `a_verifier` | Réserve documentaire |
| `EN-BH-092-05` | `transcrit_source` | Oui |
| `EN-BH-102-01` | `a_verifier` | Réserve documentaire |
| `EN-BH-113-03` | `transcrit_source` | Non |
| `EN-BH-113-06` | `transcrit_source` | Non |
| `EN-BH-115-02` | `transcrit_source` | Non |
| `EN-BH-115-05` | `transcrit_source` | Oui |
| `EN-BH-115-06` | `transcrit_source` | Oui |
| `EN-BH-117-05` | `transcrit_source` | Non |
| `EN-BH-068-03` | `transcrit_source` | Réserve documentaire |
| `EN-BH-019-04` | `transcrit_source` | Oui |
| `EN-BH-025-01` | `transcrit_source` | Oui |
| `EN-BH-138-RECO` | `transcrit_source` | Non |

## Treize fiches accessibles avec une réserve explicite

- `EN-1sa-008` : B18-2, p.1 : priorité du Stayman avec 5♠ et 4♥. Le Texas Pique fait partie des choix concurrents et peut appartenir à un autre traitement ; même problème conventionnel que EN-BH-115-02 déjà réservé. Expliciter la méthode avant notation.
- `EN-1sa-011` : B18-5, p.1 : 3♠ après Stayman négatif décrit naturellement cinq Piques dans ce document. Avec des développements en chassé-croisé/Smolen, ce sens change ; la convention naturelle doit être annoncée avant notation.
- `EN-2sa-005` : B19 p.1 Q5 : 3♥ après Stayman négatif montre naturellement cinq Cœurs. Ce sens dépend des développements naturels versus chassé-croisé ; convention non annoncée avant la réponse.
- `EN-2sa-006` : Alerte Passe03 : avec 16H face à 2SA (20–21H), le corrigé propose 4SA quantitatif, tandis que B19-Q4 utilise 5SA avec également 16H. Cohérence de la démarche de chelem à arbitrer ; aucune réponse n’est modifiée.
- `EN-suite-repondant-003` : Après 1♣–1♠–4♠, le petit chelem direct peut être envisagé, mais l’énoncé ne teste pas la recherche des contrôles et les propositions n’incluent aucune enchère exploratoire. Unicité pédagogique de 6♠ non démontrée.
- `EN-BH-048-03` : BH048 p.1 Q3 impose le Stayman avec5♠4♥ ; Texas Pique proposé comme distracteur. Même divergence de méthodes que EN-1sa-008 et BH115-02 : expliciter le cadre avant notation.
- `EN-BH-077-04` : Chelem direct à 6♥ après 1♣–1♥–2SA : recherche des contrôles et du fit exact insuffisamment cadrée ; aucune alternative exploratoire proposée.
- `EN-BH-078-05` : Le prolongement de 3♠ à 4♠ est justifié par une appréciation des levées et du rapport de forces adverse ; vulnérabilité et situation tactique absentes. Nécessite une formulation plus complète.
- `EN-BH-092-05` : Séquence de Stayman 1SA–2♣–2♦–3♣ : sens forcing ou naturel dépendant des méthodes, sans accord explicité. Ne pas noter automatiquement.
- `EN-BH-115-05` : Après 2SA, avec 5♥ et 4♠, le corrigé privilégie Stayman ; la place du Texas Cœur et des développements après transfert dépend des conventions. Réponse unique à valider avant notation.
- `EN-BH-115-06` : Après 1SA–2♣–2♦–3♥, la signification de 3♥ varie selon la pratique du Smolen/Stayman ; la main de l’ouvreur et la réponse 4♥ nécessitent une convention déclarée.
- `EN-BH-019-04` : Deux séquences de Texas peuvent se défendre avec un bicolore majeur 5–5 ; vérifier la convention QPJB avant notation unique.
- `EN-BH-025-01` : Sur ouverture 2SA avec six Cœurs, la réponse directe de 4♥ concurrence les séquences de transfert Texas (selon accords) ; le QCM n’expose pas la convention retenue.

### Risques pédagogiques à traiter en premier

1. **`EN-2sa-006` (B19-Q6)** : 16 H face à 2SA 20–21 H, corrigé source proposant 4SA quantitatif, tandis que B19-Q4 affiche 5SA avec également 16 H. Le rapport Passe03 précise une contradiction nécessitant un arbitrage et relève une ancienne erreur de comptage (12 H) dans un audit. La fiche reste accessible avec 4SA comme seule bonne réponse. **Vérifier l'original et le sens de 4SA/5SA avant tout changement de réponse ou de statut.**
2. **`EN-1sa-011`, `EN-2sa-005`, `EN-BH-115-06`** : suites de Stayman négatif pouvant dépendre d'un traitement naturel ou Smolen. Ne pas éliminer un distracteur admissible sans annoncer le cadre.
3. **`EN-1sa-008`, `EN-BH-048-03`, `EN-BH-115-05`** : priorité Stayman/Texas pour les bicolores majeurs à cinq/quatre cartes ; clarifier les accords avant réponse.
4. **`EN-BH-092-05`, `EN-BH-019-04`, `EN-BH-025-01`** : sens d'une nouvelle enchère après Stayman, Texas sur 5–5 et enchère naturelle à 4♥ sur 2SA : examiner l'unicité selon la méthode du cours.
5. **`EN-suite-repondant-003`, `EN-BH-077-04`, `EN-BH-078-05`** : chelems sans exploration des contrôles ou contexte compétitif incomplet ; vérifier justification et alternatives avant notation.

## Points de suivi connexes

- `EN-BH-049-04` a un ancien statut de réserve mais est actif ; le rapport Passe02 indiquait « Non Vul. » dans l'original alors que le texte actif ne donne pas la vulnérabilité. Il faut vérifier la version source et corriger seulement l'omission documentaire avérée.
- `EN-BH-055-06` est actif et indique désormais explicitement la vulnérabilité favorable : **ne pas le remettre dans la file comme omission inchangée**.
- Les deux erreurs de distracteurs B10 `EN-1m-009` et `EN-1m-011` ont déjà été corrigées dans le module actif ; ne pas les compter comme anomalies encore ouvertes.
- La mention historique « 42 réserves » du rapport Passe01 et les 38 métadonnées `historicalReviewStatus` sont deux décomptes issus de versions différentes : aucune bijection n'a été démontrée.
- La mention « 11 anomalies certaines » d'un autre audit EN sans IDs ne peut pas être rapprochée automatiquement des 11 fiches annotées V6.10 ; voir `RECONCILIATION_EN_11_V610_2026-11-02.md`.

## Décision de cette passe

**Aucune bonne réponse, main, statut d'accès, PDF, progression, code ou compteur n'a été modifié.** Il serait risqué de masquer les 35 fiches historiquement réservées par automatisme, autant que de certifier leurs réponses sans relecture. Prochain lot : examiner d'abord `EN-2sa-006` et les 12 autres `quarantineReason` au regard du PDF exact et du SEF QPJB, puis décider individuellement **maintenir / réécrire avec convention annoncée / masquer temporairement**. Actualiser simultanément les banques maître et module, tests, catégories, PWA, feuille de route et progression ciblée seulement après décision.

# QPJB V2 — Phase BB : revue motivée des quatre alertes P1

**19 novembre 2026 — PR #214, branche expérimentale uniquement.**

## Périmètre et verdict

Revue des **quatre** entrées classées P1 dans le manifeste AL, à partir des QCM exacts présents dans `quizz.html`, des sorties de `scripts/parcours-v2-audit-sensibles-ak.cjs` et de deux supports pédagogiques consultés. Cela **ne vaut ni approbation éditoriale, ni certification SEF officielle**. Aucun QCM ni corrigé n'est modifié par ce rapport.

| ID | Main et réponse du QCM original | Conclusion documentaire | Travail qui reste |
| --- | --- | --- | --- |
| `SEF-V416-008` | **10 H**, ♥AV83 ; après `1SA–2♣–2SA`, réponse **4♥** ; choix `3SA / 4♥ / 4SA / 3♥` | Fit Cœur 4–4 et manche cohérents ; mais le double transfert **4♣→4♥**, non proposé parmi les choix, relève du SEF selon la source consultée. L'énoncé affirmant « dans le SEF » simplifie les accords. | Présenter explicitement la simplification ou proposer une version SEF harmonisée dans un chantier séparé. |
| `SEF-V416-009` | **10 H**, ♠AD83 ; après `1SA–2♣–2SA`, réponse **4♠** ; choix `3SA / 4♥ / 4♠ / 3♠` | Même situation : manche ♠ cohérente, mais le double transfert **4♦→4♠** n'est pas proposé. | Même harmonisation que pour V416-008. |
| `SEF-L18-007` | **11 H**, ♥AR108 ; après `1SA–2♣–2SA`, réponse **4♣** ; question demande expressément de faire jouer l'ouvreur | **Corroboré dans l'accord du double transfert** : 4♣ demande 4♥. | Conserver la réponse proposée ; faire confirmer l'accord éditorial commun aux trois exercices. |
| `SEF-L25-004` | **16 H**, ♥R8, ♦AD84 ; après Texas 2♦ contré, réponse **Passe** | **Corroboré dans l'accord documenté** : sans fit Cœur, Passe est décrit avec ou sans arrêt Carreau par la correction Avaricum du 21 janvier 2021. La source eBridge était plus restrictive dans son résumé. | Conserver la réponse proposée ; faire confirmer que l'accord est bien celui retenu dans QPJB. |

## Pourquoi ce n'est pas une contradiction irréconciliable sur le Stayman

La synthèse Scenari explique que les réponses directes à 4♥/4♠ sont enseignées dans une méthode simplifiée, **puis** recommande les transferts 4♣/4♦ pour faire jouer le déclarant du bon côté. L18-007 enseigne déjà la technique avancée. Dans les QCM V416, l'option de transfert n'existe pas : il serait donc abusif de changer uniquement la réponse sans redessiner les choix. Il faut **préciser le cadre pédagogique du parcours**, pas fusionner aveuglément les deux traitements.

Source : https://abc-du-bridge.scenari-community.org/002-10/co/002-10-Synthese.html (rubrique « Double transfert sur la réponse de 2SA au Stayman »).

## Preuve ciblée pour le Texas contré

La correction du 21 janvier 2021 présente un exemple après `1SA–2♦–Contre` avec **deux Cœurs**, un arrêt Carreau, et la réponse **Passe**. Son explication inclut expressément l'hypothèse avec ou sans arrêt ; cela couvre le point précis laissé ouvert par la fiche eBridge. La main originale de L25-004 a deux Cœurs et ♦AD84. Ne pas confondre **absence de fit** et **absence d'arrêt**.

Sources :
- https://avaricumbridgebourges.fr/wp-content/uploads/2021/01/114-22.01.2021-Correction-du-21.01.2021.pdf
- https://dev.ibridge-club.fr/public/fichedetails/622

## Suite produit sans cycles de contrôles

1. Garder les **1 523 QCM originaux** intacts. Les 4 fiches P1 disposent maintenant d'une justification individualisée ; le P1 désigne une **priorité de décision**, pas la preuve d'une erreur.
2. Privilégier dans le parcours guidé le **double transfert SEF** si cet accord est confirmé ; réviser la formulation des deux V416 dans un chantier éditorial distinct pour conserver l'intégrité des exercices d'origine.
3. Examiner ensuite les **15 P2** par groupes, uniquement là où un accord est réellement ambigu, et vérifier séparément les **8 exercices complémentaires** avant de les rendre pédagogiquement actifs.
4. Laisser toutes les cases `editorialApproval` à `PENDING`, `teacherApproval=false`, `releaseDecision=HOLD`. **Pas de fusion, aucune publication.**

**Bilan BB : 2 réponses documentées dans l'accord proposé, 2 QCM directs à harmoniser, 0 source modifiée, 0 approbation présumée.**

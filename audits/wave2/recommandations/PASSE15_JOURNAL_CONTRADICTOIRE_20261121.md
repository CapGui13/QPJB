# LONG M4 — Passe 15 : journal contradictoire et preuve de recouvrement

**PASSE 15 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Contre-exemple réellement reproduit avant correction

Avec le vrai moteur V1, deux erreurs successives sur le QCM historique `SEF-026-3` renseignent un micro `majeur:1♠` et l'axe `fit` (score -2, 2 essais, 0 autonome). Ajouter au journal un doublon de la première séance qui attribue au même `session+id` l'axe `force`, et un compteur d'axe `force` équivalent. Le module précédent affichait le micro regroupé avec `fit` sans signaler que le **même événement de journal présentait deux classifications contradictoires**.

Le regroupement était abusivement certain. Le module `observations` comptait correctement 2 réponses (pas 3) ; la défaillance concernait spécifiquement la justification des cartes.

## Correction vérifiable

Le regroupement lit les doublons du journal en comparant pour un même `session+id` le résultat, le choix, les drapeaux `assisted` et `hadFreeError`, le micro et l'axe. Dès qu'une version diffère, cette réponse est exclue **uniquement du rapprochement des preuves** et une limite explicite signale le nombre de réponses ambiguës. L'observation V1 sous-jacente, la sauvegarde et les scores ne sont jamais modifiés. Les doublons identiques restent dédoublonnés normalement, et une ancienne sauvegarde sans journal ne peut toujours pas prouver le recouvrement.

Trois contre-tests nouveaux : conflit d'axe, doublon strictement identique, conflit de résultat. Leur logique utilise `QPJBParcours.record/finish` réels et n'invente aucune nouvelle donne du catalogue.

Recette : `node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js`.
Les **69 scénarios** existants et nouveaux (66 + 3) ne sont pas automatiquement exécutés par le workflow M4, réservé à M5 ; seule la réussite des tests effectivement lancés peut être affirmée.

**PROCHAINE PASSE :** évaluer le coût de la double inspection du journal sur des suivis longs, protéger les limites de consultation et vérifier les résultats du prochain workflow. PR DRAFT/HOLD : aucun merge/Pages.

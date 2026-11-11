# Entraînement QPJB — BH-088 Q5 : divergences sujet/corrigé (11 novembre 2026)

## Preuves primaires

- *Votre Bridge Hebdo débutant* n°88, 3 novembre 2023, sujet et corrigé originaux, page 1, contrôlés visuellement avec texte recoupé.
- Sujet : `88 Exercice Votre Bridge Hebdo débutant 03-11-2023.pdf`, SHA-256 `4a45e5f17461818541b961ece609c186a64ec5924c84895ff2413dee30e1ddfc`.
- Corrigé : `88 Solution Votre Bridge Hebdo débutant 03-11-2023.pdf`, SHA-256 `674d6058759e9cf6e4e896b789b59e70331128bc1af291e111a13e23dbe17380`.
- Archive Bibliothèque : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.

## Contradictions précises

1. L'exercice **n°5** du sujet donne l'ouverture **1♣ par Est**. Le corrigé donne **1♥ par Est**, avec les mêmes cartes et le même choix **1♠**.
2. L'explication du corrigé écrit **« Ouest n'a que 7 points H »**. Le jeu à traiter est celui de **Sud** selon l'intitulé commun des six exercices.
3. Aucune vulnérabilité n'est précisée dans le fascicule : ne pas inventer une vulnérabilité favorable. Avec 7 H, la faculté d'intervenir à 1♠ ou de passer relève du style de la paire et du contexte.

## Décision éditoriale

- Conserver la **séquence du sujet (1♣ par Est)**, comme déjà dans le QCM.
- Conserver **1♠** comme l'intervention privilégiée par le fascicule avec ♠RV1085, ♥7, ♦DV1063, ♣94 (7 H, bicolore 5–5).
- Afficher **avant les quatre propositions** que le sujet donne 1♣ et le corrigé 1♥, et que la vulnérabilité n'est pas indiquée.
- Corriger « Ouest » en « Sud » dans l'explication, sans prétendre que le fascicule original a été modifié.
- Reconnaître explicitement que **Passe peut être raisonnable** selon les conditions, sans changer la clé documentaire ni supprimer le choix parmi les distracteurs. Le QCM vise le choix préféré **dans l'approche offensive du fascicule**, pas une impossibilité générale de passer.
- Modifier uniquement `question`, `sourceContext`, `explanation`, `pretryHints.Passe`, `distractorNotes.Passe`, ainsi que l'étiquette de révision éditoriale. Les textes des deux notes Passe sont alignés.

## Invariants, méthode et contrôles

- **Un seul exercice** modifié (`EN-BH-088-05`). Les 637 autres enchères et 188 jeux de la carte demeurent inchangés ; total 826.
- `id`, `hand`, `auction`, `choices`, `correct`, `sourceRef`, les statuts historiques, la progression de l'élève et les autres indices sont intacts.
- Les modules maître et enchères sont synchronisés ; nouvelles assertions dans `tests/training-smoke.cjs` ; tests complets d'intégrité, Chromium, WebKit, PWA avant fusion.
- Relecture source **informée**, sans conclusion d'unicité universelle : un véritable arbitrage de deux décisions recevables nécessiterait une question explicitement conditionnée ou une auto-évaluation non notée.

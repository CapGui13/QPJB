# LONG M4 — Passe 18 : questions sautées ≠ erreurs constatées

**PASSE 18 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Erreur d'interprétation vérifiée dans le vrai moteur V1

Deux séances consécutives où le QCM historique `SEF-026-3` est `skipped` créent, conformément au moteur, `score=-2, attempts=2, independent=0` à la fois pour `majeur:1♠` et `fit`. La version antérieure de M4 affichait « **Difficulté persistante** », alors que le journal contient exactement **2 réponses sautées et 0 réponse erronée**. Le score agrégé V1 reste légitime selon sa règle de notation, mais ce libellé déduisait une difficulté de réponses qui n'ont jamais été données.

## Correction minimale et prudente

Lorsqu'un micro/axe à conseiller est couvert **en totalité** par le journal dédoublonné, non contradictoire, et que toutes ses tentatives sont `skipped`, le module réutilise la famille `not_evaluated` avec un libellé **« Notion à réessayer après des questions sautées »**, une preuve `skippedOnly: true`, et une explication indiquant explicitement qu'un saut n'est ni une erreur constatée ni une réussite autonome. Les deux classifications portant sur les mêmes réponses peuvent toujours être réunies sans fabriquer une compétence nouvelle.

Les situations avec erreur effectivement observée et les anciennes sauvegardes sans journal conservent le classement du suivi V1 : aucune reconstruction des résultats historiques, aucune modification de score. Le regroupement et les réserves sur incohérence restent actifs.

## Régression ciblée

Quatre tests ajoutés dans `tests/wave2-recos-skipped.test.js` : deux sauts seuls, deux erreurs, un saut + une erreur, ancienne sauvegarde sans journal. Ils utilisent `record/finish` réels et vérifient l'immutabilité.

La suite contient désormais **80 scénarios ciblés** (76 précédents + 4). Les nouveaux scénarios ne sont pas encore attestés sous Node22, le raccordement des tests étant réservé à la mission CI M5.

**PROCHAINE PASSE :** vérifier les combinaisons aides/erreurs libres, l’explicabilité des conseils et les actions du contrat d'intégration ; contrôler le diff et le statut HOLD. Aucune fusion ni publication.

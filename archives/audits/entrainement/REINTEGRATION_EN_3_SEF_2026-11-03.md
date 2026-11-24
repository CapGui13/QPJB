# QPJB — contre-expertise et adaptation des trois quarantaines EN
3 novembre 2026 — branche `fix/en-sef-trois-quarantaines-20261103`.

## Portée et méthode
Les trois fiches sont réécrites en tant qu'**adaptations pédagogiques SEF** et non modifications des PDF. Les identifiants, 13 cartes, séquences, sources et anciennes traces de progression restent conservés. Les réponses/corrigés/choix précédents ont été archivés dans `sourceOriginalCorrect`, `sourceOriginalExplanation`, `sourceOriginalChoices`. L'historique de quarantaine demeure dans `quarantineHistoryBeforeArbitration` et `pedagogicalReviewBeforeAdaptation20261103`. Le nouveau statut `transcrit_source` signifie auto-évaluation **sans notation automatique**.

## Les trois décisions
- **EN-suite-repondant-003 (BM020-Q6)** : après `1♣–1♠–4♠`, la réponse de source `6♠` est remplacée par **5♥ contrôle** (l'As de Cœur). Les 33 HLD ne suffisent pas à imposer le chelem : les contrôles annexes, notamment Trèfle avec ♣82, ne sont pas établis. Nouvelle question explicitement centrée sur la démarche de contrôle. Choix `Passe / 5♥ / 5♠ / 6♠`. Référence pour la recherche de chelem par les contrôles après un soutien : https://www.ibridge.fr/public/fichedetails/396.
- **EN-BH-077-04 (BH077-Q4)** : après `1♣–1♥–2SA`, la réponse de source `6♥` est remplacée par **3♥**, répétition forcing de la majeure sixième après redemande forte, avec espoir de chelem. La redemande à 2SA (18–19 H) ne promet pas un fit Cœur. Choix `3♥ / 3SA / 4♥ / 6♥`. Références SEF : https://dev.ibridge-club.fr/public/fichedetails/174 et https://dev.ibridge-club.fr/public/fichedetails/448.
- **EN-BH-078-05 (BH078-Q5)** : `4♠` **conservé** comme prolongement de barrage avec dix atouts, dans l'hypothèse nouvelle explicite de vulnérabilité favorable (notre camp non vulnérable, adversaires vulnérables) et un objectif compétitif annoncé. **Passe** est ajouté aux choix : `Passe / 3SA / 4♦ / 4♠`. La loi des atouts est un repère, non une garantie. Référence : https://bridge-nancy.fr/files/fiches/2annee_8_les_barrages_essentiels_et_le_SEF_2018.pdf.

Chaque fiche reçoit trois indices cohérents avec les trois distracteurs, le niveau de cherté des choix est croissant et aucune mention d'accord de paire n'est introduite.

## Garde-fous de la branche
- Banque : 563 EN conservés, **563 accessibles après adaptations** ; 114 exercices de jeu de la carte conservés, dont 111 accessibles. Rubriques `suite-repondant` = 73 et `rep-barrage` = 12.
- Modules différés et bootstrap régénérés depuis la banque maître ; même contenu pédagogique. Chargement version `20261103c`, PWA cache `qpjb-v47`.
- Tests de non-régression adaptés : vérification des bonnes réponses, quatre choix distincts, archivage des anciennes réponses et explications, maintien du mode non noté, origine des quarantaines et vulnérabilité/passe du barrage.
- **Avant fusion :** CI intégrité, Chromium et WebKit, puis vérification Pages sur le commit final. Une vérification physique sur Safari iPhone reste distincte. Aucune sauvegarde utilisateur n'est effacée ni transformée.

Ce document décrit les modifications **sur branche de travail uniquement** tant que la PR n'est pas fusionnée.

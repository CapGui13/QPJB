# QPJB — Référentiel des enchères du Quizz

**Décision pédagogique : le SEF (Système d’Enseignement Français) est l’unique système de référence pour tous les exercices.**

Le Quizz est destiné à l’apprentissage, notamment aux débutants. Il ne demande jamais au joueur de choisir ou de déclarer ses « accords de paire ». Une question doit proposer une réponse attendue selon le SEF utilisé comme référence de l’application.

## Rédaction des énoncés

- Ne pas écrire « accord de paire », « selon les accords retenus », ni demander quel système joue l’élève.
- Décrire directement les faits nécessaires : séquence d’enchères, position, vulnérabilité lorsqu’elle influe sur le choix, atout agréé pour un Blackwood, indication d’un arrêt s’il ne peut pas se déduire de la main.
- Pour une convention étudiée, afficher un **rappel de sa règle** si sa compréhension est indispensable ; il ne s’agit pas d’un choix proposé à l’élève.
- Garder les explications de la bonne enchère, des alternatives tentantes et de la règle à retenir.
- Ne pas créer ni publier de question dont la bonne réponse dépendrait d’une variante conventionnelle non établie dans le cadre pédagogique SEF du Quizz. En cas de doute, **mettre la question à réexaminer**, sans la déclarer universellement conforme au SEF ni l'éliminer silencieusement.
- La progression doit rester conservée : préserver les identifiants existants et les réponses tant qu'une correction pédagogique n'a pas été vérifiée.

## Périmètre

L’accueil du Quizz annonce explicitement **« Le SEF est notre référence unique »**. Les rubriques d'approfondissement peuvent enseigner des conventions, mais jamais sous la forme d'un réglage de partenariat.

Les tests `tests/quizz-integrity.cjs` vérifient désormais que les formulations relatives aux accords de paire ne réapparaissent pas dans les exercices.

Ce document fixe une règle de conception. **Il ne constitue pas une certification individuelle des 993 réponses** : un audit pédagogique spécifique reste nécessaire pour les décisions litigieuses, notamment celles qui dépendent d'une variante de convention.

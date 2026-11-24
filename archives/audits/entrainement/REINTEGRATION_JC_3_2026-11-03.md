# QPJB — levée des trois quarantaines du jeu de la carte

**3 novembre 2026 — dossier préparé sur branche `fix/jeu-carte-3-quarantaines-20261103`.**

## Méthode
Relecture des trois exercices réellement stockés dans la banque canonique, de leurs mains partielles, choix, justifications, raisons de quarantaine et contexte. La transcription documentaire ancienne n'est pas silencieusement effacée. Les nouveaux exercices portent des **adaptations pédagogiques clairement signalées**, et non une modification des documents Bridge Hebdo originaux.

### JC-BH-014-Q01 — Communication et Roi de Carreau sec
- Données : Nord ♥R, ♦A743, ♣D ; Sud ♥A3, ♦R, ♣AR5.
- **Erreur ancienne confirmée** : si le mort joue ♦A, Sud doit fournir son ♦R sec. Après le trajet Cœur/Trèfle du plan publié, le Roi sec et l'As du mort ne peuvent pas être encaissés séparément avec les seules communications visibles. Le programme ne doit pas promettre toutes les levées.
- **Nouvelle question** : Sud en main, premier coup qui préserve le Roi de Carreau singleton. Réponse : encaisser ♦R depuis Sud (Nord joue un petit Carreau). Distracteurs : passer trop tôt au mort, tirer ♥A (fait tomber ♥R sec du mort), ou tirer ♣A (fait tomber ♣D sec du mort). **La conclusion n'affirme rien sur un plan global d'encaissement.**

### JC-BH-028-Q04 — Carte équivalente en troisième
- Données : entame ♥3 d'Ouest, le mort Nord possède ♥1072 et **fournit ♥2**, Est a ♥DV9.
- **Réserve historique partiellement obsolète** : l'énoncé actuel indiquait déjà ♥2 fourni par Nord. Il manquait surtout la preuve du sens de l'équivalence.
- Sud ne peut avoir le ♥10, puisqu'il est au mort. Sur le pli où Nord a fourni ♥2, toute carte de Sud capable de battre ♥9 (As ou Roi) bat aussi ♥D et ♥V ; toute carte de Sud inférieure laisse les trois gagner. **♥9, ♥V, ♥D sont donc fonctionnellement équivalents sur ce pli**, pas nécessairement dans toute la donne. Réponse maintenue ♥9, la plus petite équivalente ; justification explicitée. Si Nord fournissait ♥10, la conclusion serait différente.
- Source de méthode : [Bridge Training — la plus petite des cartes équivalentes en troisième](https://bridge-training.com/fr/decouverte/25-signalisation/).

### JC-BH-036-Q02 — Coup de sonde et impasse
- Données : Nord ♦ARV106, Sud ♦975, il manque la Dame.
- **Ambiguïté corrigée** : « Jouer immédiatement le 7 vers l'As » est le début possible du plan correct, donc ne peut être un distracteur puni.
- **Nouveau contexte** : une reprise extérieure en Sud est disponible. Réponse : tirer ♦A en sonde, revenir en Sud, puis jouer un petit Carreau vers le Valet pour faire l'impasse à la Dame.
- Trois choix concurrents : tirer As et Roi en tête ; faire l'impasse directement sans coup de sonde ; jouer le Valet depuis le mort. L'impasse directe reste crédible mais perd la chance complémentaire de capturer une Dame sèche.
- Source de méthode : [Bridge Club de Charbonnières — suites des impasses et coup de sonde](https://www.bridgeclubcharbonnieres.fr/Bridge_initiation/Bridge_initiation_jeu_de_la_carte_Suites_des_Impasses.php).

## Protection des originaux et des élèves
Chaque exercice conserve son **ID, les cartes visibles, les attributs de provenance et le document original**. Avant réécriture, le code archive `sourceOriginalPrompt`, `sourceOriginalOptions`, `sourceOriginalAnswerIndex`, `sourceOriginalExplanation`, `sourceOriginalPlayPretryHints` et `quarantineHistoryBeforeArbitration`. La fiche reste `transcrit_source`, c'est-à-dire **auto-évaluation sans notation automatique**, afin de ne pas attribuer rétroactivement une nouvelle note à d'anciennes réponses. Aucune remise à zéro ou migration de `localStorage`.

## Statut technique préparé
- 114 exercices de jeu de la carte dans la banque, **114 accessibles si la branche est validée** ; les 563 exercices d'enchères ne changent pas.
- Le module `training-data-play.js` est synchronisé avec la banque maître ; le bootstrap passe à 114 ; les ressources deviennent `20261103d` et le cache PWA `qpjb-v48`.
- Les tests ciblés vérifient archivage, choix et indices cohérents, spécification du ♥2 joué, reprise extérieure annoncée, suppression du distracteur ambigu, absence de nouvelles quarantaines. Le contrôle structurel passe de « 3 attendues » à **zéro attendue**.

## Garde-fou de livraison
Ce document n'est **pas une certification de publication**. Avant fusion : vérifier les 3 jobs GitHub (intégrité/code, Chromium, WebKit), puis contrôler le résultat réel du déploiement GitHub Pages sur le `main` fusionné. Un test Safari sur iPhone physique demeure à effectuer.

L'audit pédagogique **global** des 114 cartes et des 563 enchères n'est pas clos par ce sous-lot.

# Lot 02 — contrôle après publication, 6 novembre 2026

## Périmètre

Contrôle des **15 nouveaux QCM d'enchères** et des **17 nouveaux plans libres / maniements** publiés par la PR #101. Les deux anomalies ci-dessous concernent uniquement `entrainement/`, et **pas** le Quiz SEF.

## Problème 1 — `JC-BH-129-01`

Dans le **sujet PDF d'origine** `129. Exercice Votre Bridge Hebdo Débutant 16 08 2024.pdf`, p. 2, le défenseur à qui la question est posée est **Ouest**, avec notamment ♠ A R 10 5 4. Le texte de l'exercice publié disait déjà « Vous êtes Ouest », mais son diagramme affichait « Vous · Est ». Le correctif remplace uniquement le libellé erroné par **« Vous · Ouest »**, afin de redonner la bonne orientation visuelle et les bonnes informations au joueur.

## Problème 2 — `JC-BH-135-J01`

Les **deux PDF originaux** `135. Exercice Votre Bridge Hebdo Débutant 27 09 2024.pdf` et `135. Solution Votre Bridge Hebdo Débutant 27 09 2024.pdf`, p. 2, montrent :
- Nord : ♣ 9 8 6 4 2 ;
- Sud : ♣ A 10 6 3.

Le **6 de Trèfle** ne peut pas appartenir aux deux joueurs. Le 7 de Trèfle est absent de l'ensemble du corrigé, mais **le document ne permet pas de choisir quelle main détient la carte réellement imprimée en double**. Il serait donc injustifié de remplacer silencieusement l'un des deux ♣6 par ♣7.

Le correctif retire les deux indications contestées du **diagramme élève** : Nord ♣ 9 8 4 2, Sud ♣ A 10 3, soit 12 cartes connues par main. Le prompt et le corrigé indiquent clairement que les mains représentées sont partielles et expliquent pourquoi. Le raisonnement relatif au déblocage des Piques et des Cœurs est inchangé. Aucune donne à 52 cartes n'est inventée.

## Contrôles

- Tous les 17 exercices carte du lot 02 vérifiés pour l'absence de carte physique dupliquée, y compris les tableaux partiels.
- Vérification de la position d'Ouest pour `JC-BH-129-01`, et d'Est pour `JC-BH-131-01`.
- Vérification explicite de la note de source et des Trèfles partiels sur `JC-BH-135-J01`.
- Les **15 QCM d'enchères** et **17 plans libres** sont conservés. Total attendu : **601 + 144 = 745**.
- Invalidation du cache PWA `qpjb-v57` et nouvelle version `20261106l02fix1`.

**Limite** : la validation automatisée des cartes et de l'interface ne prouve pas à elle seule l'unicité de chaque interprétation pédagogique ni toutes les stratégies possibles du jeu de la carte.

# Entraînement QPJB — BH-061 : contextes et contradiction documentaire (11 novembre 2026)

## Source primaire contrôlée

- *Votre Bridge Hebdo débutant* n°61 du 28 avril 2023, page 1 du sujet et du corrigé originaux, extraits de l'archive `BridgeHebdo_originaux_2026-10-23.zip` dans la Bibliothèque `/QPJB Training/Archives/`.
- Sujet : `61 Exercice Votre Bridge Hebdo débutant 28-4-2023.pdf`, SHA-256 `de39062702695d4f27045fea71af4ad8c8e9a78dad8a469abc8c026273a66eac`.
- Corrigé : `61 Solution Votre Bridge Hebdo débutant 28-04-2023.pdf`, SHA-256 `9fff243d9b82afc4bd4f127f50d65e63923495ce46f2168f0698ca4d5fd75a86`.
- Vérification par rendu des pages 1 et extraction de texte recoupées ; les PDF originaux n'ont été ni altérés ni republiés.

## Écarts P1 résolus sans changer le corrigé

| Fiche | Vulnérabilité du sujet | Ouverture d'Est selon le sujet | Enchère correcte conservée |
|---|---|---|---|
| `EN-BH-061-02` | Tous vulnérables | 1♣ | Passe |
| `EN-BH-061-03` | Est–Ouest vulnérables, Nord–Sud non vulnérables | 1♥ | 1♠ |
| `EN-BH-061-04` | Tous vulnérables | 1♣ | Contre |
| `EN-BH-061-06` | Personne vulnérable | 1♥ | 2♠ |

- Pour ces quatre fiches, la vulnérabilité ne figurait pas dans l'énoncé QPJB. La question l'affiche désormais **avant** les quatre choix, avec Est ouvre et le siège Sud.
- **BH-061-06 — divergence de source** : le sujet imprime Est **1♥**, le corrigé imprime Est **1♣**. Les deux proposent un barrage à **2♠** avec six Piques ; la question précise désormais cette discordance avant que l'élève choisisse. La séquence de l'application conserve l'ouverture 1♥ du sujet.
- BH-061-03 : l'indication *vulnérabilité favorable* éclaire l'intervention avec une distribution 5–5, sans présenter une défense future comme certaine.
- BH-061-04 : le Contre est justifié par la force de la main ; l'explication respecte le cadre conventionnel d'intervention du fascicule.
- BH-061-02 : la qualité très médiocre de la longue à Pique et la vulnérabilité défavorable justifient Passe dans le système illustré.

## Invariants et limites

- Exactement **4** objets modifiés dans la banque de 638 enchères ; les 634 autres et les 188 exercices de carte conservent leurs champs, donc total **826**.
- Identifiants, quatre options, bonnes réponses, mains, ordre ♠♥♦♣, séquences, sourceRef, statut reviewStatus, choiceStatus et commentaires pré-tentative `pretryHints` inchangés.
- `EN-BH-061-05`, déjà arbitré avec divergence sujet/corrigé sur sa propre séquence, demeure **inchangé** et protégé par une assertion dédiée.
- L'exercice 1 du fascicule n'est pas présent comme QCM autonome et n'est pas ajouté. Le corrigé affiche aussi une discordance de cartes dans l'exercice 1 ; elle ne saurait devenir une modification d'une fiche non existante.
- Relecture documentaire informée, non expertise indépendante de toutes les conventions de surenchère.

## Contrôles et diffusion

- Le maître `entrainement/training-data.js` et le module `entrainement/training-data-bidding.js` restent synchronisés via le script de génération.
- Six assertions supplémentaires dans `tests/training-smoke.cjs` et une non-régression spécifique BH-061-05 ; la CI GitHub exécute intégrité, Chromium, WebKit et fonctionnement hors ligne.
- Versions de ressources et cache PWA actualisés pour éviter une question obsolète hors ligne ; la PR doit rester en brouillon jusqu'aux trois feux verts CI.

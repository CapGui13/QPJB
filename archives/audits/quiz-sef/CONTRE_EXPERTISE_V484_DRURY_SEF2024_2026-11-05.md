# Quiz QPJB V4.84 — Contre-expertise Drury SEF 2024

**Date :** 5 novembre 2026. **Dépôt :** `CapGui13/QPJB`. **Branche :** `quiz-v484-drury-developpements-sef2024`. **Base :** `main` commit `fe7f4ef39f02058d0472ffe6f7cbcfaa31beb9e9`. **Périmètre exclusif :** Quiz SEF `quizz.html` ; aucune action sur `/entrainement/`.

## Justification pédagogique, étayée avant création

Le Quiz V4.83 contenait **1 161 QCM et 19 QCM Drury**. Relecture des 19 fiches `theme=drury` : les décisions initiales après Passe (1SA, 2♣ Drury, 2SA singleton, soutiens) et les redemandes de l'ouvreur **2 dans sa majeure faible** et **2♦ positive** sont déjà présentes. Aucun QCM existant dans cette rubrique ne faisait :
1. Reprendre la parole **en tant que répondant après 2♦ d'attente**, et distinguer le nombre exact de trois/quatre atouts : **4 nouvelles mains** ;
2. Répondre au **relais 3♣ de l'ouvreur après 2SA conventionnel du répondant** avec quatre atouts + singleton, et distinguer l'annonce naturelle de la courte de l'annonce de la courte Trèfle : **6 nouvelles mains**, soit chaque couleur courte possible pour Cœur ou Pique ;
3. Distinguer la redemande directe de **3 dans la majeure (espoir de chelem)** de **4 dans la majeure (conclusion de manche)** à l'ouverture en troisième position sur 2♣ Drury : **4 nouvelles mains**.

Ce sont **14 décisions en 3 compétences**, pas un quota pour équilibrer les rubriques. Le Drury avec quatre atouts et jeu irrégulier n'est employé **que dans le cas conventionnel 2SA promettant un singleton** : les quatre mains de répondant utilisant initialement 2♣ Drury n'ont **aucune courte** quand elles détiennent quatre atouts.

## Sources pédagogiques vérifiées

- **FFB, `L’As de Trèfle` n°52, septembre 2024, pages imprimées 28–29**, « Les nouveautés du SEF — Le Drury », Jean-Pierre Desmoulins : https://res.cloudinary.com/ffbridge/image/upload/v1725446344/production/cms/ADTN_52_BD_2_6a558ea8dd.pdf . Après 2♣ Drury, redemande 2 dans la majeure = faiblesse ; 2♦ = attente avec au moins espoir de manche ; 3 dans la majeure = espoir de chelem ; 4 dans la majeure = conclusion ; sur 2♦, répondant à 2 dans la majeure avec trois atouts et à 3 avec quatre. **Source fédérale directe**.
- **Bridge Club du Haut-Poitou**, présentation du SEF 2024 : https://scjc-bridge.fr/sef-2024 . Après Passe initial, 2SA promet quatre cartes d'atout + un singleton, 3♣ est le relais sur 2SA ; réponse naturelle pour les courtes en couleur, retour à 3 dans la majeure pour la courte Trèfle.
- **Fiche 303, Le 2♣ Drury fitté**, école de bridge Bordeaux 167 : https://bordeaux167.legtux.org/wpress/wp-content/uploads/2024/05/f303_2-trefle-Drury.pdf . Confirme les conditions du Drury et les réponses du répondant après la redemande 2♦.

## Les 14 mains, enchères et 42 distracteurs

Dans la colonne main : **♠ / ♥ / ♦ / ♣**. Points H vérifiés indépendamment par somme A=4, R=3, D=2, V=1. Chaque main contient 13 cartes.

| ID | Compétence nouvelle | Main | H | Forme | Réponse | Trois distracteurs |
|---|---|---|---:|---|---|---|
| `SEF-V484-001` | répondant après 2♦ | ♠A84 / ♥D96 / ♦R1094 / ♣D72 | 11 | 3–3–4–3 | **2♥** | 2SA, 3♥, 4♥ |
| `SEF-V484-002` | répondant après 2♦ | ♠R82 / ♥D1096 / ♦A74 / ♣865 | 9 | 3–4–3–3 | **3♥** | 2♥, 2SA, 4♥ |
| `SEF-V484-003` | répondant après 2♦ | ♠AD9 / ♥R102 / ♦D864 / ♣973 | 11 | 3–3–4–3 | **2♠** | 2SA, 3♠, 4♠ |
| `SEF-V484-004` | répondant après 2♦ | ♠R974 / ♥A82 / ♦D63 / ♣985 | 9 | 4–3–3–3 | **3♠** | 2♠, 2SA, 4♠ |
| `SEF-V484-005` | singleton après 2SA–3♣ | ♠R872 / ♥A1096 / ♦D875 / ♣3 | 9 | 4–4–4–1 | **3♥** | 3♦, 3♠, 4♥ |
| `SEF-V484-006` | singleton après 2SA–3♣ | ♠R1095 / ♥A984 / ♦3 / ♣D1072 | 9 | 4–4–1–4 | **3♦** | 3♥, 3♠, 4♥ |
| `SEF-V484-007` | singleton après 2SA–3♣ | ♠4 / ♥R1097 / ♦A873 / ♣D965 | 9 | 1–4–4–4 | **3♠** | 3♦, 3♥, 4♥ |
| `SEF-V484-008` | singleton après 2SA–3♣ | ♠A1096 / ♥R872 / ♦D975 / ♣3 | 9 | 4–4–4–1 | **3♠** | 3♦, 3♥, 4♠ |
| `SEF-V484-009` | singleton après 2SA–3♣ | ♠A985 / ♥R1072 / ♦3 / ♣D874 | 9 | 4–4–1–4 | **3♦** | 3♥, 3♠, 4♠ |
| `SEF-V484-010` | singleton après 2SA–3♣ | ♠R1085 / ♥3 / ♦A1094 / ♣D872 | 9 | 4–1–4–4 | **3♥** | 3♦, 3♠, 4♠ |
| `SEF-V484-011` | ouvreur après 2♣ | ♠A5 / ♥ARDV104 / ♦A96 / ♣74 | 18 | 2–6–3–2 | **3♥** | 2♦, 2♥, 4♥ |
| `SEF-V484-012` | ouvreur après 2♣ | ♠RDV1094 / ♥A8 / ♦AR7 / ♣73 | 17 | 6–2–3–2 | **3♠** | 2♦, 2♠, 4♠ |
| `SEF-V484-013` | ouvreur après 2♣ | ♠D108 / ♥A9753 / ♦AD104 / ♣8 | 12 | 3–5–4–1 | **4♥** | 2♦, 2♥, 3♥ |
| `SEF-V484-014` | ouvreur après 2♣ | ♠A10974 / ♥D83 / ♦AD102 / ♣8 | 12 | 5–3–4–1 | **4♠** | 2♦, 2♠, 3♠ |

### Analyse des 42 distracteurs (réservée au rapport)

- **`SEF-V484-001` → 2♥.** 2SA : 2SA ne décrit pas directement la longueur exacte du fit ♥ dans le développement demandé après le 2♦ d'attente. 3♥ : 3♥ promettrait quatre atouts, alors que cette main n'en contient que 3. 4♥ : 4♥ impose directement une manche que le répondant doit encore laisser évaluer à l'ouvreur après 2♦.
- **`SEF-V484-002` → 3♥.** 2♥ : 2♥ annoncerait un soutien de trois atouts, alors que cette main en possède 4. 2SA : 2SA ne décrit pas directement la longueur exacte du fit ♥ dans le développement demandé après le 2♦ d'attente. 4♥ : 4♥ impose directement une manche que le répondant doit encore laisser évaluer à l'ouvreur après 2♦.
- **`SEF-V484-003` → 2♠.** 2SA : 2SA ne décrit pas directement la longueur exacte du fit ♠ dans le développement demandé après le 2♦ d'attente. 3♠ : 3♠ promettrait quatre atouts, alors que cette main n'en contient que 3. 4♠ : 4♠ impose directement une manche que le répondant doit encore laisser évaluer à l'ouvreur après 2♦.
- **`SEF-V484-004` → 3♠.** 2♠ : 2♠ annoncerait un soutien de trois atouts, alors que cette main en possède 4. 2SA : 2SA ne décrit pas directement la longueur exacte du fit ♠ dans le développement demandé après le 2♦ d'attente. 4♠ : 4♠ impose directement une manche que le répondant doit encore laisser évaluer à l'ouvreur après 2♦.
- **`SEF-V484-005` → 3♥.** 3♦ : 3♦ décrirait un singleton Carreau, alors que la main a précisément un singleton ♣. 3♠ : 3♠ décrirait un singleton Pique, alors que la main a précisément un singleton ♣. 4♥ : 4♥ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♣ n'est pas localisée.
- **`SEF-V484-006` → 3♦.** 3♥ : 3♥ décrirait un singleton Trèfle, par retour à 3♥, alors que la main a précisément un singleton ♦. 3♠ : 3♠ décrirait un singleton Pique, alors que la main a précisément un singleton ♦. 4♥ : 4♥ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♦ n'est pas localisée.
- **`SEF-V484-007` → 3♠.** 3♦ : 3♦ décrirait un singleton Carreau, alors que la main a précisément un singleton ♠. 3♥ : 3♥ décrirait un singleton Trèfle, par retour à 3♥, alors que la main a précisément un singleton ♠. 4♥ : 4♥ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♠ n'est pas localisée.
- **`SEF-V484-008` → 3♠.** 3♦ : 3♦ décrirait un singleton Carreau, alors que la main a précisément un singleton ♣. 3♥ : 3♥ décrirait un singleton Cœur, alors que la main a précisément un singleton ♣. 4♠ : 4♠ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♣ n'est pas localisée.
- **`SEF-V484-009` → 3♦.** 3♥ : 3♥ décrirait un singleton Cœur, alors que la main a précisément un singleton ♦. 3♠ : 3♠ décrirait un singleton Trèfle, par retour à 3♠, alors que la main a précisément un singleton ♦. 4♠ : 4♠ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♦ n'est pas localisée.
- **`SEF-V484-010` → 3♥.** 3♦ : 3♦ décrirait un singleton Carreau, alors que la main a précisément un singleton ♥. 3♠ : 3♠ décrirait un singleton Trèfle, par retour à 3♠, alors que la main a précisément un singleton ♥. 4♠ : 4♠ est une conclusion qui escamote la réponse au relais 3♣ ; la courte ♥ n'est pas localisée.
- **`SEF-V484-011` → 3♥.** 2♦ : 2♦, simple attente avec espoir de manche, ne montre pas la perspective de chelem créée par le jeu fort et la longue majeure. 2♥ : 2♥ annoncerait une ouverture tactique faible, contraire aux valeurs réelles de cette main. 4♥ : 4♥ conclurait à la manche sans laisser explorer le chelem, alors que la force et la qualité de la majeure offrent une perspective supérieure.
- **`SEF-V484-012` → 3♠.** 2♦ : 2♦, simple attente avec espoir de manche, ne montre pas la perspective de chelem créée par le jeu fort et la longue majeure. 2♠ : 2♠ annoncerait une ouverture tactique faible, contraire aux valeurs réelles de cette main. 4♠ : 4♠ conclurait à la manche sans laisser explorer le chelem, alors que la force et la qualité de la majeure offrent une perspective supérieure.
- **`SEF-V484-013` → 4♥.** 2♦ : 2♦ exprimerait un simple essai de manche alors que la distribution et le fit annoncé permettent ici de conclure à la manche. 2♥ : 2♥ annoncerait une ouverture tactique faible, contraire aux valeurs réelles de cette main. 3♥ : 3♥ montrerait une ambition de chelem trop élevée pour cette ouverture de 12 H, malgré le singleton Trèfle.
- **`SEF-V484-014` → 4♠.** 2♦ : 2♦ exprimerait un simple essai de manche alors que la distribution et le fit annoncé permettent ici de conclure à la manche. 2♠ : 2♠ annoncerait une ouverture tactique faible, contraire aux valeurs réelles de cette main. 3♠ : 3♠ montrerait une ambition de chelem trop élevée pour cette ouverture de 12 H, malgré le singleton Trèfle.

**Règle d'interface :** le Quiz ne contient que la justification de la bonne enchère (`explain`), et **aucune explication des trois mauvaises réponses**. L'énoncé ne donne plus directement la relation 3 atouts → 2M, 4 atouts → 3M ; l'élève doit la restituer.

## Validation bloquante et limitations

- Empreinte Git Blob **des 1 161 anciens QCM** : `4f3a8bfa3bb5e3416e7f45e23bcb2e773d9c47f1`, stockée dans `tests/quizz-baseline-1161-gitsha.json`. Le nouveau test `tests/quizz-v484-regression.cjs` impose la préservation bit-à-bit de `JSON.stringify` de l'historique, des 22 rubriques et des 14 IDs.
- Recalcul systématique des **13 cartes**, des points H, de la distribution, de la présence des atouts/du singleton, des **quatre enchères légales et ordonnées** et de la bonne réponse déterminée par la règle.
- La force des réponses initiales Drury (11 HLD), la limitation des éventuels soutiens de quatre atouts sans singleton et le minimum de quatre atouts pour 2SA singleton sont contrôlés.
- Deux mains d'ouvreur proposent une recherche de chelem forte à 17–18 H ; deux mains avec 12 H et une courte concluent directement à la manche, comme dans les exemples du document FFB. Des choix frontières pourraient dépendre de l'évaluation de main ; toute réserve pédagogique indépendante devra être levée avant une publication.
- Tests **Audit, Chromium et WebKit** à obtenir sur le **dernier SHA de la PR**. Aucun changement des 677 exercices d'Entraînement, des PBN, ni de l'application hors Quiz.

**Statut :** projet V4.84 à auditer, **non publié**. Ne fusionner qu'après validation complète.

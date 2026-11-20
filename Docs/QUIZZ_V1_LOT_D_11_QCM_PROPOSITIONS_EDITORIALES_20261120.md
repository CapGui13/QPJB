# LOT D — contre-expertise éditoriale de 11 QCM V1 (propositions à valider)

**20 novembre 2026 · Statut : PROPOSITIONS / NON APPROUVÉ · PR BROUILLON · NE PAS FUSIONNER · NE PAS PUBLIER**

## Périmètre et méthode

**Exactement 11 IDs, aucun autre.** 7 soutiens simples `1M–2M` à 5 HLD sans courte, le Roudi `SEF-L10-030`, la modulation du Texas Trèfle `SEF-L25-007` et les deux Texas majeurs `SEF-V44-027` / `SEF-V44-030`. La contre-expertise s'appuie sur les **enregistrements V1 originaux intégraux** copiés et contrôlés dans les registres de préclassification (mains, séquences, questions, choix, corrigés, explications et motifs), pas sur les réponses d'un prototype V2.

Sources du dépôt, lues sur `main` :
- [Registre source des 541 QCM](../audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json) (8 cas : les sept fits et le Roudi).
- [Registre source des 79 QCM SA/Stayman/Texas](../audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json) (3 autres cas ; champ `originalV1`).
- [PR #234 — pré-contre-expertise des huit QCM](https://github.com/CapGui13/QPJB/pull/234), document [`Docs/QUIZZ_V1_HUIT_QCM_CONTRE_EXPERTISE_20261120.md`](https://github.com/CapGui13/QPJB/blob/audit/v1-competences-lot-h-20261120/Docs/QUIZZ_V1_HUIT_QCM_CONTRE_EXPERTISE_20261120.md), non fusionné à la date de rédaction.
- [Manifeste des 19 décisions pédagogiques approuvées](PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json) et [texte de correction approuvé pour L25-007](PARCOURS_V2_CORRECTIONS_4_QCM_HOLD_20261120.json).
- [Pré-revue des 65 QCM Stayman/Texas](../audits/QPJB_V1_STAYMAN_TEXAS_65_REVUE_20261120.json).

Références externes de cadrage à interpréter selon la convention effectivement jouée :
- [ABC du bridge : réponse à l'ouverture majeure](https://abc-du-bridge.scenari-community.org/003-02/co/003-02-02.html) — moins de 6 HLD : passe ; 6–10 HLD : soutien simple à 2M.
- [Bridge Club du Haut Poitou : Roudi trois réponses](https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/le-roudi-2) — cas sixième majeure et 11–12 HL.
- [Changements du SEF : modulation du Texas Trèfle](https://scjc-bridge.fr/les-nouveautes-du-sef-2018) — gros honneur troisième ; une autre présentation pédagogique [décrit la modulation comme maximum/minimum](https://tombachard.fr/bridge/cours/ecole/1SA/). **La formulation déjà validée par l'utilisatrice (« positive, non minimum, pas nécessairement maximum ») prévaut pour la proposition L25-007 ; ne pas prétendre que toutes les versions du SEF décrivent l'accord à l'identique.**

## Principes de la proposition

1. **7 supports simples :** main V1 de 5 HLD, 3 atouts, aucun singleton/chicane, donc l'enchère intermédiaire 2M est injustifiable selon la plage 6–10 HLD. Pour conserver le problème pédagogique « refuser l'essai », on **propose** de remplacer une petite carte par un Valet dans une couleur autre que l'atout et, en cas d'essai à la couleur, autre que la couleur d'essai. On obtient 6 H, 6 HLD, toujours une main régulière et minimale. **Ce sont des mains candidates nouvelles, jamais des corrections automatiquement approuvées.**
2. **Aucune séquence, aucun distracteur et aucune bonne réponse modifiés**, y compris pour L25-007 et les deux Texas ; le changement de main pour sept cas exige une validation pédagogique même si le corrigé reste stable.
3. **19 décisions antérieures respectées (19/19)** : le seul QCM commun est `SEF-L25-007`, dont on reproduit **exactement** l'explication approuvée ; aucun des quinze corrigés conservés n'est modifié. Les décisions `SEF-V416-008` / `009` sur les doubles transferts ne sont pas transposées à des questions V1 formulées autrement. **Un changement de réponse V2 ne se copie jamais sans changer la consigne et les choix correspondants.**
4. La classification `theme: stayman` des deux V44 est conservée pour compatibilité V1 ; seul le **motif de difficulté** confond Stayman et Texas. Aucune activation de compétence, modification de sauvegarde ou édition du catalogue.

## Audit individuel — 11/11 cas

### 1. `SEF-V4-009-1` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `cas-318` ; difficulté : 3/5)

**Main originale :** ♠943 · ♥954 · ♦A1065 · ♣V74 — **5 H**, distribution 3–3–4–3.

**Séquence originale :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 2SA`.

**Consigne originale :** « Le partenaire fait une enchère d’essai à 2SA après ton soutien simple. Que réponds-tu ? »

**Choix originale :** `3♥` ; `3SA` ; `Passe` ; `4♥`.

**Bonne réponse originale :** **3♥**.

**Explication originale :** « L'ouvreur a proposé la manche par 2SA, enchère d'essai généralisée forcing pour un tour après le fit à Cœur. Avec seulement 5 H et trois Cœurs, le soutien est minimum : 3♥ refuse l'invitation. Passe laisserait 2SA comme contrat alors que cette enchère demande une réponse. »

**Motif de difficulté originale :** « Accepter ou refuser une invitation à la manche »

**Problème concret :** Soutien préalable 2♥ présenté avec 5 HLD, en dessous des 6 HLD requis ; le choix final 3♥ est conditionnellement logique mais la séquence initiale ne l'est pas.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♠3 → ♠V (+1 H) ; le soutien ♥954 reste troisième..

**Main proposée :** ♠V94 · ♥954 · ♦A1065 · ♣V74 — **6 H**, distribution 3–3–4–3.

**Séquence proposée :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 2SA`.

**Consigne proposée :** « Vous avez soutenu l'ouverture de 1♥ à 2♥ avec 6 HLD et trois atouts. L'ouvreur poursuit par 2SA, essai généralisé de manche. Que répondez-vous ? »

**Choix proposée :** `3♥` ; `3SA` ; `Passe` ; `4♥`.

**Bonne réponse proposée :** **3♥**.

**Explication proposée :** « Avec 6 HLD et trois Cœurs, votre soutien simple à 2♥ est cohérent mais minimum. L'essai généralisé à 2SA de l'ouvreur demande une réponse : 3♥ refuse la manche. Passe ne convient pas sur cet essai ; 4♥ et 3SA surévalueraient votre main. »

**Motif de difficulté proposée :** « Après 1♥–2♥–2SA, refuser l'essai généralisé avec un soutien minimum de 6 HLD. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé, sous validation éditoriale.

---

### 2. `SEF-V4-011-1` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `cas-320` ; difficulté : 3/5)

**Main originale :** ♠8632 · ♥A76 · ♦V106 · ♣1042 — **5 H**, distribution 4–3–3–3.

**Séquence originale :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 2SA`.

**Consigne originale :** « Le partenaire fait une enchère d’essai à 2SA après ton soutien simple. Que réponds-tu ? »

**Choix originale :** `3SA` ; `Passe` ; `3♥` ; `4♥`.

**Bonne réponse originale :** **3♥**.

**Explication originale :** « Sur 1♥–2♥–2SA, la recherche de manche impose une réponse. Avec seulement 5 H, un soutien troisième à Cœur et une main minimale, 3♥ indique le refus de la proposition. Passe sur 2SA n'est pas approprié et 4♥ surévaluerait la main. »

**Motif de difficulté originale :** « Accepter ou refuser une invitation à la manche »

**Problème concret :** Avec seulement 5 HLD et trois Cœurs, le 2♥ antérieur était hors zone ; le refus de l'essai reste défendable une fois le soutien rendu valide.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♣2 → ♣V (+1 H) ; ♥A76 inchangé..

**Main proposée :** ♠8632 · ♥A76 · ♦V106 · ♣V104 — **6 H**, distribution 4–3–3–3.

**Séquence proposée :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 2SA`.

**Consigne proposée :** « Vous avez soutenu l'ouverture de 1♥ à 2♥ avec 6 HLD et trois atouts. L'ouvreur poursuit par 2SA, essai généralisé de manche. Que répondez-vous ? »

**Choix proposée :** `3SA` ; `Passe` ; `3♥` ; `4♥`.

**Bonne réponse proposée :** **3♥**.

**Explication proposée :** « Votre main possède désormais 6 HLD, ce qui autorise le soutien simple 2♥, mais reste dans le bas de la zone 6–10 HLD. Sur l'essai généralisé 2SA, revenez à 3♥ pour refuser la manche. Passe n'est pas une réponse à l'essai ; 3SA ou 4♥ seraient trop ambitieux. »

**Motif de difficulté proposée :** « Distinguer soutien minimum et acceptation de manche après 1♥–2♥–2SA. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 3. `SEF-V4-021-1` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `cas-331` ; difficulté : 3/5)

**Main originale :** ♠V32 · ♥742 · ♦A982 · ♣732 — **5 H**, distribution 3–3–4–3.

**Séquence originale :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 2SA`.

**Consigne originale :** « Le partenaire fait une enchère d’essai à 2SA après ton soutien simple. Que réponds-tu ? »

**Choix originale :** `3♠` ; `3SA` ; `4♠` ; `Passe`.

**Bonne réponse originale :** **3♠**.

**Explication originale :** « Le 2SA de l'ouvreur est un essai de manche forcing un tour après 1♠–2♠. Avec 5 H et seulement trois Piques, le répondant est minimum et revient à 3♠. Passe sur 2SA ne tient pas compte du caractère forcing de l'essai. »

**Motif de difficulté originale :** « Accepter ou refuser une invitation à la manche »

**Problème concret :** L'annonce préalable 2♠ correspondait à 5 HLD seulement ; la réponse finale 3♠ ne suffit pas à rendre l'énoncé SEF cohérent.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♣2 → ♣V (+1 H) ; ♠V32 inchangé..

**Main proposée :** ♠V32 · ♥742 · ♦A982 · ♣V73 — **6 H**, distribution 3–3–4–3.

**Séquence proposée :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 2SA`.

**Consigne proposée :** « Vous avez soutenu l'ouverture de 1♠ à 2♠ avec 6 HLD et trois atouts. L'ouvreur poursuit par 2SA, essai généralisé de manche. Que répondez-vous ? »

**Choix proposée :** `3♠` ; `3SA` ; `4♠` ; `Passe`.

**Bonne réponse proposée :** **3♠**.

**Explication proposée :** « Avec 6 HLD et trois Piques, le soutien simple à 2♠ est désormais recevable mais minimum. Après l'essai généralisé à 2SA, 3♠ refuse la manche et revient à la majeure fittée. Passe n'est pas possible sur cet essai ; 4♠ ou 3SA surévalueraient ce jeu. »

**Motif de difficulté proposée :** « Refuser un essai généralisé de manche avec un fit Pique minimum de 6 HLD. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 4. `SEF-V4-023-3` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `cas-333` ; difficulté : 3/5)

**Main originale :** ♠953 · ♥DV93 · ♦D64 · ♣864 — **5 H**, distribution 3–4–3–3.

**Séquence originale :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 2SA`.

**Consigne originale :** « Le partenaire fait une enchère d’essai à 2SA après ton soutien simple. Que réponds-tu ? »

**Choix originale :** `4♠` ; `Passe` ; `3♠` ; `3SA`.

**Bonne réponse originale :** **3♠**.

**Explication originale :** « Sur l'essai généralisé 2SA après 1♠–2♠, la force de 5 H reste minimale malgré Dame-Valet de Cœur. Le contrat partiel à 3♠ convient : 3♠ refuse l'invitation ; Passe ne convient pas puisque 2SA est forcing un tour. »

**Motif de difficulté originale :** « Accepter ou refuser une invitation à la manche »

**Problème concret :** Le 2♠ de la séquence était donné avec 5 HLD sans courte ; le caractère approprié de 3♠ ne valide pas rétroactivement 2♠.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♣4 → ♣V (+1 H) ; ♠953 inchangé..

**Main proposée :** ♠953 · ♥DV93 · ♦D64 · ♣V86 — **6 H**, distribution 3–4–3–3.

**Séquence proposée :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 2SA`.

**Consigne proposée :** « Vous avez soutenu l'ouverture de 1♠ à 2♠ avec 6 HLD et trois atouts. L'ouvreur poursuit par 2SA, essai généralisé de manche. Que répondez-vous ? »

**Choix proposée :** `4♠` ; `Passe` ; `3♠` ; `3SA`.

**Bonne réponse proposée :** **3♠**.

**Explication proposée :** « Le soutien simple initial est justifié par les 6 HLD de cette main régulière, mais demeure au minimum de sa zone. Malgré ♥DV93, vous refusez l'essai généralisé de manche en annonçant 3♠. Passe sur 2SA ne répondrait pas à l'essai ; 4♠ ou 3SA ne sont pas justifiés. »

**Motif de difficulté proposée :** « Ne pas confondre honneurs épars et soutien suffisant pour accepter la manche après 2SA d'essai. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 5. `SEF-V416-006` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `v416-cas-006` ; difficulté : 2/5)

**Main originale :** ♠R93 · ♥D84 · ♦10752 · ♣963 — **5 H**, distribution 3–3–4–3.

**Séquence originale :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 3♦`.

**Consigne originale :** « Rappel : 3♦ est une enchère d’essai à la couleur après le fit simple à Pique. »

**Choix originale :** `3♠` ; `3SA` ; `4♠` ; `Passe`.

**Bonne réponse originale :** **3♠**.

**Explication originale :** « Après le fit 1♠–2♠, 3♦ est un essai à la couleur, forcing pour un tour. Avec seulement 5 H et aucun honneur à Carreau, le répondant refuse la manche en revenant à 3♠. Passe sur 3♦ ignorerait le fit majeur et le caractère forcing de l'essai. »

**Motif de difficulté originale :** « Refuser un essai à la couleur avec une main minimum et aucun honneur utile »

**Problème concret :** L'ancienne main ne possédait que 5 HLD pour soutenir à 2♠ ; le corrigé 3♠ répond bien à l'essai mais dépend d'un soutien initial régulier.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♣3 → ♣V (+1 H) ; ♦10752 sans honneur inchangé..

**Main proposée :** ♠R93 · ♥D84 · ♦10752 · ♣V96 — **6 H**, distribution 3–3–4–3.

**Séquence proposée :** `Partenaire : 1♠` ; `Vous : 2♠` ; `Partenaire : 3♦`.

**Consigne proposée :** « Après avoir soutenu 1♠ à 2♠, vous entendez l'ouvreur annoncer 3♦, essai de manche à la couleur. Quelle est votre enchère avec cette main ? »

**Choix proposée :** `3♠` ; `3SA` ; `4♠` ; `Passe`.

**Bonne réponse proposée :** **3♠**.

**Explication proposée :** « Avec 6 HLD et trois Piques, le soutien 2♠ est à présent régulier mais minimum. Face à l'essai à 3♦, vous ne détenez aucun honneur à Carreau (♦10752) : 3♠ refuse la manche. Passe ne convient pas sur l'essai ; 3SA et 4♠ surévalueraient la main. »

**Motif de difficulté proposée :** « Après 1♠–2♠–3♦, refuser l'essai dans une couleur sans honneur utile avec 6 HLD. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 6. `SEF-V418-006` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `v418-cas-006` ; difficulté : 3/5)

**Main originale :** ♠D85 · ♥V74 · ♦V1082 · ♣V92 — **5 H**, distribution 3–3–4–3.

**Séquence originale :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 3♣`.

**Consigne originale :** « Vous avez soutenu votre partenaire à 2♥, puis il a fait une enchère d’essai à 3♣. Avec 5 H et une distribution 3-3-4-3, comment réagissez-vous ? »

**Choix originale :** `3♥` ; `3SA` ; `4♥` ; `4♣`.

**Bonne réponse originale :** **3♥**.

**Explication originale :** « Vous n'avez que 5 H, trois atouts Cœur (♥V74) et seulement ♣V92 dans la couleur d'essai à Trèfle. L'ouvreur a proposé la manche par 3♣ ; 3♥ refuse cet essai et exprime le minimum du soutien simple. »

**Motif de difficulté originale :** « Refuser un essai à la couleur avec une main minimale et sans valeurs utiles. »

**Problème concret :** La main originale de 5 HLD ne permettait pas le soutien 2♥ antérieur ; il faut aussi conserver une question explicite, plutôt que supposer l'essai déjà compris.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♠5 → ♠V (+1 H) ; ♣V92 peu utile pour l'essai inchangé..

**Main proposée :** ♠DV8 · ♥V74 · ♦V1082 · ♣V92 — **6 H**, distribution 3–3–4–3.

**Séquence proposée :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 3♣`.

**Consigne proposée :** « Vous avez soutenu 1♥ à 2♥. Votre partenaire annonce ensuite 3♣, essai de manche à la couleur. Quelle enchère choisissez-vous avec cette main régulière ? »

**Choix proposée :** `3♥` ; `3SA` ; `4♥` ; `4♣`.

**Bonne réponse proposée :** **3♥**.

**Explication proposée :** « Cette main a 6 HLD et trois Cœurs, autorisant désormais 2♥, mais elle demeure minimale. Face à l'essai à 3♣, ♣V92 n'apporte pas de complément significatif : 3♥ refuse la manche. 3SA, 4♥ et 4♣ ne traduisent pas ce soutien minimum. »

**Motif de difficulté proposée :** « Refuser l'essai à Trèfle avec six HLD et un très faible complément en couleur d'essai. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 7. `SEF-V421-012` — soutien initial invalide

**Contenu original V1** (thème : `apres_fit` ; famille : `v421-cas-012` ; difficulté : 2/5)

**Main originale :** ♠R64 · ♥975 · ♦10863 · ♣D94 — **5 H**, distribution 3–3–4–3.

**Séquence originale :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 3♦`.

**Consigne originale :** « Vous avez soutenu votre partenaire à 2♥, puis il a fait une enchère d’essai à 3♦. Avec 5 H et une distribution 3-3-4-3, comment réagissez-vous ? »

**Choix originale :** `3♥` ; `4♥` ; `3SA` ; `4♦`.

**Bonne réponse originale :** **3♥**.

**Explication originale :** « Vous avez 5 H, trois Cœurs (♥975) et ♦10863 sans honneur utile dans la couleur de l'essai. La main est minimum : 3♥ refuse la tentative de manche et revient à la majeure fittée au niveau le plus bas. »

**Motif de difficulté originale :** « Refus de l’essai à la couleur avec main minimale et sans aide »

**Problème concret :** L'ancien soutien 2♥ était indiqué avec 5 HLD seulement ; la réponse 3♥ demeure logique après réparation de la main.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `hand`, `context`, `explain`, `difficultyReason` ; ♣4 → ♣V (+1 H) ; ♦10863 sans honneur inchangé..

**Main proposée :** ♠R64 · ♥975 · ♦10863 · ♣DV9 — **6 H**, distribution 3–3–4–3.

**Séquence proposée :** `Partenaire : 1♥` ; `Vous : 2♥` ; `Partenaire : 3♦`.

**Consigne proposée :** « Vous avez soutenu 1♥ à 2♥. Votre partenaire fait ensuite l'essai de manche à 3♦. Quelle enchère choisissez-vous avec votre main ? »

**Choix proposée :** `3♥` ; `4♥` ; `3SA` ; `4♦`.

**Bonne réponse proposée :** **3♥**.

**Explication proposée :** « Avec 6 HLD et trois Cœurs, le 2♥ préalable est cohérent mais minimum. La couleur d'essai ♦10863 ne contient aucun honneur utile : revenez à 3♥ pour refuser la manche. Les annonces 4♥, 3SA ou 4♦ surestimeraient le jeu. »

**Motif de difficulté proposée :** « Après 1♥–2♥–3♦, refuser la manche avec 6 HLD et sans complément à Carreau. »

**Impact sur la bonne réponse :** inchangée après révision de la main ; l'exercice original reste non homologable dans sa forme antérieure. **Niveau de confiance :** Diagnostic : élevé ; correction de main : moyen-élevé.

---

### 8. `SEF-L10-030` — Roudi : motif incohérent

**Contenu original V1** (thème : `roudi` ; famille : `ROU-2:030` ; difficulté : 3/5)

**Main originale :** ♠AD10974 · ♥86 · ♦R93 · ♣82 — **9 H**, distribution 6–2–3–2.

**Séquence originale :** `Partenaire : 1♣` ; `Adversaire : Passe` ; `Vous : 1♠` ; `Adversaire : Passe` ; `Partenaire : 1SA` ; `Adversaire : Passe`.

**Consigne originale :** « Vous êtes Sud, donneur Nord. Séquence 1♣–Passe–1♠–Passe–1SA–Passe. Votre main vaut 11 HL avec six Piques et non une simple main faible. Jouant le Roudi trois réponses qui s’emploie aussi avec une sixième majeure et 11–12 HL, que répondez-vous ? »

**Choix originale :** `Passe` ; `2♣` ; `2♠` ; `3♠`.

**Bonne réponse originale :** **2♣**.

**Explication originale :** « Avec une majeure sixième et exactement 11–12 HL, utilisez 2♣ Roudi pour préciser le fit et la force de l’ouvreur. La répétition directe 2♠ s’emploie ici avec une main plus faible. »

**Motif de difficulté originale :** « répétition 6 cartes faible »

**Problème concret :** Le motif de difficulté « répétition 6 cartes faible » décrit l'alternative incorrecte 2♠ au lieu de la réponse retenue 2♣ Roudi ; la main, la séquence, la consigne et le corrigé concordent déjà.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `difficultyReason`.

**Main proposée :** ♠AD10974 · ♥86 · ♦R93 · ♣82 — **9 H**, distribution 6–2–3–2.

**Séquence proposée :** `Partenaire : 1♣` ; `Adversaire : Passe` ; `Vous : 1♠` ; `Adversaire : Passe` ; `Partenaire : 1SA` ; `Adversaire : Passe`.

**Consigne proposée :** « Vous êtes Sud, donneur Nord. Séquence 1♣–Passe–1♠–Passe–1SA–Passe. Votre main vaut 11 HL avec six Piques et non une simple main faible. Jouant le Roudi trois réponses qui s’emploie aussi avec une sixième majeure et 11–12 HL, que répondez-vous ? »

**Choix proposée :** `Passe` ; `2♣` ; `2♠` ; `3♠`.

**Bonne réponse proposée :** **2♣**.

**Explication proposée :** « Avec une majeure sixième et exactement 11–12 HL, utilisez 2♣ Roudi pour préciser le fit et la force de l’ouvreur. La répétition directe 2♠ s’emploie ici avec une main plus faible. »

**Motif de difficulté proposée :** « Déclencher 2♣ Roudi après 1♣–1♠–1SA avec six Piques et 11 HL (9 H + 2 de longueur), et non répéter faiblement 2♠. »

**Impact sur la bonne réponse :** aucun changement ; même main, même séquence, mêmes choix et même corrigé. **Niveau de confiance :** Élevé pour la correction du motif (Roudi trois réponses explicitement indiqué).

---

### 9. `SEF-L25-007` — Texas Trèfle : explication déjà arbitrée

**Contenu original V1** (thème : `sa` ; famille : `LOT25-2026-11-13-007` ; difficulté : 4/5)

**Main originale :** ♠AD82 · ♥A94 · ♦R76 · ♣R103 — **16 H**, distribution 4–3–3–3.

**Séquence originale :** `Vous : 1SA (15–17 H)` ; `Adversaire : Passe` ; `Partenaire : 2♠ (Texas pour les Trèfles)` ; `Adversaire : Passe`.

**Consigne originale :** « Vous ouvrez de 1SA avec 16 H et votre partenaire annonce 2♠ Texas Trèfle. Vous possédez ♣R103 : un gros honneur exactement troisième et une main favorable au développement de la longue Trèfle du partenaire. Quelle rectification modulée l'indique ? »

**Choix originale :** `2SA` ; `3♣` ; `3♦` ; `3SA`.

**Bonne réponse originale :** **2SA**.

**Explication originale :** « Sur 1SA–2♠ (Texas Trèfle), une modulation prévue au SEF permet à l'ouvreur maximum avec un gros honneur troisième à Trèfle de dire 2SA au lieu de 3♣. Ici ♣R103 remplit cette condition et améliore les chances de communications à Trèfle. Sans gros honneur troisième, l'ouvreur rectifie à 3♣. »

**Motif de difficulté originale :** « Texas Trèfle : modulation de l'ouvreur à 2SA avec gros honneur troisième et main maximum. »

**Problème concret :** L'explication source exige une « main maximum » alors que l'utilisatrice a déjà validé l'interprétation de 2SA comme modulation positive avec un gros honneur troisième et une main non minimum, ici 16 H. L'enchère et la consigne sont déjà compatibles.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `explain`.

**Main proposée :** ♠AD82 · ♥A94 · ♦R76 · ♣R103 — **16 H**, distribution 4–3–3–3.

**Séquence proposée :** `Vous : 1SA (15–17 H)` ; `Adversaire : Passe` ; `Partenaire : 2♠ (Texas pour les Trèfles)` ; `Adversaire : Passe`.

**Consigne proposée :** « Vous ouvrez de 1SA avec 16 H et votre partenaire annonce 2♠ Texas Trèfle. Vous possédez ♣R103 : un gros honneur exactement troisième et une main favorable au développement de la longue Trèfle du partenaire. Quelle rectification modulée l'indique ? »

**Choix proposée :** `2SA` ; `3♣` ; `3♦` ; `3SA`.

**Bonne réponse proposée :** **2SA**.

**Explication proposée :** « 2SA est une modulation positive du Texas Trèfle. L’ouvreur montre un complément intéressant dans la couleur longue du partenaire, ici ♣R103 (Roi troisième), avec une main non minimum. L’objectif est de signaler ce soutien à Trèfle, et non de promettre obligatoirement une main maximum de 17 H : 16 H avec ce complément conviennent. Sans les conditions de cette modulation positive, la rectification normale est 3♣. »

**Motif de difficulté proposée :** « Texas Trèfle : modulation de l'ouvreur à 2SA avec gros honneur troisième et main maximum. »

**Impact sur la bonne réponse :** aucun changement ; même main, même séquence, mêmes choix et même corrigé. **Niveau de confiance :** Élevé pour la fidélité à la décision explicite du 20/11 ; portée SEF générale à distinguer des variantes de convention.

---

### 10. `SEF-V44-027` — Texas majeur : motif étiqueté Stayman

**Contenu original V1** (thème : `stayman` ; famille : `v44-cas-027` ; difficulté : 3/5)

**Main originale :** ♠V10753 · ♥AR6 · ♦1072 · ♣V6 — **9 H**, distribution 5–3–3–2.

**Séquence originale :** `Partenaire : 1SA` ; `Vous : 2♥ (Texas Pique)` ; `Partenaire : 2♠`.

**Consigne originale :** « Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♥ pour les Piques, rectifié par l'ouvreur à 2♠. Quelle est votre deuxième enchère ? »

**Choix originale :** `2SA` ; `3♠` ; `3SA` ; `4♠`.

**Bonne réponse originale :** **2SA**.

**Explication originale :** « Avec exactement cinq Piques (♠V10753), 9 H et la forme 5-3-3-2, la rectification du Texas n'assure pas que l'ouvreur possède trois cartes dans votre majeure. 2SA constitue une invitation de manche : selon sa force et son soutien, l'ouvreur pourra passer, jouer 3SA ou choisir la majeure. »

**Motif de difficulté originale :** « Réévaluer la manche ou le fit après la réponse au Stayman »

**Problème concret :** Le motif de difficulté prétend tester une réponse au Stayman ; la séquence contient un Texas Pique 2♥ rectifié à 2♠, pas de Stayman. Aucune anomalie établie du corrigé 2SA.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `difficultyReason`.

**Main proposée :** ♠V10753 · ♥AR6 · ♦1072 · ♣V6 — **9 H**, distribution 5–3–3–2.

**Séquence proposée :** `Partenaire : 1SA` ; `Vous : 2♥ (Texas Pique)` ; `Partenaire : 2♠`.

**Consigne proposée :** « Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♥ pour les Piques, rectifié par l'ouvreur à 2♠. Quelle est votre deuxième enchère ? »

**Choix proposée :** `2SA` ; `3♠` ; `3SA` ; `4♠`.

**Bonne réponse proposée :** **2SA**.

**Explication proposée :** « Avec exactement cinq Piques (♠V10753), 9 H et la forme 5-3-3-2, la rectification du Texas n'assure pas que l'ouvreur possède trois cartes dans votre majeure. 2SA constitue une invitation de manche : selon sa force et son soutien, l'ouvreur pourra passer, jouer 3SA ou choisir la majeure. »

**Motif de difficulté proposée :** « Après Texas Pique 1SA–2♥–2♠, inviter à la manche par 2SA avec cinq Piques et 9 H, en distinguant la recherche du fit 5–3 d'une majeure sixième. »

**Impact sur la bonne réponse :** aucun changement ; même main, même séquence, mêmes choix et même corrigé. **Niveau de confiance :** Élevé pour l'erreur de motif ; assez élevé pour le corrigé dans l'accord enseigné, sous contrôle éditorial.

---

### 11. `SEF-V44-030` — Texas majeur : motif étiqueté Stayman

**Contenu original V1** (thème : `stayman` ; famille : `v44-cas-030` ; difficulté : 3/5)

**Main originale :** ♠94 · ♥ARV753 · ♦V52 · ♣103 — **9 H**, distribution 2–6–3–2.

**Séquence originale :** `Partenaire : 1SA` ; `Vous : 2♦ (Texas Cœur)` ; `Partenaire : 2♥`.

**Consigne originale :** « Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♦ pour les Cœurs, rectifié par l'ouvreur à 2♥. Quelle est votre deuxième enchère ? »

**Choix originale :** `3♥` ; `2SA` ; `3SA` ; `4♥`.

**Bonne réponse originale :** **3♥**.

**Explication originale :** « Votre main de 9 H compte six Cœurs (♥ARV753), ce qui garantit au moins huit atouts face à un ouvreur de 1SA même s'il n'en a que deux. Après la rectification du Texas, 3♥ est une proposition de manche dans la longue, à distinguer du 2SA avec seulement cinq cartes. »

**Motif de difficulté originale :** « Réévaluer la manche ou le fit après la réponse au Stayman »

**Problème concret :** Le motif de difficulté parle de Stayman alors que 2♦ est un Texas Cœur, rectifié par l'ouvreur à 2♥ ; la justification de 3♥ doit rester une invitation avec six cartes.

**Proposition éditoriale complète, non activée** — champs candidats modifiés : `difficultyReason`.

**Main proposée :** ♠94 · ♥ARV753 · ♦V52 · ♣103 — **9 H**, distribution 2–6–3–2.

**Séquence proposée :** `Partenaire : 1SA` ; `Vous : 2♦ (Texas Cœur)` ; `Partenaire : 2♥`.

**Consigne proposée :** « Votre partenaire a ouvert de 1SA (15–17 H). Vous avez fait un Texas à 2♦ pour les Cœurs, rectifié par l'ouvreur à 2♥. Quelle est votre deuxième enchère ? »

**Choix proposée :** `3♥` ; `2SA` ; `3SA` ; `4♥`.

**Bonne réponse proposée :** **3♥**.

**Explication proposée :** « Votre main de 9 H compte six Cœurs (♥ARV753), ce qui garantit au moins huit atouts face à un ouvreur de 1SA même s'il n'en a que deux. Après la rectification du Texas, 3♥ est une proposition de manche dans la longue, à distinguer du 2SA avec seulement cinq cartes. »

**Motif de difficulté proposée :** « Après Texas Cœur 1SA–2♦–2♥, inviter à la manche à 3♥ avec six Cœurs, 9 H et un fit d'au moins huit atouts. »

**Impact sur la bonne réponse :** aucun changement ; même main, même séquence, mêmes choix et même corrigé. **Niveau de confiance :** Élevé pour l'erreur de motif ; assez élevé pour la séquence et la réponse dans l'accord enseigné.

---

## Vérifications de cohérence et limites

- **11 IDs uniques** ; chaque original a **13 cartes**, une distribution cohérente avec les 13 cartes, le total H déclaré et une seule bonne réponse parmi quatre choix distincts ; aucun QCM reconstruit artificiellement à partir de V2.
- Dans les **7 mains candidates modifiées**, exactement **+1 H par Valet**, **6 H = 6 HLD**, répartition originale conservée, 3 atouts sans courte, essai couleur sans honneur utile quand requis ; leur 2M antérieur devient SEF-compatible. La qualité de la carte ajoutée et de la main après retouche reste un **arbitrage éditorial**, non une validation définitive d'enchère.
- **7/7** bonnes réponses d'essais inchangées (3♥/3♠) ; **4/4** autres bonnes réponses inchangées (`2♣`, `2SA`, `2SA`, `3♥`). **11/11 séquences, 11/11 jeux de choix et 11/11 IDs maintenus**.
- Les questions **L10-030, V44-027, V44-030** ne demandent que la correction du `difficultyReason`. **L25-007** ne demande que la révision de `explain` **déjà validée**. Seuls les 7 premiers proposent la substitution de cartes et un meilleur libellé de consigne/corrigé explicatif.
- **Réserve Texas :** le qualificatif « réponse au Stayman » dans `difficultyReason` est incorrect ; le groupe historique `stayman` peut fonctionner comme rubrique englobante, ce qui n'autorise pas une migration implicite du thème ou de la compétence.
- **Réserve L25-007 :** conserver la signification approuvée de la modulation 2SA ; en cas de divergence avec une fiche de convention extérieure, expliciter l'accord de la paire plutôt que changer l'explication validée en « maximum absolu ».
- **Réserve après-fit :** si l'utilisatrice préfère ne pas modifier des mains originelles, l'alternative honnête est **de laisser les sept exercices en attente de correction/homologation**, et non de faire croire que 5 HLD suffisent au soutien simple.

## Proposition de validation groupée (aucun choix présumé accepté)

| Groupe à valider | IDs | Décision souhaitée |
|---|---|---|
| **D1 — 7 soutiens simples** | `SEF-V4-009-1`, `SEF-V4-011-1`, `SEF-V4-021-1`, `SEF-V4-023-3`, `SEF-V416-006`, `SEF-V418-006`, `SEF-V421-012` | Accepter les sept mains à 6 HLD et les reformulations, demander modifications individuelles, ou maintenir les 7 en attente. |
| **D2 — Roudi** | `SEF-L10-030` | Accepter seulement le nouveau motif ; `2♣` conservé. |
| **D3 — Texas Trèfle** | `SEF-L25-007` | Confirmer l'application documentaire **sans nouvelle réinterprétation** de l'explication déjà validée ; `2SA` conservé. |
| **D4 — Texas majeur** | `SEF-V44-027`, `SEF-V44-030` | Accepter les deux nouveaux motifs Texas ; réponses inchangées. |

**Statut final de LOT D : 11 propositions rédigées ; 0 correction de QCM appliquée ; 0 classification activée ; 0 autorisation de publication ; 0 fusion.** L'unique fichier créé par cette PR doit être ce document `Docs/` ; aucun moteur, catalogue, exercice, historique ou interface ne doit être touché.

# Audit des quatre propositions du Quizz QPJB — 1er novembre 2026

## Périmètre

Relevé des **993 exercices SEF**, répartis en **22 rubriques**, soit **3 972 propositions** (993 bonnes enchères et 2 979 distracteurs).

**Principe pédagogique :** les trois mauvaises propositions doivent représenter des erreurs *compréhensibles* sur la force, la distribution, le fit, le palier ou les conventions, et non trois enchères absurdes. Elles doivent rester clairement fausses dans la situation donnée, avec le SEF comme référentiel unique, sans accords de paire supplémentaires.

## Modifications effectuées

Entre la version `prototype-2026-11-01-v4-30-libre-puis-qcm` et la version `v4-33-audit-pieges` :

| Mesure | Résultat |
|---|---:|
| Exercices conservés | 993 / 993 |
| Identifiants supprimés | 0 |
| Bonnes enchères modifiées | 0 |
| Distracteurs remplacés | **93** |
| Exercices avec au moins un distracteur amélioré | **83** |
| Contrôles de cohérence des quatre choix | 993 / 993 |

### Exemples représentatifs

| Problème | Avant | Après | Intention |
|---|---|---|---|
| 1SA et répondant très faible | 3SA | 2♦ | Mauvais Texas avec trop peu de Cœurs, plutôt qu'une manche manifestement exclue |
| 1m–1M–1SA avec 6–7 H | 3SA | 2♣ | Utilisation intempestive du Roudi |
| Réponse à un contre d'appel avec 3–7 H | 2SA | 2M avec saut | Confusion entre réponse minimum et saut invitant |
| Réponse à un contre d'appel avec 9–10 H | 3SA | 3M | Excès de soutien au lieu d'une réponse invitante adaptée |
| Sur une intervention adverse avec une main nulle | 3SA | 2M | Soutien insuffisant mais tentant |
| Stayman, majeure non trouvée | Saut à la manche opposée | Enchère au palier de 3 ou invitation à SA | Faire travailler le sens des réponses au Stayman |
| Drury et Roudi | Passe sur réponse artificielle | Repli ou invitation inadaptée | Comparer des décisions de continuation effectivement envisageables |

Les modifications n'ajoutent aucune convention qui nécessiterait un accord de paire particulier.

## Contrôle automatique après amélioration

Le contrôle systématique a comparé les enchères, les points H, la distribution, les séquences et les alternatives effectivement correctes dans d'autres exercices du catalogue. Une proposition peut rester très instructive sans jamais être correcte ailleurs.

| Catégorie indicative | Exercices |
|---|---:|
| Signal automatique favorable | **794** |
| Vigilance / à relire | **188** |
| Revue prioritaire selon les critères automatiques | **11** |
| **Total** | **993** |

**2 421 des 2 979 mauvaises propositions** sont aussi des bonnes réponses dans au moins un autre exercice avec une séquence normalisée identique. Cela suggère des choix pédagogiques contrastifs, mais ne suffit pas à prouver leur pertinence dans la main étudiée.

Le contrôle structurel existant vérifie également qu'il y a quatre enchères distinctes, que la réponse attendue est offerte et que les contrats non encore disponibles ne figurent pas parmi les choix. Aucun choix de contrat impossible n'a été détecté par ce contrôle, qui a lui-même des limites (par exemple l'interprétation de certaines enchères artificielles).

## Revue prioritaire : ne signifie pas « erreur confirmée »

Les onze exercices principalement signalés sont :
`SEF-V3-077-2`, `SEF-V44-045`, `SEF-V44-067`, `SEF-V44-068`, `SEF-V410-027`, `SEF-V413-002`, `SEF-V421-003`, `SEF-V421-005`, `SEF-V422-002`, `SEF-V423-006` et `SEF-V424-007`.

Ils présentent souvent des séquences peu représentées dans le reste de la base : aucun autre exercice ne démontre qu'une alternative y serait parfois la bonne. Plusieurs alternatives restent cohérentes comme **erreurs de débutant** : confusion entre soutien simple et invitation, absence de fit, mauvais usage du Spoutnik ou réponse à un contre d'appel.

**Point d'attention supplémentaire sur la réponse correcte elle-même :** l'exercice `SEF-V49-016` retient 2♣ Stayman après 1SA avec 6 H et deux majeures quatrièmes. Le seuil standard du Stayman mérite ici une revue spécifique, ainsi que la comparaison avec `SEF-V412-016` (5 H, Passe). La bonne réponse a été **laissée inchangée** pour ne pas modifier les résultats sans vérification approfondie.

## Ce que cet audit permet — et ne permet pas

- Tous les exercices ont subi des contrôles systématiques et les choix clairement caricaturaux les mieux identifiés ont été corrigés.
- L'audit n'est **pas** une certification manuelle indépendante de chaque enchère et de chacun des 2 979 distracteurs.
- Les jugements de force en HLD, de vulnérabilité ou de continuation conventionnelle peuvent dépendre d'informations absentes de certains énoncés.
- Un QCM avec trois erreurs très proches n'est pas toujours possible lorsqu'il s'agit d'un relais obligatoire : une erreur simple et instructive reste parfois préférable à une alternative artificiellement compliquée.
- Une revue pédagogique plus poussée devra prioriser les 188 cas en vigilance et vérifier que certains distracteurs séduisants ne constituent pas en réalité une deuxième bonne enchère.

## Documents et automatisation

- [Relevé des 993 exercices et de leurs quatre propositions](./quizz-993-propositions-2026-11-01.csv)
- [Données sources du Quizz](../quizz.html)
- [Script d'audit automatique](../tests/quizz-quality.cjs)

La suite de validation GitHub produit également deux fichiers `artifacts/quizz-content/qualite-993.csv` et `qualite-993.md` à chaque exécution, pour surveiller les évolutions futures.


---

## Lot 2 — revue des 199 exercices signalés (1er novembre 2026)

L'audit complémentaire prend pour point de départ les **199 exercices initialement signalés** par le score automatique (11 « prioritaires », 188 « vigilance »). Il étudie leurs mauvaises propositions par familles pédagogiques et distingue les **pièges utiles** (erreurs fréquentes, néanmoins bien fausses) des propositions vraiment trop évidentes. Ce n'est pas une attestation de perfection délivrée par un expert indépendant.

| Action sur les 199 situations | Nombre |
|---|---:|
| Au moins une proposition remplacée dans ce lot | **11** |
| Comparaison pédagogique « Pourquoi pas ? » ajoutée, sans remplacement supplémentaire | **37** |
| Pièges conservés après revue thématique | **151** |
| **Total** | **199** |

Le total des modifications depuis l'audit initial V4.30 est désormais de **104 mauvaises propositions remplacées dans 94 exercices**, auquel s'ajoute **une correction de bonne réponse** sur un cas de seuil Stayman. Les 993 exercices et leurs identifiants sont conservés. **47 explications ciblées** ont été ajoutées, portant le total des comparaisons pédagogiques intégrées à **125**.

### Correction de fond : Stayman à 6 H

- `SEF-V49-016` montre 4 Piques, 4 Cœurs et seulement **6 H** face à 1SA 15–17 H. Le bon choix a été rectifié de **2♣** à **Passe**, conformément au Stayman classique (au moins 8 H). `2♣` est désormais proposé comme erreur tentante.
- La famille pédagogique `cas-148` devient intentionnellement contrastive : avec 6 H on passe, avec 8 H dans la variante `SEF-N096-1`, on peut employer le Stayman. Cela transforme une ancienne incohérence en comparaison de seuil réellement instructive.
- Seul l'exercice corrigé est remis « à refaire » lors de la première ouverture ; **son résultat historique est archivé dans la sauvegarde locale** au lieu d'être effacé. Toutes les autres progressions sont préservées.

### Pièges remplacés dans les enchères compétitives

Dans **dix** exercices après intervention adverse, une proposition de **3SA très peu crédible avec 6 à 9 H** a été remplacée par une nouvelle couleur au palier de 2 ou 3. La nouvelle proposition semble tentante lorsqu'on détient quatre cartes dans cette couleur, mais elle ne remplit pas les exigences de force/longueur d'un changement de couleur naturel dans la séquence concernée. Le soutien de la majeure ouverte reste l'enchère attendue.

### Pièges maintenus volontairement

- **Réponse au contre d'appel :** « Passe » après le contre du partenaire et le passe de l'adversaire de droite est une erreur typique de débutant. Elle est pédagogiquement bonne quand la main ne permet pas de transformer le contre en pénalité. **26 explications** ont été ajoutées à ces situations.
- **Stayman/Texas :** passer sur une réponse artificielle, inviter avec trop peu de force, choisir le mauvais transfert ou réclamer une manche en majeure sans fit sont des contrastes utiles, même lorsque l'enchère erronée paraît immédiatement fausse à un joueur expérimenté.
- **Réponses après fit, Drury, deuxième enchère :** une invitation trop ambitieuse, une préférence 5–2 plutôt que le fit 4–4 ou une confusion entre 2SA naturel et fitté sont des erreurs intéressantes à distinguer. Les onze cas prioritaires ont été examinés et enrichis quand un contraste clair manquait.
- **Réveils :** les annonces de 1SA, 2SA et Contre de réveil mettent en évidence les différences de force et de distribution. Le score automatique de proximité est un mauvais juge de l'utilité de ces pièges.

### Deux frontières de système à clarifier lors d'un audit des *bonnes* réponses

1. **1M–1SA forcing :** quelques exercices utilisent explicitement cette convention ; dans le SEF standard, la réponse de 1SA sur une majeure est normalement non forcing. Ce point peut rendre « Passe » une option plus défendable qu'attendu selon la présentation de la convention. Les enchères correctes existantes n'ont pas été réécrites sans harmonisation globale du référentiel pédagogique.
2. **Drury et 2SA fitté du SEF 2024 :** en troisième position, le traitement des mains fittées à quatre atouts avec singleton mérite une vérification distincte. Les séquences déjà engagées par un Drury n'ont pas été supprimées à ce stade.

### Scores et documents finaux

Après les nouvelles modifications, le classement automatique (indicatif) est : **831 signal favorable, 152 vigilance, 10 prioritaires**. Ces catégories ne mesurent ni la difficulté réelle ni une certitude de bon choix. La revue est documentée dans :

- [Revue des 199 exercices signalés](./quizz-revue-199-2026-11-01.csv), avec décision et motif pour chaque cas ;
- [Relevé actualisé des 993 exercices](./quizz-993-propositions-2026-11-01.csv), avec les quatre réponses et les modifications depuis la base initiale ;
- [Vérifications programmatiques](../tests/quizz-quality.cjs) relancées avec GitHub Actions.

**Références sur les conventions :** club Alençon FFB, « Stayman » (2021), https://alenconbridge.club.ffbridge.fr/en-savoir-plus/stayman-112041 ; Jean-Christophe Quantin, « La réponse de 1SA à l'ouverture », https://www.colybridge-enseignants.com/images/AsdeTrefle/Encheres/n32_-_La_rponse_de_1SA__louverture.pdf ; Sarzeau Bridge Club FFB, « Quand la réponse de 2SA est-elle fittée ? » (2025), https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523.

---

## Lot 3 — alignement SEF 2024 sur 1M–1SA et Drury (1er novembre 2026)

**Statut : corrections intégrées au catalogue V4.35.** Le catalogue conserve **993 exercices et 22 rubriques**. Le contrôle des mains et des conventions a confirmé quatre anciennes réponses incorrectes dans le Drury, ainsi qu'une main à rectifier pour respecter l'étendue du 1SA non forcing.

### 1M–1SA : désormais explicitement non forcing

Dans le **SEF**, la réponse de 1SA à l'ouverture de 1♥ ou 1♠ est **non forcing** (zone usuelle 5–10 HL, sans fit majeur adapté). Le 1SA forcing utilisé dans certaines paires n'est pas le référentiel de cette application débutant.

Onze exercices qui mentionnaient la variante forcing ont été harmonisés. Les redemandes de l'ouvreur restent possibles : **non forcing ne signifie pas que l'ouvreur doit passer**, mais seulement qu'il en a la faculté avec une main appropriée.

- `SEF-V421-004` : la main initiale comptait 11 H, incompatibles avec le choix préalable de 1SA non forcing ; le Roi de Pique a été remplacé par une Dame, donnant **10 H**, sans changer la distribution ni la continuation attendue à 3♥.
- `SEF-V49-011` et `SEF-C-008` : les bonnes réponses 1SA sont conservées, mais les explications ne les présentent plus à tort comme forcing.
- Les séquences de 1SA non forcing déjà données (sans libellé erroné) restent inchangées.

### Drury et 2SA fitté après Passe d'entrée

En troisième position après Passe, le **Drury fitté** à 2♣ s'emploie à partir de 11 HLD avec trois atouts ; avec quatre atouts, le Drury suppose 11 HLD ou plus **sans singleton ni chicane**.

Le **2SA fitté** indique au moins quatre atouts et une courte (singleton/chicane), avec au moins 11 HLD.

| Exercice | Ancienne bonne enchère | Nouvelle bonne enchère | Motif |
|---|---|---|---|
| `SEF-V4-097-1` | 2♣ Drury | **2♥** | Trois Cœurs, 10 HLD sans courte : seuil du Drury non atteint |
| `SEF-V4-103-1` | 2♣ Drury | **2♠** | Trois Piques, 10 HLD sans courte : soutien simple |
| `SEF-V44-067` | 4♥ après Drury | **2SA fitté** directement | Quatre Cœurs et singleton Trèfle : la question doit se poser dès la première réponse |
| `SEF-V44-068` | 4♠ après Drury | **2SA fitté** directement | Quatre Piques et singleton Trèfle : même traitement |

Pour ces quatre exercices, la séquence, les quatre propositions et les explications ont été révisées lorsque nécessaire. Leur correction pédagogique indique notamment pourquoi le Drury serait une erreur tentante dans le dernier couple.

### Progression et validation

Le mécanisme de migration archive l'historique des **quatre réponses rectifiées** et de **la main modifiée**, puis permet à l'élève de retravailler ces cinq situations. Les anciens historiques restent conservés, comme pour le Stayman à 6 H corrigé précédemment. Les autres exercices ne sont pas réinitialisés.

Le relevé des 993 exercices et celui des 199 situations initialement signalées ont été actualisés. Depuis la version V4.30, **cinq bonnes réponses** ont finalement été rectifiées (le Stayman et les quatre Drury) ; **104 mauvaises propositions** ont changé de position/valeur depuis la même référence. **127** exercices contiennent maintenant un contraste pédagogique explicite « Pourquoi pas ? ».

Les nouveaux tests automatisés vérifient la conformité des séquences 1M–1SA, les quatre bonnes réponses Drury/2SA et la conservation non destructive de la progression. L'exécution effective des suites de navigateurs doit rester distinguée de la seule validation de structure.

**Sources SEF :**
- BridgeSEF, « Les choix après l'ouverture de 1♥ ou 1♠ », avril 2025 : https://bridgesef.fr/wp-content/uploads/2025/04/Ouverture-1C-1P-1.pdf (SEF 1SA non forcing versus variantes non-SEF).
- « Les nouveautés du SEF », *L'As de Trèfle* (FFB), septembre 2024 : https://res.cloudinary.com/ffbridge/image/upload/v1725446344/production/cms/ADTN_52_BD_2_6a558ea8dd.pdf.
- Club du Haut Poitou, « SEF 2024 » : https://scjc-bridge.fr/sef-2024 (Drury et 2SA fitté après Passe).
- Sarzeau Bridge Club, « Quand la réponse de 2SA est-elle fittée ? », décembre 2025 : https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523.

---

## Lot 4 — redemandes de l'ouvreur après 1M–1SA non forcing (V4.36, 1er novembre 2026)

**Motif de la revue :** dans le SEF standard, la réponse de 1SA sur une ouverture majeure est **non forcing**. Même lorsqu'une redemande à la couleur est préférable, le simple fait de pouvoir passer rend « Passe » trop équivoque comme *mauvaise réponse nécessaire* dans certains QCM. L'objectif est d'enseigner le meilleur choix économique, sans qualifier abusivement Passe d'enchère interdite.

### Corrections des onze exercices

| ID | Réponse conservée | Ancienne proposition retirée | Nouveau piège |
|---|---|---|---|
| `SEF-049-1`, `SEF-049-2`, `SEF-N127-2` | 2♥ | Passe | 3♥ (saut excessif avec cinq Piques et quatre Cœurs) |
| `SEF-050-2`, `SEF-N123-1`, `SEF-N123-2` | 2♠ | Passe | 3♠ (répétition à saut trop ambitieuse) |
| `SEF-N122-1` | 2♥ | Passe | 3♥ (saut trop fort pour 13 H) |
| `SEF-N128-2` | 2♦ | Passe | 3♦ (saut trop fort sur bicolore 5–4) |
| `SEF-N129-2`, `SEF-N131-1` | 2♣ | Passe | 3♣ (saut trop fort sur bicolore 5–4) |
| `SEF-V410-005` | 2♦ | Passe | 3♦ (saut excessif avec 14 H) |

Les onze contextes rappellent maintenant explicitement le caractère non forcing de 1SA. **Dix nouveaux corrigés comparatifs** `whyNot` / `takeaway` ont été ajoutés (le onzième en possédait déjà un). Aucun exercice, aucune bonne enchère ni aucun identifiant n'a changé. La progression enregistrée reste donc applicable sans migration.

Les trois mauvaises propositions demeurent des enchères naturelles et légales dans la séquence : les erreurs à reconnaître portent désormais sur la **force du saut**, la **longueur de la couleur** ou la **bonne description du bicolore**, au lieu d'une permission de passer dépendant de l'appréciation de l'ouvreur.

### Contrôle indicatif après modifications

| Indicateur | Avant V4.36 | V4.36 |
|---|---:|---:|
| Exercices | 993 | 993 |
| Signal automatique favorable | 833 | **844** |
| Vigilance | 152 | **141** |
| Priorité | 8 | **8** |
| Contrastes pédagogiques explicites | 127 | **137** |

Ces scores sont des **indicateurs heuristiques** et ne certifient pas les enchères. Une revue individuelle reste nécessaire pour les 149 exercices encore signalés (141 vigilance et 8 prioritaires). Le fichier CSV des 993 exercices a été synchronisé et une régression automatique contrôle les onze situations.

**Références pédagogiques :** Jean-Christophe Quantin, « La réponse de 1SA à l'ouverture », *L'As de Trèfle* : https://www.colybridge-enseignants.com/images/AsdeTrefle/Encheres/n32_-_La_rponse_de_1SA__louverture.pdf ; fiche SEF « Redemande de l'ouvreur après l'enchère de 1 SA », https://dev.ibridge-club.fr/public/fichedetails/40.

---

## Lot 5 — pièges plus réalistes avec de très petites mains (V4.37, 1er novembre 2026)

**Périmètre :** revue individuelle de **22 des 149 exercices encore signalés** par le score heuristique après V4.36. Une vigilance automatique n'est pas une erreur avérée : ce lot cible principalement les mauvaises propositions caricaturales avec 0 à 4 points H et les réponses pouvant être mal interprétées par un débutant.

### Sept distracteurs effectivement remplacés

| Cas | Séquence | Main du répondant | Ancien piège | Nouveau piège | Réponse SEF conservée |
|---|---|---|---|---|---|
| `SEF-V3-085-3` | 1♥ – (1♠) | 3 H, quatre Trèfles | 2SA | **2♣** | Passe |
| `SEF-V3-086-1` et `-2` | 1♥ – (2♣) | 1 / 3 H, quatre Carreaux | 2SA | **2♦** | Passe |
| `SEF-V3-087-3` et `-2` | 1♠ – (2♣) | 0 / 4 H, quatre Carreaux | 2SA | **2♦** | Passe |
| `SEF-V3-088-2` et `-1` | 1♠ – (2♦) | 1 / 4 H, trois Cœurs | 2SA | **2♥** | Passe |

Ces remplacements conservent des enchères possibles dans l'ordre des annonces mais fausses avec la main présentée. Le piège fait désormais hésiter entre passer et **annoncer trop tôt une couleur** : il mobilise conjointement la force de la réponse, sa longueur et le palier atteint. Sur ces sept cas, il n'y a **aucune modification de la bonne enchère**.

### Vingt-deux comparaisons pédagogiques nouvelles

Les nouveaux champs « Pourquoi pas ? » et « À retenir » accompagnent les sept cas ci-dessus et quinze situations déjà présentes :

- Deux interventions faibles sur 1♣ : différencier l'envie de contrer d'appel de la force et de la distribution réellement détenues.
- Deux soutiens après 1♠–(2♥) : préférer les trois Piques au changement de couleur à 3♣ avec seulement quatre cartes et 7–9 H.
- Deux réponses faibles après 1♣–(1♠) : quatre Cœurs ne suffisent pas à employer automatiquement le contre Spoutnik avec 0–4 H.
- Deux réponses à une ouverture de 2♠ faible : un simple doubleton Pique n'autorise pas un soutien de barrage à 3♠.
- Sept mains en position de réveil après 1♣, 1♦, 1♥ ou 1♠ : même en réveil, un contre requiert une base de force et de distribution.

Avec ces corrections, **159 des 993 exercices** comportent une explication comparative explicite, contre 137 en V4.36. Les 993 exercices, leurs identifiants, leurs bonnes réponses et l'historique des élèves sont préservés ; aucune migration n'est nécessaire.

### Ce qui reste volontairement inchangé

Les cas avec 0 à 4 H et une distribution 4-3-3-3 *sans longue dans une couleur non annoncée* ne disposent pas toujours de trois erreurs très crédibles : fabriquer artificiellement un changement de couleur serait aussi trompeur. Le contrôle ne classe pas un piège comme « excellent » simplement parce qu'il existe une explication supplémentaire.

**Bilan heuristique recalculé :** 844 signaux favorables, 141 vigilances et 8 priorités, soit les mêmes compteurs qu'en V4.36. **Ceci n'invalide pas les corrections** : les heuristiques mesurent la proximité avec d'autres cas et sont peu adaptées à l'évaluation d'erreurs de débutant sur des mains à 0–4 H. Les 149 cas restent signalés tant que le score automatique n'est pas réétalonné ; **22 ont bénéficié de cette revue manuelle et documentée**. Ne pas présenter ces compteurs comme une certification des 2 979 mauvaises réponses.

Le relevé de 993 propositions a été mis à jour ; des tests de non-régression vérifient le maintien de « Passe », les sept substitutions et la présence des 22 explications.

**Références pédagogiques :**
- FFB, *Manuel d'enseignement du bridge*, règles après intervention à la couleur : https://cdn.ffbridge.fr/cms/geds/0001/06/b203af67b05b104606507f79eeef5b19e552eacf.pdf
- iBridge, *Changement de couleur 2/1* : https://www.ibridge.fr/public/fichedetails/540
- Sarzeau Bridge Club (FFB), *Quand la réponse de 2SA est-elle fittée ?*, 21 décembre 2025 : https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523

---

## Lot 6 — Stayman/Texas et deuxième enchère du répondant (V4.38, 1er novembre 2026)

**Périmètre :** revue individuelle des **15 exercices Stayman/Texas** et **23 exercices « deuxième enchère »** encore signalés après V4.37, soit **38 situations** du catalogue des 993 exercices. Les bonnes enchères ont été conservées après examen : les améliorations portent sur la crédibilité des mauvaises réponses et sur la comparaison pédagogique.

### Cinq distracteurs révisés

| Exercice | Séquence | Réponse SEF | Mauvaise proposition retirée | Nouveau piège |
|---|---|---|---|---|
| `SEF-N140-1` | 1♣–1♠–1SA, 8 H et quatre Piques | **Passe** | 3SA, trop caricatural | **2♣ Roudi**, convention tentante mais inadaptée à quatre Piques |
| `SEF-V49-026` | 1♣–1♥–2♣, 6 H et cinq Trèfles | **Passe** | 2SA, trop ambitieux | **2♦ troisième couleur forcing**, mal employée avec une petite main |
| `SEF-V410-018` | 1♥–1♠–1SA, six Piques et huit H | **2♠** | 3♠, qui peut devenir discutable avec des honneurs concentrés | **2♥**, préférence trompeuse avec seulement deux Cœurs |
| `SEF-V3-021-2` | 2SA–3♣–3♦, quatre Piques et sept H | **3SA** | 4SA, proposition de chelem invraisemblable | **Passe**, piège sur la réponse artificielle de 3♦ |
| `SEF-V3-022-1` | 2SA–3♣–3♦, quatre Cœurs et cinq H | **3SA** | 4SA, proposition de chelem invraisemblable | **Passe**, même risque de confondre réponse artificielle et contrat naturel |

Ces cinq remplacements conservent des enchères techniquement possibles, mais inappropriées à la force, à la distribution ou au sens conventionnel de la séquence.

### Trente-deux nouveaux corrigés comparatifs

- **Stayman après 1SA :** distinguer 2SA invitant avec 8–9 H de 3SA avec une force de manche ; avec un fit 4–4, préférer 4 dans la majeure à une invitation devenue inutile. La réponse 2♦ exclut une majeure quatrième chez l'ouvreur.
- **Stayman après 2SA :** reconnaître que 3♦ est artificiel et ne doit pas devenir le contrat final ; choisir 3SA en l'absence de fit majeur.
- **Texas après 2SA :** avec six cartes, la manche est en principe à 4 dans la majeure ; avec cinq cartes et la force de manche, 3SA laisse l'ouvreur choisir 3SA ou 4M suivant son appui.
- **Deuxième enchère du répondant :** distinguer les mains limites et les réponses de manche, ne pas répéter quatre cartes comme une majeure cinquième/sixième, conserver un fit en mineure au palier économique, éviter le Roudi ou la troisième couleur forcing avec des mains inadaptées.

Les **six exercices de deuxième enchère** qui possédaient déjà un contraste explicatif ont été relus et conservés tels quels ; **17** autres en reçoivent un. Les **15 exercices Stayman/Texas** en reçoivent un également, d'où **32 nouveaux corrigés**, et **191 exercices avec comparaison explicite « Pourquoi pas ? »** dans le catalogue.

### Résultat et limites du contrôle

| Indicateur | Après V4.37 | Après V4.38 |
|---|---:|---:|
| Exercices | 993 | **993** |
| Signal favorable (heuristique) | 844 | **845** |
| Vigilance | 141 | **140** |
| Priorité | 8 | **8** |
| Corrigés comparatifs intégrés | 159 | **191** |

Une amélioration pédagogique n'entraîne pas nécessairement un meilleur score automatique : celui-ci mesure des analogies entre exercices et l'écart de palier, pas la qualité d'un piège pour un débutant. Les **148 exercices encore signalés** ne doivent pas être appelés « 148 erreurs ». Tous les identifiants, bonnes réponses, exercices et résultats d'élèves sont conservés ; aucune migration de progression n'est nécessaire.

Le relevé CSV des 993 exercices a été actualisé et une suite de régression vérifie explicitement les 38 situations et les 5 nouveaux distracteurs. Les vérifications sur navigateurs sont distinctes de ce rapport pédagogique.

**Références de contrôle :**
- AtoutBridge, « Réponses à l'ouverture au palier de 1 » (Stayman et invitation 2SA / 3SA) : https://www.atoutbridge.com/les-dossiers-du-mois/reponses-a-l-ouverture-au-palier-de-1-3/
- iBridge, « La convention 3ème couleur forcing » : https://www.ibridge.fr/public/fichedetails/575
- Référentiel SEF, Roudi : https://graulhetbridgeclub.wifeo.com/documents/jouez-au-bridge-sef.pdf

---

## Lot 7 — audit prioritaire, Spoutnik et Drury (V4.39, 1er novembre 2026)

**Méthode :** vérifier individuellement les huit exercices encore classés « Priorité » et les 52 exercices signalés dans les familles `intervenir`, `apres_inter`, `reponse_inter`, `contre` et `drury`. Comparer les règles du *SEF 2024* aux corrigés, chercher les pièges faciles et confirmer la légalité des quatre annonces. Ne pas confondre une alerte heuristique avec une erreur d'enchères.

### Trois vraies erreurs SEF 2024 corrigées

Le contrôle du **contre Spoutnik après une intervention à 1♦ ou à 1♥ sur une ouverture mineure** révèle une confusion entre le SEF et la convention dite « collante ». Dans le SEF 2024, le contre *dénie* une majeure quatrième dans ces séquences, alors que le répondant peut annoncer naturellement une majeure quatrième au palier de 1.

| Identifiant | Séquence | Main | Ancienne réponse fautive | Réponse SEF 2024 corrigée |
|---|---|---|---|---|
| `SEF-V410-025` | 1♦ – (1♥) – ? | ♠ AV32, 8 H | Contre | **1♠** naturel, 4 cartes |
| `SEF-V418-005` | 1♣ – (1♥) – ? | ♠ AV83, 8 H | Contre | **1♠** naturel, 4 cartes |
| `SEF-V420-009` | 1♣ – (1♦) – ? | 4 Cœurs et 4 Piques, 8 H | Contre | **1♥** naturel, majeure la moins chère |

**Justification documentaire directe :**

- Fiche iBridge « Le contre Spoutnik du répondant » : https://www.ibridge.fr/public/fichedetails/657 (contre sur 1♦ ou 1♥ : dénie une majeure quatrième ; après 1♠ ou à un palier supérieur, recherche les majeures non nommées).
- Olivier Chailley, *Le SEF 2024 (1)* : https://www.bridge-chailley.fr/le-sef-2024-1/ (1♣/♦–1♥–X : le contre dénie quatre Piques ; la convention contraire, « collante », n'est pas dans le SEF).

**Historique des élèves :** ces trois identifiants gardent leur main et leur situation mais changent de bonne réponse. La migration existante (`revisedSefNov2026`) reçoit trois codes pédagogiques supplémentaires. Lors du chargement, si l'élève avait déjà tenté un de ces exercices, son dossier antérieur est placé dans `archivedPreRevision`; seule la maîtrise courante de cet exercice est réinitialisée. Les autres progrès restent intacts, et la migration ne se répète pas après un rechargement. Test d'intégration dédié.

### Vérification des huit « Priorité » existants

| Identifiant | Bonne réponse maintenue | Justification vérifiée |
|---|---|---|
| `SEF-V44-045` | Surcontre | Après 1♥–(X), 11 H et seulement deux Cœurs : réponse positive sans fit |
| `SEF-V410-027` | Contre | Après 1♦–(2♣), 9 H et les deux majeures quatrièmes : contre Spoutnik |
| `SEF-V413-002` | Passe | Après 1♥–1♠–2♦, soutien 4–4 Carreau et seulement 8 H |
| `SEF-V421-003` | Passe | Après 1♠–1SA–2♥, fit Cœur 4–4 et réponse minimale de 7 H |
| `SEF-V421-005` | Passe | Après 1♥–1SA–2♦, cinq Carreaux en main, six H, fit mineur économique |
| `SEF-V422-002` | Passe | Quatrième position : règle des 15 = 10 H + 2 Piques = 12 |
| `SEF-V423-006` | Passe | Après 1♣–1♦–2SA (18–19 H), cinq H ne suffisent pas pour imposer 3SA |
| `SEF-V424-007` | Surcontre | Après 1♦–(X), 11 H sans soutien établi, surcontre constructif |

**Bilan des huit :** aucune correction de bonne réponse n'est justifiée. Tous disposent déjà d'un contraste « Pourquoi pas ? ». Le marquage automatique « Priorité » est conservé pour ne pas masquer une limite du modèle de scoring. L'audit a été consigné dans le relevé CSV sans prétendre avoir corrigé huit erreurs.

### Intervention, réponses et Drury : pièges améliorés

- **28 nouvelles explications contrastives** (`whyNot` / `takeaway`) ajoutées dans les familles intervention, réponse à l'intervention, contre d'appel et Drury.
- **9 mauvaises propositions remplacées** (exemples : 1♠ avec seulement trois cartes, 2♦ sans couleur assez longue après Passe, 3♥ comme simple invitation face à des valeurs de manche). Les pièges deviennent des erreurs de description plausibles plutôt que des annonces manifestement incohérentes.
- Distinction SEF 2024 après Passe : `2♣` Drury avec fit constructif et sans courte lorsqu'il y a quatre atouts ; `2SA` fitté avec quatre atouts, une courte et 11 HLD minimum ; `2M` au palier minimal après Drury signale une ouverture légère, alors que `2♦` est positif.
- Documentation Drury : https://www.ibridge.fr/public/fichepdf/113 et https://scjc-bridge.fr/sef-2024

### Contrôle de cohérence, version V4.39

| Indicateur | V4.38 | V4.39 |
|---|---:|---:|
| Nombre d'exercices | 993 | **993** |
| Erreurs de bonne réponse corrigées dans ce lot | — | **3** |
| Mauvaises propositions remplacées dans ce lot | — | **9** |
| Nouvelles explications comparatives dans ce lot | — | **30** |
| Exercices avec comparaison pédagogique | 191 | **221** |
| Signal automatique favorable | 845 | **850** |
| Vigilance | 140 | **135** |
| Priorité | 8 | **8** |

**Attention :** les 30 nouveaux corrigés correspondent aux 28 ajoutés sur des exercices sans contraste antérieur et aux 2 nouveaux comparatifs créés en corrigeant les réponses Spoutnik. Un troisième corrigé Spoutnik existant a été remplacé par le bon sens de l'enchère. L'heuristique est recalculée sur les 993 exercices, ce qui peut reclasser un exercice non modifié à cause des trois changements de bonnes réponses utilisés comme exemples de référence. Ces variations ne prouvent pas que l'exercice est devenu objectivement meilleur ou pire.

**Règles de publication :** tests d'intégrité et de non-régression sur les nouvelles règles Spoutnik, 9 distracteurs, 8 exercices prioritaires ; tests navigateur sur Chromium et WebKit, y compris l'archivage des anciennes tentatives. Déployer uniquement après réussite des tests sur la branche principale.

---

## Lot 8 — rechercher les choix potentiellement défendables (V4.40, 1er novembre 2026)

**Objectif de l'audit :** au lieu de réduire mécaniquement les scores de vigilance, repérer les QCM où une mauvaise proposition peut être **licite et raisonnable sous certaines conditions**, même si elle n'est pas le choix pédagogique recommandé pour la main affichée. Une enchère permise dans la séquence n'est pas nécessairement correcte avec la main donnée ; une mauvaise proposition n'a cependant pas à reposer sur une interdiction fictive.

### Trois mauvaises propositions « 2SA » retirées sur une ouverture de 2 faible

| Identifiant | Situation | Réponse conservée | Ancienne mauvaise proposition | Nouveau piège |
|---|---|---|---|---|
| `SEF-V3-108-1` | Face à 2♠ faible ; 15 H et quatre Piques | **4♠** | 2SA | 3♦, alors que la main n'a que trois Carreaux |
| `SEF-V44-049` | Face à 2♠ faible ; 11 H et quatre Piques | **4♠** | 2SA | 3♦, avec quatre Carreaux insuffisants pour un changement de couleur naturel forcing |
| `SEF-V426-004` | Face à 2♥ faible ; 13 H, deux Cœurs et quatre Carreaux | **Passe** | 2SA | 3♦, couleur seulement quatrième et non constructive |

**Pourquoi ?** En SEF, **2SA après une ouverture de 2 faible peut être un relais interrogatif avec un espoir de manche**. C'est donc une mauvaise idée de le présenter systématiquement comme une enchère absurde. Les nouveaux pièges demandent de distinguer une vraie couleur forcing au palier de 3 d'une couleur accessoire trop courte. Les bonnes réponses existantes sont conservées ; il ne s'agit pas de prétendre que 2SA serait le meilleur choix avec ces trois mains, mais d'éviter une condamnation pédagogique trop absolue.

**Référence :** https://bridgesef.fr/wp-content/uploads/2025/07/Ouverture-2C.pdf (ouvertures 2♥/2♠ faibles, relais 2SA avec espoir de manche, changement de couleur naturel et forcing).

### Trente-deux corrections comparatives supplémentaires

**Répartition par décision étudiée :**
- **Trois situations d'ouverture de 2 faible :** différence entre relais exploratoire, soutien direct ou Passe, et nouvelle couleur forcing.
- **Neuf réponses à une enchère d'essai après fit majeur :** pourquoi 3♥/3♠ refuse la manche avec un soutien minimum, et 4♥/4♠ l'accepte avec une réponse maximum ; cas au palier de 2SA ou en couleur.
- **Deux invitations quantitatives à 4SA :** éviter d'imposer 6SA avec seulement 31 H combinés au minimum ; 4SA n'est pas un Blackwood en l'absence de fit connu.
- **Sept conventions de troisième ou quatrième couleur forcing :** distinguer l'enchère artificielle d'une répétition naturelle de majeure (longueur et force), ou d'une conclusion prématurée à Sans-Atout sans arrêt adéquat.
- **Deux défenses contre 1SA adverse ou sur une intervention sur 1SA :** Multi-Landy (2♦ unicolore majeure vs 2♠ majeure-mineure) et Rubensohl (contre avec quatre Piques vs 2♠ naturel plus long).
- **Trois développements du Roudi :** fit confirmé / refusé, minimum / maximum, proposition de manche vs conclusion.
- **Trois réponses à Sans-Atout (Texas et Stayman classique) :** utiliser le transfert et éviter Stayman sans force de réponse.
- **Une réponse à 1♣ avec 14 H réguliers :** pourquoi 3SA plutôt que l'invitation à 2SA.
- **Une ouverture régulière de 22 H :** nécessité de passer par 2♣ plutôt que d'ouvrir de 2SA.
- **Une réponse compétitive sur 2♠ faible contré :** pourquoi 3♠ avec cinq H plutôt que 4♠.

Toutes ces **32 explications « Pourquoi pas ? » / « À retenir »** s'ajoutent aux précédentes, soit **253 exercices avec comparaison explicite** sur 993. Les nouveaux contrastes portent sur des choix plausibles à première vue, et non sur des enchères illégales.

**Références de contrôle :**
- SEF 2024 et 4SA quantitatif : https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/
- Troisième couleur forcing : https://www.ibridge.fr/public/fichedetails/575
- Multi-Landy : https://www.ibridge.fr/public/fichedetails/611

### Bilan actualisé et limites

| Indicateur | V4.39 | V4.40 |
|---|---:|---:|
| Nombre total d'exercices | 993 | **993** |
| Bonnes réponses modifiées | — | **0** |
| Alternatives litigieuses remplacées | — | **3** |
| Comparaisons pédagogiques cumulées | 221 | **253** |
| Signal automatique favorable | 850 | **854** |
| Vigilance | 135 | **131** |
| Priorité | 8 | **8** |

Les 139 signaux restants ne correspondent pas à 139 erreurs : ils comprennent des comparaisons pédagogiques délibérées entre mains voisines de force différente. Le score automatique est conservé comme **outil de tri**, pas comme certificateur des 2 979 mauvaises propositions.

**Non-régression :** les 993 identifiants, leurs mains, leurs séquences, leurs bonnes réponses et la progression des élèves restent strictement inchangés. Seules trois mauvaises propositions ont été remplacées et 32 champs de correction enrichis. Aucun archivage ou migration des résultats n'est nécessaire. Des tests bloquent la réintroduction des trois « 2SA » et vérifient toutes les nouvelles comparaisons.

---

## Lot 9 — réveils et derniers exercices sans comparaison (V4.41)

Sur les 139 exercices signalés en V4.40, 19 n'avaient pas de corrigé comparatif. Ces 19 cas en disposent désormais, notamment six contres de réveil tricolores. Les six anciennes mauvaises propositions « 2SA » de ces réveils ont été remplacées par des annonces naturelles avec seulement quatre cartes, afin de travailler la distinction entre contre tricolore et longue couleur.

**Bilan :** 993 exercices inchangés, 0 bonne réponse modifiée, 6 distracteurs remplacés, 272 comparaisons cumulées, 867 signaux favorables, 118 vigilances et 8 priorités. Les 126 alertes restantes sont des signaux heuristiques et non des erreurs attestées ; aucun cas encore signalé n'est dépourvu d'explication comparative.

**Référence :** https://dev.ibridge-club.fr/public/fichedetails/564 (réveil direct naturel généralement cinquième, contre tricolore possible à partir de 8 HL). La progression des élèves est conservée ; aucune migration nécessaire. Les contrôles de non-régression protègent les 19 explications et les six propositions.


---

## Lot 10 — sept mains trop faibles en réveil (V4.42, 1er novembre 2026)

**Constat pédagogique :** après l'ouverture adverse et deux Passe, sept mains de **0 à 4 H** proposaient encore `2SA` parmi les fausses réponses. Cette enchère, qui montre en réveil direct une main régulière forte d'environ **17–19 HL** avec l'arrêt, était un piège trop caricatural. Les sept situations conservent **Passe** comme unique réponse attendue et leurs identifiants.

| Exercices | Ouverture adverse | Piège retiré | Piège naturel introduit | Pourquoi c'est faux |
|---|---|---|---|---|
| `SEF-V4-065-1`, `-2` | 1♣ | 2SA | **1♦** | Trois Carreaux et seulement 2 ou 4 H |
| `SEF-V4-066-1` | 1♦ | 2SA | **1♥** | Trois Cœurs et 3 H |
| `SEF-V4-067-4`, `-1` | 1♥ | 2SA | **1♠** | Trois Piques et 0 ou 4 H |
| `SEF-V4-068-2`, `-3` | 1♠ | 2SA | **2♣** | Trois Trèfles et 0 ou 4 H |

Le choix de remplacement est une **enchère légale mais mauvaise avec cette main**, non une seconde bonne réponse. La leçon ciblée : un réveil naturel sans saut demande normalement **au moins cinq cartes et 8–13 HL**. Un réveil n'est jamais automatique. Les sept corrections « Pourquoi pas ? » explicitent désormais la longueur et la force insuffisantes de l'annonce naturelle choisie ; leur nombre total reste **272**.

**Résultat de l'indicateur automatique recalculé :** 874 favorables, 111 vigilances et 8 priorités (119 cas encore signalés). Le score n'établit pas la qualité intrinsèque d'un distracteur et ne constitue pas une certification pédagogique.

**Intégrité :** 993 exercices, 22 rubriques et toutes les bonnes réponses conservés ; sept mauvaises propositions remplacées et sept contrastes réécrits, sans changement de progression. Le relevé CSV et les garde-fous du test d'intégrité suivent ces sept choix. Publication et tests navigateurs à confirmer via GitHub Actions après le commit.

**Source documentaire :** Fédération française de bridge, *En route vers le SEF*, séance 22 « Les réveils directs », p. 135, https://cdn.ffbridge.fr/cms/geds/0001/06/b203af67b05b104606507f79eeef5b19e552eacf.pdf#page=135.


---

## Lot 11 — seuil HLD du 2SA fitté et lisibilité des séquences (V4.43, 1er novembre 2026)

### Une véritable seconde bonne réponse détectée, puis corrigée

L'exercice `SEF-V3-075-3` (main ♠2 ♥1052 ♦AR942 ♣D764, 9 H, séquence **1♥ – (1♠)**) présentait **2♥** comme seule bonne réponse et **2SA** comme mauvaise proposition. Pourtant, le singleton Pique donne **2 points de distribution**, donc **11 HLD** avec le fit de trois Cœurs face à une ouverture majeure cinquième. Le **SEF 2024** prévoit précisément **2SA fitté avec trois atouts et 11–15 HLD après intervention adverse à la couleur**. Le soutien simple à **2♥** reste adapté à 6–10 HLD, pas à cette main.

- Bonne réponse corrigée : **2SA**, sans modifier ni la main, ni les quatre propositions, ni l'identifiant.
- Le piège `2♥` est désormais expliqué et la comparaison repose sur le vrai compte HLD ; le niveau de difficulté est conservé.
- La variante de la même famille `SEF-V3-075-2` contient seulement **6 H + 2 D = 8 HLD** et garde à juste titre **2♥** comme réponse. Elle devient un **contraste de seuil authentique**.
- L'historique local précédent de `SEF-V3-075-3` est archivé dans `archivedPreRevision` par le mécanisme existant `revisedSefNov2026`. Seul cet exercice est remis à travailler pour éviter de valider un ancien résultat sur une réponse devenue fausse. Les autres progressions restent intactes.

### Huit séquences de forcing rendues explicites

Les huit exercices `SEF-V45-013` à `SEF-V45-019` et `SEF-V45-022` indiquaient la première enchère du répondant par le libellé **« Réponse : »**. Le moteur de positionnement interprétait déjà ce libellé comme Sud, mais le texte était ambigu. Ils affichent maintenant **« Vous : »** sans modifier les enchères jouées, les mains, les quatre choix ni les bonnes réponses. Leurs résultats historiques restent valables.

### Bilan

- **993** exercices et **22** rubriques préservés.
- **1** bonne réponse réellement rectifiée, **0** distracteur retiré, **8** énoncés de séquence rendus plus clairs.
- **272** comparaisons pédagogiques. Score heuristique recalculé : **874 favorables, 111 vigilances, 8 priorités**, soit **119** cas signalés. Il ne certifie pas les autres enchères.
- Les tests d'intégrité vérifient la nouvelle réponse, le contraste des deux variantes, le compte HLD et l'archivage de progression. L'audit des familles reconnaît désormais deux familles différenciant la bonne réponse selon la force (Stayman et fit HLD).
- Le fichier `audits/quizz-revue-199-2026-11-01.csv` reste conservé comme **historique du lot 2**, et non comme photographie de la version V4.43.

**Sources SEF :** *L'As de Trèfle* n°50, janvier 2024, changements des réponses après intervention à la couleur, https://wasquehalbridge.com/wp-content/uploads/2024/02/Le-SEF-2024-est-arrive-.pdf ; fiche Évaluation des mains (points du singleton et des atouts), https://www.ibridge.fr/public/fichepdf/539 ; Sarzeau Bridge Club (FFB), « Quand la réponse de 2SA est-elle fittée ? », https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523.

**Publication :** commit V4.43 enregistré séparément ; tests statiques et navigateurs Chromium/WebKit et déploiement GitHub Pages à valider sur GitHub Actions.


---

## Lot 12 — calcul complet des HLD et seuil du 2SA fitté (V4.44, 1er novembre 2026)

La revue de **17 réponses avec exactement trois atouts après une intervention naturelle sur une ouverture majeure** confirme le choix correct du soutien économique (6–10 HLD) ou de **2SA fitté** (11–15 HLD, SEF 2024), mais identifie une insuffisance de détail dans certains corrigés.

### Rectification du décompte de la V4.43

- **`SEF-V3-075-3`** : ♠2 ♥1052 ♦AR942 ♣D764, après 1♥–(1♠) : **9 H + 1 L (cinquième Carreau) + 2 D (singleton Pique) = 12 HLD** et **non 11 HLD**. La bonne enchère **2SA fitté reste correcte** et n'est pas modifiée ; son explication, le piège 2♥ et le rappel de règle sont rectifiés.
- **`SEF-V3-075-2`** : ♠2 ♥842 ♦R10965 ♣R1087, même séquence : **6 H + 1 L + 2 D = 9 HLD** et donc **2♥**. La comparaison porte désormais sur 9 et 12 HLD et non sur 8 et 11.
- **`SEF-V3-081-3`** : ♠9 ♥R84 ♦RD1054 ♣DV75 : **11 H + 1 L + 2 D = 14 HLD** ; 2SA fitté, et non 3♥, reste le bon choix.

Les **17 explications** présentent le calcul H, L et D avec une courte explicitée quand elle existe. Les **quatre exercices** `SEF-V3-081-3`, `SEF-V3-082-1`, `SEF-V3-083-1`, `SEF-V3-084-3` possèdent désormais un contraste supplémentaire « Pourquoi pas ? » sur le soutien direct au palier de 3, moins descriptif avec exactement trois atouts.

### Contrôles et conservation des progrès

- **993** exercices et **22** rubriques inchangés, aucune bonne réponse modifiée, aucun choix retiré ni ajouté.
- **17** corrigés approfondis, **4** nouveaux contrastes comparatifs ; soit **276** corrigés avec « Pourquoi pas ? » au total.
- Audit heuristique recalculé : **874 favorables, 111 vigilances, 8 priorités** ; ces catégories ne certifient pas la justesse pédagogique.
- Tests ajoutés pour recalculer **H + L + D** sur ces 17 mains et vérifier leurs bonnes réponses, le nombre d'atouts et les comparaisons pédagogiques.
- Les réponses attendues et identifiants étant inchangés, **aucune migration de progression** ni réinitialisation d'exercice n'est nécessaire.

**Sources pédagogiques :** Fiche iBridge « Évaluation des mains », https://www.ibridge.fr/public/fichepdf/539 (L dès la cinquième carte ; HLD après fit) ; Sarzeau Bridge Club FFB, « Quand la réponse de 2SA est-elle fittée ? », https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523 (11–15 HLD et trois atouts après intervention naturelle à la couleur).

Les tests GitHub Actions et leur publication sont suivis séparément.


---

## Lot 13 — trois erreurs de soutien à quatre atouts (V4.45, 1er novembre 2026)

**Audit SEF 2024 des 4 situations de soutien avec quatre atouts après intervention naturelle adverse.** Il faut tenir compte du neuvième atout (+2), des courtes et des longueurs secondaires, plutôt que retenir les seuls H. Pour une intervention à la couleur, un soutien direct à 2M vaut 6–10 HLD ; à 3M, avec quatre atouts, 11–12 HLD ; le cue-bid de la couleur adverse impose la manche, avec au moins quatre atouts. Un soutien de palier 2 rendu impossible par le niveau adverse peut monter d'un seul palier.

| Exercice | Séquence | H + L + D + atout | Ancienne réponse | Réponse SEF corrigée | Décision |
|---|---|---|---|---|---|
| `SEF-V419-007` | 1♥ – (2♠) | 8+0+1+2 = **11 HLD** | 3♥ | **3♥** | Soutien minimum légal ; 2♥ est dépassé |
| `SEF-V420-011` | 1♥ – (1♠) | 7+0+1+2 = **10 HLD** | 3♥ | **2♥** | 3♥ avec quatre atouts serait 11–12 HLD |
| `SEF-V421-008` | 1♠ – (2♥) | 7+0+1+2 = **10 HLD** | 3♠ | **2♠** | 3♠ serait trop encourageant avec 10 HLD |
| `SEF-V425-008` | 1♠ – (2♣) | 9+1+2+2 = **14 HLD** | 3♠ | **3♣** | Cue-bid forcing de manche avec quatre atouts |

Le dernier exercice a été rendu non ambigu en **remplaçant la main** auparavant ♠D1086 ♥A5 ♦V9743 ♣V6, 8H (13 HLD mais petits honneurs peu efficaces), par **♠A1086 ♥R5 ♦D9743 ♣76**, 9H (14 HLD, honneurs mieux placés). La mauvaise proposition `2♦` est remplacée par le véritable cue-bid `3♣`, désormais bonne réponse ; l'ancienne réponse `3♠` devient un piège pédagogique justifié. Les deux autres changements de bonnes réponses utilisent des choix déjà présents.

**Bilan :** 993 exercices et 22 rubriques conservés ; **3 bonnes réponses corrigées**, **1 main clarifiée**, **1 distracteur remplacé**, **4 corrigés réécrits**, **2 nouveaux contrastes**, soit **278 comparaisons**. Nouveau score indicatif : **872 favorables, 113 vigilances, 8 priorités** (121 signaux) ; ce n'est pas un certificat d'exactitude.

**Migration non destructive :** les trois exercices rectifiés `SEF-V420-011`, `SEF-V421-008` et `SEF-V425-008` rejoignent `revisedSefNov2026` : si l'élève les a déjà traités, l'ancien résultat est archivé et seul l'exercice concerné redevient à travailler. Les autres progressions sont conservées. Les nouveaux tests vérifient les 4 comptes HLD, les bonnes réponses, le cue-bid, le piège et la présence des codes de migration.

**Références :** Fédération française de bridge, *L'As de Trèfle*, janvier 2024, article « Le SEF 2024 est arrivé », règles des soutiens après intervention, https://wasquehalbridge.com/wp-content/uploads/2024/02/Le-SEF-2024-est-arrive-.pdf ; page de synthèse du SEF 2024, https://scjc-bridge.fr/sef-2024 ; évaluation des mains HLD et des atouts, https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/la-main-et-son-evaluation.

Tests d'intégrité et publication surveillés dans GitHub Actions.


---

## Lot 14 — audit ciblé des conventions et de la qualité des pièges (V4.46, 1er novembre 2026)

La revue a porté principalement sur les erreurs **raisonnables mais non optimales** : confusion entre bicolore et intervention naturelle, mauvaise interprétation des Texas Rubensohl et défaut de comptage des clés du Blackwood. Les réponses correctes existantes ont été préservées.

### Corrigés comparatifs ajoutés

| Rubrique | Exercices enrichis | Point pédagogique traité |
|---|---:|---|
| Multi-Landy | **4** | 2♣ deux majeures, 2♦ majeure sixième, 2M majeure cinquième avec mineure quatrième |
| Rubensohl | **8** | annonces naturelles faibles au palier de 2, Texas à partir de 2SA, Texas impossible–Stayman |
| Michaels précisés | **7** | décrire les deux couleurs longues d'un coup, sans confondre cue-bid, 3♣ et 2SA |
| Blackwood et Splinters | **6** | cinq clés 30–41, Roi d'atout comme clé, informations de courte et fit |

**Résultat :** **25** nouveaux « Pourquoi pas ? », soit **303 comparaisons pédagogiques** en tout ; 993 exercices et 22 thèmes conservés. Aucune bonne réponse, aucune main et aucune des quatre propositions n'a changé. Les progrès des élèves ne sont ni réinitialisés ni migrés.

**Tests de non-régression ajoutés :** présence des 25 fausses réponses réellement offertes et de leur explication ; contrôle des huit cas de Blackwood (Roi d'atout, nombre de clés, Dame d'atout et réponse 30–41) ; formes attendues de 18 exemples Multi-Landy, Rubensohl et Michaels.

**Audit automatique indicatif recalculé :** 872 signaux favorables, 113 vigilances, 8 priorités. Le score mesure notamment la présence d'explications et la proximité d'autres réponses dans la base : il ne valide pas à lui seul une convention et ne doit pas guider artificiellement les choix.

**Références consultées :** iBridge, « Le Rubensohl après une intervention » https://www.ibridge.fr/public/fichedetails/24 ; iBridge, « Les quatre conventions Michael » https://www.ibridge.fr/public/fichedetails/254 ; Alençon Bridge Club FFB, « Le Blackwood 5 clés » https://alenconbridge.club.ffbridge.fr/en-savoir-plus/le-blackwood-5-cles-112005 ; et les fiches pédagogiques déjà consignées dans ce rapport.

**Publication :** contrôle d'intégrité, navigateurs et GitHub Pages à confirmer après le commit de V4.46.


---

## Lot 15 — réveils directs et plafond de 13 HL (V4.47, 1er novembre 2026)

**Référence FFB :** *En route vers le SEF !*, séance 22 « Les réveils directs », p. 135–136 : réveil naturel sans saut **8–13 HL**, en principe cinq cartes au moins ; réveil à saut **11–13 HL** avec six belles cartes ; au-delà, **Contre de réveil** de force puis description de la main. Le compte HL ajoute un point pour la cinquième carte et un point pour la sixième. La fiche « Les différents réveils après une ouverture de 1 à la couleur » d'iBridge confirme l'approche du contre avec une main forte sans singleton dans une autre couleur non annoncée.

### Quatre bonnes réponses rectifiées

| Exercice | Séquence adverse | Main | Évaluation | Ancienne réponse | Nouvelle réponse |
|---|---|---|---|---|---|
| `SEF-V4-053-3` | 1♠ – Passe – Passe | ♠42 ♥RD8432 ♦A32 ♣R10 | 12 H + 2 L = **14 HL** | 2♥ | **Contre** |
| `SEF-V4-055-1` | 1♠ – Passe – Passe | ♠97 ♥D42 ♦AR9652 ♣R5 | 12 H + 2 L = **14 HL** | 2♦ | **Contre** |
| `SEF-V4-056-1` | 1♠ – Passe – Passe | ♠D7 ♥RV9 ♦106 ♣RDV532 | 12 H + 2 L = **14 HL** | 2♣ | **Contre** |
| `SEF-V4-069-1` | 1♣ – Passe – Passe | ♠72 ♥AD10642 ♦A109 ♣D3 | 12 H + 2 L = **14 HL** | 2♥ (saut) | **Contre** |

La couleur directe devient dans chaque question une mauvaise réponse **plausible mais techniquement trop limitée**. Les corrigés détaillent le calcul des 14 HL et le principe du Contre d'abord, puis de la couleur si nécessaire. Les quatre identifiants et les quatre propositions sont préservés.

### Contrastes pédagogiques ajoutés

Quatre variantes de **11–13 HL** gardent le réveil naturel comme bonne réponse (`SEF-V4-053-4`, `SEF-V4-055-3`, `SEF-V4-056-2`, `SEF-V4-070-2`). Leur nouvelle explication « Pourquoi pas Contre ? » insiste sur la différence entre réveil limité et contre initial fort. Les familles de décision contrastée sont désormais : `cas-148` (Stayman), `cas-275` (fit majeur) et `cas-363`, `cas-365`, `cas-366` (seuil du réveil).

**Bilan :** 993 exercices, 22 rubriques et 4 réponses proposées par question conservés ; **4 bonnes réponses corrigées** et **8 nouveaux contrastes pédagogiques**, soit **311** comparaisons. Indicateur automatique : 872 favorables, 113 vigilances, 8 priorités (121 signalements), à ne pas confondre avec une validation SEF.

**Historique des élèves :** les quatre exercices dont la bonne réponse change rejoignent `revisedSefNov2026` pour archiver la tentative antérieure et remettre ces exercices à travailler. Les quatre autres variantes, dont la bonne réponse ne change pas, conservent intégralement leur progression. Des tests de non-régression vérifient désormais le plafond HL de **tous** les réveils naturels du catalogue et ces quatre transitions de décision.

**Sources :** https://cdn.ffbridge.fr/cms/geds/0001/06/b203af67b05b104606507f79eeef5b19e552eacf.pdf#page=135 ; https://www.ibridge.fr/public/fichedetails/81 ; https://www.bridge-chailley.fr/wp-content/uploads/2013/01/E4015-R%C3%A9veils-2-s.pdf.

Validation et publication à confirmer par GitHub Actions après commit.


---

## Lot 16 — interventions directes : 1SA, Contre, couleur et Passe (V4.48, 1er novembre 2026)

La revue des **56 exercices d’intervention directe** confirme les bonnes réponses conservées, mais révèle des corrigés trop peu comparatifs. **18 nouveaux « Pourquoi pas ? »** sont ajoutés : 4 autour de 1SA, 4 sur le Contre d’appel, 6 interventions naturelles et 4 Passe. Les pièges cités figurent tous parmi les quatre propositions de chaque exercice.

### Trois exemples de 1SA rendus non ambigus

Le manuel FFB *Les Espoirs du Bridge*, deuxième année, séance 11 (p. 44), ainsi qu'un document FFB 2022, décrivent l’intervention directe par 1SA avec **16–18 H, une distribution régulière et l'arrêt adverse**. D'autres fiches de club adoptent parfois 15–17 H. Pour éviter un choix discutable chez un débutant, les trois exemples précédemment à 15 H sont portés à 16 H en modifiant un seul honneur, sans modifier l'enchère attendue :

| ID | Carte modifiée | Ancien H | Nouveau H | Réponse conservée |
|---|---|---:|---:|---|
| `SEF-V3-044-1` | ♠V → ♠D | 15 | 16 | 1SA |
| `SEF-V3-045-2` | ♠V → ♠D | 15 | 16 | 1SA |
| `SEF-V3-046-3` | ♣V → ♣D | 15 | 16 | 1SA |

Le quatrième exercice `SEF-V3-043-3` était déjà à 16 H. Tous possèdent un As dans la couleur d’ouverture adverse et une main régulière ; l’analyse explique maintenant pourquoi Contre serait moins adapté.

### Bilan et tests

- **993 exercices / 22 rubriques**, bonnes réponses et choix conservés.
- **18 nouvelles explications comparatives**, soit **329** au total.
- **3 mains légèrement modifiées** : archivage local des tentatives et remise au travail de ces trois exercices seulement, grâce à `revisedSefNov2026`. Les 15 autres exercices enrichis conservent leur progression.
- Contrôles automatiques : quatre mains de 1SA à 16 H avec As d’arrêt et forme régulière ; quatre Contres sur singleton adverse avec les trois autres couleurs quatrièmes ; six annonces naturelles avec une couleur cinquième ou plus ; quatre Passe avec au maximum 6 H ; intégrité des points de toutes les mains.
- Indicateur heuristique recalculé : 872 favorables, 113 vigilances et 8 priorités (121 signalements). Ce score n'est pas une certification SEF.

**Sources :** FFB, *Les Espoirs du Bridge*, deuxième année, p. 44, https://cdn.ffbridge.fr/cms/geds/0001/01/c7a84cba11443f52affe686302d5b09ac43b97f8.pdf#page=44 ; FFB, séance du 14 septembre 2022, https://cdn-sandbox.ffbridge.fr/media/media/api/31408-fsi20220914s-pdf-63223bae69389_default.pdf ; Sarzeau Bridge Club FFB, fiche d’intervention à 1SA avec une variante 15–17 H, https://bridgesarzeau.club.ffbridge.fr/documents/contre-dappel-et-contre-de-reveil-322955.

Publication à confirmer par GitHub Actions.

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

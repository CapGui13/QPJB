# QPJB Entraînement — deux signalements P1 : BH-093-01 et BH-078-05

**Date :** 11 novembre 2026. **Périmètre :** application Entraînement, sans changement du Quiz SEF.

## Sources primaires vérifiées

| Fascicule | Sujet PDF, SHA-256 | Corrigé PDF, SHA-256 |
|---|---|---|
| BH-093 (8 décembre 2023) | `c55ec259b5e0af1098e8260a43a87c00046dc44c048bdd4f69adbef0191411f0` | `4bd17fd83e0d0e7220021258b3a0536639d6c4d25f81eec99df3a879e5ced0e3` |
| BH-078 (25 août 2023) | `91f79ce856f6f26f2ec9603c5beba78c7f0cece500a15d1abd0678b39ecf4840` | `496d0e60007acd379715fdf81e35784feea37b627aeac9512657006f9a01e7bc` |

Chemin de conservation : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`. PDF concernés : `93 Exercice Votre Bridge Hebdo débutant 8-12-2023.pdf`, `93 Solution Votre Bridge Hebdo débutant 8-12-2023.pdf`, `78 Exercice Votre Bridge Hebdo débutant 25-08-2023.pdf`, `78 Solution Votre Bridge Hebdo débutant 25-08-2023.pdf`. Pages 1 sujet/corrigé rendues, lues visuellement et recoupées avec l'extraction textuelle ; les PDF n'ont pas été modifiés.

## Cas 1 — `EN-BH-093-01` (P1, explication de la réponse de 1SA)

- **Sujet :** Sud possède ♠75 ♥D82 ♦R643 ♣V942, après 1♠ de Nord et Passe d'Est (6 H). Le corrigé donne **1SA**.
- **Corrigé source :** répondre dès **6 HL** ; dans cette méthode, 1SA dénie le fit majeur et montre **6 à 10 HL**. La page insiste ensuite, à la question 2 (chicane Pique), sur le fait que 1SA **ne garantit en aucun cas une distribution régulière**.
- **Défaut publié :** l'explication de QPJB décrivait 1SA comme « petite zone régulière ou semi-régulière », induisant une fausse restriction de forme.
- **Correctif :** l'explication rétablit la réponse d'attente sans exigence de régularité et cite la question 2 comme contre-exemple ; la question indique le cadre documentaire (l'interprétation *forcing* de 1SA dépend d'accords de paire). Le texte affiché avant le choix n'indique pas la bonne enchère.
- **Invariant :** `correct=1SA`, même main, enchères de la séquence, quatre réponses et ID, même sourceRef.

## Cas 2 — `EN-BH-078-05` (P1, vulnérabilité ajoutée sans source)

- **Sujet :** Sud possède ♠R92 ♥6 ♦DV1085 ♣D643, Nord ouvre 3♠ ; **aucune vulnérabilité n'est indiquée**.
- **Corrigé source :** l'auteur recommande **4♠** pour prolonger le barrage, avec une justification liée aux atouts et aux Cœurs adverses, mais sans donner les mains adverses qui permettraient de prouver des levées.
- **Défaut publié :** la version adaptée de QPJB avait introduit la vulnérabilité favorable comme si elle appartenait à la source et faisait passer Passe pour une erreur de bridge de portée générale.
- **Correctif :** l'énoncé commence par **« Exercice ADAPTÉ »**, dit que la vulnérabilité était absente du fascicule, puis pose expressément N/S non vulnérables, E/O vulnérables **et** la décision préalable de prolonger le barrage. L'élève choisit alors le palier. La conclusion 4♠ reste celle du fascicule et de l'exercice publié ; les notes admettent Passe comme possibilité hors de cette hypothèse.
- **Invariant :** `correct=4♠`, mêmes main, séquence, quatre choix éditoriaux, ID, sourceRef et provenance d'adaptation. Aucune démonstration fabriquée des levées adverses.

## Vérifications et limites

- **Deux** fiches éditées sur **638 enchères**, **636** autres inchangées ; **188** exercices de carte intacts ; **826** identifiants au total.
- Seuls `question`, `sourceContext`, `explanation`, l'indice/ancien commentaire de Passe et une étiquette de révision sont modifiés pour les deux fiches. Les textes des indices Passe restent synchronisés.
- Maître `training-data.js` et module `training-data-bidding.js` synchronisés ; assertions ciblées dans `tests/training-smoke.cjs` ; cache PWA versionné pour ne pas diffuser d'anciennes questions.
- La CI complète d'intégrité, Chromium et WebKit doit être verte au HEAD exact. La PR est créée en brouillon, sans diffusion anticipée.
- Cette revue est **informée**, non une contre-expertise aveugle des 178 signalements. Les conclusions se limitent aux problèmes documentaires établis.

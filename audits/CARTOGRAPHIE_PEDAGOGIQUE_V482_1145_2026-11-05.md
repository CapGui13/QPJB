# QPJB Quiz SEF — Cartographie des compétences V4.82 (1 145 fiches)

**Date :** 5 novembre 2026. **Base :** `CapGui13/QPJB`, `main` à `eb85049a3fe385b38407db4454452fb278bfc112`. **Périmètre :** `quizz.html` exclusivement. La matrice `CARTOGRAPHIE_1145_QUIZ_SEF_2026-11-05.csv` conserve une ligne par ID.

## Méthode

Lecture des **1 145 objets** du JSON inclus dans `quizz.html` : identifiant, rubrique, séquence, meilleure réponse, points H, distribution, difficulté et famille. Classement heuristique par contexte de l'enchère et bonne réponse ; pas de recodage manuel de chaque compétence. Les groupes identiques rubrique + séquence + bonne enchère sont des **indicateurs descriptifs**, pas des doublons ni une preuve de pertinence. La carte **ne certifie pas la conformité SEF** de chaque corrigé. Les exercices anciens ne sont pas modifiés.

## Couverture exhaustive par rubrique

Nombre de séquences = tableaux d'enchères **exactement distincts**, y compris les parenthèses explicatives, sans normalisation sémantique.

| Rubrique | QCM | Séquences exactes | Réponses différentes | Décisions dominantes (classement heuristique) |
|---|---:|---:|---:|---|
| Choisir son ouverture | 77 | 3 | 8 | Choix mineure (27) ; Choix majeure (19) ; Ouverture de 1SA (12) |
| Répondre à 1♣ / 1♦ | 78 | 2 | 10 | Majeure sur mineure (29) ; 1SA non fitté (18) ; Développement réponse mineure (15) |
| Répondre à 1♥ / 1♠ | 81 | 2 | 12 | Soutien majeur (27) ; Nouvelle couleur / 2 sur 1 (21) ; 1SA forcing / relais (15) |
| Répondre à 1SA / 2SA | 64 | 3 | 11 | Stayman / Texas / choix au palier de 2 (20) ; Manche SA (15) ; Passe / partielle (12) |
| La redemande de l’ouvreur | 109 | 16 | 15 | Redemande naturelle / bicolore (43) ; Soutien / répétition majeure (40) ; Redemande Sans-Atout (25) |
| La 2e enchère du répondant | 103 | 27 | 14 | 2e enchère en couleur (37) ; Forcing / relais (22) ; Arrêt / passe du répondant (22) |
| Après Stayman et Texas | 53 | 18 | 10 | Après Texas (31) ; Développements après 1SA / 2SA (16) ; Texas mineur : réponse et suites (6) |
| Interventions | 61 | 6 | 12 | Intervention naturelle (33) ; Passe compétitif (14) ; Contre d’appel (10) |
| Après un contre d’appel | 56 | 9 | 13 | Annonce couleur après contre (43) ; SA après contre d’appel (12) ; Passe après contre d’appel (1) |
| Après intervention adverse | 81 | 19 | 17 | Réponse après intervention naturelle (46) ; Passe après intervention naturelle (10) ; Nouvelle couleur / soutien après Contre (10) |
| Barrages simples à la couleur | 38 | 6 | 12 | Ouvrir / poursuivre barrage (24) ; Répondre au 2 faible (14) |
| Après un fit majeur | 39 | 8 | 8 | Redemande ouvreur après fit (24) ; Répondre à essai 2SA (8) ; Répondre à essai couleur (7) |
| Répondre à une intervention | 48 | 9 | 13 | Soutien / nouvelle couleur / cue-bid (35) ; Passe après intervention du partenaire (8) ; 1SA après intervention (5) |
| Réveils simples | 43 | 4 | 9 | Réveil à la couleur (20) ; Contre en réveil (10) ; Passe en réveil (7) |
| Le Roudi | 33 | 13 | 10 | Réponse / suite après Roudi (17) ; Déclenchement Roudi / décision (16) |
| Le Drury | 19 | 4 | 6 | Choix initial après Passe d’entrée (15) ; Redemande après Drury (4) |
| Ouvertures fortes et réponses | 22 | 6 | 12 | Réponse au 2♦ forcing de manche (13) ; Développements après 2♣ fort indéterminé (5) ; Choix ouverture forte (4) |
| Troisième et quatrième couleur forcing | 25 | 11 | 10 | Redemande après 4e forcing (17) ; Redemande ouvreur / réponse forcing (8) |
| Défense contre 1SA : Multi-Landy | 27 | 8 | 8 | Réponse au Multi-Landy (14) ; Intervention Multi-Landy (13) |
| Après intervention sur notre 1SA | 29 | 9 | 9 | Réponse de l’ouvreur après Rubensohl (16) ; Choix initial du répondant en Rubensohl (13) |
| Interventions bicolores (Michaels) | 38 | 17 | 13 | Répondre au Michaels (21) ; Intervenir / suite du Michaels (17) |
| Contrôles, Splinters et Blackwood | 21 | 9 | 9 | Réponse au Blackwood (10) ; Recherche de la Dame d’atout (8) ; Splinter (3) |

**Totaux :** 1145 QCM, 22 rubriques, 209 groupes de séquences exactes *dans leurs rubriques*. Les séquences distinctes ne sont pas une mesure de la difficulté de la décision.

## Contre-expertise ciblée des lacunes réelles

### 1. Contrôles de chelem — **besoin confirmé et non couvert**

La rubrique **Contrôles, Splinters et Blackwood** a 21 QCM : **18 sur le Blackwood/la Dame d'atout et 3 sur les Splinters** (IDs `SEF-V45-056`, `SEF-V45-057`, `SEF-V45-058`). **0 exercice** ne demande comme bonne enchère un **contrôle** de couleur en séquence de chelem avant le Blackwood. Le nom de la rubrique n'implique donc pas que cette étape cruciale soit entraînée.

Décisions à enseigner : reconnaissance d'un contrôle de 1er tour (**As, chicane**) et de 2e tour (**Roi, singleton**) ; ordre économique des contrôles après fit majeur confirmé ; signalisation d'un autre contrôle en saut si la couleur intermédiaire n'est pas contrôlée ; retour à la manche quand les contrôles nécessaires sont absents, au lieu de poser un Blackwood.

**Références :** [iBridge, procédure pour demander un chelem à l'atout](https://www.ibridge.fr/public/fichedetails/526) ; [les enchères de contrôle, Bridge Club Palmarium](https://clubpalmarium.club.ffbridge.fr/documents/encheres-de-controle-371980). Ne pas incorporer de variantes avancées (3SA relais de contrôle, anti-contrôles), faute d'un cadre unique explicitement enseigné.

**Verdict :** priorité V4.83. Les cas ne seront recevables que si la main et la séquence rendent une unique réponse défendable.

### 2. Réponses à 1♥/1♠ contré — **ancienne lacune résolue, NE PAS dupliquer**

La cartographie à **993 QCM (4 novembre)** indiquait que Passe, nouvelle couleur et Truscott n'étaient pas illustrés après `1M–(Contre)`. La version actuelle contient 13 QCM dans cette configuration, dont 6 ajouts ciblés **V4.70** :

- `SEF-V470-001` : **Passe**, 1 H après 1♥–(Contre) ;
- `SEF-V470-003` : **1♠**, quatre Piques après 1♥–(Contre) ;
- `SEF-V470-004` : **2♥** naturel, six Cœurs après 1♠–(Contre) ;
- `SEF-V470-005` : **2SA Truscott**, quatre Cœurs après 1♥–(Contre).

**Verdict :** ne pas produire de nouveau lot sur ce simple motif. Un ancien rapport figé à 993 fiches ne doit pas être traité comme l'état actuel à 1 145.

### 3. Texas mineurs sans intervention — **lacune traitée en V4.82**

Les 10 IDs `SEF-V482-001` à `SEF-V482-010` couvrent maintenant les deux demandes initiales, les deux conclusions faibles par Passe et les six annonces de courtes. Aucune duplication automatique en V4.83.

### 4. Réponses à 1♣/1♦ contré — **piste conditionnelle**

Reste une piste pédagogiquement plausible : l'équilibre entre Passe, nouvelle majeure, Surcontre, soutien ou Truscott mineur. **Validation précise du SEF 2024 requise** ; un manque de volume ne suffit pas à valider les enchères. A traiter après les contrôles si l'audit individuel prouve une lacune réelle.

### 5. Développements après Drury — **à instruire sans précipitation**

La rubrique possède 19 QCM, montrant surtout la décision initiale du répondant et la redemande de l'ouvreur après 2♣. Les suites du répondant après les redemandes de l'ouvreur doivent être inspectées, mais plusieurs développements dépendent de conventions. Pas de nouvelles mains sans justification SEF et contraste concret.

## Critères de création V4.83

1. Une décision absente et utile, pas un seuil de quantité.
2. Contraste précis à enchères égales : contrôle As vs Roi vs singleton vs absence, tenue marginale (Dame n'est pas un contrôle), ou bonne couleur à nommer.
3. Main contrôlée : exactement 13 cartes, H recomptés et distribution cohérente avec le soutien indiqué, options licites et ordonnées.
4. Corrigé affiché seulement sur la bonne réponse ; critique des trois distracteurs uniquement dans l'audit.
5. Empreinte Git Blob **des 1 145 historiques**, intégrée à la CI ; aucune modification d'ID, d'ordre, de solution ancienne, ni de `/entrainement/`.
6. PR et tests Audit + Chromium + WebKit avant fusion ou publication.

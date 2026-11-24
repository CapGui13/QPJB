# Quiz SEF QPJB — Cartographie actuelle 1 223 QCM (V4.110)

**Date** : 5 novembre 2026. **Source analysée intégralement** : `quizz.html` de `CapGui13/QPJB`, blob Git `67036b9dfc68ebc28e96d4fd38c4eb671834f65c`. **Périmètre** : Quiz SEF uniquement, pas `/entrainement/`.

## Méthode

Les 1 223 objets du JSON `training-data` ont été parcourus : ID, thème, main, H, distribution, séquence, contexte, réponse, distracteurs, difficulté. Le [CSV nominatif associé](CARTOGRAPHIE_1223_QUIZ_SEF_V4110_2026-11-05.csv) contient une ligne par ID. Ses indices `presence_indice_*` sont des repérages lexicaux et ne prouvent pas l'existence ou l'absence d'une compétence.

**Chiffres** : 1223 QCM, 1223 IDs uniques, 22 rubriques, 239 groupes rubrique + séquence exactement identique, 759 groupes rubrique + séquence + bonne réponse, 0 doublon exact de main + séquence dans une même rubrique.
**Niveaux** (1 à 5) : 142 / 478 / 411 / 177 / 15. **Stages** : Débutant 236, Consolidation 790, Approfondissement 197.

Attention : les groupes de séquences ne sont **pas** des compétences sémantiques uniques et l'absence de duplicata exact ne réfute pas les quasi-doublons. Ceci est une **cartographie structurelle**, pas une certification SEF exhaustive.

## Comptages complets — 22 rubriques

| Rubrique | Stage | Ancien V4.82 | Actuel V4.110 | Déjà ajoutés | Séquences exactes | Réponses distinctes | Difficulté 1/2/3/4/5 | Extension proposée |
|---|---|---:|---:|---:|---:|---:|---|---:|
| 1 · Choisir son ouverture (`ouv`) | Débutant | 77 | **77** | 0 | 3 | 8 | 40/32/5/0/0 | **+12** |
| 2 · Répondre à 1♣ / 1♦ (`mineur`) | Débutant | 78 | **78** | 0 | 2 | 10 | 44/28/6/0/0 | **+18** |
| 3 · Répondre à 1♥ / 1♠ (`majeur`) | Débutant | 81 | **81** | 0 | 2 | 12 | 28/43/9/1/0 | **+20** |
| 4 · Répondre à 1SA / 2SA (`sa`) | Consolidation | 64 | **64** | 0 | 3 | 11 | 26/38/0/0/0 | **+8** |
| 5 · La redemande de l’ouvreur (`red`) | Consolidation | 109 | **109** | 0 | 16 | 15 | 0/45/48/16/0 | **+10** |
| 6 · La 2e enchère du répondant (`second`) | Consolidation | 103 | **103** | 0 | 27 | 14 | 4/50/47/2/0 | **+12** |
| 7 · Après Stayman et Texas (`stayman`) | Consolidation | 53 | **53** | 0 | 18 | 10 | 0/34/19/0/0 | **+10** |
| 8 · Interventions (`intervenir`) | Consolidation | 61 | **61** | 0 | 6 | 12 | 0/22/39/0/0 | **+12** |
| 9 · Après un contre d’appel (`contre`) | Consolidation | 56 | **56** | 0 | 9 | 13 | 0/29/10/16/1 | **+10** |
| 10 · Après intervention adverse (`apres_inter`) | Consolidation | 81 | **92** | 11 | 21 | 18 | 0/40/40/10/2 | **+18** |
| 11 · Barrages simples à la couleur (`barrage`) | Consolidation | 38 | **44** | 6 | 8 | 14 | 0/26/13/5/0 | **+8** |
| 12 · Après un fit majeur (`apres_fit`) | Consolidation | 39 | **43** | 4 | 10 | 9 | 0/9/25/9/0 | **+10** |
| 13 · Répondre à une intervention (`reponse_inter`) | Consolidation | 48 | **56** | 8 | 14 | 14 | 0/25/21/9/1 | **+10** |
| 14 · Réveils simples (`reveil`) | Consolidation | 43 | **43** | 0 | 4 | 10 | 0/16/8/19/0 | **+10** |
| 15 · Le Roudi (`roudi`) | Consolidation | 33 | **33** | 0 | 13 | 10 | 0/11/17/5/0 | **+6** |
| 16 · Le Drury (`drury`) | Consolidation | 19 | **33** | 14 | 10 | 11 | 0/8/17/8/0 | **+6** |
| 17 · Ouvertures fortes et réponses (`fortes`) | Approfondissement | 22 | **28** | 6 | 10 | 13 | 0/3/13/11/1 | **+18** |
| 18 · Troisième et quatrième couleur forcing (`forcing`) | Approfondissement | 25 | **32** | 7 | 16 | 12 | 0/1/9/20/2 | **+22** |
| 19 · Défense contre 1SA : Multi-Landy (`multilandy`) | Approfondissement | 27 | **27** | 0 | 8 | 8 | 0/3/14/9/1 | **+14** |
| 20 · Après intervention sur notre 1SA (`rubensohl`) | Approfondissement | 29 | **35** | 6 | 11 | 11 | 0/6/14/14/1 | **+18** |
| 21 · Interventions bicolores (Michaels) (`michaels`) | Approfondissement | 38 | **38** | 0 | 17 | 13 | 0/9/21/6/2 | **+16** |
| 22 · Contrôles, Splinters et Blackwood (`chelem`) | Approfondissement | 21 | **37** | 16 | 11 | 11 | 0/0/16/17/4 | **+32** |
| **TOTAL** | | **1145** | **1223** | **78** | **239** | — | **142/478/411/177/15** | **+300** |

## Manques et sous-couvertures observables

- **CHE-1 : poser les clés (4SA)** : dans les 37 QCM de la rubrique chelem, **0 réponse correcte 4SA**. Les réponses au Blackwood et la poursuite des contrôles sont déjà présentes ; on doit travailler le déclenchement de 4SA lorsque les contrôles ont été montrés et le chelem est plausible.
- **RUB-1 : Rubensohl après 1SA–(2♠ naturel)** : **1** exercice à séquence textuelle correspondante sur 35. Attention : une variante conventionnelle doit être explicitée avant de créer des réponses.
- **OUV-1 : quatrième position** : **2** QCM identifiés par les termes « quatrième position / 4e position / quatrième siège » dans la rubrique ouvertures. Cible : variations concrètes de force et de qualité de couleur, plutôt que des mains redondantes.
- **DRU-1/2 : développements après 2♦ Drury** : **4** exemples explicitement introduits par une enchère d'attente 2♦ dans la séquence, sur 33 Drury. Cette suite existe ; il faut diversifier sans la redécouvrir.

**Les 18 autres rubriques ne sont pas déclarées « incomplètes » sur leur seul volume**. Des contrastes nouveaux restent candidats, à comparer individuellement aux mains et séquences existantes.

## Ce qui a changé depuis V4.82 : ne pas refaire les 78 ajouts déjà publiés

- `apres_inter` : 81 → **92**, soit **+11** déjà intégrés.
- `barrage` : 38 → **44**, soit **+6** déjà intégrés.
- `apres_fit` : 39 → **43**, soit **+4** déjà intégrés.
- `reponse_inter` : 48 → **56**, soit **+8** déjà intégrés.
- `drury` : 19 → **33**, soit **+14** déjà intégrés.
- `fortes` : 22 → **28**, soit **+6** déjà intégrés.
- `forcing` : 25 → **32**, soit **+7** déjà intégrés.
- `rubensohl` : 29 → **35**, soit **+6** déjà intégrés.
- `chelem` : 21 → **37**, soit **+16** déjà intégrés.

## Garde-fous avant rédaction

1. **SEF 2024 sans Walsh** : sur 1♣ avec quatre ou cinq ♦ et une majeure quatrième, priorité à la majeure jusqu'à 12 HL, selon l'arbitrage du manuel. Réponse 1♥/1♠ au palier de 1 non limitée si le répondant n'a pas passé, à partir du minimum de 6 points retenu dans le Quiz.
2. **Conventions explicites** : respecter les arbitrages déjà rendus, les accords Landy/Multi-Landy hors SEF standard, et ne pas projeter un éventuel 1M–1SA forcing personnel sur une séquence qui enseigne une autre convention.
3. **Pas de remise en cause des 118 signalements historiques** : lire [le registre nominatif de clôture](REGISTRE_QUIZ_SEF_V4110_118_CLOTURES.csv) avant tout nouvel arbitrage.
4. **Aucun +300 n'est encore écrit ni validé**. Chaque création doit avoir une bonne réponse unique en contexte, trois distracteurs crédibles mais faux, une justification de la seule bonne réponse, et un dossier SEF justificatif.
5. **Ne pas toucher les 1 223 fiches en place ni les 677 exercices Entraînement**. Ajouter des IDs nouveaux, vérifier les 13 cartes, H/HL/HLD, vulnérabilité déterminante, collisions de main/séquence et sauvegardes, puis PR et tests Chromium/WebKit/Pages.

**Suite opérationnelle** : [Plan d'extension chiffré par compétence et lots](PLAN_EXTENSION_300_QUIZ_SEF_V4110_2026-11-05.md).

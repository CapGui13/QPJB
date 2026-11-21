# Clôture ciblée du Quiz SEF — 21 novembre 2026

**Périmètre exclusif :** PR #234, #237, #239, #241 ; issues #33, #35, #226 ; QCM SEF-V44-053 et SEF-V44-054. La PR #242 a **déjà été fusionnée et publiée** : ses 11 corrections ne sont ni recontrôlées ni réappliquées ici.

## Décisions fermes

| Dossier | ID | Décision | Justification issue du QCM réel |
|---|---|---|---|
| #33 | SEF-V411-007 | **CONSERVER 3SA** | 1♣–1♠–2♣ ; 13 H, ♠AV75 ♥RV5 ♦874 ♣A102 ; parmi 2♠/2SA/3♣/3SA, 3SA reste une conclusion de manche recevable. L'absence d'arrêt ♦ détenu personnellement crée un risque et n'est pas une preuve de mauvaise réponse : l'ouvreur peut détenir l'arrêt. Ne pas présenter le succès de 3SA comme garanti. |
| #35 | SEF-V49-005, SEF-V426-001 | **CONSERVER 1♥, 1♠** | Après 1♣, avec cinq Carreaux, une majeure quatrième et 7/8 H, la priorité à la majeure est conforme au référentiel SEF pédagogique adopté et désormais explicité dans les explications de `main`. Pas de bascule forcée à 1♦. |
| #35 | SEF-V44-005, SEF-V44-006, SEF-V49-033, SEF-V49-034 | **CONSERVER 2SA** | Force de 11–12 H et mains régulières sans majeure quatrième. Les arrêts majeurs sont parfois précaires : réserve sur la qualité du contrat, mais les choix restants ne fournissent pas d'alternative plus SEF-cohérente (1SA trop faible ; 3SA excessif ; soutien mineur non adapté). Ne pas affirmer que les deux majeures sont *garanties tenues*. |
| #35 | **SEF-V44-008** | **CORRIGER : 3SA → 2♣** | Après 1♦, ♠1072 ♥AD9 ♦DV3 ♣RV43 : 13 H, quatre ♣, aucun arrêt ♠. Le 2♣ forcing/auto-forcing (11 H minimum, quatre ♣ en principe) existe parmi les quatre choix. Il permet de déterminer les arrêts avant de conclure à Sans-Atout, contrairement à 3SA immédiat. Choix inchangés. |
| Lot C | **SEF-V44-053** | **CONSERVER 3♦** | 1♠–2♠ ; 15 H, ♠AR974 et ♦R1093 quatrièmes. 3♦ est une enchère d'essai légale, avec recherche de complément à Carreau, unique meilleure enchère parmi 3♦/3♠/3SA/4♠. Le Roi quatrième avec 10-9 ne rend pas cet essai faux. |
| Lot C | **SEF-V44-054** | **CORRIGER : 3♠ → 2SA** | 1♥–2♥ ; 15 H, ♥ADV62 ♠RV102 ♦103 ♣A2. Un simple essai 3♠ interdit de revenir à 3♥ pour refuser : la présentation actuelle comme essai ordinaire est pédagogiquement inexacte. Choisir 2SA essai généralisé, et remplacer le distracteur 3♠ par 2SA parmi les quatre options. |

## Les deux modifications applicatives proposées (PR brouillon uniquement)

Manifeste exact `audits/QPJB_SEF_CLOTURE_2_QCM_20261121.json`. Dans `quizz.html` seulement :
- `SEF-V44-008` : `answer`, `context`, `explain`, `difficultyReason` ; la main, l'ID, le thème, la famille, les quatre choix, la force et la séquence restent identiques.
- `SEF-V44-054` : `answer`, `choices` (3♠ remplacé par 2SA), `context`, `explain`, `difficultyReason` ; la main, l'ID, le thème, la famille, la force et la séquence restent identiques.
- **Aucun autre QCM modifié.** Les métadonnées des anciennes revues restent comme archives historiques, sans rétroactivité.
- Tests de protection historiques adaptés par **inversion exacte des deux seuls nouveaux deltas** avant comparaison aux SHA et exports historiques : `tests/quizz-v488-approved-revisions.cjs`, `tests/quizz-v1-lot-d-11-integration.cjs`, `tests/quizz-v2-audit.cjs`, `tests/quizz-parcours-lot-b.cjs`. Aucune baisse de seuils, aucune suppression d'assertions.

## Clôture administrative du chantier

- **#234, #237, #241** : brouillons préparatoires remplacés par les 11 corrections de la PR #242 fusionnée. Clôture **sans fusion** de ces documents devenus redondants.
- **#239** : pilote C non activé ; son gain de fréquence d'exposition ne prouve pas une amélioration d'apprentissage. Les deux cas litigieux ont un verdict définitif ci-dessus. **Clôture sans activation ni nouvelle classification.**
- **#33** : clôture de la réserve, sans correction faute d'erreur démontrée.
- **#35** : clôture de la contre-expertise des sept réserves ; **une seule erreur justifie une correction proposée** dans cette PR, non encore intégrée à `main`.
- **#226** : clôture de la campagne de cartographie **sans homologation** ni activation des 620 étiquettes candidates : l'inventaire est archivé, mais aucune preuve du besoin d'une campagne exhaustive n'impose d'en ouvrir une. Une éventuelle anomalie future doit être identifiée par ID et traitée directement, pas recréer une campagne.
- **Blocage de publication :** cette PR n'est ni approuvée ni fusionnée ; les deux QCM restent inchangés sur le site jusqu'à décision séparée.

## Références de doctrine

- [ABC du Bridge, réponses à l'ouverture mineure](https://abc-du-bridge.scenari-community.org/003-01/co/003-01-02_1.html) : priorité à la majeure dans une main faible ; 2♣ sur 1♦ à partir de 11 H avec généralement quatre ♣ ; 2SA/3SA et arrêts dans les majeures.
- [iBridge, enchère d'essai généralisée](https://dev.ibridge-club.fr/public/fichedetails/544) : 2SA après soutien simple, force environ 15–16 H chez l'ouvreur.
- [iBridge, essai par une couleur](https://dev.ibridge-club.fr/public/fichedetails/515) : recherche de complément dans la couleur nommée et possibilité de refus au palier 3 dans la majeure lorsque celui-ci est accessible.

**Ce document clôt un contrôle ciblé, pas un audit exhaustif du catalogue. Aucune publication, fusion, modification du moteur V1, du stockage ni des autres PR.**

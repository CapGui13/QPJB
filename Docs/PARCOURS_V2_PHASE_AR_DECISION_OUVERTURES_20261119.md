# QPJB V2 — Rotation des ouvertures : décisions AO, AP et AQ

**19 novembre 2026 · PR #214 (brouillon) · décision : conserver V2-F tel quel.**

## Constat important : stock source limité

L'exécution reproductible [AO #44539680949](https://github.com/CapGui13/QPJB/actions/runs/44539680949) a mesuré le stock des questions de choix d'ouverture : **84 QCM admissibles, épuisés en tant qu'IDs inédits vers les séances 21–22** de la référence V2-F. Les variantes qui réintroduisent ensuite des ouvertures en répétant des familles dégradent la diversité.

L'inventaire direct confirmé par [AP #44541491216](https://github.com/CapGui13/QPJB/actions/runs/44541491216) distingue **84 QCM mais seulement 55 familles pédagogiques** :

| Difficulté source | QCM |
| --- | ---: |
| 1 | 40 |
| 2 | 32 |
| 3 | 10 |
| 4 | 1 |
| 5 | 1 |
| **Total** | **84** |

Ainsi, **72/84 QCM (85,7 %) sont étiquetés niveau 1 ou 2** ; seuls **deux** sont niveau 4/5. Aucune modification du simple ordre de tirage ne permet d'inventer des exercices d'ouverture complexes ou des familles distinctes nouvelles.

Ces 84 exercices comprennent : 1♣ (12), 1♦ (17), 1♥ (11), 1♠ (11), 1SA (12), Passe (14), 2SA (6), 2♣ (1). Les scores éditoriaux 1–5 ne mesurent pas la difficulté cognitive réelle.

## Expérimentations réalisées hors production

1. **AO — répétitions espacées après la séance 20 : rejetée.** Trois cadences (toutes les trois séances / une sur deux / toutes) testées sur **9 profils fictifs × 45 séances**. **0/9** profil respecte tous les garde-fous pour chaque cadence. Gain local en ouvertures tardives, mais recul du nombre total de familles inédites : AO-three **−11 à −3**, AO-two **−16 à −5**, AO-each **−28 à −14**.
2. **AP — plafonner à une ouverture par séance après S5 : rejetée.** **0/9** scénarios satisfont les garde-fous, baisse des rappels programmés de **6 à 11** (sur 45 séances), certaines séances sans ouverture après S38. Sur 65 séances, les ouvertures ne sont plus réellement régulières en fin de parcours.
3. **AQ — ouvrir une séance sur deux en privilégiant les familles inédites : non retenue.** La présence tardive s'améliore : **5 à 9 questions d'ouverture aux séances 21–30** et **7 à 10 aux séances 31–45**, mais **3/9** seulement passent tous les garde-fous, avec des pertes de rappels **jusqu'à 7**, parfois des pertes de familles ou de réponses mineures. Les parcours prolongés à 65 séances restent cohérents au niveau source (zéro question étrangère et zéro famille trop récente) mais l'exposition des ouvertures devient irrégulière après S45.

**Tous les taux de réussite sont des vérifications de règles prédéfinies sur des profils fictifs, pas des résultats d'élèves.** Les runs GitHub Actions ont réussi techniquement en produisant ces diagnostics ; cela ne valide **aucun** moteur alternatif.

## Décision concrète sur V2

**Ne pas activer AO, AP ou AQ** dans la version jouable, ne pas modifier le score du moteur V2-F ni le Quiz SEF. La bonne piste consiste à **augmenter la variété source des situations d'ouverture**, plutôt qu'imposer des répétitions artificielles. Le moteur V2-F dispose déjà de bons garde-fous sur les autres dimensions : réponses diverses, catégories avancées introduites progressivement, rappels espacés.

### Prochaine action utile

1. À partir des **originaux Bridge Hebdo / Bridge & Moi déjà recensés** et du catalogue Entraînement, **identifier et rapprocher** les exercices authentiques d'ouverture et de deuxième enchère (même famille vs situation différente) contre les 84 QCM actuels ; priorité à des situations d'ouverture des niveaux éditoriaux 3–5.
2. **Ne rien inventer, ne pas modifier le Quiz SEF automatiquement** : produire un inventaire sourcé des exercices distincts réellement réutilisables, vérifier la main complète, les points H, la situation et la réponse et séparer les cas à arbitrer.
3. Seulement si des familles nouvelles sont confirmées, étudier avec l'enseignante une politique de répartition sur 65 séances. La décision de publication V2 reste distincte et exige une vraie recette de séances ; le site actuel n'a pas changé.

## État de livraison

- Sources expérimentales dans `scripts/parcours-v2-rotation-ouvertures-ao.cjs`, `scripts/parcours-v2-etaler-ouvertures-ap.cjs`, `scripts/parcours-v2-ouvertures-aq.cjs` ; aucune de ces variantes n'est intégrée au runtime V2 des élèves.
- Rapports JSON téléchargeables dans les artefacts des actions AO/AP/AQ.
- La prévisualisation AP qui supposait une ouverture à chaque séance a été retirée après son rejet ; ne pas la présenter comme valide.
- **PR #214 en brouillon, V2-F référence inchangée, aucune fusion, aucune publication.**

**Statut : `ROTATION_3_VARIANTES_REJETEES / BESOIN_SOURCE_OUVERTURES_DISTINCTES / V2_F_REFERENCE`.**

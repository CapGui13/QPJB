# QPJB — Parcours V2 : 25 micro-objectifs candidats sur 65 QCM Stayman/Texas

**18 novembre 2026 — phase D, audit documentaire NON ACTIF.** Suit les phases #212, #213 et #214. Le moteur V1.10, les corrigés, le Quiz libre, l'Entraînement, les sauvegardes et les barèmes restent intacts.

## Résultat réel

- **65 QCM / 65 annotés individuellement**, avec leur ID source, leur séquence exacte, leur réponse source, leurs points H et les quatre longueurs. L'inventaire intermédiaire conserve également **mains intégrales, énoncés, choix, explications et justifications**, sans réécriture.
- **25 micro-objectifs pédagogiques candidats** regroupés à partir du rôle, de la convention, de la longueur majeure, du fit et du niveau d'engagement. Ces objectifs sont **des propositions éditoriales**; ils ne constituent pas une validation du contenu, ni des acquis, ni du SEF.
- **6 objectifs à un QCM seulement** : ils ne pourront pas être déclarés maîtrisés sur une réponse isolée.
- **59 familles d'origine différentes pour 65 QCM** : six paires de variantes partagent la même `caseFamily`. Le moteur futur devra éviter d'assimiler deux variantes d'une même famille à deux preuves pédagogiques indépendantes.
- Contrôle hors CI de la source: **65/65 comptages des points H concordent avec les 4 mains; 65/65 distributions correspondent aux longueurs des mains**.

## Vue par grands domaines

| Domaine de la rubrique | QCM | Micro-objectifs proposés |
| --- | ---: | ---: |
| Stayman 1SA — ouvreur | 11 | 2 |
| Stayman 1SA — répondant | 18 | 10 |
| Stayman 2SA — répondant | 6 | 3 |
| Texas majeur 1SA — répondant | 12 | 5 |
| Texas majeur 2SA — répondant | 4 | 1 |
| Texas mineur 1SA — répondant | 8 | 2 |
| Stayman 1SA contré — ouvreur | 3 | 1 |
| Texas majeur 1SA contré — ouvreur | 3 | 1 |
| **Total** | **65** | **25** |

## Degré de progression *proposé* (pas un déblocage)

| Niveau pilote | Micro-objectifs | QCM | Exemples de décisions |
| --- | ---: | ---: | --- |
| 1 : fondations | 2 | 14 | Réponse de l'ouvreur au Stayman sur 1SA; Passe après Texas majeur faible |
| 2 : développement naturel | 9 | 20 | Invitations / manches selon la force, le fit et cinq ou six atouts |
| 3 : extensions | 6 | 14 | Stayman/Texas après 2SA, Texas mineurs faible, maximum après invitation |
| 4 : conventions ciblées | 4 | 9 | Relais, transfert de manche, description de la courte |
| 5 : cas particuliers | 4 | 8 | Chassé-croisé, chelem, intervention sur Stayman/Texas |

Ces niveaux sont de simples **indices de priorité pour un éventuel prototype**. Ils ne remplacent pas la revue des prérequis ni les décisions pédagogiques de l'enseignante. Le document JSON contient les 25 groupes, leurs 65 ID et les traces de décision. On ne crée pas 25 « aptitudes acquises » pour les élèves.

## Points d'arbitrage avant sélection algorithmique

1. **Après Stayman 1SA → 2SA (deux majeures)** : les QCM `SEF-V416-008` et `SEF-V416-009` concluent directement à `4♥` et `4♠`, tandis que `SEF-L18-007` demande expressément le transfert `4♣` pour faire jouer `4♥` par la main de l'ouvreur. Les objectifs sont différents. Valider que la stratégie pédagogique explique cette distinction au lieu de présenter toutes ces décisions comme interchangeables.
2. **Sous-effectifs** : `SEF-L07-028` (accepter une invitation), `SEF-L18-006` (relais), `SEF-L18-007` (transfert), `SEF-L18-008` (exploration), `SEF-L37-005` (chassé-croisé) et `SEF-L39-002` (transfert après 2SA) ne couvrent chacun qu'un cas. Classification informative seulement.
3. **Variantes non indépendantes** : `cas-211`, `cas-214`, `cas-216`, `cas-217`, `cas-219`, `cas-223` ont chacun deux déclinaisons. Le calcul de maîtrise éventuel devra travailler en **familles d'origine** et non uniquement en nombre brut de QCM.
4. **Conventions à vérifier dans le référentiel choisi** : demandes de Stopper sur Stayman/Texas contrés, Texas mineurs et relais/transferts après les réponses à quatre branches du Stayman. Les intitulés reproduisent le protocole du QCM et ne certifient pas un accord universel du SEF.
5. **Cohérence transversale** : les 14 SA préclassés en phase B doivent être mis en correspondance avec ces 25 objectifs pour éviter que l'ouvreur et le répondant soient comptés deux fois comme une même compétence, ou au contraire que des objectifs complémentaires soient déconnectés.

## Suite avant tout changement visible

- Relecture pédagogique des 25 objectifs et des 65 exemples dans le contexte SEF retenu.
- Traiter les six mono-exemples par **regroupement prudent** ou par constat de couverture insuffisante, jamais en fabriquant des donnes.
- Relier les groupes aux compétences d'ouverture / réponse à SA et aux prérequis réellement démontrés.
- Construire ensuite un **simulateur isolé** de parcours non publié: diversité (1♣, 1♦, 1♥, 1♠, 1SA), plafond de répétition d'une famille, progression naturelle, révisions espacées, gestion de l'absence de preuves. Mesurer les performances sur séances simulées avant d'envisager la V2.

**Livrables:** `Docs/PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json`, test `tests/quizz-v2-stayman-micro.cjs`, présent rapport. Tous les statuts restent non actifs.

# QPJB V1 — Préclassification des 65 barrages et 65 chelems
**20 novembre 2026 — issue #226 — statut : propositions non homologuées, lecture seule.**

## Sources et contenu

Les fiches sont tirées de la file exacte de 541 cas `audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json`, liée au catalogue V1 public `quizz.html`, sans réécriture. Chaque fiche conserve : **ID, main, points H, distribution, séquence, énoncé, choix, bonne réponse V1, explication et difficulté source**, plus une catégorie **candidate** et des réserves.

- [65 ouvertures/réponses de barrage](../../audits/QPJB_V1_BARRAGE_65_PRECLASSIFICATION_20261120.json) : **17 compétences candidates** ; 65 questions mais **52 familles source**. **26 variantes** partagent des familles déjà représentées : plusieurs réponses à des mains voisines ne doivent pas compter comme des preuves d'acquisition indépendantes.
- [65 décisions de chelem](../../audits/QPJB_V1_CHELEM_65_PRECLASSIFICATION_20261120.json) : **16 compétences candidates** ; 65 familles de source distinctes, mais **16 variations très proches d'un dialogue de contrôles**. La distinction par « caseFamily » ne suffit pas à assurer l'indépendance pédagogique.
- `node scripts/verify-v1-barrages-chelems-130.cjs` : vérifie les 130 IDs et les sources, les 13 cartes, la forme, les points H, l'unicité des choix, la présence exacte de la bonne réponse et l'absence de chevauchement avec les 48 cas après fit.

Le total est désormais **903 repères heuristiques V1 + 79 attributions SA/Stayman/Texas proposées + 48 après-fit proposés + 65 barrages proposés + 65 chelems proposés + 363 sans proposition = 1 523 QCM**.

**Attention : 257 propositions documentées ne signifient pas 257 classifications pédagogiquement homologuées.** Aucune nouvelle catégorie de cette livraison n'est activée dans le parcours des élèves.

## Barrages : 17 familles de compétence candidates

| Grande famille | Cas | Distinction pédagogique |
| --- | ---: | --- |
| Ouverture de 2 majeur faible : choisir 2M ou 1M, ou passer | 18 | Zone de force, longueur de six cartes et qualité de couleur |
| Ouvertures de barrage à 3 majeure/mineure | 7 | Sept cartes, vulnérabilité et qualité |
| Quatrième position : passer | 1 | Ne pas appliquer mécaniquement les règles des autres positions |
| Répondre à un 2 faible : passer, soutenir à 4M, 2SA interrogatif | 14 | Soutien de barrage, recherche de manche, cas avec/sans fit |
| Soutenir le 2 faible après un contre adverse | 1 | Séquence compétitive distincte |
| Redemande de l'ouvreur après 2M–2SA interrogatif | 6 | Minimum, As/Roi annexe, singleton, 3SA conventionnel |
| Nommer une nouvelle couleur forcing sur 2 faible ou sur 3 de barrage | 7 | Palier, couleur naturelle, rôle des joueurs |
| Soutien de la nouvelle couleur par l'ouvreur du barrage | 1 | Cas à examiner avec deux cartes de soutien |
| Montrer un contrôle avec fit après ouverture de barrage à 3 | 4 | Ne pas confondre un contrôle et une couleur naturelle |
| Après 3SA gambling : 4♣ passe/corrige / 4♦ interrogatif | 2 | Développements distincts |
| Répondre à 4♦ après 3SA gambling : décrire la courte | 4 | 4SA = aucune courte dans le cas documenté |
| **Total** | **65** | **17 groupes fins**, détaillés individuellement dans le JSON |

### Barrages : précautions avant validation

- **SEF-V486-001 à 006** : la réponse au relais interrogatif 2SA sur une ouverture de **2 faible** n'est ni un 2SA fitté ni le 2SA essai après 1M–2M. Vérifier les enchères codées au palier 3, les courtes au palier 4 et la signification conventionnelle de 3SA. Références comparatives : [iBridge, relais 2SA face au 2 faible](https://dev.ibridge-club.fr/public/fichedetails/501), [iBridge, redemande après relais](https://dev.ibridge-club.fr/public/fichedetails/450).
- **SEF-L09-019** : passer en quatrième position avec une faible main à sept Trèfles ne peut être érigé en règle générale pour toutes les positions.
- **SEF-L28-005** : réponse 4♥ de l'ouvreur de 3♣ sur une nouvelle couleur forcing à 3♥ avec deux atouts : examiner l'accord de soutien, l'annonce alternative et la force de l'ouvreur.
- **SEF-V3-100-2 et SEF-L09-018** : vulnérabilité favorable explicitement déterminante ; ne pas classer les réponses comme équivalentes hors de ce contexte.
- **Six cas de 3SA gambling** : compétence conventionnelle transversale ; rapprocher de `SEF-L06-029` (source `sa`) pour éviter des mesures de maîtrise artificiellement séparées.

## Chelems : 16 familles de compétence candidates

| Grande famille | Cas | Distinction pédagogique |
| --- | ---: | --- |
| Réponses au Blackwood 30–41 cinq clés | 8 | Compter 4 As + Roi d'atout ; Dame d'atout |
| Splinters (fit et courte) | 3 | Ne pas confondre avec contrôle au palier 4 |
| Poser la question à la Dame après Blackwood | 3 | Tenir compte de la manche forcée ou non |
| Répondre à la question à la Dame | 7 | Réponse négative/positive selon la couleur d'atout |
| Contrôles après 4♣ et frein à 4♠ | 10 | Carreau, Cœur ou arrêt |
| Contrôles après 4♦ et frein à 4♠ | 6 | Contrôle Cœur ou arrêt |
| Déclencher Blackwood une fois les contrôles établis | 12 | Accord d'atout et ordre économique |
| Continuer les contrôles avant Blackwood | 3 | Contrôle manquant ou économique |
| Freiner par absence de contrôle | 1 | Ne pas poser Blackwood prématurément |
| Décider après réponse au Blackwood | 6 | Compter les clés, s'arrêter, interroger ou conclure |
| 4SA/5SA quantitatifs à Sans-Atout | 3 | Sans fit agréé, distinct du Blackwood |
| Réponse exceptionnelle 5SA avec chicane utile | 1 | Convention dépendante de la séquence |
| Demande de Rois par 5SA | 2 | Montrer le Roi annexe, autre sens de 5SA |
| **Total** | **65** | **16 groupes fins**, détaillés individuellement dans le JSON |

### Chelems : précautions avant validation

- **SEF-L13-018, L32-004, L33-003, L32-005, L41-005, L42-005, L02-E-17** : *5SA n'a pas un sens universel*. Il peut intervenir dans un processus quantitatif, le Blackwood à cinq clés, la demande de Rois ou une réponse avec chicane ; vérifier la séquence complète avant d'attribuer une compétence. Références complémentaires : [iBridge, Blackwood 30–41](https://dev.ibridge-club.fr/public/fichedetails/530), [iBridge, procédure de chelem](https://dev.ibridge-club.fr/public/fichedetails/526).
- **SEF-V474-003 et SEF-V474-010** : question à la Dame au palier de 5♠ lorsque l'atout est Cœur : vérifier que le projet de chelem autorise de dépasser 5♥ et que l'élève comprend cette conséquence.
- **SEF-V483-001 à 016** : très nombreuses variations sur les contrôles après `1♠–3♠`. Les compétences ont été distinguées par annonce précédente et contrôle disponible, mais une suite d'exercices quasi identiques ne constitue pas automatiquement une consolidation variée.
- **SEF-L32-005** : 5SA comme réponse particulière au Blackwood avec deux clés et chicane utile ; vérifier la pertinence effective de la chicane (notamment éviter la chicane d'atout ou une courte inutile), sans réécrire le corrigé seul.

## Prochaine phase

1. **Valider les 257 propositions** sur le fond : pour chaque question, vérifier convention exacte du SEF retenu, rôle, vulnérabilité, H/HLD, choix alternatifs et indépendance pédagogique ; marquer `CONFIRME`/`A_CORRIGER`/`AMBIGU` avec raison et référence. Les cas à forte priorité restent les **7 soutiens simples à 5 H sans courte** de la PR #229, les doubles transferts V1/V2 et les utilisations de 5SA.
2. Classifier les **363 autres** (notamment forcing, Rubensohl, interventions et Roudi), sans inventer de QCM ou de compétence par défaut.
3. Simuler ensuite des profils d'élèves sur la **V1** et mesurer couverture, répétition, erreurs, aide, questions passées et maîtrise ; **aucune migration silencieuse des sauvegardes**.

**Périmètre préservé :** `quizz.html`, `quizz-parcours.js`, `index.html`, 1 523 corrigés, Quiz libre, Entraînement et stockage V1/V2 sont inchangés. Ce document **n'homologue aucune nouvelle compétence**.

# QPJB — Revue des 48 arbitrages restant en attente (23 novembre 2026)

> **AUDIT DE RECHERCHE / AUCUN VISA UTILISATRICE SUPPLÉMENTAIRE.** Aucun QCM modifié ici. Le présent document ne fusionne, n'accepte ni ne déploie les propositions ; les quatre groupes ci-dessous sont des **recommandations d'instruction**, pas des décisions prises au nom du référent.

## Périmètre et contrôles reproductibles

Base source : `main` après intégration unique de la [PR #273](https://github.com/CapGui13/QPJB/pull/273), commit `5209ff828f9521d31009d48b602751243cd73291`.
- Fichier QCM courant : `quizz.html`, blob `031f914ab5698e75c504a525f30eec6a73a2c24e`, **1 523 exercices**, **22 rubriques**.
- Décisions historiques conservées : `audits/wave2/pedagogie/DECISIONS_P20_HOLD.json`, `BULLETIN_17_ARBITRAGES_P29_HOLD.md`; tous les champs `decision=PENDING` y sont des instantanés *antérieurs* aux cinq visas consignés séparément.
- Les **48 HOLD** : 1 rédaction délicate A + 11 accords/conventions B + 36 rédactions historiques C (5 autres corrections déjà intégrées, pas de deuxième fusion).
- Recontrôle effectif du catalogue courant contre les deux fichiers `audits/v1-evolutions/pedagogie/propositions-*.json` : **36/36 ID uniques présents, 36/36 snapshots de champs inchangés, 36/36 mains de 13 cartes et points H concordants, 0 changement de bonne réponse proposé**.
- Recommandation générale : ne pas qualifier un accord de paire de « règle SEF obligatoire » ; ne pas changer mains, réponses, choix, statut ou niveaux sans dossier d'arbitrage.

## A. SEF-V44-005 — 2SA en réponse à 1♣ : **HOLD de fond**

Main : **♠D54 ♥D53 ♦A72 ♣R865** (11 H, 4-3-3-3), séquence `Partenaire : 1♣`, options `2SA / 1SA / 3SA / 2♣`, bonne réponse actuelle **2SA**. Le changement de contexte proposé est descriptif, mais **ne traite pas la véritable interrogation** sur les majeures.

**Deux formulations pédagogiques coexistent.**
1. La fiche [iBridge 21KA](https://dev.ibridge-club.fr/public/fichedetails/177) définit 2SA sur mineure avec 11–12 H et une main régulière, sans en faire explicitement une condition d'arrêts forts dans ses critères affichés.
2. Le cours [Francis Crozat / Les ouvertures en mineures](https://stph.scenari-community.org/bridge/A2-1/co/A2-1-2-Rep-1TK.html) indique une tenue dans les deux majeures pour 2SA/3SA (lorsqu'il n'y a pas de meilleure alternative). Les Dames troisièmes sont bien des **honneurs**, mais leur valeur comme **arrêt sûr** est discutée : [Dictionnaire de séquences, p. 13](https://www.normalesup.org/~fradurand/bridge/dico_encheres_fanfan.pdf) classe Dxx parmi les *demi-arrêts* ; d'autres cours qualifient une Dame troisième d'arrêt à l'enchère ([Adélie Bridge, résultat de recherche](https://www.adeliebridge.fr/arret-bridge-encheres/), site momentanément indisponible).

**Conclusion prudente :** 2SA reste un corrigé **défendable** dans un référentiel qui exige seulement un honneur dans chaque majeure, mais la formulation « deux tenues assurées » ne serait pas fondée. Les trois autres choix ne constituent pas automatiquement de meilleurs corrigés (1SA sous-zoné, 3SA sur-zoné, 2♣ sur quatre Trèfles). Ne modifier ni la bonne réponse ni la main sans arbitrage de l'exigence exacte du cours ; s'il faut enseigner des arrêts fiables, **reconstruire le QCM avec une main vérifiée et des options pédagogiquement recevables**, après nouveau visa.

## B. Les 11 accords — recherches complémentaires par priorité

| ID | Preuve et conclusion de pré-revue | Action avant diffusion |
|---|---|---|
| **SEF-L25-004** | Après `1SA–Passe–2♦ Texas ♥–Contre`, main ♥R8 (non fit) mais ♦AD84 (bon arrêt) : **Passe**, déjà validé **pour le maintien de la réponse et du corrigé** par l'utilisatrice le **20/11/2026** (`Docs/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json`). Une [fiche du Bridge Club du Haut Poitou](https://scjc-bridge.fr/attitude-de-louvreur-de-1-sa-apres-un-contre-du-texas-de-son-partenaire) indique Passe dès l'absence de fit. Une [fiche de François Combesure, p. 2](https://www.bridge-brianconnais.com/wp-content/uploads/2023/02/5-Fiche-synthese-apres-interve_ntion-sur-stayman-ou-texas-1.pdf) confirme *Passe = pas de fit Cœur*. L'[iBridge 44HC](https://dev.ibridge-club.fr/public/fichedetails/622) écrit **Passe = non fitté sans arrêt** dans son résumé, mais son exemple E6592 dit « Sans fit passez » malgré ♦ARxx ; cette fiche est donc elle-même à lire avec nuance. | **Réponse à préserver, décision antérieure explicite**. Préférence pédagogique proposée : enseigner ici « Passe sans fit, arrêt Carreau indifférent » **si** cet accord est confirmé comme celui du cours. Distinguer la conservation de la réponse déjà validée de l'accord explicatif encore en HOLD. |
| **SEF-L13-010** | `1♦–(Contre)–1♠` à partir de **7 HL**, seuil attesté textuellement dans les [Nouveautés SEF 2024, Vincent Romiguière, p. 1](https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf), référence à la page 13 du SEF 2024. Les 7 H et quatre ♠ de la main satisfont l'exigence. | **Preuve normative secondaire désormais retrouvée**, prêt à faire viser le maintien du texte exact ; ne pas présenter comme un simple seuil inventé. |
| **SEF-L20-002** | Après `2♣ FI–2♦–2♥`, le **3♠ Splinter** avec courte ♠ et quatre atouts ♥ est traité sur la **séquence exacte** par [Amour du Bridge — La main d'en face 56](https://amourdubridge.fr/105653-2/). Le résumé [Nouveautés SEF 2024, p. 5](https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf) décrit le principe des Splinters après 2♣ FI et la limite d'un contrôle d'honneur, sans détailler dans cette ligne le 3♠ précis. La main `♠7 ♥D1098 ♦R964 ♣10752` satisfait courte, fit quatrième, et un Roi annexe. | **Séquence exacte étayée**, prêt pour visa de convention ; conserver la nuance entre « exemples au niveau 4 » du résumé et le saut spécifique à **3♠**. |
| **SEF-L13-012** | Cue-bid après soutien majeur adverse : 3♥ = autre majeure (♠) et ♣, [iBridge 32QF](https://dev.ibridge-club.fr/public/fichedetails/292). | Visa sur **cette position précise** ; ne pas généraliser à un autre ordre de parole. |
| **SEF-L14-002** | 2SA relais Multi-Landy positif, réponses 3♣/3♦ mini et 3♥/3♠ maxi, avec la mineure codée : le QCM **définit lui-même** la convention. | **Accord de paire à adopter ou rejeter** ; ne pas le présenter comme unique structure SEF. |
| **SEF-L27-006** | Rubensohl `1SA–(2♥)` : 3♠ demande l'arrêt adverse, [cours Bridge Club d'Alençon](https://alenconbridge.club.ffbridge.fr/en-savoir-plus/roudi-rubenshol-112038). | Visa sur **cette variante Rubensohl**. |
| **SEF-L01-C-04** | Même cours Rubensohl : Contre d'appel à partir de **6 H**, le QCM possède 8 H et 4 Cœurs. Sa mention de difficulté « 7 H/8 H » n'est pas étayée comme seuil dans cette fiche. | Visa de la convention puis **retouche ciblée du motif** si nécessaire ; pas de modification de la réponse. |
| **SEF-L13-017** | Après `2♣ FI–2♦–2♥`, nouvelle couleur au palier de 3 avec au moins cinq cartes correctes à partir de 7 H ; [Nouveautés SEF 2024, p. 5](https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf) confirme le seuil ; le dossier contient 5♣ et 8 H. | Cohérent dans la séquence, visa pédagogique à enregistrer. |
| **SEF-L10-005** | Réponse à une intervention à 1♥ : 2SA naturel avec **13–14 HL** et arrêt dans la couleur adverse, quand n°3 passe, confirmé dans [iBridge 41BA](https://dev.ibridge-club.fr/public/fichedetails/578). | Visa **avec condition « n°3 passe »** ; ne pas confondre avec le mixed raise si n°3 parle. |
| **SEF-V479-004** | Sur 2♣ Landy, 2SA positif est déjà qualifié d'**accord de paire** dans le QCM. Le catalogue cite un **arbitrage utilisatrice du 05/11/2026** et le snapshot `tests/quizz-v497-approved-revisions.json` en conserve les textes. | **Ne pas faire revalider un corrigé déjà arbitré par erreur** ; distinguer accord existant historiquement et éventuelle inclusion dans le programme enseigné. |
| **SEF-C-008** | Sur ouverture 1♠, 6 H et deux ♠, la réponse 1SA non forcing est bien celle du **SEF de base** ([iBridge 21KA](https://dev.ibridge-club.fr/public/fichedetails/177)). | Visa du **référentiel de la question**, sans y substituer automatiquement l'accord de paire « 1M–1SA forcing ». |

### État probatoire du lot B

- **3 cas précédemment signalés « source partielle / conflit » désormais mieux documentés** : L13-010, L20-002 et L25-004. Cela **n'annule pas** la nécessité d'une décision humaine sur les textes et conventions, et **n'efface pas** le choix antérieur explicite concernant la réponse de L25-004.
- **2 accords localement définis** à maintenir comme tels : L14-002 et V479-004.
- **6 autres cas** ont des éléments documentaires compatibles dans un cadre précis : L13-012, L27-006, L01-C-04, L13-017, L10-005, C-008. La documentation ne les transforme pas automatiquement en nouveaux choix approuvés.

## C. Les 36 propositions rédactionnelles historiques — revue des six familles

**Source historique inchangée :**
- `audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json` — 20 propositions.
- `audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json` — 16 propositions.

**Les 36 changements prévus toucheraient chacun seulement** `context`, `explain`, `difficultyReason` : **108 champs textuels** en tout. Le contrôle mécanique prouve l'absence de mutation actuelle, **pas l'acceptation pédagogique** de leurs formulations.

| Famille | Exercices (nombre) | Résultat et réserves pour le visa |
|---|---|---|
| **Réponses sur mineure (12)** | `SEF-017-1`, `SEF-018-2`, `SEF-020-1`, `SEF-021-2`, `SEF-N028-1`, `SEF-N029-2`, `SEF-N031-2`, `SEF-N031-1`, `SEF-N040-1`, `SEF-N045-1`, `SEF-V49-006`, `SEF-V426-002` | Explications centrées sur choix des majeures, 1SA vs soutien mineur, réponses 2/1. **Point de vigilance :** les deux derniers citent la frontière **12 HL du référentiel QPJB sans Walsh** : le cadre doit être explicite dans la leçon, et jamais présenté comme « Walsh actif ». |
| **Après fit majeur (8)** | `SEF-V4-005-2`, `SEF-V4-017-2`, `SEF-V4-010-1`, `SEF-V4-022-3`, `SEF-V44-050`, `SEF-V44-051`, `SEF-V44-053`, `SEF-V423-003` | Distinction 3M barrage, 2SA essai généralisé, essais 3♣/3♦/3♥ à la couleur. **Ne pas rouvrir** le choix 3♦ déjà arbitré pour `SEF-V44-053`. |
| **Roudi (9)** | `SEF-V4-074-3`, `SEF-V4-075-2`, `SEF-V4-077-1`, `SEF-V4-079-3`, `SEF-V4-081-3`, `SEF-V4-082-1`, `SEF-V4-083-1`, `SEF-V4-089-1`, `SEF-V4-090-1` | Cohérence du codage **2♦ = pas de fit**, **2♥ = fit troisième minimum**, **2♠ = fit troisième maximum**, y compris si la majeure est ♠. **Une faute certaine de formulation à corriger avant visa : `SEF-V4-082-1`** (voir ci-dessous). |
| **Drury (3)** | `SEF-V4-098-1`, `SEF-V4-102-1`, `SEF-V4-106-1` | Passe initial, ouverture en 3e position, code 2♦ positif et réponse 1SA sans fit. Le Drury exact retenu doit être enseigné avant de tester les élèves. |
| **Multi-Landy (2)** | `SEF-V45-025`, `SEF-V45-027` | 2♦ artificiel = majeure unicolore sixième, 2♥ = 5♥+mineure ; **convention Multi-Landy**, non présentée comme standard SEF universel. |
| **Rubensohl (2)** | `SEF-V45-032`, `SEF-V45-034` | 2SA transfert Trèfle ; 3♦ Texas impossible → Stayman forcing dans la variante enseignée. Source-cadre : [Bridge Club d'Alençon](https://alenconbridge.club.ffbridge.fr/en-savoir-plus/roudi-rubenshol-112038). |

### Correction de rédaction nécessaire dans la proposition, **pas dans le Quiz vivant**

`SEF-V4-082-1` : le texte proposé dit :

> « Vous avez ouvert 1♣, **répondu 1SA sur 1♠**, et votre partenaire utilise 2♣ Roudi. »

C'est l'ouvreur qui **redemande** 1SA, non qui « répond ». Rédaction de remplacement conseillée, à soumettre à visa :

> « Vous avez ouvert de 1♣, puis **redemandé 1SA après la réponse de 1♠ de votre partenaire**. Il utilise ensuite 2♣ Roudi. Avec seulement deux Piques mais 13 H, quelle enchère choisissez-vous ? »

Le **2♦** correct et les autres champs resteraient inchangés. **Aucune modification réalisée**.

## D. Ordre de décision conseillé — sans présumer des approbations

1. **A :** arbitrer l'exigence de tenue majeure sur `SEF-V44-005`, puis seulement décider si le QCM reste en l'état ou doit être reconstruit.
2. **B technique :** prendre acte des preuves retrouvées pour `SEF-L13-010` et `SEF-L20-002` ; confirmer la formulation doctrinale pour `SEF-L25-004` **sans modifier la réponse Passe déjà approuvée**.
3. **B conventions :** confirmer les traitements précis de Rubensohl, Multi-Landy, Landy et Drury présents dans le cours ; ces accords ne doivent pas être présentés comme universels.
4. **C :** corriger la seule faute rédactionnelle démontrée (`SEF-V4-082-1`) **dans la proposition future** ; arbitrer par familles de 12, 8, 9, 3, 2 et 2 cas, sans approbation groupée aveugle.
5. Pour toute intégration ultérieure : **branches/PR de corrections séparées**, préservation des IDs, réponses, options et 1 523 QCM ; CI Chromium/WebKit, SHA du catalogue et publication uniquement après autorisation explicite.

**État final de cette revue : 5 corrections déjà intégrées ; 48 décisions encore ouvertes. Les preuves se sont améliorées mais aucune nouvelle décision du référent n'a été inventée.**

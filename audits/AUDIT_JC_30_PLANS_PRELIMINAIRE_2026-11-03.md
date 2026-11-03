# QPJB — Revue critique des 30 exercices classiques de jeu de la carte
**3 novembre 2026 — lecture indépendante du catalogue `CapGui13/QPJB`, branche `audit/jc-plans-30-relecture-20261103`.**

## Portée, preuves et limites

**30/30 exercices à format classique** examinés individuellement dans `entrainement/training-data-play.js` : `JC-001` à `JC-023`, puis `JC-BH-100-01`, `JC-BH-060-01`, `JC-BH-120-01`, `JC-BH-044-01` à `JC-BH-047-01`. Les 23 premiers donnent le diagramme et le texte de la question dans `questionText` ; les sept derniers disposent d'un diagramme SVG incorporé et d'un `answerText`. Les mains North/South, contrat, entame, réponse imprimée, chemin envisagé, entrée au mort, coups de sonde, impasses et réserves conditionnelles ont été relus.

**Niveau de preuve : revue critique du mécanisme et de la rédaction, PAS preuve exhaustive de toutes les distributions** : pas de simulation double-dummy exhaustive et pas de réouverture visuelle de chaque PDF original dans ce lot. Les analyses précédentes marquées `strategicAuditStatus: texte_source_rétabli_validation_stratégique_non_réalisée` ou `technicalQA: analyse_de_bridge_independante_restant_a_confirmer` ne doivent **pas** être remplacées par « certifié ». Ce registre ne constitue pas 30 validations stratégiques complètes.

Légende : **M** = mécanisme principal identifié, encore soumis aux distributions adverses ; **R** = réserve pédagogique particulière à approfondir ; **C** = correction de rédaction démontrée et isolée. Toutes les lignes ont fait l'objet d'une revue individuelle, mais aucune étiquette n'est équivalente à une réussite certifiée sur toutes les cartes cachées.

## Revue nominative — 30 exercices

| ID | Décision | Observation individuelle et vérification restante |
|---|---|---|
| `JC-001` | M | 6SA : 11 plis sûrs ; l'ordre « impasse indirecte Pique avant impasse directe Trèfle » évite de perdre la chance résiduelle après le premier échec. Calculer les placements des Dames et les retours défensifs avant de le qualifier d'optimal garanti. |
| `JC-002` | R | 3SA : 3 Cœurs + 5 Carreaux de tête ; l'affranchissement des Trèfles par concession de deux honneurs peut créer le neuvième pli. La formulation « 100 % » n'est pas absolue, le texte source lui-même reconnaissant un retour Pique dangereux ; vérifier le tempo et les communications. |
| `JC-003` | M | 4♥ : huit atouts, Roi-Valet manquants ; double impasse puis défausse du Pique avant de rendre la main à Trèfle. Vérifier la suite pli par pli selon les retours possibles après la première impasse. |
| `JC-004` | M | 4♠ : après trois Cœurs perdus, il faut trois plis de Carreau ; chercher Roi et Valet du bon côté par double impasse. L'estimation 25 % correspond à une hypothèse grossière d'honneurs, sans information dynamique de la défense. |
| `JC-005` | M | 4♥ : ♥10 tombé, le ♥7 du mort peut devenir une communication en dépassant le dernier atout adverse ♥6. Confirmer le placement du Roi de Carreau et le nombre de retours autorisés. |
| `JC-006` | M | 3SA : huit plis sûrs, Trèfle à affranchir ; laisser passer deux fois à Cœur avant de prendre le troisième vise à isoler l'adversaire détenteur de l'As de Trèfle. La position de cet As et la longueur réelle à Cœur sont des hypothèses essentielles. |
| `JC-007` | C | La séquence historique `1♣–1♥–2SA–6♥` n'est pas une recommandation SEF : le seul seuil de 33 HLD ne remplace pas la vérification des contrôles et des cartes clés. L'introduction a été rectifiée, le texte source archivé ; l'exercice reste consacré au plan de jeu à 6♥, sans certification de ses variantes défensives. |
| `JC-008` | M | 3SA : ♦ARD62 au mort face à ♦54, cinq Carreaux dans la ligne du mort ; avec le reliquat 4–2, donner tôt la levée à Carreau préserve une rentrée par les honneurs au mort. Contrôler les retours adverses et le cas 3–3. |
| `JC-009` | R | 3SA : inférence de ♦D en Est fondée sur l'ouverture de 1♥ en Est et le compte exact de 27 H dans la ligne (13 chez les adversaires). Ne conclure que sous l'hypothèse d'une ouverture SEF d'au moins 12 H et avec ♥V d'Ouest connu ; vérifier toutes les communications avant de tirer les honneurs de Carreau. |
| `JC-010` | R | Défense contre 3SA : appel du ♣10 sur l'As d'entame selon le signalement « grosse carte = appel » **explicitement fourni** à l'élève. Conserver ce rappel de convention et ne pas affirmer que ce signal est universel hors de ce cadre. |
| `JC-011` | M | 6♠ : 9 atouts dans la ligne, menace du Valet quatrième adversaire en 4–0. Commencer du côté Roi-Dame pour préserver les fourchettes A9 et D10, puis orienter l'impasse selon la chicane constatée. Contrôler l'ordre exact des retours. |
| `JC-012` | C | Défense de 3♦ : **la localisation de ♥A en Ouest comme certitude est réfutée** par une donne complète avec sept Carreaux commandés par ♦R-D et ♥A en Sud (9 H). Le retour du ♣2 singleton reste un plan de coupe envisagé, **conditionnel** aux reprises et communications d'Ouest ; le nombre de levées n'est pas certifié. Corrigé source archivé. |
| `JC-013` | C | 5♣ : l'affirmation « il ne peut plus rien vous arriver » est **réfutée par une donne adverse complète et cohérente** : une chicane Pique en Ouest permet de couper l'As de Pique du mort. Corrigé nuancé en conservant la version PDF originale ; le plan de coupes croisées n'est pas certifié optimal à toute distribution. |
| `JC-014` | M | 3SA : 7 plis maîtres (2 Cœurs, 4 Carreaux, As de Trèfle) ; concéder As de Pique permet d'établir deux levées supplémentaires grâce à Roi-Dame-Valet. Contrôler le nombre de communications et la durée de tenue à Cœur. |
| `JC-015` | M | 4♥ : comparer l'impasse au Roi de Trèfle et celle au Roi d'atout, compte tenu de l'accès limité au mort. L'impasse Cœur pourrait devoir être répétée ; l'As de Pique du mort est une remontée précieuse. |
| `JC-016` | R | 4♥ : ♥R-D au mort et ♦A10 en Sud ; rejouer Carreau dès la deuxième levée vise à défausser un Trèfle avant de purger l'atout. La certitude dépend du Roi de Carreau entamé et de la position/valeur de la Dame et du Valet ; vérifier la chaîne complète sous toutes les réponses défensives. |
| `JC-017` | M | 3SA : prendre immédiatement l'entame Pique de l'As au mort préserve la fourchette Dame-Valet en Sud comme retour vers les Trèfles affranchis. Vérifier l'As de Trèfle adverse et les retours Pique possibles. |
| `JC-018` | M | 3SA : cumuler ♦3–2 (environ 68 %) avec une seconde chance à Cœur ; jouer As puis Roi de Carreau en choisissant l'ordre des rentrées mineures. Vérifier précisément les variantes de retour à Trèfle lorsque le partage est 4–1. |
| `JC-019` | M | 1SA : ♠A-R en Sud face à ♠V au mort ; jouer petit de Sud vers le Valet pour chercher la Dame en Ouest offre une chance de septième levée à comparer à l'affranchissement des Trèfles. Le contrat est 1SA : vérifier les levées requises et le retour Cœur après échec. |
| `JC-020` | R | 4♥ : entame ♦D, ♦R6 en Sud et ♦A104 au mort ; rendre urgent le transfert de perdante Trèfle sur le troisième Carreau. La ligne est conditionnée par la présence du ♦V avec ♦D chez Ouest et les cartes de sortie de la défense ; ne pas présenter la défausse comme garantie hors de cette condition. |
| `JC-021` | R | 3SA : laisser passer l'entame Pique avant de travailler les Carreaux par double impasse pour couper les communications du flanc. La conclusion « il ne peut rien arriver » mérite une preuve du tempo et de la position de la Dame de Trèfle dans les variantes. |
| `JC-022` | M | 4♠ : cinq atouts en Sud contre trois au mort, coupe utile du troisième Cœur par le Roi de Pique du mort ; donner un tour d'atout seulement puis préserver la coupe. Contrôler le risque de surcoupe et de défense 4–1 à l'atout. |
| `JC-023` | R | 3SA : privilégier l'impasse Trèfle au Roi plutôt que celle à la Dame de Carreau pour choisir l'adversaire qui prendrait la main. L'expression « Roi de Pique protégé » dépend du siège de l'As et du retour choisi ; il faut comparer les variantes avant de certifier le plan optimal. |
| `JC-BH-100-01` | M | 3SA : ♦ et ♥ fournissent les entrées ; ♣ARV52 au mort face à ♣763 permet un coup de sonde à l'As ou au Roi pour une Dame sèche, puis impasse en revenant en Sud. Refaire le calcul de gain selon la longueur manquante. |
| `JC-BH-060-01` | R | 3SA : développer les cinq Piques du mort par un petit Pique de Sud vers Roi-Dame, face à l'As adverse. La réussite dépend du siège de l'As et du tempo de la longue couleur Cœur entamée par le Roi ; ne pas promettre une réussite universelle. |
| `JC-BH-120-01` | C | **Erreur certaine de formulation corrigée sur la branche** : avec ♠AV9 au mort et ♠R10 en Sud, Nord n'a aucune rentrée extérieure. Sur l'entame 4♠, Nord fournit 9♠, Est 2♠ : Sud doit mettre le Roi puis conserver le 10♠ pour le mener vers As-Valet. Le texte « revenez au mort » était inexécutable sans préciser cette communication. L'ancien texte est archivé, la main et l'image sont intactes. |
| `JC-BH-044-01` | R | 3SA : recherche de la neuvième levée à Pique avec Dame au mort et Roi en Sud en donnant As adverse. La ligne exige le positionnement de l'As et le maintien d'un arrêt Cœur ; vérifier les retours adverses. |
| `JC-BH-045-01` | M | 4♥ : ♦V82 au mort face à ♦AD10 en Sud ; après As de Pique au mort, le Valet de Carreau cherche la finesse du Roi situé en Est, en préservant l'accès. Vérifier le cas de couverture et les retours après l'impasse. |
| `JC-BH-046-01` | M | 6♥ : huit Cœurs : Nord ♥AD109, Sud ♥7653 ; Roi et Valet manquants. Deux impasses successives exigent un placement favorable chez Ouest et des rentrées en Sud ; ne pas oublier que le premier pli Pique a déjà été perdu. |
| `JC-BH-047-01` | R | 4♠ : jouer ♥V de Sud vers ♥D au mort pour profiter du placement favorable du Roi et défausser le Carreau urgent. La réussite dépend de la carte fournie par Ouest et de l'accès aux Cœurs du mort ; vérifier une défense qui cherche les atouts en premier. |


### Contre-exemple formel à l'assertion universelle de JC-013

Dans JC-013, Nord détient ♠AV654 ♥8 ♦AD5 ♣RV103 ; Sud ♠2 ♥AV975 ♦964 ♣AD92. La donne suivante est valide :

| Siège | Piques | Cœurs | Carreaux | Trèfles |
|---|---|---|---|---|
| Nord (mort) | AV654 | 8 | AD5 | RV103 |
| Est | RD109873 | 32 | V832 | — |
| Sud (déclarant) | 2 | AV975 | 964 | AD92 |
| Ouest | — | RD1064 | R107 | 87654 |

**Contrôle de validité :** 13 cartes exactement par joueur ; les 13 cartes de chaque couleur sont distinctes et présentes une fois, sans doublon. Ouest peut entamer du **♦7**, Nord remporte le premier pli de l'**♦A**, puis joue **♠A** comme le prescrit le corrigé. **Ouest, chicane Pique, coupe ♠A avec ♣4** (Sud doit fournir son unique ♠2). La recommandation « il ne peut plus rien vous arriver » est donc fausse dans cette distribution, sans supposer de coup illégal ou de carte impossible. Le plan source peut fonctionner dans des répartitions plus favorables, mais ne doit pas être présenté comme garanti.

**Correction éditoriale ciblée :** conservation du texte imprimé dans `sourceOriginalAnswerText`, précision du risque de coupe/surcoupe dans `answerText` et métadonnées `pedagogicalAudit_20261103`. Aucun changement de main, ID, PDF ou résultat élève ; cela ne constitue pas une résolution double-dummy exhaustive.


### Contre-exemple démontré — JC-012 : As de Cœur en Sud

Le texte de source annonçait que l'As de Cœur était **forcément en Ouest** après le barrage de Sud à 3♦. Cela suppose implicitement ♦R-D-V en Sud (six points H), auquel cas l'As de Cœur ferait atteindre dix points. Mais le barrage ne promet pas le Valet de Carreau : sept Carreaux commandés par ♦R-D restent possibles.

| Siège | ♠ | ♥ | ♦ | ♣ | H |
|---|---|---|---|---|---:|
| Nord | RV975 | DV43 | 10 | AV10 | 12 |
| Est | AD843 | R1086 | A43 | 2 | 13 |
| Sud | 62 | A | RD98765 | 987 | **9** |
| Ouest | 10 | 9752 | V2 | RD6543 | 6 |

**Preuve de cohérence :** cette donne possède 52 cartes distinctes, treize par joueur, et 40 points H ; chaque couleur contient ses 13 cartes exactement une fois. Elle reproduit la première levée : Ouest ♠10, Nord ♠V, Est ♠D, Sud ♠6 ; Est prend. Sud possède **♥A avec seulement 9 H et sept Carreaux**, en accord avec la limite de force de l'énoncé. L'emplacement de ♥A n'est donc pas inférable avec certitude. Les deux mains cachées constituent un contre-exemple, pas une reconstitution du PDF.

**Action éditoriale limitée :** proposition de retour du **♣2 singleton** maintenue comme plan de coupe conditionnel, mais déduction de ♥A en Ouest et garantie d'une chute supprimées. Le texte original reste archivé dans `sourceOriginalAnswerText` ; aucune carte, ID, PDF ou progression élève ne change. La défense optimale selon toutes les distributions et les retours reste **à expertiser**.


### Cohérence SEF — JC-007, saut direct à 6♥

La séquence du document d'origine est **1♣–1♥–2SA–6♥**, avec six Cœurs en Sud et 2SA fort régulier (18–19 HL) en Nord. Le contrat et la donne sont conservés comme point de départ de l'exercice de jeu de la carte, **pas comme modèle d'enchères automatique**. L'indication documentaire « 33 HLD, donc sauter directement au petit chelem » n'est pas une preuve de contrôles ni de cartes clés. En particulier, 2SA ne promet pas trois Cœurs : il faut une recherche coordonnée des contrôles et de la qualité d'atout.

La banque QPJB possède déjà le cas `EN-BH-077-04` (séquence identique) : l'ancienne réponse 6♥ y a été remplacée par **3♥**, répétition forcing de la majeure sixième avec espoir de chelem. L'introduction de `JC-007` est désormais cohérente avec cette décision pédagogique : le saut immédiat n'est pas à imiter, le plan de jeu étudié suppose simplement que l'on est déjà à 6♥. Dans la donne particulière, le camp possède les quatre As, mais ce fait n'était pas connu du répondant au stade de sa décision.

Le texte imprimé précédent est sauvegardé dans `sourceOriginalAnswerText`, avec les métadonnées `pedagogicalAudit_20261103c`. **La suite consacrée au maniement des Cœurs et à la défausse Pique sur Carreau reste identique à la source**, sans prétendre l'avoir validée sur toutes les distributions adverses.

## Bilan et décisions

- **30/30 fiches répertoriées et relues au niveau du mécanisme** ; **4 corrections ciblées justifiées et appliquées** (`JC-BH-120-01`, `JC-013`, `JC-012`, `JC-007`), **plusieurs autres réserves sans correction automatique**.
- **Aucune certification stratégique exhaustive revendiquée**, et aucune modification des 26 autres corrigés ni des PDF originaux.
- Priorités de contre-expertise complète : **`JC-013`** (la fausse garantie est corrigée mais le plan demeure à prouver), **`JC-012`** (condition de coupe encore à étudier après rectification de l'inférence), **`JC-021`** (tempo de 3SA), **`JC-007`** (commentaire d'enchères corrigé, plan de carte encore à démontrer), puis `JC-002`, `JC-016`, `JC-BH-060-01`.
- `JC-BH-120-01` : ancien `answerText` archivé dans `sourceOriginalAnswerText`, nouvel `pedagogicalAudit_20261103`; **ID, diagramme, source PDF, statut d'accès et progression locale préservés**.
- 563 enchères et 114 cartes sont conservées et accessibles. Le total 677 ne change pas. Modules `20261103e`, cache `qpjb-v49` ; tests d'intégrité à exécuter avant diffusion.

**Prochaine passe :** démontrer les lignes des sept priorités sur distributions adverses concrètes ou contre-exemples, puis seulement corriger ce qui est confirmé. Des simulations / un moteur de jeu permettront d'éviter de certifier abusivement des plans plausibles.

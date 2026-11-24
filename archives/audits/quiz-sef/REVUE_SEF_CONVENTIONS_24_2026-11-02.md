# QPJB — Audit de 24 exercices de conventions avancées (2 novembre 2026)

**Dépôt :** `CapGui13/QPJB`, `main` ; **source :** fiches présentes dans `quizz.html` (SHA blob `16a1d4f5f6d6bc4604ed3e01b0557bffe9001156`). **Méthode :** contrôle individuel de la main, des points H, de la distribution, de l'intervention/atout agréé, de la bonne réponse, des trois distracteurs, du corrigé et de la difficulté (1 à 5).

**Bilan : 24/24 examinés ; 24 bonnes réponses retenues ; aucune correction certaine nécessitant un commit de données.** Six Multi-Landy, six Rubensohl, six Michaels précisés et six Blackwood 30–41. Les réponses sont conformes **aux versions conventionnelles explicitement annoncées dans ces exercices**, et non à toutes les variantes possibles du bridge. Pas de modification opportuniste des autres fichiers, réponses ni de la progression.

## Fondement des conventions employées

- [iBridge — Rubensohl après intervention](https://www.ibridge.fr/public/fichedetails/24) : couleurs du palier de 2 naturelles ; à partir de 2SA, Texas ; contre d'appel ; Texas impossible = Stayman forcing. [Exemples après 2♥](https://www.ibridge.fr/public/fichedetails/337).
- [Michaels précisés, tableau complet](https://www.bridgesaintcloud.fr/quesaquoA18.html) : sur mineure, 2♦ deux majeures ; sur 1♥ ou 1♠, cue-bid autre majeure + ♣, saut à 3♣ autre majeure + ♦.
- [iBridge — Le Blackwood et la Dame d'atout](https://www.ibridge.fr/public/fichepdf/365) : 5♣ = 0/3, 5♦ = 1/4, 5♥ = deux clés sans Dame, 5♠ = deux clés avec Dame.
- Multi-Landy : convention de défense décrite dans la rubrique elle-même (2♣ = les majeures, 2♦ = une majeure longue, 2♥/♠ = majeure + mineure, 2SA = deux mineures). L'exercice explicite le cadre `Multi-Landy` et la vulnérabilité ; il ne s'agit pas d'un choix à demander à l'élève.

## Vérification nominative

| ID | Rubrique | Main (♠, ♥, ♦, ♣) | H | Bonne enchère | Difficulté actuelle | Verdict et justification |
|---|---|---|---:|---|---:|---|
| `SEF-V45-023` | Multi-Landy | ♠RD642 ♥AV108 ♦A5 ♣V4 | 15 | **2♣** | 3 | 5♠+4♥ : 2♣ Landy décrit les deux majeures ; force de 15 H et contexte non vulnérable. |
| `SEF-V45-025` | Multi-Landy | ♠ARD1073 ♥V6 ♦V103 ♣D7 | 13 | **2♦** | 3 | Six ♠ sans seconde majeure quatrième : 2♦ Multi indique un unicolore majeur non encore précisé. |
| `SEF-V45-026` | Multi-Landy | ♠D10 ♥ARDV65 ♦D85 ♣98 | 14 | **2♦** | 3 | Six ♥ ARDVxx : 2♦ Multi unicolore majeur, et non 2♥ (majeure + mineure). |
| `SEF-V45-027` | Multi-Landy | ♠52 ♥AR1072 ♦RDV6 ♣V5 | 14 | **2♥** | 4 | Cinq ♥ et quatre ♦, 14 H : 2♥ code le bicolore Cœur–mineure. |
| `SEF-V45-028` | Multi-Landy | ♠ARDV5 ♥98 ♦D8 ♣D653 | 14 | **2♠** | 4 | Cinq ♠ et quatre ♣, 14 H : 2♠ code Pique–mineure. |
| `SEF-V45-029` | Multi-Landy | ♠10 ♥R9 ♦ARV94 ♣R10832 | 14 | **2SA** | 5 | Deux mineures cinquièmes ♦/♣ et 14 H : 2SA bicolore mineur ; ni 2♣ Landy ni 2♦ unicolore majeur. |
| `SEF-V45-031` | Rubensohl | ♠A8643 ♥V9 ♦953 ♣742 | 5 | **2♠** | 3 | Sur 1SA–(2♥), cinq ♠ et 5 H : 2♠ naturel faible au niveau de 2, pas le Texas de manche à 3♥. |
| `SEF-V45-032` | Rubensohl | ♠75 ♥96 ♦743 ♣RD10975 | 5 | **2SA** | 4 | Sur 1SA–(2♥), six ♣ faibles : 2SA est Texas Trèfle, donc pas 3♣ naturel. |
| `SEF-V45-033` | Rubensohl | ♠R5 ♥105 ♦RV10932 ♣743 | 7 | **3♣** | 4 | Sur 1SA–(2♥), six ♦ et 7 H : 3♣ Texas Carreau ; permet l'arrêt au palier de 3. |
| `SEF-V45-034` | Rubensohl | ♠AV63 ♥D3 ♦RV32 ♣962 | 11 | **3♦** | 5 | Sur 1SA–(2♥), quatre ♠ et 11 H : 3♦ Texas impossible / Stayman forcing de manche, sans arrêt ♥ assuré. |
| `SEF-V45-035` | Rubensohl | ♠AD873 ♥V4 ♦V108 ♣R107 | 11 | **3♥** | 4 | Sur 1SA–(2♥), cinq ♠ et 11 H : 3♥ Texas Pique, plus constructif que 2♠ naturel faible. |
| `SEF-V45-036` | Rubensohl | ♠V64 ♥A43 ♦9863 ♣AR10 | 12 | **3SA** | 3 | Sur 1SA–(2♥), 12 H réguliers et arrêt ♥ par As : 3SA naturel de manche. |
| `SEF-V45-041` | Michaels précisés | ♠RD1062 ♥A10632 ♦R5 ♣10 | 12 | **2♦** | 3 | Sur 1♣, les deux majeures cinquièmes donnent l'intervention artificielle de 2♦, non une couleur Carreau. |
| `SEF-V45-042` | Michaels précisés | ♠AR1085 ♥R10976 ♦V ♣72 | 11 | **2♦** | 3 | Sur 1♦, les deux majeures cinquièmes sont annoncées par le cue-bid 2♦. |
| `SEF-V45-043` | Michaels précisés | ♠A10954 ♥D ♦D9 ♣R10852 | 11 | **2♥** | 4 | Sur 1♥, 5♠+5♣ (11 H), le cue-bid 2♥ décrit les deux couleurs. |
| `SEF-V45-044` | Michaels précisés | ♠D ♥AD1092 ♦106 ♣RDV42 | 14 | **2♠** | 4 | Sur 1♠, 5♥+5♣ (14 H), le cue-bid 2♠ décrit les deux couleurs. |
| `SEF-V45-045` | Michaels précisés | ♠RV632 ♥D ♦ARD86 ♣108 | 15 | **3♣** | 5 | Sur 1♥, 5♠+5♦ : le saut artificiel à 3♣ montre l'autre majeure et Carreau. |
| `SEF-V45-046` | Michaels précisés | ♠7 ♥A8732 ♦RV1074 ♣A9 | 12 | **3♣** | 5 | Sur 1♠, 5♥+5♦ : le saut artificiel à 3♣ montre l'autre majeure et Carreau. |
| `SEF-V45-050` | Blackwood 30–41 | ♠D98 ♥RV73 ♦D64 ♣853 | 8 | **5♣** | 3 | Atout ♠ agréé ; aucun As ni Roi de ♠ = zéro clé : 5♣ (0 ou 3). |
| `SEF-V45-051` | Blackwood 30–41 | ♠D1086 ♥A106 ♦R98 ♣952 | 9 | **5♦** | 3 | Atout ♠ ; un As ♥ sans Roi de ♠ = une clé : 5♦ (1 ou 4). |
| `SEF-V45-052` | Blackwood 30–41 | ♠A865 ♥1094 ♦ARD ♣982 | 13 | **5♥** | 4 | Atout ♠ ; As de ♠ et As de ♦, pas de Dame de ♠ = deux clés sans Dame : 5♥. |
| `SEF-V45-053` | Blackwood 30–41 | ♠AD63 ♥AR2 ♦V42 ♣983 | 14 | **5♠** | 4 | Atout ♠ ; As de ♠ et As de ♥, avec Dame de ♠ : deux clés avec Dame : 5♠. |
| `SEF-V45-054` | Blackwood 30–41 | ♠9654 ♥AD3 ♦ADV ♣AR2 | 20 | **5♣** | 3 | Atout ♠ ; trois As ♥/♦/♣, pas de Roi de ♠ : trois clés = 5♣. |
| `SEF-V45-055` | Blackwood 30–41 | ♠R106 ♥R876 ♦R65 ♣D85 | 11 | **5♦** | 3 | Atout ♥ ; Roi de ♥ comme seule clé (malgré les Rois annexes ♠ et ♦) : 5♦. |

## Points de vigilance, non assimilés à des erreurs

1. Le rappel « Rubensohl » ou « Multi-Landy » dans l'énoncé ne donne pas la grille complète. **Pour les débutants**, vérifier qu'une règle de convention est consultable dans le parcours pédagogique avant le QCM. Ce contrôle d'accessibilité pédagogique reste à effectuer en situation sur iPhone.
2. Les **niveaux 5** des Michaels moins fréquents peuvent être recalibrés ultérieurement : reconnaître le codage d'une convention ne nécessite pas nécessairement un arbitrage stratégique exceptionnel. Aucune modification mécanique de difficulté dans cette revue.
3. La vraisemblance des trois distracteurs de chaque fiche est examinée, mais un distracteur construit pour une autre variante n'est pas nécessairement formateur : réévaluer les plus faciles sur un lot distinct et documenté.
4. Le constat **24 fiches conformes à leur convention annoncée** ne signifie ni 120 conventions complètement auditées ni certification des 993 questions du catalogue.

**Suite :** mettre à jour le registre nominatif des 993 exercices et la feuille de route ; puis vérifier les tests et la publication du dernier commit avant de continuer d'autres corrections de contenu.

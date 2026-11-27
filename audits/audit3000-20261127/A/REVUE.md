# Audit A — 419/419 lectures, patches livrés ; validation d'intégration incomplète
Base ccd8f20811b9531bbfccb8352ec60953dd7d07cb. Bilan passe 13 : {"counts":{"RECLASSER_REFORMULER":144,"VALIDE":228,"ARBITRAGE":47},"corrections":147,"reservoirIds":23,"ajouts":3,"retraits":22,"historique993":65}.
Contrôles exécutés sur base et patches : {"catalogue":true,"exact":true,"mainsBase":true,"mainsPatches":true,"legalBase":true,"legalPatches":true,"corrections":true,"metadata":true,"reservoir":true,"groupes":true}. Légalité : toutes les enchères explicites croissent au-delà du dernier contrat, ou Passe ; le catalogue comporte des séquences abrégées, pas de reconstitution de joueurs omis. Vérification des quatre choix et réponse, cartes et rangs, forme, points H, clés objets complètes, IDs inchangés, métadonnées et groupes réels. Les contrôles existants n'ont pas été exécutés localement (git ls-remote : résolution DNS github.com impossible). Aucun workflow associé au SHA de la passe 10 au moment de la consultation. Pas de certification SEF externe.
Redondances : signatures strictes initiales 96 IDs ; familles initiales 322 IDs. Deux objets à main strictement identique (V2-M1-015/016), contraste deuxième/troisième position, à conserver. Les huit paires interlots dans une même famille ont été relues en entier : tous sont des contrastes utiles, voir redondance.arbitrageInterlot. Aucun analogue strict de signature initiale hors lot. 15 retraits de co-memberships redondants, chaque QCM conserve au moins une affectation ; aucune suppression. Deux QCM différenciés : Q400-A-039 (11 HL juste sous 2/1), Q400-A-024 (total 14 règle des 15). Les analogues qui ne partagent ni main ni signature ni famille restent non exhaustivement contrôlés. L33-005 : proposition de remplacement et transfert interlot à arbitrer. Les 47 arbitrages comprennent principalement des groupes d'objectifs absents du programme (2/1, réponses SA naturelles sur 1m, réponses après Passe sur mineure). Ne pas les déduire d'un simple manque d'affectation explicite. Aucun changement moteur ni fichier commun. Les patches ne sont pas intégrés dans le catalogue de production.

## Journal des passes (états historiques, les compteurs ci-dessus prévalent)
# Audit A — état PARTIEL, non intégrable sans poursuite
Base ccd8f20811b9531bbfccb8352ec60953dd7d07cb. 419 IDs d'origine, tous trouvés dans les 3000 QCM. 419 verdicts provisoires après lecture individuelle, 0 non relus. 260 VALIDE provisoires, 112 RECLASSER_REFORMULER, 47 ARBITRAGE, 132 patches catalogue et 3 changements de groupes. Pas de certification externe.
Les cinq corrections concernent la justification du 2 faible (2 cas), le forcing de 1♠, le caractère de recours de 1SA, et la suppression d'une concurrence naturelle omise dans un soutien mineur par modification de main (7 H inchangés, 9 HL). Le déplacement concerne 028-2, soutien sur 1♠ dans un groupe sur 1♥. Les analogues de même enchère/forme/H/réponse sont des candidats de redondance, pas des doublons automatiquement condamnés. 247/419 sans affectation explicite dans les groupes du programme ; le moteur peut sélectionner des compléments natifs : ne pas assimiler à 247 erreurs. Les anciens cas cas-006/007/009/010/013/014/015/016/019/021/022/023/024/025 ont des variantes de force ; ne pas les juxtaposer sans contraste utile. Vérifier les signatures et familles dans la suite de l'audit.
Tests réellement exécutés dans JS : parsing du blob et JSON, couverture exacte des IDs d'origine, unicité des 3000 IDs, recomptage H/forme/13 cartes, absence de répétition intra-couleur, quatre choix distincts avec réponse présente sur 419/419, mêmes contrôles sur 5 corrections, unicité des 40 verdicts, groupe source et destination vérifiés, correspondance des groupes du programme et de la constante PROGRAMME65 (65 séances). Légalité générale des enchères et tests existants non exécutés. Comparaison sémantique complète, arbitrage et 379 verdicts restants à faire. Aucune modification du moteur.

## Passe 2
40 cas supplémentaires : ouverture majeure 15–17 H, explicitation du traitement retenu (priorité majeure, revue interne REVUE_50), meilleure mineure longueur vs qualité, 2 faible exclu avec cinq cartes, statut forcing de réponse 1♠. Ajout proposé 029-1 en S3.2 comme contre-exemple de fit neuvième insuffisant ; à distinguer du soutien invitant. 80 verdicts uniques exactement préfixe du périmètre, 13 corrections avec H, forme, cartes et choix valides. Toujours 339 non relus et contrôles existants non exécutés.

## Passe 3
40 cas supplémentaires : soutien mineur sans concurrence 1♦ (N031-2), distracteurs plus proches et seuil du 2 sur 1. N045-1/N045-3 : arbitrage de calendrier, aucune séance ne porte explicitement l'apprentissage du 2 sur 1 ; ne pas les présenter en S2 avant acquisition. Rectification des propositions de passe 2 : 029-1 reste sans groupe explicite, car le groupe S3.2 traite 6–10 contre 11–12 HLD et non le fit insuffisant ; signaler une lacune au coordinateur. Retrait de la borne 6–10 HL introduite par erreur dans 020-3, puisque le traitement du catalogue inclut une réponse 1SA à 11 HL (N031-1/N041-2). 120 verdicts uniques exactement préfixe du périmètre, 19 corrections contrôlées mécaniquement ; 299 non relus. Aucune certification externe ni exécution des tests existants.

## Passe 4
45 cas supplémentaires. Quatre distracteurs de soutien majeur revus pour que l'élève tranche entre 2M et 3M à 10 HLD ; correction de la formulation autoforcing pour 13 réponses 2 sur 1 et signalement de leur lacune de calendrier. Les 1SA sur 1M restent non forcing dans le traitement SEF du catalogue, pas de modification vers un accord privé. 165 verdicts uniques exactement préfixe du périmètre, 36 corrections contrôlées mécaniquement. Tentative git ls-remote depuis le conteneur : résolution DNS github.com impossible, donc tests du dépôt non exécutés. 254 non relus.

## Passe 5
45 cas supplémentaires. Soutiens mineurs : préciser les seuils en HL et supprimer la concurrence naturelle de 1♦ dans V412-015 avec une main reconstruite (9 H, 11 HL). Réponses naturelles 2SA/3SA sur 1m : groupe d'objectif absent, arbitrage calendrier (ne pas confondre avec réponses sur 1SA). Les paires V49-005/006 et V426-001/002 contrastent la priorité majeure jusqu'à 12 HL et mineure au-delà selon le traitement actuel du catalogue ; pas de certification externe. 210 verdicts uniques exactement préfixe du périmètre, 52 corrections contrôlées mécaniquement, 209 non relus.

## Passe 6
45 lectures. Réponses après Passe sur mineure sans groupe spécifique : arbitrage calendrier (ne pas les placer en Drury). L33-005 : transfert concept fortes.ouverture à arbitrer par coordinateur, réponse 2♦ reconnue défendable dans le corrigé, ne pas imposer une réponse unique sans accord. V2-M1-008 : prérequis SA proposés. Contrastes intentionnels V2-M1-015/016 et 017/018 conservés. Difficulté L06-021 ramenée à 3, placement précoce à vérifier.

## Passe 7
45 lectures. V2-M1-031 : main corrigée pour exclure 1♦ sans supprimer le distracteur. Ajouts S2.2 PN26-M1-006 et S3.1 PN26-M1-032, complètent les contrastes déjà présents. Familles Q400-A à conserver comme variantes, pas comme notions différentes. Arbitrages calendrier SA direct sur mineure et 2/1 maintenus.

## Passe 8
45 lectures. Q400-A : suppression des distracteurs 2SA fitté avant son enseignement S12 dans six exercices S3 ; maintien du contraste soutien simple/invitant. Nettoyage d'un corrigé éditorial et de deux énoncés orientés. Les variantes de couleurs, formes et seuils conservent leurs familles. Format reservoir homogénéisé (remove/add).

## Passe 9
40 lectures Q685. Distracteurs irréalistes substitués par des erreurs naturelles plausibles ; corrigés adaptés aux longueurs véritables, calcul HL pour les soutiens mineurs et la priorité majeure. Familles 4441, six mineurs et bicolores majeurs : nombreuses variantes, ne pas compter comme notions distinctes.

## Passe 10
34 lectures, couverture individuelle 419/419. Q685-A fin : clarification du répondant non passé, force HL, forçage des réponses naturelles, distinction entre 1SA de recours et 2/1, calcul HLD détaillé, déplacement d'honneurs singletons pour éviter une interprétation divergente de la décote, retrait du distracteur 2SA fitté avant S12. Les mains modifiées préservent H, forme et réponse ; vérifications mécaniques réussies. Restent contrôles de synthèse et comparaison approfondie des analogues.

## Passe 12 — contre-vérification complémentaire
Balayage lexical après patches de 1 169 010 paires distinctes impliquant au moins un ID A sur les 3000 exercices. Après exclusion des réponses différentes, familles communes, mains identiques et signatures strictes déjà traitées : 60 000 paires testées par Jaccard de mots normalisés des corrigés et contextes. 404 candidats (seuil corrigé >= 0,75, ou corrigé >= 0,48 et contexte >= 0,65, ou groupe partagé et corrigé >= 0,50), 30 avec groupe partagé, aucun interlot détecté à ces seuils. Ce filtre ne certifie pas l'absence de doublons sémantiques ni l'unicité de réponse. Les candidats ne sont pas tous relus individuellement. Les exemples à 7 H vs 11 H, fit huitième vs neuvième, et 1SA faible vs limite 2/1 sont des contrastes utiles. Corrections concrètes : six retraits d'affectations sur cinq IDs pour espacer trois paires de permutations triviales ; deux QCM déjà patchés différenciés par les seuils 6 HL (037) et 11 HLD (077), réponses préservées. Aucun ID supprimé. Bilan actualisé : {"counts":{"RECLASSER_REFORMULER":134,"VALIDE":238,"ARBITRAGE":47},"corrections":137,"reservoirIds":23,"ajouts":3,"retraits":22}. Contrôles indépendants réellement réexécutés : {"base3000":true,"exact419":true,"mainsOriginales":true,"mainsPatches":true,"patches":true,"groupes":true,"pasDePerte":true}. Nouvelle tentative git ls-remote : DNS github.com toujours indisponible ; aucun workflow PR associé à 0992b1f. Les tests existants restent non exécutés. 47 arbitrages restent réservés au coordinateur, dont la lacune de calendrier du 2/1, des réponses SA directes sur mineure, des réponses après Passe et L33-005. MISSION DÉFINITIVEMENT TERMINÉE : NON.

## Passe 13 — revue des co-affectations et protection historique
Relecture des 27 candidats encore co-affectés détectés après passe 12 : S1.2 (009-1/N007-1, 012-1/N005-1, Q400-A-011/Q400-A-015) : longueur différente de règle d'égalité, conserver ; S1.1 (013-1/V49-003) : 7 H faibles vs 11 H à la limite, conserver ; S3.3 (N061-2/Q400-A-039) : 8 HL vs 11 HL juste sous 2/1, conserver ; S2.4 (Q400-A-035/Q685-A-036/Q685-A-037) : 8, 7 et 6 HL, dont seuil inférieur travaillé, conserver ; S3.2 (Q400-A-047/Q685-A-077) : 12 vs 11 HLD, seuil d'invitation travaillé, conserver. S58.1/S65.5 : les 18 autres paires de soutien Cœur rapprochent surtout 3 atouts (070–073) et 4 atouts (026-3, 078–080), points D/L et HLD différents ; mêmes réponses intentionnelles, variantes à espacer lors de l'intégration. 026-3 vs 078 est la seule paire à forme identique et 8/9 HLD ; ne pas juxtaposer si la capacité du groupe impose un choix. 026-3 vs 079/080 : même total 8 HLD par mécanismes différents (6H+2D vs 5H+2D+1D), contraste pédagogique utile. Pas de nouveau retrait arbitraire dans ces groupes. Les 67 autres paires non co-affectées avec similarité du corrigé >=0,9 restent des variantes proches : notamment longue mineure / égalité, 1♣ vs 1♦ et 1♥ vs 1♠, 1SA régulier avec fit mineur, 2/1. Les 404 candidats du filtre ne sont pas tous relus individuellement.
11 QCM retravaillés (10 nouveaux patches, 1 patch existant amélioré). En particulier, 1SA naturel sur 1♦ malgré un fit mineur et une main régulière : réponses conservées conformément à REVUE_72_REPONSES_OUVERTURES_MINEURES_2026-11-04.md (cas 11–12, 43–44, 47–48, 54–55, 64). Corrigés : distinction H/HL, fit certain avec cinq cartes vs non garanti avec quatre, rejet du soutien ou du changement de couleur. Deux énoncés sur 1♦ et un sur 1♣ ne donnent plus le comptage de la main. N065-2 : 2♦ remplace Passe pour tester la longueur relative des mineures ; arbitrage de calendrier maintenu.
Risque d'intégration identifié par lecture du vrai test tests/quizz-integrity.cjs et de tests/quizz-v488-approved-revisions.cjs : contrôle SHA-1 du bloc historique des 993 QCM après normalisation inverse par manifestes d'exceptions exactes. 65 patches A touchent ce bloc. Le coordinateur doit faire approuver et enregistrer les révisions exactes avant/après, préserver le hash historique via le mécanisme de normalisation contrôlée, jamais le remplacer ou affaiblir les assertions. Liste des IDs et champs touchés ci-dessous. Aucune modification du catalogue ni des tests sur cette branche. Le test complet n'est pas exécuté : git ls-remote réessayé dans le conteneur, échec DNS github.com. Contrôles indépendants ciblés réellement exécutés, dont assertions adaptées de la source du test existant sur le catalogue projeté : {"base3000":true,"exact419":true,"mainsOriginales":true,"mainsPatches":true,"patches":true,"reponsesPasse13":true,"legalPasse13":true,"groupes":true,"protectionFormulationLotA":true,"aucuneNouvelleFormulationInterdite":true,"champsInterdits":true,"themes22":true}. L'assertion globale interdisant certaines formulations échoue déjà sur la base et échouerait sur le catalogue projeté A : 16 IDs hors lot A, inchangés (aucun nouveau contrevenant). À transmettre aux lots responsables : SEF-V3-036-1 (intervenir.base), SEF-V479-003 (multilandy.reponse), SEF-L41-004 (sa2.texas_mineur.reponse), SEF-Q26-M2-012 (sa2.texas_mineur.reponse), V1-M3-005 (competitif.sa_adverse), V1-M3-006 (competitif.sa_adverse), V1-M3-007 (competitif.sa_adverse), V2-M2-016 (sa2.texas_mineur.reponse), V2-M2-026 (sa1.stayman.suite), SEF-Q400-B-053 (sa2.bicolore), SEF-Q400-B-099 (sa2.texas_mineur.reponse), SEF-Q685-B-065 (sa1.texas_mineur.reponse), SEF-Q685-B-066 (sa1.texas_mineur.reponse), SEF-Q685-B-067 (sa1.texas_mineur.reponse), SEF-Q685-D-037 (multilandy.choix), SEF-Q685-D-123 (chelem.splinter.variante). Ce n'est pas un succès de l'assertion globale. Bilan : {"counts":{"RECLASSER_REFORMULER":144,"VALIDE":228,"ARBITRAGE":47},"corrections":147,"reservoirIds":23,"ajouts":3,"retraits":22,"historique993":65}. 47 arbitrages restent réservés au coordinateur. MISSION DÉFINITIVEMENT TERMINÉE : NON.

### Patches historiques à approuver et normaliser (liste exacte)
- SEF-014-1 : explain
- SEF-014-2 : explain
- SEF-019-2 : explain
- SEF-020-3 : explain
- SEF-020-1 : hand, shape, context, explain
- SEF-N002-2 : explain
- SEF-N002-1 : explain, difficulty, difficultyReason
- SEF-N003-1 : explain
- SEF-N008-1 : explain
- SEF-N013-3 : explain
- SEF-N023-2 : explain
- SEF-N023-1 : explain
- SEF-N025-1 : explain
- SEF-N031-2 : hand, shape, context, explain
- SEF-N033-1 : choices, explain
- SEF-N034-1 : choices, explain
- SEF-N041-2 : difficulty, difficultyReason
- SEF-N043-1 : choices, explain
- SEF-N045-3 : explain
- SEF-N049-3 : choices, explain, difficulty, difficultyReason
- SEF-N050-1 : choices, difficulty, difficultyReason
- SEF-N054-1 : choices, difficulty, difficultyReason
- SEF-N055-1 : choices, difficulty, difficultyReason
- SEF-N064-2 : explain
- SEF-N064-3 : explain
- SEF-N065-2 : context, choices, explain
- SEF-N066-1 : explain
- SEF-N066-3 : explain
- SEF-N067-1 : explain, difficulty, difficultyReason
- SEF-N074-1 : explain
- SEF-N074-3 : explain
- SEF-N075-2 : explain
- SEF-N075-1 : explain
- SEF-N076-2 : explain
- SEF-N076-1 : explain
- SEF-N077-1 : explain
- SEF-N077-3 : explain
- SEF-N078-2 : explain
- SEF-N079-2 : explain
- SEF-N079-1 : explain
- SEF-V44-001 : difficulty, difficultyReason
- SEF-V44-003 : explain
- SEF-V44-004 : explain
- SEF-V44-006 : context
- SEF-V44-008 : explain
- SEF-V49-008 : explain
- SEF-V49-012 : explain
- SEF-V410-022 : explain
- SEF-V412-014 : explain
- SEF-V412-015 : hand, h, shape, explain
- SEF-V419-003 : explain
- SEF-V422-002 : context
- SEF-C-007 : explain
- SEF-V44-009 : choices
- SEF-N048-3 : choices
- SEF-021-2 : context, explain
- SEF-021-1 : explain
- SEF-N029-2 : context, explain
- SEF-N040-1 : context, explain
- SEF-N040-2 : explain
- SEF-N042-1 : explain
- SEF-N042-2 : explain
- SEF-N047-1 : explain
- SEF-N047-2 : explain
- SEF-V49-009 : explain

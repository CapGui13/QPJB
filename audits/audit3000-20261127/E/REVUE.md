# Audit3000-E — passe 1, livrable PARTIEL

Base ccd8f20811b9531bbfccb8352ec60953dd7d07cb. Contrat #556, mission #561. Aucun fichier commun modifié.

## Couverture
40/540 verdicts individuels, 500 non audités. {"VALIDE":23,"RECLASSER_REFORMULER":15,"ARBITRAGE":2}. 9 QCM complets corrigés, 2 propositions de prérequis, 6 changements de réservoir. L'état mécanique des 540 ne constitue pas une validation pédagogique. La description du training-data est ancienne (2315) mais exercises contient 3000 IDs.

## Anomalies et redondances
- 270/540 hors groupes explicites de programme-normalise.json; ne pas conclure à l'inaccessibilité sans analyser les réservoirs implicites.
- 074-2 et 074-3 même forme/séquence/réponse; différencier une exposition de rappel. 075-2/075-3 contraste HLD pertinent; groupement proposé. 086-1/086-2 quasi doublons; proposition de remplacement en arbitrage, pas de suppression. 087/088/089, variantes faibles répétitives, éviter de multiplier les séances. 043/044 même décision après Contre, un seul ajout. 025/026 miroir utile des deux majeures. 029 révèle sa réponse dans le contexte, corrigé.
- Arbitrages: 086-2 remplacement; V44-060 affectation réveil bicolore; V45-029 groupe 2SA Multi-Landy non identifié. Multi-Landy = accord du parcours, pas certification SEF externe. Comparaison exacte/structurelle catalogue entier exécutée; examen sémantique interlots exhaustif NON exécuté.

## Contrôles réellement exécutés
Calcul JavaScript sur blobs GitHub de la base immuable (pas de clone local). Comptage, ensemble des IDs, 13 cartes, rangs et doublons intra-couleur, H, forme, quatre choix distincts et inclusion réponse pour 540, signature exacte main/séquence/réponse sur catalogue 3000; légalité des choix du premier lot (séquences simples), corrections mêmes contrôles, validité groupes proposés et concepts prérequis. Résultats:
```json
{
  "catalogue": 3000,
  "idsUniquesCatalogue": 3000,
  "prerequis": 3000,
  "lot": 540,
  "lotManquants": 0,
  "lotHorsGroupesExplicites": 270,
  "lotEchecMecanique": [],
  "lotDoublonsExactsSignature": [],
  "verdicts": 40,
  "idsVerdictsUniques": 40,
  "corrections": 9,
  "correctionsInvalides": [],
  "choixIllegauxPasse1": [],
  "reservoirGroupesInvalides": [],
  "prerequisInvalides": []
}
```
Suites de tests du dépôt non exécutées (pas de checkout dans ce connecteur). Légalité et pédagogie des 500 restants non certifiées. Pas de simulation, ni moteur/UI, ni fusion.

MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 2 — bilan cumulatif actualisé (remplace les totaux de passe 1)

80/540 verdicts individuels, 460 non audités. {"VALIDE":47,"RECLASSER_REFORMULER":30,"ARBITRAGE":3}. 19 QCM complets corrigés, 5 propositions de prérequis, 15 changements de réservoir.
- Rubensohl: différencier 3♣ Texas ♦ sur 2♥ du 3♣ Texas impossible sur 2♦; idem 3♦. Cas faibles et manche, 035/031. Groupes de conclusion directe et X Rubensohl non identifiés; signaler, ne pas inventer.
- Michaels: distinguer intervention directe, réveil, 2SA mineurs, naturelle sans deuxième longue. Miroirs utiles mais limiter exposition répétée.
- 072: après Contre, 2SA Truscott comme distracteur au lieu de 1SA; 066/078: prérequis soutien mineur (pas majeur). 073/074: rappel révélant le mécanisme remplacé par question neutre. 078: Roi second, ne pas enseigner l'absence catégorique d'arrêt.
- Arbitrage nouveau V420-009: accord du catalogue après 1♣–(1♦) avec deux majeures quatrièmes à confirmer, sources divergentes sur X. Pas de changement de réponse non validé.
- Les contrôles de passe 1 ont été relancés sur base immuable, étendus aux 80 séquences simples; aucune suite du dépôt exécutée. Résultats cumulés:
```json
{
  "catalogue": 3000,
  "idsUniquesCatalogue": 3000,
  "prerequis": 3000,
  "lot": 540,
  "lotManquants": 0,
  "lotHorsGroupesExplicites": 270,
  "lotEchecMecanique": [],
  "lotDoublonsExactsSignature": [],
  "verdicts": 80,
  "idsVerdictsUniques": 80,
  "corrections": 19,
  "correctionsInvalides": [],
  "choixIllegauxPasses1Et2": [],
  "reservoirGroupesInvalides": [],
  "prerequisInvalides": []
}
``
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 3 — cumul actualisé

120/540 verdicts individuels, 420 non audités. {"VALIDE":66,"RECLASSER_REFORMULER":51,"ARBITRAGE":3}. 35 QCM complets corrigés, 12 propositions de prérequis, 24 changements de réservoir.
- Rappels donnant directement la réponse (C2-001/002/004/005/006) supprimés des questions; règle maintenue dans corrigé. C2-003 précise variante QPJB 5–4, pas généralisation Landy.
- Redemandes libres/forcées V471 : contraste valide, pas de changement artificiel. V472-005/006 : contre et surcontre de soutien; pas de groupe spécifique identifié, arbitrage d'affectation. Truscott mineur : prérequis soutien mineur et réserve S25 spécifique, vulnérabilité de barrage précisée.
- Contrôles précédents relancés; légalité des choix contrôlée par rang de contrat et distinction contre/surcontre sur les 120, pas validation complète du moteur. Suites du dépôt non exécutées.
```json
{
  "catalogue": 3000,
  "idsUniquesCatalogue": 3000,
  "prerequis": 3000,
  "lot": 540,
  "lotManquants": 0,
  "lotHorsGroupesExplicites": 270,
  "lotEchecMecanique": [],
  "lotDoublonsExactsSignature": [],
  "verdicts": 120,
  "idsVerdictsUniques": 120,
  "corrections": 35,
  "correctionsInvalides": [],
  "choixIllegauxPasses1a3": [],
  "reservoirGroupesInvalides": [],
  "prerequisInvalides": []
}
``
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 4 — cumul actualisé

160/540 verdicts individuels, 380 restants. {"VALIDE":81,"RECLASSER_REFORMULER":72,"ARBITRAGE":7}. 56 QCM complets corrigés, 12 modifications prérequis, 31 entrées réservoir.
- V473-006 à 010 : retirer les solutions prémâchées et grouper les trois soutiens après couleur en S25 pour contraste. V477 : distinguer préférence économique, saut constructif et changement de palier imposé par intervention. S46 reçoit quelques cas de transfert, pas de groupe 3♦/3♠ de préférence identifié.
- V478-002/005 : loi des atouts = repère, pas obligation ; 006/008 arbitrages compétitifs (vulnérabilité, risque de chute, choix non unique). V479 : séparer réponse faible, relais et redemande; V479-004/008 accord positif ou passe-ou-corrige atypique à arbitrer, pas règle SEF universelle.
- Contrôles de cohérence exécutés dans le connecteur sur les nouveaux cas et tous les patches (mains, rang simple des choix, choix uniques, groupes). Suites locales non exécutées. 
```json
{
  "verdicts": 160,
  "idsUniques": 160,
  "corrections": 56,
  "correctionsInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 5 — cumul actualisé

200/540 verdicts individuels, 340 restants. {"VALIDE":81,"RECLASSER_REFORMULER":112,"ARBITRAGE":7}. 96 QCM complets corrigés, 15 modifications prérequis, 44 entrées réservoir.
- V479-009 à 016 : distinguer relais positif, passe-ou-corrige, rôle intervenant et répondant ; enlever les longueurs prémâchées. V481 : vrais contrastes entre majeure/tenue, intervention 2♦/2♥ et rectification/Stayman. Les mêmes formulations anciennes donnaient la solution avant que l'élève lise la main.
- V485 : contraste naturel F1 au palier de un / NF au palier de deux après Contre, 2SA Truscott mineur seuil 9 H, vulnérabilité et barrage. V486 : distinction Contre artificiel conservant les réponses usuelles et Landy adverse avec 2♦ naturel, cue-bid de tenue et Texas.
- Propositions de groupes limitées aux groupes existants, sans simuler l'accès adaptatif. Tests mécaniques et rang simple des choix exécutés ; pas de suite locale.
```json
{
  "verdicts": 200,
  "idsUniques": 200,
  "corrections": 96,
  "correctionsInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": [],
  "groupesNonTrouves": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 6 — cumul actualisé

240/540 verdicts individuels, 300 restants. {"VALIDE":85,"RECLASSER_REFORMULER":146,"ARBITRAGE":9}. 127 QCM complets corrigés, 18 modifications prérequis, 52 entrées réservoir.
- Rubensohl après 2♠ : contrastes Passe/longue faible, X d'appel 8 H dans variante, manche avec/sans tenue. Famille C04 7h obsolète renommée. Michaël en quatrième position derrière soutien adverse distinct d'un réveil après deux passes (L04-028/L20-006), reclassifications proposées.
- L10-021 : 2♠ naturel légal absent des choix, arbitrage du saut nécessaire. L14-002 : seuil mini/maxi non chiffré, confirmer développement de paire. L04-029 : Passe prudent parmi les choix, non obligation universelle ; Contre défensif non testé. Mixed raise, rencontre, cue-bid économique et second cue-bid : contrastes S25/S47.
- Contrôle rang simple des choix : première tentative échouée pour deux annotations contenant un deux-points ; séparation du rôle au premier deux-points, relance réussie. Pas de suite locale ni simulation moteur.
```json
{
  "verdicts": 240,
  "idsUniques": 240,
  "corrections": 127,
  "correctionsInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": [],
  "groupesNonTrouves": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 7 — cumul actualisé

280/540 verdicts individuels, 260 restants. {"VALIDE":88,"RECLASSER_REFORMULER":181,"ARBITRAGE":11}. 163 QCM complets corrigés, 22 modifications prérequis, 63 entrées réservoir.
- Quatre reclassements supplémentaires Michaël : intervention derrière soutien, pas réveil. L24-004 se contredisait entre énoncé et corrigé. Truscott fort, rencontre simple/double saut, redemandes libres/forcées et soutien 2SA différenciés.
- L29-002 et L29-003 : arbitrages sur alternative naturelle absente / contre d'appel, correction de la mention deuxième zone pour 19 H. L36-004 faible naturel après Michaël versus 2e cue-bid FM.
- Contrôles de cohérence exécutés dans le connecteur, pas de suite locale ni simulation moteur. Groupes non retrouvés consignés ci-dessous.
```json
{
  "verdicts": 280,
  "idsUniques": 280,
  "corrections": 163,
  "correctionsInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": [],
  "groupesNonTrouves": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 8 — cumul actualisé

320/540 verdicts individuels, 220 restants. {"VALIDE":94,"RECLASSER_REFORMULER":210,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":16}. 192 QCM complets corrigés, 26 propositions de prérequis, 79 entrées réservoir.
- Contrastes défense Michaël économique/cher versus naturelle limitée, Truscott/rencontre/3SA fitté, Landyk/Passe/naturel, redemande libre/obligée et soutien troisième/quatrième. Énoncés neutralisés sans supprimer les accords nécessaires.
- Arbitrages : 2SA naturel après saut faible (L39-005), suite Rubensohl (Q26-M2-002), Contre après bicolore mineur (V1-M4-005), bicolores après soutien mineur (V1-M4-006/007). Les corrections des cas en arbitrage sont des propositions conditionnelles, non validées. Reclasser les cas après soutien adverse hors réveil ; groupe S46 2♦, S45 4M et S47 3SA/Passe/Contre non identifiés, signalés sans inventer de groupe. Références externes ciblées dans les verdicts, pas certification exhaustive.
- Contrôle mécanique des nouvelles mains et corrections cumulées, rang simple des choix (pas légalité complète des doubles), périmètre et groupes réels. Suites locales non exécutées. Redondance sémantique exhaustive non réalisée.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 320,
  "idsUniques": 320,
  "corrections": 192,
  "correctionsInvalides": [],
  "passe8ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 9 — cumul actualisé

360/540 verdicts individuels, 180 restants. {"VALIDE":102,"RECLASSER_REFORMULER":237,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":21}. 220 corrections complètes, 27 modifications prérequis, 101 entrées réservoir.
- Préserver les paires contrastées V2-M5-G01 à G06 et G11 à G20 (même main et ordre adverse différent, seuil 4–4/5–4, 5–4/5–5, force, fit/absence de fit, palier disponible). Retirer les indices de solution et proposer des affectations dans les groupes réels, sans transformer les contrastes utiles en doublons.
- Source Sarzeau affilié FFB : exception du 2SA naturel après intervention à deux faible confirmée (https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523). V2-M5-005 corrigé et référencé ; le coordinateur peut lever l'arbitrage L39-005 de passe 8 sur cette base (verdict précédent conservé pour traçabilité). Défense Michaël 2SA fitté spécifique (V2-M5-037), alternative naturelle 1SA (006), Passe/3♠ après forcing un tour (009), décisions compétitives neuf/dix atouts (039/040) en arbitrage. Les corrections correspondantes restent conditionnelles.
- Lacunes de groupes 2SA Multi-Landy et conclusions Rubensohl 4M : ne pas inventer d'affectation. Contrôles de périmètre, verdicts uniques, mains, choix (rang simple), corrections, groupes et concepts réels. Pas de suite locale, pas de certification externe complète, pas d'examen sémantique exhaustif.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 360,
  "idsUniques": 360,
  "corrections": 220,
  "correctionsInvalides": [],
  "passe9ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 10 — cumul actualisé

400/540 verdicts individuels, 140 restants. {"VALIDE":116,"RECLASSER_REFORMULER":260,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":24}. 245 corrections complètes, 34 modifications prérequis, 101 entrées réservoir.
- Corriger prérequis des réponses sur mineure et du Truscott mineur (9 H, pas HLD). Améliorer distracteurs et corrigés, rendre explicite l'accord Multi-Landy et le rôle intervenant/répondant. Préserver les contrastes réponse naturelle/Spoutnik, redemande libre/obligée, trois/quatre atouts, abstention/intervention et relais/préférence.
- Arbitrages C063 (soutien libre 14 HLD, alternative 3♥ absente), C089 (seuil 11 contre 12 HLD et réévaluation des honneurs adverses), C096 (barrage mineur palier 3/4). Sources réellement consultées : https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523 et https://bridgesaintcloud.fr/quesaquoP17E.html indiquent 11–15 HLD pour 2SA après intervention couleur, https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870 indique 12–15 HLD dans sa présentation ; https://www.bridge-chailley.fr/le-sef-2024-1/ confirme le seuil 9 H du Truscott mineur. Sarzeau confirme aussi 2SA fitté 11–12 HLD trois cartes sur intervention bicolore, ce qui soutient la levée de l'arbitrage V2-M5-037 de la passe 9 ; et l'exception 2SA naturel sur deux faible (L39-005). Les verdicts antérieurs restent inchangés pour traçabilité, coordinateur chargé de décider. Pas de certification SEF officielle intégrale.
- C066 groupe S26 « Même main, ordre adverse différent » : contrastes de mécanisme présents, mais C061/062 n'ont pas exactement la même main ; vérifier le contraste obligatoire du programme, sans inventer d'affectation. D043 et V2-M5-025/PN26-M1-013 fortement analogues, limiter exposition répétée. Pas de changement réservoir arbitraire.
- Contrôles de périmètre, verdicts uniques, mains, rang simple des choix, corrections, groupes et concepts réels. Pas de suite locale, pas d'examen sémantique exhaustif.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 400,
  "idsUniques": 400,
  "corrections": 245,
  "correctionsInvalides": [],
  "passe10ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 11 — cumul actualisé

440/540 verdicts individuels, 100 restants. {"VALIDE":120,"RECLASSER_REFORMULER":293,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":27}. 281 corrections complètes, 39 modifications prérequis, 101 entrées réservoir.
- Rubensohl : distinguer naturel faible, transfert de dégagement, transfert majeur de manche et Texas impossible, puis réponse de l'ouvreur et conclusion. Sources consultées https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/quelques-conventions/le-rubensohl, https://bridgesef.fr/wp-content/uploads/2025/07/Defense-intervention-landy-landik-bicolore-bw-drury-stayman-texas.pdf, https://www.ibridge.fr/public/fichedetails/338, https://www.ibridge.fr/public/fichedetails/24, https://amourdubridge.fr/forums/topic/rubensohl-13/. Le support BridgeSEF confirme 3♠ non fitté et sans arrêt après Texas Cœur, utile pour arbitrer Q26-M2-002 ; le détail de deux atouts reste celui du catalogue.
- Défense Michaël : cue-bids économique fit FM et cher dernière couleur cinquième FM, confirmé par https://www.bridge-chailley.fr/2024/09/ et https://bridgesaintcloud.fr/michel-college-003.html. Préférences faibles au palier minimal, ne pas interdire les barrages selon vulnérabilité.
- Q685-C-052 à 067 : rappel 1♥ adverse sur mineure recopié hors contexte ou donnant la règle à tester ; retrait et maintien dans corrigé quand pertinent. Prérequis mineur.base pour les réponses naturelles à une mineure. Redemandes libres : ôter le rappel de liberté de la question. Arbitrages C059 zone 1SA/2SA à 10 H, C069 et C071 zone de répétition libre à saut avec 14 H et six cartes très solides ; C060 frontière également signalée. Pas d'affectation nouvelle sans groupe approprié.
- Contrôles de périmètre, verdicts uniques, mains, rang simple des choix, corrections, groupes et concepts réels. Pas de suite locale, pas d'examen sémantique exhaustif ni certification SEF officielle intégrale.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 440,
  "idsUniques": 440,
  "corrections": 281,
  "correctionsInvalides": [],
  "passe11ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 12 — cumul actualisé

480/540 verdicts individuels, 60 restants. {"VALIDE":121,"RECLASSER_REFORMULER":331,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":28}. 320 corrections complètes, 46 modifications prérequis, 101 entrées réservoir.
- Retrait systématique des rappels qui donnent la réponse (2SA fitté, Truscott, Surcontre, 2SA sur 1SA adverse, redemande libre/forcée). Les règles restent dans les corrigés et les variantes QPJB restent identifiées. Améliorer distracteurs sur 1SA adverse en introduisant Contre punitif ; demander description du fit plutôt que décision de pénalité universelle. Correction des prérequis de soutien mineur et difficulté C136 (4 vers 2).
- Sources externes consultées pour cette passe : https://scjc-bridge.fr/sef-2024, https://www.bridgerama-plus.com/2024/02/20/les-nouveautes-du-sef-2024-le-2sa-fitte-derriere-une-intervention/, https://www.bridge-chailley.fr/le-sef-2024-1/ corroborent 11–15 HLD après intervention couleur avec trois atouts, ce qui soutient la borne basse de C138 et permet au coordinateur de réexaminer l'arbitrage Q400-C089 (honneurs adverses toujours à réévaluer). Le chevauchement apparent du mixed raise en H et Truscott en HLD est discuté dans https://amourdubridge.fr/forums/topic/questions-sur-le-mixed-raise/ ; priorité à préciser dans le cours, aucune règle privée ajoutée. Arbitrage C144 limité à portée de la formulation du Surcontre, choix cohérent parmi les propositions.
- Quasi-redondances ciblées C139/C141, C145/C146, C147/C169, Multi-Landy D037/V2-M5-021 ; conserver variantes sans exposition simultanée. C161, comme C066, groupe 'Même main, ordre adverse différent' nécessite un vrai contraste de même main ; pas de groupe inventé. Aucune nouvelle affectation proposée faute de besoin étayé.
- Contrôles de périmètre, verdicts uniques, mains, rang simple des choix, corrections, groupes et concepts réels. Pas de suite locale, pas d'examen sémantique exhaustif ni certification SEF officielle intégrale.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 480,
  "idsUniques": 480,
  "corrections": 320,
  "correctionsInvalides": [],
  "passe12ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Passe 13 — cumul actualisé

540/540 verdicts individuels, aucun ID restant. {"VALIDE":140,"RECLASSER_REFORMULER":370,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":30}. 361 corrections complètes, 46 modifications prérequis, 101 entrées réservoir.
- Multi-Landy : distinguer priorités du code QPJB et autres variantes, préférences faibles, relais, passe-ou-corrige, décision de barrage (D043 en arbitrage). Source https://www.bridge-chailley.fr/dictionnaires/index-m-z/i-l/. Rubensohl : préciser zones de 1SA, distinguer réponses conservées sur contre artificiel, naturelles et Texas, neutraliser questions qui prescrivent la conclusion. Source https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/quelques-conventions/le-rubensohl. Michaël : distinguer intervention directe, réveil et réponses ; préférences économiques distinctes d'un barrage tactique, cue-bids économique/cher, D085 alternative saut naturel à arbitrer. Source https://bridgesaintcloud.fr/quesaquo30.html. Réveil 2♣ sur 1♣ rouge confirmé par clarification du 7 mars 2026 : https://www.bridge-chailley.fr/dictionnaire-des-encheres/competitives/.
- Difficultés proposées à la baisse sur quelques applications directes de codes déjà exposés, sans toucher aux verrous de progression ; coordinateur chargé de vérifier cohérence de l'intégration. Redondances ciblées D047/D048 et D056, D061/D062, D063/D064, D083/D084, D087/D088 : garder les contrastes utiles, éviter répétitions simultanées. Aucun nouveau déplacement de réservoir.
- Contrôles de périmètre, verdicts uniques, mains, rang simple des choix, corrections, groupes et concepts réels. Pas de suite locale, pas d'examen sémantique exhaustif ni certification SEF officielle intégrale. Couverture individuelle achevée ; recette cumulative et vérifications de clôture à effectuer.
```json
{
  "catalogue": 3000,
  "perimetre": 540,
  "verdicts": 540,
  "idsUniques": 540,
  "corrections": 361,
  "correctionsInvalides": [],
  "passe13ChoixRangInvalides": [],
  "reservoirInvalides": [],
  "prerequisInvalides": []
}
```
MISSION DÉFINITIVEMENT TERMINÉE : NON

## Clôture de livraison — bilan final remplaçant les bilans intermédiaires

Couverture 540/540, tous IDs d'origine, 13 passes et recette cumulative. {"VALIDE":140,"RECLASSER_REFORMULER":372,"ERREUR_PEDAGOGIQUE":0,"ARBITRAGE":28}. 361 corrections QCM complètes dont 20 conditionnelles à ne pas intégrer automatiquement ; 46 prérequis, 101 entrées réservoir. Deux arbitrages de passe 8/9 levés par lecture explicite de la source Sarzeau 21/12/2025 (https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523) : L39-005 et V2-M5-037. Historique de la décision conservé dans les rapports de passe ; les verdicts finaux font foi.

### Bilan par concept initial

| Concept | Total | VALIDE | RECLASSER_REFORMULER | ARBITRAGE | ERREUR_PEDAGOGIQUE |
|---|---:|---:|---:|---:|---:|
| apres_inter.base | 113 | 37 | 72 | 4 | 0 |
| competitif.2sa_fitte | 26 | 7 | 18 | 1 | 0 |
| competitif.sa_adverse | 18 | 3 | 15 | 0 | 0 |
| competitif.spoutnik | 25 | 6 | 18 | 1 | 0 |
| competitif.truscott | 41 | 6 | 33 | 2 | 0 |
| michaels.choix | 9 | 4 | 4 | 1 | 0 |
| michaels.defense | 28 | 0 | 27 | 1 | 0 |
| michaels.intervention | 24 | 12 | 12 | 0 | 0 |
| michaels.reponse | 39 | 19 | 16 | 4 | 0 |
| michaels.reveil | 17 | 1 | 12 | 4 | 0 |
| multilandy.choix | 11 | 6 | 5 | 0 | 0 |
| multilandy.intervention | 25 | 7 | 17 | 1 | 0 |
| multilandy.reponse | 19 | 1 | 16 | 2 | 0 |
| multilandy.suite | 15 | 3 | 11 | 1 | 0 |
| red.competitif | 38 | 11 | 22 | 5 | 0 |
| rubensohl.init | 31 | 2 | 29 | 0 | 0 |
| rubensohl.naturel | 23 | 9 | 14 | 0 | 0 |
| rubensohl.reponse | 23 | 4 | 19 | 0 | 0 |
| rubensohl.suite | 15 | 2 | 12 | 1 | 0 |

### Arbitrages à transmettre au coordinateur (28)

- SEF-V3-086-2 — 3 H, deux Cœurs, quatre ♦; Passe correct mais répète 086-1 presque à l'identique. Proposition au coordinateur: remplacer par un contraste constructif après 1♥–(2♣), 4♠ et environ 10 H sans fit, X; garder ID, nouvelle famille et métadonnées spoutnik si accepté. Pas de mutation de main sans arbitrage.
- SEF-V44-060 — 11 H, six ♦ RDV982, deux ♠ et trois ♥. 1♦ naturel de réveil; 2♦ majeur 5–5 confirmé SEF 2024. Concept michaels.reveil pertinent comme discrimination, mais aucun groupe explicite de réveil bicolore adéquat trouvé; coordinateur doit décider de l'affectation (ne pas détourner le groupe de réveil à 2SA sur deux faible).
- SEF-V420-009 — 8 H, deux majeures quatrièmes après 1♣–(1♦). Le catalogue retient 1♥ naturel et X déniant majeure; une source de pratique Spoutnik non collante décrit X comme bicolore majeur 4-4. La référence SEF 2024 consultée établit X déniant 4♠ seulement sur 1♥ adverse; n'extrapoler ni règle ni correction sans arbitre. Proposer de préciser explicitement le traitement QPJB de 1♦ adverse et de vérifier page SEF correspondante.
- SEF-V478-006 — 7 H, cinq ♣, D♠ en face d'une ouverture adverse, A♦ utile mais pas de courte ; rouge contre vert, 4♣ contré chutant de deux coûterait 500 contre une partielle adverse. 4♣ n'est pas indiscutablement meilleur que Passe. Arbitrer avec le cours QPJB ; pas de remplacement de réponse sans validation.
- SEF-V478-008 — 3 H, quatre ♥ donc neuf atouts au moins, sans courte : 4♥ au-dessus de 3♠ vert contre rouge parfois défendable selon distribution/levées adverses. Le corrigé affirme Passe à toute vulnérabilité. Conserver réponse prudente provisoirement, nuancer et faire arbitrer la doctrine QPJB.
- SEF-V479-004 — 10 H et quatre cartes dans chaque majeure, 2SA relais constructif non universel. Le contexte mentionne un accord sans définir précisément 2SA, et aucun groupe explicite. Exiger validation de ce développement par coordinateur ; ne pas présenter comme SEF.
- SEF-V479-008 — 6 H, trois ♥ et deux ♠ : 2♠ passe-ou-corrige au palier supérieur selon accord spécifique. 2♥ demeure possible et plus économique. Accord de 2♠ à 6 H explicitement atypique ; confirmation du traitement QPJB nécessaire, pas certification SEF. Sans groupe explicite, ne pas l'ajouter comme objectif standard.
- SEF-L10-021 — 13 H, six ♠ ARDV108 après soutien adverse à 2♥. 3♠ naturel plausible parmi choix, mais 2♠ légal et absent ; évaluation du saut non tranchée. Revoir distracteurs et nature/force du saut avant intégration.
- SEF-L14-002 — 17 H, cinq ♥ quatre ♣ : 3♥ maximum ♣ dans grille mini/maxi donnée. Seuils non chiffrés et accord non universel. Confirmer grille et zone d'intervention avec coordinateur ; groupe non identifié.
- SEF-L29-002 — 19 H, 5♣4♥, singleton R♠, 3SA naturel mais 2♥ bicolore cher légal et absent des choix ; absence de fit ne prouve pas que 3SA soit préférable. Confirmer doctrine/alternatives, conserver provisoirement réponse comme test de signification, non meilleur contrat.
- SEF-L29-003 — 19 H, singleton ♥, quatre ♠, cinq ♦ : X d'appel plausible, 2♠ naturel aussi à examiner ; question dit deuxième zone alors que 19 H est une main forte. Corriger dénomination et demander arbitrage de X vs 2♠.
- SEF-Q26-M2-002 — 10 H, six ♥ ARD1096, deux ♥ annoncés chez l'ouvreur et absence d'arrêt ♠ dans les deux mains : 4♥ cohérent dans la suite donnée. Confirmer que 3♠ après Texas ♥ signifie précisément absence de fit ET d'arrêt dans la variante QPJB ; pas de groupe S45 4♥.
- V1-M4-005 — 11 H, quatre ♥ et deux ♠ ; Contre d'appel dans l'accord du catalogue. La défense contre 2SA bicolore peut employer Contre punitif ou Spoutnik ; confirmer traitement spécifique. Ne pas généraliser à toutes les défenses Michaël.
- V1-M4-006 — 12 H, 5♠5♥, singleton ♦ derrière soutien 2♦. Ce n'est pas un réveil ; 3♦ bicolore majeur selon accord annoncé. Confirmer traitement après soutien mineur, distinct du réveil SEF après deux passes.
- V1-M4-007 — 12 H, 5♥5♣, singleton ♦ ; 2SA des deux couleurs libres les moins chères derrière soutien mineur dans accord annoncé. Pas réveil, reclasser, confirmer accord ; contraste avec M4-006.
- V2-M5-006 — 11 H et 4-4 mineures, AD8 ♠. Contre généralisé plausible, mais la réponse naturelle 1SA est légale et absente des choix ; préciser sa zone dans le traitement SEF. Contraste utile avec 005, ne pas prétendre que le Contre est toujours obligatoire.
- V2-M5-009 — 11 H + cinquième ♦ = 12 HL, fit ♠ huitième, DV♣ adverse peu productifs. Passe possible mais 3♠ proposition de manche peut être défendable selon minimum exact et qualité des honneurs. L'énoncé prescrit déjà absence d'ambition de manche. Contraste 010 à préserver, préciser zone minimale et évaluation.
- V2-M5-039 — 4 H, neuf atouts ♥ garantis, favorable. Passe prudent mais 4♥ peut être défendable selon distribution et minimum du partenaire, surtout TPP. La loi des atouts est un repère non une règle de décision unique. Reformuler en comparaison explicite avec 040.
- V2-M5-040 — 4 H et dix atouts ♥ garantis, favorable, 4♥ défendable. Ne pas traiter la surenchère comme certaine : Passe peut se défendre selon la qualité du bicolore et les levées défensives. Contraste 039 neuf atouts, explicitement repère de loi.
- SEF-Q400-C-063 — 12 H + singleton ♠ = 14 HLD, quatre ♥. 2♥ soutien économique sur intervention du quatrième, mais 14 HLD est la limite supérieure : 3♥ peut être examiné selon les zones de soutien libre. 3♥ absent des choix ; ne pas assimiler mécaniquement première zone H et soutien HLD. L'ouverture de 1♦ avec 4-4 mineures est cohérente.
- SEF-Q400-C-089 — 10 H + doubleton ♣ = 11 HLD, trois ♠. Le seuil 11 HLD est documenté par Sarzeau et Saint-Cloud, mais le support de présentation SEF 2024 de Saint-Jean-de-Luz indique 12–15 HLD. De plus AV94 dans la couleur d'intervention mérite réévaluation. Conserver réponse du catalogue sous réserve de confirmer le seuil de référence.
- SEF-Q400-C-096 — 3 H, six ♦, favorable, 3♦ barrage défendable mais 4♦ peut être envisageable en fonction du nombre d'atouts, de la vulnérabilité et de la distribution. Ne pas imposer une surenchère unique sans règle de palier. Corriger le prérequis mineur.
- SEF-Q685-C-059 — 10 H, AR94 ♥ et trois ♠, 1SA naturel plausible dans zone 8–10 H du catalogue. 2SA naturel peut être invitation selon autre zone ; confirmer limite haute exacte de 1SA après intervention. 1♠ inventerait la quatrième. Retirer rappel hors sujet et corriger prérequis.
- SEF-Q685-C-069 — 14 H + deux points de longueur ♦ = 16 HL, six ♦ ARDV94, sans tenue ♠ et trois ♥. 2♦ naturel plausible, mais 3♦ saut fort est un choix proposé ; seuil de redemande libre à saut doit être précisé (valeur de longue très forte). Ne pas valider automatiquement 2♦. Retirer règle donnée dans énoncé.
- SEF-Q685-C-071 — 14 H, six ♣ ARDV84, 16 HL, 2♣ libre dans catalogue, 3♣ saut peut se défendre selon zone. Même problème que C069, mineure différente. Retirer indication de liberté, expliciter limite.
- SEF-Q685-C-144 — 11 H, trois ♠, quatre ♥, Surcontre positif proposé. La réponse naturelle 2♥ après X n'est pas forcing et demande en principe cinq cartes : pas adaptée, mais 1SA sous-évalue. L'accord général qui dit Surcontre sans quatre atouts doit être précisé pour ne pas exclure autres réponses constructives dans d'autres formes. Cas néanmoins cohérent dans les choix; arbitrage limité à formulation du cours.
- SEF-Q685-D-043 — 10 H, sept ♠ ARV9863, favorable ; 2♦ montre au moins six cartes dans le traitement QPJB. 3♠ barrage légal et défendable selon accord et vulnérabilité ; limiter la question au code descriptif.
- SEF-Q685-D-085 — 10 H, six ♠ et quatre ♦, favorable : 1♠ naturel proposé, Michaël exige deux longueurs cinquièmes. 2♠ faible à saut non proposé et peut être une alternative tactique ; préciser comparaison.

### Revue finale des ressemblances sur les 3000 QCM

Comparaison structurelle sur l'intégralité du catalogue corrigé pour E (même séquence normalisée par camp, même forme, H et réponse) : 16 groupes impliquant 30 IDs E et deux groupes interlots. Lecture des mains, séquences, choix et corrigés des 16 groupes ; recommandations ci-dessous et dans les verdicts concernés. Pas de suppression d'ID ni de nouveau changement de groupe automatique : préserver les contrastes obligatoires, éviter d'enlever une référence requise par le programme, laisser au coordinateur la consolidation des familles et réserves. Les autres analogies signalées au fil des passes restent à considérer. Ce filtre structurel ne garantit pas la détection exhaustive de toute redondance sémantique (notamment miroirs, séquences différentes, force différente).

- SEF-V3-035-4 / SEF-V45-049 — Interlots : deux tâches différentes (naturel vs Contre/Passe/1SA et naturel vs trois bicolores) ; garder le contraste des distracteurs, ne pas fusionner.
- SEF-V45-043 / SEF-Q685-D-079 — Quasi-doublon même code et mêmes choix permutés ; garder V45-043 comme référence S46, D079 comme variante espacée, pas de répétition immédiate.
- SEF-C2-003 / V2-M5-021 — Quasi-doublon 4–4, 10 H, vulnérabilité différente sans changement de réponse ; conserver V2-M5-021 avec 022 pour seuil 5–4, C2-003 comme variante alternative.
- SEF-V473-007 / V2-M5-012 — Même famille et même décision, mais choix 4♦ rencontre contre 4♠ direct ; V2-M5-012 est le contraste 011/012 sur la cinquième. Espacer, ne pas casser cette paire.
- SEF-V477-001 / SEF-Q400-D-067 — Quasi-doublon par permutation de petites cartes ; V477-001 appartient au contraste de référence S46 avec 002. D067 réserve alternative, pas seconde exposition immédiate.
- SEF-V481-002 / SEF-Q685-D-070 — Quasi-doublon 17 H, 4♠, AR♥, réponse 3♠ : varier les mains dans le temps, une seule exposition de cette décision par bloc.
- SEF-V481-003 / SEF-Q400-D-058 — Quasi-doublon 15 H, pas de majeure quatrième, arrêt ♥ ; conserver V481-003 avec V481-001 (contraste de référence S44), Q400-D-058 variante.
- SEF-V485-004 / SEF-L13-010 — Même règle 1♠ F1 après X, choix 1♥ contre Passe ; garder variation de distracteur mais pas ajout simultané à un réservoir.
- SEF-L22-004 / V2-M6-044 — Interlots : même fit et cue-bid, mais V2-M6-044 teste aussi le Splinter ; préserver contraste de distracteurs, coordination avec lot F/B selon concept source.
- SEF-L28-002 / V2-M5-008 — Même famille de redemande Spoutnik 18 HLD ; garder V2-M5-008 comme contraste avec 007, L28-002 variante.
- SEF-L36-003 / V2-M5-011 — Même famille rencontre, 15 HLD et cinq ♦ ; V2-M5-011 contraste avec 012 quatre ♦, préserver cette paire, L36-003 variante.
- SEF-L39-005 / V2-M5-005 — Quasi-doublon 2SA naturel sur saut faible, mêmes choix ; conserver V2-M5-005/006 pour le changement de palier adverse, L39-005 variante.
- SEF-L42-001 / V2-M5-002 — Quasi-doublon Truscott à 12 HLD ; garder V2-M5-001/002 même main intervention couleur vs Contre, L42-001 réserve existante.
- V2-M5-025 / SEF-Q400-D-043 — Quasi-doublon 2♦ Multi, six ♠ et 10 H ; garder V2-M5-025/026 pour contraste distribution, D043 variante.
- V2-M5-033 / SEF-Q685-D-059 — Quasi-doublon 2♦ naturel après Landy ; conserver V2-M5-033/034 pour changement du palier, D059 objectif existant S43.
- V2-M5-034 / SEF-Q400-D-056 — Quasi-doublon 3♣ Texas ♦ après 2♠ ; différence de distracteur utile mais priorité au contraste V2-M5-033/034 ; espacer variante D056.

### Contrôles finaux réellement exécutés

Lecture des blobs de la base immuable et du head fabcaa8ace94f10bc299beff398cf0fd89b1a9bd, calcul JavaScript : cardinalité/ensemble exact, mains et H, forme, rang et unicité des choix, séquences croissantes et contrôle des doubles/redoubles par camp et état du contrat (Passes implicites admis ; pas validation de la rotation complète), intégrité de l'historique des QCM, corrections et actions, cohérence des concepts et groupes, signatures exactes et revue ciblée des groupes analogues. Aucun échec dans ces contrôles. Les 170 IDs sans groupe explicite après propositions ne sont pas déclarés inaccessibles : accès implicite et recette adaptative relèvent du coordinateur. PR #564 ouverte et brouillon, six fichiers exclusifs vérifiés. GitHub Actions et statut combiné sur fabcaa8ace94f10bc299beff398cf0fd89b1a9bd : aucun résultat retourné. Tentative réelle de `git ls-remote https://github.com/CapGui13/QPJB.git refs/heads/pedagogie/audit3000-e` dans le conteneur : échec DNS github.com ; impossibilité de cloner et exécuter les suites locales existantes. Aucun test local du dépôt ni certification SEF officielle intégrale prétendus. Pas de simulation, moteur/UI ou fusion. La livraison du lot E au sens du contrat #556 (verdicts individuels, patches, contrôles rapportés, PR brouillon) est achevée ; l'intégration, les arbitrages, les tests du dépôt et la consolidation globale restent à faire par le coordinateur.

```json
{
  "catalogue": 3000,
  "catalogueUnique": 3000,
  "prerequisCatalogue": 3000,
  "lot": 540,
  "verdicts": 540,
  "idsManquants": [],
  "idsHorsLot": [],
  "mainsOriginalesInvalides": [],
  "mainsCorrigeesInvalides": [],
  "legaliteOriginale": [],
  "legaliteCorrigee": [],
  "corrections": 361,
  "patchHorsLot": [],
  "historiqueModifie": [],
  "justificationManquante": [],
  "conceptIncoherent": [],
  "groupesInvalides": [],
  "patchManquant": [],
  "prerequisInvalides": [],
  "reservoirInvalides": [],
  "doublonsExacts": [],
  "groupesStructurelsExaminés": 16,
  "idsDuLotDansGroupesStructurels": 30,
  "groupesInterlots": 2,
  "idsSansGroupeExpliciteAvant": 270,
  "idsSansGroupeExpliciteApres": 170,
  "correctionsSousArbitrage": 20
}
```

MISSION DÉFINITIVEMENT TERMINÉE : OUI (livraison du lot E ; limites explicites ci-dessus)

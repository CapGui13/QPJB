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

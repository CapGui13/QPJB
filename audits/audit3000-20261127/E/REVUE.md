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

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

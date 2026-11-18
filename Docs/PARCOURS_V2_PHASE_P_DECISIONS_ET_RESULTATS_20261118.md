# QPJB V2 — phase P : axes pédagogiques sémantiques et exposition naturelle
**18 novembre 2026 — PR #214 (branche d'audit non fusionnée).**

## 1. Décision d'architecture

Le moteur de référence **V2-F** n'est pas modifié. Les injections systématiques V2-L dégradaient la diversité (−23,56 familles par scénario de 450 questions en moyenne) et V2-M pouvait encore faire perdre six familles et une rubrique. La nouvelle méthode lit **seulement les exercices déjà tirés** par V2-F et en déduit une *exposition*, jamais une maîtrise.

## 2. Résultats de l'observatoire N et de l'audit O

Sources directes : journaux de `QPJB Training smoke`, runs GitHub Actions **#44386868644** et **#44388957633** (jobs d'intégrité), scripts `scripts/parcours-v2-observatoire-n.cjs` et `scripts/parcours-v2-contre-o.cjs`. Référence de simulation : **neuf profils fictifs** (3 types × 3 graines), **45 séances de 10 QCM**, sans données d'élève.

| Indicateur, par scénario de 450 QCM | Résultat |
|---|---:|
| Couverture globale des rubriques | **22/22** dans les neuf scénarios |
| Familles originales distinctes | **440–450** |
| QCM d'une des 15 fondations K+L effectivement rencontrés | **43–54** |
| Fondations K+L rencontrées (au moins un QCM) | **12–14 / 15** |
| Rappels ciblés déclenchés | **69–77** |
| Situations « notre intervention sur ouverture adverse » parmi 13 QCM sources | **2–6** |
| Situations « réponse après Contre d'appel adverse » parmi 12 QCM sources | **1–5** |

Les 12 QCM de réponse après Contre ont été rencontrés dans **chacun** des neuf scénarios (1 à 5 présentations), mais souvent une seule fois.

Les lacunes de fondations K+L sont **3SA gambling** (aucun QCM source rencontré dans les neuf scénarios), **Texas mineur après 2SA** (source rencontrée dans un seul scénario) et **exploration de chelem** (absente de trois scénarios). Ces notions ne doivent pas être artificiellement anticipées : une couverture faible ne signifie pas une compétence mal enseignée, surtout lorsqu'une notion est avancée ou à source unique.

## 3. Correction sémantique *candidate*, réversible

Le graphe documentaire J compte **15 fondations candidates**. Son libellé `fondation:intervention` — « Comprendre le contre adverse et ses conséquences » — était trompeur : les 13 QCM K+L associés portent sur le choix de **notre** intervention. Il faut éviter de les compter comme des réponses à **un Contre de l'adversaire**.

Le fichier `Docs/PARCOURS_V2_PHASE_P_AXES_SEMANTIQUES_20261118.json` propose donc, **sans aucune mutation du graphe J ni du moteur** :

1. **Renommer le libellé documentaire de l'axe existant** `fondation:intervention` en « Choisir son intervention sur l'ouverture adverse », avec ses 13 QCM originaux inchangés.
2. **Ajouter uniquement un axe candidat** `fondation:reponse_contre_adverse` : « Répondre après l'ouverture du partenaire et un Contre d'appel adverse », avec les **12 QCM originaux déjà audités** de la phase O.

La nouvelle vue documentaire possède ainsi **16 axes candidats**, **122 QCM distincts** et **134 associations ID–axe**. Les 14 autres axes sont repris à l'identique. Les réponses, séquences d'enchères, familles, IDs et corrigés originaux sont conservés.

Aucun axe n'est publié ni utilisé pour mesurer des acquisitions. `fondation:reponse_contre_adverse` est signalé `A_ARBITRER` : une revue SEF/pédagogique reste nécessaire.

## 4. Observatoire P, aucune nouvelle sélection

`scripts/parcours-v2-observatoire-p.cjs` lit directement les séances déjà produites par V2-F et répartit les apparitions selon les 16 axes sémantiques. Il compte pour chaque axe :
- Les présentations d'un QCM associé, les IDs et **familles réellement différentes** ;
- Le nombre de séances concernées, la première apparition et les axes jamais vus ;
- Les 22 rubriques globales, les familles originales et les rappels V2-F inchangés.

`tests/quizz-v2-axes-p.cjs` vérifie les 16 axes, 122 QCM uniques, 134 rattachements, **un seul renommage candidat et un seul ajout**. `tests/quizz-v2-observatoire-p.cjs` contrôle la non-mutation des séances et des rappels. Ces tests sont intégrés à GitHub Actions. Les nouvelles simulations P restent fictives.

## 5. Arbitrages pédagogiques — dans l'ordre

**Priorité 1 — sémantique.** Faire relire les deux familles « notre intervention » / « réponse après contre adverse », et en particulier les conventions de Surcontre, Truscott et mixed raise, sans corriger ni inventer un QCM automatiquement.

**Priorité 2 — couverture sans répétition.** Vérifier si la notion « répondre après contre » est rencontrée assez tôt, avec au moins deux situations indépendantes ; cette décision ne peut pas être prise en comptant seulement le nombre d'apparitions d'un thème.

**Priorité 3 — petites couvertures.** Les fondations « Texas mineur après 2SA » et « 3SA gambling » restent à une seule famille, donc **non évaluables comme compétence acquise**. Chercher des sources existantes/conventionnellement validées avant tout ajout et ne jamais déclarer la notion maîtrisée à partir d'une seule réponse.

**Priorité 4 — compétences fondamentales.** Le calcul des points H est actuellement inféré indirectement de décisions d'ouverture : il faudrait une évaluation spécifique du calcul ou abandonner son statut de prérequis certifié.

**Statut :** `V2-F_REFERENCE / K-L-J_INCHANGES / P_16_AXES_CANDIDATS_NON_ACTIFS / PUBLICATION_AUCUNE`. Les QCM, leurs corrections, le Quiz SEF, le module Entraînement et le site public restent intacts.

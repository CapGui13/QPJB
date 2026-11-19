# QPJB V2 — Phase AK : revue éditoriale traçable avant publication

**19 novembre 2026 · PR #214 · branche expérimentale uniquement · aucune correction de QCM.**

## Méthode, limites et décision produit

- Le parcours cible contient **1 523 QCM existants**, sans leçons écrites, sans validation manuelle, avec **Rubensohl éligible à partir de la séance 35**.
- Le prototype historique signale **19 cas éditoriaux** : **19 alertes ne signifient pas 19 erreurs**. La revue initiale [H](./PARCOURS_V2_CAS_SENSIBLES_REVUE_20261118.md) cite explicitement **18 IDs distincts** dans six groupes ; elle ne sert donc pas à elle seule de manifeste exhaustif des 19 alertes.
- Nouvel extracteur **en lecture seule** : `scripts/parcours-v2-audit-sensibles-ak.cjs`. Il recoupe les 19 entrées du bloc `review-flags` de l'aperçu avec les **mains, séquences, choix, réponses et explications exactes** des objets actifs du bloc `training-data` de `quizz.html`. Un ID manquant, répété ou une réponse absente des choix fait échouer le contrôle. Chaque cas est imprimé dans les journaux CI avec le préfixe `QPJB-AK-CASE` pour permettre la revue unitaire, sans écrire un seul fichier du catalogue.
- Ce contrôle s'ajoute à l'étape Node de `.github/workflows/qpjb-v2-aj-navigation.yml`. La réussite du contrôle signifie **provenance vérifiée**, pas validation de l'enchère ni conformité exhaustive au SEF.
- Les sources externes ci-dessous sont **des explications pédagogiques secondaires** et des comptes rendus de changements du SEF 2024, pas une certification officielle de chacun des 19 corrigés. Avant de changer une réponse, confronter **la main et la séquence exacte** au référentiel SEF et aux accords retenus pour le projet.

## Résultat reproductible : les 19 alertes EXACTES

Le contrôle AJ-AK exécuté sur la branche a extrait les 19 couples `(ID, motif de vigilance)` et retrouvé, dans le catalogue actif, leurs mains, contextes, enchères, propositions, réponses et justifications. Dans la première extraction, **19/19 mains ont 13 cartes et leur total H indiqué est exact** ; aucun choix de réponse répété.

| Groupe dans les 19 alertes effectivement affichées | IDs exacts | Total |
| --- | --- | ---: |
| Stayman et développements (direct / relais / chelem / invitation) | `SEF-V416-008`, `SEF-V416-009`, `SEF-L18-006`, `SEF-L18-007`, `SEF-L18-008`, `SEF-L37-005`, `SEF-L39-002`, `SEF-L07-028` | 8 |
| Texas Trèfle modulé après 1SA | `SEF-L25-007`, `SEF-L25-008` | 2 |
| Stayman contré | `SEF-L25-001`, `SEF-L25-002`, `SEF-L25-003` | 3 |
| Texas majeur contré | `SEF-L25-004`, `SEF-L25-005`, `SEF-L25-006` | 3 |
| Texas mineur, courte après rectification | `SEF-V482-005`, `SEF-V482-007` | 2 |
| 3SA gambling | `SEF-L06-029` | 1 |
| **Total** | **19 entrées distinctes** | **19** |

**Important : les 19 alertes de l'aperçu et l'ensemble plus large étudié dans le rapport H ne sont pas exactement le même périmètre.** Le rapport H évoque les six IDs `SEF-V482-005` à `-010`, mais **seuls `-005` et `-007` font partie des 19 flags actuels**. Cela ne dispense pas de revoir les quatre autres si l'on lance un audit global du catalogue.

### Constats tirés des mains et des options, pas d'une supposition

- `SEF-V416-008` et `SEF-V416-009` : les réponses originales **4♥ et 4♠ directes** sont proposées comme décisions de SEF à la suite de 1SA–2♣–2SA, mais **4♣ / 4♦ transfert ne figurent pas parmi les choix** ; à l'inverse, `SEF-L18-007` propose explicitement 4♣ pour 4♥. Risque de contradiction pédagogique entre questions si enseignées sans précision, **non une autorisation de réécrire le Quiz SEF**.
- `SEF-L25-007` : la main possède **16 H et ♣R103**. Elle vérifie la condition d'honneur troisième annoncée dans son explication ; appeler 16 H « maximum » d'une ouverture 15–17 H est une **formulation qui demande clarification**, pas une preuve que 2SA soit incorrect.
- `SEF-L25-004` : deux Cœurs (♥R8), mais **♦AD84 constitue un arrêt solide dans la couleur contrée**. Le support eBridge décrit le Passe comme « non fitté sans arrêt » : il ne valide donc **pas directement ce cas précis de non-fit avec arrêt**. Cette divergence de portée appelle un arbitrage propre ; ni validation ni correction automatique.
- `SEF-L25-005` : trois Cœurs (♥RD7), sans arrêt Carreau (♦974), Surcontre cohérent avec l'accord externe consulté ; `SEF-L25-006` : trois Cœurs (♥A107) et arrêt Carreau (♦A84), rectification à 2♥ cohérente avec le même support. Reste à confirmer l'adoption de cet accord.
- `SEF-V482-005` : singleton ♥ et réponse originale 3♥ ; `SEF-V482-007` : singleton ♦ après Texas ♣ et réponse 3SA. **Compatibilité apparente** avec les présentations du SEF 2024 consultées, sous réserve d'arbitrage définitif.
- `SEF-L06-029` : la réponse 4♦ sur 3SA gambling–4♣ passe/corrige est distincte du problème de classement : ne pas changer le corrigé pour une simple question de rubrique.

La vérification automatisée ajoutée à AK contrôle désormais **13 cartes, calcul des points H, unicité des propositions, existence et provenance des 19 IDs**. Elle ne détermine pas la validité conventionnelle des réponses.

## Arbitrage provisoire, par priorité

| Groupe d'IDs cités dans la revue H | Statut motivé | Action candidate **sans modification du corrigé** |
| --- | --- | --- |
| `SEF-V416-008`, `SEF-V416-009`, `SEF-L18-007` | **P1 — harmonisation**. Après 1SA–2♣–2SA, la présentation directe de 4♥ et l'emploi du double transfert 4♣→4♥ n'enseignent pas la même technique. Le support Scenari privilégie le double transfert pour faire jouer l'ouvreur. | Vérifier mains, choix et finalité exacte des trois questions, puis décider si un accord commun est indispensable ; ne pas afficher deux procédures incompatibles comme une unique règle. |
| `SEF-V482-005` à `SEF-V482-010` (6 cas) | **P1 — revue SEF 2024**. Plusieurs supports concordent : après un Texas mineur rectifié, la courte majeure du répondant est annoncée **naturellement** (3♥ = courte ♥, 3♠ = courte ♠). La règle ancienne était différente. | Examiner **chacun des six corrigés** avec son ordre des enchères, sans déduire de la seule présence d'une courte que le corrigé est faux. |
| `SEF-L25-004` à `SEF-L25-006` (3 cas) | **P1 — contrôle conventionnel ciblé**. Une fiche eBridge décrit après le Contre du Texas : Passe sans fit ni arrêt, Surcontre avec fit sans arrêt et rectification avec fit et arrêt ; accords particuliers à présenter dans leur contexte. | Vérifier les trois mains et les sens exacts avant de considérer ces règles compatibles avec la fiche système QPJB. |
| `SEF-L25-007`, `SEF-L25-008` | **P2 — précision de libellé**. Un support pédagogique de 1SA distingue 2SA après Texas Trèfle avec jeu maximum et 3♣ avec minimum ; il faut vérifier les critères de force et de soutien dans chaque exercice. | Réviser, si nécessaire et après validation, seulement la formulation explicative, sans modifier arbitrairement les enchères. |
| `SEF-L25-001` à `SEF-L25-003` | **P2 — rapprochement déjà favorable** avec la fiche eBridge sur le Stayman contré ; conformité officielle et formulation propres aux mains encore à vérifier. | Contrôle léger des cartes, des arrêts et des réponses avant clôture. |
| `SEF-L06-029` | **P2 — taxonomie plutôt que réponse** : suite d'ouverture de 3SA *gambling*, à distinguer du 1SA/2SA régulier. | Envisager uniquement un reclassement dans les ouvertures conventionnelles/barrages, sans casser les IDs, les familles ou les rappels. |

**Point de vigilance :** les six micro-compétences à une seule famille relevées dans la revue H ne doivent pas être déclarées « acquises » après une unique réponse. Elles ne constituent pas automatiquement six erreurs ou six alertes supplémentaires.

## Sources à consulter avec les mains précises

1. [Scenari — Stayman et double transfert après la réponse 2SA](https://stph.scenari-community.org/bridge/002-X/co/013-004.html) (source pédagogique ; contient également un exemple de conclusion directe, explicitement nuancé).
2. [Bridge Club du Haut Poitou — changements du SEF 2024](https://scjc-bridge.fr/sef-2024) et [Bridge Chailley — SEF 2024, annonces naturelles des courtes](https://www.bridge-chailley.fr/le-sef-2024-1/) (rappels concordants du changement Texas mineur).
3. [eBridge — l'ouvreur après le contre du Texas](https://dev.ibridge-club.fr/public/fichedetails/622) et [eBridge — l'ouvreur après le contre du Stayman](https://dev.ibridge-club.fr/public/fichedetails/626) (accords décrits ; attention aux conventions).
4. [Tom Bachard — ouverture de 1SA, Texas mineurs et modulation](https://tombachard.fr/bridge/cours/ecole/1SA/) (support pédagogique secondaire).

## Critères de clôture et publication

1. **Avoir la liste exacte des 19 entrées** issue des logs AK, rapprochée ligne par ligne avec les objets originaux, et identifier ce qui ne figure pas explicitement dans les 18 IDs de H.
2. Classer chaque cas : `VALIDE_DANS_ACCORD`, `CLARIFICATION_CONVENTION`, `HARMONISATION_PEDAGOGIQUE`, `CORRECTION_JUSTIFIEE` ou `A_REVOIR`. Aucun statut collectif ne se substitue à une revue unitaire.
3. Si un corrigé devait changer : **séparer ce chantier du raccordement V2**, exiger justification et validation ; préserver l'intégrité du Quiz SEF jusqu'à cette décision.
4. Rejouer le smoke général, l'intégrité du Quiz SEF, les tests de navigation AJ et de cohabitation AI sous Chromium/WebKit bureau/mobile.
5. **Ne pas fusionner ni publier** la PR avant recette et décision explicite sur la présentation publique et sur les cas sensibles.

**Statut : `AK_TRIAGE_DOCUMENTAIRE / EXTRACTION_EXACTE_EN_CI / CORRIGES_INCHANGES / PR_OUVERTE / AUCUNE_PUBLICATION`.**

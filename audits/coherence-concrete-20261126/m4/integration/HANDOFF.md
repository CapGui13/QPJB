# M4 — consolidation par le coordinateur (27/11/2026)

Contrats #419 / #423 / #445. PR mère #427. Base M4 commune 49298ada3f96e347833d8717c7e205518ea02fce. Moteur natif 4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9, catalogue 7a952dc57b582a2a7b5be73f83306df83881f3a8, métadonnées 8e920bb9c925c7474bb04701f0f2fecac5288b91.

## Assemblage contrôlé, aucun changement de production
Les quatre SHA sont des descendants directs de la base commune, aucune branche en retard, 361 chemins ajoutés, tous dans les périmètres exclusifs, aucune modification/suppression de fichier existant :
- A #460, 47c20d8249695c61422bb28afebb067e4ef095f7 : 48 chemins.
- B #452, d4d74af0c15d914d22e7ea6989a5068cc4b9a88f : 148 chemins.
- C #451, 71934521de66a6debe3f98bd48c1e7269a9e43cf : 104 chemins.
- D #458, 9f654537a7826f30f4296fcaf38b863efe5b20f2 : 61 chemins.
La branche de recette isolée coherence-concrete/m4-integration-recette part du SHA A ; B/C/D importés par les PR techniques d'assemblage #470/#471/#472 (fusion uniquement vers la branche de recette). Arbre d'assemblage c6310786c7195f9af21313282ddd777f750a4c3d. PR originales conservées brouillons. Aucune fusion vers main, ni vers la branche M4 de livraison existante. Pas de modification des autres missions.

## Arbitrages
| Source | Candidat | Décision |
|---|---|---|
| A | T | REVIEW expérimental seul : trois substitutions S3, gain proche S5 et S20, sans régression dans D ; insuffisant seul pour la mission commune. Aucun visa de publication. |
| A | L/R, U/V, W/Y | HOLD : régressions ou gain trop étroit ; W/Y ont 15 violations du gate et pertes de preuve individuelle, malgré le contraste S9 utile. |
| B | L/M | HOLD, neutres |
| B | N/O | HOLD, pertes de preuve/famille |
| B | P | Candidat expérimental après saturation intégrale ; le gate B agrégé passe mais certaines dettes individuelles augmentent. Pas de généralisation. |
| C | Registre complet | Documentaire et consultatif, 1915/1915, 240 relations, 12 HOLD. Aucune substitution ou promotion automatique. |
| D | Laboratoire | Utiliser le comparateur strict, y compris régressions conceptuelles et provenance. |

Les six jobs historiques G manquants de la PR mère ont été récupérés par A/B/D ; matrices complètes archivées par B et D. Ne pas répéter ces travaux.

## Recette intégrée T+P exécutée
Le nouvel adaptateur tests/coherence-concrete-m4-integration-tp.cjs réutilise les hooks exacts livrés, dispatch S1–20 vers A/T puis S21–180 vers B/P. Un seul choix par séance, source figée, même historique, modèle de réponse D, aucun changement des règles de progression, de l'ordre final ni des données. La fixture P est une proposition M1 expérimentale, non une autorisation réelle de quota. SHA source exécuté e3dffa3905a5743d87f0e6c9801fee366a686522. [Run natif 45998005831](https://github.com/CapGui13/QPJB/actions/runs/45998005831) / PR technique #473 : 18/18 paires S180, 64800 présentations, 13 suites A/B/C/D sur assemblage toutes réussies. Gate indépendant D/AB terminé HOLD (échec pédagogique, non panne CI). Référence D exacte vérifiée, cinq horizons, toutes les réponses/éligibilités et reprises contrôlées dans le banc.

| Indicateur | Natif | T+P |
|---|---:|---:|
| Paires proches S5 | 40 | 37 |
| Paires proches S20 | 96 | 93 |
| Décisions répétées S180 | 649 | 649 |
| Dette fondamentale S180 | 228622 | 225145 |
| Preuves autonomes S180 | 1520 | 1520 |
| Familles cumulées S180 | 25806 | 25806 |
| QCM N4–5 S180 | 6813 | 6804 |
| Régressions du gate historique | 0 | 0 |
| Alertes supplémentaires D | 0 | 15 |

Six substitutions directes (trois T, trois P) ; douze séances différentes sur chacune des trois graines autonomes, quinze trajectoires inchangées. Les trois graines autonomes simulent des réponses parfaites, pas trois élèves indépendants. D bloque à raison : pour chacune des trois graines autonomes à S180, dette ouv.mineure 315→331, majeur.soutien 439→442, sa1.seuil 1220→1251, red.base 197→214 ; écart terminal majeur.soutien 0→8. Le gate historique agrégé ne voit pas ces régressions. Aucun seuil abaissé. T+P HOLD. Aucune activation automatique de T/P même si le total s'améliore. Les archives compactes 18/18 sont dans native/ et permettent la reconstruction exacte avec le catalogue figé ; le gate et les reçus unitaires sont dans tp-gate-native.json. La recette de rejeu indépendant des archives permanentes est isolée dans #474 ; ne pas assimiler déclenchement et réussite.

## Arbitrage C — 12/12 examinés contre données canoniques
Registre arbitrages-c.json : 1915 signatures comparées à la fonction native de normalisation M4, 240 relations bilatérales sans erreur structurelle ; 273 signatures utilisent une couleur miroir différente de la réponse réelle (normalisation volontaire, jamais une enchère canonique à afficher). Les deux couples entrants/sortants T et P n'ont aucune relation bilatérale explicite C ; ne pas en déduire une substituabilité éditoriale.
- Correction factuelle proposée : SEF-V3-059-5, quatre Trèfles et non cinq dans le corrigé, réponse 1♥ inchangée.
- Accord à vérifier : SEF-L14-013, après 2♣–2♦–2SA, Texas 3♥ canonique, rectification fittée ou non à préciser ; pas de changement de réponse.
- Cas de jugement, contrastes limites ou choix actifs/incomplets : les dix autres. Maintenir les explications conditionnelles et la protection ; ne pas assimiler ces cas à une preuve univoque, sans changer l'évaluation en production.
Le coordinateur éditorial doit valider ces propositions ; les 12 restent HOLD. Aucun changement de catalogue.

## Transmission au coordinateur global / M1 / M6
M1 #433 à 6d2d2586a0b59e029c808df8424ab458cf3cd064 a livré V6 et alternative V2, pas de choix d'activation. Lecture de quizz-coherence-m1-curriculum.js, quizz-coherence-m1-window.js et tests/coherence-concrete-m1-bench.cjs : plan S1–65 uniquement, renvoie null après S65 ; le module V6 protège les rappels prioritaires et les fenêtres mais n'autorise aucun créneau post-S65. Les modèles de réponse et de dette M1/M4 diffèrent : chiffres non directement comparables. Pas de recette M1 réelle combinée attestée par ce chantier M4. Décision réservée au coordinateur global.

Proposition concrète (non implémentée en production, soumise à arbitrage) :
1. Choisir M1 V2/V6 ; consolider d'abord prérequis, objectifs et ordre. Références M1 #433 et M2/M3 #426/#436, protéger le calcul des preuves.
2. Étendre explicitement le contrat M1 à S66–180 : une place de maintenance glissante toutes les deux séances au maximum, non obligatoire ; échéances individuelles selon preuves (7/9/12, plafond 14 à tester), priorité aux rappels erreurs/aides et concepts non encore prouvés. Ne jamais retirer automatiquement une découverte. Si aucune place compatible, différer et journaliser le conflit (donneur, cible, preuves, éligibilité, famille, délai, budget).
3. Evaluer sur même modèle de réponse, témoin natif puis M1 seul puis M1+M4 ; comparer les 18 trajectoires aux cinq horizons, gain précoce et dette par concept (pas seulement agrégat), preuve individuelle, plafonds de difficulté, éligibilité, latence, reprise. Tester les trois variantes V2/V6 et la fenêtre de rappel seulement sur autorité explicite. D et M6 valident indépendamment le candidat réellement raccordé. Si la place de rappel déplace une dette vers d'autres fondamentaux, HOLD.
4. Si souhait de conserver uniquement T comme amélioration conservatrice, arbitrer son gain pédagogique modeste (3 substitutions) et l'absence de relation C explicite ; revalider avec le curriculum retenu. Y reste HOLD malgré le contraste S9. Aucun P autonome ou TP activé.
5. Les tests historiques échoués sur les compteurs 1879/1523 et identité textuelle ancienne doivent être arbitrés globalement sans abaisser les invariants. Chromium/WebKit attestés pour moteur inchangé par B/D, pas pour un candidat global raccordé.

Conclusion : consolidation technique et transmission prêtes, meilleure combinaison explorée ne satisfait pas tous les critères ; les améliorations concrètes sont limitées et non activées. M4 autonome intégrable comme livrables d'audit/recette, pas comme changement de sélection validé. MISSION DÉFINITIVEMENT TERMINÉE : NON (objectif pédagogique global et recette M1/M6 non soldés).

## Rejeu natif indépendant des archives permanentes (achevé)
[Run 45998506142](https://github.com/CapGui13/QPJB/actions/runs/45998506142), SHA de vérification 452cdae752ebd3c1d7780b5d78de3bd4a493fc8b : 6/6 jobs, 18/18 archives gzip+base64 vérifiées (SHA256 des chaînes et provenance, décompression, checkpoints), 36 bras et 64 800 réponses rejouées sur le moteur natif. Référence resélectionnée et comparée ID/motif, candidat reconstruit puis éligibilité et reprise vérifiées ; le rejeu ne prétend pas resélectionner le candidat. Reçu durable tp-archive-replay-receipt.json. #473/#474 fermées sans fusion.
Cas réel sur les trois graines autonomes : S3 SEF-005-2 (21 H, 3-3-4-3, 2SA) → SEF-005-1 (20 H, même forme, 2SA), même famille ; S170 SEF-V4-026-3 (7 H, 1♣ adverse, partenaire 1♥, réponse 2♥, N3) → SEF-001-1 (15 H réguliers, ouverture 1SA, N1), dernier concept S62, écart 108. Les neuf autres IDs des séances sont conservés, mais leurs positions peuvent être réordonnées par logicalOrder() natif, qui n'est pas modifié. Les decks avant/après ordonnés et détails des six décisions directes sont dans le reçu.

## Essai complémentaire de compatibilité M1
Le coordinateur M4 a ajouté un banc isolé tests/coherence-concrete-m4-integration-m1.cjs, distinct de la recette globale. Il charge en lecture seule le véritable M1 #433 SHA 6d2d2586a0b59e029c808df8424ab458cf3cd064, V2 et V6, et réutilise son injection sourceFor() exacte, même moteur, catalogue et métadonnées. Compare M1 seul vs M1+T/P (pas témoin natif non instrumenté), 18 paires par politique, même règle de réponses D et métriques strictes, aucune modification M1. Run 45998778903, PR technique #476, SHA banc cda790b197339d64a136a69a5dd414c79effe5ac. En cours au dernier relevé, aucun visa. Ce test n'étend pas le plan M1 au-delà de S65 et ne valide pas les autres missions.

## Résultat final : compatibilité réelle M1 V2/V6
[Run 45998778903](https://github.com/CapGui13/QPJB/actions/runs/45998778903), SHA banc cda790b197339d64a136a69a5dd414c79effe5ac, M1 exact 6d2d2586a0b59e029c808df8424ab458cf3cd064. 18/18 jobs techniques réussis, deux paires par job : 36 paires / 129 600 présentations synthétiques. Le gate relatif strict D est en échec pédagogique pour V2 ET V6. Comparaison M1 seul → M1+TP, PAS témoin natif. Aucun défaut structurel détecté. Les 36 checkpoints complets, provenance, événements M1 et interventions M4 sont archivés dans les six fichiers m1-*-checkpoints.json ; gate m1-gates-native.json. Les traces brutes intégrales de cette campagne complémentaire restent dans les artefacts temporaires du run (contrairement aux 18 archives compactes TP natives, permanentes et rejouées).

| Indicateur | M1 V2 seul → V2+TP | M1 V6 seul → V6+TP |
|---|---:|---:|
| Paires proches S5 | 34→31 | 34→31 |
| Paires proches S20 | 90→87 | 93→90 |
| Dette S180 | 226597→222535 | 230606→230198 |
| Preuves S180 | 1520→1520 | 1519→1519 |
| Familles S180 | 25806→25806 | 25793→25793 |
| QCM N4–5 S180 | 6816→6822 | 6833→6839 |
| Violations gate historique | 3 | 3 |
| Alertes conceptuelles supplémentaires | 6 | 6 |

Chaque politique : six substitutions directes (trois T, trois P) sur les trois graines autonomes ; quinze trajectoires inchangées. V2 : P S168 V2-M4-012 → SEF-001-1 ; écarts terminaux ouv.mineure et mineur.base 0→1. V6 : P S174 V2-M2-006 → SEF-031-1 ; écarts terminaux majeur.base 0→2 et red.base 0→4. Dans chaque cas S180 deux questions N4–5 supplémentaires par trajectoire autonome, dues aux cascades. Les écarts de dette agrégée ne permettent pas de lever HOLD ; le seuil strict reste inchangé. Les deux vrais curriculums ne règlent pas le conflit de réactivation post-S65. M1 seul vs M1+M4 a donc été réellement testé, mais pas M1–M6 globalement raccordés ni navigateur sur combinaison. Aucun choix V2/V6 imposé par M4.

### Décision de sortie du coordinateur M4
Consolidation et essais de compatibilité effectués, PR brouillon #475 prête à transmettre ; T uniquement candidat conservateur REVIEW isolé, P et TP HOLD sur moteur natif et M1 V2/V6. Pour poursuivre, arbitrage global du quota glissant de maintenance au-delà de S65, puis recette M6 avec modèle unifié, preuves et dette par concept. Les critères non atteints ne sont pas déclarés validés. Aucune fusion vers la branche M4 de livraison ni main, aucun déploiement. MISSION DÉFINITIVEMENT TERMINÉE : NON (objectif pédagogique de diversité/réactivation non satisfait). Livraison de coordination : OUI.

# QPJB Entraînement — audit SEF des 12 réserves documentaires encore actives

**2 novembre 2026 — branche `main` — examen individuel des 12 fiches `EN-*` qui possédaient encore `quarantineReason` après la suspension distincte de B19-Q6.**

## Références et méthode

Source examinée : les 12 fiches intégrales de `entrainement/training-data-bidding.js` (mains, séquences, réponses, distracteurs, corrigés, `pretryHints` et statut). Comparaison avec les dossiers historiques `RAPPORT_AUDIT_PASSE01.md`, `PASSE02.md`, `PASSE03.md` de `CapGui13/QPJBTraining`. Leurs transcriptions de corrigés d'origine sont conservées ; cette passe n'a **pas rouvert ni réinspecté visuellement chacun des PDF d'origine**. Références SEF indépendantes :
- [FFB, *En route vers le SEF*, séance 16, p. 105](https://cdn.ffbridge.fr/cms/geds/0001/06/b203af67b05b104606507f79eeef5b19e552eacf.pdf) : sur 2SA–3♣–3♦, 3♥ montre cinq Piques et quatre Cœurs, 3♠ cinq Cœurs et quatre Piques (forcing de manche).
- [*L'As de Trèfle*, nº 23, p. 28, Jean-Christophe Quantin](https://old.bridgevds.com/bouffemont/pages/Bridge%20selection%20As%20de%20Tr%C3%A8fle/2%20tr%C3%A8fle%20Stayman.pdf) : mêmes significations après 1SA–2♣–2♦, priorité Stayman avec 5–4 majeures et nouvelle mineure au palier de 3 naturelle forcing de manche.
- [ABC du bridge, recherche d'un fit en majeure après SA](https://abc-du-bridge.scenari-community.org/002-10/co/002-10-Synthese.html) : Stayman dès 4–5 HL en réponse à 2SA, priorité à la recherche du fit 4–4 avant le transfert avec 5–4.

**Règle de décision** : le SEF de QPJB prime pour la réponse pédagogique, mais aucune correction ne doit être attribuée faussement au corrigé PDF d'origine. Conserver historique et identité de chaque exercice. Les anciennes fiches `transcrit_source` restent en **auto-évaluation non notée automatiquement** ; aucune réinitialisation de `localStorage`.

## Trois corrections de bonne enchère certaines

| ID | Main et séquence | Ancienne → nouvelle réponse | Motif |
|---|---|---|---|
| `EN-1sa-011` | ♠AD1098 ♥RD95 ♦987 ♣10 ; 1SA–2♣–2♦–? | **3♠ → 3♥** | 5 Piques et 4 Cœurs : chassé-croisé 3♥. Le choix 3♣ a été remplacé par 3♥ ; 3♠ reste une proposition incorrecte crédible (signalerait 5♥/4♠). |
| `EN-2sa-005` | ♠A863 ♥RV954 ♦RV6 ♣10 ; 2SA–3♣–3♦–? | **3♥ → 3♠** | 5 Cœurs et 4 Piques : chassé-croisé 3♠. **12 H + 1 L = 13 HL** ; l'ancienne explication comptait 14 HL et imposait indûment une conclusion de chelem. Nouvelle justification : forcing de manche, 4♥ avec fit de trois, sinon 3SA ; chelem seulement à explorer selon suite. |
| `EN-BH-115-06` | Ouvreur ♠AV4 ♥D82 ♦AD652 ♣R8 ; 1SA–2♣–2♦–3♥–? | **4♥ → 4♠** | 3♥ du répondant décrit 5 Piques, 4 Cœurs ; l'ouvreur possède trois Piques : fit 5–3 à ♠. 4♥ négligerait ce fit. |

Pour ces trois exercices, les valeurs `sourceOriginalCorrect` et `sourceOriginalExplanation` gardent **à l'identique** la réponse et la justification imprimées avant intervention ; `pedagogicalArbitration` signale explicitement la divergence entre document source et correction SEF. Réécriture ciblée de l'explication de la bonne réponse et des trois commentaires des mauvaises propositions. **Le mode `transcrit_source` reste en auto-évaluation** ; aucune donnée historique des élèves n'est effacée ou réévaluée à posteriori.

## Quatre réserves levées sans changer la bonne réponse

| ID | Réponse conservée | Justification SEF confirmée |
|---|---|---|
| `EN-1sa-008` | 2♣ | Avec 5♠ et 4♥, force suffisante : le Stayman est prioritaire pour découvrir un éventuel fit 4–4 à ♥, avant l'étude d'un 5–3 à ♠. |
| `EN-BH-048-03` | 2♣ | Avec 5♠, 4♥ et 11 HL, même priorité au Stayman ; le Texas Pique perd l'examen immédiat du fit à ♥. |
| `EN-BH-115-05` | 3♣ | Face à 2SA (20–21 H), 5♥/4♠ avec 6 HL : Stayman dès 5 HL, puis chassé-croisé si réponse 3♦. |
| `EN-BH-092-05` | 3♣ | Après 1SA–2♣–2♦, 3♣ est une nouvelle mineure naturelle forcing de manche ; cinq Trèfles, quatre Cœurs et singleton Pique justifient le choix. |

Les quatre champs `quarantineReason` précédents sont archivés dans `historicalQuarantineReason20261102`, et une décision `pedagogicalReview_20261102: reserve_levee` est enregistrée. Réponse, choix, mains, séquences, progression et statut `transcrit_source` restent inchangés.

## Cinq cas maintenus en réserve (aucune réponse modifiée)

| ID | Réponse actuelle | Réserve toujours ouverte |
|---|---|---|
| `EN-suite-repondant-003` | 6♠ | 1♣–1♠–4♠ : somme HLD favorable au chelem, mais le saut direct à 6♠ ignore la recherche des contrôles, dont celui à ♣ avec deux petits Trèfles chez le répondant. Pas d'enchère exploratoire dans les choix. |
| `EN-BH-077-04` | 6♥ | Après 1♣–1♥–2SA avec six Cœurs, exploration de chelem et fit réel non présentés parmi les choix. Réponse imprimée conservée, unicité SEF non démontrée. |
| `EN-BH-078-05` | 4♠ | Prolongation d'un barrage à 3♠ : trois atouts, une courte, mais conditions de vulnérabilité et de tactique absentes ; ne pas inventer ces informations. |
| `EN-BH-019-04` | 2♥ | Bicolore majeur 5–5 après 1SA : Texas Pique suivi des Cœurs est proposé ; le traitement de l'autre ordre des Texas reste à expertiser selon la priorité pédagogique retenue. |
| `EN-BH-025-01` | 4♥ | Réponse naturelle directe à 2SA avec six Cœurs ; vérifier si le Texas 3♦ puis conclusion à 4♥ est attendu au SEF et le traitement des réponses directes au palier de 4. Pas de remplacement sans preuve suffisante. |

Ces cinq fiches étaient déjà accessibles en `transcrit_source`, donc **en auto-évaluation, sans validation automatique de justesse** ; elles ne sont ni arbitrairement corrigées ni masquées en bloc.

## Validation et suite

- **12 fiches examinées**, 3 corrections de réponse et de corrigés, 4 réserves levées, 5 réserves explicites maintenues.
- **563 EN en banque, 559 disponibles, 4 en quarantaine** (dont B19-Q6), sans modification de disponibilité durant cette passe ; jeu de carte 114 / 111 inchangé.
- Gardes de test : trois inversions SEF, conservation des anciennes réponses/corrigés PDF, quatre réserves levées, cinq réserves restantes, 4 propositions toujours distinctes, commentaires et indices cohérents, bootstrap intégré/PWA actualisés, navigation Chromium/WebKit.
- **Statut CI/Pages à renseigner après l'exécution effective sur le commit publié** ; le test Safari/PWA sur iPhone physique reste indépendant.


---

## Addendum — résolutions FFB des dossiers BH-019 et BH-025 (2 novembre 2026)

Revue indépendante complémentaire des **deux** exercices cités dans les cinq réserves conservées ci-dessus. Le tableau des cinq reste la photographie de l'audit initial avant cette contre-expertise, et ne doit **pas** être lu comme l'état final du dépôt.

1. **`EN-BH-019-04`** — **2♥ conservé, réserve levée.** La donne 19 du [Simultané des élèves de février 2024, FFB](https://bridgelegecapferret.club.ffbridge.fr/document-download/65dca7b3266b4_Livretpourlesite.pdf) montre explicitement avec un bicolore majeur 5–5 de manche la séquence **1SA–2♥ (Texas Pique)–2♠–4♥**, pour laisser le choix de la majeure à l'ouvreur. La main du QPJB, ♠RD852 ♥DV976 ♦7 ♣43, a 8 H et la distribution 5–5 avec courte mineure, d'où une ambition de manche cohérente. **D'autres conventions peuvent exister, notamment le 4♦ direct**, mais cela ne rend pas 2♥ incorrect dans le cadre pédagogique français : l'ancienne réserve n'a pas à bloquer ce choix.
2. **`EN-BH-025-01`** — **4♥ conservé, réserve levée.** Dans [*L'As de Trèfle* nº27, mai 2016, p.32, sous le contrôle éditorial FFB](https://cdn.ffbridge.fr/cms/magazine/0001/01/6b39e4fb2e866fd51e561486d551cac61e47a5cf.pdf), 4♥ direct sur 2SA est expressément une enchère **naturelle de conclusion**, alors que **4♦ décrit conventionnellement un bicolore majeur 5–5**. La main ♠8 ♥R108652 ♦753 ♣964 a six Cœurs, un singleton Pique et 7 HLD avec un fit huitième assuré face à 2SA 20–21H : la manche naturelle à 4♥ est justifiée. L'ancien indice « 4♦ = mauvais contrat à Carreau » était **erroné** ; il est corrigé pour expliquer la véritable signification de 4♦, en conservant l'ancienne explication PDF dans `sourceOriginalExplanation`.

**Mise en banque** : leurs anciens `quarantineReason` sont archivés sous `historicalQuarantineReason20261102` et une revue nominative `pedagogicalReview_20261102: reserve_levee` est inscrite. Pas de changement de bonne enchère, choix, main, séquence, ID, statut guidé ou progression. Le seul changement de texte concerne l'explication du 4♦ sur BH-025 et la précision de son corrigé.

**Bilan final des douze réserves initiales : 3 réponses corrigées + 6 réserves levées sans changer la réponse + 3 réserves encore ouvertes.** Les **trois dossiers restants** sont : `EN-suite-repondant-003`, `EN-BH-077-04`, `EN-BH-078-05` (deux enchères directes de chelem et une décision compétitive sensible au contexte). Disponibilité toujours **563 fiches EN stockées / 559 accessibles / 4 masquées**. Cache PWA `qpjb-v44`, modules `20261102e`. Nouvelle CI/Pages à vérifier séparément après commit.

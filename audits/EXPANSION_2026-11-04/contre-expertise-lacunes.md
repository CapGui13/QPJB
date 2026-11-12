# QPJB — Contre-expertise des premières pistes de lacunes
**4 novembre 2026 — périmètre : Quizz V4.69, 993 exercices (source `28ae8e5161655534bf17376673decc92c72f2a79`).**

## Règle de décision
La **faible présence d'une séquence n'est pas une lacune démontrée**. On confirme un besoin seulement lorsqu'une **décision pédagogique distincte** est absente et qu'un exercice existant ne suffit pas à l'enseigner. Les cas de priorité ci-dessous restent des **besoins de conception**, non de nouvelles fiches validées en SEF.

## 1. CONFIRMÉ COMME BESOIN PÉDAGOGIQUE : réponses après `1♥/1♠ — (Contre)`
**Exercice à créer ?** Oui, dans le principe : concevoir **des contrastes ciblés**, sans quota.

**Fiches réellement lues (7) :**
- `SEF-V44-043` : 1♥–(X), 5 H, 4 atouts → 3♥ (barrage, vulnérabilité favorable).
- `SEF-V44-044` : 1♠–(X), 5 H, 4 atouts → 3♠ (barrage, vulnérabilité favorable).
- `SEF-V44-045` : 1♥–(X), 11 H, sans fit → Surcontre.
- `SEF-V413-012` : 1♠–(X), 7 H, 3 atouts → 2♠.
- `SEF-V421-006` : 1♥–(X), 7 H, 3 atouts → 2♥.
- `SEF-V421-007` : 1♠–(X), 11 H, sans fit → Surcontre.
- `SEF-V422-003` : 1♥–(X), 6 H, 5 atouts → 4♥ (barrage, vulnérabilité favorable).

**Ce qu'elles n'enseignent pas :** aucune ne donne **Passe**, **changement de couleur** ou **2SA Truscott** comme bonne réponse dans *cette séquence de contre*.

**Trois besoins conceptuels distincts** :
1. **Passe plutôt qu'une enchère de soutien automatique**, avec une main réellement improductive sans soutien utile. Contraste demandé avec les soutiens `SEF-V413-012` ou `SEF-V421-006`. Objectif : savoir quand ne pas surenchérir.
2. **Nouvelle couleur naturelle après contre** avec longueur appropriée. Distinguer notamment l'enchère au palier de 1 (ex. 1♥–X–1♠) et une nouvelle couleur au palier de 2 (ex. 1♠–X–2♥), dont le caractère forcing n'est pas le même. Ce point est sourcé mais **doit être revalidé pour chaque main et chacune des deux séquences**.
3. **2SA Truscott sur une ouverture majeure contrée** avec fit de quatre cartes et force constructive/invitante. Le référentiel SEF 2024 présente, en majeure, la zone **11–12 HLD** ; à distinguer des 2SA *fittés sur intervention à la couleur*, qui répondent à une autre situation et existent déjà dans la base.

**Risque pédagogique actuel :** les 7 cas existants pourraient conduire à penser que, après un contre, on doit toujours soutenir ou surcontrer ; ils ne font pas pratiquer la décision alternative.

**Références à lire pour confirmer les détails avant création :**
- Olivier Chailley, *Le SEF 2024 (1)* : https://www.bridge-chailley.fr/le-sef-2024-1/ (notamment Truscott et changements du SEF).
- Marc Kerlero, discussion technique *Le Surcontre après un contre de l'ouverture SEF 2024* : https://amourdubridge.fr/forums/topic/le-surcontre-apres-un-contre-de-louverture-sef-2024/ (changement de couleur 1/1 et dilemme du surcontre).
- iBridge, *Le répondant après un contre* : https://www.ibridge.fr/public/fichedetails/272 (passe, soutiens, changements de couleur à 2, Truscott). **Prudence : la fiche contient aussi des développements explicitement hors SEF ; ne pas reprendre ces conventions.**

**Statut :** `lacune_pedagogique_confirmee` pour le **type de décision**, `validation_sef_de_la_main_a_faire` pour chaque futur QCM. **Première priorité de conception**.

## 2. PLAUSIBLE, À VALIDER : réponses à l'ouverture mineure contrée `1♣/1♦ — (Contre)`
**Fiche réellement présente :** `SEF-V424-007`, après 1♦–(X), 11 H sans fit clair → Surcontre.

**Absences constatées :** aucune autre bonne réponse avec cette séquence dans les 993 exercices, donc pas d'illustration du choix entre réponse naturelle, faiblesse et surcontre ; pas de `1♣–(X)` dans les données.

**Intérêt potentiel :** comprendre quand le contre change la lecture des soutiens mineurs, du surcontre et de la découverte d'une majeure. Le SEF 2024 prévoit notamment un Truscott mineur, mais **les conditions exactes doivent être tirées du texte SEF** avant de fixer une nouvelle bonne réponse. Ne pas transposer mécaniquement les règles de la majeure à la mineure.

**Contraste visé :** comparer une réponse naturelle disponible avec le `Surcontre` de `SEF-V424-007`.

**Statut :** `lacune_plausible_sous_reserve_sef`. Priorité secondaire ; pas de génération immédiate.

## 3. DÉJÀ COUVERT : soutien adverse après contre d'appel de notre partenaire
**Séquence identique déjà comparée : `1♣ – Contre – 2♣`.**
- `SEF-V419-008` : main 3-3-4-3, 2 H → **Passe**. L'adversaire a parlé : répondre au contre n'est plus obligatoire.
- `SEF-V419-009` : 2-5-3-3, 10 H et cinq Cœurs → **2♥**. Enchère libre constructive.
- `SEF-V422-005` : 5-3-3-2, 10 H et cinq Piques → **2♠**.
- `SEF-V421-009` : 1♥–Contre–2♥, 9 H et cinq Piques → **2♠**.

**Verdict :** la décision **Passe ou enchère libre** est déjà démontrée **à séquence identique** par les deux premières fiches. L'absence des variantes 1♦–X–2♦ ou 1♠–X–2♠ ne suffit **pas** à justifier un ajout. Première priorité de la liste brute **retirée**.

**Statut :** `couvert_pas_de_nouvelle_fiche`.

## 4. NON RETENU : reproduire 2SA après un 2 faible à Pique
- `SEF-V426-003` : partenaire 2♥ faible ; répondant 16 H, 3 Cœurs → **2SA** interrogatif/fitté.
- Après 2♠ faible, la liste actuelle contient plusieurs réponses Passe/4♠ mais pas 2SA.

**Verdict :** reproduire à Pique une notion déjà enseignée après 2♥ n'est **pas en soi** une compétence nouvelle. On n'ajoute pas un exercice pour obtenir une symétrie artificielle entre 2♥ et 2♠. Un futur besoin ne serait recevable que si le changement de situation entraînait **une vraie décision différente**, démontrée par un contraste absent.

**Statut :** `non_retenu_sans_contraste_nouveau`.

## 5. DÉJÀ COUVERT : 2SA fitté après intervention à la couleur
Le SEF 2024 distingue l'intervention par couleur du contre adverse. Cinq fiches de `apres_inter` montrent déjà **2SA fitté** sur intervention à la couleur après ouverture majeure :
- `SEF-V3-075-3`, `SEF-V3-081-3` : 1♥–(1♠).
- `SEF-V3-082-1` : 1♥–(2♣).
- `SEF-V3-083-1` : 1♠–(2♣).
- `SEF-V3-084-3` : 1♠–(2♦).

**Verdict :** n'ouvrir aucun nouveau lot « 2SA après intervention » sur la seule base d'un comptage. Le besoin **2SA Truscott après contre** reste distinct et non couvert.

**Statut :** `couvert_pas_de_nouvelle_fiche`.

## 6. DÉJÀ COUVERT : réponses directes à 1SA
Les 42 fiches après 1SA contiennent Passe, invitation à 2SA, conclusion 3SA, Stayman et les deux Texas majeurs. La différence entre une invitation et une conclusion est déjà illustrée par plusieurs mains de forces différentes (par exemple `SEF-032-1`, `SEF-033-1`, `SEF-N090-1`).

**Verdict :** aucune nouvelle fiche ne peut être justifiée par un objectif de remplissage de cette rubrique.

## 7. Signatures similaires : filtre contre les ajouts redondants
`SEF-032-1`, `SEF-V49-015`, `SEF-C-001` :
- trois mains différentes mais même distribution 3-3-4-3, 8 H, séquence 1SA, réponse 2SA ;
- leur répartition d'honneurs varie mais **la règle de décision enseignée reste essentiellement la même**.

**Conséquence :** pour un futur exercice 1SA–2SA avec ce profil, il faudra prouver que la qualité des cartes ou le contexte modifie effectivement la décision. Sans cela, pas d'ajout. **Pas de suppression automatique des fiches actuelles.**

## Bilan et ordre de travail
1. **Prioritaire :** documenter trois *décisions non illustrées* après 1♥/1♠–(Contre) : Passe ; nouvelle couleur avec la bonne valeur forcing/non-forcing ; 2SA Truscott.
2. **Conditionnel :** étude ciblée du système de réponses à 1♣/1♦–(Contre) ; confronter au texte exact du SEF 2024 et aux cas déjà présents.
3. **Non retenu comme création :** rejouer le contraste Passe/enchère libre après contre d'appel du partenaire ; recopier l'interrogation à 2SA de 2♥ vers 2♠ ; ajouter une énième invitation sur 1SA.
4. **Chaque création future :** définir la compétence, l'ID témoin, l'élément qui change, un scénario de mauvaise réponse plausible, puis **valider la bonne enchère à partir de la main complète**. Ne pas proposer une main basée seulement sur un seuil H théorique.

**Aucun exercice créé ou modifié dans cette contre-expertise.** Les jugements concernent les décisions observées dans les 993 fiches ; ils ne sont pas une certification humaine exhaustive des 993 corrigés.

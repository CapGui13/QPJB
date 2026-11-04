# QPJB — Pistes de lacunes à expertiser (phase 2, sans création d'exercices)
Source : 993 fiches V4.69, commit `28ae8e5161655534bf17376673decc92c72f2a79` ; **pas de quota par catégorie**.

## P1 — Répondre quand le camp adverse soutient après le contre d'appel de notre partenaire
**Compétence cible :** comprendre que l'obligation de répondre au contre disparaît si le joueur de droite parle ; différencier **Passe** et **enchère libre constructive** selon la main. C'est une véritable décision de débutant/consolidation qui risque de créer des erreurs coûteuses.

**Preuves de couverture actuelle :** 4 fiches avec séquence `(1x) — Contre — (2x)` dans la rubrique `contre` :
- `SEF-V419-008` — Adversaire : 1♣ / Partenaire : Contre / Adversaire : 2♣ → **Passe**, 2 H
- `SEF-V419-009` — Adversaire : 1♣ / Partenaire : Contre / Adversaire : 2♣ → **2♥**, 10 H
- `SEF-V421-009` — Adversaire : 1♥ / Partenaire : Contre / Adversaire : 2♥ → **2♠**, 9 H
- `SEF-V422-005` — Adversaire : 1♣ / Partenaire : Contre / Adversaire : 2♣ → **2♠**, 10 H
Dans cette sélection : `(1♦) — Contre — (2♦)` : **0** ; `(1♠) — Contre — (2♠)` : **0**. Un unique exemple sous 1♥–2♥ ne montre pas le choix entre deux réponses pour cette même séquence.

**Action d'audit suivante :** vérifier le SEF de la réponse libre puis construire *seulement si utile* un contraste de deux mains à séquence identique : l'une exige Passe, l'autre mérite une action libre (et non simplement changer la couleur adverse).

## P1 — Après 1♥ ou 1♠ de notre partenaire, l'adversaire contre
**Compétence cible :** comparer soutien compétitif, Surcontre avec des valeurs, et, lorsque le SEF le permet, réponse naturelle sans fit et/ou Passe.

**Couverture repérée :** 7 fiches directes après `1♥/1♠ — (Contre)` dans `apres_inter` :
- `SEF-V44-043` — Partenaire : 1♥ / Adversaire : Contre → **3♥**, 5 H
- `SEF-V44-044` — Partenaire : 1♠ / Adversaire : Contre → **3♠**, 5 H
- `SEF-V44-045` — Partenaire : 1♥ / Adversaire : Contre → **Surcontre**, 11 H
- `SEF-V413-012` — Partenaire : 1♠ / Adversaire : Contre → **2♠**, 7 H
- `SEF-V421-006` — Partenaire : 1♥ / Adversaire : Contre → **2♥**, 7 H
- `SEF-V421-007` — Partenaire : 1♠ / Adversaire : Contre → **Surcontre**, 11 H
- `SEF-V422-003` — Partenaire : 1♥ / Adversaire : Contre → **4♥**, 6 H
Réponses d'une **nouvelle couleur** dans cette sélection : **0** (classification syntaxique, à confirmer avec les autres rubriques).

**Question à expertiser :** manque-t-il un vrai contraste « sans fit et sans force de surcontre » versus soutien/Surcontre ? Ne pas générer avant d'avoir fixé la convention et la vulnérabilité utiles.

## P2 — Interroger l'ouvreur d'un 2 faible à Pique
**Compétence cible :** distinguer la simple prolongation de barrage d'une **recherche constructive** de manche sur 2 faible, avec une main appropriée.

**Couverture repérée :** 7 fiches après `2♥` faible et 7 après `2♠` faible (y compris concurrence). La réponse `2SA` apparaît **1** fois après 2♥ et **0** fois après 2♠.

**À vérifier :** cette situation mérite-t-elle une nouvelle fiche différenciant une main qui interroge d'une main qui conclut directement ? **La dissymétrie 2♥/2♠ seule n'est PAS une justification suffisante**.

## Déjà couvert : ne pas générer mécaniquement
Les 42 fiches de réponse directe à 1SA comportent :
- **Passe** : 8 fiches
- **2SA** : 6 fiches
- **3SA** : 7 fiches
- **2♣** : 7 fiches
- **2♦** : 7 fiches
- **2♥** : 6 fiches
- **4SA** : 1 fiches
Le contraste de base Passe / 2SA invitation / 3SA manche / Stayman / Texas est présent. **Aucune création justifiée par le seul nombre d'exercices dans cette rubrique**.
Les 39 fiches `apres_fit` couvrent déjà des suites opposant arrêt, essai de manche et conclusion ; la seule taille de cette rubrique ne constitue pas une lacune.

## Contrôles anti-remplissage
- Profil de décision analogue : `SEF-001-1`, `SEF-N017-2`
- Profil de décision analogue : `SEF-001-2`, `SEF-N017-1`
- Profil de décision analogue : `SEF-008-2`, `SEF-V49-001`
- Profil de décision analogue : `SEF-011-2`, `SEF-N013-2`
- Profil de décision analogue : `SEF-017-1`, `SEF-N028-1`
- Profil de décision analogue : `SEF-022-1`, `SEF-N033-1`
- Profil de décision analogue : `SEF-023-1`, `SEF-N043-1`
Au total : 26 groupes de signatures rapprochées / 27 fiches excédentaires au regard de *cette signature simple*. Avant d'ajouter une main, vérifier si un profil proche existe déjà et si la différence de cartes/arrêts apprend quelque chose. **Aucune suppression automatique.**

## Statut
Ces éléments sont **pistes candidates**, pas « erreurs prouvées », « séquences manquantes au SEF » ou exercices prêts à intégrer. Validation nécessaire : exemple exact, variantes plausibles, convention SEF, vulnérabilité si déterminante, apport unique et pertinence du distracteur.

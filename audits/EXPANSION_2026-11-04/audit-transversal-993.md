# QPJB — Audit transversal du Quiz : 68 axes de couverture
Source `main` du 4 novembre 2026, version `prototype-2026-11-04-v4-69-final-38`, **993 fiches**. Nouvelles fiches : **aucune publiée**.

## Portée
- **22 rubriques** entièrement prises en compte (repères descriptifs, sans quota).
- **46 décisions pédagogiques distinctes** échantillonnées à l'aide de filtres ciblés sur les enchères et réponses, avec IDs de preuves.
- **25 catégories de décisions non représentées** dans ces filtres, **21 avec au moins un témoin**. L'absence factuelle n'est pas une obligation de créer.
- Ce document **ne prétend pas** démontrer l'exhaustivité du SEF, ni avoir validé l'intérêt de chacun des cas possibles. Voir la colonne `pedagogicalAssessment` du JSON.

## Résultats par décision de haute priorité
| Identifiant | Décision à apprendre | Exemples actuels | Référence contrastive |
|---|---|---:|---|
| D01 | Passer après 1M-(X) | 0 | SEF-V421-006 |
| D02 | 1SA limité après 1M-(X) | 0 | SEF-V44-045 |
| D03 | 1♠ sur 1♥-(X), 1/1 forcing | 0 | SEF-V421-007 |
| D04 | Nouvelle couleur au palier 2 après 1M-(X) | 0 | SEF-V421-007 |
| D05 | 2SA Truscott après 1M-(X) | 0 | SEF-V44-043, SEF-V413-012 |
| D14 | Passer sur 2M faible adverse | 0 | SEF-V3-037-1 |
| D15 | Contre d'appel sur 2M faible adverse | 0 | SEF-V3-038-2 |
| D16 | Intervention à 2SA sur 2M faible adverse | 0 | SEF-V3-070-2 |
| D17 | Intervention naturelle à la couleur sur 2M faible adverse | 0 | SEF-V3-035-4 |
| D24 | Redemande libre de l'ouvreur après enchère du quatrième joueur | 0 | SEF-V49-018 |

## Priorisation par utilité, et non par quantité
**Groupe A — Première vague de travail :** 
1. **Après 1M-(Contre) :** comparer Passe, 1SA, changement de couleur forcing 1/1, changement non forcing au niveau 2, Surcontre et 2SA Truscott.
2. **Sur 2 faible adverse :** comparer Passe / Contre d'appel / intervention naturelle / 2SA naturel avec arrêts, alors que le Quiz enseigne surtout comment répondre à *notre propre* 2 faible.

**Groupe B — Seconde vague de conception :** 
- **Redemande libre de l'ouvreur après surenchère du quatrième joueur.** Source SEF 2024 : différence entre 1SA forcé (sans promesse d'arrêt) et 1SA libre (avec arrêt), après intervention.
- **Sur 1♣/1♦-(Contre),** enrichir seulement les vrais contrastes : priorités des majeures, réponses faibles/constructives et spécificités du Truscott mineur. La version actuelle a un Surcontre mais pas une gamme d'alternatives.
- **Sur 1SA-(Contre) ou 1SA-(2♣),** définir d'abord la signification du Contre / 2♣ avant de créer ; les cas Rubensohl sur 2♦/2♥ sont déjà représentés.

**Groupe C — Approfondissement après le socle :** interrogation à la dame d'atout, réactions aux interventions après ouvertures fortes, défense contre Michaels adverse.

## Déjà illustré : aucune création automatique
- Réponse directe au 1SA : Passe / invitation / manche / Stayman / Texas.
- Suite après 1M–2M : enchères d'essai et décisions du répondant.
- Répondre au contre du partenaire lorsque le soutien adverse libère le répondant.
- Drury, Roudi, quatrième couleur, Rubensohl, Multi-Landy, Blackwood de base, réponses au 2 faible du *partenaire*.

## Prudence sur le diagnostic
Les données indiquent **ce qui existe dans la banque**, pas une fréquence de donnes ni une mesure de réussite des élèves. Certaines séquences sont absentes à juste titre. Les filtres vérifient des formes d'enchères, pas les effets complets du niveau, des arrêts, de la vulnérabilité ou de la convention.
La cartographie initiale comporte 89 groupes dominants provisoires ; ce document constitue une couche de décision plus fine et complémentaire.

## Références pédagogiques externes
- https://www.bridge-chailley.fr/le-sef-2024-1/ — nouveautés du SEF 2024, Truscott, mini-maxi, redemandes libres.
- https://dev.ibridge-club.fr/public/fichedetails/102 — choix après contre adverse.
- https://xvm-167-89.ghst.net/public/fichedetails/122 — interventions après ouverture de deux faible.
- https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523 — distinctions du 2SA.

## Lien avec le lot pilote
`candidats-qcm.json` contient 15 fiches concrètes, chacune avec 13 cartes, force, choix, bonne réponse candidate, corrigé provisoire, source et références aux fiches anciennes.
`triage-15-candidats.md` retire les scénarios redondants : **11 présélectionnés, 3 en réserve, 1 rejeté**. Le chiffre de 11 n'est ni un quota ni un objectif à atteindre ; il reste soumis à une contre-expertise SEF des mains.

**Aucune écriture dans `quizz.html`.** Cette PR demeure brouillon jusqu'à validation des propositions.

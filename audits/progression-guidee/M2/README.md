# M2 — moteur de sélection (#295)

## Livraison
Base commune 96c0f7962c14e74429fa12871d687efa0e8a94bd. Correctif #291 repris depuis le blob moteur 87d4dc247d85cbf0050091eaa4f72f96add5d033 (sans les adaptations des tests historiques).
Moteur candidat : blob 0c2743f963bdfae589ed901eb6ffb1a6414fda0d, commit 00ac5a31320749e7e89ccd69e94c5b210238e1a1.
M1 réel : blob 9071d5ab03115c9967fb3c54ee819f91a1cec84e (PR #297). La branche M2 ne contient pas de copie de ce fichier : le pilote réunit les deux branches.

## Stratégie livrée
- Une porte d'éligibilité commune (parcours normal/consolidation) ; diagnostic pur `eligibility(q,state,exercises)`. ROADMAP, minSession, dépendances par concept et protections 2♣ fort ; métadonnées manquantes = refus explicite. Les prérequis de découverte reposent sur les QCM exposés dans des séances terminées, pas sur une réussite présumée.
- Niveau 3 local : exposition aux variantes moins difficiles lorsqu'elles existent. N4/N5 : exposition, preuve de réussite indépendante à difficulté inférieure, sur 2/3 séances distinctes, diversité des familles adaptée aux familles disponibles, et plancher de calendrier. Si la notion n'a aucune variante moins difficile, seules les dépendances M1 explicites peuvent fournir ses preuves. Les anciennes évaluations explicitement enregistrées donnent une exposition, pas une preuve indépendante inventée. Aide/saisie libre erronée et consolidation ne valident pas de maîtrise.
- Sélection puis ordre : contraintes S1/S2 ; Passes d'ouverture plafonnés ensuite selon la faiblesse spécifique, jamais confusion avec les Passes en réponse. Quotas indicatifs découverte/entretien/faiblesse/transfert par profil. Rappels par familles nouvelles, reprises exactes ciblées, priorités aux rubriques nouvelles et aux fondamentaux en retard. L'élève fragile conserve des cas élémentaires et n'est pas forcé vers des cas difficiles pour remplir la séance ; une variante avancée exige toujours sa propre preuve.
- Ordonnancement déterministe par recherche bornée, coût des réponses identiques, triples de thème, forces/distributions identiques ; ordre sans alternance obligatoire, contrainte dure premier Passe Q1–Q3 et séparation en S1. Les ids et motifs de sélection restent liés. La reprise existante ne passe jamais par la sélection.
- Consolidation ciblée maintenue, avec éligibilité commune et ordre varié. Une consolidation explicitement consacrée à Passe conserve son rôle (plafond des Passes réservé aux séances ordinaires). Aucun changement de notation/stockage/maîtrise.
- Script prérequis chargé avant le moteur, versions v1/v13 et cache qpjb-v95 ; builder public exige le fichier M1. Aucun artefact expérimental publié.

## Tests exécutés sur les blobs réels
Les fichiers de test sont autonomes et utilisables en Node. Dans cette instance, exécution du code source exact en V8 avec adaptateurs assert/fs/path/vm et simulation de l'environnement service worker ; pas de Node natif, de navigateur Playwright ni de CI attestés.
- `node tests/quizz-progression-selection.cjs` : fixtures non-SEF explicitement injectées, rejet des métadonnées manquantes, S1/S2, profils, prérequis, difficultés, reprise, consolidation, petits pools, déterminisme. PASS en V8.
- `node tests/quizz-progression-selection-assets.cjs` : câblage, catalogue 1523/22, builder, échec de préchauffage si module absent puis reprise, présence des 4 ressources Quiz, aucune requête redondante. PASS en V8.
- `node tests/quizz-progression-selection-real.cjs` (après réunion M1/M2) : 6 profils × 20 séances, 1200 QCM, contrôle indépendant des prérequis, diagnostic moteur, familles/IDs, ouverture, réponse, reprises ; fermeture de graphe conjointe M1/M2 1523/1523 atteignables. PASS en V8. UMD navigateur simulé avec window : chargement réel du module puis séance de 10, PASS.
- Le HTML candidat, après annulation exacte du seul remplacement des balises script, égale octet pour octet le HTML de la base (blob historique 2b89070d82ae45fc7aa9fe921ed43984e05eded0). Toutes les questions, mains, choix, réponses, corrigés et difficultés préservés.

### Développement longitudinal, graine 11
Profil et réponses reproduits selon le benchmark historique (mêmes RNG, probabilités, assistance). Valeurs 65/153 = familles distinctes ; pour chaque horizon 22 rubriques, 10 familles par séance, zéro séance incomplète. Référence issue des 30 goldens historiques, inchangés. Il s'agit d'une validation de développement ciblée, pas de la recette M3 exhaustive.

| Profil | Réf. 65 | M2 65 | Réf. 153 | M2 153 | N4/5 M2 65/153 |
|---|---:|---:|---:|---:|---:|
| autonome | 638 | 650 | 1315 | 1262 | 294/507 |
| échecs | 504 | 522 | 1029 | 1019 | 0/137 |
| modéré | 475 | 585 | 1108 | 1255 | 121/411 |
| aides | 491 | 522 | 1037 | 1018 | 0/136 |
| progression | 480 | 533 | 1097 | 1219 | 23/376 |

Autonome mesuré sur la version b6c5c84 (seule la protection des profils faibles et les compteurs équivalents ont ensuite changé) ; autres profils sur le moteur final. Les cinq profils dépassent la cible de 95 % à chaque horizon pour cette graine. Les N4/5 des profils échecs/aides restent sous la référence à 153, et aucun à 65.
Sur le test court final (6 profils × 20) : zéro adjacence de réponse et zéro triple de thème hors S1 pour chaque profil ; découverte SA en S4 pour tous. Passes S1/S2/S3 : autonome 3/1/0, faiblesse Passe 3/2/2, autres 3/2/1. Aucune question sélectionnée inéligible. La fermeture de graphe signifie possibilité théorique après des preuves indépendantes suffisantes, pas exposition acquise pour tous les élèves.

## Intégration
Aucun changement du catalogue JSON, Quiz classique, accueil #292, tests historiques M3, workflows ou verrou de publication. Ne pas publier M2 isolée : elle nécessite M1. Le pilote réunit M1/M2/M3 puis exécute les 30 trajectoires, le profil Passe, les suites Node natives, Chromium/WebKit, reprise, builder/archives et FULL. M2 n'a pas déclenché la recette globale, ne fusionne ni dans integration ni dans main.

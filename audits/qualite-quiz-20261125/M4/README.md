# M4 — qualité pédagogique, interventions

Base figée : `4bb2df19929f921aff81468be22830445d4f87b0`. Catalogue `55633e60ad6e8583616ad11b1da3acf1da013844`, prérequis `9071d5ab03115c9967fb3c54ee819f91a1cec84e`.

## Bilan
- 256 IDs inventoriés et examinés en réutilisant les audits individuels et les règles de chaque famille ; 190 conservés, 64 corrigés, 2 signalés au pilote, 6 nouveaux.
- 6 lacunes couvertes par 6 QCM : deux Texas mineurs, deux réveils sur 2♠ faible, deux frontières d'intervention. Les concepts rares passent chacun de 2 à 4 familles indépendantes.
- Aucune réponse ancienne modifiée ; un distracteur remplacé ; contextes de vulnérabilité fixés lorsque nécessaires ; motifs de difficulté et prérequis existants préservés. Les comparaisons entre intervention naturelle, Contre et réveil sont renforcées.

## Arbitrages et limites
- SEF-L10-005 : HOLD existant #271, non rouvert ; conserver.
- SEF-L13-009 : frontière de rubrique avec M5, à signaler au pilote ; pas de modification de rubrique.
- Les références sont les audits de base, le document FFB des développements et la synthèse SEF 2024 ; pas d'accès revendiqué au texte intégral du manuel commercial SEF 2024. Les règles des anciennes fiches ne sont pas réarbitrées en l'absence de contradiction démontrée.
- Examen par familles et audits antérieurs, avec corrections ciblées ; ce n'est pas une nouvelle certification indépendante SEF ligne à ligne. Les cas tactiques restent des jugements dans les conditions fixées.

## Format et vérifications
`patch.json` contient une liste unique : les modifications avec valeurs old/new, puis les nouveaux QCM complets sous new (old vide) et leur métadonnée prerequis copiée d'un cas du même concept. Le pilote alloue les IDs définitifs et met à jour le générateur de prérequis. Tests JS ciblés exécutés : 256 IDs de revue uniques, 262 mains contrôlées (13 cartes, points H, shape, absence de carte répétée dans une couleur), quatre choix distincts et réponse incluse, old identique à la base, 6 IDs nouveaux et aucune collision main/enchères, prérequis existants et nouveaux compatibles. 0 anomalie structurelle. Pas de CI globale ni publication par M4. SHA du commit fourni dans le bilan de l'issue (un commit ne peut contenir son propre SHA).

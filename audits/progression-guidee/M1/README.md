# M1 — Pré-requis par QCM

Base 96c0f7962c14e74429fa12871d687efa0e8a94bd, blob quizz.html 2b89070d82ae45fc7aa9fe921ed43984e05eded0. 1523 QCM, 22 rubriques. Table explicite par ID, sans interprétation de texte à l'exécution. Générateur hors runtime : enchères, rôles, réponses homologuées, difficulté, motifs éditoriaux ciblés et exceptions ID. Les anciennes références `PROGRESSION_P7_HOLD.json` et `CONTRAT_PREREQUIS_P11_HOLD.json` servent de repères (exemples initiaux, poursuites, seuils); ni preuve de maîtrise ni blocage HOLD. Minima index zéro, au moins ROADMAP. N4/5 : stage 3, expositions aux exemples N1–3, délai local. Ouvertures ordinaires N1–2 dès S1. SA naturel avant Stayman/Texas, 2SA, Texas mineurs. La rectification majeure 1SA est intégrée à la poursuite faute d'exemple autonome; les variantes de Splinter sans N1–3 s'appuient sur fit et contrôles. Mentions incidentes ignorées (L06-027, L07-015). Le graphe prouve une voie d'accès, pas une trajectoire de 10 QCM/séance ni une maîtrise. La recette M3 avec M2 reste nécessaire.

## Vérification exécutée sur données réelles (JavaScript V8)
```json
{
  "ids": 1523,
  "concepts": 91,
  "reachable": 1523,
  "maxEarliest": 49,
  "firstByTheme": {
    "ouv": 0,
    "mineur": 1,
    "majeur": 1,
    "sa": 3,
    "red": 4,
    "second": 6,
    "stayman": 7,
    "intervenir": 10,
    "contre": 12,
    "apres_inter": 14,
    "barrage": 17,
    "apres_fit": 8,
    "reponse_inter": 13,
    "reveil": 19,
    "roudi": 22,
    "drury": 24,
    "fortes": 26,
    "forcing": 28,
    "multilandy": 32,
    "rubensohl": 34,
    "michaels": 36,
    "chelem": 39
  },
  "stages": [
    586,
    401,
    97,
    439
  ],
  "withRequirements": 1456
}
```

Test Node fourni : `node tests/quizz-prerequis.cjs` : couverture, schéma, roadmap, graphe, exceptions, UMD navigateur et égalité avec générateur. Exécution Node native non attestée dans cette passe. Catalogue inchangé par M1.

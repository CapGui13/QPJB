# M2 — PASSE 5 : contre-épreuves appariées et intégrité des sauvegardes

**PASSE 5 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Complétude

- Référence P2 : **30 trajectoires** (5 profils × 2 horizons × 3 graines), 32 700 réponses synthétiques.
- Candidat P3 : **30 trajectoires correspondantes**, 32 700 réponses ; les 10 de graine 11 avaient été lancées en P3, et les 20 de graines 29/47 ont été exécutées en P5.
- Candidat P4 (rejeté) : 10 trajectoires distinctes, 10 900 réponses.
- Total des trois ensembles comparatifs ci-dessus : **76 300 réponses synthétiques**. Le test de 600 sélections de non-régression est indépendant, ne s'ajoute pas comme « réponse d'élève ».
- P3 : mêmes 1 523 QCM, 22 rubriques, dix QCM distincts par séance, 65/153 sessions achevées, mêmes IDs distincts que la référence ; *sans* implication sur les acquis.

## Δ candidat P3 − référence, moyenne des 3 graines et étendue

| Profil | Séances | Δ familles distinctes (min à max) | Δ proportion difficultés 4–5, points % (min à max) | Δ rubriques / séance |
|---|---:|---:|---:|---:|
| autonome | 65 | 0.000 (0.000 à 0.000) | 0.000 (0.000 à 0.000) | 0.000 |
| autonome | 153 | 0.000 (0.000 à 0.000) | 0.000 (0.000 à 0.000) | 0.000 |
| echecs | 65 | 0.000 (0.000 à 0.000) | 0.000 (0.000 à 0.000) | 0.000 |
| echecs | 153 | -2.333 (-4.000 à -1.000) | -0.131 (-0.196 à -0.065) | -0.068 |
| modere | 65 | 0.000 (0.000 à 0.000) | 0.000 (0.000 à 0.000) | 0.000 |
| modere | 153 | -7.667 (-13.000 à 0.000) | -0.065 (-0.784 à 0.588) | 0.059 |
| aides | 65 | 1.000 (0.000 à 2.000) | -0.462 (-0.615 à -0.308) | -0.051 |
| aides | 153 | -9.667 (-11.000 à -8.000) | -0.654 (-0.719 à -0.523) | -0.155 |
| progression | 65 | -11.333 (-20.000 à -7.000) | -0.872 (-1.692 à -0.308) | -0.082 |
| progression | 153 | -5.667 (-11.000 à 2.000) | -0.479 (-3.007 à 1.242) | -0.074 |

Voir `PASSE5_CONTRETESTS.json` pour les **30 comparaisons appariées**, données individuelles et deltas de familles, contextes, réponses, variété par séance, rappels, fondamentaux et difficulté.

## Non-dominance et décision d'audit

- **P3 n'est pas dominant.** Le profil « erreurs modérées », à 153 séances, perd en moyenne 7,67 familles et subit sur une des trois graines une **augmentation** de 0,588 point de QCM niveau 4–5. Le profil « progression » subit également sur une graine une hausse de 1,242 point de difficulté 4–5, avec pertes de familles sur plusieurs graines.
- Le bénéfice du profil « aides » (difficulté plus faible de 0,654 point à 153 séances) coûte environ 9,67 familles distinctes. Ni le nombre de rappels ni l'apprentissage réel ne sont améliorés de manière démontrée.
- P4 a été rejeté en passe 4 : trois rappels augmentent les répétitions, mais compromettent fortement l'exploration et la diversité.
- **Aucun des deux candidats pédagogiques ne justifie une mutation du moteur** sur les données disponibles ; le verdict définitif de sélection sera formalisé en P6.

## Reprise et schémas

- Les exécutions P5 (20 trajectoires) forcent **3 aller-retours JSON d'une séance interrompue** par trajectoire, puis poursuivent le même tirage ; elles vérifient aussi export/import de l'état après 65/153 séances et ses champs (entries, skills, micros, axes, journal).
- Le test `tests/wave2-adaptatif-resume.cjs` couvre cinq variantes sur une séance réelle : original, rechargement local, export/import, ancien état sans motif de sélection et motif invalide. Les anciens motifs **ne sont pas inventés**.
- Contrôle explicite des résultats de deux simulations reprises (autonome/échecs 65 séances, graine 11) : données métriques strictement identiques aux fichiers de référence antérieurs.
- Le test de régression `tests/wave2-adaptatif-selection-regression.cjs` protège les empreintes 5 profils × 12 séances.

## Niveau de validation et limite restante

Le JavaScript CommonJS du dépôt a été **réellement exécuté** dans un environnement V8 à l'aide d'adaptateurs explicites d'accès au catalogue et d'assertions, puis les JSON sont versionnés. **Ni la CLI Node du dépôt ni son CI ciblé n'ont encore exécuté ces nouveaux fichiers** : ne pas appeler cela un test Node ou un CI vert. Les tests doivent être lancés dans un checkout Node 22 pour lever cette réserve, sans toucher aux fichiers d'autres missions.

**PROCHAINE PASSE : P6** sélectionner/rejeter formellement les candidats, vérifier le diff permis et la PR brouillon HOLD, préparer une procédure Node et le bilan honnête des limites ; continuer au-delà de P6 seulement en présence d'un problème concret vérifiable.

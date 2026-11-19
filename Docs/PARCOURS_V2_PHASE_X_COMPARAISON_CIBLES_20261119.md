# QPJB — Phase X : expérience de lissage de la difficulté (non active)

**19 novembre 2026 · PR #214 · aucune mutation du Quiz SEF et aucune publication.**

## 1. Hypothèse issue de W

L'audit W, exécuté sur neuf parcours fictifs de 45 séances, a montré des notes éditoriales moyennes très basses sur les 10 premières séances (**1,14–1,20** sur 1–5, puis **1,50–1,56** sur 6–10), et une concentration de questions notées 4–5 en fin de parcours (**51,33–57,33 %** des séances 31–45). Ces nombres ne représentent **ni des taux d'échec des élèves ni une difficulté cognitive mesurée**.

Objectif de la phase X : tester si **un léger avancement du niveau cible de préférence** répartit mieux les notes éditoriales **sans** sacrifier les familles distinctes, les rappels ciblés, les mineures et les 22 rubriques. Il ne faut surtout pas « améliorer » artificiellement des scores au prix du progrès pédagogique.

## 2. Moteurs comparés

L'observatoire `scripts/parcours-v2-comparer-x.cjs` lit le code exact du simulateur de référence `scripts/parcours-v2-pilot.cjs` et crée deux copies compilées **localement** en remplaçant uniquement la ligne de calcul `target` utilisée dans la pénalité de difficulté du score. La présence d'un unique ancrage de code est vérifiée, sinon l'essai est refusé. Il n'y a **ni remplacement du fichier original, ni modification de fonction en place, ni intervention sur l'interface élève**.

Le score de V2-F reste `110 − 10×|difficulty − target| − 24×themeCount − 21×groupCount − 16×answerCount + autres préférences existantes`. Toutes les autres règles (éligibilité, répartition des créneaux, nouveautés, récence, rappels, exclusion des familles au sein d'une séance) restent **exactement celles du fichier original**.

Niveau cible (séance numérotée à partir de 1) :

| Moteur | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 | Niveau 5 |
|---|---|---|---|---|---|
| **V2-F référence** | 1–12 | 13–24 | 25–36 | 37–48 | 49+ |
| **X-mild** | 1–6 | 7–22 | 23–34 | 35–48 | 49+ |
| **X-early** | 1–5 | 6–18 | 19–30 | 31–48 | 49+ |

Il s'agit d'une **préférence de score** : aucune difficulté n'est « interdite » par ce niveau, ni imposée par le remplacement. Les **cinq premières séances** ont le même niveau cible dans les trois moteurs. Les 79 annotations supplémentaires et leurs étapes restent inchangées.

## 3. Banc comparatif

**Neuf parcours par moteur**, avec les mêmes profils fictifs (`balanced`, `fragile-mineures`, `facile`), les mêmes graines 13/29/47, et 45 séances × 10 QCM. Total : **27 parcours simulés**, dont 9 de référence. On compare **par couple profil/graine**, et non des moyennes anonymes.

Contrôles :
- 22 rubriques couvertes ; ni famille répétée dans une séance, ni ID original modifié.
- Pas plus de **2 familles indépendantes** perdues sur 450 QCM comparativement à V2-F.
- Pas plus de **2 rappels ciblés** perdus.
- Pas plus de **2 ouvertures** ou **2 réponses mineures** perdues par mineure sur l'ensemble du parcours ; sur les dix premières séances, pas plus d'**une réponse à 1♣/1♦** perdue.
- Aucune question de niveau 4/5 dans les **cinq premières** séances ; pas plus de **deux** supplémentaires dans les dix premières.
- Pas plus d'une première rubrique dont la première question est notée 4/5 supplémentaire.
- Les cinq premiers tirages doivent être identiques à V2-F. Une hausse des questions de difficulté 3 dans les dix premières séances ou de leur moyenne éditoriale sert seulement de signal d'exploration, jamais de preuve d'un meilleur apprentissage.

**Règle de décision :** une variante est **rejetée** si elle échoue à *un seul* garde-fou sur l'un des neuf scénarios. Si plusieurs variantes passent, elles deviennent seulement des **candidates à relire pédagogiquement**, et **aucune n'est automatiquement activée ni recommandée**.

## 4. Reproductibilité

- Source : `scripts/parcours-v2-comparer-x.cjs`, module `makeEngine('mild'|'early')`.
- Tests de non-régression : `tests/quizz-v2-comparer-x.cjs`.
- CI dédiée : `.github/workflows/qpjb-v2-x-focused.yml` (rapport `artifacts/v2-x/phase-x-matrix.json` et synthèse).
- Les rapports détaillés de W, U et V conservent leurs propres artefacts.
- Aucun QCM, correction, famille, date d'introduction, sauvegarde ou programme public n'est modifié.

## 5. Verdict confirmé par GitHub Actions

**Exécution dédiée : [QPJB V2-X #44492286877](https://github.com/CapGui13/QPJB/actions/runs/44492286877), réussite technique.** Les tests de non-mutation du fichier original, des 1 523 QCM et de la première partie des parcours ont réussi. Les 27 simulations ont été produites ; le compte rendu détaillé et sa synthèse sont conservés dans l'artefact `qpjb-v2-x-audit`.

| Mesure par scénario par rapport à V2-F | X-mild | X-early |
|---|---:|---:|
| Scénarios respectant **tous** les garde-fous (sur 9) | **4** | **0** |
| Scénarios avec niveau éditorial initial plus élevé | 9 | 9 |
| Cinq premières séances identiques | 9 | 9 |
| Variation familles distinctes (sur 450 QCM) | **−10 à 0** | **−10 à +2** |
| Variation rappels ciblés | **−2 à +5** | **−3 à +3** |
| Niveaux 3 supplémentaires pendant les dix premières séances | **+1 à +3** | **+2 à +4** |
| Différence de moyenne éditoriale des dix premières séances | **+0,16 à +0,20** | **+0,24 à +0,28** |
| Différence du nombre de QCM notés 4/5 durant les 30 premières séances | **−2 à +1** | **−1 à +6** |

### Causes des rejets

**X-mild : échec dans 5 scénarios sur 9.** Quatre scénarios perdent plus de deux familles distinctes ; un scénario débute trop de rubriques par une question de difficulté éditoriale 4/5 par rapport à V2-F. Les familles distinctes peuvent descendre jusqu'à **dix de moins**, malgré une hausse légère du niveau moyen initial.

**X-early : échec dans 9 scénarios sur 9.** La progression accélérée augmente trop souvent le nombre de premières questions de rubriques notées 4/5. Plusieurs scénarios perdent plus de deux familles, et un scénario perd plus de deux rappels ciblés. Avoir une difficulté moyenne plus élevée ne signifie pas un apprentissage plus efficace.

**Attention :** les différences sont **appariées par graine/profil** ; les fourchettes ne représentent ni des scores d'élèves ni des intervalles statistiques extrapolables. Les règles de refus avaient été définies **avant** l'analyse des résultats. Le workflow a réussi parce que le comparateur a correctement produit et contrôlé les résultats ; cela **ne valide pas les deux variantes en tant que choix pédagogique**.

### Décision définitive de la phase X

**`X_MILD_REJETEE / X_EARLY_REJETEE / V2_F_REFERENCE / AUCUNE_MUTATION / AUCUN_DEPLOIEMENT`.**

Ne modifier ni le niveau cible V2-F, ni les dates d'introduction des thèmes, ni les rappels. La suite possible est une revue **qualitative** de la transition et des situations d'apprentissage (par exemple les séances où un sujet difficile arrive en premier), sans nouvelle préférence aveugle. Une variante future devrait démontrer ses gains sans ces régressions dans des simulations appariées et, avant publication, être validée pédagogiquement.

**Statut : phase X clôturée, aucun changement de V2-F.**

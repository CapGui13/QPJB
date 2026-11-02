# QPJB — suivi des upgrades (2 novembre 2026)

Référence : `QUIZZ_REFERENCE_SEF.md`. Ne jamais changer une bonne réponse, un ID, le stockage local ou supprimer un exercice sans validation pédagogique.

## État vérifié au début de cette session
- 993 exercices, 413 corrigés `whyNot` (recomptage du JSON embarqué dans `quizz.html`).
- CI précédente : `23e3ab0` réussie ; publication Pages du catalogue `94674c9` réussie.
- Rubriques compétitives repérées (sans certification individuelle) : intervenir 56, contre 41, après intervention 65, répondre à intervention 44, réveil 43. Total 249 exemples dans ces cinq rubriques. Le volume ne prouve pas la qualité des cas.
- Aucun résultat anonyme agrégé de réussite n'a été utilisé pour attribuer les difficultés.

## Lots de cette session
- **Upgrade 9 — soumis, validation en attente** : `19b902d` espace jusqu'à trois positions les variantes d'une même famille, après la sélection aléatoire/adaptative. Conserve toutes les questions retenues, leurs IDs, l'ordre de priorité dans la mesure du possible, les modes et le stockage existant.
- **Tests de l'upgrade 9 — soumis, validation en attente** : `5617d08` ajoute des assertions déterministes : même entrée/même sortie, aucun ID perdu ou dupliqué, séparation des familles lorsqu'une alternative existe.
- **Upgrades 2/3** : 413 contrastes existants conservés ; aucun distracteur modifié sans audit individuel.
- **Upgrade 7** : à traiter par lots audités ; échelle proposée : 1 reconnaissance directe d'une règle, 2 choix entre deux règles usuelles, 3 prise en compte d'une contrainte contextuelle, 4 combinaison de plusieurs inférences, 5 arbitrage entre enchères plausibles avec exceptions. Le nombre de points H et la longueur de séquence ne suffisent pas. Cas ambigus à isoler.
- **Upgrade 8** : priorité au contre d'appel, interventions, réveils, soutiens compétitifs ; audit de la couverture et de la conformité SEF requis avant toute modification.
- **Upgrade 11** : les derniers tests du clavier iPhone sont passés ; les sauts de scroll au repli/feedback restent à mesurer en WebKit et Chromium avant d'affirmer la correction.

## File de reprise
1. Lire le dernier état main/CI/Pages et résoudre toute CI rouge avant de déployer.
2. Tester la séparation des familles sur WebKit/Chromium et les modes progressif, intelligent, révision.
3. Mesurer la stabilité de scroll sur iPhone pendant ouverture, fermeture, validation et retour arrière ; corriger par petit lot avec tests.
4. Auditer individuellement un groupe d'exercices compétitifs et les distracteurs avec preuves SEF ; conserver les cas litigieux pour validation.
5. Étalonner la difficulté pédagogique sur un échantillon de chaque rubrique, sans réécrire mécaniquement les 993 niveaux.

## Notifications
Aucun e-mail de validation envoyé dans cette session : ne notifier qu'après CI **et** Pages confirmés réussis pour le nouveau lot. Ne pas marquer de commit comme notifié avant envoi Gmail effectif.

## Session suivante — navigation mobile (upgrade 11)
- CI précédente vérifiée : smoke `7a6dcf0` réussie, Pages `de92a304` réussie. Le lot d'espacement (upgrade 9) est donc publié.
- Correction soumise : `a3a7039` évite de faire défiler le corrigé jusqu'à 14 % de la hauteur de l'écran ; ne défile plus que si le début du corrigé est sous le bord visible, avec marge de 24 px. Ne change ni les exercices ni les données locales.
- À valider : CI WebKit et Chromium, puis publication Pages ; vérifier sur iPhone le défilement à la validation avec clavier ouvert et fermé, ainsi que les retours arrière. Ce correctif est ciblé et ne garantit pas encore la résolution de tous les sauts de scroll.
- Upgrades 2, 3, 7 et 8 : pas de modification pédagogique sans contrôle SEF individuel.

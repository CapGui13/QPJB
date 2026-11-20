# QPJB V2 — candidat autonome R1 (non publié)

**20 novembre 2026.** Les **19/19** décisions pédagogiques sont approuvées, mais **aucune publication n'est autorisée** (PR #216 Draft/HOLD).

Le script `scripts/v2-candidate-r1.cjs` prend le prototype HOLD figé avec ses 1 523 QCM et crée un deuxième HTML autonome de 65 séances, livré uniquement comme artefact GitHub Actions.

- `SEF-L06-029` conserve `theme=sa` et `answer=4♦` dans la question source. Dans la **vue pédagogique V2 du moteur** uniquement, le thème actif devient `barrage` et le concept suivi devient `barrage:gambling_3sa_passe_corrige` (stade 5 conservé). Sélection et enregistrement des résultats utilisent cette même vue.
- Sauvegarde locale versionnée `qpjb-v2-eleve-65-pedago-r1`, schéma 2, tag `QPJB-V2-65-19A-20261120-R1`. Import/export manuel JSON de la **même version**, avec confirmation avant remplacement. Aucune clé d'aperçu précédente n'est lue, remplacée ou effacée.
- Aucun chargement externe requis, aucun lien local cassé vers le Quiz, `noindex`, aucune édition de `quizz.html` public.

**À faire avant publication :** recette navigateur du candidat R1 (au-delà de la recette du prototype HOLD), politique de migration entre futures versions et GO de mise en ligne explicite.

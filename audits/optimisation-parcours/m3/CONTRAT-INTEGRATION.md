# Contrat d'intégration M3 — #366 / #369

Base immuable : dc5ecced63716672813905472bf32c4505253665.
Module : `quizz-session-plan.js`, UMD `module.exports` / `window.QPJBSessionPlan`.
Schéma : QPJB_SESSION_PLAN_V1. Aucun stockage, aucune mutation, aucune dépendance.

## API pure

```js
const priorities = M3.priorityThemes({
  roadmap: ROADMAP,            // tableau [rubrique, index d'introduction zéro]
  completed: state.completed,  // index zéro de la prochaine séance
  lastTheme: e.lastTheme,       // index zéro de la dernière exposition évaluée
  eligibleThemes: pool.map(q => q.theme)
});
```

Retour : tableau [rubrique, index d'introduction], trié du plus ancien au plus récent ;
stable en cas d'égalité selon ROADMAP. En production fournir obligatoirement
eligibleThemes construit depuis le pool **déjà éligible** après les filtres M1.
Une liste vide ne produit aucune priorité. Le module ne sélectionne aucun QCM.
Une date inconnue ne devient pas une preuve d'exposition.

Sur la base exacte, remplacer uniquement le calcul de `priorities` dans le bloc
`if(s>=2)` de `select`. La substitution textuelle exacte du banc montre
le point de raccordement ; elle échoue si le moteur ne correspond plus.
Le coordinateur doit adapter manuellement à la version M1 finale, jamais
appliquer aveuglément une substitution de source sur une autre version.

## Règles

- Découverte : règle historique d'introduction conservée (priorité à partir de
  intro+2 si aucune exposition et au moins un candidat éligible).
- Fondamentaux : priorité à six indices de distance, règle historique conservée.
- Autres rubriques : priorité à dix indices de distance. Une distance de dix
  signifie neuf séances intermédiaires sans la rubrique. Ce n'est pas une
  garantie si l'éligibilité, le plafond Passe ou le pool interdisent le rappel.
- Garder le reste du bloc historique : options de découverte de stage <=1,
  préférence à une autre famille, motif de sélection, contraintes de famille,
  limites de difficulté, Passes, quotas et ordre. Aucune question hors pool.
- Ne pas appeler M3 sur une séance active, ni sur la consolidation ciblée.
  L'historique et les sauvegardes demeurent sous la responsabilité du moteur.
- Aucune correction de quizz-prerequis.js démontrée nécessaire ; fichier intact.

## M1 / M2

M1 reste propriétaire de l'éligibilité, des preuves de maîtrise,
de la difficulté, du profil, du calendrier et des observations.
M2 reste propriétaire de l'espacement, des erreurs, du choix exact des rappels,
des délais et des preuves de transfert. M3 ne lit ni score de maîtrise ni
date d'échéance par ID ; la priorité de couverture est un signal thématique.

Au raccordement combiné, préserver un budget de rappel explicite M2 et vérifier
que les priorités de couverture ne consomment pas systématiquement toutes
les places. Le banc M3 testé conserve exactement le bloc historique de choix ;
il ne constitue pas un arbitrage définitif entre de nouveaux algorithmes M1/M2.
Rejouer les comparatifs globaux, notamment erreurs en attente, délais médian/p90,
difficulté des faibles, diversité et import d'un ancien journal.
Si une régression conjointe importante apparaît, garder le sélecteur de référence
ou arbitrer les priorités, sans contourner les prérequis.

Le coordinateur seul ajoute le chargement UMD avant le moteur, le build et le
cache/offline et lance les suites Node, Chromium/WebKit, CI et publication attestée.
Pas de modification de ces fichiers ni de publication par M3.

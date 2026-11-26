# Passe 4 — Optimisation bornée S1–20 (26 novembre 2026)

Candidat code : 6bd6a8b66f97abbc9429988259eefb8d8f42fbea. Base : 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8.

## Exécution réelle complémentaire

Les 18 paires S1–20 ont été exécutées dans V8 à partir des blobs Git du moteur figé, catalogue, métadonnées et trois modules pédagogiques. Le module durable (activé seulement lorsque completed>=20, donc S21) a été remplacé par un Proxy qui lève une exception à tout accès; aucune exception n'a eu lieu. Il ne s'agit pas d'une recette S180 ni de la recette native Node/browser du dernier SHA. Le moteur de sélection et les réponses sont ceux du banc M2, sans réécriture du moteur.

Comparatif ac33ebf avant nouvelle recherche : 346/360 ordres différents; 0 sets changés; 6 hausses ponctuelles (faible/11 S5 contraste, S9 et S15 prérequis; faible/47 S20 prérequis; cible/11 S18 saut; aide/47 S17 prérequis); 36 checkpoints sans régression cumulée.

Nouvelle recherche : largeur 8, profondeur 3, mouvements swap et relocation, uniquement pour S1–20 et deck 10 avec coût résiduel. Tous les coûts HARD/SOFT restent non croissants par rapport à l'ordre historique du deck courant. Les permutations intermédiaires ne sont jamais présentées. Tri déterministe par violations, coût et IDs. Pas de règle propre à un ID ou un profil, aucun seuil assoupli. P95 M2 71 ms, maximum 119 ms sur les 360 decks candidats, dans V8 (pas un benchmark mobile).

| Horizon | Paires | Ordres différents | Gains locaux | Sets changés | Hausses ponctuelles |
|---|---:|---:|---:|---:|---:|
| S5 | 90 | 86 | 85 | 0 | 0 |
| S20 | 360 | 347 | 309 | 0 | 0 |

| Indicateur | S5 avant | S5 après | S20 avant | S20 après |
|---|---:|---:|---:|---:|
| Prérequis inversés | 96 | 1 | 428 | 3 |
| Stades inversés | 8 | 0 | 18 | 0 |
| Difficulté inversée | 7 | 0 | 9 | 0 |
| Sauts >=2 | 1 | 0 | 135 | 4 |
| Contrastes manqués | 244 | 102 | 257 | 102 |
| ABAB réponse | 0 | 0 | 1 | 0 |
| ABAB thème | 0 | 0 | 0 | 0 |
| Même force non discriminante | 0 | 0 | 5 | 4 |

18/18 trajectoires sans aucune hausse ponctuelle de métrique protégée jusqu'à S20; tous les 36 checkpoints sans régression cumulée. Distributions/forces brutes identiques plus fréquentes du fait de contrastes réels; ne pas assimiler à des miroirs. Les 3 inversions de prérequis et 4 sauts résiduels ne sont pas de nouvelles régressions.

## Registre condensé V8 S1–20 (ordre différent / gains locaux)

autonome/11,47,103 : 16/16 chacun ; modere/11 : 20/14, /47 : 20/17, /103 : 20/13 ; faible/11 : 20/19, /47 : 20/16, /103 : 20/19 ; cible/11 : 20/19, /47 : 20/16, /103 : 19/15 ; aide/11 : 20/19, /47 : 20/18, /103 : 20/19 ; passe/11,47,103 : 20/19 chacun. Tous : 0 changement de set, 0 hausse ponctuelle, 0 alerte cumulée S5/S20. Les traces exhaustives définitives doivent provenir de la nouvelle recette native.

## Recette native

La recette précédente (correctif ac33ebf) run 45903425019 a démarré après attente de runners. Elle ne valide pas le nouveau SHA. La recette spécifique au SHA 6bd6a8b est demandée via PR technique #437. Le HOLD d'intégration concernant record()/skills reste ouvert (voir REPRISE.md). Les six cas précédents ont été corrigés mais les hausses ponctuelles au-delà de S20 doivent encore être recensées sur la dernière version.

Aucun merge, aucun changement de production existant. MISSION DÉFINITIVEMENT TERMINÉE : NON tant que la recette complète et les limites d'intégration ne sont pas attestées.

# CI proportionnée V2

Base 546617b3a5f8a6c3cde184718dbe7abd0ab107e7. Branche indépendante du parcours guidé #293. Aucun changement du moteur, des données, du builder public, du verrou de publication, des tests historiques de progression ou de la preuve d'archive M3.

- QUICK : PBN SDE à nom canonique, changements du config.json existant limités aux descriptions et aux liens Bridge Training. Le validateur indépendant vérifie le schéma, les doublons, les liens orphelins, les PBN et le catalogue régénéré.
- UI : édition des deux blocs style et du titre de l'accueil seulement ; comparaison du reste de l'HTML à l'identique. Contrôle indépendant dans QUICK, navigateurs Chromium/WebKit et visibilité de toutes les cartes. Toute modification JS/structure/routage reste FULL.
- Le garde V1/V2 n'impose plus un hash fixe sur l'accueil ; l'archive V2 conserve son hash exact, les protections de navigation restent et sont renforcées. Les modifications de garde/classificateur/workflows restent FULL.
- Les fichiers générés ne doivent pas être édités manuellement : le builder les génère. Le traitement des commits bot attestés et le verrou de publication restent inchangés. Pas de réutilisation d'un résultat PR comme preuve du SHA main.
- Une seule preuve isolée, sans publication. Aucun merge main pendant la coordination avec #293. Mesures à relever dans les Actions réelles avant de déclarer les gains acquis.

## Consolidation
La recette transversale V2, supplémentaire à Training smoke, utilise désormais les deux diffs PR (merge-base vers head et base vers merge) pour exécuter la batterie longue uniquement en FULL ; appel manuel et preuve absente restent FULL. Aucun changement du verdict principal ni du verrou Pages. Les deux jobs historiques gardent leurs commandes.

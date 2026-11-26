# M1 — cohérence pédagogique de l'initiation S1–20

Base immuable `2c6edd95c09a4e8073813f01bc976c31ed4649aa`, moteur `ab2fc0c14e7c13f6459266ae3e41f7d3a07488f3`, catalogue HTML `436efea9efcbe9f2815ab9968a3bab06a26a6fc5`, prérequis `d1d8ad465461df20eb26eb2e5a10746ad6b7b48a`. Contrats #377/#378, historique #293, #366–369, #365, #375, #376. 1879 QCM, 22 rubriques. Catalogue et moteur inchangés.

## Cartographie initiale / objectifs
- S1 uniquement ouvertures niveau 1, 3 Passe, 2 de chaque mineure, majeure 5e et 1SA. Les égalités 3–3 et 4–4 disponibles sont niveau 2, donc aucun bonus ne peut ni ne doit les faire entrer en S1. S2 consolide les deux mineures avant les réponses simples, dont réponses majeures à quatre cartes et soutiens majeurs à trois cartes.
- Égalités: SEF-012-1 (3–3, une seule famille), SEF-N007-1, SEF-N008-2, SEF-N008-1, V2-M1-011 (4–4, trois familles). Réservoir à compléter dans un chantier éditorial ultérieur : plusieurs familles de 3–3, cas niveau 1 compatibles S1 si souhaité, pas de création ici. La simple répétition d'ID 3–3 ne constitue pas du transfert.
- Premières expositions de la base (18 trajectoires) : 2SA ouverture S3, réponse seuil 1SA S4, redemande simple S5, Stayman/Texas S5–6, deuxième enchère S7, intervention S11. Pas de motif de retarder systématiquement ces notions. Un élève faible continue à découvrir les cas élémentaires sans prétendre les maîtriser.
- 40 écarts entre expositions successives de neuf concepts fondamentaux dépassent 6 séances avant S20, somme des maxima par concept/trajectoire 995 (inclut trou terminal). Cibles : réduction d'au moins 10%, pas de perte de familles >5% par trajectoire, 100% S2 égalités si réservoir, zéro violation d'éligibilité, séances pleines/distinctes, frontière S21 neutre.
- M4 : les deux soutiens majeurs miroirs demeurent voisins en S2 ; #376 traite spécifiquement cela. Aucun changement de logicalOrder ni décisionPattern ici.

## Production
`quizz-pedagogie-initiation.js`, UMD `QPJBPedagogieInitiation` / Node. `rank(context)` retourne bonus/malus bornés, aucun nouvel ID, aucun état écrit. S1 neutre. S2 : bonus +100 pour l'égalité lors du choix contraint des deux ouvertures mineures. S3–20 : après quatre séances depuis la dernière exposition à un fondamental, bonus progressif plafonné à 90, une fois par concept dans la séance, réduit aux familles déjà vues. Ne fabrique aucune maîtrise ; ne modifie pas les révisions dues, la catégorie faiblesse ni les quotas. Journal de parcours réel seulement; absence de journal => pas d'inférence artificielle. S21+ : [].

Point d'injection : dans choose(), après les filtres available/distinct/unseen/balanced, juste avant le tri ranked. Utiliser state.completed+1, candidates, prerequis.byId, state, selected, category ; ajouter delta à score(q,category). Ne pas appliquer aux rappels explicites ni aux priorités thématiques forcées, exception ciblée pour les ouvertures imposées S2 (forcedReason=equilibre_ouvertures). L'adaptateur du banc remplace uniquement cette ligne en mémoire et échoue si l'ancre change. Coordinateur seul câble le runtime. Les règles Passe, S1–S3, difficulté, éligibilité et séance active restent dans le moteur.

Proposition de métadonnée séparée dans prerequis-proposals.json ; ne pas appliquer sans arbitrage et recette globale. Le catalogue actuel compte SEF-020-3 comme soutien mineur alors que c'est une réponse 1SA ; cela peut créditer une exposition au soutien avant d'en avoir appris un. Aucun changement de données dans la simulation.

## Recette
6 profils (autonome, intermédiaire 33% erreurs, faible 75%, faiblesse SA 80% contre 12%, aide 60%, faiblesse Passe 90% contre 10%), graines 11/47/103, décisions déterministes par hash ID/séance/graine, deux versions, départ S1, horizon S21. Les graines n'affectent pas l'autonome, donc ses trois trajectoires identiques ne sont pas trois observations indépendantes. Données simulées, jamais données élève. 36 trajectoires, 756 séances / 7560 présentations. Les résultats par profil et graine, concepts, familles, premières expositions, délai avant deuxième famille, difficulté, Passe, decks de frontière et temps bruts sont dans results-s21.json.

| Indicateur cumulé S20 | Base | M1 |
|---|---:|---:|
| Trajectoires avec 3–3 ET 4–4 S2 | 0/18 | 18/18 |
| Somme des maxima d'intervalle (9 concepts, 18 trajectoires) | 995 | 851 |
| Intervalles observés >6 séances | 40 | 8 |
| Familles distinctes (somme par trajectoire) | 3212 | 3214 |
| Rubriques distinctes (somme) | 252 | 252 |
| Concepts distincts (somme) | 849 | 850 |
| Difficulté >=4 | 2 | 2 |
| Violations d'éligibilité / séances courtes / doublons | 0/0/0 | 0/0/0 |

Ratio minimal de familles à S20 et S21 = 1. S21 : 48→8 écarts >6, 3371→3373 familles, 907→907 concepts, zéro violation/doublon/séance courte. Premières expositions des sept notions ci-dessus inchangées. Reprise d'une séance active : même liste d'IDs, index 1 et réponse enregistrée conservés après sérialisation/rechargement. Petit catalogue de 4 QCM : 4 IDs distincts, pas de crash. Neutralité S21 vérifiée. Le premier candidat bonus S1 a été écarté car le filtre niveau 1 rendait la règle inopérante, sans relâcher ce filtre.

Commandes de reproduction dans un checkout :
```sh
node tests/coherence-progression-m1-unit.cjs
node audits/coherence-progression-20261126/m1/benchmark.cjs 21 > /tmp/m1-s21.json
node audits/coherence-progression-20261126/m1/benchmark.cjs 65 > /tmp/m1-s65.json
```
Exécution effectivement réalisée : moteur et modules chargés par new Function en V8 sur blobs exacts, banc 21 et assertions unitaires avec adaptateurs require/assert en mémoire. Reprise et petit catalogue exécutés aussi. Pas d'exécution Node native ni navigateur, pas de CI attestée. Une tentative de prolongement S65 dans le même environnement a atteint la limite de durée ; pas de chiffres S65 ou S153 revendiqués. Le périmètre M1 est S1–20 et frontière S21 ; prolongement et interaction M2/M3/M4 à vérifier par coordinateur. Le banc permet ces horizons. La recette ne prouve pas l'apprentissage humain ; retours réels ultérieurs indispensables.

Aucun merge, aucun déploiement.

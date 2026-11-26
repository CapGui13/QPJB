# M3 — cohérence pédagogique avancée (S66–153 et au-delà)

Contrats [#377](https://github.com/CapGui13/QPJB/issues/377) et [#380](https://github.com/CapGui13/QPJB/issues/380). Base immuable `2c6edd95c09a4e8073813f01bc976c31ed4649aa`. Pas de modification du moteur, du catalogue, des accords SEF/QPJB, de la maîtrise, de l'espacement, de l'ordre M4, du stockage ou de la CI.

## Cartographie et décision
Références : #293, #366–369, #365, #375, #376 ; contexte historique #255/#256 et audits éditoriaux #342/#349/#356 (ne pas les reproduire ni rouvrir les accords). Blobs exacts et réservoir par concept dans `cartographie.json`.
- 1 879 QCM, 22 thèmes, 99 concepts. Les 15 trajectoires de référence atteignent 99 concepts à S65 : cela mesure une exposition, pas une maîtrise. Une référence autonome expose 650 familles à S65 mais n'entretient ensuite que 86 concepts à S153 et 95 à S180 ; mineur.soutien, sa1.stayman.reponse, chelem.blackwood.dame_rois et chelem.splinter.variante ne reviennent pas sur S66–180.
- Les rubriques cachent des trous conceptuels (par exemple les rappels de chelem ne garantissent pas la discrimination quantitatif / contrôles / clés / suite Blackwood). Les priorités de thèmes ne suffisent pas : dans le moteur, le filtre en faveur des familles nouvelles s'applique avant score, et le bonus d'âge du concept plafonne tôt.
- Objectifs de la cartographie initiale : plus de concepts effectivement retravaillés, de preuves autonomes sur familles et séances distinctes, de cas contrastés, moins de notions durablement absentes ; familles >=95% de référence par paire/horizon ; zéro sélection inéligible, Passe ou famille en doublon lorsque possible. Cible opérationnelle de clôture : dette d'entretien diminuée sur la majorité des trajectoires, amélioration de couverture à S153 et au-delà, sans faire d'une date une certification de compétence.

## Politique livrée
`quizz-pedagogie-avancee.js` UMD exporte `{schema:'QPJB_PEDAGOGIE_V1',phase:'avancee',rank(context)}` (Node et window.QPJBPedagogieAvancee). Aucun effet avant S66 ; valable après S153. Candidats transmis déjà éligibles, retours d'IDs uniques et deltas entiers dans [-100,100]. Pas de mutation ni stockage.
- Signal d'entretien conceptuel progressif après un trou, plafonné ; bonus supplémentaire si peu de familles exposées et, lorsque pertinent, nouvelle famille pour transfert.
- Journal ordinaire exclusivement pour les preuves autonomes (juste, sans aide ni erreur libre). Ancienne entrée explicitement évaluée = exposition, jamais preuve autonome inventée. Consolidation ignorée pour les preuves.
- Malus modéré sur les cas complexes dont une dépendance n'a pas de réussite autonome observée, sans veto : le moteur reste seul responsable de l'éligibilité et du niveau.
- Contrastes explicitement définis (chelem quantitatif/contrôles/clés, Rubensohl naturel/conventionnel, choix d'intervention, réveil, forcing, essais et Splinter) ; pénalité de concentration sur un même concept. Un contraste est une occasion de discrimination, pas une preuve d'apprentissage et ne dicte pas la bonne enchère.

### Raccordement réservé au coordinateur
Le banc injecte uniquement un bonus après `available`, `distinct`, familles nouvelles, équilibre et autres filtres dans `choose(list,category,forcedReason,priority)`, juste avant le tri `const ranked=candidates.map(q=>({q,v:score(q,category)}));`. Appel exact :
```js
const pedagogical = s>=65 && !explicitRecall
  ? new Map(pedagogy.rank({
      session:s+1, candidates, metadataById:prerequis.byId,
      history:state, selected, category:category||null
    }).map(x=>[x.id,x.delta]))
  : new Map();
const ranked=candidates.map(q=>({q,v:score(q,category)+(pedagogical.get(q.id)||0)}));
```
Le coordinateur peut fournir les métadonnées effectives plutôt que la table brute ; le visa de sept soutiens simples S2 (stage 0/1) n'affecte pas les conditions de ce module. `selected` accepte les objets exercice ou les wrappers {exercise,...}. history = état réel ou journal. Ne pas injecter dans l'ordre M4, consolidation, ou `record`. Ne pas reclasser une séance déjà commencée. `explicitRecall` exclu pour préserver les rappels prioritaires ; la priorité de rubrique reste inchangée. Charger le module dans le navigateur/build/cache au moment du câblage commun, jamais par cette branche.

## Recette
15 paires 5 profils × 3 graines 11/47/103, jusqu'à S180 ; prefixe S1–65 partagé (module et adaptateur inactifs). 54 000 réponses logiques, 44 250 réponses effectivement exécutées avec préfixe partagé. Réponse déterministe par profil/id/séance/graine, simulations non humaines. Les trois graines du profil autonome ont été exécutées et sont identiques par construction. 3 paires supplémentaires faiblesse Passe, plus reproduction détaillée intermédiaire 47 (19 exécutions de paires, 18 scénarios distincts).
Les 15 JSON principaux et `synthese.json` donnent les relevés S20/S65/S153/S180. `*-detail.json` donne en complément motifs, niveaux par concept, intervalles, miroirs (définition inspirée #376), adjacences et triples pour quatre paires. `frontieres-et-cout.json` : tests et temps V8 sur états identiques.

| Moyenne 15 paires | S153 base → candidat | S180 base → candidat |
|---|---:|---:|
| Concepts retravaillés depuis S66 | 87,67 → 91,40 | 91,67 → 98,27 |
| Concepts contenant des cas stage 2/3 retravaillés | 66,07 → 68,80 | 69,07 → 74,60 |
| Concepts avancés sur >=2 familles | 60,00 → 61,13 | 64,07 → 68,00 |
| Concepts avancés avec réussite autonome >=2 familles et >=2 séances | 50,47 → 51,33 | 56,40 → 59,67 |
| Séances de contrastes | 25,87 → 34,93 | 31,80 → 43,87 |
| Dette d'entretien (concept-séances déjà exposées avec âge >20) | 3615,67 → 3152,67 | 4750,00 → 3926,33 |
| Dette fondamentale | 406,67 → 371,80 | 513,27 → 445,80 |
| Concepts dont dernier rappel >30 séances | 38,93 → 33,00 | 31,40 → 12,40 |
| Concepts dont dernier rappel >60 séances | 21,67 → 18,73 | 21,73 → 8,33 |
| Familles cumulées | 1307,27 → 1317,40 | 1374,80 → 1389,93 |
| N4/5 présentés S66+ | 224,53 → 235,93 | 305,40 → 316,40 |

Dette d'entretien : baisse 15/15 aux deux horizons. Couverture à S180 : hausse 15/15 ; minimum familles 99,78% S153 et 97,83% S180, seuil 95% dépassé partout. À S153, une trajectoire perd 2 concepts (cible/103). Aucune violation de `evaluate()` (assertion directe sur chaque sélection avant/après), plafond Passe contrôlé, 10 IDs par séance et aucun doublon de famille S66+. La recette confirme les 22 rubriques S66+ pour les 15 paires. Frontières S1/S20/S21/S65 identiques sur historique intermédiaire 47 ; S66 reprise exacte après une première réponse. 
Le coût sur V8, cinq tirages alternés sur même état : médianes S66 100→109 ms et S153 116→148 ms ; pas une mesure navigateur ni un SLA.
Les trois profils Passe supplémentaires conservent 3/1/1 Passes d'ouverture S1–3, aucun dépassement ; S180 concepts 94→96, 90→96, 93→98, preuves 62→66, 63→68, 65→65. Dans les quatre paires détaillées, zéro adjacency miroir/bonne enchère identique dans les deux versions, écart maximal entre thèmes 10 séances ; les triples et motifs varient et ne sont pas rendus artificiellement meilleurs. Les motifs de rappel d'erreur peuvent varier entre trajectoires divergentes, mais aucun changement du classement du rappel prioritaire sur un même état.

## Limites, arbitrages et transmissions
- La mesure de preuve est descriptive, pas un nouveau calcul de maîtrise ni un apprentissage humain. À S153, quatre paires perdent des concepts avec preuve autonome (faible/47 -5, cible/47 -1, cible/103 -2, aide/103 -5). À S180 une paire baisse (cible/103 -1). L'aide/11 voit N4/5 124→171 à S153, et sa dette fondamentale 329→401. Le profil faible a en moyenne moins de preuves à S153 (40,33→39,67), mais davantage à S180 (44→48). Signaler au coordinateur pour recette intégrée : ne pas valider le gain sur un score agrégé seul.
- Le nombre d'intervalles terminés >20 augmente (91,2→107,73 à S153 ; 122,27→162,8 à S180), car davantage de notions anciennes reviennent enfin ; la dette temps/concept et les absences de fin baissent. Des max de 127–156 séances subsistent dans la recette complémentaire, certains augmentent. Le moteur privilégie durement familles nouvelles, et les rappels prioritaires/quotas limitent le classement souple. Ne pas convertir ces absences en veto ni réécrire espacement. Transmettre au coordinateur et à la politique de révision si une autre famille n'est plus disponible.
- Réservoir étroit : 15 concepts avec <=5 familles, par ex. `multilandy.choix` (4 ; SEF-V45-030, SEF-C2-003), `michaels.choix` (5 ; SEF-V45-049, SEF-C2-008), `sa1.texas.contre` (4 ; SEF-L25-004/005/006), `sa2.texas_mineur.reponse` (4 ; SEF-L41-004), `ouv.bicolore.exception` (3 ; SEF-L28-001). Ce n'est pas une anomalie d'éligibilité ; proposer de nouvelles familles ultérieurement hors cycle seulement.
- Meilleure mineure : ouverture naturelle de mineure égale en longueur dans seulement 5 IDs / 4 familles ; 3–3 : SEF-012-1 (1♣), 4–4 : SEF-N007-1, SEF-N008-1/2, V2-M1-011 (1♦). Signal réservoir au M1, pas de correction ni ajout dans M3. Un rappel thématique ouverture ne garantit pas la discrimination de la meilleure mineure. Les difficultés manifestées avant S66 relèvent des autres missions.
- Aucun patch de prérequis individuel proposé : le diagnostic prouve des trous de sélection et réservoir, pas une erreur de métadonnée précise. Aucune modification de QCM, règle ou accord.
- Les détails miroirs/motifs/niveaux locaux ont été mesurés sur quatre paires supplémentaires, pas sur les quinze archives principales ; le banc actuel les produit à la prochaine exécution complète. Tests exécutés en V8 avec blobs exacts GitHub et adaptateurs CommonJS/ assertions en mémoire ; checkout réseau impossible (DNS), Node CLI sur dépôt, CI FULL et navigateur non attestés. CI et recette globale réservées au coordinateur.

## Reproduction
Sur checkout de la branche, commandes fournies :
```sh
node tests/coherence-progression-m3-rank.cjs
node tests/coherence-progression-m3-bench.cjs
node tests/coherence-progression-m3-bench.cjs passe 11 180
node tests/coherence-progression-m3-bench.cjs passe 47 180
node tests/coherence-progression-m3-bench.cjs passe 103 180
node tests/coherence-progression-m3-boundary.cjs
```
Exécution effectivement réalisée : chargement des blobs via GitHub fetch_file/fetch_blob, `new Function` sur module CommonJS avec adaptateurs de require, bench.build(), bench.runPair() pour chaque paire, test rank avec assert V8 et boundary.verify(). Aucun succès Node/CI non exécuté revendiqué.

Verdict : candidat utile et livré pour intégration coordonnée, pas de fusion/publication individuelle ; les limites ci-dessus sont à surveiller. **MISSION DÉFINITIVEMENT TERMINÉE : OUI (périmètre M3).**

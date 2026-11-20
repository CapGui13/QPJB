# QPJB V1 — Pré-revue des 65 exercices Stayman/Texas
**20 novembre 2026 — issue #226.** Statut : *cohérence structurelle vérifiée ; validation pédagogique de chaque micro-compétence encore à faire*.

## Sources exactes et conservation
- Quiz SEF public de référence : `quizz.html` (1 523 QCM, blob Git `8e8100fdad9e52c160b11670098dd08050214374`).
- Propositions originales SA/Stayman/Texas et historique V2 : `preview/v2-eleve/parcours-sef-65-r1.html` (blob Git `12095819f58980163b4d79d31e7b7f3c1575ea9b`).
- Registre croisé V1 : `audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json`, fusionné dans PR #227.
- Registre de cette pré-revue : `audits/QPJB_V1_STAYMAN_TEXAS_65_REVUE_20261120.json` ; un enregistrement par QCM, avec la notion proposée, le corrigé V1, l'historique des décisions et les observations.
- Convention externe : [présentation des changements du SEF 2024, Comité de l'Adour](https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870), feuille de convention : Stayman à quatre réponses après 1SA et 2SA, Texas sur 2SA avec rectification fittée. Le [cours iBridge sur le Texas contré](https://dev.ibridge-club.fr/public/fichedetails/622) confirme les trois cas Passe / Surcontre / rectification testés après un contre d'entame. Ces références confirment des principes généraux, **pas l'homologation de chacune des 65 donnes**.

## Contrôles effectués
- **65/65** mains composées de 13 cartes, forme annoncée égale aux longueurs visibles, points H recalculés justes (A=4, R=3, D=2, V=1).
- **65/65** réponses sources présentes une seule fois dans les choix et aucune réponse dupliquée parmi les choix.
- **65/65** IDs et regroupements candidats présents et cohérents avec le registre croisé ; **25** groupes de compétences, dont **6 à exercice unique**.
- **16 décisions** de l'utilisatrice correspondent à ces 65 IDs : **14 décisions de conserver le corrigé** et **2 validations du double transfert réservées à un énoncé V2 différent**. Aucune de ces décisions n'autorise une nouvelle modification de réponse V1.
- **0 classification homologuée par cette seule recette automatisée**. Une cohérence interne n'est pas une preuve d'exactitude de convention ou de maîtrise chez l'élève.

## Points particuliers à conserver dans la revue SEF

### Différences V1 / V2
`SEF-V416-008` et `SEF-V416-009` :
- Dans la **V1**, l'énoncé demande la deuxième enchère après Stayman et les choix conduisent à **4♥ / 4♠**, conclusion directe à la manche.
- Dans la **V2**, l'énoncé demande explicitement de *faire jouer la manche par l'ouvreur de 1SA* et les choix proposent **4♣ / 4♦**, doubles transferts approuvés.
- Ne pas copier 4♣ / 4♦ comme corrigé des questions V1 sans modifier l'énoncé complet et les choix. Ne pas fusionner les preuves de compétence issues de questions différentes.
- Dans l'énoncé V1, l'expression « il a répondu SA » est imprécise ; la séquence visible indique bien **2SA**.

### Qualité rédactionnelle, sans correction de contenu
- **10 consignes trop générales** : `SEF-V3-005-1`, `007-4`, `009-1`, `006-3`, `008-2`, `010-2`, `022-1`, `024-1`, `025-1`, `026-1`. La séquence affichée apporte déjà le contexte ; la consigne devrait cependant rappeler plus explicitement l'objectif de décision. Ces cas ne sont pas déclarés faux.
- **2 motifs de difficulté mal nommés** : `SEF-V44-027` et `SEF-V44-030` parlent d'une « réponse au Stayman » alors qu'il s'agit d'un Texas majeur. Il s'agit de métadonnées explicatives, non du corrigé.
- **6 groupes à un seul exercice** : `SEF-L07-028`, `SEF-L18-006`, `SEF-L18-007`, `SEF-L18-008`, `SEF-L37-005`, `SEF-L39-002`. Ces QCM peuvent être pédagogiquement utiles mais ne doivent pas, isolément, permettre de certifier une notion « maîtrisée ».

### Conventions à contre-expertiser individuellement
- **Stayman contré** : `SEF-L25-001/002/003`, réponses Passe / Surcontre / 2♥, déjà confirmées sans changement de corrigé.
- **Texas contré** : `SEF-L25-004/005/006`, Passe / Surcontre / 2♥, compatibles avec la convention documentée : absence de fit, fit sans arrêt, fit avec arrêt respectivement.
- **Texas mineurs** : `SEF-V482-003/004` (partielle après rectification), `SEF-V482-005…010` (courte majeure à 3♥/3♠ ou courte dans l'autre mineure décrite conventionnellement par 3SA). Ne pas interpréter mécaniquement ce dernier 3SA comme une conclusion naturelle, ni importer ces règles hors de leur séquence.
- **Stayman quatre réponses** : les exemples de l'ouvreur sur 1SA et 2SA sont distincts. Ne pas mélanger niveaux de réponse et seuils de force.
- **Texas majeur sur 2SA** : la rectification fittée doit être comprise conjointement avec le cas **3SA sans fit** présent dans les 14 candidats SA, et non comme une correction automatique après 1SA.

## Prochaines décisions (non appliquées dans cette PR)
1. Expertise SEF des 65 situations, y compris réponses alternatives conventionnelles, rôle du déclarant et cas de fit.
2. Révision des **10 consignes générales** et **2 motifs Texas/Stayman** dans une PR éditoriale séparée, avec test de non-régression sur le Quiz classique et validation préalable.
3. Séparation des objectifs **manche directe** / **double transfert** pour les deux V416, et des compétences fondées sur un seul cas.
4. Utilisation éventuelle des classifications seulement après cette validation, sur **le moteur V1 unique**, avec simulation des progressions. Aucun seuil bloquant ou migration des sauvegardes.
5. Reprendre la file des 541 QCM en priorisant *après-fit, barrages, chelems et forcing*.

**Cette PR ne change ni `quizz.html`, ni `quizz-parcours.js`, ni `index.html`, ni les sauvegardes, ni le statut des QCM dans la V1 publiée.**

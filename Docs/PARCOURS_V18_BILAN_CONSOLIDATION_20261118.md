# QPJB — parcours V1.8 : bilan factuel des consolidations

## Situation de départ
V1.7 propose des consolidations ciblées de 4 à 10 QCM originaux lorsque des difficultés sont effectivement observées. Le moteur enregistrait déjà les réponses et le suivi des compétences, mais **l'élève ne voyait aucun bilan spécifique par objectif à l'issue de l'entraînement**.

## Ajout V1.8

La consolidation sauvegarde l'association **ID de question → objectif ciblé**, exclusivement dans la séance active, puis construit un **bilan borné à la dernière consolidation achevée**. Le bilan contient :

- Nombre total de QCM réellement traités.
- Réussites **sans aide et sans erreur initiale en saisie libre**.
- Réponses correctes après aide ou correction (catégorie séparée).
- Réponses erronées et questions passées.
- Pour les nouvelles consolidations, ventilations par cible effective, en utilisant seulement les libellés des micro-compétences et axes audités déjà présents dans le catalogue.

### Affichage
- Après la dernière question, **Bilan ciblé** présente les décomptes, les objectifs travaillés et une note de prudence.
- Sur l'accueil du parcours, **Dernière consolidation** reste consultable après rechargement du navigateur.
- Le nombre de questions varie toujours de 4 à 10 comme en V1.7.

**Interprétation volontairement limitée :** il s'agit de résultats observés sur cette séance, pas d'une estimation de maîtrise acquise, d'un pourcentage d'apprentissage ou d'une comparaison avant/après. Les acquis confirmés et les seuils de progression existants restent inchangés.

## Persistences et reprises
- Même clé de stockage local : `qpjb-sef-parcours-01` et même `version=1`.
- Les sessions ciblées V1.8 enregistrent facultativement `active.targets`, alignés avec les IDs. Ce champ est vérifié à la lecture : seules les cibles connues de `MICRO_LABELS` et `AXIS_LABELS` sont acceptées.
- À la fin, `lastConsolidation={atSession,counts,parts}` remplace seulement le bilan précédent. Les décomptes sauvegardés sont vérifiés (valeurs entières bornées, somme exacte et ventilation cohérente).
- Une consolidation V1.7 interrompue, qui ne possède pas de métadonnées de cible, est reprise **sans migration spéculative** ; à son achèvement, un bilan global est disponible mais aucune ventilation n'est inventée.
- Aucune donnée de réponse ne quitte le navigateur ; aucun appel réseau, aucune IA.

## Invariants
- **1 523 QCM SEF, réponses, justifications et corrections intacts.**
- La consolidation n'avance pas le compteur des séances normales, ne débloque pas de rubrique et ne valide pas à elle seule une compétence.
- Le tableau de progression et les axes V1.5/V1.4 conservent leurs règles.
- Les séances classiques de 10 QCM et les Quiz libres restent identiques.

## Tests
- Node : bilan mono-cible, bi-cibles, catégories de réponses, exactitude des sommes, absence de preuves artificielles, reprise, contrôle des sauvegardes malformées, rétrocompatibilité V1.7.
- Chromium et WebKit : bilan sur l'écran final et sur l'accueil, visibilité après rechargement, comptage des questions passées, maintien du verrou de consolidation au même palier.
- Cache PWA `qpjb-v92`, module `quizz-parcours.js?v=10`.
- Fusion et publication **après validation CI complète uniquement**.

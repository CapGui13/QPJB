# QPJB V2 — Phase BE : revue ciblée finale et sauvegarde AZ sécurisée

**19 novembre 2026 · PR #214, branche de développement uniquement.**

## Bilan éditorial consolidé

Les 19 alertes source ont été rapprochées de leurs mains exactes, enchères, choix et corrigés, puis de références extérieures. **Le statut « valide dans un accord documenté » est une proposition de conformité conventionnelle, pas une approbation de l'enseignante ni une certification exhaustive SEF 2024.**

| Catégorie proposée | Nombre | Cas concernés |
| --- | ---: | --- |
| Réponse corroborée par un accord ou une référence précise | **15** | 2 P1 + 13 P2 |
| Harmonisation pédagogique nécessaire | **2** | `SEF-V416-008`, `SEF-V416-009` (conclusion directe vs double transfert) |
| Formulation à préciser | **1** | `SEF-L25-007` (16 H, ♣R103, « maximum ») |
| Reclassement thématique uniquement | **1** | `SEF-L06-029` (3SA gambling) |

### `SEF-L18-008` : la séquence est désormais documentée

Main d'origine 17 H avec quatre Piques ; séquence `1SA–2♣–2SA–?` ; réponse **3♠**. La **fiche 01, dossier 01, page 19** de l'extrait de *Enchères au bridge — La pratique* (Le Bridgeur) donne, dans la séquence exacte après réponse 2SA au Stayman, **3♥/3♠ naturels, forcing, ambition de chelem** ; elle précise qu'il s'agit du changement SEF 2018. Le support BridgeSEF `Les choix après l'ouverture de 1SA` confirme aussi cette lecture.

Cette règle n'est pas celle du 3♠ artificiel après `1SA–2♣–2♥` : **la réponse précise de l'ouvreur change le sens**. Certains systèmes de paire sur `1SA–2♣–2SA` dérogent à cette structure, ce qui ne doit pas invalider automatiquement le QCM dans l'accord ici choisi.

Références :
- https://www.lebridgeur.com/img/cms/Ench%C3%A8res%20au%20bridge-La%20pratique-Extrait.pdf
- https://bridgesef.fr/wp-content/uploads/2025/04/Ouverture-1SA.pdf

### `SEF-L25-007` : réponse documentée, libellé de force ambigu

Main d'origine **16 H**, ♣R103 après `1SA–2♠ (Texas Trèfle)`. La correction source **2SA** est compatible avec la modulation positive en présence d'un **As ou Roi troisième à Trèfle** :
- https://bridgesaintcloud.fr/quesaquo49.html (écrit explicitement « au moins l'As troisième ou le Roi troisième »).
- https://bridgesarzeau.club.ffbridge.fr/actualites-du-club/texas-mineur-sur-1sa-1123738 (exemple du gros honneur troisième).

Le problème restant est **éditorial** : dire « généralement avec une main maximum » peut laisser croire qu'il faut toujours 17 H ; mieux vaut demander une rectification indiquant le gros honneur troisième, sans imposer un seuil H non documenté. **Aucune modification du corrigé ni du libellé en production** n'est effectuée ici.

### `SEF-V416-008/-009` : cohérence SEF

Sur la réponse 2SA au Stayman, les deux QCM V416 ne proposent pas les réponses **4♣→4♥** ou **4♦→4♠**, même si elles figurent dans la structure SEF plus complète et sont enseignées par `SEF-L18-007`. La réponse directe 4♥/4♠ n'est pas absurde pour la conclusion, mais la consigne « dans le SEF » sans possibilité de transfert entraîne un désaccord pédagogique si les exercices sont vus ensemble. Recommander une **harmonisation distincte** du catalogue : préciser la simplification dans la question ou revoir les options et la justification après accord enseignant.

Source : https://abc-du-bridge.scenari-community.org/002-10/co/002-10-Synthese.html

## Correctif produit : sauvegarde AZ incompatible non écrasable

Un défaut de reprise était présent dans `templates/parcours-v2-ay-live-runtime.js` : après un refus de lecture de la sauvegarde locale AZ, l'interface signalait qu'elle serait préservée, mais proposait un bouton Démarrer susceptible de **remplacer le contenu précédent**.

Correctif sur la branche :
1. Distinguer **clé absente** d'une sauvegarde existante mais illisible/incompatible.
2. En présence d'une sauvegarde incompatible, **bloquer le démarrage et toute écriture locale AZ**.
3. Montrer un écran d'alerte avec **effacement ciblé et confirmation explicite**, sans suppression des trois clés historiques du Quiz, V1 ou V2-F.
4. Tester : valeur corrompue préservée, annulation préservée, confirmation efface uniquement AZ, retour ensuite au mode `core` par défaut.
5. Synchroniser l'HTML versionné `preview/v2-az/parcours-v2-adaptatif.html` avec ce correctif, pour que le lien de prévisualisation QPJB ne pointe pas vers une ancienne version.

La sauvegarde locale reste limitée au navigateur utilisé ; ce dispositif ne constitue ni une sauvegarde serveur ni un mécanisme de récupération de données.

## Ce qu'il reste réellement à décider

**Trois gestes éditoriaux seulement** sur les cas encore non harmonisés : (a) définir l'enseignement uniforme du double transfert sur les deux V416 ; (b) clarifier « maximum » pour L25-007 ; (c) décider la rubrique de l'ouverture gambling. Les autres réponses ont un support documentaire, mais les **19 `editorialApproval` restent `PENDING`** jusqu'à approbation explicite, et les **8 suppléments** du mode expérimental n'entrent toujours pas dans le parcours de base.

**Statut : `HOLD` ; PR Draft ; 1 523 QCM SEF inchangés ; aucune fusion/publication.** Le dernier test GitHub ne doit être déclaré réussi qu'après lecture du résultat CI du SHA le plus récent.

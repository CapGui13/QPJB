# QPJB — Phase Z : fiche courte avant la première convention (prototype non actif)

**19 novembre 2026 · PR #214 · Série Z, expérience éditoriale non intégrée au site.**

## Objectif et règle de protection

La revue Y a montré que la **première question Rubensohl** apparaît toujours à la séance 35, mais peut concerner soit 1SA–(2♣ Landy), soit une intervention naturelle 2♦ suivie d'un Stayman au palier de 3. La **première question Michaels** peut même, dans un parcours sur neuf, être une longue surenchère compétitive. Les deux situations suggèrent un accompagnement *avant* le QCM, pas un nouveau tirage ni une hausse automatique de la difficulté.

La phase Z crée un **préambule facultatif, non noté, de trois points de méthode**, uniquement pour cinq **IDs originaux** ayant été repérés comme première question Rubensohl/Michaels dans les neuf simulations Y. Le préambule n'indique **pas littéralement la bonne enchère**, n'est pas une leçon exhaustive et ne démontre aucune compétence. Une aide peut cependant orienter le raisonnement et affecter la valeur diagnostique de la réponse : **il faut séparer explicitement un mode découverte avec aide d'une évaluation autonome sans aide**.

Les cinq fiches sont **en attente de validation par l'enseignante**. Aucune fiche n'est publiée, et le système du Quiz SEF ne les lit pas.

## Cinq cas et rôle proposé de l'aide

| ID original | Rubrique | Contenu du préambule proposé | Contrôle éditorial |
|---|---|---|---|
| `SEF-V486-022` | Rubensohl après **1SA–(2♣ Landy)** | Identifier le rôle de l'ouvreur, la nature artificielle du Landy et le dispositif de réponse | **Ne donne pas 3♣** ; la conversion reste dans le corrigé |
| `SEF-V481-009` | Rubensohl après intervention naturelle à ♦ | Lire la signification de 3♣ **déjà indiquée dans la séquence**, puis identifier la majeure quatrième détenue | **Ne donne pas 3♠** |
| `SEF-L04-029` | Michaels, surenchères successives jusqu'à 4♠ adverse | Identifier les couleurs du cue-bid, compter le soutien, prendre en compte vulnérabilité et palier | **Ne dit pas Passe** ; l'énoncé décrit déjà l'accord |
| `SEF-C2-007` | Michaels, 5–5 majeur après 1♦ adverse | Repérer les couleurs longues et la convention annoncée | **Ne donne pas 2♦** |
| `SEF-V45-044` | Michaels, cue-bid sur ouverture 1♠ | Relier les couleurs du bicolore convenu à la distribution réelle | **Ne donne pas 2♠** |

Les instructions ne sont **pas générées automatiquement à partir d'une supposition sur la règle SEF**. Elles sont écrites pour ces cinq cas documentés dans le catalogue, avec contrôle de l'ID, de la rubrique et d'une phrase d'ancrage de l'énoncé ; une modification de source empêche leur validation automatique. Le test de non-divulgation vérifie l'absence de la **chaîne textuelle** de la bonne réponse dans le préambule : un audit humain doit encore rechercher les indices sémantiques trop révélateurs.

## Parcours de démonstration autonome

Le générateur `scripts/parcours-v2-apercu-z.cjs` crée le fichier **`intro-z-preview.html`** dans l'artefact du workflow GitHub. Il peut être ouvert **localement**, sans serveur, et propose :

1. Sélection d'un des cinq exercices originaux ;
2. Lecture de l'aide de préparation en trois points, **sans notation** ;
3. Accès volontaire au **QCM original intact**, avec la main ♠ ♥ ♦ ♣, la séquence, l'énoncé et les quatre propositions ;
4. Affichage volontaire du **corrigé d'origine** après la tentative (ou sans réponse, avec avertissement).

Aucune sauvegarde, requête réseau, statistique de réussite ni passerelle vers l'application réelle. L'aperçu n'est **pas une séance complète** et ne prétend pas simuler la maîtrise d'un élève.

## Protocole Z

- `scripts/parcours-v2-intros-z.cjs` : sidecar éditorial des cinq cas, contrôles d'ancrage et mesure de leur rencontre en **9 simulations V2-F × 45 séances × 10 QCM**.
- `tests/quizz-v2-intros-z.cjs` : provenance et non-mutation des 1 523 QCM, absence littérale des réponses dans les trois étapes, identité des séances, conformité du HTML avec le catalogue original.
- `.github/workflows/qpjb-v2-z-focused.yml` : tests, rapport `phase-z-matrix.json`, synthèse `phase-z-summary.json`, génération de l'aperçu HTML et archivage dans `qpjb-v2-z-experimental-preview`.

**Important :** la couverture « première rencontre » signifie seulement que l'aide aurait été **disponible** avant la première question de la rubrique dans les neuf simulations. Le prototype **n'insère pas** cette fiche dans la séance V2-F et n'altère pas l'ordonnancement, le décompte des questions ou les résultats simulés. Pour une mesure auprès d'élèves, il faudra décider explicitement si la fiche est affichée, et conserver la distinction *avec aide / sans aide*.

## Décision avant toute intégration

Ne pas intégrer ces aides à l'interface élève sans relecture de l'enseignante (notamment de la **divulgation implicite** du raisonnement), essai ergonomique et contrôle que les QCM ne sont pas utilisés comme preuves de maîtrise lorsqu'une aide vient d'être proposée. Préserver les élèves qui souhaitent un parcours d'évaluation sans aide, et ne pas supprimer les rappels ni déplacer les conventions artificiellement.

**Statut : `Z_PRELUDES_OPTIONNELLES / 5_SOURCES_CIBLEES / VALIDATION_ENSEIGNANTE_REQUISE / NON_DEPLOYE / V2_F_INCHANGE`.**

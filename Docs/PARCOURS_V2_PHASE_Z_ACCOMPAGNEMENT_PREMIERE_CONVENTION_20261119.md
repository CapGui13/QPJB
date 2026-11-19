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

## Validation CI et couverture effective (neuf parcours)

**[GitHub Actions #44496200634](https://github.com/CapGui13/QPJB/actions/runs/44496200634) : succès.** Tests des cinq ancres originales, de la non-divulgation littérale des réponses, de l'absence de mutation et de l'aperçu HTML : réussis. La génération de `intro-z-preview.html` a réussi (11 857 octets, script JavaScript valide). Le rapport est archivé dans l'artefact GitHub **`qpjb-v2-z-experimental-preview`**.

| QCM premier de sa rubrique | Nombre de parcours sur 9 | Fiche proposée |
|---|---:|---|
| `SEF-V486-022` Rubensohl / Landy | 6 | 3 étapes, non notées |
| `SEF-V481-009` Rubensohl / intervention naturelle | 3 | 3 étapes, non notées |
| `SEF-L04-029` Michaels / compétition avancée | 1 | 3 étapes, non notées |
| `SEF-C2-007` Michaels / 1♦ adverse | 3 | 3 étapes, non notées |
| `SEF-V45-044` Michaels / 1♠ adverse | 5 | 3 étapes, non notées |
| **Total** | **18 premières rencontres** | **18 couvertes sur 18** |

Cinq fiches distinctes suffisent à couvrir ces **18 situations d'exposition fictives**, car chaque scénario possède une première Rubensohl et une première Michaels. Les deux variantes Rubensohl ne doivent pas être confondues : **Landy artificiel et intervention naturelle sont pédagogiquement distincts**.

Le moteur expérimental reste **exactement V2-F**, avec **440–450 familles distinctes** et **69–77 rappels ciblés**, sans modification de la sélection, de l'ordre des séances, du décompte ou des exercices. La validation est **technique** ; elle ne prouve pas qu'une fiche soit compréhensible ou qu'elle améliore l'apprentissage. **Le test final est la relecture par l'enseignante et, si souhaité, un essai guidé non noté.**

**Statut validé : `Z_CI_OK / 18_SUR_18_EXPOSITIONS_COUVERTES / VALIDATION_ENSEIGNANTE_REQUISE / NON_DEPLOYE / V2_F_INCHANGE`.**

## Complément AA — relecture des cinq aides

Le protocole complémentaire **AA (19/11/2026)** a remplacé les formulations trop orientantes. Les cinq fiches restent **en attente de validation enseignante**. L'ancien conseil de la fiche `SEF-V481-009` désignait précisément la majeure quatrième, et celui de `SEF-L04-029` la faiblesse du soutien ; ils ont été neutralisés.

L'aperçu HTML possède maintenant un sélecteur de **deux modes** : *découverte guidée* (fiche avant le QCM original) et *essai sans aide* (QCM original immédiatement). **Les deux modes ne sont pas notés.** Le choix du mode réinitialise la question affichée et masque l'ancien corrigé. Aucun mode n'écrit dans les sauvegardes.

La revue constate aussi un point indépendant : **l'énoncé original `SEF-L04-029` fournit lui-même des indices très forts en faveur de Passe**. La correction reste inchangée. **L'exercice nécessite une revue éditoriale distincte** avant d'être utilisé comme preuve d'autonomie.

Pour la revue ligne par ligne des cinq cas, des exemples et des risques restants, voir `Docs/PARCOURS_V2_PHASE_AA_AUDIT_AIDES_NON_DIRECTIVES_20261119.md`.

**Statut AA : texte des cinq fiches revu ; validation technique de la nouvelle version requise, validation pédagogique humaine encore requise.**




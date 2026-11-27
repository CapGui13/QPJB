# Bilan final — Reprise 6 C / #509
**Décision : HOLD C1 et C2, aucun patch à activer.** Exécution des expériences terminée ; objectif de réduction robuste de la dette sans régression non atteint. Contrat #506/#419 maintenu. Base figée 13966e475cf986c6f76e7faf870377fdf4ef99aa, référence historique 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. PR de livraison [#511](https://github.com/CapGui13/QPJB/pull/511), brouillon.

## Résultats complets
Deux matrices de 18 paires (6 profils × 3 graines), deux modèles, deux bras, 180 séances × 10 questions = 259200 présentations simulées. Horizons S5/20/65/153/180. Aucun changement de règle de réponse, de seuil ou de catalogue. Les dettes six-séances M6 et D sont deux séries distinctes et ne doivent pas être additionnées ni comparées entre elles.

| Variante | Modèle | Dette S180 avant→après | Gain | Échanges directs | Alertes individuelles strictes |
|---|---|---:|---:|---:|---:|
| C1 | M6 | 241051→241051 | 0 % | 0 | 0 |
| C1 | D | 228622→228622 | 0 % | 0 | 0 |
| C2 | M6 | 241051→236701 | 1,80 % | 118 | 275 |
| C2 | D | 228622→221129 | 3,28 % | 97 | 155 |

C1 : aucun donneur strict dans les 18 paires, 0 modification du deck. C2 : 1242 decks M6 de composition modifiée (effets directs et longitudinaux), 97 événements directs D (pas un décompte de decks modifiés D). M6 11 paires améliorées / 5 aggravées / 2 égales ; D 12/2/4. M6 strict : 106 écarts terminaux, 79 dettes de concept, 53 pertes de preuve, 13 baisses de familles, 11 hausses difficulté, 10 baisses d'autonomie, 3 hausses nearFamily ; comparateur M6 original : 6 revues difficulty-jumps. D : 70 écarts terminaux, 56 dettes de concept, 29 pertes de preuve (155 hors observations latence). Gate D original complet : 56 violations, dette améliorée sur certaines paires, pas de gain précoce S5, verdict HOLD. Les catégories peuvent se recouper et ne désignent pas des élèves distincts.

### C2 par profil, 3 graines agrégées
| Profil | M6 avant→après | M6 alertes | D avant→après | D alertes |
|---|---:|---:|---:|---:|
| aide | 19722→19330 | 19 | 22993→22426 | 19 |
| autonome | 52809→51762 | 39 | 52809→51762 | 33 |
| cible | 40262→41487 | 75 | 41560→40682 | 44 |
| faible | 23271→22501 | 49 | 20630→20630 | 0 |
| intermediaire | 47163→41655 | 42 | 40933→42255 | 27 |
| passe | 57824→59966 | 51 | 49697→43374 | 32 |

Le profil Passe aggrave la dette M6 malgré son amélioration D ; cible se dégrade en M6, intermédiaire en D. Les preuves individuelles ne sont pas négociables. Le contrôle complémentaire de statuts #448 a retrouvé 34 donneurs M6 et 27 D classés contraste/séquence/miroir utile parmi les échanges. Le garde initial bilatéral (376 IDs) ne protégeait pas toutes ces classifications individuelles. Aucun HOLD n'a été activé. Voir CONTRE-EXEMPLES.md pour les mains, réponses, substitutions précises et la saturation du Passe.

## Recette réelle et provenance
- C1 : [run 46016332742](https://github.com/CapGui13/QPJB/actions/runs/46016332742), 19/19 jobs réussis, PR technique [#514](https://github.com/CapGui13/QPJB/pull/514). SHA checkout réel 2d5b6bfddc87a46be67663bb5fa9d17407a2b377. c1-matrix.json, commit 87a257ad.
- C2 : [run 46016906055](https://github.com/CapGui13/QPJB/actions/runs/46016906055), 19/19 jobs réussis, PR technique [#515](https://github.com/CapGui13/QPJB/pull/515). SHA checkout réel d2ab231d4e11bc64897d7e274be51e6326dc35c2. c2-matrix.json, commit ca1f7a1a, blob 3c84fb6c0a762ab49bbdca6f025ba9a2bfaafcd6 ; lecture du blob vérifiée (18 paires).
- Unitaires Node dans les deux CI (C1 18 contrôles, C2 18+15), sonde V8 M6 S70, agrégateur V8 testé sur les vrais résultats des deux matrices. Les comparateurs d'origine sont invoqués, non reconstitués à partir d'une simple note de synthèse.
- Commandes de reproduction : `node tests/coherence-reprise6-c-run.cjs <profil> <graine> both 180 <dossier> strict` (C1) / `... recent` (C2) et `node tests/coherence-reprise6-c-gate.cjs audits/coherence-concrete-20261126/reprise6/c/c2-matrix.json`. Utiliser le SHA testé pour la reproduction exacte de chaque variante.
- Chaque matrice commitée inclut résultats appariés par horizon, preuves/alertes, événements directs, gate D et 18 références d'artefacts CI avec empreintes et expiration. Les 36 archives de traces intégrales restent sur Actions (rétention courte, dates exactes dans les matrices), ne sont pas toutes commitées dans Git. Les agrégats, événements et contre-exemples sont durables. Le DNS du conteneur ne permettait pas git clone ; exécution Node sur Actions, pas de prétention à une recette locale complète.

## Raccordement et limites
Les trois modules isolés, l'adaptateur à ancres exactes et le banc donnent un patch reproductible sans changer les fichiers de production. L'activation expérimentale se fait uniquement par options dans le banc, après composition et avant logicalOrder. La politique refuse les historiques incomplets, les sessions actives, les donneurs protégés, les exceptions d'éligibilité et les augmentations de concentration locale ; aucune modification d'objectif, de T ou d'ordre final. Catalogue et métadonnées comparés à la base et à la référence historique, 1915 QCM/99 concepts. Invariants de decks, reprises actives exactes aux jalons et protections précoces vérifiés. S1–65 sont inchangées par construction et contrôlées dans les deux modèles ; pas de gain nouveau S21–65. Les tests navigateur/cache/stockage/quiz libre et la recette globale après assemblage ne sont pas rejoués dans cette mission isolée. Aucun changement de ces composants ; M6 global reste au coordinateur.

## Transmission
Rejeter les deux candidats ; ne pas fusionner les PR techniques ni la livraison en tant qu'activation. Ne pas répéter des variantes de score sans traiter la capacité réelle de réservation et la protection des contrastes. Piste éventuelle (non implémentée ni validée) : réservation sous plafonds natifs et dette de remboursement d'un donneur réellement sûr, avec couverture de tous les statuts individuels pertinents et contre-factuel apparié. La cible de réduction sans régression demeure non résolue. Les simulations ne prouvent pas l'apprentissage humain.

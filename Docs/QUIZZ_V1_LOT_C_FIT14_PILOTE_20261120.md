# QPJB V1 — LOT C : pilote expérimental « Après un fit majeur » (14 QCM)

**20 novembre 2026 — revue éditoriale requise.** Branche isolée depuis `main`, PR brouillon à ne pas fusionner. **Aucune mise en ligne ; aucun changement au moteur V1, à `quizz.html`, aux QCM, aux corrigés ou aux sauvegardes.**

## 1. Provenance et schéma non actif

Source exclusive des cas : `audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json`, recoupée avec `audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json` et **les exercices réels** de `quizz.html` (balise `training-data`). Le script vérifie le SHA Git du contenu original `8e8100fdad9e52c160b11670098dd08050214374`, 1 523 QCM et l'identité, pour chaque cas, des mains, enchères, réponse, choix, forme, points, contexte et explication. La question d'origine reste inchangée même si l'audit doute de son explication.

- `audits/QPJB_V1_FIT14_LOT_C_PILOTE_NON_ACTIF_20261120.json` : 3 **compétences candidates**, clés reprises mot pour mot du registre 48, 14 IDs originaux, `activationAllowed: false`, `validatedSkills: 0`, `masteryEvidence: null`, `selectionPolicy: SIMULATION_HORS_PRODUCTION`. Aucune nouvelle clé de sauvegarde, aucun champ injecté dans les QCM.
- `scripts/pilot-v1-fit14-lot-c.cjs` : vérification à l'exécution des sources **et du catalogue réel**, audit de la cohérence des enchères, simulateur autonome qui ne charge **pas** le moteur V1.
- `tests/quizz-v1-fit14-lot-c.cjs` : invariants de provenance, de pairage des situations, d'absence d'homologation et comparaison des deux profils.
- Commandes reproductibles : `node scripts/pilot-v1-fit14-lot-c.cjs` (résultat JSON) et `node tests/quizz-v1-fit14-lot-c.cjs`.

## 2. Relecture individuelle des 14 cas

**Convention explicitée par les questions :** soutien simple `1M–2M` (environ 6–10 HLD), puis décision de l'**ouvreur**. L'annonce du soutien fait **déclarer** le fit ; la main du répondant n'est pas visible et ses valeurs HLD ne peuvent donc pas être recomptées. Les 14 ouvreurs ont 5 cartes dans la majeure, 13 cartes au total, le total H indiqué et une seule bonne réponse inscrite dans les choix. Ces contrôles ne valent pas certification exhaustive SEF.

| ID | Majeure / forme ♠-♥-♦-♣ | H | Réponse originale | Avis de revue |
| --- | --- | ---: | --- | --- |
| SEF-V4-001-1 | ♥ / 3-5-3-2 | 12 | Passe | Cohérent : première zone, arrêt au palier 2 |
| SEF-V4-003-3 | ♥ / 3-5-2-3 | 12 | Passe | Cohérent : minimum, malgré doubleton ♦ |
| SEF-V4-013-3 | ♠ / 5-3-3-2 | 12 | Passe | Cohérent : belle couleur mais force minimale |
| SEF-V4-015-3 | ♠ / 5-3-2-3 | 12 | Passe | Cohérent : pas d'essai automatique |
| SEF-V4-002-1 | ♥ / 3-5-3-2 | 15 | 2SA | Essai généralisé cohérent **dans le cadre décrit** |
| SEF-V4-004-1 | ♥ / 3-5-2-3 | 15 | 2SA | Même cadre ; force invitante |
| SEF-V4-014-1 | ♠ / 5-3-3-2 | 15 | 2SA | Même cadre ; pas un contrat SA |
| SEF-V4-016-2 | ♠ / 5-3-2-3 | 15 | 2SA | Même cadre ; pas un 2SA fitté direct |
| SEF-V44-050 | ♥ / 2-5-2-4 | 15 | 3♣ | Quatre ♣ et valeurs AR ; essai plausible |
| SEF-V44-051 | ♥ / 2-5-4-2 | 15 | 3♦ | Quatre ♦ et valeurs AR ; essai plausible |
| SEF-V44-052 | ♠ / 5-2-2-4 | 15 | 3♣ | Quatre ♣ et valeurs AR ; essai plausible |
| SEF-V44-053 | ♠ / 5-2-4-2 | 15 | 3♦ | Quatre ♦, mais uniquement R en honneur : vérifier la pertinence d'un essai à la couleur |
| SEF-V44-054 | ♥ / 4-5-2-2 | 15 | 3♠ | **BLOQUÉ POUR LE PILOTE** : 3♠ dépasse 3♥, retour négatif à 3♥ impossible |
| SEF-V423-001 | ♠ / 5-4-2-2 | 16 | 3♥ | Quatre ♥ RDV5 ; retour à 3♠ possible |

**Alerte majeure : `SEF-V44-054`.** Après `1♥–2♥–3♠`, le partenaire ne peut pas refuser l'essai en revenant à `3♥` : il faudrait **descendre** dans les enchères. On ne peut donc pas traiter `3♠` comme un essai ordinaire permettant une simple décision `3♥/4♥`. Le statut SEF exact de l'enchère dans ce contexte (et la correction éventuelle du QCM) **reste à arbitrer**. Le pilote **conserve** l'ID, le texte et la réponse originaux ; il **exclut** uniquement ce cas du tirage simulé.

**Réserve secondaire : `SEF-V44-053`.** Le 3♦ est structurellement disponible avec quatre ♦, mais la qualité de cette couleur (♦R1093) appelle une relecture de l'unicité pédagogique du « meilleur essai » face aux autres décisions, sans affirmer automatiquement que le corrigé est faux. Les autres cinq essais à la couleur ne reçoivent **aucune approbation éditoriale** par le seul fait de passer un test technique.

**Distinctions nécessaires :** `1M–2M–2SA` (essai de manche de l'ouvreur) n'est pas `1M–2SA` (soutien fitté direct du répondant). Les interventions, les courtes et la réponse du répondant à l'essai sont **hors de ce pilote**. Une question ne constitue pas une preuve générale de l'applicabilité SEF à toutes les situations.

## 3. Familles et indépendance des exemples

- **14 QCM originaux, 14 valeurs `caseFamily` distinctes** : pas de répétition de famille source entre ces 14.
- **10 contextes structurels** distincts en réunissant « majeure ouverte + distribution 4 couleurs ». Pour les huit premiers QCM, **4 paires** confrontent exactement la même majeure et la même forme avec **12 H / Passe** contre **15 H / 2SA**. Ces paires sont excellentes pour comparer la notion de force, mais **ne comptent pas comme huit contextes entièrement différents**.
- Six contextes d'essai à la couleur dont **cinq admissibles au test**, un réservé à la revue : **13 familles-source simulables**, 13 contextes d'évaluation identifiables par ID. Le niveau de preuve d'une compétence ne doit pas être confondu avec son nombre brut de QCM.

## 4. Test de bénéfice contrôlé (aucune donnée d'élève)

**Protocole fixe :** 12 séances fictives de **4 QCM** = **48 présentations** par profil et par stratégie. Le lot de comparaison est **limité aux 13 cas structurellement admissibles**, pour ne pas entraîner sur le cas controversé. Le témoin est une **rotation neutre équilibrée des 13 IDs**, sans information sur les erreurs de l'élève ; le pilote prend **2 QCM de la compétence fragile + 2 d'autres compétences**, en rotation. Tous les tirages viennent exclusivement des QCM source, sans nouveaux exercices et **sans toucher à la sélection V1**. Chaque profil fictif répond faux à tous les QCM de sa faiblesse et juste aux autres : aucune amélioration des réponses n'est présumée.

| Profil synthétique / métrique | Témoin neutre | Pilote ciblé | Différence |
| --- | ---: | ---: | ---: |
| A : difficulté **Passe** ; expositions ciblées | 15 / 48 | 24 / 48 | **+9, soit +60 %** |
| B : difficulté **essai à la couleur** ; expositions ciblées | 18 / 48 | 24 / 48 | **+6, soit +33,3 %** |
| A et B : familles source distinctes rencontrées | 13 / 13 | 13 / 13 | 0 perte |
| A et B : compétences candidates rencontrées | 3 / 3 | 3 / 3 | 0 perte |
| A et B : séances sans doublon de famille | 12 / 12 | 12 / 12 | 0 perte |
| A et B : autres compétences toujours pratiquées | 33 (A), 30 (B) | 24 | Couverture conservée, **fréquence réduite** |

**Interprétation mesurée :** la classification apporte un avantage **fonctionnel de ciblage** pour les deux faiblesses opposées, sans retirer aucune famille du petit catalogue. L'augmentation d'exposition implique **aussi davantage de réponses fausses simulées** (A : 15→24 ; B : 18→24), puisque les profils ont par construction 100 % d'erreurs persistantes dans la compétence faible. Il serait donc trompeur de présenter ce test comme une baisse du taux d'erreur, une meilleure maîtrise ou une preuve d'apprentissage. La couverture à 13/13 dépend de ce lot fermé et de 48 présentations ; elle ne préjuge pas de la diversité du **catalogue global de 1 523 QCM** ni des séances 1–65 ou 1–153.

## 5. Décisions nécessaires avant toute activation

1. **Arbitrer `SEF-V44-054`** : qualifier l'enchère 3♠ après le fit ♥ et déterminer si l'énoncé/les choix/le corrigé exigent une correction éditoriale séparée.
2. **Contre-expertiser `SEF-V44-053`** : vérifier la force de l'essai ♦R1093 et si 3♦ est une meilleure réponse unique, compte tenu de l'accord d'essai enseigné.
3. **Valider ou refuser individuellement les 14 correspondances** (y compris les huit cas 12/15 H appariés), en utilisant la fiche de système SEF du Quizz. Ne pas activer même les 13 exemples structurellement admissibles par défaut.
4. Après **GO explicite**, concevoir une autre PR d'intégration (moteur, politique de sauvegarde, recette) et comparer alors la **vraie V1** avant/après, avec erreurs graduelles, aides, rappels, diversité sur les **1 523 QCM** et absence de changement des réponses.

**Conclusion de ce LOT C :** `pilote expérimental`, **gain de ciblage quantifié**, **1 blocage SEF**, **1 point supplémentaire à contre-expertiser**, **0 compétence homologuée**, **0 étiquette activée**, **0 publication**.

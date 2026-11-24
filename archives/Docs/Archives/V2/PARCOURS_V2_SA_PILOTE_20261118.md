# Parcours V2 — première revue ciblée : 14 QCM de la rubrique SA

**Statut : propositions à valider par un enseignant avant toute utilisation.** Cette étape n'attribue aucun nouveau score de maîtrise et ne touche pas au Quiz SEF. Elle est ancrée dans les QCM exacts, leurs enchères, leurs réponses et leurs justifications.

## Pourquoi ces 14 QCM échappaient aux micro-compétences V1.10

La taxonomie V1.10 identifie principalement le répondant qui réagit à l'ouverture de **1SA ou 2SA du partenaire**. Les 14 QCM restants mettent souvent **l'ouvreur** en position de répondre à une convention, ou à une invitation quantitative après sa propre ouverture. La compétence doit donc distinguer le **rôle dans la séquence**, l'ouverture, la convention et la décision attendue. Le seul thème `sa` est insuffisant.

## Huit catégories de travail proposées

| Compétence candidate (non active) | QCM | Exemples ID → réponse originale |
|---|---:|---|
| Répondre au Stayman à quatre réponses après ouverture de 2SA | 4 | SEF-L38-001 → 3SA ; SEF-L40-001 → 3♦ ; SEF-L41-001 → 3♥ ; SEF-L43-005 → 3♠ |
| Rectification fittée du Texas majeur après ouverture de 2SA | 2 | SEF-L23-006 → 3SA ; SEF-L39-001 → 3♠ |
| Moduler la rectification du Texas Trèfle après 1SA | 2 | SEF-L25-007 → 2SA ; SEF-L25-008 → 3♣ |
| Accepter ou refuser 4SA quantitatif après 2SA | 2 | SEF-L41-002 → 6SA ; SEF-L44-001 → Passe |
| Conclure après Texas majeur et 3SA sur ouverture de 1SA | 1 | SEF-L08-002 → Passe |
| Rectifier obligatoirement un Texas Carreau après 1SA | 1 | SEF-L37-004 → 3♦ |
| Refuser le Texas Trèfle sur 2SA sans soutien troisième | 1 | SEF-L41-004 → 3SA |
| Rectifier 3SA gambling après 4♣ passe/corrige | 1 | SEF-L06-029 → 4♦ |
| **Total** | **14** | |

Chaque paire ou petit groupe conserve les identifiants et les réponses exactes. Aucun texte de bonne réponse n'a été généré ni modifié. Les **quatre réponses possibles au Stayman sur 2SA** sont présentes dans quatre familles distinctes : 3♦, 3♥, 3♠, 3SA. Les deux QCM du **4SA quantitatif après 2SA** couvrent les décisions opposées avec 20 H et 21 H. Le Texas Trèfle après 1SA oppose également un gros honneur troisième à un Valet troisième.

## Vérifications pédagogiques encore indispensables

- **Vérifier le SEF 2024 et les accords explicitement affichés**, en particulier les conventions moins universelles (Texas mineurs, modulation du Texas Trèfle, ouverture 3SA gambling) : une ressemblance de séquence ne signifie pas que les règles sont interchangeables.
- **Réviser la rubrique source du 3SA gambling**, éventuellement plus proche des barrages que des réponses à Sans-Atout : ne pas le déplacer automatiquement.
- Une compétence candidate couverte par **un ou deux QCM** ne doit pas être déclarée maîtrisée à partir d'une réussite unique. Il faudra soit disposer d'autres cas originaux distincts, soit combiner des objectifs avec prudence, sans produire de nouvelles donnes.
- Ne pas considérer les **72 QCM SA déjà classés** comme définitivement audités : les huit propositions ne décrivent que les 14 QCM actuellement sans micro-clé.
- Avant d'activer une nouvelle micro-compétence dans le moteur, vérifier l'exactitude **ID + rôle + enchères + justification** et ajouter les tests de reprise, de révision et de non-régression.

## Livrables

- `Docs/PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json` : association explicite des **14 IDs** à **8 compétences candidates**, avec réponse d'origine, séquence et justification conservées.
- `tests/quizz-v2-sa.cjs` : vérifie que toutes les associations correspondent toujours au catalogue et qu'aucune compétence candidate n'est activée dans le moteur.
- **Étape suivante** : relecture pédagogique de ces 14 associations, puis premier lot `stayman` de 65 QCM non classés, avant un prototype de progression conditionné par les prérequis.

Le parcours V1.10 reste **strictement inchangé**.

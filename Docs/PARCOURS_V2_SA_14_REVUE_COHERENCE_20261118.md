# QPJB V2 — revue de cohérence des 14 QCM SA (phase C)

**18 novembre 2026 — Document d'audit, aucune validation éditoriale automatique.**

Sources: catalogue exact `quizz.html`, inventaire V2 #212 et préclassification #213; contrôles documentaires sur les développements du SEF (réponses au Stayman, rectification fittée du Texas après 2SA, Texas mineur). **Aucun QCM, corrigé, score, sauvegarde, prérequis actif ou moteur du parcours V1.10 n'est modifié.**

## Bilan des huit compétences candidates

| Compétence préclassée | IDs | Constat / décision de revue |
| --- | --- | --- |
| `sa:stayman_2sa_reponses` | SEF-L38-001, SEF-L40-001, SEF-L41-001, SEF-L43-005 | 4 situations distinctes: 3SA (deux majeures quatrièmes), 3♦ (aucune), 3♥ (Cœur seul), 3♠ (Pique seul). **Cohérence documentaire vérifiée**, pas de maîtrise attribuée. |
| `sa:texas_majeur_2sa_fit` | SEF-L23-006, SEF-L39-001 | 3SA sans fit et 3♠ avec fit, cohérents avec la rectification fittée après 2SA. **Libellé trop restrictif** (« fittée ») pour le cas négatif: renommer ultérieurement « Traiter le Texas majeur après 2SA : fit ou sans fit ». |
| `sa:texas_trefle_1sa_modulation` | SEF-L25-007, SEF-L25-008 | Contraste 2SA (♣R103) / 3♣ (♣V86) ancré dans les mains. **POINT À ARBITRER : SEF-L25-007 contient 16 H** mais le contexte et l'explication parlent de « main maximum » sur l'ouverture de 1SA 15–17 H. Vérifier si le critère de force est vraiment exigé par l'accord retenu, et corriger la formulation ou l'exemple *dans un chantier éditorial séparé après arbitrage*. Ne pas changer la bonne réponse ici. |
| `sa:quantitatif_2sa` | SEF-L41-002, SEF-L44-001 | 21 H → 6SA, 20 H → Passe, invitation à 4SA sans fit agréé: **contraste pédagogique clair**. L'intention de force du répondant reste implicite. |
| `sa:texas_majeur_1sa_sans_fit` | SEF-L08-002 | Deux Piques chez l'ouvreur et cinq chez le répondant: Passe sur 3SA cohérent. **Cas isolé**: ne pas déduire la maîtrise après un seul QCM. |
| `sa:texas_carreau_1sa` | SEF-L37-004 | Rectification 3♦ malgré seulement deux ♦, dans la séquence affichée: **cas isolé**, convention à conserver distincte du Texas Trèfle modulé. |
| `sa:texas_trefle_2sa` | SEF-L41-004 | 3SA avec doubleton ♣D5 en réponse au transfert 3♠. **Contrôle complémentaire de l'accord 2SA–3♠/3SA/4♣ requis** avant validation ferme. |
| `sa:gambling_3sa_passe_corrige` | SEF-L06-029 | 3SA gambling puis 4♣ passe/corrige et sept Carreaux maîtres: 4♦ décrit la correction. **Rattachement au domaine barrages / ouvertures conventionnelles à réexaminer**, plutôt que « réponse à 1SA/2SA ». Pas de changement du thème source pour l'instant. |

## Points de méthode

- Une **correspondance de famille** n'est pas une compétence validée ni une preuve de maîtrise: un seul cas ne suffit jamais.
- L'inventaire #212 identifie 620 QCM sans micro-clé; les 14 cas SA #213 n'en ont reçu que des **propositions**, non activées.
- Ne jamais modifier les réponses ni la logique du Quiz SEF dans ce chantier; les éventuelles corrections éditoriales doivent faire l'objet d'un arbitrage séparé.
- Pour `sa:texas_majeur_2sa_fit`, la famille couvre les deux résultats (avec et sans fit): son nom actuel ne reflète pas tout son périmètre.
- Source externe de confrontation (non exhaustive): https://stph.scenari-community.org/bridge/002-X/co/013-Synthese.html ; https://bridgesarzeau.club.ffbridge.fr/actualites-du-club/texas-mineur-sur-1sa-1123738 ; https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870 .

## Passage à la rubrique « Après Stayman et Texas »

Les 65 QCM originaux sont désormais préparés dans `Docs/PARCOURS_V2_STAYMAN_65_FAMILLES_REVUE_20261118.json`, répartis en **huit familles de revue décrivant uniquement le rôle, l'ouverture, la convention et la présence d'une intervention**. Les décisions fines (« accepter une invitation », « choisir 3SA », « chassé-croisé », « transfert mineur ») devront encore être définies à partir des mains et des enchères complètes.

**Statut global : AUDIT_DE_COHERENCE_NON_ACTIF.**

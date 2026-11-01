# QPJB Quizz — Audit C02 : 203 familles à variantes et conventions

**Date :** 1er novembre 2026  
**Version du Quizz :** V4.28 (`prototype-2026-11-01-v4-28-audit-c02`)

## 1. Analyse exhaustive des 203 familles contenant deux exercices

Le catalogue conserve **993 exercices**, répartis en **790 familles**, dont **203 familles à deux variantes**.

| Propriété de la paire | Nombre de familles |
|---|---:|
| Même séquence, même distribution et même bonne réponse ; variation de points H | **201** |
| Même séquence, même distribution et même bonne réponse ; même nombre de points H, honneurs différents | **2** |
| Bonne réponse différente à l'intérieur de la famille | **0** |
| Même main et même séquence (doublon strict) | **0** |

**Écart de points H entre deux variantes :** 0 point (2 familles), 1 (42), 2 (104), 3 (39), 4 (11), 5 (3), 11 (2). Les écarts de 1 à 2 points représentent **146 familles sur 203**.

Ces variantes ne sont **pas automatiquement inutiles** : elles peuvent démontrer qu'une règle reste valable pour des valeurs d'honneurs ou des zones voisines différentes. Une différence de 11 H dans une même famille peut même être pertinente.

### Deux familles particulièrement pédagogiques : les Texas

- `cas-138` : `SEF-N082-2` (0 H) et `SEF-N084-1` (11 H). Les deux mains répondent **2♦ Texas Cœur** après 1SA. La suite de la séquence, elle, diffère en fonction de la force.
- `cas-139` : `SEF-N085-1` (1 H) et `SEF-N087-2` (12 H). Les deux mains répondent **2♥ Texas Pique** après 1SA.

Ces quatre exercices ont été enrichis par des explications distinctes sur l'objectif du Texas faible ou fort, **sans modifier leur enchère correcte**.

### Décision de conservation

**Aucune suppression des 203 familles et aucune modification de leurs identifiants.** Le Quizz possède déjà un mécanisme qui privilégie une seule variante par famille dans les séances courtes. Le fichier CSV généré par `tests/quizz-content-audit.cjs` détaille les 203 familles : identifiants, rubrique, HCP, écart de force, concordance des distributions/séquences/réponses, classification et proposition de revue.

L'absence de contraste de réponse **à l'intérieur** d'une famille ne signifie pas que le catalogue entier manque de contrastes : ceux-ci peuvent exister entre familles distinctes.

## 2. Enrichissement ciblé des conventions

**12 nouveaux exercices `SEF-C2-001` à `SEF-C2-012`**, en privilégiant les erreurs de confusion les plus probables entre deux annonces.

| Rubrique | Nouveaux | Sujet et pièges travaillés |
|---|---:|---|
| Multi-Landy | 3 | Unicolore majeur, majeure–mineure, 4–4 majeur insuffisant pour un Landy 5–4 |
| Rubensohl | 3 | Texas Trèfle, Texas Carreau, Texas Pique forcing de manche |
| Michaels | 2 | Cue-bid bicolore majeur 5–5 ; ne pas confondre avec 5–4 |
| Blackwood 5 clés (30–41) | 2 | Roi d'atout = clé ; présence/absence de Dame d'atout |
| Drury | 1 | Fit trois cartes avec seuil 11 HLD après passe d'entrée |
| Roudi | 1 | Fit 5–3 recherché après 1m–1M–1SA |
| **Total** | **12** | |

Les conventions et les conditions nécessaires sont rappelées dans le contexte de chaque exercice. **Aucune probabilité numérique de rencontre à la table n'a été inventée.**

## 3. Correction de fiabilité découverte pendant l'audit

Certaines informations de contexte indispensables étaient encore masquées malgré le chantier A :

- Sur les réponses à 4SA Blackwood à cinq clés, la couleur d'atout agréée (Pique ou Cœur) n'était pas systématiquement affichée.
- Certaines références aux **arrêts**, à l'absence de fit ou à la courte pouvaient également rester invisibles.

La fonction d'affichage des précisions pédagogiques reconnaît désormais explicitement ces termes et affiche les conditions avant la réponse. Un test navigateur vérifie sur écran iPhone simulé la visibilité de l'atout Cœur et le choix de **5♥** avec deux clés sans Dame d'atout.

## 4. Résultats et contrôles

- **993 exercices** (+12), **790 familles** (+12).
- **70 corrigés approfondis** avec « Pourquoi pas ? » et « À retenir » (+16).
- Les **981 exercices préexistants, leurs identifiants, leurs bonnes réponses et les sauvegardes** sont préservés. Quatre de leurs explications ont été enrichies.
- Audit automatique **203 familles**, rapport JSON, rapport Markdown et **CSV détaillé** publiés en artefacts GitHub Actions.
- Tests d'intégrité des mains, des 13 cartes, des points H, de la réponse présente dans les quatre choix et de l'absence de doublon exact.
- Tests fonctionnels Chromium et WebKit (iPhone simulé). Le test physique iPhone reste distinct.

## 5. Chantiers suivants

1. Revoir manuellement les cas dont l'énoncé ou le corrigé pourrait dépendre de l'arrêt, de la vulnérabilité, de la position ou du système précis de la paire.
2. Pour les variantes trop similaires, enrichir les **contrastes de raisonnement** plutôt que supprimer les exercices et leurs résultats.
3. Continuer par petits lots de cas réellement différenciants, avec tests et contrôle des conventions.

**Limite :** cet audit systématique ne constitue pas une certification humaine exhaustive des 993 réponses d'enchères ; la validité stratégique des conventions dépend des accords annoncés.

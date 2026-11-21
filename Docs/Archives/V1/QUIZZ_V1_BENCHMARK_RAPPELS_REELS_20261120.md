# QPJB V1 — Rappels réellement planifiés (20 novembre 2026)

**Issue #226 · PR #236.** Mesure sur le catalogue réel des **1 523 QCM**, sans données personnelles et sans modification du moteur.

## Ce que mesurait mal le précédent benchmark

L'ancien indicateur « repeated » compte seulement les identifiants de QCM déjà vus. Le moteur peut pourtant programmer une révision sur une question jamais posée, avec le motif « rappel_nouvelle_situation ». Il était donc abusif de lire « 0 répétition » comme « 0 rappel ».

Le nouveau benchmark utilise la sélection conservée par le moteur et distingue trois classes exclusives : **découverte** (question nouvelle, motif nouveau), **rappel alternatif** (question nouvelle, motif révision), **rappel direct** (question déjà vue, motif révision).

## Résultats mesurés

Simulation de **4 profils × 23 séances**. Les chiffres portent sur les **10 dernières séances (100 cartes par profil)**.

| Profil | Découvertes | Rappels alternatifs | Rappels directs | Total rappels |
| --- | ---: | ---: | ---: | ---: |
| Tout juste et autonome | 90 | 10 | 0 | 10 |
| Erreurs modérées | 80 | 4 | 16 | 20 |
| Difficultés persistantes | 80 | 0 | 20 | 20 |
| Réponses justes avec aide fréquente | 80 | 0 | 20 | 20 |

**Source de mesure :** [GitHub Actions #44825901318](https://github.com/CapGui13/QPJB/actions/runs/44825901318), lignes de sortie LONGITUDINAL_RECALLS.

## Conclusion et limites

Les succès autonomes produisent bien des révisions sur de nouvelles mains ; les erreurs et aides entraînent davantage de rappels directs. La diversité reste préservée. **Ceci prouve le comportement algorithmique sur les profils simulés, pas un gain d'apprentissage en situation réelle.**

Le test vérifie, à chaque séance, la cohérence des trois catégories, les motifs de sélection, la diversité des familles, les échéances des rappels directs, et au plus deux rappels sur dix cartes. Une réussite assistée reste distincte d'une réussite autonome.

**Décision :** ne pas modifier les poids pédagogiques sur la base d'un chiffre trompeur ; garder le benchmark en garde-fou. Les **620 compétences candidates non homologuées restent désactivées**. Aucune correction, sauvegarde, page ou donnée d'élève modifiée par cette PR.

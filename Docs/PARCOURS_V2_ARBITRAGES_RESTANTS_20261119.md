# QPJB V2 — Fiche courte des décisions pédagogiques à approuver

**19 novembre 2026 — PR #215 (candidat de livraison hors production), fondée sur l'analyse de la PR #214.**

## Etat établi

- Le parcours autonome de **65 séances de 10 QCM SEF** et le paquet HTML candidat ont passé leur contrôle technique : [CI paquet #44600274706](https://github.com/CapGui13/QPJB/actions/runs/44600274706) et [CI navigateur #44596885376](https://github.com/CapGui13/QPJB/actions/runs/44596885376) (intégrité, Chromium, WebKit, y compris 9 séances dans le scénario ciblé).
- Les **1 523 QCM** sont identiques au corpus `main` de référence, **0 supplément** dans la version élève. Aucune modification ni déploiement réalisé.
- Les **19 cas pédagogiques** restent chacun en `editorialApproval=PENDING`, `teacherApproval=false`, `releaseDecision=HOLD`. Les contrôles techniques **ne valent pas** autorisation pédagogique.

## Décisions encore nécessaires — trois arbitrages concrets

| Groupe | Exercice(s) | Proposition de traitement (à confirmer) |
| --- | --- | --- |
| Double transfert après `1SA–2♣–2SA` | `SEF-V416-008`, `SEF-V416-009` | Enseigner dans le parcours standard la structure complète SEF : **4♣→4♥** et **4♦→4♠** pour faire jouer l'ouvreur ; dans une PR éditoriale distincte, proposer ces transferts parmi les choix ou expliciter sans ambiguïté que les 4♥/4♠ directs sont une simplification. **Ne pas substituer automatiquement une réponse dans les QCM existants.** |
| Modulation du Texas ♣ après `1SA–2♠` | `SEF-L25-007` | Maintenir provisoirement la correction **2SA** avec **16 H et ♣R103** : le gros honneur troisième documente une acceptation positive. Récrire plus tard l'explication pour ne pas faire dépendre la décision du seul qualificatif « maximum » ni imposer 17 H. |
| Classement des ouvertures | `SEF-L06-029` | Classer pédagogiquement **3SA gambling, puis 4♣ passe/corrige–4♦**, parmi les ouvertures conventionnelles / barrages plutôt que parmi les ouvertures de 1SA/2SA régulières. Ne modifier ni l'énoncé ni la correction. |

Ces choix sont des **propositions de validation**, non des changements effectués. Les mains, options, sources et justifications sont décrites dans `Docs/PARCOURS_V2_PHASE_BE_REVUE_FINALE_ET_SAUVEGARDE_20261119.md` sur la PR #214.

## Quinze réponses compatibles avec les accords documentés

Les quinze autres exercices ne nécessitent **pas de correction justifiée à ce stade** d'après la revue documentaire ; leur accord et leur place dans la progression restent toutefois à confirmer par l'enseignante.

- `SEF-L25-008` · `SEF-L18-006` · `SEF-L18-007` · `SEF-L18-008` · `SEF-L37-005`
- `SEF-L39-002` · `SEF-L07-028` · `SEF-L25-001` · `SEF-L25-002` · `SEF-L25-003`
- `SEF-L25-004` · `SEF-L25-005` · `SEF-L25-006` · `SEF-V482-005` · `SEF-V482-007`

Le dossier de preuves original conserve, pour chacun, sa main, sa séquence, son corrigé, sa référence et les éventuelles réserves. Le classement « compatible » ne constitue ni une certification exhaustive du SEF 2024 ni un passage en `APPROVED`.

## Politique de validation proposée

1. Valider la structure complète de double transfert et définir une correction éditoriale explicite des deux V416 **avant** que le parcours soit recommandé publiquement.
2. Confirmer l'accord Texas Trèfle 2SA / gros honneur troisième et le reclassement de 3SA gambling.
3. Accepter ou amender **explicitement** les quinze autres réponses au regard des accords retenus pour QPJB. Documenter les décisions dans le manifeste original au cours d'une PR éditoriale séparée.
4. **Seulement ensuite**, mettre `teacherApproval=true` et `releaseDecision=GO` après nouvelle recette sur les contenus effectivement retenus. Les 8 suppléments expérimentaux restent exclus par défaut.

## Ce qui reste inchangé

- Aucun ajout de cours écrits, de déblocage manuel ou d'exercices fabriqués.
- Pas de modification des 1 523 QCM, des sauvegardes V1/V2-F/Entraînement ni du site public.
- Les PR #214 et #215 restent des **Draft**, et le site n'est pas publié depuis ces branches.

**Prochaine action produit après décision pédagogique :** ouvrir une PR éditoriale ciblée, appliquer seulement les corrections approuvées, régénérer le HTML élève et rejouer les tests existants sans multiplier les audits globaux.

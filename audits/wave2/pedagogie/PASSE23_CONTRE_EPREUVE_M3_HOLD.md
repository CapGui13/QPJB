# QPJB — M1 / Passe 23 : contre-épreuve réelle sur l'interface M3

**PASSE 23 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Vérification inter-missions
Suite à la correction P22 (empreinte SHA-256 du JSON QCM, plus du fichier HTML entier), les **vrais scripts modifiés** de M1 ont été exécutés contre le **véritable HTML de la branche M3** `wave2/experience-eleve-20261121`, blob `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3` (1 839 792 caractères), obtenu via GitHub **sans écriture sur M3**.

- `wave2-pedagogie-progressions.cjs` (P7) : **PASS**, 1 523 QCM, 22 thèmes, 36 exclusions, 92 IDs/familles, paliers, repli Drury explicitement documenté.
- `wave2-pedagogie-catalogue-p21.cjs` (P21) : **PASS**, 17 QCM, **190 champs alignés**, P8/P10/P13 = 3/7/7, trois corruptions détectées en mémoire.

Les deux scripts ont tourné en moteur JavaScript isolé avec le **contenu réel M3 et les documents M1 exacts**. Le module `crypto` a été remplacé, pour cette contre-exécution, par un adaptateur retournant l'empreinte SHA-256 `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a` vérifiée séparément sur les deux charges JSON identiques. **Ce n'est ni un lancement natif de Node ni une réussite CI attestée** ; l'empreinte a également été calculée indépendamment précédemment par une implémentation JS de SHA-256 testée sur le vecteur `abc`.

## Effets et protections
- **0 changement de catalogue, moteur, présentation, workflows ou branches M2/M3/M4/M5.**
- La correction P22 résiste à un vrai changement d'interface et conserve la détection de modifications pédagogiques.
- PR #261 demeure en brouillon, sans fusion ni publication ; les 6 clarifications et 11 accords restent soumis aux décisions humaines et **aucune approbation n'a été inférée**.
- Les 17 scripts de la suite restent à exécuter nativement sous Node, puis une éventuelle intégration en CI doit être traitée par la mission M5.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P24 conditionnée à des faits nouveaux : résultat de suite Node/CI, retours des référents sur les 17 décisions ou modification du catalogue. Sans ces entrées, relancer des audits serait artificiel.** Aucun merge ou publication.

# QPJB M1 / P22 — Correction d'une fausse régression inter-missions

**PASSE 22 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Problème réel démontré
M3 (PR #265, `wave2/experience-eleve-20261121`) modifie la présentation de `quizz.html` : blob HTML `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3` contre `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7` sur M1. **Mais le contenu brut du script `training-data` est absolument identique** (1 741 625 caractères, 1 523 QCM/22 rubriques). Les tests P7 et P21 validaient jusqu'ici le SHA Git du HTML ENTIER, ce qui échouerait après fusion UX sans aucune modification pédagogique. C'était une régression de test démontrée sur deux branches réelles, pas un problème hypothétique.

## Correction strictement dans tests M1
Les deux tests `wave2-pedagogie-progressions.cjs` et `wave2-pedagogie-catalogue-p21.cjs` contrôlent maintenant le **SHA-256 de la charge JSON brute** et non le blob HTML total. L'empreinte est `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`. Les changements de styles, structure UI ou accessibilité pourront passer tant que le QCM embarqué est conservé byte pour byte. La conservation de 1 523 exercices et de 22 rubriques continue à être vérifiée.

Le nouveau test `tests/wave2-pedagogie-payload-p22.cjs` éprouve le contrat : insertion d'éléments dans l'UI avant/après le document ne change pas le SHA-256, tandis qu'une mutation d'une clé JSON est détectée. `CATALOGUE_EMPREINTE_P22_HOLD.json` conserve les deux blobs HTML des branches comparées et l'empreinte JSON. **Suite portée à 17 scripts.**

## Mesure et limites
Le calcul de SHA-256 sur le JSON original et celui de M3 a été effectué indépendamment dans un moteur JS avec la fonction SHA-256 vérifiée sur le vecteur connu `abc` : **empreintes égales**. Le nouveau test P22 a passé son exécution en JavaScript isolé, **avec un adaptateur crypto** ; **pas une exécution native Node ou GitHub Actions**. Sous Node, les tests utilisent le module `node:crypto` pour calculer eux-mêmes SHA-256. Les anciens snapshots de blob HTML restent des références historiques, pas des conditions futures de succès.

**Mission non terminée :** les 17 arbitrages demeurent en attente, l'exécution native de la suite de 17 tests reste à faire et la CI appartient à M5. **PROCHAINE PASSE : P23 — contre-épreuves sur les 17 scripts et vérification des raccordements entre chantiers, sans toucher aux branches M2/M3/M5.** Aucun QCM, moteur, UI ou workflow modifié, aucune fusion/publication.

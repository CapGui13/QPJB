# QPJB V2 — réduction des lancements GitHub Actions

**20 novembre 2026 — PR expérimentale #214.** Le nombre d'exécutions était excessif : un commit de documentation sur une PR volumineuse déclenchait environ 25 workflows, même si les filtres `paths` étaient présents dans les évènements `pull_request`. GitHub évalue ces filtres sur les fichiers modifiés dans l'ensemble de la PR, et non seulement ceux du dernier commit.

## Correction ciblée

Les **22 workflows historiques `qpjb-v2-*.yml`** ne se déclenchent désormais **que sur `push` de la branche de développement**, avec leurs filtres `paths` conservés pour les vrais scripts/tests/fichiers de données concernés. Leur chemin de workflow est retiré du filtre : changer uniquement leur configuration ne déclenche pas un nouveau test de toutes les anciennes phases. Les autres workflows de contrôle de production restent inchangés.

- Les tests V2 historiques sont donc **toujours exécutés quand leurs fichiers surveillés sont modifiés**, sans les doublons `pull_request`.
- Le test BA de navigation (3 jobs incluant Chromium/WebKit) conserve son exécution ciblée lors d'une modification des fichiers de navigation ou des tests.
- Les workflows `QPJB Training smoke`, `Quiz SEF - intégrité`, `QPJB Pages` et les opérations sur `main` restent inchangés.
- Les workflows ont encore `workflow_dispatch` mais, sur GitHub, le déclenchement manuel exige que leur définition existe sur la branche par défaut ; sur cette PR expérimentale, **le mode garanti est le push ciblé**.

Cette correction n'efface pas les anciennes archives et **n'augmente pas le quota de stockage** ; elle évite surtout de consommer des centaines de minutes sur des modifications documentaires. Aucune suppression des PR, du code source, des QCM ou des données des élèves ; aucune fusion/publication.

# Fiches comparatives S1–S5 — profils autonome, faible et aide (graine 47)

Les dix questions et leur ordre sont strictement identiques dans les deux bras. Les motifs de sélection sont ceux du moteur natif, et non une justification nouvelle de l’ordre (M2). Les mains sont données dans l’ordre ♠ ♥ ♦ ♣. Ces fiches sont des traces de simulation, pas une interface élève.

## Profil autonome

### S1

Avant : bibliothèque 4 disponibles, 4 pertinentes ; préparation proposée : Choisir la meilleure mineure (discovery) ; Savoir ne pas ouvrir (discovery) ; Choisir une majeure cinquième (discovery) ; Ouvrir de 1SA (discovery).

Après : bibliothèque 4 disponibles, 2 pertinentes ; rappel proposé : Choisir la meilleure mineure — erreur observée ; Savoir ne pas ouvrir — erreur observée.

HOLD avant/après : aucun.

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | skipped | nouveau : equilibre_ouvertures |
| 2 | SEF-002-3 | ouv.sa1 | ♠A R 8 6 / ♥D 8 5 / ♦R 10 6 / ♣R 6 5 | 1SA | correct | nouveau : equilibre_ouvertures |
| 3 | SEF-N014-1 | ouv.mineure | ♠7 2 / ♥V 8 6 4 / ♦A V 7 4 3 / ♣A R | 1♦ | correct | nouveau : equilibre_ouvertures |
| 4 | SEF-N024-1 | ouv.passe | ♠10 9 7 6 / ♥10 8 7 3 / ♦A 10 4 / ♣V 9 | Passe | correct | nouveau : equilibre_ouvertures |
| 5 | SEF-006-1 | ouv.majeure | ♠A V 10 6 3 / ♥D 10 / ♦10 9 6 3 / ♣A R | 1♠ | correct | nouveau : equilibre_ouvertures |
| 6 | SEF-PN26-M1-001 | ouv.mineure | ♠A D V 6 / ♥8 5 2 / ♦R D 7 / ♣V 9 4 | 1♣ | correct | nouveau : equilibre_ouvertures |
| 7 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | wrong | nouveau : equilibre_ouvertures |
| 8 | SEF-009-2 | ouv.mineure | ♠R 8 6 / ♥A R / ♦R 10 9 5 2 / ♣9 5 2 | 1♦ | correct | nouveau : equilibre_ouvertures |
| 9 | SEF-PN26-M1-002 | ouv.mineure | ♠R 9 3 / ♥A D 8 5 / ♦A 7 2 / ♣V 6 4 | 1♣ | wrong | nouveau : equilibre_ouvertures |
| 10 | SEF-007-2 | ouv.majeure | ♠9 2 / ♥A R D 5 2 / ♦A 6 3 2 / ♣9 8 | 1♥ | correct | nouveau : equilibre_ouvertures |

### S2

Avant : bibliothèque 9 disponibles, 5 pertinentes ; préparation proposée : Répondre naturellement à une mineure (discovery) ; Trouver le fit majeur huitième (discovery) ; Choisir la meilleure mineure (reminder).

Après : bibliothèque 7 disponibles, 4 pertinentes ; rappel proposé : Répondre naturellement à une mineure — erreur observée ; Évaluer la force de réponse à une majeure — erreur observée.

HOLD avant/après : majeur.base (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-PN26-M1-004 | ouv.mineure | ♠A 8 4 / ♥R 6 / ♦V 9 7 3 / ♣A D 10 5 | 1♦ | wrong | nouveau : equilibre_ouvertures |
| 2 | SEF-012-1 | ouv.mineure | ♠A V 8 4 / ♥D 5 3 / ♦D 8 4 / ♣R 10 5 | 1♣ | correct | nouveau : equilibre_ouvertures |
| 3 | SEF-V410-022 | majeur.base | ♠A R 6 3 / ♥3 2 / ♦9 5 4 2 / ♣8 5 3 | 1♠ | wrong | nouveau : nouveau_qcm |
| 4 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct + aide | revision : rappel_erreur_aide |
| 5 | SEF-018-2 | mineur.base | ♠V 4 3 / ♥10 9 7 4 / ♦R 10 7 2 / ♣A 5 | 1♥ | correct | nouveau : nouveau_qcm |
| 6 | SEF-022-1 | mineur.base | ♠10 8 2 / ♥10 9 5 / ♦R 10 8 / ♣A D 10 3 | 1SA | wrong | nouveau : nouveau_qcm |
| 7 | SEF-028-1 | majeur.soutien | ♠10 6 5 / ♥V 6 5 / ♦A V 7 2 / ♣D 4 2 | 2♠ | correct | nouveau : nouveau_qcm |
| 8 | SEF-N025-2 | mineur.base | ♠R 8 6 3 / ♥A 7 4 / ♦D 10 9 / ♣5 3 2 | 1♠ | wrong | nouveau : nouveau_qcm |
| 9 | SEF-N042-1 | mineur.base | ♠A 8 4 / ♥R 10 4 / ♦V 10 7 3 / ♣8 6 3 | 1SA | correct | nouveau : nouveau_qcm |
| 10 | SEF-PN26-M1-005 | majeur.soutien | ♠D 9 7 4 / ♥R 8 5 / ♦D 7 3 / ♣9 6 2 | 2♥ | correct | nouveau : nouveau_qcm |

### S3

Avant : bibliothèque 9 disponibles, 5 pertinentes ; préparation proposée : Trouver le fit majeur huitième (reminder) ; Ouvrir de 2SA (discovery) ; Répondre naturellement à une mineure (reminder).

Après : bibliothèque 8 disponibles, 4 pertinentes ; rappel proposé : Répondre naturellement à une mineure — erreur observée ; Choisir la meilleure mineure — erreur observée.

HOLD avant/après : ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.sa2 (optional-load-limit) ; majeur.soutien (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-030-1 | majeur.soutien | ♠D 4 2 / ♥8 7 3 / ♦V 10 5 2 / ♣9 8 4 | Passe | correct | nouveau : nouveau_qcm |
| 2 | SEF-016-1 | mineur.base | ♠9 6 3 2 / ♥R D 4 / ♦A 10 2 / ♣10 7 5 | 1♠ | correct | nouveau : renforcement_lacune |
| 3 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct | revision : rappel_erreur_aide |
| 4 | SEF-005-2 | ouv.sa2 | ♠R 8 7 / ♥A 8 4 / ♦A R 7 4 / ♣A R 10 | 2SA | wrong | nouveau : transfert_contexte |
| 5 | SEF-C-006 | majeur.soutien | ♠V 9 3 / ♥D 8 4 2 / ♦R 7 5 / ♣10 8 4 | 2♠ | correct | nouveau : nouveau_qcm |
| 6 | SEF-N012-1 | ouv.mineure | ♠A V 8 2 / ♥A 10 9 3 / ♦10 2 / ♣A V 3 | 1♣ | wrong | nouveau : renforcement_lacune |
| 7 | SEF-N026-1 | mineur.base | ♠10 7 3 / ♥V 9 7 5 2 / ♦A 9 3 / ♣R 7 | 1♥ | wrong | nouveau : renforcement_lacune |
| 8 | SEF-N053-2 | majeur.soutien | ♠8 7 2 / ♥D 10 8 / ♦V 9 5 2 / ♣R 7 3 | 2♠ | correct + erreur libre | nouveau : nouveau_qcm |
| 9 | SEF-004-1 | ouv.sa2 | ♠R V 10 4 / ♥R D 3 / ♦A D 6 / ♣A D 7 | 2SA | correct | nouveau : transfert_contexte |
| 10 | SEF-N057-1 | majeur.soutien | ♠10 5 4 / ♥7 6 5 / ♦V 9 8 3 / ♣9 8 6 | Passe | correct | nouveau : nouveau_qcm |

### S4

Avant : bibliothèque 10 disponibles, 6 pertinentes ; préparation proposée : Évaluer les chances de manche après 1SA (discovery) ; Reconnaître un soutien mineur simple (discovery) ; Choisir une majeure cinquième (reminder).

Après : bibliothèque 10 disponibles, 2 pertinentes ; rappel proposé : Ouvrir de 1SA — erreur observée ; Évaluer les chances de manche après 1SA — erreur observée.

HOLD avant/après : mineur.base (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.sa1 (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-033-1 | sa1.seuil | ♠6 5 4 / ♥9 5 4 / ♦A 7 3 2 / ♣A D 8 | 3SA | correct | nouveau : nouveau_qcm |
| 2 | SEF-Q26-M1-010 | mineur.soutien | ♠R 8 4 / ♥6 / ♦A 9 7 5 3 / ♣10 8 4 2 | 2♦ | correct | nouveau : nouveau_qcm |
| 3 | SEF-N016-2 | ouv.majeure | ♠A V 5 3 2 / ♥A 8 6 4 / ♦D 4 / ♣R 5 | 1♠ | correct | revision : rappel_nouvelle_situation |
| 4 | SEF-N088-1 | sa1.seuil | ♠V 9 2 / ♥10 7 3 / ♦9 8 7 / ♣R V 7 5 | Passe | correct | nouveau : nouveau_qcm |
| 5 | SEF-N017-2 | ouv.sa1 | ♠A R 2 / ♥10 9 6 / ♦D 8 7 5 / ♣A D 5 | 1SA | wrong | revision : rappel_nouvelle_situation |
| 6 | SEF-N046-3 | mineur.base | ♠R 2 / ♥D V 10 / ♦D 8 7 6 4 / ♣V 6 4 | 1♦ | correct | nouveau : renforcement_lacune |
| 7 | SEF-N091-3 | sa1.seuil | ♠9 3 2 / ♥R 5 3 / ♦A V 6 5 3 / ♣9 6 | 2SA | wrong | nouveau : nouveau_qcm |
| 8 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | correct | revision : rappel_erreur_aide |
| 9 | SEF-020-1 | mineur.soutien | ♠R 9 2 / ♥5 / ♦V 8 7 6 / ♣D V 9 8 4 | 2♣ | correct | nouveau : transfert_contexte |
| 10 | SEF-N001-3 | ouv.majeure | ♠A 8 / ♥A V 8 5 3 / ♦7 6 3 / ♣R D 4 | 1♥ | correct | revision : rappel_nouvelle_situation |

### S5

Avant : bibliothèque 14 disponibles, 6 pertinentes ; préparation proposée : Redemander 1SA avec une ouverture minimale (discovery) ; Répondre naturellement à une mineure (reminder) ; Tenir compte de la position d'ouverture (discovery).

Après : bibliothèque 14 disponibles, 1 pertinentes ; rappel proposé : Rechercher un fit majeur 4–4 — aide ou première enchère erronée observée.

HOLD avant/après : sa1.stayman (optional-load-limit) ; sa1.texas (optional-load-limit) ; ouv.mineure (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N084-1 | sa1.texas | ♠V 9 / ♥V 10 4 3 2 / ♦A D 9 / ♣R 10 5 | 2♦ | correct | nouveau : transfert_contexte |
| 2 | SEF-N117-1 | red.base | ♠R 9 3 / ♥D 10 2 / ♦A 10 9 5 / ♣A 10 4 | 1SA | correct | nouveau : nouveau_qcm |
| 3 | SEF-N025-2 | mineur.base | ♠R 8 6 3 / ♥A 7 4 / ♦D 10 9 / ♣5 3 2 | 1♠ | correct | revision : rappel_erreur_aide |
| 4 | SEF-050-2 | red.base | ♠R 9 7 6 5 3 / ♥D 3 / ♦A 6 3 / ♣A 4 | 2♠ | correct | nouveau : nouveau_qcm |
| 5 | SEF-N095-1 | sa1.stayman | ♠R 6 5 / ♥R V 6 5 / ♦D 10 6 4 / ♣9 5 | 2♣ | correct + erreur libre | nouveau : transfert_contexte |
| 6 | SEF-V49-021 | red.base | ♠6 5 4 / ♥R D V 5 / ♦R 10 / ♣A V 8 7 | 2♥ | correct | nouveau : nouveau_qcm |
| 7 | SEF-N005-3 | ouv.mineure | ♠6 5 3 / ♥A R 10 / ♦10 6 / ♣A D 9 5 4 | 1♣ | correct | nouveau : renforcement_lacune |
| 8 | SEF-N036-1 | mineur.base | ♠A R D / ♥9 8 7 6 4 / ♦10 9 6 / ♣V 5 | 1♥ | correct | nouveau : renforcement_lacune |
| 9 | SEF-V49-036 | red.base | ♠7 6 2 / ♥A 6 / ♦A 8 / ♣A V 9 8 4 2 | 2♣ | correct | nouveau : nouveau_qcm |
| 10 | SEF-Q26-M1-004 | ouv.position | ♠V 9 3 / ♥D 8 7 4 2 / ♦A R 6 / ♣V 8 | Passe | correct | nouveau : nouveau_qcm |

## Profil faible

### S1

Avant : bibliothèque 4 disponibles, 4 pertinentes ; préparation proposée : Choisir la meilleure mineure (discovery) ; Savoir ne pas ouvrir (discovery) ; Choisir une majeure cinquième (discovery) ; Ouvrir de 1SA (discovery).

Après : bibliothèque 4 disponibles, 4 pertinentes ; rappel proposé : Savoir ne pas ouvrir — erreur observée ; Choisir la meilleure mineure — erreur observée.

HOLD avant/après : ouv.sa1 (optional-load-limit) ; ouv.majeure (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | skipped | nouveau : equilibre_ouvertures |
| 2 | SEF-002-3 | ouv.sa1 | ♠A R 8 6 / ♥D 8 5 / ♦R 10 6 / ♣R 6 5 | 1SA | wrong | nouveau : equilibre_ouvertures |
| 3 | SEF-N014-1 | ouv.mineure | ♠7 2 / ♥V 8 6 4 / ♦A V 7 4 3 / ♣A R | 1♦ | correct | nouveau : equilibre_ouvertures |
| 4 | SEF-N024-1 | ouv.passe | ♠10 9 7 6 / ♥10 8 7 3 / ♦A 10 4 / ♣V 9 | Passe | wrong | nouveau : equilibre_ouvertures |
| 5 | SEF-006-1 | ouv.majeure | ♠A V 10 6 3 / ♥D 10 / ♦10 9 6 3 / ♣A R | 1♠ | correct + aide | nouveau : equilibre_ouvertures |
| 6 | SEF-PN26-M1-001 | ouv.mineure | ♠A D V 6 / ♥8 5 2 / ♦R D 7 / ♣V 9 4 | 1♣ | skipped | nouveau : equilibre_ouvertures |
| 7 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | wrong | nouveau : equilibre_ouvertures |
| 8 | SEF-009-2 | ouv.mineure | ♠R 8 6 / ♥A R / ♦R 10 9 5 2 / ♣9 5 2 | 1♦ | correct | nouveau : equilibre_ouvertures |
| 9 | SEF-PN26-M1-002 | ouv.mineure | ♠R 9 3 / ♥A D 8 5 / ♦A 7 2 / ♣V 6 4 | 1♣ | wrong | nouveau : equilibre_ouvertures |
| 10 | SEF-007-2 | ouv.majeure | ♠9 2 / ♥A R D 5 2 / ♦A 6 3 2 / ♣9 8 | 1♥ | correct | nouveau : equilibre_ouvertures |

### S2

Avant : bibliothèque 9 disponibles, 5 pertinentes ; préparation proposée : Répondre naturellement à une mineure (discovery) ; Trouver le fit majeur huitième (discovery) ; Choisir la meilleure mineure (reminder).

Après : bibliothèque 7 disponibles, 4 pertinentes ; rappel proposé : Répondre naturellement à une mineure — erreur observée ; Trouver le fit majeur huitième — erreur observée.

HOLD avant/après : majeur.base (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.mineure (optional-load-limit) ; majeur.base (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-PN26-M1-004 | ouv.mineure | ♠A 8 4 / ♥R 6 / ♦V 9 7 3 / ♣A D 10 5 | 1♦ | wrong | nouveau : equilibre_ouvertures |
| 2 | SEF-012-1 | ouv.mineure | ♠A V 8 4 / ♥D 5 3 / ♦D 8 4 / ♣R 10 5 | 1♣ | wrong | nouveau : equilibre_ouvertures |
| 3 | SEF-V410-022 | majeur.base | ♠A R 6 3 / ♥3 2 / ♦9 5 4 2 / ♣8 5 3 | 1♠ | wrong | nouveau : nouveau_qcm |
| 4 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | skipped | revision : rappel_erreur_aide |
| 5 | SEF-022-1 | mineur.base | ♠10 8 2 / ♥10 9 5 / ♦R 10 8 / ♣A D 10 3 | 1SA | wrong | nouveau : nouveau_qcm |
| 6 | SEF-018-2 | mineur.base | ♠V 4 3 / ♥10 9 7 4 / ♦R 10 7 2 / ♣A 5 | 1♥ | wrong | nouveau : nouveau_qcm |
| 7 | SEF-PN26-M1-005 | majeur.soutien | ♠D 9 7 4 / ♥R 8 5 / ♦D 7 3 / ♣9 6 2 | 2♥ | wrong | nouveau : nouveau_qcm |
| 8 | SEF-N042-1 | mineur.base | ♠A 8 4 / ♥R 10 4 / ♦V 10 7 3 / ♣8 6 3 | 1SA | wrong | nouveau : nouveau_qcm |
| 9 | SEF-N025-2 | mineur.base | ♠R 8 6 3 / ♥A 7 4 / ♦D 10 9 / ♣5 3 2 | 1♠ | wrong | nouveau : nouveau_qcm |
| 10 | SEF-028-1 | majeur.soutien | ♠10 6 5 / ♥V 6 5 / ♦A V 7 2 / ♣D 4 2 | 2♠ | wrong | nouveau : nouveau_qcm |

### S3

Avant : bibliothèque 9 disponibles, 6 pertinentes ; préparation proposée : Répondre naturellement à une mineure (reminder) ; Ouvrir de 2SA (discovery) ; Trouver le fit majeur huitième (reminder).

Après : bibliothèque 8 disponibles, 5 pertinentes ; rappel proposé : Ouvrir de 2SA — erreur et recours à une aide observés ; Trouver le fit majeur huitième — erreur observée.

HOLD avant/après : majeur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit) ; mineur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; majeur.base (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-005-2 | ouv.sa2 | ♠R 8 7 / ♥A 8 4 / ♦A R 7 4 / ♣A R 10 | 2SA | wrong | nouveau : transfert_contexte |
| 2 | SEF-V49-013 | majeur.base | ♠D V 7 4 2 / ♥R / ♦V 10 9 4 / ♣7 6 2 | 1♠ | correct + aide | nouveau : renforcement_lacune |
| 3 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct | revision : rappel_erreur_aide |
| 4 | SEF-N046-3 | mineur.base | ♠R 2 / ♥D V 10 / ♦D 8 7 6 4 / ♣V 6 4 | 1♦ | skipped | nouveau : renforcement_lacune |
| 5 | SEF-V49-010 | majeur.soutien | ♠V 5 / ♥D 7 5 / ♦A 10 9 6 / ♣7 5 4 3 | 2♥ | skipped | nouveau : renforcement_lacune |
| 6 | SEF-N042-1 | mineur.base | ♠A 8 4 / ♥R 10 4 / ♦V 10 7 3 / ♣8 6 3 | 1SA | skipped | revision : rappel_erreur_aide |
| 7 | SEF-N012-1 | ouv.mineure | ♠A V 8 2 / ♥A 10 9 3 / ♦10 2 / ♣A V 3 | 1♣ | wrong | nouveau : renforcement_lacune |
| 8 | SEF-N026-1 | mineur.base | ♠10 7 3 / ♥V 9 7 5 2 / ♦A 9 3 / ♣R 7 | 1♥ | wrong | nouveau : renforcement_lacune |
| 9 | SEF-030-1 | majeur.soutien | ♠D 4 2 / ♥8 7 3 / ♦V 10 5 2 / ♣9 8 4 | Passe | wrong | nouveau : renforcement_lacune |
| 10 | SEF-004-1 | ouv.sa2 | ♠R V 10 4 / ♥R D 3 / ♦A D 6 / ♣A D 7 | 2SA | correct + aide | nouveau : transfert_contexte |

### S4

Avant : bibliothèque 10 disponibles, 6 pertinentes ; préparation proposée : Évaluer les chances de manche après 1SA (discovery) ; Reconnaître un soutien mineur simple (discovery) ; Trouver le fit majeur huitième (reminder).

Après : bibliothèque 10 disponibles, 5 pertinentes ; rappel proposé : Trouver le fit majeur huitième — erreur observée ; Répondre naturellement à une mineure — erreur observée.

HOLD avant/après : mineur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.passe (optional-load-limit) ; sa1.seuil (optional-load-limit) ; mineur.soutien (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-020-1 | mineur.soutien | ♠R 9 2 / ♥5 / ♦V 8 7 6 / ♣D V 9 8 4 | 2♣ | correct + aide | nouveau : transfert_contexte |
| 2 | SEF-N091-3 | sa1.seuil | ♠9 3 2 / ♥R 5 3 / ♦A V 6 5 3 / ♣9 6 | 2SA | wrong | nouveau : nouveau_qcm |
| 3 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | wrong | revision : rappel_erreur_aide |
| 4 | SEF-027-2 | majeur.soutien | ♠10 9 8 3 / ♥D V 10 / ♦V 10 9 7 / ♣D 3 | 2♠ | wrong | nouveau : renforcement_lacune |
| 5 | SEF-016-1 | mineur.base | ♠9 6 3 2 / ♥R D 4 / ♦A 10 2 / ♣10 7 5 | 1♠ | wrong | nouveau : renforcement_lacune |
| 6 | SEF-PN26-M1-002 | ouv.mineure | ♠R 9 3 / ♥A D 8 5 / ♦A 7 2 / ♣V 6 4 | 1♣ | skipped | revision : rappel_erreur_aide |
| 7 | SEF-N049-3 | majeur.soutien | ♠7 2 / ♥R 10 9 5 / ♦D 10 9 8 / ♣D 9 5 | 2♥ | correct | nouveau : renforcement_lacune |
| 8 | SEF-N088-1 | sa1.seuil | ♠V 9 2 / ♥10 7 3 / ♦9 8 7 / ♣R V 7 5 | Passe | correct | nouveau : nouveau_qcm |
| 9 | SEF-Q26-M1-010 | mineur.soutien | ♠R 8 4 / ♥6 / ♦A 9 7 5 3 / ♣10 8 4 2 | 2♦ | correct | nouveau : transfert_contexte |
| 10 | SEF-033-1 | sa1.seuil | ♠6 5 4 / ♥9 5 4 / ♦A 7 3 2 / ♣A D 8 | 3SA | correct | nouveau : nouveau_qcm |

### S5

Avant : bibliothèque 14 disponibles, 8 pertinentes ; préparation proposée : Redemander 1SA avec une ouverture minimale (discovery) ; Rechercher un fit majeur 4–4 (discovery) ; Utiliser le Texas majeur sur 1SA (discovery).

Après : bibliothèque 13 disponibles, 5 pertinentes ; rappel proposé : Redemander 1SA avec une ouverture minimale — erreur et recours à une aide observés ; Utiliser le Texas majeur sur 1SA — erreur observée.

HOLD avant/après : majeur.base (optional-load-limit) ; majeur.soutien (optional-load-limit) ; mineur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; sa1.seuil (optional-load-limit) ; majeur.soutien (optional-load-limit) ; mineur.base (optional-load-limit) ; sa1.stayman (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N084-1 | sa1.texas | ♠V 9 / ♥V 10 4 3 2 / ♦A D 9 / ♣R 10 5 | 2♦ | wrong | nouveau : transfert_contexte |
| 2 | SEF-V49-021 | red.base | ♠6 5 4 / ♥R D V 5 / ♦R 10 / ♣A V 8 7 | 2♥ | correct + aide | nouveau : nouveau_qcm |
| 3 | SEF-PN26-M1-001 | ouv.mineure | ♠A D V 6 / ♥8 5 2 / ♦R D 7 / ♣V 9 4 | 1♣ | correct | revision : rappel_erreur_aide |
| 4 | SEF-N068-1 | majeur.base | ♠10 5 4 / ♥V 10 / ♦V 9 4 3 / ♣9 8 6 4 | Passe | correct | nouveau : renforcement_lacune |
| 5 | SEF-N092-2 | sa1.seuil | ♠A V 4 / ♥R D 8 / ♦V 8 7 3 / ♣D 10 7 | 3SA | correct | nouveau : renforcement_lacune |
| 6 | SEF-N025-2 | mineur.base | ♠R 8 6 3 / ♥A 7 4 / ♦D 10 9 / ♣5 3 2 | 1♠ | correct + aide | revision : rappel_erreur_aide |
| 7 | SEF-N117-1 | red.base | ♠R 9 3 / ♥D 10 2 / ♦A 10 9 5 / ♣A 10 4 | 1SA | correct + aide | nouveau : nouveau_qcm |
| 8 | SEF-N095-1 | sa1.stayman | ♠R 6 5 / ♥R V 6 5 / ♦D 10 6 4 / ♣9 5 | 2♣ | correct + aide | nouveau : transfert_contexte |
| 9 | SEF-N055-1 | majeur.soutien | ♠V 10 5 4 / ♥10 9 8 / ♦A D 5 / ♣V 9 4 | 2♠ | correct + aide | nouveau : renforcement_lacune |
| 10 | SEF-V49-036 | red.base | ♠7 6 2 / ♥A 6 / ♦A 8 / ♣A V 9 8 4 2 | 2♣ | wrong | nouveau : nouveau_qcm |

## Profil aide

### S1

Avant : bibliothèque 4 disponibles, 4 pertinentes ; préparation proposée : Choisir la meilleure mineure (discovery) ; Savoir ne pas ouvrir (discovery) ; Choisir une majeure cinquième (discovery) ; Ouvrir de 1SA (discovery).

Après : bibliothèque 4 disponibles, 4 pertinentes ; rappel proposé : Savoir ne pas ouvrir — aide ou première enchère erronée observée ; Choisir la meilleure mineure — erreur observée.

HOLD avant/après : ouv.sa1 (optional-load-limit) ; ouv.majeure (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | skipped | nouveau : equilibre_ouvertures |
| 2 | SEF-002-3 | ouv.sa1 | ♠A R 8 6 / ♥D 8 5 / ♦R 10 6 / ♣R 6 5 | 1SA | wrong | nouveau : equilibre_ouvertures |
| 3 | SEF-N014-1 | ouv.mineure | ♠7 2 / ♥V 8 6 4 / ♦A V 7 4 3 / ♣A R | 1♦ | correct | nouveau : equilibre_ouvertures |
| 4 | SEF-N024-1 | ouv.passe | ♠10 9 7 6 / ♥10 8 7 3 / ♦A 10 4 / ♣V 9 | Passe | correct + aide | nouveau : equilibre_ouvertures |
| 5 | SEF-006-1 | ouv.majeure | ♠A V 10 6 3 / ♥D 10 / ♦10 9 6 3 / ♣A R | 1♠ | correct + aide | nouveau : equilibre_ouvertures |
| 6 | SEF-PN26-M1-001 | ouv.mineure | ♠A D V 6 / ♥8 5 2 / ♦R D 7 / ♣V 9 4 | 1♣ | skipped | nouveau : equilibre_ouvertures |
| 7 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct + aide | nouveau : equilibre_ouvertures |
| 8 | SEF-009-2 | ouv.mineure | ♠R 8 6 / ♥A R / ♦R 10 9 5 2 / ♣9 5 2 | 1♦ | correct | nouveau : equilibre_ouvertures |
| 9 | SEF-PN26-M1-002 | ouv.mineure | ♠R 9 3 / ♥A D 8 5 / ♦A 7 2 / ♣V 6 4 | 1♣ | wrong | nouveau : equilibre_ouvertures |
| 10 | SEF-007-2 | ouv.majeure | ♠9 2 / ♥A R D 5 2 / ♦A 6 3 2 / ♣9 8 | 1♥ | correct | nouveau : equilibre_ouvertures |

### S2

Avant : bibliothèque 9 disponibles, 5 pertinentes ; préparation proposée : Répondre naturellement à une mineure (discovery) ; Trouver le fit majeur huitième (discovery) ; Choisir la meilleure mineure (reminder).

Après : bibliothèque 7 disponibles, 5 pertinentes ; rappel proposé : Répondre naturellement à une mineure — erreur et recours à une aide observés ; Évaluer la force de réponse à une majeure — erreur observée.

HOLD avant/après : majeur.base (optional-load-limit) ; ouv.passe (optional-load-limit) ; majeur.soutien (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-012-1 | ouv.mineure | ♠A V 8 4 / ♥D 5 3 / ♦D 8 4 / ♣R 10 5 | 1♣ | correct | nouveau : equilibre_ouvertures |
| 2 | SEF-PN26-M1-004 | ouv.mineure | ♠A 8 4 / ♥R 6 / ♦V 9 7 3 / ♣A D 10 5 | 1♦ | correct + aide | nouveau : equilibre_ouvertures |
| 3 | SEF-V410-022 | majeur.base | ♠A R 6 3 / ♥3 2 / ♦9 5 4 2 / ♣8 5 3 | 1♠ | wrong | nouveau : nouveau_qcm |
| 4 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct + aide | revision : rappel_erreur_aide |
| 5 | SEF-N042-1 | mineur.base | ♠A 8 4 / ♥R 10 4 / ♦V 10 7 3 / ♣8 6 3 | 1SA | wrong | nouveau : nouveau_qcm |
| 6 | SEF-N025-2 | mineur.base | ♠R 8 6 3 / ♥A 7 4 / ♦D 10 9 / ♣5 3 2 | 1♠ | correct + aide | nouveau : nouveau_qcm |
| 7 | SEF-028-1 | majeur.soutien | ♠10 6 5 / ♥V 6 5 / ♦A V 7 2 / ♣D 4 2 | 2♠ | correct | nouveau : nouveau_qcm |
| 8 | SEF-022-1 | mineur.base | ♠10 8 2 / ♥10 9 5 / ♦R 10 8 / ♣A D 10 3 | 1SA | correct + aide | nouveau : nouveau_qcm |
| 9 | SEF-018-2 | mineur.base | ♠V 4 3 / ♥10 9 7 4 / ♦R 10 7 2 / ♣A 5 | 1♥ | correct | nouveau : nouveau_qcm |
| 10 | SEF-PN26-M1-005 | majeur.soutien | ♠D 9 7 4 / ♥R 8 5 / ♦D 7 3 / ♣9 6 2 | 2♥ | wrong | nouveau : nouveau_qcm |

### S3

Avant : bibliothèque 9 disponibles, 6 pertinentes ; préparation proposée : Répondre naturellement à une mineure (reminder) ; Ouvrir de 2SA (discovery) ; Évaluer la force de réponse à une majeure (reminder).

Après : bibliothèque 8 disponibles, 6 pertinentes ; rappel proposé : Évaluer la force de réponse à une majeure — erreur et recours à une aide observés ; Répondre naturellement à une mineure — erreur et recours à une aide observés.

HOLD avant/après : majeur.soutien (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit) ; ouv.sa2 (optional-load-limit) ; majeur.soutien (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-005-2 | ouv.sa2 | ♠R 8 7 / ♥A 8 4 / ♦A R 7 4 / ♣A R 10 | 2SA | correct + aide | nouveau : transfert_contexte |
| 2 | SEF-N046-3 | mineur.base | ♠R 2 / ♥D V 10 / ♦D 8 7 6 4 / ♣V 6 4 | 1♦ | correct + erreur libre | nouveau : renforcement_lacune |
| 3 | SEF-N023-1 | ouv.passe | ♠10 9 / ♥R D V 6 4 / ♦9 5 4 2 / ♣5 4 | Passe | correct + aide | revision : rappel_erreur_aide |
| 4 | SEF-V49-010 | majeur.soutien | ♠V 5 / ♥D 7 5 / ♦A 10 9 6 / ♣7 5 4 3 | 2♥ | correct + aide | nouveau : renforcement_lacune |
| 5 | SEF-N012-1 | ouv.mineure | ♠A V 8 2 / ♥A 10 9 3 / ♦10 2 / ♣A V 3 | 1♣ | correct + aide | nouveau : renforcement_lacune |
| 6 | SEF-N042-1 | mineur.base | ♠A 8 4 / ♥R 10 4 / ♦V 10 7 3 / ♣8 6 3 | 1SA | skipped | revision : rappel_erreur_aide |
| 7 | SEF-N081-1 | majeur.base | ♠8 6 / ♥D 8 7 6 5 / ♦10 6 4 / ♣V 8 3 | Passe | wrong | nouveau : renforcement_lacune |
| 8 | SEF-004-1 | ouv.sa2 | ♠R V 10 4 / ♥R D 3 / ♦A D 6 / ♣A D 7 | 2SA | correct + aide | nouveau : transfert_contexte |
| 9 | SEF-N026-1 | mineur.base | ♠10 7 3 / ♥V 9 7 5 2 / ♦A 9 3 / ♣R 7 | 1♥ | wrong | nouveau : renforcement_lacune |
| 10 | SEF-V49-013 | majeur.base | ♠D V 7 4 2 / ♥R / ♦V 10 9 4 / ♣7 6 2 | 1♠ | correct + aide | nouveau : renforcement_lacune |

### S4

Avant : bibliothèque 10 disponibles, 6 pertinentes ; préparation proposée : Évaluer les chances de manche après 1SA (discovery) ; Reconnaître un soutien mineur simple (discovery) ; Trouver le fit majeur huitième (reminder).

Après : bibliothèque 10 disponibles, 5 pertinentes ; rappel proposé : Évaluer les chances de manche après 1SA — aide ou première enchère erronée observée ; Trouver le fit majeur huitième — aide ou première enchère erronée observée.

HOLD avant/après : mineur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit) ; mineur.soutien (optional-load-limit) ; ouv.mineure (optional-load-limit) ; ouv.passe (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N091-3 | sa1.seuil | ♠9 3 2 / ♥R 5 3 / ♦A V 6 5 3 / ♣9 6 | 2SA | correct + aide | nouveau : nouveau_qcm |
| 2 | SEF-N049-3 | majeur.soutien | ♠7 2 / ♥R 10 9 5 / ♦D 10 9 8 / ♣D 9 5 | 2♥ | correct | nouveau : renforcement_lacune |
| 3 | SEF-PN26-M1-002 | ouv.mineure | ♠R 9 3 / ♥A D 8 5 / ♦A 7 2 / ♣V 6 4 | 1♣ | correct + aide | revision : rappel_erreur_aide |
| 4 | SEF-N088-1 | sa1.seuil | ♠V 9 2 / ♥10 7 3 / ♦9 8 7 / ♣R V 7 5 | Passe | correct | nouveau : nouveau_qcm |
| 5 | SEF-Q26-M1-010 | mineur.soutien | ♠R 8 4 / ♥6 / ♦A 9 7 5 3 / ♣10 8 4 2 | 2♦ | correct | nouveau : transfert_contexte |
| 6 | SEF-N022-1 | ouv.passe | ♠8 7 2 / ♥10 8 5 / ♦A V 9 4 / ♣10 8 5 | Passe | correct + aide | revision : rappel_erreur_aide |
| 7 | SEF-016-1 | mineur.base | ♠9 6 3 2 / ♥R D 4 / ♦A 10 2 / ♣10 7 5 | 1♠ | correct | nouveau : renforcement_lacune |
| 8 | SEF-027-2 | majeur.soutien | ♠10 9 8 3 / ♥D V 10 / ♦V 10 9 7 / ♣D 3 | 2♠ | correct + aide | nouveau : renforcement_lacune |
| 9 | SEF-020-1 | mineur.soutien | ♠R 9 2 / ♥5 / ♦V 8 7 6 / ♣D V 9 8 4 | 2♣ | correct + aide | nouveau : transfert_contexte |
| 10 | SEF-033-1 | sa1.seuil | ♠6 5 4 / ♥9 5 4 / ♦A 7 3 2 / ♣A D 8 | 3SA | correct + aide | nouveau : nouveau_qcm |

### S5

Avant : bibliothèque 14 disponibles, 8 pertinentes ; préparation proposée : Redemander 1SA avec une ouverture minimale (discovery) ; Rechercher un fit majeur 4–4 (discovery) ; Utiliser le Texas majeur sur 1SA (discovery).

Après : bibliothèque 13 disponibles, 5 pertinentes ; rappel proposé : Redemander 1SA avec une ouverture minimale — aide ou première enchère erronée observée ; Évaluer la force de réponse à une majeure — aide ou première enchère erronée observée.

HOLD avant/après : majeur.base (optional-load-limit) ; majeur.soutien (optional-load-limit) ; mineur.base (optional-load-limit) ; ouv.mineure (optional-load-limit) ; sa1.seuil (optional-load-limit) ; majeur.soutien (optional-load-limit) ; sa1.stayman (optional-load-limit) ; sa1.texas (optional-load-limit).

| Position | ID | Concept | Main (♠ ♥ ♦ ♣) | Enchère | Résultat simulé | Sélection native |
|---:|---|---|---|---|---|---|
| 1 | SEF-N084-1 | sa1.texas | ♠V 9 / ♥V 10 4 3 2 / ♦A D 9 / ♣R 10 5 | 2♦ | correct + aide | nouveau : transfert_contexte |
| 2 | SEF-N117-1 | red.base | ♠R 9 3 / ♥D 10 2 / ♦A 10 9 5 / ♣A 10 4 | 1SA | correct + aide | nouveau : nouveau_qcm |
| 3 | SEF-V410-022 | majeur.base | ♠A R 6 3 / ♥3 2 / ♦9 5 4 2 / ♣8 5 3 | 1♠ | correct + aide | revision : rappel_erreur_aide |
| 4 | SEF-N092-2 | sa1.seuil | ♠A V 4 / ♥R D 8 / ♦V 8 7 3 / ♣D 10 7 | 3SA | correct | nouveau : renforcement_lacune |
| 5 | SEF-V49-004 | mineur.base | ♠R 6 3 / ♥V 6 / ♦R 9 7 5 2 / ♣4 3 2 | 1♦ | correct | nouveau : renforcement_lacune |
| 6 | SEF-PN26-M1-001 | ouv.mineure | ♠A D V 6 / ♥8 5 2 / ♦R D 7 / ♣V 9 4 | 1♣ | correct | revision : rappel_erreur_aide |
| 7 | SEF-V49-021 | red.base | ♠6 5 4 / ♥R D V 5 / ♦R 10 / ♣A V 8 7 | 2♥ | correct + aide | nouveau : nouveau_qcm |
| 8 | SEF-N095-1 | sa1.stayman | ♠R 6 5 / ♥R V 6 5 / ♦D 10 6 4 / ♣9 5 | 2♣ | correct + aide | nouveau : transfert_contexte |
| 9 | SEF-050-2 | red.base | ♠R 9 7 6 5 3 / ♥D 3 / ♦A 6 3 / ♣A 4 | 2♠ | correct + aide | nouveau : nouveau_qcm |
| 10 | SEF-030-1 | majeur.soutien | ♠D 4 2 / ♥8 7 3 / ♦V 10 5 2 / ♣9 8 4 | Passe | correct + aide | nouveau : renforcement_lacune |

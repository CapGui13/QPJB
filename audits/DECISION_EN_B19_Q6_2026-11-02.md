# Entraînement — décision provisoire B19-Q6 (2 novembre 2026)

Fiche : `EN-2sa-006`, original B19-Q6, branche `main`.

## Analyse et sources

Le rapport `RAPPORT_AUDIT_PASSE03.md` du dépôt privé `CapGui13/QPJBTraining` a confronté la page 1 des PDF originaux B19 (sujet et corrigé). Le corrigé d'origine donne **4SA**, invitation non forcing au petit chelem.

Main Sud : ♠ RD104 = 5 H ; ♥ AD5 = 6 H ; ♦ D7 = 2 H ; ♣ DV84 = 3 H, total **16 H** et distribution régulière 4–3–2–4. Séquence : Nord 2SA (20–21 H) – Sud 3♣ Stayman – Nord 3♦ sans majeure quatrième – Sud ?. Force combinée : **36–37 H**. Le refus d'un petit chelem par l'ouvreur minimum serait incohérent.

En comparaison, le même cours B19-Q4 préconise **5SA** face à 2SA avec 16 H. Références indépendantes pour les invitations quantitatives : [Leçon 14, Club de Charbonnières](https://bridgeclubcharbonnieres.fr/Bridge_initiation/Cours_1ere_annee/Bridge_initiation_Lecon_numero_14.pdf) et [Le jeu à SA — Synthèse](https://stph.scenari-community.org/bridge/002-1/co/002-1-Synthese.html). Avec 2SA 20–21, 4SA invite au petit chelem avec environ 12 H, alors que 5SA invite au grand avec 16 H (Nord minimum : 6SA, maximum : 7SA).

**Verdict :** anomalie de seuil quantitatif confirmée ; **5SA est la correction SEF proposée**. Le PDF original affirmant 4SA, ne pas présenter une correction silencieuse comme une transcription fidèle.

## Décision et changements appliqués

- **Quarantaine pédagogique temporaire** : `EN-2sa-006.reviewStatus` passe de `transcrit_source` à `a_verifier` ; `reason` et `pedagogicalReview_20261102` consignent la contradiction.
- Conservation du texte original, des choix, de `correct:"4SA"`, de la main, de la séquence, de l'identifiant et de tous les résultats locaux. Aucune réponse ancienne n'est remise à faux rétroactivement.
- Entraînement : **563 exercices EN stockés, 559 accessibles, 4 masqués** ; catégorie `2sa` **12 accessibles**. Jeu de la carte inchangé : 114 stockés / 111 accessibles.
- Synchronisation banque maître/module différé/bootstrap/générateur ; mise à jour versionnée du cache PWA et des assertions des tests, dont l'accès bloqué à B19-Q6.

## Suite du chantier

Faire approuver une réécriture éditoriale unique donnant **5SA** et une explication de proposition de grand chelem, tout en prévoyant la révision ciblée des anciennes progressions de cet ID ; réactiver ensuite la fiche. Les 12 autres `quarantineReason` sur exercices accessibles restent à expertiser individuellement. À la publication, vérifier séparément CI, Pages et Safari iPhone physique.

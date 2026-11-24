# QPJB — arbitrage des 3 dernières réserves explicites EN

**Date : 3 novembre 2026.** Projet `CapGui13/QPJB`, branche `main`. Portée : **3 exercices individuels** ayant conservé un `quarantineReason` tout en étant accessibles (statut `transcrit_source`) après la passe du 2 novembre.

## Méthode et niveau de preuve

- Lecture directe dans la banque actuelle de la main, des quatre choix, de la séquence, de la bonne réponse documentaire, du texte du corrigé et du motif de réserve.
- Rapprochement avec le rapport historique `RAPPORT_AUDIT_PASSE04.md` (`CapGui13/QPJBTraining`), qui a vérifié les PDF originaux BM020, BH077 et BH078 à la page 1 le 27 octobre. **Les trois PDF originaux ne sont pas directement ouverts dans cette nouvelle passe** : seule leur vérification antérieure est reprise comme preuve de provenance documentaire, pas comme certification de la réponse.
- Vérification de la méthode dans la [FFB, *En route vers le SEF !*, séance 26, pages imprimées 164–165](https://cdn.ffbridge.fr/cms/default/0001/08/e59ea4330e7ca327d0a950ee3adaa3528f173607.pdf), exposant les vérifications des contrôles et des cartes clés pour les chelems à la couleur ; et [cours sur les ouvertures de barrage](https://stph.scenari-community.org/bridge/002-7/co/010-Synthese.html), exposant la loi des atouts, le cas de vulnérabilité défavorable et l'ouverture au palier 3 avec sept cartes.

## Revue individuelle

### `EN-suite-repondant-003` — BM020 Q6

- Main ♠RDV2 ♥A32 ♦D1087 ♣82 : **12 H**, quatre Piques, doubleton Trèfle. En soutien Pique avec fit huitième certain : **13 HLD** (12 H + 1 D pour le doubleton).
- Séquence `1♣ – 1♠ – 4♠ – ?`. Le corrigé historique conclut **6♠**, en additionnant 13 HLD et un minimum annoncé de 20 HLD en face.
- **Réserve confirmée :** 33 HLD représentent une indication de potentiel, pas la certitude de ne pas perdre As–Roi dans une couleur. Ici le répondant **ne contrôle pas les Trèfles** (♣82) et le contrôle chez l'ouvreur n'est pas établi. Les choix `Passe / 6♣ / 6SA / 6♠` ne proposent aucune démarche de recherche de contrôle ou de Blackwood. **Aucune bonne enchère SEF unique certifiée avec ce QCM.**
- **Décision** : conserver la réponse imprimée `6♠`, les quatre choix, la main, la séquence et le corrigé ; passer à `reviewStatus: a_verifier` jusqu'à un énoncé/jeu de distracteurs pédagogiquement validé.

### `EN-BH-077-04` — BH077 Q4

- Main ♠4 ♥RD10952 ♦A62 ♣R83 : **12 H**, six Cœurs, un singleton Pique ; en soutien Cœur au moins huitième, environ **16 HLD** (12 H + 2 L + 2 D).
- Séquence `1♣ – 1♥ – 2SA – ?`, où la redemande naturelle à 2SA décrit habituellement **18–19 HL réguliers**. Une main régulière peut n'avoir que deux Cœurs : la qualité et la longueur exactes du fit ne sont pas établies.
- Le corrigé propose **6♥ directement** et le QCM ne propose que `6♦ / 6♥ / 6♠ / 6♣`. Il ne permet ni l'exploration d'un soutien à Cœur ni celle des contrôles ou des cartes clés. Les points HLD ne suffisent pas à en faire une conclusion de chelem unique sous le SEF.
- **Décision** : conserver `6♥` comme réponse **documentaire non certifiée**, sans pénaliser un élève pour une autre démarche experte ; mettre en `a_verifier` tant que les choix ne comportent pas d'alternative exploratoire recevable.

### `EN-BH-078-05` — BH078 Q5

- Main ♠R92 ♥6 ♦DV1085 ♣D643 : **8 H**, trois atouts en face de l'ouverture de **3♠** qui suggère sept atouts : **dix Piques dans la ligne**.
- **4♠ est défendable** au titre de la loi des atouts et du prolongement du barrage, surtout à vulnérabilité égale ou favorable. Mais la vulnérabilité n'est pas fournie, et le rapport vulnérable contre non vulnérable peut changer l'appréciation économique. Le QCM `4♥ / 4♠ / 4SA / 4♦` **n'offre pas Passe**, alors que c'est la vraie alternative tactique à comparer. Le corrigé d'origine extrapole les levées adverses sans exposer les deux jeux.
- **Décision** : ne **pas déclarer 4♠ faux** ; le conserver comme choix du corrigé source, mais masquer provisoirement le QCM `a_verifier`. Ne pas inventer une vulnérabilité dans l'énoncé original : une adaptation pédagogique nouvelle devra mentionner explicitement ses hypothèses.

## Décision technique et sauvegardes

Les trois exercices étaient déjà visibles en **auto-évaluation sans notation automatique** grâce à `reviewStatus: transcrit_source`. Leur retrait est donc **préventif sur la qualité pédagogique**, non la réparation d'une notation automatique avérée. Modification strictement limitée à `reviewStatus: a_verifier`, `reason` individuel et `pedagogicalReview_20261103` ; les champs `correct`, `choices`, `hand`, `auction`, `explanation`, `sourceRef`, `id` et `pedagogicalRevision` restent inchangés.

La logique de navigation filtre déjà `reviewStatus === a_verifier`. Les anciennes entrées `localStorage` demeurent en place, aucune migration de score ni remise à zéro. Synchroniser banque maître, module différé, bootstrap, générateur, tests de non-régression, cache PWA et décompte de chaque rubrique.

**Bilan : 563 EN stockés, 556 accessibles, 7 en quarantaine**, soit trois de plus qu'auparavant ; 114 fiches de carte en banque, 111 disponibles. Rubrique `suite-repondant` : 73 → 71 ; `rep-barrage` : 12 → 11. **Aucune fiche EN accessible ne conserve de `quarantineReason` actif.** Ce bilan clôt le **triage des réserves explicites**, et non l'audit exhaustif des 563 réponses.

## Pour une future réintégration

- BM020 : concevoir une séquence de vérification des contrôles, ou requalifier clairement la question en calcul de potentiel sans noter `6♠` comme unique décision immédiate.
- BH077 : introduire la recherche du fit Cœur et des contrôles, avec trois autres options pédagogiquement crédibles.
- BH078 : préciser un contexte de vulnérabilité **explicitement créé pour l'adaptation**, proposer Passe comme alternative, distinguer attaque et sacrifice.
- Avant toute réactivation, refaire la contre-expertise SEF, documenter l'adaptation séparément du PDF source, et conserver la progression antérieure ciblée sans la réinterpréter silencieusement.
- Examiner séparément les **quatre autres EN déjà masqués** (B19-Q6 et trois quarantaines V6.10) ; ils ne deviennent pas validés par cette intervention. La vérification Safari sur un iPhone physique reste nécessaire.

**CI et publication :** remplir les résultats réels du dernier smoke Chromium, WebKit et du workflow Pages après leur conclusion, sans assimiler un commit à une publication réussie.

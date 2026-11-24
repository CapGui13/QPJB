# QPJB — clôture des quatre quarantaines historiques EN (3 novembre 2026)

**Dépôt :** `CapGui13/QPJB`, branche `main`. **Périmètre :** les quatre fiches encore masquées après le triage des réserves explicites EN du 3 novembre : `EN-2sa-006`, `EN-BH-075-04`, `EN-BH-090-06`, `EN-BH-102-01`.

## Méthode, sources et limites

- Réexamen individuel des données réelles de la banque canonique : 13 cartes par main, points H/HL/HLD, séquences, joueur concerné, réponse d'origine, quatre propositions, justification et métadonnées historiques.
- Confrontation avec le SEF dans les sources indiquées ci-dessous. Les rapports historiques `RAPPORT_AUDIT_PASSE03.md` et `RAPPORT_AUDIT_PASSE04.md` avaient vérifié les PDF originaux. **Cette passe exploite leurs relevés et les corrigés conservés dans la banque ; elle ne prétend pas avoir rouvert les quatre PDF d'origine.**
- Politique : le SEF de l'application est l'unique règle pédagogique. Lorsque le corrigé original diverge, archiver explicitement la réponse et l'explication source avant la réécriture, sans modifier les PDF, les identifiants ou les enregistrements de progression du navigateur. Les fiches anciennement `a_verifier` deviennent `transcrit_source`, donc **auto-évaluées, non automatiquement notées**.
- **Références :** [FFB, leçon 26, propositions quantitatives 4SA et 5SA](https://cdn-sandbox.ffbridge.fr/media/cms/press/0001/01/f2004cec5993cc512588a3c12b56ca7947e33feb.pdf) ; [support de la séance « Réponse à l'ouverture de 2SA », B. Gracia, p.1](https://achemtronic.eu/sgbc/cvirus/111/1931.201119.BG.19.pdf) ; [FFB, *En route vers le SEF*, séance 26, p.166, Blackwood cinq clés](https://cdn.ffbridge.fr/cms/default/0001/08/e59ea4330e7ca327d0a950ee3adaa3528f173607.pdf) ; [fiche sur les soutiens majeurs 11–12 HLD](https://www.bridgeclubduclair.fr/wp-content/uploads/2024/09/33-fits-Majeurs.pdf) ; [iBridge, soutien direct au palier de 3 avec quatre atouts et 11–12 HLD](https://www.ibridge.fr/public/fichedetails/33).

## Deux réserves levées sans changer le corrigé

**`EN-BH-075-04` — réponse documentaire 3♠ maintenue.**

Après l'ouverture de 1♠, le répondant a ♠RV95 ♥6 ♦D10532 ♣V102 : 7 H (3+1 ♠, 2 ♦, 1 ♣), 1 point L de la couleur Carreau cinquième, 2 D pour le singleton et 2 D pour le neuvième atout : **12 HLD**. Un soutien direct de 3♠ montre bien quatre atouts et une invitation de manche à 11–12 HLD. Il ne faut pas confondre cette réponse du répondant avec une redemande de l'ouvreur à 3♠ après 1♠–2♠. Alternatives 2♠, 1SA, 4♠ : sous-évaluation, fit masqué, engagement trop fort. Réserve levée, réponse et quatre choix inchangés.

**`EN-BH-102-01` — réponse documentaire 3♠ maintenue.**

Après 1♠, la main ♠D842 ♥6 ♦V10952 ♣A83 a 7 H (2 ♠ + 1 ♦ + 4 ♣), 1 L et 4 D (singleton et neuvième atout), soit **12 HLD**. Même soutien direct de 3♠, invitation avec quatre atouts. Ce n'est pas une redemande de l'ouvreur. Choix 2♠, 3♠, 4♠, 1SA conservés. Réserve levée et indices des trois distracteurs explicités.

Les deux fiches demeurent **`transcrit_source` en auto-évaluation**, avec `pedagogicalReview_20261103.decision: reserve_levee` et motif V6.10 conservé dans l'historique ; elles ne sont pas transformées en QCM automatiquement notés.

## Deux corrections éditoriales SEF (corrigés source archivés)

**`EN-2sa-006` — B19-Q6, 4SA → 5SA.**

Sud ♠RD104 ♥AD5 ♦D7 ♣DV84 totalise **16 H** et une distribution régulière 4–3–2–4. Après Nord 2SA = 20–21 H, Stayman 3♣ puis réponse négative 3♦, le camp a **36–37 H** sans fit majeur identifié. La proposition quantitative de **grand chelem est 5SA**, forcing à 6SA : l'ouvreur minimum conclut 6SA et maximum 7SA. L'ancien 4SA n'invite qu'au petit chelem et autorise le Passe, exclu avec 36 H. Les quatre choix 4SA, 3SA, 5SA, 6SA sont conservés, mais leur justification est réécrite. Le corrigé imprimé indiquait **4SA** : il demeure dans `sourceOriginalCorrect` et `sourceOriginalExplanation` ; `pedagogicalArbitration` signale la correction explicite.

**`EN-BH-090-06` — BH090-Q6, 6♠ → 4SA.**

Ouvreur ♠AV82 ♥A62 ♦ARV105 ♣8 : **17 H**, cinq Carreaux, quatre Piques et singleton Trèfle. Après `1♦–1♥–1♠–4♠`, le fit Pique est agréé ; le camp dispose de contrôles dans les quatre couleurs (trois As et le singleton Trèfle). Le petit chelem à 6♠ peut être bon, mais le saut direct n'a pas vérifié le Roi et la Dame d'atout ni les cartes clés manquantes. **4SA Blackwood cinq clés (30–41)** constitue la meilleure démarche parmi les quatre réponses du QCM. Les choix deviennent `6♥ / 6♠ / 6SA / 4SA` : `6♦` est retiré, pour introduire une véritable recherche de chelem. Le corrigé imprimé **6♠**, ses quatre choix originaux et son explication sont archivés respectivement sous `sourceOriginalCorrect`, `sourceOriginalChoices`, `sourceOriginalExplanation`. L'interface distingue expressément la correction SEF du document d'origine via `pedagogicalArbitration`.

**Attention :** cette correction choisit parmi les quatre propositions disponibles. Elle ne prétend pas que 4SA est la seule façon valable d'explorer un chelem dans toute méthode experte ; une démarche de contrôles peut également être pertinente. Elle évite seulement de sanctionner systématiquement l'exploration et de donner 6♠ immédiat comme réponse incontestable.

## Sécurité, données, publication

- Quatre identifiants, mains, séquences et PDF d'origine conservés. Aucune modification de `localStorage`, aucune ancienne réussite requalifiée. Chaque fiche réintégrée reste en mode **auto-évaluation sans notation automatique**, notamment pour les deux corrections de bonne enchère.
- **563 EN en banque, 560 accessibles, 3 masqués** (`EN-suite-repondant-003`, `EN-BH-077-04`, `EN-BH-078-05`). Les **114 cartes**, dont 111 accessibles, sont inchangées.
- Rubriques : `rep1M` 18→20 ; `2sa` 12→13 ; `suite-ouvreur` 15→16. Les autres catégories restent inchangées.
- Conservation et synchronisation des fichiers canoniques, module différé, bootstrap, générateur, version des URLs `20261103b`, cache PWA `qpjb-v46`, smoke tests de contenu et comptage.
- **La validation Chromium, WebKit et GitHub Pages n'est pas attestée par la création de ce rapport** : voir les conclusions GitHub sur le commit exact avant de déclarer la publication réussie.
- **Hors périmètre :** les trois exercices encore masqués doivent être adaptés pédagogiquement avant réactivation ; l'ensemble des 563 réponses n'a pas reçu de certification exhaustive ; l'essai Safari sur iPhone physique reste à réaliser.

## Verdict

**Les quatre anciennes quarantaines V6.10/B19 sont résolues en mode d'entraînement guidé.** Deux réponses originales validées, deux corrigés erronés rectifiés et archivés, sans casser la progression. **Il subsiste trois quarantaines conservatoires distinctes du sous-chantier précédent.**

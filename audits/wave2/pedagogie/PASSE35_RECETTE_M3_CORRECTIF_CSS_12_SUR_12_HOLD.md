# QPJB — M1 / PASSE 35 : correction d'intégration M3 démontrée sur les vrais Chromium + WebKit

**PASSE 35 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON — PR M1 #261 DRAFT / HOLD.**

## Synthèse et distinction des propriétés
Cette passe ne change ni les QCM ni un fichier de M3 : elle apporte une **preuve de correction provisoire**, par une exécution réelle et complète du runner M3 sur une copie jetable de la branche M3. Il s'agit d'un travail substantiel de validation croisée et non d'une reprise artificielle de la recette déjà verte de M1.

Sources :
- M1 parent : `1404136a44700269b0f3d78cb26ae6766163e6a1`, branche `wave2/pedagogie-sef-20261121`.
- M3 HEAD cloné : **`3ec39601260b9b4169c6bf4ec319798856abef1b`** ; HTML source Git blob **`354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3`**.
- Runner M3 : `tests/wave2-ux-runner.cjs` blob `273dc20ea031124a9b64fc45cba3f5879f710a6e` ; scripts `browser` blob `c565383ae527a73731f5a5384a39537ea66a3bb9` et `visual` blob `872f6433e8129f21ee1ed223df397b39be0c4fef`, **aucun de ces fichiers de test modifié dans le diagnostic final**.
- Environnement réel : machine Linux temporaire connectée, **Node v22.23.5**, **playwright@1.64.1**, navigateurs **Chromium et WebKit réellement installés et lancés**. La première installation avec privilèges avait placé les navigateurs dans un cache root inadapté ; les navigateurs ont ensuite été installés dans le cache normal utilisateur. Ne pas confondre cet incident d'installation avec un résultat de test.

## Analyse / correction de deux échecs reproductibles de P34

### 1. La lisibilité mobile à 320/390 px

Source M3 de départ :
```css
#body .hand .suit{font-size:19px;min-width:0;align-items:flex-start}
```
Règle CSS temporaire essayée :
```css
#body .hand .suit{font-size:clamp(20px,6vw,24px);min-width:0;align-items:flex-start}
```

Mesures **réelles, sur les deux moteurs** :
- 320×844 : **19 → 20 px** (gain démontré, captures PNG).
- 390×844 : **21,06 → 23,4 px** (plus de diminution de taille, captures PNG).
- 844×390 : **24 → 24 px**, inchangé (format paysage accepté par la recette).

### 2. Le reflow du formulaire à 195×422 px (zoom 200 %)

À P34, avec l'HTML M3 original, la grille du champ d'enchères reste deux colonnes (**`32px 82px`**) et l'input et le bouton restent sur la même ligne à `innerWidth=195`, même si `matchMedia('(max-width:270px)')` est vrai. L'assertion de la recette `wave2-ux-browser.cjs` avait donc un fondement réel.

Une première tentative P35 **sans les priorités CSS explicites** (règle ajoutée en fin de feuille, colonne unique et `grid-column:1`) a été **réellement contre-testée : Chromium FAIL au zoom 195, 6/7 scénarios**. Cette variante **n'est pas proposée comme validée**.

La deuxième variante P35 ci-dessous, ajoutée **uniquement en fin du `<style>` de la copie locale**, est celle qui a effectivement réussi :
```css
@media(max-width:270px){
  #body .free-entry-row{
    display:grid!important;
    grid-template-columns:minmax(0,1fr)!important;
    grid-auto-flow:row!important;
  }
  #body .free-entry-row input,#body .free-entry-row button{
    grid-column:1!important;
    width:100%!important;
    min-width:0!important;
  }
}
```

**Avertissement :** les `!important` sont utilisés comme contre-preuve opérante face à une cascade CSS non complètement caractérisée. **Le propriétaire M3 doit rechercher la correction structurelle minimale**, conserver la géométrie de l'input et du bouton, refuser de « faire passer » le test en desserrant ses attentes, et confronter visuellement les captures à l'interface existante.

## Réexécution native intégrale, pas une simulation

Sur la copie locale contenant les **deux corrections CSS temporaires**, avec code de navigation et d'invariants M3 **strictement inchangé**, la vraie commande
```bash
node tests/wave2-ux-runner.cjs
```
a donné **`FULL_M3_EXIT=0`, 12/12 étapes réussies** :
- **8/8** contrôles Node (catalogue, focus, orchestration, reprise, serveur, ressources, reflow, authenticité des PNG) ;
- **7/7 scénarios Chromium et 7/7 scénarios WebKit**, avec **reflow 195×422px** maintenant réussi ;
- **2/2 comparatifs visuels réussis**, chacun sur **3/3 formats** et **18 PNG authentiques observés**, soit **36 PNG** générés par les comparateurs.

Les rapports `comparatif-{chromium,webkit}.json` ont déclaré `passed, 3/3 formats, 18 PNG observés` chacun.

**Contrôle d'intégrité** : script `training-data` du HTML provisoire **strictement identique** à celui du HTML M3 original, SHA-256 brut **`22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`**. Taille HTML M3 d'origine **1 907 011 octets**, HTML d'essai **1 907 297 octets**. **Aucun QCM des 1 523 n'a été modifié**.

## Limites, décision et prochaine action

- **Les correctifs CSS sont expérimentaux : aucune modification ni commit GitHub sur M3**, ni sur M1 pour le code applicatif. La copie de test était non persistante.
- **Pas de vraie CI GitHub Actions** attestant ces 12 étapes sur un **commit M3 livré**.
- **36 PNG réellement produits mais non archivés durablement ni inspectés manuellement**, et aucune capture ne peut être considérée comme preuve de validation visuelle humaine.
- Une dernière tentative de faire tourner M1 sur le checkout M3 corrigé a été **interrompue par expiration du sandbox avant récupération des logs**. **Ne pas déclarer ce contre-test M1 comme PASS ou FAIL** ; la vraie suite M1 20/20 PASS sur la source M3 originale a été démontrée en P31–P33.
- **Handoff M3** : issue #257 commentaire `7076559954` et PR #265 commentaire `7076560291`, avec règles CSS exactes et limites. Le responsable M3 décide et commit dans son **périmètre propre**, puis effectue la vraie recette Chromium+WebKit, archive/inspecte les captures, contrôle la sauvegarde/reprise ; tant qu'il ne le fait pas, **M3 reste non terminé**.
- **M4–M3** : faux échec du contrôle SHA entier du HTML toujours non corrigé au dernier contrôle ; propriétaire M4/coordinateur.
- **M5** : raccordement GitHub Actions des vingt tests M1 toujours hors branche M1 ; ne pas modifier les workflows M5 ici.
- **M1 humain** : 6 clarifications et 11 accords conventionnels toujours en attente de décision explicite ; bulletin P29 ; aucun avis fabriqué.
- **Main** et toutes les autres branches intacts. Aucune fusion ni publication.

**PASSE 35 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P36 seulement après intégration effective M3, correctif inter-branche M4, nouvelle CI M5 ou validation humaine des 17 arbitrages — pas d'autres micro-passes d'audit.**

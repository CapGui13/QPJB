# QPJB — Phase AA : audit des indices pédagogiques dans les cinq fiches Z

**19 novembre 2026 · Revue manuelle fondée sur cinq QCM originaux et leurs corrigés · PR #214 · Aucun déploiement.**

## Résumé opérationnel

Le test automatique de Z vérifiait qu'aucune **chaîne exacte** correspondant à la bonne enchère n'apparaissait dans l'aide. Ce test était nécessaire, mais **insuffisant** : une aide peut désigner indirectement la bonne réponse en signalant le seul critère discriminant. La phase AA relit donc les cinq fiches **par rapport à la main, aux quatre propositions et à la justification originale**.

**Décision éditoriale :** les cinq aides sont reformulées sous forme de **questions de méthode neutres** (lire qui parle, distinguer les informations garanties, vérifier la signification des accords et confronter les choix à la main). Elles n'apportent pas de nouvelle règle SEF et n'indiquent ni le contrat ni la décision finale. Elles ne sont **pas validées** comme contenu pédagogique complet : cette validation reste à faire avec l'enseignante.

## Revue question par question

| QCM / données d'origine | Réponse conservée | Risque de l'ancienne aide | Révision AA / limite subsistante |
|---|---|---|---|
| **`SEF-V486-022` Rubensohl, main 2-2-6-3, 10 H, après 1SA–(2♣ Landy)** | **3♣**, Texas ♦ selon le corrigé du catalogue | L'ancien « vérifie quel dispositif de réponse » était trop vague pour une première découverte et n'enseignait pas la correspondance conventionnelle | La fiche apprend à distinguer artificiel/naturel et à consulter l'accord, **sans révéler 3♣**. **Limite :** sans cours ou table de convention, l'élève ne peut pas deviner l'accord exact ; une véritable leçon de découverte reste à élaborer |
| **`SEF-V481-009` Rubensohl, main 4-3-3-3, 15 H, après 1SA–(2♦ naturel)–3♣ Stayman FM** | **3♠** | L'ancienne aide indiquait de chercher **quelle majeure possède quatre cartes** : indice trop direct vers les Piques | La nouvelle fiche fait relire le sens de 3♣ déjà indiqué dans l'enchère et comparer **toutes** les propositions à la main. L'énoncé original conserve ses indications sur les quatre Piques |
| **`SEF-L04-029` Michaels, main 3-2-6-2, 10 H, deuxième tour après 1♠–2♠–3♠–Passe–4♠–Passe–Passe** | **Passe** | L'ancienne fiche insistait sur le manque de fit et la question de savoir si **une nouvelle enchère se justifie**, renforçant la réponse Passe | La fiche reformulée demande de distinguer les informations garanties et de comparer les quatre décisions au palier atteint. **Attention :** le QCM original lui-même écrit « Le répondant ne fabrique pas de fit absent » et précise « deux cartes chacune » dans les couleurs promises ; **risque de réponse très guidée provenant de la source**, à auditer séparément. **Ne pas retoucher l'énoncé sans arbitrage pédagogique** |
| **`SEF-C2-007` Michaels, main 5-5-2-1, 11 H, après 1♦ adverse** | **2♦** | « Observe les deux couleurs longues de ta main » et « fais correspondre la description » mettaient fortement en avant l'unique combinaison 5–5 majeur | L'aide AA propose un contrôle global des accords, de la force et de la distribution, **sans désigner les deux majeures ni le cue-bid gagnant**. Le rappel 5–5 majeur est déjà présent dans la question source |
| **`SEF-V45-044` Michaels, main 1-5-2-5, 14 H, après 1♠ adverse** | **2♠** | L'ancienne fiche demandait précisément les deux couleurs du bicolore et invitait à reconnaître son cue-bid | Le nouveau texte demande de confronter les exigences du bicolore convenu à la main, **sans nommer la réponse**. Une première découverte nécessite toutefois de connaître le sens exact du Michaels précisé sur 1♠ |

### Frontière entre découverte et évaluation

Le nouveau **mode « découverte guidée »** de la démonstration locale affiche la fiche avant la question. Le **mode « essai sans aide »** masque complètement la fiche et affiche immédiatement le QCM original ; passer d'un mode à l'autre **réinitialise la sélection et le corrigé affiché**. Les deux modes restent **non notés, non persistants** : un essai sans aide n'est pas, à lui seul, une mesure de maîtrise.

**Risque pédagogique résiduel :** même des questions de méthode neutres peuvent focaliser l'élève sur le bon raisonnement. Le contenu du QCM original peut lui-même déjà contenir beaucoup d'indices (en particulier `SEF-L04-029`). Les filtres automatiques cherchent quelques formulations trop directives et une copie littérale de la réponse, mais **ne peuvent pas garantir l'absence d'indice sémantique**.

### Contrôles reproductibles

- `scripts/parcours-v2-intros-z.cjs` : formulations AA sur cinq IDs source ; garde-fou d'ancrage à l'énoncé et politique « aide métacognitive seulement ».
- `tests/quizz-v2-intros-z.cjs` : assertions contre les formulations antérieurement trop orientantes, présence des deux modes dans l'aperçu, compilation syntaxique du JavaScript HTML, fidélité de la main, de l'enchère et du corrigé d'origine.
- `scripts/parcours-v2-apercu-z.cjs` : génération hors ligne d'un fichier HTML interactif et **sans réseau**.
- `.github/workflows/qpjb-v2-z-focused.yml` : validation par GitHub Actions des scripts, simulations et fichier HTML produit.

**Statut éditorial : cinq aides reformulées, deux limites intrinsèques relevées, validation enseignante encore nécessaire. Aucun changement de V2-F, aucune modification du catalogue 1 523 QCM, aucune fusion ni publication.**

## Contrôle technique final — phase AA

**GitHub Actions [#44498105146](https://github.com/CapGui13/QPJB/actions/runs/44498105146) : succès.** Les contrôles de provenance des cinq QCM, de formulations anciennes trop directionnelles, de séparation des modes, de syntaxe JavaScript de l'aperçu et de non-mutation ont réussi.

Simulation sur **neuf parcours V2-F × 45 séances** : **18 premières rencontres sur 18** disposeraient d'une aide expérimentale. Sources initiales rencontrées : `SEF-V486-022` (6), `SEF-V481-009` (3), `SEF-L04-029` (1), `SEF-C2-007` (3), `SEF-V45-044` (5). Les **familles distinctes (440–450)** et les **rappels ciblés (69–77)** sont inchangés. Le nouvel aperçu HTML, avec les deux modes, est archivé dans `qpjb-v2-z-experimental-preview`, fichier `intro-z-preview.html` (12 652 octets).

**Limites des tests :** ils ne valident pas la neutralité sémantique complète, l'efficacité d'une présentation en classe, ou l'aptitude de l'énoncé original `SEF-L04-029` à mesurer l'autonomie. Les cinq fiches restent **non actives** ; validation enseignante nécessaire.

**Statut final AA : `AA_CI_SUCCESS / CINQ_FICHES_REVISEES / DEUX_MODES_APERCU / 18_SUR_18 / V2_F_INCHANGE / AUCUN_DEPLOIEMENT`.**


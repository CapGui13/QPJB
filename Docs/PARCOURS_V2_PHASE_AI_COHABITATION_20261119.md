# QPJB — Phase AI : cohabitation réversible du parcours actuel et de V2

**19 novembre 2026 · PR #214 · candidat d'intégration sur la branche de travail, hors production.**

## 1. Objectif produit

Rapprocher la sélection progressive V2 des **vraies données et de la vraie page Quiz SEF**, sans sacrifier la progression actuellement enregistrée par les joueurs. Il faut garantir le retour au parcours classique, préserver le module Quiz SEF et **ne pas inventer de compétence ni transférer une note entre deux moteurs différents**.

Décisions pédagogiques en vigueur : **uniquement des QCM existants**, aucune mini-leçon intégrée, aucun déblocage manuel des conventions. Rubensohl devient éligible automatiquement à partir de la séance 35 dans les règles de progression du simulateur V2.

**Ce qui est livré : une page candidate autonome, générée et testée dans le même contexte de navigateur que la vraie page QPJB. Elle n'est pas encore référencée par le site public.** L'intégration réelle des écrans définitifs et leur publication restent des étapes distinctes.

## 2. Ce qui est réellement stocké dans QPJB aujourd'hui

Examen du code actuel de la page \`quizz.html\` et de son moteur \`quizz-parcours.js\` :

| Usage | Clé de stockage navigateur | Traitement V2 |
|---|---|---|
| Parcours classique V1.10 et séance interrompue | \`qpjb-sef-parcours-01\` | **Lecture seule pour information, jamais écrite, supprimée ou migrée automatiquement** |
| Résultats des questions du Quiz SEF classique et modes d'entraînement | \`qpjb-sef-entrainement-01\` | **Jamais lue, écrite ni supprimée par le candidat V2** |
| Ancien aperçu de test V2-AG | \`qpjb-preview-v2-ag-local-resume-v1\` | **Jamais utilisée ou écrasée** |
| Nouveau candidat V2-AI | \`qpjb-sef-parcours-v2-01\` | Sauvegarde V2 **distincte** et réinitialisation indépendante |

Il s'agit de la sauvegarde **locale du navigateur**, telle que le code Quiz SEF l'emploie. **Aucun service de connexion ni synchronisation entre appareils n'est ajouté.**

Une sauvegarde V1 peut documenter des séances et des réponses dans le moteur classique. Les états de révision et de classification du moteur V2 ne sont pas identiques. Les copier sous des noms de champs supposés compatibles créerait de **fausses preuves d'apprentissage**. La règle de sécurité retenue est donc **conserver V1 intacte, commencer V2 séparément**. La future stratégie de migration devra être arbitrée explicitement et testée sur de vraies sauvegardes anonymisées, sans écrasement.

## 3. Comment fonctionne le candidat V2-AI

Le générateur \`scripts/parcours-v2-build-cohabitation-ai.cjs\` part de la **prévisualisation V2 originale**, passe par le mécanisme de sauvegarde V2-AG déjà validé, puis produit une **nouvelle page** :

\`artifacts/v2-ai/parcours-v2-cohabitation.html\`

La page conserve **octet pour octet** les quatre blocs de données/catalogue embarqués et les moteurs de l'original (1 523 QCM, 14 annotations SA, 65 Stayman/Texas, 19 cas pédagogiques signalés pour l'audit). Seul le **script d'interface de la copie générée** change :

- Le stockage V2 utilise sa propre clé \`qpjb-sef-parcours-v2-01\`. L'état est versionné avec une empreinte du catalogue, validé au chargement, puis restitué si compatible.
- Une simple **lecture** de la clé du parcours V1 permet d'indiquer le nombre de séances classiques déjà terminées. Cet affichage ne déclenche **aucune migration, écriture ou évaluation**.
- Un lien **Retour au parcours classique** vise la vraie page \`quizz.html\` quand les deux pages sont servies sur la **même origine web** (comme dans les tests).
- Les accès à la **revue éditoriale des 19 cas sensibles** sont masqués dans ce candidat destiné à vérifier le parcours élève. Leurs sources continuent à exister intactes pour les audits ; elles ne forment pas un programme de leçons ni des QCM supplémentaires.
- La **réinitialisation V2** supprime **uniquement** sa propre clé. Les deux clés QPJB historiques demeurent intactes.
- Quand le fichier HTML est ouvert en téléchargement local (\`file://\`) au lieu d'être servi sur le site, un message signale explicitement que **les anciennes sauvegardes web QPJB sont inaccessibles depuis ce fichier**, et le lien de retour relatif est masqué. La reprise V2 locale demeure possible si le navigateur autorise le stockage.

La page conserve ses **dix QCM par séance** et la progression automatique expérimentale. **Aucune question et aucun corrigé n'ont été modifiés.**

## 4. Vérification sur le vrai environnement de page, en local

La suite \`tests/quizz-v2-cohabitation-ai.cjs\` simule une sauvegarde V1 existante **avec sept séances terminées** et des réponses historiques au Quiz SEF. Elle vérifie que **chaque octet** des anciennes sauvegardes reste identique pendant : démarrage V2, réponse à une question, rechargement, reprise, fin de séance, début d'une autre séance et réinitialisation V2. Les mêmes tests protègent les 1 523 QCM et leur provenance.

La suite \`tests/quizz-v2-cohabitation-ai-browser.cjs\` démarre un **serveur web local du dépôt**, ouvre V2 et la page **réelle \`quizz.html\`** sur le **même domaine local**, puis revient à V2. Elle vérifie sur Chromium et WebKit, à tailles ordinateur et iPhone, que :

1. V2 lit **sept séances V1** sans les modifier ;
2. les deux pages restent navigables avec un bouton retour vers la page QPJB classique ;
3. V2 reprend la réponse à la question 1, l'énoncé non répondu de la question 2 et le bilan après actualisation ;
4. une seconde séance peut commencer et rester enregistrée ;
5. une réinitialisation V2 n'efface **ni la clé historique du parcours classique ni celle du Quiz SEF** ;
6. les documents sont utilisables sans débordement horizontal ou exception JavaScript.

**GitHub Actions : [#44516601579](https://github.com/CapGui13/QPJB/actions/runs/44516601579) — succès sur les trois jobs : intégrité, Chromium, WebKit.** Les deux navigateurs ont réussi les tests ordinateur et mobile avec les journaux :

- \`V1=UNCHANGED V2=RESUME_AND_RESET site-navigation=OK\` — Chromium ordinateur/mobile ;
- \`V1=UNCHANGED V2=RESUME_AND_RESET site-navigation=OK\` — WebKit ordinateur/mobile.

La CI produit l'artefact **\`qpjb-v2-ai-cohabitation\`**, contenant une page HTML d'environ **1,2 Mo** et son rapport d'exécution. L'artefact est disponible pour essai **hors production**. Un fichier HTML téléchargé ne partage pas l'origine web et donc **ne peut pas récupérer les sauvegardes du site QPJB**.

## 5. Retour arrière et limites

**Le retour arrière est simple à ce stade :** rouvrir \`quizz.html\` revient au parcours actuel avec ses anciennes sauvegardes, qui n'ont jamais été modifiées. La page V2 expérimentale possède son propre historique. Il n'y a **aucune bascule globale**, aucune migration automatique et aucune donnée V2 importée dans les résultats V1.

**Reste à construire avant publication :**

- Une **entrée visible mais réversible dans la vraie navigation QPJB**, accessible seulement après recette ; le candidat V2 n'est actuellement qu'un artefact généré, non référencé par le site.
- La décision éditoriale concernant l'introduction des premières questions avancées et les **19 cas source signalés**, sans changement arbitraire de corrigé.
- Un mode de publication/protection permettant de revenir rapidement à V1 **sans effacer l'historique V2**, avec règles de rétention des deux sauvegardes.
- Une stratégie de reprise des anciens parcours si elle est souhaitée : à ce stade, **le score V1 n'est pas traduit en état V2**.
- Une recette sur le site de préproduction, à l'origine exacte de QPJB, puis accord explicite avant publication.

**Statut : \`AI_COHABITATION_TESTS_OK / V1_READ_ONLY / V2_SEPARATE / 1523_QCM_INTACTS / ZERO_LECON / ZERO_DEVERROUILLAGE_MANUEL / SITE_NON_MODIFIE / PAS_DE_DEPLOIEMENT\`.**

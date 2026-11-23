# M5 — PASSE 4 : reproduire le détachement réel d'iframe et multiplier les essais

Suite de la passe 3, commit `b492bb9d7ba582a87c714db4bae84946e02a7f1b`. Source [run 44949454425](https://github.com/CapGui13/QPJB/actions/runs/44949454425) : tests Lot07 normaux **51/51** Chromium et **51/51** WebKit, sondes de panne volontaire **réussies** sur les deux moteurs (logs 21:06:32 et 21:07:15 UTC). Les simulations longues étaient encore en cours au moment de ce commit : le vert global doit être vérifié après leur achèvement.

## Limite de la sonde P3

La sonde P3 injectait une erreur explicite juste après le rendu : cela prouvait JSON/PNG et la conservation de l'erreur, mais **pas** la gestion d'un véritable cadre détaché.

## Contre-épreuve P4

- Nouveau mode `PW_LOT07_DIAGNOSTIC_PROBE=detach` : supprime le véritable élément `#training-frame` **après le rendu vérifié**.
- L'attente de la main utilise toujours le `child` initial : elle doit échouer, sans réussite dans un nouveau cadre.
- Le test contrôlé exige un code de sortie en échec, un `frameEvents` contenant `detachement`, l'absence du cadre détruit parmi les cadres actifs, le motif d'erreur, un JSON et une capture non vide.
- La sonde P3 d'erreur générique est conservée. Les deux sont jouées sous **Chromium et WebKit** dans la CI habituelle ; aucun contrôle métier, catalogue, ni publication modifiés.

## Protocole de mesure

Comparer la dernière recette P2 (44944243351), la recette P3 (44949454425) et le futur run de ce commit : chaque passage doit comporter 4 jobs réussis, 51 contrôles Lot07 par navigateur et les 58 commandes historiques. Le taux de réussite n'est estimable que sur plusieurs passages réellement achevés ; ne pas compter un run en cours comme succès.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 5 :** métriques fiables temps mur/jobs, variabilité, seuils d'alerte *informatifs* et revue des workflows. Ne pas publier.

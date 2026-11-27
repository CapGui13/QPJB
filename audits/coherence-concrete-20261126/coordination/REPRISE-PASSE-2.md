# Coordination — reprise passe 2 (27/11/2026)

Contrat #419. PR générale #483, brouillon; main de référence 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Intégration isolée #495 : a8938a58b36bc82e0b1b4e93497a846dcf3eb201. Aucun merge main ni publication.

## Recette native commune
Run 46001492702 : 18/18 jobs, 9 bras par trajectoire, 291600 présentations synthétiques S180. Résumés durables matrix-native-1.json et matrix-native-2.json; traces exhaustives dans artefacts CI temporaires. Modèle de réponse fixe commun M6; ne prouve pas l'apprentissage réel. Comparateur individuel strict inspiré de D, distinct du gate D original intégral.
- M2 : 2683/3240 ordres modifiés, ensembles ID et états finaux identiques, aucune alerte M6/stricte.
- M1 V2 + M2 : 534 compositions modifiées, 111 alertes strictes (3 trajectoires); M1 V6 + M2 : 1065 compositions modifiées, 237 alertes strictes (7 trajectoires). HOLD, M1 désactivé.
- M5 + M2 : 9732 préparations, 4792 rappels; aucun changement d'état de maîtrise.
- Première variante M4 : HOLD. M3 : avis seulement, patches Texas/Stayman toujours HOLD.

## Interface
M5 : run 46002183747 3/3 PASS après correction des anciennes références cache v19/v20 (ajout des nouveaux contrôles, aucune suppression de garde). Suggestions facultatives, règle courte à la demande, bibliothèque préservée; aperçu sans mutation, invisible en séance/quiz libre.
M2/M5 : #494 et #495 fusionnées uniquement dans les branches de recette. Run 46002732361 : Chromium et WebKit PASS (logs vérifiés), ordre réellement affiché, référence historique distincte, journal réel, reprise et import/export, anciennes sauvegardes, offline première visite, quiz libre; aucune erreur page. Job Node historique encore en cours au relevé. Catalogue inchangé, M1/M4 inactifs dans interface.

## M4 Q/R
Branche séparée et PR brouillon #493 HOLD, SHA 5308f32f63ddcbe0366807b6bc6822e880aa4ab3. Run 46002412075, 18/18 jobs, 162000 présentations, modèle M6. Dette 241051 -> Q 241899 (45 alertes strictes) / R 207916 (-13,75%, 115 alertes strictes, 8 alertes M6). Q : 4 décisions directes, 256 compositions modifiées. R : 18 décisions directes, 448 compositions modifiées; 8 trajectoires strictement en régression. Pas d'activation ni fusion; preuves dans quota-native-1/2.json et QUOTA-Q-R.md sur la branche Q/R.

## Reprise
Contrôler le job historique de #492, continuer la remédiation M1/M3/M4 et le contrôle indépendant M6 sur les compositions réellement générées. Ne pas diminuer les seuils pour obtenir un PASS. Le visa global demeure suspendu; #483 reste brouillon. Aucune publication autorisée par cette recette partielle.

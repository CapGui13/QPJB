# Reprise 6 A — M1

Branche : `coherence-concrete/reprise6-a-m1` ; base figée `13966e475cf986c6f76e7faf870377fdf4ef99aa`.
Contrat #506, mission #507. État : démarrage, HOLD tant que les gains ne sont pas prouvés.
Périmètre exclusif : nouveaux fichiers A ; aucun changement de production existant.
Tests : aucun exécuté à ce stade. PR : à ouvrir vers coordination-generale.
Prochain geste : lire REPRISE-PASSE-5, #419 et portions M1, identifier le point de sélection et le banc apparié.

## Jalon 1 — 90 séances natives, 270 séances appariées
- SHA mesure native `f4a0d87160247a700008da795ec64f5487ca9c9e`, résultats `native-s1-s5.json` : 1915 QCM, 18 trajectoires M6, 90 séances. S3 : 34 ouvertures 2SA, 25 soutiens majeurs (concept, pas décision effective) ; S4 : 58 seuils 1SA, 32 soutiens mineurs ; S5 : 63 redemande, 38 Stayman/Texas.
- SHA variantes `4a60b94c0ff67bb5a378843fe7896a744b4b1181`, traces `early-paired.json` au commit `a5b8a8eb88592c61af329965bf58f1ce5fcf7a08`. Exécution réelle V8 des sources figées avec catalogue extrait du blob, modèle M6 natif, durable inactif avant S21 (module omis), 18 × 3 bras × 5 séances. 270 reprises après première réponse, zéro violation structurelle M6 ; zéro substitution dans chaque variante. Rejet de ces deux variantes neutres. Pas de CI, pas de test D, pas de S6–180 ni navigateur à ce stade.
- Cause possible : ordre d'arrivée des créneaux libres, classification et contraintes du rang. Prochain geste : instrumenter les créneaux natifs, mesurer les candidats réellement disponibles et tester une politique de composition au niveau du choix de catégories sans lever aucune garde.

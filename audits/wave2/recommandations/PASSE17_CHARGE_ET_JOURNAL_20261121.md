# LONG M4 — Passe 17 : charge réelle et limite du journal V1

**PASSE 17 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Le module M4 effectue deux passages sur le journal : (1) contrôle des versions contradictoires et (2) recoupement micro/axe avec comptage des indépendances. La passe évalue son coût et la sécurité de la troncature à 1 000 événements, sans changer la production.

## Mesures effectivement réalisées sur le code M4 P16

Ces durées proviennent de l'exécution réelle des fichiers GitHub (moteur V1 et recommandations) dans un isolat V8, via `Date.now()`. Elles ne sont **pas** un benchmark Node22/GitHub runners ; les timings sont indicatifs et non déterministes.

| État du suivi | Observations présentes | Nombre de rapports | Durée totale mesurée | Moyenne |
|---|---:|---:|---:|---:|
| 65 séances × 10 réponses | 650 échecs consignés | 100 | 192 ms | 1,92 ms |
| 153 séances × 10 réponses | 1 530 échecs consignés | 100 | 412 ms | 4,12 ms |
| 1001 séances × 1 réponse | 1000 échecs conservés (une séance sans détail) | 50 | 168 ms | 3,36 ms |

Les trois états ont été produits via `QPJBParcours.record/finish`. Le JSON de l'état est identique avant/après les appels. Les profils 65/153 conservent **un** conseil micro avec référence de l'axe décrivant les mêmes réponses. Le profil 1001 montre **deux** conseils indépendants (aucune fusion), parce qu'une tentative ancienne est sortie du journal plafonné à 1000 événements : le module refuse de feindre une couverture exhaustive. La limitation « 1 séance sans journal détaillé » est explicite.

## Tests automatisés ajoutés

`tests/wave2-recos-long-journal.test.js` : trois scénarios nouveaux, 65 et 153 séances à 10 questions et 1001 séances à une question. Ils comparent les observations, regroupements, limitations et l'absence de mutation. Les temps sont consignés à la sortie mais **aucun seuil de durée arbitraire** ne conditionne le succès des tests, pour éviter les échecs fluctuants selon les runners.

**Total ciblé après cette passe : 76 scénarios** (73 précédents + 3). Exécution complète sous Node22 encore à organiser avec le coordinateur de M5, car le périmètre de M4 interdit les changements `.github/workflows/**`.

**PROCHAINE PASSE :** vérifier indépendamment la pureté des sorties et la cohérence des conseils, puis fournir un bilan exact de branche et CI avec le contrat de raccordement (sans toucher au moteur ni à l'UI). PR DRAFT/HOLD, aucune fusion/publication.

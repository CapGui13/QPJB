# Double recette composition / ordre complet — passe 5
[Run 46009540664](https://github.com/CapGui13/QPJB/actions/runs/46009540664), 18/18 jobs réussis, SHA testé d5c4ec6e5ff008e0ca33ee4af4069c2e8eab0633. Modèle M6 (7 bras) et modèle FNV original D (4 bras) : 356400 présentations simulées. Six profils et trois graines, S180, cinq horizons. Les deux modèles sont indépendants en règle de réponse, non des élèves réels.
M6 vérifie les protections et l'état de maîtrise de l'ordre complet seul ; D recalcule chaque métrique et réponse à partir du catalogue réel. D.comparePair legacy=true est utilisé uniquement pour accepter cette nouvelle provenance plutôt que les SHA historiques figés du laboratoire #445 ; le nouveau SHA, le catalogue incorporé et les métadonnées sont contrôlés, toutes les métriques originales présentes et vérifiées. Comparateur D inchangé. Le diagnostic T étroit sans exigence d'amélioration de dette ne remplace jamais le gate complet.
| Indicateur | Ordre complet | T | M3 | M3T |
|---|---:|---:|---:|---:|
| Paires proches S5 (M6) | 38 | 35 | 38 | 35 |
| Paires proches S20 (M6) | 100 | 97 | 100 | 97 |
| Inversions Texas (M6) | 15 | 15 | 10 | 10 |
| Inversions Stayman (M6) | 0 | 0 | 0 | 0 |
| Paires proches S5 (D) | 40 | 37 | 40 | 37 |
| Paires proches S20 (D) | 96 | 93 | 95 | 92 |
| Dette fondamentale S180 (D) | 228622 | 228622 | 215214 | 215214 |
| Alertes D agrégées par trajectoire/horizon | 0 | 0 | 53 | 53 |
| Régressions D individuelles | 0 | 0 | 122 | 122 |
T : trois substitutions S3, même famille et réponse 2SA (21→20 H), uniquement le profil autonome parfait. REVIEW étroit confirmé par deux modèles; pas de dette réduite, gate M4 intégral HOLD. M3/M3T HOLD : malgré 5 inversions Texas corrigées et aucune nouvelle inversion Stayman sur ordre complet, pertes individuelles D. Ne pas activer M3 atomique. Aucune activation T UI ni fusion main; poursuivre recette réelle T seule, puis traiter rappels et composition M1 séparément. Traces exhaustives dans artefacts CI temporaires; six fichiers double-native-*.json contiennent les résumés exacts et les checkpoints détaillés, double-gate-result.json contient le verdict reproductible. Aucune preuve d'efficacité pédagogique humaine.

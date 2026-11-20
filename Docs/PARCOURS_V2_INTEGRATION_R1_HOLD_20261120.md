# QPJB V2 R1 — intégration opt-in préparée, non publiée

**20 novembre 2026 — PR d'intégration empilée sur la PR #216.**

**Ce que contient cette branche :** la page réelle `preview/v2-eleve/parcours-sef-65-r1.html` (SHA-256 `4edc289dfa6d1e929e6985985152321adf8edb342923b4fadc061405aef386b6`), identique au candidat R1 testé, et un lien sur l'accueil QPJB visible **uniquement** si l'adresse comporte le paramètre `?v2preview=1`. L'ouverture se fait dans un nouvel onglet ; le Quiz et l'Entraînement restent inchangés.

**Le paramètre n'est pas une authentification** : une fois la branche déployée, l'URL directe serait accessible à toute personne la connaissant. Tant que cette branche n'est pas fusionnée et déployée, elle n'est pas publiée sur GitHub Pages.

Le candidat contient 65 séances × 10 QCM, 1 523 exercices de source, zéro supplément, 19 décisions pédagogiques approuvées. Dans V2 uniquement, le 3SA gambling est suivi dans les barrages avec une réponse inchangée 4♦. Sauvegarde locale indépendante `qpjb-v2-eleve-65-pedago-r1` ; export/import JSON sur la même version, sans effacement ni migration automatique.

**Avant GO public :** confirmer visibilité du lien, politique de compatibilité des sauvegardes entre versions et lancement d'une PR de publication distincte vers `main` avec tests. Aucune fusion automatique ne doit être effectuée.

**Retour arrière en cas de diffusion ultérieure :** supprimer le bloc `qpjb-v2-preview-entry` de l'accueil et le fichier de destination via un commit de retour arrière, tout en conservant temporairement une URL de reprise R1 si des élèves ont déjà commencé. Ne jamais effacer leurs clés `localStorage`. Les fichiers de sauvegarde sont la responsabilité des utilisateurs ; ils ne sont pas hébergés sur un serveur.

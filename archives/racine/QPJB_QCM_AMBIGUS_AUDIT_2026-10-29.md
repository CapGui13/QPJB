# QPJB Training — audit des deux QCM de carte en quarantaine (29/10/2026)

**Statut : propositions pédagogiques, NON appliquées aux exercices.** Les fichiers sources, réponses, explications, PDF originaux, identifiants et progression doivent rester intacts tant que les formulations proposées n'ont pas été confrontées à l'énoncé/corrigé d'origine et validées.

## 1. JC-BH-028-Q04 — troisième position à Cœur

- Source actuelle : contrat 3SA ; entame du ♥3 ; mort Nord ♥10 7 2 ; Est ♥D V 9 ; propositions ♥D, ♥V, ♥9 ; réponse enregistrée ♥9.
- **Ambiguïté** : le mort n'a pas indiqué quelle carte il fournit. S'il fournit le ♥10, le ♥9 ne couvre pas le mort ; s'il fournit le ♥2, le ♥9 suffit à dépasser la carte du mort dans cette levée. Deux états de jeu conduisent donc à des raisonnements différents.
- **Proposition à soumettre** : « Votre partenaire entame du ♥3 contre 3SA. Le mort, qui possède ♥10 7 2, fournit le ♥2. Vous détenez ♥D V 9 en Est. Quelle carte fournissez-vous ? » Conserver les trois options initiales, retenir ♥9, et préciser dans le corrigé : « Le ♥9 suffit ici à dépasser la carte fournie par le mort ; inutile de dépenser tout de suite Dame ou Valet. »
- **À vérifier** : conformité à la page originale BH-028 et validité de la justification dans la situation complète, notamment les communications et les déductions d'entame.

## 2. JC-BH-036-Q02 — impasse à la Dame à huit cartes

- Source actuelle : mort Nord ♦A R V 10 6, Sud ♦9 7 5 ; réponses « Tirer tous les gros honneurs », « Tirer l'As en sonde puis faire l'impasse à la Dame » (retenue), « Concéder le 9 », « Jouer immédiatement le 7 vers l'As ».
- **Ambiguïté** : la proposition 4 est le début possible du plan proposé en 2 et ne représente pas nécessairement une erreur.
- **Proposition à soumettre** : question « En supposant des reprises extérieures entre les deux mains et sans renseignement sur la répartition, quel plan maximise les chances de capturer la Dame à huit cartes ? » ; garder le plan 2 ; remplacer **uniquement** la proposition 4 par « Faire immédiatement l'impasse à la Dame, sans coup de sonde préalable ». Ce dernier choix omet notamment la chance supplémentaire de capturer une Dame sèche derrière les honneurs lors du coup de sonde.
- **À vérifier** : reconstituer la situation d'origine BH-036, et confirmer le maniement optimal, les positions et les hypothèses de communications avant toute publication. Les propositions 1 et 3 ne sont pas modifiées.

## État technique et tests

- Le statut `a_verifier` continue d'exclure ces deux identifiants de la liste : 112 exercices actifs sur 114 conservés.
- Au 29/10/2026, la fonction d'accès et la restauration des anciennes routes refusent également ces deux exercices ; aucun nouvel essai ne doit être noté depuis une ancienne navigation.
- Contrôles statiques : 44 tests réussis sur l'état mis à jour du dépôt. Tests de parcours navigateur modifiés pour contrôler l'accès direct, la restauration de route et la préservation de `localStorage`, mais résultat d'exécution GitHub Actions / Safari iPhone non encore confirmé.
- **Réintégration** : validation de chaque correction sur la source, puis modification ciblée des données de cet identifiant seulement, tests statiques + navigateur, actualisation du cache et vérification sur iPhone. Ne jamais réactiver par simple suppression du drapeau sans résoudre l'ambiguïté.

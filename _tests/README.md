# Vérification de la tablette

Depuis la racine du dépôt :

```powershell
python _tests/run_tablette.py
```

Le script utilise un navigateur Edge, Chrome ou Chromium déjà installé, sans fenêtre, avec un profil temporaire. Il démarre et arrête son propre serveur local. Aucun paquet à installer. Pour choisir le navigateur, ajouter `--browser "chemin/vers/le/navigateur"`.

Les tests comparent les 2 250 configurations d’intervention possibles aux tableaux lus dans `code_arduino.ino`, puis vérifient les commandes, le dessin des flèches, la correction, les onglets, la réinitialisation et la mise en page à 360 px. Le code Arduino doit rester présent pour cette comparaison ; la simulation elle-même n’en dépend pas à l’exécution.

Pour une vérification manuelle, lancer `python -m http.server 8765` et ouvrir `http://localhost:8765/_tests/tablette.html`.

Le répertoire `_tests` est ignoré par Jekyll lors de la publication GitHub Pages.

# Vérification du site et de la tablette

Le script `run_tablette.py` ouvre une page de tests dans un navigateur Edge, Chrome ou Chromium déjà installé, sans fenêtre, avec un profil temporaire. Il démarre et arrête son propre serveur local. Aucun paquet à installer. Pour choisir le navigateur, ajouter `--browser "chemin/vers/le/navigateur"`.

Il affiche le bilan (`PASS` / `FAIL` pour chaque test) et se termine en erreur si un test échoue. S'il affiche `INCOMPLET`, le navigateur a rendu la page avant la fin des tests : augmenter `--virtual-time-budget` dans le script.

## Site

Depuis la racine du dépôt :

```powershell
python _tests/run_tablette.py --page _tests/site.html
```

Les tests chargent `index.html` et vérifient : les textes, les listes et les icônes en anglais et en français ; le bouton de langue et les liens `?lang=fr` / `?lang=en` ; l'absence de requête vers un autre site et le chargement de la police locale ; les images de partage ; le menu (section soulignée, fermeture du menu mobile) ; les fenêtres de citation (ouverture, focus, fermeture, copie, BibTeX et APA) ; l'absence de débordement horizontal de 320 à 1440 px ; le fonctionnement dans un vieux navigateur.

## Tablette

```powershell
python _tests/run_tablette.py
```

Les tests comparent les 2 250 configurations d’intervention possibles aux tableaux lus dans `code_arduino.ino`, puis vérifient les commandes, le dessin des flèches, la correction, les onglets, la réinitialisation et la mise en page à 360 px. Le code Arduino doit rester présent pour cette comparaison ; la simulation elle-même n’en dépend pas à l’exécution.

Sans le fichier Arduino, lancer `python _tests/run_tablette.py --page "_tests/tablette.html?ui-only"`. Ce mode ignore explicitement les deux comparaisons Arduino et vérifie le reste : les six exercices, la génération des graphes, la date du défi, les chronos, la réussite du défi conservée après rechargement et les commandes sur ordinateur et téléphone.

Les tests d’interface tournent en français (`tablette.html?lang=fr`). Les derniers vérifient la traduction : mêmes clés et mêmes repères `{…}` dans les deux langues, page, aide, messages et annonces pour lecteurs d’écran entièrement en anglais (aucun mot ni morceau de phrase français), bascule FR / EN en cours de partie, langue choisie au chargement, et barre du haut lisible de 320 à 390 px.

## Vérification manuelle

Lancer `python -m http.server 8765` et ouvrir `http://localhost:8765/_tests/site.html` ou `http://localhost:8765/_tests/tablette.html`.

Le répertoire `_tests` est ignoré par Jekyll lors de la publication GitHub Pages.

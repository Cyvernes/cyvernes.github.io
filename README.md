# Site académique de Clément Yvernes

Site statique en français et en anglais, publié par GitHub Pages sur <https://cyvernes.github.io>.
Il n'y a rien à compiler : on modifie les fichiers, on pousse sur `main`, et le site est à jour.

## Où modifier quoi

| Pour modifier… | Fichier |
|---|---|
| Un texte de la page : menu, en-tête, médiation, logiciels, stages, À propos, pied de page | `translations.js` |
| Les publications (liens, BibTeX) | `publications.js` |
| Les présentations et les conférences suivies | `conferences.js` |
| Les cours | `teaching.js` |
| L'apparence (couleurs, tailles, espacements) | `styles.css` |
| La structure de la page (ajouter une carte, une section) | `index.html` |
| Le fonctionnement (changement de langue, menu, fenêtres de citation) | `script.js` |
| Les icônes des liens (dessins SVG, tirés de [Lucide](https://lucide.dev) et [Tabler](https://tabler.io/icons)) | `script.js`, liste `ICON_PATHS` |
| La tablette causale | `tablette.html`, `tablette.js`, `tablette-model.js`, `tablette.css` |

Les PDF sont rangés dans `posters/` et `slides/`. La police Inter est hébergée dans `fonts/` : le site ne charge rien depuis un autre site.

L'image affichée quand on partage le site (LinkedIn, Mastodon…) est `images/og-image.png` (PNG de 2400 × 1260 px, double résolution du format standard 1200 × 630 pour rester net sur les écrans haute densité) ; l'icône d'écran d'accueil iOS est `images/apple-touch-icon.png` (180 × 180 px). Ces formats doivent rester des PNG : les SVG ne sont pas acceptés.

## Langue

La page s'affiche dans la dernière langue choisie par le visiteur, en anglais par défaut. L'adresse indique la langue affichée : <https://cyvernes.github.io/?lang=fr> ouvre toujours la version française, ce qui permet de partager un lien en français.

## Modifier un texte

Dans `index.html`, un élément qui porte `data-lang="clé"` affiche le texte de cette clé, pris dans `translations.js`.
Pour modifier un texte, changer sa valeur dans la partie `fr` **et** dans la partie `en`.

Le texte anglais écrit dans `index.html` ne sert que si le JavaScript ne se charge pas : le modifier ne change pas ce qui s'affiche.

Pour ajouter un texte, mettre `data-lang="nouvelle-cle"` sur l'élément dans `index.html`, puis ajouter `'nouvelle-cle'` dans `fr` et dans `en`.

## Ajouter une publication, une présentation ou un cours

Copier un bloc existant dans le fichier concerné et le modifier. Le mode d'emploi des champs est en commentaire en haut de `conferences.js` et de `teaching.js`. Les listes sont triées automatiquement, la plus récente en premier.

Un champ qui change selon la langue s'écrit `{ fr: "…", en: "…" }`. S'il est identique dans les deux langues, une simple chaîne suffit (par exemple `venue: "ICML 2026"`).

## Pièges à éviter

- **Apostrophes** : dans un texte entouré de `'…'`, une apostrophe droite `'` termine le texte et casse le fichier. Utiliser l'apostrophe typographique `’`, ou écrire `\'`.
- **Virgules** : garder la virgule à la fin de chaque ligne `'clé': 'texte',`.
- **HTML** : les textes de `translations.js` peuvent contenir du HTML, par exemple un lien `<a href="https://...">texte</a>` (guillemets doubles autour de l'adresse). Pour afficher le signe `<`, écrire `&lt;`.

## Vérifier avant de publier

Ouvrir `index.html` dans le navigateur, ou lancer `python -m http.server 8000` à la racine puis ouvrir <http://localhost:8000>. Rafraîchir avec Ctrl+F5 et changer de langue avec le bouton FR/EN.

Si une liste disparaît, son fichier contient une erreur (souvent une apostrophe ou une virgule) : le reste de la page continue de fonctionner, et la console du navigateur (F12) indique le fichier et la ligne.

Des tests automatiques vérifient la page et la tablette (langues, menu, citations, mise en page…). Les lancer avant de pousser une modification du fonctionnement :

```powershell
python _tests/run_tablette.py --page _tests/site.html
python _tests/run_tablette.py --page "_tests/tablette.html?ui-only"
```

Le détail est dans `_tests/README.md`.

// Textes du site en français (fr) et en anglais (en).
//
// Dans index.html, un élément qui porte data-lang="clé" affiche le texte de cette clé
// dans la langue choisie. Pour modifier un texte, changer sa valeur dans fr ET dans en.
//
// Attention :
//   - écrire l’apostrophe typographique ’ (ou \') : une apostrophe droite ' termine le texte ;
//   - garder la virgule à la fin de chaque ligne ;
//   - les textes peuvent contenir du HTML, par exemple un lien : <a href="https://...">texte</a>
//     (mettre des guillemets doubles " autour de l’adresse) ; écrire &lt; pour afficher le signe <.
//
// Les publications, présentations et cours ont leurs propres fichiers :
// publications.js, conferences.js et teaching.js.
const translations = {
    fr: {
        // Menu et bouton de langue
        'nav-home': 'Accueil',
        'menu-publications': 'Publications',
        'menu-conferences': 'Présentations',
        'menu-outreach': 'Médiation',
        'menu-software': 'Logiciels',
        'menu-teaching': 'Enseignement',
        'menu-about': 'À propos',
        'language-button': 'Passer en anglais',

        // Titre de l’onglet et description pour les moteurs de recherche
        'page-title': 'Clément Yvernes · Inférence causale',
        'page-description': 'Clément Yvernes étudie quels effets causaux peuvent être identifiés avec une connaissance partielle d’un système. Doctorant dans l’équipe APTIKAL du LIG, Université Grenoble Alpes.',

        // En-tête
        'hero-affiliation': 'Doctorant dans l’équipe APTIKAL du Laboratoire d’informatique de Grenoble (LIG), à l’Université Grenoble Alpes.',
        'hero-question': 'Comment raisonner causalement avec des connaissances incomplètes ?',

        // Publications (publications.js)
        'publications-title': 'Publications',
        'pub-identifiability-status': 'Prépublication · En cours d’évaluation au <cite>Journal of Causal Inference</cite>',
        'workshop-venue': 'Atelier CAR à UAI',
        'pub-proceedings': 'Actes',
        'pub-more': 'Autres liens',
        'award-short': 'Prix du public pour le poster aux PEPR IA Days, Rennes, juin 2026',
        'pub-extended-version': 'Version étendue et corrigée (2026)',
        'pub-workshop-version': 'Version étendue et corrigée de l’article du workshop CAR 2025',

        // Fenêtre « Citation » des publications
        'citation': 'Citation',
        'citation-copy-bibtex': 'Copier BibTeX',
        'citation-copy-apa': 'Copier APA',
        'citation-copied': '✓ Copié !',
        'citation-close': 'Fermer',

        // Présentations (conferences.js)
        'conferences-title': 'Présentations',
        'pres-talk': 'Exposé',
        'pres-poster': 'Poster',
        'pres-slides': 'Slides',
        'pres-poster-link': 'Poster',
        'pres-attended': 'Également présent à :',

        // Médiation scientifique
        'responsibilities-title': 'Médiation scientifique',
        'pariscience-title': 'Les pièges de la causalité : testez votre intuition',
        'date-pariscience': '23 octobre 2026',
        'pariscience-description': 'Animation d’une conférence grand public lors du festival Pariscience 2026, devant 75 personnes.',
        'festival-watch': 'Voir la conférence',
        'festival-report': 'Bilan du festival',
        'festival-pepr': 'Bilan du PEPR IA',
        'festival-slides': 'Slides (PDF)',
        'lambda-title': 'La causalité dans Lambda',
        'date-lambda': '5 juin 2026',
        'lambda-description': 'Interview sur la causalité, avec Flora Helmers, pour Lambda, une émission de médiation scientifique produite par AurorAlpes qui invite des chercheurs à présenter leurs travaux.',
        'lambda-watch': 'Voir l’interview',
        'date-fete-science': 'Octobre 2025',
        'tablet-title': 'Explorer la causalité avec des lumières',
        'tablet-outreach': 'Conception et animation d’un atelier sur la causalité.',
        'tablet-cta': 'Essayer la version en ligne',

        // Logiciels et projets
        'software-title': 'Logiciels et projets',
        'causaforge-description': 'Cette application web permet d’éditer un graphe causal, d’identifier des effets causaux et de visualiser des graphes de dérivation.',
        'causaforge-credit-before': 'Encadrement des stages de',
        'causaforge-credit-and': 'et',
        'causaforge-credit-after': ', qui ont réalisé l’essentiel du développement.',

        // Enseignement et encadrement (les cours sont dans teaching.js)
        'nav-teaching': 'Enseignement et encadrement',
        'courses-title': 'Cours',
        'course-page': 'Page du cours',
        'internships-title': 'Encadrement de stages',
        'stage-younes-topic': 'Algorithmes d’identification causale en Python',
        'stage-amine-topic': 'Interface web pour l’identification causale',

        // À propos
        'about-title': 'À propos',
        'about-research': 'Je suis doctorant à l’<a href="https://www.univ-grenoble-alpes.fr/">Université Grenoble Alpes</a>, dans l’équipe <a href="https://lig-aptikal.imag.fr/">APTIKAL</a> du <a href="https://www.liglab.fr/">Laboratoire d’informatique de Grenoble</a> (LIG). Mes travaux portent sur l’inférence causale lorsque la structure causale n’est connue qu’en partie, par exemple sous la forme d’un graphe résumé ou d’une abstraction. Je m’intéresse plus particulièrement à l’identification d’effets causaux : déterminer quand l’effet d’une intervention peut être calculé à partir de données observées.',
        'doctorate-title': 'Doctorat',
        'cv-doctorate': 'Doctorat en informatique et mathématiques appliquées, Université Grenoble Alpes (APTIKAL, LIG), en cours depuis 2024. Encadrement : <a href="https://lig-aptikal.imag.fr/~devijvee/">Émilie Devijver</a>, <a href="https://lig-aptikal.imag.fr/~gaussier/">Éric Gaussier</a> et <a href="https://sites.google.com/site/marianneclausel">Marianne Clausel</a>.',
        'formation-title': 'Formation',
        'formation-1': 'Ingénieur généraliste, Centrale Lyon, 2024',
        'formation-2': 'Diplôme de l’ENS de Lyon, 2024',
        'formation-3': 'Master d’informatique, ENS de Lyon, 2024',
        'cv-service': 'Responsabilités collectives',
        'cv-maintenance': 'Maintenance et développement du',
        'cv-aptikal': 'site de l’équipe APTIKAL',

        // Pied de page
        'footer-rights': 'Tous droits réservés.'
    },
    en: {
        // Menu et bouton de langue
        'nav-home': 'Home',
        'menu-publications': 'Publications',
        'menu-conferences': 'Presentations',
        'menu-outreach': 'Outreach',
        'menu-software': 'Software',
        'menu-teaching': 'Teaching',
        'menu-about': 'About',
        'language-button': 'Switch to French',

        // Titre de l’onglet et description pour les moteurs de recherche
        'page-title': 'Clément Yvernes · Causal Inference',
        'page-description': 'Clément Yvernes studies which causal effects can be identified with partial knowledge of a system. PhD student in the APTIKAL team at LIG, Université Grenoble Alpes.',

        // En-tête
        'hero-affiliation': 'PhD student in the APTIKAL team at the Grenoble Informatics Laboratory (LIG), Université Grenoble Alpes.',
        'hero-question': 'How can we reason about cause and effect when our knowledge is incomplete?',

        // Publications (publications.js)
        'publications-title': 'Publications',
        'pub-identifiability-status': 'Preprint · Under review at the <cite>Journal of Causal Inference</cite>',
        'workshop-venue': 'CAR Workshop at UAI',
        'pub-proceedings': 'Proceedings',
        'pub-more': 'More links',
        'award-short': 'Poster Audience Award at PEPR IA Days, Rennes, June 2026',
        'pub-extended-version': 'Extended and corrected version (2026)',
        'pub-workshop-version': 'Extended and corrected version of the CAR 2025 workshop paper',

        // Fenêtre « Citation » des publications
        'citation': 'Citation',
        'citation-copy-bibtex': 'Copy BibTeX',
        'citation-copy-apa': 'Copy APA',
        'citation-copied': '✓ Copied!',
        'citation-close': 'Close',

        // Présentations (conferences.js)
        'conferences-title': 'Presentations',
        'pres-talk': 'Talk',
        'pres-poster': 'Poster',
        'pres-slides': 'Slides',
        'pres-poster-link': 'Poster',
        'pres-attended': 'Also attended:',

        // Médiation scientifique
        'responsibilities-title': 'Science outreach',
        'pariscience-title': 'The pitfalls of causality: test your intuition',
        'date-pariscience': '23 October 2026',
        'pariscience-description': 'Public talk at the Pariscience 2026 festival, to an audience of 75 people.',
        'festival-watch': 'Watch the talk (in French)',
        'festival-report': 'Festival report',
        'festival-pepr': 'PEPR IA recap',
        'festival-slides': 'Slides (PDF, in French)',
        'lambda-title': 'Causality on Lambda',
        'date-lambda': '5 June 2026',
        'lambda-description': 'Interview on causality, with Flora Helmers, for Lambda, a science outreach show produced by AurorAlpes that invites researchers to present their work.',
        'lambda-watch': 'Watch the interview (in French)',
        'date-fete-science': 'October 2025',
        'tablet-title': 'Exploring causality with lights',
        'tablet-outreach': 'Design and delivery of a workshop on causality.',
        'tablet-cta': 'Try the online version',

        // Logiciels et projets
        'software-title': 'Software and projects',
        'causaforge-description': 'This web application lets you edit a causal graph, identify causal effects and visualise derivation graphs.',
        'causaforge-credit-before': 'Supervision of the internships of',
        'causaforge-credit-and': 'and',
        'causaforge-credit-after': ', who did most of the development.',

        // Enseignement et encadrement (les cours sont dans teaching.js)
        'nav-teaching': 'Teaching & supervision',
        'courses-title': 'Courses',
        'course-page': 'Course page',
        'internships-title': 'Internship supervision',
        'stage-younes-topic': 'Causal identification algorithms in Python',
        'stage-amine-topic': 'Web interface for causal identification',

        // À propos
        'about-title': 'About',
        'about-research': 'I am a PhD student at <a href="https://www.univ-grenoble-alpes.fr/">Université Grenoble Alpes</a>, in the <a href="https://lig-aptikal.imag.fr/">APTIKAL</a> team of the <a href="https://www.liglab.fr/">Grenoble Informatics Laboratory</a> (LIG). My work focuses on causal inference when the causal structure is only partially known, for instance through a summary graph or an abstraction. More specifically, I study the identification of causal effects: determining when the effect of an intervention can be computed from observed data.',
        'doctorate-title': 'PhD',
        'cv-doctorate': 'PhD in computer science and applied mathematics, Université Grenoble Alpes (APTIKAL, LIG), ongoing since 2024. Supervisors: <a href="https://lig-aptikal.imag.fr/~devijvee/">Émilie Devijver</a>, <a href="https://lig-aptikal.imag.fr/~gaussier/">Éric Gaussier</a> and <a href="https://sites.google.com/site/marianneclausel">Marianne Clausel</a>.',
        'formation-title': 'Education',
        'formation-1': 'Generalist Engineer, Centrale Lyon, 2024',
        'formation-2': 'ENS de Lyon Diploma, 2024',
        'formation-3': 'Master’s in Computer Science, ENS de Lyon, 2024',
        'cv-service': 'Academic service',
        'cv-maintenance': 'Maintenance and development of the',
        'cv-aptikal': 'APTIKAL team website',

        // Pied de page
        'footer-rights': 'All rights reserved.'
    }
};

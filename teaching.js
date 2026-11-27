// Cours : une entrée par cours. L'ordre n'a pas d'importance, le plus récent est affiché en premier.
// Pour en ajouter un, copier un bloc ci-dessous.
//   title       : intitulé du cours { fr, en }
//   level       : niveau des étudiants { fr, en }
//   description : ce que j'y ai fait, en une phrase { fr, en } (sans répéter l'établissement)
//   years       : années d'enseignement, ex. [2024, 2025, 2026] (affiché « 2024–2026 »)
//   institution : établissement { fr, en }
//   website     : facultatif, page officielle du cours (lien « Page du cours » à droite)
const courses = [
    {
        id: "iasd_master",
        title: {
            fr: "Introduction à l'intelligence artificielle et la science des données",
            en: "Introduction to Artificial Intelligence and Data Science"
        },
        level: {
            fr: "Master 1",
            en: "Master 1"
        },
        description: {
            fr: "Travaux pratiques.",
            en: "Practical sessions."
        },
        years: [2024, 2025, 2026],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Université Grenoble Alpes"
        },
        // Fiche de l'UE (Master Informatique, UFR IM2AG) dans le catalogue des formations de l'UGA
        website: "https://formations.univ-grenoble-alpes.fr/fr/catalogue-2021/master-XB/master-informatique-IAQK9B8Z/parcours-informatique-classique-1re-annee-IGM7WZRC/ue-introduction-a-l-intelligence-artificielle-et-la-science-des-donnees-KW0NX1C1.html"
    },
    {
        id: "algo_licence",
        title: {
            fr: "Algorithmique et programmation impérative",
            en: "Algorithms and Imperative Programming"
        },
        level: {
            fr: "Licence 2",
            en: "Bachelor 2"
        },
        description: {
            fr: "Cours en apprentissage par problèmes.",
            en: "Problem-based learning course."
        },
        years: [2025],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Université Grenoble Alpes"
        },
        // Fiche de l'UE INF301 (DLST) dans le catalogue des formations de l'UGA
        website: "https://formations.univ-grenoble-alpes.fr/plugins/odf-web/odf/_content/course-algorithmique-et-programmation-imperative-3-6/UE%20Algorithmique%20et%20programmation%20imp%C3%A9rative%20-%20INF301%20-.pdf"
    },
    {
        id: "sta301_licence",
        title: {
            fr: "Méthodes statistiques pour la biologie",
            en: "Statistical Methods for Biology"
        },
        level: {
            fr: "Licence 2",
            en: "Bachelor 2"
        },
        description: {
            fr: "Travaux pratiques de statistique descriptive et inférentielle avec le logiciel R, pour des étudiants de L2 en biologie, SVT et biochimie.",
            en: "Practical sessions in descriptive and inferential statistics with R, for second-year students in biology, Earth sciences and biochemistry."
        },
        years: [2026],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Université Grenoble Alpes"
        },
        // Fiche de l'UE STA301 (DLST) dans le catalogue des formations de l'UGA
        website: "https://formations.univ-grenoble-alpes.fr/plugins/odf-web/odf/_content/course-methodes-statistiques-pour-la-biologie-2-6/UE%20M%C3%A9thodes%20statistiques%20pour%20la%20biologie%20-%20STA301%20-.pdf"
    },
    {
        id: "causality_summer",
        title: {
            fr: "Introduction à la causalité",
            en: "Introduction to Causality"
        },
        level: {
            fr: "Licence 3",
            en: "Bachelor 3"
        },
        description: {
            fr: "Summer School of Artificial Intelligence",
            en: "Summer School of Artificial Intelligence"
        },
        years: [2025],
        institution: {
            fr: "Grenoble INP - Ensimag",
            en: "Grenoble INP - Ensimag"
        }
    },
    {
        id: "learning_prob_causalities",
        title: {
            fr: "Learning, Probabilities and Causalities",
            en: "Learning, Probabilities and Causalities"
        },
        level: {
            fr: "Master 2",
            en: "Master 2"
        },
        description: {
            fr: "Enseignement du paradoxe de Simpson et des graphes de dérivation.",
            en: "Teaching of Simpson’s paradox and derivation graphs."
        },
        years: [2025, 2026],
        institution: {
            fr: "Grenoble INP - Ensimag",
            en: "Grenoble INP - Ensimag"
        },
        website: "https://ensimag.grenoble-inp.fr/fr/formation/learning-probabilites-and-causalities-wmm9am77"
    }
];

// Années affichées de façon compacte : [2024, 2025, 2026] -> "2024–2026", [2023, 2025] -> "2023, 2025"
function formatYears(years) {
    const sorted = [...(years || [])].sort((a, b) => a - b);
    if (sorted.length < 2) return sorted.join('');
    const consecutive = sorted.every((y, i) => i === 0 || y === sorted[i - 1] + 1);
    return consecutive ? `${sorted[0]}–${sorted[sorted.length - 1]}` : sorted.join(', ');
}

// HTML d'un cours (même présentation que la liste des Présentations)
function generateCourseHTML(course) {
    const institution = localized(course.institution);
    const description = localized(course.description);
    const venue = [formatYears(course.years), localized(course.level)].filter(Boolean).join(' &middot; ');

    return `
        <article id="${course.id}" class="publication-item">
            <div class="pub-content">
                <h4 class="pub-title">${localized(course.title)}</h4>
                <div class="pub-meta">
                    <p class="pub-venue">${venue}</p>
                    ${institution ? `<p>${institution}</p>` : ''}
                </div>
                ${description ? `<p class="pub-note">${description}</p>` : ''}
            </div>
            ${course.website ? `
            <div class="pub-links">
                <a href="${course.website}" target="_blank" rel="noopener" class="pub-link">${icon('external-link')} ${t('course-page')}</a>
            </div>` : ''}
        </article>`;
}

// Affiche la liste des cours, le plus récent d'abord (appelé par translatePage dans script.js)
function initializeTeaching() {
    const teachingContainer = document.getElementById('teaching-container');
    if (!teachingContainer) return;

    const lastYear = (course) => Math.max(...(course.years || [0]));
    teachingContainer.innerHTML = courses
        .map((course, index) => ({ course, index }))
        .sort((a, b) => lastYear(b.course) - lastYear(a.course) || a.index - b.index)
        .map(({ course }) => generateCourseHTML(course))
        .join('');
}

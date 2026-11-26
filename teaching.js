// Cours : une entrée par cours. L'ordre n'a pas d'importance, le plus récent est affiché en premier.
// Pour en ajouter un, copier un bloc ci-dessous.
//   title       : intitulé du cours { fr, en }
//   level       : niveau des étudiants { fr, en }
//   description : ce que j'y ai fait, en une phrase { fr, en } (sans répéter l'établissement)
//   years       : années d'enseignement, ex. [2024, 2025, 2026] (affiché « 2024–2026 »)
//   institution : établissement { fr, en }
//   website     : facultatif, page officielle du cours (pas encore affichée sur le site)
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
            fr: "Travaux pratiques du Master Informatique.",
            en: "Practical sessions for the Master in Computer Science."
        },
        years: [2024, 2025, 2026],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Grenoble Alpes University"
        }
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
            en: "Grenoble Alpes University"
        }
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
            fr: "Travaux pratiques de statistique descriptive et inférentielle avec le logiciel R, pour des étudiants de L2 en biologie, SCT et biochimie.",
            en: "Practical sessions in descriptive and inferential statistics with R, for second-year students in biology, Earth sciences and biochemistry."
        },
        years: [2026],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Grenoble Alpes University"
        }
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

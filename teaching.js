// Liste des enseignements - Il suffit d'ajouter ici pour ajouter un nouveau cours
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
            fr: "Travaux pratiques du Master Informatique, Université Grenoble Alpes",
            en: "Practical work sessions for Master in Computer Science, Grenoble Alpes University"
        },
        category: "master",
        years: [2024, 2025],
        institution: {
            fr: "Université Grenoble Alpes",
            en: "Grenoble Alpes University"
        }
    },
    {
        id: "algo_licence",
        title: {
            fr: "Algorithmique et Programmation Impérative",
            en: "Algorithms and Imperative Programming"
        },
        level: {
            fr: "Licence 2",
            en: "Bachelor 2"
        },
        description: {
            fr: "Cours avec pédagogie APP (Apprentissage Par Problèmes), Université Grenoble Alpes",
            en: "Course using PBL (Problem-Based Learning) pedagogy, Grenoble Alpes University"
        },
        category: "bachelor",
        years: [2025],
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
            fr: "Summer School",
            en: "Summer School"
        },
        description: {
            fr: "Summer School of Artificial Intelligence, Grenoble INP - Ensimag",
            en: "Summer School of Artificial Intelligence, Grenoble INP - Ensimag"
        },
        category: "summer",
        years: [2025],
        institution: {
            fr: "Grenoble INP - Ensimag",
            en: "Grenoble INP - Ensimag"
        }
    }
];

// Fonction pour générer le HTML d'un cours
function generateCourseHTML(course) {
    // Utiliser directement la langue courante et les fonctions de traduction du script principal
    const lang = document.documentElement.lang || 'en';
    
    const title = course.title[lang] || course.title.en || course.title.fr || '';
    const level = course.level[lang] || course.level.en || course.level.fr || '';
    let description = (course.description[lang] || course.description.en || course.description.fr || '').trim();
    const institution = (course.institution[lang] || course.institution.en || course.institution.fr || '').trim();
    
    
    // Éviter la duplication de l'établissement si déjà présent en fin de description
    if (institution) {
        const instEscaped = institution.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const trailingInstRegex = new RegExp(`(?:[ ,\u2013\u2014\-])*${instEscaped}$`); // virgule/espace/tiret/–/—
        description = description.replace(trailingInstRegex, '').trim();
    }

    // Les années sont affichées dans les chips, pas besoin de les ajouter à la description
    const fullDescription = description.trim();
    
    // Traduction du mot "Niveau"
    const levelLabel = lang === 'en' ? 'Level' : 'Niveau';
    const yearChips = (course.years || []).map(y => `<span class="chip year-chip">${y}</span>`).join(' ');
    const levelChip = `<span class="chip level-chip">${levelLabel}: ${level}</span>`;

    return `
        <div class="course-item" data-category="${course.category}">
            <h4 class="course-title">${title}</h4>
            <div class="course-meta">${levelChip} ${yearChips}</div>
            <p class="course-description">${fullDescription}</p>
            ${institution ? `<p class="course-institution">${institution}</p>` : ''}
        </div>
    `;
}

// Fonction pour initialiser les enseignements sur la page
function initializeTeaching() {
    const teachingContainer = document.getElementById('teaching-container');
    
    if (!teachingContainer) return;

    // Générer le HTML des cours
    let coursesHTML = '';
    courses.forEach(course => {
        coursesHTML += generateCourseHTML(course);
    });

    teachingContainer.innerHTML = coursesHTML;
}

// Initialisation centralisée via translatePage() dans script.js

// Fonctionnement commun de la page : langue, menu, fenêtres de citation.
// Les textes sont dans translations.js ; les listes dans publications.js, conferences.js et teaching.js.

// ---------------------------------------------------------------------------
// Langue
// ---------------------------------------------------------------------------

// Langue affichée : 'fr' ou 'en'
function currentLanguage() {
    return document.documentElement.lang === 'fr' ? 'fr' : 'en';
}

// Texte de translations.js pour une clé, dans la langue affichée
function t(key) {
    return translations[currentLanguage()]?.[key] ?? translations.en[key] ?? key;
}

// Texte d'une donnée : une chaîne (identique dans les deux langues) ou { fr: "...", en: "..." }
function localized(value) {
    if (value && typeof value === 'object') {
        return value[currentLanguage()] || value.en || value.fr || '';
    }
    return value || '';
}

function savedLanguage() {
    try {
        return localStorage.getItem('language') === 'fr' ? 'fr' : 'en';
    } catch (e) {
        return 'en';
    }
}

function saveLanguage(lang) {
    try {
        localStorage.setItem('language', lang);
    } catch (e) {
        // Stockage indisponible (navigation privée) : la langue n'est simplement pas mémorisée.
    }
}

// Génère une liste sans bloquer le reste de la page si son fichier contient une erreur
function renderSafely(render) {
    try {
        render();
    } catch (error) {
        console.error(error);
    }
}

// Affiche toute la page dans la langue demandée
function translatePage(lang) {
    document.documentElement.lang = lang;

    // 1. Listes générées à partir des données
    renderSafely(() => initializePublications());
    renderSafely(() => initializeConferences());
    renderSafely(() => initializeTeaching());

    // 2. Textes fixes de index.html (attribut data-lang). Ils peuvent contenir du HTML, par exemple un lien.
    document.querySelectorAll('[data-lang]').forEach((element) => {
        const key = element.getAttribute('data-lang');
        if (Object.hasOwn(translations[lang], key)) {
            element.innerHTML = translations[lang][key];
        }
    });

    // 3. Bouton de langue : affiche la langue courante puis l'autre
    document.getElementById('currentLang').textContent = lang.toUpperCase();
    document.querySelector('.alt-lang').textContent = lang === 'fr' ? 'EN' : 'FR';
    const languageButton = document.getElementById('langBtn');
    languageButton.title = t('language-button');
    languageButton.setAttribute('aria-label', languageButton.title);

    saveLanguage(lang);

    // Rend la page visible (elle est masquée au chargement pour éviter un flash de texte non traduit)
    if (window.revealAfterInitialization) {
        window.revealAfterInitialization();
    }
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Menu mobile
    hamburger.addEventListener('click', () => {
        const expanded = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', expanded);
        hamburger.setAttribute('aria-expanded', String(expanded));
    });

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Souligner dans le menu la section en cours de lecture
    function setActiveNavLink() {
        let current = '';
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.id;
            }
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // Barre de navigation légèrement transparente une fois la page défilée
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    }

    window.addEventListener('scroll', () => {
        setActiveNavLink();
        updateNavbarBackground();
    }, { passive: true });

    setActiveNavLink();
}

// ---------------------------------------------------------------------------
// Fenêtres « Citation » des publications
// ---------------------------------------------------------------------------

function closeCitationModals() {
    document.querySelectorAll('.citation-modal').forEach((modal) => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Copie le BibTeX ou l'APA dans le presse-papiers et l'indique sur le bouton
function copyCitation(button) {
    const source = document.getElementById(button.dataset.copy);
    if (!source || button.dataset.copied) return;

    const showFeedback = () => {
        const label = button.textContent;
        button.dataset.copied = 'true';
        button.textContent = t('citation-copied');
        button.style.background = 'var(--ai-green)';
        setTimeout(() => {
            button.textContent = label;
            button.style.background = '';
            delete button.dataset.copied;
        }, 1500);
    };
    const copyWithSelection = () => {
        try {
            if (document.execCommand('copy')) showFeedback();
        } catch (error) {
            console.error('Erreur lors de la copie :', error);
        }
    };

    source.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(source.value).then(showFeedback, copyWithSelection);
    } else {
        copyWithSelection();
    }
}

// Les fenêtres sont régénérées à chaque changement de langue :
// les clics sont donc écoutés sur le document entier.
function setupCitationModals() {
    document.addEventListener('click', (event) => {
        const citationLink = event.target.closest('.citation-link');
        if (citationLink) {
            event.preventDefault();
            const modal = document.getElementById(citationLink.dataset.modal);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        const copyButton = event.target.closest('.copy-btn');
        if (copyButton) {
            copyCitation(copyButton);
            return;
        }

        // Croix de fermeture, ou clic sur le fond grisé autour de la fenêtre
        if (event.target.closest('.citation-modal .close') || event.target.classList.contains('citation-modal')) {
            closeCitationModals();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeCitationModals();
        }
    });
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    translatePage(savedLanguage());

    document.getElementById('langBtn').addEventListener('click', () => {
        translatePage(currentLanguage() === 'fr' ? 'en' : 'fr');
    });

    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    setupNavigation();
    setupCitationModals();
});

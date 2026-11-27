// Fonctionnement commun de la page : langue, menu, fenêtres de citation, icônes.
// Les textes sont dans translations.js ; les listes dans publications.js, conferences.js et teaching.js.

const SITE_URL = 'https://cyvernes.github.io/';

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

// Langue demandée dans l'adresse (?lang=fr ou ?lang=en), sinon null
function languageFromUrl() {
    try {
        const lang = new URLSearchParams(window.location.search).get('lang');
        return lang === 'fr' || lang === 'en' ? lang : null;
    } catch (e) {
        return null;
    }
}

// Langue au chargement : celle de l'adresse, sinon le dernier choix du visiteur, sinon l'anglais
function initialLanguage() {
    const fromUrl = languageFromUrl();
    if (fromUrl) return fromUrl;
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

// Met l'adresse à jour sans recharger la page : ?lang=fr en français, rien en anglais.
// Un lien copié depuis la barre d'adresse ouvre ainsi la page dans la langue affichée.
function showLanguageInUrl(lang) {
    try {
        const url = new URL(window.location.href);
        if (lang === 'fr') {
            url.searchParams.set('lang', 'fr');
        } else {
            url.searchParams.delete('lang');
        }
        if (url.href !== window.location.href) {
            history.replaceState(history.state, '', url.href);
        }
    } catch (e) {
        // Adresse non modifiable (fichier ouvert directement) : sans conséquence.
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
        if (Object.prototype.hasOwnProperty.call(translations[lang], key)) {
            element.innerHTML = translations[lang][key];
        }
    });

    // 3. Titre de l'onglet, description et adresse de référence pour les moteurs de recherche
    document.title = t('page-title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('page-description'));
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', lang === 'fr' ? `${SITE_URL}?lang=fr` : SITE_URL);

    // La tablette causale s'ouvre dans la langue affichée
    document.querySelectorAll('a[href^="tablette.html"]').forEach((link) => {
        link.setAttribute('href', `tablette.html?lang=${lang}`);
    });

    // 4. Bouton de langue : affiche la langue courante puis l'autre
    document.getElementById('currentLang').textContent = lang.toUpperCase();
    document.querySelector('.alt-lang').textContent = lang === 'fr' ? 'EN' : 'FR';
    const languageButton = document.getElementById('langBtn');
    languageButton.title = t('language-button');
    languageButton.setAttribute('aria-label', languageButton.title);

    saveLanguage(lang);
    showLanguageInUrl(lang);

    // Rend la page visible si elle a été masquée au chargement (voir le script anti-flash de index.html)
    if (window.revealAfterInitialization) {
        window.revealAfterInitialization();
    }
}

// ---------------------------------------------------------------------------
// Icônes : Lucide (licence ISC : https://lucide.dev/license), au trait ;
// sauf « quote », plus légère, tirée de Tabler (licence MIT : https://tabler.io/icons),
// et « award », pleine, tirée de Font Awesome Free 6 (licence CC BY 4.0 : https://fontawesome.com/license/free).
// Une icône au trait est une chaîne (dessin 24 × 24) ; une icône pleine est { viewBox, paths }.
// ---------------------------------------------------------------------------

const ICON_PATHS = {
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'archive': '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    'messages-square': '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'quote': '<path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"/><path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"/>',
    'award': {
        viewBox: '0 0 384 512',
        paths: '<path d="M288 358.3c13.98-8.088 17.53-30.04 28.88-41.39c11.35-11.35 33.3-14.88 41.39-28.87c7.98-13.79 .1658-34.54 4.373-50.29C366.7 222.5 383.1 208.5 383.1 192c0-16.5-17.27-30.52-21.34-45.73c-4.207-15.75 3.612-36.5-4.365-50.29c-8.086-13.98-30.03-17.52-41.38-28.87c-11.35-11.35-14.89-33.3-28.87-41.39c-13.79-7.979-34.54-.1637-50.29-4.375C222.5 17.27 208.5 0 192 0C175.5 0 161.5 17.27 146.3 21.34C130.5 25.54 109.8 17.73 95.98 25.7C82 33.79 78.46 55.74 67.11 67.08C55.77 78.43 33.81 81.97 25.72 95.95C17.74 109.7 25.56 130.5 21.35 146.2C17.27 161.5 .0008 175.5 .0008 192c0 16.5 17.27 30.52 21.34 45.73c4.207 15.75-3.615 36.5 4.361 50.29C33.8 302 55.74 305.5 67.08 316.9c11.35 11.35 14.89 33.3 28.88 41.4c13.79 7.979 34.53 .1582 50.28 4.369C161.5 366.7 175.5 384 192 384c16.5 0 30.52-17.27 45.74-21.34C253.5 358.5 274.2 366.3 288 358.3zM112 192c0-44.27 35.81-80 80-80s80 35.73 80 80c0 44.17-35.81 80-80 80S112 236.2 112 192zM1.719 433.2c-3.25 8.188-1.781 17.48 3.875 24.25c5.656 6.75 14.53 9.898 23.12 8.148l45.19-9.035l21.43 42.27C99.46 507 107.6 512 116.7 512c.3438 0 .6641-.0117 1.008-.0273c9.5-.375 17.65-6.082 21.24-14.88l33.58-82.08c-53.71-4.639-102-28.12-138.2-63.95L1.719 433.2zM349.6 351.1c-36.15 35.83-84.45 59.31-138.2 63.95l33.58 82.08c3.594 8.797 11.74 14.5 21.24 14.88C266.6 511.1 266.1 512 267.3 512c9.094 0 17.23-4.973 21.35-13.14l21.43-42.28l45.19 9.035c8.594 1.75 17.47-1.398 23.12-8.148c5.656-6.766 7.125-16.06 3.875-24.25L349.6 351.1z"/>'
    }
};

// Icône décorative (ignorée par les lecteurs d'écran), à la taille du texte qui l'entoure
function icon(name) {
    const drawing = ICON_PATHS[name] || '';
    if (typeof drawing === 'object') {
        return `<svg class="icon" viewBox="${drawing.viewBox}" fill="currentColor" aria-hidden="true" focusable="false">${drawing.paths}</svg>`;
    }
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawing}</svg>`;
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
    const menuIsOpen = () => navMenu.classList.contains('active');
    function setMenuOpen(open) {
        navMenu.classList.toggle('active', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    }

    hamburger.addEventListener('click', () => setMenuOpen(!menuIsOpen()));

    // Fermer le menu mobile : clic sur un lien, clic à côté du menu, ou touche Échap
    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('click', (event) => {
        if (menuIsOpen() && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            setMenuOpen(false);
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuIsOpen()) {
            setMenuOpen(false);
            hamburger.focus();
        }
    });

    // Souligner dans le menu la section en cours de lecture
    function setActiveNavLink() {
        let current = '';
        // Tout en bas de la page, la dernière section est souvent trop courte pour atteindre
        // le seuil ci-dessous : c'est alors elle qu'on lit.
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom && sections.length) {
            current = sections[sections.length - 1].id;
        } else {
            sections.forEach((section) => {
                if (window.scrollY >= section.offsetTop - 200) {
                    current = section.id;
                }
            });
        }
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
// Ce sont des éléments <dialog> : le navigateur gère seul la touche Échap,
// le focus clavier, et rend le reste de la page inactif tant qu'elles sont ouvertes.
// ---------------------------------------------------------------------------

function openCitationModal(modal, opener) {
    if (typeof modal.showModal === 'function') {
        modal.showModal();
    } else {
        modal.setAttribute('open', ''); // très vieux navigateurs : fenêtre simplement affichée
    }
    // À la fermeture, le focus revient sur le bouton « Citation »
    modal.addEventListener('close', () => {
        if (opener.isConnected) opener.focus();
    }, { once: true });
}

function closeCitationModal(modal) {
    if (typeof modal.close === 'function') {
        modal.close();
    } else {
        modal.removeAttribute('open');
    }
}

// Vrai si l'événement touche le fond grisé autour d'une fenêtre ouverte (hors de son cadre)
function isBackdropEvent(event) {
    const modal = event.target;
    if (!modal.matches || !modal.matches('dialog.citation-modal[open]')) return false;
    const box = modal.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right
        || event.clientY < box.top || event.clientY > box.bottom;
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
    // Le clic sur le fond ne ferme la fenêtre que s'il y a commencé : sélectionner du texte
    // dans la fenêtre puis relâcher la souris à côté ne la ferme pas.
    let pressedOnBackdrop = false;
    document.addEventListener('pointerdown', (event) => {
        pressedOnBackdrop = isBackdropEvent(event);
    });

    document.addEventListener('click', (event) => {
        const citationLink = event.target.closest('.citation-link');
        if (citationLink) {
            const modal = document.getElementById(citationLink.dataset.modal);
            if (modal) openCitationModal(modal, citationLink);
            return;
        }

        const copyButton = event.target.closest('.copy-btn');
        if (copyButton) {
            copyCitation(copyButton);
            return;
        }

        const closeButton = event.target.closest('.citation-modal .modal-close');
        if (closeButton) {
            closeCitationModal(closeButton.closest('.citation-modal'));
            return;
        }

        if (pressedOnBackdrop && isBackdropEvent(event)) {
            closeCitationModal(event.target);
        }
        pressedOnBackdrop = false;
    });
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Si la traduction échoue, le reste (menu, citations, bouton de langue) fonctionne quand même
    renderSafely(() => translatePage(initialLanguage()));

    document.getElementById('langBtn').addEventListener('click', () => {
        translatePage(currentLanguage() === 'fr' ? 'en' : 'fr');
    });

    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    setupNavigation();
    setupCitationModals();
});

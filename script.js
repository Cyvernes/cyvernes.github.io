// Système de traduction
const translations = {
    fr: {
        // Navigation
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-publications': 'Publications',
        'nav-conferences': 'Conférences',
        'nav-teaching': 'Enseignement',
        'nav-responsibilities': 'Responsabilités',
        
        // Hero section - CUSTOMIZABLE
        'hero-position': 'Doctorant en Causalité',
        'hero-institution': 'Université Grenoble Alpes',
        'hero-btn-publications': 'Mes Publications',
        
        // Section titles
        'about-title': 'À Propos',
        'publications-title': 'Publications',
        'conferences-title': 'Conférences',
        'teaching-title': 'Enseignement',
        'responsibilities-title': 'Responsabilités',
        
        // Conference types
        'conf-presentation': 'Présentation orale',
        'conf-poster': 'Poster',
        'conf-attendance': 'Participation',
        'conf-event': 'Événement',
        
        // Conference contribution labels
        'contrib-main-poster': 'Poster conférence principale :',
        'contrib-workshop-poster': 'Poster workshop :',
        'contrib-oral-presentation': 'Présentation orale :',
        'contrib-short-talk': 'Présentation courte (20 min) :',
        
        // Locations
        'location-rio': 'Rio de Janeiro, Brésil',
        'location-lausanne': 'Lausanne, Suisse',
        'location-paris': 'Paris, France',
        'location-barcelona': 'Barcelone, Espagne',
        'location-copenhagen': 'Copenhague, Danemark',
        
        // About section - CUSTOMIZABLE
        'formation-title': 'Formation',
        'expertise-title': 'Domaines d\'expertise',
    'about-bio-1': 'Je suis doctorant en informatique et mathématiques appliquées à l’Université Grenoble Alpes, encadré par Éric Gaussier, Marianne Clausel et Émilie Devijver.',
    'about-bio-2': 'Ma recherche porte sur l’inférence causale en présence d’incertitudes, avec un intérêt particulier pour l’identifiabilité, les abstractions causales et le développement d’approches algorithmiques efficaces pour ces problématiques.',
        
        // Formation - CUSTOMIZABLE
        'formation-1': 'Ingénieur généraliste, Centrale Lyon, 2024',
        'formation-2': 'Diplôme de l\'ENS de Lyon, 2024',
        'formation-3': 'Master d\'informatique, ENS de Lyon, 2024',
        
        // Expertise - CUSTOMIZABLE
        'expertise-1': 'Causalité',
        'expertise-2': 'Inférence causale',
        'expertise-3': 'Abstraction causale',
        
        // Responsibilities - CUSTOMIZABLE  
    'resp-1-title': 'Gestion du site de l\'équipe',
    'resp-1-desc': 'Maintenance et évolution du site de l’équipe : mise à jour des contenus et adaptation aux besoins de l’équipe.',
    'resp-2-title': 'Projet de médiation - Fête de la Science 2025',
    'resp-2-desc': 'Conception et pilotage de l’atelier interactif « Explorer la causalité avec des lumières ». Maquette de boutons et de lumières qui permet de comprendre la différence entre corrélation et causalité, ainsi que le biais de collidant (« collider bias »).',
        // Footer
        'footer-rights': 'Tous droits réservés.',
        'footer-legal': 'Mentions légales',
        'footer-privacy': 'Politique de confidentialité'
    },
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-publications': 'Publications',
        'nav-conferences': 'Conferences',
        'nav-teaching': 'Teaching',
        'nav-responsibilities': 'Responsibilities',
        
        // Hero section - CUSTOMIZABLE
        'hero-position': 'PhD Student in Causality',
        'hero-institution': 'Grenoble Alpes University',
        'hero-btn-publications': 'My Publications',
        
        // Section titles
        'about-title': 'About',
        'publications-title': 'Publications',
        'conferences-title': 'Conferences',
        'teaching-title': 'Teaching',
        'responsibilities-title': 'Responsibilities',
        
        // Conference types
        'conf-presentation': 'Oral Presentation',
        'conf-poster': 'Poster',
        'conf-attendance': 'Attendance',
        'conf-event': 'Event',
        
        // Conference contribution labels
        'contrib-main-poster': 'Main conference poster:',
        'contrib-workshop-poster': 'Workshop poster:',
        'contrib-oral-presentation': 'Oral presentation:',
        'contrib-short-talk': 'Short talk (20 min):',
        
        // Locations
        'location-rio': 'Rio de Janeiro, Brazil',
        'location-lausanne': 'Lausanne, Switzerland',
        'location-paris': 'Paris, France',
        'location-barcelona': 'Barcelona, Spain',
        'location-copenhagen': 'Copenhagen, Denmark',
        
        // About section - CUSTOMIZABLE
        'formation-title': 'Education',
        'expertise-title': 'Areas of Expertise',
    'about-bio-1': 'I am a PhD student in computer science and applied mathematics at Grenoble Alpes University, supervised by Éric Gaussier, Marianne Clausel, and Émilie Devijver.',
    'about-bio-2': 'My research focuses on causal inference under uncertainty, with a particular interest in identifiability, causal abstractions, and the development of efficient algorithmic approaches for these problems.',
        
        // Formation - CUSTOMIZABLE
        'formation-1': 'Generalist Engineer, Centrale Lyon, 2024',
        'formation-2': 'Diplôme de l\'ENS de Lyon, 2024',
        'formation-3': 'Master\'s in Computer Science, ENS de Lyon, 2024',
        
        // Expertise - CUSTOMIZABLE
        'expertise-1': 'Causality',
        'expertise-2': 'Causal Inference',
        'expertise-3': 'Causal Abstraction',
        
        // Research section - CUSTOMIZABLE
        'research-learn-more': 'Learn more',
        'research-project-1-title': 'Research Project 1',
        'research-project-1-desc': '[Description of your first research project in English. Explain the objectives and potential impact.]',
        'research-project-2-title': 'Research Project 2',
        'research-project-2-desc': '[Description of your second research project in English. Highlight innovation and methodologies used.]',
        'research-project-3-title': 'Research Project 3',
        'research-project-3-desc': '[Description of your third research project in English. Explain how this work contributes to your field of expertise.]',
        
        // Responsibilities - CUSTOMIZABLE
    'resp-1-title': 'Team Website Management',
    'resp-1-desc': 'Maintenance and continuous improvement of the team website: content updates and alignment with team needs.',
    'resp-2-title': 'Science Festival 2025 - Outreach Project',
    'resp-2-desc': 'Design and leadership of the interactive workshop “Exploring causality with lights.” A buttons-and-lights model that helps understand the difference between correlation and causation, as well as collider bias.',
        
        // Footer
        'footer-rights': 'All rights reserved.',
        'footer-legal': 'Legal Notice',
        'footer-privacy': 'Privacy Policy'
    }
};

// Rendre les traductions disponibles globalement
window.translations = translations;

// Langue actuelle avec gestion d'erreur
let currentLang;
try {
    currentLang = localStorage.getItem('language') || 'en';
} catch (e) {
    console.warn('LocalStorage unavailable, using default language');
    currentLang = 'en';
}

// Fonction de traduction
function translatePage(lang) {
    // Mettre à jour la langue du document pour cohérence SEO
    document.documentElement.lang = lang;
    
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            // Utiliser innerHTML pour les clés contenant du HTML (publications)
            if (key.startsWith('pub-')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Mettre à jour le bouton de langue
    const currentLangElement = document.getElementById('currentLang');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    const altLang = document.querySelector('.alt-lang');
    if (altLang) {
        altLang.textContent = lang === 'fr' ? 'EN' : 'FR';
    }
    
    // Mettre à jour l'attribut lang du HTML
    document.documentElement.lang = lang;
    
    // Régénérer les conférences avec la nouvelle langue
    if (typeof initializeConferences === 'function') {
        initializeConferences();
    }
    
    // Régénérer les enseignements avec la nouvelle langue
    if (typeof initializeTeaching === 'function') {
        initializeTeaching();
    }
    
    // Révéler le contenu après traduction/initialisation
    if (window.revealAfterInitialization) {
        window.revealAfterInitialization();
    }
    
    // Sauvegarder dans localStorage avec gestion d'erreur
    try {
        localStorage.setItem('language', lang);
        currentLang = lang;
    } catch (e) {
        console.warn('Impossible de sauvegarder la langue:', e.message);
        currentLang = lang;
    }
}

// Gestion du bouton de langue - SUPPRIMÉ - fusionné dans initialisation principale

// Navigation mobile avec vérifications
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fermer le menu mobile lors du clic sur un lien
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Navigation active link
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

// Navbar background sur scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
}, { passive: true });

// Animation de fade-in au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// SUPPRIMÉ - fusionné dans l'initialisation principale

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Compensation pour la navbar fixe
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// SUPPRIMÉ - Lazy loading fusionné dans l'initialisation principale

// Ajouter des animations CSS dynamiques
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// SUPPRIMÉ - Citation Modals fusionné dans l'initialisation principale

// Fonction pour copier dans le presse-papiers
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Support textarea/input; otherwise read textContent
    let textToCopy = '';
    if ('select' in element) {
        element.select();
        element.setSelectionRange(0, 99999);
        textToCopy = element.value;
    } else {
        textToCopy = element.textContent || '';
    }

    const doFeedback = (btn) => {
        if (!btn) return;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copié!';
        btn.style.background = 'var(--ai-green)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    };

    const btn = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('copy-btn')
        ? document.activeElement
        : null;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => doFeedback(btn));
    } else {
        try {
            document.execCommand('copy');
            doFeedback(btn);
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    }
}

// Initialisation complète
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la traduction avec la langue par défaut
    translatePage(currentLang);
    
    // Configuration du bouton de langue
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'fr' ? 'en' : 'fr';
            translatePage(newLang);
        });
    }
    
    // Observer tous les éléments avec la classe fade-in
    const elementsToAnimate = document.querySelectorAll('.publication-item, .conference-item, .course-item, .responsibility-item, .about-content');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Lazy loading pour les images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Gestion des modals de citation
    const citationLinks = document.querySelectorAll('.citation-link');
    const modals = document.querySelectorAll('.citation-modal');
    const closeButtons = document.querySelectorAll('.close');

    // Ouvrir les modals
    citationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Fermer les modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.citation-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Fermer modal en cliquant à l'extérieur
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Fermer modal avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
    
    // Définir le premier lien comme actif
    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
    
    // Sécurité : révéler le contenu après un délai max
    // Révéler le site après initialisation complète
    setTimeout(() => {
        if (window.revealAfterInitialization) {
            window.revealAfterInitialization();
        }
        document.documentElement.style.opacity = '1';
        document.documentElement.style.visibility = 'visible';
    }, 150);
    
    // Site académique initialisé avec succès!
});

// Liste des conférences - Il suffit d'ajouter ici pour ajouter une nouvelle conférence
const conferences = [
    {
        id: "uai2025_rio",
        title: "41st Conference on Uncertainty in Artificial Intelligence",
        shortName: "UAI 2025",
        year: 2025,
        locationKey: "location-rio",
        type: "poster",
        description: {
            fr: "UAI (Conference on Uncertainty in Artificial Intelligence) — conférence internationale majeure sur la représentation des connaissances, l\'apprentissage et le raisonnement sous incertitude.",
            en: "Conference on Uncertainty in Artificial Intelligence - one of the premier international conferences on research related to knowledge representation, learning, and reasoning under uncertainty."
        },
        website: "https://www.auai.org/uai2025/",
        contributions: [
            {
                type: "main_poster",
                labelKey: "contrib-main-poster",
                title: "Complete Characterization for Adjustment in Summary Causal Graphs of Time Series",
                posterUrl: "posters/Poster_UAI2025.pdf",
                abstract: {
                    fr: "Poster présenté à la conférence principale : Critères d\'ajustement pour les summary causal graphs",
                    en: "Main conference poster on adjustment criteria for Summary Causal Graphs."
                }
            },
            {
                type: "workshop_poster",
                labelKey: "contrib-workshop-poster",
                title: "Identifiability in Causal Abstractions: A Hierarchy of Criteria",
                posterUrl: "posters/Poster_Workshop_UAI2025.pdf",
                abstract: {
                    fr: "Poster du workshop CAR explorant différentes notions d'identifiabilité dans les abstractions causales.",
                    en: "CAR Workshop poster exploring different notions of identifiability in causal abstractions."
                }
            }
        ]
    },
    {
        id: "clear2025_lausanne",
        title: "CLEAR 2025",
        shortName: "CLEAR 2025",
        year: 2025,
        locationKey: "location-lausanne",
        type: "attendance",
        description: {
            fr: "Conférence axée sur la causalité, l'apprentissage et le raisonnement.",
            en: "Conference focused on causality, learning, and reasoning."
        }
    },
    {
        id: "dataia2024_workshop",
        title: "Workshop Fondements Mathématiques de l'IA - 4e édition",
        shortName: "DataIA Workshop 2024",
        year: 2024,
        locationKey: "location-paris",
        type: "presentation",
        description: {
            fr: "Workshop sur les fondements mathématiques de l'IA axé sur les mathématiques du risque, organisé par l'Institut DATAIA et SCAI.",
            en: "Workshop on Mathematical Foundations of AI focusing on risk mathematics, organized by Institut DATAIA and SCAI."
        },
        website: "https://www.dataia.eu/evenements/workshop-fondements-mathematiques-de-lia-4e-edition",
        contributions: [
            {
                type: "oral_presentation",
                labelKey: "contrib-short-talk",
                title: "Identifiability in Causal Abstractions and Applications to Summary Causal Graphs (SCGs)",
                abstract: {
                    fr: "Cet exposé examine les différentes notions d'identifiabilité qui émergent lorsqu'on raisonne à partir d'abstractions causales, avec une attention particulière aux SCGs, des abstractions causales appliquées aux séries temporelles.",
                    en: "This talk examines the different notions of identifiability that emerge when reasoning from causal abstractions, with particular attention to SCGs, causal abstractions applied to time series."
                }
            }
        ]
    },
    {
        id: "uai2024_barcelona",
        title: "40th Conference on Uncertainty in Artificial Intelligence",
        shortName: "UAI 2024",
        year: 2024,
        locationKey: "location-barcelona",
        type: "attendance",
        description: {
            fr: "UAI (Conference on Uncertainty in Artificial Intelligence) — conférence internationale majeure sur la représentation des connaissances, l\'apprentissage et le raisonnement sous incertitude.",
            en: "Conference on Uncertainty in Artificial Intelligence - one of the premier international conferences on research related to knowledge representation, learning, and reasoning under uncertainty."
        },
        website: "https://www.auai.org/uai2024/"
    },
    {
        id: "eurocim2024_copenhagen",
        title: "EUROCIM 2024",
        shortName: "EUROCIM 2024",
        year: 2024,
        locationKey: "location-copenhagen",
        type: "attendance",
        description: {
            fr: "Conférence européenne axée sur l'inférence causale dans les sciences de la santé, économiques et sociales.",
            en: "European Causal Inference Meeting focused on causal inference in health, economic and social sciences."
        },
        website: "https://eurocim.org/copenhagen-2024/"
    }
];

// Fonction pour générer le HTML d'une conférence
function generateConferenceHTML(conf) {
    const typeIcon = getTypeIcon(conf.type);
    const typeLabel = getTypeLabel(conf.type);
    
    // Logique généralisée pour les contributions multiples
    let activitiesHTML = '';
    let presentationHTML = '';
    
    if (conf.contributions && conf.contributions.length > 0) {
        // Nouveau format avec contributions multiples
        conf.contributions.forEach(contrib => {
            // Obtenir le label traduit
            const translations = window.translations || {};
            const currentLang = document.documentElement.lang || 'fr';
            const langTranslations = translations[currentLang] || {};
            const translatedLabel = contrib.labelKey ? (langTranslations[contrib.labelKey] || contrib.label || '') : (contrib.label || '');
            
            // Gérer l'abstract bilingue
            let abstractText = '';
            if (typeof contrib.abstract === 'object') {
                abstractText = contrib.abstract[currentLang] || contrib.abstract.fr || '';
            } else {
                abstractText = contrib.abstract || '';
            }
            
            // Lien vers poster si fourni
            let posterLinkHTML = '';
            if (contrib.posterUrl) {
                const translations = window.translations || {};
                const currentLang = document.documentElement.lang || 'fr';
                const langTranslations = translations[currentLang] || {};
                const viewPosterLabel = langTranslations['view-poster'] || (currentLang === 'en' ? 'View poster' : 'Voir le poster');
                    posterLinkHTML = `<a href="${contrib.posterUrl}" target="_blank" rel="noopener noreferrer" class="conf-link"><i class="fas fa-file-pdf"></i> ${viewPosterLabel}</a>`;
            }

            presentationHTML += `
                <ul class="conf-activities">
                    <li>${translatedLabel}</li>
                </ul>
                <div class="presentation-details">
                    <h4><i class="fas fa-presentation-screen"></i> ${contrib.title}</h4>
                    ${abstractText ? `<p class="presentation-abstract">${abstractText}</p>` : ''}
                    ${posterLinkHTML}
                </div>
            `;
        });
    } else {
        // Compatibilité avec l'ancien format
        if ((conf.type === 'presentation' || conf.type === 'poster') && conf.presentationTitle) {
            // Ancien format avec presentationTitle/workshopTitle
            presentationHTML = `
                <ul class="conf-activities">
                    <li>Main conference poster:</li>
                </ul>
                <div class="presentation-details">
                    <h4><i class="fas fa-presentation-screen"></i> ${conf.presentationTitle}</h4>
                    ${conf.presentationAbstract ? `<p class="presentation-abstract">${conf.presentationAbstract}</p>` : ''}
                </div>
            `;
            
            // Ajouter le workshop si présent
            if (conf.workshopTitle) {
                presentationHTML += `
                    <ul class="conf-activities">
                        <li>CAR Workshop poster:</li>
                    </ul>
                    <div class="presentation-details">
                        <h4><i class="fas fa-presentation-screen"></i> ${conf.workshopTitle}</h4>
                        ${conf.workshopAbstract ? `<p class="presentation-abstract">${conf.workshopAbstract}</p>` : ''}
                    </div>
                `;
            }
        } else if ((conf.type === 'presentation' || conf.type === 'poster') && conf.activities && conf.activities.length > 0) {
            // Ancien format avec activities séparées
            activitiesHTML = '<ul class="conf-activities">';
            conf.activities.forEach(activity => {
                activitiesHTML += `<li>${activity}</li>`;
            });
            activitiesHTML += '</ul>';
        }
    }

    let websiteHTML = '';
    // Liens vers sites web supprimés

    // Gérer la description bilingue
    let descriptionText = '';
    if (typeof conf.description === 'object') {
        const translations = window.translations || {};
        const currentLang = document.documentElement.lang || 'fr';
        descriptionText = conf.description[currentLang] || conf.description.fr || '';
    } else {
        descriptionText = conf.description || '';
    }

    // Gérer la localisation traduite
    let locationText = '';
    if (conf.locationKey) {
        const translations = window.translations || {};
        const currentLang = document.documentElement.lang || 'fr';
        const langTranslations = translations[currentLang] || {};
        locationText = langTranslations[conf.locationKey] || conf.location || '';
    } else {
        locationText = conf.location || '';
    }

    return `
        <div class="conference-item" data-type="${conf.type}">
            <div class="conf-year">${conf.year}</div>
            <div class="conf-content">
                <div class="conf-header">
                    <h3 class="conf-title">${conf.title}</h3>
                    <div class="conf-type">
                        ${typeIcon} ${typeLabel}
                    </div>
                </div>
                <div class="conf-details">
                    <p class="conf-info">
                        <i class="fas fa-map-marker-alt"></i> ${locationText}
                    </p>
                    ${descriptionText ? `<p class="conf-description">${descriptionText}</p>` : ''}
                    ${activitiesHTML}
                    ${presentationHTML}
                </div>
            </div>
        </div>
    `;
}

// Fonction pour obtenir l'icône selon le type
function getTypeIcon(type) {
    switch(type) {
        case 'presentation':
            return '<i class="fas fa-microphone"></i>';
        case 'poster':
            return '<i class="fas fa-image"></i>';
        case 'attendance':
            return '<i class="fas fa-user-graduate"></i>';
        default:
            return '<i class="fas fa-calendar"></i>';
    }
}

// Fonction pour obtenir le label selon le type
function getTypeLabel(type) {
    // Vérifier si les traductions sont disponibles
    const translations = window.translations || {};
    const currentLang = document.documentElement.lang || 'fr';
    const langTranslations = translations[currentLang] || {};
    
    switch(type) {
        case 'presentation':
            return langTranslations['conf-presentation'] || 'Présentation orale';
        case 'poster':
            return langTranslations['conf-poster'] || 'Poster';
        case 'attendance':
            return langTranslations['conf-attendance'] || 'Participation';
        default:
            return langTranslations['conf-event'] || 'Événement';
    }
}

// Fonction utilitaire: calcul du tier (hiérarchie)
function getConferenceTier(conf) {
    // Priorité explicite si fournie
    if (conf.tier) return conf.tier; // 'major' | 'workshop' | 'attendance' | 'other'

    // Attendance explicite
    if (conf.type === 'attendance') return 'attendance';

    // Heuristique pour identifier les conférences majeures
    const title = (conf.shortName || conf.title || '').toLowerCase();
    const majorHints = ['uai', 'neurips', 'icml', 'iclr', 'aistats', 'aaai', 'kdd', 'colt'];
    if (majorHints.some(k => title.includes(k))) return 'major';

    // Présentations/posters non-majeurs => workshops/séminaires
    if (conf.type === 'presentation' || conf.type === 'poster') return 'workshop';

    return 'other';
}

// Fonction utilitaire: libellé traduit du groupe
function getGroupLabel(tier) {
    const translations = window.translations || {};
    const currentLang = document.documentElement.lang || 'fr';
    const t = translations[currentLang] || {};
    switch (tier) {
        case 'major':
            return t['conf-group-major'] || 'Conférences internationales';
        case 'workshop':
            return t['conf-group-workshops'] || 'Workshops & Séminaires';
        case 'attendance':
            return t['conf-group-attendance'] || 'Présence / Participation';
        default:
            return t['conf-group-other'] || 'Autres événements';
    }
}

// Fonction pour initialiser les conférences sur la page
function initializeConferences() {
    const conferencesContainer = document.getElementById('conferences-container');
    
    if (!conferencesContainer) return;

    // Fonction pour calculer la priorité d'affichage (plus bas = plus prioritaire)
    const getDisplayPriority = (conf) => {
        if (conf.type === 'presentation') return 0;
        if (conf.type === 'poster') return 1;
        if (conf.type === 'attendance') return 2;
        return 3; // autres types
    };

    // Construire des groupes par tier
    const groupsOrder = ['major', 'workshop', 'attendance', 'other'];
    const grouped = {
        major: [],
        workshop: [],
        attendance: [],
        other: []
    };

    conferences.forEach(conf => {
        const tier = getConferenceTier(conf);
        grouped[tier] = grouped[tier] || [];
        grouped[tier].push(conf);
    });

    // Fonction de tri interne à l'intérieur d'un groupe
    const sortWithinGroup = (arr) => arr.slice().sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const aPriority = getDisplayPriority(a);
        const bPriority = getDisplayPriority(b);
        if (aPriority !== bPriority) return aPriority - bPriority;
        const aKey = (a.shortName || a.title || '').toLowerCase();
        const bKey = (b.shortName || b.title || '').toLowerCase();
        return aKey.localeCompare(bKey);
    });

    // Traductions
    const translations = window.translations || {};
    const currentLang = document.documentElement.lang || 'fr';
    const t = (key, fallback) => (translations[currentLang] && translations[currentLang][key]) || fallback;

        // Barre de filtres (Major d'abord, All en dernier)
        let html = `
            <div class="conf-filters" role="toolbar" aria-label="${t('conferences-title','Conférences')} filters">
            <button class="conf-filter-btn" data-filter="major" aria-pressed="false">${getGroupLabel('major')}</button>
                <button class="conf-filter-btn" data-filter="workshop" aria-pressed="false">${getGroupLabel('workshop')}</button>
                <button class="conf-filter-btn" data-filter="attendance" aria-pressed="false">${getGroupLabel('attendance')}</button>
                <button class="conf-filter-btn" data-filter="other" aria-pressed="false">${getGroupLabel('other')}</button>
            <button class="conf-filter-btn" data-filter="all" aria-pressed="false">${t('conf-filter-all','Tous')}</button>
            </div>
        `;

    // Générer le HTML avec sous-titres de groupe
    groupsOrder.forEach(tier => {
        const items = grouped[tier] || [];
        if (!items.length) return;
        html += `
            <div class="conf-group conf-group-${tier}" data-tier="${tier}">
                <h3 class="conf-group-title">${getGroupLabel(tier)}</h3>
        `;
        sortWithinGroup(items).forEach(conf => {
            html += generateConferenceHTML(conf);
        });
        html += `</div>`;
    });

    conferencesContainer.innerHTML = html;

    // Interaction filtres
    const buttons = conferencesContainer.querySelectorAll('.conf-filter-btn');
    const groups = conferencesContainer.querySelectorAll('.conf-group');

    // Fonction d'application de filtre (réutilisable)
    const applyFilter = (filter) => {
        buttons.forEach(b => {
            const isActive = b.getAttribute('data-filter') === filter;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        groups.forEach(group => {
            const tier = group.getAttribute('data-tier');
            group.style.display = (filter === 'all' || filter === tier) ? '' : 'none';
        });
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
            // Sauvegarder le choix utilisateur
            try { localStorage.setItem('confFilter', filter); } catch(e) {}
        });
    });

    // Définir le filtre initial: utiliser le choix sauvegardé si valide
    const allowed = ['all','major','workshop','attendance','other'];
    let defaultFilter = 'major';
    try {
        const saved = localStorage.getItem('confFilter');
        if (allowed.includes(saved)) defaultFilter = saved;
    } catch (e) {}

    const hasItems = (f) => f === 'all' || ((grouped[f] || []).length > 0);
    if (!hasItems(defaultFilter)) {
        // Choix sauvegardé mais vide dans ce contexte -> fallback intelligent
        defaultFilter = (grouped.major && grouped.major.length > 0) ? 'major' : 'all';
    }
    applyFilter(defaultFilter);
}

// Initialisation centralisée via translatePage() dans script.js

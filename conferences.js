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
                abstract: {
                    fr: "Poster présenté à la conférence principale : Critères d\'ajustement pour les summary causal graphs",
                    en: "Main conference poster on adjustment criteria for Summary Causal Graphs."
                }
            },
            {
                type: "workshop_poster",
                labelKey: "contrib-workshop-poster",
                title: "Identifiability in Causal Abstractions: A Hierarchy of Criteria",
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
            fr: "Rencontre européenne sur l'inférence causale axée sur l'inférence causale dans les sciences de la santé, économiques et sociales.",
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
            
            presentationHTML += `
                <ul class="conf-activities">
                    <li>${translatedLabel}</li>
                </ul>
                <div class="presentation-details">
                    <h4><i class="fas fa-presentation-screen"></i> ${contrib.title}</h4>
                    ${abstractText ? `<p class="presentation-abstract">${abstractText}</p>` : ''}
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

    // Trier par année (desc), puis par priorité (présentation > poster > attendance), puis par shortName/titre
    const sortedConferences = conferences.slice().sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        
        const aPriority = getDisplayPriority(a);
        const bPriority = getDisplayPriority(b);
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        const aKey = (a.shortName || (window.i18n ? window.i18n.t(a.title) : a.title) || '').toLowerCase();
        const bKey = (b.shortName || (window.i18n ? window.i18n.t(b.title) : b.title) || '').toLowerCase();
        return aKey.localeCompare(bKey);
    });

    // Générer le HTML des conférences
    let conferencesHTML = '';
    sortedConferences.forEach(conf => {
        conferencesHTML += generateConferenceHTML(conf);
    });

    conferencesContainer.innerHTML = conferencesHTML;
}

// Initialisation centralisée via translatePage() dans script.js

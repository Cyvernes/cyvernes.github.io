// Présentations : une entrée par exposé ou poster, la plus récente d'abord.
// Pour en ajouter une, copier un bloc ci-dessous.
//   kind     : "talk" (exposé) ou "poster"
//   title    : titre de la présentation (texte, ou { fr, en })
//   venue    : où elle a eu lieu (texte, ou { fr, en })
//   location : ville, facultatif (texte, ou { fr, en })
//   award    : facultatif, prix reçu (texte, ou { fr, en })
//   links    : facultatif, { slides: "...", poster: "..." }
const presentations = [
    {
        id: "ghost-talk",
        date: "2026-11-25",
        kind: "talk",
        title: { fr: "Introduction à la causalité", en: "Introduction to causality" },
        venue: { fr: "Groupe de lecture de l’équipe GHOST, LIG", en: "GHOST team reading group, LIG" },
        location: "Grenoble",
        links: { slides: "slides/presentation.pdf" }
    },
    {
        id: "icml2026-poster",
        date: "2026-07",
        kind: "poster",
        title: "Unveiling the Structure of Do-Calculus Reasoning via Derivation Graphs",
        venue: "ICML 2026",
        location: { fr: "Séoul", en: "Seoul" },
        links: { poster: "posters/Poster_ICML_2026.pdf" }
    },
    {
        id: "pepr-ia-days2026-poster",
        date: "2026-06",
        kind: "poster",
        title: "Unveiling the Structure of Do-Calculus Reasoning via Derivation Graphs",
        venue: "PEPR IA Days 2026",
        location: "Rennes",
        award: { fr: "Prix du public", en: "Audience Award" },
        links: { poster: "posters/Poster_ICML_2026.pdf" }
    },
    {
        id: "neurips2025-poster",
        date: "2025-12",
        kind: "poster",
        title: "Relaxing partition admissibility in Cluster-DAGs: a causal calculus with arbitrary variable clustering",
        venue: "NeurIPS 2025",
        location: { fr: "Mexico", en: "Mexico City" },
        links: { poster: "posters/poster_Neurips2025.pdf" }
    },
    {
        id: "uai2025-poster",
        date: "2025-07",
        kind: "poster",
        title: "Complete Characterization for Adjustment in Summary Causal Graphs of Time Series",
        venue: "UAI 2025",
        location: "Rio de Janeiro",
        links: { poster: "posters/Poster_UAI2025.pdf" }
    },
    {
        id: "uai2025-car-poster",
        date: "2025-07",
        kind: "poster",
        title: "Identifiability in Causal Abstractions: A Hierarchy of Criteria",
        venue: { fr: "Atelier CAR à UAI 2025", en: "CAR Workshop at UAI 2025" },
        location: "Rio de Janeiro",
        links: { poster: "posters/Poster_Workshop_UAI2025.pdf" }
    },
    {
        id: "dataia2024-talk",
        date: "2024",
        kind: "talk",
        title: "Identifiability in Causal Abstractions and Applications to Summary Causal Graphs",
        venue: { fr: "Atelier Fondements mathématiques de l’IA, DATAIA", en: "Mathematical Foundations of AI workshop, DATAIA" },
        location: "Paris"
    }
];

// Conférences et ateliers suivis sans présentation, affichés sur une seule ligne, le plus récent d'abord.
//   name     : nom de l'événement (texte, ou { fr, en })
//   location : ville (texte, ou { fr, en })
//   date     : "AAAA-MM", sert uniquement au tri
const attendedEvents = [
    { date: "2026-06", name: "Causalworlds 2026", location: "Grenoble" },
    {
        date: "2026-03",
        name: {
            fr: "Atelier Causal identification and discovery, Isaac Newton Institute 2026",
            en: "Causal identification and discovery workshop, Isaac Newton Institute 2026"
        },
        location: "Cambridge"
    },
    {
        date: "2026-01",
        name: {
            fr: "Atelier Foundations of causal inference, Isaac Newton Institute 2026",
            en: "Foundations of causal inference workshop, Isaac Newton Institute 2026"
        },
        location: "Cambridge"
    },
    { date: "2025-05", name: "CLEAR 2025", location: "Lausanne" },
    { date: "2024-07", name: "UAI 2024", location: { fr: "Barcelone", en: "Barcelona" } },
    { date: "2024-04", name: "EUROCIM 2024", location: { fr: "Copenhague", en: "Copenhagen" } }
];

// Affiche la liste des présentations (appelé par translatePage dans script.js)
function initializeConferences() {
    const container = document.getElementById('conferences-container');
    if (!container) return;

    const linkHTML = (url, icon, labelKey) => url ? `
        <a href="${url}" target="_blank" rel="noopener" class="pub-link">
            <i class="fas ${icon}" aria-hidden="true"></i> ${t(labelKey)}
        </a>` : '';

    const items = presentations
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((p) => {
            const place = [localized(p.venue), localized(p.location)].filter(Boolean).join(', ');
            const links = linkHTML(p.links?.slides, 'fa-file-pdf', 'pres-slides')
                + linkHTML(p.links?.poster, 'fa-file-pdf', 'pres-poster-link');
            return `
            <article id="${p.id}" class="publication-item">
                <div class="pub-content">
                    <h3 class="pub-title">${localized(p.title)}</h3>
                    <div class="pub-meta">
                        <p class="pub-venue"><time datetime="${p.date}">${p.date.slice(0, 4)}</time> &middot; ${t(p.kind === 'poster' ? 'pres-poster' : 'pres-talk')}</p>
                        <p>${place}</p>
                        ${p.award ? `<p class="pres-award"><i class="fas fa-award" aria-hidden="true"></i> ${localized(p.award)}</p>` : ''}
                    </div>
                </div>
                ${links ? `<div class="pub-links">${links}</div>` : ''}
            </article>`;
        })
        .join('');

    const attended = attendedEvents
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((e) => `${localized(e.name)} (${localized(e.location)})`)
        .join(' &middot; ');

    container.innerHTML = `
        <div class="publications-list">${items}</div>
        <p class="attended"><span>${t('pres-attended')}</span> ${attended}</p>`;
}

// Liste des publications - Il suffit d'ajouter ici pour ajouter une nouvelle publication
const publications = [
    {
        id: "yvernes2026identifiability",
        title: "Causal Effect Identifiability in Causal Abstractions: A Strict Hierarchy of Criteria",
        authors: ["Clément Yvernes", "Marianne Clausel", "Emilie Devijver", "Eric Gaussier"],
        year: 2026,
        venue: "arXiv",
        venueKey: "pub-identifiability-status",
        type: "preprint",
        arxivId: "2610.13520",
        extendedFrom: "yvernes2025identifiability",
        links: {
            pdf: "https://arxiv.org/pdf/2610.13520",
            arxiv: "https://arxiv.org/abs/2610.13520"
        },
        bibtex: {
            type: "misc",
            key: "yvernes2026identifiability"
        }
    },
    {
        id: "yvernes2025relaxing",
        title: "Relaxing partition admissibility in Cluster-DAGs: a causal calculus with arbitrary variable clustering",
        authors: ["Clément Yvernes", "Emilie Devijver", "Adèle H. Ribeiro", "Marianne Clausel", "Eric Gaussier"],
        year: 2025,
        venue: "Thirty-ninth Annual Conference on Neural Information Processing Systems (NeurIPS 2025)",
        type: "conference",
        shortVenue: "NeurIPS",
        arxivId: "2511.01396",
        links: {
            pdf: "https://arxiv.org/pdf/2511.01396",
            arxiv: "https://arxiv.org/abs/2511.01396",
            openreview: "https://openreview.net/forum?id=pyDAihUMKV",
            hal: "https://hal.science/hal-05340741",
            proceedings: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/69078488008b859a347ed36bc6531453-Abstract-Conference.html",
            software: null,
            doi: null
        },
        bibtex: {
            type: "inproceedings",
            key: "yvernes2025relaxing",
            booktitle: "Advances in Neural Information Processing Systems",
            pages: "72492--72525",
            volume: "38",
            series: null,
            publisher: "Curran Associates, Inc.",
            editors: ["D. Belgrave", "C. Zhang", "H. Lin", "R. Pascanu", "P. Koniusz", "M. Ghassemi", "N. Chen"],
            month: null,
            note: null
        }
    },
    {
        id: "yvernes2025complete",
        title: "Complete Characterization for Adjustment in Summary Causal Graphs of Time Series",
        authors: ["Clément Yvernes", "Emilie Devijver", "Eric Gaussier"],
        year: 2025,
        venue: "Forty-first Conference on Uncertainty in Artificial Intelligence (UAI 2025)",
        type: "conference",
        shortVenue: "UAI",
        arxivId: "2506.14534",
        proceedings: "v286/yvernes25a",
        pages: "4844--4871",
        volume: "286",
        series: "Proceedings of Machine Learning Research",
        publisher: "PMLR",
        links: {
            pdf: "https://raw.githubusercontent.com/mlresearch/v286/main/assets/yvernes25a/yvernes25a.pdf",
            arxiv: "https://arxiv.org/abs/2506.14534",
            hal: "https://hal.science/hal-05243540",
            proceedings: "https://proceedings.mlr.press/v286/yvernes25a.html",
            openreview: "https://openreview.net/forum?id=XikeoYEFfo",
            software: "https://gricad-gitlab.univ-grenoble-alpes.fr/yvernesc/multivariateicainscg",
            doi: null
        },
        bibtex: {
            type: "inproceedings",
            key: "proceedings-v286-yvernes25a",
            booktitle: "Proceedings of the Forty-first Conference on Uncertainty in Artificial Intelligence",
            pages: "4844--4871",
            volume: "286",
            series: "Proceedings of Machine Learning Research",
            publisher: "PMLR",
            editors: ["Silvia Chiappa", "Sara Magliacane"],
            month: "21--25 Jul",
            note: null
        }
    },
    {
        id: "yvernes2025identifiability",
        title: "Identifiability in Causal Abstractions: A Hierarchy of Criteria",
        authors: ["Clément Yvernes", "Emilie Devijver", "Marianne Clausel", "Eric Gaussier"],
        year: 2025,
        venue: "CAR Workshop at UAI2025",
        venueKey: "workshop-venue",
        type: "workshop",
        arxivId: "2507.06213",
        links: {
            pdf: "https://arxiv.org/pdf/2507.06213",
            arxiv: "https://arxiv.org/abs/2507.06213",
            hal: "https://hal.science/hal-05144103",
            doi: null // Pas de DOI pour les workshops
        },
        bibtex: {
            type: "inproceedings",
            key: "yvernes2025identifiability",
            booktitle: "CAR Workshop at the 41st Conference on Uncertainty in Artificial Intelligence (UAI)",
            note: "arXiv:2507.06213"
        }
    },
    {
        id: "yvernes2026unveiling",
        title: "Unveiling the Structure of Do-Calculus Reasoning via Derivation Graphs",
        authors: ["Clément Yvernes", "Emilie Devijver", "Marianne Clausel", "Eric Gaussier"],
        year: 2026,
        venue: "Forty-Third International Conference on Machine Learning (ICML 2026)",
        type: "conference",
        shortVenue: "ICML",
        awardUrl: "https://fr.linkedin.com/pulse/newsletter-pepr-ia-n5-octobre-2026-pepr-ia-vyyxe",
        arxivId: "2606.03719",
        proceedings: "v306/yvernes26a",
        pages: "152645--152672",
        volume: "306",
        series: "Proceedings of Machine Learning Research",
        links: {
            pdf: "https://arxiv.org/pdf/2606.03719",
            arxiv: "https://arxiv.org/abs/2606.03719",
            proceedings: "https://proceedings.mlr.press/v306/yvernes26a.html",
            openreview: "https://openreview.net/forum?id=KUBkuPwGf4",
            hal: null,
            doi: null,
            software: "https://gricad-gitlab.univ-grenoble-alpes.fr/yvernesc/do-calculus-derivation-graphs"
        },
        bibtex: {
            type: "inproceedings",
            key: "pmlr-v306-yvernes26a",
            booktitle: "Proceedings of the 43rd International Conference on Machine Learning (ICML)",
            pages: "152645--152672",
            volume: "306",
            series: "Proceedings of Machine Learning Research",
            publisher: "PMLR",
            editors: ["Tong Zhang", "Miroslav Dudik", "Martin Jaggi", "Alekh Agarwal", "Sharon Li", "Dale Schuurmans", "Jerry Zhu", "Felix Berkenkamp", "Hanze Dong", "Alberto Bietti"],
            month: "06--11 Jul",
            note: "arXiv:2606.03719"
        }
    }
];

function publicationAuthors(pub) {
    return pub.authors.map(author => author === "Clément Yvernes" ? `<strong>${author}</strong>` : author).join(", ");
}

const publicationLinkLabels = [
    ["proceedings", "fa-book", "Proceedings", "pub-proceedings"],
    ["pdf", "fa-file-pdf", "PDF"],
    ["software", "fa-code", "Code"],
    ["arxiv", "fa-archive", "arXiv"],
    ["hal", "fa-graduation-cap", "HAL"],
    ["openreview", "fa-comments", "OpenReview"],
    ["doi", "fa-external-link-alt", "DOI"]
];

function generatePublicationHTML(pub, index) {
    const primarySource = pub.links.software ? 'software' : pub.links.proceedings ? 'proceedings' : 'arxiv';
    const primaryLinks = [];
    const moreLinks = [];

    for (const [name, icon, label, labelKey] of publicationLinkLabels) {
        if (!pub.links[name]) continue;
        const group = name === 'pdf' || name === primarySource ? primaryLinks : moreLinks;
        group.push(`
            <a href="${pub.links[name]}" target="_blank" rel="noopener" class="pub-link">
                <i class="fas ${icon}" aria-hidden="true"></i>
                ${labelKey ? `<span data-lang="${labelKey}">${t(labelKey)}</span>` : label}
            </a>
        `);
    }
    const moreMenu = moreLinks.length ? `
        <details class="pub-more">
            <summary class="pub-link pub-more-toggle">
                <span aria-hidden="true">&middot;&middot;&middot;</span>
                <span class="pub-more-label" data-lang="pub-more">${t('pub-more')}</span>
            </summary>
            <div class="pub-more-menu">${moreLinks.join('')}</div>
        </details>
    ` : '';

    const venue = pub.venueKey
        ? `<span data-lang="${pub.venueKey}">${t(pub.venueKey)}</span>`
        : (pub.shortVenue || pub.venue);
    const award = pub.awardUrl
        ? `<p class="pub-note"><a href="${pub.awardUrl}" data-lang="award-short">${t('award-short')}</a></p>`
        : '';
    const relatedId = pub.extendedFrom || publications.find(version => version.extendedFrom === pub.id)?.id;
    const relatedLabel = pub.extendedFrom ? 'pub-workshop-version' : 'pub-extended-version';
    const related = relatedId
        ? `<p class="pub-note"><a href="#${relatedId}" data-lang="${relatedLabel}">${t(relatedLabel)}</a></p>`
        : '';

    return `
        <article id="${pub.id}" class="publication-item" data-category="${pub.type}">
            <div class="pub-content">
                <h3 class="pub-title">${pub.title}</h3>
                <div class="pub-meta">
                    <p class="pub-venue"><time datetime="${pub.year}">${pub.year}</time> &middot; ${venue}</p>
                    <p class="pub-authors">${publicationAuthors(pub)}</p>
                </div>
                ${award}
                ${related}
            </div>
            <div class="pub-links">
                ${primaryLinks.join('')}
                <button type="button" class="pub-link citation-link" data-modal="citation-modal-${index}">
                    <i class="fas fa-quote-right" aria-hidden="true"></i> ${t('citation')}
                </button>
                ${moreMenu}
            </div>
        </article>
    `;
}

// Fonction pour générer le BibTeX
function generateBibTeX(pub) {
    const authors = pub.authors.map(author => 
        author.replace("Clément", "Cl{\\'e}ment")
    ).join(" and ");

    let bibtex = `@${pub.bibtex.type}{${pub.bibtex.key},
  title={${pub.title}},
  author={${authors}},`;

    if (pub.bibtex.type === "inproceedings") {
        bibtex += `\n  booktitle={${pub.bibtex.booktitle}},`;
        
        if (pub.bibtex.pages) {
            bibtex += `\n  pages={${pub.bibtex.pages}},`;
        }
    } else if (pub.bibtex.type === "article") {
        bibtex += `\n  journal={${pub.venue}},`;
    }

    bibtex += `\n  year={${pub.year}}`;
    
    if (pub.bibtex.editors) {
        const editors = pub.bibtex.editors.join(" and ");
        bibtex += `,\n  editor={${editors}}`;
    }
    
    if (pub.bibtex.volume) {
        bibtex += `,\n  volume={${pub.bibtex.volume}}`;
    }
    
    if (pub.bibtex.series) {
        bibtex += `,\n  series={${pub.bibtex.series}}`;
    }
    
    if (pub.bibtex.month) {
        bibtex += `,\n  month={${pub.bibtex.month}}`;
    }
    
    if (pub.bibtex.publisher) {
        bibtex += `,\n  publisher={${pub.bibtex.publisher}}`;
    }
    
    if (pub.links.proceedings) {
        bibtex += `,\n  url={${pub.links.proceedings}}`;
    }
    
    if (pub.links.pdf && pub.proceedings) {
        bibtex += `,\n  pdf={${pub.links.pdf}}`;
    }

    if (pub.type === "preprint" && pub.arxivId) {
        bibtex += `,\n  eprint={${pub.arxivId}},\n  archivePrefix={arXiv},\n  url={${pub.links.arxiv}}`;
    }

    if (pub.bibtex.note) {
        bibtex += `,\n  note={${pub.bibtex.note}}`;
    }

    bibtex += `\n}`;
    return bibtex;
}

// Fonction pour générer la citation APA
function generateAPA(pub) {
    const authors = pub.authors.map((author, i) => {
        const names = author.split(" ");
        const lastName = names.pop();
        const initials = names.map(n => n.charAt(0) + ".").join(" ");
        return `${lastName}, ${initials}`;
    }).join(", ");

    if (pub.type === "preprint") {
        return `${authors} (${pub.year}). ${pub.title} [Preprint]. ${pub.venue}. ${pub.links.arxiv}`;
    }

    let apa = `${authors} (${pub.year}). ${pub.title}.`;
    
    // Format spécifique PROCEEDINGS
    if (pub.proceedings) {
        apa += ` ${pub.bibtex.booktitle}, in ${pub.series}`;
        if (pub.volume && pub.pages) {
            apa += ` ${pub.volume}:${pub.pages}`;
        }
        if (pub.links.proceedings) {
            apa += ` Available from ${pub.links.proceedings}.`;
        }
    }
    // Format général pour les proceedings
    else if (pub.bibtex.type === "inproceedings") {
        apa += ` In ${pub.bibtex.booktitle}.`;
        if (pub.arxivId) {
            apa += ` arXiv:${pub.arxivId}.`;
        }
    } 
    // Format pour les autres types
    else {
        apa += ` ${pub.venue}.`;
        if (pub.arxivId) {
            apa += ` arXiv:${pub.arxivId}.`;
        }
    }

    return apa;
}

// Fonction pour générer le modal de citation
function generateCitationModal(pub, index) {
    const bibtex = generateBibTeX(pub);
    const apa = generateAPA(pub);

    return `
        <div id="citation-modal-${index}" class="citation-modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>${t('citation')}</h3>
                <div class="citation-text">
                    <p><strong>BibTeX:</strong></p>
                    <textarea readonly id="bibtex-${index}">${bibtex}</textarea>
                    <button type="button" class="copy-btn" data-copy="bibtex-${index}">${t('citation-copy-bibtex')}</button>

                    <p><strong>APA:</strong></p>
                    <textarea readonly id="apa-${index}">${apa}</textarea>
                    <button type="button" class="copy-btn" data-copy="apa-${index}">${t('citation-copy-apa')}</button>
                </div>
            </div>
        </div>
    `;
}

// Menus « ··· » (autres liens) : fermeture au clic ailleurs ou avec Échap.
// Installé une seule fois, car la liste est régénérée à chaque changement de langue.
let publicationMenusReady = false;

function setupPublicationMenus(publicationsContainer) {
    document.addEventListener('click', event => {
        for (const menu of publicationsContainer.querySelectorAll('.pub-more[open]')) {
            if (!menu.contains(event.target) || event.target.closest('.pub-more-menu a')) {
                menu.open = false;
            }
        }
    });

    publicationsContainer.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const menu = event.target.closest('.pub-more[open]');
        if (menu) {
            menu.open = false;
            menu.querySelector('summary').focus();
        }
    });
}

// Affiche les publications et leurs fenêtres de citation (appelé par translatePage dans script.js)
function initializePublications() {
    const publicationsContainer = document.getElementById('publications-container');
    const modalsContainer = document.getElementById('modals-container');

    if (!publicationsContainer || !modalsContainer) return;

    // Tri par année décroissante
    const sortedPublications = [...publications].sort((a, b) => {return (b.year ?? -Infinity) - (a.year ?? -Infinity);});

    let publicationsHTML = '';
    let modalsHTML = '';

    sortedPublications.forEach((pub, index) => {
        publicationsHTML += generatePublicationHTML(pub, index);
        modalsHTML += generateCitationModal(pub, index);
    });

    publicationsContainer.innerHTML = publicationsHTML;
    modalsContainer.innerHTML = modalsHTML;

    if (!publicationMenusReady) {
        setupPublicationMenus(publicationsContainer);
        publicationMenusReady = true;
    }
}

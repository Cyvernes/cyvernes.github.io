// Liste des publications - Il suffit d'ajouter ici pour ajouter une nouvelle publication
const publications = [
    {
        id: "yvernes2025relaxing",
        title: "Relaxing partition admissibility in Cluster-DAGs: a causal calculus with arbitrary variable clustering",
        authors: ["Clément Yvernes", "Emilie Devijver", "Adèle H. Ribeiro", "Marianne Clausel", "Eric Gaussier"],
        year: 2025,
        venue: "Thirty-ninth Annual Conference on Neural Information Processing Systems (NeurIPS 2025)",
        type: "conference",
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
        type: "conference", // "conference", "workshop", "journal", "preprint"
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
        arxivId: "2606.03719",
        links: {
            pdf: "https://arxiv.org/pdf/2606.03719",
            arxiv: "https://arxiv.org/abs/2606.03719",
            hal: null,
            doi: null,
            software: "https://gricad-gitlab.univ-grenoble-alpes.fr/yvernesc/do-calculus-derivation-graphs"
        },
        bibtex: {
            type: "inproceedings",
            key: "yvernes2026unveiling",
            booktitle: "Proceedings of the 43rd International Conference on Machine Learning (ICML)",
            note: "arXiv:2606.03719"
        }
    }
];

// Fonction pour générer le HTML d'une publication
function generatePublicationHTML(pub, index) {
    const authorsHTML = pub.authors.map((author, i) => 
        author === "Clément Yvernes" ? `<strong>${author}</strong>` : author
    ).join(", ");

    let linksHTML = `<a href="${pub.links.pdf}" target="_blank" class="pub-link"><i class="fas fa-file-pdf"></i> PDF</a>`;
    
    if (pub.links.arxiv) {
        linksHTML += `<a href="${pub.links.arxiv}" target="_blank" class="pub-link"><i class="fas fa-archive"></i> arXiv</a>`;
    }
    
    if (pub.links.hal) {
        linksHTML += `<a href="${pub.links.hal}" target="_blank" class="pub-link"><i class="fas fa-graduation-cap"></i> HAL</a>`;
    }
    
    if (pub.links.proceedings) {
        linksHTML += `<a href="${pub.links.proceedings}" target="_blank" class="pub-link"><i class="fas fa-book"></i> Proceedings</a>`;
    }
    
    if (pub.links.openreview) {
        linksHTML += `<a href="${pub.links.openreview}" target="_blank" class="pub-link"><i class="fas fa-comments"></i> OpenReview</a>`;
    }
    
    if (pub.links.software) {
        linksHTML += `<a href="${pub.links.software}" target="_blank" class="pub-link"><i class="fas fa-code"></i> Code</a>`;
    }
    
    linksHTML += `<a href="#" class="pub-link citation-link" data-modal="citation-modal-${index}"><i class="fas fa-quote-right"></i> Citation</a>`;
    
    if (pub.links.doi) {
        linksHTML += `<a href="${pub.links.doi}" target="_blank" class="pub-link"><i class="fas fa-external-link-alt"></i> DOI</a>`;
    }

    return `
        <div class="publication-item" data-category="${pub.type}">
            <div class="pub-year">${pub.year}</div>
            <div class="pub-content">
                <h3 class="pub-title">${pub.title}</h3>
                <p class="pub-authors">${authorsHTML}</p>
                <p class="pub-journal">${pub.venue}</p>
                <div class="pub-links">
                    ${linksHTML}
                </div>
            </div>
        </div>
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
    
    // Récupérer la langue courante du document
    const currentLang = document.documentElement.lang || 'en';
    
    // Définir les textes en fonction de la langue
    const texts = {
        citation: currentLang === 'fr' ? 'Citation' : 'Citation',
        copyBibtex: currentLang === 'fr' ? 'Copier BibTeX' : 'Copy BibTeX',
        copyApa: currentLang === 'fr' ? 'Copier APA' : 'Copy APA'
    };

    return `
        <div id="citation-modal-${index}" class="citation-modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>${texts.citation}</h3>
                <div class="citation-text">
                    <p><strong>BibTeX:</strong></p>
                    <textarea readonly id="bibtex-${index}">${bibtex}</textarea>
                    <button onclick="copyToClipboard('bibtex-${index}')" class="copy-btn">${texts.copyBibtex}</button>
                    
                    <p><strong>APA:</strong></p>
                    <textarea readonly id="apa-${index}">${apa}</textarea>
                    <button onclick="copyToClipboard('apa-${index}')" class="copy-btn">${texts.copyApa}</button>
                </div>
            </div>
        </div>
    `;
}
// Fonction pour initialiser les publications sur la page
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
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePublications);

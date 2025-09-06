// Liste des publications - Il suffit d'ajouter ici pour ajouter une nouvelle publication
const publications = [
    {
        id: "yvernes2025complete",
        title: "Complete Characterization for Adjustment in Summary Causal Graphs of Time Series",
        authors: ["Clément Yvernes", "Emilie Devijver", "Eric Gaussier"],
        year: 2025,
        venue: "41st Conference on Uncertainty in Artificial Intelligence (UAI2025)",
        type: "conference", // "conference", "workshop", "journal", "preprint"
        arxivId: "2506.14534",
        links: {
            pdf: "https://arxiv.org/pdf/2506.14534",
            arxiv: "https://arxiv.org/abs/2506.14534",
            hal: "https://hal.science/hal-5243540", 
            doi: null // Sera ajouté plus tard
        },
        bibtex: {
            type: "inproceedings",
            key: "yvernes2025complete",
            booktitle: "Proceedings of the 41st Conference on Uncertainty in Artificial Intelligence (UAI)",
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
    } else if (pub.bibtex.type === "article") {
        bibtex += `\n  journal={${pub.venue}},`;
    }

    bibtex += `\n  year={${pub.year}}`;

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
    
    if (pub.bibtex.type === "inproceedings") {
        apa += ` In ${pub.bibtex.booktitle}.`;
    } else {
        apa += ` ${pub.venue}.`;
    }

    if (pub.arxivId) {
        apa += ` arXiv:${pub.arxivId}.`;
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
                <h3>Citation</h3>
                <div class="citation-text">
                    <p><strong>BibTeX:</strong></p>
                    <textarea readonly id="bibtex-${index}">${bibtex}</textarea>
                    <button onclick="copyToClipboard('bibtex-${index}')" class="copy-btn">Copier BibTeX</button>
                    
                    <p><strong>APA:</strong></p>
                    <textarea readonly id="apa-${index}">${apa}</textarea>
                    <button onclick="copyToClipboard('apa-${index}')" class="copy-btn">Copier APA</button>
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

    // Générer le HTML des publications
    let publicationsHTML = '';
    let modalsHTML = '';

    publications.forEach((pub, index) => {
        publicationsHTML += generatePublicationHTML(pub, index);
        modalsHTML += generateCitationModal(pub, index);
    });

    publicationsContainer.innerHTML = publicationsHTML;
    modalsContainer.innerHTML = modalsHTML;
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePublications);

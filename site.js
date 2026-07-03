const profileLink = (name, type) => {
  const query = encodeURIComponent(name);
  const auburnQuery = encodeURIComponent(`site:auburn.edu "${name}" physics Auburn`);
  const scholarQuery = encodeURIComponent(`${name} Auburn laboratory astrophysics`);

  if (type === "auburn") return `https://www.google.com/search?q=${auburnQuery}`;
  if (type === "orcid") return `https://orcid.org/orcid-search/search?searchQuery=${query}`;
  return `https://scholar.google.com/scholar?q=${scholarQuery}`;
};

const profileUrl = (person, type) => person.urls?.[type] || profileLink(person.name, type);

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const heroSlides = [
  {
    src: "assets/lab-astro-hero.png",
    alt: "Laboratory astrophysics beamline and vacuum chamber equipment"
  },
  {
    src: "assets/hero/comet-neowise.jpg",
    alt: "Comet image from the November 9, 2025 middle panel"
  },
  {
    src: "assets/hero/diii-d-tokamak.jpg",
    alt: "Worker inside the DIII-D tokamak vacuum vessel"
  },
  {
    src: "assets/hero/swift-observatory.jpg",
    alt: "NASA Neil Gehrels Swift Observatory spacecraft above Earth"
  },
  {
    src: "assets/hero/astronomy-terrace.jpg",
    alt: "Auburn astronomy terrace with telescopes under a twilight sky"
  }
];

const scopeItems = [
  {
    title: "Atomic and molecular data",
    text: "Benchmark experiments and calculations for ionization, recombination, excitation, and molecular processes in space environments."
  },
  {
    title: "Charge exchange and collisions",
    text: "Particle interactions that shape X-ray, UV, optical, and plasma diagnostics in comets, planets, and low-density astrophysical objects."
  },
  {
    title: "Comets, planets, and small bodies",
    text: "Observational and laboratory-informed studies of volatile activity, solar-wind interactions, and interstellar comet chemistry."
  },
  {
    title: "Neutron-star mergers and plasmas",
    text: "Atomic data and spectroscopy for heavy-element emission, fusion diagnostics, and other application-driven plasma problems."
  }
];

const facilities = [
  {
    tag: "Beamlines",
    title: "Ion, electron, and neutral collision platforms",
    text: "Auburn-based experiments for charge exchange, recombination, cross sections, product channels, and state-resolved measurements."
  },
  {
    tag: "Partner facilities",
    title: "Large experimental and observational facilities",
    text: "Projects connect students and collaborators with facilities such as NIST, Clemson, national labs, observatories, and mission archives."
  },
  {
    tag: "Spectroscopy",
    title: "Optical, UV, and X-ray diagnostics",
    text: "Measurements and models designed to anchor spectra from observatories, spacecraft, EBIT experiments, and laboratory plasmas."
  },
  {
    tag: "Computation",
    title: "Modeling, supercomputing, and data comparison",
    text: "Large-scale quantum calculations, synthetic spectra, and analysis workflows for laboratory and astrophysical datasets."
  }
];

const faculty = [
  {
    name: "Michael Fogle Jr.",
    role: "Andrew T Hunt Endowed Professor",
    summary: "Leads experimental AMO measurements, including charge exchange and recombination studies that support comet and low-density astrophysics.",
    photo: "assets/people/mike-fogle.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/fogle/index.htm",
      scholar: "https://scholar.google.com/citations?user=D0GGP3QAAAAJ&hl=en",
      orcid: "https://orcid.org/0000-0003-3511-262X"
    },
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Dr. Stuart Loch",
    role: "Dr. William L. Alford Endowed Professor",
    summary: "Develops atomic data, theory, and spectral diagnostics for astrophysical plasmas, laboratory plasmas, and neutron-star merger problems.",
    photo: "assets/people/stuart-loch.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/loch/index.htm",
      scholar: "https://scholar.google.com/citations?user=-Bj_9ZsAAAAJ&hl=en",
      orcid: "https://orcid.org/0000-0002-3822-6756"
    },
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Amy Gall",
    role: "Assistant Professor",
    summary: "Leads EBIT and atomic physics work with applications for heliophysics and astrophysics.",
    photo: "assets/people/amy-gall.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/gall/index.htm",
      scholar: "https://scholar.google.com/citations?user=KJmLiO0AAAAJ&hl=en",
      orcid: "https://orcid.org/0000-0002-8260-2229"
    },
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Dennis Bodewits",
    role: "Auburn University Endowed Alumni Professor",
    summary: "Studies comets and small bodies with observations and laboratory-informed models of gas, dust, chemistry, and volatile activity.",
    photo: "assets/people/dennis-bodewits.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/bodewits/index.htm",
      scholar: "https://scholar.google.com/citations?user=u1nZPlsAAAAJ&hl=nl",
      orcid: "https://orcid.org/0000-0002-2668-7248"
    },
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "John Noonan",
    role: "Assistant Research Professor",
    summary: "Works on cometary activity, small-body observations, and JWST and HST spectroscopy, connecting telescope data with physical models.",
    photo: "assets/people/john-noonan.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/noonan/index.htm",
      orcid: "https://orcid.org/0000-0003-2152-6987"
    },
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Steven Bromley",
    role: "Principal Research Scientist",
    summary: "Develops spectroscopic calculations and atomic-data projects for neutron-star mergers and laboratory astrophysics.",
    photo: "assets/people/steve-bromley.jpg",
    urls: {
      auburn: "https://www.auburn.edu/cosam/departments/physics/physics-faculty/bromley/index.htm",
      orcid: "https://orcid.org/0000-0003-2110-8152"
    },
    links: ["auburn", "orcid"]
  },
  {
    name: "Zexi Xing",
    role: "Postdoc / Researcher",
    summary: "Studies volatile activity in comets and interstellar objects through UV/optical observations and production-rate modeling.",
    photo: "assets/people/zexi-xing.jpg",
    urls: {
      orcid: "https://orcid.org/0000-0003-2399-5613"
    },
    links: ["auburn", "scholar", "orcid"]
  }
];

const students = [
  {
    name: "Shawn Oset",
    role: "Graduate student",
    summary: "Works on comet and small-body projects connected to observation-driven laboratory astrophysics questions.",
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Patrick Flint",
    role: "Graduate student",
    summary: "Works in physics education research and atomic, molecular, and optical research with Stuart Loch.",
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Clayton Chilen",
    role: "Graduate student",
    summary: "Works on laboratory astrophysics projects connected to atomic, molecular, optical, and observational research.",
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Brandon Martin",
    role: "Graduate student",
    summary: "Works on laboratory astrophysics projects connected to atomic, molecular, optical, and observational research.",
    links: ["auburn", "scholar", "orcid"]
  },
  {
    name: "Additional students",
    role: "Graduate students",
    summary: "Add new group members here as the roster changes; no page redesign is needed.",
    links: []
  }
];

const collaborations = [
  {
    title: "Observatories and missions",
    text: "Support interpretation of spectra from space-based and ground-based facilities, including mission datasets and archival observations."
  },
  {
    title: "Atomic physics networks",
    text: "Connect Auburn measurements and calculations with theory groups, databases, EBIT measurements, and plasma-modeling communities."
  },
  {
    title: "Small-body science",
    text: "Collaborate on cometary composition, activity, and interstellar-object studies where laboratory data sharpen interpretation."
  },
  {
    title: "Cross-disciplinary training",
    text: "Train students across experiment, theory, supercomputing, spectroscopy, data analysis, writing, and conference presentation."
  }
];

const renderCards = (items, targetId, className, template) => {
  document.getElementById(targetId).innerHTML = items.map((item) => template(item, className)).join("");
};

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const personTemplate = (person) => {
  const linkLabels = { auburn: "Auburn", scholar: "Scholar", orcid: "ORCID" };
  const links = person.links
    .map((type) => {
      const label = linkLabels[type];
      return `<a href="${profileUrl(person, type)}" rel="noreferrer" aria-label="${person.name} ${label} profile">${label}</a>`;
    })
    .join("");

  const photo = person.photo
    ? `<img src="${person.photo}" alt="${person.name}">`
    : `<span>${initials(person.name)}</span>`;

  return `
    <article class="person-card">
      <div class="person-photo">${photo}</div>
      <div class="person-body">
        <h4>${person.name}</h4>
        <p class="role">${person.role}</p>
        <p class="summary">${person.summary}</p>
        ${links ? `<div class="profile-links">${links}</div>` : ""}
      </div>
    </article>
  `;
};

renderCards(scopeItems, "scope-grid", "scope-card", (item, className) => `
  <article class="${className}">
    <h3>${item.title}</h3>
    <p>${item.text}</p>
  </article>
`);

renderCards(facilities, "facility-list", "facility-card", (item, className) => `
  <article class="${className}">
    <span class="facility-tag">${item.tag}</span>
    <h3>${item.title}</h3>
    <p>${item.text}</p>
  </article>
`);

renderCards(faculty, "faculty-grid", "person-card", personTemplate);
renderCards(students, "student-grid", "person-card", personTemplate);

renderCards(collaborations, "collaboration-grid", "collaboration-card", (item, className) => `
  <article class="${className}">
    <h3>${item.title}</h3>
    <p>${item.text}</p>
  </article>
`);

const rotateHero = () => {
  const image = document.getElementById("hero-image");
  if (!image || heroSlides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  heroSlides.forEach((slide) => {
    const preload = new Image();
    preload.src = slide.src;
  });

  let current = 0;
  window.setInterval(() => {
    current = (current + 1) % heroSlides.length;
    const slide = heroSlides[current];

    image.classList.add("is-fading");
    window.setTimeout(() => {
      image.src = slide.src;
      image.classList.remove("is-fading");
    }, 360);
  }, 6500);
};

const formatAuthors = (authors = []) => {
  if (authors.length <= 5) return authors.join(", ");
  return `${authors.slice(0, 5).join(", ")} et al.`;
};

const renderPapers = (papers = [], updated) => {
  const target = document.getElementById("paper-list");
  if (!papers.length) {
    target.innerHTML = `
      <li class="paper-card empty">
        Recent papers will appear after the ADS update script runs.
      </li>
    `;
    return;
  }

  target.innerHTML = papers
    .map((paper) => {
      const title = escapeHtml(paper.title);
      const url = escapeHtml(paper.url);
      const year = escapeHtml(paper.year || "In press");
      const venue = escapeHtml(paper.venue || "NASA ADS");
      const authors = escapeHtml(formatAuthors(paper.authors));
      const date = paper.pubdate ? ` / ${escapeHtml(paper.pubdate)}` : "";

      return `
        <li class="paper-card">
          <a class="paper-title" href="${url}" rel="noreferrer">${title}</a>
          <p class="paper-authors">${authors}</p>
          <p class="paper-meta">${year}${date} / ${venue}</p>
        </li>
      `;
    })
    .join("");

  if (updated) {
    target.setAttribute("data-updated", updated);
  }
};

const renderWordCloud = (terms = []) => {
  const target = document.getElementById("word-cloud-terms");
  if (!target) return;

  if (!terms.length) {
    target.innerHTML = `<span class="word-cloud-empty">Research terms will appear after the ADS update script runs.</span>`;
    return;
  }

  const colors = ["#12284c", "#0e6f74", "#dd550c", "#394b5f", "#7a3b18"];
  target.innerHTML = terms
    .map((term, index) => {
      const label = escapeHtml(term.term);
      const weight = Number.isFinite(term.weight) ? Math.max(0, Math.min(1, term.weight)) : 0.5;
      const color = colors[index % colors.length];
      const query = encodeURIComponent(`"${term.term}" Auburn laboratory astrophysics`);

      return `
        <a
          href="https://ui.adsabs.harvard.edu/search/q=${query}"
          rel="noreferrer"
          style="--weight: ${weight.toFixed(3)}; --word-color: ${color};"
          aria-label="Search ADS for ${label}; ${term.count} occurrences in recent group papers"
        >${label}</a>
      `;
    })
    .join("");
};

rotateHero();

if (window.LAB_ASTRO_PAPERS) {
  renderPapers(window.LAB_ASTRO_PAPERS.papers, window.LAB_ASTRO_PAPERS.updated);
  renderWordCloud(window.LAB_ASTRO_PAPERS.wordCloud);
} else {
  fetch(`data/papers.json?updated=${Date.now()}`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("No papers data available");
      return response.json();
    })
    .then((data) => {
      renderPapers(data.papers, data.updated);
      renderWordCloud(data.wordCloud);
    })
    .catch(() => {
      renderPapers([]);
      renderWordCloud([]);
    });
}

#!/usr/bin/env node

import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../data/papers.json");
const scriptOutputPath = resolve(__dirname, "../data/papers.js");
const token = process.env.ADS_API_TOKEN;

const groupMembers = [
  { name: "Mike Fogle", adsAuthor: "Fogle, M", pi: true },
  { name: "Stuart Loch", adsAuthor: "Loch, S", pi: true },
  { name: "Amy Gall", adsAuthor: "Gall, A" },
  { name: "Dennis Bodewits", adsAuthor: "Bodewits, D", pi: true },
  { name: "John Noonan", adsAuthor: "Noonan, J" },
  { name: "Steve Bromley", adsAuthor: "Bromley, S" },
  { name: "Zexi Xing", adsAuthor: "Xing, Z" },
  { name: "Shawn Oset", adsAuthor: "Oset, S" }
];

const paperLimit = 10;
const wordCloudPaperLimit = 100;
const principalInvestigators = groupMembers.filter((member) => member.pi);

const authorQuery = groupMembers.map((member) => `author:"${member.adsAuthor}"`).join(" OR ");

// Keep this query conservative enough to avoid name collisions while still catching new papers.
// If ADS misses a valid lab paper, add an ORCID or exact ADS author form to groupMembers.
const adsQuery = `(${authorQuery}) AND (aff:"Auburn" OR full:"Auburn")`;

const params = new URLSearchParams({
  q: adsQuery,
  fl: "title,author,bibcode,pub,pubdate,year,doi,abstract,keyword",
  sort: "date desc",
  rows: "200"
});

const adsUrl = `https://api.adsabs.harvard.edu/v1/search/query?${params}`;

const emptyPayload = (message) => ({
  updated: new Date().toISOString(),
  source: "NASA ADS",
  query: adsQuery,
  note: message,
  papers: [],
  wordCloud: []
});

const normalizePaper = (paper) => {
  const title = Array.isArray(paper.title) ? paper.title[0] : paper.title;
  const doi = Array.isArray(paper.doi) ? paper.doi[0] : paper.doi;
  const url = paper.bibcode
    ? `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(paper.bibcode)}/abstract`
    : doi
      ? `https://doi.org/${encodeURIComponent(doi)}`
      : "https://ui.adsabs.harvard.edu/";

  return {
    title: title || "Untitled paper",
    authors: Array.isArray(paper.author) ? paper.author : [],
    venue: paper.pub || "",
    pubdate: paper.pubdate || "",
    year: paper.year || "",
    bibcode: paper.bibcode || "",
    doi: doi || "",
    url,
    abstract: paper.abstract || "",
    keywords: Array.isArray(paper.keyword) ? paper.keyword : []
  };
};

const authorParts = (member) => {
  const [last, initials = ""] = member.adsAuthor.split(",").map((part) => part.trim().toLowerCase());
  return { last, firstInitial: initials[0] || "" };
};

const includesAuthor = (paper, member) => {
  const { last, firstInitial } = authorParts(member);
  return paper.authors.some((author) => {
    const normalized = author.toLowerCase();
    const [authorLast, given = ""] = normalized.split(",").map((part) => part.trim());
    return authorLast === last && (!firstInitial || given.startsWith(firstInitial));
  });
};

const uniqueByBibcode = (papers) => {
  const seen = new Set();
  return papers.filter((paper) => {
    const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const key = normalizedTitle || paper.doi || paper.bibcode || `${paper.title}-${paper.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const comparePaperDates = (a, b) => {
  const aDate = a.pubdate || `${a.year || "0000"}-00-00`;
  const bDate = b.pubdate || `${b.year || "0000"}-00-00`;
  return bDate.localeCompare(aDate);
};

const selectPapers = (papers) => {
  const selected = uniqueByBibcode(papers).slice(0, paperLimit);

  for (const pi of principalInvestigators) {
    if (selected.some((paper) => includesAuthor(paper, pi))) continue;

    const piPaper = papers.find((paper) => includesAuthor(paper, pi));
    if (!piPaper) continue;

    const alreadySelected = selected.some((paper) => paper.bibcode && paper.bibcode === piPaper.bibcode);
    if (alreadySelected) continue;

    selected.push(piPaper);
    selected.sort(comparePaperDates);

    if (selected.length > paperLimit) {
      const removableIndex = [...selected]
        .map((paper, index) => ({ paper, index }))
        .reverse()
        .find(({ paper }) => !principalInvestigators.some((member) => includesAuthor(paper, member)))?.index;

      selected.splice(removableIndex ?? selected.length - 1, 1);
    }
  }

  return uniqueByBibcode(selected).sort(comparePaperDates).slice(0, paperLimit);
};

const stopWords = new Set(
  [
    "about",
    "above",
    "after",
    "again",
    "against",
    "also",
    "among",
    "analysis",
    "and",
    "are",
    "around",
    "based",
    "because",
    "been",
    "being",
    "between",
    "both",
    "but",
    "can",
    "data",
    "during",
    "each",
    "first",
    "from",
    "had",
    "has",
    "have",
    "having",
    "here",
    "high",
    "into",
    "its",
    "large",
    "like",
    "main",
    "may",
    "more",
    "most",
    "near",
    "new",
    "not",
    "observed",
    "observations",
    "only",
    "over",
    "our",
    "paper",
    "papers",
    "present",
    "provide",
    "ratio",
    "result",
    "results",
    "show",
    "shown",
    "shows",
    "small",
    "study",
    "such",
    "subsequent",
    "than",
    "that",
    "the",
    "their",
    "these",
    "this",
    "through",
    "toward",
    "under",
    "using",
    "used",
    "was",
    "were",
    "when",
    "where",
    "which",
    "while",
    "will",
    "with",
    "within",
    "without",
    "would",
    "low",
    "auburn",
    "university",
    "fogle",
    "loch",
    "gall",
    "bodewits",
    "noonan",
    "bromley",
    "xing",
    "oset",
    "math",
    "mml",
    "mrow",
    "msub",
    "msup",
    "sub",
    "sup",
    "inline",
    "formula"
  ].concat(
    "a an as at be by for if in is it of on or to we i ii iii iv v vi via vs".split(" ")
  )
);

const singularize = (term) => {
  const exceptions = new Set(["atlas", "astrophysics", "physics", "gas"]);
  if (exceptions.has(term)) return term;
  if (term === "nucleu") return "nucleus";
  if (term.endsWith("ies") && term.length > 5) return `${term.slice(0, -3)}y`;
  if (term.endsWith("ses") || term.endsWith("xes")) return term.slice(0, -2);
  if (term.endsWith("s") && !term.endsWith("ss") && term.length > 4) return term.slice(0, -1);
  return term;
};

const tokenizeNormalized = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replaceAll("x-ray", "xray")
    .replaceAll("x ray", "xray")
    .replace(/[^a-z0-9+]+/g, " ")
    .split(/\s+/)
    .map((term) => singularize(term.trim()))
    .filter((term) => term.length > 0);

const tokenize = (text) =>
  tokenizeNormalized(text)
    .filter((term) => term.length > 2 && !/^\d+$/.test(term) && !stopWords.has(term));

const preferredPhrasePatterns = [
  { tokens: ["atomic", "data"], label: "atomic data" },
  { tokens: ["charge", "exchange"], label: "charge exchange" },
  { tokens: ["dielectronic", "recombination"], label: "dielectronic recombination" },
  { tokens: ["electron", "impact"], label: "electron impact" },
  { tokens: ["fusion", "energy"], label: "fusion energy" },
  { tokens: ["highly", "charged"], label: "highly charged" },
  { tokens: ["laboratory", "astrophysics"], label: "laboratory astrophysics" },
  { tokens: ["molecular", "data"], label: "molecular data" },
  { tokens: ["neutron", "star"], label: "neutron star" },
  { tokens: ["small", "body"], label: "small bodies" },
  { tokens: ["solar", "wind"], label: "solar wind" },
  { tokens: ["solar", "system"], label: "solar system" },
  { tokens: ["synthetic", "spectra"], label: "synthetic spectra" },
  { tokens: ["xray", "spectroscopy"], label: "x-ray spectroscopy" }
];
const preferredPhraseLabels = new Set(preferredPhrasePatterns.map((pattern) => pattern.label));
const reservedPhraseSlots = 16;
const wordCloudLimit = 64;

const extractPreferredPhrases = (text) => {
  const tokens = tokenizeNormalized(text);
  const phrases = new Set();

  for (let index = 0; index < tokens.length - 1; index += 1) {
    for (const pattern of preferredPhrasePatterns) {
      if (tokens[index] === pattern.tokens[0] && tokens[index + 1] === pattern.tokens[1]) {
        phrases.add(pattern.label);
      }
    }
  }

  return phrases;
};

const buildWordCloud = (papers) => {
  const scoredTerms = new Map();
  const paperCountsByMember = new Map(groupMembers.map((member) => [member.name, 0]));
  const candidatePapers = papers.slice(0, wordCloudPaperLimit);

  const matchingMembersForPaper = (paper) => groupMembers.filter((member) => includesAuthor(paper, member));

  for (const paper of candidatePapers) {
    for (const member of matchingMembersForPaper(paper)) {
      paperCountsByMember.set(member.name, (paperCountsByMember.get(member.name) || 0) + 1);
    }
  }

  for (const paper of candidatePapers) {
    const text = [paper.title, paper.abstract, ...(paper.keywords || [])].filter(Boolean).join(" ");
    const singleTerms = new Set(tokenize(text));
    const phraseTerms = extractPreferredPhrases(text);
    const uniqueTerms = new Set([...singleTerms, ...phraseTerms]);
    const matchingMembers = matchingMembersForPaper(paper);
    const paperWeight =
      matchingMembers.reduce((sum, member) => sum + 1 / Math.max(1, paperCountsByMember.get(member.name) || 1), 0) ||
      1;

    for (const term of uniqueTerms) {
      const entry = scoredTerms.get(term) || { score: 0, papers: 0 };
      const termWeight = preferredPhraseLabels.has(term) ? paperWeight * 1.8 : paperWeight;
      entry.score += termWeight;
      entry.papers += 1;
      scoredTerms.set(term, entry);
    }
  }

  const sortedTerms = [...scoredTerms.entries()].sort(
    (a, b) => b[1].score - a[1].score || b[1].papers - a[1].papers || a[0].localeCompare(b[0])
  );
  const phraseTerms = sortedTerms.filter(([term]) => preferredPhraseLabels.has(term)).slice(0, reservedPhraseSlots);
  const phraseTermSet = new Set(phraseTerms.map(([term]) => term));
  const singleTerms = sortedTerms
    .filter(([term]) => !phraseTermSet.has(term))
    .slice(0, Math.max(0, wordCloudLimit - phraseTerms.length));
  const terms = [...phraseTerms, ...singleTerms]
    .sort((a, b) => b[1].score - a[1].score || b[1].papers - a[1].papers || a[0].localeCompare(b[0]))
    .slice(0, wordCloudLimit);

  if (!terms.length) return [];

  const scoresOnly = terms.map(([, entry]) => entry.score);
  const min = Math.min(...scoresOnly);
  const max = Math.max(...scoresOnly);
  const span = Math.max(1, max - min);

  return terms.map(([term, entry]) => ({
    term,
    count: entry.papers,
    weight: 0.2 + ((entry.score - min) / span) * 0.8
  }));
};

const publicPaper = ({ abstract, keywords, ...paper }) => paper;

const writePayload = async (payload) => {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(`${outputPath}.tmp`, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await rename(`${outputPath}.tmp`, outputPath);
  await writeFile(
    `${scriptOutputPath}.tmp`,
    `window.LAB_ASTRO_PAPERS = ${JSON.stringify(payload, null, 2)};\n`,
    "utf8"
  );
  await rename(`${scriptOutputPath}.tmp`, scriptOutputPath);
};

if (!token) {
  await writePayload(emptyPayload("Set ADS_API_TOKEN to refresh recent papers."));
  console.error("ADS_API_TOKEN is not set. Wrote an empty papers file with setup guidance.");
  process.exit(0);
}

const response = await fetch(adsUrl, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  }
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`ADS request failed with ${response.status}: ${body}`);
}

const data = await response.json();
const allPapers = uniqueByBibcode((data.response?.docs || []).map(normalizePaper));
const papers = selectPapers(allPapers);
const wordCloud = buildWordCloud(allPapers);

await writePayload({
  updated: new Date().toISOString(),
  source: "NASA ADS",
  query: adsQuery,
  paperLimit,
  wordCloudPaperLimit,
  piCoverage: principalInvestigators.map((member) => member.name),
  papers: papers.map(publicPaper),
  wordCloud
});

console.log(`Wrote ${papers.length} papers and ${wordCloud.length} word-cloud terms to ${outputPath}`);

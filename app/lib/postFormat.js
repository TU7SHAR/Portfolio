// Cleans model output into the stored Post shape and scores its quality.
// Shared by the cron generator and the hand-written posts in app/content.

import { BANNED_PHRASES } from "./gemini.js";

const LINK_RE = /\[([^\]\n]{1,120})\]\(([^)\s]{1,300})\)/g;

/** Prose: strip markdown emphasis/headings, keep `code` and [links](/path). */
export const clean = (s = "") =>
  String(s)
    .replace(/\*\*|^#+\s*|^>\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Keeps internal links that point at an allowed path (and https links when
 * `allowExternal`, for hand-written posts); other links become plain text.
 */
export const filterLinks = (s, allowed, allowExternal = false) =>
  s.replace(LINK_RE, (m, text, href) =>
    (href.startsWith("/") && allowed.has(href.split("#")[0])) || (allowExternal && href.startsWith("https://")) ? m : text
  );

const cleanCode = (c) => {
  const content = String(c?.content || "")
    .replace(/^```[\w-]*\n?|\n?```$/g, "")
    .replace(/\r\n/g, "\n")
    .trimEnd();
  if (!content.trim()) return undefined;
  return { language: clean(c.language || "").toLowerCase().slice(0, 20) || "text", content: content.slice(0, 6000) };
};

const cleanTable = (t) => {
  const headers = (t?.headers || []).map(clean).filter(Boolean).slice(0, 6);
  if (headers.length < 2) return undefined;
  const rows = (t.rows || [])
    .map((r) => (Array.isArray(r) ? r.map(clean).slice(0, headers.length) : []))
    .filter((r) => r.length && r.some(Boolean))
    .map((r) => [...r, ...Array(headers.length - r.length).fill("")])
    .slice(0, 15);
  return rows.length ? { headers, rows } : undefined;
};

/** Trim to `max` chars on a word boundary. */
export const fit = (s, max) => {
  s = clean(s);
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–—|]$/, "").trim();
};

const countWords = (strings) => strings.join(" ").split(/\s+/).filter(Boolean).length;

/**
 * @param {object} raw model output (or hand-written post)
 * @param {Set<string>} allowedLinks internal paths inline links may point to
 */
export function sanitizePost(raw, allowedLinks = new Set(), { allowExternal = false } = {}) {
  const prose = (s) => filterLinks(clean(s), allowedLinks, allowExternal);

  const sections = (raw.sections || [])
    .map((s, i) => ({
      heading: clean(s.heading).replace(LINK_RE, "$1"),
      // the article must start with an H2 so the hierarchy is H1 → H2 → H3
      level: i === 0 ? 2 : s.level === 3 ? 3 : 2,
      paragraphs: (s.paragraphs || []).map(prose).filter(Boolean),
      bullets: (s.bullets || []).map(prose).filter(Boolean),
      code: cleanCode(s.code),
      table: cleanTable(s.table),
    }))
    .filter((s) => s.heading && (s.paragraphs.length || s.bullets.length || s.code));

  // all visible prose (code excluded)
  const words = countWords([
    raw.tldr || "",
    raw.authorNote || "",
    ...(raw.keyTakeaways || []),
    ...sections.flatMap((s) => [...s.paragraphs, ...s.bullets, ...(s.table ? s.table.rows.flat() : [])]),
    ...(raw.faq || []).flatMap((f) => [f.question || "", f.answer || ""]),
  ]);

  return {
    title: fit(raw.title, 90),
    metaTitle: fit(raw.metaTitle || raw.title, 62),
    metaDescription: fit(raw.metaDescription || raw.excerpt, 160),
    excerpt: fit(raw.excerpt, 300),
    tldr: prose(raw.tldr || ""),
    keyTakeaways: (raw.keyTakeaways || []).map(prose).filter(Boolean).slice(0, 6),
    authorNote: prose(raw.authorNote || ""),
    primaryQuery: clean(raw.primaryQuery || ""),
    category: clean(raw.category) || "Tech",
    keywords: (raw.keywords || []).map(clean).filter(Boolean).slice(0, 10),
    tags: (raw.tags || []).map(clean).filter(Boolean).slice(0, 6),
    sections,
    faq: (raw.faq || [])
      .map((f) => ({ question: clean(f.question), answer: prose(f.answer) }))
      .filter((f) => f.question && f.answer)
      .slice(0, 6),
    readingMinutes: Math.max(2, Math.round(words / 220)),
    words,
  };
}

/**
 * Problems worth a repair pass. `hard` problems block publishing (the post is
 * saved as a draft instead) if they survive the repair.
 */
export function qualityIssues(post) {
  const issues = [];
  const hard = [];
  const allText = [
    post.title, post.tldr, post.excerpt, post.authorNote,
    ...post.keyTakeaways,
    ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...s.bullets]),
    ...post.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ").toLowerCase();

  const banned = BANNED_PHRASES.filter((p) => allText.includes(p));
  if (banned.length) issues.push(`Remove these phrases and rewrite those sentences plainly: ${banned.join(", ")}`);

  if (post.words < 1100) issues.push(`Too short: ${post.words} words; expand to 1200-1600 words with more concrete detail.`);
  if (post.words < 800) hard.push(`only ${post.words} words`);

  const tldrWords = post.tldr.split(/\s+/).filter(Boolean).length;
  if (tldrWords < 30 || tldrWords > 75) issues.push(`tldr is ${tldrWords} words; make it 40-60 words that answer the query directly.`);
  if (!post.tldr) hard.push("missing tldr");

  if (post.sections.length < 5) issues.push(`Only ${post.sections.length} sections; use 5-8.`);
  if (post.sections.length < 3) hard.push(`only ${post.sections.length} sections`);
  if (post.keyTakeaways.length < 3) issues.push("Add 3-5 specific keyTakeaways.");
  if (post.faq.length < 3) issues.push("Add 3-5 FAQ entries.");

  const technical = ["Web Development", "Programming", "DevOps & Cloud", "Payments", "AI"].includes(post.category);
  if (technical && !post.sections.some((s) => s.code)) issues.push("Add at least one working code example in a section's code field.");

  if (post.metaTitle.length < 35 || post.metaTitle.length > 60) issues.push(`metaTitle is ${post.metaTitle.length} characters; make it 50-60.`);
  if (post.metaDescription.length < 120 || post.metaDescription.length > 160) {
    issues.push(`metaDescription is ${post.metaDescription.length} characters; make it 140-158.`);
  }

  return { issues, hard, banned };
}

/** Strips the inline `code` / [link](href) syntax, for meta tags, JSON-LD and feeds. */
export const toPlainText = (s = "") => String(s).replace(/`([^`\n]+)`/g, "$1").replace(LINK_RE, "$1");

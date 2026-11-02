// Minimal Gemini REST client (no SDK dependency) that turns a list of topic
// candidates into one structured, search-ready blog post.
//
// Research uses the URL context tool on URLs WE choose (official docs, the
// story's own link). Grounding with Google Search is off by default: the
// Gemini API terms only allow showing Grounded Results to the user who sent the
// prompt, and forbid storing/syndicating them — which is what a public blog
// post does. Opt in with GEMINI_GROUNDING=true only if you've checked the terms.

import site from "../utils/siteMetaData.js";

const API = "https://generativelanguage.googleapis.com/v1beta/models";
export const DEFAULT_MODEL = "gemini-3.8-flash";

const CATEGORIES = ["AI", "Web Development", "Programming", "DevOps & Cloud", "Payments", "Tech News", "Startups"];

const SECTION = {
  type: "object",
  properties: {
    heading: { type: "string", description: "Specific heading, ideally phrased like a question people search." },
    level: { type: "integer", enum: [2, 3] },
    paragraphs: { type: "array", items: { type: "string" }, description: "2-4 sentence paragraphs." },
    bullets: { type: "array", items: { type: "string" } },
    code: {
      type: "object",
      description: "Optional runnable code example for this section.",
      properties: {
        language: { type: "string", description: "e.g. js, ts, jsx, python, bash, json" },
        content: { type: "string", description: "The code, with real newlines, no markdown fences." },
      },
      required: ["language", "content"],
    },
    table: {
      type: "object",
      description: "Optional comparison table.",
      properties: {
        headers: { type: "array", items: { type: "string" } },
        rows: { type: "array", items: { type: "array", items: { type: "string" } } },
      },
      required: ["headers", "rows"],
    },
  },
  required: ["heading", "level", "paragraphs"],
};

const POST_SCHEMA = {
  type: "object",
  properties: {
    chosenIndex: { type: "integer", description: "Index (from the candidate list) of the topic you chose." },
    primaryQuery: { type: "string", description: "The exact search query this post answers." },
    title: { type: "string", description: "H1 headline, 45-70 characters." },
    metaTitle: { type: "string", description: "SEO <title>, 50-60 characters, primary query near the start." },
    metaDescription: { type: "string", description: "140-158 characters; answers the query directly." },
    slug: { type: "string", description: "3-6 lowercase words from the primary query, hyphen separated." },
    excerpt: { type: "string", description: "1-2 sentence summary for the blog index." },
    tldr: { type: "string", description: "40-60 word direct answer to the primary query. Standalone." },
    keyTakeaways: { type: "array", items: { type: "string" }, description: "3-5 specific takeaways." },
    authorNote: { type: "string", description: "1-3 first-person sentences tying the topic to a listed experience fact, or empty string." },
    category: { type: "string", enum: CATEGORIES },
    keywords: { type: "array", items: { type: "string" }, description: "5-8 related search phrases." },
    tags: { type: "array", items: { type: "string" }, description: "3-5 short tags." },
    sections: { type: "array", items: SECTION, description: "5-8 sections. First section is level 2." },
    faq: {
      type: "array",
      description: "3-5 follow-up questions people also ask, with 2-4 sentence standalone answers.",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
  },
  required: [
    "chosenIndex", "primaryQuery", "title", "metaTitle", "metaDescription", "slug", "excerpt",
    "tldr", "keyTakeaways", "authorNote", "category", "keywords", "tags", "sections", "faq",
  ],
};

export const BANNED_PHRASES = [
  "in today's fast-paced", "ever-evolving", "ever evolving", "landscape", "delve", "game-changer", "game changer",
  "revolutionize", "revolutionise", "unlock the", "harness the", "leverage", "seamless", "robust",
  "in conclusion", "let's dive", "dive in", "buckle up", "it's important to note", "it is important to note",
  "in the world of", "realm", "tapestry", "navigating the", "testament to",
];

const AUTHOR = `Tushar Gautam: full-stack & AI product engineer in Kharar (Mohali), Punjab, India; software
engineering intern at DrishInfoTech. Writes React/Next.js, Python/Flask, PostgreSQL/MongoDB and ships with
agentic, AI-assisted tools. Things he has actually built (the ONLY first-hand experience you may claim):
- makeperfectads.com: AI video ad generator. Reads a product page, plans shots, renders 9:16/16:9 ads with captions,
  voiceover and music in 84 languages incl. Hinglish.
- bhavishai.in: Next.js + Swiss Ephemeris (C library) + Gemini astrology reports; Razorpay payments with signature
  verification, background PDF generation and email delivery, admin reconciliation for failed deliveries, PostgreSQL.
- bubbl.ooo (at DrishInfoTech): multi-tenant RAG chatbot SaaS. Flask, scraped sites vectorised into Gemini File Search
  stores, Celery + Redis background jobs, PostgreSQL, Paddle billing, Gunicorn (gthread) + systemd on a VPS.
- salesji.com (at DrishInfoTech): workspace for AI Telegram sales bots.
- tushargautam.software (this site): Next.js 14 App Router on Vercel Hobby, MongoDB Atlas, React Three Fiber
  background, next/og images, JSON-LD, and this AI blog pipeline triggered by cron-job.org.`;

function buildPrompt({ candidates, mode, recentTitles, internalPages }) {
  const list = candidates
    .map((c, i) => {
      const urls = [...(c.docs || []), ...(c.links || []).map((l) => l.url)].filter(Boolean).slice(0, 3);
      return (
        `${i}. "${c.keyword}" (${c.source}${c.score ? `, score ${c.score}` : ""})` +
        (c.experience ? `\n   relevant experience: ${c.experience}` : "") +
        (!c.experience && c.context?.length ? `\n   context: ${c.context.slice(0, 2).join(" | ")}` : "") +
        (urls.length ? `\n   read: ${urls.join("  ")}` : "")
      );
    })
    .join("\n");

  const pick =
    mode === "trending"
      ? `Pick the ONE story with a concrete, practical angle for developers (an API, tool, release, technique or
   incident they can act on). Skip opinion threads, politics, tragedies, crime, gambling and adult topics.
   Set primaryQuery to what a developer would type into Google about it.`
      : `These are real Google search queries. Pick the ONE where the author's listed experience lets you give a
   specific, first-hand answer that beats generic tutorials. Prefer precise problems ("X not working",
   "X vs Y", "how to X with Y") over broad ones. Set primaryQuery to that query (you may fix grammar).`;

  return `You write for ${site.siteUrl}, the blog of ${site.author}.

ABOUT THE AUTHOR
${AUTHOR}

GOAL
Write the most useful page on the web for one search query. A reader arriving from Google, or an AI assistant
quoting this page, should get the answer in the first lines, then the depth needed to actually do it.

STEP 1: CHOOSE
1. ${pick}
2. Do not choose anything already covered by these posts: ${
    recentTitles.length ? recentTitles.map((t) => `"${t}"`).join(", ") : "(none yet)"
  }

STEP 2: RESEARCH
Open the "read:" URLs of your chosen candidate with the URL context tool. Take every factual claim (versions,
limits, prices, API fields, config names, dates) from those pages or from knowledge you are certain of.
If you cannot confirm something, leave it out or say plainly that it's unconfirmed. Never invent numbers,
benchmarks, quotes, dates, customer stories or anecdotes. Today's date is ${new Date().toISOString().slice(0, 10)}.

STEP 3: WRITE
- tldr: 40-60 words that directly answer primaryQuery. Start with the answer itself.
- keyTakeaways: 3-5 specific, non-obvious points (no filler like "testing is important").
- sections: 5-8, 1200-1800 words total. Headings are specific; phrase most as the questions people search.
  Include working code (section.code) whenever the topic is technical, and a table (section.table) when
  comparing options, limits or plans. Include one section on gotchas, trade-offs or when NOT to do this.
- authorNote: 1-3 sentences in first person ("I") connecting the topic to ONE experience fact above, stated
  exactly as listed. If none genuinely fits, return "".
- faq: 3-5 follow-up questions people actually ask; each answer must make sense on its own.
- SEO fields: metaTitle 50-60 characters with the query near the start; metaDescription 140-158 characters;
  title 45-70 characters; slug 3-6 words.

STYLE
- Plain, direct English for working developers. Short paragraphs. Concrete names, numbers and steps.
- "I" only for the author's real experience; "you" for instructions.
- Never use these words or phrases: ${BANNED_PHRASES.join(", ")}.
- No hype, no rhetorical-question openers, no closing summary that repeats the article.

FORMAT INSIDE STRINGS
- Plain text. Allowed: \`backticks\` for code identifiers, and [anchor text](/path) links. No other markdown,
  no HTML, no emojis.
- Add 1-3 inline links to relevant pages from this list, using the exact path, and link nowhere else inline:
${internalPages.map((p) => `  ${p.path}  ${p.title}`).join("\n")}
- code.content uses real newlines and no \`\`\` fences.

CANDIDATES
${list}`;
}

const textFromResponse = (data) =>
  (data?.candidates?.[0]?.content?.parts || [])
    .filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();

/** URLs the URL context tool actually fetched successfully. */
const retrievedUrls = (data) => {
  const meta = data?.candidates?.[0]?.urlContextMetadata || data?.candidates?.[0]?.url_context_metadata;
  const list = meta?.urlMetadata || meta?.url_metadata || [];
  return list
    .filter((u) => /SUCCESS/.test(u.urlRetrievalStatus || u.url_retrieval_status || ""))
    .map((u) => u.retrievedUrl || u.retrieved_url)
    .filter((u) => typeof u === "string" && /^https:\/\//.test(u));
};

async function callGemini(body, model, key, signal) {
  let res;
  try {
    res = await fetch(`${API}/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(body),
      cache: "no-store",
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError" || err.name === "TimeoutError" || signal?.aborted) {
      throw new Error("Gemini took too long and was stopped (check Fluid Compute is enabled)");
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/**
 * Sends one structured-output request, falling back to older request shapes if
 * the configured model rejects the newer one (400).
 */
async function structuredRequest({ prompt, tools, timeoutMs }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const signal = AbortSignal.timeout(timeoutMs);
  const contents = [{ role: "user", parts: [{ text: prompt }] }];
  const thinking = { thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL || "medium" } };

  const attempts = [
    { contents, ...(tools.length && { tools }), generationConfig: { ...thinking, responseFormat: { text: { mimeType: "APPLICATION_JSON", schema: POST_SCHEMA } } } },
    { contents, ...(tools.length && { tools }), generationConfig: { responseMimeType: "application/json", responseJsonSchema: POST_SCHEMA } },
    // last resort: older models can't mix tools with JSON output
    ...(tools.length ? [{ contents, generationConfig: { responseMimeType: "application/json", responseJsonSchema: POST_SCHEMA } }] : []),
  ];

  let r;
  for (const body of attempts) {
    r = await callGemini(body, model, key, signal);
    if (r.ok || r.status !== 400) break;
  }
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${r.data?.error?.message || "request failed"}`);

  const raw = textFromResponse(r.data).replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    return { post: JSON.parse(raw), model, urls: retrievedUrls(r.data) };
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}

/**
 * @param {object[]} candidates
 * @param {{ mode: "evergreen"|"trending", recentTitles: string[], internalPages: {path:string,title:string}[], timeoutMs?: number }} opts
 * @returns {Promise<{ post: object, model: string, urls: string[] }>}
 */
export async function generateBlogPost(candidates, { mode, recentTitles = [], internalPages = [], timeoutMs = 200000 }) {
  const tools = [{ urlContext: {} }];
  if (process.env.GEMINI_GROUNDING === "true") tools.push({ googleSearch: {} });
  return structuredRequest({
    prompt: buildPrompt({ candidates, mode, recentTitles, internalPages }),
    tools,
    timeoutMs,
  });
}

/** Second, tool-free pass that fixes specific quality problems in a draft. */
export async function repairBlogPost(draft, issues, { timeoutMs = 90000 } = {}) {
  const prompt = `You are the editor of ${site.siteUrl}. Below is a draft blog post as JSON.
Fix ONLY these problems and return the complete corrected post in the same JSON schema:
${issues.map((i) => `- ${i}`).join("\n")}

Rules: keep every fact, link and code example that is already there; do not add new factual claims,
numbers or anecdotes. If you need more length, deepen explanations, steps, gotchas and examples using what
the draft already establishes. Never use: ${BANNED_PHRASES.join(", ")}.

DRAFT
${JSON.stringify(draft)}`;
  const { post } = await structuredRequest({ prompt, tools: [], timeoutMs });
  return post;
}

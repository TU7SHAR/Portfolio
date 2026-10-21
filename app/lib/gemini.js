// Minimal Gemini REST client (no SDK dependency) that turns a list of trending
// topics into one structured, SEO-ready blog post.

const API = "https://generativelanguage.googleapis.com/v1beta/models";

const POST_SCHEMA = {
  type: "object",
  properties: {
    chosenIndex: {
      type: "integer",
      description: "Index (from the candidate list) of the topic you chose.",
    },
    title: { type: "string", description: "Engaging H1 headline, 45-70 characters." },
    metaTitle: {
      type: "string",
      description: "SEO <title>, MUST be 50-60 characters, primary keyword near the start.",
    },
    metaDescription: {
      type: "string",
      description: "SEO meta description, MUST be 150-160 characters, includes the primary keyword.",
    },
    slug: { type: "string", description: "Short lowercase URL slug, words separated by hyphens, max 6 words." },
    excerpt: { type: "string", description: "1-2 sentence summary shown on the blog index." },
    category: {
      type: "string",
      enum: ["AI", "Web Development", "Programming", "Tech News", "Startups", "Gadgets", "Culture & Tech"],
    },
    keywords: { type: "array", items: { type: "string" }, description: "5-8 SEO keywords." },
    tags: { type: "array", items: { type: "string" }, description: "3-5 short tags." },
    sections: {
      type: "array",
      description: "5-8 sections forming a clear H2/H3 hierarchy. First section must be level 2.",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          level: { type: "integer", enum: [2, 3] },
          paragraphs: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["heading", "level", "paragraphs"],
      },
    },
    faq: {
      type: "array",
      description: "3-4 frequently asked questions with concise answers.",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
  },
  required: [
    "chosenIndex", "title", "metaTitle", "metaDescription", "slug", "excerpt",
    "category", "keywords", "tags", "sections", "faq",
  ],
};

function buildPrompt(candidates, recentTitles) {
  const list = candidates
    .map(
      (c, i) =>
        `${i}. "${c.keyword}" — ${c.source}${c.score ? ` (score ${c.score})` : ""}` +
        (c.context?.length ? `\n   context: ${c.context.slice(0, 3).join(" | ")}` : "")
    )
    .join("\n");

  return `You write for the blog of Tushar Gautam, a full-stack & AI product engineer from India
(React, Next.js, Flask, Gemini, RAG chatbots, AI SaaS). Audience: developers, founders and tech-curious readers.

TASK
1. From the trending candidates below, pick the ONE topic with the best tech angle
   (AI, software, the web, startups, gadgets, or a famous event/person with a genuine technology story).
   Skip politics, tragedies, crime, gambling/betting and adult topics. Skip anything already covered:
   ${recentTitles.length ? recentTitles.map((t) => `"${t}"`).join(", ") : "(nothing yet)"}
2. Write an original, genuinely useful article (900-1300 words total across sections) about it.

RULES
- Use Google Search to verify facts. Never invent numbers, quotes, dates, or product details.
  If something is uncertain, say so plainly.
- Write in clear, natural English with a confident, friendly voice. No fluff or clichés
  like "In today's fast-paced world".
- Add a practical "what this means for developers/builders" angle.
- Plain text only inside fields: no markdown, no HTML, no emojis.
- metaTitle 50-60 characters. metaDescription 150-160 characters. Count carefully.

TRENDING CANDIDATES
${list}`;
}

const textFromResponse = (data) =>
  (data?.candidates?.[0]?.content?.parts || [])
    .filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();

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
    if (err.name === "AbortError" || signal?.aborted) {
      throw new Error("Gemini took too long and was stopped (try GEMINI_GROUNDING=false or enable Fluid Compute)");
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/**
 * @returns {Promise<{ post: object, model: string }>}
 */
export async function generateBlogPost(candidates, recentTitles = [], { timeoutMs = 240000 } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const grounding = process.env.GEMINI_GROUNDING !== "false";

  const base = {
    contents: [{ role: "user", parts: [{ text: buildPrompt(candidates, recentTitles) }] }],
    ...(grounding && { tools: [{ googleSearch: {} }] }),
  };
  const signal = AbortSignal.timeout(timeoutMs);

  // Current REST shape for structured output…
  let r = await callGemini(
    {
      ...base,
      generationConfig: {
        thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL || "low" },
        responseFormat: { text: { mimeType: "APPLICATION_JSON", schema: POST_SCHEMA } },
      },
    },
    model,
    key,
    signal
  );

  // …with a fallback to the older field names if GEMINI_MODEL points at an
  // older model/endpoint that rejects them.
  if (!r.ok && r.status === 400) {
    r = await callGemini(
      {
        ...base,
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: POST_SCHEMA,
        },
      },
      model,
      key,
      signal
    );
  }

  if (!r.ok) {
    throw new Error(`Gemini ${r.status}: ${r.data?.error?.message || "request failed"}`);
  }

  const raw = textFromResponse(r.data).replace(/^```(?:json)?\s*|\s*```$/g, "");
  let post;
  try {
    post = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
  return { post, model };
}

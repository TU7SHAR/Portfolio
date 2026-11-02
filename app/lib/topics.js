// Evergreen topic engine.
//
// Why: a new, low-authority domain can't outrank news sites on trending
// headlines (the old generator only did that, and got ~no impressions). It CAN
// rank for specific, long-tail questions developers type into Google, in areas
// where the author has real experience. So:
//   1. Each seed below is an area Tushar has shipped production code in.
//   2. Google Autocomplete expands seeds into real search queries.
//   3. Gemini picks one query and answers it, reading the seed's official docs
//      (via the URL context tool) so facts come from primary sources.

import { normalizeTopic } from "./trends.js";

const UA = "Mozilla/5.0 (compatible; TusharPortfolioBot/1.0; +https://tushargautam.software)";

// `experience` must only contain things that are true — the model is told it
// may reference these, and nothing else, as first-hand experience.
export const SEEDS = [
  {
    seed: "nextjs app router",
    area: "Next.js",
    experience: "Runs this site on the Next.js 14 App Router (metadata API, next/og images, ISR + tag revalidation) and ships client SaaS front ends in Next.js.",
    docs: ["https://nextjs.org/docs/app/getting-started/layouts-and-pages", "https://nextjs.org/docs/app/api-reference/functions/generate-metadata"],
  },
  {
    seed: "nextjs seo",
    area: "Next.js SEO",
    experience: "Built this site's SEO layer: per-page canonical/OG metadata, JSON-LD, dynamic sitemap, generated OG images, fixing soft 404s.",
    docs: ["https://nextjs.org/docs/app/api-reference/functions/generate-metadata", "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"],
  },
  {
    seed: "nextjs revalidate",
    area: "Next.js caching",
    experience: "Uses unstable_cache with tags and revalidateTag/revalidatePath to refresh blog pages the moment a post is published.",
    docs: ["https://nextjs.org/docs/app/api-reference/functions/revalidateTag", "https://nextjs.org/docs/app/api-reference/functions/revalidatePath"],
  },
  {
    seed: "vercel function timeout",
    area: "Vercel",
    experience: "Runs a 1–3 minute AI job on Vercel Hobby with Fluid Compute, maxDuration=300 and waitUntil, triggered by cron-job.org.",
    docs: ["https://vercel.com/docs/functions/limitations", "https://vercel.com/docs/functions/configuring-functions/duration"],
  },
  {
    seed: "vercel cron",
    area: "Vercel",
    experience: "Schedules jobs with cron-job.org because Vercel Hobby cron jobs only run once per day.",
    docs: ["https://vercel.com/docs/cron-jobs/usage-and-pricing", "https://vercel.com/docs/cron-jobs"],
  },
  {
    seed: "gemini api",
    area: "Gemini API",
    experience: "Calls the Gemini REST API without an SDK in several products (blog generator, astrology reports on bhavishai.in, RAG chatbots on bubbl.ooo).",
    docs: ["https://ai.google.dev/gemini-api/docs/generate-content/structured-output", "https://ai.google.dev/gemini-api/docs/pricing"],
  },
  {
    seed: "gemini structured output",
    area: "Gemini API",
    experience: "Generates full blog posts as schema-validated JSON with Gemini structured outputs.",
    docs: ["https://ai.google.dev/gemini-api/docs/generate-content/structured-output"],
  },
  {
    seed: "gemini file search",
    area: "RAG",
    experience: "bubbl.ooo vectorises scraped website content into Gemini File Search stores for multi-tenant RAG chatbots.",
    docs: ["https://ai.google.dev/gemini-api/docs/file-search"],
  },
  {
    seed: "rag chatbot",
    area: "RAG",
    experience: "Built bubbl.ooo, a multi-tenant RAG chatbot SaaS (Flask, Gemini, Celery + Redis scraping jobs, PostgreSQL), similar in spirit to chatbase.",
    docs: ["https://ai.google.dev/gemini-api/docs/file-search", "https://ai.google.dev/gemini-api/docs/embeddings"],
  },
  {
    seed: "flask celery redis",
    area: "Python back ends",
    experience: "Runs web-scraping background jobs with Celery + Redis behind a Flask API on bubbl.ooo.",
    docs: ["https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html", "https://flask.palletsprojects.com/en/stable/patterns/celery/"],
  },
  {
    seed: "gunicorn",
    area: "Deployment",
    experience: "Deploys Flask on a Linux VPS with Gunicorn (gthread workers) managed by systemd.",
    docs: ["https://gunicorn.org/design/", "https://gunicorn.org/reference/settings/"],
  },
  {
    seed: "razorpay",
    area: "Payments (India)",
    experience: "bhavishai.in takes Razorpay payments with signature verification, then generates a PDF report in the background and emails it, with an admin reconciliation view for failed deliveries.",
    docs: ["https://razorpay.com/docs/webhooks/validate-test/", "https://razorpay.com/docs/webhooks/best-practices/"],
  },
  {
    seed: "telegram bot api",
    area: "Telegram bots",
    experience: "Built salesji.com, a workspace for AI-powered Telegram sales bots, and DeScript, Telegram automation scripts in Python.",
    docs: ["https://core.telegram.org/bots/api", "https://core.telegram.org/bots/faq"],
  },
  {
    seed: "react three fiber",
    area: "Three.js",
    experience: "Uses React Three Fiber, drei and postprocessing for the animated 3D background and hero on this site.",
    docs: ["https://r3f.docs.pmnd.rs/advanced/scaling-performance", "https://r3f.docs.pmnd.rs/getting-started/introduction"],
  },
  {
    seed: "mongodb atlas vercel",
    area: "Databases",
    experience: "Stores this blog in MongoDB Atlas via Mongoose from Vercel serverless functions, with a cached connection.",
    docs: ["https://www.mongodb.com/docs/atlas/security/ip-access-list/", "https://mongoosejs.com/docs/connections.html"],
  },
  {
    seed: "ai video generation",
    area: "AI video",
    experience: "Building makeperfectads.com: reads a product page, plans shots, generates a 9:16 or 16:9 video ad with captions, voiceover and music in 84 languages including Hinglish.",
    docs: ["https://ai.google.dev/gemini-api/docs/video"],
  },
  {
    seed: "agentic coding",
    area: "AI-assisted development",
    experience: "Ships production code with agentic, AI-assisted tools (Kiro, GitHub Copilot, MCP servers) and reviews every change.",
    docs: ["https://modelcontextprotocol.io/docs/getting-started/intro"],
  },
];

// Modifiers that turn a seed into question-style, long-tail queries.
const MODIFIERS = ["", "how to", "vs", "not working", "error", "best way", "example"];

async function autocomplete(q, { gl = "us" } = {}) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=${gl}&q=${encodeURIComponent(q)}`;
  const ctrl = AbortSignal.timeout(5000);
  const res = await fetch(url, { headers: { "user-agent": UA }, cache: "no-store", signal: ctrl });
  if (!res.ok) throw new Error(`Autocomplete: HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.[1]) ? data[1].filter((s) => typeof s === "string") : [];
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Very short / navigational suggestions ("gemini api key") make thin posts.
const usefulQuery = (q, seed) => {
  const words = q.trim().split(/\s+/);
  return (
    words.length >= 4 &&
    normalizeTopic(q) !== normalizeTopic(seed) &&
    !/\s(vs|versus|or|and|for|with|in)$/i.test(q.trim()) && // incomplete suggestions
    !/\b(login|download|apk|price in|near me|stock|course|certification|salary|jobs?|canva|meaning in)\b/i.test(q) &&
    // "gemini" is also a zodiac sign
    !/\b(compatibility|zodiac|horoscope|manipulate|personality|man|woman|men|women|sign|birthday|tattoo)\b/i.test(q)
  );
};

/**
 * Real search queries for a random subset of seeds.
 * @returns {Promise<{ candidates: object[], errors: string[] }>}
 */
export async function collectEvergreenTopics({ seedCount = 6 } = {}) {
  const seeds = shuffle(SEEDS).slice(0, seedCount);
  const jobs = seeds.flatMap((s) =>
    shuffle(MODIFIERS)
      .slice(0, 3)
      .map((m) => ({ s, q: m ? (m === "vs" ? `${s.seed} vs` : `${m} ${s.seed}`) : `${s.seed} ` }))
  );

  const results = await Promise.allSettled(jobs.map((j) => autocomplete(j.q, { gl: Math.random() < 0.5 ? "in" : "us" })));
  const errors = [];
  const seen = new Set();
  const candidates = [];

  results.forEach((r, i) => {
    const { s } = jobs[i];
    if (r.status === "rejected") {
      errors.push(r.reason?.message || String(r.reason));
      return;
    }
    for (const q of r.value) {
      const key = normalizeTopic(q);
      if (!key || seen.has(key) || !usefulQuery(q, s.seed)) continue;
      seen.add(key);
      candidates.push({
        keyword: q,
        source: `Google search query (${s.area})`,
        score: 0,
        context: [s.experience],
        experience: s.experience,
        docs: s.docs,
        links: [],
        key,
      });
    }
  });

  return { candidates: shuffle(candidates), errors: [...new Set(errors)] };
}

const words = (s) => new Set(normalizeTopic(s).split(" ").filter((w) => w.length > 2));

/** True if `topic` is basically the same subject as one of `titles` (word overlap). */
export function isNearDuplicate(topic, titles) {
  const a = words(topic);
  if (!a.size) return false;
  return titles.some((t) => {
    const b = words(t);
    const inter = [...a].filter((w) => b.has(w)).length;
    return inter / Math.min(a.size, b.size || 1) >= 0.75;
  });
}

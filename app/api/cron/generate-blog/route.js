import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { POSTS_TAG } from "../../../lib/posts.js";
import { timingSafeEqual } from "node:crypto";
import { waitUntil } from "@vercel/functions";
import { dbConnect } from "../../../lib/db.js";
import Post from "../../../(models)/Post.js";
import { collectTrendingTopics, normalizeTopic } from "../../../lib/trends.js";
import { generateBlogPost } from "../../../lib/gemini.js";

// Called by cron-job.org. Scrapes trending keywords → asks Gemini to pick the
// best tech-angled topic and write a structured post → saves it to MongoDB →
// revalidates /blog, the new post page and the sitemap.
//
// Auth: send `Authorization: Bearer <CRON_SECRET>` (preferred) or `?key=<CRON_SECRET>`.
// Options: `?dryRun=1` → only returns the scraped candidates (no Gemini call, nothing saved)
//          `?wait=1`   → wait for the post and return it (default: respond 202 at once)
//          `?topic=Some+keyword` → skip scraping and write about this topic

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds (Vercel Hobby allows up to 60)

const MAX_CANDIDATES = 30;

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const provided =
    (header.startsWith("Bearer ") ? header.slice(7) : "") ||
    new URL(req.url).searchParams.get("key") ||
    "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

const slugify = (s = "") =>
  normalizeTopic(s).split(" ").filter(Boolean).slice(0, 8).join("-").slice(0, 80) || "post";

const clean = (s = "") =>
  String(s)
    .replace(/[*_#`>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Trim to `max` chars on a word boundary. */
const fit = (s, max) => {
  s = clean(s);
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–—]$/, "") + "…";
};

function sanitizePost(raw) {
  const sections = (raw.sections || [])
    .map((s, i) => ({
      heading: clean(s.heading),
      // the article must start with an H2 so the hierarchy is H1 → H2 → H3
      level: i === 0 ? 2 : s.level === 3 ? 3 : 2,
      paragraphs: (s.paragraphs || []).map(clean).filter(Boolean),
      bullets: (s.bullets || []).map(clean).filter(Boolean),
    }))
    .filter((s) => s.heading && (s.paragraphs.length || s.bullets.length));

  const words = sections
    .flatMap((s) => [...s.paragraphs, ...s.bullets])
    .join(" ")
    .split(/\s+/).length;

  return {
    title: fit(raw.title, 90),
    metaTitle: fit(raw.metaTitle || raw.title, 60),
    metaDescription: fit(raw.metaDescription || raw.excerpt, 160),
    excerpt: fit(raw.excerpt, 300),
    category: clean(raw.category) || "Tech",
    keywords: (raw.keywords || []).map(clean).filter(Boolean).slice(0, 10),
    tags: (raw.tags || []).map(clean).filter(Boolean).slice(0, 6),
    sections,
    faq: (raw.faq || [])
      .map((f) => ({ question: clean(f.question), answer: clean(f.answer) }))
      .filter((f) => f.question && f.answer)
      .slice(0, 6),
    readingMinutes: Math.max(2, Math.round(words / 220)),
    words,
  };
}

async function uniqueSlug(base) {
  let slug = base;
  for (let i = 2; await Post.exists({ slug }); i++) slug = `${base}-${i}`;
  return slug;
}

async function getCandidates(forcedTopic) {
  if (forcedTopic) {
    return {
      errors: [],
      candidates: [
        { keyword: forcedTopic, source: "manual", score: 0, context: [], links: [], key: normalizeTopic(forcedTopic) },
      ],
    };
  }
  return collectTrendingTopics();
}

class SkipError extends Error {}

function revalidateBlog() {
  revalidateTag(POSTS_TAG); // post data used by /blog/[slug], sitemap, related posts
  revalidatePath("/blog"); // ISR pages that list posts
  revalidatePath("/");
}

async function runGeneration(forcedTopic, onSaved) {
  const started = Date.now();
  try {
    // 1. Gather candidates
    const { candidates, errors } = await getCandidates(forcedTopic);
    await dbConnect();

    // 2. Drop topics we've already written about
    const recent = await Post.find({}).sort({ publishedAt: -1 }).limit(200).select("title topicKey").lean();
    const usedKeys = new Set(recent.map((p) => p.topicKey).filter(Boolean));
    const fresh = candidates.filter((c) => !usedKeys.has(c.key));
    if (!fresh.length) {
      throw new SkipError(`No new trending topics found. ${errors.join("; ")}`);
    }

    // Interleave sources so the model sees a mix (tech + general trends)
    const bySource = {};
    fresh.forEach((c) => (bySource[c.source] ||= []).push(c));
    Object.values(bySource).forEach((list) => list.sort((a, b) => b.score - a.score));
    const shortlist = [];
    for (let i = 0; shortlist.length < MAX_CANDIDATES && i < 50; i++) {
      for (const list of Object.values(bySource)) if (list[i]) shortlist.push(list[i]);
    }
    shortlist.length = Math.min(shortlist.length, MAX_CANDIDATES);

    // 3. Generate
    const { post: raw, model } = await generateBlogPost(
      shortlist,
      recent.slice(0, 25).map((p) => p.title)
    );
    const chosen = shortlist[raw.chosenIndex] || shortlist[0];
    const post = sanitizePost(raw);

    if (post.sections.length < 3 || post.words < 400) {
      throw new Error(`Generated post too short (${post.words} words, ${post.sections.length} sections)`);
    }

    // 4. Save
    const slug = await uniqueSlug(slugify(raw.slug || post.title));
    const saved = await Post.create({
      ...post,
      slug,
      sourceTopic: chosen.keyword,
      topicKey: chosen.key,
      sources: (chosen.links || []).slice(0, 5),
      status: process.env.BLOG_AUTO_PUBLISH === "false" ? "draft" : "published",
      publishedAt: new Date(),
    });

    // 5. Refresh cached pages (failures here are non-fatal: /blog also
    //    revalidates on a timer)
    try {
      await onSaved(slug);
    } catch (e) {
      console.warn("[cron/generate-blog] revalidate failed:", e.message);
    }

    const result = {
      ok: true,
      slug,
      url: `/blog/${slug}`,
      status: saved.status,
      title: saved.title,
      topic: chosen.keyword,
      source: chosen.source,
      words: post.words,
      model,
      sourceErrors: errors,
      ms: Date.now() - started,
    };
    console.log("[cron/generate-blog] created", JSON.stringify(result));
    return { status: 201, body: result };
  } catch (err) {
    console.error("[cron/generate-blog]", err);
    return {
      status: err instanceof SkipError ? 422 : 500,
      body: { ok: false, error: err.message, ms: Date.now() - started },
    };
  }
}

async function handler(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const params = url.searchParams;
  const forcedTopic = params.get("topic");

  // Internal: called by the background job once a post is saved, because
  // revalidatePath() only takes effect inside a live request in Next 14.
  if (params.has("revalidate")) {
    revalidateBlog(params.get("revalidate"));
    return NextResponse.json({ ok: true, revalidated: true });
  }

  if (params.get("dryRun") === "1") {
    const { candidates, errors } = await getCandidates(forcedTopic);
    return NextResponse.json({
      ok: true,
      dryRun: true,
      count: candidates.length,
      errors,
      candidates: candidates.map(({ keyword, source, score }) => ({ keyword, source, score })),
    });
  }

  if (!process.env.MONGO_URI || !process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "MONGO_URI and GEMINI_API_KEY must be set" },
      { status: 503 }
    );
  }

  // `?wait=1` → run synchronously and return the full result (manual testing).
  if (params.get("wait") === "1") {
    const { status, body } = await runGeneration(forcedTopic, async (slug) => revalidateBlog(slug));
    return NextResponse.json(body, { status });
  }

  // Default: acknowledge immediately so cron-job.org (30s timeout) records a
  // success, and keep generating in the background on Vercel. Results are
  // visible in the Vercel function logs.
  const selfRevalidate = async (slug) => {
    const target = new URL(`/api/cron/generate-blog?revalidate=${encodeURIComponent(slug)}`, url.origin);
    const r = await fetch(target, {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  };
  waitUntil(runGeneration(forcedTopic, selfRevalidate));
  return NextResponse.json(
    { ok: true, queued: true, message: "Blog generation started. Check /blog in about a minute." },
    { status: 202 }
  );
}

export const GET = handler;
export const POST = handler;

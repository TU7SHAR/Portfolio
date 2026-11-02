import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { waitUntil } from "@vercel/functions";
import { POSTS_TAG, getPublishedPosts } from "../../../lib/posts.js";
import { dbConnect } from "../../../lib/db.js";
import Post from "../../../(models)/Post.js";
import CronRun from "../../../(models)/CronRun.js";
import { collectTrendingTopics, normalizeTopic } from "../../../lib/trends.js";
import { collectEvergreenTopics, isNearDuplicate } from "../../../lib/topics.js";
import { generateBlogPost, repairBlogPost, DEFAULT_MODEL } from "../../../lib/gemini.js";
import { sanitizePost, qualityIssues } from "../../../lib/postFormat.js";
import { submitToIndexNow, indexNowKey } from "../../../lib/indexnow.js";
import { staticPosts } from "../../../content/posts/index.js";

// Called by cron-job.org. Picks a topic → asks Gemini to research it (URL
// context on official docs / the story's link) and write a structured post →
// checks quality, runs one repair pass if needed → saves to MongoDB →
// revalidates pages + sitemap → pings IndexNow.
//
// Topic modes:
//   evergreen — real Google search queries in areas the author works in (default ~80%)
//   trending  — Hacker News / DEV.to stories (BLOG_TRENDING_SHARE, default 0.2)
//
// Auth: send `Authorization: Bearer <CRON_SECRET>` (preferred) or `?key=<CRON_SECRET>`.
// Options: `?status=1` → last 10 runs with their result / error (start here when debugging)
//          `?dryRun=1` → only returns the topic candidates (no Gemini call, nothing saved)
//          `?mode=evergreen|trending` → force a topic mode for this run
//          `?wait=1`   → wait for the post and return it (default: respond 202 at once)
//          `?topic=Some+query` → skip topic discovery and write about this
//          `?force=1`  → ignore the minimum interval between posts
//          `?indexnow=1` → submit every blog URL to IndexNow (one-off backfill)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Research + generation + repair can take well over 60s. 300s is the Hobby
// maximum and requires Fluid Compute (Vercel → Settings → Functions).
export const maxDuration = 300;

const MAX_CANDIDATES = 14;
// Fewer, better posts: Google's scaled-content-abuse policy targets sites that
// mass-produce pages, and a new domain gets nothing from 12 thin posts a day.
// Default 720 min ≈ 2 posts/day even if cron-job.org fires every 2 hours.
const MIN_INTERVAL_MIN = Number(process.env.BLOG_MIN_INTERVAL_MINUTES ?? 720);
const TRENDING_SHARE = Math.min(1, Math.max(0, Number(process.env.BLOG_TRENDING_SHARE ?? 0.2)));

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
  normalizeTopic(s).split(" ").filter(Boolean).slice(0, 7).join("-").slice(0, 70) || "post";

const STATIC_SLUGS = new Set(staticPosts.map((p) => p.slug));

async function uniqueSlug(base) {
  let slug = base;
  for (let i = 2; STATIC_SLUGS.has(slug) || (await Post.exists({ slug })); i++) slug = `${base}-${i}`;
  return slug;
}

const pickMode = (requested) =>
  requested === "trending" || requested === "evergreen"
    ? requested
    : Math.random() < TRENDING_SHARE
      ? "trending"
      : "evergreen";

async function getCandidates(forcedTopic, mode) {
  if (forcedTopic) {
    return {
      errors: [],
      candidates: [
        { keyword: forcedTopic, source: "manual", score: 0, context: [], links: [], key: normalizeTopic(forcedTopic) },
      ],
    };
  }
  const result = mode === "trending" ? await collectTrendingTopics() : await collectEvergreenTopics();
  // autocomplete can be rate limited: fall back to the other source rather than skip the run
  if (!result.candidates.length && mode === "evergreen") return collectTrendingTopics();
  return result;
}

class SkipError extends Error {}

function revalidateBlog() {
  revalidateTag(POSTS_TAG); // post data used by /blog/[slug], sitemap, related posts, feed
  revalidatePath("/blog");
  revalidatePath("/");
}

/** Returns a reason string if a new run should NOT start now. */
async function shouldSkip(force) {
  const running = await CronRun.findOne({
    status: "running",
    createdAt: { $gt: new Date(Date.now() - (maxDuration + 30) * 1000) },
  }).lean();
  if (running) return `Another run is still in progress (started ${running.createdAt.toISOString()})`;
  if (force || MIN_INTERVAL_MIN <= 0) return null;
  const last = await Post.findOne({}).sort({ createdAt: -1 }).select("createdAt slug").lean();
  const mins = last ? (Date.now() - new Date(last.createdAt).getTime()) / 60000 : Infinity;
  if (mins < MIN_INTERVAL_MIN) {
    return `Last post was ${Math.round(mins)} min ago (minimum ${MIN_INTERVAL_MIN} min, set BLOG_MIN_INTERVAL_MINUTES or use ?force=1)`;
  }
  return null;
}

/** Title for a source URL: the candidate's own link title, else the page <title>, else host + path. */
async function describeSources(urls, knownLinks) {
  const known = new Map(knownLinks.map((l) => [l.url, l.title]));
  return Promise.all(
    [...new Set(urls)].slice(0, 6).map(async (url) => {
      if (known.get(url)) return { url, title: known.get(url) };
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(4000), cache: "no-store" });
        const html = (await res.text()).slice(0, 20000);
        const t = html.match(/<title[^>]*>([^<]{3,160})<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
        if (t) return { url, title: t.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"') };
      } catch {}
      const u = new URL(url);
      return { url, title: `${u.host}${u.pathname === "/" ? "" : u.pathname}` };
    })
  );
}

async function runGeneration({ forcedTopic, mode, onSaved, run }) {
  const started = Date.now();
  const elapsed = () => (Date.now() - started) / 1000;
  const stage = (s, extra = {}) =>
    run ? CronRun.updateOne({ _id: run._id }, { ...(s && { stage: s }), ...extra }).catch(() => {}) : null;
  try {
    // 1. Gather candidates
    await stage("scrape", { mode });
    const { candidates, errors } = await getCandidates(forcedTopic, mode);
    await dbConnect();

    // 2. Drop topics we've already covered (exact key or near-duplicate title)
    const recent = await Post.find({}).sort({ publishedAt: -1 }).limit(300).select("title topicKey primaryQuery").lean();
    const coveredTitles = [
      ...recent.flatMap((p) => [p.title, p.primaryQuery].filter(Boolean)),
      ...staticPosts.flatMap((p) => [p.title, p.primaryQuery].filter(Boolean)),
    ];
    const usedKeys = new Set(recent.map((p) => p.topicKey).filter(Boolean));
    const fresh = candidates.filter((c) => !usedKeys.has(c.key) && (forcedTopic || !isNearDuplicate(c.keyword, coveredTitles)));
    if (!fresh.length) throw new SkipError(`No new topics found. ${errors.join("; ")}`);

    // Interleave sources so the model sees a mix
    const bySource = {};
    fresh.forEach((c) => (bySource[c.source] ||= []).push(c));
    Object.values(bySource).forEach((list) => list.sort((a, b) => b.score - a.score));
    const shortlist = [];
    for (let i = 0; shortlist.length < MAX_CANDIDATES && i < 50; i++) {
      for (const list of Object.values(bySource)) if (list[i] && shortlist.length < MAX_CANDIDATES) shortlist.push(list[i]);
    }

    // Pages the post may link to inline (internal linking helps crawling and ranking)
    const published = await getPublishedPosts({ limit: 40 });
    const internalPages = [
      { path: "/projects", title: "Projects by Tushar Gautam" },
      { path: "/about", title: "About Tushar Gautam" },
      ...published.map((p) => ({ path: `/blog/${p.slug}`, title: p.title })),
    ];
    const allowedLinks = new Set(internalPages.map((p) => p.path));

    // 3. Generate (abort before Vercel would kill the function, so the error is recorded)
    await stage("gemini", { sourceErrors: errors });
    const { post: raw, model, urls } = await generateBlogPost(shortlist, {
      mode: forcedTopic ? "evergreen" : mode,
      recentTitles: coveredTitles.slice(0, 60),
      internalPages,
      timeoutMs: Math.max(30, maxDuration - 110 - elapsed()) * 1000,
    });
    const chosen = shortlist[raw.chosenIndex] || shortlist[0];
    let post = sanitizePost(raw, allowedLinks);
    let { issues, hard } = qualityIssues(post);

    // 4. One repair pass if there is time left (keeps ~40s for saving + revalidation)
    const repairBudget = maxDuration - 40 - elapsed();
    if (issues.length && repairBudget > 45) {
      await stage("repair", { topic: chosen.keyword });
      try {
        const fixed = sanitizePost(await repairBlogPost(raw, issues, { timeoutMs: repairBudget * 1000 }), allowedLinks);
        const after = qualityIssues(fixed);
        // keep the repaired version unless it somehow got worse
        if (after.issues.length <= issues.length && fixed.words >= post.words * 0.9) {
          post = fixed;
          ({ issues, hard } = after);
        }
      } catch (e) {
        console.warn("[cron/generate-blog] repair failed:", e.message);
      }
    }

    if (post.sections.length < 3 || post.words < 400) {
      throw new Error(`Generated post too short (${post.words} words, ${post.sections.length} sections)`);
    }

    // 5. Save (posts that still fail hard checks become drafts, not public pages)
    await stage("save", { topic: chosen.keyword });
    const slug = await uniqueSlug(slugify(raw.slug || post.primaryQuery || post.title));
    // Only list URLs we handed to the model (docs / the story's link) and that it actually read.
    const offered = [...(chosen.docs || []), ...(chosen.links || []).map((l) => l.url)];
    const read = urls.filter((u) => offered.includes(u));
    const sources = await describeSources(read.length ? read : offered.slice(0, 3), chosen.links || []);
    const publish = process.env.BLOG_AUTO_PUBLISH !== "false" && hard.length === 0;
    const saved = await Post.create({
      ...post,
      slug,
      mode: forcedTopic ? "manual" : mode,
      sourceTopic: chosen.keyword,
      topicKey: chosen.key,
      sources,
      qualityIssues: [...hard.map((h) => `BLOCKING: ${h}`), ...issues],
      status: publish ? "published" : "draft",
      publishedAt: new Date(),
    });

    // 6. Refresh cached pages + tell Bing (failures here are non-fatal)
    await stage("revalidate", { slug });
    try {
      await onSaved(slug);
    } catch (e) {
      console.warn("[cron/generate-blog] revalidate failed:", e.message);
    }
    let indexNow;
    if (publish) {
      indexNow = await submitToIndexNow([`/blog/${slug}`, "/blog"]).catch((e) => ({ ok: false, error: e.message }));
    }

    const result = {
      ok: true,
      slug,
      url: `/blog/${slug}`,
      status: saved.status,
      title: saved.title,
      mode,
      topic: chosen.keyword,
      source: chosen.source,
      words: post.words,
      qualityIssues: saved.qualityIssues,
      sources: sources.length,
      indexNow,
      model,
      sourceErrors: errors,
      ms: Date.now() - started,
    };
    console.log("[cron/generate-blog] created", JSON.stringify(result));
    await stage("done", { status: "success", ms: result.ms, finishedAt: new Date() });
    return { status: 201, body: result };
  } catch (err) {
    console.error("[cron/generate-blog]", err);
    const skipped = err instanceof SkipError;
    await stage(undefined, {
      status: skipped ? "skipped" : "error",
      error: err.message,
      ms: Date.now() - started,
      finishedAt: new Date(),
    });
    return {
      status: skipped ? 422 : 500,
      body: { ok: false, error: err.message, ms: Date.now() - started },
    };
  }
}

async function statusReport() {
  await dbConnect();
  const [runs, posts, total] = await Promise.all([
    CronRun.find({}).sort({ createdAt: -1 }).limit(10).lean(),
    Post.find({}).sort({ createdAt: -1 }).limit(5).select("slug title status createdAt words qualityIssues").lean(),
    Post.countDocuments({}),
  ]);
  const staleAfter = (maxDuration + 30) * 1000;
  return {
    ok: true,
    config: {
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      research: process.env.GEMINI_GROUNDING === "true" ? "url-context + google-search" : "url-context",
      trendingShare: TRENDING_SHARE,
      autoPublish: process.env.BLOG_AUTO_PUBLISH !== "false",
      minIntervalMinutes: MIN_INTERVAL_MIN,
      maxDurationSeconds: maxDuration,
      indexNow: Boolean(indexNowKey()),
    },
    totalPosts: total + staticPosts.length,
    latestPosts: posts.map((p) => ({
      url: `/blog/${p.slug}`,
      title: p.title,
      status: p.status,
      words: p.words,
      qualityIssues: p.qualityIssues?.length ? p.qualityIssues : undefined,
      createdAt: p.createdAt,
    })),
    runs: runs.map((r) => {
      const timedOut = r.status === "running" && Date.now() - new Date(r.createdAt).getTime() > staleAfter;
      return {
        at: r.createdAt,
        trigger: r.trigger,
        mode: r.mode,
        status: timedOut ? "timed-out" : r.status,
        stage: r.stage,
        ...(timedOut && {
          hint: `Killed by Vercel during "${r.stage}". Enable Fluid Compute (Settings → Functions) so the 300s limit applies.`,
        }),
        error: r.error,
        topic: r.topic,
        url: r.slug ? `/blog/${r.slug}` : undefined,
        seconds: r.ms ? Math.round(r.ms / 1000) : undefined,
        sourceErrors: r.sourceErrors?.length ? r.sourceErrors : undefined,
      };
    }),
  };
}

async function handler(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const params = url.searchParams;
  const forcedTopic = params.get("topic");
  const mode = pickMode(params.get("mode"));

  // Internal: called by the background job once a post is saved, because
  // revalidatePath() only takes effect inside a live request in Next 14.
  if (params.has("revalidate")) {
    revalidateBlog();
    return NextResponse.json({ ok: true, revalidated: true });
  }

  if (params.get("dryRun") === "1") {
    const { candidates, errors } = await getCandidates(forcedTopic, mode);
    return NextResponse.json({
      ok: true,
      dryRun: true,
      mode,
      count: candidates.length,
      errors,
      candidates: candidates.map(({ keyword, source, score }) => ({ keyword, source, score })),
    });
  }

  if (params.get("indexnow") === "1") {
    const posts = await getPublishedPosts({ limit: 5000 });
    const result = await submitToIndexNow(["/", "/blog", "/projects", "/about", ...posts.map((p) => `/blog/${p.slug}`)]);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (!process.env.MONGO_URI || !process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "MONGO_URI and GEMINI_API_KEY must be set" },
      { status: 503 }
    );
  }

  // Fail fast (and visibly) if MongoDB is unreachable — e.g. paused Atlas
  // cluster or Network Access not allowing 0.0.0.0/0.
  try {
    await dbConnect();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `Cannot connect to MongoDB: ${err.message}`,
        hint: "In Atlas: resume the cluster if paused, and allow 0.0.0.0/0 under Network Access.",
      },
      { status: 503 }
    );
  }

  if (params.get("status") === "1") {
    return NextResponse.json(await statusReport());
  }

  const wait = params.get("wait") === "1";
  const skipReason = await shouldSkip(params.get("force") === "1" || Boolean(forcedTopic));
  if (skipReason) {
    // 200 so cron-job.org doesn't count an intentional skip as a failure
    return NextResponse.json({ ok: true, skipped: true, reason: skipReason });
  }
  const run = await CronRun.create({ trigger: wait ? "wait" : "background", stage: "start", mode });

  // `?wait=1` → run synchronously and return the full result (manual testing).
  if (wait) {
    const { status, body } = await runGeneration({ forcedTopic, mode, onSaved: async () => revalidateBlog(), run });
    return NextResponse.json(body, { status });
  }

  // Default: acknowledge immediately so cron-job.org (30s timeout) records a
  // success, and keep generating in the background on Vercel.
  const selfRevalidate = async (slug) => {
    const target = new URL(`/api/cron/generate-blog?revalidate=${encodeURIComponent(slug)}`, url.origin);
    const r = await fetch(target, {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  };
  waitUntil(runGeneration({ forcedTopic, mode, onSaved: selfRevalidate, run }));
  return NextResponse.json(
    {
      ok: true,
      queued: true,
      mode,
      runId: String(run._id),
      message: "Blog generation started. Check /blog in 2–4 minutes, or ?status=1 for the result.",
    },
    { status: 202 }
  );
}

export const GET = handler;
export const POST = handler;

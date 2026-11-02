import { cache } from "react";
import { unstable_cache } from "next/cache";
import { dbConnect, isDbConfigured } from "./db.js";
import Post from "../(models)/Post.js";
import { staticPosts } from "../content/posts/index.js";

// Read helpers used by pages, sitemap and feed. They never throw: if MongoDB is
// not configured or is unreachable, the blog still shows the hand-written posts
// from app/content/posts instead of breaking the build or the page.
//
// DB results are kept in Next's data cache under the "posts" tag. The cron
// endpoint calls revalidateTag("posts") after publishing, so every page and
// the sitemap pick up new posts immediately; otherwise they refresh hourly.

export const POSTS_TAG = "posts";
const CACHE = { tags: [POSTS_TAG], revalidate: 3600 };

const SUMMARY_FIELDS = "slug title excerpt category tags publishedAt updatedAt readingMinutes";
const toPlain = (doc) => JSON.parse(JSON.stringify(doc));
const summary = ({ slug, title, excerpt, category, tags, publishedAt, updatedAt, readingMinutes }) => ({
  slug, title, excerpt, category, tags, publishedAt, updatedAt, readingMinutes,
});
const STATIC_SUMMARIES = staticPosts.map(summary);
const byDateDesc = (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt);

const countPosts = unstable_cache(
  async () => {
    await dbConnect();
    return Post.countDocuments({ status: "published" });
  },
  ["posts:count"],
  CACHE
);

const listPosts = unstable_cache(
  async (limit, skip = 0) => {
    await dbConnect();
    const posts = await Post.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(SUMMARY_FIELDS)
      .lean();
    return toPlain(posts);
  },
  ["posts:list"],
  CACHE
);

const findPost = unstable_cache(
  async (slug) => {
    await dbConnect();
    const post = await Post.findOne({ slug, status: "published" }).lean();
    return post ? toPlain(post) : null;
  },
  ["posts:bySlug"],
  CACHE
);

const findRelated = unstable_cache(
  async (slug, category, tags, limit) => {
    await dbConnect();
    const related = await Post.find({
      status: "published",
      slug: { $ne: slug },
      $or: [{ category }, { tags: { $in: tags } }],
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select("slug title excerpt category publishedAt tags")
      .lean();
    return toPlain(related);
  },
  ["posts:related"],
  CACHE
);

async function dbList(limit) {
  if (!isDbConfigured()) return [];
  try {
    return await listPosts(limit, 0);
  } catch (err) {
    console.error("[blog] getPublishedPosts failed:", err.message);
    return [];
  }
}

/** Newest first, hand-written and generated posts merged. */
export async function getPublishedPosts({ limit = 60, skip = 0 } = {}) {
  // fetch enough DB rows to fill this page after merging in the static posts
  const db = await dbList(skip + limit);
  return [...STATIC_SUMMARIES, ...db].sort(byDateDesc).slice(skip, skip + limit);
}

export async function countPublishedPosts() {
  if (!isDbConfigured()) return staticPosts.length;
  try {
    return staticPosts.length + (await countPosts());
  } catch {
    return staticPosts.length;
  }
}

// cached per request too, so generateMetadata + page share one lookup
export const getPostBySlug = cache(async function getPostBySlug(slug) {
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  const local = staticPosts.find((p) => p.slug === slug);
  if (local) return local;
  if (!isDbConfigured()) return null;
  try {
    return await findPost(slug);
  } catch (err) {
    console.error("[blog] getPostBySlug failed:", err.message);
    return null;
  }
});

export async function getRelatedPosts(post, limit = 3) {
  if (!post) return [];
  const tags = post.tags || [];
  const score = (p) => (p.category === post.category ? 1 : 0) + (p.tags || []).filter((t) => tags.includes(t)).length;
  const local = STATIC_SUMMARIES.filter((p) => p.slug !== post.slug && score(p) > 0);
  let db = [];
  if (isDbConfigured()) {
    try {
      db = await findRelated(post.slug, post.category, tags, limit);
    } catch {}
  }
  return [...local, ...db]
    .sort((a, b) => score(b) - score(a) || byDateDesc(a, b))
    .slice(0, limit);
}

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

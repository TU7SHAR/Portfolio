import { cache } from "react";
import { unstable_cache } from "next/cache";
import { dbConnect, isDbConfigured } from "./db.js";
import Post from "../(models)/Post.js";

// Read helpers used by pages + sitemap. They never throw: if MongoDB is not
// configured or is unreachable, the blog simply renders its empty state
// instead of breaking the build or the page.
//
// Results are kept in Next's data cache under the "posts" tag. The cron
// endpoint calls revalidateTag("posts") after publishing, so every page and
// the sitemap pick up new posts immediately; otherwise they refresh hourly.

export const POSTS_TAG = "posts";
const CACHE = { tags: [POSTS_TAG], revalidate: 3600 };

const toPlain = (doc) => JSON.parse(JSON.stringify(doc));

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
      .select("slug title excerpt category tags publishedAt updatedAt readingMinutes")
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
      .select("slug title excerpt category publishedAt")
      .lean();
    return toPlain(related);
  },
  ["posts:related"],
  CACHE
);

export async function getPublishedPosts({ limit = 60, skip = 0 } = {}) {
  if (!isDbConfigured()) return [];
  try {
    return await listPosts(limit, skip);
  } catch (err) {
    console.error("[blog] getPublishedPosts failed:", err.message);
    return [];
  }
}

export async function countPublishedPosts() {
  if (!isDbConfigured()) return 0;
  try {
    return await countPosts();
  } catch {
    return 0;
  }
}

// cached per request too, so generateMetadata + page share one lookup
export const getPostBySlug = cache(async function getPostBySlug(slug) {
  if (!isDbConfigured() || !/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  try {
    return await findPost(slug);
  } catch (err) {
    console.error("[blog] getPostBySlug failed:", err.message);
    return null;
  }
});

export async function getRelatedPosts(post, limit = 3) {
  if (!isDbConfigured() || !post) return [];
  try {
    return await findRelated(post.slug, post.category, post.tags || [], limit);
  } catch {
    return [];
  }
}

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

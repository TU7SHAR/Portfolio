import type { MetadataRoute } from "next";
import siteMetaData from "./utils/siteMetaData.js";
import { getPublishedPosts } from "./lib/posts.js";

// Built per request from the cached post list (lib/posts.js), so it updates
// as soon as the cron job publishes a post.
export const dynamic = "force-dynamic";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteMetaData.siteUrl;
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: Freq }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/projects/c", priority: 0.5, changeFrequency: "yearly" },
    { path: "/projects/cpp", priority: 0.5, changeFrequency: "yearly" },
    { path: "/projects/javascript", priority: 0.5, changeFrequency: "yearly" },
    { path: "/projects/typescript", priority: 0.5, changeFrequency: "yearly" },
  ];

  const posts = await getPublishedPosts({ limit: 5000 });

  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...posts.map((p: { slug: string; updatedAt?: string; publishedAt: string }) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.publishedAt),
      changeFrequency: "monthly" as Freq,
      priority: 0.6,
    })),
  ];
}

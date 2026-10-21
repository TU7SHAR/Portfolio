import { renderOg, ogSize, ogContentType } from "../../lib/og.jsx";
import { getPostBySlug, formatDate } from "../../lib/posts.js";

export const alt = "Blog post by Tushar Gautam";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-dynamic";

export default async function Image({ params }) {
  const post = await getPostBySlug(params.slug);
  return renderOg({
    eyebrow: post ? `${post.category} · ${formatDate(post.publishedAt)}` : "The blog",
    title: post?.title || "Notes on AI, the web & trending tech",
    subtitle: post ? `${post.readingMinutes} min read · by Tushar Gautam` : undefined,
    tags: post?.tags || [],
  });
}

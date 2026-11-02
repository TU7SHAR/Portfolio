import site from "../../utils/siteMetaData.js";
import { getPublishedPosts } from "../../lib/posts.js";

// RSS 2.0 feed for readers, aggregators and search engines (Google accepts
// RSS as a sitemap too). Built from the same cached data as /blog.
export const dynamic = "force-dynamic";

const esc = (s = "") =>
  String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

export async function GET() {
  const posts = await getPublishedPosts({ limit: 50 });
  const items = posts
    .map((p) => {
      const url = `${site.siteUrl}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <dc:creator>${esc(site.author)}</dc:creator>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(`${site.author} — Tech Blog`)}</title>
    <link>${site.siteUrl}/blog</link>
    <description>Practical, first-hand notes on Next.js, the Gemini API, AI products and shipping on Vercel.</description>
    <language>en</language>
    <atom:link href="${site.siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].publishedAt).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

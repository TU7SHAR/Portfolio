import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import site from "../utils/siteMetaData.js";
import { pageMetadata, breadcrumbJsonLd } from "../lib/seo.js";
import { notFound } from "next/navigation";
import { getPublishedPosts, countPublishedPosts, formatDate } from "../lib/posts.js";

// Rendered per request from cached data (lib/posts.js), which the cron
// endpoint refreshes the moment a post is published.
export const dynamic = "force-dynamic";

const PER_PAGE = 24;
const KEYWORDS = ["tech blog", "AI news", "web development blog", "trending tech", "programming blog India"];

const pageFrom = (searchParams) => {
  const n = Number(searchParams?.page || 1);
  return Number.isInteger(n) && n >= 1 ? n : NaN;
};

export function generateMetadata({ searchParams }) {
  const page = pageFrom(searchParams);
  if (!page || page === 1) {
    return pageMetadata({
      title: "Tech Blog by Tushar Gautam — AI, Web Dev & Trending Tech",
      description:
        "Read Tushar Gautam's tech blog for fresh, practical takes on trending AI, web development, programming and startup news, written for developers and builders.",
      path: "/blog",
      keywords: KEYWORDS,
    });
  }
  return pageMetadata({
    title: `Tech Blog by Tushar Gautam — AI & Web Dev Posts, Page ${page}`,
    description: `Page ${page} of Tushar Gautam's tech blog: fresh, practical takes on trending AI, web development, programming and startup news, written for developers & builders.`,
    path: `/blog?page=${page}`,
    keywords: KEYWORDS,
  });
}

export default async function BlogIndex({ searchParams }) {
  const page = pageFrom(searchParams);
  if (!page) notFound();
  const [posts, total] = await Promise.all([
    getPublishedPosts({ limit: PER_PAGE, skip: (page - 1) * PER_PAGE }),
    countPublishedPosts(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (page > pages) notFound();
  const lead = page === 1 ? posts[0] : null;
  const rest = page === 1 ? posts.slice(1) : posts;
  const pageHref = (n) => (n === 1 ? "/blog" : `/blog?page=${n}`);

  return (
    <main className="content-layer max-w-6xl mx-auto px-6 md:px-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${site.siteUrl}/blog#blog`,
            url: `${site.siteUrl}/blog`,
            name: "Tushar Gautam — Tech Blog",
            description: "Practical takes on trending AI, web development, programming and startup news.",
            author: { "@id": `${site.siteUrl}/#person` },
            blogPost: posts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${site.siteUrl}/blog/${p.slug}`,
              datePublished: p.publishedAt,
            })),
          },
        ]}
      />

      <Reveal className="max-w-3xl mb-14 mt-4">
        <p className="eyebrow mb-4">The blog</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] mb-6">
          Notes on AI, the web &amp;{" "}
          <span className="serif-accent">what&apos;s trending.</span>
        </h1>
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          Short, practical reads on the tech everyone is talking about — and what it
          means if you build software for a living.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <section className="card p-10 text-center mb-24">
          <h2 className="font-display text-3xl mb-3">First posts are on the way</h2>
          <p className="text-[color:var(--ink-mute)]">
            New articles land here regularly. Meanwhile, take a look at{" "}
            <Link href="/projects" className="text-[color:var(--amber)] underline underline-offset-4">
              what I&apos;ve built
            </Link>
            .
          </p>
        </section>
      ) : (
        <>
          <div className="rule mb-2" />
          {lead && (
          <Reveal>
            <Link
              href={`/blog/${lead.slug}`}
              className="group block border-b border-[color:rgba(244,239,230,0.08)] py-10 hover:border-[color:rgba(224,160,73,0.4)] transition-colors"
            >
              <p className="eyebrow mb-4">
                Latest · {lead.category}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl leading-tight group-hover:text-[color:var(--amber)] transition-colors max-w-4xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--ink-soft)] leading-relaxed">{lead.excerpt}</p>
              <p className="mt-5 text-sm text-[color:var(--ink-mute)]">
                <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time> · {lead.readingMinutes} min read
              </p>
            </Link>
          </Reveal>
          )}

          {rest.length > 0 && (
            <section className="mt-16 mb-12">
              <h2 className="font-display text-3xl sm:text-4xl mb-8">
                {page === 1 ? "More articles" : `Articles — page ${page} of ${pages}`}
              </h2>
              <Reveal stagger className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {rest.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 flex flex-col gap-3">
                    <span className="eyebrow">{p.category}</span>
                    <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                    <p className="text-sm text-[color:var(--ink-soft)] line-clamp-3">{p.excerpt}</p>
                    <p className="text-xs text-[color:var(--ink-mute)] mt-auto pt-2">
                      <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time> · {p.readingMinutes} min read
                    </p>
                  </Link>
                ))}
              </Reveal>
            </section>
          )}

          {pages > 1 && (
            <nav aria-label="Blog pages" className="mb-24 flex items-center justify-between gap-4">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} rel="prev" className="btn-ghost inline-flex px-5 py-2.5">
                  ← Newer posts
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-[color:var(--ink-mute)]">
                Page {page} of {pages}
              </span>
              {page < pages ? (
                <Link href={pageHref(page + 1)} rel="next" className="btn-ghost inline-flex px-5 py-2.5">
                  Older posts →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </main>
  );
}

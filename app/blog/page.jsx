import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import site from "../utils/siteMetaData.js";
import { pageMetadata, breadcrumbJsonLd } from "../lib/seo.js";
import { getPublishedPosts, formatDate } from "../lib/posts.js";

// ISR: refreshed instantly by the cron endpoint, and at most every 10 min otherwise.
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Tech Blog by Tushar Gautam — AI, Web Dev & Trending Tech",
  description:
    "Read Tushar Gautam's tech blog for fresh, practical takes on trending AI, web development, programming and startup news, written for developers and builders.",
  path: "/blog",
  keywords: ["tech blog", "AI news", "web development blog", "trending tech", "programming blog India"],
});

export default async function BlogIndex() {
  const posts = await getPublishedPosts({ limit: 60 });
  const [lead, ...rest] = posts;

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
            description: metadata.description,
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

      {!lead ? (
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

          {rest.length > 0 && (
            <section className="mt-16 mb-24">
              <h2 className="font-display text-3xl sm:text-4xl mb-8">More articles</h2>
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
        </>
      )}
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../(components)/JsonLd.jsx";
import site from "../../utils/siteMetaData.js";
import { pageMetadata, breadcrumbJsonLd } from "../../lib/seo.js";
import { getPostBySlug, getRelatedPosts, formatDate } from "../../lib/posts.js";

// Rendered per request (data itself is cached under the "posts" tag — see
// lib/posts.js). Rendering dynamically is what lets unknown slugs return a
// real HTTP 404 instead of a cached 200 "soft 404".
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  // Must happen here (not only in the page): metadata resolves before the
  // response starts streaming, so this yields a real HTTP 404, not a soft 404.
  if (!post) notFound();
  return pageMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
  });
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const url = `${site.siteUrl}/blog/${post.slug}`;

  const schema = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: url,
      url,
      headline: post.title,
      description: post.metaDescription,
      image: `${url}/opengraph-image`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      articleSection: post.category,
      keywords: (post.keywords || []).join(", "),
      inLanguage: "en",
      author: { "@id": `${site.siteUrl}/#person`, "@type": "Person", name: site.author, url: site.siteUrl },
      publisher: { "@id": `${site.siteUrl}/#person` },
      isPartOf: { "@id": `${site.siteUrl}/blog#blog` },
    },
    post.faq?.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ].filter(Boolean);

  return (
    <main className="content-layer max-w-3xl mx-auto px-6 md:px-10">
      <JsonLd data={schema} />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[color:var(--ink-mute)]">
        <Link href="/" className="hover:text-[color:var(--amber)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[color:var(--amber)]">Blog</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-[color:var(--ink-soft)]">{post.category}</span>
      </nav>

      <article>
        <header className="mb-12">
          <p className="eyebrow mb-4">{post.category}</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] mb-6">{post.title}</h1>
          <p className="text-xl text-[color:var(--ink-soft)] leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 text-sm text-[color:var(--ink-mute)]">
            By <Link href="/about" className="text-[color:var(--ink-soft)] hover:text-[color:var(--amber)]">{site.author}</Link>
            {" · "}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {" · "}
            {post.readingMinutes} min read
          </p>
          <div className="rule mt-8" />
        </header>

        <div className="flex flex-col gap-10 text-lg leading-8 text-[color:var(--ink-soft)]">
          {post.sections.map((s, i) => {
            const H = s.level === 3 ? "h3" : "h2";
            return (
              <section key={i}>
                <H
                  className={`font-display text-[color:var(--ink)] mb-4 ${
                    s.level === 3 ? "text-2xl" : "text-3xl"
                  }`}
                >
                  {s.heading}
                </H>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mb-4">{p}</p>
                ))}
                {s.bullets?.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--amber)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {post.faq?.length > 0 && (
            <section>
              <h2 className="font-display text-3xl text-[color:var(--ink)] mb-6">Frequently asked questions</h2>
              <div className="flex flex-col gap-6">
                {post.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-medium text-xl text-[color:var(--ink)] mb-2">{f.question}</h3>
                    <p>{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {post.sources?.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-[color:var(--ink)] mb-4">Sources &amp; further reading</h2>
              <ul className="space-y-2 text-base">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--amber)] underline underline-offset-4 break-words"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-sm text-[color:var(--ink-mute)] border-t border-[color:rgba(244,239,230,0.08)] pt-6">
            This article was drafted with the help of AI (Google Gemini) from trending topics and
            published by {site.author}. Spotted an error?{" "}
            <Link href="/contact" className="text-[color:var(--amber)] underline underline-offset-4">Let me know</Link>.
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <aside className="mt-20">
          <h2 className="font-display text-3xl mb-6">Keep reading</h2>
          <div className="grid gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="card p-5">
                <span className="eyebrow">{r.category}</span>
                <h3 className="font-display text-xl mt-2">{r.title}</h3>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </main>
  );
}

import Link from "next/link";
import Hero from "./(components)/Hero.jsx";
import TechMarquee from "./(components)/TechMarquee.jsx";
import AboutFooter from "./(components)/AboutFooter.jsx";
import GithubActivity from "./(components)/GithubActivity.jsx";
import Reveal from "./(components)/Reveal.jsx";
import Badges from "./(components)/Badges.jsx";
import HowIBuild from "./(components)/HowIBuild.jsx";
import { flagship } from "./utils/projects.js";
import JsonLd from "./(components)/JsonLd.jsx";
import site from "./utils/siteMetaData.js";
import { pageMetadata } from "./lib/seo.js";
import { getPublishedPosts, formatDate } from "./lib/posts.js";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: site.title,
  description: site.description,
  path: "/",
  keywords: ["AI engineer India", "agentic coding", "AI-assisted development", "full-stack developer India", "Next.js developer"],
});

const featured = flagship;

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: site.siteUrl,
  name: site.title,
  mainEntity: { "@id": `${site.siteUrl}/#person` },
};

export default async function Page() {
  const latestPosts = await getPublishedPosts({ limit: 3 });

  return (
    <main>
      <JsonLd data={profileJsonLd} />
      <Hero />

      <div className="mt-8 mb-24">
        <TechMarquee />
      </div>

      {/* Selected work — editorial numbered list */}
      <section className="content-layer max-w-6xl mx-auto px-6 md:px-10 mb-28">
        <Reveal className="flex items-end justify-between mb-4 flex-wrap gap-4">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Products I&apos;ve shipped
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors whitespace-nowrap"
          >
            All projects
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </Reveal>

        <div className="rule mb-2" />

        <Reveal stagger>
          {featured.map((p, i) => (
            <Link
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group grid md:grid-cols-[auto_1fr_auto] gap-x-8 gap-y-4 items-start border-b border-[color:rgba(244,239,230,0.08)] py-9 transition-colors hover:border-[color:rgba(224,160,73,0.4)]"
            >
              <span className="font-display text-2xl text-[color:var(--ink-mute)] group-hover:text-[color:var(--amber)] transition-colors">
                0{i + 1}
              </span>

              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-display text-3xl sm:text-4xl group-hover:text-[color:var(--amber)] transition-colors">
                    {p.name}
                  </h3>
                  <span className="eyebrow">{p.tag}</span>
                </div>
                <Badges ids={p.badges} className="mt-3" />
                <p className="mt-3 max-w-2xl text-[color:var(--ink-soft)] leading-relaxed">
                  {p.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="hidden md:block h-7 w-7 text-[color:var(--ink-mute)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--amber)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17 17 7M7 7h10v10"
                />
              </svg>
            </Link>
          ))}
        </Reveal>
      </section>

      <HowIBuild />

      {latestPosts.length > 0 && (
        <section className="content-layer max-w-6xl mx-auto px-6 md:px-10 mb-28">
          <Reveal className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-4">From the blog</p>
              <h2 className="font-display text-4xl sm:text-5xl">Latest writing</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors whitespace-nowrap"
            >
              All posts →
            </Link>
          </Reveal>
          <Reveal stagger className="grid md:grid-cols-3 gap-4">
            {latestPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 flex flex-col gap-3">
                <span className="eyebrow">{p.category}</span>
                <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                <p className="text-sm text-[color:var(--ink-mute)] mt-auto">
                  <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                </p>
              </Link>
            ))}
          </Reveal>
        </section>
      )}

      <GithubActivity />

      <AboutFooter />
    </main>
  );
}

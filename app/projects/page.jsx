import Link from "next/link";
import Image from "next/image";
import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import { pageMetadata, breadcrumbJsonLd } from "../lib/seo.js";

export const metadata = pageMetadata({
  title: "Projects by Tushar Gautam — AI SaaS, RAG Chatbots & Apps",
  description:
    "Explore projects by Tushar Gautam: bubbl.ooo RAG chatbots, bhavishai.in AI astrology, salesji.com Telegram sales bots, makeperfectads.com AI video ads and more.",
  path: "/projects",
  keywords: ["Tushar Gautam projects", "RAG chatbot SaaS", "AI astrology platform", "AI video ad generator", "Telegram sales bot"],
});

const flagship = [
  {
    name: "bubbl.ooo",
    tag: "RAG Chatbot SaaS",
    href: "https://app.bubbl.ooo",
    desc: "A multi-tenant RAG chatbot platform where scraped web content is auto-vectorized into Gemini FileSearch stores, letting businesses deploy context-aware AI agents with persistent conversations and lead capture — zero ML infra managed manually.",
    points: [
      "Background job processing with Celery + Redis for web scraping",
      "Deployed on VPS with Gunicorn (gthread) + systemd service management",
      "Similar in spirit to chatbase.co, built solo end-to-end",
    ],
    stack: ["Python Flask", "Gemini API", "Redis · Celery", "PostgreSQL", "Paddle"],
  },
  {
    name: "bhavishai.in",
    tag: "AI Astrology Platform",
    href: "https://bhavishai.in",
    desc: "Integrates Swiss Ephemeris (a C-based library) to compute planetary longitudes and dashas from user details, then uses the Gemini API to produce specialized reports — wrapped in a full commerce pipeline.",
    points: [
      "Razorpay signature verification, background PDF generation & email dispatch",
      "Admin reconciliation system for failed deliveries",
      "Protected admin panel with revenue dashboards & user-journey analytics",
    ],
    stack: ["Next.js", "Swiss Ephemeris", "Gemini AI", "Razorpay", "PostgreSQL"],
  },
  {
    name: "salesji.com",
    tag: "AI Telegram Bot Workspace",
    href: "https://app.salesji.com",
    desc: "A workspace for building and managing AI-powered Telegram sales bots, letting businesses deploy conversational agents that engage leads and automate sales conversations directly inside Telegram.",
    points: [
      "Configure and deploy AI sales agents to Telegram from a single workspace",
      "Automates lead engagement and sales conversations end-to-end",
      "Built as a multi-tenant SaaS product",
    ],
    stack: ["Telegram Bot API", "AI Agents", "Next.js", "PostgreSQL"],
  },
  {
    name: "makeperfectads.com",
    tag: "AI Video Ad Generator",
    href: "https://www.makeperfectads.com",
    desc: "An AI video ad generator that turns a website link or product photo into a short, ready-to-publish video ad. The Studio reads the page, works out what you sell, plans the ad shot by shot and produces it — the user only confirms one screen, with no timeline to edit.",
    points: [
      "Pipeline: read page → collect product images & brand look → plan shots → generate AI video → mix voiceover & music",
      "84 languages plus 14 mixed styles (Hinglish, Tanglish, Spanglish…), including right-to-left caption support",
      "Automatic pre-download checks for audio loudness, unsupported claims and link validity",
      "Exports 8–20s MP4 in 9:16 (Reels, TikTok, Shorts) or 16:9, at 1080p or 720p",
    ],
    stack: ["AI Video", "Web Scraping", "Voiceover · TTS", "84 Languages", "MP4 Export"],
  },
];

const projects = [
  { name: "Stoccy", desc: "Stock app using Finnhub + TradingView APIs", img: "/st.png", alt: "Stoccy stock market app screenshot", href: "https://stoccy.vercel.app/", radius: "rounded-md" },
  { name: "certBuilder", desc: "Certificate generation tool", img: "/cb.png", alt: "certBuilder certificate generator logo", href: "https://cb-xi.vercel.app/", radius: "rounded-md" },
  { name: "Descripte", desc: "Scripting / description tool", img: "/desc.png", alt: "Descripte wordmark logo", href: "https://descripte.vercel.app/", radius: "rounded-md" },
  { name: "Contact Form", desc: "Frontend contact form for North", img: "/cfm.png", alt: "North contact form app icon", href: "https://contact-north.vercel.app/", radius: "rounded-md" },
];

const languages = [
  { name: "C++", desc: "Systems & competitive programming", img: "/c++.png", alt: "C++ programming language logo", href: "/projects/cpp", radius: "rounded-full" },
  { name: "JavaScript", desc: "Lightweight, dynamic language of the web", img: "/javascript.png", alt: "JavaScript JS logo", href: "/projects/javascript", radius: "rounded-md" },
  { name: "TypeScript", desc: "JavaScript with types, at scale", img: "/typescript.png", alt: "TypeScript TS logo", href: "/projects/typescript", radius: "rounded-md" },
  { name: "C", desc: "General-purpose systems language", img: "/C.png", alt: "C programming language logo", href: "/projects/c", radius: "rounded-md" },
];

function SmallCard({ item }) {
  return (
    <Link
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer noopener"
      className="card flex items-center gap-x-4 p-4"
    >
      <Image
        src={item.img}
        alt={item.alt || `${item.name} logo`}
        width={52}
        height={52}
        className={`${item.radius} object-cover`}
      />
      <div>
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-[color:var(--ink-mute)]">{item.desc}</p>
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <main className="content-layer max-w-6xl mx-auto px-6 md:px-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Products built by Tushar Gautam",
            itemListElement: flagship.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "SoftwareApplication",
                name: p.name,
                url: p.href,
                applicationCategory: "WebApplication",
                operatingSystem: "Web",
                description: p.desc,
                author: { "@id": "https://tushargautam.software/#person" },
              },
            })),
          },
        ]}
      />
      {/* Header */}
      <Reveal className="max-w-3xl mb-14 mt-4">
        <p className="eyebrow mb-4">Selected work</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] mb-6">
          Things I&apos;ve designed,{" "}
          <span className="serif-accent">built &amp; shipped.</span>
        </h1>
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          From production AI SaaS serving real users to focused frontend tools —
          here&apos;s a look at what I&apos;ve been building.
        </p>
      </Reveal>

      {/* Flagship — editorial rows */}
      <div className="rule mb-2" />
      <Reveal stagger className="mb-24">
        {flagship.map((p, i) => (
          <Link
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group grid md:grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-b border-[color:rgba(244,239,230,0.08)] py-10 transition-colors hover:border-[color:rgba(224,160,73,0.4)]"
          >
            <span className="font-display text-2xl text-[color:var(--ink-mute)] group-hover:text-[color:var(--amber)] transition-colors">
              0{i + 1}
            </span>
            <div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-display text-3xl sm:text-4xl group-hover:text-[color:var(--amber)] transition-colors">
                    {p.name}
                  </h2>
                  <span className="eyebrow">{p.tag}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-6 w-6 text-[color:var(--ink-mute)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--amber)]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
                </svg>
              </div>
              <p className="mt-4 max-w-2xl text-[color:var(--ink-soft)] leading-relaxed">
                {p.desc}
              </p>
              <ul className="mt-5 space-y-2 max-w-2xl">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-[color:var(--ink-soft)]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--amber)]" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </Reveal>

      {/* Other projects */}
      <Reveal className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">More projects</h2>
        <p className="text-[color:var(--ink-mute)] mt-2">
          Smaller apps and experiments along the way.
        </p>
      </Reveal>
      <Reveal stagger className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-24">
        {projects.map((item) => (
          <SmallCard key={item.name} item={item} />
        ))}
        <Link
          href="https://github.com/TU7SHAR"
          target="_blank"
          rel="noreferrer noopener"
          className="card flex items-center gap-x-4 p-4"
        >
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-md border border-[color:rgba(244,239,230,0.12)] text-[color:var(--ink-soft)]">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </span>
          <div>
            <h3 className="font-medium">More on GitHub</h3>
            <p className="text-sm text-[color:var(--ink-mute)]">Explore the rest of my work</p>
          </div>
        </Link>
      </Reveal>

      {/* Languages */}
      <Reveal className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">Languages I work with</h2>
        <p className="text-[color:var(--ink-mute)] mt-2">
          The tools I reach for, from time to time.
        </p>
      </Reveal>
      <Reveal stagger className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-16">
        {languages.map((item) => (
          <SmallCard key={item.name} item={item} />
        ))}
      </Reveal>
    </main>
  );
}

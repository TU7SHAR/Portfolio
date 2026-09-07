import Link from "next/link";
import Image from "next/image";
import Reveal from "../(components)/Reveal.jsx";

export const metadata = {
  title: "Projects",
  description:
    "Production SaaS products and projects built by Tushar Gautam — RAG chatbots, AI astrology, and more.",
};

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
      "Razorpay signature verification → background PDF generation → email dispatch",
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
];

const projects = [
  { name: "Stoccy", desc: "Stock app using Finnhub + TradingView APIs", img: "/st.png", href: "https://stoccy.vercel.app/", radius: "rounded-xl" },
  { name: "certBuilder", desc: "Certificate generation tool", img: "/cb.png", href: "https://cb-xi.vercel.app/", radius: "rounded-2xl border" },
  { name: "Descripte", desc: "Scripting / description tool", img: "/desc.png", href: "https://descripte.vercel.app/", radius: "" },
  { name: "Contact Form", desc: "Frontend contact form for North", img: "/cfm.png", href: "https://contact-north.vercel.app/", radius: "rounded-xl" },
];

const languages = [
  { name: "C++", desc: "Systems & competitive programming", img: "/c++.png", href: "/Projects/cpp", radius: "rounded-full" },
  { name: "JavaScript", desc: "Lightweight, dynamic language of the web", img: "/javascript.png", href: "/Projects/javascript", radius: "rounded-sm" },
  { name: "TypeScript", desc: "JavaScript with types, at scale", img: "/typescript.png", href: "/Projects/typescript", radius: "rounded-sm" },
  { name: "C", desc: "General-purpose systems language", img: "/C.png", href: "/Projects/c", radius: "rounded-sm" },
];

function SmallCard({ item }) {
  return (
    <Link
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer noopener"
      className="glass-card flex items-center gap-x-4 rounded-xl p-4"
    >
      <Image
        src={item.img}
        alt={item.name}
        width={56}
        height={56}
        className={`${item.radius} object-cover`}
      />
      <div>
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-sm text-zinc-400">{item.desc}</p>
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <main className="content-layer max-w-6xl mx-auto md:px-16 px-6 text-white">
      {/* Header */}
      <Reveal className="max-w-2xl mb-16 mt-4">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-3">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 leading-tight">
          Things I&apos;ve designed, built &amp; shipped
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          From production AI SaaS serving real users to focused frontend tools —
          here&apos;s a look at what I&apos;ve been building.
        </p>
      </Reveal>

      {/* Flagship */}
      <Reveal stagger className="grid lg:grid-cols-2 gap-6 mb-24">
        {flagship.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer noopener"
            className="glass-card group rounded-2xl p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-violet-300">
                {p.tag}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-zinc-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-text w-fit">{p.name}</h2>
            <p className="text-zinc-400 leading-relaxed mb-5">{p.desc}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </Reveal>

      {/* Other projects */}
      <Reveal className="max-w-2xl mb-10">
        <h2 className="text-2xl font-bold sm:text-3xl">More projects</h2>
        <p className="text-zinc-400 mt-2">Smaller apps and experiments along the way.</p>
      </Reveal>
      <Reveal stagger className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-24">
        {projects.map((item) => (
          <SmallCard key={item.name} item={item} />
        ))}
        <Link
          href="https://github.com/TU7SHAR"
          target="_blank"
          rel="noreferrer noopener"
          className="glass-card flex items-center gap-x-4 rounded-xl p-4"
        >
          <Image src="/404.png" alt="More" width={56} height={56} className="rounded-xl object-cover" />
          <div>
            <h3 className="font-semibold mb-1">More on GitHub</h3>
            <p className="text-sm text-zinc-400">Explore the rest of my work →</p>
          </div>
        </Link>
      </Reveal>

      {/* Languages */}
      <Reveal className="max-w-2xl mb-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Languages I work with</h2>
        <p className="text-zinc-400 mt-2">The tools I reach for, from time to time.</p>
      </Reveal>
      <Reveal stagger className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-16">
        {languages.map((item) => (
          <SmallCard key={item.name} item={item} />
        ))}
      </Reveal>
    </main>
  );
}

import Link from "next/link";
import Hero from "./(components)/Hero.jsx";
import TechMarquee from "./(components)/TechMarquee.jsx";
import AboutFooter from "./(components)/AboutFooter.jsx";
import Reveal from "./(components)/Reveal.jsx";

const featured = [
  {
    name: "bubbl.ooo",
    tag: "RAG Chatbot SaaS",
    href: "https://app.bubbl.ooo",
    desc: "Multi-tenant platform where scraped web content is auto-vectorized into Gemini FileSearch stores, letting businesses deploy context-aware AI agents with persistent conversations and lead capture.",
    stack: ["Flask", "Gemini API", "Redis · Celery", "PostgreSQL", "Paddle"],
  },
  {
    name: "bhavishai.in",
    tag: "AI Astrology",
    href: "https://bhavishai.in",
    desc: "Integrates Swiss Ephemeris to compute planetary longitudes & dashas, with a full Razorpay payment-to-delivery pipeline, background PDF generation, and an admin reconciliation dashboard.",
    stack: ["Next.js", "Swiss Ephemeris", "Gemini AI", "Razorpay", "PostgreSQL"],
  },
  {
    name: "salesji.com",
    tag: "AI Telegram Bot Workspace",
    href: "https://app.salesji.com",
    desc: "A workspace for building and managing AI-powered Telegram sales bots — deploy conversational agents that engage leads and automate sales conversations right inside Telegram.",
    stack: ["Telegram Bot API", "AI Agents", "Next.js", "PostgreSQL"],
  },
];

export default function Page() {
  return (
    <main className="text-white">
      <Hero />

      <div className="mt-4 mb-24">
        <TechMarquee />
      </div>

      {/* Featured work */}
      <section className="content-layer max-w-6xl mx-auto lg:px-16 px-6 mb-28">
        <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-3">
              Selected work
            </p>
            <h2 className="font-bold text-3xl sm:text-4xl max-w-xl">
              Production products I&apos;ve shipped
            </h2>
          </div>
          <Link
            href="/Projects"
            className="text-zinc-400 hover:text-violet-300 transition-colors text-base whitespace-nowrap"
          >
            All projects →
          </Link>
        </Reveal>

        <Reveal stagger className="grid md:grid-cols-2 gap-6">
          {featured.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-card group rounded-2xl p-7 flex flex-col"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17 17 7M7 7h10v10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 gradient-text w-fit">
                {p.name}
              </h3>
              <p className="text-zinc-400 leading-relaxed flex-1">{p.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      <AboutFooter />
    </main>
  );
}

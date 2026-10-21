import Link from "next/link";
import Image from "next/image";
import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import Badges from "../(components)/Badges.jsx";
import { pageMetadata, breadcrumbJsonLd } from "../lib/seo.js";
import { flagship, moreProjects, languages, technologies, tools } from "../utils/projects.js";

export const metadata = pageMetadata({
  title: "Projects by Tushar Gautam — AI SaaS, RAG Chatbots & Apps",
  description:
    "Explore projects by Tushar Gautam: makeperfectads.com AI video ads, bhavishai.in AI astrology, bubbl.ooo RAG chatbots, salesji.com Telegram sales bots and more.",
  path: "/projects",
  keywords: [
    "Tushar Gautam projects",
    "AI video ad generator",
    "RAG chatbot SaaS",
    "AI astrology platform",
    "Telegram sales bot",
    "agentic coding",
  ],
});

const ArrowIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
  </svg>
);

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <Reveal className="mb-8 max-w-3xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      {sub && <p className="text-[color:var(--ink-mute)] mt-2 leading-relaxed">{sub}</p>}
    </Reveal>
  );
}

function Logo({ item, size = 52 }) {
  if (item.img) {
    return (
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-md border border-[color:rgba(244,239,230,0.08)] bg-[color:rgba(244,239,230,0.03)]"
        style={{ width: size, height: size }}
      >
        <Image src={item.img} alt={item.alt} width={size} height={size} className="h-full w-full object-contain p-1" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-md border border-[color:rgba(224,160,73,0.4)] font-display text-lg text-[color:var(--amber)]"
      style={{ width: size, height: size }}
    >
      {item.mono}
    </span>
  );
}

function ChipGroups({ groups }) {
  return (
    <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((g) => (
        <div key={g.label} className="card p-6">
          <h3 className="eyebrow mb-4">{g.label}</h3>
          <ul className="flex flex-wrap gap-2">
            {g.items.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </Reveal>
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
          Production AI SaaS — some built during my internship at DrishInfoTech,
          some my own products. I build them as an AI engineer with an agentic,
          AI-assisted workflow, which is how a small team (often just me) ships
          this fast.
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
                <ArrowIcon className="h-6 w-6 text-[color:var(--ink-mute)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--amber)]" />
              </div>
              <Badges ids={p.badges} className="mt-3" />
              <p className="mt-4 max-w-2xl text-[color:var(--ink-soft)] leading-relaxed">{p.desc}</p>
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
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </Reveal>

      {/* More projects (paused) */}
      <SectionHeader
        title="More projects"
        sub="Earlier apps and experiments. These are paused right now while I focus on the products above — the code is still on GitHub."
      />
      <Reveal stagger className="grid md:grid-cols-2 gap-4 mb-24">
        {moreProjects.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer noopener"
            className="card group !flex-row items-start gap-4 p-5"
          >
            <Logo item={p} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-lg text-[color:var(--ink)] group-hover:text-[color:var(--amber)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--ink-mute)]">{p.tag}</p>
                </div>
                <Badges ids={["paused"]} />
              </div>
              <p className="mt-3 text-sm text-[color:var(--ink-soft)] leading-relaxed">{p.desc}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full border border-[color:rgba(244,239,230,0.1)] px-2 py-0.5 text-xs text-[color:var(--ink-mute)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
        <Link
          href="https://github.com/TU7SHAR"
          target="_blank"
          rel="noreferrer noopener"
          className="card group !flex-row items-center gap-4 p-5 md:col-span-2"
        >
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-md border border-[color:rgba(244,239,230,0.12)] text-[color:var(--ink-soft)]">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </span>
          <div className="flex-1">
            <h3 className="font-medium text-lg group-hover:text-[color:var(--amber)] transition-colors">More on GitHub</h3>
            <p className="text-sm text-[color:var(--ink-mute)]">
              50+ repositories — Three.js & GLSL experiments, MCP tools, Python automation and more.
            </p>
          </div>
          <ArrowIcon className="h-5 w-5 text-[color:var(--ink-mute)] group-hover:text-[color:var(--amber)]" />
        </Link>
      </Reveal>

      {/* Languages */}
      <SectionHeader
        eyebrow="Languages"
        title="Languages I work with"
        sub="From product code to algorithms and shaders. Click a language for notes on how I use it."
      />
      <Reveal stagger className="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mb-24">
        {languages.map((l) => {
          const body = (
            <>
              <Logo item={l} size={48} />
              <div className="min-w-0">
                <h3 className="font-medium text-[color:var(--ink)]">{l.name}</h3>
                <p className="text-sm text-[color:var(--ink-mute)] leading-relaxed">{l.desc}</p>
              </div>
            </>
          );
          return l.href ? (
            <Link key={l.name} href={l.href} className="card !flex-row items-center gap-4 p-4">
              {body}
            </Link>
          ) : (
            <div key={l.name} className="card !flex-row items-center gap-4 p-4">
              {body}
            </div>
          );
        })}
      </Reveal>

      {/* Technologies */}
      <SectionHeader
        eyebrow="Stack"
        title="Technologies I've worked with"
        sub="Frameworks, databases, AI services and integrations that power the products above."
      />
      <div className="mb-24">
        <ChipGroups groups={technologies} />
      </div>

      {/* Tools */}
      <SectionHeader
        eyebrow="Workflow"
        title="Tools I work with"
        sub="My day-to-day toolkit — centred on agentic, AI-assisted coding, with the review, testing and deployment tools that keep it production-grade."
      />
      <div className="mb-16">
        <ChipGroups groups={tools} />
      </div>
    </main>
  );
}

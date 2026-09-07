import Image from "next/image";
import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";
import Tilt from "../(components)/Tilt.jsx";

export const metadata = {
  title: "About",
  description:
    "About Tushar Gautam — frontend-focused full-stack developer building AI-powered SaaS with React, Next.js, Flask and Gemini.",
};

const skillGroups = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C++", "C", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "Three.js", "GSAP", "HTML5", "CSS3"],
  },
  {
    label: "Backend",
    items: ["Flask", "Node.js", "REST APIs", "Gunicorn", "Celery", "Systemd / VPS"],
  },
  {
    label: "Databases & Caching",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  },
  {
    label: "AI & Integrations",
    items: [
      "Gemini API",
      "RAG / Vector Search",
      "Prompt Engineering",
      "Swiss Ephemeris",
      "Razorpay",
      "Paddle",
      "Nodemailer",
      "NextAuth",
    ],
  },
  {
    label: "Tools & Practices",
    items: ["Git & GitHub", "Postman", "GitHub Copilot", "Vercel", "DSA (LeetCode / CodeChef)"],
  },
];

export default function Page() {
  return (
    <main className="content-layer max-w-6xl mx-auto px-6 md:px-10">
      <section className="grid lg:grid-cols-[1.35fr_1fr] grid-cols-1 gap-x-14 gap-y-12 items-start mt-4">
        <Reveal className="order-2 lg:order-none">
          <p className="eyebrow mb-5">About me</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.06] mb-8">
            I&apos;m Tushar. I live in Bharat{" "}
            <span className="serif-accent font-deva">(भारत)</span>, where I build
            the <span className="serif-accent">future</span> of the web.
          </h1>

          <div className="flex flex-col gap-y-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
            <p>
              I&apos;m a frontend-focused web developer skilled in{" "}
              <span className="text-[color:var(--ink)]">React.js</span> and{" "}
              <span className="text-[color:var(--ink)]">Next.js</span>, with a
              growing backend footprint in Python Flask and Node. I love building
              interactive, performance-driven applications — and lately, shipping
              real AI products end to end.
            </p>
            <p>
              I&apos;ve engineered a{" "}
              <span className="amber-text">multi-tenant RAG chatbot SaaS</span>{" "}
              (bubbl.ooo), an{" "}
              <span className="amber-text">AI astrology platform</span>{" "}
              (bhavishai.in), and a{" "}
              <span className="amber-text">Telegram sales-bot workspace</span>{" "}
              (salesji.com). I&apos;m currently interning at{" "}
              <span className="text-[color:var(--ink)]">DrishInfoTech</span> while
              building production SaaS independently.
            </p>
            <p>
              Strong foundation in problem-solving and scalable architecture, with
              regular DSA practice on LeetCode &amp; CodeChef. I&apos;m pursuing
              my B.Tech in Computer Science at Rayat Bahra University (expected
              2026).
            </p>
            <p className="text-[color:var(--ink)]">
              If you ever spot me in the wild, don&apos;t hesitate to say hello —
              let&apos;s grab a cup of chai and geek out over the latest in
              front-end, AI, and everything in between.
            </p>
            <p className="font-deva text-[color:var(--ink-soft)]">
              यदि आप कभी मुझे देखें, तो मिलने में हिचकिचाएं नहीं! आइए एक कप चाय
              लेते हैं और नई तकनीकों पर बात करते हैं।
            </p>
          </div>
        </Reveal>

        <Reveal className="w-full lg:sticky lg:top-24">
          <div className="card p-3">
            <Image
              className="rounded-[4px] object-cover w-full max-h-[28rem] min-h-[24rem]"
              src="/Tushar.jpg"
              alt="Tushar Gautam"
              width={400}
              height={400}
              quality={100}
            />
          </div>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-amber mt-4 flex items-center justify-center gap-x-2 py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download résumé
          </a>

          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="mailto:gautams4work@gmail.com?subject=Redirected%20From%20Portfolio"
                className="flex items-center gap-x-3 text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                gautams4work@gmail.com
              </Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/in/tushar-gautam-73a678314/" target="_blank" rel="noreferrer noopener" className="flex items-center gap-x-3 text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors">
                <span className="w-5 text-center text-sm">in</span> LinkedIn
              </Link>
            </li>
            <li>
              <Link href="https://github.com/TU7SHAR" target="_blank" rel="noreferrer noopener" className="flex items-center gap-x-3 text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" /></svg>
                GitHub
              </Link>
            </li>
          </ul>
        </Reveal>
      </section>

      {/* Skills */}
      <Reveal className="mt-28">
        <p className="eyebrow mb-4">Toolbox</p>
        <h2 className="font-display text-4xl sm:text-5xl mb-4">
          Skills &amp; expertise
        </h2>
        <p className="text-lg text-[color:var(--ink-soft)] max-w-xl">
          The technologies I reach for to design, build, and ship
          production-grade products — from pixel-perfect frontends to AI-powered
          backends.
        </p>
      </Reveal>

      <Reveal stagger className="mt-10 grid sm:grid-cols-2 gap-4">
        {skillGroups.map((group) => (
          <Tilt key={group.label} max={6}>
            <div className="card p-6 h-full">
              <h3 className="eyebrow mb-4">{group.label}</h3>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Tilt>
        ))}
      </Reveal>

      <div className="h-24" />
    </main>
  );
}

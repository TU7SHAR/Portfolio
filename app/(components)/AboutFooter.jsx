import Reveal from "./Reveal.jsx";

const timeline = [
  {
    title: "B.Tech · Computer Science & Engineering",
    org: "Rayat Bahra University, Mohali",
    period: "2022 — Expected Jul 2026 · CGPA 8.0",
    color: "#54EFB8",
    note: "Core CS foundations, DSA (LeetCode / CodeChef), and building production SaaS on the side.",
    done: false,
  },
  {
    title: "Full-Stack & AI Development",
    org: "Self-driven + Internship",
    period: "2023 — Present",
    color: "#8b27da",
    note: "Shipped multi-tenant RAG chatbots and an AI astrology platform. Currently interning at DrishInfoTech.",
    done: true,
  },
  {
    title: "Foundations in Programming",
    org: "C, C++ & Web Fundamentals",
    period: "2021 — 2022",
    color: "#77CCFD",
    note: "Picked up systems thinking with C/C++ and the fundamentals of the modern web.",
    done: true,
  },
  {
    title: "CBSE Schooling",
    org: "Higher Secondary",
    period: "2020",
    color: "#FF916B",
    note: "Set goals ridiculously high — and kept climbing toward them.",
    done: true,
  },
];

export default function AboutFooter() {
  return (
    <section className="content-layer max-w-3xl mx-auto lg:px-16 px-6 mt-32">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-3">
          The journey
        </p>
        <h2 className="font-bold text-3xl sm:text-4xl mb-12">
          Education &amp; Experience
        </h2>
      </Reveal>

      <Reveal stagger className="relative">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="relative flex items-start gap-x-6 pb-12 last:pb-0"
          >
            {/* connector line */}
            {i !== timeline.length - 1 && (
              <span className="absolute left-[11px] top-7 h-full w-px bg-gradient-to-b from-white/20 to-transparent" />
            )}
            {/* node */}
            <span
              className="mt-1.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: item.color }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
            </span>

            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-zinc-300">{item.org}</p>
              <small className="mt-1 text-xs tracking-widest uppercase text-zinc-500">
                {item.period}
              </small>
              <p className="mt-3 text-zinc-400 max-w-xl">{item.note}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

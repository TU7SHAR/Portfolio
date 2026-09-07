import Reveal from "./Reveal.jsx";

const timeline = [
  {
    year: "2022—26",
    title: "B.Tech · Computer Science & Engineering",
    org: "Rayat Bahra University, Mohali · CGPA 8.0",
    note: "Core CS foundations, DSA (LeetCode / CodeChef), and building production SaaS on the side.",
  },
  {
    year: "2023—",
    title: "Full-Stack & AI Development",
    org: "Self-driven · Interning at DrishInfoTech",
    note: "Shipped multi-tenant RAG chatbots, an AI astrology platform, and Telegram sales agents.",
  },
  {
    year: "2021—22",
    title: "Foundations in Programming",
    org: "C, C++ & Web Fundamentals",
    note: "Picked up systems thinking with C/C++ and the fundamentals of the modern web.",
  },
  {
    year: "2020",
    title: "CBSE Schooling",
    org: "Higher Secondary",
    note: "Set goals ridiculously high — and kept climbing toward them.",
  },
];

export default function AboutFooter() {
  return (
    <section className="content-layer max-w-6xl mx-auto px-6 md:px-10 mt-32 mb-8">
      <Reveal>
        <p className="eyebrow mb-4">The journey</p>
        <h2 className="font-display text-4xl sm:text-5xl mb-4">
          Education &amp; experience
        </h2>
      </Reveal>

      <div className="rule mb-2" />

      <Reveal stagger>
        {timeline.map((item, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[9rem_1fr] gap-x-8 gap-y-2 border-b border-[color:rgba(244,239,230,0.08)] py-8"
          >
            <span className="font-display text-xl text-[color:var(--amber)]">
              {item.year}
            </span>
            <div>
              <h3 className="text-xl text-[color:var(--ink)]">{item.title}</h3>
              <p className="text-[color:var(--ink-soft)] mt-0.5">{item.org}</p>
              <p className="mt-3 max-w-xl text-[color:var(--ink-mute)]">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

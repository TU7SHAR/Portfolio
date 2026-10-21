import Reveal from "./Reveal.jsx";

const steps = [
  {
    n: "01",
    title: "Spec & architecture",
    text: "I define the product, data model and system design first — the decisions that make or break a product stay with me.",
  },
  {
    n: "02",
    title: "Agents build in parallel",
    text: "Agentic coding tools draft features, tests and migrations from that spec, so routine code gets written in hours instead of days.",
  },
  {
    n: "03",
    title: "Review, test & ship",
    text: "I review every diff, test the edge cases, then deploy and monitor. AI speeds up the typing; the engineering judgement is still mine.",
  },
];

export default function HowIBuild() {
  return (
    <section className="content-layer max-w-6xl mx-auto px-6 md:px-10 mb-28">
      <Reveal className="max-w-3xl mb-10">
        <p className="eyebrow mb-4">How I build</p>
        <h2 className="font-display text-4xl sm:text-5xl mb-5">
          AI engineer, <span className="serif-accent">agentic workflow.</span>
        </h2>
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          I build with agentic, AI-assisted development: AI agents handle the
          repetitive implementation while I own the architecture, review and
          quality. It&apos;s how I ship production SaaS faster without cutting corners.
        </p>
      </Reveal>
      <Reveal stagger className="grid md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.n} className="card p-6 flex flex-col">
            <span className="font-display text-2xl text-[color:var(--amber)]">{s.n}</span>
            <h3 className="mt-3 text-xl text-[color:var(--ink)]">{s.title}</h3>
            <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed">{s.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

"use client";

const tech = [
  "React.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Three.js",
  "GSAP",
  "Tailwind CSS",
  "Python",
  "Flask",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis · Celery",
  "Gemini API",
  "RAG",
  "REST APIs",
  "C++",
  "Git",
];

export default function TechMarquee() {
  const row = [...tech, ...tech];
  return (
    <div className="relative overflow-hidden border-y border-[color:rgba(244,239,230,0.08)] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0c0b09] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0c0b09] to-transparent z-10" />
      <div className="flex w-max animate-[marquee_36s_linear_infinite] items-center gap-8 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-display text-lg text-[color:var(--ink-soft)]">
              {t}
            </span>
            <span className="h-1 w-1 rounded-full bg-[color:var(--amber)]/70" />
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

const tech = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Three.js",
  "GSAP",
  "Tailwind CSS",
  "Python",
  "Flask",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "Redis · Celery",
  "Gemini API",
  "C++",
];

export default function TechMarquee() {
  const row = [...tech, ...tech];
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/5 bg-white/[0.02]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#08080b] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08080b] to-transparent z-10" />
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-zinc-300"
          >
            {t}
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

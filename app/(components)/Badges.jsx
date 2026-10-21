import { BADGES } from "../utils/projects.js";

const TONES = {
  live: "border-[color:var(--amber)] bg-[rgba(224,160,73,0.14)] text-[color:var(--amber-bright)]",
  outline: "border-[color:rgba(244,239,230,0.22)] text-[color:var(--ink-soft)]",
  org: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  muted: "border-[color:rgba(244,239,230,0.14)] bg-[color:rgba(244,239,230,0.04)] text-[color:var(--ink-mute)]",
};

export default function Badges({ ids = [], className = "" }) {
  if (!ids.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Project status">
      {ids.map((id) => {
        const b = BADGES[id];
        return (
          <li
            key={id}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] ${TONES[b.tone]}`}
          >
            {b.tone === "live" && (
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--amber)] opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--amber)]" />
              </span>
            )}
            {b.label}
          </li>
        );
      })}
    </ul>
  );
}

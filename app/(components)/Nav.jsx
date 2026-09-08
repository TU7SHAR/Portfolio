import Link from "next/link";

const links = [
  { href: "/About", label: "About" },
  { href: "/Projects", label: "Work" },
  { href: "/ContactMe", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-[color:rgba(244,239,230,0.08)] bg-[#0c0b09]/80 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[color:var(--amber)]/60 font-display text-sm text-[color:var(--amber)]">
              T
            </span>
            <span className="font-display text-lg whitespace-nowrap group-hover:text-[color:var(--amber)] transition-colors">
              Tushar Gautam
            </span>
          </Link>

          <div className="flex items-center gap-5 sm:gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm tracking-wide text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              download="Tushar-Gautam-Resume.pdf"
              className="btn-ghost hidden sm:inline-flex items-center px-4 py-1.5 text-sm"
            >
              Résumé
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

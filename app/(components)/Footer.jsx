import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/TU7SHAR" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tushar-gautam-73a678314/",
  },
  { label: "Email", href: "mailto:gautams4work@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="content-layer relative mt-24 border-t border-[color:rgba(244,239,230,0.08)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="font-display text-3xl">
              Let&apos;s build something{" "}
              <span className="serif-accent">worth shipping.</span>
            </p>
            <Link
              href="/ContactMe"
              className="btn-amber mt-6 inline-flex items-center gap-2 px-6 py-3"
            >
              Start a conversation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          <div className="md:text-right">
            <p className="eyebrow mb-4">Elsewhere</p>
            <ul className="flex flex-col gap-2 md:items-end">
              {socials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[color:var(--ink-mute)]">
            &copy; {new Date().getFullYear()} Tushar Gautam — Full-Stack &amp; AI
            Engineer, Bharat.
          </p>
          <p className="text-xs text-[color:var(--ink-mute)] font-mono">
            Built with Next.js · GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}

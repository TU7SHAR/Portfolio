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
    <footer className="relative mt-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto md:px-16 px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-semibold gradient-text text-lg">Tushar Gautam</p>
            <p className="text-sm text-zinc-500 mt-1">
              Full-Stack &amp; AI Product Engineer · Bharat 🇮🇳
            </p>
          </div>

          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="text-sm text-zinc-400 hover:text-violet-300 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hairline my-8" />

        <p className="text-center text-xs text-zinc-600 font-mono">
          &copy; {new Date().getFullYear()} Tushar Gautam · Built with Next.js,
          Three.js &amp; GSAP
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/About", label: "About" },
  { href: "/Projects", label: "Projects" },
  { href: "/ContactMe", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-white/5 bg-[#08080b]/70 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto flex items-center justify-between md:px-16 px-5 py-4">
          <Link href="/" className="flex items-center group shrink-0">
            <Image src="/logo.png" width={26} height={26} alt="logo" />
            <span className="ml-2 font-semibold gradient-text whitespace-nowrap">
              Tushar Gautam
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-base text-zinc-400 hover:text-white transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-200 hover:border-violet-400/60 hover:text-white transition-colors"
            >
              Resume
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

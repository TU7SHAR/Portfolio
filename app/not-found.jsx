import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: { absolute: "Page Not Found (404) — Tushar Gautam, Full-Stack Developer" },
  description: "The page you are looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main className="content-layer max-w-4xl mx-auto px-6 md:px-10 py-10 grid md:grid-cols-[1fr_auto] gap-12 items-center">
      <div>
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.04] mb-6">
          Lost in <span className="serif-accent">space.</span>
        </h1>
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist, or it has moved. Try one of these instead:
        </p>
        <ul className="flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={l.href === "/" ? "btn-amber inline-flex px-5 py-2.5" : "btn-ghost inline-flex px-5 py-2.5"}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Image
        src="/404.png"
        alt="Illustration of an astronaut floating beside a rocket and a large 404 sign in outer space"
        width={340}
        height={324}
        priority
        className="mx-auto"
      />
    </main>
  );
}

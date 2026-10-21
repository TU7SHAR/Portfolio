import Image from "next/image";
import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import { breadcrumbJsonLd } from "../lib/seo.js";

/**
 * Shared layout for /projects/{c,cpp,javascript,typescript}.
 * H1 = language, H2 = sections, H3 = items inside a section.
 */
export default function LanguagePage({ lang }) {
  return (
    <main className="content-layer max-w-3xl mx-auto px-6 md:px-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: lang.name, path: `/projects/${lang.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[color:var(--ink-mute)]">
        <Link href="/" className="hover:text-[color:var(--amber)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/projects" className="hover:text-[color:var(--amber)]">Projects</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-[color:var(--ink-soft)]">{lang.name}</span>
      </nav>

      <Reveal className="flex items-center gap-6 mb-10">
        <Image
          src={lang.img}
          alt={lang.alt}
          width={88}
          height={88}
          priority
          className="rounded-md object-contain"
        />
        <div>
          <p className="eyebrow mb-3">Language notes</p>
          <h1 className="font-display text-4xl sm:text-5xl">{lang.h1}</h1>
        </div>
      </Reveal>

      <div className="flex flex-col gap-12 text-[color:var(--ink-soft)] leading-7 text-lg">
        <p>{lang.intro}</p>

        {lang.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-3xl text-[color:var(--ink)] mb-4">{s.heading}</h2>
            {s.text && <p>{s.text}</p>}
            {s.items && (
              <div className="mt-6 grid gap-4">
                {s.items.map((item) => (
                  <div key={item.title} className="card p-5">
                    <h3 className="font-medium text-[color:var(--ink)] mb-1">{item.title}</h3>
                    <p className="text-base">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <section>
          <h2 className="font-display text-3xl text-[color:var(--ink)] mb-4">Learn more</h2>
          <p>
            The official reference is the best place to go deeper:{" "}
            <a
              href={lang.reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--amber)] underline underline-offset-4"
            >
              {lang.reference.label}
            </a>
            . Or see what I&apos;ve built on the{" "}
            <Link href="/projects" className="text-[color:var(--amber)] underline underline-offset-4">
              projects page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

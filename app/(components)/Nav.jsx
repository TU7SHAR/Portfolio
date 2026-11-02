"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape, and close if the viewport grows to desktop width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-[color:rgba(244,239,230,0.08)] bg-[#0c0b09]/80 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-6 md:px-10 py-4">
          <Link href="/" className="flex items-center gap-2 min-w-0 group">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[color:var(--amber)]/60 font-display text-sm text-[color:var(--amber)]">
              T
            </span>
            <span className="font-display text-lg whitespace-nowrap truncate group-hover:text-[color:var(--amber)] transition-colors">
              Tushar Gautam
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-colors hover:text-[color:var(--amber)] ${
                  pathname?.startsWith(l.href)
                    ? "text-[color:var(--amber)]"
                    : "text-[color:var(--ink-soft)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              download="Tushar-Gautam-Resume.pdf"
              className="btn-ghost inline-flex items-center px-4 py-1.5 text-sm"
            >
              Résumé
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:rgba(244,239,230,0.12)] text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-nav"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col px-5 sm:px-6 pb-5 pt-1 border-t border-[color:rgba(244,239,230,0.06)]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                className={`py-3 text-[15px] tracking-wide border-b border-[color:rgba(244,239,230,0.06)] transition-colors hover:text-[color:var(--amber)] ${
                  pathname?.startsWith(l.href)
                    ? "text-[color:var(--amber)]"
                    : "text-[color:var(--ink-soft)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              download="Tushar-Gautam-Resume.pdf"
              tabIndex={open ? 0 : -1}
              className="btn-ghost mt-4 inline-flex justify-center items-center px-4 py-2.5 text-sm"
            >
              Résumé
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

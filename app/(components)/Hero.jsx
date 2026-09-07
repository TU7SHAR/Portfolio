"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const socials = [
  { label: "GitHub", href: "https://github.com/TU7SHAR" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tushar-gautam-73a678314/",
  },
  {
    label: "Email",
    href: "mailto:gautams4work@gmail.com?subject=Redirected%20From%20Portfolio",
  },
];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });
      tl.from(".h-eyebrow", { y: 16, opacity: 0, duration: 0.7 })
        .from(".h-line", { yPercent: 110, opacity: 0, stagger: 0.12 }, "-=0.3")
        .from(".h-sub", { y: 20, opacity: 0 }, "-=0.6")
        .from(".h-cta > *", { y: 16, opacity: 0, stagger: 0.1 }, "-=0.5")
        .from(".h-meta", { opacity: 0, stagger: 0.08 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="content-layer relative mx-auto max-w-6xl px-6 md:px-10 pt-24 md:pt-32 pb-20"
    >
      <p className="h-eyebrow eyebrow mb-8">
        Tushar Gautam — Portfolio, 2026
      </p>

      <h1 className="font-display text-[3.2rem] leading-[0.98] sm:text-7xl lg:text-[6.4rem] tracking-tight">
        <span className="block overflow-hidden">
          <span className="h-line block">Full-Stack engineer</span>
        </span>
        <span className="block overflow-hidden">
          <span className="h-line block">
            crafting <span className="serif-accent">AI-native</span>
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="h-line block">products.</span>
        </span>
      </h1>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <p className="h-sub max-w-xl text-lg leading-relaxed text-[color:var(--ink-soft)]">
          I&apos;m a frontend-focused developer building performance-driven web
          apps with <span className="text-[color:var(--ink)]">React</span> &amp;{" "}
          <span className="text-[color:var(--ink)]">Next.js</span> — and shipping
          production AI SaaS end to end: multi-tenant RAG chatbots, an AI
          astrology platform, and Telegram sales agents.
        </p>

        <div className="h-cta flex flex-wrap items-center gap-3 md:justify-end">
          <Link
            href="/Projects"
            className="btn-amber inline-flex items-center gap-2 px-6 py-3"
          >
            View work
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
          <Link
            href="/ContactMe"
            className="btn-ghost inline-flex items-center px-6 py-3"
          >
            Get in touch
          </Link>
        </div>
      </div>

      <div className="rule mt-16" />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="h-meta text-sm text-[color:var(--ink-mute)]">
          Available for work · Interning @ DrishInfoTech · Kharar, Punjab
        </p>
        <ul className="flex items-center gap-6">
          {socials.map((s) => (
            <li key={s.label} className="h-meta">
              <Link
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

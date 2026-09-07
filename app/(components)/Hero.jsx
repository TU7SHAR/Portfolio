"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroCanvas from "./three/HeroCanvas.jsx";
import Magnetic from "./Magnetic.jsx";

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

// split into per-character spans for the reveal, but keep whole words
// together (each word is an inline-block group so it never breaks mid-word)
function Chars({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span key={ci} className="char">
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="char">{"\u00A0"}</span>}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      tl.from(".h-eyebrow", { y: 16, opacity: 0, duration: 0.7 })
        .from(
          ".char",
          {
            yPercent: 120,
            opacity: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.018,
          },
          "-=0.3"
        )
        .from(".h-sub", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7")
        .from(".h-cta > *", { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
        .from(".h-meta", { opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* full-bleed 3D backdrop */}
      <HeroCanvas />

      {/* readability scrim on the text side */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0c0b09] via-[#0c0b09]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-[#0c0b09] to-transparent" />

      <div className="content-layer relative mx-auto w-full max-w-6xl px-6 md:px-10 py-24">
        <p className="h-eyebrow eyebrow mb-8">Tushar Gautam — Portfolio, 2026</p>

        <h1 className="font-display text-[2.5rem] leading-[1.0] sm:text-7xl lg:text-[6.2rem] tracking-tight max-w-4xl [hyphens:none] [overflow-wrap:normal]">
          <span className="block overflow-hidden py-[0.05em]">
            <Chars text="Full-Stack engineer" className="block" />
          </span>
          <span className="block overflow-hidden py-[0.05em]">
            <span className="block">
              <Chars text="crafting " />
              <span className="serif-accent">
                <Chars text="AI-native" />
              </span>
            </span>
          </span>
          <span className="block overflow-hidden py-[0.05em]">
            <Chars text="products." className="block" />
          </span>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end">
          <p className="h-sub max-w-xl text-lg leading-relaxed text-[color:var(--ink-soft)]">
            I&apos;m a frontend-focused developer building performance-driven web
            apps with <span className="text-[color:var(--ink)]">React</span> &amp;{" "}
            <span className="text-[color:var(--ink)]">Next.js</span> — and shipping
            production AI SaaS end to end: multi-tenant RAG chatbots, an AI
            astrology platform, and Telegram sales agents.
          </p>

          <div className="h-cta flex flex-wrap items-center gap-3 md:justify-end">
            <Magnetic>
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
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link
                href="/ContactMe"
                className="btn-ghost inline-flex items-center px-6 py-3"
              >
                Get in touch
              </Link>
            </Magnetic>
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
      </div>
    </section>
  );
}

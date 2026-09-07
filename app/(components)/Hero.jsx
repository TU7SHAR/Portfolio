"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ShaderCanvas from "./ShaderCanvas.jsx";

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
        defaults: { ease: "power3.out", duration: 0.9 },
      });
      tl.from(".hero-badge", { y: 20, opacity: 0 })
        .from(".hero-line", { y: 40, opacity: 0, stagger: 0.12 }, "-=0.4")
        .from(".hero-sub", { y: 24, opacity: 0 }, "-=0.5")
        .from(".hero-cta > *", { y: 18, opacity: 0, stagger: 0.08 }, "-=0.4")
        .from(".hero-social", { y: 14, opacity: 0, stagger: 0.06 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <ShaderCanvas />

      {/* soft top/bottom fades to blend the shader into the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#08080b] to-transparent z-[1]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08080b] to-transparent z-[1]" />

      <div className="content-layer w-full max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for work · Interning @ DrishInfoTech
        </span>

        <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <span className="hero-line block">Full-Stack &amp; AI</span>
          <span className="hero-line block gradient-text text-glow">
            Product Engineer
          </span>
        </h1>

        <p className="hero-sub mt-7 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          I&apos;m <span className="text-white font-medium">Tushar Gautam</span>{" "}
          — a frontend-focused developer building performance-driven web apps
          with <span className="text-violet-300">React</span> &amp;{" "}
          <span className="text-violet-300">Next.js</span>, and shipping
          production AI products: multi-tenant RAG chatbots and an AI astrology
          platform powered by Gemini &amp; Swiss Ephemeris.
        </p>

        <div className="hero-cta mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/Projects"
            className="glow-btn inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-[1.03]"
          >
            View my work
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
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3 font-medium text-zinc-200 backdrop-blur-sm transition-colors hover:border-violet-400/60 hover:text-white"
          >
            Get in touch
          </Link>
        </div>

        <ul className="mt-10 flex items-center justify-center gap-x-8 text-base">
          {socials.map((s) => (
            <li key={s.label} className="hero-social">
              <Link
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="text-zinc-400 hover:text-violet-300 transition-colors duration-300"
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

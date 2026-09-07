"use client";

import { useEffect, useRef } from "react";

/**
 * Fail-safe scroll reveal.
 *
 * Content is ALWAYS rendered visible by default (no opacity:0 in the base
 * state that could get stuck). We only *enhance* with a rise+fade when the
 * element scrolls into view, via IntersectionObserver + a CSS class.
 * If JS fails or the observer never fires, content simply shows normally.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = stagger ? Array.from(el.children) : [el];

    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((t) => t.classList.add("reveal-in"));
      return;
    }

    // set the pre-animation state now (JS is confirmed running)
    targets.forEach((t, i) => {
      t.classList.add("reveal");
      t.style.transitionDelay = `${delay + (stagger ? i * 0.09 : 0)}s`;
    });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((t) => io.observe(t));

    // safety net: if anything is still hidden after 1.2s, force it visible
    const safety = setTimeout(() => {
      targets.forEach((t) => t.classList.add("reveal-in"));
    }, 1200);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

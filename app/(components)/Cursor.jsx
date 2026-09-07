"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a crisp dot that tracks 1:1 and a ring that trails with
 * easing. The ring grows when hovering interactive elements. Disabled on
 * touch devices via CSS.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(max-width: 820px)").matches) return;

    const dotEl = dot.current;
    const ringEl = ring.current;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringEl.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };

    const hoverOn = () => ringEl.classList.add("is-hover");
    const hoverOff = () => ringEl.classList.remove("is-hover");

    const bindHovers = () => {
      document
        .querySelectorAll('a, button, [role="button"], input, textarea, .card')
        .forEach((el) => {
          el.addEventListener("mouseenter", hoverOn);
          el.addEventListener("mouseleave", hoverOff);
        });
    };

    window.addEventListener("pointermove", onMove);
    loop();
    bindHovers();
    // rebind after route changes / dynamic content
    const mo = new MutationObserver(() => bindHovers());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

"use client";

import { useRef } from "react";

/**
 * Subtle 3D tilt + amber glare that follows the cursor. Adds depth on hover
 * without heavy libs. Respects reduced-motion by simply doing nothing.
 */
export default function Tilt({ children, className = "", max = 8 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el)
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt ${className}`}
      style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}

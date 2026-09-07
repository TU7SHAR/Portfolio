"use client";

import { useRef } from "react";

/**
 * Wraps a child and pulls it toward the cursor on hover (magnetic effect).
 * Purely transform-based; resets smoothly on leave.
 */
export default function Magnetic({ children, strength = 0.4, className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}

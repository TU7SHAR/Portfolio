"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The whole 3D scene is client-only + lazy so it never blocks first paint
// and never runs on the server.
const Scene = dynamic(() => import("./Scene.jsx"), {
  ssr: false,
  loading: () => null,
});

function canRun3D() {
  if (typeof window === "undefined") return false;
  // respect reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // skip on small / touch-first devices to keep it buttery
  if (window.matchMedia("(max-width: 820px)").matches) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    return false;
  // confirm WebGL is actually available
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl");
    return !!gl;
  } catch (e) {
    return false;
  }
}

export default function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(canRun3D());
  }, []);

  return (
    <div className="hero-canvas" aria-hidden="true">
      {/* CSS fallback orb — only shown when the real 3D is NOT running
          (mobile / reduced-motion / no-WebGL). Hidden once GL mounts so the
          two never stack. */}
      {!enabled && <div className="hero-orb-fallback" />}
      {enabled && (
        <div className="hero-canvas-gl">
          <Scene />
        </div>
      )}
    </div>
  );
}

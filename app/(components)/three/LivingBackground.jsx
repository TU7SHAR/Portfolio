"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BackgroundFX = dynamic(() => import("./BackgroundFX.jsx"), {
  ssr: false,
  loading: () => null,
});

function canRun() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // this is a single fullscreen plane — cheap enough for most phones, but
  // bail on very low-core devices to stay smooth
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 3)
    return false;
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

export default function LivingBackground() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setEnabled(canRun());
    // pause rendering when the tab is hidden to save the GPU/battery
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!enabled) return null;

  return (
    <div className={`living-bg ${visible ? "" : "is-paused"}`} aria-hidden="true">
      {visible && <BackgroundFX />}
    </div>
  );
}

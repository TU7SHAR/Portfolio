"use client";

import dynamic from "next/dynamic";

// WebGL cannot render on the server, so load the Canvas client-side only.
// The CSS gradient below shows instantly and remains as a graceful fallback
// on devices without WebGL / with reduced-motion preferences.
const ShaderBackground = dynamic(() => import("./ShaderBackground.jsx"), {
  ssr: false,
  loading: () => <div className="shader-fallback" aria-hidden="true" />,
});

export default function ShaderCanvas({ className = "" }) {
  return (
    <>
      {/* static gradient painted immediately, sits under the live canvas */}
      <div className="shader-fallback" aria-hidden="true" />
      <ShaderBackground className={className} />
    </>
  );
}

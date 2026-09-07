"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Blob from "./Blob.jsx";
import Particles from "./Particles.jsx";

export default function Scene() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const max = window.innerHeight;
      scroll.current = Math.min(1, window.scrollY / max);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 4]} intensity={40} color="#ffd9a0" />
      <pointLight position={[-5, -3, 2]} intensity={20} color="#b87a2e" />

      <Suspense fallback={null}>
        {/* pushed to the right so it never fights the headline */}
        <group position={[1.35, 0.1, 0]}>
          <Blob pointer={pointer} scroll={scroll} />
        </group>
        <Particles pointer={pointer} />
      </Suspense>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0007, 0.0009]}
        />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

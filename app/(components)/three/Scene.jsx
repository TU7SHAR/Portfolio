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
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Crystal from "./Crystal.jsx";
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
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 5, 4]} intensity={45} color="#ffd9a0" />
      <pointLight position={[-5, -3, 2]} intensity={22} color="#b87a2e" />
      <spotLight position={[0, 6, 3]} angle={0.5} intensity={30} color="#fff2dc" />

      <Suspense fallback={null}>
        {/* studio-style lightformers give the glass rich edge reflections */}
        <Environment resolution={256}>
          <group rotation={[0, 0, 0]}>
            <Lightformer intensity={3} position={[3, 3, 3]} scale={[4, 4, 1]} color="#ffd9a0" />
            <Lightformer intensity={2} position={[-4, 1, 2]} scale={[3, 3, 1]} color="#b87a2e" />
            <Lightformer intensity={1.5} position={[0, -4, 2]} scale={[6, 2, 1]} color="#ffe6be" />
          </group>
        </Environment>

        {/* pushed far right + slightly back so it never fights the headline */}
        <group position={[1.9, 0.35, -0.4]} scale={0.92}>
          <Crystal pointer={pointer} scroll={scroll} />
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
          offset={[0.0004, 0.0005]}
        />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

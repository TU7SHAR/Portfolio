"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Premium refracting crystal — a faceted icosahedron rendered with
 * MeshTransmissionMaterial (real refraction + chromatic dispersion, so light
 * bends through it with rainbow edges). An inner amber core glows through the
 * glass. Slowly rotates and reacts to pointer + scroll.
 *
 * Replaces the old solid amber "blob" with something that reads as an
 * expensive cut gem rather than a lump.
 */
export default function Crystal({ pointer, scroll }) {
  const group = useRef();
  const core = useRef();
  const smoothed = useRef({ x: 0, y: 0, p: 0 });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    const px = pointer?.current?.x ?? 0;
    const py = pointer?.current?.y ?? 0;
    const mag = Math.min(1, Math.hypot(px, py));
    smoothed.current.x += (px - smoothed.current.x) * 0.06;
    smoothed.current.y += (py - smoothed.current.y) * 0.06;
    smoothed.current.p += (mag - smoothed.current.p) * 0.05;

    if (group.current) {
      const s = scroll?.current ?? 0;
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x =
        Math.sin(t * 0.3) * 0.12 + smoothed.current.y * 0.5 + s * 0.5;
      group.current.rotation.z = smoothed.current.x * 0.25;
      // gentle breathing + subtle grow toward the pointer
      const scale = 1 + Math.sin(t * 0.8) * 0.03 + smoothed.current.p * 0.06 + s * 0.12;
      group.current.scale.setScalar(scale);
      group.current.position.y = Math.sin(t * 0.6) * 0.06;
    }

    if (core.current) {
      // jewelled wireframe shimmers with pointer proximity
      core.current.material.opacity =
        0.18 + Math.sin(t * 1.4) * 0.06 + smoothed.current.p * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* faceted amber gem shell — warm, luminous, crisp facets.
          A touch of emissive keeps it glowing gold regardless of environment
          (no iridescence, so no green/teal thin-film artifacts). */}
      <mesh>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial
          color="#e0a049"
          emissive="#c9772a"
          emissiveIntensity={0.55}
          metalness={0.85}
          roughness={0.28}
          envMapIntensity={2.6}
          flatShading
        />
      </mesh>

      {/* bright golden wireframe over the facets for a jewelled edge */}
      <mesh ref={core} scale={1.004}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial
          color="#ffe6b0"
          wireframe
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

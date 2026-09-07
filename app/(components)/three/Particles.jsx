"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating amber dust — additive points drifting in 3D space to give the
 * hero real depth around the blob. Soft round sprite via a canvas texture.
 */
export default function Particles({ count = 260, pointer }) {
  const points = useRef();

  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,220,160,1)");
    g.addColorStop(0.4, "rgba(224,160,73,0.5)");
    g.addColorStop(1, "rgba(224,160,73,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 3.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.1 + Math.random() * 0.5;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    const arr = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * delta * 0.06;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y += delta * 0.02;
    const px = pointer?.current?.x ?? 0;
    points.current.rotation.z += (px * 0.1 - points.current.rotation.z) * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={sprite}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

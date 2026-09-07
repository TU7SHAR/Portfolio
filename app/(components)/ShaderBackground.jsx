"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Full-screen animated GLSL shader plane.
 * Flowing fBm noise blended across an indigo -> violet -> magenta palette,
 * with a soft aurora sweep and a subtle vignette. Reacts gently to the pointer.
 */

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  varying vec2 vUv;

  // --- hash + value noise -------------------------------------------------
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  // fractional brownian motion
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.55;
    float freq = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    // keep aspect so the field never looks stretched
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.06;

    // domain-warped fbm for that liquid, flowing quality
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) - 0.12 * t)
    );
    float f = fbm(p + 4.0 * r);

    // pointer-driven gentle displacement
    vec2 m = (uMouse - 0.5);
    f += 0.08 * sin(uTime * 0.3 + m.x * 3.0) * length(uv - (uMouse));

    // --- palette (deep space -> indigo -> violet -> magenta) ------------
    vec3 c0 = vec3(0.043, 0.043, 0.055); // #0b0b0e near-black base
    vec3 c1 = vec3(0.176, 0.106, 0.435); // #2d1b6f indigo
    vec3 c2 = vec3(0.545, 0.153, 0.855); // #8b27da violet
    vec3 c3 = vec3(0.937, 0.263, 0.639); // #ef43a3 magenta

    float n = clamp(f * 1.15 + 0.35, 0.0, 1.0);

    vec3 col = mix(c0, c1, smoothstep(0.0, 0.45, n));
    col = mix(col, c2, smoothstep(0.35, 0.75, n));
    col = mix(col, c3, smoothstep(0.72, 1.0, n));

    // aurora highlight sweep
    float sweep = smoothstep(0.55, 1.0, f + 0.35 * sin(uv.y * 3.0 + uTime * 0.25));
    col += vec3(0.35, 0.12, 0.45) * sweep * 0.35;

    // vignette so content stays readable
    float d = distance(uv, vec2(0.5));
    col *= smoothstep(1.05, 0.25, d);

    // subtle film grain to avoid banding
    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233)) + uTime) * 43758.5453) - 0.5) * 0.025;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function ShaderPlane() {
  const materialRef = useRef();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.getElapsedTime();
    u.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
    // ease the pointer for buttery motion
    const pointer = state.pointer;
    mouse.current.x += (pointer.x * 0.5 + 0.5 - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y * 0.5 + 0.5 - mouse.current.y) * 0.05;
    u.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh>
      {/* full-screen triangle/quad in clip space */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground({ className = "" }) {
  return (
    <div
      className={`shader-canvas-wrap ${className}`}
      aria-hidden="true"
    >
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ShaderPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}

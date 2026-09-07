"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Persistent, full-page living background.
 * A fixed full-screen plane running a custom GLSL fragment shader:
 * domain-warped fbm noise painted across a warm charcoal -> amber palette,
 * producing slow flowing "aurora / liquid smoke" that drifts forever and
 * responds gently to the pointer. Deliberately low-contrast so content stays
 * readable, and it sits behind everything (z-index below the content layer).
 */

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uScroll;

  varying vec2 vUv;

  // hash / value noise
  vec2 hash2(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(
      mix(dot(hash2(i+vec2(0.0,0.0)), f-vec2(0.0,0.0)),
          dot(hash2(i+vec2(1.0,0.0)), f-vec2(1.0,0.0)), u.x),
      mix(dot(hash2(i+vec2(0.0,1.0)), f-vec2(0.0,1.0)),
          dot(hash2(i+vec2(1.0,1.0)), f-vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.55;
    for(int i=0;i<6;i++){
      v += a*noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv;
    p.x *= uRes.x / uRes.y;

    float t = uTime * 0.025;
    // scroll slowly translates the noise field so lower sections differ
    p += vec2(uScroll * 0.15, -uScroll * 0.65);

    // domain warp for that liquid, flowing quality
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 3.0*q + vec2(1.7, 9.2) + 0.1*t),
      fbm(p + 3.0*q + vec2(8.3, 2.8) - 0.08*t)
    );
    float f = fbm(p + 3.0*r);

    // pointer drift
    vec2 m = (uMouse - 0.5);
    f += 0.06 * sin(uTime*0.15 + m.x*2.5) * length(uv - uMouse);

    // warm palette: near-black charcoal -> deep bronze -> amber -> soft gold
    vec3 c0 = vec3(0.055, 0.05, 0.04);  // base charcoal
    vec3 c1 = vec3(0.14, 0.095, 0.045); // bronze
    vec3 c2 = vec3(0.34, 0.21, 0.075);  // deep amber
    vec3 c3 = vec3(0.62, 0.41, 0.17);   // amber glow

    // brighter mapping so the whole frame carries flow (not just the top)
    float n = clamp(f * 1.25 + 0.5, 0.0, 1.0);
    vec3 col = mix(c0, c1, smoothstep(0.1, 0.5, n));
    col = mix(col, c2, smoothstep(0.45, 0.78, n));
    col = mix(col, c3, smoothstep(0.74, 1.0, n));

    // two aurora ribbons sweeping at different rates for constant motion
    float r1 = smoothstep(0.55, 1.0, f + 0.3*sin(uv.y*2.4 + uTime*0.12));
    float r2 = smoothstep(0.6, 1.0, f + 0.35*sin(uv.y*3.6 - uTime*0.09 + 1.5));
    col += vec3(0.4, 0.26, 0.1) * r1 * 0.28;
    col += vec3(0.32, 0.2, 0.09) * r2 * 0.2;

    // gentle edge vignette (centered, mild) so corners stay calm
    float d = distance(uv, vec2(0.5));
    col *= smoothstep(1.35, 0.2, d);

    // keep overall energy readable but livelier than before
    col *= 0.92;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function Plane() {
  const mat = useRef();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    []
  );

  const scroll = useRef(0);
  const scrollTarget = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      target.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.getElapsedTime();
    u.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    mouse.current.lerp(target.current, 0.04);
    u.uMouse.value.copy(mouse.current);
    // ease scroll for smooth drift
    scroll.current += (scrollTarget.current - scroll.current) * 0.05;
    u.uScroll.value = scroll.current;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function BackgroundFX() {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
      style={{ width: "100%", height: "100%" }}
      frameloop="always"
    >
      <Plane />
    </Canvas>
  );
}

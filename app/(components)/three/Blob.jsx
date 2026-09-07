"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Liquid-metal blob.
 * A high-res icosphere displaced in the vertex shader by layered 3D simplex
 * noise, shaded with fresnel rim + amber/iridescent gradient in the fragment
 * shader. Reacts to pointer (tilt + extra wobble) and scroll (passed in).
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;        // displacement amount
  uniform float uPointer;    // pointer influence 0..1

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisp;

  //  Simplex 3D noise by Ashima Arts (public domain / MIT)
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p){
    float f = 0.0;
    float a = 0.5;
    for(int i = 0; i < 4; i++){
      f += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return f;
  }

  void main(){
    vNormal = normal;
    float t = uTime * 0.35;
    // layered noise for the liquid surface
    float n = fbm(normal * 1.3 + vec3(t, t * 0.7, -t));
    n += 0.18 * snoise(normal * 2.4 - vec3(t * 1.2));
    float disp = n * (uAmp + uPointer * 0.12);
    vDisp = disp;
    vec3 displaced = position + normal * disp;
    vPos = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;   // deep base
  uniform vec3 uColorB;   // amber
  uniform vec3 uColorC;   // iridescent highlight

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisp;

  void main(){
    vec3 viewDir = normalize(cameraPosition - vPos);
    vec3 nrm = normalize(vNormal);

    // fresnel rim
    float fres = pow(1.0 - max(dot(viewDir, nrm), 0.0), 2.4);

    // iridescent shift based on angle + displacement
    float shift = sin(vDisp * 6.0 + vPos.y * 2.0 + uTime * 0.5) * 0.5 + 0.5;

    vec3 base = mix(uColorA, uColorB, smoothstep(-0.3, 0.5, vDisp));
    vec3 irid = mix(uColorB, uColorC, shift);
    vec3 col = mix(base, irid, fres * 0.9);

    // glossy amber core glow
    col += uColorB * fres * 0.6;
    col += uColorC * pow(fres, 4.0) * 0.8;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Blob({ pointer, scroll }) {
  const mesh = useRef();
  const mat = useRef();
  const smoothed = useRef({ x: 0, y: 0, p: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.16 },
      uPointer: { value: 0 },
      uColorA: { value: new THREE.Color("#1a1206") },
      uColorB: { value: new THREE.Color("#e0a049") },
      uColorC: { value: new THREE.Color("#ffd9a0") },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (mat.current) mat.current.uniforms.uTime.value = t;

    // ease pointer + scroll influence
    const px = pointer?.current?.x ?? 0;
    const py = pointer?.current?.y ?? 0;
    const mag = Math.min(1, Math.hypot(px, py));
    smoothed.current.x += (px - smoothed.current.x) * 0.06;
    smoothed.current.y += (py - smoothed.current.y) * 0.06;
    smoothed.current.p += (mag - smoothed.current.p) * 0.05;

    if (mat.current) mat.current.uniforms.uPointer.value = smoothed.current.p;

    if (mesh.current) {
      const s = scroll?.current ?? 0;
      // gentle constant spin + pointer tilt + scroll rotation
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x = smoothed.current.y * 0.4 + s * 0.6;
      mesh.current.rotation.z = smoothed.current.x * 0.2;
      const scale = 1 + s * 0.15;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 64]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

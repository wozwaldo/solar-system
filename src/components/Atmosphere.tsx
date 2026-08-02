// src/components/Atmosphere.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const fragment = `
uniform vec3 uColor;
uniform float uHover;   // 0..1
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float rim = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
  vec3 lilac = vec3(0.780, 0.722, 1.0);
  vec3 rose  = vec3(1.0, 0.722, 0.820);
  vec3 ice   = vec3(0.659, 0.894, 1.0);
  float t1 = sin(uTime * 0.9) * 0.5 + 0.5;
  float t2 = sin(uTime * 0.6 + 2.0) * 0.5 + 0.5;
  vec3 holo = mix(mix(lilac, rose, t1), ice, t2 * 0.5);
  vec3 col = mix(uColor, holo, uHover);
  gl_FragColor = vec4(col, rim * (0.35 + uHover * 0.4));
}`;

export default function Atmosphere({ radius, color, hovered }: { radius: number; color: string; hovered: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uHover: { value: 0 },
    uTime: { value: 0 },
  }), [color]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    const u = matRef.current.uniforms.uHover;
    u.value += ((hovered ? 1 : 0) - u.value) * 0.08;
  });

  return (
    <mesh scale={1.05} raycast={() => null}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

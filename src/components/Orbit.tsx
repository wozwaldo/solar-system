import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragment = `
uniform float uTime;
uniform float uHover;
varying vec3 vPos;
void main() {
  float ang = atan(vPos.y, vPos.x) / 6.28318 + 0.5;   // ring built in XY plane
  float h = fract(ang + uTime * 0.02);
  vec3 lilac = vec3(0.780, 0.722, 1.0);
  vec3 rose  = vec3(1.0, 0.722, 0.820);
  vec3 ice   = vec3(0.659, 0.894, 1.0);
  vec3 col = h < 0.333 ? mix(lilac, rose, h * 3.0)
           : h < 0.666 ? mix(rose, ice, (h - 0.333) * 3.0)
           : mix(ice, lilac, (h - 0.666) * 3.0);
  gl_FragColor = vec4(col, 0.16 + uHover * 0.5);
}`;

export default function Orbit({ radius, hovered, visible }: { radius: number; hovered: boolean; visible: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uHover: { value: 0 } }), []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    const u = matRef.current.uniforms.uHover;
    u.value += ((hovered ? 1 : 0) - u.value) * 0.06;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
      <ringGeometry args={[radius - 0.03, radius + 0.03, 256]} />
      <shaderMaterial ref={matRef} vertexShader={vertex} fragmentShader={fragment}
        uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

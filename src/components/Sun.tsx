import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const coronaVertex = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const coronaFragment = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float rim = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
  vec3 warm = mix(vec3(1.0, 0.85, 0.6), vec3(1.0, 0.55, 0.35), rim);
  gl_FragColor = vec4(warm, rim * 0.9);
}`;

export default function Sun({ visible }: { visible: boolean }) {
  const sunTexture = useTexture("/textures/2k_sun.jpg");
  sunTexture.colorSpace = THREE.SRGBColorSpace;
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (coreRef.current) coreRef.current.rotation.y += 0.0008;
  });

  return (
    <group visible={visible}>
      <mesh ref={coreRef} scale={7}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={sunTexture} toneMapped={false} />
      </mesh>
      <mesh scale={8.4}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={coronaVertex}
          fragmentShader={coronaFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* the scene's light source */}
      <pointLight intensity={4000} distance={0} decay={2} color={"#fff2d9"}
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    </group>
  );
}

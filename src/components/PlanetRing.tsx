import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RingData } from "./planetData";

// the ring textures are full top-down images of the ring system (a donut with
// transparency), so RingGeometry's default planar UVs sample them correctly
export default function PlanetRing({ name, ring }: { name: string; ring: RingData }) {
  const ringTexture = useTexture(`/textures/${name.toLowerCase()}_ring.png`);
  ringTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <ringGeometry args={[ring.innerRadius, ring.outerRadius, 128]} />
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
        alphaTest={0.1}
        roughness={0.85}
      />
    </mesh>
  );
}

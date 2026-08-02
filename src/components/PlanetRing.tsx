import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RingData } from "./planetData";

export default function PlanetRing({ name, ring }: { name: string; ring: RingData }) {
  const ringTexture = useTexture(`/textures/${name.toLowerCase()}_ring.png`);
  ringTexture.colorSpace = THREE.SRGBColorSpace;

  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 128);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = (v.length() - ring.innerRadius) / (ring.outerRadius - ring.innerRadius);
      uv.setXY(i, r, 1);
    }
    return g;
  }, [ring.innerRadius, ring.outerRadius]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        alphaTest={0.15}
        roughness={0.85}
      />
    </mesh>
  );
}

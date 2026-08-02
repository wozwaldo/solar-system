import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// soft radial glow — brightest at center, eased falloff to fully transparent,
// so the halo reads as radiated light with no visible outer edge
function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, "rgba(255, 244, 214, 0.95)");
  g.addColorStop(0.18, "rgba(255, 214, 140, 0.55)");
  g.addColorStop(0.38, "rgba(255, 166, 92, 0.22)");
  g.addColorStop(0.62, "rgba(255, 140, 80, 0.07)");
  g.addColorStop(1.0, "rgba(255, 120, 70, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Sun({ visible }: { visible: boolean }) {
  const sunTexture = useTexture("/textures/2k_sun.jpg");
  sunTexture.colorSpace = THREE.SRGBColorSpace;
  const coreRef = useRef<THREE.Mesh>(null);
  const glowTexture = useMemo(makeGlowTexture, []);

  useFrame(() => {
    if (coreRef.current) coreRef.current.rotation.y += 0.0008;
  });

  return (
    <>
      <group visible={visible}>
        <mesh ref={coreRef} scale={7}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial map={sunTexture} toneMapped={false} />
        </mesh>
        <sprite scale={[30, 30, 1]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      </group>
      {/* the scene's light source: always active, independent of sun visuals */}
      <pointLight intensity={4000} distance={0} decay={2} color={"#fff2d9"}
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    </>
  );
}

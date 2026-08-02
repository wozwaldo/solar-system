import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// faint warm haze with a smooth exponential falloff (many tiny gradient stops
// so there is no visible banding or edge) — the main glow comes from bloom on
// the overbright sun core, this only adds a soft atmosphere around it
function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const alpha = 0.5 * Math.pow(1 - t, 3.2);
    const r = 255;
    const gr = Math.round(230 - 90 * t);
    const b = Math.round(190 - 120 * t);
    g.addColorStop(t, `rgba(${r}, ${gr}, ${b}, ${alpha})`);
  }
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
          {/* overbright color multiplier pushes the core past the bloom
              threshold, so the glow is real light-spill from the renderer */}
          <meshBasicMaterial map={sunTexture} color={[2.4, 2.0, 1.5] as any} toneMapped={false} />
        </mesh>
        <sprite scale={[22, 22, 1]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            opacity={0.55}
          />
        </sprite>
      </group>
      {/* the scene's light source: always active, independent of sun visuals */}
      <pointLight intensity={4000} distance={0} decay={2} color={"#fff2d9"}
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    </>
  );
}

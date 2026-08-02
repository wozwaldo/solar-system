import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData, PLANET_TEXTURES } from "./planetData";
import PlanetRing from "./PlanetRing";
import Atmosphere from "./Atmosphere";

export interface PlanetProps {
  data: PlanetData;
  visible: boolean;
  selected: boolean;
  hovered: boolean;
  onClick: (name: string) => void;
  onAngleUpdate: (name: string, angle: number) => void;
  onHover: (name: string | null) => void;
}

export default function Planet({ data, visible, selected, hovered, onClick, onAngleUpdate, onHover }: PlanetProps) {
  const texture = useTexture(PLANET_TEXTURES[data.name]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const moonTexture = useTexture("/textures/2k_moon.jpg");
  moonTexture.colorSpace = THREE.SRGBColorSpace;
  const nightMap = useTexture("/textures/2k_earth_nightmap.jpg");
  const cloudsMap = useTexture("/textures/2k_earth_clouds.jpg");
  nightMap.colorSpace = THREE.SRGBColorSpace;
  const isEarth = data.name === "Earth";

  const orbitRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonRefs = useRef<(THREE.Group | null)[]>([]);
  const angle = useRef(Math.random() * Math.PI * 2);
  const moonAngles = useRef(data.moons.map(() => Math.random() * Math.PI * 2));

  useFrame(() => {
    angle.current += data.speed;
    if (orbitRef.current) {
      orbitRef.current.position.set(
        Math.sin(angle.current) * data.distance, 0, Math.cos(angle.current) * data.distance
      );
    }
    onAngleUpdate(data.name, angle.current);
    if (spinRef.current) spinRef.current.rotation.y += selected ? 0.0015 : 0.004;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0006;
    data.moons.forEach((moon, i) => {
      moonAngles.current[i] += moon.speed;
      const g = moonRefs.current[i];
      if (g) g.position.set(
        Math.sin(moonAngles.current[i]) * moon.distance, 0, Math.cos(moonAngles.current[i]) * moon.distance
      );
    });
  });

  return (
    <group ref={orbitRef} visible={visible}>
      <group rotation={[0, 0, data.tilt]}>
        <mesh
          ref={spinRef}
          castShadow
          receiveShadow
          onClick={(e) => { e.stopPropagation(); onClick(data.name); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(data.name); }}
          onPointerOut={() => onHover(null)}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.9}
            metalness={0}
            emissiveMap={isEarth ? nightMap : null}
            emissive={isEarth ? new THREE.Color("#ffd9a0") : new THREE.Color("#000000")}
            emissiveIntensity={isEarth ? 0.55 : 0}
          />
        </mesh>
        <Atmosphere radius={data.radius} color={data.atmosphereColor} hovered={hovered} />
        {data.ring && <PlanetRing name={data.name} ring={data.ring} />}
        {isEarth && (
          <mesh ref={cloudsRef} scale={1.015} raycast={() => null}>
            <sphereGeometry args={[data.radius, 64, 64]} />
            <meshStandardMaterial color="#ffffff" alphaMap={cloudsMap} transparent depthWrite={false} />
          </mesh>
        )}
      </group>
      {data.moons.map((moon, i) => (
        <group key={moon.name} ref={(el) => { moonRefs.current[i] = el; }}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[moon.radius, 32, 32]} />
            <meshStandardMaterial map={moonTexture} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

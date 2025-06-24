"use client";

import { useRef, useMemo, Fragment, useState, useEffect } from "react";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Select } from '@react-three/postprocessing';
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/spaceShader";
import PlanetInfoCard from './PlanetInfoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import styles from './SolarSystem.module.css';

const PLANET_TEXTURES: Record<string, string> = {
  Mercury: "/textures/2k_mercury.jpg",
  Venus: "/textures/2k_venus.jpg",
  Earth: "/textures/2k_earth_daymap.jpg",
  Mars: "/textures/2k_mars.jpg",
  Jupiter: "/textures/2k_jupiter.jpg",
  Saturn: "/textures/saturn.jpg",
  Uranus: "/textures/uranus.jpg",
  Neptune: "/textures/neptune.jpg",
};

export const PLANET_INFOS: Record<string, { title: string; desc: string }> = {
  Mercury: { title: "Mercury", desc: "Mercury is the closest planet to the Sun and also the smallest in our solar system. It has no atmosphere to retain heat, causing extreme temperature differences between day and night — from over 400°C during the day to -180°C at night. A year on Mercury is just 88 Earth days long." },
  Venus: { title: "Venus", desc: "Venus is similar in size to Earth but wrapped in a thick, toxic atmosphere of carbon dioxide. Surface temperatures reach around 470°C, hotter than Mercury due to the greenhouse effect. Its clouds are made of sulfuric acid, and it spins in the opposite direction compared to most planets." },
  Earth: { title: "Earth", desc: "Earth is the only planet known to support life. It has a balanced climate, liquid water, and a protective atmosphere composed mainly of nitrogen and oxygen. Earth’s magnetic field shields us from harmful solar radiation, and its moon plays a key role in tides and planetary stability." },
  Mars: { title: "Mars", desc: "Mars is a cold desert world known as the “Red Planet” due to its iron-rich soil. It has the tallest volcano in the solar system, Olympus Mons, and deep canyons like Valles Marineris. Scientists believe Mars once had water, and exploration continues for signs of ancient life." },
  Jupiter: { title: "Jupiter", desc: "Jupiter is the largest planet in our solar system — a massive gas giant with over 90 known moons. Its atmosphere is made mostly of hydrogen and helium. The Great Red Spot is a giant storm that has been raging for hundreds of years. Some of its moons, like Europa, may have subsurface oceans." },
  Saturn: { title: "Saturn", desc: "Saturn is famous for its spectacular ring system made of ice and rock. It’s a gas giant like Jupiter, with over 140 moons, including Titan, which has a thick atmosphere. Saturn is less dense than water — if there were a big enough ocean, it could float!" },
  Uranus: { title: "Uranus", desc: "Uranus is an ice giant with a pale blue color caused by methane in its upper atmosphere. It rotates on its side, making its seasons extreme and unusual. Temperatures on Uranus can drop to -224°C — making it one of the coldest places in the solar system." },
  Neptune: { title: "Neptune", desc: "Neptune is the farthest planet from the Sun. It has a deep blue color and is known for its fierce winds — the fastest recorded in the solar system, reaching up to 2,100 km/h. Neptune has 14 known moons and faint rings, and its largest moon, Triton, orbits in the opposite direction." },
};

function Sun({ visible = true }) {
  const sunTexture = useTexture("/textures/2k_sun.jpg");
  sunTexture.colorSpace = THREE.SRGBColorSpace;

  const sunRef = useRef<THREE.Mesh>(null);
  const BLOOM_LAYER = 1;

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001; 
      sunRef.current.layers.set(BLOOM_LAYER);
    }
  });

  return (
    <Select enabled>
      <mesh ref={sunRef} scale={7} visible={visible}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial map={sunTexture} toneMapped={false} />
      </mesh>
    </Select>
  );
}

function Planet({ name, radius, distance, speed, tilt, ring, moons, onPlanetClick, onAngleUpdate, spinning, onPointerOver, onPointerOut, visible = true }: any) {
  const texture = useTexture(PLANET_TEXTURES[name]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const moonTexture = useTexture("/textures/2k_moon.jpg");
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  const ref = useRef<THREE.Mesh>(null);
  const moonRefs = useRef<THREE.Mesh[]>([]);
  const selfRotation = useRef(0);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += speed;
      ref.current.position.x = Math.sin(ref.current.rotation.y) * distance;
      ref.current.position.z = Math.cos(ref.current.rotation.y) * distance;
      if (onAngleUpdate) onAngleUpdate(name, ref.current.rotation.y);

      if (spinning) {
        selfRotation.current += 0.0005;
      }
      ref.current.rotation.z = selfRotation.current;
    }

    moons?.forEach((moon: any, i: number) => {
      const moonMesh = moonRefs.current[i];
      if (moonMesh) {
        moonMesh.rotation.y += moon.speed;
        moonMesh.position.x = Math.sin(moonMesh.rotation.y) * moon.distance;
        moonMesh.position.z = Math.cos(moonMesh.rotation.y) * moon.distance;
      }
    });
  });

  return (
    <mesh
      ref={ref}
      rotation={[tilt || 0, 0, 0]}
      onClick={() => onPlanetClick?.(name)}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
        onPointerOver && onPointerOver(e);
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = "default";
        onPointerOut && onPointerOut(e);
      }}
      visible={visible}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={texture} />
      {ring && <PlanetRing name={name} ring={ring} />}
      {moons?.map((moon: any, i: number) => (
        <mesh key={moon.name} ref={(el) => (moonRefs.current[i] = el as THREE.Mesh)}>
          <sphereGeometry args={[moon.radius, 32, 32]} />
          <meshStandardMaterial map={moonTexture} />
        </mesh>
      ))}
    </mesh>
  );
}

function PlanetRing({ name, ring }: any) {
  const ringTexture = useTexture(`/textures/${name.toLowerCase()}_ring.png`);
  ringTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh rotation={[Math.PI / 3, 0, 0]}>
      <ringGeometry args={[ring.innerRadius, ring.outerRadius, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Background() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: true,
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.iTime.value = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <sphereGeometry args={[1000, 32, 32]} />
      <primitive object={material} />
    </mesh>
  );
}

function Orbit({ radius, isHovered, visible = true }: { radius: number, isHovered: boolean, visible?: boolean }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [color] = useState(() => new THREE.Color("#48434f"));

  useFrame(() => {
    const target = isHovered ? new THREE.Color("#00ffaa") : new THREE.Color("#48434f");
    color.lerp(target, 0.01);
    if (materialRef.current) {
      materialRef.current.color.copy(color);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
      <ringGeometry args={[radius - 0.01, radius + 0.05, 128]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraController({ selectedPlanet, planets, resetCamera, setResetCamera }: any) {
  const { camera } = useThree();
  const defaultPosition = new THREE.Vector3(0, 5, 100);

  useFrame(() => {
    if (selectedPlanet) {
      const planet = planets.find((p: any) => p.name === selectedPlanet);
      if (planet) {
        const angle = 0;
        const x = Math.sin(angle) * planet.distance;
        const y = 0;
        const z = Math.cos(angle) * planet.distance;
        const target = new THREE.Vector3(x, y, z + 10);
        camera.position.lerp(target, 0.1);
        camera.lookAt(x, y, z);
      }
    } else if (resetCamera) {
      camera.position.lerp(defaultPosition, 0.1);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(defaultPosition) < 0.2) {
        setResetCamera(false);
      }
    }
  });
  return null;
}

function GroupController({ selectedPlanet, planetAngles, groupRef }: any) {
  useFrame(() => {
    if (selectedPlanet && groupRef.current) {
      const angle = planetAngles.current[selectedPlanet] || 0;
      groupRef.current.rotation.y = -angle;
    }
  });
  return null;
}

function CameraLight({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);

  // Kameranın pozisyonunu takip et
  useFrame(() => {
    if (lightRef.current && enabled) {
      lightRef.current.position.copy(camera.position);
    }
  });

  // Sadece seçili gezegen varken ışığı göster
  if (!enabled) return null;

  return (
    <pointLight
      ref={lightRef}
      intensity={100}
      distance={1000}
      color="white"
      castShadow={false}
    />
  );
}

export default function SolarSystem() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [resetCamera, setResetCamera] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const cardOpenSound = useMemo(() => {
    const sound = new Audio('/sounds/card-open.mp3');
    sound.volume = 0.5;
    sound.playbackRate = 2;
    return sound;
  }, []);

  const cardCloseSound = useMemo(() => {
    const sound = new Audio('/sounds/card-close.mp3');
    sound.volume = 0.5;
    return sound;
  }, []);
    
  const handlePlanetClick = (planetName: string) => {
    cardOpenSound.currentTime = 0;
    cardOpenSound.play();

    setSelectedPlanet(planetName);
  }

  const planetAngles = useRef<{ [name: string]: number }>({});

  const handlePlanetAngle = (name: string, angle: number) => {
    planetAngles.current[name] = angle;
  };

  const planets = [
    { name: "Mercury", radius: 0.4, distance: 12, speed: 0.006, moons: [] },
    { name: "Venus", radius: 0.8, distance: 17, speed: 0.004, moons: [] },
    {
      name: "Earth",
      radius: 0.9,
      distance: 22,
      speed: 0.002,
      moons: [{ name: "Moon", radius: 0.25, distance: 3, speed: 0.009 }],
    },
    {
      name: "Mars",
      radius: 0.6,
      distance: 28,
      speed: 0.0009,
      moons: [
        { name: "Phobos", radius: 0.1, distance: 2, speed: 0.008 },
        { name: "Deimos", radius: 0.2, distance: 3, speed: 0.007 },
      ],
    },
    { name: "Jupiter", radius: 1.9, distance: 38, speed: 0.0007, moons: [], tilt: Math.PI / 8 },
    {
      name: "Saturn",
      radius: 1.7,
      distance: 45,
      speed: 0.0005,
      moons: [],
      tilt: Math.PI / 6,
      ring: { innerRadius: 0.5, outerRadius: 2.5 },
    },
    {
      name: "Uranus",
      radius: 1.4,
      distance: 55,
      speed: 0.0002,
      moons: [],
      tilt: Math.PI / 6,
      ring: { innerRadius: 0, outerRadius: 2 },
    },
    { name: "Neptune", radius: 1.3, distance: 63, speed: 0.00008, moons: [], tilt: Math.PI / 8 },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      if (!muted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [muted]);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'black' }}>
      {/* Music player (hidden) */}
      <audio
        ref={audioRef}
        src="/music/bgmusic.mp3"
        loop
        autoPlay
        style={{ display: "none" }}
      />

      {/* Mute/Unmute butonu */}
      <button
        onClick={() => setMuted((m) => !m)}
        className={styles.muteButton}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted
          ? <FontAwesomeIcon icon={faVolumeMute} />
          : <FontAwesomeIcon icon={faVolumeUp} />
        }
      </button>

      <PlanetInfoCard
        planet={selectedPlanet}
        onClose={() => {
          cardCloseSound.currentTime = 0;
          cardCloseSound.play();
          
          setSelectedPlanet(null);
          setResetCamera(true);
        }}
      />
      <Canvas
        camera={{ position: [0, 5, 100], fov: 35 }}
        style={{ width: '100vw', height: '100vh', display: 'block', background: 'black' }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ camera }) => camera.layers.enable(1)}
      >
        <CameraController
          selectedPlanet={selectedPlanet}
          planets={planets}
          resetCamera={resetCamera}
          setResetCamera={setResetCamera}
        />
        <GroupController selectedPlanet={selectedPlanet} planetAngles={planetAngles} groupRef={groupRef} />
        <OrbitControls
          enableDamping
          minDistance={20}
          maxDistance={200}
        />
        <CameraLight enabled={!!selectedPlanet} />
        {/*
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
        */}
        <ambientLight intensity={0.2} color={0xbdb7ee} />
        <pointLight intensity={3000} color={0xfffaa7d} />
        <Background />
        <group ref={groupRef}>
          <Sun visible={!selectedPlanet} />
          {planets.map((planet) => (
            <Fragment key={planet.name}>
              <Orbit 
                radius={planet.distance} 
                isHovered={hoveredPlanet === planet.name}
                visible={!selectedPlanet || selectedPlanet === planet.name}
              />
              <Planet
                {...planet}
                onPlanetClick={handlePlanetClick}
                onAngleUpdate={handlePlanetAngle}
                spinning={selectedPlanet === planet.name}
                onPointerOver={() => setHoveredPlanet(planet.name)}
                onPointerOut={() => setHoveredPlanet(null)}
                visible={!selectedPlanet || selectedPlanet === planet.name}
              />
            </Fragment>
          ))}
        </group>
      </Canvas>
    </div>
  );
}
"use client";

import { useRef, useMemo, Fragment, useState, useEffect } from "react";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/spaceShader";
import PlanetInfoCard from './PlanetInfoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import styles from './SolarSystem.module.css';
import { PLANETS } from './planetData';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';

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

  const handlePlanetHover = (name: string | null) => {
    document.body.style.cursor = name ? "pointer" : "default";
    setHoveredPlanet(name);
  };

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
        shadows
        camera={{ position: [0, 5, 100], fov: 35 }}
        style={{ width: '100vw', height: '100vh', display: 'block', background: 'black' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <CameraController
          selectedPlanet={selectedPlanet}
          planets={PLANETS}
          resetCamera={resetCamera}
          setResetCamera={setResetCamera}
        />
        <GroupController selectedPlanet={selectedPlanet} planetAngles={planetAngles} groupRef={groupRef} />
        <OrbitControls
          enableDamping
          minDistance={20}
          maxDistance={200}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.6} intensity={0.9} mipmapBlur />
        </EffectComposer>
        <ambientLight intensity={0.07} color={"#c7b8ff"} />
        <Background />
        <group ref={groupRef}>
          <Sun visible={!selectedPlanet} />
          {PLANETS.map((planet) => (
            <Fragment key={planet.name}>
              <Orbit
                radius={planet.distance}
                hovered={hoveredPlanet === planet.name}
                visible={!selectedPlanet || selectedPlanet === planet.name}
              />
              <Planet
                data={planet}
                selected={selectedPlanet === planet.name}
                hovered={hoveredPlanet === planet.name}
                onClick={handlePlanetClick}
                onAngleUpdate={handlePlanetAngle}
                onHover={handlePlanetHover}
                visible={!selectedPlanet || selectedPlanet === planet.name}
              />
            </Fragment>
          ))}
        </group>
      </Canvas>
    </div>
  );
}
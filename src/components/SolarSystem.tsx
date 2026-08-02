"use client";

import { useRef, useMemo, Fragment, useState, useEffect } from "react";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/spaceShader";
import PlanetInfoCard from './PlanetInfoCard';
import Hud from './Hud';
import Cursor from './Cursor';
import { cursorState } from './cursorState';
import { playCardOpen, playCardClose } from './uiSounds';
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

function CameraController({ selectedPlanet, planets, resetCamera, setResetCamera, savedView }: any) {
  const { camera } = useThree();
  const prevSelected = useRef<string | null>(null);

  useFrame(() => {
    // the frame a planet becomes focused, remember where the user left the
    // map so closing the card returns them there instead of the home view
    if (selectedPlanet && !prevSelected.current) {
      savedView.current.copy(camera.position);
    }
    prevSelected.current = selectedPlanet;

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
      camera.position.lerp(savedView.current, 0.1);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(savedView.current) < 0.2) {
        setResetCamera(false);
      }
    }
  });
  return null;
}

// when a planet is focused, the camera faces its night side (the sun is behind
// the planet) — this fill light follows the camera so the focused planet reads
function FocusLight({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current) lightRef.current.position.copy(camera.position);
  });

  if (!enabled) return null;

  return <pointLight ref={lightRef} intensity={320} decay={2} color={"#fff6e8"} />;
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
    sound.volume = 0.15;
    sound.playbackRate = 2;
    return sound;
  }, []);

  const cardCloseSound = useMemo(() => {
    const sound = new Audio('/sounds/card-close.mp3');
    sound.volume = 0.15;
    return sound;
  }, []);

  const handlePlanetClick = (planetName: string) => {
    playCardOpen();
    cardOpenSound.currentTime = 0;
    cardOpenSound.play().catch(() => {});
    setSelectedPlanet(planetName);
  }

  const handleClose = () => {
    playCardClose();
    cardCloseSound.currentTime = 0;
    cardCloseSound.play().catch(() => {});
    setSelectedPlanet(null);
    setResetCamera(true);
  };

  const planetAngles = useRef<{ [name: string]: number }>({});
  const savedView = useRef(new THREE.Vector3(0, 5, 100));

  const handlePlanetAngle = (name: string, angle: number) => {
    planetAngles.current[name] = angle;
  };

  const handlePlanetHover = (name: string | null) => {
    setHoveredPlanet(name);
    cursorState.hover = name !== null;
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

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // browsers block autoplay until a user gesture: try immediately (works if the
  // site already has autoplay permission), otherwise start on the first
  // pointer/key interaction anywhere on the page
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let cleanedUp = false;
    const startOnGesture = () => {
      if (!mutedRef.current) audio.play().catch(() => {});
      cleanup();
    };
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
    };
    audio.play().catch(() => {
      window.addEventListener("pointerdown", startOnGesture);
      window.addEventListener("keydown", startOnGesture);
    });
    return cleanup;
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'black' }}>
      <Cursor />
      {/* Music player (hidden) */}
      <audio
        ref={audioRef}
        src="/music/bgmusic.mp3"
        loop
        autoPlay
        style={{ display: "none" }}
      />

      <Hud
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        showReturn={!!selectedPlanet}
        onReturn={handleClose}
      />

      <PlanetInfoCard
        planet={selectedPlanet}
        onClose={handleClose}
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
          savedView={savedView}
        />
        <GroupController selectedPlanet={selectedPlanet} planetAngles={planetAngles} groupRef={groupRef} />
        <OrbitControls
          enableDamping
          minDistance={20}
          maxDistance={200}
          onStart={() => {
            cursorState.drag = true;
            // a manual drag takes over the camera: cancel any pending
            // return-to-overview animation so it can't fight the user
            setResetCamera(false);
          }}
          onEnd={() => { cursorState.drag = false; }}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.6} intensity={1.15} mipmapBlur />
        </EffectComposer>
        <ambientLight intensity={0.07} color={"#c7b8ff"} />
        <FocusLight enabled={!!selectedPlanet} />
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
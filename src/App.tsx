import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, CameraShake } from '@react-three/drei';
import { Player, playerRef } from './Player';
import { World } from './World';
import { UI } from './UI';
import { useGameStore } from './store';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';

const THEME_BG = {
  light: '#f0f4f8',
  city: '#1e293b',
  lava: '#f97316',
  beach: '#3b82f6',
  forest: '#22c55e',
  ice: '#bae6fd',
  desert: '#fbbf24',
  candy: '#f472b6'
};

const SIZES = [
  { w: 8, h: 0.5 },
  { w: 4, h: 1 },
  { w: 2, h: 2 },
  { w: 1, h: 4 },
  { w: 0.5, h: 8 }
];

export default function App() {
  const status = useGameStore((state) => state.status);
  const theme = useGameStore((state) => state.theme);
  const controlMode = useGameStore((state) => state.controlMode);
  const sensitivity = useGameStore((state) => state.sensitivity);
  const playerSizeIndex = useGameStore((state) => state.playerSizeIndex);
  const setPlayerSizeIndex = useGameStore((state) => state.setPlayerSizeIndex);
  const highQuality = useGameStore((state) => state.effectsLevel) !== 'Low';
  const cameraShakeEnabled = useGameStore((state) => state.cameraShake);
  const isDragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    if (theme === 'city' || theme === 'lava' || theme === 'forest') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updatePlayerSize = (index: number) => {
    setPlayerSizeIndex(index);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.targetWidth = SIZES[playerSizeIndex].w;
      playerRef.current.targetHeight = SIZES[playerSizeIndex].h;
    }
  }, [playerSizeIndex]);

  useEffect(() => {
    if (status === 'playing') {
      updatePlayerSize(2);
    }
  }, [status]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (status !== 'playing' || controlMode === 'buttons') return;
    startY.current = e.clientY;
    if (controlMode === 'swipe') {
      isDragging.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (status !== 'playing' || controlMode === 'buttons' || !isDragging.current) return;
    const deltaY = e.clientY - startY.current;
    const threshold = 30; // Increased sensitivity
    
    if (Math.abs(deltaY) > threshold) {
      let newIndex = playerSizeIndex;
      if (deltaY < -threshold) { // Swipe Up -> Taller
        newIndex = Math.min(4, playerSizeIndex + 1);
      } else if (deltaY > threshold) { // Swipe Down -> Shorter
        newIndex = Math.max(0, playerSizeIndex - 1);
      }
      
      if (newIndex !== playerSizeIndex) {
        updatePlayerSize(newIndex);
      }
      isDragging.current = false; // Reset dragging after one step
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden touch-none transition-colors duration-500"
      style={{ backgroundColor: THEME_BG[theme] }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={highQuality ? [1, 2] : 1}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
        {cameraShakeEnabled && (
          <CameraShake
            maxYaw={status === 'gameover' || status === 'continue' ? 0.5 : 0}
            maxPitch={status === 'gameover' || status === 'continue' ? 0.5 : 0}
            maxRoll={status === 'gameover' || status === 'continue' ? 0.5 : 0}
            yawFrequency={0.5}
            pitchFrequency={0.5}
            rollFrequency={0.5}
            intensity={status === 'gameover' || status === 'continue' ? 1 : 0}
          />
        )}
        <color attach="background" args={[THEME_BG[theme]]} />
        <fog attach="fog" args={[THEME_BG[theme], 10, 80]} />
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow={highQuality}
          shadow-mapSize={highQuality ? [1024, 1024] : [512, 512]}
        />
        <Suspense fallback={null}>
          <Player />
        </Suspense>
        <World />
      </Canvas>
      <UI />
    </div>
  );
}

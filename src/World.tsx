import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import { Wall } from './Wall';
import { playerRef } from './Player';
import * as THREE from 'three';
import { playSound } from './sound';
import { LEVELS } from './levels';
import { gsap } from 'gsap';

// Pre-allocate to avoid GC in hot loops
const _tempVec3 = new THREE.Vector3();
const _tempAxis = new THREE.Vector3(0, 1, 0);

function ParticleBurst({ isPerfect, theme, onComplete }: { isPerfect: boolean; theme: string; onComplete: () => void }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const effectsLevel = useGameStore((state) => state.effectsLevel);
  const multiplier = effectsLevel === 'High' ? 1.0 : effectsLevel === 'Low' ? 0.2 : 0.6;
  const count = Math.floor((isPerfect ? 80 : 25) * multiplier);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      let vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(Math.random() * 20 + 10);
      
      let scale = Math.random() * 0.5 + 0.2;
      let color = new THREE.Color('#ffffff');

      if (isPerfect) {
        if (theme === 'lava') {
          vel.y = Math.abs(vel.y) + 15;
          color.set(Math.random() > 0.5 ? '#ff5722' : '#ff9800');
        } else if (theme === 'beach') {
          vel.y = Math.abs(vel.y) + 10;
          color.set(Math.random() > 0.5 ? '#00bcd4' : '#ffeb3b');
        } else if (theme === 'forest') {
          vel.multiplyScalar(0.5);
          color.set(Math.random() > 0.5 ? '#4caf50' : '#8bc34a');
        } else if (theme === 'ice') {
          vel.multiplyScalar(1.5);
          color.set('#b2ebf2');
        } else if (theme === 'desert') {
          vel.set(Math.sin(i) * 15, Math.random() * 15, Math.cos(i) * 15);
          color.set('#ffb74d');
        } else if (theme === 'candy') {
          color.set(Math.random() > 0.5 ? '#f48fb1' : '#ce93d8');
        } else if (theme === 'city') {
          vel.multiplyScalar(2);
          scale = Math.random() * 2 + 1;
          color.set(Math.random() > 0.5 ? '#e74c3c' : '#f1c40f');
        } else if (theme === 'light') {
          vel.multiplyScalar(1.5);
          color.set(Math.random() > 0.5 ? '#3b82f6' : '#94a3b8');
        }
      }

      return {
        pos: new THREE.Vector3(0, 2, 0),
        vel,
        scale,
        life: 1.0,
        color,
        rotSpeed: (Math.random() - 0.5) * 20
      };
    });
  }, [count, isPerfect, theme]);

  useEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      meshRef.current!.setColorAt(i, p.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [particles]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    let alive = false;
    particles.forEach((p, i) => {
      p.life -= delta * (isPerfect ? 1.0 : 1.5);
      if (p.life > 0) {
        alive = true;
        
        if (isPerfect) {
          if (theme === 'desert') {
            _tempAxis.set(0, 1, 0);
            p.vel.applyAxisAngle(_tempAxis, delta * 5);
          } else if (theme === 'beach') {
            p.vel.y -= delta * 30;
          } else if (theme === 'lava') {
            p.vel.y -= delta * 20;
          }
        }

        _tempVec3.copy(p.vel).multiplyScalar(delta);
        p.pos.add(_tempVec3);
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.scale * p.life);
        dummy.rotation.x += p.rotSpeed * delta;
        dummy.rotation.y += p.rotSpeed * delta;
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (!alive) onComplete();
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, 2, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}

const THEME_FLOOR = {
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
  { width: 8, height: 0.5 },
  { width: 4, height: 1 },
  { width: 2, height: 2 },
  { width: 1, height: 4 },
  { width: 0.5, height: 8 }
];

export function World() {
  const [walls, setWalls] = useState<WallData[]>([]);
  const [bursts, setBursts] = useState<{id: number, isPerfect: boolean}[]>([]);
  const distanceRef = useRef(0);
  const status = useGameStore((state) => state.status);
  const speed = useGameStore((state) => state.speed);
  const theme = useGameStore((state) => state.theme);
  const currentLevelIndex = useGameStore((state) => state.currentLevelIndex);
  const haptics = useGameStore((state) => state.haptics);
  const addScore = useGameStore((state) => state.addScore);
  const addDiamonds = useGameStore((state) => state.addDiamonds);
  const setStatus = useGameStore((state) => state.setStatus);
  const increaseSpeed = useGameStore((state) => state.increaseSpeed);
  const triggerPerfect = useGameStore((state) => state.triggerPerfect);
  const addFlyingDiamond = useGameStore((state) => state.addFlyingDiamond);
  const incrementWallIndex = useGameStore((state) => state.incrementWallIndex);
  const nextLevel = useGameStore((state) => state.nextLevel);
  const incrementCombo = useGameStore((state) => state.incrementCombo);
  const resetCombo = useGameStore((state) => state.resetCombo);

  const level = LEVELS[currentLevelIndex % LEVELS.length];

  const generateHole = () => {
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    return { width: size.width, height: size.height };
  };

  useFrame((state, delta) => {
    if (useGameStore.getState().status === 'playing') {
      distanceRef.current += useGameStore.getState().speed * delta;
    }
  });

  useEffect(() => {
    if (status === 'playing') {
      if (!useGameStore.getState().hasContinued) {
        distanceRef.current = 0;
        const initialWalls: WallData[] = [];
        for (let i = 0; i < level.obstacleCount; i++) {
          const { width, height } = generateHole();
          initialWalls.push({
            id: Math.random(),
            index: i,
            z: -35 - i * 35,
            holeWidth: width,
            holeHeight: height,
            isMoving: Math.random() < level.rotationChance,
          });
        }
        setWalls(initialWalls);
      } else {
        // When continuing, move the distance back slightly so the player has time to react
        distanceRef.current -= 15;
      }
    } else if (status === 'menu' || status === 'shop' || status === 'settings') {
      setWalls([]);
    }
  }, [status]);

  const handlePass = useCallback((id: number, isMoving: boolean) => {
    addScore(10 + useGameStore.getState().combo * 2);
    increaseSpeed();
    incrementWallIndex();
    incrementCombo();
    
    if (isMoving) {
      playSound('perfect');
      triggerPerfect();
      addFlyingDiamond();
      addDiamonds(5);
    } else {
      playSound('pass');
      addDiamonds(2);
    }
    if (haptics && navigator.vibrate) navigator.vibrate(30);
    setBursts(prev => [...prev, { id: Date.now() + Math.random(), isPerfect: isMoving }]);
  }, [addScore, increaseSpeed, incrementWallIndex, incrementCombo, triggerPerfect, addFlyingDiamond, haptics, addDiamonds]);

  const handleRemove = useCallback((id: number) => {
    if (useGameStore.getState().status !== 'playing') return;
    setWalls((prev) => {
      const newWalls = prev.filter((w) => w.id !== id);
      if (newWalls.length === 0) {
        nextLevel();
        return [];
      }
      const lastZ = newWalls.length > 0 ? Math.min(...newWalls.map((w) => w.z)) : -35;
      const { width, height } = generateHole();
      const nextIndex = useGameStore.getState().wallIndex + newWalls.length + 1;
      const isMoving = Math.random() < level.rotationChance;
      
      newWalls.push({
        id: Math.random(),
        index: nextIndex,
        z: lastZ - 35,
        holeWidth: width,
        holeHeight: height,
        isMoving,
      });
      return newWalls;
    });
  }, [level.rotationChance, nextLevel]);

  const handleFail = useCallback(() => {
    playSound('fail');
    resetCombo();
    if (haptics && navigator.vibrate) navigator.vibrate([200, 100, 200]);
    const currentScore = useGameStore.getState().score;
    const hasContinued = useGameStore.getState().hasContinued;
    if (currentScore > 250 && !hasContinued) {
      setStatus('continue');
    } else {
      setStatus('gameover');
    }
  }, [setStatus, haptics, resetCombo]);

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
  }), []);

  const themeColor = useMemo(() => new THREE.Color(THEME_FLOOR[theme]), [theme]);

  useEffect(() => {
    gsap.to(themeColor, {
      r: new THREE.Color(THEME_FLOOR[theme]).r,
      g: new THREE.Color(THEME_FLOOR[theme]).g,
      b: new THREE.Color(THEME_FLOOR[theme]).b,
      duration: 1,
    });
  }, [theme, themeColor]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -50]} receiveShadow>
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial color={THEME_FLOOR[theme]} roughness={1} metalness={0} />
      </mesh>
      
      {theme === 'city' && (
        <gridHelper args={[10, 60, '#3b82f6', '#3b82f6']} position={[0, -0.09, -50]} />
      )}

      {walls.map((wall) => (
        <Wall
          key={wall.id}
          id={wall.id}
          index={wall.index}
          z={wall.z}
          holeWidth={wall.holeWidth}
          holeHeight={wall.holeHeight}
          isMoving={wall.isMoving}
          onPass={handlePass}
          onFail={handleFail}
          onRemove={handleRemove}
          speed={status === 'playing' ? speed : 0}
          distanceRef={distanceRef}
          material={wallMaterial}
          themeColor={themeColor}
        />
      ))}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} isPerfect={b.isPerfect} theme={theme} onComplete={() => setBursts(prev => prev.filter(x => x.id !== b.id))} />
      ))}
    </group>
  );
}

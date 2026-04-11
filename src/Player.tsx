import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore, Trail as TrailType } from './store';
import * as THREE from 'three';

export const playerRef = {
  current: { 
    width: 2, height: 2, 
    targetWidth: 2, targetHeight: 2, 
    isHolding: false 
  },
};

const THEME_COLORS = {
  light: '#ff3366',
  lava: '#d84315',
  beach: '#ffeb3b',
  forest: '#2e7d32',
  ice: '#ffffff',
  desert: '#e65100',
  city: '#f1c40f',
  candy: '#9c27b0'
};

function CustomTrail({ type, playerMeshRef }: { type: TrailType; playerMeshRef: React.RefObject<THREE.Mesh> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const effectsLevel = useGameStore((state) => state.effectsLevel);
  const count = effectsLevel === 'High' ? 200 : effectsLevel === 'Low' ? 50 : 100;
  
  const particles = useRef(Array.from({ length: count }).map(() => ({
    pos: new THREE.Vector3(0, -100, 0),
    vel: new THREE.Vector3(),
    life: 0,
    scale: 0,
    color: new THREE.Color()
  })));

  useEffect(() => {
    particles.current = Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(0, -100, 0),
      vel: new THREE.Vector3(),
      life: 0,
      scale: 0,
      color: new THREE.Color()
    }));
  }, [count]);
  
  const lastSpawn = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !playerMeshRef.current || type === 'none') return;
    
    lastSpawn.current += delta;
    const spawnRate = effectsLevel === 'High' ? 0.01 : effectsLevel === 'Low' ? 0.04 : 0.02;
    if (lastSpawn.current > spawnRate) {
      lastSpawn.current = 0;
      const deadParticle = particles.current.find(p => p.life <= 0);
      if (deadParticle) {
        deadParticle.life = 1;
        deadParticle.pos.copy(playerMeshRef.current.position);
        deadParticle.pos.x += (Math.random() - 0.5) * playerMeshRef.current.scale.x;
        deadParticle.pos.y += (Math.random() - 0.5) * playerMeshRef.current.scale.y;
        
        if (type === 'fire') {
          deadParticle.vel.set((Math.random()-0.5)*2, Math.random()*5, (Math.random()-0.5)*2);
          deadParticle.scale = Math.random() * 0.5 + 0.5;
          deadParticle.color.set(Math.random() > 0.5 ? '#ff5722' : '#ff9800');
        } else if (type === 'water') {
          deadParticle.vel.set((Math.random()-0.5)*2, -Math.random()*5, (Math.random()-0.5)*2);
          deadParticle.scale = Math.random() * 0.4 + 0.2;
          deadParticle.color.set('#03a9f4');
        } else if (type === 'jelly') {
          deadParticle.vel.set(0, 0, 0);
          deadParticle.scale = Math.random() * 0.5 + 0.5;
          deadParticle.color.set('#9c27b0');
        } else if (type === 'vines') {
          deadParticle.vel.set(0, 0, 0);
          deadParticle.scale = 0.3;
          deadParticle.color.set('#4caf50');
        } else if (type === 'ice') {
          deadParticle.vel.set((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5);
          deadParticle.scale = Math.random() * 0.3 + 0.1;
          deadParticle.color.set('#e0f7fa');
        } else if (type === 'sand') {
          deadParticle.vel.set((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
          deadParticle.scale = Math.random() * 0.2 + 0.1;
          deadParticle.color.set('#ffb74d');
        } else if (type === 'neon') {
          deadParticle.vel.set(0, 0, 0);
          deadParticle.scale = Math.random() * 0.8 + 0.4;
          deadParticle.color.set('#00bcd4');
        }
      }
    }

    particles.current.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= delta * 2;
        p.pos.add(p.vel.clone().multiplyScalar(delta));
        
        if (type === 'jelly') {
          p.scale = Math.sin(p.life * Math.PI) * 0.8;
        } else if (type === 'neon') {
          p.scale *= 0.9;
        }
        
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.scale * p.life);
        
        if (type === 'vines') {
          dummy.rotation.z += delta * 5;
        } else {
          dummy.rotation.set(0,0,0);
        }
        
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        meshRef.current!.setColorAt(i, p.color);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      }
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (type === 'none') return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const status = useGameStore((state) => state.status);
  const theme = useGameStore((state) => state.theme);
  const trailType = useGameStore((state) => state.trail);
  const controlMode = useGameStore((state) => state.controlMode);
  const sensitivity = useGameStore((state) => state.sensitivity);

  useEffect(() => {
    if (status === 'playing') {
      playerRef.current.targetWidth = 2;
      playerRef.current.targetHeight = 2;
      playerRef.current.width = 2;
      playerRef.current.height = 2;
      if (meshRef.current) {
        meshRef.current.scale.set(2, 2, 1);
        meshRef.current.position.y = 1;
      }
    }
  }, [status]);

  const themeColor = useMemo(() => new THREE.Color(THEME_COLORS[theme]), [theme]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const p = playerRef.current;
    
    // Simple animation
    p.width = THREE.MathUtils.lerp(p.width, p.targetWidth, delta * 15);
    p.height = THREE.MathUtils.lerp(p.height, p.targetHeight, delta * 15);

    // Conservation of volume: if width and height increase, depth should decrease
    // Original volume is 2*2*1 = 4.
    const depth = Math.max(0.2, 4 / (p.width * p.height));

    // Apply scale directly
    meshRef.current.scale.set(p.width, p.height, depth);
    meshRef.current.position.y = p.height / 2;

    materialRef.current.color.copy(themeColor);

    if (status === 'menu' || status === 'shop' || status === 'settings') {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime) * 0.1;
    } else {
      meshRef.current.rotation.y = 0;
      meshRef.current.rotation.z = 0;
    }
  });

  const playerMesh = (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} roughness={1} metalness={0} />
    </mesh>
  );

  return (
    <group position={[0, 0, 0]}>
      <CustomTrail type={trailType} playerMeshRef={meshRef} />
      {playerMesh}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { playerRef } from './Player';
import { useGameStore } from './store';

interface WallProps {
  id: number;
  index: number;
  z: number;
  holeWidth: number;
  holeHeight: number;
  isMoving: boolean;
  onPass: (id: number, isMoving: boolean) => void;
  onFail: () => void;
  onRemove: (id: number) => void;
  speed: number;
  distanceRef: React.MutableRefObject<number>;
}

const THEME_WALLS = {
  light: '#ffffff',
  lava: '#ff5722',
  beach: '#00bcd4',
  forest: '#4caf50',
  ice: '#00bcd4',
  desert: '#ff9800',
  city: '#e74c3c',
  candy: '#e91e63'
};

export const Wall = React.memo(function Wall({ id, index, z, holeWidth, holeHeight, isMoving, onPass, onFail, onRemove, speed, distanceRef, material, themeColor }: WallProps & { material: THREE.MeshStandardMaterial, themeColor: THREE.Color }) {
  const groupRef = useRef<THREE.Group>(null);
  const passedRef = useRef(false);
  const wobbleRef = useRef(0);
  const flashRef = useRef(0);
  const feverEffects = useGameStore((state) => state.feverEffects);

  const wallMaterial = useMemo(() => material.clone(), [material]);

  useFrame((state, delta) => {
    const status = useGameStore.getState().status;
    if (status !== 'playing') return;
    if (!groupRef.current) return;

    const prevZ = groupRef.current.position.z;
    const currZ = z + distanceRef.current;
    groupRef.current.position.z = currZ;

    if (isMoving && !passedRef.current) {
      groupRef.current.position.x = Math.sin(currZ * 0.15) * 4;
    }

    if (wobbleRef.current > 0) {
      wobbleRef.current = Math.max(0, wobbleRef.current - delta * 4);
      groupRef.current.scale.setScalar(1 + Math.sin(wobbleRef.current * Math.PI * 4) * 0.1);
    }

    const p = playerRef.current;

    if (!passedRef.current && prevZ < 0 && currZ >= 0) {
      const tolerance = isMoving ? 0.6 : 0.45;
      const exactHoleX = isMoving ? groupRef.current.position.x : 0;
      
      const pLeft = -p.width / 2;
      const pRight = p.width / 2;
      const hLeft = exactHoleX - holeWidth / 2;
      const hRight = exactHoleX + holeWidth / 2;

      if (
        p.width <= holeWidth + tolerance &&
        p.height <= holeHeight + tolerance &&
        pLeft >= hLeft - tolerance &&
        pRight <= hRight + tolerance
      ) {
        passedRef.current = true;
        if (feverEffects) {
          wobbleRef.current = 1;
          flashRef.current = 1;
        }
        onPass(id, isMoving);
      } else {
        onFail();
      }
    }

    if (currZ > 2) {
      onRemove(id);
    }

    if (flashRef.current > 0) {
      flashRef.current = Math.max(0, flashRef.current - delta * 3);
      if (wallMaterial.color.getHex() !== 0xffffff) {
        wallMaterial.color.setHex(0xffffff);
      }
    } else {
      if (!wallMaterial.color.equals(themeColor)) {
        wallMaterial.color.copy(themeColor);
      }
    }
  });

  const wallGeometry = useMemo(() => {
    const wallDepth = 1;
    const totalWidth = 10;
    const wallHeight = 15;
    const leftWidth = (totalWidth - holeWidth) / 2;
    const rightWidth = (totalWidth - holeWidth) / 2;
    const topHeight = wallHeight - holeHeight;
    
    const leftBox = new THREE.BoxGeometry(leftWidth, wallHeight, wallDepth);
    leftBox.translate(-holeWidth / 2 - leftWidth / 2, wallHeight / 2, 0);
    
    const rightBox = new THREE.BoxGeometry(rightWidth, wallHeight, wallDepth);
    rightBox.translate(holeWidth / 2 + rightWidth / 2, wallHeight / 2, 0);
    
    const topBox = new THREE.BoxGeometry(holeWidth, topHeight, wallDepth);
    topBox.translate(0, holeHeight + topHeight / 2, 0);
    
    return BufferGeometryUtils.mergeGeometries([leftBox, rightBox, topBox]);
  }, [holeWidth, holeHeight]);

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      <mesh geometry={wallGeometry} material={wallMaterial} castShadow receiveShadow />
    </group>
  );
});

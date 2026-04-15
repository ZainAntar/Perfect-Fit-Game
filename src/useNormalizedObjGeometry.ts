import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const _geometryBox = new THREE.Box3();
const _geometryCenter = new THREE.Vector3();
const _geometrySize = new THREE.Vector3();

export function useNormalizedObjGeometry(path: string) {
  const object = useLoader(OBJLoader, path);

  return useMemo(() => {
    object.updateMatrixWorld(true);

    let sourceGeometry: THREE.BufferGeometry | null = null;

    object.traverse((child) => {
      if (sourceGeometry || !(child instanceof THREE.Mesh) || !child.geometry) {
        return;
      }

      sourceGeometry = child.geometry.clone();
      sourceGeometry.applyMatrix4(child.matrixWorld);
    });

    const geometry = sourceGeometry ?? new THREE.BoxGeometry(1, 1, 1);

    geometry.computeBoundingBox();
    if (!geometry.boundingBox) {
      return geometry;
    }

    _geometryBox.copy(geometry.boundingBox);
    _geometryBox.getCenter(_geometryCenter);
    _geometryBox.getSize(_geometrySize);

    const maxDimension = Math.max(_geometrySize.x, _geometrySize.y, _geometrySize.z) || 1;

    geometry.translate(-_geometryCenter.x, -_geometryCenter.y, -_geometryCenter.z);
    geometry.scale(1 / maxDimension, 1 / maxDimension, 1 / maxDimension);
    geometry.computeVertexNormals();

    return geometry;
  }, [object]);
}

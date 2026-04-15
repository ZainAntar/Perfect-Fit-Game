import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const tempBox = new THREE.Box3();
const tempCenter = new THREE.Vector3();
const tempSize = new THREE.Vector3();

export function useNormalizedObjGeometry(path: string) {
  const object = useLoader(OBJLoader, path);

  return useMemo(() => {
    object.updateMatrixWorld(true);

    const sourceGeometries: THREE.BufferGeometry[] = [];

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.geometry) {
        return;
      }

      const geometry = child.geometry.clone();
      geometry.applyMatrix4(child.matrixWorld);
      sourceGeometries.push(geometry);
    });

    if (sourceGeometries.length === 0) {
      console.warn(`No mesh geometry found in OBJ asset: ${path}`);
      return new THREE.BoxGeometry(1, 1, 1);
    }

    const geometry = sourceGeometries.length === 1
      ? sourceGeometries[0]
      : mergeGeometries(sourceGeometries, false) ?? sourceGeometries[0];

    geometry.computeBoundingBox();
    if (!geometry.boundingBox) {
      return geometry;
    }

    tempBox.copy(geometry.boundingBox);
    tempBox.getCenter(tempCenter);
    tempBox.getSize(tempSize);

    const maxDimension = Math.max(tempSize.x, tempSize.y, tempSize.z) || 1;

    geometry.translate(-tempCenter.x, -tempCenter.y, -tempCenter.z);
    geometry.scale(1 / maxDimension, 1 / maxDimension, 1 / maxDimension);
    geometry.computeVertexNormals();

    return geometry;
  }, [object]);
}

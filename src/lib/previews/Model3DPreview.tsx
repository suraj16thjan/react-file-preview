import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  url: string;
  fileName: string;
}

const STLModel: React.FC<{ url: string }> = ({ url }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const geo = parseSTL(buf);
        geo.computeVertexNormals();
        geo.center();
        setGeometry(geo);
      });
  }, [url]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.6} />
    </mesh>
  );
};

function parseSTL(buffer: ArrayBuffer): THREE.BufferGeometry {
  const data = new DataView(buffer);
  const geo = new THREE.BufferGeometry();

  const isBinary = buffer.byteLength > 84;
  if (isBinary) {
    const triangles = data.getUint32(80, true);
    const vertices = new Float32Array(triangles * 9);
    const normals = new Float32Array(triangles * 9);

    let offset = 84;
    for (let i = 0; i < triangles; i++) {
      const nx = data.getFloat32(offset, true); offset += 4;
      const ny = data.getFloat32(offset, true); offset += 4;
      const nz = data.getFloat32(offset, true); offset += 4;

      for (let j = 0; j < 3; j++) {
        const idx = i * 9 + j * 3;
        vertices[idx] = data.getFloat32(offset, true); offset += 4;
        vertices[idx + 1] = data.getFloat32(offset, true); offset += 4;
        vertices[idx + 2] = data.getFloat32(offset, true); offset += 4;
        normals[idx] = nx;
        normals[idx + 1] = ny;
        normals[idx + 2] = nz;
      }
      offset += 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  }

  return geo;
}

const OBJModel: React.FC<{ url: string }> = ({ url }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(text => {
        const geo = parseOBJ(text);
        geo.computeVertexNormals();
        geo.center();
        setGeometry(geo);
      });
  }, [url]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.6} />
    </mesh>
  );
};

function parseOBJ(text: string): THREE.BufferGeometry {
  const positions: number[] = [];
  const vertices: number[] = [];

  for (const line of text.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (parts[0] === 'f') {
      const indices = parts.slice(1).map(p => parseInt(p.split('/')[0]) - 1);
      for (let i = 1; i < indices.length - 1; i++) {
        for (const idx of [indices[0], indices[i], indices[i + 1]]) {
          vertices.push(positions[idx * 3], positions[idx * 3 + 1], positions[idx * 3 + 2]);
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  return geo;
}

export const Model3DPreview: React.FC<Props> = ({ url, fileName }) => {
  const ext = useMemo(() => fileName.split('.').pop()?.toLowerCase(), [fileName]);
  const [wireframe, setWireframe] = useState(false);

  const supported = ext === 'stl' || ext === 'obj';

  if (!supported) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--rfp-muted, #718096)', padding: '20px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧊</div>
          <div>.{ext} preview requires a GLTF/GLB loader. Only STL and OBJ are supported in the browser.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#1a1a2e' }}>
      <div style={{
        position: 'absolute', top: '8px', right: '8px', zIndex: 10,
        display: 'flex', gap: '4px',
      }}>
        <button
          onClick={() => setWireframe(!wireframe)}
          style={{
            padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.2)', backgroundColor: wireframe ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: '#fff',
          }}
        >
          Wireframe
        </button>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {ext === 'stl' ? <STLModel url={url} /> : <OBJModel url={url} />}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={1} />
        {wireframe && <primitive object={new THREE.GridHelper(10, 10, '#444', '#333')} />}
      </Canvas>
      <div style={{
        position: 'absolute', bottom: '8px', left: '8px', fontSize: '11px',
        color: 'rgba(255,255,255,0.5)', userSelect: 'none',
      }}>
        Drag to rotate · Scroll to zoom · Right-click to pan
      </div>
    </div>
  );
};

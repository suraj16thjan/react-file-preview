import React, { useState, useRef, useCallback } from 'react';
import { baseStyles } from '../utils/styles';

interface Props {
  url: string;
  fileName: string;
}

export const ImagePreview: React.FC<Props> = ({ url, fileName }) => {
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    if (imgRef.current) {
      setDimensions({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight });
    }
  }, []);

  if (error) {
    return (
      <div style={baseStyles.error}>
        <div style={baseStyles.errorIcon}>🖼</div>
        <div>Failed to load image</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', borderBottom: '1px solid var(--rfp-border, #e2e8f0)',
        fontSize: '12px', color: 'var(--rfp-muted, #718096)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={baseStyles.toolbarButton} onClick={() => setZoom(z => Math.max(0.1, z - 0.25))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button style={baseStyles.toolbarButton} onClick={() => setZoom(z => Math.min(5, z + 0.25))}>+</button>
          <button style={baseStyles.toolbarButton} onClick={() => setZoom(1)}>Reset</button>
        </div>
        {dimensions && <span>{dimensions.w} × {dimensions.h}px</span>}
      </div>
      <div style={{
        flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px',
        backgroundImage: 'linear-gradient(45deg, var(--rfp-checker, #f0f0f0) 25%, transparent 25%), linear-gradient(-45deg, var(--rfp-checker, #f0f0f0) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--rfp-checker, #f0f0f0) 75%), linear-gradient(-45deg, transparent 75%, var(--rfp-checker, #f0f0f0) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}>
        <img
          ref={imgRef}
          src={url}
          alt={fileName}
          onLoad={handleLoad}
          onError={() => setError(true)}
          style={{
            maxWidth: zoom === 1 ? '100%' : 'none',
            maxHeight: zoom === 1 ? '100%' : 'none',
            width: zoom !== 1 ? `${zoom * 100}%` : undefined,
            objectFit: 'contain',
            borderRadius: '4px',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

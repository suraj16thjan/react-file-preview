import React, { useEffect, useState, useRef } from 'react';

interface Props {
  url: string;
  fileName: string;
}

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';
const PANGRAMS = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  '!@#$%^&*()_+-=[]{}|;:\'",.<>?/',
];
const SIZES = [12, 16, 20, 24, 32, 48, 72, 96];

export const FontPreview: React.FC<Props> = ({ url, fileName }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [customText, setCustomText] = useState(SAMPLE_TEXT);
  const fontFamily = useRef(`rfp-font-${Date.now()}`);

  useEffect(() => {
    const font = new FontFace(fontFamily.current, `url(${url})`);
    font.load()
      .then(f => { document.fonts.add(f); setLoaded(true); })
      .catch(() => setError(true));
    return () => { document.fonts.delete(font); };
  }, [url]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#e53e3e' }}>Failed to load font: {fileName}</div>
    );
  }

  if (!loaded) {
    return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading font...</div>;
  }

  const ff = fontFamily.current;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px' }}>
      <input
        type="text"
        value={customText}
        onChange={e => setCustomText(e.target.value)}
        placeholder="Type to preview..."
        style={{
          width: '100%', padding: '12px 16px', border: '1px solid var(--rfp-border, #e2e8f0)',
          borderRadius: '6px', fontSize: '16px', marginBottom: '24px',
          backgroundColor: 'var(--rfp-bg, #fff)', color: 'var(--rfp-text, #1a202c)',
          fontFamily: ff,
        }}
      />

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--rfp-muted, #718096)', marginBottom: '12px' }}>
          Character Set
        </div>
        {PANGRAMS.map((line, i) => (
          <div key={i} style={{ fontFamily: ff, fontSize: '20px', lineHeight: '1.6', letterSpacing: '2px' }}>
            {line}
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--rfp-muted, #718096)', marginBottom: '16px' }}>
          Size Ramp
        </div>
        {SIZES.map(size => (
          <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--rfp-muted, #a0aec0)', minWidth: '36px', textAlign: 'right' }}>
              {size}px
            </span>
            <span style={{ fontFamily: ff, fontSize: `${size}px`, lineHeight: '1.3' }}>
              {customText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

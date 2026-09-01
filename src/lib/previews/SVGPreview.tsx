import React, { useEffect, useState } from 'react';

interface Props {
  url: string;
  content?: string;
}

export const SVGPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [svg, setSvg] = useState<string>(propContent || '');
  const [view, setView] = useState<'rendered' | 'source'>('rendered');
  const [loading, setLoading] = useState(!propContent);

  useEffect(() => {
    if (propContent) { setSvg(propContent); setLoading(false); return; }
    fetch(url).then(r => r.text()).then(t => { setSvg(t); setLoading(false); }).catch(() => setLoading(false));
  }, [url, propContent]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', gap: '4px', padding: '6px 12px',
        borderBottom: '1px solid var(--rfp-border, #e2e8f0)', flexShrink: 0,
      }}>
        {(['rendered', 'source'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '3px 10px', border: '1px solid var(--rfp-border, #e2e8f0)',
              borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
              backgroundColor: view === v ? 'var(--rfp-border, #e2e8f0)' : 'transparent',
              color: 'var(--rfp-text, #1a202c)',
            }}
          >
            {v === 'rendered' ? 'Preview' : 'Source'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'rendered' ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            width: '100%', height: '100%',
            backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
            backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}>
            <div
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        ) : (
          <pre style={{
            margin: 0, padding: '16px', fontSize: '13px', lineHeight: '1.5',
            fontFamily: '"SF Mono", Menlo, Consolas, monospace', whiteSpace: 'pre-wrap',
          }}>
            {svg}
          </pre>
        )}
      </div>
    </div>
  );
};

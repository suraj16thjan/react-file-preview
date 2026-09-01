import React, { useEffect, useState, useRef } from 'react';

interface Props {
  url: string;
  content?: string;
}

export const HTMLPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [html, setHtml] = useState<string>(propContent || '');
  const [view, setView] = useState<'rendered' | 'source'>('rendered');
  const [loading, setLoading] = useState(!propContent);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (propContent) { setHtml(propContent); setLoading(false); return; }
    fetch(url).then(r => r.text()).then(t => { setHtml(t); setLoading(false); }).catch(() => setLoading(false));
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
          <iframe
            ref={iframeRef}
            srcDoc={html}
            sandbox="allow-scripts"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="HTML Preview"
          />
        ) : (
          <pre style={{
            margin: 0, padding: '16px', fontSize: '13px', lineHeight: '1.5',
            fontFamily: '"SF Mono", Menlo, Consolas, monospace', whiteSpace: 'pre-wrap',
          }}>
            {html}
          </pre>
        )}
      </div>
    </div>
  );
};

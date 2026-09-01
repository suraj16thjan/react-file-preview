import React, { useEffect, useState } from 'react';

interface Props {
  url: string;
  content?: string;
}

export const TextPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [text, setText] = useState<string>(propContent || '');
  const [loading, setLoading] = useState(!propContent);

  useEffect(() => {
    if (propContent) { setText(propContent); setLoading(false); return; }
    fetch(url)
      .then(r => r.text())
      .then(t => { setText(t); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url, propContent]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;

  return (
    <pre style={{
      margin: 0, padding: '16px', width: '100%', height: '100%',
      overflow: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
      fontSize: '13px', lineHeight: '1.6',
      fontFamily: '"SF Mono", "Fira Code", Menlo, Consolas, monospace',
    }}>
      {text}
    </pre>
  );
};

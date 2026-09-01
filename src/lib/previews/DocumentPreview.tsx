import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

interface Props {
  url: string;
  fileName: string;
}

const DOC_STYLES = `
.rfp-doc { padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.7; font-size: 15px; overflow: auto; height: 100%; }
.rfp-doc h1 { font-size: 2em; margin: 1em 0 0.5em; }
.rfp-doc h2 { font-size: 1.5em; margin: 1em 0 0.5em; }
.rfp-doc h3 { font-size: 1.25em; margin: 1em 0 0.5em; }
.rfp-doc p { margin: 0.7em 0; }
.rfp-doc table { border-collapse: collapse; width: 100%; margin: 1em 0; }
.rfp-doc th, .rfp-doc td { border: 1px solid var(--rfp-border, #dfe2e5); padding: 8px 12px; }
.rfp-doc img { max-width: 100%; }
.rfp-doc ul, .rfp-doc ol { padding-left: 2em; }
`;

export const DocumentPreview: React.FC<Props> = ({ url, fileName }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (ext === 'docx') {
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => mammoth.convertToHtml({ arrayBuffer: buf }))
        .then(result => { setHtml(result.value); setLoading(false); })
        .catch(e => { setError(e.message); setLoading(false); });
    } else if (ext === 'rtf') {
      fetch(url)
        .then(r => r.text())
        .then(text => {
          const plain = text.replace(/\{\\[^{}]*\}/g, '').replace(/\\[a-z]+\d* ?/g, '').replace(/[{}]/g, '');
          setHtml(`<pre style="white-space: pre-wrap;">${plain}</pre>`);
          setLoading(false);
        })
        .catch(e => { setError(e.message); setLoading(false); });
    } else {
      setError(`Preview not available for .${ext} files. Only .docx and .rtf are supported.`);
      setLoading(false);
    }
  }, [url, fileName]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading document...</div>;
  if (error) return <div style={{ padding: '20px', color: '#e53e3e' }}>{error}</div>;

  return (
    <>
      <style>{DOC_STYLES}</style>
      <div className="rfp-doc" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

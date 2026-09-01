import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js';

interface Props {
  url: string;
  content?: string;
}

export const XMLPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highlight = (text: string) => {
      try {
        const formatted = formatXml(text);
        const result = hljs.highlight(formatted, { language: 'xml', ignoreIllegals: true });
        setHtml(result.value);
      } catch {
        setHtml(escapeHtml(text));
      }
      setLoading(false);
    };

    if (propContent) { highlight(propContent); return; }
    fetch(url).then(r => r.text()).then(highlight).catch(() => setLoading(false));
  }, [url, propContent]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;

  return (
    <pre
      style={{
        margin: 0, padding: '16px', width: '100%', height: '100%', overflow: 'auto',
        fontSize: '13px', lineHeight: '1.5',
        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

function formatXml(xml: string): string {
  let formatted = '';
  let indent = '';
  const lines = xml.replace(/>\s*</g, '>\n<').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('</')) indent = indent.slice(2);
    formatted += indent + trimmed + '\n';
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')
      && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
      indent += '  ';
    }
  }
  return formatted.trim();
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

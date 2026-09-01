import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js';
import { getLanguage } from '../utils/fileTypes';

interface Props {
  url: string;
  fileName: string;
  content?: string;
}

const THEME_CSS = `
.rfp-code .hljs { background: transparent; color: inherit; }
.rfp-code .hljs-keyword, .rfp-code .hljs-selector-tag { color: #d73a49; }
.rfp-code .hljs-string, .rfp-code .hljs-attr { color: #032f62; }
.rfp-code .hljs-comment, .rfp-code .hljs-quote { color: #6a737d; font-style: italic; }
.rfp-code .hljs-number, .rfp-code .hljs-literal { color: #005cc5; }
.rfp-code .hljs-built_in, .rfp-code .hljs-builtin-name { color: #e36209; }
.rfp-code .hljs-function .hljs-title, .rfp-code .hljs-title.function_ { color: #6f42c1; }
.rfp-code .hljs-type, .rfp-code .hljs-title.class_ { color: #22863a; }
.rfp-code .hljs-meta { color: #735c0f; }
.rfp-code .hljs-tag { color: #22863a; }
.rfp-code .hljs-name { color: #22863a; }
.rfp-code .hljs-attribute { color: #6f42c1; }
.rfp-code .hljs-symbol, .rfp-code .hljs-bullet { color: #005cc5; }
.rfp-code .hljs-addition { color: #22863a; background: #f0fff4; }
.rfp-code .hljs-deletion { color: #b31d28; background: #ffeef0; }
`;

export const CodePreview: React.FC<Props> = ({ url, fileName, content: propContent }) => {
  const [code, setCode] = useState<string>(propContent || '');
  const [loading, setLoading] = useState(!propContent);
  const [lineCount, setLineCount] = useState(0);
  const codeRef = useRef<HTMLElement>(null);
  const lang = getLanguage(fileName);

  useEffect(() => {
    if (propContent) { setCode(propContent); setLoading(false); return; }
    fetch(url)
      .then(r => r.text())
      .then(text => { setCode(text); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url, propContent]);

  useEffect(() => {
    if (!code || !codeRef.current) return;
    setLineCount(code.split('\n').length);
    try {
      if (lang !== 'plaintext') {
        codeRef.current.innerHTML = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
      } else {
        const result = hljs.highlightAuto(code);
        codeRef.current.innerHTML = result.value;
      }
    } catch {
      codeRef.current.textContent = code;
    }
  }, [code, lang]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;
  }

  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="rfp-code" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <style>{THEME_CSS}</style>
      <div style={{ display: 'flex', minHeight: '100%' }}>
        <div style={{
          padding: '12px 0', textAlign: 'right', userSelect: 'none',
          color: 'var(--rfp-muted, #a0aec0)', fontSize: '13px', lineHeight: '1.5',
          fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
          borderRight: '1px solid var(--rfp-border, #e2e8f0)',
          position: 'sticky', left: 0, backgroundColor: 'var(--rfp-header-bg, #f7fafc)',
          minWidth: `${String(lineCount).length * 10 + 24}px`,
          flexShrink: 0,
        }}>
          {lines.map(n => (
            <div key={n} style={{ paddingRight: '12px', paddingLeft: '12px' }}>{n}</div>
          ))}
        </div>
        <pre style={{
          margin: 0, padding: '12px 16px', flex: 1,
          fontSize: '13px', lineHeight: '1.5', overflow: 'visible',
          fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
        }}>
          <code ref={codeRef}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

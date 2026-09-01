import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface Props {
  url: string;
  content?: string;
}

const MD_STYLES = `
.rfp-md { padding: 24px 32px; line-height: 1.7; font-size: 15px; overflow: auto; height: 100%; }
.rfp-md h1, .rfp-md h2, .rfp-md h3, .rfp-md h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
.rfp-md h1 { font-size: 2em; border-bottom: 1px solid var(--rfp-border, #e2e8f0); padding-bottom: 0.3em; }
.rfp-md h2 { font-size: 1.5em; border-bottom: 1px solid var(--rfp-border, #e2e8f0); padding-bottom: 0.3em; }
.rfp-md h3 { font-size: 1.25em; }
.rfp-md p { margin: 0.8em 0; }
.rfp-md code { background: var(--rfp-header-bg, #f6f8fa); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; font-family: "SF Mono", Menlo, Consolas, monospace; }
.rfp-md pre { background: var(--rfp-header-bg, #f6f8fa); padding: 16px; border-radius: 6px; overflow-x: auto; }
.rfp-md pre code { background: transparent; padding: 0; }
.rfp-md blockquote { border-left: 4px solid var(--rfp-border, #dfe2e5); margin: 0; padding: 0 16px; color: var(--rfp-muted, #6a737d); }
.rfp-md table { border-collapse: collapse; width: 100%; margin: 1em 0; }
.rfp-md th, .rfp-md td { border: 1px solid var(--rfp-border, #dfe2e5); padding: 8px 12px; text-align: left; }
.rfp-md th { background: var(--rfp-header-bg, #f6f8fa); font-weight: 600; }
.rfp-md img { max-width: 100%; border-radius: 4px; }
.rfp-md a { color: #4a90d9; text-decoration: none; }
.rfp-md a:hover { text-decoration: underline; }
.rfp-md ul, .rfp-md ol { padding-left: 2em; }
.rfp-md li { margin: 0.3em 0; }
.rfp-md hr { border: none; border-top: 1px solid var(--rfp-border, #e2e8f0); margin: 2em 0; }
.rfp-md input[type="checkbox"] { margin-right: 6px; }
`;

export const MarkdownPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const render = async (text: string) => {
      const result = await marked.parse(text, { gfm: true, breaks: true });
      setHtml(result);
      setLoading(false);
    };

    if (propContent) { render(propContent); return; }

    fetch(url)
      .then(r => r.text())
      .then(render)
      .catch(() => setLoading(false));
  }, [url, propContent]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;

  return (
    <>
      <style>{MD_STYLES}</style>
      <div className="rfp-md" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

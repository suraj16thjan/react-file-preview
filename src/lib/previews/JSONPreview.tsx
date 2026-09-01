import React, { useEffect, useState, useCallback } from 'react';

interface Props {
  url: string;
  content?: string;
}

interface TreeNodeProps {
  keyName?: string;
  value: unknown;
  depth: number;
  last: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ keyName, value, depth, last }) => {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = depth * 20;

  if (value === null) {
    return (
      <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
        {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
        {keyName !== undefined && <span>: </span>}
        <span style={{ color: '#6a737d', fontStyle: 'italic' }}>null</span>
        {!last && ','}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
        {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
        {keyName !== undefined && <span>: </span>}
        <span style={{ color: '#005cc5' }}>{String(value)}</span>
        {!last && ','}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
        {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
        {keyName !== undefined && <span>: </span>}
        <span style={{ color: '#005cc5' }}>{value}</span>
        {!last && ','}
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
        {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
        {keyName !== undefined && <span>: </span>}
        <span style={{ color: '#032f62' }}>"{value}"</span>
        {!last && ','}
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
          {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
          {keyName !== undefined && <span>: </span>}
          <span>[]</span>
          {!last && ','}
        </div>
      );
    }
    return (
      <div>
        <div
          style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span style={{ color: '#6a737d', marginRight: '4px' }}>{collapsed ? '▶' : '▼'}</span>
          {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
          {keyName !== undefined && <span>: </span>}
          <span>[</span>
          {collapsed && <span style={{ color: '#6a737d' }}> {value.length} items ]</span>}
          {collapsed && !last && ','}
        </div>
        {!collapsed && (
          <>
            {value.map((item, i) => (
              <TreeNode key={i} value={item} depth={depth + 1} last={i === value.length - 1} />
            ))}
            <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
              ]{!last && ','}
            </div>
          </>
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
          {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
          {keyName !== undefined && <span>: </span>}
          <span>{'{}'}</span>
          {!last && ','}
        </div>
      );
    }
    return (
      <div>
        <div
          style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span style={{ color: '#6a737d', marginRight: '4px' }}>{collapsed ? '▶' : '▼'}</span>
          {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
          {keyName !== undefined && <span>: </span>}
          <span>{'{'}</span>
          {collapsed && <span style={{ color: '#6a737d' }}> {entries.length} keys {'}'}</span>}
          {collapsed && !last && ','}
        </div>
        {!collapsed && (
          <>
            {entries.map(([k, v], i) => (
              <TreeNode key={k} keyName={k} value={v} depth={depth + 1} last={i === entries.length - 1} />
            ))}
            <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
              {'}'}{!last && ','}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: indent, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
      {keyName !== undefined && <span style={{ color: '#d73a49' }}>"{keyName}"</span>}
      {keyName !== undefined && <span>: </span>}
      <span>{String(value)}</span>
      {!last && ','}
    </div>
  );
};

export const JSONPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [data, setData] = useState<unknown>(null);
  const [raw, setRaw] = useState('');
  const [loading, setLoading] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [view, setView] = useState<'tree' | 'raw'>('tree');

  const parse = useCallback((text: string) => {
    setRaw(text);
    try {
      setData(JSON.parse(text));
      setParseError(null);
    } catch (e) {
      setParseError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (propContent) { parse(propContent); return; }
    fetch(url).then(r => r.text()).then(parse).catch(() => setLoading(false));
  }, [url, propContent, parse]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', gap: '4px', padding: '6px 12px',
        borderBottom: '1px solid var(--rfp-border, #e2e8f0)', flexShrink: 0,
      }}>
        {(['tree', 'raw'] as const).map(v => (
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
            {v === 'tree' ? 'Tree' : 'Raw'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {parseError ? (
          <div>
            <div style={{ color: '#e53e3e', marginBottom: '12px', fontSize: '13px' }}>Parse Error: {parseError}</div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px', fontFamily: 'monospace' }}>{raw}</pre>
          </div>
        ) : view === 'tree' ? (
          <TreeNode value={data} depth={0} last />
        ) : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px', fontFamily: 'monospace' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Props {
  url: string;
  content?: string;
}

const CELL_STYLE: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--rfp-border, #e2e8f0)',
  borderRight: '1px solid var(--rfp-border, #e2e8f0)',
  whiteSpace: 'nowrap',
  maxWidth: '300px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '13px',
};

export const CSVPreview: React.FC<Props> = ({ url, content: propContent }) => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parse = (text: string) => {
      const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
      setData(result.data);
      setLoading(false);
    };

    if (propContent) { parse(propContent); return; }

    fetch(url)
      .then(r => r.text())
      .then(parse)
      .catch(() => setLoading(false));
  }, [url, propContent]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading...</div>;
  if (data.length === 0) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>No data</div>;

  const headers = data[0];
  const rows = data.slice(1);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{
        padding: '8px 12px', fontSize: '12px', color: 'var(--rfp-muted, #718096)',
        borderBottom: '1px solid var(--rfp-border, #e2e8f0)',
        position: 'sticky', top: 0, backgroundColor: 'var(--rfp-bg, #fff)', zIndex: 1,
      }}>
        {rows.length} rows × {headers.length} columns
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content' }}>
        <thead>
          <tr>
            <th style={{
              ...CELL_STYLE, fontWeight: 600,
              backgroundColor: 'var(--rfp-header-bg, #f7fafc)',
              position: 'sticky', top: '33px', zIndex: 1,
              width: '50px', textAlign: 'center', color: 'var(--rfp-muted, #718096)',
            }}>
              #
            </th>
            {headers.map((h, i) => (
              <th key={i} style={{
                ...CELL_STYLE, fontWeight: 600,
                backgroundColor: 'var(--rfp-header-bg, #f7fafc)',
                position: 'sticky', top: '33px', zIndex: 1,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? 'transparent' : 'var(--rfp-header-bg, #f7fafc)' }}>
              <td style={{ ...CELL_STYLE, textAlign: 'center', color: 'var(--rfp-muted, #a0aec0)', fontSize: '12px' }}>
                {ri + 1}
              </td>
              {row.map((cell, ci) => (
                <td key={ci} style={CELL_STYLE} title={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

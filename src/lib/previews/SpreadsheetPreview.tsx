import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface Props {
  url: string;
  fileName: string;
}

export const SpreadsheetPreview: React.FC<Props> = ({ url }) => {
  const [sheets, setSheets] = useState<Record<string, string[][]>>({});
  const [activeSheet, setActiveSheet] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf, { type: 'array' });
        const result: Record<string, string[][]> = {};
        for (const name of wb.SheetNames) {
          result[name] = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[name], { header: 1 });
        }
        setSheets(result);
        setActiveSheet(wb.SheetNames[0]);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [url]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading spreadsheet...</div>;
  if (error) return <div style={{ padding: '20px', color: '#e53e3e' }}>Error: {error}</div>;

  const data = sheets[activeSheet] || [];
  const sheetNames = Object.keys(sheets);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {sheetNames.length > 1 && (
        <div style={{
          display: 'flex', gap: '2px', padding: '6px 12px', overflowX: 'auto',
          borderBottom: '1px solid var(--rfp-border, #e2e8f0)', flexShrink: 0,
        }}>
          {sheetNames.map(name => (
            <button
              key={name}
              onClick={() => setActiveSheet(name)}
              style={{
                padding: '4px 12px', border: '1px solid var(--rfp-border, #e2e8f0)',
                borderRadius: '4px 4px 0 0', cursor: 'pointer', fontSize: '12px',
                backgroundColor: activeSheet === name ? 'var(--rfp-bg, #fff)' : 'var(--rfp-header-bg, #f7fafc)',
                borderBottom: activeSheet === name ? '2px solid #4a90d9' : 'none',
                color: 'var(--rfp-text, #1a202c)', whiteSpace: 'nowrap',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content' }}>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} style={{ backgroundColor: ri === 0 ? 'var(--rfp-header-bg, #f7fafc)' : ri % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={{
                  padding: '6px 10px', borderBottom: '1px solid var(--rfp-border, #e2e8f0)',
                  borderRight: '1px solid var(--rfp-border, #e2e8f0)',
                  textAlign: 'center', fontSize: '11px', color: 'var(--rfp-muted, #a0aec0)',
                  backgroundColor: 'var(--rfp-header-bg, #f7fafc)', position: 'sticky', left: 0,
                  fontWeight: ri === 0 ? 600 : 400, minWidth: '40px',
                }}>
                  {ri === 0 ? '' : ri}
                </td>
                {(row as unknown[]).map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '6px 10px', fontSize: '13px',
                    borderBottom: '1px solid var(--rfp-border, #e2e8f0)',
                    borderRight: '1px solid var(--rfp-border, #e2e8f0)',
                    whiteSpace: 'nowrap', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis',
                    fontWeight: ri === 0 ? 600 : 400,
                  }}>
                    {cell != null ? String(cell) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { formatFileSize } from '../utils/fileTypes';

interface Props {
  url: string;
  fileName: string;
}

interface ArchiveEntry {
  name: string;
  size: number;
  compressed: number;
  isDir: boolean;
  date: Date | null;
}

export const ArchivePreview: React.FC<Props> = ({ url, fileName }) => {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext !== 'zip') {
      setError(`Archive listing is only available for .zip files. For .${ext} files, extraction requires server-side support.`);
      setLoading(false);
      return;
    }

    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => JSZip.loadAsync(buf))
      .then(zip => {
        const items: ArchiveEntry[] = [];
        zip.forEach((path, entry) => {
          const data = entry as unknown as Record<string, { uncompressedSize?: number; compressedSize?: number }>;
          items.push({
            name: path,
            size: data._data?.uncompressedSize || 0,
            compressed: data._data?.compressedSize || 0,
            isDir: entry.dir,
            date: entry.date,
          });
        });
        items.sort((a, b) => {
          if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        setEntries(items);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [url, fileName]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Reading archive...</div>;
  if (error) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>{error}</div>;

  const filtered = entries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = entries.reduce((acc, e) => acc + e.size, 0);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid var(--rfp-border, #e2e8f0)', flexShrink: 0,
        fontSize: '12px', color: 'var(--rfp-muted, #718096)', gap: '12px',
      }}>
        <span>{entries.length} entries · {formatFileSize(totalSize)} uncompressed</span>
        <input
          type="text"
          placeholder="Filter files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '4px 8px', border: '1px solid var(--rfp-border, #e2e8f0)',
            borderRadius: '4px', fontSize: '12px', width: '200px',
            backgroundColor: 'var(--rfp-bg, #fff)', color: 'var(--rfp-text, #1a202c)',
          }}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--rfp-header-bg, #f7fafc)', position: 'sticky', top: 0 }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--rfp-border, #e2e8f0)' }}>Name</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--rfp-border, #e2e8f0)', whiteSpace: 'nowrap' }}>Size</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--rfp-border, #e2e8f0)', whiteSpace: 'nowrap' }}>Modified</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--rfp-border, #edf2f7)', fontFamily: 'monospace', fontSize: '12px' }}>
                  <span style={{ marginRight: '6px' }}>{entry.isDir ? '📁' : '📄'}</span>
                  {entry.name}
                </td>
                <td style={{ padding: '6px 12px', textAlign: 'right', borderBottom: '1px solid var(--rfp-border, #edf2f7)', whiteSpace: 'nowrap', color: 'var(--rfp-muted, #718096)', fontSize: '12px' }}>
                  {entry.isDir ? '—' : formatFileSize(entry.size)}
                </td>
                <td style={{ padding: '6px 12px', textAlign: 'right', borderBottom: '1px solid var(--rfp-border, #edf2f7)', whiteSpace: 'nowrap', color: 'var(--rfp-muted, #718096)', fontSize: '12px' }}>
                  {entry.date ? entry.date.toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { FilePreview } from './lib';
import { sampleFiles, createBlobUrl } from './demo/sampleFiles';

const CATEGORIES = ['All', ...Array.from(new Set(sampleFiles.map(f => f.category)))];

function App() {
  const [activeFile, setActiveFile] = useState(sampleFiles[0]);
  const [droppedFile, setDroppedFile] = useState<{ url: string; name: string; size: number } | null>(null);
  const [droppedContent, setDroppedContent] = useState<string | undefined>();
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUrl = useMemo(() => {
    if (droppedFile) return droppedFile.url;
    if (activeFile.content) return createBlobUrl(activeFile.content);
    return activeFile.url || '';
  }, [activeFile, droppedFile]);

  const activeName = droppedFile ? droppedFile.name : activeFile.name;
  const activeSize = droppedFile ? droppedFile.size : activeFile.content?.length;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    loadFile(file);
  }, []);

  const loadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setDroppedFile({ url, name: file.name, size: file.size });
    setDroppedContent(undefined);

    const textTypes = ['text/', 'application/json', 'application/xml', 'application/javascript'];
    if (textTypes.some(t => file.type.startsWith(t)) || file.name.match(/\.(md|csv|txt|log|yml|yaml|toml|ini|cfg|conf|env|tsx?|jsx?|py|rb|rs|go|java|c|cpp|h|swift|kt|sh|sql|graphql)$/i)) {
      file.text().then(text => setDroppedContent(text));
    }
  };

  const filtered = filter === 'All' ? sampleFiles : sampleFiles.filter(f => f.category === filter);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '48px 24px 40px', textAlign: 'center', color: '#fff',
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 8px' }}>
          React File Preview
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: 0, maxWidth: '600px', marginInline: 'auto' }}>
          Universal file preview component supporting 100+ file formats.
          Drop any file or pick a sample below.
        </p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#667eea' : '#cbd5e0'}`,
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '32px',
            backgroundColor: dragOver ? '#f0f0ff' : '#fff',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#4a5568' }}>
            Drop a file here or click to browse
          </div>
          <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '4px' }}>
            Supports images, videos, audio, documents, code, data files, archives, fonts, 3D models, and more
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) loadFile(file);
            }}
          />
        </div>

        {/* Sample file tabs */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setDroppedFile(null); }}
                style={{
                  padding: '6px 14px', borderRadius: '20px', border: 'none',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  backgroundColor: filter === cat ? '#667eea' : '#e2e8f0',
                  color: filter === cat ? '#fff' : '#4a5568',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filtered.map(file => (
              <button
                key={file.name}
                onClick={() => { setActiveFile(file); setDroppedFile(null); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  border: `2px solid ${!droppedFile && activeFile.name === file.name ? '#667eea' : '#e2e8f0'}`,
                  cursor: 'pointer', fontSize: '13px',
                  backgroundColor: !droppedFile && activeFile.name === file.name ? '#f0f0ff' : '#fff',
                  color: '#2d3748', transition: 'all 0.15s',
                  fontFamily: '"SF Mono", Menlo, monospace',
                }}
              >
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{ marginTop: '24px' }}>
          <FilePreview
            url={activeUrl}
            fileName={activeName}
            fileSize={activeSize}
            content={droppedContent || (activeFile.content && !droppedFile ? activeFile.content : undefined)}
            height={600}
          />
        </div>

        {/* Supported types */}
        <section style={{ marginTop: '48px', padding: '32px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 20px', color: '#2d3748' }}>
            Supported File Types
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🖼', title: 'Images', types: 'PNG, JPG, GIF, WebP, SVG, BMP, ICO, TIFF, AVIF' },
              { icon: '🎬', title: 'Video', types: 'MP4, WebM, OGG, MOV, AVI, MKV' },
              { icon: '🎵', title: 'Audio', types: 'MP3, WAV, FLAC, AAC, OGG, M4A, Opus' },
              { icon: '📕', title: 'PDF', types: 'PDF documents with native browser rendering' },
              { icon: '💻', title: 'Code', types: 'JS, TS, Python, Rust, Go, Java, C/C++, Swift, Ruby, PHP, and 50+ more' },
              { icon: '📑', title: 'Markdown', types: 'MD, MDX with GFM rendering, tables, code blocks' },
              { icon: '📊', title: 'Data', types: 'CSV, TSV, JSON (tree view), XML, XLSX, XLS' },
              { icon: '📄', title: 'Documents', types: 'DOCX, RTF with formatted rendering' },
              { icon: '🌐', title: 'Web', types: 'HTML (rendered + source), SVG (rendered + source)' },
              { icon: '📦', title: 'Archives', types: 'ZIP with file listing, search, and metadata' },
              { icon: '🔤', title: 'Fonts', types: 'TTF, OTF, WOFF, WOFF2 with character preview' },
              { icon: '🧊', title: '3D Models', types: 'STL, OBJ with interactive 3D viewer' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#f7fafc' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#2d3748' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#718096', lineHeight: '1.4', marginTop: '2px' }}>{item.types}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '32px', color: '#a0aec0', fontSize: '13px' }}>
        react-file-preview — Universal file previews for React
      </footer>
    </div>
  );
}

export default App;

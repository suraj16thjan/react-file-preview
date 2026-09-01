# react-file-preview

Universal file preview component for React. Supports 100+ file formats out of the box with automatic type detection, lazy-loaded previewers, and zero required configuration.

**19 KB** gzipped. Each previewer is its own chunk — only the code for the file type you're viewing is loaded.

## Install

```bash
npm install react-file-preview
```

## Quick Start

```tsx
import { FilePreview } from 'react-file-preview';

function App() {
  return (
    <FilePreview
      url="/path/to/file.pdf"
      fileName="document.pdf"
      height={600}
    />
  );
}
```

### Preview a dropped file

```tsx
function DropPreview() {
  const [file, setFile] = useState<{ url: string; name: string } | null>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    setFile({ url: URL.createObjectURL(f), name: f.name });
  };

  if (!file) return <div onDragOver={e => e.preventDefault()} onDrop={onDrop}>Drop a file</div>;

  return <FilePreview url={file.url} fileName={file.name} height={500} />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | — | URL to the file (required) |
| `fileName` | `string` | — | File name for type detection (required) |
| `fileSize` | `number` | — | File size in bytes, shown in header |
| `content` | `string` | — | Raw text content — skips fetch for text-based files |
| `height` | `string \| number` | `500` | Container height |
| `width` | `string \| number` | `'100%'` | Container width |
| `showHeader` | `boolean` | `true` | Show the file info header bar |
| `forceType` | `FileCategory` | — | Override automatic type detection |
| `loadingFallback` | `ReactNode` | — | Custom loading indicator while a previewer chunk loads |
| `className` | `string` | — | Class name on the container |
| `style` | `CSSProperties` | — | Inline styles on the container |

## Supported File Types

| Category | Extensions | Previewer |
|----------|-----------|-----------|
| **Images** | png, jpg, gif, webp, bmp, ico, tiff, avif, apng | Zoom, pan, checkerboard background, dimensions |
| **Video** | mp4, webm, ogg, mov, avi, mkv, m4v, flv, wmv | Native player with controls |
| **Audio** | mp3, wav, flac, aac, ogg, m4a, opus | Waveform visualizer, custom player |
| **PDF** | pdf | Native browser rendering |
| **Code** | js, ts, py, go, rs, java, c, cpp, swift, rb, php, and 50+ more | Syntax highlighting, line numbers |
| **Markdown** | md, mdx | GFM rendering — tables, code blocks, checkboxes |
| **CSV** | csv, tsv | Parsed table with row/column counts |
| **JSON** | json, jsonl, geojson | Collapsible tree view + raw toggle |
| **XML** | xml, xsl, rss, atom, plist | Auto-formatted + syntax highlighted |
| **HTML** | html, htm | Sandboxed rendered preview + source toggle |
| **SVG** | svg | Inline rendered preview + source toggle |
| **Spreadsheet** | xlsx, xls, ods | Multi-sheet tabs, cell rendering |
| **Document** | docx, rtf | Formatted document rendering |
| **Archive** | zip | File listing with search, sizes, dates |
| **Font** | ttf, otf, woff, woff2 | Character set, size ramp, custom text input |
| **3D Models** | stl, obj | Interactive 3D viewer with orbit controls |
| **Email** | eml | Header parsing + body display |

## Architecture

All 19 previewers are **lazy-loaded** via `React.lazy`. When a consumer renders `<FilePreview fileName="photo.png" />`, only the `ImagePreview` chunk is fetched — the spreadsheet, 3D, and document previewers stay out of the bundle entirely.

Heavy third-party libraries (`highlight.js`, `marked`, `papaparse`, `mammoth`, `xlsx`, `jszip`, `three`) are **externalized** — they're resolved from the consumer's `node_modules` at build time, not re-bundled inside this package. Each preview chunk in the published dist is just a few KB of component code.

```
dist/index.js          5.6 KB   ← entry point + FilePreview shell
dist/CodePreview.js    3.5 KB   ← imports highlight.js from node_modules
dist/CSVPreview.js     2.8 KB   ← imports papaparse from node_modules
dist/JSONPreview.js    8.2 KB   ← zero deps, pure React
...
```

### Dependency tiers

| Tier | Packages | Installed when |
|------|----------|----------------|
| **Required** | `highlight.js`, `marked`, `papaparse` | Always — needed for code, markdown, CSV |
| **Optional** | `mammoth`, `xlsx`, `jszip` | Only if you preview .docx, .xlsx, or .zip files |
| **Optional** | `three`, `@react-three/fiber`, `@react-three/drei` | Only if you preview 3D models (.stl, .obj) |
| **Peer** | `react`, `react-dom` | Your app already has these |

Install optional deps only for the file types you need:

```bash
# For .docx support
npm install mammoth

# For .xlsx/.xls support
npm install xlsx

# For .zip archive listing
npm install jszip

# For 3D model preview
npm install three @react-three/fiber @react-three/drei
```

## Utilities

The package also exports helper functions:

```tsx
import { getFileCategory, getExtension, formatFileSize, getMimeType } from 'react-file-preview';

getFileCategory('report.xlsx');  // 'spreadsheet'
getExtension('photo.jpg');       // 'jpg'
formatFileSize(1048576);         // '1 MB'
getMimeType('style.css');        // 'text/css'
```

## Theming

The component uses CSS custom properties with sensible defaults. Override them on a parent element:

```css
.my-preview {
  --rfp-bg: #1a1a2e;
  --rfp-text: #e2e8f0;
  --rfp-border: #2d3748;
  --rfp-header-bg: #2a2a4a;
  --rfp-muted: #718096;
  --rfp-badge-bg: #2d3748;
  --rfp-checker: #2a2a4a;
}
```

## Development

```bash
npm install
npm run dev          # Start demo app at localhost:5173
npm run build:lib    # Build the library to dist/
```

## License

MIT

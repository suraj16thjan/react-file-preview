export interface SampleFile {
  name: string;
  category: string;
  content?: string;
  url?: string;
}

const SAMPLE_JSON = JSON.stringify({
  name: "react-file-preview",
  version: "1.0.0",
  description: "Universal file preview component for React",
  features: ["Images", "Videos", "Audio", "PDF", "Code", "Markdown", "CSV", "JSON", "XML", "HTML", "SVG", "Spreadsheets", "Documents", "Archives", "Fonts", "3D Models", "Email"],
  config: {
    theme: "auto",
    maxSize: 104857600,
    supported: true,
  },
  stats: { downloads: 42000, stars: 1280, forks: 156 },
}, null, 2);

const SAMPLE_TS = `import { useState, useEffect, useCallback } from 'react';

interface UseFilePreviewOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onError?: (error: Error) => void;
}

interface FilePreviewState {
  url: string | null;
  fileName: string;
  fileSize: number;
  loading: boolean;
  error: string | null;
}

export function useFilePreview(options: UseFilePreviewOptions = {}) {
  const { maxSize = 100 * 1024 * 1024, allowedTypes, onError } = options;
  const [state, setState] = useState<FilePreviewState>({
    url: null,
    fileName: '',
    fileSize: 0,
    loading: false,
    error: null,
  });

  const preview = useCallback((file: File) => {
    if (file.size > maxSize) {
      const err = new Error(\`File too large: \${file.size} bytes\`);
      onError?.(err);
      setState(s => ({ ...s, error: err.message }));
      return;
    }

    if (allowedTypes && !allowedTypes.some(t => file.name.endsWith(t))) {
      const err = new Error(\`Unsupported file type: \${file.name}\`);
      onError?.(err);
      setState(s => ({ ...s, error: err.message }));
      return;
    }

    setState({ url: null, fileName: file.name, fileSize: file.size, loading: true, error: null });
    const url = URL.createObjectURL(file);
    setState(s => ({ ...s, url, loading: false }));
  }, [maxSize, allowedTypes, onError]);

  useEffect(() => {
    return () => {
      if (state.url) URL.revokeObjectURL(state.url);
    };
  }, [state.url]);

  return { ...state, preview };
}`;

const SAMPLE_PY = `from dataclasses import dataclass, field
from typing import Optional, List
from pathlib import Path
import hashlib
import mimetypes


@dataclass
class FileInfo:
    """Represents metadata about a file."""
    path: Path
    size: int
    mime_type: str
    checksum: str
    tags: List[str] = field(default_factory=list)

    @classmethod
    def from_path(cls, path: str | Path) -> "FileInfo":
        p = Path(path)
        if not p.exists():
            raise FileNotFoundError(f"File not found: {p}")

        size = p.stat().st_size
        mime, _ = mimetypes.guess_type(str(p))
        checksum = cls._compute_checksum(p)

        return cls(
            path=p,
            size=size,
            mime_type=mime or "application/octet-stream",
            checksum=checksum,
        )

    @staticmethod
    def _compute_checksum(path: Path, algo: str = "sha256") -> str:
        h = hashlib.new(algo)
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest()

    @property
    def extension(self) -> str:
        return self.path.suffix.lstrip(".")

    @property
    def is_text(self) -> bool:
        return self.mime_type.startswith("text/")

    def add_tag(self, tag: str) -> None:
        if tag not in self.tags:
            self.tags.append(tag)

    def __repr__(self) -> str:
        return f"FileInfo({self.path.name}, {self.size:,} bytes)"`;

const SAMPLE_CSV = `id,name,email,role,department,salary,start_date,city,status
1,Alice Chen,alice@example.com,Senior Engineer,Engineering,145000,2020-03-15,San Francisco,active
2,Bob Martinez,bob@example.com,Product Manager,Product,135000,2019-07-22,New York,active
3,Carol Williams,carol@example.com,Designer,Design,120000,2021-01-10,Austin,active
4,David Kim,david@example.com,Data Scientist,Engineering,140000,2020-09-01,Seattle,active
5,Eve Johnson,eve@example.com,Engineering Manager,Engineering,175000,2018-05-14,San Francisco,active
6,Frank Liu,frank@example.com,DevOps Engineer,Engineering,130000,2021-06-20,Remote,active
7,Grace Park,grace@example.com,UX Researcher,Design,115000,2022-02-01,Chicago,active
8,Henry Adams,henry@example.com,Backend Engineer,Engineering,138000,2020-11-15,Denver,on_leave
9,Iris Patel,iris@example.com,Frontend Engineer,Engineering,132000,2021-08-30,Portland,active
10,Jack Thompson,jack@example.com,QA Lead,Engineering,128000,2019-12-01,Boston,active`;

const SAMPLE_MD = `# React File Preview

A comprehensive file preview component for React applications.

## Features

- **Universal Support** — Preview 100+ file types out of the box
- **Zero Configuration** — Automatic file type detection
- **Customizable** — Full control over styling and behavior
- **Tree-shakeable** — Only bundle the previewers you use

## Quick Start

\`\`\`tsx
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
\`\`\`

## Supported File Types

| Category | Extensions |
|----------|-----------|
| Images | png, jpg, gif, svg, webp, bmp, ico, tiff, avif |
| Video | mp4, webm, ogg, mov, avi, mkv |
| Audio | mp3, wav, flac, aac, ogg, m4a |
| Documents | pdf, docx, rtf, txt, md |
| Data | json, csv, xml, xlsx, xls |
| Code | js, ts, py, go, rs, java, c, cpp, and 50+ more |
| Archives | zip, tar, gz, 7z |
| Fonts | ttf, otf, woff, woff2 |
| 3D | stl, obj, gltf, glb |

> **Note:** Some formats require additional processing and may have limited support in browser environments.

## API

### Props

- \`url\` — URL to the file (required)
- \`fileName\` — Name of the file for type detection (required)
- \`fileSize\` — File size in bytes (optional, shown in header)
- \`content\` — Raw text content (optional, skips fetch for text-based files)
- \`height\` — Container height (default: 500)
- \`width\` — Container width (default: '100%')
- \`showHeader\` — Show file header bar (default: true)
- \`forceType\` — Override automatic type detection

---

*Built with TypeScript, React, and love.*`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <books>
    <book isbn="978-0-13-468599-1">
      <title>The Pragmatic Programmer</title>
      <authors>
        <author>David Thomas</author>
        <author>Andrew Hunt</author>
      </authors>
      <year>2019</year>
      <edition>20th Anniversary</edition>
      <publisher>Addison-Wesley</publisher>
      <topics>
        <topic>Software Development</topic>
        <topic>Programming</topic>
        <topic>Best Practices</topic>
      </topics>
    </book>
    <book isbn="978-0-596-51774-8">
      <title>JavaScript: The Good Parts</title>
      <authors>
        <author>Douglas Crockford</author>
      </authors>
      <year>2008</year>
      <publisher>O'Reilly Media</publisher>
      <topics>
        <topic>JavaScript</topic>
        <topic>Web Development</topic>
      </topics>
    </book>
  </books>
  <metadata>
    <lastUpdated>2024-01-15</lastUpdated>
    <totalBooks>2</totalBooks>
  </metadata>
</library>`;

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; border-radius: 16px; padding: 40px; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { font-size: 28px; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #666; line-height: 1.6; margin: 12px 0; }
    .badge { display: inline-block; padding: 4px 12px; background: #f0f0ff; color: #667eea; border-radius: 20px; font-size: 13px; font-weight: 500; margin: 4px 2px; }
    .stats { display: flex; gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #333; }
    .stat-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>React File Preview</h1>
    <p>A universal file preview component that handles every file format you throw at it.</p>
    <div>
      <span class="badge">React</span>
      <span class="badge">TypeScript</span>
      <span class="badge">100+ formats</span>
      <span class="badge">Zero config</span>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-value">100+</div><div class="stat-label">File Types</div></div>
      <div class="stat"><div class="stat-value">18</div><div class="stat-label">Previewers</div></div>
      <div class="stat"><div class="stat-value">0</div><div class="stat-label">Config Needed</div></div>
    </div>
  </div>
</body>
</html>`;

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#f8f9ff;stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="12" fill="url(#bg)"/>
  <rect x="40" y="40" width="320" height="220" rx="12" fill="url(#card)" filter="drop-shadow(0 8px 32px rgba(0,0,0,0.15))"/>
  <text x="200" y="90" text-anchor="middle" font-family="system-ui" font-size="22" font-weight="700" fill="#333">
    📄 File Preview
  </text>
  <text x="200" y="120" text-anchor="middle" font-family="system-ui" font-size="13" fill="#888">
    Universal React Component
  </text>
  <g transform="translate(70, 150)">
    <rect width="70" height="80" rx="6" fill="#667eea" opacity="0.1"/>
    <text x="35" y="35" text-anchor="middle" font-size="24">🖼</text>
    <text x="35" y="60" text-anchor="middle" font-family="system-ui" font-size="10" fill="#667eea">Images</text>
  </g>
  <g transform="translate(165, 150)">
    <rect width="70" height="80" rx="6" fill="#764ba2" opacity="0.1"/>
    <text x="35" y="35" text-anchor="middle" font-size="24">💻</text>
    <text x="35" y="60" text-anchor="middle" font-family="system-ui" font-size="10" fill="#764ba2">Code</text>
  </g>
  <g transform="translate(260, 150)">
    <rect width="70" height="80" rx="6" fill="#667eea" opacity="0.1"/>
    <text x="35" y="35" text-anchor="middle" font-size="24">📊</text>
    <text x="35" y="60" text-anchor="middle" font-family="system-ui" font-size="10" fill="#667eea">Data</text>
  </g>
</svg>`;

const SAMPLE_RUST = `use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone)]
pub struct FileIndex {
    entries: HashMap<String, FileEntry>,
    root: PathBuf,
}

#[derive(Debug, Clone)]
struct FileEntry {
    path: PathBuf,
    size: u64,
    extension: Option<String>,
    category: FileCategory,
}

#[derive(Debug, Clone, PartialEq)]
enum FileCategory {
    Image,
    Video,
    Audio,
    Document,
    Code,
    Archive,
    Unknown,
}

impl FileIndex {
    pub fn new(root: impl AsRef<Path>) -> std::io::Result<Self> {
        let root = root.as_ref().to_path_buf();
        let mut entries = HashMap::new();

        Self::scan_directory(&root, &mut entries)?;

        Ok(Self { entries, root })
    }

    fn scan_directory(dir: &Path, entries: &mut HashMap<String, FileEntry>) -> std::io::Result<()> {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_dir() {
                Self::scan_directory(&path, entries)?;
            } else {
                let metadata = entry.metadata()?;
                let ext = path.extension().map(|e| e.to_string_lossy().to_string());
                let category = ext.as_deref().map_or(FileCategory::Unknown, categorize);

                let key = path.to_string_lossy().to_string();
                entries.insert(key, FileEntry {
                    path,
                    size: metadata.len(),
                    extension: ext,
                    category,
                });
            }
        }
        Ok(())
    }

    pub fn find_by_category(&self, category: &FileCategory) -> Vec<&FileEntry> {
        self.entries.values()
            .filter(|e| &e.category == category)
            .collect()
    }

    pub fn total_size(&self) -> u64 {
        self.entries.values().map(|e| e.size).sum()
    }
}

fn categorize(ext: &str) -> FileCategory {
    match ext.to_lowercase().as_str() {
        "png" | "jpg" | "jpeg" | "gif" | "svg" | "webp" => FileCategory::Image,
        "mp4" | "webm" | "mov" | "avi" => FileCategory::Video,
        "mp3" | "wav" | "flac" | "ogg" => FileCategory::Audio,
        "pdf" | "docx" | "txt" | "md" => FileCategory::Document,
        "rs" | "js" | "ts" | "py" | "go" | "java" => FileCategory::Code,
        "zip" | "tar" | "gz" | "7z" => FileCategory::Archive,
        _ => FileCategory::Unknown,
    }
}`;

const SAMPLE_GO = `package preview

import (
\t"crypto/sha256"
\t"fmt"
\t"io"
\t"mime"
\t"os"
\t"path/filepath"
\t"strings"
\t"sync"
)

// FileInfo holds metadata about a previewable file.
type FileInfo struct {
\tPath     string
\tName     string
\tSize     int64
\tMimeType string
\tChecksum string
\tCategory Category
}

// Category classifies files by their preview type.
type Category int

const (
\tCategoryUnknown Category = iota
\tCategoryImage
\tCategoryVideo
\tCategoryAudio
\tCategoryDocument
\tCategoryCode
\tCategoryArchive
)

func (c Category) String() string {
\tnames := [...]string{"unknown", "image", "video", "audio", "document", "code", "archive"}
\tif int(c) < len(names) {
\t\treturn names[c]
\t}
\treturn "unknown"
}

// Analyze inspects a file and returns its metadata.
func Analyze(path string) (*FileInfo, error) {
\tinfo, err := os.Stat(path)
\tif err != nil {
\t\treturn nil, fmt.Errorf("stat %s: %w", path, err)
\t}

\tchecksum, err := computeChecksum(path)
\tif err != nil {
\t\treturn nil, fmt.Errorf("checksum %s: %w", path, err)
\t}

\text := strings.ToLower(filepath.Ext(path))
\tmimeType := mime.TypeByExtension(ext)
\tif mimeType == "" {
\t\tmimeType = "application/octet-stream"
\t}

\treturn &FileInfo{
\t\tPath:     path,
\t\tName:     filepath.Base(path),
\t\tSize:     info.Size(),
\t\tMimeType: mimeType,
\t\tChecksum: checksum,
\t\tCategory: categorize(ext),
\t}, nil
}

func computeChecksum(path string) (string, error) {
\tf, err := os.Open(path)
\tif err != nil {
\t\treturn "", err
\t}
\tdefer f.Close()

\th := sha256.New()
\tif _, err := io.Copy(h, f); err != nil {
\t\treturn "", err
\t}
\treturn fmt.Sprintf("%x", h.Sum(nil)), nil
}

var categoryMap = map[string]Category{
\t".png": CategoryImage, ".jpg": CategoryImage, ".jpeg": CategoryImage,
\t".gif": CategoryImage, ".svg": CategoryImage, ".webp": CategoryImage,
\t".mp4": CategoryVideo, ".webm": CategoryVideo, ".mov": CategoryVideo,
\t".mp3": CategoryAudio, ".wav": CategoryAudio, ".flac": CategoryAudio,
\t".pdf": CategoryDocument, ".docx": CategoryDocument, ".md": CategoryDocument,
\t".go": CategoryCode, ".js": CategoryCode, ".ts": CategoryCode, ".py": CategoryCode,
\t".zip": CategoryArchive, ".tar": CategoryArchive, ".gz": CategoryArchive,
}

func categorize(ext string) Category {
\tif cat, ok := categoryMap[ext]; ok {
\t\treturn cat
\t}
\treturn CategoryUnknown
}

// Scanner walks a directory tree and indexes files concurrently.
type Scanner struct {
\tmu    sync.Mutex
\tfiles []*FileInfo
}

func (s *Scanner) Scan(root string) ([]*FileInfo, error) {
\tvar wg sync.WaitGroup
\terrs := make(chan error, 1)

\terr := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
\t\tif err != nil || info.IsDir() {
\t\t\treturn err
\t\t}
\t\twg.Add(1)
\t\tgo func() {
\t\t\tdefer wg.Done()
\t\t\tfi, err := Analyze(path)
\t\t\tif err != nil {
\t\t\t\tselect {
\t\t\t\tcase errs <- err:
\t\t\t\tdefault:
\t\t\t\t}
\t\t\t\treturn
\t\t\t}
\t\t\ts.mu.Lock()
\t\t\ts.files = append(s.files, fi)
\t\t\ts.mu.Unlock()
\t\t}()
\t\treturn nil
\t})

\twg.Wait()
\tclose(errs)

\tif err != nil {
\t\treturn nil, err
\t}
\tif e := <-errs; e != nil {
\t\treturn nil, e
\t}
\treturn s.files, nil
}`;

export function createBlobUrl(content: string, mimeType: string = 'text/plain'): string {
  return URL.createObjectURL(new Blob([content], { type: mimeType }));
}

export const sampleFiles: SampleFile[] = [
  { name: 'component.tsx', category: 'Code', content: SAMPLE_TS },
  { name: 'analysis.py', category: 'Code', content: SAMPLE_PY },
  { name: 'indexer.rs', category: 'Code', content: SAMPLE_RUST },
  { name: 'scanner.go', category: 'Code', content: SAMPLE_GO },
  { name: 'data.json', category: 'JSON', content: SAMPLE_JSON },
  { name: 'employees.csv', category: 'CSV', content: SAMPLE_CSV },
  { name: 'README.md', category: 'Markdown', content: SAMPLE_MD },
  { name: 'library.xml', category: 'XML', content: SAMPLE_XML },
  { name: 'landing.html', category: 'HTML', content: SAMPLE_HTML },
  { name: 'logo.svg', category: 'SVG', content: SAMPLE_SVG },
];

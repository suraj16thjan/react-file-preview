import React, { useMemo, Suspense } from 'react';
import { getFileCategory, formatFileSize, type FileCategory } from './utils/fileTypes';
import { baseStyles } from './utils/styles';

const ImagePreview = React.lazy(() => import('./previews/ImagePreview').then(m => ({ default: m.ImagePreview })));
const VideoPreview = React.lazy(() => import('./previews/VideoPreview').then(m => ({ default: m.VideoPreview })));
const AudioPreview = React.lazy(() => import('./previews/AudioPreview').then(m => ({ default: m.AudioPreview })));
const PDFPreview = React.lazy(() => import('./previews/PDFPreview').then(m => ({ default: m.PDFPreview })));
const CodePreview = React.lazy(() => import('./previews/CodePreview').then(m => ({ default: m.CodePreview })));
const TextPreview = React.lazy(() => import('./previews/TextPreview').then(m => ({ default: m.TextPreview })));
const MarkdownPreview = React.lazy(() => import('./previews/MarkdownPreview').then(m => ({ default: m.MarkdownPreview })));
const CSVPreview = React.lazy(() => import('./previews/CSVPreview').then(m => ({ default: m.CSVPreview })));
const JSONPreview = React.lazy(() => import('./previews/JSONPreview').then(m => ({ default: m.JSONPreview })));
const XMLPreview = React.lazy(() => import('./previews/XMLPreview').then(m => ({ default: m.XMLPreview })));
const HTMLPreview = React.lazy(() => import('./previews/HTMLPreview').then(m => ({ default: m.HTMLPreview })));
const SVGPreview = React.lazy(() => import('./previews/SVGPreview').then(m => ({ default: m.SVGPreview })));
const SpreadsheetPreview = React.lazy(() => import('./previews/SpreadsheetPreview').then(m => ({ default: m.SpreadsheetPreview })));
const DocumentPreview = React.lazy(() => import('./previews/DocumentPreview').then(m => ({ default: m.DocumentPreview })));
const ArchivePreview = React.lazy(() => import('./previews/ArchivePreview').then(m => ({ default: m.ArchivePreview })));
const FontPreview = React.lazy(() => import('./previews/FontPreview').then(m => ({ default: m.FontPreview })));
const Model3DPreview = React.lazy(() => import('./previews/Model3DPreview').then(m => ({ default: m.Model3DPreview })));
const EmailPreview = React.lazy(() => import('./previews/EmailPreview').then(m => ({ default: m.EmailPreview })));
const UnknownPreview = React.lazy(() => import('./previews/UnknownPreview').then(m => ({ default: m.UnknownPreview })));

export interface FilePreviewProps {
  url: string;
  fileName: string;
  fileSize?: number;
  content?: string;
  height?: string | number;
  width?: string | number;
  showHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: Error) => void;
  forceType?: FileCategory;
  loadingFallback?: React.ReactNode;
}

const CATEGORY_ICONS: Record<FileCategory, string> = {
  image: '🖼', video: '🎬', audio: '🎵', pdf: '📕', text: '📝',
  code: '💻', markdown: '📑', csv: '📊', spreadsheet: '📊',
  document: '📄', html: '🌐', svg: '🎨', json: '{}', xml: '📐',
  archive: '📦', font: '🔤', model3d: '🧊', email: '✉️', unknown: '📎',
};

const DefaultLoading: React.FC = () => (
  <div style={baseStyles.loading}>Loading preview...</div>
);

export const FilePreview: React.FC<FilePreviewProps> = ({
  url,
  fileName,
  fileSize,
  content,
  height = 500,
  width = '100%',
  showHeader = true,
  className,
  style,
  forceType,
  loadingFallback,
}) => {
  const category = useMemo(
    () => forceType || getFileCategory(fileName),
    [fileName, forceType]
  );

  const renderPreview = () => {
    switch (category) {
      case 'image':
        return <ImagePreview url={url} fileName={fileName} />;
      case 'video':
        return <VideoPreview url={url} fileName={fileName} />;
      case 'audio':
        return <AudioPreview url={url} fileName={fileName} />;
      case 'pdf':
        return <PDFPreview url={url} />;
      case 'code':
        return <CodePreview url={url} fileName={fileName} content={content} />;
      case 'text':
        return <TextPreview url={url} content={content} />;
      case 'markdown':
        return <MarkdownPreview url={url} content={content} />;
      case 'csv':
        return <CSVPreview url={url} content={content} />;
      case 'json':
        return <JSONPreview url={url} content={content} />;
      case 'xml':
        return <XMLPreview url={url} content={content} />;
      case 'html':
        return <HTMLPreview url={url} content={content} />;
      case 'svg':
        return <SVGPreview url={url} content={content} />;
      case 'spreadsheet':
        return <SpreadsheetPreview url={url} fileName={fileName} />;
      case 'document':
        return <DocumentPreview url={url} fileName={fileName} />;
      case 'archive':
        return <ArchivePreview url={url} fileName={fileName} />;
      case 'font':
        return <FontPreview url={url} fileName={fileName} />;
      case 'model3d':
        return <Model3DPreview url={url} fileName={fileName} />;
      case 'email':
        return <EmailPreview url={url} />;
      default:
        return <UnknownPreview url={url} fileName={fileName} fileSize={fileSize} />;
    }
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles.container,
        height,
        width,
        ...style,
      }}
    >
      {showHeader && (
        <div style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            <span>{CATEGORY_ICONS[category]}</span>
            <span style={baseStyles.fileName} title={fileName}>{fileName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {fileSize != null && (
              <span style={baseStyles.fileSize}>{formatFileSize(fileSize)}</span>
            )}
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
              backgroundColor: 'var(--rfp-badge-bg, #edf2f7)',
              color: 'var(--rfp-muted, #718096)', textTransform: 'uppercase',
              fontWeight: 500, letterSpacing: '0.5px',
            }}>
              {category}
            </span>
          </div>
        </div>
      )}
      <div style={baseStyles.body}>
        <Suspense fallback={loadingFallback ?? <DefaultLoading />}>
          {renderPreview()}
        </Suspense>
      </div>
    </div>
  );
};

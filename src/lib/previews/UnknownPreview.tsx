import React from 'react';
import { formatFileSize, getExtension } from '../utils/fileTypes';
import { baseStyles } from '../utils/styles';

interface Props {
  url: string;
  fileName: string;
  fileSize?: number;
}

export const UnknownPreview: React.FC<Props> = ({ url, fileName, fileSize }) => {
  const ext = getExtension(fileName);

  return (
    <div style={{ ...baseStyles.centerContent, flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '64px', opacity: 0.4 }}>📎</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{fileName}</div>
        <div style={{ fontSize: '13px', color: 'var(--rfp-muted, #718096)' }}>
          {ext ? `.${ext.toUpperCase()} file` : 'Unknown file type'}
          {fileSize != null && ` · ${formatFileSize(fileSize)}`}
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--rfp-muted, #718096)', maxWidth: '300px', textAlign: 'center' }}>
        No preview available for this file type
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '8px 20px', borderRadius: '6px', textDecoration: 'none',
          backgroundColor: '#4a90d9', color: '#fff', fontSize: '14px', fontWeight: 500,
        }}
      >
        Open File
      </a>
    </div>
  );
};

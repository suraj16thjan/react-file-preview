import React, { useState } from 'react';
import { baseStyles } from '../utils/styles';

interface Props {
  url: string;
}

export const PDFPreview: React.FC<Props> = ({ url }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div style={baseStyles.error}>
        <div style={baseStyles.errorIcon}>📄</div>
        <div>Unable to preview PDF</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#4a90d9', textDecoration: 'none', fontSize: '14px' }}
        >
          Open in new tab →
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="PDF Preview"
      onError={() => setError(true)}
    />
  );
};

import React from 'react';

interface Props {
  url: string;
  fileName: string;
}

export const VideoPreview: React.FC<Props> = ({ url }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <video
        src={url}
        controls
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
};

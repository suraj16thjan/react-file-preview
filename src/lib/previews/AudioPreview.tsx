import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Props {
  url: string;
  fileName: string;
}

export const AudioPreview: React.FC<Props> = ({ url, fileName }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animRef = useRef<number>(0);
  const ctxRef = useRef<{ analyser: AnalyserNode; dataArray: Uint8Array<ArrayBuffer> } | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const initVisualizer = useCallback(() => {
    if (!audioRef.current || ctxRef.current) return;
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(audioRef.current);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      const dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      ctxRef.current = { analyser, dataArray };
    } catch {
      // Visualizer not supported
    }
  }, []);

  useEffect(() => {
    const draw = () => {
      if (!canvasRef.current || !ctxRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { analyser, dataArray } = ctxRef.current;
      analyser.getByteFrequencyData(dataArray);

      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 64;
      const barWidth = canvas.width / barCount;
      const step = Math.floor(dataArray.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255;
        const barHeight = value * canvas.height * 0.8;
        const x = i * barWidth;
        const hue = 220 + value * 40;
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${0.6 + value * 0.4})`;
        ctx.fillRect(x + 1, canvas.height - barHeight, barWidth - 2, barHeight);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    initVisualizer();
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '24px',
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '500px', height: '120px', borderRadius: '8px' }}
      />
      <div style={{ fontSize: '14px', fontWeight: 500, textAlign: 'center', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fileName}
      </div>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          onClick={seek}
          style={{
            width: '100%', height: '6px', backgroundColor: 'var(--rfp-border, #e2e8f0)',
            borderRadius: '3px', cursor: 'pointer', position: 'relative',
          }}
        >
          <div style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            height: '100%', backgroundColor: '#4a90d9', borderRadius: '3px',
            transition: 'width 0.1s linear',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: 'var(--rfp-muted, #718096)' }}>{formatTime(currentTime)}</span>
          <button
            onClick={togglePlay}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', border: 'none',
              backgroundColor: '#4a90d9', color: '#fff', fontSize: '18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <span style={{ fontSize: '12px', color: 'var(--rfp-muted, #718096)' }}>{formatTime(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />
    </div>
  );
};

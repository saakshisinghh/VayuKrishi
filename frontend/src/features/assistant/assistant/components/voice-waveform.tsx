'use client';

import React, { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  amplitudes: number[];
  isActive: boolean;
  color?: string;
  height?: number;
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  amplitudes,
  isActive,
  color = '#10b981',
  height = 48,
  barCount = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const idlePhaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = height;
      ctx.clearRect(0, 0, w, h);

      const barW = 3;
      const gap = (w - barW * barCount) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        let amp: number;
        if (isActive && amplitudes.length > 0) {
          const idx = Math.floor((i / barCount) * amplitudes.length);
          amp = (amplitudes[idx] ?? 0) * 0.9 + 0.1;
        } else {
          idlePhaseRef.current += 0.01;
          amp = 0.08 + 0.06 * Math.sin(idlePhaseRef.current + i * 0.4);
        }

        const barH = Math.max(3, amp * (h - 8));
        const x = gap + i * (barW + gap);
        const y = (h - barH) / 2;

        const alpha = isActive ? Math.min(1, 0.3 + amp * 0.7) : 0.3;
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [amplitudes, isActive, color, height, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
      aria-label="Voice waveform visualization"
      role="img"
    />
  );
};

export default VoiceWaveform;

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { voiceService } from '../services/voice.service';
import { useVoiceStore } from '../store/voice-store';

interface AudioResponsePlayerProps {
  text: string;
  language: string;
  autoPlay?: boolean;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export const AudioResponsePlayer: React.FC<AudioResponsePlayerProps> = ({
  text,
  language,
  autoPlay = false,
}) => {
  const t = useTranslations('assistant');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);
  const { isSpeaking, setIsSpeaking } = useVoiceStore();

  const speed = SPEEDS[speedIdx];

  const loadAudio = useCallback(async () => {
    if (audioUrl) return;
    setIsLoading(true);
    try {
      const result = await voiceService.generateSpeech({
        text,
        language,
        voice: voiceService.getVoiceForLanguage(language),
        speed,
      });
      setAudioUrl(result.audioUrl);
      return result.audioUrl;
    } catch {
      console.error('Speech generation failed');
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl, text, language, speed]);

  const play = useCallback(async () => {
    const url = audioUrl ?? (await loadAudio());
    if (!url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.playbackRate = speed;
      audioRef.current.ontimeupdate = () => {
        const a = audioRef.current!;
        setProgress((a.currentTime / a.duration) * 100 || 0);
      };
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current!.duration);
      };
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsSpeaking(false);
        setProgress(0);
      };
    }

    audioRef.current.playbackRate = speed;
    await audioRef.current.play();
    setIsPlaying(true);
    setIsSpeaking(true);
  }, [audioUrl, loadAudio, speed, setIsSpeaking]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsSpeaking(false);
  }, [setIsSpeaking]);

  const replay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      play();
    }
  }, [play]);

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  useEffect(() => {
    if (autoPlay) play();
    return () => {
      audioRef.current?.pause();
      setIsSpeaking(false);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-3 py-2">
      {/* Play / Pause */}
      <button
        onClick={isPlaying ? pause : play}
        disabled={isLoading}
        aria-label={isPlaying ? t('audio.pause') : t('audio.play')}
        className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 transition-colors flex items-center justify-center flex-shrink-0"
      >
        {isLoading ? (
          <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Duration */}
      {duration > 0 && (
        <span className="text-xs text-zinc-500 font-mono w-10 text-right flex-shrink-0">
          {voiceService.formatDuration(duration)}
        </span>
      )}

      {/* Replay */}
      <button
        onClick={replay}
        disabled={!audioUrl}
        aria-label={t('audio.replay')}
        className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 transition-colors flex items-center justify-center"
      >
        <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Speed */}
      <button
        onClick={cycleSpeed}
        aria-label={t('audio.speed')}
        className="text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors w-8 text-center"
      >
        {speed}×
      </button>
    </div>
  );
};

export default AudioResponsePlayer;

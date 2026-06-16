'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useVoiceStore } from '../store/voice-store';
import { voiceService } from '../services/voice.service';

interface AudioUploaderProps {
  language: string;
  onTranscript: (text: string) => void;
}

const ACCEPTED_TYPES = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp4'];
const MAX_SIZE_MB = 25;

export const AudioUploader: React.FC<AudioUploaderProps> = ({ language, onTranscript }) => {
  const t = useTranslations('assistant');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isUploading, setIsUploading } = useVoiceStore();

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
        setError(t('voice.invalidFormat'));
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(t('voice.fileTooLarge', { max: MAX_SIZE_MB }));
        return;
      }

      setIsUploading(true);
      try {
        const result = await voiceService.transcribeFile(file, language);
        onTranscript(result.text);
      } catch {
        setError(t('voice.transcriptionFailed'));
      } finally {
        setIsUploading(false);
      }
    },
    [language, onTranscript, setIsUploading, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 transition-all duration-200 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/40'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label={t('voice.uploadAudio')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.ogg,.m4a,audio/*"
          onChange={handleChange}
          className="sr-only"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          {isUploading ? (
            <svg className="animate-spin w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          ) : (
            <svg className={`w-8 h-8 ${isDragging ? 'text-emerald-400' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-300">
              {isUploading ? t('voice.transcribing') : t('voice.dropAudio')}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">MP3 · WAV · OGG · M4A (max {MAX_SIZE_MB}MB)</p>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default AudioUploader;

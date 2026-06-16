'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useVoiceStore } from '../store/voice-store';
import { VoiceWaveform } from './voice-waveform';
import { voiceService } from '../services/voice.service';
import { VoiceRecording } from '../types/voice.types';
import { v4 as uuidv4 } from 'uuid';

interface VoiceRecorderProps {
  language: string;
  onTranscript: (text: string) => void;
  onRecordingComplete?: (recording: VoiceRecording) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  language,
  onTranscript,
  onRecordingComplete,
}) => {
  const t = useTranslations('assistant');
  const {
    recordingState,
    waveformData,
    recordingDuration,
    isTranscribing,
    setRecordingState,
    setWaveformData,
    pushWaveformSample,
    setIsTranscribing,
    setMediaRecorder,
    pushAudioChunk,
    clearAudioChunks,
    setRecordingDuration,
    resetVoice,
    mediaRecorder,
    audioChunks,
  } = useVoiceStore();

  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<number>(0);

  const stopAnalysis = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    analyserRef.current = null;
    streamRef.current = null;
  }, []);

  const startAnalysis = useCallback((stream: MediaStream) => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      pushWaveformSample(avg / 255);
      animRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [pushWaveformSample]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      clearAudioChunks();
      setRecordingDuration(0);

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) pushAudioChunk(e.data);
      };

      mr.start(100);
      setMediaRecorder(mr);
      setRecordingState('recording');
      startAnalysis(stream);

      timerRef.current = setInterval(() => {
        setRecordingDuration(useVoiceStore.getState().recordingDuration + 1);
      }, 1000);
    } catch {
      console.error('Microphone access denied');
    }
  }, [clearAudioChunks, setRecordingDuration, pushAudioChunk, setMediaRecorder, setRecordingState, startAnalysis]);

  const pauseRecording = useCallback(() => {
    mediaRecorder?.pause();
    setRecordingState('paused');
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, [mediaRecorder, setRecordingState]);

  const resumeRecording = useCallback(() => {
    mediaRecorder?.resume();
    setRecordingState('recording');
    if (streamRef.current) startAnalysis(streamRef.current);
    timerRef.current = setInterval(() => {
      setRecordingDuration(useVoiceStore.getState().recordingDuration + 1);
    }, 1000);
  }, [mediaRecorder, setRecordingState, startAnalysis, setRecordingDuration]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorder) return;
    stopAnalysis();
    setRecordingState('stopped');

    await new Promise<void>((resolve) => {
      mediaRecorder.onstop = () => resolve();
      mediaRecorder.stop();
    });

    const chunks = useVoiceStore.getState().audioChunks;
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const recording: VoiceRecording = {
      id: uuidv4(),
      blob,
      duration: useVoiceStore.getState().recordingDuration,
      format: 'webm' as any,
      sizeBytes: blob.size,
      language,
      createdAt: new Date(),
    };

    onRecordingComplete?.(recording);
    setRecordingState('processing');
    setIsTranscribing(true);

    try {
      const result = await voiceService.transcribeAudio(recording, language);
      onTranscript(result.text);
    } catch {
      onTranscript('');
    } finally {
      setIsTranscribing(false);
      resetVoice();
    }
  }, [
    mediaRecorder,
    stopAnalysis,
    setRecordingState,
    language,
    onRecordingComplete,
    setIsTranscribing,
    onTranscript,
    resetVoice,
  ]);

  useEffect(() => () => stopAnalysis(), [stopAnalysis]);

  const isRecording = recordingState === 'recording';
  const isPaused = recordingState === 'paused';
  const isActive = isRecording || isPaused;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Waveform */}
      {isActive && (
        <div className="w-full px-2">
          <VoiceWaveform
            amplitudes={waveformData}
            isActive={isRecording}
            color={isRecording ? '#10b981' : '#6366f1'}
            height={48}
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1 px-1">
            <span>{isRecording ? t('voice.recording') : t('voice.paused')}</span>
            <span className="font-mono">{voiceService.formatDuration(recordingDuration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {recordingState === 'idle' && (
          <button
            onClick={startRecording}
            aria-label={t('voice.startRecording')}
            className="group relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 flex items-center justify-center shadow-lg shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20 group-hover:opacity-30" />
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1zm-7 7a1 1 0 0 1 2 0 5 5 0 0 0 10 0 1 1 0 0 1 2 0 7 7 0 0 1-6 6.93V21h3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3v-2.07A7 7 0 0 1 5 11z" />
            </svg>
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={pauseRecording}
              aria-label={t('voice.pauseRecording')}
              className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
            <button
              onClick={stopRecording}
              aria-label={t('voice.stopRecording')}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/20"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              onClick={resumeRecording}
              aria-label={t('voice.resumeRecording')}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              onClick={stopRecording}
              aria-label={t('voice.stopRecording')}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          </>
        )}

        {(recordingState === 'processing' || isTranscribing) && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg className="animate-spin w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            {t('voice.transcribing')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;

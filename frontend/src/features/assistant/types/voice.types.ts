export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped' | 'processing';

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a' | 'webm';

export interface VoiceRecording {
  id: string;
  blob: Blob;
  duration: number;
  format: AudioFormat;
  sizeBytes: number;
  transcript?: string;
  language: string;
  createdAt: Date;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  language: string;
  confidence: number;
  words?: TranscriptionWord[];
  duration: number;
}

export interface TranscriptionWord {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface SpeechGenerationRequest {
  text: string;
  language: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface SpeechGenerationResult {
  id: string;
  audioUrl: string;
  duration: number;
  language: string;
  text: string;
}

export interface WaveformData {
  amplitudes: number[];
  sampleRate: number;
  duration: number;
}

export interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  volume: number;
  autoPlay: boolean;
}

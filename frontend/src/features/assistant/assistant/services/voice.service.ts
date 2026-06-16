import {
  VoiceRecording,
  TranscriptionResult,
  SpeechGenerationRequest,
  SpeechGenerationResult,
  AudioFormat,
} from '../types/voice.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export const voiceService = {
  async transcribeAudio(
    recording: VoiceRecording,
    language: string
  ): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('audio', recording.blob, `recording.${recording.format}`);
    formData.append('language', language);
    formData.append('format', recording.format);

    const res = await fetch(`${API_BASE}/voice/transcribe`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Transcription failed: ${res.statusText}`);
    return res.json();
  },

  async transcribeFile(
    file: File,
    language: string
  ): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', language);

    const res = await fetch(`${API_BASE}/voice/transcribe`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Transcription failed: ${res.statusText}`);
    return res.json();
  },

  async generateSpeech(
    req: SpeechGenerationRequest
  ): Promise<SpeechGenerationResult> {
    const res = await fetch(`${API_BASE}/voice/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Speech generation failed: ${res.statusText}`);
    return res.json();
  },

  getSupportedFormats(): AudioFormat[] {
    return ['mp3', 'wav', 'ogg', 'm4a', 'webm'];
  },

  getAcceptedMimeTypes(): string {
    return 'audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/mp4,audio/webm';
  },

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  getVoiceForLanguage(language: string): string {
    const voiceMap: Record<string, string> = {
      en: 'en-IN-Standard-A',
      mr: 'mr-IN-Standard-A',
      hi: 'hi-IN-Standard-A',
      gu: 'gu-IN-Standard-A',
      ta: 'ta-IN-Standard-A',
      kn: 'kn-IN-Standard-A',
    };
    return voiceMap[language] ?? voiceMap['en'];
  },
};

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RecordingState, VoiceRecording, WaveformData } from '../types/voice.types';

interface VoiceState {
  recordingState: RecordingState;
  currentRecording: VoiceRecording | null;
  waveformData: number[];
  isTranscribing: boolean;
  isSpeaking: boolean;
  currentAudioUrl: string | null;
  playbackSpeed: number;
  volume: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  recordingDuration: number;
  isUploading: boolean;

  setRecordingState: (state: RecordingState) => void;
  setCurrentRecording: (rec: VoiceRecording | null) => void;
  setWaveformData: (data: number[]) => void;
  pushWaveformSample: (amplitude: number) => void;
  setIsTranscribing: (v: boolean) => void;
  setIsSpeaking: (v: boolean) => void;
  setCurrentAudioUrl: (url: string | null) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (vol: number) => void;
  setMediaRecorder: (mr: MediaRecorder | null) => void;
  pushAudioChunk: (chunk: Blob) => void;
  clearAudioChunks: () => void;
  setRecordingDuration: (d: number) => void;
  setIsUploading: (v: boolean) => void;
  resetVoice: () => void;
}

export const useVoiceStore = create<VoiceState>()(
  devtools((set) => ({
    recordingState: 'idle',
    currentRecording: null,
    waveformData: [],
    isTranscribing: false,
    isSpeaking: false,
    currentAudioUrl: null,
    playbackSpeed: 1,
    volume: 1,
    mediaRecorder: null,
    audioChunks: [],
    recordingDuration: 0,
    isUploading: false,

    setRecordingState: (state) => set({ recordingState: state }),
    setCurrentRecording: (rec) => set({ currentRecording: rec }),
    setWaveformData: (data) => set({ waveformData: data }),
    pushWaveformSample: (amplitude) =>
      set((state) => ({
        waveformData: [...state.waveformData.slice(-79), amplitude],
      })),
    setIsTranscribing: (v) => set({ isTranscribing: v }),
    setIsSpeaking: (v) => set({ isSpeaking: v }),
    setCurrentAudioUrl: (url) => set({ currentAudioUrl: url }),
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    setVolume: (vol) => set({ volume: vol }),
    setMediaRecorder: (mr) => set({ mediaRecorder: mr }),
    pushAudioChunk: (chunk) =>
      set((state) => ({ audioChunks: [...state.audioChunks, chunk] })),
    clearAudioChunks: () => set({ audioChunks: [] }),
    setRecordingDuration: (d) => set({ recordingDuration: d }),
    setIsUploading: (v) => set({ isUploading: v }),
    resetVoice: () =>
      set({
        recordingState: 'idle',
        currentRecording: null,
        waveformData: [],
        isTranscribing: false,
        audioChunks: [],
        recordingDuration: 0,
      }),
  }))
);

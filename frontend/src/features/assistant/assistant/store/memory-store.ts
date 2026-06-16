import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FarmerMemory } from '../types/memory.types';

interface MemoryState {
  memory: FarmerMemory | null;
  isLoaded: boolean;
  isPanelOpen: boolean;
  lastSynced: Date | null;

  setMemory: (memory: FarmerMemory) => void;
  updateMemory: (updates: Partial<FarmerMemory>) => void;
  setIsLoaded: (v: boolean) => void;
  setIsPanelOpen: (v: boolean) => void;
  setLastSynced: (date: Date) => void;
  clearMemory: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  devtools(
    persist(
      (set) => ({
        memory: null,
        isLoaded: false,
        isPanelOpen: true,
        lastSynced: null,

        setMemory: (memory) => set({ memory, isLoaded: true }),
        updateMemory: (updates) =>
          set((state) => ({
            memory: state.memory ? { ...state.memory, ...updates } : null,
          })),
        setIsLoaded: (v) => set({ isLoaded: v }),
        setIsPanelOpen: (v) => set({ isPanelOpen: v }),
        setLastSynced: (date) => set({ lastSynced: date }),
        clearMemory: () =>
          set({ memory: null, isLoaded: false, lastSynced: null }),
      }),
      {
        name: 'vayukrishi-memory',
        partialize: (state) => ({
          isPanelOpen: state.isPanelOpen,
        }),
      }
    )
  )
);

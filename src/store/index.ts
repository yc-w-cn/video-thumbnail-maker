import { create } from 'zustand';

interface DependencyState {
  ffmpeg: boolean;
  magick: boolean;
}

interface Settings {
  thumbnails: number;
  width: number;
  output: string;
  cols: number;
  useVideoDir: boolean;
}

interface ProcessState {
  isProcessing: boolean;
  progress: number;
  currentFile: string | null;
}

interface AppState {
  dependencies: DependencyState | null;
  settings: Settings;
  processState: ProcessState;
  setDependencies: (deps: DependencyState) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentFile: (file: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dependencies: null,
  settings: {
    thumbnails: 20,
    width: 200,
    output: '~/Pictures',
    cols: 5,
    useVideoDir: true,
  },
  processState: {
    isProcessing: false,
    progress: 0,
    currentFile: null,
  },
  setDependencies: (deps) => set({ dependencies: deps }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  setProcessing: (isProcessing) =>
    set((state) => ({
      processState: { ...state.processState, isProcessing },
    })),
  setProgress: (progress) =>
    set((state) => ({
      processState: { ...state.processState, progress },
    })),
  setCurrentFile: (currentFile) =>
    set((state) => ({
      processState: { ...state.processState, currentFile },
    })),
}));
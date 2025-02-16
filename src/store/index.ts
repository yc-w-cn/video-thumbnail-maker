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

const STORAGE_KEY = 'video-thumbnail-settings';

const loadSettingsFromStorage = (): Partial<Settings> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Failed to load settings:', e);
    return {};
  }
};

const saveSettingsToStorage = (settings: Settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const useAppStore = create<AppState>((set) => ({
  settings: {
    thumbnails: 20,
    width: 200,
    output: '~/Pictures',
    cols: 5,
    useVideoDir: true,
    ...loadSettingsFromStorage(),
  },
  processState: {
    isProcessing: false,
    progress: 0,
    currentFile: null,
  },
  dependencies: null,
  setDependencies: (deps) => set({ dependencies: deps }),
  updateSettings: (newSettings) =>
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      saveSettingsToStorage(updatedSettings);
      return { settings: updatedSettings };
    }),
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

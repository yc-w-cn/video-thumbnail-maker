import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

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
  // 修改生成模式配置为多选
  generateThumbnail: boolean;
  generateGif: boolean;
  // 添加GIF动画配置
  gifFPS: number;
  gifLoop: number;
  gifDelay: number;
}

interface ProcessState {
  isProcessing: boolean;
  isPaused: boolean;
  progress: number;
  currentFile: string | null;
}

// 新增处理列表项接口
interface ProcessingItem {
  id: string;
  filePath: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number; // 添加进度字段
  outputPath?: string;
  // 添加生成模式标识
  generateMode?: 'thumbnail' | 'gif' | 'both';
  // 添加处理类型标识
  processType?: 'thumbnail' | 'gif';
}

interface AppState {
  dependencies: DependencyState | null;
  settings: Settings;
  processState: ProcessState;
  // 新增处理列表状态
  processingList: ProcessingItem[];
  showProcessingList: boolean;
  setDependencies: (deps: DependencyState) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setProcessing: (isProcessing: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentFile: (file: string | null) => void;
  // 新增处理列表相关方法
  setShowProcessingList: (show: boolean) => void;
  addToProcessingList: (file: string) => void;
  addMultipleToProcessingList: (files: string[]) => void;
  addMultipleToProcessingListWithCheck: (files: string[]) => void;
  removeFromProcessingList: (id: string) => void;
  clearProcessingList: () => void;
  updateProcessingItemStatus: (
    id: string,
    status: ProcessingItem['status'],
  ) => void;
  // 更新处理项进度
  updateProcessingItemProgress: (id: string, progress: number) => void;
  setProcessingList: (list: ProcessingItem[]) => void;
  // 检查文件是否已处理的方法
  checkIfFileProcessed: (filePath: string) => Promise<boolean>;
  // 更新处理项状态和输出路径
  updateProcessingItemStatusAndOutput: (
    id: string,
    status: ProcessingItem['status'],
    outputPath?: string,
  ) => void;
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
    // 修改生成模式默认值
    generateThumbnail: true,
    generateGif: false,
    // 添加GIF动画配置默认值
    gifFPS: 10,
    gifLoop: 0, // 0表示无限循环
    gifDelay: 10, // 延迟时间（1/100秒为单位）
    ...loadSettingsFromStorage(),
  },
  processState: {
    isProcessing: false,
    isPaused: false,
    progress: 0,
    currentFile: null,
  },
  // 初始化处理列表状态
  processingList: [],
  showProcessingList: false,
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
  setPaused: (isPaused) =>
    set((state) => ({
      processState: { ...state.processState, isPaused },
    })),
  setProgress: (progress) =>
    set((state) => ({
      processState: { ...state.processState, progress },
    })),
  setCurrentFile: (currentFile) =>
    set((state) => ({
      processState: { ...state.processState, currentFile },
    })),
  // 处理列表相关方法实现
  setShowProcessingList: (show) => set({ showProcessingList: show }),
  addToProcessingList: (filePath) =>
    set((state) => {
      // 检查是否已存在
      const exists = state.processingList.some(
        (item) => item.filePath === filePath,
      );
      if (exists) return state;

      // 提取文件名
      const fileName = filePath.split('/').pop() || filePath;

      const newItem: ProcessingItem = {
        id: Date.now().toString(),
        filePath,
        fileName: fileName || '',
        status: 'pending',
        // 添加生成模式信息
        generateMode:
          state.settings.generateThumbnail && state.settings.generateGif
            ? 'both'
            : state.settings.generateThumbnail
              ? 'thumbnail'
              : 'gif',
      };

      return {
        processingList: [...state.processingList, newItem],
      };
    }),
  addMultipleToProcessingList: (filePaths: string[]) =>
    set((state) => {
      const newItems: ProcessingItem[] = [];

      for (const filePath of filePaths) {
        // 检查是否已存在
        const exists = state.processingList.some(
          (item) => item.filePath === filePath,
        );
        if (exists) continue;

        // 提取文件名
        const fileName = filePath.split('/').pop() || filePath;

        const newItem: ProcessingItem = {
          id: `${Date.now()}-${Math.random()}`,
          filePath,
          fileName: fileName || '',
          status: 'pending',
          // 添加生成模式信息
          generateMode:
            state.settings.generateThumbnail && state.settings.generateGif
              ? 'both'
              : state.settings.generateThumbnail
                ? 'thumbnail'
                : 'gif',
        };

        newItems.push(newItem);
      }

      return {
        processingList: [...state.processingList, ...newItems],
      };
    }),
  // 异步添加多个文件到处理列表（带处理状态检查）
  addMultipleToProcessingListWithCheck: (filePaths: string[]) =>
    set((state) => {
      const newItems: ProcessingItem[] = [];

      for (const filePath of filePaths) {
        // 检查是否已存在
        const exists = state.processingList.some(
          (item) => item.filePath === filePath,
        );
        if (exists) continue;

        // 提取文件名
        const fileName = filePath.split('/').pop() || filePath;

        // 创建处理项
        const newItem: ProcessingItem = {
          id: `${Date.now()}-${Math.random()}`,
          filePath,
          fileName: fileName || '',
          status: 'pending', // 默认状态为待处理
          // 添加生成模式信息
          generateMode:
            state.settings.generateThumbnail && state.settings.generateGif
              ? 'both'
              : state.settings.generateThumbnail
                ? 'thumbnail'
                : 'gif',
        };

        newItems.push(newItem);

        // 异步检查文件是否已处理
        state.checkIfFileProcessed(filePath).then((isProcessed) => {
          if (isProcessed) {
            // 如果已处理，更新状态为已完成
            state.updateProcessingItemStatus(newItem.id, 'completed');
          }
        });
      }

      return {
        processingList: [...state.processingList, ...newItems],
      };
    }),
  removeFromProcessingList: (id) =>
    set((state) => ({
      processingList: state.processingList.filter((item) => item.id !== id),
    })),
  clearProcessingList: () => set({ processingList: [] }),
  updateProcessingItemStatus: (id, status) =>
    set((state) => ({
      processingList: state.processingList.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    })),
  // 更新处理项进度的实现
  updateProcessingItemProgress: (id, progress) =>
    set((state) => ({
      processingList: state.processingList.map((item) =>
        item.id === id ? { ...item, progress } : item,
      ),
    })),
  updateProcessingItemStatusAndOutput: (id, status, outputPath) =>
    set((state) => ({
      processingList: state.processingList.map((item) =>
        item.id === id ? { ...item, status, outputPath } : item,
      ),
    })),
  setProcessingList: (processingList) => set({ processingList }),
  // 检查文件是否已处理的实现
  checkIfFileProcessed: async (filePath: string) => {
    try {
      const result = await invoke<boolean>('check_file_processed', {
        videoPath: filePath,
      });
      return result;
    } catch (error) {
      console.error('Error checking if file is processed:', error);
      return false;
    }
  },
}));

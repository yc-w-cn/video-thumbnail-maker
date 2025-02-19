import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      error: {
        title: 'An Error Occurred',
        description: 'Something went wrong while rendering the application.',
        retry: 'Retry',
      },
      app: {
        title: 'Video Thumbnail Maker',
        description: 'A simple and easy-to-use video thumbnail generator',
      },
      settings: {
        output: {
          title: 'Output Location',
          select: 'Select Output Folder',
          current: 'Current Output Folder',
        },
        video: {
          title: 'Video Settings',
          rows: 'Rows',
          columns: 'Columns',
          quality: 'Quality',
          width: 'Width',
          height: 'Height',
          thumbnails: 'Number of Thumbnails',
          cols: 'Columns per Row',
        },
      },
      actions: {
        process: 'Generate Thumbnails',
        dropzone: {
          title: 'Drop video files here',
          description: 'or click to select files',
        },
      },
      status: {
        checking: 'Checking dependencies...',
        ready: 'Ready',
        processing: 'Processing...',
        complete: 'Complete',
        error: 'Error',
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        toggle: {
          light: 'Switch to Light Mode',
          dark: 'Switch to Dark Mode',
        },
      },
      language: {
        en: 'English',
        zh: '中文',
        toggle: 'Switch Language',
      },
      dependencies: {
        title: 'System Dependencies Check',
      },
    },
  },
  zh: {
    translation: {
      error: {
        title: 'An Error Occurred',
        description: 'Something went wrong while rendering the application.',
        retry: 'Retry',
      },
      app: {
        title: '视频缩略图生成器',
        description: '一个简单易用的视频缩略图生成工具',
      },
      settings: {
        output: {
          title: '输出位置',
          select: '选择输出文件夹',
          current: '当前输出文件夹：',
        },
        video: {
          title: '视频设置',
          rows: '行数',
          columns: '列数',
          quality: '质量',
          width: '宽度',
          height: '高度',
          thumbnails: '截图数量',
          cols: '每行数量',
        },
      },
      actions: {
        process: '生成缩略图',
        dropzone: {
          title: '将视频文件拖放到此处',
          description: '或点击选择文件',
        },
      },
      status: {
        checking: '正在检查依赖...',
        ready: '就绪',
        processing: '处理中...',
        complete: '完成',
        error: '错误',
      },
      theme: {
        light: '浅色',
        dark: '深色',
        system: '系统',
        toggle: {
          light: '切换到浅色模式',
          dark: '切换到深色模式',
        },
      },
      language: {
        en: 'English',
        zh: '中文',
        toggle: '切换语言',
      },
      dependencies: {
        title: '系统依赖检查',
      },
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('locale') || 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
  debug: import.meta.env.DEV,
});

export default i18next;
